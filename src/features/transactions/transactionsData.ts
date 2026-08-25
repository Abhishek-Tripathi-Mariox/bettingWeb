import { ArrowDownIcon, ArrowUpIcon, ClockIcon, TransactionsIcon } from '../../components/icons';
import type { BadgeTone } from '../../components/ui/Badge/Badge';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';

export type TxnType = 'Deposit' | 'Withdrawal' | 'Bet Win' | 'Bet Loss' | 'Adjustment' | 'Commission';

export type Transaction = {
  id: string;
  user: string;
  type: TxnType;
  amount: string;
  method: string;
  reference: string;
  date: string;
  time: string;
  status: { label: string; tone: BadgeTone };
};

/** Tint per transaction type — rgb triplet, rendered at 8% behind the label. */
export const TYPE_RGB: Record<TxnType, string> = {
  Deposit: '34, 197, 94',
  Withdrawal: '239, 68, 68',
  'Bet Win': '34, 197, 94',
  'Bet Loss': '239, 68, 68',
  Adjustment: '41, 182, 246',
  Commission: '34, 197, 94',
};

/** Which filter tab each type belongs to. */
const TYPE_GROUP: Record<TxnType, string> = {
  Deposit: 'Deposits',
  Withdrawal: 'Withdrawals',
  'Bet Win': 'Bets',
  'Bet Loss': 'Bets',
  Adjustment: 'Adjustments',
  Commission: 'Partner Payments',
};

export const TRANSACTION_STATS: StatCardProps[] = [
  { label: "Today's Transactions", value: '2,841', caption: 'All types', icon: TransactionsIcon, accent: 'blue' },
  { label: 'Total Deposits', value: '₹4.2Cr', caption: '184 transactions', delta: '+22.4% vs yesterday', tone: 'up', icon: ArrowUpIcon, accent: 'green' },
  { label: 'Total Withdrawals', value: '₹2.8Cr', caption: '96 transactions', icon: ArrowDownIcon, accent: 'red' },
  { label: 'Pending Review', value: '42', caption: '₹1.2Cr total', icon: ClockIcon, accent: 'yellow' },
];

/** The ledger from node 112:3084. */
const TRANSACTIONS: Transaction[] = [
  { id: 'TXN9001', user: 'Arjun Sharma', type: 'Deposit', amount: '+₹50,000', method: 'UPI', reference: 'UTR4281938', date: '21 Jul 24', time: '10:42 AM', status: { label: 'Success', tone: 'success' } },
  { id: 'TXN9002', user: 'Priya Patel', type: 'Withdrawal', amount: '-₹25,000', method: 'Bank', reference: 'NEFT9182741', date: '21 Jul 24', time: '10:38 AM', status: { label: 'Pending', tone: 'warning' } },
  { id: 'TXN9003', user: 'Rahul Verma', type: 'Bet Win', amount: '+₹12,400', method: 'Wallet', reference: 'BET8374910', date: '21 Jul 24', time: '10:31 AM', status: { label: 'Success', tone: 'success' } },
  { id: 'TXN9004', user: 'Sneha Gupta', type: 'Deposit', amount: '+₹1,00,000', method: 'NEFT', reference: 'NEFT1928374', date: '21 Jul 24', time: '10:24 AM', status: { label: 'Success', tone: 'success' } },
  { id: 'TXN9005', user: 'Amit Kumar', type: 'Withdrawal', amount: '-₹8,000', method: 'UPI', reference: 'UTR9283741', date: '21 Jul 24', time: '10:18 AM', status: { label: 'Failed', tone: 'danger' } },
  { id: 'TXN9006', user: 'Vikram Singh', type: 'Bet Loss', amount: '-₹42,000', method: 'Wallet', reference: 'BET1928374', date: '21 Jul 24', time: '10:12 AM', status: { label: 'Success', tone: 'success' } },
  { id: 'TXN9007', user: 'Kavitha Nair', type: 'Adjustment', amount: '+₹5,000', method: 'Admin', reference: 'ADJ0001234', date: '21 Jul 24', time: '09:58 AM', status: { label: 'Success', tone: 'success' } },
  { id: 'TXN9008', user: 'Meena Joshi', type: 'Deposit', amount: '+₹20,000', method: 'IMPS', reference: 'IMPS8192837', date: '21 Jul 24', time: '09:44 AM', status: { label: 'Success', tone: 'success' } },
  { id: 'TXN9009', user: 'Deepak Kumar', type: 'Commission', amount: '+₹3,390', method: 'System', reference: 'COM0021938', date: '21 Jul 24', time: '09:30 AM', status: { label: 'Success', tone: 'success' } },
  { id: 'TXN9010', user: 'Arjun Sharma', type: 'Bet Win', amount: '+₹8,400', method: 'Wallet', reference: 'BET9283741', date: '20 Jul 24', time: '11:42 PM', status: { label: 'Success', tone: 'success' } },
];

export const TRANSACTION_TABS = [
  { label: 'All' },
  { label: 'Deposits' },
  { label: 'Withdrawals' },
  { label: 'Bets' },
  { label: 'Adjustments' },
  { label: 'Partner Payments', badge: '6 due', rgb: '250, 204, 21' },
] as const;

export const TRANSACTION_PAGES = 284;

export function getTransactions(tab: string, query: string): Transaction[] {
  const needle = query.trim().toLowerCase();
  return TRANSACTIONS.filter((txn) => {
    const inTab = tab === 'All' || TYPE_GROUP[txn.type] === tab;
    const matches =
      !needle ||
      txn.id.toLowerCase().includes(needle) ||
      txn.user.toLowerCase().includes(needle) ||
      txn.reference.toLowerCase().includes(needle);
    return inTab && matches;
  });
}
