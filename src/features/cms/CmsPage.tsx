import { useState } from 'react';
import { PencilIcon, PlusIcon, TrashIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { PillTabs } from '../../components/ui/PillTabs/PillTabs';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { AnnouncementModal } from './AnnouncementModal';
import {
  ANNOUNCEMENTS,
  CMS_STATS,
  CMS_TABS,
  CONTENT_STATUS_TONE,
  MARQUEE_TEXT,
} from './cmsData';
import type { ContentItem } from './cmsData';
import styles from './CmsPage.module.css';

const TABS = CMS_TABS.map((label) => ({ label }));

/** CMS console — node 112:9398. */
export function CmsPage() {
  const [tab, setTab] = useState<string>(CMS_TABS[0]);
  const [items, setItems] = useState<ContentItem[]>(ANNOUNCEMENTS);
  const [creating, setCreating] = useState(false);

  const handlePublish = (draft: { title: string; target: string; body: string }) => {
    setItems((current) => [
      ...current,
      {
        id: `ANN${String(current.length + 1).padStart(3, '0')}`,
        status: 'active',
        target: draft.target,
        title: draft.title,
        body: draft.body,
        views: '0',
        date: 'Today',
      },
    ]);
    setCreating(false);
  };

  const handleDelete = (id: string) =>
    setItems((current) => current.filter((item) => item.id !== id));

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {CMS_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className={styles.marquee}>
        <span className={styles.marqueeTag}>Marquee</span>
        <p className={styles.marqueeText}>{MARQUEE_TEXT}</p>
        <Button variant="primary" size="xs" icon={<PencilIcon size={12} />}>
          Edit Marquee
        </Button>
      </section>

      <section className={styles.card}>
        <div className={styles.head}>
          <PillTabs items={TABS} value={tab} label="Content sections" onChange={setTab} />
          <Button
            variant="primary"
            size="xs"
            icon={<PlusIcon size={12} />}
            onClick={() => setCreating(true)}
          >
            Create New
          </Button>
        </div>

        <div className={styles.list}>
          {items.map((item) => (
            <article key={item.id} className={styles.item}>
              <div className={styles.itemMain}>
                <div className={styles.itemMeta}>
                  <span className={styles.itemCode}>{item.id}</span>
                  <Badge tone={CONTENT_STATUS_TONE[item.status]}>{item.status}</Badge>
                  <span className={styles.itemTarget}>Target: {item.target}</span>
                </div>
                <p className={styles.itemTitle}>{item.title}</p>
                <p className={styles.itemBody}>{item.body}</p>
              </div>

              <div className={styles.itemSide}>
                <p className={styles.itemViews}>{item.views}</p>
                <p className={styles.itemViewsLabel}>views</p>
                <p className={styles.itemDate}>{item.date}</p>
                <div className={styles.itemActions}>
                  <Button className={styles.edit} size="xs" aria-label={`Edit ${item.title}`}>
                    <PencilIcon size={12} />
                  </Button>
                  <Button
                    className={styles.delete}
                    size="xs"
                    aria-label={`Delete ${item.title}`}
                    onClick={() => handleDelete(item.id)}
                  >
                    <TrashIcon size={12} />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {creating ? (
        <AnnouncementModal
          section={tab}
          onClose={() => setCreating(false)}
          onPublish={handlePublish}
        />
      ) : null}
    </div>
  );
}
