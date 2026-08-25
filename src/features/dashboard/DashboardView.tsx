import { StatCard } from '../../components/ui/StatCard/StatCard';
import type { RoleDefinition } from '../../config/roles';
import { AgentDashboard } from './AgentDashboard';
import { getDashboard } from './dashboardData';
import {
  CommissionPanel,
  RevenuePanel,
  SportSplitPanel,
  WalletFlowPanel,
} from './widgets/ChartPanels';
import { ActivityFeedPanel, RecentBetsPanel, TransactionsPanel } from './widgets/LedgerPanels';
import { LiveMatchesPanel, RiskAlertsPanel, SystemHealthPanel } from './widgets/MonitorPanels';
import styles from './DashboardView.module.css';

/**
 * The dashboard from node 79:1537. One composition serves the three panels
 * that oversee a network — only the figures change (see `getDashboard`). The
 * agent runs a single book and gets its own screen entirely (node 139:114739).
 */
export function DashboardView({ role }: { role: RoleDefinition }) {
  if (role.id === 'agent') return <AgentDashboard />;

  return <NetworkDashboard role={role} />;
}

function NetworkDashboard({ role }: { role: RoleDefinition }) {
  const data = getDashboard(role.id);

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {data.stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className={styles.split}>
        <RevenuePanel data={data.revenue} />
        <SportSplitPanel data={data.sports} />
      </div>

      <div className={styles.wide}>
        <WalletFlowPanel data={data.walletFlow} />
        <CommissionPanel rows={data.commission} total={data.commissionTotal} />
      </div>

      <div className={styles.split}>
        <LiveMatchesPanel matches={data.liveMatches} />
        <div className={styles.column}>
          <RiskAlertsPanel alerts={data.riskAlerts} />
          <SystemHealthPanel metrics={data.health} />
        </div>
      </div>

      <TransactionsPanel rows={data.transactions} />

      <div className={styles.wide}>
        <RecentBetsPanel rows={data.bets} />
        <ActivityFeedPanel entries={data.activity} />
      </div>
    </div>
  );
}
