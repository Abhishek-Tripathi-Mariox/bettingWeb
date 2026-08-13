import { NavLink } from 'react-router-dom';
import { CollapseIcon, LogoutIcon } from '../../components/icons';
import { BrandMark } from '../../components/ui/BrandMark/BrandMark';
import { Dot } from '../../components/ui/Dot/Dot';
import { SearchInput } from '../../components/ui/SearchInput/SearchInput';
import { APP } from '../../config/app';
import { navPath } from '../../config/roles';
import type { RoleDefinition } from '../../config/roles';
import { cx } from '../../lib/cx';
import styles from './Sidebar.module.css';

export type SidebarProps = {
  role: RoleDefinition;
  open: boolean;
  onNavigate: () => void;
  onToggle: () => void;
  onSignOut: () => void;
};

/** Left rail — identical for all four panels; entries come from the role. */
export function Sidebar({ role, open, onNavigate, onToggle, onSignOut }: SidebarProps) {
  return (
    <aside className={cx(styles.sidebar, open && styles.sidebarOpen)}>
      <div className={styles.brand}>
        <BrandMark size={33.993} />
        <div className={styles.brandText}>
          <span className={styles.brandName}>{APP.shortName}</span>
          <span className={styles.brandVersion}>{APP.edition}</span>
        </div>
      </div>

      <button
        type="button"
        className={styles.collapse}
        aria-label="Toggle navigation"
        onClick={onToggle}
      >
        <CollapseIcon size={12} />
      </button>

      <div className={styles.identity}>
        <div className={styles.identityChip}>
          <Dot />
          <div>
            <p className={styles.identityRole}>{role.label}</p>
            <p className={styles.identityUser}>{role.operator} · Online</p>
          </div>
        </div>
      </div>

      <div className={styles.search}>
        <SearchInput size="sm" placeholder="Search menu..." aria-label="Search menu" />
      </div>

      <nav className={styles.nav}>
        {role.nav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.segment || 'home'}
              to={navPath(role, item)}
              end={item.segment === ''}
              className={({ isActive }) => cx(styles.navItem, isActive && styles.navItemActive)}
              onClick={onNavigate}
            >
              <Icon size={15.999} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.logoutWrap}>
        <button type="button" className={styles.logout} onClick={onSignOut}>
          <LogoutIcon size={15.999} />
          Logout
        </button>
      </div>
    </aside>
  );
}
