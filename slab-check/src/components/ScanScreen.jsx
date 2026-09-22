import { useMemo, useState } from 'react';
import Camera from './Camera.jsx';
import Condition from './Condition.jsx';
import PriceLadder from './PriceLadder.jsx';
import Verdict from './Verdict.jsx';
import AddToCollection from './AddToCollection.jsx';
import { buildLadder, money } from '../lib/pricing.js';

export default function ScanScreen({
  scan, settings, busy, status, error,
  bid, onBid, graded, onGraded, target, onTarget,
  onCapture, onSearch, onPickMatch, onReset, onAdd, owned,
}) {
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const product = scan?.product ?? null;
  const card = scan?.card ?? null;
  const isRaw = !graded;

  const ladder = useMemo(
    () => (product ? buildLadder(product, settings, isRaw) : []),
    [product, settings, isRaw]
  );
  const targetRow = ladder.find((r) => r.grade === target) ?? ladder[0] ?? null;
  const bidN = bid.trim() === '' ? NaN : Number(bid);

  return (
    <div className="space-y-4 px-4 py-4">
      {!product && (
        <>
          <Camera onCapture={onCapture} busy={busy} />
          {busy && status && (
            <p className="text-center text-sm font-semibold text-slate-500">{status}</p>
          )}
        </>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4">
          <p className="font-bold text-rose-600 dark:text-rose-400">Lookup failed</p>
          <p className="mt-1 text-sm text-rose-700 dark:text-rose-300">{error.message}</p>
          {error.detail && (
            <p className="mt-1 break-all text-xs text-rose-700/70 dark:text-rose-300/70">{error.detail}</p>
          )}
          {error.card?.name && (
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Read off the card:{' '}
              {[error.card.name, error.card.set, error.card.number && `#${error.card.number}`]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
        </div>
      )}

      {/* Manual text search: always available, and the fallback when a scan misses. */}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) onSearch(query.trim());
        }}
      >
        <input
          className="field"
          placeholder="Search by name, e.g. charizard base set 4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          enterKeyHint="search"
        />
        <button type="submit" className="btn-ghost px-5" disabled={busy || !query.trim()}>
          Find
        </button>
      </form>

      {!product && <Matches scan={scan} product={null} busy={busy} onPick={onPickMatch} />}

      {product && (
        <>
          <div className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl font-black leading-tight">{product.name}</h1>
                <p className="mt-1 text-sm text-slate-500">
                  {[product.set, product.number && `#${product.number}`].filter(Boolean).join(' · ') ||
                    'set unknown'}
                </p>
                {card && (card.variant || card.language) && (
                  <p className="mt-1 text-xs text-slate-500">
                    {[card.variant, card.language].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
              <button type="button" onClick={onReset} className="btn-ghost shrink-0 px-3 py-2 text-sm">
                New scan
              </button>
            </div>
            {owned > 0 && (
              <p className="mt-3 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                Already in your collection ({owned} {owned === 1 ? 'line' : 'lines'}). This scan refreshed its prices.
              </p>
            )}
          </div>

          <Matches scan={scan} product={product} busy={busy} onPick={onPickMatch} />

          <label className="card block p-4">
            <span className="label">Current bid</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-3xl font-black text-slate-400">$</span>
              <input
                className="field num text-4xl font-black"
                inputMode="decimal"
                placeholder="0"
                value={bid}
                onChange={(e) => onBid(e.target.value)}
              />
              {bid !== '' && (
                <button type="button" className="btn-ghost px-3 py-2 text-sm" onClick={() => onBid('')}>
                  Clear
                </button>
              )}
            </div>
          </label>

          <Verdict row={targetRow} bid={bidN} settings={settings} />

          <PriceLadder
            ladder={ladder}
            settings={settings}
            bid={bidN}
            target={target}
            onTarget={onTarget}
          />

          <Condition
            card={card}
            graded={graded}
            onGraded={onGraded}
            target={target}
            onTarget={onTarget}
          />

          <button
            type="button"
            className="btn-primary w-full py-4 text-lg"
            onClick={() => setShowAdd(true)}
          >
            Add to collection
          </button>

          <div className="card space-y-1 p-4 text-xs text-slate-500">
            <p>
              Source:{' '}
              <a
                className="font-semibold underline"
                href={product.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {product.source}
              </a>
            </p>
            <p>Pulled {new Date(product.pricedAt).toLocaleString()}</p>
            <p>{product.note}</p>
          </div>
        </>
      )}

      {showAdd && product && (
        <AddToCollection
          product={product}
          settings={settings}
          bid={bidN}
          defaultGrade={target}
          onClose={() => setShowAdd(false)}
          onAdd={async (form) => {
            await onAdd(form);
            setShowAdd(false);
          }}
        />
      )}
    </div>
  );
}

/** Wrong card? These are the runners-up from the same PriceCharting search. */
function Matches({ scan, product, busy, onPick }) {
  const others = (scan?.matches ?? []).filter((m) => m.id !== product?.id).slice(0, 12);
  if (!others.length) return null;

  return (
    <div>
      <p className="label mb-2">{product ? 'Not this card?' : 'Matches'}</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {others.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onPick(m)}
            disabled={busy}
            className="shrink-0 rounded-xl border border-slate-300 px-3 py-2 text-left text-xs dark:border-slate-700"
          >
            <span className="block max-w-[200px] truncate font-bold">{m.name}</span>
            <span className="block max-w-[200px] truncate text-slate-500">
              {m.set ?? 'set unknown'}
              {m.ungradedPrice != null && ` · ${money(m.ungradedPrice, 0)}`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
