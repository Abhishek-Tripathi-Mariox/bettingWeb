import { useState } from 'react';
import type { CSSProperties } from 'react';
import { CheckCircleIcon, ExportIcon, EyeIcon, XCircleIcon } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { SearchInput } from '../../components/ui/SearchInput/SearchInput';
import { SelectField } from '../../components/ui/TextField/SelectField';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { TicketDrawer } from './TicketDrawer';
import {
  PRIORITY_OPTIONS,
  PRIORITY_RGB,
  STATUS_OPTIONS,
  STATUS_RGB,
  TICKETS,
  TICKET_STATS,
} from './supportData';
import type { Ticket } from './supportData';
import styles from './SupportTicketsPage.module.css';

/** Support ticket queue — node 112:11927. */
export function SupportTicketsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [priority, setPriority] = useState(PRIORITY_OPTIONS[0]);
  const [open, setOpen] = useState<Ticket | null>(null);

  const rows = TICKETS.filter((ticket) => {
    const matchesQuery =
      query.trim() === '' ||
      `${ticket.id} ${ticket.subject} ${ticket.raisedBy}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === STATUS_OPTIONS[0] || ticket.status === status;
    const matchesPriority = priority === PRIORITY_OPTIONS[0] || ticket.priority === priority;
    return matchesQuery && matchesStatus && matchesPriority;
  });

  const columns: Column<Ticket>[] = [
    { key: 'id', header: 'Ticket ID', render: (row) => <span className={styles.code}>{row.id}</span> },
    {
      key: 'subject',
      header: 'Subject',
      render: (row) => (
        <div>
          <p className={styles.subject}>{row.subject}</p>
          <p className={styles.category}>{row.category}</p>
        </div>
      ),
    },
    {
      key: 'raisedBy',
      header: 'Raised By',
      render: (row) => (
        <div className={styles.person}>
          <span className={styles.avatar}>{row.raisedBy.slice(0, 1)}</span>
          <span className={styles.personName}>{row.raisedBy}</span>
        </div>
      ),
    },
    { key: 'role', header: 'Role', render: (row) => <span className={styles.muted}>{row.role}</span> },
    {
      key: 'priority',
      header: 'Priority',
      render: (row) => (
        <span className={styles.chip} style={{ '--chip-rgb': PRIORITY_RGB[row.priority] } as CSSProperties}>
          {row.priority}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={styles.chip} style={{ '--chip-rgb': STATUS_RGB[row.status] } as CSSProperties}>
          {row.status}
        </span>
      ),
    },
    { key: 'created', header: 'Created', render: (row) => <span className={styles.muted}>{row.created}</span> },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      render: (row) => <span className={styles.muted}>{row.assignedTo}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className={styles.rowActions}>
          <Button
            className={styles.view}
            size="xs"
            aria-label={`Open ${row.id}`}
            onClick={() => setOpen(row)}
          >
            <EyeIcon size={12.992} />
          </Button>
          <Button className={styles.resolve} size="xs" aria-label={`Resolve ${row.id}`}>
            <CheckCircleIcon size={12.992} />
          </Button>
          <Button className={styles.close} size="xs" aria-label={`Close ${row.id}`}>
            <XCircleIcon size={12.992} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {TICKET_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className={styles.card}>
        <div className={styles.toolbar}>
          <SearchInput
            className={styles.search}
            placeholder="Search tickets..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <SelectField
            label="Status"
            labelCase="sentence"
            options={STATUS_OPTIONS}
            placeholder={null}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          />
          <SelectField
            label="Priority"
            labelCase="sentence"
            options={PRIORITY_OPTIONS}
            placeholder={null}
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          />
          <Button className={styles.export} size="sm" icon={<ExportIcon size={12} />}>
            Export
          </Button>
        </div>

        <div className={styles.table}>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            size="lg"
            emptyMessage="No tickets match these filters."
          />
        </div>

        <p className={styles.count}>
          Showing {rows.length} of {TICKETS.length} tickets
        </p>
      </section>

      {open ? <TicketDrawer ticket={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}
