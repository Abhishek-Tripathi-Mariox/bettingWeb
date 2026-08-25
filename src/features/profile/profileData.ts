import type { ComponentType } from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BettingIcon,
  CheckCircleIcon,
  LockIcon,
  LoginIcon,
  MonitorIcon,
  SlidersIcon,
  UserIcon,
  WalletIcon,
} from '../../components/icons';
import type { IconProps } from '../../components/icons';
import type { BadgeTone } from '../../components/ui/Badge/Badge';
import type { RoleDefinition, RoleId } from '../../config/roles';

export type ProfileTab = {
  label: string;
  icon: ComponentType<IconProps>;
};

export type ActivityEntry = { description: string; time: string; category: string };

export type LoginEvent = {
  when: string;
  ip: string;
  browser: string;
  os: string;
  location: string;
  status: 'Success' | 'Failed';
};

export type TrustedDevice = { name: string; lastUsed: string; current?: boolean };

export type WalletMovement = {
  label: string;
  /** "TXN8801 · System · 21 Jul · 10:00 AM" — id, channel and timestamp. */
  meta: string;
  amount: string;
  direction: 'in' | 'out';
  status: 'Success' | 'Pending';
};

/** Left rail — node 112:11449, plus the wallet tab the downline panels add. */
const ALL_TABS: ProfileTab[] = [
  { label: 'My Profile', icon: UserIcon },
  { label: 'Change Password', icon: LockIcon },
  { label: 'Wallet Activity', icon: WalletIcon },
  { label: 'Activity', icon: BettingIcon },
  { label: 'Login History', icon: LoginIcon },
  { label: 'Devices', icon: MonitorIcon },
  { label: 'Preferences', icon: SlidersIcon },
];

/**
 * Only the panels that run a book of their own carry a wallet, so the tab —
 * and the figures behind it — follow the role rather than being fixed.
 */
export function getProfileTabs(role: RoleDefinition): ProfileTab[] {
  return getProfileWallet(role)
    ? ALL_TABS
    : ALL_TABS.filter((tab) => tab.label !== 'Wallet Activity');
}

/**
 * The sheet is drawn with the signed-in operator, so the name, email and badge
 * follow the panel rather than being fixed to the Super Admin the frames show.
 */
export function getProfileIdentity(role: RoleDefinition) {
  const [first = '', last = ''] = role.operator.split(' ');
  return {
    first,
    last,
    name: role.operator,
    email: `${first.toLowerCase()}@betmaster.com`,
    role: role.label,
    presence: 'Online',
  };
}

export const QUICK_STATS = [
  { label: 'Total Actions', value: '1,284' },
  { label: 'Login Sessions', value: '284' },
  { label: 'Last Login', value: 'Today 10:42 AM' },
  { label: 'Member Since', value: 'Jan 2024' },
];

/** My Profile tab — nodes 112:11449 and 139:87602. */
export function getProfileFields(role: RoleDefinition) {
  const identity = getProfileIdentity(role);
  return [
    { label: 'First Name', value: identity.first },
    { label: 'Last Name', value: identity.last },
    { label: 'Email', value: identity.email },
    { label: 'Phone', value: '+91 98765 43210' },
    { label: 'City', value: 'Mumbai' },
    { label: 'Timezone', value: 'Asia/Kolkata' },
  ];
}

/** Activity tab — node 119:61631. */
export const PROFILE_ACTIVITY: ActivityEntry[] = [
  { description: 'Approved withdrawal request #W4821', time: '2 mins ago', category: 'wallet' },
  { description: 'Suspended user Rahul M. (risk alert)', time: '15 mins ago', category: 'security' },
  { description: 'Updated betting limits for Cricket markets', time: '1 hr ago', category: 'settings' },
  { description: 'Created new Franchise: Alpha Bets Pvt Ltd', time: '3 hrs ago', category: 'user' },
  { description: 'Exported monthly financial report', time: 'Yesterday', category: 'report' },
  { description: 'Changed commission structure (Agent: 7% → 8%)', time: '2 days ago', category: 'commission' },
  { description: 'Resolved IP whitelist conflict for Agent #A014', time: '3 days ago', category: 'security' },
  { description: 'Added new API key for Diamond Exchange', time: '5 days ago', category: 'settings' },
];

/** Login History tab — node 119:62157. */
export const LOGIN_HISTORY: LoginEvent[] = [
  { when: 'Today 10:42 AM', ip: '103.12.45.87', browser: 'Chrome 124', os: 'Windows 11', location: 'Mumbai, IN', status: 'Success' },
  { when: 'Yesterday 8:15 PM', ip: '103.12.45.87', browser: 'Chrome 124', os: 'Windows 11', location: 'Mumbai, IN', status: 'Success' },
  { when: '18 Jul, 6:33 PM', ip: '45.249.84.21', browser: 'Safari 17', os: 'iOS 17', location: 'Delhi, IN', status: 'Success' },
  { when: '16 Jul, 11:02 AM', ip: '103.12.45.87', browser: 'Chrome 124', os: 'Windows 11', location: 'Mumbai, IN', status: 'Success' },
  { when: '14 Jul, 2:18 AM', ip: '194.36.88.41', browser: 'Unknown', os: 'Linux', location: 'Frankfurt, DE', status: 'Failed' },
  { when: '12 Jul, 4:50 PM', ip: '103.12.45.87', browser: 'Chrome 124', os: 'Windows 11', location: 'Mumbai, IN', status: 'Success' },
];

export const LOGIN_STATUS_TONE: Record<LoginEvent['status'], BadgeTone> = {
  Success: 'success',
  Failed: 'danger',
};

/** Devices tab — node 119:62736. */
export const TRUSTED_DEVICES: TrustedDevice[] = [
  { name: 'Windows PC — Chrome 124', lastUsed: 'Last used: Today, Mumbai IN', current: true },
  { name: 'iPhone 14 — Safari 17', lastUsed: 'Last used: 2 days ago, Delhi IN' },
  { name: 'MacBook Pro — Chrome 124', lastUsed: 'Last used: 8 days ago, Pune IN' },
];

export const PASSWORD_HINT =
  'Password must be at least 8 characters, with one uppercase, one number and one special character.';

/** Wallet Activity tab — nodes 139:88659 (franchise) and 139:112131 (super agent). */
export type ProfileWallet = {
  balance: string;
  totals: { label: string; value: string; color: string }[];
  movements: WalletMovement[];
};

const WALLETS: Partial<Record<RoleId, ProfileWallet>> = {
  /** Node 139:88659. */
  franchise: {
    balance: '₹8,42,000',
    totals: [
      { label: 'Total Deposited', value: '₹42.0Cr', color: 'var(--color-success)' },
      { label: 'Total Withdrawn', value: '₹34.8Cr', color: 'var(--color-danger)' },
      { label: 'Commission Earned', value: '₹2.10Cr', color: 'var(--color-warning)' },
    ],
    movements: [
      { label: 'Commission Credit', meta: 'TXN8801 · System · 21 Jul · 10:00 AM', amount: '+₹84,000', direction: 'in', status: 'Success' },
      { label: 'Withdrawal', meta: 'TXN8798 · RTGS · 20 Jul · 3:15 PM', amount: '-₹2,00,000', direction: 'out', status: 'Success' },
      { label: 'Commission Credit', meta: 'TXN8791 · System · 18 Jul · 10:00 AM', amount: '+₹1,12,000', direction: 'in', status: 'Success' },
      { label: 'Deposit', meta: 'TXN8784 · NEFT · 16 Jul · 9:42 AM', amount: '+₹5,00,000', direction: 'in', status: 'Success' },
      { label: 'Withdrawal', meta: 'TXN8776 · Bank Transfer · 13 Jul · 2:10 PM', amount: '-₹1,50,000', direction: 'out', status: 'Pending' },
      { label: 'Commission Credit', meta: 'TXN8768 · System · 12 Jul · 10:00 AM', amount: '+₹96,000', direction: 'in', status: 'Success' },
    ],
  },
  /** Node 139:112131 — a super agent's book is an order of magnitude smaller. */
  'super-agent': {
    balance: '₹1,84,600',
    totals: [
      { label: 'Total Deposited', value: '₹8.4Cr', color: 'var(--color-success)' },
      { label: 'Total Withdrawn', value: '₹6.2Cr', color: 'var(--color-danger)' },
      { label: 'Commission Earned', value: '₹42.0L', color: 'var(--color-warning)' },
    ],
    movements: [
      { label: 'Commission Credit', meta: 'TXN9201 · System · 21 Jul · 10:00 AM', amount: '+₹14,800', direction: 'in', status: 'Success' },
      { label: 'Withdrawal', meta: 'TXN9198 · Bank Transfer · 20 Jul · 4:30 PM', amount: '-₹50,000', direction: 'out', status: 'Success' },
      { label: 'Commission Credit', meta: 'TXN9191 · System · 19 Jul · 10:00 AM', amount: '+₹18,200', direction: 'in', status: 'Success' },
      { label: 'Deposit', meta: 'TXN9184 · NEFT · 17 Jul · 11:22 AM', amount: '+₹1,00,000', direction: 'in', status: 'Success' },
      { label: 'Withdrawal', meta: 'TXN9176 · UPI · 15 Jul · 2:45 PM', amount: '-₹20,000', direction: 'out', status: 'Pending' },
      { label: 'Commission Credit', meta: 'TXN9168 · System · 14 Jul · 10:00 AM', amount: '+₹11,400', direction: 'in', status: 'Success' },
    ],
  },
};

export function getProfileWallet(role: RoleDefinition): ProfileWallet | undefined {
  return WALLETS[role.id];
}

/** Preferences tab — node 139:113915. */
export const PROFILE_PREFERENCES: { label: string; on: boolean }[] = [
  { label: 'Email notifications for withdrawals', on: true },
  { label: 'Email notifications for deposits', on: true },
  { label: 'SMS alerts for high-risk bets', on: false },
  { label: 'Push notifications for live match updates', on: true },
  { label: 'Daily summary digest (email)', on: true },
  { label: 'Login alert on new device', on: true },
  { label: 'Show balance in header', on: true },
  { label: 'Dark mode (always on)', on: true },
];

export const MOVEMENT_ICON = { in: ArrowDownIcon, out: ArrowUpIcon } as const;

export const MOVEMENT_STATUS_TONE: Record<WalletMovement['status'], BadgeTone> = {
  Success: 'success',
  Pending: 'warning',
};

export const SAVE_ICON = CheckCircleIcon;
