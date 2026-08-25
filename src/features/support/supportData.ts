import {
  AlertTriangleIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  HelpCircleIcon,
  SupportIcon,
  XCircleIcon,
} from '../../components/icons';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';

export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low';

export type TicketStatus =
  | 'Open'
  | 'In-progress'
  | 'Assigned'
  | 'Pending'
  | 'Resolved'
  | 'Closed';

export type Ticket = {
  id: string;
  subject: string;
  category: string;
  raisedBy: string;
  raisedByCode: string;
  role: string;
  priority: Priority;
  status: TicketStatus;
  created: string;
  updated: string;
  assignedTo: string;
};

export type Message = { author: string; time: string; body: string; fromSupport?: boolean };

export const TICKET_STATS: StatCardProps[] = [
  { label: 'Total Tickets', value: '7', caption: 'All time', icon: SupportIcon, accent: 'blue' },
  {
    label: 'Open Tickets',
    value: '2',
    caption: 'Awaiting action',
    delta: '+2 today vs yesterday',
    tone: 'up',
    icon: HelpCircleIcon,
    accent: 'cyan',
  },
  { label: 'In Progress', value: '1', caption: 'Being handled', icon: ClockIcon, accent: 'yellow' },
  {
    label: 'Resolved',
    value: '1',
    caption: 'This month',
    delta: '+8 this week vs yesterday',
    tone: 'up',
    icon: CheckCircleIcon,
    accent: 'green',
  },
  { label: 'Closed', value: '1', caption: 'Completed', icon: XCircleIcon, accent: 'neutral' },
  { label: 'High Priority', value: '4', caption: 'Urgent + High', icon: AlertTriangleIcon, accent: 'red' },
  { label: "Today's Tickets", value: '2', caption: 'Last 24 hours', icon: CalendarIcon, accent: 'violet' },
];

/**
 * rgb triplets per priority and status. Orange (#ff9800) and the muted grey
 * are not in tokens.css, so the pair lives here rather than as global tokens.
 */
export const PRIORITY_RGB: Record<Priority, string> = {
  Urgent: '239, 68, 68',
  High: '255, 152, 0',
  Medium: '250, 204, 21',
  Low: '34, 197, 94',
};

export const STATUS_RGB: Record<TicketStatus, string> = {
  Open: '33, 150, 243',
  'In-progress': '250, 204, 21',
  Assigned: '41, 182, 246',
  Pending: '255, 152, 0',
  Resolved: '184, 194, 204',
  Closed: '184, 194, 204',
};

export const STATUS_OPTIONS = ['All Status', 'Open', 'In-progress', 'Assigned', 'Pending', 'Resolved', 'Closed'];
export const PRIORITY_OPTIONS = ['All Priority', 'Urgent', 'High', 'Medium', 'Low'];

/** The queue from node 112:11927. */
export const TICKETS: Ticket[] = [
  { id: 'TKT-2401', subject: 'Deposit not credited for user Arjun Sharma', category: 'Deposit', raisedBy: 'Deepak Kumar', raisedByCode: 'A001', role: 'Agent', priority: 'High', status: 'Open', created: '21 Jul 10:42', updated: '21 Jul 11:15', assignedTo: 'Finance Team' },
  { id: 'TKT-2402', subject: 'Withdrawal request pending for 48 hours', category: 'Withdrawal', raisedBy: 'Deepak Kumar', raisedByCode: 'A001', role: 'Agent', priority: 'High', status: 'In-progress', created: '20 Jul 14:22', updated: '20 Jul 16:04', assignedTo: 'Finance Team' },
  { id: 'TKT-2403', subject: 'Unable to place bets on live match', category: 'Betting', raisedBy: 'Rohit Agarwal', raisedByCode: 'SA004', role: 'Super Agent', priority: 'Medium', status: 'Resolved', created: '19 Jul 18:00', updated: '20 Jul 09:12', assignedTo: 'Tech Team' },
  { id: 'TKT-2404', subject: 'Commission calculation discrepancy for June', category: 'Commission', raisedBy: 'Pooja Sharma', raisedByCode: 'A017', role: 'Agent', priority: 'Low', status: 'Open', created: '18 Jul 09:00', updated: '18 Jul 09:00', assignedTo: 'Unassigned' },
  { id: 'TKT-2405', subject: 'KYC verification stuck for 3 users', category: 'KYC', raisedBy: 'Sunita Kapoor', raisedByCode: 'SA009', role: 'Super Agent', priority: 'Medium', status: 'Assigned', created: '17 Jul 15:30', updated: '18 Jul 10:05', assignedTo: 'KYC Team' },
  { id: 'TKT-2406', subject: 'Account login issue for multiple users', category: 'Account', raisedBy: 'Karan Mehta', raisedByCode: 'A032', role: 'Agent', priority: 'Urgent', status: 'Closed', created: '15 Jul 08:00', updated: '16 Jul 12:40', assignedTo: 'Tech Team' },
  { id: 'TKT-2407', subject: 'Wallet balance mismatch after bet settlement', category: 'Wallet', raisedBy: 'Prakash Joshi', raisedByCode: 'SA012', role: 'Super Agent', priority: 'High', status: 'Pending', created: '22 Jul 09:15', updated: '22 Jul 09:15', assignedTo: 'Unassigned' },
];

/** Conversation on the open ticket — node 119:63200. */
export const TICKET_THREAD: Message[] = [
  {
    author: 'Deepak Kumar',
    time: '10:42 AM',
    body: 'User Arjun Sharma made a deposit of ₹50,000 via UPI but balance not credited after 2 hours. UTR: UTR4281938.',
  },
  {
    author: 'Support Admin',
    time: '11:15 AM',
    body: 'We are investigating the issue. Please share the full transaction screenshot.',
    fromSupport: true,
  },
];

/** Status transitions offered on the drawer — node 119:64128. */
export const TICKET_ACTIONS = [
  { label: 'Mark as In-progress', rgb: '250, 204, 21' },
  { label: 'Mark as Pending', rgb: '255, 152, 0' },
  { label: 'Mark as Waiting', rgb: '156, 39, 176' },
];
