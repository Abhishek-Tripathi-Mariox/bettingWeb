import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { ExportIcon, FilterIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { Pagination } from '../../components/ui/Pagination/Pagination';
import { PillTabs } from '../../components/ui/PillTabs/PillTabs';
import { SearchInput } from '../../components/ui/SearchInput/SearchInput';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import {
  TRANSACTION_PAGES,
  TRANSACTION_STATS,
  TRANSACTION_TABS,
  TYPE_RGB,
  getTransactions,
} from './transactionsData';
import type { Transaction } from './transactionsData';
import styles from './TransactionsPage.module.css';

const COLUMNS: Column<Transaction>[] = [
  { key: 'id', header: 'TXN ID', render: (row) => <span className={styles.id}>{row.id}</span> },
  { key: 'user', header: 'User', render: (row) => <span className={styles.user}>{row.user}</span> },
  {
    key: 'type',
    header: 'Type',
    render: (row) => (
      <span
        className={styles.type}
        style={
          {
            '--type-bg': `rgba(${TYPE_RGB[row.type]}, 0.08)`,
            '--type-color': `rgb(${TYPE_RGB[row.type]})`,
          } as CSSProperties
        }
      >
        {row.type}
      </span>
    ),
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (row) => (
      <span className={row.amount.startsWith('-') ? styles.amountDown : styles.amountUp}>
        {row.amount}
      </span>
    ),
  },
  { key: 'method', header: 'Method', render: (row) => <span className={styles.muted}>{row.method}</span> },
  {
    key: 'reference',
    header: 'Reference',
    render: (row) => <span className={styles.ref}>{row.reference}</span>,
  },
  { key: 'date', header: 'Date', render: (row) => <span className={styles.muted}>{row.date}</span> },
  { key: 'time', header: 'Time', render: (row) => <span className={styles.muted}>{row.time}</span> },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <Badge tone={row.status.tone}>{row.status.label}</Badge>,
  },
];

/** Transaction ledger — node 112:3084. */
export function TransactionsPage() {
  const [tab, setTab] = useState<string>('All');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const rows = useMemo(() => getTransactions(tab, query), [tab, query]);

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {TRANSACTION_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className={styles.card}>
        <div className={styles.toolbar}>
          <PillTabs
            items={TRANSACTION_TABS}
            value={tab}
            size="sm"
            label="Filter transactions"
            onChange={(value) => {
              setTab(value);
              setPage(1);
            }}
          />
          <div className={styles.toolbarActions}>
            <SearchInput
              className={styles.search}
              size="lg"
              placeholder="Search transactions..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
            <Button variant="quiet" size="xs" icon={<FilterIcon size={12} />}>
              Filter
            </Button>
            <Button variant="quiet" size="xs" icon={<ExportIcon size={12} />}>
              Export
            </Button>
          </div>
        </div>

        <div className={styles.table}>
          <DataTable
            columns={COLUMNS}
            rows={rows}
            rowKey={(row) => row.id}
            size="lg"
            emptyMessage="No transactions match this filter."
          />
        </div>

        <Pagination
          page={page}
          pageCount={TRANSACTION_PAGES}
          run={5}
          summary={`Showing ${rows.length} transactions · Page ${page} of ${TRANSACTION_PAGES}`}
          onChange={setPage}
        />
      </section>
    </div>
  );
}
