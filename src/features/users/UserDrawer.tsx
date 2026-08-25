import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  BanIcon,
  CalendarIcon,
  CheckCircleIcon,
  GlobeIcon,
  KeyIcon,
  MailIcon,
  MapPinIcon,
  MonitorIcon,
  PencilIcon,
  PhoneIcon,
  UserIcon,
  PulseIcon,
  SmartphoneIcon,
  UserCheckIcon,
  XCircleIcon,
} from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { Drawer } from '../../components/ui/Drawer/Drawer';
import { MetricTile } from '../../components/ui/MetricTile/MetricTile';
import { Tabs } from '../../components/ui/Tabs/Tabs';
import {
  KYC_TONE,
  RISK_TONE,
  STATUS_TONE,
  getActivity,
  getDevices,
  getKycFile,
  getLedger,
} from './usersData';
import type { BetHistoryEntry, Person } from './usersData';
import styles from './UserDrawer.module.css';

const TABS = ['Overview', 'Bets', 'Transactions', 'Kyc', 'Activity', 'Devices'] as const;
type Tab = (typeof TABS)[number];

export type UserDrawerProps = {
  person: Person;
  /** Section to open on, e.g. straight to the bet history. */
  defaultTab?: Tab;
  /** Franchise and Super Agent also see the owning agent (node 119:68771). */
  showAgent?: boolean;
  onClose: () => void;
};

/** User record sheet from nodes 79:6144 (overview) and 79:12933 (bets). */
export function UserDrawer({ person, defaultTab = 'Overview', showAgent = false, onClose }: UserDrawerProps) {
  const [tab, setTab] = useState<Tab>(defaultTab);

  return (
    <Drawer
      label={`${person.name} details`}
      onClose={onClose}
      header={
        <div className={styles.identity}>
          <span className={styles.avatar}>{person.name.slice(0, 1).toLowerCase()}</span>
          <div>
            <p className={styles.name}>{person.name}</p>
            <div className={styles.meta}>
              <span className={styles.code}>{person.id}</span>
              <Badge tone={STATUS_TONE[person.status]}>{person.status}</Badge>
              {showAgent && person.agent ? (
                <span className={styles.owner}>Agent: {person.agent}</span>
              ) : null}
            </div>
          </div>
        </div>
      }
      tabs={
        <Tabs
          items={TABS}
          value={tab}
          variant="underline"
          aria-label="User sections"
          onChange={setTab}
        />
      }
    >
      {tab === 'Overview' ? <OverviewTab person={person} showAgent={showAgent} /> : null}
      {tab === 'Bets' ? <BetsTab bets={person.bets} /> : null}
      {tab === 'Transactions' ? <TransactionsTab person={person} /> : null}
      {tab === 'Kyc' ? <KycTab person={person} /> : null}
      {tab === 'Activity' ? <ActivityTab person={person} /> : null}
      {tab === 'Devices' ? <DevicesTab person={person} /> : null}
    </Drawer>
  );
}

const TONE_COLOR = {
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  neutral: 'var(--color-text-muted)',
} as const;

function OverviewTab({ person, showAgent }: { person: Person; showAgent: boolean }) {
  return (
    <div>
      <div className={styles.metrics}>
        <MetricTile label="Balance" value={person.balance} color="var(--color-success)" />
        <MetricTile
          label="Total Bets"
          value={String(person.totalBets)}
          color="var(--color-primary)"
        />
        <MetricTile
          label="KYC Status"
          value={person.kyc.toLowerCase()}
          color={TONE_COLOR[KYC_TONE[person.kyc]]}
        />
        <MetricTile
          label="Risk Level"
          value={person.risk.toUpperCase()}
          color={TONE_COLOR[RISK_TONE[person.risk]]}
        />
      </div>

      <div className={styles.panel}>
        <p className={styles.panelTitle}>Contact Details</p>
        <DetailRow icon={<MailIcon size={12.991} />} label="Email" value={person.email} />
        <DetailRow icon={<PhoneIcon size={12.991} />} label="Phone" value={person.phone} />
        {showAgent && person.agent ? (
          <DetailRow icon={<UserIcon size={12.991} />} label="Agent" value={person.agent} />
        ) : null}
        <DetailRow icon={<CalendarIcon size={12.991} />} label="Joined" value={person.joined} />
      </div>

      <div className={styles.actions}>
        <Button variant="primary" size="sm" icon={<PencilIcon size={12.991} />}>
          Edit User
        </Button>
        <Button className={styles.danger} size="sm" icon={<BanIcon size={12.991} />}>
          Suspend
        </Button>
        <Button variant="outline" size="sm" icon={<KeyIcon size={12.991} />}>
          Reset PWD
        </Button>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      {icon}
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}

function BetsTab({ bets }: { bets: BetHistoryEntry[] }) {
  return (
    <div>
      <div className={styles.sectionHead}>
        <p className={styles.panelTitle}>Bet History</p>
        <Badge tone="brand">{bets.length} total bets</Badge>
      </div>

      {bets.length === 0 ? (
        <p className={styles.empty}>No bets placed yet.</p>
      ) : (
        bets.map((bet) => (
          <article key={bet.id} className={styles.betCard}>
            <div className={styles.betTop}>
              <div>
                <p className={styles.betEvent}>{bet.event}</p>
                <p className={styles.betMarket}>{bet.market}</p>
              </div>
              <div>
                <p className={bet.won ? styles.betAmountWon : styles.betAmountLost}>
                  {bet.won ? '' : '-'}
                  {bet.amount}
                </p>
                <p className={styles.betDate}>{bet.date}</p>
              </div>
            </div>
            <div className={styles.betBottom}>
              <span className={styles.betId}>{bet.id}</span>
              <span>Odds: {bet.odds}</span>
              <span>Stake: {bet.stake}</span>
              <Badge tone={bet.won ? 'success' : 'danger'}>{bet.won ? 'Won' : 'Lost'}</Badge>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

/** Transaction history — node 79:8679. */
function TransactionsTab({ person }: { person: Person }) {
  const entries = getLedger(person);

  return (
    <div className={styles.list}>
      <p className={styles.listTitle}>Transaction History</p>
      {entries.length === 0 ? (
        <p className={styles.empty}>No transactions yet.</p>
      ) : (
        entries.map((entry) => (
          <article key={entry.id} className={`${styles.row} ${styles.rowTight}`}>
            <div>
              <p className={styles.rowTitle}>{entry.type}</p>
              <p className={styles.rowRef}>{entry.reference}</p>
              <p className={styles.rowMeta}>{entry.meta}</p>
            </div>
            <div className={styles.rowRight}>
              <span className={entry.positive ? styles.amountUp : styles.amountDown}>
                {entry.amount}
              </span>
              <Badge tone={entry.status.tone}>{entry.status.label}</Badge>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

const KYC_BANNER_RGB: Record<Person['kyc'], string> = {
  Verified: '34, 197, 94',
  Pending: '250, 204, 21',
  Rejected: '239, 68, 68',
};

/** KYC file — node 79:9518. */
function KycTab({ person }: { person: Person }) {
  const { since, documents } = getKycFile(person);
  const rgb = KYC_BANNER_RGB[person.kyc];

  return (
    <div className={styles.kycStack}>
      <div
        className={styles.kycBanner}
        style={
          {
            '--banner-bg': `rgba(${rgb}, 0.08)`,
            '--banner-border': `rgba(${rgb}, 0.2)`,
            '--banner-color': `rgb(${rgb})`,
          } as CSSProperties
        }
      >
        <UserCheckIcon size={23.999} />
        <div>
          <p className={styles.kycBannerTitle}>KYC Status: {person.kyc}</p>
          <p className={styles.kycBannerMeta}>
            {person.kyc === 'Verified' ? 'Verified on' : 'Verification pending since'} {since}
          </p>
        </div>
      </div>

      <div className={styles.list}>
        {documents.map((document) => (
          <article key={document.label} className={styles.row}>
            <div>
              <p className={styles.rowTitle}>{document.label}</p>
              <p className={styles.kycValue}>{document.value}</p>
            </div>
            <Badge tone={KYC_TONE[document.state]}>{document.state}</Badge>
          </article>
        ))}
      </div>

      <div className={styles.kycActions}>
        <Button className={styles.approve} size="sm" icon={<CheckCircleIcon size={12.991} />}>
          Approve KYC
        </Button>
        <Button className={styles.reject} size="sm" icon={<XCircleIcon size={12.991} />}>
          Reject KYC
        </Button>
      </div>
    </div>
  );
}

/** Activity timeline — node 79:10332. */
function ActivityTab({ person }: { person: Person }) {
  const events = getActivity(person);

  return (
    <div>
      <p className={styles.listTitle}>Activity Timeline</p>
      {events.map((event, index) => (
        <article key={event.id} className={styles.timelineRow}>
          <div className={styles.timelineRail}>
            <span className={styles.timelineDot}>
              <PulseIcon size={12} />
            </span>
            {index < events.length - 1 ? <span className={styles.timelineLine} /> : null}
          </div>
          <div>
            <p className={styles.timelineTitle}>{event.title}</p>
            <p className={styles.timelineDetail}>{event.detail}</p>
            <p className={styles.timelineWhen}>{event.when}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

/** Logged-in devices — node 79:12074. */
function DevicesTab({ person }: { person: Person }) {
  const devices = getDevices(person);

  return (
    <div className={styles.list}>
      <p className={styles.listTitle}>Logged-in Devices</p>
      {devices.map((device) => {
        const Icon = device.kind === 'desktop' ? MonitorIcon : SmartphoneIcon;
        return (
          <article
            key={device.id}
            className={`${styles.row} ${device.current ? styles.deviceCurrent : ''}`}
          >
            <div className={styles.deviceMain}>
              <span
                className={`${styles.deviceTile} ${device.current ? styles.deviceTileCurrent : ''}`}
              >
                <Icon size={17.993} />
              </span>
              <div>
                <p className={styles.rowTitle}>{device.name}</p>
                <p className={styles.deviceMeta}>
                  <GlobeIcon size={9.994} />
                  {device.ip}
                </p>
                <p className={styles.deviceMeta}>
                  <MapPinIcon size={9.994} />
                  {device.location}
                </p>
                <p
                  className={`${styles.deviceSeen} ${device.current ? styles.deviceSeenActive : ''}`}
                >
                  {device.lastSeen}
                </p>
              </div>
            </div>
            {device.current ? (
              <span className={styles.chipCurrent}>Current</span>
            ) : (
              <button type="button" className={styles.chipRevoke}>
                Revoke
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}
