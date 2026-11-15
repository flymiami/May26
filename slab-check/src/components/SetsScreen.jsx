import { useMemo, useState } from 'react';
import { SETS, SERIES } from '../../shared/sets.js';

/**
 * Every English expansion, searchable offline. The point of this screen is the
 * number printed after the slash on a card: type it in and you learn which set
 * the card is from.
 */
export default function SetsScreen() {
  const [q, setQ] = useState('');
  const [series, setSeries] = useState('All');

  const query = q.trim().toLowerCase();
  const asTotal = /^\d+$/.test(query) ? Number(query) : null;

  const rows = useMemo(() => {
    let list = SETS;
    if (series !== 'All') list = list.filter((s) => s.series === series);
    if (!query) return list;
    if (asTotal !== null) {
      const exact = list.filter((s) => s.cards === asTotal);
      const near = list.filter((s) => s.cards !== asTotal && String(s.cards).startsWith(query));
      return [...exact, ...near];
    }
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.series.toLowerCase().includes(query) ||
        (s.abb || '').toLowerCase().includes(query)
    );
  }, [query, series, asTotal]);

  const exactCount = asTotal === null ? 0 : rows.filter((s) => s.cards === asTotal).length;

  return (
    <div className="space-y-4 px-4 py-4">
      <div className="card p-4">
        <p className="label">Find a set</p>
        <input
          className="field mt-1 text-lg"
          placeholder="Type a set total (103) or a name"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          inputMode="search"
        />
        <p className="mt-2 text-xs text-slate-500">
          The number after the slash on your card is the set total. Type it here to see which set
          it is. {SETS.length} English expansions, works offline.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {['All', ...SERIES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSeries(s)}
            className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold ${
              s === series
                ? 'bg-emerald-500 text-slate-950'
                : 'border border-slate-300 dark:border-slate-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {asTotal !== null && (
        <p
          className={`rounded-xl px-3 py-2 text-sm ${
            exactCount === 1
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : exactCount === 0
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                : 'bg-slate-500/10 text-slate-600 dark:text-slate-300'
          }`}
        >
          {exactCount === 1 && `One English set prints /${asTotal}. That is your card.`}
          {exactCount === 0 &&
            `No English main set has ${asTotal} cards. Your number may be the card number, not the total, or the card may be Japanese.`}
          {exactCount > 1 && `${exactCount} English sets print /${asTotal}. Check the set symbol.`}
        </p>
      )}

      <p className="px-1 text-xs text-slate-500">
        {rows.length} {rows.length === 1 ? 'set' : 'sets'}
      </p>

      <div className="space-y-2">
        {rows.map((s) => (
          <div key={`${s.name}-${s.released}`} className="card p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-bold">{s.name}</p>
                <p className="truncate text-xs text-slate-500">
                  {[s.series, s.released].filter(Boolean).join(' · ')}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="num text-xl font-black">
                  {s.cards ? `/${s.cards}` : '—'}
                </p>
                {s.abb && <p className="text-[10px] font-bold text-slate-500">{s.abb}</p>}
              </div>
            </div>
            {s.detail && s.detail !== String(s.cards) && (
              <p className="mt-1 text-xs text-slate-500">{s.detail}</p>
            )}
          </div>
        ))}
        {rows.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">Nothing matches that.</p>
        )}
      </div>
    </div>
  );
}
