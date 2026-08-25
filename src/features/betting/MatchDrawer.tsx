import { useState } from 'react';
import type { CSSProperties } from 'react';
import { BanIcon, SettingsIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { Drawer } from '../../components/ui/Drawer/Drawer';
import { Tabs } from '../../components/ui/Tabs/Tabs';
import type { Match } from './bettingData';
import styles from './MatchDrawer.module.css';

const TABS = ['Overview', 'Markets', 'Bets'] as const;
type Tab = (typeof TABS)[number];

/**
 * Match sheet — nodes 119:40667 (overview), 119:42501 (markets) and
 * 119:43428 (bets).
 */
export function MatchDrawer({ match, onClose }: { match: Match; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('Overview');

  const summary = [
    { label: 'Markets', value: String(match.markets), color: 'var(--color-primary)' },
    { label: 'Total Bets', value: match.bets, color: 'var(--color-success)' },
    { label: 'Stake', value: match.stake, color: 'var(--color-warning)' },
    { label: 'Exposure', value: match.exposure, color: 'var(--color-live)' },
  ];

  return (
    <Drawer
      label={`${match.name} details`}
      width={600}
      surface="raised"
      headerClassName={styles.header}
      headerLayout="stack"
      onClose={onClose}
      header={
        <div className={styles.identity}>
          <div className={styles.titleRow}>
            <span className={styles.emoji} aria-hidden="true">
              {match.emoji}
            </span>
            <span className={styles.name}>{match.name}</span>
            {match.state === 'Live' ? (
              <>
                <span className={styles.liveDot} aria-hidden="true" />
                <Badge tone="danger">LIVE</Badge>
              </>
            ) : null}
          </div>
          <p className={styles.league}>{match.league}</p>
          <p className={styles.score}>{match.score}</p>

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
        <Tabs items={TABS} value={tab} variant="underline" aria-label="Match sections" onChange={setTab} />
      }
    >
      {tab === 'Overview' ? <OverviewTab match={match} /> : null}

      {tab === 'Markets' ? (
        <div className={styles.body}>
          {match.marketList.map((market) => (
            <div key={market.name} className={styles.row}>
              <div>
                <p className={styles.rowTitle}>{market.name}</p>
                <p className={styles.rowMeta}>{market.meta}</p>
              </div>
              <div className={styles.rowActions}>
                <Badge tone={market.active ? 'success' : 'neutral'}>
                  {market.active ? 'Active' : 'Closed'}
                </Badge>
                <Button className={styles.suspendChip} size="xs">
                  Suspend
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {tab === 'Bets' ? (
        <div>
          <p className={styles.listCaption}>Recent {match.betList.length} bets on this match</p>
          {match.betList.map((bet) => (
            <article key={bet.id} className={styles.bet}>
              <span className={styles.avatar}>{bet.user.slice(0, 1)}</span>
              <div className={styles.betMain}>
                <p className={styles.betUser}>{bet.user}</p>
                <p className={styles.betMeta}>
                  {bet.market} · <span className={styles.selection}>{bet.selection}</span> @{' '}
                  {bet.odds}
                </p>
                <p className={styles.betWhen}>{bet.when}</p>
              </div>
              <div className={styles.betRight}>
                <span className={styles.betAmount}>{bet.amount}</span>
                <Badge tone={bet.status.tone}>{bet.status.label}</Badge>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </Drawer>
  );
}

function OverviewTab({ match }: { match: Match }) {
  const details = [
    { label: 'Match ID', value: match.id },
    { label: 'League', value: match.league },
    { label: 'Status', value: match.state.toLowerCase() },
    { label: 'Start Time', value: match.startTime },
    { label: 'Active Markets', value: String(match.markets) },
    { label: 'Total Bets', value: match.bets },
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

      <div className={styles.actions}>
        <Button className={styles.suspend} size="sm" icon={<BanIcon size={13.993} />}>
          Suspend Match
        </Button>
        <Button variant="quiet" size="sm" icon={<SettingsIcon size={13.993} />}>
          Settings
        </Button>
      </div>
    </div>
  );
}
