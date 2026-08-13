import { useMemo, useState } from 'react';
import {
  BanIcon,
  BuildingIcon,
  CheckCircleIcon,
  ExportIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
} from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { MetricTile } from '../../components/ui/MetricTile/MetricTile';
import { SearchInput } from '../../components/ui/SearchInput/SearchInput';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import type { RoleDefinition } from '../../config/roles';
import { CreateFranchiseModal } from './CreateFranchiseModal';
import { FranchiseDrawer } from './FranchiseDrawer';
import { FRANCHISE_STATUS_TONE, getFranchiseView } from './franchisesData';
import type { Franchise } from './franchisesData';
import styles from './FranchisePage.module.css';

/** Franchise directory from node 111:3 — stats, toolbar and a card grid. */
export function FranchisePage({ role }: { role: RoleDefinition }) {
  const { franchises, stats } = useMemo(() => getFranchiseView(role), [role]);

  const [query, setQuery] = useState('');
  const [created, setCreated] = useState<Franchise[]>([]);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState<Franchise | null>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return [...created, ...franchises].filter(
      (franchise) =>
        !needle ||
        franchise.name.toLowerCase().includes(needle) ||
        franchise.code.toLowerCase().includes(needle) ||
        franchise.owner.toLowerCase().includes(needle),
    );
  }, [created, franchises, query]);

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className={styles.card}>
        <div className={styles.toolbar}>
          <SearchInput
            className={styles.search}
            size="lg"
            placeholder="Search franchises..."
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
              Create Franchise
            </Button>
          </div>
        </div>

        {visible.length === 0 ? (
          <p className={styles.empty}>No franchises match this search.</p>
        ) : (
          <div className={styles.grid}>
            {visible.map((franchise) => (
              <FranchiseRecord
                key={franchise.id}
                franchise={franchise}
                onView={() => setOpen(franchise)}
              />
            ))}
          </div>
        )}
      </section>

      {creating ? (
        <CreateFranchiseModal
          onClose={() => setCreating(false)}
          onCreate={(franchise) => {
            setCreated((list) => [franchise, ...list]);
            setCreating(false);
          }}
        />
      ) : null}

      {open ? <FranchiseDrawer franchise={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}

function FranchiseRecord({ franchise, onView }: { franchise: Franchise; onView: () => void }) {
  const suspended = franchise.status === 'Suspended';

  return (
    <article className={styles.record}>
      <div className={styles.recordHead}>
        <div className={styles.identity}>
          <span className={styles.tile}>
            <BuildingIcon size={17.999} />
          </span>
          <div>
            <p className={styles.name}>{franchise.name}</p>
            <p className={styles.owner}>
              {franchise.code} · {franchise.owner}
            </p>
          </div>
        </div>
        <Badge tone={FRANCHISE_STATUS_TONE[franchise.status]}>{franchise.status}</Badge>
      </div>

      <div className={styles.metrics}>
        <MetricTile size="sm" label="Agents" value={String(franchise.agents)} />
        <MetricTile size="sm" label="Users" value={franchise.users} />
        <MetricTile size="sm" label="Revenue" value={franchise.revenue} />
      </div>

      <div className={styles.ledger}>
        <span>
          Credit: <span className={`${styles.ledgerValue} ${styles.credit}`}>{franchise.credit}</span>
        </span>
        <span>
          Exposure:{' '}
          <span className={`${styles.ledgerValue} ${styles.exposure}`}>{franchise.exposure}</span>
        </span>
        <span>
          Comm:{' '}
          <span className={`${styles.ledgerValue} ${styles.commission}`}>{franchise.commission}</span>
        </span>
      </div>

      <div className={styles.recordActions}>
        <Button
          className={styles.grow}
          variant="primary"
          size="xs"
          icon={<EyeIcon size={12} />}
          onClick={onView}
        >
          View
        </Button>
        <Button className={styles.grow} variant="outline" size="xs" icon={<PencilIcon size={12} />}>
          Edit
        </Button>
        <Button
          className={suspended ? styles.unblock : styles.block}
          size="xs"
          aria-label={suspended ? `Reactivate ${franchise.name}` : `Block ${franchise.name}`}
          icon={suspended ? <CheckCircleIcon size={12} /> : <BanIcon size={12} />}
        />
      </div>
    </article>
  );
}
