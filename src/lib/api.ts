/** Base URL of the auth/authorization backend — see backend/README.md. */
const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000/api';

/** Thrown for any non-2xx response; `message` is the server's error message, ready to show the user. */
export class ApiRequestError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  accessToken?: string | null;
};

/** Bounds every request so a slow/unreachable API can't hang the UI (e.g. session restore on load). */
const REQUEST_TIMEOUT_MS = 10000;

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, accessToken } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch {
    throw new ApiRequestError(0, 'Unable to reach the server. Please check your connection.');
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 204) return undefined as T;

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = payload?.error?.message || `Request failed (${response.status})`;
    throw new ApiRequestError(response.status, message, payload?.error?.details);
  }

  return payload as T;
}

export type ApiRole = 'super-admin' | 'franchise' | 'super-agent' | 'agent' | 'player';

export type ApiUser = {
  _id: string;
  username: string;
  role: ApiRole;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  /** ISO date string, or null when not set. */
  dob: string | null;
  /** Data URI ("data:image/jpeg;base64,...") or '' when not set. */
  avatar: string;
  status: 'active' | 'suspended';
};

export type ProfileUpdate = Partial<{
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  /** ISO date string ("YYYY-MM-DD"). */
  dob: string;
  /** Data URI ("data:image/jpeg;base64,..."), PNG/JPEG/WebP only, ~1.5MB decoded max. */
  avatar: string;
}>;

export type PermissionGroup = {
  key: string;
  name: string;
  permissions: { key: string; name: string; description: string; grant: string }[];
};

export type AuthSession = {
  user: ApiUser;
  permissions: PermissionGroup[] | null;
  accessToken: string;
  refreshToken: string;
};

export const authApi = {
  login: (payload: { username: string; password: string; roleId?: string }) =>
    request<AuthSession>('/auth/login', { method: 'POST', body: payload }),

  me: (accessToken: string) =>
    request<{ user: ApiUser; permissions: PermissionGroup[] | null }>('/auth/me', { accessToken }),

  updateProfile: (accessToken: string, payload: ProfileUpdate) =>
    request<{ user: ApiUser; permissions: PermissionGroup[] | null }>('/auth/me', {
      method: 'PATCH',
      body: payload,
      accessToken,
    }),

  refresh: (refreshToken: string) =>
    request<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    }),

  logout: (refreshToken: string, accessToken?: string | null) =>
    request<void>('/auth/logout', { method: 'POST', body: { refreshToken }, accessToken }),

  changePassword: (accessToken: string, payload: { currentPassword: string; newPassword: string }) =>
    request<{ accessToken: string; refreshToken: string }>('/auth/change-password', {
      method: 'POST',
      body: payload,
      accessToken,
    }),
};

export { request as apiRequest, API_BASE_URL };
