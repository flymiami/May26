import { GRADES } from '../lib/pricing.js';

/**
 * Photo-based PSA range for raw cards, plus the graded override.
 * `card` is null when the result came from a manual text search: the checkbox
 * and grade picker still work, there is just no photo to estimate from.
 */
export default function Condition({ card, graded, onGraded, target, onTarget }) {
  const c = card?.condition ?? null;
  const slab = card?.slab ?? null;

  return (
    <div className="card p-4 space-y-3">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={graded}
          onChange={(e) => onGraded(e.target.checked)}
          className="h-6 w-6 rounded accent-emerald-500"
        />
        <span className="font-semibold">This card is already graded</span>
      </label>

      {graded ? (
        <div>
          {slab ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Slab label read as{' '}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {slab.company} {slab.grade}
              </span>
              {slab.cert && <span className="text-slate-500"> · cert {slab.cert}</span>}
            </p>
          ) : (
            <p className="text-sm text-slate-500">No slab label was read. Pick the grade you hold.</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {GRADES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onTarget(g)}
                className={`rounded-xl px-4 py-2 text-sm font-bold ${
                  g === target
                    ? 'bg-emerald-500 text-slate-950'
                    : 'border border-slate-300 dark:border-slate-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Grading cost is not charged on any row: the card is already slabbed.
          </p>
        </div>
      ) : c ? (
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="num text-4xl font-black">
              PSA {c.psaLow}{c.psaHigh !== c.psaLow && `–${c.psaHigh}`}
            </span>
            <span
              className={`rounded-lg px-2 py-1 text-xs font-bold uppercase ${
                c.confidence === 'high'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : c.confidence === 'medium'
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
              }`}
            >
              {c.confidence} confidence
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {[
              ['Centering', c.centering],
              ['Corners', c.corners],
              ['Edges', c.edges],
              ['Surface', c.surface],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="label">{k}</dt>
                <dd className="text-slate-700 dark:text-slate-300">{v || '—'}</dd>
              </div>
            ))}
          </dl>

          {c.notes && <p className="text-sm text-slate-600 dark:text-slate-300">{c.notes}</p>}
          <p className="text-xs text-slate-500">
            Estimated from one photo. A photo cannot show every flaw, so treat this as a ceiling, not a promise.
          </p>
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          {card
            ? 'No condition estimate was returned for this photo.'
            : 'This card came from a text search, so there is no photo to grade. Snap it to get a PSA range.'}
        </p>
      )}
    </div>
  );
}
