import { apiRequest } from '../api';

export type SettingsSection =
  | 'general'
  | 'walletRules'
  | 'bettingLimits'
  | 'exposureLimits'
  | 'commissionRates'
  | 'smtp'
  | 'sms'
  | 'brand';

export type SettingsValues = Record<string, string | number | boolean | null | undefined>;

export type ApiKeyEntry = {
  _id: string;
  name: string;
  status: string;
  latency: number;
  /** Masked server-side. */
  key: string;
};

export type ApiSettings = Record<SettingsSection, SettingsValues> & {
  _id: string;
  apiKeys: ApiKeyEntry[];
  updatedAt: string;
};

type SettingsResponse = { settings: ApiSettings };

export const settingsApi = {
  get: (accessToken: string) => apiRequest<SettingsResponse>('/settings', { accessToken }),

  /** The backend `$set`s the whole section, so always send the complete object. */
  updateSection: (section: SettingsSection, values: SettingsValues, accessToken: string) =>
    apiRequest<SettingsResponse>(`/settings/${section}`, { method: 'PATCH', body: values, accessToken }),

  addApiKey: (payload: { name: string; key: string }, accessToken: string) =>
    apiRequest<SettingsResponse>('/settings/api-keys', { method: 'POST', body: payload, accessToken }),

  updateApiKey: (id: string, updates: Partial<Pick<ApiKeyEntry, 'name' | 'status' | 'key'>>, accessToken: string) =>
    apiRequest<SettingsResponse>(`/settings/api-keys/${id}`, { method: 'PATCH', body: updates, accessToken }),

  removeApiKey: (id: string, accessToken: string) =>
    apiRequest<SettingsResponse>(`/settings/api-keys/${id}`, { method: 'DELETE', accessToken }),
};
