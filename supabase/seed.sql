-- Idempotent seed for the May26 portfolio.
-- Run after schema.sql. Requires one workspace row (created on first signup).

do $$
declare
  ws uuid;
begin
  select id into ws from workspaces limit 1;
  if ws is null then
    insert into workspaces (name) values ('FY Holdings') returning id into ws;
  end if;

  -- Active entities ---------------------------------------------------------
  insert into entities (workspace_id, slug, legal_name, short_name, legal_suffix, state, status, kind, color, blurb)
  values
    (ws, 'design-suites-miami', 'Design Suites Miami Inc', 'Design Suites Miami', 'Inc', 'FL', 'active', 'real_estate_op', '#0EA5E9', 'Commercial real estate — owns and operates the building.'),
    (ws, 'atelier-liquor-deli', 'Atelier Liquor and Deli', 'Atelier Liquor & Deli', 'Inc', 'FL', 'active', 'retail', '#F59E0B', 'Convenience store operating under Design Suites Miami Inc.'),
    (ws, 'fly-future', 'FLY Future LLC', 'FLY Future', 'LLC', 'FL', 'active', 'services', '#8B5CF6', 'Holding LLC for FLY Amazon and FLY Miami Art.'),
    (ws, 'fly-amazon', 'FLY Amazon Store', 'FLY Amazon', 'LLC', 'FL', 'active', 'ecommerce', '#10B981', 'Amazon storefront operated by FLY Future LLC.'),
    (ws, 'fly-miami-art', 'FLY Miami Art', 'FLY Miami Art', 'LLC', 'FL', 'active', 'art', '#EC4899', 'Art line operated by FLY Future LLC.'),
    (ws, 'travel-rentals', 'Travel Rentals Corp', 'Travel Rentals', 'Corp', 'FL', 'active', 'merchant_services', '#EF4444', 'Merchant services for hotels in Argentina.'),
    (ws, 'pilates-miami', 'Pilates Miami LLC', 'Pilates Miami', 'LLC', 'FL', 'active', 'fitness', '#14B8A6', 'Pilates studio — operational.')
  on conflict (workspace_id, slug) do nothing;

  -- Set parent relationships
  update entities set parent_id = (select id from entities where slug='design-suites-miami' and workspace_id=ws)
    where slug='atelier-liquor-deli' and workspace_id=ws;
  update entities set parent_id = (select id from entities where slug='fly-future' and workspace_id=ws)
    where slug in ('fly-amazon','fly-miami-art') and workspace_id=ws;

  -- Holding corps -----------------------------------------------------------
  for i in 1..7 loop
    insert into entities (workspace_id, slug, legal_name, short_name, legal_suffix, state, status, kind, color, blurb, notes)
    values (ws, 'holding-'||i, 'Holding Corp '||i, 'Holding '||i, 'LLC', 'FL', 'holding', 'real_estate_hold', '#64748B',
      'Holds title to real estate. Minimal activity — bank balance only.',
      array['Rename via Settings → Entities once the legal name is confirmed.'])
    on conflict (workspace_id, slug) do nothing;
  end loop;
end $$;
