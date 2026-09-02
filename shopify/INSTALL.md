# Install Instructions

## 1. The four sections (paste ready)

Files:
* `sections/fly-hero.liquid` + `assets/fly-hero.css`
* `sections/fly-social-proof-bar.liquid` + `assets/fly-social-proof-bar.css`
* `sections/fly-bundle-upsell.liquid` + `assets/fly-bundle-upsell.css`
* `sections/fly-email-capture.liquid` + `assets/fly-email-capture.css`

Steps, repeat for each of the 4 sections:
1. Shopify Admin, go to Online Store, Themes.
2. On the live theme, click the "..." menu, click Edit code.
3. In the Sections folder, click Add a new section, name it exactly the same as the file (for example `fly-hero`), paste in the matching `.liquid` content, Save.
4. In the Assets folder, click Add a new asset, Create a blank file, name it exactly the same as the matching `.css` file (for example `fly-hero.css`), paste in the CSS, Save.
5. Go to Online Store, Themes, Customize.
6. On the Home page template, click Add section, find the section under Apps or Custom (it will show by its schema name, "FLY Hero," "FLY Social Proof Bar," "FLY Bundle Upsell," "FLY Email Capture"), add it, and drag it into position.

Recommended homepage order top to bottom:
1. FLY Hero (replace the current image banner)
2. FLY Social Proof Bar (press logos, right under the hero)
3. Existing product carousels, reordered so the entry tier (prints, tees) shows first, sculptures last
4. FLY Bundle Upsell (placed after the print/tee carousel)
5. FLY Email Capture (above the footer)

Also add FLY Bundle Upsell to the product page template (Customize, Products, Default product, Add section) directly under the buy box, and add FLY Email Capture to the Cart page template so an abandoning visitor can still opt in for 10% off.

## 2. Wire up the bundle and welcome discount codes

The two sections reference discount codes as **display text only** — Liquid cannot create discounts. Create the matching codes once so what the section promises actually works at checkout:

1. Shopify Admin, Discounts, Create discount, Discount code.
2. Code: `WELCOME10`. Type: Percentage, 10%. Eligibility: All customers, one use per customer. Applies to: All products (or exclude the flagship sculpture tier if you want to protect margin on the $10,000+ pieces).
3. Code: `BUNDLE15`. Type: Percentage, 15%. Minimum purchase requirement: 2 items, or set it to require both specific products via "Specific collections" scoped to a new "Starter Bundle" collection.
4. Update the `code` setting on each section in Customize if you rename either code.

## 3. Tracking fixes — what needs admin access

These cannot be done through theme code alone and need the following store admin permissions:

* **Add GA4**: Settings, Customer events, Add custom pixel (or paste the gtag.js snippet in `theme.liquid` before `</head>`). Requires "Themes" edit access or "Customer events" access under Settings. GA4 does not exist on the store today — see the audit.
* **Fix Meta Pixel event coverage**: Settings, Customer events, add a custom pixel subscribing to `checkout_completed`, `product_added_to_cart`, and `product_viewed`, and fire `fbq('track', 'Purchase', ...)`, `fbq('track', 'AddToCart', ...)`, `fbq('track', 'ViewContent', ...)` accordingly. Requires the same "Customer events" permission. A ready to paste custom pixel script is in `shopify/ga4-and-meta-events-pixel.js` in this delivery — paste its contents into a new Custom Pixel in Settings, Customer events, Add custom pixel, and set the connection to "Permission not required" only if this is first party analytics, otherwise ask the store owner which consent setting applies.
* **Everything else in this delivery** (the 4 sections, the discount codes) only needs "Themes" and "Discounts" edit access, which a normal Staff account with Store owner permissions already has.

## 4. Email flows

See `copy/EMAIL-FLOWS.docx` for full copy. To activate natively with no app (Shopify Email is free and already available on every plan):

1. Shopify Admin, Marketing, Automations, Create automation, choose "Send an email series" template, or build from scratch with the "Abandoned cart" and "Welcome" triggers shown in the automation template gallery.
2. For Welcome: trigger = "Customer subscribes," 3 emails at 0 hours, 48 hours, 5 days, copy in the docx.
3. For Abandoned cart: trigger = "Checkout started, not completed," 3 emails at 1 hour, 24 hours, 72 hours, copy in the docx. Note the third abandoned cart email includes a 10% code, use `WELCOME10` restricted to first time customers or create a dedicated `COMEBACK10` code following the same steps as section 2 above.
4. Activate each automation once copy is pasted in. This step requires "Marketing" edit access.
