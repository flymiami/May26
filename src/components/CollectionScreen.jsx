import { useMemo, useState } from 'react';
import { GRADES, money } from '../lib/pricing.js';
import { downloadCsv, priceForGrade, totals } from '../lib/csv.js';

export default function CollectionScreen({ lines, onUpdateValues, onEdit, onRemove, refreshing, refreshReport }) {
  const [editing, setEditing] = useState(null);
  const t = useMemo(() => totals(lines), [lines]);

  if (!lines.length) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-lg font-semibold">Nothing in the collection yet.</p>
        <p className="mt-2 text-sm text-slate-500">Scan a card and tap Add to collection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 py-4">
      <div className="card grid grid-cols-2 gap-4 p-4">
        <Stat label="Estimated value" value={money(t.value, 0)} big />
        <Stat
          label="Gain / loss"
          value={`${t.gain >= 0 ? '+' : ''}${money(t.gain, 0)}`}
          big
          tone={t.gain >= 0 ? 'good' : 'bad'}
        />
        <Stat label="Total paid" value={money(t.paid, 0)} />
        <Stat label="Cards" value={`${t.cards} in ${t.lines} ${t.lines === 1 ? 'line' : 'lines'}`} plain />
        {t.excluded > 0 && (
          <p className="col-span-2 rounded-xl bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
            {t.excluded} {t.excluded === 1 ? 'line is' : 'lines are'} out of the totals
            {t.noPrice > 0 && ` · ${t.noPrice} with no price for the grade held`}
            {t.noPaid > 0 && ` · ${t.noPaid} with no paid amount`}.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="btn-primary" onClick={onUpdateValues} disabled={refreshing}>
          {refreshing ? 'Updating…' : 'Update values'}
        </button>
        <button type="button" className="btn-ghost" onClick={() => downloadCsv(lines)}>
          Export CSV
        </button>
      </div>

      {refreshReport && (
        <p
          className={`rounded-xl px-3 py-2 text-sm ${
            refreshReport.failed
              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
          }`}
        >
          {refreshReport.message}
        </p>
      )}

      <div className="space-y-3">
        {lines.map((l) => (
          <Line
            key={l.key}
            line={l}
            editing={editing === l.key}
            onStartEdit={() => setEditing(l.key)}
            onCancel={() => setEditing(null)}
            onSave={async (patch) => {
              await onEdit(l, patch);
              setEditing(null);
            }}
            onRemove={() => onRemove(l)}
          />
        ))}
      </div>
    </div>
  );
}

function Line({ line, editing, onStartEdit, onCancel, onSave, onRemove }) {
  const price = priceForGrade(line.ladder, line.grade);
  const qty = Number(line.qty) || 0;
  const valueTotal = price == null ? null : price * qty;
  const delta = price == null || line.paidEach == null ? null : (price - line.paidEach) * qty;

  const [grade, setGrade] = useState(line.grade);
  const [qtyIn, setQtyIn] = useState(String(qty));
  const [paidIn, setPaidIn] = useState(line.paidEach == null ? '' : String(line.paidEach));

  if (editing) {
    const paidN = paidIn.trim() === '' ? null : Number(paidIn);
    const bad = paidIn.trim() !== '' && !Number.isFinite(paidN);
    return (
      <div className="card space-y-3 p-4">
        <p className="font-bold">{line.name}</p>
        <div className="grid grid-cols-4 gap-2">
          {GRADES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGrade(g)}
              className={`rounded-xl py-2 text-xs font-bold ${
                g === grade ? 'bg-emerald-500 text-slate-950' : 'border border-slate-300 dark:border-slate-700'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="label">Paid each</span>
            <input className="field mt-1 num" inputMode="decimal" value={paidIn} onChange={(e) => setPaidIn(e.target.value)} />
          </label>
          <label className="block">
            <span className="label">Quantity</span>
            <input className="field mt-1 num" inputMode="numeric" value={qtyIn} onChange={(e) => setQtyIn(e.target.value)} />
          </label>
        </div>
        {bad && <p className="text-sm text-rose-500">Paid each must be a number, or blank.</p>}
        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button
            type="button"
            className="btn-primary"
            disabled={bad}
            onClick={() => onSave({ grade, qty: Math.max(1, Math.floor(Number(qtyIn) || 1)), paidEach: paidN })}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-bold">{line.name}</p>
          <p className="truncate text-xs text-slate-500">
            {[line.set, line.number && `#${line.number}`].filter(Boolean).join(' · ') || 'set unknown'}
          </p>
        </div>
        <div className="text-right">
          <p className="num text-2xl font-black">{valueTotal == null ? '—' : money(valueTotal, 0)}</p>
          {delta != null && (
            <p className={`num text-sm font-bold ${delta >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {delta >= 0 ? '+' : ''}{money(delta, 0)}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-lg bg-slate-200 px-2 py-1 font-bold dark:bg-slate-800">{line.grade}</span>
        <span className="text-slate-500">x{qty}</span>
        <span className="text-slate-500">
          {line.paidEach == null ? 'no paid amount' : `paid ${money(line.paidEach, 2)} ea`}
        </span>
        <span className="text-slate-500">
          {price == null ? `no ${line.grade} price` : `${money(price, 2)} ea`}
        </span>
        <span className="text-slate-500">
          priced {line.pricedAt ? new Date(line.pricedAt).toLocaleDateString() : 'never'}
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        <button type="button" className="btn-ghost flex-1 py-2 text-sm" onClick={onStartEdit}>Edit</button>
        <a
          className="btn-ghost flex-1 py-2 text-sm"
          href={line.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          Source
        </a>
        <button
          type="button"
          className="btn flex-1 border border-rose-500/40 py-2 text-sm text-rose-500"
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

const Stat = ({ label, value, big, tone, plain }) => (
  <div>
    <p className="label">{label}</p>
    <p
      className={`font-black ${plain ? '' : 'num'} ${big ? 'text-3xl' : 'text-xl'} ${
        tone === 'good' ? 'text-emerald-500' : tone === 'bad' ? 'text-rose-500' : ''
      }`}
    >
      {value}
    </p>
  </div>
);
