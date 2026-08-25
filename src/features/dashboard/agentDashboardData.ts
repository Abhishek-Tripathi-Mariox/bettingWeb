import {
  ArrowDownIcon,
  ArrowUpIcon,
  BettingIcon,
  CheckCircleIcon,
  CommissionIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from '../../components/icons';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';
import type { BadgeTone } from '../../components/ui/Badge/Badge';

export type OverviewTile = { label: string; value: string; share: string; color: string };

export type AgentActivity = { description: string; time: string };

export type AgentTransaction = {
  user: string;
  /** "Deposit · UPI · 12m ago" — kind, method and recency on one line. */
  meta: string;
  amount: string;
  direction: 'in' | 'out';
  status: 'Success' | 'Pending';
};

/** Agent dashboard — node 139:114739. Its own screen, not the platform one. */
export const AGENT_STATS: StatCardProps[] = [
  { label: 'My Total Users', value: '84', caption: 'Under my panel', icon: UsersIcon, accent: 'blue' },
  {
    label: 'Active Users',
    value: '72',
    caption: 'Placed bets today',
    delta: '+4 today vs yesterday',
    tone: 'up',
    icon: CheckCircleIcon,
    accent: 'green',
  },
  { label: 'My Wallet Balance', value: '₹12,400', caption: 'Available balance', icon: WalletIcon, accent: 'cyan' },
  {
    label: "Today's Bets",
    value: '342',
    caption: '₹4.8L total stake',
    delta: '+48 this hour vs yesterday',
    tone: 'up',
    icon: BettingIcon,
    accent: 'yellow',
  },
  {
    label: "Today's Commission",
    value: '₹4,840',
    caption: '7% of turnover',
    delta: '+₹480 vs yesterday',
    tone: 'up',
    icon: CommissionIcon,
    accent: 'green',
  },
  { label: "Today's Revenue", value: '₹48,400', caption: 'Net after payouts', icon: TrendingUpIcon, accent: 'blue' },
  { label: 'Pending Deposits', value: '3', caption: '₹1.25L total', icon: ArrowDownIcon, accent: 'yellow' },
  { label: 'Pending Withdrawals', value: '2', caption: '₹36,000 total', icon: ArrowUpIcon, accent: 'red' },
];

export const AGENT_OVERVIEW: OverviewTile[] = [
  { label: 'Total Users', value: '84', share: '100%', color: 'var(--color-primary)' },
  { label: 'Active Today', value: '72', share: '85.7%', color: 'var(--color-success)' },
  { label: 'KYC Verified', value: '68', share: '81%', color: 'var(--color-primary-light)' },
  { label: 'KYC Pending', value: '6', share: '7.1%', color: 'var(--color-warning)' },
  { label: 'Suspended', value: '4', share: '4.8%', color: 'var(--color-danger)' },
  { label: 'New This Month', value: '8', share: '+10.5%', color: '#8b5cf6' },
];

/**
 * Bar heights read off node 139:115210–115228 against the 0–₹8k axis. Sunday
 * lands on ₹4,840, which is exactly the "Today's Commission" figure above.
 */
export const AGENT_COMMISSION_WEEK = [
  { label: 'Mon', values: [3200] },
  { label: 'Tue', values: [4800] },
  { label: 'Wed', values: [3900] },
  { label: 'Thu', values: [5200] },
  { label: 'Fri', values: [4100] },
  { label: 'Sat', values: [6800] },
  { label: 'Sun', values: [4840] },
];

export const AGENT_ACTIVITY: AgentActivity[] = [
  { description: 'Vikram Singh placed a bet of ₹15,000', time: '5m ago' },
  { description: 'Arjun Sharma deposit ₹50,000 — Pending', time: '12m ago' },
  { description: 'Priya Patel withdrawal ₹25,000 — Approved', time: '28m ago' },
  { description: 'Sneha Kapoor KYC verified successfully', time: '1h ago' },
  { description: 'Rahul Verma account suspended', time: '2h ago' },
];

export const AGENT_TRANSACTIONS: AgentTransaction[] = [
  { user: 'Arjun Sharma', meta: 'Deposit · UPI · 12m ago', amount: '+₹50,000', direction: 'in', status: 'Pending' },
  { user: 'Priya Patel', meta: 'Withdrawal · Bank · 28m ago', amount: '-₹25,000', direction: 'out', status: 'Success' },
  { user: 'Vikram Singh', meta: 'Deposit · NEFT · 1h ago', amount: '+₹75,000', direction: 'in', status: 'Success' },
  { user: 'Sneha Kapoor', meta: 'Bet Win · Wallet · 2h ago', amount: '+₹12,400', direction: 'in', status: 'Success' },
];

export const AGENT_TXN_TONE: Record<AgentTransaction['status'], BadgeTone> = {
  Success: 'success',
  Pending: 'warning',
};
