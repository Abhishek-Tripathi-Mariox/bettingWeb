import { useState } from 'react';
import { EyeIcon, PencilIcon, PlusIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { PillTabs } from '../../components/ui/PillTabs/PillTabs';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { PartnerDrawer } from './PartnerDrawer';
import { PartnerFormModal } from './PartnerFormModal';
import {
  PARTNERS,
  PARTNER_STATS,
  PARTNER_STATUS_TONE,
  PARTNER_TABS,
} from './partnershipData';
import type { Partner } from './partnershipData';
import styles from './PartnershipPage.module.css';

const TABS = PARTNER_TABS.map((label) => ({ label }));

/** Partnership directory — node 112:7569. */
export function PartnershipPage() {
  const [tab, setTab] = useState<string>(PARTNER_TABS[0]);
  const [rows, setRows] = useState<Partner[]>(PARTNERS);
  /** null = closed, 'new' = Add Partnership, a row = Edit Partnership. */
  const [form, setForm] = useState<Partner | 'new' | null>(null);
  const [open, setOpen] = useState<Partner | null>(null);

  const handleSubmit = (partner: Partner) => {
    setRows((current) =>
      current.some((item) => item.id === partner.id)
        ? current.map((item) => (item.id === partner.id ? partner : item))
        : [
            ...current,
            { ...partner, id: `P${String(current.length + 1).padStart(3, '0')}` },
          ],
    );
    setForm(null);
  };

  const columns: Column<Partner>[] = [
    { key: 'id', header: 'ID', render: (row) => <span className={styles.code}>{row.id}</span> },
    { key: 'name', header: 'Partner Name', render: (row) => <span className={styles.name}>{row.name}</span> },
    { key: 'type', header: 'Type', render: (row) => <Badge tone="brand">{row.type}</Badge> },
    { key: 'revShare', header: 'Rev Share', render: (row) => <span className={styles.revShare}>{row.revShare}</span> },
    { key: 'fee', header: 'Monthly Fee', render: (row) => <span className={styles.fee}>{row.monthlyFee}</span> },
    { key: 'volume', header: 'Bet Volume', render: (row) => <span className={styles.volume}>{row.betVolume}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge tone={PARTNER_STATUS_TONE[row.status]}>{row.status}</Badge>,
    },
    { key: 'since', header: 'Since', render: (row) => <span className={styles.since}>{row.since}</span> },
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
          <Button
            className={styles.view}
            size="xs"
            icon={<EyeIcon size={12} />}
            onClick={() => setOpen(row)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {PARTNER_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className={styles.card}>
        <div className={styles.head}>
          <PillTabs items={TABS} value={tab} label="Partnership sections" onChange={setTab} />
          <Button
            variant="primary"
            size="xs"
            icon={<PlusIcon size={12} />}
            onClick={() => setForm('new')}
          >
            Add Partnership
          </Button>
        </div>

        <div className={styles.table}>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            size="lg"
            emptyMessage="No partnerships yet."
          />
        </div>
      </section>

      {open ? (
        <PartnerDrawer
          partner={open}
          onEdit={() => {
            setForm(open);
            setOpen(null);
          }}
          onClose={() => setOpen(null)}
        />
      ) : null}

      {form ? (
        <PartnerFormModal
          partner={form === 'new' ? null : form}
          onClose={() => setForm(null)}
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
}
