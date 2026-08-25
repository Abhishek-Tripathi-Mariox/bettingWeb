import { useState } from 'react';
import type { CSSProperties } from 'react';
import { BanIcon, CheckCircleIcon, PencilIcon, PlusIcon, RefreshIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { cx } from '../../lib/cx';
import { MarketFormModal } from './MarketFormModal';
import {
  MARKETS,
  MARKET_SCOPES,
  MARKET_STATS,
  MARKET_STATUS_TONE,
  MARKET_TYPE_RGB,
} from './marketsData';
import type { MarketRow } from './marketsData';
import styles from './MarketsPage.module.css';

/** Market manager — node 112:5525. */
export function MarketsPage() {
  const [scope, setScope] = useState<string>(MARKET_SCOPES[0]);
  const [rows, setRows] = useState<MarketRow[]>(MARKETS);
  /** null = closed, 'new' = Add Market, a row = Edit Market. */
  const [form, setForm] = useState<MarketRow | 'new' | null>(null);

  const toggleStatus = (row: MarketRow) =>
    setRows((current) =>
      current.map((item) =>
        item.id === row.id
          ? { ...item, status: item.status === 'Active' ? 'Suspended' : 'Active' }
          : item,
      ),
    );

  const suspendAll = () =>
    setRows((current) => current.map((item) => ({ ...item, status: 'Suspended' })));

  const handleSubmit = (market: MarketRow) => {
    setRows((current) =>
      current.some((item) => item.id === market.id)
        ? current.map((item) => (item.id === market.id ? market : item))
        : [...current, { ...market, id: `MKT${String(current.length + 1).padStart(3, '0')}`, code: `MKT${String(current.length + 1).padStart(3, '0')}` }],
    );
    setForm(null);
  };

  const columns: Column<MarketRow>[] = [
    {
      key: 'market',
      header: 'Market',
      render: (row) => (
        <div>
          <p className={styles.name}>{row.name}</p>
          <p className={styles.code}>{row.code}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (row) => (
        <span
          className={styles.type}
          style={{ '--type-rgb': MARKET_TYPE_RGB[row.type] } as CSSProperties}
        >
          {row.type}
        </span>
      ),
    },
    { key: 'back', header: 'Back Odds', render: (row) => <span className={styles.back}>{row.backOdds}</span> },
    { key: 'lay', header: 'Lay Odds', render: (row) => <span className={styles.lay}>{row.layOdds}</span> },
    { key: 'bets', header: 'Bets', render: (row) => <span className={styles.bets}>{row.bets}</span> },
    { key: 'stake', header: 'Stake', render: (row) => <span className={styles.stake}>{row.stake}</span> },
    { key: 'exposure', header: 'Exposure', render: (row) => <span className={styles.exposure}>{row.exposure}</span> },
    { key: 'maxBet', header: 'Max Bet', render: (row) => <span className={styles.maxBet}>{row.maxBet}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge tone={MARKET_STATUS_TONE[row.status]}>{row.status}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className={styles.rowActions}>
          <Button
            className={styles.edit}
            size="xs"
            icon={<PencilIcon size={12} />}
            onClick={() => setForm(row)}
          >
            Edit
          </Button>
          {row.status === 'Active' ? (
            <Button
              className={styles.suspend}
              size="xs"
              icon={<BanIcon size={12} />}
              onClick={() => toggleStatus(row)}
            >
              Suspend
            </Button>
          ) : (
            <Button
              className={styles.enable}
              size="xs"
              icon={<CheckCircleIcon size={12} />}
              onClick={() => toggleStatus(row)}
            >
              Enable
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {MARKET_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className={styles.card}>
        <div className={styles.head}>
          <div className={styles.heading}>
            <p className={styles.title}>Market Manager</p>
            <div className={styles.scopes}>
              {MARKET_SCOPES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={cx(styles.scope, scope === item && styles.scopeActive)}
                  onClick={() => setScope(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <Button className={styles.refresh} size="xs" icon={<RefreshIcon size={12} />}>
              Refresh Odds
            </Button>
            <Button
              className={styles.suspendAll}
              size="xs"
              icon={<BanIcon size={12} />}
              onClick={suspendAll}
            >
              Suspend All
            </Button>
            <Button
              variant="primary"
              size="xs"
              icon={<PlusIcon size={12} />}
              onClick={() => setForm('new')}
            >
              Add Market
            </Button>
          </div>
        </div>

        <div className={styles.table}>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            size="lg"
            emptyMessage="No markets on this event yet."
          />
        </div>
      </section>

      {form ? (
        <MarketFormModal
          market={form === 'new' ? null : form}
          onClose={() => setForm(null)}
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
}
