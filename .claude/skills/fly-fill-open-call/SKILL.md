---
name: fly-fill-open-call
description: Draft ready-to-paste application materials (artist statement, project description, work samples, contact info) for an open call, grant, commission, or residency tracked in the "FLY — Open Calls, Grants & Commissions" Airtable base. Use when Facundo/FLY asks to fill out, draft, apply to, or prepare an application for one of the tracked opportunities, or asks what's next to submit.
---

# Fill an Open Call (FLY)

Drafts a complete, ready-to-paste application for one opportunity in the **FLY — Open Calls, Grants & Commissions** Airtable base (base id `appkX37dG8G3ykb9S`), reusing the artist's existing bio, statements, and work-sample captions instead of re-deriving them each time.

This skill only **drafts**. It never submits anything to an external portal, never emails a submission, and never marks an opportunity "Submitted" — that action belongs to Facundo alone, since submitting to an external competition is not reversible.

## Base layout

- **Opportunities** (`tbl3wVbF1sSv8BtAJ`) — one row per open call/grant/commission/residency/fair. Key fields: Opportunity, Category, Status, Deadline Date, Deadline Notes, Prize/Value, Fee, Eligibility/Location, Why It Fits, Link, Pursue?, Application Status, Notes/Next Action.
- **Work Samples** (`tblpVoZBPUqLklSCM`) — the reusable captioned portfolio (Title, Year, Venue/Client, Medium, Caption/Description). This is the master image list every application draws from.
- **Artist Kit** (`tbl4aVVP24d2RmaGp`) — reusable text blocks by `Item`: Short Bio, Long Bio, Movement Paragraph, Artist Statement — 250 words, Artist Statement — 150 words, Contact Block, Exhibition History, Press List, and "Open Facts Needed From FLY" (the running list of unconfirmed facts).

## Process

1. **Pick the target.** If Facundo names an opportunity, look it up by name in Opportunities. If he says "what's next," list records where `Pursue?` = true and `Application Status` is `Not Started` or `Needs Input From FLY`, sorted by Deadline Date, and ask which to draft (or draft the nearest deadline if he says "go ahead").
2. **Read the source material.** Pull the target's full Opportunities row, all Work Samples records, and all Artist Kit records.
3. **Match the format to the call.** Check the opportunity's Prize/Value, Fee, Eligibility, and Notes/Next Action for the actual required components (word limits, image counts, specific categories, portal type — form vs. email vs. profile page). Do not assume every call wants the same shape; a mural open call needs a short pitch email, a prize with a portal needs a statement plus captioned images, a profile-based prize (like Foundwork) needs an ordered work list plus a statement.
4. **Draft, don't invent.** Reuse the Artist Kit text blocks verbatim or lightly adapted to the word limit; pull captions straight from Work Samples. Any fact not present in the base (dimensions, budgets, a headshot choice, financial circumstances, whether a workshop was attended) must be left as `[CONFIRM: ...]` exactly as flagged in "Open Facts Needed From FLY" — never fabricate a number, date, or claim to fill a gap.
5. **Write the draft back.**
   - For a short draft (an email, a short-form profile bio): write it directly into that opportunity's `Notes / Next Action` field via `update_records_for_table`, prefixed `DRAFT (ready to paste):`.
   - For a long, multi-section draft (a full grant application with several components): create a Google Doc via the Drive tools titled `FLY Draft — <Opportunity Name>`, and put the doc's link in `Notes / Next Action`.
6. **Update status.** Set `Application Status` to `Drafted — Ready to Paste`. Never set it to `Submitted` or `Selected / Won` — only Facundo updates those after he acts outside this session.
7. **Report back.** Tell Facundo what was drafted, where to find it, and exactly which `[CONFIRM: ...]` items (if any) are blocking a clean paste-and-submit.

## Guardrails

- Never invent eligibility, deadlines, fees, or amounts — if the Opportunities row doesn't have it and a fresh web check is needed, say so instead of guessing.
- Never submit, email, or click "apply" on Facundo's behalf. The output is always a draft he reviews and sends himself.
- Never overwrite an existing `Drafted — Ready to Paste` draft without being asked — if a draft already exists, ask whether to revise it or leave it.
