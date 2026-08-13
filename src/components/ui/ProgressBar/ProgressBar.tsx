import type { CSSProperties } from 'react';
import styles from './ProgressBar.module.css';

export type ProgressBarProps = {
  label: string;
  /** 0–100. */
  percent: number;
  /** Any CSS colour — pass a token, e.g. var(--color-primary). */
  color: string;
};

/** Labelled meter used by the commission split panel. */
export function ProgressBar({ label, percent, color }: ProgressBarProps) {
  return (
    <div style={{ '--bar-color': color } as CSSProperties}>
      <div className={styles.row}>
        <span>{label}</span>
        <span className={styles.value}>{percent}%</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={label}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
