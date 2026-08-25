import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { CheckCircleIcon } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { Meter } from '../../components/ui/ProgressBar/ProgressBar';
import { Switch } from '../../components/ui/Switch/Switch';
import { cx } from '../../lib/cx';
import {
  LEGEND,
  PERMISSION_GROUPS,
  ROLES,
  TOTAL_PERMISSIONS,
} from './permissionsData';
import type { Grant, RoleKey } from './permissionsData';
import styles from './PermissionsPage.module.css';

/** Grants keyed by "groupIndex:permissionIndex" for the role being edited. */
type GrantMap = Record<string, Grant>;

const key = (group: number, row: number) => `${group}:${row}`;

function readGrants(role: RoleKey): GrantMap {
  const map: GrantMap = {};
  PERMISSION_GROUPS.forEach((group, g) =>
    group.permissions.forEach((permission, p) => {
      map[key(g, p)] = permission.grants[role];
    }),
  );
  return map;
}

/** Role permission matrix — node 112:12758. */
export function PermissionsPage() {
  const [role, setRole] = useState<RoleKey>('superAgent');
  const [grants, setGrants] = useState<GrantMap>(() => readGrants('superAgent'));
  const [dirty, setDirty] = useState(false);

  const selectRole = (next: RoleKey) => {
    setRole(next);
    setGrants(readGrants(next));
    setDirty(false);
  };

  const active = ROLES.find((item) => item.key === role)!;

  /** Live counts so the summary cards track edits, not just the seed data. */
  const counts = useMemo(() => {
    const perGroup = PERMISSION_GROUPS.map((group, g) =>
      group.permissions.filter((_, p) => grants[key(g, p)].includes('E')).length,
    );
    return { perGroup, total: perGroup.reduce((sum, n) => sum + n, 0) };
  }, [grants]);

  const toggle = (g: number, p: number, flag: 'E' | 'V' | 'X') => {
    setGrants((current) => {
      const value = current[key(g, p)];
      let next: Grant;
      if (flag === 'E') {
        // Turning the master off clears view and edit with it.
        next = value.includes('E') ? '' : 'EV';
      } else {
        next = value.includes(flag) ? value.replace(flag, '') : `${value}${flag}`;
      }
      return { ...current, [key(g, p)]: next };
    });
    setDirty(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>Role Permissions</h1>
          <p className={styles.subtitle}>
            Configure what each role can view and edit across the platform
          </p>
        </div>
        <Button
          variant="primary"
          size="xs"
          disabled={!dirty}
          icon={<CheckCircleIcon size={12.992} />}
          onClick={() => setDirty(false)}
        >
          Save Changes
        </Button>
      </div>

      <div className={styles.roles}>
        {ROLES.map((item) => {
          const enabled = item.key === role ? counts.total : undefined;
          const shown = enabled ?? PERMISSION_GROUPS.reduce(
            (sum, group) =>
              sum + group.permissions.filter((p) => p.grants[item.key].includes('E')).length,
            0,
          );
          return (
            <button
              key={item.key}
              type="button"
              aria-pressed={item.key === role}
              className={cx(styles.role, item.key === role && styles.roleActive)}
              style={{ '--role-rgb': item.rgb } as CSSProperties}
              onClick={() => selectRole(item.key)}
            >
              <span className={styles.roleHead}>
                <span className={styles.roleEmoji} aria-hidden="true">
                  {item.emoji}
                </span>
                <span className={styles.roleText}>
                  <span className={styles.roleName}>{item.name}</span>
                  <span className={styles.roleDescription}>{item.description}</span>
                </span>
              </span>
              <Meter
                className={styles.roleMeter}
                label={`${item.name} permissions`}
                percent={(shown / TOTAL_PERMISSIONS) * 100}
                fill="rgb(var(--role-rgb))"
                height={3.997}
              />
              <span className={styles.roleCount}>
                {shown} / {TOTAL_PERMISSIONS} permissions enabled
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendTitle}>Legend:</span>
        {LEGEND.map((item) => (
          <span key={item.term} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: `rgb(${item.rgb})` }} />
            <span className={styles.legendTerm}>{item.term}</span>
            <span className={styles.legendText}>{item.description}</span>
          </span>
        ))}
      </div>

      {PERMISSION_GROUPS.map((group, g) => {
        const allOn = group.permissions.every((_, p) => grants[key(g, p)].includes('E'));
        return (
          <section
            key={group.name}
            className={styles.group}
            style={{ '--role-rgb': active.rgb } as CSSProperties}
          >
            <header className={styles.groupHead}>
              <div className={styles.groupTitle}>
                <span className={styles.groupEmoji} aria-hidden="true">
                  {group.emoji}
                </span>
                <div>
                  <p className={styles.groupName}>{group.name}</p>
                  <p className={styles.groupCount}>
                    {counts.perGroup[g]} of {group.permissions.length} enabled
                  </p>
                </div>
              </div>
              <div className={styles.allToggle}>
                <span className={styles.allLabel}>All On/Off</span>
                <Switch
                  className={styles.switch}
                  checked={allOn}
                  onChange={() =>
                    setGrants((current) => {
                      const next = { ...current };
                      group.permissions.forEach((_, p) => {
                        next[key(g, p)] = allOn ? '' : 'EV';
                      });
                      setDirty(true);
                      return next;
                    })
                  }
                  label={`Toggle all ${group.name} permissions`}
                  size="sm"
                />
              </div>
            </header>

            <div className={cx(styles.row, styles.columns)}>
              <span>Permission</span>
              <span className={styles.center}>Enable</span>
              <span className={styles.center}>View</span>
              <span className={styles.center}>Edit</span>
            </div>

            {group.permissions.map((permission, p) => {
              const value = grants[key(g, p)];
              const enabled = value.includes('E');
              return (
                <div
                  key={permission.name}
                  className={cx(styles.row, styles.permission, !enabled && styles.rowOff)}
                >
                  <div>
                    <p className={styles.permissionName}>{permission.name}</p>
                    <p className={styles.permissionDescription}>{permission.description}</p>
                  </div>
                  <div className={styles.cell}>
                    <Switch
                      className={styles.switch}
                      checked={enabled}
                      onChange={() => toggle(g, p, 'E')}
                      label={`Enable ${permission.name}`}
                      size="sm"
                    />
                  </div>
                  <div className={styles.cell}>
                    <Switch
                      className={styles.switch}
                      checked={value.includes('V')}
                      onChange={() => toggle(g, p, 'V')}
                      label={`View ${permission.name}`}
                      size="xs"
                    />
                  </div>
                  <div className={styles.cell}>
                    <Switch
                      className={styles.switch}
                      checked={value.includes('X')}
                      onChange={() => toggle(g, p, 'X')}
                      label={`Edit ${permission.name}`}
                      size="xs"
                    />
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
