import { AlertTriangleIcon, BellIcon, CheckCircleIcon, WalletIcon } from '../../components/icons';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';

export type Notification = {
  id: string;
  emoji: string;
  title: string;
  time: string;
  body: string;
  /** Unread rows carry the brand wash and a bolder title. */
  unread: boolean;
};

export const NOTIFICATION_STATS: StatCardProps[] = [
  { label: 'Unread', value: '3', icon: BellIcon, accent: 'live' },
  { label: 'Risk Alerts', value: '2', icon: AlertTriangleIcon, accent: 'red' },
  { label: 'Wallet Alerts', value: '8', icon: WalletIcon, accent: 'yellow' },
  { label: 'Resolved Today', value: '24', icon: CheckCircleIcon, accent: 'green' },
];

/** The feed from node 112:9991. */
export const NOTIFICATIONS: Notification[] = [
  { id: 'N1', emoji: '🏏', title: 'India vs Australia settled', time: '10 min ago', body: 'Match winner market settled. Total payout ₹84.2L', unread: true },
  { id: 'N2', emoji: '💰', title: 'Large withdrawal request', time: '24 min ago', body: 'User Vikram Singh requested withdrawal of ₹5,00,000', unread: true },
  { id: 'N3', emoji: '🚨', title: 'Exposure limit breach warning', time: '38 min ago', body: 'Mumbai vs Chennai exposure reached 96% of limit', unread: true },
  { id: 'N4', emoji: '👤', title: 'New franchise registered', time: '1h ago', body: 'Hyderabad Franchise pending approval', unread: false },
  { id: 'N5', emoji: '🔐', title: 'Failed login attempts', time: '2h ago', body: '5 failed attempts from IP 192.168.1.104', unread: false },
  { id: 'N6', emoji: '✅', title: 'KYC verified — 48 users', time: '3h ago', body: 'Bulk KYC verification completed', unread: false },
];
