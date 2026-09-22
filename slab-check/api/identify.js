import Anthropic from '@anthropic-ai/sdk';
import { cors, send, fail, readJson, splitImage } from './_util.js';
import { search, rankMatches, fetchProduct, LookupError } from './_pricecharting.js';

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

const SYSTEM = `You identify Pokemon trading cards from a photo taken at a live auction. Conditions are bad: glare, angles, plastic sleeves, slab cases, motion blur.

Rules:
- Report only what you can actually see. Never invent a set, a card number or a grade.
- If the card is unreadable, set readable to false and say exactly what is wrong in "problem".
- "number" is the collector number printed on the card, digits only or the printed form (e.g. "4", "058", "SV49", "TG12"). Do not include the set total.
- Graded slabs: read the label across the top. Company is PSA, BGS, CGC, SGC, ACE or TAG. Grade is the printed number ("10", "9.5", "8"). Set graded to true.
- Raw cards: judge centering, corners, edges and surface from the photo and give a PSA grade RANGE. Be conservative. A photo cannot show every flaw, so widen the range and lower confidence when you are unsure. psa_low must be less than or equal to psa_high.
- For a graded slab, set psa_low and psa_high to the slab grade rounded down to a whole number, and leave the four condition notes empty.
- search_query is what you would type into pricecharting.com: card name, set name, card number, plus a variant word only when it changes the product (e.g. "1st edition", "shadowless", "reverse holo"). No punctuation beyond spaces and #.
- alt_queries are up to 3 other phrasings in case the first misses (e.g. drop the set, drop the number, use the Japanese set name).`;

const TOOL = {
  name: 'report_card',
  description: 'Report everything read off the card photo.',
  strict: true,
  input_schema: {
    type: 'object',
    properties: {
      readable: { type: 'boolean', description: 'False if the card cannot be identified from this photo.' },
      problem: { type: 'string', description: 'If unreadable, exactly what is wrong. Otherwise empty.' },
      name: { type: 'string', description: 'Card name as printed, e.g. "Charizard ex".' },
      set: { type: 'string', description: 'Set name, e.g. "Base Set", "Obsidian Flames". Empty if unknown.' },
      number: { type: 'string', description: 'Collector number as printed. Empty if unknown.' },
      variants: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['1st Edition', 'Shadowless', 'Reverse Holo', 'Holo', 'Full Art', 'Alt Art', 'Promo', 'Secret Rare', 'Illustration Rare', 'Unlimited', 'None'],
        },
      },
      language: { type: 'string', description: 'English, Japanese, Korean, German, etc.' },
      graded: { type: 'boolean', description: 'True only if the card is sealed in a grading slab.' },
      slab_company: { type: 'string', enum: ['PSA', 'BGS', 'CGC', 'SGC', 'ACE', 'TAG', 'Other', ''] },
      slab_grade: { type: 'string', description: 'Printed grade, e.g. "10", "9.5". Empty if not graded.' },
      cert_number: { type: 'string', description: 'Slab certification number if legible. Otherwise empty.' },
      centering: { type: 'string', description: 'Short note on centering. Empty for graded slabs.' },
      corners: { type: 'string', description: 'Short note on corners. Empty for graded slabs.' },
      edges: { type: 'string', description: 'Short note on edges. Empty for graded slabs.' },
      surface: { type: 'string', description: 'Short note on surface. Empty for graded slabs.' },
      psa_low: { type: 'integer', enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      psa_high: { type: 'integer', enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      grade_notes: { type: 'string', description: 'One or two sentences on what drives the range.' },
      confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
      search_query: { type: 'string' },
      alt_queries: { type: 'array', items: { type: 'string' } },
    },
    required: [
      'readable', 'problem', 'name', 'set', 'number', 'variants', 'language', 'graded',
      'slab_company', 'slab_grade', 'cert_number', 'centering', 'corners', 'edges', 'surface',
      'psa_low', 'psa_high', 'grade_notes', 'confidence', 'search_query', 'alt_queries',
    ],
    additionalProperties: false,
  },
};

function toCard(v) {
  const variants = (v.variants || []).filter((x) => x && x !== 'None');
  return {
    name: v.name || '',
    set: v.set || '',
    number: v.number || '',
    variant: variants.join(', '),
    variants,
    language: v.language || '',
    graded: !!v.graded,
    slab: v.graded && v.slab_company ? { company: v.slab_company, grade: v.slab_grade, cert: v.cert_number || null } : null,
    condition: v.graded
      ? null
      : {
          centering: v.centering || '',
          corners: v.corners || '',
          edges: v.edges || '',
          surface: v.surface || '',
          psaLow: v.psa_low,
          psaHigh: v.psa_high,
          notes: v.grade_notes || '',
          confidence: v.confidence,
        },
    confidence: v.confidence,
    searchQuery: v.search_query || [v.name, v.set, v.number && `#${v.number}`].filter(Boolean).join(' '),
    altQueries: (v.alt_queries || []).filter(Boolean).slice(0, 3),
  };
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return fail(res, 405, 'POST an image to this endpoint.', 'request');

  if (!process.env.ANTHROPIC_API_KEY) {
    return fail(res, 500, 'ANTHROPIC_API_KEY is not set on the server. Add it in Vercel project settings and redeploy.', 'config');
  }

  let body;
  try {
    body = await readJson(req);
  } catch {
    return fail(res, 400, 'Request body was not valid JSON.', 'request');
  }

  const img = splitImage(body.image, body.mediaType);
  if (!img) return fail(res, 400, 'No photo in the request.', 'request');
  if (!/^image\/(jpeg|png|webp|gif)$/.test(img.mediaType)) {
    return fail(res, 400, `Unsupported image type "${img.mediaType}". Use JPEG, PNG, WebP or GIF.`, 'request');
  }
  // Anthropic caps a single image at 5 MB of base64.
  if (img.data.length > 5 * 1024 * 1024) {
    return fail(res, 413, 'Photo is too large. Retake it or let the app shrink it first.', 'request');
  }

  // --- step 1: read the card -------------------------------------------
  let card;
  try {
    const client = new Anthropic();
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      system: SYSTEM,
      tools: [TOOL],
      tool_choice: { type: 'tool', name: 'report_card' },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: img.mediaType, data: img.data } },
            { type: 'text', text: 'Identify this Pokemon card and report it with the report_card tool.' },
          ],
        },
      ],
    });

    if (msg.stop_reason === 'refusal') {
      return fail(res, 422, 'Claude declined to read this image.', 'identify');
    }
    const block = msg.content.find((b) => b.type === 'tool_use');
    if (!block) {
      return fail(res, 502, 'Claude did not return card details for this photo. Retake it and try again.', 'identify');
    }
    card = toCard(block.input);
  } catch (err) {
    const status = err?.status ?? 502;
    const detail = err?.error?.error?.message || err?.message || 'unknown error';
    return fail(res, status === 401 ? 500 : status, `Card reading failed: ${detail}`, 'identify');
  }

  if (!card.name) {
    return send(res, 200, {
      ok: false,
      stage: 'identify',
      error: card.searchQuery ? 'Could not read a card name from this photo.' : 'Could not read this card.',
      card,
      detail: null,
    });
  }

  // --- step 2: price it -------------------------------------------------
  const queries = [card.searchQuery, ...card.altQueries].filter(Boolean);
  let matches = [];
  let lastError = null;

  for (const q of queries) {
    try {
      const r = await search(q);
      if (r.directProduct) {
        return send(res, 200, {
          ok: true,
          card,
          product: r.directProduct,
          matches: rankMatches(r.matches, card),
          query: q,
        });
      }
      matches = rankMatches(r.matches, card);
      if (matches.length) break;
    } catch (err) {
      lastError = err;
      if (!(err instanceof LookupError) || err.status !== 404) break;
    }
  }

  if (!matches.length) {
    return send(res, 200, {
      ok: false,
      stage: 'price',
      error: lastError
        ? lastError.message
        : `PriceCharting has no product matching "${queries[0]}". Try the manual search.`,
      card,
      matches: [],
    });
  }

  try {
    const product = await fetchProduct(matches[0].url);
    return send(res, 200, { ok: true, card, product, matches, query: queries[0] });
  } catch (err) {
    return send(res, 200, {
      ok: false,
      stage: 'price',
      error: err.message,
      card,
      matches,
      detail: err.detail ?? null,
    });
  }
}
