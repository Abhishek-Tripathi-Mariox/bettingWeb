import { useState } from 'react';
import { BanIcon, CheckCircleIcon, EyeIcon, PlusIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { cx } from '../../lib/cx';
import { EventDrawer } from './EventDrawer';
import {
  EVENT_COUNT,
  EVENT_FILTERS,
  EVENT_STATS,
  EVENT_STATUS_TONE,
  getEvents,
} from './eventsData';
import type { SportEvent } from './eventsData';
import styles from './EventsPage.module.css';

/** Events board — node 112:4629. */
export function EventsPage() {
  const [filter, setFilter] = useState<string>('All');
  const [open, setOpen] = useState<SportEvent | null>(null);

  const events = getEvents(filter);

  const columns: Column<SportEvent>[] = [
    {
      key: 'event',
      header: 'Event',
      render: (event) => (
        <div className={styles.event}>
          <span className={styles.eventEmoji} aria-hidden="true">
            {event.emoji}
          </span>
          <div>
            <p className={styles.eventName}>{event.name}</p>
            {event.score ? <p className={styles.eventScore}>{event.score}</p> : null}
            <p className={styles.eventCode}>{event.id}</p>
          </div>
        </div>
      ),
    },
    { key: 'league', header: 'League / Series', render: (event) => <span className={styles.muted}>{event.league}</span> },
    {
      key: 'start',
      header: 'Start Time',
      render: (event) =>
        event.startTime === 'In Play' ? (
          <span className={styles.inPlay}>
            <span className={styles.dot} aria-hidden="true" />
            In Play
          </span>
        ) : (
          <span className={styles.muted}>{event.startTime}</span>
        ),
    },
    { key: 'markets', header: 'Markets', render: (event) => <span className={styles.strong}>{event.markets}</span> },
    { key: 'bets', header: 'Active Bets', render: (event) => <span className={styles.strong}>{event.bets}</span> },
    {
      key: 'exposure',
      header: 'Exposure',
      render: (event) =>
        event.exposure === '—' ? (
          <span className={styles.muted}>—</span>
        ) : (
          <span className={styles.exposure}>{event.exposure}</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (event) => <Badge tone={EVENT_STATUS_TONE[event.status]}>{event.status}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (event) => (
        <div className={styles.rowActions}>
          <Button
            className={styles.activity}
            size="xs"
            icon={<EyeIcon size={12} />}
            onClick={() => setOpen(event)}
          >
            Activity
          </Button>
          {event.status === 'Live' ? (
            <Button className={styles.suspend} size="xs" icon={<BanIcon size={12} />}>
              Suspend
            </Button>
          ) : (
            <Button variant="primary" size="xs" icon={<CheckCircleIcon size={12} />}>
              Activate
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {EVENT_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className={styles.card}>
        <div className={styles.head}>
          <div className={styles.title}>
            <span className={styles.emoji} aria-hidden="true">
              🏏
            </span>
            <span className={styles.titleText}>Cricket Events</span>
            <Badge tone="brand">{EVENT_COUNT} Events</Badge>
          </div>

          <div className={styles.actions}>
            {EVENT_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                className={cx(styles.filter, filter === item && styles.filterActive)}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
            <Button variant="primary" size="xs" icon={<PlusIcon size={12} />}>
              Add Event
            </Button>
          </div>
        </div>

        <div className={styles.table}>
          <DataTable
            columns={columns}
            rows={events}
            rowKey={(event) => event.id}
            size="lg"
            emptyMessage="No events in this state."
          />
        </div>
      </section>

      {open ? <EventDrawer event={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}
