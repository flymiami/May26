export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
}

export function send(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

/** Every failure the client sees carries a human-readable `error` and a `stage`. */
export function fail(res, status, error, stage, detail = null) {
  return send(res, status, { ok: false, error, stage, detail });
}

export async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body) return JSON.parse(req.body);
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

/** Accepts a data: URL or bare base64 and splits it into { mediaType, data }. */
export function splitImage(image, fallbackType = 'image/jpeg') {
  if (typeof image !== 'string' || !image) return null;
  const m = /^data:([^;,]+);base64,(.+)$/s.exec(image.trim());
  if (m) return { mediaType: m[1], data: m[2] };
  return { mediaType: fallbackType, data: image.replace(/\s+/g, '') };
}
