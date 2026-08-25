import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { CloseIcon, ExportIcon } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { getReportPreview } from './reportsData';
import type { ReportKind } from './reportsData';
import styles from './ReportPreviewModal.module.css';

export type ReportPreviewModalProps = {
  /** Report kind whose sample output is being shown. */
  kind: ReportKind;
  onClose: () => void;
};

/**
 * Sample-output sheet — nodes 119:55473 and 139:84935. Wider than the shared
 * Modal (820px) and washed in the kind's own colour, so it carries its own
 * chrome; the table it shows travels with the kind.
 */
export function ReportPreviewModal({ kind, onClose }: ReportPreviewModalProps) {
  const preview = getReportPreview(kind.title);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.panel}
        style={{ '--preview-rgb': kind.rgb } as CSSProperties}
        role="dialog"
        aria-modal="true"
        aria-label={`${kind.title} preview`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.head}>
          <div>
            <h2 className={styles.title}>{kind.title} — Preview</h2>
            <p className={styles.subtitle}>Generated 13 Aug 2026 · Sample data</p>
          </div>
          <div className={styles.actions}>
            <Button variant="primary" size="xs" icon={<ExportIcon size={12} />}>
              Export PDF
            </Button>
            <Button className={styles.excel} size="xs" icon={<ExportIcon size={12} />}>
              Export Excel
            </Button>
            <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
              <CloseIcon size={14} />
            </button>
          </div>
        </div>

        <div className={styles.meta}>
          {preview.meta.map((cell) => (
            <div key={cell.label} className={styles.metaCell}>
              <p className={styles.metaLabel}>{cell.label}</p>
              <p className={styles.metaValue}>{cell.value}</p>
            </div>
          ))}
        </div>

        <div className={styles.body}>
          <table className={styles.table}>
            <thead>
              <tr>
                {preview.columns.map((head) => (
                  <th key={head} scope="col">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, index) => (
                    <td key={preview.columns[index]} className={index === 0 ? styles.rowHead : undefined}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
