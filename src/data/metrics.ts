// Real metrics pulled from Windsor.ai (Google Ads, Instagram, Google My Business).
// All monetary values are in CENTS. Social/GMB values are raw counts.
// Last refreshed: 2025-05-25.

export interface EntityMetrics {
  entitySlug: string;
  asOf: string;

  // Financial — still $0 until accounting integrations land
  cashCents: number;
  monthRevenueCents: number;
  monthExpensesCents: number;
  arOutstandingCents: number;
  apOutstandingCents: number;

  // Paid ads
  adSpendMtdCents: number;
  adRevenueMtdCents: number;
  adSpendLastYearCents: number;
  adClicksLastYear: number;
  adImpressionsLastYear: number;

  // Instagram
  igFollowers: number;
  igPosts: number;
  igViews30d: number;
  igLikes30d: number;
  igComments30d: number;
  igShares30d: number;
  igBio: string;

  // Google My Business (30d)
  gmbImpressions30d: number;
  gmbClicks30d: number;
  gmbWebsiteClicks30d: number;
  gmbCallClicks30d: number;
  gmbDirectionRequests30d: number;

  // Operations
  openTasks: number;
  alerts: number;
}

const NOW = new Date().toISOString();

export const ENTITY_METRICS: Record<string, EntityMetrics> = {
  "fly-miami-art": {
    entitySlug: "fly-miami-art",
    asOf: NOW,
    cashCents: 0,
    monthRevenueCents: 0,
    monthExpensesCents: 0,
    arOutstandingCents: 0,
    apOutstandingCents: 0,
    adSpendMtdCents: 0,
    adRevenueMtdCents: 0,
    adSpendLastYearCents: 66868,
    adClicksLastYear: 29964,
    adImpressionsLastYear: 1485278,
    igFollowers: 18186,
    igPosts: 239,
    igViews30d: 15884,
    igLikes30d: 756,
    igComments30d: 85,
    igShares30d: 33,
    igBio: "Miami Public Artist · Rubber Duck Pop Art · Florence Biennale Award Winner",
    gmbImpressions30d: 292 + 925 + 78,
    gmbClicks30d: 7,
    gmbWebsiteClicks30d: 5,
    gmbCallClicks30d: 2,
    gmbDirectionRequests30d: 30 + 67 + 25,
    openTasks: 0,
    alerts: 1,
  },
  "pilates-miami": {
    entitySlug: "pilates-miami",
    asOf: NOW,
    cashCents: 0,
    monthRevenueCents: 0,
    monthExpensesCents: 0,
    arOutstandingCents: 0,
    apOutstandingCents: 0,
    adSpendMtdCents: 0,
    adRevenueMtdCents: 0,
    adSpendLastYearCents: 0,
    adClicksLastYear: 0,
    adImpressionsLastYear: 0,
    igFollowers: 4861,
    igPosts: 233,
    igViews30d: 3541,
    igLikes30d: 42,
    igComments30d: 2,
    igShares30d: 1,
    igBio: "Be the good energy you want to attract · PILATES REFORMER",
    gmbImpressions30d: 1981,
    gmbClicks30d: 134,
    gmbWebsiteClicks30d: 126,
    gmbCallClicks30d: 8,
    gmbDirectionRequests30d: 62,
    openTasks: 0,
    alerts: 0,
  },
  "atelier-liquor-deli": {
    entitySlug: "atelier-liquor-deli",
    asOf: NOW,
    cashCents: 0,
    monthRevenueCents: 0,
    monthExpensesCents: 0,
    arOutstandingCents: 0,
    apOutstandingCents: 0,
    adSpendMtdCents: 0,
    adRevenueMtdCents: 0,
    adSpendLastYearCents: 0,
    adClicksLastYear: 0,
    adImpressionsLastYear: 0,
    igFollowers: 0,
    igPosts: 0,
    igViews30d: 0,
    igLikes30d: 0,
    igComments30d: 0,
    igShares30d: 0,
    igBio: "",
    gmbImpressions30d: 1876,
    gmbClicks30d: 21,
    gmbWebsiteClicks30d: 12,
    gmbCallClicks30d: 9,
    gmbDirectionRequests30d: 124,
    openTasks: 0,
    alerts: 1,
  },
};

function emptyMetrics(slug: string): EntityMetrics {
  return {
    entitySlug: slug,
    asOf: NOW,
    cashCents: 0,
    monthRevenueCents: 0,
    monthExpensesCents: 0,
    arOutstandingCents: 0,
    apOutstandingCents: 0,
    adSpendMtdCents: 0,
    adRevenueMtdCents: 0,
    adSpendLastYearCents: 0,
    adClicksLastYear: 0,
    adImpressionsLastYear: 0,
    igFollowers: 0,
    igPosts: 0,
    igViews30d: 0,
    igLikes30d: 0,
    igComments30d: 0,
    igShares30d: 0,
    igBio: "",
    gmbImpressions30d: 0,
    gmbClicks30d: 0,
    gmbWebsiteClicks30d: 0,
    gmbCallClicks30d: 0,
    gmbDirectionRequests30d: 0,
    openTasks: 0,
    alerts: 0,
  };
}

export function metricsFor(slug: string): EntityMetrics {
  return ENTITY_METRICS[slug] ?? emptyMetrics(slug);
}

export function rollupMetrics(slugs: string[]) {
  const all = slugs.map(metricsFor);
  return {
    cashCents: sum(all, "cashCents"),
    monthRevenueCents: sum(all, "monthRevenueCents"),
    monthExpensesCents: sum(all, "monthExpensesCents"),
    arOutstandingCents: sum(all, "arOutstandingCents"),
    apOutstandingCents: sum(all, "apOutstandingCents"),
    adSpendMtdCents: sum(all, "adSpendMtdCents"),
    adSpendLastYearCents: sum(all, "adSpendLastYearCents"),
    adClicksLastYear: sum(all, "adClicksLastYear"),
    adImpressionsLastYear: sum(all, "adImpressionsLastYear"),
    igFollowers: sum(all, "igFollowers"),
    igViews30d: sum(all, "igViews30d"),
    igLikes30d: sum(all, "igLikes30d"),
    gmbImpressions30d: sum(all, "gmbImpressions30d"),
    gmbClicks30d: sum(all, "gmbClicks30d"),
    gmbDirectionRequests30d: sum(all, "gmbDirectionRequests30d"),
    openTasks: sum(all, "openTasks"),
    alerts: sum(all, "alerts"),
  };
}

function sum(rows: EntityMetrics[], key: keyof EntityMetrics): number {
  return rows.reduce((acc, r) => acc + (r[key] as number || 0), 0);
}
