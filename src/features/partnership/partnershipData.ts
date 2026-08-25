import {
  CheckCircleIcon,
  DollarIcon,
  PartnershipIcon,
  TrendingUpIcon,
} from '../../components/icons';
import type { BadgeTone } from '../../components/ui/Badge/Badge';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';

export type PartnerType =
  | 'Data Provider'
  | 'Exchange'
  | 'Payment'
  | 'Compliance'
  | 'Communication';

export type PartnerStatus = 'Active' | 'Inactive';

export type RevenueMonth = { month: string; label: string; value: number };

export type Settlement = { period: string; amount: string; status: string };

export type Partner = {
  id: string;
  name: string;
  type: PartnerType;
  revShare: string;
  monthlyFee: string;
  betVolume: string;
  status: PartnerStatus;
  since: string;
  contact: string;
  email: string;
  website: string;
  apiKey: string;
  notes: string;
};

export const PARTNER_STATS: StatCardProps[] = [
  {
    label: 'Total Partners',
    value: '6',
    caption: 'Active integrations',
    icon: PartnershipIcon,
    accent: 'blue',
    tinted: true,
  },
  { label: 'Partner Costs', value: '₹4.88L', caption: 'This month', icon: DollarIcon, accent: 'red' },
  {
    label: 'Revenue Share Paid',
    value: '₹28.4L',
    caption: 'All partners this month',
    icon: TrendingUpIcon,
    accent: 'yellow',
  },
  { label: 'Active SLAs', value: '5', caption: 'All performing', icon: CheckCircleIcon, accent: 'green' },
];

export const PARTNER_TABS = ['Partners', 'Revenue', 'Config'] as const;

export const PARTNER_TYPES: PartnerType[] = [
  'Data Provider',
  'Exchange',
  'Payment',
  'Compliance',
  'Communication',
];

export const PARTNER_STATUSES: PartnerStatus[] = ['Active', 'Inactive'];

export const PARTNER_STATUS_TONE: Record<PartnerStatus, BadgeTone> = {
  Active: 'success',
  Inactive: 'warning',
};

/** The directory from node 112:7569. */
export const PARTNERS: Partner[] = [
  { id: 'P001', name: 'SportsFeed API', type: 'Data Provider', revShare: '12%', monthlyFee: '₹2.4L', betVolume: '284,000', status: 'Active', since: 'Jan 2023', contact: 'Rahul Mehta', email: 'rahul@sportsfeed.io', website: 'sportsfeed.io', apiKey: 'sf_live_xk29...a84f', notes: 'Live sports data provider. Latency SLA < 200ms.' },
  { id: 'P002', name: 'Diamond Exchange', type: 'Exchange', revShare: '8%', monthlyFee: '₹0', betVolume: '1,842,000', status: 'Active', since: 'Mar 2022', contact: 'Nikhil Rao', email: 'ops@diamondex.com', website: 'diamondex.com', apiKey: 'dx_live_pq71...c23b', notes: 'Liquidity exchange. Settlement runs nightly at 02:00 IST.' },
  { id: 'P003', name: 'Betfair Integration', type: 'Exchange', revShare: '6%', monthlyFee: '₹1.2L', betVolume: '924,000', status: 'Active', since: 'Jul 2023', contact: 'Meera Iyer', email: 'partners@betfair.io', website: 'betfair.io', apiKey: 'bf_live_ta48...9f0d', notes: 'Exchange odds feed. Rate limited to 120 req/min.' },
  { id: 'P004', name: 'Payment Gateway A', type: 'Payment', revShare: '1.5%', monthlyFee: '₹0', betVolume: '—', status: 'Active', since: 'Jan 2024', contact: 'Sanjay Bose', email: 'support@paygw-a.in', website: 'paygw-a.in', apiKey: 'pg_live_mz03...61ae', notes: 'UPI and net-banking rail. 1.5% per successful capture.' },
  { id: 'P005', name: 'KYC Provider', type: 'Compliance', revShare: '0%', monthlyFee: '₹84,000', betVolume: '—', status: 'Active', since: 'Feb 2024', contact: 'Anita Desai', email: 'compliance@kycpro.in', website: 'kycpro.in', apiKey: 'ky_live_jw55...4d7c', notes: 'Aadhaar and PAN verification. Flat monthly retainer.' },
  { id: 'P006', name: 'SMS Gateway', type: 'Communication', revShare: '0%', monthlyFee: '₹24,000', betVolume: '—', status: 'Inactive', since: 'Jun 2023', contact: 'Vivek Nair', email: 'noc@smsgw.co', website: 'smsgw.co', apiKey: 'sm_live_hb18...2e95', notes: 'Transactional OTP route. Paused pending DLT re-registration.' },
];

/** Six-month revenue share — node 119:52900. */
export const REVENUE_MONTHS: RevenueMonth[] = [
  { month: 'Feb', label: '₹2.1L', value: 2.1 },
  { month: 'Mar', label: '₹2.4L', value: 2.4 },
  { month: 'Apr', label: '₹2.8L', value: 2.8 },
  { month: 'May', label: '₹3.1L', value: 3.1 },
  { month: 'Jun', label: '₹2.9L', value: 2.9 },
  { month: 'Jul', label: '₹3.4L', value: 3.4 },
];

export const REVENUE_TOTAL = '₹16.7L';

export const SETTLEMENTS: Settlement[] = [
  { period: 'Jul 2024', amount: '₹3.4L', status: 'Paid' },
  { period: 'Jun 2024', amount: '₹2.9L', status: 'Paid' },
  { period: 'May 2024', amount: '₹3.1L', status: 'Paid' },
  { period: 'Apr 2024', amount: '₹2.8L', status: 'Paid' },
];

/** Blank row behind the Add Partnership dialog — node 119:51060. */
export const NEW_PARTNER: Partner = {
  id: 'new',
  name: '',
  type: 'Exchange',
  revShare: '5%',
  monthlyFee: '₹0',
  betVolume: '—',
  status: 'Active',
  since: 'Today',
  contact: '',
  email: '',
  website: '',
  apiKey: '',
  notes: '',
};
