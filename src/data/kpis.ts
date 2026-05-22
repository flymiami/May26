// Placeholder KPI snapshots so the dashboard has structure before integrations
// land. All monetary values are in CENTS (USD) to preserve "to the penny"
// precision — never store dollars as floats.

import type { Entity } from "./entities";

export interface EntityKpis {
  entitySlug: string;
  asOf: string; // ISO date
  cashCents: number;
  monthRevenueCents: number;
  monthExpensesCents: number;
  arOutstandingCents: number;
  apOutstandingCents: number;
  adSpendMtdCents: number;
  adRevenueMtdCents: number;
  /** open task count */
  openTasks: number;
  /** flagged items that need user attention */
  alerts: number;
}

export const PLACEHOLDER_KPIS: Record<string, EntityKpis> = {
  "design-suites-miami": kpi("design-suites-miami"),
  "atelier-liquor-deli": kpi("atelier-liquor-deli"),
  "fly-future": kpi("fly-future"),
  "fly-amazon": kpi("fly-amazon"),
  "fly-miami-art": kpi("fly-miami-art"),
  "travel-rentals": kpi("travel-rentals"),
  "pilates-miami": kpi("pilates-miami"),
};

function kpi(slug: string): EntityKpis {
  return {
    entitySlug: slug,
    asOf: new Date().toISOString(),
    cashCents: 0,
    monthRevenueCents: 0,
    monthExpensesCents: 0,
    arOutstandingCents: 0,
    apOutstandingCents: 0,
    adSpendMtdCents: 0,
    adRevenueMtdCents: 0,
    openTasks: 0,
    alerts: 0,
  };
}

export function kpisFor(entity: Entity): EntityKpis {
  return PLACEHOLDER_KPIS[entity.slug] ?? kpi(entity.slug);
}

export function portfolioRollup(list: Entity[]) {
  const k = list.map(kpisFor);
  return {
    cashCents: sum(k, "cashCents"),
    monthRevenueCents: sum(k, "monthRevenueCents"),
    monthExpensesCents: sum(k, "monthExpensesCents"),
    arOutstandingCents: sum(k, "arOutstandingCents"),
    apOutstandingCents: sum(k, "apOutstandingCents"),
    adSpendMtdCents: sum(k, "adSpendMtdCents"),
    adRevenueMtdCents: sum(k, "adRevenueMtdCents"),
    openTasks: k.reduce((a, b) => a + b.openTasks, 0),
    alerts: k.reduce((a, b) => a + b.alerts, 0),
  };
}

function sum<K extends keyof EntityKpis>(
  rows: EntityKpis[],
  key: K,
): number {
  return rows.reduce((acc, r) => acc + (r[key] as number), 0);
}
