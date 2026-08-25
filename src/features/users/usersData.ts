import {
  BanIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
} from '../../components/icons';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';
import type { RoleDefinition, RoleId } from '../../config/roles';
import { formatCount } from '../../lib/format';

export type PersonStatus = 'Active' | 'Suspended' | 'Inactive';
export type KycStatus = 'Verified' | 'Pending' | 'Rejected';
export type RiskLevel = 'low' | 'medium' | 'high';

export type BetHistoryEntry = {
  id: string;
  event: string;
  market: string;
  amount: string;
  won: boolean;
  odds: string;
  stake: string;
  date: string;
};

export type LedgerEntry = {
  id: string;
  type: string;
  reference: string;
  /** "UPI · 21 Jul 10:42 AM" */
  meta: string;
  amount: string;
  positive: boolean;
  status: { label: string; tone: 'success' | 'warning' | 'danger' };
};

export type KycDocument = { label: string; value: string; state: KycStatus };

export type ActivityEvent = { id: string; title: string; detail: string; when: string };

export type DeviceSession = {
  id: string;
  name: string;
  kind: 'desktop' | 'mobile';
  ip: string;
  location: string;
  lastSeen: string;
  current: boolean;
};

export type Person = {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: string;
  totalBets: number;
  kyc: KycStatus;
  status: PersonStatus;
  risk: RiskLevel;
  joined: string;
  bets: BetHistoryEntry[];
  /** Owning agent — surfaced by the Franchise view (node 119:67293). */
  agent?: string;
  lastLogin?: string;
};

const BET_HISTORY: BetHistoryEntry[] = [
  { id: 'BET09241', event: 'India vs Australia', market: 'Match Winner · India', amount: '₹18,500', won: true, odds: '1.85', stake: '₹10,000', date: '21 Jul' },
  { id: 'BET09198', event: 'IPL — MI vs CSK', market: 'Match Winner · Mumbai', amount: '₹25,000', won: false, odds: '1.90', stake: '₹25,000', date: '20 Jul' },
  { id: 'BET09164', event: 'Man City vs Arsenal', market: 'Over 2.5 Goals · Over', amount: '₹14,000', won: true, odds: '1.75', stake: '₹8,000', date: '19 Jul' },
  { id: 'BET09121', event: 'Wimbledon SF', market: 'Match Winner · Djokovic', amount: '₹15,000', won: false, odds: '1.65', stake: '₹15,000', date: '18 Jul' },
  { id: 'BET09889', event: 'India vs NZ ODI', market: 'Toss Winner · India', amount: '₹9,900', won: true, odds: '1.98', stake: '₹5,000', date: '17 Jul' },
];

/** The eight platform users behind the Figma list (five are on page one). */
const USERS: Person[] = [
  { id: 'U001', name: 'Arjun Sharma', email: 'arjun@mail.com', phone: '+91 98765 43210', balance: '₹2,45,800', totalBets: 248, kyc: 'Verified', status: 'Active', risk: 'low', joined: '12 Mar 2024', agent: 'Deepak Kumar', lastLogin: '2h ago', bets: BET_HISTORY },
  { id: 'U002', name: 'Priya Patel', email: 'priya@mail.com', phone: '+91 87654 32109', balance: '₹89,200', totalBets: 124, kyc: 'Verified', status: 'Active', risk: 'low', joined: '02 Apr 2024', agent: 'Deepak Kumar', lastLogin: '5h ago', bets: BET_HISTORY.slice(0, 3) },
  { id: 'U003', name: 'Rahul Verma', email: 'rahul@mail.com', phone: '+91 76543 21098', balance: '₹12,400', totalBets: 62, kyc: 'Pending', status: 'Suspended', risk: 'high', joined: '19 Apr 2024', agent: 'Pooja Sharma', lastLogin: '3d ago', bets: BET_HISTORY.slice(1, 4) },
  { id: 'U004', name: 'Sneha Gupta', email: 'sneha@mail.com', phone: '+91 65432 10987', balance: '₹5,81,200', totalBets: 412, kyc: 'Verified', status: 'Active', risk: 'medium', joined: '27 Apr 2024', agent: 'Pooja Sharma', lastLogin: '1h ago', bets: BET_HISTORY },
  { id: 'U005', name: 'Amit Kumar', email: 'amit@mail.com', phone: '+91 54321 09876', balance: '₹34,800', totalBets: 89, kyc: 'Rejected', status: 'Active', risk: 'medium', joined: '05 May 2024', agent: 'Karan Mehta', lastLogin: '20m ago', bets: BET_HISTORY.slice(0, 2) },
  { id: 'U006', name: 'Kavitha Nair', email: 'kavitha@mail.com', phone: '+91 43210 98765', balance: '₹1,12,600', totalBets: 176, kyc: 'Verified', status: 'Active', risk: 'low', joined: '11 May 2024', agent: 'Karan Mehta', lastLogin: '6h ago', bets: BET_HISTORY.slice(2) },
  { id: 'U007', name: 'Vikram Singh', email: 'vikram@mail.com', phone: '+91 32109 87654', balance: '₹7,900', totalBets: 51, kyc: 'Pending', status: 'Inactive', risk: 'high', joined: '23 May 2024', agent: 'Pooja Sharma', lastLogin: '9d ago', bets: BET_HISTORY.slice(0, 1) },
  { id: 'U008', name: 'Rohan Mehta', email: 'rohan@mail.com', phone: '+91 21098 76543', balance: '₹0', totalBets: 0, kyc: 'Pending', status: 'Active', risk: 'low', joined: 'Today', agent: 'Deepak Kumar', lastLogin: 'Just now', bets: [] },
];

/** Downline listings reuse the same record shape with role-appropriate names. */
const DOWNLINE_NAMES: Record<string, string[]> = {
  franchise: ['Mumbai Central', 'Delhi North', 'Kolkata East', 'Chennai South', 'Pune West', 'Jaipur Hub'],
  'super-agent': ['Rakesh Kadam', 'Imran Sheikh', 'Vinod Patil', 'Deepak Rao', 'Nitin Yadav', 'Farhan Ali'],
  agent: ['Sahil Verma', 'Nitin Yadav', 'Farhan Ali', 'Kunal Joshi', 'Ajay Menon', 'Suresh Iyer'],
};

const PREFIX: Record<string, string> = { franchise: 'FR', 'super-agent': 'SA', agent: 'AG' };
const KYC_CYCLE: KycStatus[] = ['Verified', 'Verified', 'Pending', 'Verified', 'Rejected', 'Verified'];
const STATUS_CYCLE: PersonStatus[] = ['Active', 'Active', 'Suspended', 'Active', 'Inactive', 'Active'];
const RISK_CYCLE: RiskLevel[] = ['low', 'low', 'high', 'medium', 'medium', 'low'];

function buildDownline(segment: string): Person[] {
  return DOWNLINE_NAMES[segment].map((name, index) => ({
    id: `${PREFIX[segment]}-${1042 + index * 13}`,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@betmaster.in`,
    phone: `+91 9${formatCount(80000000 + index * 111111).replace(/,/g, '')}`,
    balance: `₹${formatCount(940000 - index * 128000)}`,
    totalBets: 4210 - index * 610,
    kyc: KYC_CYCLE[index],
    status: STATUS_CYCLE[index],
    risk: RISK_CYCLE[index],
    joined: `0${index + 1} Feb 2024`,
    bets: BET_HISTORY.slice(0, (index % 4) + 1),
  }));
}

/**
 * The Agent and Last Login columns appear for roles whose users sit under an
 * agent further down the tree — Franchise (node 119:67293) and Super Agent.
 * Super Admin's own list (node 79:3065) omits both, and an Agent's users are
 * its own, so neither adds anything there.
 */
/** Only panels that sit above the agents need to say which agent owns a user. */
export function showsAgentColumn(role: RoleDefinition): boolean {
  return role.manages === 'super-agent' || role.manages === 'agent';
}

/**
 * The platform-wide list is too broad for per-user recency; every downline
 * panel runs a small enough book to track it (nodes 119:67293, 139:93495,
 * 147:115519 all show the column, 79:3065 does not).
 */
export function showsLastLogin(role: RoleDefinition): boolean {
  return role.id !== 'super-admin';
}

const SHARE: Record<RoleId, number> = {
  'super-admin': 1,
  franchise: 0.16,
  'super-agent': 0.045,
  agent: 0.012,
};

/**
 * A list screen for any people-shaped segment: platform users, or the
 * franchises / super agents / agents directly below the signed-in role.
 */
export function getPeopleView(role: RoleDefinition, segment: string) {
  const share = SHARE[role.id];
  const count = (value: number) => formatCount(Math.max(1, value * share));

  if (segment !== 'users') {
    const people = buildDownline(segment);
    const label = role.nav.find((item) => item.segment === segment)?.label ?? 'Records';
    const stats: StatCardProps[] = [
      { label: `Total ${label}`, value: formatCount(people.length), caption: 'All time', icon: UsersIcon, accent: 'blue', tinted: true },
      { label: 'Active', value: formatCount(people.filter((person) => person.status === 'Active').length), caption: 'Today', icon: CheckCircleIcon, accent: 'green' },
      { label: 'Suspended', value: formatCount(people.filter((person) => person.status === 'Suspended').length), caption: 'Need review', icon: BanIcon, accent: 'red' },
      { label: 'KYC Pending', value: formatCount(people.filter((person) => person.kyc === 'Pending').length), caption: 'Awaiting verification', icon: ClockIcon, accent: 'yellow' },
    ];
    return { people, stats, noun: label.toLowerCase() };
  }

  const stats: StatCardProps[] = [
    { label: 'Total Users', value: count(24841), caption: 'All time', icon: UsersIcon, accent: 'blue', tinted: true },
    { label: 'Active Users', value: count(18241), caption: 'Today', delta: `+${count(342)} today vs yesterday`, tone: 'up', icon: CheckCircleIcon, accent: 'green' },
    { label: 'Suspended', value: count(284), caption: 'Need review', icon: BanIcon, accent: 'red' },
    { label: 'KYC Pending', value: count(1284), caption: 'Awaiting verification', icon: ClockIcon, accent: 'yellow' },
  ];

  return { people: USERS, stats, noun: 'users' };
}

/* ------------------------------------------------------------------ *
 * Drawer tabs — the Figma records, scoped to the person being viewed.
 * ------------------------------------------------------------------ */

const LEDGER: LedgerEntry[] = [
  { id: 'l1', type: 'Deposit', reference: 'UTR4281938', meta: 'UPI · 21 Jul 10:42 AM', amount: '+₹50,000', positive: true, status: { label: 'Success', tone: 'success' } },
  { id: 'l2', type: 'Withdrawal', reference: 'NEFT9182741', meta: 'Bank · 19 Jul 3:18 PM', amount: '-₹25,000', positive: false, status: { label: 'Success', tone: 'success' } },
  { id: 'l3', type: 'Deposit', reference: 'NEFT1928374', meta: 'NEFT · 15 Jul 11:24 AM', amount: '+₹1,00,000', positive: true, status: { label: 'Success', tone: 'success' } },
  { id: 'l4', type: 'Bet Win', reference: 'BET98241', meta: 'Wallet · 21 Jul 6:30 PM', amount: '+₹18,500', positive: true, status: { label: 'Success', tone: 'success' } },
];

const ACTIVITY: ActivityEvent[] = [
  { id: 'e1', title: 'Login', detail: 'Chrome / Windows · 103.21.48.92', when: '10:42 AM today' },
  { id: 'e2', title: 'Bet Placed', detail: '₹10,000 on India vs Australia', when: '10:24 AM today' },
  { id: 'e3', title: 'Deposit', detail: '₹50,000 via UPI — UTR4281938', when: '10:42 AM today' },
  { id: 'e4', title: 'Withdrawal', detail: '₹25,000 to HDFC Bank', when: '3:18 PM yesterday' },
  { id: 'e5', title: 'Profile Updated', detail: 'Phone number changed', when: '2 days ago' },
  { id: 'e6', title: 'KYC Submitted', detail: 'Aadhaar + PAN uploaded', when: '5 days ago' },
];

const DEVICES: DeviceSession[] = [
  { id: 'd1', name: 'Chrome 124 / Windows 11', kind: 'desktop', ip: '103.21.48.92', location: 'Mumbai, MH', lastSeen: 'Active now', current: true },
  { id: 'd2', name: 'Android Chrome / Samsung S23', kind: 'mobile', ip: '182.74.92.11', location: 'Pune, MH', lastSeen: '2h ago', current: false },
  { id: 'd3', name: 'Safari / iPhone 15', kind: 'mobile', ip: '117.209.43.21', location: 'Mumbai, MH', lastSeen: '3 days ago', current: false },
];

/** Ledger for one person — a brand-new account has no movements yet. */
export function getLedger(person: Person): LedgerEntry[] {
  return person.totalBets === 0 ? [] : LEDGER;
}

export function getKycFile(person: Person): { since: string; documents: KycDocument[] } {
  return {
    since: person.joined,
    documents: [
      { label: 'Aadhaar Card', value: '**** **** 8421', state: person.kyc },
      { label: 'PAN Card', value: 'ABCDE1234F', state: person.kyc },
      { label: 'Bank Account', value: 'HDFC •••• 4821', state: person.kyc },
    ],
  };
}

export function getActivity(person: Person): ActivityEvent[] {
  return person.totalBets === 0 ? ACTIVITY.slice(4) : ACTIVITY;
}

export function getDevices(person: Person): DeviceSession[] {
  return person.totalBets === 0 ? DEVICES.slice(0, 1) : DEVICES;
}

export const KYC_TONE = { Verified: 'success', Pending: 'warning', Rejected: 'danger' } as const;
export const STATUS_TONE = { Active: 'success', Suspended: 'danger', Inactive: 'neutral' } as const;
export const RISK_TONE = { low: 'success', medium: 'warning', high: 'danger' } as const;
