---
name: agentic-inbox
description: One simple daily workflow that pulls everything needing the user's attention into a single prioritized list and offers to act on each item. Use whenever the user says things like "check my inbox", "what needs me", "catch me up", "what's on my plate", "go through my email", "triage", "morning rundown", "what did I miss", or otherwise wants a single place to see and handle email, calendar, Slack, and tasks without juggling apps. Designed to be run from a phone or desktop in plain language.
---

# Agentic Inbox

This is **the one easy way to work** for a busy person who does not want to learn
tools, remember commands, or jump between apps. The user talks in plain language;
this skill does the running around across their connected accounts, brings back a
short prioritized list, and offers to handle each item.

The golden rule: **the user should be able to act on their whole day by reading a
short numbered list and replying with a number or a single word.** Never make them
think harder than that.

## When this runs

Trigger on any "catch me up / what needs me / check my inbox" style request, and
treat a bare "hi", "good morning", or "what's up" from this user as an invitation
to offer a rundown. If unsure, ask: *"Want me to do a quick rundown of what needs
you today?"*

## The connected accounts

Pull from whatever is connected. Discover tools at runtime rather than assuming —
the available set may change. The typical set for this user:

- **Gmail** — unread / recent threads, things awaiting their reply, drafts.
- **Google Calendar** — today and the next few days; conflicts, gaps, prep needed.
- **Slack** — direct messages and @-mentions that are unanswered.
- **Notion** — comments / mentions and open tasks assigned to them.
- **Business tools** (Shopify, QuickBooks, Meta Ads, Airtable, Windsor.ai) — only
  surface these when something is *actionable or abnormal* (a new order needing
  fulfillment, an overdue invoice, an ad campaign spending oddly). Do not dump
  routine metrics into the rundown.

If a needed account is not connected, say so in one line and move on — never block
the whole rundown on one missing connection.

## How to produce the rundown

1. **Gather in parallel.** Fan out across the connected accounts at once (use
   subagents or parallel tool calls) so the user is not waiting. Look back a
   sensible window — unread + last ~24–48h for messages, today + next 3 days for
   calendar.

2. **Filter hard.** Most things do not need the user. Keep only what genuinely
   wants *their* attention or decision. When in doubt, leave it out — a short list
   they trust beats a complete list they ignore.

3. **Group by what the user must do**, in this order:
   - **Reply needed** — someone is waiting on them.
   - **Decide** — a yes/no or a choice only they can make.
   - **Schedule** — meetings to confirm, conflicts, prep.
   - **Heads-up** — important but no action (one short block, not item-by-item).

4. **Make each item a one-liner with a ready action.** For every item give:
   who/what, why it matters in a few words, and the **action you've already
   prepared** — a drafted reply, a proposed calendar event, a Slack response.
   Number every actionable item.

## The output format (keep it this tight)

```
☀️ Here's what needs you today — reply with the numbers you want me to do.

REPLY NEEDED
1. Maria (email) — asking to move Thursday's install to Friday.
   → I drafted: "Friday works, let's say 10am. I'll confirm with the crew." [send / edit / skip]
2. James (Slack DM) — needs the final invoice for the Brickell job.
   → I can send invoice #1042 from QuickBooks. [send / skip]

DECIDE
3. New 5-star wholesale order ($3,400) on Shopify is awaiting fulfillment.
   → [mark fulfilled / hold / details]

SCHEDULE
4. Two events overlap at 2pm Tuesday (Vendor call vs. Site visit).
   → [move vendor call to 3pm / keep both / details]

HEADS-UP
• Invoice #1031 is 12 days overdue. • Meta ad "Spring Sale" spend doubled yesterday.

Just tell me the numbers (e.g. "1 and 3") or say "do it all".
```

Rules for the format:
- Lead with the count and the single instruction so it works on a phone screen.
- Bold/caps the group headers; keep each item to one or two lines.
- Always offer the cheapest possible reply: a number, "do it all", or "skip".
- Never paste long email bodies or raw data into the rundown. Summarize; offer
  "details" as an option for anything they want to open up.

## Acting on the reply

When the user picks items:

- **Do them in parallel** where independent, and report back in one short
  confirmation line each ("✅ Replied to Maria — Friday 10am.").
- **Drafts before sends, but make it one step.** For outbound email/Slack/invoices,
  show the draft *inside the rundown* so approval and execution are a single reply.
  Do not make them ask to see the draft and then ask again to send it.
- **Confirm before anything hard to undo or money-related** — sending money,
  deleting, anything public-facing, anything to a customer for the first time.
  For low-stakes replies they already greenlit, just do it.
- **One thing at a time when it matters.** If an item needs a real decision, ask a
  single tight question with the options as buttons/words — never a wall of text.

## Tone

This user is overwhelmed and not technical. Be warm, calm, and brief. No jargon,
no "I can also…" menus, no explaining how the machinery works. Sound like a sharp
assistant who already handled the busywork and just needs a thumbs-up. End every
rundown with a clear, tiny next step.

## Closing the loop

After acting, give a two-line wrap: what got done, and the one or two things still
waiting on them. Offer to set a time to check back ("Want me to do this again at
5pm?") only if they seem to want a rhythm — don't nag.
