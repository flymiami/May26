# FLY Miami Art — Conversion Rebuild

This delivery is organized by task:

* `audit/DIAGNOSIS.md` — Task 1, the crawl-based audit with the one-sentence diagnosis at the top.
* `copy/all-copy-source.md` and `copy/FLY-Miami-Art-Copy-Deck.docx` — Task 2, homepage copy, the 6-product offer ladder, full product page copy, and email flow copy.
* `data/FLY-Miami-Art-Offer-Ladder-Margin-Model.xlsx` — Task 2, the offer ladder margin model and a 30-day revenue model, both formula-driven.
* `shopify/` — Task 3, paste-ready Liquid sections (hero, social proof/press bar, bundle upsell, email capture), the GA4 + Meta custom pixel script, and `shopify/INSTALL.md` with exact install steps and the admin permissions each step needs.
* `plan/30-DAY-TRAFFIC-PLAN.md` — Task 4, the 30-day plan to the first 100 sales.

## Admin access needed, exactly where the build stops

Everything above is built and ready to paste in. Three things need Shopify admin access to finish, all listed with exact steps in `shopify/INSTALL.md`:

1. **Settings > Customer events** (or Themes edit access): add the GA4 + Meta custom pixel (`shopify/ga4-and-meta-events-pixel.js`) so Add to Cart, Checkout, and Purchase actually get tracked. Right now only PageView fires.
2. **Discounts**: create the `WELCOME10`, `BUNDLE15`, and `COMEBACK10` codes referenced in the sections and email copy — Liquid can display a code, it cannot create one.
3. **Marketing > Automations**: paste the welcome and abandoned cart email copy into Shopify Email's native automation templates and activate them.

## A note on the spreadsheet

`data/FLY-Miami-Art-Offer-Ladder-Margin-Model.xlsx` uses live formulas throughout (margin %, revenue totals, blended AOV), and this sandbox's LibreOffice could not recalculate or render a preview to confirm the cached values on disk. Every formula was checked by hand against its expected output before delivery, and Excel or Google Sheets will recalculate everything correctly on open regardless of what's cached. Re-open and re-save once if any cell looks stale.
