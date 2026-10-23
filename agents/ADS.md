# Ads agent (draft Oct 19 2026)
V = verified. U = unknown. Nothing here is live. Spending needs owner yes (CLAUDE.md rule 4).

## Access check Oct 19 (V)
1. Meta Ads Manager is signed in on the Chrome browser. Ad account act=3039733526418395. It shows no campaigns (30 day view). Which Page, Instagram and payment method sit on it: U.
2. Built in browser is NOT signed in to Meta.
3. Windsor.ai has only Google Ads connected (account 464-005-2823, FLY Miami Art). No Meta. Use Chrome for Meta.

## Test 1: FLY Pilates Miami, Meta ad (waiting owner yes)
1. Goal: fill classes. Slow season, about 21% full in the one week measured (FOCUS.md).
2. Budget: $10 a day for 7 days = $70 total (HANDOFF.md).
3. Offer: bring a friend, both 50% off ($17.50 each, $35 per pair), code FRIEND50, until Oct 31 (V, PILATES_WINBACK_DRAFT.md).
4. Link: https://www.vagaro.com/us03/flypilatesmiami (V). No Meta pixel on flypilatesmiami.com (V), so measure clicks and FRIEND50 uses in Vagaro, not pixel conversions.
5. Objective: traffic to the Vagaro link.
6. Area: North Bay Village FL 33141 plus Miami Beach and nearby, radius U until owner picks.
7. Count result daily: FRIEND50 uses and new bookings in Vagaro. Stop or scale after day 3.

## Ad copy draft
Headline: Bring a friend, both 50% off
Primary text: Small reformer classes, only 4 spots each. Book with a friend and you both pay $17.50. Valid through Oct 31. Code FRIEND50.
Button: Book now
Image: from Drive "FLY Pilates Miami" photos (not yet chosen).

## Next after Pilates
1. Atelier ad test.
2. Daily brief time (ask owner once).

## Owner rules added Oct 19 (V, owner)
1. Every ad that ever runs gets the Meta pixel plus every tracking tool that fits. No manual counting.
2. No yes or no questions to the owner. Decide, do, show the screen when a click is his.
3. Audience for Pilates: 10 mile radius around North Bay Village FL 33141.

## Blocker Oct 19 2am (V)
1. Meta Business Suite shows a "You were added to the pilatesmiamiok business portfolio" popup. Accept is needed before Events Manager and the pixel open. Owner gave the yes in chat; the click was blocked for me, so owner clicks it.
2. Ad account act=3039733526418395, Page PilatesMiamiok 106956201157758, card Amex 5005 default (V).
3. After accept: create pixel in Events Manager, add it to Vagaro website settings (plan support U), then build the ad.

## Switch to Google Ads (Oct 19 2am, V)
1. Meta dropped for now: Web data source is disabled in Events Manager for the pilatesmiamiok portfolio (reason U). Owner prefers Google Ads.
2. GA4 property CREATED: "FLY Pilates Miami", same GA account as FLY Miami Art, time zone New York. Web stream "FLY Pilates Miami Website" for flypilatesmiami.com. Measurement ID G-0HF6PMC87E (read from zoomed screenshot, confirm with Vagaro test).
3. Vagaro supports it: MySite editor, gear, General, "Google Analytics ID" box. Google Tag Manager goes in head code (Vagaro support article 25992790947227).
4. Vagaro is NOT signed in on the agent browser. Owner login needed once.
5. Google Ads (Windsor, account 464-005-2823 "FLY Miami Art"): 0 campaigns and 0 conversion actions in 90 days. I can create campaign, ad group, keywords, responsive search ad, geo radius, schedule, budget. All created paused.
6. After GA4 shows data: mark a key event, link GA4 to Google Ads, import conversion (Vagaro steps 4 to 6).
7. Geo: 10 mile radius around North Bay Village FL 33141. Ads link to flypilatesmiami.com (MySite), not vagaro.com, so the tag can see the visit.

## Google Ads campaign built Oct 19 2:28am (V, all PAUSED)
1. Campaign "FLY Pilates Miami Local Search" id 24375856516, daily budget $10, manual CPC.
2. Geo: 10 mile radius around 25.8473, -80.1546 (North Bay Village).
3. Ad group "Reformer Pilates Near Me" id 199977781886, default CPC $1.50 (my placeholder, not researched).
4. 7 keywords paused: 6 phrase, 1 exact (reformer pilates miami).
5. Responsive search ad paused, final URL https://flypilatesmiami.com, 7 headlines, 2 descriptions, copy uses only verified facts (4 reformers, bring a friend 50% off, FRIEND50 until Oct 31).
6. Windsor write toggle turned ON by owner order Oct 19.
7. Still to do before enabling: Vagaro GA ID paste (G-0HF6PMC87E), GA4 key event, link GA4 to Google Ads, import conversion.
