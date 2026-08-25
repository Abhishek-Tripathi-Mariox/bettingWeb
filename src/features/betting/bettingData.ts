import { ActivityIcon, EventsIcon, HashIcon, TrendUpIcon } from '../../components/icons';
import type { BadgeTone } from '../../components/ui/Badge/Badge';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';

export type MatchState = 'Live' | 'Upcoming' | 'Settled' | 'Open Bets';

export type MatchMarket = {
  name: string;
  meta: string;
  active: boolean;
};

export type MatchBet = {
  id: string;
  user: string;
  market: string;
  selection: string;
  odds: string;
  amount: string;
  when: string;
  status: { label: string; tone: BadgeTone };
};

export type Match = {
  id: string;
  emoji: string;
  name: string;
  league: string;
  meta: string;
  score: string;
  state: MatchState;
  markets: number;
  bets: string;
  stake: string;
  exposure: string;
  startTime: string;
  marketList: MatchMarket[];
  betList: MatchBet[];
};

export type ApiProvider = {
  name: string;
  latency: string;
  markets: string;
  uptime: string;
  status: { label: string; tone: BadgeTone };
  healthy: boolean;
};

export const BETTING_STATS: StatCardProps[] = [
  { label: 'Live Cricket', value: '6', caption: 'Matches in-play', icon: EventsIcon, accent: 'red' },
  { label: 'Open Bets', value: '6', caption: '₹42.6L stake', icon: ActivityIcon, accent: 'blue' },
  { label: "Today's Bets", value: '38,420', caption: '₹4.2Cr stake', delta: '+8.6% vs yesterday', tone: 'up', icon: TrendUpIcon, accent: 'green' },
  { label: 'Settled Today', value: '4', caption: '₹3.8Cr paid out', icon: HashIcon, accent: 'yellow' },
];

export const API_PROVIDERS: ApiProvider[] = [
  { name: 'Diamond Exchange', latency: '12ms', markets: '248 markets', uptime: '99.9%', status: { label: 'Active', tone: 'success' }, healthy: true },
  { name: 'Betfair Exchange', latency: '28ms', markets: '184 markets', uptime: '99.7%', status: { label: 'Active', tone: 'success' }, healthy: true },
  { name: 'Cricket API', latency: '—', markets: '0 markets', uptime: '—', status: { label: 'Inactive', tone: 'warning' }, healthy: false },
];

const MARKETS: MatchMarket[] = [
  { name: 'Match Winner', meta: 'Winner · 699 bets', active: true },
  { name: 'Toss Winner', meta: 'Winner · 331 bets', active: true },
  { name: '1st Innings Total', meta: 'Session · 257 bets', active: true },
  { name: 'Over/Under Runs', meta: 'Over Under · 221 bets', active: true },
  { name: 'Bookmaker', meta: 'Bookmaker · 184 bets', active: true },
];

const BETS: MatchBet[] = [
  { id: 'b1', user: 'Arjun Sharma', market: 'Match Winner', selection: 'India', odds: '1.88', amount: '₹50,000', when: '2 min ago', status: { label: 'open', tone: 'warning' } },
  { id: 'b2', user: 'Priya Patel', market: 'Toss Winner', selection: 'Australia', odds: '1.95', amount: '₹10,000', when: '4 min ago', status: { label: 'open', tone: 'warning' } },
  { id: 'b3', user: 'Rahul Verma', market: 'Over/Under', selection: 'Over 160', odds: '1.75', amount: '₹25,000', when: '6 min ago', status: { label: 'open', tone: 'warning' } },
  { id: 'b4', user: 'Vikram Singh', market: 'Match Winner', selection: 'India', odds: '1.90', amount: '₹1,00,000', when: '9 min ago', status: { label: 'open', tone: 'warning' } },
  { id: 'b5', user: 'Sneha Gupta', market: 'Bookmaker', selection: 'Australia', odds: '2.05', amount: '₹75,000', when: '12 min ago', status: { label: 'open', tone: 'warning' } },
];

/** The board from node 112:3861. */
const MATCHES: Match[] = [
  { id: 'M001', emoji: '🏏', name: 'India vs Australia', league: 'Test Match · Day 3', meta: 'Test Match · Day 3 · 14 markets · 1,842 bets', score: '🏏 IND 284/6 · AUS 198 all out', state: 'Live', markets: 14, bets: '1,842', stake: '₹12.4L', exposure: '₹4.8L', startTime: 'In Play', marketList: MARKETS, betList: BETS },
  { id: 'M002', emoji: '🏏', name: 'Mumbai vs Chennai', league: 'IPL 2024 · Match 48', meta: 'IPL 2024 · Match 48 · 22 markets · 3,241 bets', score: '🏏 MI 156/4 (16.2 ov) · CSK 184', state: 'Live', markets: 22, bets: '3,241', stake: '₹18.7L', exposure: '₹8.2L', startTime: 'In Play', marketList: MARKETS, betList: BETS },
  { id: 'M003', emoji: '🏏', name: 'Delhi vs Rajasthan', league: 'IPL 2024 · Match 47', meta: 'IPL 2024 · Match 47 · 18 markets · 2,184 bets', score: '🏏 DC 92/3 (9.4 ov) · RR 198/6', state: 'Live', markets: 18, bets: '2,184', stake: '₹14.2L', exposure: '₹5.6L', startTime: 'In Play', marketList: MARKETS, betList: BETS },
  { id: 'M004', emoji: '🏏', name: 'England vs New Zealand', league: 'ODI Series · Match 2', meta: 'ODI Series · Match 2 · 12 markets · 1,412 bets', score: '🏏 Starts 7:30 PM IST', state: 'Upcoming', markets: 12, bets: '1,412', stake: '₹6.3L', exposure: '₹2.1L', startTime: '7:30 PM IST', marketList: MARKETS, betList: BETS },
  { id: 'M005', emoji: '⚽', name: 'Man City vs Arsenal', league: 'EPL · Week 24', meta: 'EPL · Week 24 · 16 markets · 2,940 bets', score: '⚽ Starts 11:00 PM IST', state: 'Upcoming', markets: 16, bets: '2,940', stake: '₹9.8L', exposure: '₹3.4L', startTime: '11:00 PM IST', marketList: MARKETS, betList: BETS },
  { id: 'M006', emoji: '🏏', name: 'Kolkata vs Punjab', league: 'IPL 2024 · Match 46', meta: 'IPL 2024 · Match 46 · 20 markets · 2,610 bets', score: '🏏 KKR 201/4 · PBKS 178 all out', state: 'Settled', markets: 20, bets: '2,610', stake: '₹16.1L', exposure: '₹0', startTime: 'Completed', marketList: MARKETS, betList: BETS },
];

export const MATCH_TABS = ['Live', 'Upcoming', 'Settled', 'Open Bets'] as const;

export function getMatches(tab: string): Match[] {
  if (tab === 'Open Bets') return MATCHES.filter((match) => match.state !== 'Settled');
  return MATCHES.filter((match) => match.state === tab);
}
