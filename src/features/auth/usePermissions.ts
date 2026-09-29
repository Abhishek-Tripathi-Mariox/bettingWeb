import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';
import type { PermissionGroup } from '../../lib/api';
import { useAuth } from './authContext';

export type GrantAction = 'E' | 'V' | 'X';

/**
 * The signed-in role's live permission matrix (what the Super Admin set on
 * the Permissions page), so pages can show only what the account may do.
 * `can('finance', 'fundTransfer', 'X')` — super-admin can always; everything
 * is refused while the matrix is still loading.
 */
export function usePermissions() {
  const { accessToken, user } = useAuth();
  const [groups, setGroups] = useState<PermissionGroup[] | null>(null);
  const isAdmin = user?.roleId === 'super-admin';

  useEffect(() => {
    if (!accessToken || isAdmin) return undefined;
    let cancelled = false;
    apiRequest<{ groups: PermissionGroup[] | null }>('/accounts/me/permissions', { accessToken })
      .then((res) => {
        if (!cancelled) setGroups(res.groups);
      })
      .catch(() => {
        if (!cancelled) setGroups([]);
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken, isAdmin]);

  const can = useCallback(
    (groupKey: string, permissionKey: string, action: GrantAction) => {
      if (isAdmin) return true;
      const grant = groups
        ?.find((group) => group.key === groupKey)
        ?.permissions.find((permission) => permission.key === permissionKey)?.grant;
      return Boolean(grant?.includes(action));
    },
    [groups, isAdmin],
  );

  return { can, loaded: isAdmin || groups !== null };
}
