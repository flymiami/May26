-- Slab Check: optional cloud mirror of the on-device collection.
-- Run this in the Supabase SQL editor, then set SUPABASE_URL and
-- SUPABASE_SERVICE_ROLE_KEY in Vercel. Skip it entirely to stay local-only.

create table if not exists public.slab_check_collection (
  device_id  text        not null,
  key        text        not null,           -- "<card_id>|<grade>"
  card_id    text        not null,
  name       text        not null,
  set_name   text,
  number     text,
  url        text        not null,
  grade      text        not null,           -- Ungraded | PSA 8 | PSA 9 | PSA 10
  qty        integer     not null default 1,
  paid_each  numeric,                        -- null = no cost recorded
  ladder     jsonb       not null default '[]'::jsonb,
  priced_at  timestamptz,
  added_at   timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (device_id, key)
);

create index if not exists slab_check_collection_device_idx
  on public.slab_check_collection (device_id);

-- Only the serverless function touches this table, and it uses the service
-- role key. RLS stays on with no anon policy so a leaked URL reads nothing.
alter table public.slab_check_collection enable row level security;
