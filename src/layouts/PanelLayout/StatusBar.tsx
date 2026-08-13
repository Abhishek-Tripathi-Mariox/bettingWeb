import { Dot } from '../../components/ui/Dot/Dot';
import { APP, PLATFORM_STATUS } from '../../config/app';
import styles from './StatusBar.module.css';

/** Bottom status strip: health metrics on the left, build stamp on the right. */
export function StatusBar({ clock }: { clock: string }) {
  return (
    <footer className={styles.bar}>
      <div className={styles.metrics}>
        <span className={styles.metric}>
          <Dot tone="success" size={5.994} />
          {PLATFORM_STATUS.api}
        </span>
        <span className={styles.metric}>{PLATFORM_STATUS.db}</span>
        <span className={styles.metric}>{PLATFORM_STATUS.cpu}</span>
        <span className={styles.metric}>{PLATFORM_STATUS.uptime}</span>
      </div>
      <span className={styles.build}>
        {APP.build} · IST {clock}
      </span>
    </footer>
  );
}
