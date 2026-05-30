# FLY Concierge — Sales Funnel Site

Single page sales funnel for the $17 FLY Concierge Pass. Ready to deploy Monday.

## Deploy in 60 seconds

**Option 1: Netlify Drop (fastest)**
1. Go to https://app.netlify.com/drop
2. Drag the `index.html` file (or the whole folder) onto the page
3. You get a live URL immediately. You can point a custom domain at it after.

**Option 2: Vercel**
1. Push this repo to GitHub (already done)
2. Go to https://vercel.com/new and import the repo
3. Deploy. Done.

**Option 3: Just open it locally**
- Double click `index.html` and it opens in any browser. Useful for the iPad/laptop at the show booth.

## What's in the site

Single page with all funnel sections from the locked corrections:

1. Hero with the $17 Concierge pitch
2. The 5 components of the Concierge (Match, Reserve, Commission, Story, Glow Map)
3. The $17 offer card with credit toward first piece
4. Order bumps: $47 gift (now includes a mini duck), $97 whole home / property curation
5. Story section with Facundo's credentials
6. Ascension ladder: $17 → $97/mo founding (first 50) / $197/mo after → $15,000 commission
7. Love It On Your Wall guarantee
8. Signature Commission detail card (2 to 3 per month cap, 3 to 7 business day draft)
9. Final CTA with concierge form
10. Lead capture modal that stores submissions in localStorage

## Corrections locked in from the funnel review

- Custom pieces from $2,500, signature installations from $15,000 (no more pricing contradiction)
- $17 credited toward first piece, refunded otherwise
- Order Bump 1 raised to $47 and now includes an actual mini duck
- Glow Map kept as a website feature, not framed as a venue hero moment
- Membership labeled "Founding Membership" (placeholder until final name is chosen). Old "Flock" naming removed
- Founding rate: first 50 members at $97/mo, $197/mo after
- Commission turnaround set at 3 to 7 business days
- Commission capacity capped at 2 to 3 per month with waitlist

## What still needs to be wired up

These are placeholders or stubs. Get Lucas to finish them before sales pages get heavy traffic:

1. **Payment.** The "Start the Concierge" form captures leads to localStorage. Wire it to Stripe Checkout or a payment link to actually charge the $17.
2. **Concierge backend.** Right now the form just captures a lead. Either route those to Facundo's email/WhatsApp or wire up the actual AI concierge.
3. **Hero image.** Currently a placeholder duck emoji. Swap in a real photo or video of a FLY piece (preferably one with the UV reveal as a hover/cycle).
4. **Membership name.** Replace "Founding Membership" with the chosen name once decided.
5. **Domain.** Point fly[domain].com at wherever this gets deployed.

## File structure

```
/
├── index.html       ← The full site, single file, embedded CSS/JS
└── README.md        ← This file
```

No build step. No dependencies. Open and edit directly.
