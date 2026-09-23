import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { RoleId } from '../../config/roles';
import { ApiRequestError, authApi } from '../../lib/api';
import { AuthContext } from './authContext';
import type { AuthUser, Credentials } from './authContext';

const STORAGE_KEY = 'betmaster.session';

type StoredSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

function readStoredSession(): StoredSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

function writeStoredSession(session: StoredSession | null) {
  try {
    if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode, quota) — the session just won't survive a reload.
  }
}

/**
 * Talks to the real backend (see backend/README.md). `signIn` posts to
 * /auth/login and, when the caller passed a roleId (the Quick Demo Login
 * chips always do), the server cross-checks it against the account's real
 * role and returns the same "not valid for this panel" wording the old
 * client-side check used.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = readStoredSession();
  const [user, setUser] = useState<AuthUser | null>(initial?.user ?? null);
  const [accessToken, setAccessToken] = useState<string | null>(initial?.accessToken ?? null);
  const [refreshToken, setRefreshToken] = useState<string | null>(initial?.refreshToken ?? null);
  /** Whether the current session should survive a reload — mirrors the last "Remember me" choice. */
  const [remembered, setRemembered] = useState(Boolean(initial));

  const signIn = useCallback(async ({ roleId, username, password, remember }: Credentials) => {
    try {
      const session = await authApi.login({ username, password, roleId });
      const nextUser: AuthUser = { username: session.user.username, roleId: session.user.role as RoleId };

      setUser(nextUser);
      setAccessToken(session.accessToken);
      setRefreshToken(session.refreshToken);
      setRemembered(remember);
      writeStoredSession(
        remember ? { user: nextUser, accessToken: session.accessToken, refreshToken: session.refreshToken } : null,
      );

      return null;
    } catch (err) {
      if (err instanceof ApiRequestError) return err.message;
      return 'Unable to reach the server. Please try again.';
    }
  }, []);

  const signOut = useCallback(() => {
    if (refreshToken) {
      authApi.logout(refreshToken, accessToken).catch(() => {
        // Best-effort: the local session is cleared regardless.
      });
    }
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    writeStoredSession(null);
  }, [accessToken, refreshToken]);

  const setTokens = useCallback(
    (nextAccessToken: string, nextRefreshToken: string) => {
      setAccessToken(nextAccessToken);
      setRefreshToken(nextRefreshToken);
      if (remembered && user) {
        writeStoredSession({ user, accessToken: nextAccessToken, refreshToken: nextRefreshToken });
      }
    },
    [remembered, user],
  );

  // Confirms a session restored from localStorage is still valid (not
  // suspended, not deleted, token not expired) rather than trusting it blindly.
  useEffect(() => {
    if (!initial) return;

    authApi
      .me(initial.accessToken)
      .catch(async () => {
        try {
          const rotated = await authApi.refresh(initial.refreshToken);
          const refreshed = await authApi.me(rotated.accessToken);
          setAccessToken(rotated.accessToken);
          setRefreshToken(rotated.refreshToken);
          writeStoredSession({
            user: { username: refreshed.user.username, roleId: refreshed.user.role as RoleId },
            accessToken: rotated.accessToken,
            refreshToken: rotated.refreshToken,
          });
        } catch {
          setUser(null);
          setAccessToken(null);
          setRefreshToken(null);
          writeStoredSession(null);
        }
      });
    // Runs once, against the session that was on disk when the provider mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ user, accessToken, signIn, signOut, setTokens }),
    [user, accessToken, signIn, signOut, setTokens],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
