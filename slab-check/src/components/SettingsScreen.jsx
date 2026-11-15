import { DEFAULT_SETTINGS, maxBid, money } from '../lib/pricing.js';

const FIELDS = [
  { key: 'sellingFee', label: 'Selling fee', suffix: '%', hint: 'Marketplace cut on the sale.' },
  { key: 'shipping', label: 'Shipping', suffix: '$', hint: 'What it costs you to ship the card out.' },
  { key: 'profitTarget', label: 'Profit target', suffix: '%', hint: 'Margin you want on top of costs.' },
  { key: 'buyerPremium', label: 'Buyer premium', suffix: '%', hint: "The auction house's cut on top of your bid." },
  { key: 'gradingCost', label: 'Grading cost', suffix: '$', hint: 'Charged on graded rows only when the card is raw.' },
];

export default function SettingsScreen({ settings, onChange, theme, onTheme, sync }) {
  const example = maxBid(100, settings, false);

  return (
    <div className="space-y-4 px-4 py-4">
      <div className="card space-y-4 p-4">
        <h2 className="text-lg font-bold">Fees</h2>
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="label">
              {f.label} ({f.suffix})
            </span>
            <input
              className="field mt-1 num text-2xl font-bold"
              inputMode="decimal"
              value={settings[f.key]}
              onChange={(e) => {
                const n = e.target.value === '' ? '' : Number(e.target.value);
                onChange({ ...settings, [f.key]: Number.isFinite(n) ? n : 0 });
              }}
            />
            <span className="mt-1 block text-xs text-slate-500">{f.hint}</span>
          </label>
        ))}

        <div className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800/60">
          <p className="font-semibold">On a $100 card</p>
          <p className="num mt-1 text-2xl font-black">{money(example, 2)}</p>
          <p className="mt-1 text-xs text-slate-500">
            max bid on an ungraded flip: (100 × (1 − {settings.sellingFee}%) − {money(settings.shipping, 0)}) ÷ (1 +{' '}
            {settings.profitTarget}%) ÷ (1 + {settings.buyerPremium}%)
          </p>
        </div>

        <button
          type="button"
          className="btn-ghost w-full"
          onClick={() => onChange({ ...DEFAULT_SETTINGS })}
        >
          Reset to defaults
        </button>
      </div>

      <div className="card space-y-3 p-4">
        <h2 className="text-lg font-bold">Appearance</h2>
        <div className="grid grid-cols-3 gap-2">
          {['system', 'light', 'dark'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onTheme(t)}
              className={`rounded-xl py-3 text-sm font-bold capitalize ${
                t === theme ? 'bg-emerald-500 text-slate-950' : 'border border-slate-300 dark:border-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="card space-y-2 p-4">
        <h2 className="text-lg font-bold">Storage</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          The collection lives on this device. {sync.configured
            ? 'Cloud backup is on: every change is mirrored to Supabase.'
            : 'Cloud backup is off. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server to turn it on.'}
        </p>
        {sync.error && <p className="text-sm text-amber-600 dark:text-amber-400">{sync.error}</p>}
        {sync.configured && (
          <button type="button" className="btn-ghost w-full" onClick={sync.onPush} disabled={sync.busy}>
            {sync.busy ? 'Syncing…' : 'Back up now'}
          </button>
        )}
      </div>

      <p className="px-1 text-xs text-slate-500">
        Prices come from pricecharting.com. Grade 8 and Grade 9 there blend PSA, BGS and CGC sales.
      </p>
    </div>
  );
}
