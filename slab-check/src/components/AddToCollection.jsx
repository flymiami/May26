import { useEffect, useState } from 'react';
import { GRADES, money } from '../lib/pricing.js';

export default function AddToCollection({ product, settings, bid, defaultGrade, onAdd, onClose }) {
  const [grade, setGrade] = useState(defaultGrade || 'Ungraded');
  const [qty, setQty] = useState('1');
  const [paid, setPaid] = useState('');
  const [saving, setSaving] = useState(false);

  // Paid each prefills from the live bid plus the buyer premium.
  useEffect(() => {
    if (Number.isFinite(bid) && bid > 0) {
      setPaid((bid * (1 + Number(settings.buyerPremium || 0) / 100)).toFixed(2));
    }
  }, [bid, settings.buyerPremium]);

  const qtyN = Math.max(1, Math.floor(Number(qty) || 1));
  const paidN = paid.trim() === '' ? null : Number(paid);
  const paidBad = paid.trim() !== '' && !Number.isFinite(paidN);

  async function submit() {
    if (paidBad) return;
    setSaving(true);
    try {
      await onAdd({ grade, qty: qtyN, paidEach: paidN });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60" onClick={onClose}>
      <div
        className="safe-bottom w-full rounded-t-3xl bg-white p-5 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
        <h2 className="text-xl font-bold">Add to collection</h2>
        <p className="mt-1 truncate text-sm text-slate-500">{product.name}</p>

        <div className="mt-4 space-y-4">
          <div>
            <p className="label mb-2">Grade held</p>
            <div className="grid grid-cols-4 gap-2">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`rounded-xl py-3 text-sm font-bold ${
                    g === grade
                      ? 'bg-emerald-500 text-slate-950'
                      : 'border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="label">Paid each</span>
              <input
                className="field mt-1 num text-xl"
                inputMode="decimal"
                placeholder="blank = not recorded"
                value={paid}
                onChange={(e) => setPaid(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="label">Quantity</span>
              <input
                className="field mt-1 num text-xl"
                inputMode="numeric"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </label>
          </div>

          {paidBad && <p className="text-sm text-rose-500">Paid each must be a number, or left blank.</p>}
          {paidN == null && !paidBad && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              With no paid amount this line stays out of the totals.
            </p>
          )}
          {paidN != null && (
            <p className="text-xs text-slate-500">
              Total cost {money(paidN * qtyN)} for {qtyN} {qtyN === 1 ? 'card' : 'cards'}.
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn-primary" disabled={saving || paidBad} onClick={submit}>
              {saving ? 'Saving…' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
