import { useMemo, useState } from 'react';
import {
  BanIcon,
  CheckCircleIcon,
  ExportIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  UsersCogIcon,
} from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { IconButton } from '../../components/ui/IconButton/IconButton';
import { MetricTile } from '../../components/ui/MetricTile/MetricTile';
import { SearchInput } from '../../components/ui/SearchInput/SearchInput';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import type { RoleDefinition } from '../../config/roles';
import { FRANCHISE_STATUS_TONE } from '../franchises/franchisesData';
import type { SuperAgent } from '../franchises/franchisesData';
import { SuperAgentDrawer } from '../franchises/SuperAgentDrawer';
import { CreateSuperAgentModal } from './CreateSuperAgentModal';
import {
  SUPER_AGENT_CAPABILITIES,
  getSuperAgentView,
  ownsWholeDirectory,
  toSuperAgentRecord,
} from './superAgentsData';
import type { SuperAgentRow } from './superAgentsData';
import styles from './SuperAgentPage.module.css';

/** Super agent directory from node 112:698. */
export function SuperAgentPage({ role }: { role: RoleDefinition }) {
  const { rows, stats, highlights } = useMemo(() => getSuperAgentView(role), [role]);
  /** A franchise is looking at its own book, so the owning column is noise. */
  const showsFranchise = ownsWholeDirectory(role);

  const [query, setQuery] = useState('');
  const [created, setCreated] = useState<SuperAgentRow[]>([]);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState<SuperAgent | null>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return [...created, ...rows].filter(
      (row) =>
        !needle ||
        row.name.toLowerCase().includes(needle) ||
        row.code.toLowerCase().includes(needle) ||
        row.franchise.toLowerCase().includes(needle),
    );
  }, [created, rows, query]);

  const columns: Column<SuperAgentRow>[] = [
    { key: 'id', header: 'ID', render: (row) => <span className={styles.id}>{row.code}</span> },
    { key: 'name', header: 'Name', render: (row) => <span className={styles.name}>{row.name}</span> },
    ...(showsFranchise
      ? [
          {
            key: 'franchise',
            header: 'Franchise',
            render: (row: SuperAgentRow) => <span className={styles.muted}>{row.franchise}</span>,
          },
        ]
      : []),
    { key: 'agents', header: 'Agents', render: (row) => <span className={styles.strong}>{row.agents}</span> },
    { key: 'users', header: 'Users', render: (row) => <span className={styles.strong}>{row.users}</span> },
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
    { key: 'credit', header: 'Credit', render: (row) => <span className={styles.credit}>{row.credit}</span> },
    {
      key: 'exposure',
      header: 'Exposure',
      render: (row) => <span className={styles.exposure}>{row.exposure}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge tone={FRANCHISE_STATUS_TONE[row.status]}>{row.status}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className={styles.rowActions}>
          <IconButton
            icon={EyeIcon}
            label={`View ${row.name}`}
            onClick={() => setOpen(toSuperAgentRecord(row))}
          />
          <IconButton icon={PencilIcon} tone="warning" label={`Edit ${row.name}`} />
          {row.status === 'Suspended' ? (
            <IconButton icon={CheckCircleIcon} tone="success" label={`Reactivate ${row.name}`} />
          ) : (
            <IconButton icon={BanIcon} tone="danger" label={`Block ${row.name}`} />
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

      <CapabilityPanel />

      <section className={styles.card}>
        <div className={styles.toolbar}>
          <SearchInput
            className={styles.search}
            size="lg"
            placeholder="Search super agents..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
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
              Create Super Agent
            </Button>
          </div>
        </div>

        <div className={styles.table}>
          <DataTable
            columns={columns}
            rows={visible}
            rowKey={(row) => row.id}
            size="lg"
            emptyMessage="No super agents match this search."
          />
        </div>
      </section>

      <div className={styles.highlights}>
        {highlights.map((row) => (
          <article key={row.id} className={styles.highlight}>
            <div className={styles.highlightHead}>
              <div className={styles.highlightIdentity}>
                <span className={styles.avatar}>{row.name.slice(0, 1)}</span>
                <div>
                  <p className={styles.highlightName}>{row.name}</p>
                  <p className={styles.highlightMeta}>
                    {row.code} · {row.city}
                  </p>
                </div>
              </div>
              <Badge tone={FRANCHISE_STATUS_TONE[row.status]}>{row.status}</Badge>
            </div>
            <div className={styles.highlightMetrics}>
              <MetricTile size="sm" label="Agents" value={String(row.agents)} />
              <MetricTile size="sm" label="Users" value={row.users} />
              <MetricTile size="sm" label="Turnover" value={row.turnover} />
            </div>
          </article>
        ))}
      </div>

      {creating ? (
        <CreateSuperAgentModal
          onClose={() => setCreating(false)}
          onCreate={(row) => {
            setCreated((list) => [row, ...list]);
            setCreating(false);
          }}
        />
      ) : null}

      {open ? <SuperAgentDrawer superAgent={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}

/** "SUPER AGENT kya dekh aur kar sakta hai" — node 112:1069. */
function CapabilityPanel() {
  return (
    <section className={styles.capability}>
      <div className={styles.capabilityHead}>
        <span className={styles.capabilityTile}>
          <UsersCogIcon size={19.993} />
        </span>
        <div>
          <p className={styles.capabilityTitle}>SUPER AGENT kya dekh aur kar sakta hai</p>
          <p className={styles.capabilitySubtitle}>Only Within His Team</p>
        </div>
      </div>
      <div className={styles.capabilityGrid}>
        {SUPER_AGENT_CAPABILITIES.map((item) => (
          <div key={item} className={styles.capabilityItem}>
            <span className={styles.capabilityCheck}>
              <CheckCircleIcon size={12} />
            </span>
            <span className={styles.capabilityText}>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
