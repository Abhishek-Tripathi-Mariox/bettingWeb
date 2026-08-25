import { AlertTriangleIcon, BanIcon, FingerprintIcon, LockIcon } from '../../components/icons';
import type { BadgeTone } from '../../components/ui/Badge/Badge';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';

export type LogStatus = 'Success' | 'Failed';

export type SecurityLog = {
  id: string;
  user: string;
  action: string;
  ip: string;
  device: string;
  time: string;
  status: LogStatus;
};

export type Session = {
  id: string;
  name: string;
  role: string;
  device: string;
  location: string;
  ip: string;
  duration: string;
  /** The viewer's own session — tinted green and not revocable. */
  own?: boolean;
};

export type AuditEntry = {
  id: string;
  actor: string;
  description: string;
  time: string;
  category: string;
  ip: string;
};

export type WhitelistEntry = {
  ip: string;
  label: string;
  added: string;
  status: 'Active' | 'Blocked';
};

export type SecurityToggle = {
  title: string;
  description: string;
  on: boolean;
  /** Track colour when on — the design varies it per row. */
  color: string;
};

export const SECURITY_STATS: StatCardProps[] = [
  { label: 'Active Sessions', value: '248', caption: 'Logged in users', icon: LockIcon, accent: 'green' },
  {
    label: 'Failed Logins',
    value: '42',
    caption: 'Last 24 hours',
    delta: '+8 today vs yesterday',
    tone: 'up',
    icon: AlertTriangleIcon,
    accent: 'yellow',
  },
  { label: 'Blocked IPs', value: '12', icon: BanIcon, accent: 'red' },
  { label: '2FA Enabled', value: '84%', caption: 'Of active users', icon: FingerprintIcon, accent: 'blue' },
];

export const SECURITY_TABS = ['Logs', 'Sessions', 'Audit', 'IP Whitelist', 'Settings'] as const;

export const LOG_STATUS_TONE: Record<LogStatus, BadgeTone> = {
  Success: 'success',
  Failed: 'danger',
};

/** Logs tab — node 112:10472. */
export const SECURITY_LOGS: SecurityLog[] = [
  { id: 'L1', user: 'Super Admin', action: 'Login', ip: '103.21.48.92', device: 'Chrome / Windows', time: '10:42 AM', status: 'Success' },
  { id: 'L2', user: 'Franchise F001', action: 'Login', ip: '182.74.92.11', device: 'Safari / macOS', time: '10:38 AM', status: 'Success' },
  { id: 'L3', user: 'Unknown', action: 'Login Attempt', ip: '192.168.1.104', device: 'Bot / Linux', time: '10:31 AM', status: 'Failed' },
  { id: 'L4', user: 'Unknown', action: 'Login Attempt', ip: '192.168.1.104', device: 'Bot / Linux', time: '10:29 AM', status: 'Failed' },
  { id: 'L5', user: 'Agent A042', action: 'Withdrawal Request', ip: '117.209.43.21', device: 'Android / Chrome', time: '10:24 AM', status: 'Success' },
  { id: 'L6', user: 'Super Admin', action: 'User Suspended', ip: '103.21.48.92', device: 'Chrome / Windows', time: '10:18 AM', status: 'Success' },
  { id: 'L7', user: 'Franchise F002', action: 'Login', ip: '98.42.10.81', device: 'Firefox / Windows', time: '10:10 AM', status: 'Success' },
];

/** Sessions tab — node 119:56949. */
export const SESSIONS: Session[] = [
  { id: 'S1', name: 'Ankit Sharma', role: 'Super Admin', device: 'Chrome / Windows', location: 'Mumbai', ip: '103.21.48.92', duration: '2h 14m active', own: true },
  { id: 'S2', name: 'Rajesh Mehta', role: 'Franchise', device: 'Safari / iPhone', location: 'Delhi', ip: '182.74.92.11', duration: '48m active' },
  { id: 'S3', name: 'Deepak Kumar', role: 'Agent', device: 'Chrome / Android', location: 'Pune', ip: '117.209.43.21', duration: '1h 8m active' },
  { id: 'S4', name: 'Suresh Sharma', role: 'Franchise', device: 'Firefox / Windows', location: 'Delhi', ip: '98.42.10.81', duration: '22m active' },
];

/** Audit tab — node 119:57459. */
export const AUDIT_TRAIL: AuditEntry[] = [
  { id: 'A1', actor: 'Super Admin', description: 'Suspended user U003 (Rahul Verma)', time: '10:18 AM today', category: 'User Management', ip: '103.21.48.92' },
  { id: 'A2', actor: 'Super Admin', description: 'Approved withdrawal WIT4818 ₹1,00,000', time: '09:42 AM today', category: 'Wallet', ip: '103.21.48.92' },
  { id: 'A3', actor: 'Super Admin', description: 'Updated betting limit: Max bet ₹5L → ₹10L', time: '09:30 AM today', category: 'Settings', ip: '103.21.48.92' },
  { id: 'A4', actor: 'Franchise F001', description: 'Created agent A-092 (Anand Mishra)', time: '08:48 AM today', category: 'Agent Management', ip: '182.74.92.11' },
  { id: 'A5', actor: 'Super Admin', description: 'Suspended market MKT005 (1st Innings Score)', time: '08:24 AM today', category: 'Markets', ip: '103.21.48.92' },
  { id: 'A6', actor: 'Super Admin', description: 'Published announcement: IPL 2024 Special Odds', time: 'Yesterday 4:12 PM', category: 'CMS', ip: '103.21.48.92' },
];

/** IP Whitelist tab — node 119:58016. */
export const WHITELIST: WhitelistEntry[] = [
  { ip: '103.21.48.92', label: 'Super Admin Office', added: '1 Jan 2024', status: 'Active' },
  { ip: '182.74.92.11', label: 'Franchise F001 HQ', added: '15 Jan 2024', status: 'Active' },
  { ip: '192.168.1.104', label: 'BLOCKED — Brute Force', added: '21 Jul 2024', status: 'Blocked' },
  { ip: '98.42.10.81', label: 'Franchise F002 Office', added: '5 Mar 2024', status: 'Active' },
  { ip: '117.209.43.21', label: 'Agent Office Mumbai', added: '20 Apr 2024', status: 'Active' },
];

/** Settings tab — node 119:58582. Each toggle carries its own on-colour. */
export const SECURITY_TOGGLES: SecurityToggle[] = [
  { title: 'Two-Factor Authentication', description: 'Require 2FA for all admin roles', on: true, color: 'var(--color-primary)' },
  { title: 'IP Whitelist Enforcement', description: 'Block all non-whitelisted IPs', on: false, color: 'var(--color-primary)' },
  { title: 'Session Timeout (30 min)', description: 'Auto-logout after 30 min idle', on: true, color: 'var(--color-warning)' },
  { title: 'Login Alerts (Email)', description: 'Email alert on each new login', on: true, color: 'var(--color-primary-light)' },
];

export const PASSWORD_POLICY = [
  { label: 'Minimum Length', value: '12 characters' },
  { label: 'Password Expiry', value: '90 days' },
  { label: 'Max Login Attempts', value: '5 attempts' },
  { label: 'Lockout Duration', value: '30 minutes' },
];
