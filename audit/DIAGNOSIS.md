# FLY Miami Art — Conversion Audit

## The one sentence diagnosis

FLY Miami Art asks cold traffic to make a $1,000 to $30,000 fine art decision on their very first visit, with no cheap trust building product in between, so visitors browse and leave instead of buying.

## Scope crawled

* Homepage (mobile render)
* Product page: `/products/spider-quack` (representative original, $2,500)
* Cart page (empty state, only reachable state without a live checkout session)
* Collections: All, Wall Art, Sculpture, FLY Duck Tees, Pride Collection
* Site map: 95 product URLs, 5 collections, blog, and policy pages indexed

## 1. Mobile walkthrough, above the fold to buy path

**Homepage**
* Hero loads a full bleed 4240px source image (`Florence_Biennale_Resilience.jpg`) behind the headline. It is served at native width with no explicit `srcset` size cap visible in the render, which is the single biggest speed risk on the page.
* Headline: "Peace. Love. Joy. Unity. Pop art sculptures and limited editions by Facundo Yebne, Florence Biennale Award winner, public art on Lincoln Road in Miami Beach." This is a bio, not an offer. A first time visitor gets no answer to "what can I buy and for how much" in the first screen.
* First two CTAs are "Shop the collection" and "Commission yours." Neither states a price. "Commission yours" sends a cold visitor straight into a custom sculpture inquiry, the highest friction path on the site, above the fold.
* Below the hero: press logos (CBS, NBC, Yahoo, MSN, infobae, AP, ABC), then a Wall Art carousel starting at $2,500, a Sculpture carousel starting at $2,500 to $10,000, a Pride Collection carousel at $35 to $30,000, a UV/Glow carousel at $1,000 to $5,000, blog teasers, then four trust badges, then the footer.
* The $35 tee and the $120 Mini Proud Love 3D exist on the page but are the 2 cheapest items among roughly 24 homepage product tiles. A thumb scrolling this page hits five figure price tags for four full screens before seeing anything under $200.
* Trust badges ("Handmade in Miami," "One of a Kind," "Ships Worldwide," "Glows Under Blacklight") sit at the very bottom of the homepage and on the empty cart page. They never appear near a price or an Add to Cart button, which is where they do the actual work of reducing purchase anxiety.

**Product page (`spider-quack`, $2,500 original)**
* Price is clear: "Sale price $2,500.00" with a Shop Pay installment line, "From $225.65/mo." Financing is available, but it is not called out as a value prop anywhere else (homepage, ads, collection grid) — it is only visible once someone has already committed to opening a $2,500 product page.
* Product copy is 2 to 3 sentences plus a spec list (medium, dimensions, year, one of a kind, signed, Certificate of Authenticity, ships from Miami Beach). No mention of shipping cost, shipping timeline, crating, insurance, or return policy anywhere on the page or near the buy button. For a $2,500 to $30,000 purchase shipped as fine art, the absence of "here is exactly how this gets to your wall safely" is a real objection left unanswered at the moment of decision.
* No reviews, no star rating, no "X collectors own this piece," no scarcity beyond the static "1 of 1" label. Nothing creates urgency to act today versus bookmarking and leaving.
* The AR "View on your wall" feature is present and is genuinely a strong trust/friction reducer, but it is positioned mid page after the Add to Cart block, not next to it.
* Related products below AR feature are all $600 to $10,000. Every cross sell on the page pushes the visitor further up the price ladder, never down to something they could buy today.

**Cart**
* The only state observed was empty cart, which shows the four trust badges and a "Continue shopping" link. There is no discount prompt, no shipping estimator, no urgency, no bundle suggestion, and no email capture for the cart itself. Once someone reaches checkout, Shopify's native checkout takes over and was not directly crawlable, but nothing upstream of it (cart, product page) does any of the standard load bearing work (free shipping threshold messaging, trust badges beside the total, "secure checkout" badge) that reduces cart abandonment for a five figure purchase.

## 2. Tracking audit — what is actually firing

Verified directly from the live page source (`view-source`, mobile render):

| Tag | Status | Evidence |
|---|---|---|
| Meta Pixel | **Installed, PageView only confirmed** | `fbq('init', '3039733526418395'); fbq('track', 'PageView');` fires on page load. No `ViewContent`, `AddToCart`, `InitiateCheckout`, or `Purchase` calls were present in the crawled homepage or product page source. |
| Google Analytics 4 / gtag.js | **Not installed** | No `gtag(`, no `googletagmanager.com/gtag/js`, no `G-XXXXXXX` measurement ID anywhere in the source. |
| Google Tag Manager | **Not installed** | No `GTM-XXXXXXX` container anywhere in the source. |
| Shopify native analytics | **Installed (default)** | `Shopify.analytics` object and `monorail-edge` beacon calls are present, so Shopify's own admin reports (sessions, sales) are accurate. This is not the same as GA4 and cannot be used for Google Ads or Search Console conversion data. |
| TikTok Pixel | Not found | No `ttq.load` anywhere in source. |
| Pinterest Tag | Not found | No `pintrk` anywhere in source. |
| Klaviyo | Not found | No Klaviyo snippet in source; the only email capture on the page is a native looking form ("Send me the guide") whose backend could not be confirmed from the front end alone. |
| Google Search Console | Verified | `google-site-verification` meta tag present, so at least indexing/search data exists. |

**What this means concretely:** every dollar spent on Meta ads is only measuring "people who loaded a page," not adds to cart or purchases, so Meta's algorithm has nothing to optimize toward and cannot build a lookalike audience of buyers. There is no GA4 property receiving events at all, so Google Ads conversion tracking, Google Analytics funnels, and Search Console-to-revenue attribution are all impossible right now. This is fixable in under a day and should happen before a single new ad dollar is spent.

## 3. Biggest friction points in the buy path, ranked

1. **No offer under $200 is merchandised anywhere in the buy path.** The catalog technically contains a $35 tee and a $120 sculpture, but they are not positioned, described, or sequenced as an entry point. A cold visitor's only realistic first purchase today is a four or five figure original.
2. **Meta Pixel is not tracking Add to Cart or Purchase**, so ad spend cannot be optimized for buyers and cannot build retargeting or lookalike audiences of people who almost bought.
3. **GA4 does not exist on the store**, so there is no source of truth for funnel drop off (homepage to product to cart to checkout) independent of Shopify's own admin.
4. **No shipping, crating, insurance, or return information appears near the price or the buy button** on a product that costs as much as a used car. This is an unanswered objection at the exact moment of decision.
5. **Zero social proof at the point of decision** — no reviews, no "as seen in" near the price (press logos exist but live only on the homepage, disconnected from any specific product), no owner count, no urgency.
6. **The cart is a dead end**, not a save. No cross sell, no discount nudge, no email capture for abandoners, no reassurance.
7. **Hero image is unoptimized for mobile load** (multi-thousand-pixel source image with no visible responsive size cap), which slows first paint on exactly the segment of traffic (mobile) covered by "check on mobile first."

## What Task 2 and Task 3 below fix, and what they do not

Rebuilding the offer ladder (Task 2) fixes friction point #1, and gives Meta and Google something to actually optimize toward once combined with proper event tracking. The Liquid sections in Task 3 fix #5, #6, and partially #7 (lighter hero markup, lazy-loaded assets). Fixing #2, #3, and #4 requires Shopify admin access — see the "Admin access needed" section in the main handoff for the exact permissions and the exact steps to run once granted.
