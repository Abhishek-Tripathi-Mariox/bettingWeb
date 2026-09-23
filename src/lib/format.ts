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

/** "2 min ago", "3 hr ago", "5 Sep" — used for bet/activity timestamps. */
export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '—';
  const diffMs = Date.now() - then;
  const diffSec = Math.round(diffMs / 1000);
  if (diffSec < 60) return 'just now';
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** "Today 7:30 PM", "Tomorrow 8:00 PM", "12 Sep, 3:30 PM" — event/match start times. */
export function formatStartTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(date) - startOfDay(now)) / 86_400_000);
  const time = date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  if (dayDiff === 0) return `Today ${time}`;
  if (dayDiff === 1) return `Tomorrow ${time}`;
  return `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${time}`;
}

/** True when the ISO timestamp falls on today's local date — used for "X today" stat tiles. */
export function isToday(iso: string): boolean {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}
