# Buyer Scout agent (FLY Miami Art) draft Oct 17 2026
Goal: find art buyers, put them in GoHighLevel, make first contact on the channel where they were found. Replace the paid LinkedIn Sales Navigator.

## Facts
1. Sales Navigator Core is ACTIVE, billed through Apple. LinkedIn cannot cancel it. (V, LinkedIn Manage Premium page, Oct 17)
2. Price and renewal date: UNKNOWN (Apple subscription screen only).
3. GHL (V, opened Oct 17): 2 sub accounts, FLY Future LLC and FLY Miami Art. FLY Miami Art has 2 pipelines: "Art Sales Pipeline" (9 stages: New Lead, Initial Contact/ Inquiry, Gallery Visit / Consultation, Artwork Interest / Shortlist, Negotiation & Follow-Up, Sale Agreed, Payment Processing, Artwork Delivered, Referral/ Review Request) and "IG Leads Art" (5 stages: Welcomed, Replied, Portfolio Requested, Lead Hot, Customer). No outbound buyer pipeline exists. Pipeline "Art Buyers Outbound" CREATED Oct 17 after owner yes (V, 7 stages: Found, Contacted, Replied, Meeting, Offer, Won, Lost).

## Done Oct 17
1. Sales Navigator saved leads (122, V count from LinkedIn) exported to Drive "Chief of Staff", sheet "Sales Navigator saved leads 2026-10-17". Sheet rechecked Oct 17: 122 data rows plus header (V). 7 rows had no title or company and are marked UNKNOWN.
2. Mix of the 122 (from titles): 7 Miami art advisors, 2 interior designers (both out of state), 2 real estate, rest mostly LatAm wealth managers and bankers.
3. Owner order for sourcing: interior designers first. LinkedIn, then Instagram, then an interior design association (name UNKNOWN, owner said "Starboy, Miami" by voice).

## Order of work
1. Export saved leads and lists from Sales Navigator to Drive "Chief of Staff/Buyer Scout" BEFORE cancel. Lists vanish after the plan ends.
2. Owner cancels in Apple subscriptions. Blocked for the chief (Apple ID login).
3. Daily sourcing from public pages, no LinkedIn bot, no scraping behind login.
4. Each lead goes to GHL with source tag and segment tag.
5. First touch on the source channel, draft shown to owner first.

## Sources (no paid tool)
1. Instagram public bios and suggested accounts lists (screenshots Oct 17).
2. Public web: design firm sites, developer and brokerage team pages, city public art programs, advisor directories.
3. LinkedIn by hand pace only, from the free account, 1 profile at a time, no mass tools.

## Segments (tags)
seg-designer, seg-realtor, seg-developer, seg-hospitality, seg-city, seg-advisor, seg-collector, seg-media

## GHL fields per lead
Name, company, role, segment, source (linkedin or instagram or web), source URL, first touch channel, first touch date, status.
Pipeline stages: Found, Contacted, Replied, Hot, Customer.

## Rules
1. No message goes out without owner approval of the template, then daily batch approval until owner says auto.
2. Daily cap 25 touches, 4 minutes apart on LinkedIn, 20 seconds apart on Instagram.
3. Every number and name from a screen, source named. Else UNKNOWN.
4. Log every touch in GHL.

## Batch 1 Oct 17 (interior designers, Miami, LinkedIn)
1. 18 leads captured from LinkedIn search "luxury interior design founder principal owner", Miami, pages 1 and 2 (V). Drive sheet "Buyer Scout interior designers Miami LinkedIn 2026-10-17" in Chief of Staff.
2. GHL FLY Miami Art (V): 18 contacts created (contacts 2171 to 2189), tags seg-designer and src-linkedin added by bulk action, 18 opportunities in pipeline Art Buyers Outbound, stage Found.
3. Contacts have name only. No email or phone. Company, role, source URL live in the Drive sheet, not yet in GHL fields.
4. Nothing sent. First message draft waits for owner approval.
5. Built in browser is the preferred browser. GHL, Google Calendar and LinkedIn are signed in there. Chief never types or stores passwords.

## GHL config Oct 17 (V = verified)
1. Custom fields created in FLY Miami Art: Role, LinkedIn URL (folder Additional Info) (V).
2. Business name filled for 15 of 18 contacts, 3 UNKNOWN left blank (V, list view).
3. Role and LinkedIn URL entered on all 18 by hand. Spot checked on 8 contacts (V). Others not re checked.
4. Tags seg-designer and src-linkedin confirmed on all 18 (V).
5. Known UI quirk: the first field typed after a contact page loads is dropped. Enter a throwaway value first.
6. Nothing sent. First message waits for owner yes.

## LinkedIn DM templates, draft Oct 22 2026 (owner order: 2 types, written BEFORE the agent sends)
Status: DRAFT. Nothing sent. Waits for owner approval of the text.
Slots: {first_name}, {their_work} (their firm, project or role), {their_post_or_role}, {hook} (one real detail from their profile or a recent post).
Rule: every slot must come from a page I opened. If no real detail exists, use the fallback line. Never invent a detail.
Rule: connection notes are under 190 characters. LinkedIn note limit for the free account: UNKNOWN, so kept short.

### Type A: trade buyers (seg-designer, seg-realtor, seg-developer, seg-hospitality, seg-city, seg-advisor)
Connection note (182 characters):
Hi {first_name}, I'm Facundo, a Miami artist behind the Duck With Pride installation on Lincoln Road. I liked {their_work}. Would love to connect and share my work for your projects.

Follow up after they accept:
Thanks for connecting, {first_name}. {hook}. I build statement pieces from thousands of mini rubber ducks, some glow under UV light. The theme is joy and love over hate. If you have a space or a client who needs a piece with a story, I can send a short portfolio. Anything coming up where art fits?
Facundo | FLY
flymiami.art

Fallback hook: I saw the work your team does in Miami and it stayed with me.

### Type B: private buyers (seg-collector, wealth managers, bankers, seg-media)
Connection note (186 characters):
Hi {first_name}, I'm Facundo Yebne, a Miami artist. I make pieces from thousands of mini rubber ducks, some glow under UV. I saw {their_post_or_role} and thought you might enjoy my work.

Follow up after they accept:
Thanks for connecting, {first_name}. {hook}. My originals are at flymiami.art, each one signed with a certificate of authenticity. If a piece catches your eye I can send details, or hold it for a week with a small deposit that counts toward the purchase. Which one speaks to you?
Facundo | FLY

Spanish version for LatAm leads (Type B):
Hola {first_name}, soy Facundo Yebne, artista en Miami. Hago obras con miles de patitos de goma, algunas brillan con luz UV. Vi {their_post_or_role} y pensé que te podría gustar mi trabajo. Mis obras están en flymiami.art, todas firmadas y con certificado de autenticidad. Si alguna te llama la atención, te mando los detalles.

### Facts behind the text (V)
1. Duck With Pride on Lincoln Road 2025: ME.md, Lincoln Road bio.
2. Some pieces glow under UV, theme joy and love over hate: ME.md.
3. Signed plus certificate of authenticity lines: owner rule for collctn.art, Oct 16.
4. Deposit holds a piece one week and counts toward purchase: owner, Oct 11. Amount ($50 or $100) not stated in the DM on purpose. Refund policy U.
5. No price in any first message. Prices only from flymiami.art.

### Agent run rules (LinkedIn)
1. Sourcing order: interior designers first, then the other segments.
2. Free LinkedIn account, by hand pace in the built in browser, one profile at a time, no mass tools, no scraping behind login.
3. Open each profile and recent posts, write the slots from what is on screen, log source URL in GHL.
4. Cap 25 touches a day, 4 minutes apart. Daily batch shown to owner for approval until owner says auto.
5. Every touch logged in GHL, pipeline Art Buyers Outbound, stage Contacted.
6. Sales Navigator cancel: owner does it in Apple subscriptions, blocked for the chief.
