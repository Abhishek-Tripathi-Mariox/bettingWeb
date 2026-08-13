import { StatCard } from '../../components/ui/StatCard/StatCard';
import type { RoleDefinition } from '../../config/roles';
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
 * The dashboard from node 79:1537. The same composition serves every role —
 * only the figures behind it change (see `getDashboard`).
 */
export function DashboardView({ role }: { role: RoleDefinition }) {
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
