/** Every call resolves to the server payload, or throws an Error with the server's own message. */
async function call(path, init) {
  let res;
  try {
    res = await fetch(path, init);
  } catch (err) {
    throw new Error(`Could not reach the server (${err.message}). Check your connection.`);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Server returned a non-JSON response (HTTP ${res.status}).`);
  }

  if (!res.ok && !data?.error) {
    throw new Error(`Server error (HTTP ${res.status}).`);
  }
  return data;
}

const post = (path, body) =>
  call(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

export const identify = (image) => post('/api/identify', { image });
export const searchCards = (q) => post('/api/search', { q });
export const priceByUrl = (url) => post('/api/price', { url });
export const priceBatch = (urls) => post('/api/price', { urls });

export const syncPull = (deviceId) =>
  call(`/api/collection?deviceId=${encodeURIComponent(deviceId)}`, { method: 'GET' });
export const syncPush = (deviceId, lines, replaceAll = false) =>
  post('/api/collection', { deviceId, lines, replaceAll });
export const syncDelete = (deviceId, key) =>
  call('/api/collection', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId, key }),
  });
