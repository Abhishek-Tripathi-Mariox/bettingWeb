import { useEffect, useMemo, useState } from 'react';
import { RefreshIcon, SendIcon } from '../../components/icons';
import { DonutChart } from '../../components/charts/DonutChart';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { SectionCard } from '../../components/ui/SectionCard/SectionCard';
import { SelectField } from '../../components/ui/TextField/SelectField';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { ApiRequestError } from '../../lib/api';
import { commissionApi } from '../../lib/api/commission';
import type { ApiCommission, ApiCommissionLevel, ApiCommissionStatus } from '../../lib/api/commission';
import { useAuth } from '../auth/authContext';
import {
  COMMISSION_LEVELS,
  COMMISSION_ROWS,
  COMMISSION_SPLIT,
  COMMISSION_STATS,
  COMMISSION_STATUSES,
  SETTLEMENT_TONE,
  commissionSplit,
  commissionStats,
  mapCommissionRows,
} from './commissionData';
import type { CommissionRow } from './commissionData';
import styles from './CommissionPage.module.css';

const ALL = 'all';

/**
 * Commission console — node 112:6945. Shared across every role's nav, but the
 * `/commission` endpoints are super-admin-only. Non-super-admin roles keep
 * the original static preview exactly as before; only super-admin fetches
 * and mutates real data.
 */
export function CommissionPage() {
  const { user, accessToken } = useAuth();
  const isSuperAdmin = user?.roleId === 'super-admin';

  if (!isSuperAdmin) {
    return <CommissionPreview />;
  }

  return <LiveCommissionPage accessToken={accessToken} />;
}

/** Unchanged dummy-data view for franchise / super-agent / agent. */
function CommissionPreview() {
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
        <SectionCard title="Commission Breakdown" subtitle="By hierarchy — July 2024" size="md" bodySpacing={20}>
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

/** Live view — fetches, filters, recomputes and settles real `/commission` rows. */
function LiveCommissionPage({ accessToken }: { accessToken: string | null }) {
  const [level, setLevel] = useState<string>(ALL);
  const [status, setStatus] = useState<string>(ALL);
  const [items, setItems] = useState<ApiCommission[]>([]);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [recomputing, setRecomputing] = useState(false);
  const [settlingId, setSettlingId] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    setPending(true);
    setError(null);
    commissionApi
      .list(
        {
          level: level === ALL ? undefined : (level as ApiCommissionLevel),
          status: status === ALL ? undefined : (status as ApiCommissionStatus),
        },
        accessToken,
      )
      .then((res) => {
        if (!cancelled) setItems(res.items);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiRequestError ? err.message : 'Unable to load commission data.');
      })
      .finally(() => {
        if (!cancelled) setPending(false);
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken, level, status, reloadKey]);

  const stats = useMemo(() => commissionStats(items), [items]);
  const rows = useMemo(() => mapCommissionRows(items), [items]);
  const split = useMemo(() => commissionSplit(items), [items]);

  const recompute = async () => {
    if (!accessToken) return;
    setRecomputing(true);
    try {
      await commissionApi.recompute(accessToken);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to recompute commission.');
    } finally {
      setRecomputing(false);
    }
  };

  const settle = async (row: CommissionRow) => {
    if (!accessToken) return;
    setSettlingId(row.id);
    try {
      const res = await commissionApi.settle(row.id, accessToken);
      setItems((current) => current.map((item) => (item._id === res.commission._id ? res.commission : item)));
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to settle this commission.');
    } finally {
      setSettlingId(null);
    }
  };

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
          <Button
            variant="primary"
            size="xs"
            icon={<SendIcon size={12} />}
            onClick={() => settle(row)}
            disabled={settlingId === row.id}
          >
            {settlingId === row.id ? 'Settling…' : 'Settle'}
          </Button>
        ) : null,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {error ? (
        <p role="alert" style={{ color: 'var(--color-danger)', margin: 0, fontSize: 12 }}>
          {error}
        </p>
      ) : null}

      <div className={styles.split}>
        <SectionCard
          title="Commission Breakdown"
          subtitle="By hierarchy — current period"
          size="md"
          bodySpacing={20}
          action={
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <SelectField
                label="Level"
                options={COMMISSION_LEVELS}
                placeholder="All Levels"
                value={level === ALL ? '' : level}
                onChange={(evt) => setLevel(evt.target.value || ALL)}
              />
              <SelectField
                label="Status"
                options={COMMISSION_STATUSES}
                placeholder="All Statuses"
                value={status === ALL ? '' : status}
                onChange={(evt) => setStatus(evt.target.value || ALL)}
              />
              <Button size="xs" icon={<RefreshIcon size={12} />} onClick={recompute} disabled={recomputing}>
                {recomputing ? 'Recomputing…' : 'Recompute'}
              </Button>
            </div>
          }
        >
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            size="lg"
            emptyMessage={pending ? 'Loading commission…' : 'No commission booked this period.'}
          />
        </SectionCard>

        <SectionCard title="Commission Distribution">
          <DonutChart data={split} layout="stack" />
        </SectionCard>
      </div>
    </div>
  );
}
