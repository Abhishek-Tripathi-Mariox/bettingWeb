import { createContext, useContext } from 'react';
import type { RoleId } from '../../config/roles';

export type AuthUser = {
  username: string;
  roleId: RoleId;
};

export type Credentials = {
  roleId: RoleId;
  username: string;
  password: string;
  remember: boolean;
};

export type AuthContextValue = {
  user: AuthUser | null;
  /** Resolves to an error message, or null when the sign-in succeeded. */
  signIn: (credentials: Credentials) => Promise<string | null>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}
