// Dependency-free PNG writer for the PWA icons.
// Draws a graded-slab mark: a label band over a card, on a dark plate.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // truecolour + alpha
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

function draw(size) {
  const buf = Buffer.alloc(size * size * 4);
  const put = (x, y, [r, g, b], a = 255) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    const inv = 1 - a / 255;
    buf[i] = buf[i] * inv + r * (a / 255);
    buf[i + 1] = buf[i + 1] * inv + g * (a / 255);
    buf[i + 2] = buf[i + 2] * inv + b * (a / 255);
    buf[i + 3] = 255;
  };

  const rounded = (x0, y0, w, h, r, color) => {
    for (let y = Math.floor(y0); y < y0 + h; y++) {
      for (let x = Math.floor(x0); x < x0 + w; x++) {
        const dx = Math.max(x0 + r - x, x - (x0 + w - 1 - r), 0);
        const dy = Math.max(y0 + r - y, y - (y0 + h - 1 - r), 0);
        const d = Math.hypot(dx, dy);
        if (d <= r) put(x, y, color, d > r - 1 ? 255 * (r - d) : 255);
      }
    }
  };

  rounded(0, 0, size, size, size * 0.22, hex('#0b0f14'));          // plate
  const s = size;
  rounded(s * 0.26, s * 0.2, s * 0.48, s * 0.6, s * 0.05, hex('#10b981')); // slab
  rounded(s * 0.3, s * 0.24, s * 0.4, s * 0.1, s * 0.02, hex('#e2f6ee'));  // label band
  rounded(s * 0.3, s * 0.39, s * 0.4, s * 0.37, s * 0.03, hex('#04301f')); // card window
  // Tick inside the window.
  const t = s * 0.05;
  for (let i = 0; i < s * 0.09; i++) put2(buf, size, s * 0.38 + i, s * 0.57 + i, t, hex('#34d399'), put);
  for (let i = 0; i < s * 0.17; i++) put2(buf, size, s * 0.47 + i, s * 0.66 - i, t, hex('#34d399'), put);

  return buf;
}

function put2(_buf, _size, cx, cy, thick, color, put) {
  const r = thick / 2;
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy <= r * r) put(Math.round(cx + dx), Math.round(cy + dy), color);
    }
  }
}

mkdirSync(new URL('../public/', import.meta.url), { recursive: true });
for (const size of [192, 512]) {
  const out = new URL(`../public/icon-${size}.png`, import.meta.url);
  writeFileSync(out, png(size, size, draw(size)));
  console.log(`wrote public/icon-${size}.png`);
}
