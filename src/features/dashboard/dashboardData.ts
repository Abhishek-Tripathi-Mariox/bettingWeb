import {
  ActivityIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BriefcaseIcon,
  CpuIcon,
  DatabaseIcon,
  DollarIcon,
  PercentIcon,
  ServerIcon,
  ShieldCheckIcon,
  UsersIcon,
  WifiIcon,
} from '../../components/icons';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';
import type { BadgeTone } from '../../components/ui/Badge/Badge';
import type { ChartPoint } from '../../components/charts/AreaChart';
import type { BarGroup } from '../../components/charts/BarChart';
import type { DonutSlice } from '../../components/charts/DonutChart';
import type { RoleId } from '../../config/roles';
import { formatCount, formatMoney } from '../../lib/format';

export type LiveMatch = {
  id: string;
  sport: string;
  title: string;
  meta: string;
  exposure: string;
  odds: string;
};

export type RiskAlert = {
  id: string;
  emoji: string;
  message: string;
  age: string;
  tone: 'danger' | 'warning' | 'info';
};

export type HealthMetric = {
  label: string;
  value: string;
  icon: typeof ServerIcon;
};

export type TransactionRow = {
  id: string;
  user: string;
  type: string;
  amount: string;
  positive: boolean;
  method: string;
  time: string;
  status: { label: string; tone: BadgeTone };
};

export type BetRow = {
  id: string;
  user: string;
  event: string;
  selection: string;
  odds: string;
  stake: string;
  status: { label: string; tone: BadgeTone };
};

export type ActivityEntry = { id: string; emoji: string; message: string; age: string };

/**
 * Each panel sees the slice of the platform it owns, so the Figma figures
 * (Super Admin) are scaled down the hierarchy rather than duplicated.
 */
const SHARE: Record<RoleId, number> = {
  'super-admin': 1,
  franchise: 0.16,
  'super-agent': 0.045,
  agent: 0.012,
};

const COMMISSION_SPLIT: Record<RoleId, { label: string; percent: number; color: string }[]> = {
  'super-admin': [
    { label: 'Franchise', percent: 42, color: 'var(--color-primary)' },
    { label: 'Super Agent', percent: 28, color: 'var(--color-primary-light)' },
    { label: 'Agent', percent: 20, color: 'var(--color-success)' },
    { label: 'Platform', percent: 10, color: 'var(--color-warning)' },
  ],
  franchise: [
    { label: 'Super Agent', percent: 46, color: 'var(--color-primary)' },
    { label: 'Agent', percent: 32, color: 'var(--color-primary-light)' },
    { label: 'Franchise', percent: 22, color: 'var(--color-success)' },
  ],
  'super-agent': [
    { label: 'Agent', percent: 58, color: 'var(--color-primary)' },
    { label: 'Super Agent', percent: 42, color: 'var(--color-primary-light)' },
  ],
  agent: [
    { label: 'Player payouts', percent: 74, color: 'var(--color-primary)' },
    { label: 'Agent share', percent: 26, color: 'var(--color-success)' },
  ],
};

const REVENUE_SHAPE = [3.4, 3.9, 3.6, 4.6, 5.1, 4.8, 6.2];
const REVENUE_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const WALLET_SHAPE: [number, number][] = [
  [0.85, 0.62],
  [0.95, 0.74],
  [0.76, 0.58],
  [1.06, 0.79],
  [1.28, 0.94],
  [1.62, 1.22],
  [1.84, 1.4],
];
const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SPORTS: DonutSlice[] = [
  { label: 'Cricket', value: 38, color: 'var(--color-primary)' },
  { label: 'Football', value: 28, color: 'var(--color-primary-light)' },
  { label: 'Tennis', value: 18, color: 'var(--color-success)' },
  { label: 'Basketball', value: 10, color: 'var(--color-warning)' },
  { label: 'Other', value: 6, color: 'var(--color-text-muted)' },
];

const LIVE_MATCHES: LiveMatch[] = [
  { id: 'm1', sport: '🏏', title: 'India vs Australia', meta: 'Test Match · Day 3 · 1,842 bets', exposure: '₹12.4L', odds: '1.85 / 3.20' },
  { id: 'm2', sport: '🏏', title: 'Mumbai vs Chennai', meta: 'IPL 2024 · Match 48 · 3,241 bets', exposure: '₹18.7L', odds: '1.90 / 1.95' },
  { id: 'm3', sport: '🏏', title: 'Delhi vs Rajasthan', meta: 'IPL 2024 · Match 49 · 2,124 bets', exposure: '₹9.1L', odds: '1.72 / 2.18' },
  { id: 'm4', sport: '🏏', title: 'England vs New Zealand', meta: 'ODI Series · Match 2 · 1,412 bets', exposure: '₹6.3L', odds: '1.68 / 2.28' },
];

const RISK_ALERTS: RiskAlert[] = [
  { id: 'r1', emoji: '🚨', message: 'High exposure detected on India vs Australia — ₹18.7L', age: '2 min ago', tone: 'danger' },
  { id: 'r2', emoji: '⚠️', message: 'User Vikram Singh placed 12 bets in 30 minutes', age: '8 min ago', tone: 'warning' },
  { id: 'r3', emoji: '💰', message: 'New withdrawal request ₹2,50,000 from Agent #A042', age: '15 min ago', tone: 'info' },
  { id: 'r4', emoji: '🔐', message: 'Failed login attempts from IP 192.168.1.104 (5 times)', age: '22 min ago', tone: 'warning' },
];

const HEALTH: HealthMetric[] = [
  { label: 'API Server', value: '99.9%', icon: ServerIcon },
  { label: 'Database', value: '24ms', icon: DatabaseIcon },
  { label: 'Betting API', value: '12ms', icon: WifiIcon },
  { label: 'CPU Load', value: '38%', icon: CpuIcon },
];

const TRANSACTIONS: TransactionRow[] = [
  { id: 'TXN8842', user: 'Arjun Sharma', type: 'Deposit', amount: '+₹50,000', positive: true, method: 'UPI', time: '2 min ago', status: { label: 'Success', tone: 'success' } },
  { id: 'TXN8841', user: 'Priya Patel', type: 'Withdrawal', amount: '-₹25,000', positive: false, method: 'Bank', time: '5 min ago', status: { label: 'Pending', tone: 'warning' } },
  { id: 'TXN8840', user: 'Rahul Verma', type: 'Bet Win', amount: '+₹12,400', positive: true, method: 'Wallet', time: '8 min ago', status: { label: 'Success', tone: 'success' } },
  { id: 'TXN8839', user: 'Sneha Gupta', type: 'Deposit', amount: '+₹1,00,000', positive: true, method: 'NEFT', time: '12 min ago', status: { label: 'Success', tone: 'success' } },
  { id: 'TXN8838', user: 'Amit Kumar', type: 'Withdrawal', amount: '-₹8,000', positive: false, method: 'UPI', time: '18 min ago', status: { label: 'Failed', tone: 'danger' } },
];

const BETS: BetRow[] = [
  { id: 'b1', user: 'Arjun S.', event: 'India vs AUS', selection: 'India', odds: '1.85', stake: '₹10K', status: { label: 'Open', tone: 'info' } },
  { id: 'b2', user: 'Vikram S.', event: 'MI vs CSK', selection: 'Mumbai', odds: '1.90', stake: '₹25K', status: { label: 'Open', tone: 'info' } },
  { id: 'b3', user: 'Sneha G.', event: 'MCI vs ARS', selection: 'Over 2.5', odds: '1.75', stake: '₹8K', status: { label: 'Open', tone: 'info' } },
  { id: 'b4', user: 'Kavitha N.', event: 'Wimbledon SF', selection: 'Djokovic', odds: '1.65', stake: '₹15K', status: { label: 'Settled', tone: 'info' } },
  { id: 'b5', user: 'Deepak K.', event: 'MI vs CSK', selection: 'CSK', odds: '2.10', stake: '₹5K', status: { label: 'Open', tone: 'info' } },
];

const ACTIVITY: ActivityEntry[] = [
  { id: 'a1', emoji: '💰', message: 'Arjun Sharma deposited ₹50,000', age: '2m ago' },
  { id: 'a2', emoji: '🎰', message: 'New bet ₹25K on MI vs CSK', age: '4m ago' },
  { id: 'a3', emoji: '🚨', message: 'Exposure warning: MI vs CSK', age: '6m ago' },
  { id: 'a4', emoji: '👤', message: 'New user registered: Rohan Mehta', age: '9m ago' },
  { id: 'a5', emoji: '💸', message: 'Withdrawal ₹25,000 approved', age: '12m ago' },
  { id: 'a6', emoji: '✅', message: 'KYC verified: Kavitha Nair', age: '18m ago' },
  { id: 'a7', emoji: '🔐', message: 'Failed login: IP 192.168.1.104', age: '24m ago' },
];

export function getDashboard(roleId: RoleId) {
  const share = SHARE[roleId];
  const count = (value: number) => formatCount(Math.max(1, value * share));
  const money = (value: number) => formatMoney(value * share);

  const stats: StatCardProps[] = [
    { label: 'Total Users', value: count(24841), caption: `${count(2381)} active today`, delta: '+12.4% vs yesterday', tone: 'up', icon: UsersIcon, accent: 'blue', tinted: true },
    { label: "Today's Bets", value: count(38420), caption: `${money(42000000)} stake`, delta: '+8.6% vs yesterday', tone: 'up', icon: ActivityIcon, accent: 'cyan' },
    { label: "Today's Revenue", value: money(1840000), caption: 'Gross profit', delta: '+14.2% vs yesterday', tone: 'up', icon: DollarIcon, accent: 'green', tinted: true },
    { label: 'Platform Balance', value: money(248000000), caption: 'Net position', delta: '+3.1% vs yesterday', tone: 'up', icon: BriefcaseIcon, accent: 'yellow' },
    { label: 'Pending Deposits', value: money(4260000), caption: `${count(184)} requests`, icon: ArrowUpIcon, accent: 'green' },
    { label: 'Pending Withdrawals', value: money(2840000), caption: `${count(96)} requests`, icon: ArrowDownIcon, accent: 'red' },
    { label: 'Net Exposure', value: money(8420000), caption: 'Across 24 markets', delta: '-5.8% vs yesterday', tone: 'down', icon: ShieldCheckIcon, accent: 'red' },
    { label: 'Commission Today', value: money(384200), caption: 'Across all agents', delta: '+9.2% vs yesterday', tone: 'up', icon: PercentIcon, accent: 'yellow', tinted: true },
  ];

  const revenue: ChartPoint[] = REVENUE_MONTHS.map((label, index) => ({
    label,
    value: REVENUE_SHAPE[index] * 1_000_000 * share,
  }));

  const walletFlow: BarGroup[] = WEEK.map((label, index) => ({
    label,
    values: WALLET_SHAPE[index].map((value) => value * 1_000_000 * share),
  }));

  return {
    stats,
    revenue,
    sports: SPORTS,
    walletFlow,
    commission: COMMISSION_SPLIT[roleId],
    commissionTotal: money(384200),
    liveMatches: LIVE_MATCHES,
    riskAlerts: RISK_ALERTS,
    health: HEALTH,
    transactions: TRANSACTIONS,
    bets: BETS,
    activity: ACTIVITY,
  };
}
