import { useState } from 'react';
import type { ReactNode } from 'react';
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
import { TextAreaField } from '../../components/ui/TextField/TextAreaField';
import { TextField } from '../../components/ui/TextField/TextField';
import { MetricTile } from '../../components/ui/MetricTile/MetricTile';
import { Switch } from '../../components/ui/Switch/Switch';
import type { RoleDefinition } from '../../config/roles';
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
  getProfileFields,
  getProfileIdentity,
  getProfileTabs,
  getProfileWallet,
} from './profileData';
import type { LoginEvent, ProfileWallet } from './profileData';
import styles from './ProfilePage.module.css';

/** Account profile — node 112:11449 plus its six other tab states. */
export function ProfilePage({ role }: { role: RoleDefinition }) {
  const tabs = getProfileTabs(role);
  const wallet = getProfileWallet(role);
  const [tab, setTab] = useState<string>(tabs[0].label);
  const identity = getProfileIdentity(role);

  return (
    <div className={styles.page}>
      <aside className={styles.rail}>
        <section className={styles.card}>
          <div className={styles.identity}>
            <span className={styles.avatar}>{identity.name.slice(0, 1)}</span>
            <p className={styles.name}>{identity.name}</p>
            <p className={styles.email}>{identity.email}</p>
            <div className={styles.identityMeta}>
              <Badge tone={role.accent}>{identity.role}</Badge>
              <span className={styles.presence}>
                <span className={styles.presenceDot} aria-hidden="true" />
                {identity.presence}
              </span>
            </div>
            <Button className={styles.changePhoto} size="xs" block>
              Change Photo
            </Button>
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
        {tab === 'My Profile' ? <EditProfileTab role={role} /> : null}
        {tab === 'Change Password' ? <ChangePasswordTab /> : null}
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

function EditProfileTab({ role }: { role: RoleDefinition }) {
  return (
    <TabCard title="Edit Profile" subtitle="Update your personal information">
      <div className={styles.grid}>
        {getProfileFields(role).map((field) => (
          <TextField key={field.label} label={field.label} defaultValue={field.value} />
        ))}
        <TextAreaField
          fieldClassName={styles.wide}
          label="Bio"
          placeholder="Tell us about yourself..."
        />
      </div>
      <div className={styles.actions}>
        <Button variant="primary" size="sm" icon={<CheckCircleIcon size={13.993} />}>
          Save Profile
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

function ChangePasswordTab() {
  return (
    <TabCard title="Change Password" subtitle="Use a strong, unique password for your account">
      <div className={styles.stack}>
        <TextField label="Current Password" type="password" defaultValue="password1234" />
        <TextField label="New Password" type="password" placeholder="Min. 8 characters" />
        <TextField label="Confirm New Password" type="password" placeholder="Repeat new password" />
        <p className={styles.hint}>{PASSWORD_HINT}</p>
      </div>
      <div className={styles.actions}>
        <Button variant="primary" size="sm" icon={<CheckCircleIcon size={13.993} />}>
          Update Password
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
