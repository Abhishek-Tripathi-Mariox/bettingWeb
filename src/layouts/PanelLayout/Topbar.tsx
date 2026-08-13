import { BellIcon, ChevronDownIcon, ChevronRightIcon, CollapseIcon, PlusIcon } from '../../components/icons';
import { Dot } from '../../components/ui/Dot/Dot';
import { SearchInput } from '../../components/ui/SearchInput/SearchInput';
import { PLATFORM_STATUS } from '../../config/app';
import type { RoleDefinition } from '../../config/roles';
import styles from './Topbar.module.css';

export type TopbarProps = {
  role: RoleDefinition;
  /** Label of the section currently open. */
  section: string;
  username: string;
  onToggleNav: () => void;
};

export function Topbar({ role, section, username, onToggleNav }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <button
        type="button"
        className={`${styles.iconButton} ${styles.menuButton}`}
        aria-label="Open navigation"
        onClick={onToggleNav}
      >
        <CollapseIcon size={12} />
      </button>

      <div className={styles.heading}>
        <h1 className={styles.title}>{section}</h1>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <span>Home</span>
          <ChevronRightIcon size={12} />
          <span className={styles.breadcrumbCurrent}>{section}</span>
        </nav>
      </div>

      <SearchInput
        className={styles.globalSearch}
        placeholder="Global search..."
        aria-label="Global search"
      />

      <div className={`${styles.chip} ${styles.chipLive}`}>
        <Dot tone="live" />
        <span className={styles.chipLiveLabel}>LIVE</span>
        <span className={styles.chipMeta}>{PLATFORM_STATUS.liveMatches} matches</span>
      </div>

      <button type="button" className={`${styles.chip} ${styles.chipRole}`}>
        <Dot />
        {role.label}
        <ChevronDownIcon size={12} />
      </button>

      <button type="button" className={styles.iconButton} aria-label="Notifications">
        <BellIcon size={15.999} />
        <span className={styles.badgeDot} />
      </button>

      <button
        type="button"
        className={`${styles.iconButton} ${styles.iconButtonBrand}`}
        aria-label="Create"
      >
        <PlusIcon size={15.999} />
      </button>

      <span className={styles.avatar} title={`${role.operator} (${username})`}>
        {role.operator.slice(0, 1)}
      </span>
    </header>
  );
}
