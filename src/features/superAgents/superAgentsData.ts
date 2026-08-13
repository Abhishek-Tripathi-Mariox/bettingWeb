import { CheckCircleIcon, DollarIcon, PercentIcon, UsersCogIcon } from '../../components/icons';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';
import type { RoleDefinition, RoleId } from '../../config/roles';
import type { NetworkPerson, SuperAgent } from '../franchises/franchisesData';

export type SuperAgentRow = {
  id: string;
  code: string;
  name: string;
  franchise: string;
  city: string;
  agents: number;
  users: string;
  turnover: string;
  commission: string;
  credit: string;
  exposure: string;
  status: 'Active' | 'Suspended';
  phone: string;
  email: string;
  joined: string;
};

/** The directory from node 112:698. */
const SUPER_AGENTS: SuperAgentRow[] = [
  { id: 'sa1', code: 'SA001', name: 'Rohit Agarwal', franchise: 'Mumbai Franchise', city: 'Mumbai', agents: 8, users: '642', turnover: '₹4.2Cr', commission: '₹42.0L', credit: '₹80L', exposure: '₹18L', status: 'Active', phone: '+91 98765 11111', email: 'rohit@betmaster.com', joined: 'Jan 2023' },
  { id: 'sa2', code: 'SA002', name: 'Sunita Kapoor', franchise: 'Delhi Franchise', city: 'Delhi', agents: 6, users: '481', turnover: '₹3.1Cr', commission: '₹31.0L', credit: '₹60L', exposure: '₹12L', status: 'Active', phone: '+91 87654 22222', email: 'sunita@betmaster.com', joined: 'Mar 2023' },
  { id: 'sa3', code: 'SA003', name: 'Prakash Joshi', franchise: 'Bangalore Franchise', city: 'Bangalore', agents: 11, users: '892', turnover: '₹6.4Cr', commission: '₹64.0L', credit: '₹1.2Cr', exposure: '₹28L', status: 'Active', phone: '+91 76543 33333', email: 'prakash@betmaster.com', joined: 'Jun 2023' },
  { id: 'sa4', code: 'SA004', name: 'Divya Reddy', franchise: 'Bangalore Franchise', city: 'Bangalore', agents: 9, users: '714', turnover: '₹5.1Cr', commission: '₹51.0L', credit: '₹1.0Cr', exposure: '₹22L', status: 'Suspended', phone: '+91 65432 44444', email: 'divya@betmaster.com', joined: 'Aug 2023' },
  { id: 'sa5', code: 'SA005', name: 'Manish Tiwari', franchise: 'Mumbai Franchise', city: 'Mumbai', agents: 5, users: '324', turnover: '₹2.2Cr', commission: '₹22.0L', credit: '₹40L', exposure: '₹8L', status: 'Active', phone: '+91 54321 55555', email: 'manish@betmaster.com', joined: 'Oct 2023' },
];

/** The capability panel copy, verbatim from the design. */
export const SUPER_AGENT_CAPABILITIES = [
  'Apne sab Agents ki suchi dekh sakta hai',
  'Apne Agents ke Users ki suchi dekh sakta hai',
  'Users ka balance aur transactions dekh sakta hai',
  'Users ke liye Deposits/Withdrawals (yadi anumati ho)',
  'Apne Agents aur Users ki performance report dekh sakta hai',
  'Apna commission aur Earning report dekh sakta hai',
  'Apne Profile aur Wallet ki jankari dekh sakta hai',
  'Support Ticket bana aur dekh sakta hai',
] as const;

/** Lower roles only see their own slice of the directory. */
const VISIBLE: Record<RoleId, number> = {
  'super-admin': 5,
  franchise: 3,
  'super-agent': 1,
  agent: 1,
};

const AGENT_BOOK: NetworkPerson[] = [
  {
    id: 'A001',
    code: 'A001',
    name: 'Deepak Kumar',
    meta: 'A001',
    status: 'Active',
    accent: 'var(--color-success)',
    stats: [
      { label: 'Users', value: '84', color: 'var(--color-text)' },
      { label: 'Turnover', value: '₹48.4L', color: 'var(--color-warning)' },
    ],
  },
  {
    id: 'A004',
    code: 'A004',
    name: 'Nisha Gupta',
    meta: 'A004',
    status: 'Suspended',
    accent: 'var(--color-primary-light)',
    stats: [
      { label: 'Users', value: '48', color: 'var(--color-text)' },
      { label: 'Turnover', value: '₹24.6L', color: 'var(--color-warning)' },
    ],
  },
];

const USER_BOOK: NetworkPerson[] = [
  {
    id: 'U003',
    code: 'U003',
    name: 'Rahul Verma',
    meta: 'U003 · Deepak Kumar',
    status: 'Suspended',
    accent: 'var(--color-danger)',
    stats: [
      { label: 'Balance', value: '₹12,400', color: 'var(--color-success)' },
      { label: 'Bets', value: '62', color: 'var(--color-text)' },
    ],
  },
  {
    id: 'U004',
    code: 'U004',
    name: 'Sneha Gupta',
    meta: 'U004 · Deepak Kumar',
    status: 'Active',
    accent: 'var(--color-primary-light)',
    stats: [
      { label: 'Balance', value: '₹5,81,200', color: 'var(--color-success)' },
      { label: 'Bets', value: '412', color: 'var(--color-text)' },
    ],
  },
  {
    id: 'U006',
    code: 'U006',
    name: 'Kavitha Nair',
    meta: 'U006 · Nisha Gupta',
    status: 'Active',
    accent: 'var(--color-success)',
    stats: [
      { label: 'Balance', value: '₹1,12,600', color: 'var(--color-success)' },
      { label: 'Bets', value: '176', color: 'var(--color-text)' },
    ],
  },
  {
    id: 'U007',
    code: 'U007',
    name: 'Vikram Singh',
    meta: 'U007 · Nisha Gupta',
    status: 'Suspended',
    accent: 'var(--color-warning)',
    stats: [
      { label: 'Balance', value: '₹7,900', color: 'var(--color-success)' },
      { label: 'Bets', value: '51', color: 'var(--color-text)' },
    ],
  },
];

/** Adapts a directory row to the shared super agent record sheet. */
export function toSuperAgentRecord(row: SuperAgentRow): SuperAgent {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    meta: row.phone,
    status: row.status,
    accent: 'var(--color-primary)',
    stats: [
      { label: 'Agents', value: String(row.agents), color: 'var(--color-primary-light)' },
      { label: 'Users', value: row.users, color: 'var(--color-success)' },
      { label: 'Turnover', value: row.turnover, color: 'var(--color-warning)' },
    ],
    franchiseName: row.franchise,
    tier: 'Regional',
    phone: row.phone,
    email: row.email,
    joined: row.joined,
    metrics: [
      { label: 'Total Agents', value: String(AGENT_BOOK.length), color: 'var(--color-primary-light)' },
      { label: 'Total Users', value: String(USER_BOOK.length), color: 'var(--color-success)' },
      { label: 'Turnover', value: row.turnover, color: 'var(--color-warning)' },
      { label: 'Commission', value: row.commission, color: 'var(--color-success)' },
      { label: 'Credit Limit', value: row.credit, color: 'var(--color-primary-light)' },
      { label: 'Exposure', value: row.exposure, color: 'var(--color-live)' },
    ],
    agents: AGENT_BOOK,
    users: USER_BOOK,
    performance: [
      { label: 'This Month Turnover', value: row.turnover, color: 'var(--color-warning)', delta: '+16%' },
      { label: 'Commission Earned', value: row.commission, color: 'var(--color-success)', delta: '+12%' },
      { label: 'Active Bets', value: '284', color: 'var(--color-primary-light)', delta: '+8%' },
      { label: 'Win Rate', value: '54.2%', color: 'var(--color-primary)', delta: '+2.1%' },
    ],
  };
}

export function getSuperAgentView(role: RoleDefinition) {
  const rows = SUPER_AGENTS.slice(0, VISIBLE[role.id]);

  const stats: StatCardProps[] = [
    { label: 'Total Super Agents', value: '84', caption: 'Across all franchises', icon: UsersCogIcon, accent: 'blue' },
    { label: 'Active', value: '78', caption: 'Operational', delta: '+3 this month vs yesterday', tone: 'up', icon: CheckCircleIcon, accent: 'green' },
    { label: 'Total Turnover', value: '₹21.0Cr', caption: 'This month', delta: '+16.2% vs yesterday', tone: 'up', icon: DollarIcon, accent: 'yellow' },
    { label: 'Commission Paid', value: '₹2.10Cr', caption: 'This month', icon: PercentIcon, accent: 'cyan' },
  ];

  return { rows, stats, highlights: rows.slice(0, 3) };
}

export const FRANCHISE_OPTIONS = [
  'Mumbai Franchise',
  'Delhi Franchise',
  'Bangalore Franchise',
  'Chennai Franchise',
] as const;
