import { useState } from 'react';
import type { CSSProperties } from 'react';
import { AreaChart } from '../../components/charts/AreaChart';
import { PillTabs } from '../../components/ui/PillTabs/PillTabs';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import {
  ANALYTICS_HIGHLIGHTS,
  ANALYTICS_SERIES,
  ANALYTICS_STATS,
  ANALYTICS_TABS,
} from './analyticsData';
import styles from './AnalyticsPage.module.css';

const TABS = ANALYTICS_TABS.map((label) => ({ label }));

/** Analytics console — node 112:8897. */
export function AnalyticsPage() {
  const [tab, setTab] = useState<string>(ANALYTICS_TABS[0]);

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {ANALYTICS_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className={styles.card}>
        <PillTabs items={TABS} value={tab} label="Analytics series" onChange={setTab} />

        <div className={styles.chart}>
          <AreaChart data={ANALYTICS_SERIES[tab]} height={260} />
        </div>

        <div className={styles.highlights}>
          {ANALYTICS_HIGHLIGHTS.map((item) => (
            <div
              key={item.label}
              className={styles.highlight}
              style={{ '--highlight-rgb': item.rgb } as CSSProperties}
            >
              <p className={styles.highlightLabel}>{item.label}</p>
              <p className={styles.highlightName}>{item.name}</p>
              <p className={styles.highlightValue}>{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
