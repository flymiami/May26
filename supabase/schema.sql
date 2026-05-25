-- May26 Business Portal — initial schema.
-- Run this in Supabase SQL editor after the project is created.
-- Money is stored in CENTS as bigint to preserve "to the penny" precision.

create extension if not exists "uuid-ossp";

-- ─── Tenancy ────────────────────────────────────────────────────────────────
-- A single workspace owns multiple entities. Most installations will have
-- one workspace; we still keep the column so multi-workspace becomes a
-- single FK change later.
create table if not exists workspaces (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists users_profile (
  user_id uuid primary key references auth.users(id) on delete cascade,
  workspace_id uuid not null references workspaces(id) on delete cascade,
  full_name text,
  role text not null check (role in ('owner','admin','operator','accountant','viewer')) default 'viewer',
  created_at timestamptz not null default now()
);

-- ─── Entities ───────────────────────────────────────────────────────────────
create table if not exists entities (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  slug text not null,
  legal_name text not null,
  short_name text not null,
  legal_suffix text not null check (legal_suffix in ('Inc','LLC','Corp')),
  state text not null,
  status text not null check (status in ('active','holding','dormant')) default 'active',
  kind text not null,
  parent_id uuid references entities(id) on delete set null,
  color text not null default '#64748B',
  blurb text,
  notes text[],
  created_at timestamptz not null default now(),
  unique (workspace_id, slug)
);

-- Per-entity scope: who can see/edit which entity
create table if not exists entity_memberships (
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_id uuid not null references entities(id) on delete cascade,
  scope text not null check (scope in ('read','write','admin')) default 'read',
  primary key (user_id, entity_id)
);

-- ─── Finance: chart of accounts + transactions ──────────────────────────────
create table if not exists accounts (
  id uuid primary key default uuid_generate_v4(),
  entity_id uuid not null references entities(id) on delete cascade,
  code text,
  name text not null,
  type text not null check (type in ('asset','liability','equity','revenue','expense')),
  parent_id uuid references accounts(id) on delete set null,
  is_cash boolean not null default false,
  external_id text,
  external_source text,
  created_at timestamptz not null default now(),
  unique (entity_id, code)
);

create table if not exists transactions (
  id uuid primary key default uuid_generate_v4(),
  entity_id uuid not null references entities(id) on delete cascade,
  occurred_on date not null,
  posted_on date,
  memo text,
  external_id text,
  external_source text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

-- Double-entry. Sum of amount_cents per transaction MUST equal 0.
create table if not exists transaction_lines (
  id uuid primary key default uuid_generate_v4(),
  transaction_id uuid not null references transactions(id) on delete cascade,
  account_id uuid not null references accounts(id),
  amount_cents bigint not null, -- + debit, - credit
  description text
);

create index if not exists transactions_entity_occurred_idx
  on transactions (entity_id, occurred_on desc);
create index if not exists transaction_lines_transaction_idx
  on transaction_lines (transaction_id);

-- Trial-balance sanity check trigger
create or replace function tx_balance_check() returns trigger as $$
declare
  total bigint;
begin
  select coalesce(sum(amount_cents), 0) into total
    from transaction_lines
    where transaction_id = coalesce(NEW.transaction_id, OLD.transaction_id);
  if total <> 0 then
    raise exception 'Transaction % is unbalanced: sum=% cents', coalesce(NEW.transaction_id, OLD.transaction_id), total;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists tx_balance_check_trg on transaction_lines;
create constraint trigger tx_balance_check_trg
  after insert or update or delete on transaction_lines
  deferrable initially deferred
  for each row execute function tx_balance_check();

-- ─── Bank accounts (Plaid mirror) ───────────────────────────────────────────
create table if not exists bank_accounts (
  id uuid primary key default uuid_generate_v4(),
  entity_id uuid not null references entities(id) on delete cascade,
  name text not null,
  institution text,
  mask text,
  external_id text,
  external_source text,
  balance_cents bigint not null default 0,
  balance_as_of timestamptz,
  account_id uuid references accounts(id)
);

-- ─── Ads ────────────────────────────────────────────────────────────────────
create table if not exists ad_accounts (
  id uuid primary key default uuid_generate_v4(),
  entity_id uuid not null references entities(id) on delete cascade,
  platform text not null check (platform in ('google','meta','tiktok','linkedin')),
  external_id text not null,
  name text,
  created_at timestamptz not null default now()
);

create table if not exists ad_campaigns (
  id uuid primary key default uuid_generate_v4(),
  ad_account_id uuid not null references ad_accounts(id) on delete cascade,
  external_id text,
  name text not null,
  status text not null check (status in ('draft','active','paused','archived')) default 'draft',
  daily_budget_cents bigint,
  objective text,
  starts_on date,
  ends_on date
);

create table if not exists ad_metrics_daily (
  ad_campaign_id uuid not null references ad_campaigns(id) on delete cascade,
  day date not null,
  spend_cents bigint not null default 0,
  impressions int not null default 0,
  clicks int not null default 0,
  conversions int not null default 0,
  conversion_value_cents bigint not null default 0,
  primary key (ad_campaign_id, day)
);

-- ─── Operations: tasks + docs + contacts ───────────────────────────────────
create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  entity_id uuid references entities(id) on delete set null,
  title text not null,
  body text,
  status text not null check (status in ('open','in_progress','blocked','done','cancelled')) default 'open',
  priority text not null check (priority in ('low','normal','high','urgent')) default 'normal',
  due_on date,
  assignee uuid references auth.users(id),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists documents (
  id uuid primary key default uuid_generate_v4(),
  entity_id uuid references entities(id) on delete set null,
  title text not null,
  storage_path text,
  kind text,
  uploaded_by uuid references auth.users(id),
  uploaded_at timestamptz not null default now()
);

create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  entity_id uuid references entities(id) on delete set null,
  full_name text not null,
  role text,
  email text,
  phone text,
  notes text
);

-- ─── Audit log ──────────────────────────────────────────────────────────────
create table if not exists audit_log (
  id bigserial primary key,
  occurred_at timestamptz not null default now(),
  user_id uuid references auth.users(id),
  entity_id uuid references entities(id),
  action text not null,
  target_table text,
  target_id uuid,
  payload jsonb
);

-- ─── Row-level security ─────────────────────────────────────────────────────
alter table entities enable row level security;
alter table accounts enable row level security;
alter table transactions enable row level security;
alter table transaction_lines enable row level security;
alter table bank_accounts enable row level security;
alter table ad_accounts enable row level security;
alter table ad_campaigns enable row level security;
alter table ad_metrics_daily enable row level security;
alter table tasks enable row level security;
alter table documents enable row level security;
alter table contacts enable row level security;

-- A user can see an entity if they have a membership row for it OR they are
-- an owner/admin on the workspace.
create or replace function current_user_can_read_entity(target uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from entity_memberships m
      where m.user_id = auth.uid() and m.entity_id = target
  ) or exists (
    select 1 from users_profile p
      join entities e on e.workspace_id = p.workspace_id
      where p.user_id = auth.uid() and e.id = target
        and p.role in ('owner','admin')
  );
$$;

create policy "read own entity" on entities
  for select using (current_user_can_read_entity(id));

create policy "read entity-scoped accounts" on accounts
  for select using (current_user_can_read_entity(entity_id));
create policy "read entity-scoped transactions" on transactions
  for select using (current_user_can_read_entity(entity_id));
create policy "read entity-scoped tx lines" on transaction_lines
  for select using (
    current_user_can_read_entity(
      (select entity_id from transactions t where t.id = transaction_id)
    )
  );
create policy "read entity-scoped bank" on bank_accounts
  for select using (current_user_can_read_entity(entity_id));
create policy "read entity-scoped ad accounts" on ad_accounts
  for select using (current_user_can_read_entity(entity_id));
create policy "read entity-scoped ad campaigns" on ad_campaigns
  for select using (
    current_user_can_read_entity(
      (select entity_id from ad_accounts a where a.id = ad_account_id)
    )
  );
create policy "read entity-scoped ad metrics" on ad_metrics_daily
  for select using (
    current_user_can_read_entity(
      (select a.entity_id from ad_accounts a
         join ad_campaigns c on c.ad_account_id = a.id
         where c.id = ad_campaign_id)
    )
  );
create policy "read entity-scoped tasks" on tasks
  for select using (entity_id is null or current_user_can_read_entity(entity_id));
create policy "read entity-scoped docs" on documents
  for select using (entity_id is null or current_user_can_read_entity(entity_id));
create policy "read entity-scoped contacts" on contacts
  for select using (entity_id is null or current_user_can_read_entity(entity_id));

-- Write policies are intentionally tighter; mirror as needed when wiring forms.
