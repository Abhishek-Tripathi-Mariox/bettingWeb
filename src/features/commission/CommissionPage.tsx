import { SendIcon } from '../../components/icons';
import { DonutChart } from '../../components/charts/DonutChart';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { SectionCard } from '../../components/ui/SectionCard/SectionCard';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import {
  COMMISSION_ROWS,
  COMMISSION_SPLIT,
  COMMISSION_STATS,
  SETTLEMENT_TONE,
} from './commissionData';
import type { CommissionRow } from './commissionData';
import styles from './CommissionPage.module.css';

/** Commission console — node 112:6945. */
export function CommissionPage() {
  const columns: Column<CommissionRow>[] = [
    { key: 'entity', header: 'Entity', render: (row) => <span className={styles.entity}>{row.entity}</span> },
    { key: 'level', header: 'Level', render: (row) => <Badge tone="brand">{row.level}</Badge> },
    { key: 'turnover', header: 'Turnover', render: (row) => <span className={styles.turnover}>{row.turnover}</span> },
    { key: 'rate', header: 'Comm %', render: (row) => <span className={styles.rate}>{row.rate}</span> },
    {
      key: 'commission',
      header: 'Commission',
      render: (row) => <span className={styles.commission}>{row.commission}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge tone={SETTLEMENT_TONE[row.status]}>{row.status}</Badge>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) =>
        row.status === 'Pending' ? (
          <Button variant="primary" size="xs" icon={<SendIcon size={12} />}>
            Settle
          </Button>
        ) : null,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {COMMISSION_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className={styles.split}>
        <SectionCard
          title="Commission Breakdown"
          subtitle="By hierarchy — July 2024"
          size="md"
          bodySpacing={20}
        >
          <DataTable
            columns={columns}
            rows={COMMISSION_ROWS}
            rowKey={(row) => row.id}
            size="lg"
            emptyMessage="No commission booked this period."
          />
        </SectionCard>

        <SectionCard title="Commission Distribution">
          <DonutChart data={COMMISSION_SPLIT} layout="stack" />
        </SectionCard>
      </div>
    </div>
  );
}
