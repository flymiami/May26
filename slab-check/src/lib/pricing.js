// The four rows the app shows, and the PriceCharting column each one reads.
export const ROWS = [
  { grade: 'Ungraded', column: 'Ungraded', needsGrading: false },
  { grade: 'PSA 8', column: 'Grade 8', needsGrading: true },
  { grade: 'PSA 9', column: 'Grade 9', needsGrading: true },
  { grade: 'PSA 10', column: 'PSA 10', needsGrading: true },
];

export const GRADES = ROWS.map((r) => r.grade);

export const DEFAULT_SETTINGS = {
  sellingFee: 13,   // %
  shipping: 5,      // $
  profitTarget: 20, // %
  buyerPremium: 0,  // %
  gradingCost: 25,  // $
};

const pct = (n) => Number(n || 0) / 100;

/**
 * Max bid = (price x (1 - sellingFee%) - shipping - gradingCost)
 *           / (1 + profitTarget%) / (1 + buyerPremium%)
 *
 * Grading cost is charged only on the graded rows, and only when the card in
 * hand is raw (you would have to pay to get it slabbed).
 */
export function maxBid(price, s, chargeGrading) {
  if (price == null || !Number.isFinite(price)) return null;
  const grading = chargeGrading ? Number(s.gradingCost || 0) : 0;
  const net = price * (1 - pct(s.sellingFee)) - Number(s.shipping || 0) - grading;
  return net / (1 + pct(s.profitTarget)) / (1 + pct(s.buyerPremium));
}

/** What you clear if you win at `bid` and sell at `price`. */
export function profitAt(price, bid, s, chargeGrading) {
  if (price == null || !Number.isFinite(price)) return null;
  if (bid == null || !Number.isFinite(bid)) return null;
  const grading = chargeGrading ? Number(s.gradingCost || 0) : 0;
  const revenue = price * (1 - pct(s.sellingFee));
  const cost = bid * (1 + pct(s.buyerPremium)) + Number(s.shipping || 0) + grading;
  return revenue - cost;
}

/**
 * Build the four-row ladder for a product.
 * `isRaw` decides whether the graded rows carry the grading cost.
 */
export function buildLadder(product, settings, isRaw) {
  const byLabel = Object.fromEntries((product?.ladder || []).map((r) => [r.label, r]));
  return ROWS.map(({ grade, column, needsGrading }) => {
    const src = byLabel[column] || {};
    const charge = isRaw && needsGrading;
    return {
      grade,
      column,
      price: src.price ?? null,
      volume: src.volume ?? null,
      chargeGrading: charge,
      maxBid: maxBid(src.price ?? null, settings, charge),
    };
  });
}

export const money = (n, dp = 2) =>
  n == null || !Number.isFinite(n)
    ? '—'
    : `${n < 0 ? '-' : ''}$${Math.abs(n).toLocaleString('en-US', {
        minimumFractionDigits: dp,
        maximumFractionDigits: dp,
      })}`;

export const money0 = (n) => money(n, 0);
