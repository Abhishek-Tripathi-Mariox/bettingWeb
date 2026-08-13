import {
  AnalyticsIcon,
  CheckCircleIcon,
  PercentIcon,
  PulseIcon,
  TrendUpIcon,
  UserIcon,
  UsersIcon,
  WalletIcon,
} from '../../components/icons';
import type { IconProps } from '../../components/icons';
import type { BadgeTone } from '../../components/ui/Badge/Badge';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';
import type { RoleDefinition, RoleId } from '../../config/roles';
import type { ComponentType } from 'react';

export type AgentStatus = 'Active' | 'Suspended' | 'Inactive';

export type AgentRow = {
  id: string;
  code: string;
  name: string;
  users: number;
  turnover: string;
  commission: string;
  wallet: string;
  joined: string;
  status: AgentStatus;
  phone: string;
  email: string;
  superAgentCode: string;
};

/** The directory from node 112:1579. */
const AGENTS: AgentRow[] = [
  { id: 'a1', code: 'A001', name: 'Deepak Kumar', users: 84, turnover: '₹48.4L', commission: '₹3.39L', wallet: '₹12,400', joined: '12 Jan 2024', status: 'Active', phone: '+91 98111 11111', email: 'deepak@betmaster.com', superAgentCode: 'SA001' },
  { id: 'a2', code: 'A002', name: 'Pooja Sharma', users: 62, turnover: '₹34.2L', commission: '₹2.39L', wallet: '₹8,200', joined: '18 Feb 2024', status: 'Active', phone: '+91 98111 22222', email: 'pooja@betmaster.com', superAgentCode: 'SA002' },
  { id: 'a3', code: 'A003', name: 'Karan Mehta', users: 124, turnover: '₹72.8L', commission: '₹5.10L', wallet: '₹24,800', joined: '5 Mar 2024', status: 'Active', phone: '+91 98111 33333', email: 'karan@betmaster.com', superAgentCode: 'SA003' },
  { id: 'a4', code: 'A004', name: 'Nisha Gupta', users: 48, turnover: '₹24.6L', commission: '₹1.72L', wallet: '₹6,400', joined: '22 Mar 2024', status: 'Suspended', phone: '+91 98111 44444', email: 'nisha@betmaster.com', superAgentCode: 'SA001' },
  { id: 'a5', code: 'A005', name: 'Arun Patel', users: 96, turnover: '₹58.4L', commission: '₹4.09L', wallet: '₹18,600', joined: '8 Apr 2024', status: 'Active', phone: '+91 98111 55555', email: 'arun@betmaster.com', superAgentCode: 'SA002' },
  { id: 'a6', code: 'A006', name: 'Ritu Singh', users: 72, turnover: '₹42.1L', commission: '₹2.95L', wallet: '₹9,800', joined: '14 May 2024', status: 'Active', phone: '+91 98111 66666', email: 'ritu@betmaster.com', superAgentCode: 'SA003' },
  { id: 'a7', code: 'A007', name: 'Suresh Nair', users: 38, turnover: '₹18.9L', commission: '₹1.32L', wallet: '₹4,200', joined: '2 Jun 2024', status: 'Inactive', phone: '+91 98111 77777', email: 'suresh@betmaster.com', superAgentCode: 'SA001' },
];

export const AGENT_STATUS_TONE: Record<AgentStatus, BadgeTone> = {
  Active: 'success',
  Suspended: 'danger',
  Inactive: 'warning',
};

/* --------------------------- drawer records --------------------------- */

export type AgentUser = {
  id: string;
  name: string;
  meta: string;
  status: AgentStatus;
};

export type AgentTransaction = {
  id: string;
  type: string;
  person: string;
  meta: string;
  amount: string;
  positive: boolean;
  status: { label: string; tone: BadgeTone };
};

export type AgentReport = {
  title: string;
  description: string;
  icon: ComponentType<IconProps>;
  /** rgb triplet for the tile tint. */
  rgb: string;
};

export type AgentEvent = {
  id: string;
  title: string;
  detail: string;
  when: string;
  rgb: string;
};

const USERS: AgentUser[] = [
  { id: 'U1001', name: 'Arjun Sharma', meta: 'U1001 · ₹2,45,800 · 248 bets', status: 'Active' },
  { id: 'U1002', name: 'Priya Patel', meta: 'U1002 · ₹89,200 · 124 bets', status: 'Active' },
  { id: 'U1003', name: 'Rahul Verma', meta: 'U1003 · ₹12,400 · 62 bets', status: 'Suspended' },
  { id: 'U1004', name: 'Sneha Kapoor', meta: 'U1004 · ₹1,84,200 · 189 bets', status: 'Active' },
  { id: 'U1005', name: 'Vikram Singh', meta: 'U1005 · ₹62,800 · 91 bets', status: 'Active' },
];

const TRANSACTIONS: AgentTransaction[] = [
  { id: 'TXN4001', type: 'Deposit', person: 'Arjun Sharma', meta: 'TXN4001 · UPI · 21 Jul 10:42', amount: '+₹50,000', positive: true, status: { label: 'Success', tone: 'success' } },
  { id: 'TXN4002', type: 'Withdrawal', person: 'Priya Patel', meta: 'TXN4002 · Bank · 21 Jul 09:18', amount: '-₹25,000', positive: false, status: { label: 'Pending', tone: 'warning' } },
  { id: 'TXN4003', type: 'Deposit', person: 'Sneha Kapoor', meta: 'TXN4003 · NEFT · 20 Jul 15:24', amount: '+₹1,00,000', positive: true, status: { label: 'Success', tone: 'success' } },
  { id: 'TXN4004', type: 'Bet Win', person: 'Rahul Verma', meta: 'TXN4004 · Wallet · 20 Jul 12:31', amount: '+₹12,400', positive: true, status: { label: 'Success', tone: 'success' } },
  { id: 'TXN4005', type: 'Deposit', person: 'Vikram Singh', meta: 'TXN4005 · UPI · 19 Jul 18:10', amount: '+₹75,000', positive: true, status: { label: 'Success', tone: 'success' } },
];

const REPORTS: AgentReport[] = [
  { title: 'Revenue Report', description: 'Monthly revenue breakdown', icon: TrendUpIcon, rgb: '34, 197, 94' },
  { title: 'Commission Report', description: 'Commission earned history', icon: PercentIcon, rgb: '33, 150, 243' },
  { title: 'Performance Report', description: 'Agent KPIs & metrics', icon: AnalyticsIcon, rgb: '41, 182, 246' },
  { title: 'User Report', description: 'All users under this agent', icon: UsersIcon, rgb: '250, 204, 21' },
  { title: 'Betting Report', description: 'Bets placed by team users', icon: PulseIcon, rgb: '239, 68, 68' },
  { title: 'Wallet Report', description: 'Deposit & withdrawal history', icon: WalletIcon, rgb: '168, 85, 247' },
];

const ACTIVITY: AgentEvent[] = [
  { id: 'e1', title: 'New User Registered', detail: 'Vikram Singh joined under this agent', when: '30 min ago', rgb: '34, 197, 94' },
  { id: 'e2', title: 'Deposit Approved', detail: '₹1,00,000 for Sneha Kapoor via NEFT', when: '2 hours ago', rgb: '33, 150, 243' },
  { id: 'e3', title: 'Withdrawal Processed', detail: '₹25,000 for Priya Patel to Bank', when: '3 hours ago', rgb: '250, 204, 21' },
  { id: 'e4', title: 'Bet Settled', detail: 'India vs Australia — 18 bets settled', when: 'Yesterday 6:30 PM', rgb: '41, 182, 246' },
  { id: 'e5', title: 'User Suspended', detail: 'Rahul Verma suspended for suspicious activity', when: 'Yesterday 2:10 PM', rgb: '239, 68, 68' },
  { id: 'e6', title: 'Commission Credited', detail: '₹48,200 commission credited to Deepak Kumar', when: '2 days ago', rgb: '34, 197, 94' },
  { id: 'e7', title: 'Profile Updated', detail: 'Agent contact details updated', when: '3 days ago', rgb: '184, 194, 204' },
  { id: 'e8', title: 'Report Generated', detail: 'Monthly performance report created', when: '5 days ago', rgb: '41, 182, 246' },
];

export function getAgentUsers(): AgentUser[] {
  return USERS;
}

export function getAgentWallet(agent: AgentRow) {
  return {
    balance: agent.wallet,
    tiles: [
      { label: 'Total Deposited', value: '₹1.24Cr', color: 'var(--color-success)' },
      { label: 'Total Withdrawn', value: '₹84.6L', color: 'var(--color-danger)' },
      { label: 'Commission Earned', value: agent.commission, color: 'var(--color-success)' },
      { label: 'Pending Settlement', value: '₹4,200', color: 'var(--color-primary-light)' },
    ],
  };
}

export function getAgentTransactions(): AgentTransaction[] {
  return TRANSACTIONS;
}

export function getAgentReports(): AgentReport[] {
  return REPORTS;
}

export function getAgentActivity(): AgentEvent[] {
  return ACTIVITY;
}

/** The super agent this agent reports to — shown on the overview tab. */
export function getAssignedSuperAgent(agent: AgentRow) {
  const owners: Record<string, { name: string; franchise: string; since: string }> = {
    SA001: { name: 'Rohit Agarwal', franchise: 'Mumbai Franchise', since: 'Since Jan 2023' },
    SA002: { name: 'Sunita Kapoor', franchise: 'Delhi Franchise', since: 'Since Mar 2023' },
    SA003: { name: 'Prakash Joshi', franchise: 'Bangalore Franchise', since: 'Since Jun 2023' },
  };
  const owner = owners[agent.superAgentCode] ?? owners.SA001;
  return { code: agent.superAgentCode, ...owner };
}

/** Lower roles see only their own book. */
const VISIBLE: Record<RoleId, number> = {
  'super-admin': 7,
  franchise: 5,
  'super-agent': 3,
  agent: 1,
};

export function getAgentView(role: RoleDefinition) {
  const rows = AGENTS.slice(0, VISIBLE[role.id]);

  const stats: StatCardProps[] = [
    { label: 'Total Agents', value: '284', caption: 'Active network', icon: UserIcon, accent: 'blue' },
    { label: 'Active Agents', value: '248', delta: '+12 this month vs yesterday', tone: 'up', icon: CheckCircleIcon, accent: 'green' },
    { label: 'Total Users', value: '18,421', caption: 'Under agents', icon: UsersIcon, accent: 'cyan' },
    { label: 'Agent Commission', value: '₹1.48Cr', caption: 'This month', delta: '+11.2% vs yesterday', tone: 'up', icon: PercentIcon, accent: 'yellow' },
  ];

  return { rows, stats, total: 284 };
}

export const SUPER_AGENT_OPTIONS = [
  'Rohit Agarwal (SA001)',
  'Sunita Kapoor (SA002)',
  'Prakash Joshi (SA003)',
] as const;
