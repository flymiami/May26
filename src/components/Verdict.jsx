import { money } from '../lib/pricing.js';

/** One line, readable at arm's length, driven by the selected target row. */
export default function Verdict({ row, bid, settings }) {
  if (!row) return null;

  if (row.price == null) {
    return (
      <Box tone="muted" head="No price" sub={`PriceCharting has no ${row.grade} sales for this card.`} />
    );
  }

  const max = row.maxBid;
  if (max == null || max <= 0) {
    return (
      <Box
        tone="bad"
        head="Stop"
        sub={`${row.grade} at ${money(row.price, 0)} does not cover fees${
          row.chargeGrading ? ', shipping and grading' : ' and shipping'
        }. No bid works.`}
      />
    );
  }

  if (!Number.isFinite(bid) || bid <= 0) {
    return (
      <Box
        tone="neutral"
        head={`Max bid ${money(max, 0)}`}
        sub={`${row.grade} sells at ${money(row.price, 0)}. Type the live bid to see your room.`}
      />
    );
  }

  const room = max - bid;
  const premium = bid * (Number(settings.buyerPremium || 0) / 100);
  const premiumNote = premium > 0 ? ` · +${money(premium, 0)} premium` : '';

  return room >= 0 ? (
    <Box
      tone="good"
      head="Keep bidding"
      sub={`${money(room, 0)} of room left · max ${money(max, 0)} on ${row.grade}${premiumNote}`}
    />
  ) : (
    <Box
      tone="bad"
      head="Stop"
      sub={`${money(-room, 0)} over max · max ${money(max, 0)} on ${row.grade}${premiumNote}`}
    />
  );
}

const TONES = {
  good: 'bg-emerald-500 text-slate-950',
  bad: 'bg-rose-500 text-white',
  neutral: 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900',
  muted: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

const Box = ({ tone, head, sub }) => (
  <div className={`rounded-2xl px-4 py-4 ${TONES[tone]}`}>
    <p className="text-3xl font-black leading-tight">{head}</p>
    <p className="mt-1 text-sm font-semibold opacity-90">{sub}</p>
  </div>
);
