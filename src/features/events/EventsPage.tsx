import { useEffect, useMemo, useState } from 'react';
import { BanIcon, CheckCircleIcon, EyeIcon, PlusIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { cx } from '../../lib/cx';
import { formatCount, formatMoney, formatStartTime } from '../../lib/format';
import { ApiRequestError } from '../../lib/api';
import { eventsApi } from '../../lib/api/events';
import type { ApiEvent } from '../../lib/api/events';
import { marketsApi } from '../../lib/api/markets';
import type { ApiMarket } from '../../lib/api/markets';
import { useAuth } from '../auth/authContext';
import { EventDrawer } from './EventDrawer';
import { EventFormModal } from './EventFormModal';
import { EVENT_FILTERS, EVENT_STATUS_TONE, eventStats, marketsByEvent } from './eventsData';
import styles from './EventsPage.module.css';

/** Events board — node 112:4629. */
export function EventsPage() {
  const { accessToken } = useAuth();
  const [filter, setFilter] = useState<string>('All');
  const [openId, setOpenId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [markets, setMarkets] = useState<ApiMarket[]>([]);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /** Bumped to re-run the load effect after a mutation (create/status change). */
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    setPending(true);
    setError(null);
    Promise.all([eventsApi.list({}, accessToken), marketsApi.list({}, accessToken)])
      .then(([eventsRes, marketsRes]) => {
        if (cancelled) return;
        setEvents(eventsRes.events);
        setMarkets(marketsRes.markets);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiRequestError ? err.message : 'Unable to load events.');
      })
      .finally(() => {
        if (!cancelled) setPending(false);
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken, reloadKey]);

  const byEvent = useMemo(() => marketsByEvent(markets), [markets]);
  const stats = useMemo(() => eventStats(events, markets), [events, markets]);
  const rows = useMemo(
    () => (filter === 'All' ? events : events.filter((event) => event.status === filter)),
    [events, filter],
  );

  const updateStatus = async (event: ApiEvent, status: ApiEvent['status']) => {
    if (!accessToken) return;
    try {
      const res = await eventsApi.updateStatus(event._id, status, accessToken);
      setEvents((current) => current.map((item) => (item._id === res.event._id ? res.event : item)));
      // A status move to Completed/Settled auto-suspends this event's active markets server-side.
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to update the event.');
    }
  };

  const handleCreate = async (payload: Parameters<typeof eventsApi.create>[0]) => {
    if (!accessToken) return;
    const res = await eventsApi.create(payload, accessToken);
    setEvents((current) => [...current, res.event]);
    setShowAdd(false);
  };

  const columns: Column<ApiEvent>[] = [
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
            <p className={styles.eventCode}>{event._id}</p>
          </div>
        </div>
      ),
    },
    { key: 'league', header: 'League / Series', render: (event) => <span className={styles.muted}>{event.league || '—'}</span> },
    {
      key: 'start',
      header: 'Start Time',
      render: (event) =>
        event.status === 'Live' ? (
          <span className={styles.inPlay}>
            <span className={styles.dot} aria-hidden="true" />
            In Play
          </span>
        ) : (
          <span className={styles.muted}>{formatStartTime(event.startTime)}</span>
        ),
    },
    {
      key: 'markets',
      header: 'Markets',
      render: (event) => <span className={styles.strong}>{byEvent.get(event._id)?.length ?? 0}</span>,
    },
    {
      key: 'bets',
      header: 'Active Bets',
      render: (event) => {
        const eventMarkets = byEvent.get(event._id) ?? [];
        const bets = eventMarkets.reduce((sum, market) => sum + market.bets, 0);
        return <span className={styles.strong}>{formatCount(bets)}</span>;
      },
    },
    {
      key: 'exposure',
      header: 'Exposure',
      render: (event) =>
        event.exposure === 0 ? (
          <span className={styles.muted}>—</span>
        ) : (
          <span className={styles.exposure}>{formatMoney(event.exposure)}</span>
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
            onClick={() => setOpenId(event._id)}
          >
            Activity
          </Button>
          {event.status === 'Live' ? (
            <Button
              className={styles.suspend}
              size="xs"
              icon={<BanIcon size={12} />}
              onClick={() => updateStatus(event, 'Suspended')}
            >
              Suspend
            </Button>
          ) : event.status !== 'Settled' ? (
            <Button
              variant="primary"
              size="xs"
              icon={<CheckCircleIcon size={12} />}
              onClick={() => updateStatus(event, 'Live')}
            >
              Activate
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {stats.map((stat) => (
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
            <Badge tone="brand">{events.length} Events</Badge>
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
            <Button variant="primary" size="xs" icon={<PlusIcon size={12} />} onClick={() => setShowAdd(true)}>
              Add Event
            </Button>
          </div>
        </div>

        {error ? <p className={styles.eventScore} role="alert">{error}</p> : null}

        <div className={styles.table}>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(event) => event._id}
            size="lg"
            emptyMessage={pending ? 'Loading events…' : 'No events in this state.'}
          />
        </div>
      </section>

      {openId ? <EventDrawer eventId={openId} onClose={() => setOpenId(null)} onChanged={() => setReloadKey((key) => key + 1)} /> : null}
      {showAdd ? <EventFormModal onClose={() => setShowAdd(false)} onCreate={handleCreate} /> : null}
    </div>
  );
}
