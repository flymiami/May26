import { useCallback, useEffect, useMemo, useState } from 'react';
import ScanScreen from './components/ScanScreen.jsx';
import CollectionScreen from './components/CollectionScreen.jsx';
import SettingsScreen from './components/SettingsScreen.jsx';
import { money } from './lib/pricing.js';
import { totals } from './lib/csv.js';
import { applyTheme, loadSettings, loadTheme, saveSettings } from './lib/settings.js';
import * as api from './lib/api.js';
import {
  allLines, deleteLine, deviceId, lineKey, mergeLine, putLine, putLines,
} from './lib/db.js';

const TABS = [
  { id: 'scan', label: 'Scan' },
  { id: 'collection', label: 'Collection' },
  { id: 'settings', label: 'Settings' },
];

/** PSA 9.5 and BGS 9.5 have no row of their own; they sit on the row below. */
function gradeFromSlab(slab) {
  const n = parseFloat(String(slab?.grade ?? '').replace(/[^\d.]/g, ''));
  if (!Number.isFinite(n)) return null;
  if (n >= 10) return 'PSA 10';
  if (n >= 9) return 'PSA 9';
  if (n >= 8) return 'PSA 8';
  return 'Ungraded';
}

export default function App() {
  const [tab, setTab] = useState('scan');
  const [settings, setSettings] = useState(loadSettings);
  const [theme, setTheme] = useState(loadTheme);

  const [lines, setLines] = useState([]);
  const [device, setDevice] = useState(null);
  const [sync, setSync] = useState({ configured: false, busy: false, error: null });

  const [scan, setScan] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [bid, setBid] = useState('');
  const [graded, setGraded] = useState(false);
  const [target, setTarget] = useState('Ungraded');

  const [refreshing, setRefreshing] = useState(false);
  const [refreshReport, setRefreshReport] = useState(null);

  useEffect(() => applyTheme(theme), [theme]);
  useEffect(() => saveSettings(settings), [settings]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  // Load local first, then reconcile with the cloud mirror if one is configured.
  useEffect(() => {
    (async () => {
      try {
        const local = await allLines();
        setLines(local);
        const id = await deviceId();
        setDevice(id);
        const remote = await api.syncPull(id);
        if (!remote?.configured) {
          setSync({ configured: false, busy: false, error: null });
          return;
        }
        setSync({ configured: true, busy: false, error: null });
        if (remote.lines?.length) {
          const byKey = new Map(local.map((l) => [l.key, l]));
          const merged = remote.lines.map((r) => {
            const mine = byKey.get(r.key);
            if (!mine) return r;
            return new Date(r.pricedAt ?? 0) > new Date(mine.pricedAt ?? 0) ? { ...mine, ladder: r.ladder, pricedAt: r.pricedAt } : mine;
          });
          const extras = local.filter((l) => !remote.lines.some((r) => r.key === l.key));
          await putLines(merged);
          setLines([...merged, ...extras]);
        }
      } catch (err) {
        setSync((s) => ({ ...s, error: err.message }));
      }
    })();
  }, []);

  const pushOne = useCallback(
    async (line) => {
      if (!device || !sync.configured) return;
      try {
        await api.syncPush(device, [line]);
      } catch (err) {
        setSync((s) => ({ ...s, error: err.message }));
      }
    },
    [device, sync.configured]
  );

  const t = useMemo(() => totals(lines), [lines]);

  // --- scanning ---------------------------------------------------------

  function applyResult(data) {
    const card = data.card ?? null;
    const slabGrade = card?.graded ? gradeFromSlab(card.slab) : null;
    setGraded(Boolean(card?.graded));
    setTarget(slabGrade ?? 'Ungraded');
    setScan({ card, product: data.product ?? null, matches: data.matches ?? [] });
  }

  /** Any fresh price snapshot also refreshes every owned line for that card. */
  const refreshOwned = useCallback(
    async (product) => {
      if (!product) return 0;
      const mine = lines.filter((l) => l.cardId === product.id);
      if (!mine.length) return 0;
      const updated = mine.map((l) => ({ ...l, ladder: product.ladder, pricedAt: product.pricedAt }));
      await putLines(updated);
      setLines((prev) => prev.map((l) => updated.find((u) => u.key === l.key) ?? l));
      if (device && sync.configured) api.syncPush(device, updated).catch(() => {});
      return updated.reduce((n, l) => n + (Number(l.qty) || 0), 0);
    },
    [lines, device, sync.configured]
  );

  async function run(label, fn) {
    setBusy(true);
    setStatus(label);
    setError(null);
    try {
      const data = await fn();
      if (data.ok === false && !data.product) {
        setError({ message: data.error, detail: data.detail, card: data.card });
        if (data.card || data.matches?.length) {
          setScan({ card: data.card ?? null, product: null, matches: data.matches ?? [] });
        }
        return null;
      }
      applyResult(data);
      await refreshOwned(data.product);
      return data;
    } catch (err) {
      setError({ message: err.message });
      return null;
    } finally {
      setBusy(false);
      setStatus('');
    }
  }

  const onCapture = (dataUrl) => {
    setScan(null);
    setBid('');
    run('Reading the card and pulling sold prices…', () => api.identify(dataUrl));
  };

  const onSearch = (q) => {
    setScan(null);
    run('Searching PriceCharting…', async () => {
      const data = await api.searchCards(q);
      if (data.ok === false) return data;
      if (data.product) return { ok: true, card: null, product: data.product, matches: data.matches };
      if (!data.matches?.length) {
        return { ok: false, error: `No PriceCharting product matched "${q}".`, matches: [] };
      }
      const priced = await api.priceByUrl(data.matches[0].url);
      if (priced.ok === false) return { ...priced, matches: data.matches };
      return { ok: true, card: null, product: priced.product, matches: data.matches };
    });
  };

  const onPickMatch = (match) =>
    run('Pulling prices…', async () => {
      const priced = await api.priceByUrl(match.url);
      if (priced.ok === false) return { ...priced, matches: scan?.matches ?? [] };
      return {
        ok: true,
        card: scan?.card ?? null,
        product: priced.product,
        matches: scan?.matches ?? [],
      };
    });

  // --- collection -------------------------------------------------------

  async function addToCollection({ grade, qty, paidEach }) {
    const p = scan?.product;
    if (!p) return;
    const key = lineKey(p.id, grade);
    const incoming = {
      key,
      cardId: p.id,
      name: p.name,
      set: p.set ?? null,
      number: p.number ?? null,
      url: p.url,
      grade,
      qty,
      paidEach,
      ladder: p.ladder,
      pricedAt: p.pricedAt,
      addedAt: new Date().toISOString(),
    };
    const merged = mergeLine(lines.find((l) => l.key === key), incoming);
    await putLine(merged);
    setLines((prev) => {
      const rest = prev.filter((l) => l.key !== key);
      return [merged, ...rest];
    });
    pushOne(merged);
    setTab('collection');
  }

  async function editLine(line, patch) {
    const nextKey = lineKey(line.cardId, patch.grade);
    if (nextKey !== line.key) {
      // Grade changed: it becomes (or merges into) the line for that grade.
      const existing = lines.find((l) => l.key === nextKey);
      const moved = mergeLine(existing, { ...line, ...patch, key: nextKey, addedAt: line.addedAt });
      await deleteLine(line.key);
      await putLine(moved);
      setLines((prev) => [moved, ...prev.filter((l) => l.key !== line.key && l.key !== nextKey)]);
      if (device && sync.configured) {
        api.syncDelete(device, line.key).catch(() => {});
        pushOne(moved);
      }
      return;
    }
    const next = { ...line, ...patch };
    await putLine(next);
    setLines((prev) => prev.map((l) => (l.key === next.key ? next : l)));
    pushOne(next);
  }

  async function removeLine(line) {
    if (!window.confirm(`Remove ${line.name} (${line.grade}) from the collection?`)) return;
    await deleteLine(line.key);
    setLines((prev) => prev.filter((l) => l.key !== line.key));
    if (device && sync.configured) api.syncDelete(device, line.key).catch(() => {});
  }

  async function updateValues() {
    if (!lines.length) return;
    setRefreshing(true);
    setRefreshReport(null);
    try {
      const urls = [...new Set(lines.map((l) => l.url))];
      const { results = [] } = await api.priceBatch(urls);
      const byUrl = new Map(results.filter((r) => r.ok).map((r) => [r.url, r.product]));
      const updated = lines
        .map((l) => {
          const p = byUrl.get(l.url);
          return p ? { ...l, ladder: p.ladder, pricedAt: p.pricedAt } : null;
        })
        .filter(Boolean);

      if (updated.length) {
        await putLines(updated);
        setLines((prev) => prev.map((l) => updated.find((u) => u.key === l.key) ?? l));
        if (device && sync.configured) api.syncPush(device, updated).catch(() => {});
      }

      const failed = results.filter((r) => !r.ok);
      setRefreshReport({
        failed: failed.length > 0,
        message: failed.length
          ? `Refreshed ${updated.length} of ${lines.length}. ${failed.length} failed: ${failed[0].error}`
          : `Refreshed all ${updated.length} ${updated.length === 1 ? 'line' : 'lines'}.`,
      });
    } catch (err) {
      setRefreshReport({ failed: true, message: err.message });
    } finally {
      setRefreshing(false);
    }
  }

  const owned = scan?.product ? lines.filter((l) => l.cardId === scan.product.id).length : 0;

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col">
      <header className="safe-top sticky top-0 z-40 border-b border-slate-200 bg-slate-50/90 backdrop-blur dark:border-slate-800 dark:bg-[#0b0f14]/90">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-lg font-black leading-none">Slab Check</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">
              {t.cards} {t.cards === 1 ? 'card' : 'cards'}
            </p>
          </div>
          <div className="text-right">
            <p className="label">Collection</p>
            <p className="num text-2xl font-black leading-none">{money(t.value, 0)}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24">
        {tab === 'scan' && (
          <ScanScreen
            scan={scan}
            settings={settings}
            busy={busy}
            status={status}
            error={error}
            bid={bid}
            onBid={setBid}
            graded={graded}
            onGraded={(g) => {
              setGraded(g);
              if (!g) setTarget('Ungraded');
              else setTarget(gradeFromSlab(scan?.card?.slab) ?? 'PSA 9');
            }}
            target={target}
            onTarget={setTarget}
            onCapture={onCapture}
            onSearch={onSearch}
            onPickMatch={onPickMatch}
            onReset={() => {
              setScan(null);
              setBid('');
              setError(null);
            }}
            onAdd={addToCollection}
            owned={owned}
          />
        )}

        {tab === 'collection' && (
          <CollectionScreen
            lines={lines}
            onUpdateValues={updateValues}
            onEdit={editLine}
            onRemove={removeLine}
            refreshing={refreshing}
            refreshReport={refreshReport}
          />
        )}

        {tab === 'settings' && (
          <SettingsScreen
            settings={settings}
            onChange={setSettings}
            theme={theme}
            onTheme={setTheme}
            sync={{
              ...sync,
              onPush: async () => {
                setSync((s) => ({ ...s, busy: true, error: null }));
                try {
                  await api.syncPush(device, lines, true);
                } catch (err) {
                  setSync((s) => ({ ...s, error: err.message }));
                } finally {
                  setSync((s) => ({ ...s, busy: false }));
                }
              },
            }}
          />
        )}
      </main>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto max-w-lg border-t border-slate-200 bg-slate-50/95 backdrop-blur dark:border-slate-800 dark:bg-[#0b0f14]/95">
        <div className="grid grid-cols-3">
          {TABS.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setTab(x.id)}
              className={`py-4 text-sm font-bold ${
                tab === x.id ? 'text-emerald-500' : 'text-slate-500'
              }`}
            >
              {x.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
