import { CmsIcon, EyeIcon, GiftIcon, TargetIcon } from '../../components/icons';
import type { BadgeTone } from '../../components/ui/Badge/Badge';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';

export type ContentStatus = 'active' | 'scheduled';

export type ContentItem = {
  id: string;
  status: ContentStatus;
  target: string;
  title: string;
  body: string;
  views: string;
  date: string;
};

export const CMS_STATS: StatCardProps[] = [
  {
    label: 'Active Announcements',
    value: '3',
    icon: CmsIcon,
    accent: 'blue',
    tinted: true,
  },
  { label: 'Active Promotions', value: '8', caption: '₹26.87L budget', icon: GiftIcon, accent: 'green' },
  {
    label: 'Total Views',
    value: '19,028',
    caption: 'This week',
    delta: '+24.8% vs yesterday',
    tone: 'up',
    icon: EyeIcon,
    accent: 'cyan',
  },
  { label: 'Campaign ROI', value: '284%', caption: 'Avg across promotions', icon: TargetIcon, accent: 'yellow' },
];

export const CMS_TABS = ['Announcements', 'Banners', 'Promotions', 'Noticeboard'] as const;

export const CONTENT_STATUS_TONE: Record<ContentStatus, BadgeTone> = {
  active: 'success',
  scheduled: 'warning',
};

/** Scrolling strip above the tabs — node 112:9752. */
export const MARQUEE_TEXT =
  '🏏 India vs Australia — Special Odds Available Now!   ·   💰 Instant Withdrawal with UPI — Funds in 30 minutes   ·   🎁 IPL 2024 Cashback — 10% on all match bets!   ·   🔔 KYC pending users: Verify now for unlimited withdrawals';

/** The announcement list from node 112:9398. */
export const ANNOUNCEMENTS: ContentItem[] = [
  { id: 'ANN001', status: 'active', target: 'All Users', title: 'IPL 2024 Season Launch — Special Odds', body: 'Special boosted odds for all IPL 2024 matches. Win up to 2x on your bets this season!', views: '8,421', date: '15 Jul 2024' },
  { id: 'ANN002', status: 'active', target: 'All Users', title: 'New Payment Method Added — RuPay UPI', body: 'We have added RuPay UPI as a new payment option. Enjoy instant deposits and withdrawals.', views: '6,284', date: '18 Jul 2024' },
  { id: 'ANN003', status: 'scheduled', target: 'All Users', title: 'System Maintenance — 2 AM to 4 AM', body: 'The platform will be under maintenance for 2 hours. All active bets will be preserved.', views: '2,481', date: '20 Jul 2024' },
  { id: 'ANN004', status: 'active', target: 'KYC Pending', title: 'KYC Verification Required', body: 'Complete your KYC verification to unlock unlimited withdrawals. Process takes only 5 minutes.', views: '1,842', date: '10 Jul 2024' },
];
