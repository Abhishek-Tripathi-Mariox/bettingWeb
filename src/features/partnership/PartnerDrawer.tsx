import { useState } from 'react';
import type { CSSProperties } from 'react';
import { BanIcon, CheckCircleIcon, PencilIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { Drawer } from '../../components/ui/Drawer/Drawer';
import { Tabs } from '../../components/ui/Tabs/Tabs';
import { TextField } from '../../components/ui/TextField/TextField';
import {
  PARTNER_STATUS_TONE,
  REVENUE_MONTHS,
  REVENUE_TOTAL,
  SETTLEMENTS,
} from './partnershipData';
import type { Partner } from './partnershipData';
import styles from './PartnerDrawer.module.css';

const TABS = ['Overview', 'Revenue', 'Settings'] as const;
type Tab = (typeof TABS)[number];

export type PartnerDrawerProps = {
  partner: Partner;
  onEdit: () => void;
  onClose: () => void;
};

/**
 * Partner detail sheet — nodes 119:52099 (overview), 119:52900 (revenue) and
 * 119:53743 (settings). One panel; only the tab body changes.
 */
export function PartnerDrawer({ partner, onEdit, onClose }: PartnerDrawerProps) {
  const [tab, setTab] = useState<Tab>('Overview');

  const summary = [
    { label: 'Rev Share', value: partner.revShare, color: 'var(--color-warning)' },
    { label: 'Monthly Fee', value: partner.monthlyFee, color: 'var(--color-danger)' },
    { label: 'Bet Volume', value: partner.betVolume, color: 'var(--color-primary)' },
  ];

  return (
    <Drawer
      label={`${partner.name} detail`}
      width={580}
      surface="raised"
      headerClassName={styles.header}
      headerLayout="stack"
      onClose={onClose}
      actions={
        <>
          <Button variant="primary" size="xs" icon={<PencilIcon size={12} />} onClick={onEdit}>
            Edit
          </Button>
          <Button className={styles.deactivate} size="xs" icon={<BanIcon size={12} />}>
            Deactivate
          </Button>
        </>
      }
      header={
        <div className={styles.identity}>
          <p className={styles.name}>{partner.name}</p>
          <div className={styles.meta}>
            <Badge tone="brand">{partner.type}</Badge>
            <Badge tone={PARTNER_STATUS_TONE[partner.status]}>{partner.status}</Badge>
            <span className={styles.since}>Since {partner.since}</span>
          </div>

          <div className={styles.summary}>
            {summary.map((tile) => (
              <div
                key={tile.label}
                className={styles.summaryTile}
                style={{ '--tile-color': tile.color } as CSSProperties}
              >
                <p className={styles.tileLabel}>{tile.label}</p>
                <p className={styles.tileValue}>{tile.value}</p>
              </div>
            ))}
          </div>
        </div>
      }
      tabs={
        <Tabs items={TABS} value={tab} variant="underline" aria-label="Partner sections" onChange={setTab} />
      }
    >
      {tab === 'Overview' ? <OverviewTab partner={partner} /> : null}
      {tab === 'Revenue' ? <RevenueTab /> : null}
      {tab === 'Settings' ? <SettingsTab partner={partner} /> : null}
    </Drawer>
  );
}

function OverviewTab({ partner }: { partner: Partner }) {
  const details = [
    { label: 'Partner ID', value: partner.id },
    { label: 'Type', value: partner.type },
    { label: 'Contact', value: partner.contact },
    { label: 'Email', value: partner.email },
    { label: 'Website', value: partner.website },
    { label: 'Partner Since', value: partner.since },
  ];

  return (
    <div className={styles.body}>
      <div className={styles.details}>
        {details.map((detail) => (
          <div key={detail.label} className={styles.detail}>
            <p className={styles.tileLabel}>{detail.label}</p>
            <p className={styles.detailValue}>{detail.value}</p>
          </div>
        ))}
      </div>

      <div className={styles.apiCard}>
        <p className={styles.cardLabel}>API Key</p>
        <p className={styles.apiKey}>{partner.apiKey}</p>
      </div>

      <div className={styles.notesCard}>
        <p className={styles.cardLabel}>Notes</p>
        <p className={styles.notes}>{partner.notes}</p>
      </div>
    </div>
  );
}

function RevenueTab() {
  const peak = Math.max(...REVENUE_MONTHS.map((month) => month.value));

  return (
    <div className={styles.body}>
      <div className={styles.totalCard}>
        <p className={styles.cardLabel}>Total Revenue Shared (6 months)</p>
        <p className={styles.totalValue}>{REVENUE_TOTAL}</p>
      </div>

      <section>
        <p className={styles.sectionTitle}>Monthly Revenue Share</p>
        {/* Labelled column strip — a value above each bar, the month below. */}
        <div className={styles.bars}>
          {REVENUE_MONTHS.map((month) => (
            <div key={month.month} className={styles.bar}>
              <span className={styles.barValue}>{month.label}</span>
              <div
                className={styles.barFill}
                style={{ height: `${(month.value / peak) * 70}px` }}
              />
              <span className={styles.barMonth}>{month.month}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className={styles.sectionTitle}>Settlement History</p>
        {SETTLEMENTS.map((settlement) => (
          <div key={settlement.period} className={styles.settlement}>
            <span className={styles.settlementPeriod}>{settlement.period}</span>
            <span className={styles.settlementAmount}>{settlement.amount}</span>
            <Badge tone="success">{settlement.status}</Badge>
          </div>
        ))}
      </section>
    </div>
  );
}

function SettingsTab({ partner }: { partner: Partner }) {
  const [form, setForm] = useState({
    name: partner.name,
    revShare: partner.revShare,
    monthlyFee: partner.monthlyFee,
    email: partner.email,
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className={styles.body}>
      <TextField
        label="Partner Name"
        labelCase="caps"
        value={form.name}
        onChange={(event) => set('name')(event.target.value)}
      />
      <TextField
        label="Revenue Share"
        labelCase="caps"
        value={form.revShare}
        onChange={(event) => set('revShare')(event.target.value)}
      />
      <TextField
        label="Monthly Fee"
        labelCase="caps"
        value={form.monthlyFee}
        onChange={(event) => set('monthlyFee')(event.target.value)}
      />
      <TextField
        label="Contact Email"
        labelCase="caps"
        type="email"
        value={form.email}
        onChange={(event) => set('email')(event.target.value)}
      />

      <Button variant="primary" size="sm" block icon={<CheckCircleIcon size={13.993} />}>
        Save Settings
      </Button>
    </div>
  );
}
