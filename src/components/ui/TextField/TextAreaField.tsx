import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cx } from '../../../lib/cx';
import styles from './TextField.module.css';

export type TextAreaFieldProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
  label: string;
};

/** Same field chrome as TextField, for multi-line notes. */
export function TextAreaField({ label, className, ...rest }: TextAreaFieldProps) {
  const id = useId();

  return (
    <div className={cx(styles.field, styles.caps)}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.control}>
        <textarea id={id} rows={3} className={cx(styles.input, styles.textarea, className)} {...rest} />
      </div>
    </div>
  );
}
