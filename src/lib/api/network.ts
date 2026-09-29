import { apiRequest } from '../api';
import type { ApiUser } from '../api';

export type NetworkRole = 'franchise' | 'super-agent' | 'agent' | 'player';
export type CommissionType = 'Flat' | 'Slab based' | 'Turnover based';
export type SettlementCycle = 'Daily' | 'Weekly' | 'Monthly';
/** 'Not Submitted' until the player sends documents from the app; 'Pending' = awaiting review. */
export type KycState = 'Not Submitted' | 'Pending' | 'Verified' | 'Rejected';

export type AccountRef = {
  _id: string;
  name: string;
  username: string;
  businessName?: string;
  role: string;
};

export type AccountSummary = {
  franchises: number;
  superAgents: number;
  agents: number;
  players: number;
  bets: number;
  turnover: number;
  monthTurnover: number;
  prevMonthTurnover: number;
  exposure: number;
  openBets: number;
  won: number;
  lost: number;
  /** Percent of settled bets won, or null when nothing has settled yet. */
  winRate: number | null;
  commission: number;
  commissionPending: number;
  risk: 'low' | 'medium' | 'high';
  riskScore: number | null;
};

export type NetworkAccount = Omit<ApiUser, 'role'> & {
  role: NetworkRole | 'super-admin';
  kyc: KycState;
  walletBalance: number;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  businessName: string;
  /** Players and agents only. */
  referralCode?: string;
  creditLimit: number;
  commissionRate: number | null;
  /** The rate applied (own, else the platform default for the role) — on account detail only. */
  commissionRateInForce?: number | null;
  commissionType: CommissionType;
  bettingLimit: number;
  maxExposure: number;
  settlementCycle: SettlementCycle;
  shareHolding: number | null;
  matchCommission: number | null;
  myMatchCommission: number | null;
  sessionCommission: number | null;
  mySessionCommission: number | null;
  parent: AccountRef | null;
};

export type NetworkRow = NetworkAccount & { summary: AccountSummary };

export type Abilities = { create: boolean; edit: boolean; suspend: boolean };

export type NetworkListStats = {
  total: number;
  active: number;
  suspended: number;
  kycPending: number;
  players: number;
  turnover: number;
  monthTurnover: number;
  exposure: number;
  commission: number;
  balance: number;
};

export type NetworkList = {
  items: NetworkRow[];
  total: number;
  page: number;
  limit: number;
  stats: NetworkListStats;
  abilities: Abilities;
  /** Accounts a new one of this role can be created under (empty when it goes straight under the caller). */
  parentOptions: AccountRef[];
};

type Ref = { _id: string; name?: string; username: string } | string | null;

export type DetailBet = {
  _id: string;
  event: { _id: string; name: string; sport?: string } | string | null;
  market: { _id: string; name: string } | string | null;
  user: Ref;
  selection: string;
  odds: number;
  amount: number;
  status: 'Pending' | 'Won' | 'Lost' | 'Void';
  createdAt: string;
};

export type DetailTransaction = {
  _id: string;
  user: Ref;
  type: string;
  amount: number;
  method: string;
  reference: string;
  status: 'Pending' | 'Completed' | 'Failed';
  note: string;
  createdAt: string;
};

export type DetailActivity = {
  _id: string;
  actor: Ref;
  actorUsername: string;
  action: string;
  status: 'success' | 'failed';
  ip: string;
  userAgent: string;
  /** Extra facts about a review: the amount of a wallet request, a rejection reason. */
  metadata?: { amount?: number; reason?: string; documentType?: string };
  createdAt: string;
};

export type KycFile = { name: string; mime: string; data: string };

/** The player's latest KYC submission — only returned to roles with the "KYC Details" permission. */
export type KycSubmission = {
  _id: string;
  referenceId: string;
  fullName: string;
  /** 10-digit mobile; '' on submissions made before the field existed. */
  phone: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  documentType: string;
  documentNumber: string;
  front: KycFile;
  back: KycFile | null;
  status: 'Pending' | 'Verified' | 'Rejected';
  rejectionReason: string;
  reviewedBy: { _id: string; name?: string; username: string } | null;
  reviewedAt: string | null;
  createdAt: string;
};

export type DetailSession = { _id: string; ip: string; userAgent: string; createdAt: string; updatedAt: string };

export type NetworkDetail = {
  account: NetworkAccount;
  /** Nearest first, stopping below super-admin. */
  ancestors: AccountRef[];
  summary: AccountSummary;
  downline: Record<'superAgents' | 'agents' | 'players', { total: number; items: NetworkRow[] }>;
  wallet: { balance: number; deposited: number; withdrawn: number; commissionEarned: number; commissionPending: number };
  bets: DetailBet[];
  transactions: DetailTransaction[];
  activity: DetailActivity[];
  sessions: DetailSession[];
  abilities: Abilities;
  /** null when never submitted or when the viewer lacks the KYC Details permission. */
  kycSubmission: KycSubmission | null;
};

export type AccountDraft = Partial<{
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  dob: string;
  kyc: KycState;
  /** Sent with kyc: 'Rejected' — shown to the player in the app. */
  kycRejectionReason: string;
  businessName: string;
  creditLimit: number;
  commissionRate: number | null;
  commissionType: CommissionType;
  bettingLimit: number;
  maxExposure: number;
  settlementCycle: SettlementCycle;
  shareHolding: number | null;
  matchCommission: number | null;
  myMatchCommission: number | null;
  sessionCommission: number | null;
  mySessionCommission: number | null;
}>;

export type CreateAccountPayload = AccountDraft & {
  role: NetworkRole;
  username: string;
  password: string;
  parentId?: string;
};

/** How one agent in the caller's book is doing today. */
export type DashboardAgent = {
  _id: string;
  name: string;
  username: string;
  status: 'active' | 'suspended';
  walletBalance: number;
  users: number;
  todayBets: number;
  todayStake: number;
  /** Stake riding on its users' open bets. */
  exposure: number;
  /** Deposits / withdrawals waiting for a decision. */
  pendingRequests: number;
};

export type MyDashboard = {
  /** One row per agent under the caller — empty on an agent's own dashboard. */
  agents: DashboardAgent[];
  /** One row per super agent (the sum of its agents) — only a franchise has any. */
  superAgents: (DashboardAgent & { agents: number })[];
  /** Code the agent shares so new app sign-ups land on its panel. */
  referralCode: string | null;
  /** Percent used for the commission estimates (own rate, else the platform default for the role). */
  commissionRate: number;
  stats: {
    totalUsers: number;
    activeToday: number;
    activeYesterday: number;
    walletBalance: number;
    todayBets: number;
    yesterdayBets: number;
    todayStake: number;
    todayCommission: number;
    yesterdayCommission: number;
    todayRevenue: number;
    yesterdayRevenue: number;
    pendingDeposits: { count: number; amount: number };
    pendingWithdrawals: { count: number; amount: number };
  };
  overview: {
    totalUsers: number;
    activeToday: number;
    kycVerified: number;
    kycPending: number;
    suspended: number;
    newThisMonth: number;
    newLastMonth: number;
  };
  /** Last 7 days, oldest first; `date` is YYYY-MM-DD (IST). */
  commissionWeek: { date: string; stake: number; commission: number }[];
  activity: { kind: string; description: string; at: string }[];
  transactions: { id: string; user: string; type: string; method: string; amount: number; status: string; at: string }[];
};

/** The signed-in account's Profile page (GET /network/me/profile). */
export type MyProfile = {
  stats: { totalActions: number; loginCount: number; lastLoginAt: string | null; memberSince: string };
  activity: (DetailActivity & { target: Ref })[];
  logins: DetailActivity[];
  sessions: DetailSession[];
  currentUserAgent: string;
  /** Staff only — super-admin has no wallet. */
  wallet: (NetworkDetail['wallet'] & { transactions: DetailTransaction[] }) | null;
  preferences: Record<string, boolean>;
  /** The limits that apply to this account's book — own value, else the platform default. */
  limits: {
    commissionRate: { value: number | null; isDefault: boolean };
    bettingLimit: { value: number | null; isDefault: boolean };
    minBet: number | null;
    maxExposure: number | null;
    maxUserExposure: number | null;
    creditLimit: number | null;
    walletRules: { minDeposit: number; maxDeposit: number; minWithdrawal: number; maxWithdrawal: number } | null;
  };
};

export const networkApi = {
  myProfile: (accessToken: string) => apiRequest<MyProfile>('/network/me/profile', { accessToken }),

  /** The signed-in account's own dashboard, scoped to its players. */
  myDashboard: (accessToken: string) => apiRequest<MyDashboard>('/network/dashboard', { accessToken }),

  list: (
    params: { role: NetworkRole; status?: 'active' | 'suspended'; kyc?: KycState; q?: string; page?: number; limit?: number },
    accessToken: string,
  ) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') search.set(key, String(value));
    }
    return apiRequest<NetworkList>(`/network/accounts?${search.toString()}`, { accessToken });
  },

  detail: (id: string, accessToken: string) => apiRequest<NetworkDetail>(`/network/accounts/${id}`, { accessToken }),

  create: (payload: CreateAccountPayload, accessToken: string) =>
    apiRequest<{ account: NetworkAccount }>('/accounts', { method: 'POST', body: payload, accessToken }),

  update: (id: string, payload: AccountDraft, accessToken: string) =>
    apiRequest<{ account: NetworkAccount }>(`/accounts/${id}`, { method: 'PATCH', body: payload, accessToken }),

  /** Super-admin only for other people's sessions (DELETE /auth/sessions/:id). */
  revokeSession: (sessionId: string, accessToken: string) =>
    apiRequest<unknown>(`/auth/sessions/${sessionId}`, { method: 'DELETE', accessToken }),

  setStatus: (id: string, status: 'active' | 'suspended', accessToken: string) =>
    apiRequest<{ account: NetworkAccount }>(`/accounts/${id}/status`, { method: 'PATCH', body: { status }, accessToken }),
};

/** "Name (username)" — how an account is shown in pickers. */
export const accountLabel = (ref: Pick<AccountRef, 'name' | 'username' | 'businessName'>) =>
  `${ref.businessName || ref.name || ref.username} (${ref.username})`;

/** Display name: trading name for staff when set, else the person's name, else username. */
export const displayName = (ref: Pick<AccountRef, 'name' | 'username' | 'businessName'> | null | undefined) =>
  ref ? ref.businessName || ref.name || ref.username : '—';
