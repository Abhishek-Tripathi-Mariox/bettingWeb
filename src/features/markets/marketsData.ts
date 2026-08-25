import { ActivityIcon, BanIcon, MarketsIcon, RiskIcon } from '../../components/icons';
import type { BadgeTone } from '../../components/ui/Badge/Badge';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';

/** Market kinds — each carries its own tinted label colour in the table. */
export type MarketType = 'Winner' | 'Over Under' | 'Fancy' | 'Session' | 'Bookmaker';

export type MarketStatus = 'Active' | 'Suspended';

export type MarketRow = {
  id: string;
  code: string;
  name: string;
  type: MarketType;
  backOdds: string;
  layOdds: string;
  bets: string;
  stake: string;
  exposure: string;
  maxBet: string;
  status: MarketStatus;
};

export const MARKET_STATS: StatCardProps[] = [
  {
    label: 'Active Markets',
    value: '248',
    caption: 'Across live events',
    icon: MarketsIcon,
    accent: 'blue',
    tinted: true,
  },
  { label: 'Total Bets', value: '12,841', caption: 'Open positions', icon: ActivityIcon, accent: 'cyan' },
  { label: 'Total Exposure', value: '₹42.6L', caption: 'Across all markets', icon: RiskIcon, accent: 'red' },
  { label: 'Suspended', value: '8', caption: 'Need review', icon: BanIcon, accent: 'yellow' },
];

export const MARKET_STATUS_TONE: Record<MarketStatus, BadgeTone> = {
  Active: 'success',
  Suspended: 'danger',
};

/** rgb triplet per type — one token drives both the wash and the label. */
export const MARKET_TYPE_RGB: Record<MarketType, string> = {
  Winner: '33, 150, 243',
  'Over Under': '41, 182, 246',
  Fancy: '250, 204, 21',
  Session: '34, 197, 94',
  Bookmaker: '255, 46, 99',
};

export const MARKET_TYPES = Object.keys(MARKET_TYPE_RGB) as MarketType[];

export const MARKET_STATUSES: MarketStatus[] = ['Active', 'Suspended'];

/** The event scopes the board is filtered by — node 112:5877. */
export const MARKET_SCOPES = ['IPL 2024', 'India vs Australia', 'Man City vs Arsenal'] as const;

/** The board from node 112:5525. */
export const MARKETS: MarketRow[] = [
  { id: 'MKT001', code: 'MKT001', name: 'Match Winner', type: 'Winner', backOdds: '1.90', layOdds: '1.92', bets: '3,241', stake: '₹18.7L', exposure: '₹8.2L', maxBet: '₹5L', status: 'Active' },
  { id: 'MKT002', code: 'MKT002', name: 'Toss Winner', type: 'Winner', backOdds: '1.98', layOdds: '2.02', bets: '1,842', stake: '₹4.2L', exposure: '₹1.8L', maxBet: '₹2L', status: 'Active' },
  { id: 'MKT003', code: 'MKT003', name: 'Over / Under 160 Runs', type: 'Over Under', backOdds: '1.75', layOdds: '1.78', bets: '892', stake: '₹2.1L', exposure: '₹0.9L', maxBet: '₹2L', status: 'Active' },
  { id: 'MKT004', code: 'MKT004', name: 'Top Mumbai Batsman', type: 'Fancy', backOdds: '3.50', layOdds: '3.60', bets: '412', stake: '₹1.4L', exposure: '₹2.1L', maxBet: '₹1L', status: 'Active' },
  { id: 'MKT005', code: 'MKT005', name: '1st Innings Score', type: 'Session', backOdds: '165', layOdds: '168', bets: '284', stake: '₹0.8L', exposure: '₹0.6L', maxBet: '₹50K', status: 'Suspended' },
  { id: 'MKT006', code: 'MKT006', name: 'Bookmaker (Match Winner)', type: 'Bookmaker', backOdds: '1.96', layOdds: '2.04', bets: '1,241', stake: '₹6.4L', exposure: '₹3.1L', maxBet: '₹10L', status: 'Active' },
];

/** Blank row behind the Add Market dialog — node 119:49597. */
export const NEW_MARKET: MarketRow = {
  id: 'new',
  code: '—',
  name: '',
  type: 'Winner',
  backOdds: '1.90',
  layOdds: '1.92',
  bets: '0',
  stake: '₹0',
  exposure: '₹0',
  maxBet: '₹1L',
  status: 'Active',
};
