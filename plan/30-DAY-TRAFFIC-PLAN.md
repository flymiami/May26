# 30 Day Plan to First 100 Sales — Budget Under $500

## The math

100 sales at an average order value around $45 to $60 (Tier 1 and Tier 2 entry products carrying the volume) needs roughly 2,000 to 3,500 site sessions at a realistic 3% to 5% conversion rate once the offer ladder and tracking fixes above are live. That traffic is cheap because the offer is cheap: $500 in ad spend at a $0.50 to $1.50 CPC on Meta and Instagram gets 350 to 1,000 paid clicks, and the remaining sessions come from the 15 existing SEO articles, the daily SEO blog agent, and organic Instagram, none of which cost ad dollars.

Do not spend any of the $500 until the tracking fixes (GA4 + Meta events) and at least the entry tier products (print, tee, mini original) are live and merchandised on the homepage. Spending against untracked, sculpture-only pages is how the store got to zero sales in the first place.

The live version of this math, with every input editable, is the "30-Day Revenue Model" tab in `data/FLY-Miami-Art-Offer-Ladder-Margin-Model.xlsx`: $500 budget at $1 CPC plus 1,500 organic sessions, a 5% blended conversion rate (an optimistic target that assumes the fixes above are live, not a guarantee), and an 80/19/1 Entry/Mid/Fine-Art order mix land on exactly 100 orders at a $57.75 blended AOV.

## Week by week

**Week 1: Fix the foundation, spend $0**
* Install GA4 and Meta event tracking (audit section 2).
* Publish the offer ladder: reposition Mini Proud Love 3D and Shadow of Firenze, launch the $28 print and $150 signed print as new products, move the tee up in the homepage order.
* Install the 4 Liquid sections.
* Set up the welcome and abandoned cart email flows.
* Post 3 to 5 Instagram Reels showing the blacklight transformation on the $28 to $150 tier products specifically (not the $10,000 pieces), each with a direct "link in bio to the $28 print" call to action.

**Week 2: Launch paid, budget $150**
* Run 1 campaign, Meta + Instagram, objective: Purchases (once Purchase event is confirmed firing in Events Manager, not before).
* $15 to $20 a day for 8 to 10 days.
* Ad creative rotation: the 3 creatives below, all pointing to the $28 print or the $150 signed print as the landing product, never the homepage and never a sculpture.

**Week 3: Scale what worked, budget $200**
* Kill any ad set with cost per purchase above $25 for the entry tier or above $60 for the $120 to $150 tier (see kill criteria below).
* Double budget on the single best performing ad set only.
* Turn on retargeting to everyone who viewed a product or added to cart but did not buy in weeks 1 and 2 (this is why the AddToCart and ViewContent events had to be fixed in week 1).

**Week 4: Retarget and upsell, budget $150**
* Retargeting campaign only, audience: site visitors last 30 days, ViewContent and AddToCart custom audiences.
* Push the Bundle Upsell (tee + print, $63 for $55) and the "$120 original" as the retargeting offer, since this audience has already seen the brand and needs a nudge to a slightly higher tier, not a cold introduction.
* Send the 3-email abandoned cart series to everyone who started checkout across the whole month.

## 5 highest intent search terms to rank for

1. "rubber duck art for sale" — highest commercial intent, matches the homepage title tag already in place.
2. "glow in the dark wall art" — matches the UV/blacklight differentiator, low competition from big box art retailers.
3. "pop art sculpture for sale" — captures collectors specifically shopping to buy, not just browse.
4. "unique pride gift art" — matches the existing Pride Collection and taps a gifting occasion with a clear purchase trigger.
5. "Miami pop artist" — branded-adjacent term that captures press-driven searches (CBS, NBC, AP coverage already exists) from people who heard about Facundo Yebne and are looking to buy.

The 15 existing SEO articles and the daily blog agent should each link at least once to the entry tier products (print, tee, mini original), not just to the collection pages, since that is what turns blog traffic into a sale within 30 days rather than a bookmark.

## 3 ad creatives to test

**Creative 1: "Start here" product demo**
Format: 9x16 video, 8 to 12 seconds.
Visual: Phone camera, natural light, hand holding the $28 print next to a lit lamp, then the room goes dark and a blacklight reveals the glow. Cut to the product page with the $28 price clearly on screen.
Copy overlay: "Real Miami pop art. Starts at $28."
Caption: "You don't need a gallery budget to own FLY Miami Art. Prints start at $28, ship in days, and glow under blacklight. Link in bio."

**Creative 2: press credibility + price anchor**
Format: 1x1 static carousel, 3 slides.
Visual: Slide 1, press logo wall (CBS, NBC, AP, Yahoo). Slide 2, the Lincoln Road public sculpture photo. Slide 3, the $120 Mini Proud Love 3D on a bookshelf.
Copy overlay: Slide 3 reads "Own an original from $120."
Caption: "Featured on CBS, NBC, and AP. The same artist who built the Lincoln Road duck sculpture makes hand-built originals starting at $120."

**Creative 3: UGC-style unboxing**
Format: 9x16 video, 15 seconds.
Visual: Unboxing the signed print or the mini sculpture, showing the certificate of authenticity, then a close-up of the artist's signature and edition number.
Copy overlay: "Signed. Numbered. Yours."
Caption: "Every piece ships with a signed certificate of authenticity. Starting at $28 for a print, $150 for a signed limited edition. Free shipping over $150."

## Instagram to store funnel fix

Current gap: Instagram traffic almost certainly lands on the homepage bio link, which then shows sculptures before anything under $200, which is the same offer ladder problem restated as a traffic problem.

Fix:
1. Point the Instagram bio link and every Reel's "link in bio" call to action to a dedicated landing collection (`/collections/start-here`) containing only the 4 entry and mid tier products (print, tee, signed print, mini original), not the full catalog and not the homepage.
2. Add the FLY Email Capture section to that landing collection page so non-buyers still convert to an email subscriber.
3. Tag every Reel and post that features an entry tier product with Instagram's native product tagging (Shop tab) pointing directly to that product, so a tap goes straight to a $28 to $150 add-to-cart, not a homepage browse.
4. Use Instagram Stories link stickers on the blacklight transformation content specifically, since that is the strongest visual hook, and send every one of those clicks to the entry tier landing collection.

## Weekly metrics to check

* Sessions (GA4, once installed) and Shopify Analytics sessions, cross-checked against each other for tracking sanity.
* Add to cart rate (sessions to AddToCart event).
* Checkout initiated rate (AddToCart to InitiateCheckout).
* Purchase rate (InitiateCheckout to Purchase) — this is the number most likely to expose a checkout-level problem separate from the offer ladder.
* Cost per purchase, by ad set, by product tier (entry tier and mid tier tracked separately from any sculpture-tier spend).
* Email list growth from the Email Capture section, and its own conversion rate on the welcome series.

## Kill criteria

* Any ad set with cost per purchase above $25 for a Tier 1 product ($28 to $35 items): pause after $50 spent with zero purchases, or after 3 days if CPC exceeds $2.
* Any ad set with cost per purchase above $60 for a Tier 2 product ($120 to $150 items): pause after $75 spent with zero purchases.
* Any ad creative with click-through rate under 0.8% after 1,000 impressions: pause and replace with the next untested creative.
* Any landing page (product or collection) with an add-to-cart rate under 2% after 200 sessions: fix the page (price visibility, image quality, trust copy) before spending further against it.
* The whole campaign: if by day 21 total purchases across all spend are under 15, stop paid spend entirely and re-diagnose the offer or tracking before adding more budget, rather than continuing to spend against an unproven funnel.
