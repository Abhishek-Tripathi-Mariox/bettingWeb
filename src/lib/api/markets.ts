import { apiRequest } from '../api';

export type ApiMarketStatus = 'Active' | 'Suspended';

/** The event ref on a market as populated by `GET /markets` (`.populate('event', 'name sport status')`). */
export type ApiMarketEventRef = {
  _id: string;
  name: string;
  sport: string;
  status: string;
};

export type ApiMarket = {
  _id: string;
  /** A populated ref on list responses, a bare id string when just created/updated. */
  event: string | ApiMarketEventRef;
  code: string;
  name: string;
  type: string;
  backOdds: number;
  layOdds: number;
  maxBet: number;
  maxExposure: number;
  status: ApiMarketStatus;
  /** Backable selections; empty = the event's two sides at back / lay odds. */
  runners?: { name: string; odds: number }[];
  /** Set once the market is settled. */
  winner?: string | null;
  settledAt?: string | null;
  /** Cached rollups from this market's bets. */
  bets: number;
  stake: number;
  exposure: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateMarketPayload = {
  event: string;
  code: string;
  name: string;
  type?: string;
  backOdds?: number;
  layOdds?: number;
  maxBet?: number;
  maxExposure?: number;
  status?: ApiMarketStatus;
  /** What players can back, each at its own price. Back / lay odds follow the first two. */
  runners?: { name: string; odds: number }[];
};

export type UpdateMarketPayload = Partial<Omit<CreateMarketPayload, 'event'>>;

export type ListMarketsParams = {
  eventId?: string;
  status?: ApiMarketStatus;
  type?: string;
};

function buildQuery(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const marketsApi = {
  list: (params: ListMarketsParams = {}, accessToken?: string | null) =>
    apiRequest<{ markets: ApiMarket[] }>(`/markets${buildQuery(params)}`, { accessToken }),

  create: (payload: CreateMarketPayload, accessToken?: string | null) =>
    apiRequest<{ market: ApiMarket }>('/markets', { method: 'POST', body: payload, accessToken }),

  /** Partial update — PATCH /markets/:id. */
  update: (id: string, payload: UpdateMarketPayload, accessToken?: string | null) =>
    apiRequest<{ market: ApiMarket }>(`/markets/${id}`, { method: 'PATCH', body: payload, accessToken }),

  updateStatus: (id: string, status: ApiMarketStatus, accessToken?: string | null) =>
    apiRequest<{ market: ApiMarket }>(`/markets/${id}/status`, {
      method: 'PATCH',
      body: { status },
      accessToken,
    }),

  /** Settles every open bet on the market with `winner` and closes it for good. */
  settle: (id: string, winner: string, accessToken?: string | null) =>
    apiRequest<{ market: ApiMarket; settled: number; won: number; lost: number }>(`/markets/${id}/settle`, {
      method: 'POST',
      body: { winner },
      accessToken,
    }),

  /** Bulk-suspends every Active market. Response is `{ modifiedCount }` — see market.service.js#suspendAll. */
  suspendAll: (accessToken?: string | null) =>
    apiRequest<{ modifiedCount: number }>('/markets/suspend-all', { method: 'POST', accessToken }),
};
