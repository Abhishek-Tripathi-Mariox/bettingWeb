import { BuildingIcon, CommissionIcon, GiftIcon, UsersCogIcon } from '../../components/icons';
import type { BadgeTone } from '../../components/ui/Badge/Badge';
import type { DonutSlice } from '../../components/charts/DonutChart';
import type { StatCardProps } from '../../components/ui/StatCard/StatCard';
import { formatMoney } from '../../lib/format';
import type { ApiCommission, ApiCommissionEntityRef, ApiCommissionLevel, ApiCommissionStatus } from '../../lib/api/commission';

export type CommissionLevel = 'Franchise' | 'Super Agent' | 'Agent';

export type SettlementStatus = 'Settled' | 'Pending';

export type CommissionRow = {
  id: string;
  entity: string;
  level: CommissionLevel;
  turnover: string;
  rate: string;
  commission: string;
  status: SettlementStatus;
};

export const COMMISSION_LEVELS: ApiCommissionLevel[] = ['Franchise', 'Super Agent', 'Agent'];
export const COMMISSION_STATUSES: ApiCommissionStatus[] = ['Pending', 'Settled'];

function entityLabel(ref: string | ApiCommissionEntityRef): string {
  return typeof ref === 'string' ? ref : (ref.name || ref.username || ref._id);
}

/** Maps live `/commission` rows onto the same `CommissionRow` shape the table already renders — no markup changes needed. */
export function mapCommissionRows(items: ApiCommission[]): CommissionRow[] {
  return items.map((item) => ({
    id: item._id,
    entity: entityLabel(item.entity),
    level: item.level,
    turnover: formatMoney(item.turnover),
    rate: `${item.rate}%`,
    commission: formatMoney(item.commission),
    status: item.status,
  }));
}

/** Stat cards derived from the currently loaded (filtered) commission rows — same 4 slots as the dummy `COMMISSION_STATS`. */
export function commissionStats(items: ApiCommission[], viewerUsername?: string): StatCardProps[] {
  const sum = (rows: ApiCommission[]) => rows.reduce((acc, item) => acc + item.commission, 0);
  // A network role reads this page as "what I earn" first, then what its downline earns.
  if (viewerUsername) {
    const isMine = (item: ApiCommission) => typeof item.entity !== 'string' && item.entity.username === viewerUsername;
    const mine = items.filter(isMine);
    const downline = items.filter((item) => !isMine(item));
    const myTurnover = mine.filter((item) => item.status === 'Pending').reduce((acc, item) => acc + item.turnover, 0);
    return [
      {
        label: 'My Commission',
        value: formatMoney(sum(mine.filter((item) => item.status === 'Pending'))),
        caption: `On ${formatMoney(myTurnover)} turnover, not yet settled`,
        icon: CommissionIcon,
        accent: 'blue',
        tinted: true,
      },
      {
        label: 'Paid to Me',
        value: formatMoney(sum(mine.filter((item) => item.status === 'Settled'))),
        caption: 'Settled into my wallet',
        icon: GiftIcon,
        accent: 'green',
      },
      {
        label: "My Downline's Commission",
        value: formatMoney(sum(downline)),
        caption: downline.length ? `${downline.length} row${downline.length === 1 ? '' : 's'} below me` : 'Nobody below me earns commission',
        icon: UsersCogIcon,
        accent: 'cyan',
      },
      {
        label: 'Pending Settlement',
        value: formatMoney(sum(items.filter((item) => item.status === 'Pending'))),
        caption: 'Awaiting settlement by admin',
        icon: BuildingIcon,
        accent: 'yellow',
      },
    ];
  }
  const total = items.reduce((sum, item) => sum + item.commission, 0);
  const franchise = items.filter((item) => item.level === 'Franchise').reduce((sum, item) => sum + item.commission, 0);
  const agent = items.filter((item) => item.level === 'Agent').reduce((sum, item) => sum + item.commission, 0);
  const pending = items.filter((item) => item.status === 'Pending').reduce((sum, item) => sum + item.commission, 0);
  const pct = (value: number) => (total > 0 ? `${Math.round((value / total) * 100)}%` : '0%');

  return [
    {
      label: 'Total Commission',
      value: formatMoney(total),
      caption: 'Current view',
      icon: CommissionIcon,
      accent: 'blue',
      tinted: true,
    },
    { label: 'Franchise Share', value: formatMoney(franchise), caption: pct(franchise), icon: BuildingIcon, accent: 'cyan' },
    { label: 'Agent Share', value: formatMoney(agent), caption: pct(agent), icon: UsersCogIcon, accent: 'green' },
    { label: 'Pending Settlement', value: formatMoney(pending), caption: 'Awaiting settlement', icon: GiftIcon, accent: 'yellow' },
  ];
}

const LEVEL_COLOR: Record<ApiCommissionLevel, string> = {
  Franchise: '#2196f3',
  'Super Agent': '#29b6f6',
  Agent: '#22c55e',
};

/**
 * Ring + legend, grouped by level. `DonutChart` normalises each slice against
 * the sum of `data` itself, so raw commission totals are passed as-is — no
 * "Platform" slice, since the backend has no such concept.
 */
export function commissionSplit(items: ApiCommission[]): DonutSlice[] {
  return COMMISSION_LEVELS.map((level) => ({
    label: level,
    value: items.filter((item) => item.level === level).reduce((sum, item) => sum + item.commission, 0),
    color: LEVEL_COLOR[level],
  })).filter((slice) => slice.value > 0);
}


export const SETTLEMENT_TONE: Record<SettlementStatus, BadgeTone> = {
  Settled: 'info',
  Pending: 'warning',
};


