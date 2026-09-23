import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { BanIcon, CheckCircleIcon, PencilIcon, PlusIcon, RefreshIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { cx } from '../../lib/cx';
import { formatCount, formatMoney } from '../../lib/format';
import { ApiRequestError } from '../../lib/api';
import { eventsApi } from '../../lib/api/events';
import type { ApiEvent } from '../../lib/api/events';
import { marketsApi } from '../../lib/api/markets';
import type { ApiMarket, CreateMarketPayload, UpdateMarketPayload } from '../../lib/api/markets';
import { useAuth } from '../auth/authContext';
import { MarketFormModal } from './MarketFormModal';
import { MARKET_STATUS_TONE, marketStats, marketTypeColor } from './marketsData';
import styles from './MarketsPage.module.css';

const ALL_EVENTS = 'all';

/** Market manager — node 112:5525. */
export function MarketsPage() {
  const { accessToken } = useAuth();
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [scope, setScope] = useState<string>(ALL_EVENTS);
  const [markets, setMarkets] = useState<ApiMarket[]>([]);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  /** null = closed, 'new' = Add Market, a market = Edit Market. */
  const [form, setForm] = useState<ApiMarket | 'new' | null>(null);
  const [suspendingAll, setSuspendingAll] = useState(false);
  const [rowPending, setRowPending] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    eventsApi
      .list({}, accessToken)
      .then((res) => {
        if (!cancelled) setEvents(res.events);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    setPending(true);
    setError(null);
    marketsApi
      .list(scope === ALL_EVENTS ? {} : { eventId: scope }, accessToken)
      .then((res) => {
        if (!cancelled) setMarkets(res.markets);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiRequestError ? err.message : 'Unable to load markets.');
      })
      .finally(() => {
        if (!cancelled) setPending(false);
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken, scope, reloadKey]);

  const stats = useMemo(() => marketStats(markets), [markets]);

  const toggleStatus = async (row: ApiMarket) => {
    if (!accessToken) return;
    const nextStatus = row.status === 'Active' ? 'Suspended' : 'Active';
    setRowPending(row._id);
    try {
      const res = await marketsApi.updateStatus(row._id, nextStatus, accessToken);
      setMarkets((current) => current.map((item) => (item._id === res.market._id ? res.market : item)));
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to update the market.');
    } finally {
      setRowPending(null);
    }
  };

  const suspendAll = async () => {
    if (!accessToken) return;
    setSuspendingAll(true);
    try {
      await marketsApi.suspendAll(accessToken);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to suspend all markets.');
    } finally {
      setSuspendingAll(false);
    }
  };

  const handleCreate = async (payload: CreateMarketPayload) => {
    if (!accessToken) return;
    const res = await marketsApi.create(payload, accessToken);
    setMarkets((current) => [...current, res.market]);
    setForm(null);
  };

  const handleUpdate = async (id: string, payload: UpdateMarketPayload) => {
    if (!accessToken) return;
    const res = await marketsApi.update(id, payload, accessToken);
    setMarkets((current) => current.map((item) => (item._id === res.market._id ? res.market : item)));
    setForm(null);
  };

  const columns: Column<ApiMarket>[] = [
    {
      key: 'market',
      header: 'Market',
      render: (row) => (
        <div>
          <p className={styles.name}>{row.name}</p>
          <p className={styles.code}>{row.code}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (row) => (
        <span className={styles.type} style={{ '--type-rgb': marketTypeColor(row.type) } as CSSProperties}>
          {row.type}
        </span>
      ),
    },
    { key: 'back', header: 'Back Odds', render: (row) => <span className={styles.back}>{row.backOdds.toFixed(2)}</span> },
    { key: 'lay', header: 'Lay Odds', render: (row) => <span className={styles.lay}>{row.layOdds.toFixed(2)}</span> },
    { key: 'bets', header: 'Bets', render: (row) => <span className={styles.bets}>{formatCount(row.bets)}</span> },
    { key: 'stake', header: 'Stake', render: (row) => <span className={styles.stake}>{formatMoney(row.stake)}</span> },
    { key: 'exposure', header: 'Exposure', render: (row) => <span className={styles.exposure}>{formatMoney(row.exposure)}</span> },
    { key: 'maxBet', header: 'Max Bet', render: (row) => <span className={styles.maxBet}>{formatMoney(row.maxBet)}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge tone={MARKET_STATUS_TONE[row.status]}>{row.status}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className={styles.rowActions}>
          <Button className={styles.edit} size="xs" icon={<PencilIcon size={12} />} onClick={() => setForm(row)}>
            Edit
          </Button>
          {row.status === 'Active' ? (
            <Button
              className={styles.suspend}
              size="xs"
              icon={<BanIcon size={12} />}
              onClick={() => toggleStatus(row)}
              disabled={rowPending === row._id}
            >
              Suspend
            </Button>
          ) : (
            <Button
              className={styles.enable}
              size="xs"
              icon={<CheckCircleIcon size={12} />}
              onClick={() => toggleStatus(row)}
              disabled={rowPending === row._id}
            >
              Enable
            </Button>
          )}
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
          <div className={styles.heading}>
            <p className={styles.title}>Market Manager</p>
            <div className={styles.scopes}>
              <button
                type="button"
                className={cx(styles.scope, scope === ALL_EVENTS && styles.scopeActive)}
                onClick={() => setScope(ALL_EVENTS)}
              >
                All Events
              </button>
              {events.map((event) => (
                <button
                  key={event._id}
                  type="button"
                  className={cx(styles.scope, scope === event._id && styles.scopeActive)}
                  onClick={() => setScope(event._id)}
                >
                  {event.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <Button
              className={styles.refresh}
              size="xs"
              icon={<RefreshIcon size={12} />}
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Refresh Odds
            </Button>
            <Button
              className={styles.suspendAll}
              size="xs"
              icon={<BanIcon size={12} />}
              onClick={suspendAll}
              disabled={suspendingAll}
            >
              {suspendingAll ? 'Suspending…' : 'Suspend All'}
            </Button>
            <Button
              variant="primary"
              size="xs"
              icon={<PlusIcon size={12} />}
              onClick={() => setForm('new')}
              disabled={events.length === 0}
            >
              Add Market
            </Button>
          </div>
        </div>

        {error ? (
          <p role="alert" style={{ color: 'var(--color-danger)', margin: '12px 0 0', fontSize: 12 }}>
            {error}
          </p>
        ) : null}

        <div className={styles.table}>
          <DataTable
            columns={columns}
            rows={markets}
            rowKey={(row) => row._id}
            size="lg"
            emptyMessage={pending ? 'Loading markets…' : 'No markets on this event yet.'}
          />
        </div>
      </section>

      {form ? (
        <MarketFormModal
          market={form === 'new' ? null : form}
          events={events}
          onClose={() => setForm(null)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      ) : null}
    </div>
  );
}
