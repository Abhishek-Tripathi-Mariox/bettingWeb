import { ActivityIcon, CheckCircleIcon, ClockIcon, EventsIcon } from '../../components/icons';
import type { BadgeTone } from '../../components/ui/Badge/Badge';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';

export type EventStatus = 'Live' | 'Upcoming' | 'Completed';

export type EventMarket = {
  name: string;
  meta: string;
  active: boolean;
};

export type EventBet = {
  id: string;
  user: string;
  market: string;
  selection: string;
  odds: string;
  amount: string;
  when: string;
  status: { label: string; tone: BadgeTone };
};

export type ExposureRow = {
  market: string;
  amount: string;
  bets: string;
  percent: number;
};

export type SportEvent = {
  id: string;
  emoji: string;
  name: string;
  score: string;
  league: string;
  startTime: string;
  markets: number;
  bets: string;
  exposure: string;
  status: EventStatus;
  sport: string;
  marketList: EventMarket[];
  betList: EventBet[];
  exposureRows: ExposureRow[];
};

export const EVENT_STATS: StatCardProps[] = [
  { label: 'Live Events', value: '4', caption: 'Active now', icon: EventsIcon, accent: 'live' },
  { label: 'Upcoming Events', value: '4', caption: 'Next 24 hours', icon: ClockIcon, accent: 'cyan' },
  { label: 'Active Markets', value: '66', caption: 'Across live events', icon: ActivityIcon, accent: 'blue' },
  { label: 'Settled Today', value: '2', caption: 'Events completed', icon: CheckCircleIcon, accent: 'green' },
];

export const EVENT_STATUS_TONE: Record<EventStatus, BadgeTone> = {
  Live: 'danger',
  Upcoming: 'info',
  Completed: 'success',
};

const MARKETS: EventMarket[] = [
  { name: 'Match Winner', meta: 'Winner · 699 bets · Stake ₹9.2L', active: true },
  { name: 'Toss Winner', meta: 'Winner · 331 bets · Stake ₹3.3L', active: true },
  { name: '1st Innings Total', meta: 'Session · 257 bets · Stake ₹2.6L', active: true },
  { name: 'Over/Under 160 Runs', meta: 'Over Under · 221 bets · Stake ₹2.2L', active: false },
  { name: 'Top Batsman', meta: 'Fancy · 184 bets · Stake ₹1.8L', active: true },
  { name: 'Bookmaker (Match Winner)', meta: 'Bookmaker · 147 bets · Stake ₹1.5L', active: true },
];

const BETS: EventBet[] = [
  { id: 'b1', user: 'Arjun Sharma', market: 'Match Winner', selection: 'India', odds: '1.88', amount: '₹50,000', when: '2 min ago', status: { label: 'matched', tone: 'success' } },
  { id: 'b2', user: 'Priya Patel', market: 'Toss Winner', selection: 'Australia', odds: '1.95', amount: '₹10,000', when: '4 min ago', status: { label: 'matched', tone: 'success' } },
  { id: 'b3', user: 'Rahul Verma', market: '1st Innings Total', selection: 'Over 165', odds: '1.75', amount: '₹25,000', when: '7 min ago', status: { label: 'matched', tone: 'success' } },
  { id: 'b4', user: 'Amit Kumar', market: 'Match Winner', selection: 'India', odds: '1.90', amount: '₹1,00,000', when: '9 min ago', status: { label: 'pending', tone: 'warning' } },
  { id: 'b5', user: 'Sneha Gupta', market: 'Bookmaker', selection: 'Australia', odds: '2.05', amount: '₹75,000', when: '12 min ago', status: { label: 'matched', tone: 'success' } },
  { id: 'b6', user: 'Vikram Singh', market: 'Top Batsman', selection: 'Rohit Sharma', odds: '3.50', amount: '₹20,000', when: '15 min ago', status: { label: 'matched', tone: 'success' } },
];

const EXPOSURE: ExposureRow[] = [
  { market: 'Match Winner', amount: '₹9.2L', bets: '699 bets', percent: 89 },
  { market: 'Toss Winner', amount: '₹3.3L', bets: '331 bets', percent: 78 },
  { market: '1st Innings Total', amount: '₹2.6L', bets: '257 bets', percent: 61 },
  { market: 'Over/Under 160 Runs', amount: '₹2.2L', bets: '221 bets', percent: 50 },
  { market: 'Top Batsman', amount: '₹1.8L', bets: '184 bets', percent: 33 },
  { market: 'Bookmaker (Match Winner)', amount: '₹1.5L', bets: '147 bets', percent: 23 },
];

/** The board from node 112:4629. */
const EVENTS: SportEvent[] = [
  { id: 'EV001', emoji: '🏏', name: 'India vs Australia', score: 'IND 284/6 · AUS 198 all out', league: 'Test Match · Day 3', startTime: 'In Play', markets: 14, bets: '1,842', exposure: '₹12.4L', status: 'Live', sport: 'Cricket 🏏', marketList: MARKETS, betList: BETS, exposureRows: EXPOSURE },
  { id: 'EV002', emoji: '🏏', name: 'Mumbai vs Chennai', score: 'MI 156/4 (16.2 ov) · CSK 184', league: 'IPL 2024 · Match 48', startTime: 'In Play', markets: 22, bets: '3,241', exposure: '₹18.7L', status: 'Live', sport: 'Cricket 🏏', marketList: MARKETS, betList: BETS, exposureRows: EXPOSURE },
  { id: 'EV003', emoji: '🏏', name: 'Delhi vs Rajasthan', score: 'DC 98/3 (10.4 ov) · RR 172/8', league: 'IPL 2024 · Match 49', startTime: 'In Play', markets: 18, bets: '2,124', exposure: '₹9.1L', status: 'Live', sport: 'Cricket 🏏', marketList: MARKETS, betList: BETS, exposureRows: EXPOSURE },
  { id: 'EV004', emoji: '🏏', name: 'England vs New Zealand', score: 'ENG 243/6 (41 ov) · NZ 189', league: 'ODI Series · Match 2', startTime: 'In Play', markets: 12, bets: '1,412', exposure: '₹6.3L', status: 'Live', sport: 'Cricket 🏏', marketList: MARKETS, betList: BETS, exposureRows: EXPOSURE },
  { id: 'EV005', emoji: '🏏', name: 'Punjab vs Hyderabad', score: '', league: 'IPL 2024 · Match 50', startTime: 'Today 7:30 PM', markets: 0, bets: '0', exposure: '—', status: 'Upcoming', sport: 'Cricket 🏏', marketList: MARKETS, betList: BETS, exposureRows: EXPOSURE },
  { id: 'EV006', emoji: '🏏', name: 'Kolkata vs Bangalore', score: '', league: 'IPL 2024 · Match 51', startTime: 'Today 3:30 PM', markets: 0, bets: '0', exposure: '—', status: 'Upcoming', sport: 'Cricket 🏏', marketList: MARKETS, betList: BETS, exposureRows: EXPOSURE },
  { id: 'EV007', emoji: '🏏', name: 'Pakistan vs South Africa', score: '', league: 'T20 Series · Match 1', startTime: 'Tomorrow 8:00 PM', markets: 0, bets: '0', exposure: '—', status: 'Upcoming', sport: 'Cricket 🏏', marketList: MARKETS, betList: BETS, exposureRows: EXPOSURE },
  { id: 'EV008', emoji: '🏏', name: 'Sri Lanka vs Bangladesh', score: 'SL 178/9 · BAN 154 all out', league: 'T20 Series · Match 4', startTime: 'Completed', markets: 16, bets: '2,038', exposure: '—', status: 'Completed', sport: 'Cricket 🏏', marketList: MARKETS, betList: BETS, exposureRows: EXPOSURE },
];

export const EVENT_FILTERS = ['All', 'Live', 'Upcoming', 'Completed'] as const;

export function getEvents(filter: string): SportEvent[] {
  return filter === 'All' ? EVENTS : EVENTS.filter((event) => event.status === filter);
}

export const EVENT_COUNT = EVENTS.length + 2;
