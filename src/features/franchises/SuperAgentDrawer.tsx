import { useState } from 'react';
import {
  BanIcon,
  BuildingIcon,
  ChevronRightIcon,
  PencilIcon,
  UserIcon,
  UsersCogIcon,
} from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { Drawer } from '../../components/ui/Drawer/Drawer';
import { MetricTile } from '../../components/ui/MetricTile/MetricTile';
import { Tabs } from '../../components/ui/Tabs/Tabs';
import { FRANCHISE_STATUS_TONE } from './franchisesData';
import type { SuperAgent } from './franchisesData';
import { NetworkRow, NetworkSection, SummaryRow } from './NetworkRows';
import styles from './SuperAgentDrawer.module.css';

/**
 * Super agent record sheet — nodes 116:17943 (overview), 116:18917 (agents),
 * 116:19859 (users) and 116:20803 (performance). Opened from the franchise
 * drawer, so it keeps the parent in the breadcrumb.
 */
export function SuperAgentDrawer({
  superAgent,
  /** Shown only when the sheet is stacked over the franchise drawer. */
  parentLabel,
  onClose,
}: {
  superAgent: SuperAgent;
  parentLabel?: string;
  onClose: () => void;
}) {
  const tabs = [
    'Overview',
    `Agents (${superAgent.agents.length})`,
    `Users (${superAgent.users.length})`,
    'Performance',
  ] as const;
  const [tab, setTab] = useState<string>(tabs[0]);

  return (
    <Drawer
      label={`${superAgent.name} details`}
      onClose={onClose}
      header={
        <div>
          {parentLabel ? (
            <p className={styles.breadcrumb}>
              <span className={styles.breadcrumbParent}>{parentLabel}</span>
              <ChevronRightIcon size={10} />
              <span>Super Agent Details</span>
            </p>
          ) : null}
          <div className={styles.identity}>
            <span className={styles.avatar}>{superAgent.name.slice(0, 1)}</span>
            <div>
              <p className={styles.name}>{superAgent.name}</p>
              <div className={styles.meta}>
                <span className={styles.code}>{superAgent.code}</span>
                <Badge tone={FRANCHISE_STATUS_TONE[superAgent.status]}>{superAgent.status}</Badge>
              </div>
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
          aria-label="Super agent sections"
          onChange={setTab}
        />
      }
    >
      {tab === 'Overview' ? <OverviewTab superAgent={superAgent} onJump={setTab} tabs={tabs} /> : null}

      {tab === tabs[1] ? (
        <NetworkSection
          title={`Agents Under ${superAgent.name}`}
          count={`${superAgent.agents.length} agents`}
        >
          {superAgent.agents.map((agent) => (
            <NetworkRow key={agent.id} person={agent} />
          ))}
        </NetworkSection>
      ) : null}

      {tab === tabs[2] ? (
        <NetworkSection
          title={`Users Under ${superAgent.name}'s Network`}
          count={`${superAgent.users.length} users`}
        >
          {superAgent.users.map((user) => (
            <NetworkRow key={user.id} person={user} />
          ))}
        </NetworkSection>
      ) : null}

      {tab === 'Performance' ? (
        <div className={styles.body}>
          {superAgent.performance.map((row) => (
            <SummaryRow key={row.label} stat={row} delta={row.delta} />
          ))}
        </div>
      ) : null}
    </Drawer>
  );
}

function OverviewTab({
  superAgent,
  onJump,
  tabs,
}: {
  superAgent: SuperAgent;
  onJump: (tab: string) => void;
  tabs: readonly string[];
}) {
  return (
    <div className={styles.body}>
      <div className={styles.parent}>
        <div className={styles.parentMain}>
          <span className={styles.parentTile}>
            <BuildingIcon size={16} />
          </span>
          <div>
            <p className={styles.parentLabel}>Under Franchise</p>
            <p className={styles.parentName}>{superAgent.franchiseName}</p>
          </div>
        </div>
        <span className={styles.tier}>{superAgent.tier}</span>
      </div>

      <div className={styles.metrics}>
        {superAgent.metrics.map((metric) => (
          <MetricTile
            key={metric.label}
            label={metric.label}
            value={metric.value}
            color={metric.color}
          />
        ))}
      </div>

      <div className={styles.panel}>
        <p className={styles.panelTitle}>Contact Details</p>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Phone</span>
          <span className={styles.rowValue}>{superAgent.phone}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Email</span>
          <span className={styles.rowValue}>{superAgent.email}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Joined</span>
          <span className={styles.rowValue}>{superAgent.joined}</span>
        </div>
      </div>

      <div className={styles.ctas}>
        <Button
          variant="primary"
          size="sm"
          icon={<UsersCogIcon size={13} />}
          onClick={() => onJump(tabs[1])}
        >
          View {superAgent.agents.length} Agents
        </Button>
        <Button
          variant="outline"
          size="sm"
          icon={<UserIcon size={13} />}
          onClick={() => onJump(tabs[2])}
        >
          View {superAgent.users.length} Users
        </Button>
      </div>
    </div>
  );
}
