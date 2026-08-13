import type { ComponentType } from 'react';
import type { IconProps } from '../components/icons';
import {
  AnalyticsIcon,
  BellIcon,
  BettingIcon,
  BuildingIcon,
  CmsIcon,
  CommissionIcon,
  EventsIcon,
  LayoutDashboardIcon,
  MarketsIcon,
  PartnershipIcon,
  ReportsIcon,
  RiskIcon,
  SecurityIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SupportIcon,
  TransactionsIcon,
  UserIcon,
  UsersCogIcon,
  UsersIcon,
  WalletIcon,
} from '../components/icons';

export type RoleId = 'super-admin' | 'franchise' | 'super-agent' | 'agent';

export type NavItem = {
  /** Path segment appended to the role's base path; '' is the role home. */
  segment: string;
  label: string;
  icon: ComponentType<IconProps>;
};

export type RoleDefinition = {
  id: RoleId;
  /** Label shown on the login chip and in the panel shell. */
  label: string;
  icon: ComponentType<IconProps>;
  /** One-line description of the role's remit. */
  description: string;
  /** Route prefix owned by this role, e.g. /super-admin. */
  basePath: string;
  /** Credentials pre-filled by the Quick Demo Login chips. */
  demo: { username: string; password: string };
  /** Person shown in the sidebar identity chip. */
  operator: string;
  /** The role directly beneath this one in the hierarchy. */
  manages: RoleId | null;
  /** Nav entry that lists this role's downline (franchises, agents, players…). */
  downline: NavItem;
  nav: NavItem[];
};

/**
 * Every nav destination in the product. Roles pick from this registry so a
 * label or icon is only ever declared once.
 */
const NAV = {
  dashboard: { segment: '', label: 'Dashboard', icon: LayoutDashboardIcon },
  users: { segment: 'users', label: 'Users', icon: UsersIcon },
  franchises: { segment: 'franchise', label: 'Franchise', icon: BuildingIcon },
  superAgents: { segment: 'super-agent', label: 'Super Agent', icon: UsersCogIcon },
  agents: { segment: 'agent', label: 'Agent', icon: UserIcon },
  wallet: { segment: 'wallet', label: 'Wallet', icon: WalletIcon },
  transactions: { segment: 'transactions', label: 'Transactions', icon: TransactionsIcon },
  betting: { segment: 'betting', label: 'Betting', icon: BettingIcon },
  events: { segment: 'events', label: 'Events', icon: EventsIcon },
  markets: { segment: 'markets', label: 'Markets', icon: MarketsIcon },
  risk: { segment: 'risk', label: 'Risk', icon: RiskIcon },
  commission: { segment: 'commission', label: 'Commission', icon: CommissionIcon },
  partnership: { segment: 'partnership', label: 'Partnership', icon: PartnershipIcon },
  reports: { segment: 'reports', label: 'Reports', icon: ReportsIcon },
  analytics: { segment: 'analytics', label: 'Analytics', icon: AnalyticsIcon },
  cms: { segment: 'cms', label: 'CMS', icon: CmsIcon },
  notifications: { segment: 'notifications', label: 'Notifications', icon: BellIcon },
  security: { segment: 'security', label: 'Security', icon: SecurityIcon },
  settings: { segment: 'settings', label: 'Settings', icon: SettingsIcon },
  profile: { segment: 'profile', label: 'Profile', icon: UserIcon },
  support: { segment: 'support-tickets', label: 'Support Tickets', icon: SupportIcon },
  permissions: { segment: 'permissions', label: 'Permissions', icon: ShieldCheckIcon },
} satisfies Record<string, NavItem>;

/**
 * The four panels. Order here drives the Quick Demo Login grid, the router and
 * the sidebar — there is no second list to keep in sync.
 */
export const ROLES: RoleDefinition[] = [
  {
    id: 'super-admin',
    label: 'Super Admin',
    icon: ShieldCheckIcon,
    description: 'Full platform control across every franchise, market and settlement.',
    basePath: '/super-admin',
    demo: { username: 'mithu8178', password: 'superadmin@123' },
    operator: 'Ankit Sharma',
    manages: 'franchise',
    downline: NAV.franchises,
    nav: [
      NAV.dashboard,
      NAV.users,
      NAV.franchises,
      NAV.superAgents,
      NAV.agents,
      NAV.wallet,
      NAV.transactions,
      NAV.betting,
      NAV.events,
      NAV.markets,
      NAV.risk,
      NAV.commission,
      NAV.partnership,
      NAV.reports,
      NAV.analytics,
      NAV.cms,
      NAV.notifications,
      NAV.security,
      NAV.settings,
      NAV.profile,
      NAV.support,
      NAV.permissions,
    ],
  },
  {
    id: 'franchise',
    label: 'Franchise',
    icon: BuildingIcon,
    description: 'Runs a region: onboards super agents and owns their exposure limits.',
    basePath: '/franchise',
    demo: { username: 'franchise01', password: 'franchise@123' },
    operator: 'Rakesh Kadam',
    manages: 'super-agent',
    downline: NAV.superAgents,
    nav: [
      NAV.dashboard,
      NAV.users,
      NAV.superAgents,
      NAV.agents,
      NAV.wallet,
      NAV.transactions,
      NAV.betting,
      NAV.events,
      NAV.markets,
      NAV.risk,
      NAV.commission,
      NAV.reports,
      NAV.analytics,
      NAV.notifications,
      NAV.settings,
      NAV.profile,
    ],
  },
  {
    id: 'super-agent',
    label: 'Super Agent',
    icon: UsersCogIcon,
    description: 'Manages a book of agents and their daily credit allocation.',
    basePath: '/super-agent',
    demo: { username: 'superagent01', password: 'superagent@123' },
    operator: 'Imran Sheikh',
    manages: 'agent',
    downline: NAV.agents,
    nav: [
      NAV.dashboard,
      NAV.users,
      NAV.agents,
      NAV.wallet,
      NAV.transactions,
      NAV.betting,
      NAV.events,
      NAV.markets,
      NAV.commission,
      NAV.reports,
      NAV.notifications,
      NAV.settings,
      NAV.profile,
    ],
  },
  {
    id: 'agent',
    label: 'Agent',
    icon: UserIcon,
    description: 'Front line: creates players, tops up chips and settles positions.',
    basePath: '/agent',
    demo: { username: 'agent01', password: 'agent@123' },
    operator: 'Sahil Verma',
    manages: null,
    downline: NAV.users,
    nav: [
      NAV.dashboard,
      NAV.users,
      NAV.wallet,
      NAV.transactions,
      NAV.betting,
      NAV.events,
      NAV.markets,
      NAV.reports,
      NAV.notifications,
      NAV.settings,
      NAV.profile,
    ],
  },
];

const ROLE_BY_ID = new Map(ROLES.map((role) => [role.id, role]));

export function getRole(id: RoleId): RoleDefinition {
  const role = ROLE_BY_ID.get(id);
  if (!role) throw new Error(`Unknown role: ${id}`);
  return role;
}

/** Absolute route for a nav item within its role. */
export function navPath(role: RoleDefinition, item: NavItem): string {
  return item.segment ? `${role.basePath}/${item.segment}` : role.basePath;
}
