import { useState } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BanIcon,
  CheckCircleIcon,
  ExportIcon,
  FilterIcon,
  PercentIcon,
  RefreshIcon,
  TransactionsIcon,
} from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { cx } from '../../lib/cx';
import { NewPaymentModal } from './NewPaymentModal';
import { PaymentsTab } from './PaymentsTab';
import { WalletActionModal } from './WalletActionModal';
import type { WalletAction } from './WalletActionModal';
import { PARTNER_BUCKETS, WALLET_STATS, getWalletRequests } from './walletData';
import type { WalletRequest } from './walletData';
import styles from './WalletPage.module.css';

const TABS = [
  { label: 'Deposits', badge: '3 pending', rgb: '250, 204, 21' },
  { label: 'Withdrawals', badge: '2 pending', rgb: '239, 68, 68' },
  { label: 'History' },
  { label: 'Payments', badge: 'New', rgb: '34, 197, 94' },
  { label: 'Manual Activity' },
] as const;

const QUICK_ACTIONS = [
  { label: 'Manual Credit', icon: ArrowDownIcon, rgb: '34, 197, 94' },
  { label: 'Manual Debit', icon: ArrowUpIcon, rgb: '239, 68, 68' },
  { label: 'Transfer', icon: TransactionsIcon, rgb: '33, 150, 243' },
  { label: 'Adjustment', icon: RefreshIcon, rgb: '250, 204, 21' },
  { label: 'Pay Commission', icon: PercentIcon, rgb: '167, 139, 250' },
] as const;

/** Wallet console — node 112:2359 (requests) and 117:34376 (payments). */
export function WalletPage() {
  const [tab, setTab] = useState<string>('Deposits');
  const [action, setAction] = useState<WalletAction | null>(null);
  const [paying, setPaying] = useState(false);

  const rows = getWalletRequests(tab);
  const showActions = tab === 'Deposits' || tab === 'Withdrawals';

  const columns: Column<WalletRequest>[] = [
    { key: 'id', header: 'ID', render: (row) => <span className={styles.id}>{row.id}</span> },
    { key: 'user', header: 'User', render: (row) => <span className={styles.user}>{row.user}</span> },
    {
      key: 'amount',
      header: 'Amount',
      render: (row) => (
        <span className={row.kind === 'deposit' ? styles.amount : styles.amountOut}>
          {row.amount}
        </span>
      ),
    },
    { key: 'method', header: 'Method', render: (row) => <span className={styles.muted}>{row.method}</span> },
    { key: 'reference', header: 'UTR / Ref', render: (row) => <span className={styles.ref}>{row.reference}</span> },
    { key: 'time', header: 'Time', render: (row) => <span className={styles.muted}>{row.time}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge tone={row.status.tone}>{row.status.label}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () =>
        showActions ? (
          <div className={styles.rowActions}>
            <Button className={styles.approve} size="xs" icon={<CheckCircleIcon size={12} />}>
              Approve
            </Button>
            <Button className={styles.reject} size="xs" icon={<BanIcon size={12} />}>
              Reject
            </Button>
          </div>
        ) : (
          <span className={styles.muted}>—</span>
        ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {WALLET_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className={styles.partners}>
        <div className={styles.partnersHead}>
          <div>
            <p className={styles.partnersTitle}>Partner Payments</p>
            <p className={styles.partnersSubtitle}>
              Send commission, credit top-up, or bonus to Super Agents, Agents &amp; Franchises
            </p>
          </div>
          <Button
            className={styles.manage}
            size="sm"
            icon={<TransactionsIcon size={12.992} />}
            onClick={() => setTab('Payments')}
          >
            Manage Payments
          </Button>
        </div>

        <div className={styles.buckets}>
          {PARTNER_BUCKETS.map((bucket) => (
            <div
              key={bucket.label}
              className={styles.bucket}
              style={
                {
                  '--bucket-border': `rgba(${bucket.rgb}, 0.14)`,
                  '--bucket-color': bucket.color,
                } as CSSProperties
              }
            >
              <div className={styles.bucketHead}>
                <span className={styles.bucketEmoji} aria-hidden="true">
                  {bucket.emoji}
                </span>
                <span className={styles.bucketLabel}>{bucket.label}</span>
                <span className={styles.bucketActive}>{bucket.active}</span>
              </div>
              <p className={styles.bucketDue}>{bucket.due}</p>
              <p className={styles.bucketCaption}>Commission due this cycle</p>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.actions}>
        {QUICK_ACTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              className={styles.action}
              style={
                {
                  '--action-bg': `rgba(${item.rgb}, 0.1)`,
                  '--action-hover': `rgba(${item.rgb}, 0.18)`,
                  '--action-border': `rgba(${item.rgb}, 0.13)`,
                  '--action-color': `rgb(${item.rgb})`,
                } as CSSProperties
              }
              onClick={() =>
                item.label === 'Pay Commission'
                  ? setPaying(true)
                  : setAction(item.label as WalletAction)
              }
            >
              <Icon size={17.999} />
              {item.label}
            </button>
          );
        })}
      </div>

      <section className={styles.card}>
        <div className={styles.toolbar}>
          <div className={styles.tabs}>
            {TABS.map((item) => (
              <button
                key={item.label}
                type="button"
                className={cx(styles.tab, tab === item.label && styles.tabActive)}
                onClick={() => setTab(item.label)}
              >
                {item.label}
                {'badge' in item && item.badge ? (
                  <span
                    className={styles.tabBadge}
                    style={
                      {
                        '--badge-bg': `rgba(${item.rgb}, 0.2)`,
                        '--badge-color': `rgb(${item.rgb})`,
                      } as CSSProperties
                    }
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
          <div className={styles.toolbarActions}>
            <Button variant="quiet" size="xs" icon={<ExportIcon size={12} />}>
              Export
            </Button>
            <Button variant="quiet" size="xs" icon={<FilterIcon size={12} />}>
              Filter
            </Button>
          </div>
        </div>

        {tab === 'Payments' ? (
          <PaymentsTab onNewPayment={() => setPaying(true)} />
        ) : (
          <div className={styles.table}>
            <DataTable
              columns={columns}
              rows={rows}
              rowKey={(row) => row.id}
              size="lg"
              emptyMessage="Nothing here right now."
            />
          </div>
        )}
      </section>

      {action ? (
        <WalletActionModal
          action={action}
          onClose={() => setAction(null)}
          onConfirm={() => setAction(null)}
        />
      ) : null}

      {paying ? (
        <NewPaymentModal onClose={() => setPaying(false)} onConfirm={() => setPaying(false)} />
      ) : null}
    </div>
  );
}
