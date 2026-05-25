# May26 — Centralized Business Portal

A single place to manage the FY corporate portfolio: push ads, hold finances
to the penny, and run operations across every entity.

## Portfolio scope

**Active (5)** — operating entities with real activity:

- **Design Suites Miami Inc** — commercial real estate (parent of Atelier)
- **Atelier Liquor & Deli** — convenience store
- **FLY Future LLC** — holding parent of FLY Amazon + FLY Miami Art
- **Travel Rentals Corp** — merchant services for Argentine hotels
- **Pilates Miami LLC** — fitness studio

**Holding / dormant (7)** — real-estate title-holders with minimal activity,
still tracked so balances surface in the rollup.

## Day-1 priorities (the order the UI is built around)

1. **Ads** — Google + Meta, per-entity ROAS
2. **Finance** — P&L, cash, AR/AP to the penny
3. **Operations** — tasks, docs, contacts
4. **Executive dashboard** — the forest view, fed by 1–3

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + shadcn-style primitives (Radix UI)
- **Supabase** (Postgres + Auth + Row-Level Security)
- **Vercel** for hosting (recommended)

## Running locally

```bash
pnpm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
pnpm dev
```

The app will run without Supabase credentials — every page renders from the
typed seed in `src/data/entities.ts` and `src/data/kpis.ts`. As soon as
`.env.local` is filled, the same screens can be wired to the live database.

## Database

`supabase/schema.sql` defines the full schema:

- **Tenancy:** workspaces, users_profile, entity_memberships (per-entity scopes)
- **Entities:** the corporate registry with parent-child ownership
- **Finance:** double-entry `transactions` / `transaction_lines`, accounts,
  bank_accounts. Money in cents (`bigint`). Trial-balance trigger refuses any
  transaction whose lines don't sum to zero.
- **Ads:** ad_accounts, ad_campaigns, ad_metrics_daily
- **Operations:** tasks, documents, contacts
- **Audit:** append-only `audit_log`
- **RLS:** policies scope reads to the user's entity memberships

`supabase/seed.sql` seeds all 12 corps idempotently.

## Phase 2+ integrations

In the order they unlock the most value, wire these next:

1. **Google Ads** + **Meta Ads** — pull spend/insights, push campaign drafts
2. **QuickBooks Online** — Design Suites P&L / Balance Sheet / AR / AP
3. **Google Sheets** — import Ignacio's Travel Rentals workbook on a schedule
4. **Plaid** — bank balances for every entity (including the holding corps)
5. **Stripe** — Pilates Miami, FLY Miami Art
6. **Amazon Seller** — FLY Amazon settlement reports
7. **Gmail** — parse vendor invoices and receipts into AP automatically

Each lives behind `src/app/(app)/settings/integrations/page.tsx` and reads
credentials from environment variables documented in `.env.example`.

## Project layout

```
src/
  app/
    (app)/              authenticated shell — sidebar + topbar + main
      dashboard/        executive rollup
      entities/         portfolio registry + [entity]/ drill-in
      ads/              Google + Meta dashboards
      finance/          P&L + AR/AP + cash
      operations/       tasks + docs + contacts
      settings/         integrations, team, etc.
    layout.tsx          root layout
    page.tsx            redirect to /dashboard
  components/
    shell/              sidebar, topbar, entity switcher, page header
    dashboard/          KPI cards etc.
    ui/                 shadcn-style primitives
  data/
    entities.ts         typed registry seed (mirrors `entities` table)
    kpis.ts             placeholder KPI snapshots
  lib/
    supabase/           server + browser clients
    utils.ts            cn, formatMoney, etc.
supabase/
  schema.sql            full DDL
  seed.sql              idempotent portfolio seed
```
