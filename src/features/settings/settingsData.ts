import type { BadgeTone } from '../../components/ui/Badge/Badge';

export type Field = { label: string; value: string };

export type CommissionRate = { label: string; rate: number };

export type BrandColor = { label: string; hex: string };

export type ApiKey = {
  name: string;
  status: 'Active' | 'Inactive';
  latency?: string;
  key: string;
};

export const SETTINGS_TABS = [
  'General',
  'Limits',
  'Commission',
  'Notifications',
  'Brand',
  'API Keys',
] as const;

/** General tab — node 112:11029. */
export const PLATFORM_CONFIG: Field[] = [
  { label: 'Platform Name', value: 'BetMaster Pro' },
  { label: 'Currency', value: 'INR (₹)' },
  { label: 'Timezone', value: 'Asia/Kolkata (IST)' },
  { label: 'Support Email', value: 'support@betmaster.com' },
  { label: 'Support Phone', value: '+91 80000 12345' },
];

export const WALLET_RULES: Field[] = [
  { label: 'Min Deposit', value: '₹500' },
  { label: 'Max Deposit', value: '₹10,00,000' },
  { label: 'Min Withdrawal', value: '₹500' },
  { label: 'Max Withdrawal / Day', value: '₹5,00,000' },
  { label: 'Withdrawal Processing Time', value: '24 hours' },
];

/** Limits tab — node 119:59071. */
export const BETTING_LIMITS: Field[] = [
  { label: 'Min Bet Amount', value: '₹100' },
  { label: 'Max Bet Amount', value: '₹5,00,000' },
  { label: 'Max Exposure per Market', value: '₹25,00,000' },
  { label: 'Max Daily Loss per User', value: '₹10,00,000' },
  { label: 'Max Open Bets per User', value: '50' },
];

export const EXPOSURE_LIMITS: Field[] = [
  { label: 'Max Market Exposure', value: '₹25,00,000' },
  { label: 'Max Match Exposure', value: '₹1,00,00,000' },
  { label: 'Max Agent Exposure', value: '₹50,00,000' },
  { label: 'Auto-Suspend Threshold', value: '90%' },
  { label: 'Warning Threshold', value: '70%' },
];

/**
 * Commission tab — node 119:59499. Each rate is drawn with a bar beneath it;
 * 15% fills exactly three quarters of its track, so the scale tops out at 20%.
 */
export const COMMISSION_CEILING = 20;

export const COMMISSION_RATES: CommissionRate[] = [
  { label: 'Franchise Commission', rate: 15 },
  { label: 'Super Agent Commission', rate: 10 },
  { label: 'Agent Commission', rate: 7 },
  { label: 'User Referral Bonus', rate: 2 },
];

/** Notifications tab — node 119:59881. */
export const SMTP_FIELDS: Field[] = [
  { label: 'SMTP Host', value: 'smtp.betmaster.com' },
  { label: 'SMTP Port', value: '587' },
  { label: 'From Email', value: 'noreply@betmaster.com' },
  { label: 'From Name', value: 'BetMaster Pro' },
];

export const SMS_FIELDS: Field[] = [
  { label: 'SMS Provider', value: 'Twilio' },
  { label: 'API Key', value: 'AC••••••••••••••••••••••b2a4' },
  { label: 'Sender ID', value: 'BETMPR' },
  { label: 'OTP Validity', value: '5 minutes' },
];

/** Brand tab — node 119:60319. */
export const BRAND_FIELDS: Field[] = [
  { label: 'Brand Name', value: 'BetMaster Pro' },
  { label: 'Tagline', value: "India's Premier Betting Platform" },
];

export const BRAND_COLORS: BrandColor[] = [
  { label: 'Primary Color', hex: '#2196F3' },
  { label: 'Accent Color', hex: '#29B6F6' },
  { label: 'Background', hex: '#061321' },
  { label: 'Success Color', hex: '#22C55E' },
];

/** API Keys tab — node 119:60728. */
export const API_STATUS_TONE: Record<ApiKey['status'], BadgeTone> = {
  Active: 'success',
  Inactive: 'warning',
};

export const API_KEYS: ApiKey[] = [
  { name: 'Diamond Exchange API', status: 'Active', latency: '12ms', key: 'dx_live_••••••••••••••••7f8a' },
  { name: 'Betfair API', status: 'Active', latency: '28ms', key: 'bf_••••••••••••••••9b2c' },
  { name: 'Cricket API', status: 'Inactive', key: 'cr_••••••••••••••••3d4e' },
  { name: 'SMS Gateway (Twilio)', status: 'Active', latency: undefined, key: 'AC••••••••••••••••••••b2a4' },
];
