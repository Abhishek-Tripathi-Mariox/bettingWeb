import { usePermissions } from '../auth/usePermissions';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { CheckCircleIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { TextField } from '../../components/ui/TextField/TextField';
import { MetricTile } from '../../components/ui/MetricTile/MetricTile';
import { Switch } from '../../components/ui/Switch/Switch';
import type { RoleDefinition } from '../../config/roles';
import { useAuth } from '../auth/authContext';
import { ApiRequestError, authApi } from '../../lib/api';
import type { ApiUser } from '../../lib/api';
import { resizeImageToDataUri } from '../../lib/image';
import { cx } from '../../lib/cx';
import { networkApi } from '../../lib/api/network';
import type { DetailActivity, MyProfile } from '../../lib/api/network';
import { formatIp, formatMoney, formatRelativeTime, formatRupees } from '../../lib/format';
import { ACTIVITY_TITLE, describeUserAgent, formatDate, activityExtras } from '../users/usersData';
import {
  MOVEMENT_ICON,
  PASSWORD_HINT,
  PROFILE_PREFERENCES,
  getProfileIdentity,
  getProfileTabs,
  splitName,
} from './profileData';
import styles from './ProfilePage.module.css';

/** Account profile — node 112:11449 plus its six other tab states. */
export function ProfilePage({ role }: { role: RoleDefinition }) {
  const { accessToken, setTokens, setDisplayName } = useAuth();
  const { can } = usePermissions();
  // Staff follow the Permissions page: Edit Profile (edit), Change Password (edit), Wallet Balance (view).
  const canEditProfile = can('accountSettings', 'editProfile', 'X');
  const tabs = getProfileTabs(role).filter(
    (item) =>
      (item.label !== 'Change Password' || can('accountSettings', 'changePassword', 'X')) &&
      (item.label !== 'Wallet Activity' || can('finance', 'walletBalance', 'V')),
  );
  const [tab, setTab] = useState<string>(tabs[0].label);
  const [overview, setOverview] = useState<MyProfile | null>(null);
  const [overviewVersion, setOverviewVersion] = useState(0);

  // Real stats, activity, sign-ins, sessions and wallet for the signed-in account.
  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    networkApi
      .myProfile(accessToken)
      .then((res) => {
        if (!cancelled) setOverview(res);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [accessToken, overviewVersion]);
  const reloadOverview = () => setOverviewVersion((v) => v + 1);

  const quickStats = [
    { label: 'Total Actions', value: overview ? overview.stats.totalActions.toLocaleString('en-IN') : '…' },
    { label: 'Login Sessions', value: overview ? overview.stats.loginCount.toLocaleString('en-IN') : '…' },
    {
      label: 'Last Login',
      value: overview ? (overview.stats.lastLoginAt ? formatRelativeTime(overview.stats.lastLoginAt) : 'Never') : '…',
    },
    { label: 'Member Since', value: overview ? formatDate(overview.stats.memberSince) : '…' },
  ];

  // The live signed-in account — every role (super-admin, franchise, super-agent,
  // agent) shares this same page, so it's fetched rather than derived from `role`.
  const [user, setUser] = useState<ApiUser | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    authApi
      .me(accessToken)
      .then((res) => {
        if (!cancelled) setUser(res.user);
      })
      .catch(() => {
        // The identity card falls back to the role's mock identity below.
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const fallback = getProfileIdentity(role);
  // Only what the account really holds: no made-up email for one that has none.
  const displayName = user ? user.name || user.username : fallback.name;
  const displayEmail = user ? user.email || `@${user.username}` : '';

  return (
    <div className={styles.page}>
      <aside className={styles.rail}>
        <section className={styles.card}>
          <div className={styles.identity}>
            {user?.avatar ? (
              <img src={user.avatar} alt="" className={styles.avatarImage} />
            ) : (
              <span className={styles.avatar}>{displayName.slice(0, 1)}</span>
            )}
            <p className={styles.name}>{displayName}</p>
            <p className={styles.email}>{displayEmail}</p>
            <div className={styles.identityMeta}>
              <Badge tone={role.accent}>{fallback.role}</Badge>
              <span className={styles.presence}>
                <span className={styles.presenceDot} aria-hidden="true" />
                {fallback.presence}
              </span>
            </div>
            <ChangePhotoButton accessToken={accessToken} disabled={!user || !canEditProfile} onUpdated={setUser} />
          </div>
        </section>

        <section className={styles.card}>
          <p className={styles.cardTitle}>Quick Stats</p>
          <dl className={styles.quickStats}>
            {quickStats.map((stat) => (
              <div key={stat.label} className={styles.quickStat}>
                <dt className={styles.quickLabel}>{stat.label}</dt>
                <dd className={styles.quickValue}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav className={styles.nav} aria-label="Profile sections">
          {tabs.map((item) => (
            <button
              key={item.label}
              type="button"
              aria-current={item.label === tab ? 'page' : undefined}
              className={cx(styles.navItem, item.label === tab && styles.navActive)}
              onClick={() => setTab(item.label)}
            >
              <item.icon size={13.993} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className={styles.body}>
        {tab === 'My Profile' ? (
          <EditProfileTab
            key={user?._id ?? 'pending'}
            role={role}
            user={user}
            accessToken={accessToken}
            canEdit={canEditProfile}
            onSaved={(saved) => {
              setUser(saved);
              setDisplayName(saved.name);
            }}
          />
        ) : null}
        {tab === 'Change Password' ? (
          <ChangePasswordTab accessToken={accessToken} onChanged={setTokens} />
        ) : null}
        {tab === 'Wallet Activity' ? <WalletActivityTab wallet={overview?.wallet ?? null} /> : null}
        {tab === 'Activity' ? <ActivityTab entries={overview?.activity ?? null} /> : null}
        {tab === 'Login History' ? <LoginHistoryTab logins={overview?.logins ?? null} /> : null}
        {tab === 'Devices' ? (
          <DevicesTab overview={overview} accessToken={accessToken} onChanged={reloadOverview} />
        ) : null}
        {tab === 'Preferences' ? (
          <PreferencesTab
            key={overview ? 'loaded' : 'pending'}
            saved={overview?.preferences ?? {}}
            accessToken={accessToken}
            canEdit={canEditProfile}
          />
        ) : null}
      </div>
    </div>
  );
}

function TabCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.card}>
      <p className={styles.tabTitle}>{title}</p>
      <p className={styles.tabSubtitle}>{subtitle}</p>
      {children}
    </section>
  );
}

/** The avatar's "Change Photo" action — resizes the picked file and saves it immediately. */
function ChangePhotoButton({
  accessToken,
  disabled,
  onUpdated,
}: {
  accessToken: string | null;
  disabled: boolean;
  onUpdated: (user: ApiUser) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset so picking the same file again still fires a change event.
    event.target.value = '';
    if (!file || !accessToken) return;

    setPending(true);
    setError(null);
    try {
      const avatar = await resizeImageToDataUri(file);
      const result = await authApi.updateProfile(accessToken, { avatar });
      onUpdated(result.user);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not update your photo.');
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className={styles.hiddenInput}
        onChange={handleChange}
      />
      <Button
        className={styles.changePhoto}
        size="xs"
        block
        disabled={disabled || pending}
        onClick={() => inputRef.current?.click()}
      >
        {pending ? 'Uploading…' : 'Change Photo'}
      </Button>
      {error ? (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}

function EditProfileTab({
  role,
  user,
  accessToken,
  canEdit = true,
  onSaved,
}: {
  role: RoleDefinition;
  user: ApiUser | null;
  accessToken: string | null;
  /** Edit Profile (edit) on the Permissions page. */
  canEdit?: boolean;
  onSaved: (user: ApiUser) => void;
}) {
  const fallback = getProfileIdentity(role);
  const [savedFirst, savedLast] = user ? splitName(user.name) : [fallback.first, fallback.last];

  const [firstName, setFirstName] = useState(savedFirst);
  const [lastName, setLastName] = useState(savedLast);
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [city, setCity] = useState(user?.city ?? '');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!accessToken) return;
    setPending(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await authApi.updateProfile(accessToken, {
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        city,
      });
      onSaved(result.user);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to reach the server. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <TabCard title="Edit Profile" subtitle="Update your personal information">
      <div className={styles.grid}>
        <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      {error ? (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      ) : null}
      {success ? <p className={styles.formSuccess}>Profile updated.</p> : null}
      <div className={styles.actions}>
        <Button
          variant="primary"
          size="sm"
          icon={<CheckCircleIcon size={13.993} />}
          disabled={pending || !accessToken || !user || !canEdit}
          title={canEdit ? undefined : 'Aapke role ko profile edit karne ki permission nahi hai.'}
          onClick={handleSave}
        >
          {pending ? 'Saving…' : 'Save Profile'}
        </Button>
      </div>
    </TabCard>
  );
}

/** Wallet Activity tab — node 139:88659, from the account's own wallet and its network's ledger. */
function WalletActivityTab({ wallet }: { wallet: MyProfile['wallet'] }) {
  if (!wallet) return <TabCard title="Wallet Activity" subtitle="Loading…">{null}</TabCard>;
  const totals = [
    { label: 'Deposited by Users', value: formatMoney(wallet.deposited), color: 'var(--color-success)' },
    { label: 'Withdrawn by Users', value: formatMoney(wallet.withdrawn), color: 'var(--color-danger)' },
    { label: 'Commission Earned', value: formatMoney(wallet.commissionEarned), color: 'var(--color-warning)' },
  ];
  return (
    <div className={styles.wallet}>
      <section className={styles.balanceCard}>
        <p className={styles.balanceLabel}>Current Wallet Balance</p>
        <p className={styles.balanceValue}>{formatRupees(wallet.balance)}</p>
      </section>

      <div className={styles.walletTotals}>
        {totals.map((total) => (
          <MetricTile key={total.label} size="lg" label={total.label} value={total.value} color={total.color} />
        ))}
      </div>

      <section className={styles.card}>
        <div className={styles.walletHead}>
          <p className={styles.cardTitle}>Recent Transactions</p>
        </div>
        {wallet.transactions.length === 0 ? <p className={styles.movementMeta}>No transactions yet.</p> : null}
        <ul className={styles.movements}>
          {wallet.transactions.map((txn) => {
            const direction = txn.amount >= 0 ? 'in' : 'out';
            const Icon = MOVEMENT_ICON[direction];
            const who = !txn.user ? 'Platform' : typeof txn.user === 'string' ? txn.user.slice(-6) : txn.user.name || txn.user.username;
            return (
              <li key={txn._id} className={styles.movement}>
                <span className={cx(styles.movementTile, styles[direction])}>
                  <Icon size={13.993} />
                </span>
                <div className={styles.movementText}>
                  <p className={styles.movementLabel}>
                    {txn.type} — {who}
                  </p>
                  <p className={styles.movementMeta}>
                    {[txn.reference || txn._id.slice(-8).toUpperCase(), txn.method, formatRelativeTime(txn.createdAt)]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
                <div className={styles.movementAmount}>
                  <p className={cx(styles.amount, styles[direction])}>
                    {txn.amount >= 0 ? '+' : ''}
                    {formatRupees(txn.amount)}
                  </p>
                  <Badge tone={txn.status === 'Completed' ? 'success' : txn.status === 'Failed' ? 'danger' : 'warning'}>
                    {txn.status === 'Completed' ? 'Success' : txn.status}
                  </Badge>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function ChangePasswordTab({
  accessToken,
  onChanged,
}: {
  accessToken: string | null;
  onChanged: (accessToken: string, refreshToken: string) => void;
}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);
    if (!accessToken) return;
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setPending(true);
    try {
      // Changing the password revokes every previously issued token
      // (including this session's own), so the fresh pair below has to
      // replace it or the very next authenticated request would 401.
      const result = await authApi.changePassword(accessToken, { currentPassword, newPassword });
      onChanged(result.accessToken, result.refreshToken);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to reach the server. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <TabCard title="Change Password" subtitle="Use a strong, unique password for your account">
      <div className={styles.stack}>
        <TextField
          label="Current Password"
          type="password"
          name="current-password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <TextField
          label="New Password"
          type="password"
          name="new-password"
          autoComplete="new-password"
          placeholder="Min. 6 characters"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          name="confirm-password"
          autoComplete="new-password"
          placeholder="Repeat new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error ? (
          <p className={styles.formError} role="alert">
            {error}
          </p>
        ) : null}
        {success ? <p className={styles.formSuccess}>Password updated.</p> : null}
        <p className={styles.hint}>{PASSWORD_HINT}</p>
      </div>
      <div className={styles.actions}>
        <Button
          variant="primary"
          size="sm"
          icon={<CheckCircleIcon size={13.993} />}
          disabled={pending || !accessToken || !currentPassword || newPassword.length < 6}
          onClick={handleSubmit}
        >
          {pending ? 'Updating…' : 'Update Password'}
        </Button>
      </div>
    </TabCard>
  );
}

function ActivityTab({ entries }: { entries: MyProfile['activity'] | null }) {
  return (
    <TabCard title="Recent Activity" subtitle="Last 20 actions performed in the platform">
      <div className={styles.activityList}>
        {entries === null ? <p className={styles.activityTime}>Loading…</p> : null}
        {entries?.length === 0 ? <p className={styles.activityTime}>No actions recorded yet.</p> : null}
        {entries?.map((entry) => {
          const who =
            entry.target && typeof entry.target === 'object' ? ` — ${entry.target.name || entry.target.username}` : '';
          const extras = activityExtras(entry.metadata);
          const target = `${who}${extras ? ` · ${extras}` : ''}`;
          return (
            <article key={entry._id} className={styles.activity}>
              <div className={styles.activityMain}>
                <p className={styles.activityText}>
                  {ACTIVITY_TITLE[entry.action] ?? entry.action}
                  {target}
                </p>
                <p className={styles.activityTime}>{formatRelativeTime(entry.createdAt)}</p>
              </div>
              <span className={styles.category}>{entry.action.split('_')[0]}</span>
            </article>
          );
        })}
      </div>
    </TabCard>
  );
}

function LoginHistoryTab({ logins }: { logins: DetailActivity[] | null }) {
  const columns: Column<DetailActivity>[] = [
    {
      key: 'when',
      header: 'Date & Time',
      render: (row) => <span className={styles.strong}>{new Date(row.createdAt).toLocaleString('en-IN')}</span>,
    },
    { key: 'ip', header: 'IP Address', render: (row) => <span className={styles.mono}>{formatIp(row.ip) || '—'}</span> },
    {
      key: 'device',
      header: 'Browser / OS',
      render: (row) => <span className={styles.muted}>{describeUserAgent(row.userAgent).name}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge tone={row.status === 'failed' ? 'danger' : 'success'}>{row.status === 'failed' ? 'Failed' : 'Success'}</Badge>
      ),
    },
  ];

  return (
    <TabCard title="Login History" subtitle="All sign-in events for your account">
      <div className={styles.table}>
        <DataTable
          columns={columns}
          rows={logins ?? []}
          rowKey={(row) => row._id}
          rowClassName={(row) => (row.status === 'failed' ? styles.rowFailed : undefined)}
          size="md"
          emptyMessage={logins === null ? 'Loading…' : 'No sign-in events recorded.'}
        />
      </div>
    </TabCard>
  );
}

function DevicesTab({
  overview,
  accessToken,
  onChanged,
}: {
  overview: MyProfile | null;
  accessToken: string | null;
  onChanged: () => void;
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sessions = overview?.sessions ?? [];
  // The newest session from this browser is the one in use right now.
  const currentId = sessions.find((session) => session.userAgent === overview?.currentUserAgent)?._id;

  const remove = async (id: string) => {
    if (!accessToken) return;
    setPendingId(id);
    setError(null);
    try {
      await networkApi.revokeSession(id, accessToken);
      onChanged();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to remove this device.');
    } finally {
      setPendingId(null);
    }
  };

  return (
    <TabCard title="Trusted Devices" subtitle="Devices currently signed in to your account">
      <div className={styles.stack}>
        {overview === null ? <p className={styles.deviceMeta}>Loading…</p> : null}
        {error ? <p className={styles.deviceMeta}>{error}</p> : null}
        {sessions.map((session) => {
          const current = session._id === currentId;
          return (
            <article key={session._id} className={styles.device}>
              <div className={styles.deviceMain}>
                <p className={styles.deviceName}>
                  {describeUserAgent(session.userAgent).name}
                  {current ? <Badge tone="success">Current</Badge> : null}
                </p>
                <p className={styles.deviceMeta}>
                  Last used: {formatRelativeTime(session.updatedAt)}
                  {session.ip ? ` · ${formatIp(session.ip)}` : ''}
                </p>
              </div>
              {current ? null : (
                <Button className={styles.remove} size="xs" disabled={pendingId === session._id} onClick={() => remove(session._id)}>
                  {pendingId === session._id ? 'Removing…' : 'Remove'}
                </Button>
              )}
            </article>
          );
        })}
      </div>
    </TabCard>
  );
}

/** Preferences tab — node 139:113915, saved on the account. */
function PreferencesTab({
  saved,
  accessToken,
  canEdit = true,
}: {
  saved: Record<string, boolean>;
  accessToken: string | null;
  canEdit?: boolean;
}) {
  const [prefs, setPrefs] = useState(() =>
    Object.fromEntries(PROFILE_PREFERENCES.map((item) => [item.label, saved[item.label] ?? item.on])),
  );
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async () => {
    if (!accessToken) return;
    setPending(true);
    setMessage(null);
    try {
      await authApi.updateProfile(accessToken, { preferences: prefs });
      setMessage('Preferences saved.');
    } catch (err) {
      setMessage(err instanceof ApiRequestError ? err.message : 'Unable to save preferences.');
    } finally {
      setPending(false);
    }
  };

  return (
    <TabCard title="Preferences" subtitle="Notification and display preferences">
      <ul className={styles.prefs}>
        {PROFILE_PREFERENCES.map((item) => (
          <li key={item.label} className={styles.pref}>
            <span className={styles.prefLabel}>{item.label}</span>
            <Switch
              checked={prefs[item.label]}
              label={item.label}
              onChange={(checked) => setPrefs((all) => ({ ...all, [item.label]: checked }))}
            />
          </li>
        ))}
      </ul>
      {message ? <p className={styles.prefLabel}>{message}</p> : null}
      {canEdit ? null : <p className={styles.prefLabel}>Aapke role ko profile edit karne ki permission nahi hai.</p>}
      <div className={styles.actions}>
        <Button variant="primary" size="sm" disabled={pending || !canEdit} icon={<CheckCircleIcon size={13.993} />} onClick={save}>
          {pending ? 'Saving…' : 'Save Preferences'}
        </Button>
      </div>
    </TabCard>
  );
}
