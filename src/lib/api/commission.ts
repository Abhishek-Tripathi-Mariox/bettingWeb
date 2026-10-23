import { apiRequest } from '../api';

export type ApiCommissionLevel = 'Franchise' | 'Super Agent' | 'Agent' | 'Player';
export type ApiCommissionStatus = 'Pending' | 'Settled';
/** Session: markets decided during the match. Match: Match Odds / Bookmaker. */
export type ApiCommissionKind = 'Session' | 'Match';

type Ref = { _id: string; name?: string; username: string };

/** The entity ref on a commission row (`.populate('entity', 'name username role')`). */
export type ApiCommissionEntityRef = Ref & { role: string };

export type ApiCommission = {
  _id: string;
  entity: string | ApiCommissionEntityRef;
  level: ApiCommissionLevel;
  /** "YYYY-MM". */
  period: string;
  /** The match it was paid for. */
  event: (Ref & { name: string; startTime: string }) | string | null;
  /** The player whose bets earned it. */
  player: Ref | string | null;
  kind: ApiCommissionKind;
  /** What the rate applies to: the session stake or the player's match net loss. */
  turnover: number;
  /** Percent this account keeps, e.g. 0.5 = 0.5%. */
  rate: number;
  commission: number;
  status: ApiCommissionStatus;
  settledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListCommissionParams = {
  level?: ApiCommissionLevel;
  status?: ApiCommissionStatus;
  kind?: ApiCommissionKind;
};

function buildQuery(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const commissionApi = {
  list: (params: ListCommissionParams = {}, accessToken?: string | null) =>
    apiRequest<{ items: ApiCommission[] }>(`/commission${buildQuery(params)}`, { accessToken }),
};
