import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  ExportIcon,
  SendIcon,
} from '../../components/icons';
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
import {
  LOGIN_HISTORY,
  LOGIN_STATUS_TONE,
  MOVEMENT_ICON,
  MOVEMENT_STATUS_TONE,
  PASSWORD_HINT,
  PROFILE_ACTIVITY,
  PROFILE_PREFERENCES,
  QUICK_STATS,
  TRUSTED_DEVICES,
  getProfileIdentity,
  getProfileTabs,
  getProfileWallet,
  splitName,
} from './profileData';
import type { LoginEvent, ProfileWallet } from './profileData';
import styles from './ProfilePage.module.css';

/** Account profile — node 112:11449 plus its six other tab states. */
export function ProfilePage({ role }: { role: RoleDefinition }) {
  const { accessToken, setTokens } = useAuth();
  const tabs = getProfileTabs(role);
  const wallet = getProfileWallet(role);
  const [tab, setTab] = useState<string>(tabs[0].label);

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
  const displayName = user ? user.name || fallback.name : fallback.name;
  const displayEmail = user ? user.email || fallback.email : fallback.email;

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
            <ChangePhotoButton accessToken={accessToken} disabled={!user} onUpdated={setUser} />
          </div>
        </section>

        <section className={styles.card}>
          <p className={styles.cardTitle}>Quick Stats</p>
          <dl className={styles.quickStats}>
            {QUICK_STATS.map((stat) => (
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
            onSaved={setUser}
          />
        ) : null}
        {tab === 'Change Password' ? (
          <ChangePasswordTab accessToken={accessToken} onChanged={setTokens} />
        ) : null}
        {tab === 'Wallet Activity' && wallet ? <WalletActivityTab wallet={wallet} /> : null}
        {tab === 'Activity' ? <ActivityTab /> : null}
        {tab === 'Login History' ? <LoginHistoryTab /> : null}
        {tab === 'Devices' ? <DevicesTab /> : null}
        {tab === 'Preferences' ? <PreferencesTab /> : null}
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
  onSaved,
}: {
  role: RoleDefinition;
  user: ApiUser | null;
  accessToken: string | null;
  onSaved: (user: ApiUser) => void;
}) {
  const fallback = getProfileIdentity(role);
  const [savedFirst, savedLast] = user ? splitName(user.name) : [fallback.first, fallback.last];

  const [firstName, setFirstName] = useState(savedFirst);
  const [lastName, setLastName] = useState(savedLast);
  const [email, setEmail] = useState(user?.email ?? fallback.email);
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
          disabled={pending || !accessToken}
          onClick={handleSave}
        >
          {pending ? 'Saving…' : 'Save Profile'}
        </Button>
      </div>
    </TabCard>
  );
}

/** Wallet Activity tab — node 139:88659. */
function WalletActivityTab({ wallet }: { wallet: ProfileWallet }) {
  return (
    <div className={styles.wallet}>
      <section className={styles.balanceCard}>
        <p className={styles.balanceLabel}>Current Wallet Balance</p>
        <p className={styles.balanceValue}>{wallet.balance}</p>
        <div className={styles.balanceActions}>
          <Button className={styles.deposit} size="xs" icon={<ArrowDownIcon size={12} />}>
            Deposit
          </Button>
          <Button className={styles.withdraw} size="xs" icon={<ArrowUpIcon size={12} />}>
            Withdraw
          </Button>
          <Button size="xs" icon={<SendIcon size={12} />}>
            Transfer
          </Button>
        </div>
      </section>

      <div className={styles.walletTotals}>
        {wallet.totals.map((total) => (
          <MetricTile key={total.label} size="lg" label={total.label} value={total.value} color={total.color} />
        ))}
      </div>

      <section className={styles.card}>
        <div className={styles.walletHead}>
          <p className={styles.cardTitle}>Recent Transactions</p>
          <Button variant="quiet" size="xs" icon={<ExportIcon size={12} />}>
            Export
          </Button>
        </div>
        <ul className={styles.movements}>
          {wallet.movements.map((movement) => {
            const Icon = MOVEMENT_ICON[movement.direction];
            return (
              <li key={movement.meta} className={styles.movement}>
                <span className={cx(styles.movementTile, styles[movement.direction])}>
                  <Icon size={13.993} />
                </span>
                <div className={styles.movementText}>
                  <p className={styles.movementLabel}>{movement.label}</p>
                  <p className={styles.movementMeta}>{movement.meta}</p>
                </div>
                <div className={styles.movementAmount}>
                  <p className={cx(styles.amount, styles[movement.direction])}>{movement.amount}</p>
                  <Badge tone={MOVEMENT_STATUS_TONE[movement.status]}>{movement.status}</Badge>
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

function ActivityTab() {
  return (
    <TabCard title="Recent Activity" subtitle="Last 20 actions performed in the platform">
      <div className={styles.activityList}>
        {PROFILE_ACTIVITY.map((entry) => (
          <article key={entry.description} className={styles.activity}>
            <div className={styles.activityMain}>
              <p className={styles.activityText}>{entry.description}</p>
              <p className={styles.activityTime}>{entry.time}</p>
            </div>
            <span className={styles.category}>{entry.category}</span>
          </article>
        ))}
      </div>
    </TabCard>
  );
}

function LoginHistoryTab() {
  const columns: Column<LoginEvent>[] = [
    { key: 'when', header: 'Date & Time', render: (row) => <span className={styles.strong}>{row.when}</span> },
    { key: 'ip', header: 'IP Address', render: (row) => <span className={styles.mono}>{row.ip}</span> },
    { key: 'browser', header: 'Browser', render: (row) => <span className={styles.muted}>{row.browser}</span> },
    { key: 'os', header: 'OS', render: (row) => <span className={styles.muted}>{row.os}</span> },
    { key: 'location', header: 'Location', render: (row) => <span className={styles.muted}>{row.location}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge tone={LOGIN_STATUS_TONE[row.status]}>{row.status}</Badge>,
    },
  ];

  return (
    <TabCard title="Login History" subtitle="All sign-in events for your account">
      <div className={styles.table}>
        <DataTable
          columns={columns}
          rows={LOGIN_HISTORY}
          rowKey={(row) => row.when}
          rowClassName={(row) => (row.status === 'Failed' ? styles.rowFailed : undefined)}
          size="md"
          emptyMessage="No sign-in events recorded."
        />
      </div>
    </TabCard>
  );
}

function DevicesTab() {
  return (
    <TabCard title="Trusted Devices" subtitle="Devices that have accessed your account">
      <div className={styles.stack}>
        {TRUSTED_DEVICES.map((device) => (
          <article key={device.name} className={styles.device}>
            <div className={styles.deviceMain}>
              <p className={styles.deviceName}>
                {device.name}
                {device.current ? <Badge tone="success">Current</Badge> : null}
              </p>
              <p className={styles.deviceMeta}>{device.lastUsed}</p>
            </div>
            {device.current ? null : (
              <Button className={styles.remove} size="xs">
                Remove
              </Button>
            )}
          </article>
        ))}
      </div>
    </TabCard>
  );
}

/** Preferences tab — node 139:113915. */
function PreferencesTab() {
  const [prefs, setPrefs] = useState(() =>
    Object.fromEntries(PROFILE_PREFERENCES.map((item) => [item.label, item.on])),
  );

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
      <div className={styles.actions}>
        <Button variant="primary" size="sm" icon={<CheckCircleIcon size={13.993} />}>
          Save Preferences
        </Button>
      </div>
    </TabCard>
  );
}
