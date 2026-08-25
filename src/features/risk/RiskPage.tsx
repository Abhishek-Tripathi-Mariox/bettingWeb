import type { CSSProperties } from 'react';
import { AlertTriangleIcon, BanIcon, EyeIcon, RefreshIcon, RiskIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { Meter } from '../../components/ui/ProgressBar/ProgressBar';
import { SectionCard } from '../../components/ui/SectionCard/SectionCard';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import {
  EXPOSURE_ROWS,
  RISK_LEVEL_TONE,
  RISK_PANELS,
  RISK_STATS,
  RISK_TONE_RGB,
} from './riskData';
import type { ExposureRow } from './riskData';
import styles from './RiskPage.module.css';

/** Risk console — node 112:6245. */
export function RiskPage() {
  const columns: Column<ExposureRow>[] = [
    {
      key: 'market',
      header: 'Market',
      render: (row) => (
        <div className={styles.market}>
          <span className={styles.emoji} aria-hidden="true">
            {row.emoji}
          </span>
          <span className={styles.marketName}>{row.market}</span>
          {row.live ? <span className={styles.liveDot} aria-label="Live" /> : null}
        </div>
      ),
    },
    {
      key: 'exposure',
      header: 'Exposure',
      render: (row) => (
        <span className={styles.exposure} style={{ '--tone-rgb': RISK_TONE_RGB[row.tone] } as CSSProperties}>
          {row.exposure}
        </span>
      ),
    },
    { key: 'limit', header: 'Limit', render: (row) => <span className={styles.limit}>{row.limit}</span> },
    {
      key: 'utilization',
      header: 'Utilization',
      render: (row) => (
        <div className={styles.utilization} style={{ '--tone-rgb': RISK_TONE_RGB[row.tone] } as CSSProperties}>
          <Meter
            className={styles.meter}
            label={`${row.market} utilization`}
            percent={row.utilization}
            fill="rgb(var(--tone-rgb))"
            height={6}
          />
          <span className={styles.percent}>{row.utilization}%</span>
        </div>
      ),
    },
    { key: 'bets', header: 'Active Bets', render: (row) => <span className={styles.bets}>{row.activeBets}</span> },
    {
      key: 'level',
      header: 'Risk Level',
      render: (row) => <Badge tone={RISK_LEVEL_TONE[row.level]}>{row.level}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className={styles.rowActions}>
          <Button className={styles.view} size="xs" aria-label={`View ${row.market}`}>
            <EyeIcon size={12} />
          </Button>
          {row.level === 'Critical' ? (
            <Button className={styles.suspend} size="xs" icon={<BanIcon size={12} />}>
              Suspend
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {RISK_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <SectionCard
        title="Market Exposure Monitor"
        subtitle="Real-time exposure across active markets"
        size="md"
        bodySpacing={20}
        action={
          <div className={styles.actions}>
            <Button className={styles.refresh} size="xs" icon={<RefreshIcon size={12} />}>
              Refresh
            </Button>
            <Button className={styles.suspendAll} size="xs" icon={<RiskIcon size={12} />}>
              Suspend All Critical
            </Button>
          </div>
        }
      >
        <DataTable
          columns={columns}
          rows={EXPOSURE_ROWS}
          rowKey={(row) => row.id}
          size="lg"
          emptyMessage="No open exposure right now."
        />
      </SectionCard>

      <div className={styles.panels}>
        {RISK_PANELS.map((panel) => (
          <section
            key={panel.title}
            className={styles.panel}
            style={{ '--tone-rgb': RISK_TONE_RGB[panel.tone] } as CSSProperties}
          >
            <div className={styles.panelHead}>
              <p className={styles.panelTitle}>{panel.title}</p>
              <span className={styles.panelCount}>{panel.count}</span>
            </div>
            <ul className={styles.panelList}>
              {panel.items.map((item) => (
                <li key={item} className={styles.panelItem}>
                  <AlertTriangleIcon className={styles.panelIcon} size={12} />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
