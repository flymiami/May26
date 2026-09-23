import { money, profitAt } from '../lib/pricing.js';

export default function PriceLadder({ ladder, settings, bid, target, onTarget }) {
  const hasBid = Number.isFinite(bid) && bid > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="grid grid-cols-[1fr_auto_auto] gap-2 bg-slate-100 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
        <span>Grade</span>
        <span className="text-right">Sold</span>
        <span className="w-28 text-right">{hasBid ? 'Profit at bid' : 'Max bid'}</span>
      </div>

      {ladder.map((row) => {
        const selected = row.grade === target;
        const profit = hasBid ? profitAt(row.price, bid, settings, row.chargeGrading) : null;
        const good = profit != null && profit >= 0;

        return (
          <button
            key={row.grade}
            type="button"
            onClick={() => onTarget(row.grade)}
            className={`grid w-full grid-cols-[1fr_auto_auto] items-center gap-2 border-t px-3 py-3 text-left transition
              ${selected
                ? 'border-emerald-500/40 bg-emerald-500/10'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40'}`}
          >
            <span className="min-w-0">
              <span className="block text-lg font-bold">
                {row.grade}
                {selected && <span className="ml-2 text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">target</span>}
              </span>
              <span className="block text-[11px] leading-tight text-slate-500 dark:text-slate-400">
                {row.volume ?? 'volume not shown'}
              </span>
              {row.chargeGrading && (
                <span className="block text-[11px] leading-tight text-slate-500 dark:text-slate-400">
                  +{money(settings.gradingCost, 0)} to grade
                </span>
              )}
            </span>

            <span className="num text-right text-xl font-bold">
              {row.price == null ? <span className="text-slate-400">no price</span> : money(row.price, 0)}
            </span>

            <span className="w-28 text-right">
              {hasBid ? (
                <span className={`num text-xl font-extrabold ${good ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {profit == null ? '—' : `${profit >= 0 ? '+' : ''}${money(profit, 0)}`}
                </span>
              ) : (
                <span className="num text-xl font-extrabold text-slate-700 dark:text-slate-200">
                  {row.maxBid == null ? '—' : money(row.maxBid, 0)}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
