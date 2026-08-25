import { AlertTriangleIcon, RiskIcon, TrendingUpIcon, UsersIcon } from '../../components/icons';
import type { BadgeTone } from '../../components/ui/Badge/Badge';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';

export type RiskLevel = 'Normal' | 'Warning' | 'Critical';

/**
 * Drives the exposure figure and the utilization bar, independently of the
 * badge — row 5 is green while its level reads Warning. The summary panels
 * add 'live' for the pink Large Pending card.
 */
export type RiskTone = 'success' | 'warning' | 'danger' | 'live';

export type ExposureRow = {
  id: string;
  emoji: string;
  market: string;
  /** Live marker beside the name — the pink dot in the design. */
  live?: boolean;
  exposure: string;
  limit: string;
  utilization: number;
  tone: RiskTone;
  activeBets: string;
  level: RiskLevel;
};

export type RiskPanel = {
  title: string;
  count: string;
  tone: RiskTone;
  items: string[];
};

export const RISK_STATS: StatCardProps[] = [
  { label: 'Net Exposure', value: '₹68.1L', caption: 'Across all markets', icon: RiskIcon, accent: 'red' },
  { label: 'Critical Markets', value: '2', caption: 'Require action', icon: AlertTriangleIcon, accent: 'live' },
  { label: 'Max Liability', value: '₹1.84Cr', caption: 'If all open bets win', icon: TrendingUpIcon, accent: 'yellow' },
  { label: 'High-Risk Users', value: '48', caption: 'Flagged this session', icon: UsersIcon, accent: 'red' },
];

export const RISK_LEVEL_TONE: Record<RiskLevel, BadgeTone> = {
  Normal: 'success',
  Warning: 'warning',
  Critical: 'danger',
};

/**
 * rgb triplets so a single custom property drives the solid colour (the
 * figure, the bar, the count) and the 13% border wash on the panels.
 */
export const RISK_TONE_RGB: Record<RiskTone, string> = {
  success: '34, 197, 94',
  warning: '250, 204, 21',
  danger: '239, 68, 68',
  live: '255, 46, 99',
};

/** The monitor from node 112:6245. */
export const EXPOSURE_ROWS: ExposureRow[] = [
  { id: 'RX1', emoji: '🏏', market: 'India vs Australia — Match Winner', exposure: '₹1.9Cr', limit: '₹2.5Cr', utilization: 75, tone: 'warning', activeBets: '1,842', level: 'Normal' },
  { id: 'RX2', emoji: '🏏', market: 'Mumbai vs Chennai — Match Winner', live: true, exposure: '₹2.4Cr', limit: '₹2.5Cr', utilization: 97, tone: 'danger', activeBets: '3,241', level: 'Critical' },
  { id: 'RX3', emoji: '⚽', market: 'Man City vs Arsenal — Match Result', exposure: '₹86.0L', limit: '₹1.5Cr', utilization: 57, tone: 'success', activeBets: '1,234', level: 'Normal' },
  { id: 'RX4', emoji: '🎾', market: 'Djokovic vs Alcaraz — Set Winner', exposure: '₹42.0L', limit: '₹1.0Cr', utilization: 42, tone: 'success', activeBets: '892', level: 'Normal' },
  { id: 'RX5', emoji: '🏏', market: 'IPL 2024 — Top Batsman', exposure: '₹1.2Cr', limit: '₹2.0Cr', utilization: 62, tone: 'success', activeBets: '2,841', level: 'Warning' },
];

export const RISK_PANELS: RiskPanel[] = [
  {
    title: 'High Risk Users',
    count: '48',
    tone: 'danger',
    items: ['Vikram Singh (Score: 94)', 'Rahul Verma (Score: 88)', 'Ankit Jain (Score: 82)'],
  },
  {
    title: 'Suspicious Patterns',
    count: '12',
    tone: 'warning',
    items: ['Multiple accounts: IP 192.168.1.x', 'Rapid bet placement: U007', 'Arbitrage pattern: U024'],
  },
  {
    title: 'Large Pending',
    count: '8',
    tone: 'live',
    items: ['₹5L withdrawal: Vikram Singh', '₹3L withdrawal: Franchise F003', '₹2.5L deposit: Unknown UTR'],
  },
];
