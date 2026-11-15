import { cors, send, fail, readJson } from './_util.js';
import { search, rankMatches, LookupError } from './_pricecharting.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const body = req.method === 'POST' ? await readJson(req).catch(() => ({})) : {};
  const q = String(body.q ?? req.query?.q ?? '').trim();
  if (!q) return fail(res, 400, 'Type something to search for.', 'search');

  try {
    const { matches, directProduct } = await search(q);
    const ranked = rankMatches(matches, { name: q });
    return send(res, 200, {
      ok: true,
      query: q,
      matches: ranked,
      product: directProduct,
      source: 'pricecharting.com',
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    if (err instanceof LookupError) return fail(res, err.status, err.message, 'search', err.detail);
    return fail(res, 500, `Search failed: ${err.message}`, 'search');
  }
}
