import { BettingIcon, TargetIcon, TrendingUpIcon, UsersIcon } from '../../components/icons';
import type { ChartPoint } from '../../components/charts/AreaChart';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';

export type Highlight = {
  label: string;
  name: string;
  value: string;
  /** rgb triplet driving the value colour and the 13% border wash. */
  rgb: string;
};

export const ANALYTICS_STATS: StatCardProps[] = [
  {
    label: 'Revenue Growth',
    value: '+42.8%',
    caption: 'vs last quarter',
    icon: TrendingUpIcon,
    accent: 'green',
    tinted: true,
  },
  { label: 'User Growth', value: '+36.5%', caption: 'vs last quarter', icon: UsersIcon, accent: 'blue' },
  { label: 'Bet Volume', value: '+28.4%', caption: 'vs last quarter', icon: BettingIcon, accent: 'cyan' },
  {
    label: 'Avg. Session',
    value: '24.8 min',
    caption: '+3.2 min vs last month',
    icon: TargetIcon,
    accent: 'yellow',
  },
];

export const ANALYTICS_TABS = ['Revenue', 'Users', 'Sports', 'Commission'] as const;

/**
 * Trend behind each tab — node 112:9261. The Figma frame embeds a Recharts
 * render; per the project's chart rule these are real numbers driving the
 * project's own SVG AreaChart instead of a pasted image.
 */
export const ANALYTICS_SERIES: Record<string, ChartPoint[]> = {
  Revenue: [
    { label: 'Jan', value: 3_200_000 },
    { label: 'Feb', value: 4_100_000 },
    { label: 'Mar', value: 4_800_000 },
    { label: 'Apr', value: 5_600_000 },
    { label: 'May', value: 6_200_000 },
    { label: 'Jun', value: 6_900_000 },
    { label: 'Jul', value: 7_600_000 },
  ],
  Users: [
    { label: 'Jan', value: 1_800_000 },
    { label: 'Feb', value: 2_300_000 },
    { label: 'Mar', value: 2_900_000 },
    { label: 'Apr', value: 3_400_000 },
    { label: 'May', value: 4_100_000 },
    { label: 'Jun', value: 4_600_000 },
    { label: 'Jul', value: 5_200_000 },
  ],
  Sports: [
    { label: 'Jan', value: 2_400_000 },
    { label: 'Feb', value: 3_100_000 },
    { label: 'Mar', value: 3_600_000 },
    { label: 'Apr', value: 4_200_000 },
    { label: 'May', value: 5_100_000 },
    { label: 'Jun', value: 5_800_000 },
    { label: 'Jul', value: 6_400_000 },
  ],
  Commission: [
    { label: 'Jan', value: 900_000 },
    { label: 'Feb', value: 1_200_000 },
    { label: 'Mar', value: 1_500_000 },
    { label: 'Apr', value: 1_800_000 },
    { label: 'May', value: 2_100_000 },
    { label: 'Jun', value: 2_400_000 },
    { label: 'Jul', value: 2_800_000 },
  ],
};

/** The three highlight cards under the chart — node 112:9342. */
export const ANALYTICS_HIGHLIGHTS: Highlight[] = [
  { label: 'Top Franchise', name: 'Bangalore Franchise', value: '₹1.12Cr', rgb: '34, 197, 94' },
  { label: 'Top Market', name: 'IPL 2024 — Match Winner', value: '₹18.7L', rgb: '33, 150, 243' },
  { label: 'Top Agent', name: 'Agent A-089 · Deepak', value: '+284%', rgb: '41, 182, 246' },
];
