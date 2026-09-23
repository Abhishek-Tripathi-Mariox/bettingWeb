import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { CloseIcon, ExportIcon } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { useAuth } from '../auth/authContext';
import { ApiRequestError } from '../../lib/api';
import { downloadReportCsv, reportsApi } from '../../lib/api/reports';
import type { ReportDateRange, ReportRow } from '../../lib/api/reports';
import {
  formatReportCell,
  formatReportColumnHeader,
  getReportColumns,
  getReportPreview,
} from './reportsData';
import type { ReportKind } from './reportsData';
import styles from './ReportPreviewModal.module.css';

export type ReportPreviewModalProps = {
  /** Report kind whose output is being shown. */
  kind: ReportKind;
  /** Date range from the Reports page's builder — only used for the live (super-admin) preview. */
  range: ReportDateRange;
  onClose: () => void;
};

/**
 * Sample-output sheet — nodes 119:55473 and 139:84935. Wider than the shared
 * Modal (820px) and washed in the kind's own colour, so it carries its own
 * chrome; the table it shows travels with the kind.
 *
 * Only super-admin has a live `/reports` endpoint (this modal is shared by
 * every role's Reports page), so real data is fetched only for that role —
 * every other role keeps rendering the original sample sheet unchanged.
 */
export function ReportPreviewModal({ kind, range, onClose }: ReportPreviewModalProps) {
  const { user, accessToken } = useAuth();
  const isSuperAdmin = user?.roleId === 'super-admin';

  const [rows, setRows] = useState<ReportRow[]>([]);
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(isSuperAdmin);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSuperAdmin || !accessToken) return;
    let cancelled = false;
    setPending(true);
    setError(null);
    reportsApi
      .preview(kind.slug, range, accessToken)
      .then((res) => {
        if (cancelled) return;
        setRows(res.rows);
        setTotal(res.total);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiRequestError ? err.message : 'Unable to load this report preview.');
        }
      })
      .finally(() => {
        if (!cancelled) setPending(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperAdmin, accessToken, kind.slug, range.from, range.to]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleExport = async () => {
    if (!isSuperAdmin || !accessToken) return;
    setExportError(null);
    setExporting(true);
    try {
      await downloadReportCsv(kind.slug, range, accessToken);
    } catch (err) {
      setExportError(err instanceof ApiRequestError ? err.message : 'Unable to export this report.');
    } finally {
      setExporting(false);
    }
  };

  const dummy = getReportPreview(kind.title);
  const columns = isSuperAdmin ? getReportColumns(rows) : dummy.columns;
  const periodLabel = range.from || range.to ? `${range.from || '…'} – ${range.to || 'now'}` : 'All time';
  const meta = isSuperAdmin
    ? [
        { label: 'Period', value: periodLabel },
        { label: 'Total Records', value: pending ? '…' : String(total) },
        { label: 'Status', value: pending ? 'Loading…' : error ? 'Error' : 'Complete' },
        { label: 'Format', value: 'Tabular' },
      ]
    : dummy.meta;

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
            <p className={styles.subtitle}>
              {isSuperAdmin ? 'Live data' : 'Generated 13 Aug 2026 · Sample data'}
            </p>
          </div>
          <div className={styles.actions}>
            {isSuperAdmin ? (
              <Button
                variant="primary"
                size="xs"
                icon={<ExportIcon size={12} />}
                disabled={!accessToken || exporting}
                onClick={handleExport}
              >
                {exporting ? 'Exporting…' : 'Export CSV'}
              </Button>
            ) : (
              <>
                <Button variant="primary" size="xs" icon={<ExportIcon size={12} />}>
                  Export PDF
                </Button>
                <Button className={styles.excel} size="xs" icon={<ExportIcon size={12} />}>
                  Export Excel
                </Button>
              </>
            )}
            <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
              <CloseIcon size={14} />
            </button>
          </div>
        </div>

        <div className={styles.meta}>
          {meta.map((cell) => (
            <div key={cell.label} className={styles.metaCell}>
              <p className={styles.metaLabel}>{cell.label}</p>
              <p className={styles.metaValue}>{cell.value}</p>
            </div>
          ))}
        </div>

        {isSuperAdmin && exportError ? (
          <p className={styles.subtitle} role="alert">
            {exportError}
          </p>
        ) : null}

        <div className={styles.body}>
          {isSuperAdmin && pending ? (
            <p className={styles.subtitle}>Loading…</p>
          ) : isSuperAdmin && error ? (
            <p className={styles.subtitle} role="alert">
              {error}
            </p>
          ) : isSuperAdmin && rows.length === 0 ? (
            <p className={styles.subtitle}>No records in this range.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  {isSuperAdmin
                    ? columns.map((head) => (
                        <th key={head} scope="col">
                          {formatReportColumnHeader(head)}
                        </th>
                      ))
                    : columns.map((head) => (
                        <th key={head} scope="col">
                          {head}
                        </th>
                      ))}
                </tr>
              </thead>
              <tbody>
                {isSuperAdmin
                  ? rows.map((row, rowIndex) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <tr key={rowIndex}>
                        {columns.map((column, index) => (
                          <td key={column} className={index === 0 ? styles.rowHead : undefined}>
                            {formatReportCell(row[column])}
                          </td>
                        ))}
                      </tr>
                    ))
                  : dummy.rows.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, index) => (
                          <td key={columns[index]} className={index === 0 ? styles.rowHead : undefined}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
