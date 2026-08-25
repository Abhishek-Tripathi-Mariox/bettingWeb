import { useMemo, useState } from 'react';
import {
  BanIcon,
  CheckCircleIcon,
  ExportIcon,
  EyeIcon,
  FilterIcon,
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
import { AddUserModal } from './AddUserModal';
import { UserDrawer } from './UserDrawer';
import {
  KYC_TONE,
  RISK_TONE,
  STATUS_TONE,
  getPeopleView,
  showsAgentColumn,
  showsLastLogin,
} from './usersData';
import type { Person } from './usersData';
import styles from './PeopleListPage.module.css';

const FILTERS = ['All', 'Active', 'Suspended', 'Inactive'] as const;
type Filter = (typeof FILTERS)[number];

const PAGE_SIZE = 5;

/**
 * The list screen from node 79:3065. It backs "Users" for every role and the
 * downline segments (Franchise / Super Agent / Agent) with the same chrome.
 */
export function PeopleListPage({ role, segment, title }: { role: RoleDefinition; segment: string; title: string }) {
  const { people, stats, noun } = useMemo(() => getPeopleView(role, segment), [role, segment]);
  /** Franchise and Super Agent also see who owns each user; every downline panel sees recency. */
  const isUsers = segment === 'users';
  const withAgent = isUsers && showsAgentColumn(role);
  const withLastLogin = isUsers && showsLastLogin(role);

  const [filter, setFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [openPerson, setOpenPerson] = useState<Person | null>(null);
  const [adding, setAdding] = useState(false);
  const [created, setCreated] = useState<Person[]>([]);

  const all = useMemo(() => [...created, ...people], [created, people]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return all.filter((person) => {
      const matchesFilter = filter === 'All' || person.status === filter;
      const matchesQuery =
        !needle ||
        person.name.toLowerCase().includes(needle) ||
        person.id.toLowerCase().includes(needle) ||
        person.email.toLowerCase().includes(needle);
      return matchesFilter && matchesQuery;
    });
  }, [all, filter, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const toggle = (id: string) =>
    setSelected((ids) => (ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]));

  const allVisibleSelected = visible.length > 0 && visible.every((person) => selected.includes(person.id));

  const columns: Column<Person>[] = [
    {
      key: 'select',
      width: 44,
      header: (
        <Checkbox
          label=""
          aria-label={`Select all ${noun} on this page`}
          checked={allVisibleSelected}
          onChange={(event) =>
            setSelected(event.target.checked ? visible.map((person) => person.id) : [])
          }
        />
      ),
      render: (person) => (
        <Checkbox
          label=""
          aria-label={`Select ${person.name}`}
          checked={selected.includes(person.id)}
          onChange={() => toggle(person.id)}
        />
      ),
    },
    { key: 'id', header: 'User ID', render: (person) => <span className={styles.id}>{person.id}</span> },
    {
      key: 'name',
      header: 'Name',
      render: (person) => (
        <div className={styles.identityCell}>
          <p className={styles.name}>{person.name}</p>
          <p className={styles.email}>{person.email}</p>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (person) => <span className={styles.phone}>{person.phone}</span> },
    ...(withAgent
      ? [
          {
            key: 'agent',
            header: 'Agent',
            render: (person: Person) => <span className={styles.agent}>{person.agent ?? '—'}</span>,
          },
        ]
      : []),
    { key: 'balance', header: 'Balance', render: (person) => <span className={styles.balance}>{person.balance}</span> },
    { key: 'bets', header: 'Total Bets', render: (person) => person.totalBets },
    ...(withLastLogin
      ? [
          {
            key: 'lastLogin',
            header: 'Last Login',
            render: (person: Person) => (
              <span className={styles.lastLogin}>{person.lastLogin ?? '—'}</span>
            ),
          },
        ]
      : []),
    { key: 'kyc', header: 'KYC', render: (person) => <Badge tone={KYC_TONE[person.kyc]}>{person.kyc}</Badge> },
    {
      key: 'status',
      header: 'Status',
      render: (person) => <Badge tone={STATUS_TONE[person.status]}>{person.status}</Badge>,
    },
    {
      key: 'risk',
      header: 'Risk',
      render: (person) => (
        <Badge tone={RISK_TONE[person.risk]} bare>
          {person.risk}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (person) => (
        <div className={styles.rowActions}>
          <IconButton icon={EyeIcon} label={`View ${person.name}`} onClick={() => setOpenPerson(person)} />
          <IconButton icon={PencilIcon} tone="warning" label={`Edit ${person.name}`} />
          {person.status === 'Suspended' ? (
            <IconButton icon={CheckCircleIcon} tone="success" label={`Reactivate ${person.name}`} />
          ) : (
            <IconButton icon={BanIcon} tone="danger" label={`Suspend ${person.name}`} />
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
              placeholder={`Search ${noun}...`}
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
              aria-label={`Filter ${noun}`}
              onChange={(value) => {
                setFilter(value);
                setPage(1);
              }}
            />
          </div>
          <div className={styles.actions}>
            <Button variant="quiet" size="xs" icon={<FilterIcon size={12} />}>
              Filter
            </Button>
            <Button variant="quiet" size="xs" icon={<ExportIcon size={12} />}>
              Export
            </Button>
            <Button variant="primary" size="xs" icon={<PlusIcon size={12} />} onClick={() => setAdding(true)}>
              Add {title.replace(/s$/, '')}
            </Button>
          </div>
        </div>

        <div className={styles.table}>
          <DataTable
            columns={columns}
            rows={visible}
            rowKey={(person) => person.id}
            emptyMessage={`No ${noun} match this filter.`}
          />
        </div>

        <Pagination
          page={current}
          pageCount={pageCount}
          summary={`Showing ${visible.length} of ${filtered.length} ${noun}`}
          onChange={setPage}
        />
      </section>

      {adding ? (
        <AddUserModal
          title={title.replace(/s$/, '')}
          onClose={() => setAdding(false)}
          onCreate={(person) => {
            setCreated((list) => [person, ...list]);
            setAdding(false);
            setPage(1);
          }}
        />
      ) : null}

      {openPerson ? (
        <UserDrawer person={openPerson} showAgent={withAgent} onClose={() => setOpenPerson(null)} />
      ) : null}
    </div>
  );
}
