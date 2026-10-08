import { useCallback, useEffect, useState } from 'react';
import { AreaChart } from '../../components/charts/AreaChart';
import { ActivityIcon, BettingIcon, TrendingUpIcon, UsersIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { PillTabs } from '../../components/ui/PillTabs/PillTabs';
import { SectionCard } from '../../components/ui/SectionCard/SectionCard';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { ApiRequestError } from '../../lib/api';
import { networkApi } from '../../lib/api/network';
import type { StaffAnalytics, StaffEvent, StaffMarket } from '../../lib/api/network';
import { formatCount, formatMoney, formatStartTime } from '../../lib/format';
import { useLiveRefresh } from '../../lib/realtime';
import { useAuth } from '../auth/authContext';
import styles from './StaffBettingPages.module.css';

/**
 * Staff views of the betting side, each behind its Permissions-page grant
 * (Events / Markets / Analytics — view). Read-only: running fixtures and
 * prices stays with the Super Admin.
 */

const errorMessage = (err: unknown) => (err instanceof ApiRequestError ? err.message : 'Unable to reach the server.');

const STATUS_TONE = { Live: 'danger', Upcoming: 'info', Suspended: 'warning' } as const;

/** Loads `fetcher` and reloads it on the given live events. */
function useLiveData<T>(fetcher: (token: string) => Promise<T>, liveEvents: Parameters<typeof useLiveRefresh>[0]) {
  const { accessToken } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(() => {
    if (!accessToken) return;
    fetcher(accessToken)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => setError(errorMessage(err)));
    // fetcher is a stable module-level call per page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);
  useEffect(() => load(), [load]);
  useLiveRefresh(liveEvents, load, 2000);
  return { data, error };
}

export function StaffEventsPage() {
  const { data, error } = useLiveData((token) => networkApi.events(token), ['matches:changed']);
  const events = data?.events ?? [];
  const columns: Column<StaffEvent>[] = [
    {
      key: 'name',
      header: 'Match',
      render: (row) => (
        <div>
          <p className={styles.strong}>
            {row.emoji} {row.name}
          </p>
          <p className={styles.muted}>{row.league}</p>
        </div>
      ),
    },
    { key: 'start', header: 'Start', render: (row) => <span className={styles.muted}>{formatStartTime(row.startTime)}</span> },
    { key: 'markets', header: 'Open Markets', render: (row) => <span className={styles.strong}>{row.openMarkets}</span> },
    { key: 'status', header: 'Status', render: (row) => <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge> },
  ];
  return (
    <SectionCard title="Events" subtitle="Live and upcoming matches (read-only)" size="md" bodySpacing={20}>
      {error ? <p className={styles.error}>{error}</p> : null}
      <DataTable columns={columns} rows={events} rowKey={(row) => row._id} size="lg" emptyMessage={data ? 'No live or upcoming matches.' : 'Loading…'} />
    </SectionCard>
  );
}

export function StaffMarketsPage() {
  const { data, error } = useLiveData((token) => networkApi.markets(token), ['odds', 'matches:changed']);
  const markets = data?.markets ?? [];
  const eventNames = [...new Map(markets.map((m) => [m.event._id, m.event.name])).entries()];
  const [eventId, setEventId] = useState<string>('');
  const shown = eventId ? markets.filter((m) => m.event._id === eventId) : markets;
  const columns: Column<StaffMarket>[] = [
    {
      key: 'market',
      header: 'Market',
      render: (row) => (
        <div>
          <p className={styles.strong}>{row.name}</p>
          <p className={styles.muted}>
            {row.event.name} · {row.type}
          </p>
        </div>
      ),
    },
    {
      key: 'odds',
      header: 'Odds',
      render: (row) => (
        <div className={styles.runners}>
          {row.runners.map((runner) => (
            <span key={runner.name} className={runner.active ? styles.runner : styles.runnerOff}>
              {runner.name} <b>{runner.active ? runner.odds.toFixed(2) : 'SUSP'}</b>
            </span>
          ))}
        </div>
      ),
    },
    { key: 'max', header: 'Max Bet', render: (row) => <span className={styles.muted}>{row.maxBet ? formatMoney(row.maxBet) : '—'}</span> },
  ];
  return (
    <SectionCard title="Markets" subtitle="Open markets with live prices (read-only)" size="md" bodySpacing={20}>
      {eventNames.length > 1 ? (
        <PillTabs
          items={[{ label: 'All Events' }, ...eventNames.map(([, name]) => ({ label: name }))]}
          value={eventId ? eventNames.find(([id]) => id === eventId)?.[1] ?? 'All Events' : 'All Events'}
          label="Filter by event"
          size="sm"
          onChange={(label) => setEventId(eventNames.find(([, name]) => name === label)?.[0] ?? '')}
        />
      ) : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      <DataTable columns={columns} rows={shown} rowKey={(row) => row._id} size="lg" emptyMessage={data ? 'No open markets right now.' : 'Loading…'} />
    </SectionCard>
  );
}

const TABS = [
  { label: 'House P&L', key: 'revenue' },
  { label: 'Bet Volume', key: 'volume' },
  { label: 'New Players', key: 'signups' },
] as const;

const monthLabel = (month: string) =>
  new Date(`${month}-01T00:00:00`).toLocaleDateString('en-IN', { month: 'short' });

export function StaffAnalyticsPage() {
  const { data, error } = useLiveData((token) => networkApi.analytics(token), ['admin:changed']);
  const [tab, setTab] = useState<(typeof TABS)[number]['label']>(TABS[0].label);
  const key = TABS.find((t) => t.label === tab)!.key;
  const series = (data?.[key] ?? []).map((p: StaffAnalytics['revenue'][number]) => ({ label: monthLabel(p.month), value: p.value }));
  const sum = (points: StaffAnalytics['revenue'] = []) => points.reduce((total, p) => total + p.value, 0);
  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        <StatCard label="My Players" value={data ? formatCount(data.totals.players) : '—'} caption="In your downline" icon={UsersIcon} accent="blue" />
        <StatCard label="Total Bets" value={data ? formatCount(data.totals.bets) : '—'} caption={data ? `${formatMoney(data.totals.stake)} staked, all time` : ''} icon={BettingIcon} accent="cyan" />
        <StatCard label="House P&L" value={data ? formatMoney(sum(data.revenue)) : '—'} caption="Last 6 months, your players" icon={TrendingUpIcon} accent="green" />
        <StatCard label="Bet Volume" value={data ? formatMoney(sum(data.volume)) : '—'} caption="Last 6 months, voids excluded" icon={ActivityIcon} accent="yellow" />
      </div>
      <SectionCard title="My Network" subtitle="Last 6 months — only your own players" size="md" bodySpacing={20}>
        <PillTabs items={TABS.map((t) => ({ label: t.label }))} value={tab} label="Analytics series" onChange={(v) => setTab(v as typeof tab)} />
        {error ? <p className={styles.error}>{error}</p> : null}
        {series.length ? <AreaChart data={series} height={240} /> : <p className={styles.muted}>{data ? 'No data yet.' : 'Loading…'}</p>}
      </SectionCard>
    </div>
  );
}
