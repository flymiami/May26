// Source of truth for the corporate portfolio. Phase 1 keeps this as a
// typed seed so the UI can render before Supabase is wired. The same shape
// maps 1:1 to the `entities` table in supabase/schema.sql.

export type EntityStatus = "active" | "holding" | "dormant";

export type EntityKind =
  | "real_estate_op" // commercial real estate that earns rent
  | "real_estate_hold" // holds title to property, minimal activity
  | "retail"
  | "ecommerce"
  | "art"
  | "services"
  | "fitness"
  | "merchant_services";

export type AccountingSource =
  | "quickbooks"
  | "google_sheets"
  | "stripe"
  | "shopify"
  | "amazon_seller"
  | "manual";

export interface Entity {
  /** stable slug used in URLs and as a foreign key */
  slug: string;
  /** legal name */
  legalName: string;
  /** short name shown in the UI */
  shortName: string;
  /** LLC | Inc | Corp */
  legalSuffix: "Inc" | "LLC" | "Corp";
  state: "FL" | "DE" | "Other";
  status: EntityStatus;
  kind: EntityKind;
  /** slug of the entity that owns this one, if any */
  parentSlug?: string;
  /** colors used for badges/charts */
  color: string;
  /** one-line description visible in lists */
  blurb: string;
  /** where the books actually live today */
  accountingSources: AccountingSource[];
  /** people responsible (free-form labels for now) */
  contacts: { role: string; name: string; email?: string; note?: string }[];
  /** notes that should surface near the entity */
  notes?: string[];
}

export const entities: Entity[] = [
  // ── Active ─────────────────────────────────────────────────────────────────
  {
    slug: "design-suites-miami",
    legalName: "Design Suites Miami Inc",
    shortName: "Design Suites Miami",
    legalSuffix: "Inc",
    state: "FL",
    status: "active",
    kind: "real_estate_op",
    color: "#0EA5E9",
    blurb: "Commercial real estate — owns and operates the building.",
    accountingSources: ["quickbooks"],
    contacts: [
      { role: "Owner", name: "FY", email: "fy@designsuitesmiami.com" },
      { role: "Tax preparer", name: "Ignacio Zafatle", note: "Monthly taxes" },
    ],
    notes: ["QuickBooks may be out of date — first sync will reconcile."],
  },
  {
    slug: "atelier-liquor-deli",
    legalName: "Atelier Liquor and Deli",
    shortName: "Atelier Liquor & Deli",
    legalSuffix: "Inc",
    state: "FL",
    status: "active",
    kind: "retail",
    parentSlug: "design-suites-miami",
    color: "#F59E0B",
    blurb: "Convenience store operating under Design Suites Miami Inc.",
    accountingSources: ["manual"],
    contacts: [{ role: "Owner", name: "FY" }],
  },
  {
    slug: "fly-future",
    legalName: "FLY Future LLC",
    shortName: "FLY Future",
    legalSuffix: "LLC",
    state: "FL",
    status: "active",
    kind: "services",
    color: "#8B5CF6",
    blurb: "Holding LLC for FLY Amazon and FLY Miami Art.",
    accountingSources: ["manual"],
    contacts: [{ role: "Owner", name: "FY" }],
  },
  {
    slug: "fly-amazon",
    legalName: "FLY Amazon Store",
    shortName: "FLY Amazon",
    legalSuffix: "LLC",
    state: "FL",
    status: "active",
    kind: "ecommerce",
    parentSlug: "fly-future",
    color: "#10B981",
    blurb: "Amazon storefront operated by FLY Future LLC.",
    accountingSources: ["amazon_seller", "manual"],
    contacts: [{ role: "Owner", name: "FY" }],
  },
  {
    slug: "fly-miami-art",
    legalName: "FLY Miami Art",
    shortName: "FLY Miami Art",
    legalSuffix: "LLC",
    state: "FL",
    status: "active",
    kind: "art",
    parentSlug: "fly-future",
    color: "#EC4899",
    blurb: "Art line operated by FLY Future LLC.",
    accountingSources: ["manual"],
    contacts: [{ role: "Owner", name: "FY" }],
  },
  {
    slug: "travel-rentals",
    legalName: "Travel Rentals Corp",
    shortName: "Travel Rentals",
    legalSuffix: "Corp",
    state: "FL",
    status: "active",
    kind: "merchant_services",
    color: "#EF4444",
    blurb: "Merchant services for hotels in Argentina — runs out of Buenos Aires.",
    accountingSources: ["google_sheets"],
    contacts: [
      { role: "Operator", name: "Brother", note: "Day-to-day in Argentina" },
      { role: "Tax preparer", name: "Ignacio Zafatle", note: "Monthly taxes" },
    ],
    notes: ["Books live in Ignacio's Google Sheets — needs import."],
  },
  {
    slug: "pilates-miami",
    legalName: "Pilates Miami LLC",
    shortName: "Pilates Miami",
    legalSuffix: "LLC",
    state: "FL",
    status: "active",
    kind: "fitness",
    color: "#14B8A6",
    blurb: "Pilates studio — operational.",
    accountingSources: ["manual"],
    contacts: [{ role: "Owner", name: "FY" }],
  },

  // ── Holding / dormant ──────────────────────────────────────────────────────
  // 7 real-estate-holding corps. Names are placeholders — rename inline once
  // you confirm them; slugs are stable and safe to keep.
  ...holdingCorps(7),
];

function holdingCorps(n: number): Entity[] {
  return Array.from({ length: n }, (_, i) => {
    const idx = i + 1;
    return {
      slug: `holding-${idx}`,
      legalName: `Holding Corp ${idx}`,
      shortName: `Holding ${idx}`,
      legalSuffix: "LLC" as const,
      state: "FL" as const,
      status: "holding" as const,
      kind: "real_estate_hold" as const,
      color: "#64748B",
      blurb: "Holds title to real estate. Minimal activity — bank balance only.",
      accountingSources: ["manual" as const],
      contacts: [{ role: "Owner", name: "FY" }],
      notes: ["Rename via Settings → Entities once the legal name is confirmed."],
    };
  });
}

export function getEntity(slug: string): Entity | undefined {
  return entities.find((e) => e.slug === slug);
}

export function activeEntities(): Entity[] {
  return entities.filter((e) => e.status === "active");
}

export function entityTree(): { root: Entity; children: Entity[] }[] {
  const roots = entities.filter((e) => !e.parentSlug);
  return roots.map((root) => ({
    root,
    children: entities.filter((e) => e.parentSlug === root.slug),
  }));
}
