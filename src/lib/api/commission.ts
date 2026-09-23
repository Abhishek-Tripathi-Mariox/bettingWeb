import { apiRequest } from '../api';

export type ApiCommissionLevel = 'Franchise' | 'Super Agent' | 'Agent';
export type ApiCommissionStatus = 'Pending' | 'Settled';

/** The entity ref on a commission row (`.populate('entity', 'name username role')`). */
export type ApiCommissionEntityRef = {
  _id: string;
  name: string;
  username: string;
  role: string;
};

export type ApiCommission = {
  _id: string;
  entity: string | ApiCommissionEntityRef;
  level: ApiCommissionLevel;
  /** "YYYY-MM". */
  period: string;
  turnover: number;
  /** Percent, e.g. 5 = 5%. */
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

  /** Recomputes every entity's commission for the current period. */
  recompute: (accessToken?: string | null) =>
    apiRequest<{ items: ApiCommission[] }>('/commission/recompute', { method: 'POST', accessToken }),

  settle: (id: string, accessToken?: string | null) =>
    apiRequest<{ commission: ApiCommission }>(`/commission/${id}/settle`, { method: 'POST', accessToken }),
};
