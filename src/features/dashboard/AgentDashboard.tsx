import type { CSSProperties } from 'react';
import { BarChart } from '../../components/charts/BarChart';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { SectionCard } from '../../components/ui/SectionCard/SectionCard';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { cx } from '../../lib/cx';
import {
  AGENT_ACTIVITY,
  AGENT_COMMISSION_WEEK,
  AGENT_OVERVIEW,
  AGENT_STATS,
  AGENT_TRANSACTIONS,
  AGENT_TXN_TONE,
} from './agentDashboardData';
import styles from './AgentDashboard.module.css';

/** Rupee-denominated axis, one decimal — "₹0.0k" through "₹8.0k". */
const rupeesCompact = (value: number) => `₹${(value / 1000).toFixed(1)}k`;

const COMMISSION_SERIES = [{ name: 'Commission', color: 'var(--color-success)' }];

/**
 * The agent's own dashboard — node 139:114739. An agent runs a single book of
 * players, so this is a different composition from the platform dashboard:
 * no market charts or system monitors, and every figure is scoped to "my".
 */
export function AgentDashboard() {
  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {AGENT_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <SectionCard
        title="My Users Overview"
        subtitle="User activity breakdown"
        size="md"
        action={
          <Button variant="quiet" size="xs">
            View All
          </Button>
        }
      >
        <div className={styles.overview}>
          {AGENT_OVERVIEW.map((tile) => (
            <div
              key={tile.label}
              className={styles.tile}
              style={{ '--tile-color': tile.color } as CSSProperties}
            >
              <p className={styles.tileLabel}>{tile.label}</p>
              <p className={styles.tileValue}>{tile.value}</p>
              <p className={styles.tileShare}>{tile.share}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className={styles.split}>
        <SectionCard title="My Commission (7 Days)" subtitle="Daily earnings overview" size="md">
          <BarChart
            data={AGENT_COMMISSION_WEEK}
            series={COMMISSION_SERIES}
            formatValue={rupeesCompact}
          />
        </SectionCard>

        <SectionCard
          title="Recent Activity"
          size="md"
          action={
            <Button variant="quiet" size="xs">
              View All
            </Button>
          }
        >
          <ul className={styles.feed}>
            {AGENT_ACTIVITY.map((entry) => (
              <li key={entry.description} className={styles.feedItem}>
                <span className={styles.feedDot} aria-hidden="true" />
                <div className={styles.feedText}>
                  <p className={styles.feedDescription}>{entry.description}</p>
                  <p className={styles.feedTime}>{entry.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard
        title="Recent Transactions"
        size="md"
        action={
          <Button variant="quiet" size="xs">
            View All
          </Button>
        }
      >
        <ul className={styles.txns}>
          {AGENT_TRANSACTIONS.map((txn) => (
            <li key={txn.meta} className={styles.txn}>
              <div className={styles.txnText}>
                <p className={styles.txnUser}>{txn.user}</p>
                <p className={styles.txnMeta}>{txn.meta}</p>
              </div>
              <div className={styles.txnAmount}>
                <p className={cx(styles.amount, styles[txn.direction])}>{txn.amount}</p>
                <Badge tone={AGENT_TXN_TONE[txn.status]}>{txn.status}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
