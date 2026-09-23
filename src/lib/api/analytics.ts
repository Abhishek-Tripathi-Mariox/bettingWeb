import { apiRequest } from '../api';

export type AnalyticsDimension = 'revenue' | 'users' | 'sports' | 'commission';

/** revenue/users/commission are monthly series; sports is grouped by sport name. */
export type AnalyticsSeriesPoint = { month: string; value: number } | { sport: string; value: number };

export type AnalyticsSeriesResponse = {
  dimension: AnalyticsDimension;
  series: AnalyticsSeriesPoint[];
};

export type AnalyticsHighlights = {
  totalUsers: number;
  totalBets: number;
  totalTurnover: number;
  totalCommission: number;
};

export const analyticsApi = {
  series: (dimension: AnalyticsDimension, accessToken: string) =>
    apiRequest<AnalyticsSeriesResponse>(`/analytics/series?dimension=${dimension}`, { accessToken }),

  highlights: (accessToken: string) =>
    apiRequest<{ highlights: AnalyticsHighlights }>('/analytics/highlights', { accessToken }),
};
