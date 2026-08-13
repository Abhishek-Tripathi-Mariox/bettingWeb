import { useMemo, useState } from 'react';
import {
  BanIcon,
  CheckCircleIcon,
  ExportIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
} from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { Checkbox } from '../../components/ui/Checkbox/Checkbox';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { IconButton } from '../../components/ui/IconButton/IconButton';
import { Pagination } from '../../components/ui/Pagination/Pagination';
import { SearchInput } from '../../components/ui/SearchInput/SearchInput';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { Tabs } from '../../components/ui/Tabs/Tabs';
import type { RoleDefinition } from '../../config/roles';
import { AgentDrawer } from './AgentDrawer';
import { CreateAgentModal } from './CreateAgentModal';
import { AGENT_STATUS_TONE, getAgentView } from './agentsData';
import type { AgentRow } from './agentsData';
import styles from './AgentPage.module.css';

const FILTERS = ['All', 'Active', 'Suspended', 'Inactive'] as const;
type Filter = (typeof FILTERS)[number];

/** Agent directory from node 112:1579. */
export function AgentPage({ role }: { role: RoleDefinition }) {
  const { rows, stats, total } = useMemo(() => getAgentView(role), [role]);

  const [filter, setFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [created, setCreated] = useState<AgentRow[]>([]);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState<AgentRow | null>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return [...created, ...rows].filter((row) => {
      const matchesFilter = filter === 'All' || row.status === filter;
      const matchesQuery =
        !needle ||
        row.name.toLowerCase().includes(needle) ||
        row.code.toLowerCase().includes(needle);
      return matchesFilter && matchesQuery;
    });
  }, [created, rows, filter, query]);

  const toggle = (id: string) =>
    setSelected((ids) => (ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]));
  const allSelected = visible.length > 0 && visible.every((row) => selected.includes(row.id));

  const columns: Column<AgentRow>[] = [
    {
      key: 'select',
      width: 44,
      header: (
        <Checkbox
          label=""
          aria-label="Select all agents"
          checked={allSelected}
          onChange={(event) => setSelected(event.target.checked ? visible.map((row) => row.id) : [])}
        />
      ),
      render: (row) => (
        <Checkbox
          label=""
          aria-label={`Select ${row.name}`}
          checked={selected.includes(row.id)}
          onChange={() => toggle(row.id)}
        />
      ),
    },
    { key: 'code', header: 'Agent ID', render: (row) => <span className={styles.id}>{row.code}</span> },
    { key: 'name', header: 'Name', render: (row) => <span className={styles.name}>{row.name}</span> },
    { key: 'users', header: 'Users', render: (row) => <span className={styles.name}>{row.users}</span> },
    {
      key: 'turnover',
      header: 'Turnover',
      render: (row) => <span className={styles.turnover}>{row.turnover}</span>,
    },
    {
      key: 'commission',
      header: 'Commission',
      render: (row) => <span className={styles.commission}>{row.commission}</span>,
    },
    { key: 'wallet', header: 'Wallet', render: (row) => <span className={styles.wallet}>{row.wallet}</span> },
    { key: 'joined', header: 'Joined', render: (row) => <span className={styles.muted}>{row.joined}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge tone={AGENT_STATUS_TONE[row.status]}>{row.status}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className={styles.rowActions}>
          <IconButton icon={EyeIcon} label={`View ${row.name}`} onClick={() => setOpen(row)} />
          <IconButton icon={PencilIcon} tone="warning" label={`Edit ${row.name}`} />
          {row.status === 'Active' ? (
            <IconButton icon={BanIcon} tone="danger" label={`Block ${row.name}`} />
          ) : (
            <IconButton icon={CheckCircleIcon} tone="success" label={`Reactivate ${row.name}`} />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className={styles.card}>
        <div className={styles.toolbar}>
          <div className={styles.filters}>
            <SearchInput
              className={styles.search}
              size="lg"
              placeholder="Search agents..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
            <Tabs
              items={FILTERS}
              value={filter}
              variant="solid"
              aria-label="Filter agents"
              onChange={(value) => {
                setFilter(value);
                setPage(1);
              }}
            />
          </div>
          <div className={styles.actions}>
            <Button variant="quiet" size="xs" icon={<ExportIcon size={12} />}>
              Export
            </Button>
            <Button
              variant="primary"
              size="xs"
              icon={<PlusIcon size={12} />}
              onClick={() => setCreating(true)}
            >
              Create Agent
            </Button>
          </div>
        </div>

        <div className={styles.table}>
          <DataTable
            columns={columns}
            rows={visible}
            rowKey={(row) => row.id}
            size="lg"
            emptyMessage="No agents match this filter."
          />
        </div>

        <Pagination
          page={page}
          pageCount={Math.max(1, Math.ceil(total / 10))}
          summary={`Showing ${visible.length} of ${total} agents`}
          onChange={setPage}
        />
      </section>

      {creating ? (
        <CreateAgentModal
          onClose={() => setCreating(false)}
          onCreate={(row) => {
            setCreated((list) => [row, ...list]);
            setCreating(false);
          }}
        />
      ) : null}

      {open ? <AgentDrawer agent={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}
