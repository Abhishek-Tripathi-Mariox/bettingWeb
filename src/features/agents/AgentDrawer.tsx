import { useState } from 'react';
import type { CSSProperties } from 'react';
import {
  AnalyticsIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BanIcon,
  ChevronRightIcon,
  ExportIcon,
  EyeIcon,
  PencilIcon,
  PulseIcon,
  TransactionsIcon,
  UsersIcon,
  WalletIcon,
} from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { Drawer } from '../../components/ui/Drawer/Drawer';
import { MetricTile } from '../../components/ui/MetricTile/MetricTile';
import { SearchInput } from '../../components/ui/SearchInput/SearchInput';
import { Tabs } from '../../components/ui/Tabs/Tabs';
import {
  AGENT_STATUS_TONE,
  getAgentActivity,
  getAgentReports,
  getAgentTransactions,
  getAgentUsers,
  getAgentWallet,
  getAssignedSuperAgent,
} from './agentsData';
import type { AgentRow } from './agentsData';
import styles from './AgentDrawer.module.css';

const TABS = ['Overview', 'Users', 'Wallet', 'Transactions', 'Reports', 'Activity'] as const;
type Tab = (typeof TABS)[number];

/**
 * Agent record sheet — nodes 116:27600 (overview), 116:28563 (users),
 * 116:29510 (wallet), 116:30416 (transactions), 116:31356 (reports) and
 * 116:33379 (activity).
 */
export function AgentDrawer({ agent, onClose }: { agent: AgentRow; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('Overview');

  return (
    <Drawer
      label={`${agent.name} details`}
      width={600}
      onClose={onClose}
      header={
        <div className={styles.identity}>
          <span className={styles.avatar}>{agent.name.slice(0, 1)}</span>
          <div>
            <p className={styles.name}>{agent.name}</p>
            <div className={styles.meta}>
              <span className={styles.code}>{agent.code}</span>
              <Badge tone={AGENT_STATUS_TONE[agent.status]}>{agent.status}</Badge>
              <span className={styles.parentCode}>SA: {agent.superAgentCode}</span>
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
          items={TABS}
          value={tab}
          variant="underline"
          accent="var(--color-success)"
          aria-label="Agent sections"
          onChange={setTab}
        />
      }
    >
      {tab === 'Overview' ? <OverviewTab agent={agent} onJump={setTab} /> : null}
      {tab === 'Users' ? <UsersTab agent={agent} /> : null}
      {tab === 'Wallet' ? <WalletTab agent={agent} /> : null}
      {tab === 'Transactions' ? <TransactionsTab /> : null}
      {tab === 'Reports' ? <ReportsTab /> : null}
      {tab === 'Activity' ? <ActivityTab /> : null}
    </Drawer>
  );
}

function OverviewTab({ agent, onJump }: { agent: AgentRow; onJump: (tab: Tab) => void }) {
  const owner = getAssignedSuperAgent(agent);

  return (
    <div className={styles.body}>
      <div className={styles.metrics}>
        <MetricTile label="Total Users" value={String(agent.users)} color="var(--color-success)" />
        <MetricTile label="Turnover" value={agent.turnover} color="var(--color-warning)" />
        <MetricTile label="Commission" value={agent.commission} color="var(--color-primary)" />
        <MetricTile
          label="Wallet Balance"
          value={agent.wallet}
          color="var(--color-primary-light)"
        />
        <MetricTile label="Super Agent" value={agent.superAgentCode} color="var(--color-text-muted)" />
        <MetricTile label="Joined" value={agent.joined} color="var(--color-text-muted)" />
      </div>

      <div className={styles.panel}>
        <p className={styles.panelTitle}>Contact Details</p>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Phone</span>
          <span className={styles.rowValue}>{agent.phone}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Email</span>
          <span className={styles.rowValue}>{agent.email}</span>
        </div>
      </div>

      <div className={styles.assigned}>
        <p className={styles.assignedLabel}>Assigned Super Agent</p>
        <div className={styles.assignedRow}>
          <div className={styles.assignedMain}>
            <span className={styles.assignedTile}>{owner.name.slice(0, 1)}</span>
            <div>
              <p className={styles.assignedName}>{owner.name}</p>
              <p className={styles.assignedMeta}>
                {owner.code} · {owner.franchise}
              </p>
              <div className={styles.assignedTags}>
                <Badge tone="success">Active</Badge>
                <span className={styles.assignedSince}>{owner.since}</span>
              </div>
            </div>
          </div>
          <Button
            className={styles.viewDetails}
            size="xs"
            trailingIcon={<ChevronRightIcon size={12} />}
          >
            View Details
          </Button>
        </div>
      </div>

      <div className={styles.ctas}>
        <Button variant="primary" size="sm" icon={<UsersIcon size={13} />} onClick={() => onJump('Users')}>
          View Users
        </Button>
        <Button
          className={styles.ctaWallet}
          size="sm"
          icon={<WalletIcon size={13} />}
          onClick={() => onJump('Wallet')}
        >
          Wallet
        </Button>
        <Button
          className={styles.ctaReports}
          size="sm"
          icon={<AnalyticsIcon size={13} />}
          onClick={() => onJump('Reports')}
        >
          Reports
        </Button>
      </div>
    </div>
  );
}

function UsersTab({ agent }: { agent: AgentRow }) {
  const users = getAgentUsers();
  const [query, setQuery] = useState('');
  const visible = users.filter(
    (user) => !query.trim() || user.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className={styles.body}>
      <div className={styles.listHead}>
        <p className={styles.listTitle}>Users under {agent.name}</p>
        <Badge tone="brand">{agent.users} total</Badge>
      </div>

      <SearchInput
        size="lg"
        placeholder="Search users..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {visible.map((user) => (
        <article key={user.id} className={styles.userRow}>
          <div className={styles.userMain}>
            <span className={styles.userAvatar}>{user.name.slice(0, 1)}</span>
            <div>
              <p className={styles.userName}>{user.name}</p>
              <p className={styles.userMeta}>{user.meta}</p>
            </div>
          </div>
          <div className={styles.userTail}>
            <Badge tone={AGENT_STATUS_TONE[user.status]}>{user.status}</Badge>
            <button type="button" className={styles.open} aria-label={`Open ${user.name}`}>
              <EyeIcon size={13} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function WalletTab({ agent }: { agent: AgentRow }) {
  const wallet = getAgentWallet(agent);

  return (
    <div className={styles.body}>
      <div className={styles.balanceCard}>
        <p className={styles.balanceLabel}>Current Wallet Balance</p>
        <p className={styles.balanceValue}>{wallet.balance}</p>
        <div className={styles.balanceActions}>
          <Button className={styles.deposit} size="xs" icon={<ArrowDownIcon size={12} />}>
            Deposit
          </Button>
          <Button className={styles.withdraw} size="xs" icon={<ArrowUpIcon size={12} />}>
            Withdraw
          </Button>
          <Button variant="quiet" size="xs" icon={<TransactionsIcon size={12} />}>
            Transfer
          </Button>
        </div>
      </div>

      <div className={styles.walletTiles}>
        {wallet.tiles.map((tile) => (
          <MetricTile key={tile.label} label={tile.label} value={tile.value} color={tile.color} />
        ))}
      </div>
    </div>
  );
}

function TransactionsTab() {
  return (
    <div className={styles.body}>
      <div className={styles.listHead}>
        <p className={styles.listTitle}>Agent Transactions</p>
        <Button variant="quiet" size="xs" icon={<ExportIcon size={12} />}>
          Export
        </Button>
      </div>

      {getAgentTransactions().map((txn) => (
        <article key={txn.id} className={styles.txnRow}>
          <div>
            <p className={styles.txnTitle}>
              {txn.type} <span className={styles.txnPerson}>— {txn.person}</span>
            </p>
            <p className={styles.txnMeta}>{txn.meta}</p>
          </div>
          <div className={styles.txnRight}>
            <span className={txn.positive ? styles.amountUp : styles.amountDown}>{txn.amount}</span>
            <Badge tone={txn.status.tone}>{txn.status.label}</Badge>
          </div>
        </article>
      ))}
    </div>
  );
}

function ReportsTab() {
  return (
    <div className={styles.body}>
      <p className={styles.listTitle}>Agent Reports</p>
      {getAgentReports().map((report) => {
        const Icon = report.icon;
        return (
          <button
            key={report.title}
            type="button"
            className={styles.reportRow}
            style={
              {
                '--report-bg': `rgba(${report.rgb}, 0.12)`,
                '--report-color': `rgb(${report.rgb})`,
              } as CSSProperties
            }
          >
            <span className={styles.reportTile}>
              <Icon size={16} />
            </span>
            <span>
              <span className={styles.reportTitle}>{report.title}</span>
              <br />
              <span className={styles.reportDescription}>{report.description}</span>
            </span>
            <ChevronRightIcon className={styles.reportChevron} size={12} />
          </button>
        );
      })}
    </div>
  );
}

function ActivityTab() {
  const events = getAgentActivity();

  return (
    <div>
      <p className={styles.listTitle}>Activity Timeline</p>
      {events.map((event, index) => (
        <article
          key={event.id}
          className={styles.timelineRow}
          style={
            {
              '--event-bg': `rgba(${event.rgb}, 0.15)`,
              '--event-border': `rgba(${event.rgb}, 0.3)`,
              '--event-color': `rgb(${event.rgb})`,
            } as CSSProperties
          }
        >
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
