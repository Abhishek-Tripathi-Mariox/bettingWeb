import { useState } from 'react';
import type { CSSProperties } from 'react';
import { BanIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { Drawer } from '../../components/ui/Drawer/Drawer';
import { Meter } from '../../components/ui/ProgressBar/ProgressBar';
import { Tabs } from '../../components/ui/Tabs/Tabs';
import { EVENT_STATUS_TONE } from './eventsData';
import type { SportEvent } from './eventsData';
import styles from './EventDrawer.module.css';

const TABS = ['Overview', 'Markets', 'Bets', 'Exposure'] as const;
type Tab = (typeof TABS)[number];

const EXPOSURE_FILL = 'linear-gradient(90deg, #ff2e63 0%, #facc15 100%)';

/**
 * Event activity sheet — nodes 119:44399 (overview), 119:45485 (markets),
 * 119:46569 (bets) and 119:47705 (exposure). Each screen wraps the same
 * 640px panel; only the tab body changes.
 */
export function EventDrawer({ event, onClose }: { event: SportEvent; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('Overview');

  const summary = [
    { label: 'Active Markets', value: String(event.markets), color: 'var(--color-primary)' },
    { label: 'Total Bets', value: event.bets, color: 'var(--color-success)' },
    { label: 'Total Exposure', value: event.exposure, color: 'var(--color-live)' },
    { label: 'Start Time', value: event.startTime, color: 'var(--color-text-muted)' },
  ];

  return (
    <Drawer
      label={`${event.name} activity`}
      width={640}
      surface="raised"
      headerClassName={styles.header}
      headerLayout="stack"
      onClose={onClose}
      actions={
        <Button className={styles.suspend} size="xs" icon={<BanIcon size={12} />}>
          Suspend
        </Button>
      }
      header={
        <div className={styles.identity}>
          <div className={styles.titleRow}>
            <span className={styles.emoji} aria-hidden="true">
              {event.emoji}
            </span>
            <span className={styles.name}>{event.name}</span>
            <Badge tone={EVENT_STATUS_TONE[event.status]}>{event.status}</Badge>
          </div>
          <p className={styles.league}>{event.league}</p>
          {event.score ? <p className={styles.score}>{event.score}</p> : null}
          <p className={styles.code}>{event.id}</p>

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
        <Tabs items={TABS} value={tab} variant="underline" aria-label="Event sections" onChange={setTab} />
      }
    >
      {tab === 'Overview' ? <OverviewTab event={event} /> : null}

      {tab === 'Markets' ? (
        <div className={styles.markets}>
          {event.marketList.map((market) => (
            <div key={market.name} className={styles.market}>
              <div>
                <p className={styles.marketName}>{market.name}</p>
                <p className={styles.marketMeta}>{market.meta}</p>
              </div>
              <div className={styles.marketActions}>
                <Badge tone={market.active ? 'success' : 'danger'}>
                  {market.active ? 'Active' : 'Suspended'}
                </Badge>
                {market.active ? (
                  <Button className={styles.chipSuspend} size="xs">
                    Suspend
                  </Button>
                ) : (
                  <Button className={styles.chipActivate} size="xs">
                    Activate
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {tab === 'Bets' ? (
        <div>
          <p className={styles.caption}>
            Showing last {event.betList.length} bets placed on this event
          </p>
          {event.betList.map((bet) => (
            <article key={bet.id} className={styles.bet}>
              <span className={styles.avatar}>{bet.user.slice(0, 1)}</span>
              <div className={styles.betMain}>
                <div className={styles.betLine}>
                  <p className={styles.betUser}>{bet.user}</p>
                  <span className={styles.betAmount}>{bet.amount}</span>
                </div>
                <p className={styles.betMeta}>
                  {bet.market} · <span className={styles.selection}>{bet.selection}</span> @{' '}
                  {bet.odds}
                </p>
                <div className={styles.betFoot}>
                  <p className={styles.betWhen}>{bet.when}</p>
                  <Badge tone={bet.status.tone}>{bet.status.label}</Badge>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {tab === 'Exposure' ? (
        <div className={styles.body}>
          <div className={styles.totalCard}>
            <p className={styles.totalLabel}>Total Exposure</p>
            <p className={styles.totalValue}>{event.exposure}</p>
            <p className={styles.totalCaption}>Across {event.markets} active markets</p>
          </div>

          {event.exposureRows.map((row) => (
            <div key={row.market} className={styles.exposureRow}>
              <div className={styles.exposureHead}>
                <span className={styles.exposureName}>{row.market}</span>
                <span className={styles.exposureAmount}>{row.amount}</span>
              </div>
              <Meter
                className={styles.exposureBar}
                label={`${row.market} exposure`}
                percent={row.percent}
                fill={EXPOSURE_FILL}
                height={6}
              />
              <p className={styles.exposureMeta}>
                {row.bets} · {row.percent}% of total exposure
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </Drawer>
  );
}

function OverviewTab({ event }: { event: SportEvent }) {
  const details = [
    { label: 'Event ID', value: event.id },
    { label: 'League', value: event.league },
    { label: 'Status', value: event.status },
    { label: 'Start Time', value: event.startTime },
    { label: 'Active Markets', value: String(event.markets) },
    { label: 'Total Bets Placed', value: event.bets },
    { label: 'Total Exposure', value: event.exposure },
    { label: 'Sport', value: event.sport },
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

      <div className={styles.breakdown}>
        <p className={styles.breakdownTitle}>Exposure Breakdown</p>
        {event.exposureRows.slice(0, 4).map((row) => (
          <div key={row.market} className={styles.breakdownRow}>
            <span>{row.market}</span>
            <span className={styles.breakdownAmount}>{row.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
