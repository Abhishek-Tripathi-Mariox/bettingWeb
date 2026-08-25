import type { ComponentType } from 'react';
import {
  BettingIcon,
  CommissionIcon,
  DollarIcon,
  ExportIcon,
  ReportsIcon,
  RiskIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from '../../components/icons';
import type { IconProps } from '../../components/icons';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';

export type ReportFormat = 'PDF' | 'Excel' | 'Print';

export type ReportKind = {
  title: string;
  description: string;
  icon: ComponentType<IconProps>;
  /** rgb triplet for the 9% tile wash behind the glyph. */
  rgb: string;
  formats: ReportFormat[];
};

/**
 * Sample output behind a kind's Preview button. Nodes 119:55473 (Financial)
 * and 139:84935 (Betting) draw the same sheet with different columns, and each
 * one is washed in its own kind's colour — so the preview travels with the kind.
 */
export type ReportPreview = {
  meta: Field[];
  columns: string[];
  /** One entry per column; the first cell is drawn as the row's heading. */
  rows: string[][];
};

export type Field = { label: string; value: string };

export const REPORT_STATS: StatCardProps[] = [
  { label: 'Reports Generated', value: '284', caption: 'This month', icon: ReportsIcon, accent: 'blue' },
  { label: 'Downloads', value: '1,842', icon: ExportIcon, accent: 'green' },
  {
    label: 'Monthly Revenue',
    value: '₹4.8Cr',
    delta: '+22.4% vs yesterday',
    tone: 'up',
    icon: TrendingUpIcon,
    accent: 'yellow',
  },
  {
    label: 'Net Profit',
    value: '₹1.24Cr',
    delta: '+14.8% vs yesterday',
    tone: 'up',
    icon: CommissionIcon,
    accent: 'cyan',
  },
];

/** The six report kinds — node 112:8582. */
export const REPORT_KINDS: ReportKind[] = [
  { title: 'Financial Report', description: 'Revenue, P&L, expenses and projections', icon: DollarIcon, rgb: '34, 197, 94', formats: ['PDF', 'Excel', 'Print'] },
  { title: 'Betting Report', description: 'All bets, outcomes, and settlements', icon: BettingIcon, rgb: '33, 150, 243', formats: ['PDF', 'Excel'] },
  { title: 'User Report', description: 'User registrations, activity and KYC', icon: UsersIcon, rgb: '41, 182, 246', formats: ['PDF', 'Excel', 'Print'] },
  { title: 'Wallet Report', description: 'Deposits, withdrawals and adjustments', icon: WalletIcon, rgb: '250, 204, 21', formats: ['PDF', 'Excel'] },
  { title: 'Commission Report', description: 'Agent and franchise commissions', icon: CommissionIcon, rgb: '255, 46, 99', formats: ['PDF', 'Excel'] },
  { title: 'Exposure Report', description: 'Market and risk exposure analysis', icon: RiskIcon, rgb: '239, 68, 68', formats: ['PDF', 'Excel'] },
];

export const REPORT_TYPE_OPTIONS = REPORT_KINDS.map((kind) => kind.title);

export const GROUP_BY_OPTIONS = ['Daily', 'Weekly', 'Monthly', 'Quarterly'];

/**
 * Only two kinds have a drawn preview so far. The rest borrow the financial
 * sheet — same fallback as before this map existed — but are washed in their
 * own colour, which is what the two designed sheets have in common.
 */
export const REPORT_PREVIEWS: Record<string, ReportPreview> = {
  /** Node 119:55473. */
  'Financial Report': {
    meta: [
      { label: 'Period', value: 'Jul 18–21, 2024' },
      { label: 'Total Records', value: '48' },
      { label: 'Status', value: 'Complete' },
      { label: 'Format', value: 'Tabular' },
    ],
    columns: ['Date', 'Deposits', 'Withdrawals', 'Bets', 'Winnings', 'Net Revenue'],
    rows: [
      ['Jul 21', '₹18.4L', '₹11.2L', '₹42.8L', '₹38.1L', '₹4.7L'],
      ['Jul 20', '₹16.8L', '₹9.8L', '₹38.6L', '₹34.2L', '₹4.4L'],
      ['Jul 19', '₹21.2L', '₹13.1L', '₹51.4L', '₹45.8L', '₹5.6L'],
      ['Jul 18', '₹14.4L', '₹8.6L', '₹32.2L', '₹28.6L', '₹3.6L'],
    ],
  },
  /** Node 139:84935. */
  'Betting Report': {
    meta: [
      { label: 'Period', value: 'Jul 18–21, 2024' },
      { label: 'Total Records', value: '36' },
      { label: 'Status', value: 'Complete' },
      { label: 'Format', value: 'Tabular' },
    ],
    columns: ['Match', 'Total Bets', 'Stake', 'Winnings', 'Profit', 'Margin'],
    rows: [
      ['India vs Australia', '1,842', '₹12.4L', '₹10.8L', '₹1.6L', '12.9%'],
      ['MI vs CSK', '3,241', '₹18.7L', '₹16.4L', '₹2.3L', '12.3%'],
      ['DC vs RR', '2,124', '₹9.1L', '₹7.9L', '₹1.2L', '13.2%'],
    ],
  },
};

export function getReportPreview(title: string): ReportPreview {
  return REPORT_PREVIEWS[title] ?? REPORT_PREVIEWS['Financial Report'];
}
