import { useState } from 'react';
import type { CSSProperties } from 'react';
import { PercentIcon, PlusIcon, TransactionsIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { Tabs } from '../../components/ui/Tabs/Tabs';
import { DISBURSEMENTS, PAYMENT_HISTORY, PAYMENT_SUMMARY } from './walletData';
import type { PaymentRow } from './walletData';
import styles from './PaymentsTab.module.css';

const SCOPES = ['All', 'Superagent', 'Agent', 'Franchise'] as const;
type Scope = (typeof SCOPES)[number];

const COLUMNS: Column<PaymentRow>[] = [
  { key: 'id', header: 'Pay ID', render: (row) => <span className={styles.payId}>{row.id}</span> },
  {
    key: 'recipient',
    header: 'Recipient',
    render: (row) => (
      <div>
        <p className={styles.recipient}>{row.recipient}</p>
        <p className={styles.recipientCode}>{row.recipientCode}</p>
      </div>
    ),
  },
  { key: 'type', header: 'Type', render: (row) => <Badge tone={row.type.tone}>{row.type.label}</Badge> },
  {
    key: 'paymentType',
    header: 'Payment Type',
    render: (row) => <Badge tone={row.paymentType.tone}>{row.paymentType.label}</Badge>,
  },
  { key: 'amount', header: 'Amount', render: (row) => <span className={styles.amount}>{row.amount}</span> },
  { key: 'method', header: 'Method', render: (row) => <span className={styles.muted}>{row.method}</span> },
  { key: 'date', header: 'Date', render: (row) => <span className={styles.muted}>{row.date}</span> },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <Badge tone={row.status.tone}>{row.status.label}</Badge>,
  },
];

/** Payments tab of the wallet page — node 117:34376. */
export function PaymentsTab({ onNewPayment }: { onNewPayment: () => void }) {
  const [scope, setScope] = useState<Scope>('All');

  const rows =
    scope === 'All'
      ? PAYMENT_HISTORY
      : PAYMENT_HISTORY.filter((row) => row.type.label === scope.toLowerCase());

  return (
    <div className={styles.tab}>
      <div className={styles.summary}>
        {PAYMENT_SUMMARY.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={styles.summaryCard}
              style={
                {
                  '--tile-bg': `rgba(${item.rgb}, 0.12)`,
                  '--tile-color': item.color,
                } as CSSProperties
              }
            >
              <span className={styles.summaryTile}>
                <Icon size={15.996} />
              </span>
              <div>
                <p className={styles.summaryLabel}>{item.label}</p>
                <p className={styles.summaryValue}>{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <section className={styles.panel}>
        <div className={styles.panelHead}>
          <p className={styles.panelTitle}>
            <PercentIcon size={14} />
            Pending Commission Disbursements — August 2025
          </p>
          <Button className={styles.payAll} size="xs" icon={<TransactionsIcon size={12} />}>
            Pay All ({DISBURSEMENTS.length})
          </Button>
        </div>

        <div className={styles.rows}>
          {DISBURSEMENTS.map((item) => (
            <div key={item.id} className={styles.row}>
              <span
                className={styles.avatar}
                style={{ '--avatar-color': item.accent } as CSSProperties}
              >
                {item.name.slice(0, 1)}
              </span>
              <div>
                <p className={styles.rowName}>{item.name}</p>
                <p className={styles.rowMeta}>{item.meta}</p>
              </div>
              <span className={styles.rowAmount}>{item.amount}</span>
              <Button
                className={styles.payNow}
                variant="quiet"
                size="xs"
                icon={<TransactionsIcon size={12} />}
                onClick={onNewPayment}
              >
                Pay Now
              </Button>
            </div>
          ))}
        </div>
      </section>

      <div>
        <div className={styles.historyHead}>
          <p className={styles.historyTitle}>Payment History</p>
          <div className={styles.historyActions}>
            <Tabs items={SCOPES} value={scope} variant="solid" aria-label="Filter payments" onChange={setScope} />
            <Button variant="primary" size="xs" icon={<PlusIcon size={12} />} onClick={onNewPayment}>
              New Payment
            </Button>
          </div>
        </div>
        <DataTable
          columns={COLUMNS}
          rows={rows}
          rowKey={(row) => row.id}
          size="lg"
          emptyMessage="No payments for this filter."
        />
      </div>
    </div>
  );
}
