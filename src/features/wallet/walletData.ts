import {
  ArrowDownIcon,
  ArrowUpIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  PercentIcon,
  TransactionsIcon,
} from '../../components/icons';
import type { BadgeTone } from '../../components/ui/Badge/Badge';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';

export type WalletRequest = {
  id: string;
  user: string;
  amount: string;
  method: string;
  reference: string;
  time: string;
  status: { label: string; tone: BadgeTone };
  kind: 'deposit' | 'withdrawal';
};

export type PartnerBucket = {
  emoji: string;
  label: string;
  active: string;
  due: string;
  color: string;
  /** rgb triplet for the card border tint. */
  rgb: string;
};

export type Disbursement = {
  id: string;
  name: string;
  meta: string;
  amount: string;
  accent: string;
};

export type PaymentRow = {
  id: string;
  recipient: string;
  recipientCode: string;
  type: { label: string; tone: BadgeTone };
  paymentType: { label: string; tone: BadgeTone };
  amount: string;
  method: string;
  date: string;
  status: { label: string; tone: BadgeTone };
};

export const WALLET_STATS: StatCardProps[] = [
  { label: 'Platform Balance', value: '₹24.8Cr', icon: BriefcaseIcon, accent: 'blue' },
  { label: "Today's Deposits", value: '₹4.2Cr', caption: '184 transactions', delta: '+22.4% vs yesterday', tone: 'up', icon: ArrowUpIcon, accent: 'green' },
  { label: "Today's Withdrawals", value: '₹2.8Cr', caption: '96 transactions', delta: '-8.4% vs yesterday', tone: 'down', icon: ArrowDownIcon, accent: 'red' },
  { label: 'Pending Review', value: '42', caption: '₹1.2Cr total', icon: ClockIcon, accent: 'yellow' },
];

export const PARTNER_BUCKETS: PartnerBucket[] = [
  { emoji: '👑', label: 'Super Agents', active: '4 active', due: '₹1.37L', color: 'var(--color-warning)', rgb: '250, 204, 21' },
  { emoji: '🧑‍💼', label: 'Agents', active: '5 active', due: '₹18,290', color: 'var(--color-primary-light)', rgb: '41, 182, 246' },
  { emoji: '🏢', label: 'Franchises', active: '3 active', due: '₹2.10Cr', color: 'var(--color-success)', rgb: '34, 197, 94' },
];

const DEPOSITS: WalletRequest[] = [
  { id: 'DEP8842', user: 'Arjun Sharma', amount: '₹50,000', method: 'UPI', reference: 'UTR4281938', time: '10:42 AM', status: { label: 'Pending', tone: 'warning' }, kind: 'deposit' },
  { id: 'DEP8841', user: 'Sneha Gupta', amount: '₹1,00,000', method: 'NEFT', reference: 'NEFT9182741', time: '10:38 AM', status: { label: 'Pending', tone: 'warning' }, kind: 'deposit' },
  { id: 'DEP8840', user: 'Vikram Singh', amount: '₹2,50,000', method: 'IMPS', reference: 'IMPS8374910', time: '10:31 AM', status: { label: 'Pending', tone: 'warning' }, kind: 'deposit' },
];

const WITHDRAWALS: WalletRequest[] = [
  { id: 'WDR4412', user: 'Priya Patel', amount: '₹25,000', method: 'Bank', reference: 'BNK5518273', time: '10:18 AM', status: { label: 'Pending', tone: 'warning' }, kind: 'withdrawal' },
  { id: 'WDR4411', user: 'Rahul Verma', amount: '₹8,000', method: 'UPI', reference: 'UTR7391028', time: '09:54 AM', status: { label: 'Pending', tone: 'warning' }, kind: 'withdrawal' },
];

const HISTORY: WalletRequest[] = [
  { id: 'DEP8839', user: 'Kavitha Nair', amount: '₹75,000', method: 'UPI', reference: 'UTR1029384', time: 'Yesterday', status: { label: 'Success', tone: 'success' }, kind: 'deposit' },
  { id: 'WDR4409', user: 'Amit Kumar', amount: '₹12,000', method: 'Bank', reference: 'BNK9081726', time: 'Yesterday', status: { label: 'Failed', tone: 'danger' }, kind: 'withdrawal' },
  { id: 'DEP8838', user: 'Rohan Mehta', amount: '₹40,000', method: 'NEFT', reference: 'NEFT5647382', time: '2 days ago', status: { label: 'Success', tone: 'success' }, kind: 'deposit' },
];

const MANUAL_ACTIVITY: WalletRequest[] = [
  { id: 'MAN2201', user: 'Deepak Kumar', amount: '₹20,000', method: 'Manual Credit', reference: 'Bonus payout', time: '09:12 AM', status: { label: 'Success', tone: 'success' }, kind: 'deposit' },
  { id: 'MAN2200', user: 'Nisha Gupta', amount: '₹5,000', method: 'Adjustment', reference: 'Settlement fix', time: 'Yesterday', status: { label: 'Success', tone: 'success' }, kind: 'withdrawal' },
];

export function getWalletRequests(tab: string): WalletRequest[] {
  if (tab === 'Withdrawals') return WITHDRAWALS;
  if (tab === 'History') return HISTORY;
  if (tab === 'Manual Activity') return MANUAL_ACTIVITY;
  return DEPOSITS;
}

export const PAYMENT_SUMMARY = [
  { label: 'Total Paid (July)', value: '₹3.62L', color: 'var(--color-success)', icon: CheckCircleIcon, rgb: '34, 197, 94' },
  { label: 'Pending', value: '1', color: 'var(--color-warning)', icon: ClockIcon, rgb: '250, 204, 21' },
  { label: 'Commission Due', value: '₹2.88L', color: 'var(--color-primary-light)', icon: PercentIcon, rgb: '41, 182, 246' },
  { label: 'Payments This Month', value: '6', color: 'var(--color-primary)', icon: TransactionsIcon, rgb: '33, 150, 243' },
];

export const DISBURSEMENTS: Disbursement[] = [
  { id: 'SA001', name: 'Rohit Agarwal', meta: 'SA001 · superagent', amount: '₹42,000', accent: 'var(--color-warning)' },
  { id: 'SA002', name: 'Sunita Kapoor', meta: 'SA002 · superagent', amount: '₹31,000', accent: 'var(--color-warning)' },
  { id: 'A001', name: 'Deepak Kumar', meta: 'A001 · agent', amount: '₹3,390', accent: 'var(--color-primary-light)' },
  { id: 'A002', name: 'Pooja Sharma', meta: 'A002 · agent', amount: '₹2,390', accent: 'var(--color-primary-light)' },
  { id: 'FR001', name: 'Mumbai Franchise', meta: 'FR001 · franchise', amount: '₹2,10,000', accent: 'var(--color-success)' },
];

export const PAYMENT_HISTORY: PaymentRow[] = [
  { id: 'PAY0041', recipient: 'Rohit Agarwal', recipientCode: 'SA001', type: { label: 'superagent', tone: 'warning' }, paymentType: { label: 'commission', tone: 'success' }, amount: '₹42,000', method: 'Bank Transfer', date: '21 Jul · 10:00 AM', status: { label: 'Success', tone: 'success' } },
  { id: 'PAY0040', recipient: 'Mumbai Franchise', recipientCode: 'FR001', type: { label: 'franchise', tone: 'success' }, paymentType: { label: 'commission', tone: 'success' }, amount: '₹2,10,000', method: 'RTGS', date: '21 Jul · 10:00 AM', status: { label: 'Success', tone: 'success' } },
  { id: 'PAY0039', recipient: 'Deepak Kumar', recipientCode: 'A001', type: { label: 'agent', tone: 'info' }, paymentType: { label: 'commission', tone: 'success' }, amount: '₹3,390', method: 'Bank Transfer', date: '21 Jul · 09:45 AM', status: { label: 'Success', tone: 'success' } },
  { id: 'PAY0038', recipient: 'Sunita Kapoor', recipientCode: 'SA002', type: { label: 'superagent', tone: 'warning' }, paymentType: { label: 'credit', tone: 'info' }, amount: '₹1,00,000', method: 'NEFT', date: '20 Jul · 3:00 PM', status: { label: 'Success', tone: 'success' } },
  { id: 'PAY0037', recipient: 'Pooja Sharma', recipientCode: 'A002', type: { label: 'agent', tone: 'info' }, paymentType: { label: 'bonus', tone: 'warning' }, amount: '₹5,000', method: 'UPI', date: '19 Jul · 11:30 AM', status: { label: 'Success', tone: 'success' } },
  { id: 'PAY0036', recipient: 'Delhi Franchise', recipientCode: 'FR002', type: { label: 'franchise', tone: 'success' }, paymentType: { label: 'adjustment', tone: 'neutral' }, amount: '₹8,400', method: 'Bank Transfer', date: '18 Jul · 2:15 PM', status: { label: 'Pending', tone: 'warning' } },
  { id: 'PAY0035', recipient: 'Prakash Joshi', recipientCode: 'SA003', type: { label: 'superagent', tone: 'warning' }, paymentType: { label: 'commission', tone: 'success' }, amount: '₹64,000', method: 'RTGS', date: '1 Jul · 10:00 AM', status: { label: 'Success', tone: 'success' } },
];

export const RECIPIENT_TYPES = ['Super Agent', 'Agent', 'Franchise'] as const;
export const PAYMENT_TYPES = ['Commission', 'Credit', 'Bonus', 'Adjustment'] as const;
export const PAYMENT_METHODS = ['Bank Transfer', 'NEFT', 'RTGS', 'UPI', 'IMPS'] as const;
export const RECIPIENTS = [
  'Rohit Agarwal (SA001)',
  'Sunita Kapoor (SA002)',
  'Deepak Kumar (A001)',
  'Mumbai Franchise (FR001)',
] as const;

export const WALLET_USERS = [
  'Arjun Sharma (U001)',
  'Priya Patel (U002)',
  'Rahul Verma (U003)',
  'Deepak Kumar (A001)',
  'Rohit Agarwal (SA001)',
] as const;
