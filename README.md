# Slab Check

Snap a Pokemon card at a live fire sale auction, see what it sells for by grade, and know your max bid before the hammer drops. Installable PWA, built mobile first.

---

## What it does

1. **Snap a card.** Rear camera viewfinder, or pick an existing photo or screenshot from the gallery. Pasting an image works too.
2. **Read it.** The photo goes to Claude vision on the server, which returns name, set, card number, variant (1st Edition, Shadowless, Reverse Holo, Full Art, Alt Art, Promo and more), language, and either the slab label (company and grade) or, for a raw card, an estimated PSA grade range from centering, corners, edges and surface with notes and a confidence level.
3. **Price it.** The server searches pricecharting.com, picks the best matching product page, and parses the price table. Row headers there are exactly `Ungraded`, `Grade 7`, `Grade 8`, `Grade 9`, `Grade 9.5`, `PSA 10`, plus the sales volume line under each price.
4. **Show the ladder.** Four rows in USD: Ungraded, PSA 8, PSA 9, PSA 10.
5. **Max bid per row.**

   ```
   max bid = (price × (1 − selling fee%) − shipping − grading cost)
             ÷ (1 + profit target%)
             ÷ (1 + buyer premium%)
   ```

   Grading cost applies to the graded rows only, and only when the card in hand is raw.
6. **Type the live bid.** Every row flips to profit or loss at that bid, and the big line reads **Keep bidding, $X of room left** or **Stop, $X over max**.
7. **Wrong card?** Runners-up from the same search show as tappable chips. There is also a manual text search.
8. **Receipts.** Source, the exact time the prices were pulled, and a link to the PriceCharting page. Grade 8 and Grade 9 there blend PSA, BGS and CGC sales, and the app says so.

There is no fake data anywhere. When a lookup fails, the screen says exactly why: no product matched, the price table could not be read, the key is missing, the network is down.

---

## Stack

| Piece | Choice |
|---|---|
| Frontend | React 18 + Vite + Tailwind, single page |
| Backend | Vercel serverless functions (Node, ESM) under `/api` |
| Vision | Anthropic Messages API, `claude-sonnet-4-6`, strict tool schema |
| Prices | pricecharting.com, scraped server side, no token needed |
| Storage | IndexedDB on the device, source of truth |
| Cloud backup | Supabase, optional |
| Install | Web manifest + service worker |

API keys live only in serverless environment variables. The browser never sees one.

---

## Deploy to Vercel

```bash
npm install
npx vercel            # link the project
npx vercel env add ANTHROPIC_API_KEY    # paste your sk-ant-... key
npx vercel --prod
```

Or from the dashboard: import the repo, set `ANTHROPIC_API_KEY` under Settings → Environment Variables, deploy. Vercel detects Vite and serves `/api/*.js` as functions with no extra config; `vercel.json` only raises the function timeout and keeps the service worker uncached.

Open the deployed `https://` URL on your phone and use **Add to Home Screen**. The camera needs HTTPS, which the Vercel URL gives you.

### Local development

```bash
npm install
npx vercel dev        # serves the app and /api together on :3000
```

`npm run dev` alone runs Vite on :5173 and proxies `/api` to :3000, so run `vercel dev` alongside it if you want Vite's fast refresh. The camera will not open on plain `http://localhost` in every browser; Chrome treats localhost as secure, Safari on iOS does not, so test capture on the deployed URL.

---

## Environment variables

Copy `.env.example` to `.env` for local use. On Vercel, set the same names in project settings.

| Name | Required | What it does |
|---|---|---|
| `ANTHROPIC_API_KEY` | yes | Server-side key for `/api/identify`. Get one at [console.anthropic.com](https://console.anthropic.com/settings/keys). |
| `CLAUDE_MODEL` | no | Defaults to `claude-sonnet-4-6`. |
| `SUPABASE_URL` | no | Turns on the cloud mirror of the collection. |
| `SUPABASE_SERVICE_ROLE_KEY` | no | Service role key, read server side only. Never the anon key. |
| `SUPABASE_TABLE` | no | Defaults to `slab_check_collection`. |

---

## Collection

The collection lives in IndexedDB on the phone, so it works with no backend and no signal beyond the price lookups themselves.

- **Add from any result.** Form takes grade held (Ungraded, PSA 8, 9, 10), paid each (prefilled from the current bid plus buyer premium), and quantity.
- Same card at a different grade is its own line. Same card at the same grade merges: quantities add, paid each is weighted-averaged.
- Each line stores card id, name, set, number, source url, grade, quantity, paid each, the full six-row price ladder, the priced date and the added date.
- The screen shows total estimated value (using the price for the grade held), total paid, gain or loss, and card count. Per line: value, up or down amount, priced date, Edit, Source, Remove.
- **Update values** refreshes every card from PriceCharting and reports anything that failed. Rescanning a card you already own refreshes it too.
- The header always shows card count and total value.
- **Export CSV** writes name, set, grade, qty, paid each, value each, value total, gain, priced on, source url.
- A line with no price for the grade held, or no paid amount, stays out of the totals, and the screen says how many are excluded and why.

### Optional cloud backup

Run `supabase/schema.sql` in the Supabase SQL editor, then set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Every change mirrors to Supabase through `/api/collection`; IndexedDB stays the source of truth, so losing the network only pauses the backup.

The table is keyed by a random device id generated on first run. There is no login: anyone who knows a device id and can reach your deployment could read that device's rows. For a personal tool that is usually fine. If it is not, put Vercel password protection in front of the deployment or add auth before you rely on it.

---

## Fees settings

Editable on the Settings tab and saved to the device.

| Setting | Default |
|---|---|
| Selling fee | 13% |
| Shipping | $5 |
| Profit target | 20% |
| Buyer premium | 0% |
| Grading cost | $25 |

Settings shows a worked example on a $100 card so you can sanity check the math before you are standing in front of an auctioneer.

---

## Project layout

```
api/
  _pricecharting.js   search, product page fetch, price table parser, match ranking
  _util.js            CORS, JSON body reading, error shape
  identify.js         photo -> Claude vision -> PriceCharting -> priced result
  price.js            price one url, a batch of urls, or a query
  search.js           text search, returns ranked matches
  collection.js       optional Supabase mirror
src/
  lib/                pricing math, IndexedDB, CSV and totals, API client, settings, image resize
  components/         Camera, ScanScreen, PriceLadder, Verdict, Condition, AddToCollection,
                      CollectionScreen, SettingsScreen
supabase/schema.sql   table for the optional cloud mirror
scripts/make-icons.mjs regenerates the PWA icons
```

---

## Notes and limits

- **The PriceCharting parser is a scraper.** There is no public token-free API, so `api/_pricecharting.js` reads the HTML using three independent strategies: the visible row labels, PriceCharting's element ids, and a header-row/price-row table fallback. If all three come up empty the app says the price table could not be read and links you to the page, rather than showing a number it did not get. Respect their terms of service and do not hammer the endpoint; **Update values** fetches sequentially and is capped at 60 cards per request.
- **A photo grade is an estimate, not a grade.** One photo cannot show every flaw. The range is deliberately conservative and carries a confidence level. Treat it as a ceiling.
- **Grade 8 and Grade 9 blend PSA, BGS and CGC sales** on PriceCharting. The app repeats that on every result.
- Prices and card reads are never served from cache. The service worker caches the app shell only, because a stale price at an auction is worse than no price.
