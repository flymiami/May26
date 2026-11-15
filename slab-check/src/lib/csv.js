import { ROWS, money } from './pricing.js';

export const priceForGrade = (ladder, grade) => {
  const column = ROWS.find((r) => r.grade === grade)?.column;
  return (ladder || []).find((r) => r.label === column)?.price ?? null;
};

const cell = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(lines) {
  const head = [
    'name', 'set', 'grade', 'qty', 'paid each', 'value each',
    'value total', 'gain', 'priced on', 'source url',
  ];
  const rows = lines.map((l) => {
    const value = priceForGrade(l.ladder, l.grade);
    const qty = Number(l.qty) || 0;
    const valueTotal = value == null ? null : value * qty;
    const gain =
      value == null || l.paidEach == null ? null : (value - l.paidEach) * qty;
    return [
      l.name, l.set ?? '', l.grade, qty,
      l.paidEach ?? '', value ?? '', valueTotal ?? '', gain ?? '',
      l.pricedAt ? new Date(l.pricedAt).toISOString().slice(0, 10) : '',
      l.url,
    ].map(cell).join(',');
  });
  return [head.join(','), ...rows].join('\n');
}

export function downloadCsv(lines) {
  const blob = new Blob([toCsv(lines)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `slab-check-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Totals, with the excluded lines counted rather than silently dropped. */
export function totals(lines) {
  let value = 0;
  let paid = 0;
  let cards = 0;
  let noPrice = 0;
  let noPaid = 0;

  for (const l of lines) {
    const qty = Number(l.qty) || 0;
    cards += qty;
    const price = priceForGrade(l.ladder, l.grade);
    const missingPrice = price == null;
    const missingPaid = l.paidEach == null;
    if (missingPrice) noPrice++;
    if (missingPaid) noPaid++;
    if (missingPrice || missingPaid) continue;
    value += price * qty;
    paid += l.paidEach * qty;
  }

  return {
    value, paid, gain: value - paid, cards,
    lines: lines.length, noPrice, noPaid,
    excluded: lines.filter((l) => priceForGrade(l.ladder, l.grade) == null || l.paidEach == null).length,
  };
}

export { money };
