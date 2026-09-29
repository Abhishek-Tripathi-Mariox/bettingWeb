export const SETTINGS_TABS = [
  'General',
  'Limits',
  'Commission',
  'Notifications',
  'Brand',
  'API Keys',
] as const;

/** Commission share bars top out at this rate. */
export const COMMISSION_CEILING = 20;

/** One editable field of a live settings section — `key` is the property stored in that section on the backend. */
export type SectionField = { key: string; label: string; type: 'number' | 'text' };

const num = (key: string, label: string): SectionField => ({ key, label, type: 'number' });
const text = (key: string, label: string): SectionField => ({ key, label, type: 'text' });

/**
 * Field layout for each backend settings section (super-admin live view).
 * `commissionRates` keys must stay `franchise` / `super-agent` / `agent` —
 * the backend's commission recompute reads them by role id.
 */
export const SECTION_FIELDS = {
  general: [
    text('platformName', 'Platform Name'),
    text('currency', 'Currency'),
    text('timezone', 'Timezone'),
    text('supportEmail', 'Support Email'),
    text('supportPhone', 'Support Phone'),
  ],
  walletRules: [
    num('minDeposit', 'Min Deposit (₹)'),
    num('maxDeposit', 'Max Deposit (₹)'),
    num('minWithdrawal', 'Min Withdrawal (₹)'),
    num('maxWithdrawal', 'Max Withdrawal / Day (₹)'),
    num('processingHours', 'Withdrawal Processing Time (hours)'),
  ],
  bettingLimits: [
    num('minBet', 'Min Bet Amount (₹)'),
    num('maxBet', 'Max Bet Amount (₹)'),
    num('maxDailyLoss', 'Max Daily Loss per User (₹)'),
    num('maxOpenBets', 'Max Open Bets per User'),
  ],
  exposureLimits: [
    num('maxMarketExposure', 'Max Market Exposure (₹)'),
    num('maxMatchExposure', 'Max Match Exposure (₹)'),
    num('maxAgentExposure', 'Max Agent Exposure (₹)'),
    num('maxUserExposure', 'Max User Exposure (₹)'),
    num('autoSuspendPercent', 'Auto-Suspend Threshold (%)'),
    num('warningPercent', 'Warning Threshold (%)'),
  ],
  commissionRates: [
    num('franchise', 'Franchise Commission'),
    num('super-agent', 'Super Agent Commission'),
    num('agent', 'Agent Commission'),
    num('referral', 'User Referral Bonus'),
  ],
  smtp: [
    text('host', 'SMTP Host'),
    num('port', 'SMTP Port'),
    text('user', 'SMTP User'),
    text('fromEmail', 'From Email'),
    text('fromName', 'From Name'),
  ],
  sms: [
    text('provider', 'SMS Provider'),
    text('apiKey', 'API Key'),
    text('senderId', 'Sender ID'),
    num('otpValidityMinutes', 'OTP Validity (minutes)'),
  ],
  brand: [
    text('brandName', 'Brand Name'),
    text('tagline', 'Tagline'),
    text('logoUrl', 'Logo URL'),
  ],
} as const satisfies Record<string, SectionField[]>;

export const BRAND_COLOR_FIELDS: SectionField[] = [
  text('primaryColor', 'Primary Color'),
  text('accentColor', 'Accent Color'),
  text('backgroundColor', 'Background'),
  text('successColor', 'Success Color'),
];
