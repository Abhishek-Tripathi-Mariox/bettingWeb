import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getRole } from '../../config/roles';
import { AuthContext } from './authContext';
import type { AuthUser, Credentials } from './authContext';

const STORAGE_KEY = 'betmaster.session';

function readStoredUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

/**
 * Demo authentication: credentials are checked against the selected role's
 * demo pair in `config/roles`. Swap `signIn` for the real API call — nothing
 * else in the app touches the session shape.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);

  const signIn = useCallback(async ({ roleId, username, password, remember }: Credentials) => {
    const role = getRole(roleId);

    if (!username.trim() || !password) return 'Enter both user name and password.';
    if (username.trim() !== role.demo.username || password !== role.demo.password) {
      return `These credentials are not valid for the ${role.label} panel.`;
    }

    const nextUser: AuthUser = { username: username.trim(), roleId };
    setUser(nextUser);
    if (remember) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    else window.localStorage.removeItem(STORAGE_KEY);

    return null;
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
