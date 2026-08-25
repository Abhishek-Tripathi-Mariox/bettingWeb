import { BuildingIcon, CommissionIcon, GiftIcon, UsersCogIcon } from '../../components/icons';
import type { BadgeTone } from '../../components/ui/Badge/Badge';
import type { DonutSlice } from '../../components/charts/DonutChart';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';

export type CommissionLevel = 'Franchise' | 'Super Agent' | 'Agent';

export type SettlementStatus = 'Settled' | 'Pending';

export type CommissionRow = {
  id: string;
  entity: string;
  level: CommissionLevel;
  turnover: string;
  rate: string;
  commission: string;
  status: SettlementStatus;
};

export const COMMISSION_STATS: StatCardProps[] = [
  {
    label: 'Total Commission',
    value: '₹72.4L',
    caption: 'This month',
    delta: '+18.4% vs yesterday',
    tone: 'up',
    icon: CommissionIcon,
    accent: 'blue',
    tinted: true,
  },
  { label: 'Franchise Share', value: '₹30.4L', caption: '42%', icon: BuildingIcon, accent: 'cyan' },
  {
    label: 'Agent Share',
    value: '₹20.3L',
    caption: '28%',
    delta: '+12.8% vs yesterday',
    tone: 'up',
    icon: UsersCogIcon,
    accent: 'green',
  },
  { label: 'Pending Settlement', value: '₹8.4L', caption: 'Due tomorrow', icon: GiftIcon, accent: 'yellow' },
];

export const SETTLEMENT_TONE: Record<SettlementStatus, BadgeTone> = {
  Settled: 'info',
  Pending: 'warning',
};

/** The breakdown from node 112:6945. */
export const COMMISSION_ROWS: CommissionRow[] = [
  { id: 'CM1', entity: 'Mumbai Franchise', level: 'Franchise', turnover: '₹8.42Cr', rate: '15%', commission: '₹12.6L', status: 'Settled' },
  { id: 'CM2', entity: 'Delhi Franchise', level: 'Franchise', turnover: '₹6.28Cr', rate: '15%', commission: '₹9.4L', status: 'Settled' },
  { id: 'CM3', entity: 'Agent A-089', level: 'Agent', turnover: '₹2.84Cr', rate: '7%', commission: '₹1.99L', status: 'Pending' },
  { id: 'CM4', entity: 'Super Agent SA-012', level: 'Super Agent', turnover: '₹4.12Cr', rate: '10%', commission: '₹4.12L', status: 'Pending' },
  { id: 'CM5', entity: 'Bangalore Franchise', level: 'Franchise', turnover: '₹11.24Cr', rate: '15%', commission: '₹16.8L', status: 'Settled' },
];

/** Ring + legend on the right of the page — node 112:7481. */
export const COMMISSION_SPLIT: DonutSlice[] = [
  { label: 'Franchise', value: 42, color: '#2196f3' },
  { label: 'Super Agent', value: 28, color: '#29b6f6' },
  { label: 'Agent', value: 20, color: '#22c55e' },
  { label: 'Platform', value: 10, color: '#facc15' },
];
