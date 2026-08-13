import { cx } from '../../../lib/cx';
import styles from './Pagination.module.css';

export type PaginationProps = {
  page: number;
  pageCount: number;
  /** Left-hand summary, e.g. "Showing 5 of 8 users". */
  summary: string;
  onChange: (page: number) => void;
};

/** 1 2 3 … 29 — long ranges collapse around the current page, as in Figma. */
function pageList(page: number, pageCount: number): (number | 'gap')[] {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, index) => index + 1);

  const window = [page - 1, page, page + 1].filter((value) => value > 1 && value < pageCount);
  const middle = page <= 3 ? [2, 3] : page >= pageCount - 2 ? [pageCount - 2, pageCount - 1] : window;

  const pages: (number | 'gap')[] = [1];
  if (middle[0] > 2) pages.push('gap');
  pages.push(...middle);
  if (middle[middle.length - 1] < pageCount - 1) pages.push('gap');
  pages.push(pageCount);
  return pages;
}

export function Pagination({ page, pageCount, summary, onChange }: PaginationProps) {
  const pages = pageList(page, pageCount);

  return (
    <div className={styles.bar}>
      <p className={styles.summary}>{summary}</p>
      <div className={styles.pages}>
        <button
          type="button"
          className={styles.page}
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        >
          ‹
        </button>
        {pages.map((value, index) =>
          value === 'gap' ? (
            <span key={`gap-${index}`} className={cx(styles.page, styles.gap)}>
              …
            </span>
          ) : (
            <button
              key={value}
              type="button"
              className={cx(styles.page, value === page && styles.active)}
              aria-current={value === page ? 'page' : undefined}
              onClick={() => onChange(value)}
            >
              {value}
            </button>
          ),
        )}
        <button
          type="button"
          className={styles.page}
          aria-label="Next page"
          disabled={page === pageCount}
          onClick={() => onChange(page + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}
