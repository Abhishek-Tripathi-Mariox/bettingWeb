import { useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cx } from '../../../lib/cx';
import styles from './TextField.module.css';

export type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
  label: string;
  options: readonly string[];
  /** Shown as the empty first entry. */
  placeholder?: string;
  labelCase?: 'sentence' | 'caps';
};

/** Same field chrome as TextField, backed by a native select. */
export function SelectField({
  label,
  options,
  placeholder = 'Select…',
  labelCase = 'caps',
  className,
  ...rest
}: SelectFieldProps) {
  const id = useId();

  return (
    <div className={cx(styles.field, labelCase === 'caps' && styles.caps)}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.control}>
        <select id={id} className={cx(styles.input, className)} {...rest}>
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
