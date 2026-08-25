import { useState } from 'react';
import { Button } from '../../components/ui/Button/Button';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { cx } from '../../lib/cx';
import { NOTIFICATIONS, NOTIFICATION_STATS } from './notificationsData';
import type { Notification } from './notificationsData';
import styles from './NotificationsPage.module.css';

/** Notification centre — node 112:9991. */
export function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(NOTIFICATIONS);

  const unread = items.filter((item) => item.unread).length;

  const markAllRead = () =>
    setItems((current) => current.map((item) => ({ ...item, unread: false })));

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {NOTIFICATION_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className={styles.card}>
        <div className={styles.head}>
          <div className={styles.title}>
            <span className={styles.titleText}>All Notifications</span>
            {unread > 0 ? <span className={styles.count}>{unread} new</span> : null}
          </div>
          <div className={styles.actions}>
            <Button className={styles.quiet} size="xs" onClick={markAllRead}>
              Mark All Read
            </Button>
            <Button className={styles.quiet} size="xs" onClick={() => setItems([])}>
              Clear All
            </Button>
          </div>
        </div>

        <div className={styles.list}>
          {items.length === 0 ? (
            <p className={styles.empty}>You are all caught up.</p>
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className={cx(styles.item, item.unread ? styles.unread : styles.read)}
              >
                <span className={styles.emoji} aria-hidden="true">
                  {item.emoji}
                </span>
                <div className={styles.itemMain}>
                  <div className={styles.itemHead}>
                    <p className={cx(styles.itemTitle, item.unread && styles.itemTitleUnread)}>
                      {item.title}
                    </p>
                    <span className={styles.itemTime}>{item.time}</span>
                  </div>
                  <p className={styles.itemBody}>{item.body}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
