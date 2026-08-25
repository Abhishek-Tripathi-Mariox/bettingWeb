import { useState } from 'react';
import type { CSSProperties } from 'react';
import { BanIcon, EyeIcon, RefreshIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { PillTabs } from '../../components/ui/PillTabs/PillTabs';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { API_PROVIDERS, BETTING_STATS, MATCH_TABS, getMatches } from './bettingData';
import type { Match } from './bettingData';
import { MatchDrawer } from './MatchDrawer';
import styles from './BettingPage.module.css';

const TABS = MATCH_TABS.map((label) =>
  label === 'Live' ? { label, dot: true, rgb: '255, 46, 99' } : { label },
);

/** Betting board — node 112:3861. */
export function BettingPage() {
  const [tab, setTab] = useState<string>('Live');
  const [open, setOpen] = useState<Match | null>(null);

  const matches = getMatches(tab);

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {BETTING_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className={styles.card}>
        <div className={styles.cardHead}>
          <p className={styles.cardTitle}>API Provider Status</p>
          <Button variant="quiet" size="xs" icon={<RefreshIcon size={12} />}>
            Sync All
          </Button>
        </div>

        <div className={styles.providers}>
          {API_PROVIDERS.map((provider) => (
            <div
              key={provider.name}
              className={styles.provider}
              style={
                {
                  '--provider-bg': provider.healthy
                    ? 'rgba(34, 197, 94, 0.04)'
                    : 'var(--color-surface-subtle)',
                  '--provider-border': provider.healthy
                    ? 'rgba(34, 197, 94, 0.2)'
                    : 'var(--color-border)',
                  '--provider-accent': provider.healthy
                    ? 'var(--color-success)'
                    : 'var(--color-text-muted)',
                } as CSSProperties
              }
            >
              <div>
                <p className={styles.providerName}>{provider.name}</p>
                <p className={styles.providerMeta}>
                  Latency: <span className={styles.latency}>{provider.latency}</span> ·{' '}
                  {provider.markets}
                </p>
              </div>
              <div className={styles.providerRight}>
                <Badge tone={provider.status.tone}>{provider.status.label}</Badge>
                <span className={styles.uptime}>{provider.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.card}>
        <PillTabs items={TABS} value={tab} label="Match state" onChange={setTab} />

        <div className={styles.matches}>
          {matches.length === 0 ? (
            <p className={styles.empty}>No matches in this state.</p>
          ) : (
            matches.map((match) => (
              <article key={match.id} className={styles.match}>
                <div className={styles.matchMain}>
                  <span className={styles.emoji} aria-hidden="true">
                    {match.emoji}
                  </span>
                  <div>
                    <div className={styles.matchTitleRow}>
                      <span className={styles.matchName}>{match.name}</span>
                      {match.state === 'Live' ? (
                        <>
                          <span className={styles.liveDot} aria-hidden="true" />
                          <Badge tone="danger">LIVE</Badge>
                        </>
                      ) : null}
                    </div>
                    <p className={styles.matchMeta}>{match.meta}</p>
                    <p className={styles.matchScore}>{match.score}</p>
                  </div>
                </div>

                <div className={styles.matchRight}>
                  <div className={styles.figure}>
                    <span className={styles.figureLabel}>Stake</span>
                    <span className={styles.stake}>{match.stake}</span>
                  </div>
                  <div className={styles.figure}>
                    <span className={styles.figureLabel}>Exposure</span>
                    <span className={styles.exposure}>{match.exposure}</span>
                  </div>
                  <div className={styles.matchActions}>
                    <Button
                      className={styles.view}
                      size="xs"
                      icon={<EyeIcon size={12} />}
                      onClick={() => setOpen(match)}
                    >
                      View
                    </Button>
                    <Button className={styles.suspend} size="xs" icon={<BanIcon size={12} />}>
                      Suspend
                    </Button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {open ? <MatchDrawer match={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}
