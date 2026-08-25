export type RoleKey = 'superAgent' | 'agent' | 'franchise';

export type Role = {
  key: RoleKey;
  emoji: string;
  name: string;
  description: string;
  /** rgb triplet driving the card border, the meter and the group headers. */
  rgb: string;
};

/**
 * Per-role grant, written as a compact code: 'E' master enable, 'V' view,
 * 'X' edit. An empty string means the permission is off for that role, which
 * dims its whole row.
 */
export type Grant = string;

export type Permission = {
  name: string;
  description: string;
  grants: Record<RoleKey, Grant>;
};

export type PermissionGroup = {
  emoji: string;
  name: string;
  permissions: Permission[];
};

export const ROLES: Role[] = [
  { key: 'superAgent', emoji: '👑', name: 'Super Agent', description: 'Manages multiple agents and their users', rgb: '250, 204, 21' },
  { key: 'agent', emoji: '🧑‍💼', name: 'Agent', description: 'Manages users and betting activities', rgb: '41, 182, 246' },
  { key: 'franchise', emoji: '🏢', name: 'Franchise', description: 'Regional franchise owner with limited access', rgb: '34, 197, 94' },
];

export const LEGEND = [
  { term: 'Enable / Disable:', description: 'Master toggle — turn feature on or off for this role', rgb: '33, 150, 243' },
  { term: 'View:', description: 'Can see data but not make changes', rgb: '41, 182, 246' },
  { term: 'Edit:', description: 'Can modify data and take actions', rgb: '34, 197, 94' },
];

/**
 * The matrix from node 112:12758. Super Agent's grants are exactly as drawn;
 * the design states Agent at 14/24 and Franchise at 9/24 without showing their
 * rows, so those two are filled to match those totals.
 */
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    emoji: '💰',
    name: 'Finance & Wallet',
    permissions: [
      { name: 'Wallet Balance', description: 'View & manage wallet balance', grants: { superAgent: 'EVX', agent: 'EV', franchise: 'EV' } },
      { name: 'Deposit', description: 'Initiate deposit requests', grants: { superAgent: 'EVX', agent: 'EVX', franchise: '' } },
      { name: 'Withdrawal', description: 'Initiate withdrawal requests', grants: { superAgent: 'EVX', agent: 'EVX', franchise: '' } },
      { name: 'Fund Transfer', description: 'Transfer funds to sub-accounts', grants: { superAgent: 'EVX', agent: '', franchise: '' } },
      { name: 'Commission', description: 'View commission earnings', grants: { superAgent: 'EV', agent: '', franchise: 'EV' } },
    ],
  },
  {
    emoji: '👥',
    name: 'User Management',
    permissions: [
      { name: 'User List', description: 'View list of all users', grants: { superAgent: 'EV', agent: 'EV', franchise: 'EV' } },
      { name: 'Create User', description: 'Add new users to the platform', grants: { superAgent: 'EVX', agent: 'EVX', franchise: '' } },
      { name: 'Edit User', description: 'Modify user profile & details', grants: { superAgent: 'EVX', agent: '', franchise: '' } },
      { name: 'Suspend User', description: 'Suspend or activate user accounts', grants: { superAgent: '', agent: '', franchise: '' } },
      { name: 'KYC Details', description: 'View user KYC documents', grants: { superAgent: 'EV', agent: '', franchise: '' } },
    ],
  },
  {
    emoji: '🎯',
    name: 'Betting & Markets',
    permissions: [
      { name: 'View Bets', description: 'View betting history & records', grants: { superAgent: 'EV', agent: 'EV', franchise: 'EV' } },
      { name: 'Markets', description: 'View active markets & odds', grants: { superAgent: 'EV', agent: 'EV', franchise: 'EV' } },
      { name: 'Events', description: 'View upcoming & live events', grants: { superAgent: 'EV', agent: 'EV', franchise: '' } },
      { name: 'Void Bet', description: 'Cancel or void placed bets', grants: { superAgent: '', agent: '', franchise: '' } },
    ],
  },
  {
    emoji: '📊',
    name: 'Reports & Analytics',
    permissions: [
      { name: 'Reports', description: 'View financial & activity reports', grants: { superAgent: 'EV', agent: 'EV', franchise: 'EV' } },
      { name: 'Analytics', description: 'View analytics dashboard', grants: { superAgent: 'EV', agent: 'EV', franchise: '' } },
      { name: 'Export Data', description: 'Export reports as CSV / PDF', grants: { superAgent: 'EVX', agent: '', franchise: '' } },
    ],
  },
  {
    emoji: '⚙️',
    name: 'Account & Settings',
    permissions: [
      { name: 'Edit Profile', description: 'Update own profile details', grants: { superAgent: 'EVX', agent: 'EVX', franchise: 'EVX' } },
      { name: 'Change Password', description: 'Change account password', grants: { superAgent: 'EVX', agent: 'EVX', franchise: 'EVX' } },
      { name: 'Manage Sub-Agents', description: 'Create & manage sub-agents', grants: { superAgent: 'EVX', agent: '', franchise: '' } },
      { name: 'Commission Settings', description: 'Configure commission rates', grants: { superAgent: 'EV', agent: '', franchise: '' } },
    ],
  },
  {
    emoji: '🎧',
    name: 'Support',
    permissions: [
      { name: 'Contact Support', description: 'Access support channels', grants: { superAgent: 'EV', agent: 'EV', franchise: 'EV' } },
      { name: 'Raise Ticket', description: 'Submit support tickets', grants: { superAgent: 'EVX', agent: 'EVX', franchise: '' } },
      { name: 'View Tickets', description: 'View own ticket history', grants: { superAgent: 'EV', agent: '', franchise: '' } },
    ],
  },
];

export const TOTAL_PERMISSIONS = PERMISSION_GROUPS.reduce(
  (sum, group) => sum + group.permissions.length,
  0,
);

export function countEnabled(role: RoleKey): number {
  return PERMISSION_GROUPS.reduce(
    (sum, group) =>
      sum + group.permissions.filter((permission) => permission.grants[role].includes('E')).length,
    0,
  );
}
