import { useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  BanIcon,
  BuildingIcon,
  CalendarIcon,
  CheckCircleIcon,
  MailIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  TransactionsIcon,
  UserIcon,
  UsersCogIcon,
  WalletIcon,
} from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { Drawer } from '../../components/ui/Drawer/Drawer';
import { MetricTile } from '../../components/ui/MetricTile/MetricTile';
import { Tabs } from '../../components/ui/Tabs/Tabs';
import { TextField } from '../../components/ui/TextField/TextField';
import {
  FRANCHISE_STATUS_TONE,
  getFranchiseSettings,
  getFranchiseWallet,
  getSuperAgents,
} from './franchisesData';
import type { Franchise, SuperAgent } from './franchisesData';
import { NetworkRow, NetworkSection, SummaryRow } from './NetworkRows';
import { SuperAgentDrawer } from './SuperAgentDrawer';
import styles from './FranchiseDrawer.module.css';

/**
 * Franchise record sheet — node 114:13787 (overview) plus the Super Agents,
 * Wallet and Settings tabs (nodes 116:15541, 116:16345, 116:17152).
 */
export function FranchiseDrawer({
  franchise,
  onClose,
}: {
  franchise: Franchise;
  onClose: () => void;
}) {
  const superAgents = useMemo(() => getSuperAgents(franchise), [franchise]);
  const tabs = [
    'Overview',
    `Super Agents (${superAgents.length})`,
    'Wallet',
    'Settings',
  ] as const;

  const [tab, setTab] = useState<string>(tabs[0]);
  const [openAgent, setOpenAgent] = useState<SuperAgent | null>(null);

  return (
    <>
      <Drawer
        label={`${franchise.name} details`}
        width={600}
        onClose={onClose}
        header={
          <div className={styles.identity}>
            <span className={styles.tile}>
              <BuildingIcon size={21.996} />
            </span>
            <div>
              <p className={styles.name}>{franchise.name}</p>
              <div className={styles.meta}>
                <span className={styles.code}>{franchise.code}</span>
                <Badge tone={FRANCHISE_STATUS_TONE[franchise.status]}>{franchise.status}</Badge>
              </div>
            </div>
          </div>
        }
        actions={
          <>
            <Button variant="primary" size="xs" icon={<PencilIcon size={12} />}>
              Edit
            </Button>
            <Button className={styles.block} size="xs" icon={<BanIcon size={12} />}>
              Block
            </Button>
          </>
        }
        tabs={
          <Tabs
            items={tabs}
            value={tab}
            variant="underline"
            aria-label="Franchise sections"
            onChange={setTab}
          />
        }
      >
        {tab === 'Overview' ? (
          <OverviewTab
            franchise={franchise}
            superAgentCount={superAgents.length}
            onViewSuperAgents={() => setTab(tabs[1])}
          />
        ) : null}

        {tab === tabs[1] ? (
          <NetworkSection
            title={`Super Agents under ${franchise.name}`}
            count={`${superAgents.length} super agents`}
          >
            {superAgents.map((superAgent) => (
              <NetworkRow
                key={superAgent.id}
                person={superAgent}
                onOpen={() => setOpenAgent(superAgent)}
              />
            ))}
          </NetworkSection>
        ) : null}

        {tab === 'Wallet' ? <WalletTab franchise={franchise} /> : null}
        {tab === 'Settings' ? <SettingsTab franchise={franchise} /> : null}
      </Drawer>

      {openAgent ? (
        <SuperAgentDrawer
          superAgent={openAgent}
          parentLabel="Franchise"
          onClose={() => setOpenAgent(null)}
        />
      ) : null}
    </>
  );
}

function OverviewTab({
  franchise,
  superAgentCount,
  onViewSuperAgents,
}: {
  franchise: Franchise;
  superAgentCount: number;
  onViewSuperAgents: () => void;
}) {
  return (
    <div className={styles.body}>
      <div className={styles.metrics}>
        <MetricTile
          label="Super Agents"
          value={String(superAgentCount)}
          color="var(--color-primary)"
        />
        <MetricTile
          label="Total Agents"
          value={String(franchise.agents)}
          color="var(--color-primary-light)"
        />
        <MetricTile label="Total Users" value={franchise.users} color="var(--color-success)" />
        <MetricTile label="Revenue" value={franchise.revenue} color="var(--color-warning)" />
        <MetricTile
          label="Credit Limit"
          value={franchise.credit}
          color="var(--color-primary-light)"
        />
        <MetricTile label="Exposure" value={franchise.exposure} color="var(--color-live)" />
      </div>

      <div className={styles.panel}>
        <p className={styles.panelTitle}>Contact Information</p>
        <Row icon={<UserIcon size={12.992} />} label="Owner" value={franchise.owner} />
        <Row icon={<PhoneIcon size={12.992} />} label="Phone" value={franchise.phone} />
        <Row icon={<MailIcon size={12.992} />} label="Email" value={franchise.email} />
        <Row icon={<MapPinIcon size={12.992} />} label="Location" value={franchise.location} />
        <Row icon={<CalendarIcon size={12.992} />} label="Joined" value={franchise.joined} />
      </div>

      <Button
        className={styles.cta}
        variant="primary"
        size="sm"
        block
        icon={<UsersCogIcon size={12.992} />}
        onClick={onViewSuperAgents}
      >
        View {superAgentCount} Super Agents
      </Button>
    </div>
  );
}

function WalletTab({ franchise }: { franchise: Franchise }) {
  const wallet = getFranchiseWallet(franchise);

  return (
    <div className={styles.body}>
      <div className={styles.walletTiles}>
        <WalletTile label="Credit Balance" value={wallet.credit} rgb="34, 197, 94" />
        <WalletTile label="Current Exposure" value={wallet.exposure} rgb="255, 46, 99" />
      </div>

      <div className={styles.walletActions}>
        <Button variant="primary" size="sm" icon={<WalletIcon size={13} />}>
          Adjust Credit
        </Button>
        <Button variant="outline" size="sm" icon={<TransactionsIcon size={13} />}>
          View Txns
        </Button>
      </div>

      {wallet.rows.map((row) => (
        <SummaryRow key={row.label} stat={row} />
      ))}
    </div>
  );
}

function WalletTile({ label, value, rgb }: { label: string; value: string; rgb: string }) {
  return (
    <div
      className={styles.walletTile}
      style={
        {
          '--tile-bg': `rgba(${rgb}, 0.08)`,
          '--tile-border': `rgba(${rgb}, 0.2)`,
          '--tile-color': `rgb(${rgb})`,
        } as CSSProperties
      }
    >
      <p className={styles.walletLabel}>{label}</p>
      <p className={styles.walletValue}>{value}</p>
    </div>
  );
}

function SettingsTab({ franchise }: { franchise: Franchise }) {
  const initial = getFranchiseSettings(franchise);
  const [form, setForm] = useState(initial);
  const set = (key: keyof typeof initial) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className={styles.settings}>
      <TextField
        label="Commission Percentage"
        labelCase="caps"
        value={form.commissionPercentage}
        onChange={(event) => set('commissionPercentage')(event.target.value)}
      />
      <TextField
        label="Betting Limit per User"
        labelCase="caps"
        value={form.bettingLimit}
        onChange={(event) => set('bettingLimit')(event.target.value)}
      />
      <TextField
        label="Max Exposure Limit"
        labelCase="caps"
        value={form.maxExposure}
        onChange={(event) => set('maxExposure')(event.target.value)}
      />
      <TextField
        label="Settlement Cycle"
        labelCase="caps"
        value={form.settlementCycle}
        onChange={(event) => set('settlementCycle')(event.target.value)}
      />
      <Button className={styles.save} variant="primary" size="sm" icon={<CheckCircleIcon size={13} />}>
        Save Settings
      </Button>
    </div>
  );
}

function Row({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className={styles.row}>
      {icon}
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  );
}
