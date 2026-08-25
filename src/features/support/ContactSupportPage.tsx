import type { CSSProperties } from 'react';
import { Button } from '../../components/ui/Button/Button';
import { SectionCard } from '../../components/ui/SectionCard/SectionCard';
import { cx } from '../../lib/cx';
import {
  SUPPORT_CHANNELS,
  SUPPORT_INTRO,
  SUPPORT_WINDOWS,
} from './contactSupportData';
import styles from './ContactSupportPage.module.css';

/**
 * Contact Support — node 139:90076. The panels below the fold reach a person
 * directly, so this is a different screen from the ticket queue at
 * SupportTicketsPage; the Franchise nav points here.
 */
export function ContactSupportPage() {
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <span className={styles.introTile} aria-hidden="true">
          {SUPPORT_INTRO.emoji}
        </span>
        <h2 className={styles.introTitle}>{SUPPORT_INTRO.title}</h2>
        <p className={styles.introSubtitle}>{SUPPORT_INTRO.subtitle}</p>
      </header>

      <div className={styles.channels}>
        {SUPPORT_CHANNELS.map((channel) => (
          <article
            key={channel.title}
            className={styles.channel}
            style={{ '--channel-rgb': channel.rgb } as CSSProperties}
          >
            <div className={styles.channelHead}>
              <span className={styles.channelTile} aria-hidden="true">
                {channel.emoji}
              </span>
              <div className={styles.channelText}>
                <p className={styles.channelTitle}>{channel.title}</p>
                <p className={styles.channelHandle}>{channel.handle}</p>
              </div>
            </div>
            <p className={styles.channelNote}>{channel.note}</p>
            {channel.action ? (
              <Button className={styles.channelAction} size="xs" block>
                {channel.action}
              </Button>
            ) : null}
          </article>
        ))}
      </div>

      <aside className={styles.notice}>
        <span className={styles.noticeEmoji} aria-hidden="true">
          ℹ️
        </span>
        <div>
          <p className={styles.noticeTitle}>Before contacting support</p>
          <p className={styles.noticeBody}>
            Please keep your <strong>Agent ID / Super Agent ID</strong> and the{' '}
            <strong>relevant User ID or Transaction ID</strong> ready. This helps our team resolve
            your query faster.
          </p>
        </div>
      </aside>

      <SectionCard title="Support Hours" size="md">
        <div className={styles.hours}>
          {SUPPORT_WINDOWS.map((window) => (
            <div key={window.day} className={styles.window}>
              <div className={styles.windowText}>
                <p className={styles.windowDay}>{window.day}</p>
                <p className={styles.windowHours}>{window.hours}</p>
              </div>
              <span
                className={cx(styles.windowDot, !window.open && styles.limited)}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
