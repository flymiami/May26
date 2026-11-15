// PriceCharting scraper. No API token required.
//
// Flow: /search-products?q=...&type=prices -> product page -> #price_data table.
// PriceCharting sometimes 302s a single-hit search straight to the product page,
// so every fetch follows redirects and we detect which kind of page we landed on.
//
// The price table row headers are exactly:
//   Ungraded | Grade 7 | Grade 8 | Grade 9 | Grade 9.5 | PSA 10
// Grade 8 and Grade 9 blend PSA, BGS and CGC sales (PriceCharting's own note).

export const BASE = 'https://www.pricecharting.com';

export const LADDER_LABELS = ['Ungraded', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 9.5', 'PSA 10'];

// Fallback only: PriceCharting's stable element ids for the six card columns.
const ID_TO_LABEL = {
  used_price: 'Ungraded',
  complete_price: 'Grade 7',
  new_price: 'Grade 8',
  graded_price: 'Grade 9',
  box_only_price: 'Grade 9.5',
  manual_only_price: 'PSA 10',
};

const UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

class LookupError extends Error {
  constructor(message, status = 502, detail = null) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}
export { LookupError };

async function get(url) {
  let res;
  try {
    res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
  } catch (err) {
    throw new LookupError(
      `Could not reach pricecharting.com (${err.message}). Check the network and try again.`,
      504,
      url
    );
  }
  if (!res.ok) {
    throw new LookupError(
      `pricecharting.com returned HTTP ${res.status} for ${url}`,
      res.status === 404 ? 404 : 502,
      url
    );
  }
  const html = await res.text();
  if (!html || html.length < 200) {
    throw new LookupError('pricecharting.com returned an empty page.', 502, url);
  }
  return { html, finalUrl: res.url || url };
}

// --- tiny HTML helpers (no DOM parser dependency) ------------------------

const stripTags = (s) => s.replace(/<[^>]*>/g, ' ');

function decode(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

const text = (s) => decode(stripTags(s)).replace(/\s+/g, ' ').trim();

// Pull the inner HTML of the element carrying a given id, brace-matching on its tag.
function sliceById(html, id) {
  const open = new RegExp(`<([a-z]+)[^>]*\\bid=["']${id}["'][^>]*>`, 'i');
  const m = open.exec(html);
  if (!m) return null;
  const tag = m[1];
  const start = m.index + m[0].length;
  const re = new RegExp(`</?${tag}\\b`, 'gi');
  re.lastIndex = start;
  let depth = 1;
  let hit;
  while ((hit = re.exec(html))) {
    depth += hit[0][1] === '/' ? -1 : 1;
    if (depth === 0) return html.slice(start, hit.index);
  }
  return html.slice(start);
}

function parseMoney(raw) {
  if (!raw) return null;
  const m = /\$\s*([\d,]+(?:\.\d{1,2})?)/.exec(raw);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

// "volume: 3 sales per week" / "2 sales / week" / "no recent sales"
function parseVolume(cellText) {
  const m =
    /((?:volume\s*:?\s*)?[\d.,]+\s*sales?\s*(?:per|\/)\s*(?:day|week|month|year))/i.exec(cellText) ||
    /(no\s+recent\s+sales)/i.exec(cellText);
  return m ? m[1].replace(/^volume\s*:?\s*/i, '').trim() : null;
}

function labelIn(cellText) {
  // Longest first so "Grade 9.5" never matches as "Grade 9".
  for (const label of ['Grade 9.5', 'PSA 10', 'Grade 9', 'Grade 8', 'Grade 7', 'Ungraded']) {
    if (new RegExp(`(^|[^\\d.])${label.replace('.', '\\.')}([^\\d]|$)`, 'i').test(cellText)) {
      return label;
    }
  }
  return null;
}

// --- price table ---------------------------------------------------------

export function parsePriceTable(html) {
  const region = sliceById(html, 'price_data') || sliceById(html, 'full-prices') || html;
  const out = {};

  // Strategy 1 (primary): every <td>, matched by the visible header label.
  for (const cell of region.match(/<td\b[\s\S]*?<\/td>/gi) || []) {
    const t = text(cell);
    const label = labelIn(t);
    if (!label || out[label]) continue;
    const price = parseMoney(t);
    if (price === null) continue;
    out[label] = { price, volume: parseVolume(t) };
  }

  // Strategy 2: PriceCharting's element ids, for any label still missing.
  for (const [id, label] of Object.entries(ID_TO_LABEL)) {
    if (out[label]) continue;
    const inner = sliceById(region, id) ?? sliceById(html, id);
    if (inner === null) continue;
    const t = text(inner);
    const price = parseMoney(t);
    if (price === null) continue;
    out[label] = { price, volume: parseVolume(t) };
  }

  // Strategy 3: a header row of labels above a row of prices.
  if (Object.keys(out).length === 0) {
    const rows = region.match(/<tr\b[\s\S]*?<\/tr>/gi) || [];
    for (let i = 0; i < rows.length - 1; i++) {
      const heads = (rows[i].match(/<t[hd]\b[\s\S]*?<\/t[hd]>/gi) || []).map((c) => labelIn(text(c)));
      if (heads.filter(Boolean).length < 2) continue;
      const vals = (rows[i + 1].match(/<t[hd]\b[\s\S]*?<\/t[hd]>/gi) || []).map((c) => text(c));
      heads.forEach((label, j) => {
        if (!label || out[label] || !vals[j]) return;
        const price = parseMoney(vals[j]);
        if (price !== null) out[label] = { price, volume: parseVolume(vals[j]) };
      });
      break;
    }
  }

  return LADDER_LABELS.map((label) => ({
    label,
    price: out[label]?.price ?? null,
    volume: out[label]?.volume ?? null,
  }));
}

// --- product page --------------------------------------------------------

function parseTitle(html) {
  const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  const raw = h1 ? text(h1[1]) : text((/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html) || [, ''])[1]);
  return raw.replace(/\s*\|\s*Pricecharting.*$/i, '').trim();
}

function parseSet(html) {
  // The breadcrumb / console line under the title carries the set name.
  const m =
    /<a[^>]+href=["']\/console\/([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i.exec(html) ||
    /id=["']product_name["'][\s\S]{0,400}?<a[^>]*>([\s\S]*?)<\/a>/i.exec(html);
  if (!m) return null;
  return text(m[2] ?? m[1]);
}

// "Charizard #4" / "Pikachu VMAX #044" -> "4" / "044"
function parseNumber(title) {
  const m = /#\s*([A-Za-z]*\d+[A-Za-z]*(?:\/\d+)?)/.exec(title);
  return m ? m[1] : null;
}

const isProductPage = (html, url) =>
  /\/game\//.test(url) || /id=["']price_data["']/i.test(html) || /id=["']product_name["']/i.test(html);

export function productIdFromUrl(url) {
  const m = /\/game\/([^/?#]+)\/([^/?#]+)/.exec(url);
  return m ? `${m[1]}/${m[2]}` : url;
}

export async function fetchProduct(url) {
  const abs = url.startsWith('http') ? url : `${BASE}${url.startsWith('/') ? '' : '/'}${url}`;
  const { html, finalUrl } = await get(abs);

  if (!isProductPage(html, finalUrl)) {
    throw new LookupError('That PriceCharting URL is not a product page.', 422, finalUrl);
  }

  const ladder = parsePriceTable(html);
  if (ladder.every((r) => r.price === null)) {
    throw new LookupError(
      'Found the PriceCharting page but could not read any prices from it. Their price table markup may have changed.',
      502,
      finalUrl
    );
  }

  const title = parseTitle(html);
  return {
    id: productIdFromUrl(finalUrl),
    name: title,
    set: parseSet(html),
    number: parseNumber(title),
    url: finalUrl,
    ladder,
    source: 'pricecharting.com',
    pricedAt: new Date().toISOString(),
    note: 'Grade 8 and Grade 9 blend PSA, BGS and CGC sales.',
  };
}

// --- search --------------------------------------------------------------

function parseSearchResults(html) {
  const region = sliceById(html, 'games_table') || html;
  const rows = region.match(/<tr\b[\s\S]*?<\/tr>/gi) || [];
  const seen = new Set();
  const out = [];

  for (const row of rows) {
    const link = /<a[^>]+href=["'](\/game\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/i.exec(row);
    if (!link) continue;
    const url = `${BASE}${link[1]}`;
    if (seen.has(url)) continue;
    seen.add(url);

    const name = text(link[2]);
    if (!name) continue;

    const cells = (row.match(/<td\b[\s\S]*?<\/td>/gi) || []).map(text).filter(Boolean);
    // Column after the title is the set/console; skip any cell that is just a price.
    const set =
      cells.find((c) => c !== name && !/^\$/.test(c) && c.length > 1 && !/^\d+$/.test(c)) ?? null;

    out.push({
      id: productIdFromUrl(url),
      name,
      set,
      number: parseNumber(name),
      url,
      ungradedPrice: parseMoney(cells.find((c) => /^\$/.test(c)) || ''),
    });
    if (out.length >= 25) break;
  }
  return out;
}

/** Search PriceCharting. Returns { matches, directProduct }. */
export async function search(query) {
  const q = String(query || '').trim();
  if (!q) throw new LookupError('Empty search query.', 400);

  const url = `${BASE}/search-products?q=${encodeURIComponent(q)}&type=prices`;
  const { html, finalUrl } = await get(url);

  // A single hit redirects straight to the product page.
  if (isProductPage(html, finalUrl)) {
    const ladder = parsePriceTable(html);
    const title = parseTitle(html);
    return {
      matches: [
        {
          id: productIdFromUrl(finalUrl),
          name: title,
          set: parseSet(html),
          number: parseNumber(title),
          url: finalUrl,
          ungradedPrice: ladder.find((r) => r.label === 'Ungraded')?.price ?? null,
        },
      ],
      directProduct: ladder.every((r) => r.price === null)
        ? null
        : {
            id: productIdFromUrl(finalUrl),
            name: title,
            set: parseSet(html),
            number: parseNumber(title),
            url: finalUrl,
            ladder,
            source: 'pricecharting.com',
            pricedAt: new Date().toISOString(),
            note: 'Grade 8 and Grade 9 blend PSA, BGS and CGC sales.',
          },
    };
  }

  const matches = parseSearchResults(html);
  if (matches.length === 0) {
    if (/no\s+(?:products|results|matches)/i.test(text(html))) {
      throw new LookupError(`PriceCharting has no product matching "${q}".`, 404, finalUrl);
    }
    throw new LookupError(
      `Could not read any results from PriceCharting's search page for "${q}". Their search markup may have changed.`,
      502,
      finalUrl
    );
  }
  return { matches, directProduct: null };
}

/**
 * Rank matches against what the vision pass read off the card.
 * Name and card number carry the most weight; set is a strong tiebreak.
 */
export function rankMatches(matches, card) {
  const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const name = norm(card?.name);
  const set = norm(card?.set);
  const number = String(card?.number || '').replace(/^0+/, '').toLowerCase();
  const variant = norm(card?.variant);

  const scored = matches.map((m) => {
    const mName = norm(m.name);
    const mSet = norm(m.set);
    let score = 0;

    if (name && mName.includes(name)) score += 50;
    else if (name) {
      const words = name.split(' ').filter((w) => w.length > 2);
      const hits = words.filter((w) => mName.includes(w)).length;
      score += words.length ? (hits / words.length) * 40 : 0;
    }

    const mNumber = String(m.number || '').replace(/^0+/, '').toLowerCase();
    if (number && mNumber && number === mNumber) score += 35;
    else if (number && mNumber) score -= 10;

    if (set && mSet) {
      if (mSet.includes(set) || set.includes(mSet)) score += 25;
      else {
        const words = set.split(' ').filter((w) => w.length > 2);
        const hits = words.filter((w) => mSet.includes(w)).length;
        score += words.length ? (hits / words.length) * 15 : 0;
      }
    }

    // Variant words such as "reverse holo" or "1st edition" appear in the title.
    if (variant) {
      const words = variant.split(' ').filter((w) => w.length > 2);
      const hits = words.filter((w) => mName.includes(w)).length;
      score += hits * 6;
    }

    return { ...m, score: Math.round(score) };
  });

  return scored.sort((a, b) => b.score - a.score);
}
