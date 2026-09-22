import { cors, send, fail, readJson } from './_util.js';

// Optional cloud mirror. The app is fully usable without it: the phone's
// IndexedDB is the source of truth and this endpoint is a backup/sync target.
// Keys stay server-side; the browser never sees a Supabase credential.
const URL_ = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE = process.env.SUPABASE_TABLE || 'slab_check_collection';

const configured = () => Boolean(URL_ && KEY);

function headers(extra = {}) {
  return { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', ...extra };
}

async function sb(path, init = {}) {
  const res = await fetch(`${URL_.replace(/\/$/, '')}/rest/v1/${path}`, init);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Supabase ${res.status}: ${text.slice(0, 300)}`);
  }
  return text ? JSON.parse(text) : null;
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (!configured()) {
    return send(res, 200, {
      ok: true,
      configured: false,
      reason: 'Cloud sync is off. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to turn it on.',
      lines: [],
    });
  }

  const body = req.method === 'GET' ? {} : await readJson(req).catch(() => ({}));
  const deviceId = String(body.deviceId ?? req.query?.deviceId ?? '').trim();
  if (!deviceId) return fail(res, 400, 'Missing deviceId.', 'sync');

  try {
    if (req.method === 'GET') {
      const rows = await sb(
        `${TABLE}?device_id=eq.${encodeURIComponent(deviceId)}&select=*`,
        { headers: headers() }
      );
      return send(res, 200, { ok: true, configured: true, lines: rows.map(fromRow) });
    }

    if (req.method === 'POST') {
      const lines = Array.isArray(body.lines) ? body.lines : [];
      if (body.replaceAll) {
        await sb(`${TABLE}?device_id=eq.${encodeURIComponent(deviceId)}`, {
          method: 'DELETE',
          headers: headers({ Prefer: 'return=minimal' }),
        });
      }
      if (lines.length) {
        await sb(TABLE, {
          method: 'POST',
          headers: headers({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
          body: JSON.stringify(lines.map((l) => toRow(l, deviceId))),
        });
      }
      return send(res, 200, { ok: true, configured: true, synced: lines.length });
    }

    if (req.method === 'DELETE') {
      const key = String(body.key ?? req.query?.key ?? '');
      if (!key) return fail(res, 400, 'Missing line key.', 'sync');
      await sb(
        `${TABLE}?device_id=eq.${encodeURIComponent(deviceId)}&key=eq.${encodeURIComponent(key)}`,
        { method: 'DELETE', headers: headers({ Prefer: 'return=minimal' }) }
      );
      return send(res, 200, { ok: true, configured: true });
    }

    return fail(res, 405, `${req.method} is not supported here.`, 'sync');
  } catch (err) {
    return fail(res, 502, `Cloud sync failed: ${err.message}`, 'sync');
  }
}

const toRow = (l, deviceId) => ({
  device_id: deviceId,
  key: l.key,
  card_id: l.cardId,
  name: l.name,
  set_name: l.set,
  number: l.number,
  url: l.url,
  grade: l.grade,
  qty: l.qty,
  paid_each: l.paidEach,
  ladder: l.ladder,
  priced_at: l.pricedAt,
  added_at: l.addedAt,
  updated_at: new Date().toISOString(),
});

const fromRow = (r) => ({
  key: r.key,
  cardId: r.card_id,
  name: r.name,
  set: r.set_name,
  number: r.number,
  url: r.url,
  grade: r.grade,
  qty: r.qty,
  paidEach: r.paid_each,
  ladder: r.ladder,
  pricedAt: r.priced_at,
  addedAt: r.added_at,
});
