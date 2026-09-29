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
import type { RoleDefinition } from '../../config/roles';

export type ProfileTab = {
  label: string;
  icon: ComponentType<IconProps>;
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

/** Staff run a book with a wallet; super-admin doesn't, so it has no Wallet Activity tab. */
export function getProfileTabs(role: RoleDefinition): ProfileTab[] {
  return role.id === 'super-admin' ? ALL_TABS.filter((tab) => tab.label !== 'Wallet Activity') : ALL_TABS;
}

/** "Rahul Kumar" -> ["Rahul", "Kumar"]; a one-word name leaves last blank. */
export function splitName(name: string): [string, string] {
  const [first = '', ...rest] = name.trim().split(/\s+/).filter(Boolean);
  return [first, rest.join(' ')];
}

/**
 * Fallback shown before the real signed-in account loads (or if it fails to)
 * — drawn from the static role config rather than a real account.
 */
export function getProfileIdentity(role: RoleDefinition) {
  const [first, last] = splitName(role.operator);
  return {
    first,
    last,
    name: role.operator,
    email: `${first.toLowerCase()}@betmaster.com`,
    role: role.label,
    presence: 'Online',
  };
}






export const PASSWORD_HINT = 'Password must be at least 6 characters.';


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


export const SAVE_ICON = CheckCircleIcon;
