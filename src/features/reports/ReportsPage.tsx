import { useState } from 'react';
import type { CSSProperties } from 'react';
import { ExportIcon, EyeIcon, ReportsIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { SectionCard } from '../../components/ui/SectionCard/SectionCard';
import { SelectField } from '../../components/ui/TextField/SelectField';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { TextField } from '../../components/ui/TextField/TextField';
import { ReportPreviewModal } from './ReportPreviewModal';
import {
  GROUP_BY_OPTIONS,
  REPORT_KINDS,
  REPORT_STATS,
  REPORT_TYPE_OPTIONS,
} from './reportsData';
import type { ReportKind } from './reportsData';
import styles from './ReportsPage.module.css';

/** Reports console — node 112:8228. */
export function ReportsPage() {
  const [preview, setPreview] = useState<ReportKind | null>(null);
  const [form, setForm] = useState({
    type: REPORT_TYPE_OPTIONS[0],
    from: '',
    to: '',
    groupBy: GROUP_BY_OPTIONS[0],
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {REPORT_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className={styles.kinds}>
        {REPORT_KINDS.map((kind) => (
          <article
            key={kind.title}
            className={styles.kind}
            style={{ '--kind-rgb': kind.rgb } as CSSProperties}
          >
            <div className={styles.kindHead}>
              <span className={styles.kindTile}>
                <kind.icon size={21.996} />
              </span>
              <div className={styles.kindText}>
                <p className={styles.kindTitle}>{kind.title}</p>
                <p className={styles.kindDescription}>{kind.description}</p>
              </div>
            </div>

            <div className={styles.formats}>
              {kind.formats.map((format) => (
                <Badge key={format} tone="brand">
                  {format}
                </Badge>
              ))}
            </div>

            <div className={styles.kindActions}>
              <Button
                className={styles.exportBtn}
                variant="primary"
                size="xs"
                icon={<ExportIcon size={12} />}
              >
                Export
              </Button>
              <Button
                className={styles.previewBtn}
                size="xs"
                icon={<EyeIcon size={12} />}
                onClick={() => setPreview(kind)}
              >
                Preview
              </Button>
            </div>
          </article>
        ))}
      </div>

      <SectionCard
        title="Custom Report Builder"
        subtitle="Generate reports with custom date ranges and filters"
        size="md"
        bodySpacing={20}
      >
        <div className={styles.builder}>
          <SelectField
            label="Report Type"
            labelCase="sentence"
            options={REPORT_TYPE_OPTIONS}
            placeholder={null}
            value={form.type}
            onChange={(event) => set('type')(event.target.value)}
          />
          <TextField
            label="Date From"
            type="date"
            value={form.from}
            onChange={(event) => set('from')(event.target.value)}
          />
          <TextField
            label="Date To"
            type="date"
            value={form.to}
            onChange={(event) => set('to')(event.target.value)}
          />
          <SelectField
            label="Group By"
            labelCase="sentence"
            options={GROUP_BY_OPTIONS}
            placeholder={null}
            value={form.groupBy}
            onChange={(event) => set('groupBy')(event.target.value)}
          />
        </div>

        <div className={styles.builderActions}>
          <Button variant="primary" size="sm" icon={<ReportsIcon size={13.993} />}>
            Generate Report
          </Button>
          <Button className={styles.pdf} size="sm" icon={<ExportIcon size={13.993} />}>
            Export PDF
          </Button>
          <Button className={styles.excel} size="sm" icon={<ExportIcon size={13.993} />}>
            Export Excel
          </Button>
        </div>
      </SectionCard>

      {preview ? <ReportPreviewModal kind={preview} onClose={() => setPreview(null)} /> : null}
    </div>
  );
}
