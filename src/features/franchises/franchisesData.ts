import {
  BuildingIcon,
  CheckCircleIcon,
  DollarIcon,
  PercentIcon,
} from '../../components/icons';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';
import type { RoleDefinition, RoleId } from '../../config/roles';
import { formatCount } from '../../lib/format';

export type FranchiseStatus = 'Active' | 'Suspended';

export type Franchise = {
  id: string;
  code: string;
  name: string;
  owner: string;
  status: FranchiseStatus;
  superAgents: number;
  agents: number;
  users: string;
  revenue: string;
  credit: string;
  exposure: string;
  commission: string;
  phone: string;
  email: string;
  location: string;
  joined: string;
};

/** The four franchises from node 111:3. */
const FRANCHISES: Franchise[] = [
  {
    id: 'f1',
    code: 'F001',
    name: 'Mumbai Franchise',
    owner: 'Rajesh Mehta',
    status: 'Active',
    superAgents: 3,
    agents: 24,
    users: '1,842',
    revenue: '₹84.2L',
    credit: '₹2Cr',
    exposure: '₹42L',
    commission: '₹12.6L',
    phone: '+91 XXXXX XXXXX',
    email: 'mumbaifranchise@betmaster.com',
    location: 'Mumbai, MH',
    joined: 'Mar 2023',
  },
  {
    id: 'f2',
    code: 'F002',
    name: 'Delhi Franchise',
    owner: 'Suresh Sharma',
    status: 'Active',
    superAgents: 1,
    agents: 18,
    users: '1,240',
    revenue: '₹62.8L',
    credit: '₹1.5Cr',
    exposure: '₹28L',
    commission: '₹9.4L',
    phone: '+91 XXXXX XXXXX',
    email: 'delhifranchise@betmaster.com',
    location: '—, —',
    joined: 'Jan 2023',
  },
  {
    id: 'f3',
    code: 'F003',
    name: 'Bangalore Franchise',
    owner: 'Ankit Patel',
    status: 'Active',
    superAgents: 4,
    agents: 31,
    users: '2,481',
    revenue: '₹112.4L',
    credit: '₹3Cr',
    exposure: '₹58L',
    commission: '₹16.8L',
    phone: '+91 XXXXX XXXXX',
    email: 'bangalorefranchise@betmaster.com',
    location: 'Bengaluru, KA',
    joined: 'Jun 2023',
  },
  {
    id: 'f4',
    code: 'F004',
    name: 'Chennai Franchise',
    owner: 'Kiran Nair',
    status: 'Suspended',
    superAgents: 2,
    agents: 12,
    users: '842',
    revenue: '₹38.6L',
    credit: '₹1Cr',
    exposure: '₹19L',
    commission: '₹5.8L',
    phone: '+91 XXXXX XXXXX',
    email: 'chennaifranchise@betmaster.com',
    location: 'Chennai, TN',
    joined: 'Sep 2023',
  },
];

/** Lower roles see a slice of the network, as everywhere else in the app. */
const VISIBLE: Record<RoleId, number> = {
  'super-admin': 4,
  franchise: 1,
  'super-agent': 1,
  agent: 1,
};

export function getFranchiseView(role: RoleDefinition) {
  const franchises = FRANCHISES.slice(0, VISIBLE[role.id]);
  const active = franchises.filter((franchise) => franchise.status === 'Active').length;

  const stats: StatCardProps[] = [
    {
      label: 'Total Franchises',
      value: formatCount(franchises.length),
      caption: 'Across 18 states',
      icon: BuildingIcon,
      accent: 'blue',
    },
    {
      label: 'Active',
      value: formatCount(active),
      caption: 'Operational',
      delta: '+2 this month vs yesterday',
      tone: 'up',
      icon: CheckCircleIcon,
      accent: 'green',
    },
    {
      label: 'Total Revenue',
      value: '₹4.8Cr',
      caption: 'This month',
      delta: '+18.4% vs yesterday',
      tone: 'up',
      icon: DollarIcon,
      accent: 'yellow',
    },
    {
      label: 'Total Commission',
      value: '₹72.4L',
      caption: 'Paid this month',
      icon: PercentIcon,
      accent: 'cyan',
    },
  ];

  return { franchises, stats };
}

export const FRANCHISE_STATUS_TONE = { Active: 'success', Suspended: 'danger' } as const;

export const COMMISSION_TYPES = ['Flat', 'Slab based', 'Turnover based'] as const;

/* ------------------------------------------------------------------ *
 * Network below a franchise — drawer tabs (nodes 116:15541 … 116:20803)
 * ------------------------------------------------------------------ */

export type NetworkStat = { label: string; value: string; color: string };

/** One row in a network list: super agent, agent or user. */
export type NetworkPerson = {
  id: string;
  code: string;
  name: string;
  /** Second line after the code, e.g. a phone number or parent agent. */
  meta: string;
  status: FranchiseStatus;
  /** Avatar tint. */
  accent: string;
  stats: NetworkStat[];
};

export type SuperAgent = NetworkPerson & {
  franchiseName: string;
  tier: string;
  phone: string;
  email: string;
  joined: string;
  metrics: NetworkStat[];
  agents: NetworkPerson[];
  users: NetworkPerson[];
  performance: (NetworkStat & { delta: string })[];
};

export type FranchiseWallet = {
  credit: string;
  exposure: string;
  rows: NetworkStat[];
};

export type FranchiseSettings = {
  commissionPercentage: string;
  bettingLimit: string;
  maxExposure: string;
  settlementCycle: string;
};

const AVATAR_ACCENTS = [
  'var(--color-warning)',
  'var(--color-success)',
  'var(--color-primary-light)',
  'var(--color-primary)',
];

/** The Delhi network from the Figma frames; other franchises scale from it. */
function buildSuperAgents(franchise: Franchise): SuperAgent[] {
  return Array.from({ length: franchise.superAgents }, (_, index) => {
    const isDelhi = franchise.code === 'F002' && index === 0;
    const name = isDelhi ? 'Sunita Kapoor' : `${franchise.name.split(' ')[0]} SA ${index + 1}`;
    const code = `SA${String(2 + index).padStart(3, '0')}`;
    /** Agents this super agent runs; the sample book below lists two of them. */
    const agents = 2;
    /** Players across the whole book — the sample list shows a couple. */
    const users = Math.max(
      1,
      Math.round(Number(franchise.users.replace(/,/g, '')) / franchise.superAgents / 2.58),
    );

    return {
      id: `${franchise.id}-${code}`,
      code,
      name,
      meta: `+91 87654 2222${index}`,
      status: 'Active',
      accent: AVATAR_ACCENTS[index % AVATAR_ACCENTS.length],
      stats: [
        { label: 'Agents', value: String(agents), color: 'var(--color-primary-light)' },
        { label: 'Users', value: String(users), color: 'var(--color-success)' },
        { label: 'Turnover', value: '₹3.1Cr', color: 'var(--color-warning)' },
      ],
      franchiseName: franchise.name,
      tier: 'Regional',
      phone: `+91 87654 2222${index}`,
      email: `${name.split(' ')[0].toLowerCase()}@betmaster.com`,
      joined: 'Mar 2023',
      metrics: [
        { label: 'Total Agents', value: '2', color: 'var(--color-primary-light)' },
        { label: 'Total Users', value: '2', color: 'var(--color-success)' },
        { label: 'Turnover', value: '₹3.1Cr', color: 'var(--color-warning)' },
        { label: 'Commission', value: '₹31.0L', color: 'var(--color-success)' },
        { label: 'Credit Limit', value: '₹60L', color: 'var(--color-primary-light)' },
        { label: 'Exposure', value: '₹12L', color: 'var(--color-live)' },
      ],
      agents: [
        {
          id: `${code}-A002`,
          code: 'A002',
          name: 'Pooja Sharma',
          meta: 'A002',
          status: 'Active',
          accent: 'var(--color-success)',
          stats: [
            { label: 'Users', value: '62', color: 'var(--color-text)' },
            { label: 'Turnover', value: '₹34.2L', color: 'var(--color-warning)' },
          ],
        },
        {
          id: `${code}-A006`,
          code: 'A006',
          name: 'Ritu Singh',
          meta: 'A006',
          status: 'Active',
          accent: 'var(--color-danger)',
          stats: [
            { label: 'Users', value: '72', color: 'var(--color-text)' },
            { label: 'Turnover', value: '₹42.1L', color: 'var(--color-warning)' },
          ],
        },
      ],
      users: [
        {
          id: `${code}-U003`,
          code: 'U003',
          name: 'Rahul Verma',
          meta: 'U003 · Pooja Sharma',
          status: 'Suspended',
          accent: 'var(--color-danger)',
          stats: [
            { label: 'Balance', value: '₹12,400', color: 'var(--color-success)' },
            { label: 'Bets', value: '62', color: 'var(--color-text)' },
          ],
        },
        {
          id: `${code}-U004`,
          code: 'U004',
          name: 'Sneha Gupta',
          meta: 'U004 · Pooja Sharma',
          status: 'Active',
          accent: 'var(--color-primary-light)',
          stats: [
            { label: 'Balance', value: '₹5,81,200', color: 'var(--color-success)' },
            { label: 'Bets', value: '412', color: 'var(--color-text)' },
          ],
        },
      ],
      performance: [
        { label: 'This Month Turnover', value: '₹3.1Cr', color: 'var(--color-warning)', delta: '+16%' },
        { label: 'Commission Earned', value: '₹31.0L', color: 'var(--color-success)', delta: '+12%' },
        { label: 'Active Bets', value: '284', color: 'var(--color-primary-light)', delta: '+8%' },
        { label: 'Win Rate', value: '54.2%', color: 'var(--color-primary)', delta: '+2.1%' },
      ],
    };
  });
}

export function getSuperAgents(franchise: Franchise): SuperAgent[] {
  return buildSuperAgents(franchise);
}

export function getFranchiseWallet(franchise: Franchise): FranchiseWallet {
  return {
    credit: franchise.credit,
    exposure: franchise.exposure,
    rows: [
      { label: 'Total Revenue (July)', value: franchise.revenue, color: 'var(--color-success)' },
      { label: 'Commission Paid', value: franchise.commission, color: 'var(--color-warning)' },
      { label: 'Net P&L', value: '₹71.6L', color: 'var(--color-primary)' },
    ],
  };
}

export function getFranchiseSettings(franchise: Franchise): FranchiseSettings {
  return {
    commissionPercentage: '15%',
    bettingLimit: '₹5,00,000',
    maxExposure: franchise.exposure,
    settlementCycle: 'Weekly (Monday)',
  };
}
