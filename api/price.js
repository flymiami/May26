import { cors, send, fail, readJson } from './_util.js';
import { fetchProduct, search, rankMatches, LookupError } from './_pricecharting.js';

/**
 * POST { url }                      -> prices for that exact product page
 * POST { urls: [...] }              -> batch refresh (collection "Update values")
 * POST { q, card }                  -> search, rank against `card`, price the winner
 */
export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const body = req.method === 'POST' ? await readJson(req).catch(() => ({})) : {};
  const url = body.url ?? req.query?.url;
  const urls = Array.isArray(body.urls) ? body.urls.filter(Boolean) : null;
  const q = body.q ?? req.query?.q;

  try {
    if (urls) {
      if (urls.length > 60) {
        return fail(res, 400, 'Refresh is capped at 60 cards per request.', 'price');
      }
      const results = [];
      // Sequential and gentle: PriceCharting rate-limits bursts.
      for (const u of urls) {
        try {
          results.push({ url: u, ok: true, product: await fetchProduct(u) });
        } catch (err) {
          results.push({ url: u, ok: false, error: err.message });
        }
      }
      return send(res, 200, { ok: true, results, fetchedAt: new Date().toISOString() });
    }

    if (url) {
      return send(res, 200, { ok: true, product: await fetchProduct(url) });
    }

    if (q) {
      const { matches, directProduct } = await search(q);
      const ranked = rankMatches(matches, body.card || { name: q });
      const product = directProduct ?? (await fetchProduct(ranked[0].url));
      return send(res, 200, { ok: true, product, matches: ranked });
    }

    return fail(res, 400, 'Send a PriceCharting url, a list of urls, or a search query.', 'price');
  } catch (err) {
    if (err instanceof LookupError) return fail(res, err.status, err.message, 'price', err.detail);
    return fail(res, 500, `Price lookup failed: ${err.message}`, 'price');
  }
}
