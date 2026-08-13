/** Shared axis maths so the area and bar charts tick identically. */

/** Rounds a maximum up to a readable axis top (1, 2, 2.5 or 5 × 10ⁿ). */
export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalised = value / magnitude;
  const step =
    normalised <= 1
      ? 1
      : normalised <= 2
        ? 2
        : normalised <= 2.5
          ? 2.5
          : normalised <= 4
            ? 4
            : normalised <= 5
              ? 5
              : normalised <= 8
                ? 8
                : 10;
  return step * magnitude;
}

/** Evenly spaced tick values from 0 to max, low to high. */
export function ticks(max: number, count = 5): number[] {
  return Array.from({ length: count }, (_, index) => (max / (count - 1)) * index);
}

/** Compact Indian-style number formatting used on the chart axes. */
export function formatCompact(value: number): string {
  if (value === 0) return '0';
  if (value >= 1_000_000) return `${trim(value / 1_000_000)}M`;
  if (value >= 1_000) return `${trim(value / 1_000)}K`;
  return trim(value);
}

function trim(value: number): string {
  return value.toFixed(1).replace(/\.0$/, '');
}
