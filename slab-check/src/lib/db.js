// IndexedDB is the source of truth. Cloud sync (if configured) is a mirror.
const DB_NAME = 'slab-check';
const DB_VERSION = 1;
const LINES = 'lines';
const META = 'meta';

let dbPromise = null;

function open() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(LINES)) db.createObjectStore(LINES, { keyPath: 'key' });
      if (!db.objectStoreNames.contains(META)) db.createObjectStore(META);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Could not open the local database.'));
  });
  return dbPromise;
}

async function tx(store, mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const req = fn(t.objectStore(store));
    t.oncomplete = () => resolve(req?.result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

export const allLines = () => tx(LINES, 'readonly', (s) => s.getAll());
export const putLine = (line) => tx(LINES, 'readwrite', (s) => s.put(line));
export const deleteLine = (key) => tx(LINES, 'readwrite', (s) => s.delete(key));
export const getLine = (key) => tx(LINES, 'readonly', (s) => s.get(key));

export async function putLines(lines) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(LINES, 'readwrite');
    const store = t.objectStore(LINES);
    lines.forEach((l) => store.put(l));
    t.oncomplete = resolve;
    t.onerror = () => reject(t.error);
  });
}

export const getMeta = (k) => tx(META, 'readonly', (s) => s.get(k));
export const setMeta = (k, v) => tx(META, 'readwrite', (s) => s.put(v, k));

export async function deviceId() {
  let id = await getMeta('deviceId');
  if (!id) {
    id = (crypto.randomUUID?.() ?? `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await setMeta('deviceId', id);
  }
  return id;
}

export const lineKey = (cardId, grade) => `${cardId}|${grade}`;

/**
 * Same card at a different grade is its own line.
 * Same card at the same grade merges: quantities add, cost is weighted-averaged.
 */
export function mergeLine(existing, incoming) {
  if (!existing) return incoming;
  const qtyA = Number(existing.qty) || 0;
  const qtyB = Number(incoming.qty) || 0;
  const qty = qtyA + qtyB;

  const paidA = existing.paidEach;
  const paidB = incoming.paidEach;
  let paidEach;
  if (paidA == null && paidB == null) paidEach = null;
  else if (paidA == null) paidEach = paidB;
  else if (paidB == null) paidEach = paidA;
  else paidEach = qty > 0 ? (paidA * qtyA + paidB * qtyB) / qty : paidA;

  return {
    ...existing,
    ...incoming,
    qty,
    paidEach,
    addedAt: existing.addedAt,
    // Keep whichever price snapshot is newer.
    ladder: newer(incoming.pricedAt, existing.pricedAt) ? incoming.ladder : existing.ladder,
    pricedAt: newer(incoming.pricedAt, existing.pricedAt) ? incoming.pricedAt : existing.pricedAt,
  };
}

const newer = (a, b) => !b || (a && new Date(a) > new Date(b));
