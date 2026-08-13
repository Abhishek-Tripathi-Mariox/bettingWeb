/** Number and currency formatting shared by every panel. */

const INDIAN = new Intl.NumberFormat('en-IN');

export function formatCount(value: number): string {
  return INDIAN.format(Math.round(value));
}

/** ₹ in Indian short scale — ₹1.42Cr, ₹18.4L, ₹42,600. */
export function formatMoney(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 10_000_000) return `₹${trim(value / 10_000_000)}Cr`;
  if (abs >= 100_000) return `₹${trim(value / 100_000)}L`;
  return `₹${INDIAN.format(Math.round(value))}`;
}

/** ₹ with full digits — used in tables and ledgers. */
export function formatMoneyExact(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}₹${INDIAN.format(Math.abs(Math.round(value)))}`;
}

export function formatPercent(value: number, digits = 1): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
}

function trim(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, '');
}
