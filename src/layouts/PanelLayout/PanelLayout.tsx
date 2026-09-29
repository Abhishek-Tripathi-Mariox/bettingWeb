import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getRole, navPath } from '../../config/roles';
import type { NavItem, RoleDefinition } from '../../config/roles';
import { useAuth } from '../../features/auth/authContext';
import { cx } from '../../lib/cx';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';
import { Topbar } from './Topbar';
import styles from './PanelLayout.module.css';

/** The nav entry matching the current URL — drives the title and breadcrumb. */
function useCurrentNavItem(role: RoleDefinition): NavItem {
  const { pathname } = useLocation();
  return (
    [...role.nav].reverse().find((item) => pathname.startsWith(navPath(role, item))) ?? role.nav[0]
  );
}

function useClock(): string {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now.toLocaleTimeString('en-IN', { hour12: true });
}

/**
 * One shell for all four panels. Everything role-specific — identity chip,
 * nav entries, landing route — comes from the role definition.
 */
export function PanelLayout() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  const role = getRole(user!.roleId);
  const current = useCurrentNavItem(role);
  const clock = useClock();
  const displayName = user!.name || user!.username;

  const handleSignOut = () => {
    signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.shell}>
      <div
        className={cx(styles.scrim, navOpen && styles.scrimOpen)}
        onClick={() => setNavOpen(false)}
      />
      <Sidebar
        role={role}
        displayName={displayName}
        open={navOpen}
        onNavigate={() => setNavOpen(false)}
        onToggle={() => setNavOpen((open) => !open)}
        onSignOut={handleSignOut}
      />

      <div className={styles.main}>
        <Topbar
          role={role}
          section={current.label}
          username={user!.username}
          displayName={displayName}
          onToggleNav={() => setNavOpen((open) => !open)}
        />
        <main className={styles.content}>
          <Outlet />
        </main>
        <StatusBar clock={clock} />
      </div>
    </div>
  );
}
