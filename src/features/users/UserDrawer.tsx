import { usePermissions } from '../auth/usePermissions';
import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  BanIcon,
  CalendarIcon,
  CheckCircleIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  MonitorIcon,
  PencilIcon,
  PhoneIcon,
  PulseIcon,
  SmartphoneIcon,
  UserCheckIcon,
  UserIcon,
  XCircleIcon,
} from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { Drawer } from '../../components/ui/Drawer/Drawer';
import { MetricTile } from '../../components/ui/MetricTile/MetricTile';
import { Tabs } from '../../components/ui/Tabs/Tabs';
import { useAuth } from '../auth/authContext';
import { ApiRequestError } from '../../lib/api';
import { displayName, networkApi } from '../../lib/api/network';
import type { DetailBet, KycState, NetworkDetail } from '../../lib/api/network';
import { useNetworkDetail } from './useNetworkList';
import { formatIp, formatMobile, formatRelativeTime, formatRupees } from '../../lib/format';
import { AddUserModal } from './AddUserModal';
import {
  ACTIVITY_TITLE,
  KYC_TONE,
  RISK_TONE,
  STATUS_TONE,
  describeUserAgent,
  formatDate,
  statusLabel,
  activityExtras,
} from './usersData';
import styles from './UserDrawer.module.css';

const TABS = ['Overview', 'Bets', 'Transactions', 'Kyc', 'Activity', 'Devices'] as const;
type Tab = (typeof TABS)[number];

const errorMessage = (err: unknown) =>
  err instanceof ApiRequestError ? err.message : 'Unable to reach the server.';

export type UserDrawerProps = {
  accountId: string;
  /** Section to open on, e.g. straight to the bet history. */
  defaultTab?: Tab;
  /** Franchise and Super Agent also see the owning agent (node 119:68771). */
  showAgent?: boolean;
  /** Called after any change so the list behind can refresh. */
  onChanged?: () => void;
  onClose: () => void;
};

/** User record sheet from nodes 79:6144 (overview) and 79:12933 (bets). */
export function UserDrawer({ accountId, defaultTab = 'Overview', showAgent = false, onChanged, onClose }: UserDrawerProps) {
  const { accessToken } = useAuth();
  const { detail, error, setError, reload: load } = useNetworkDetail(accountId);
  const [tab, setTab] = useState<Tab>(defaultTab);
  const { can } = usePermissions();
  // Tabs follow the Permissions page: View Bets, Wallet Balance (ledger) and KYC Details.
  const visibleTabs = TABS.filter(
    (name) =>
      (name !== 'Bets' || can('bettingMarkets', 'viewBets', 'V')) &&
      (name !== 'Transactions' || can('finance', 'walletBalance', 'V')) &&
      (name !== 'Kyc' || can('userManagement', 'kycDetails', 'V')),
  );
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState(false);

  const run = async (action: () => Promise<unknown>) => {
    setPending(true);
    setError(null);
    try {
      await action();
      await load();
      onChanged?.();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  };

  if (!detail) {
    return (
      <Drawer label="User details" onClose={onClose} header={<p className={styles.name}>User</p>}>
        <p className={styles.empty}>{error ?? 'Loading…'}</p>
      </Drawer>
    );
  }

  const { account, abilities } = detail;
  const name = account.name || account.username;
  const status = statusLabel(account);
  const agent = account.parent ? displayName(account.parent) : null;

  const setKyc = (kyc: KycState, reason?: string) =>
    accessToken && run(() => networkApi.update(account._id, { kyc, kycRejectionReason: reason }, accessToken));
  const toggleStatus = () =>
    accessToken &&
    run(() => networkApi.setStatus(account._id, account.status === 'suspended' ? 'active' : 'suspended', accessToken));

  return (
    <Drawer
      label={`${name} details`}
      onClose={onClose}
      header={
        <div className={styles.identity}>
          <span className={styles.avatar}>{name.slice(0, 1).toLowerCase()}</span>
          <div>
            <p className={styles.name}>{name}</p>
            <div className={styles.meta}>
              <span className={styles.code}>{account.username}</span>
              <Badge tone={STATUS_TONE[status]}>{status}</Badge>
              {showAgent && agent ? <span className={styles.owner}>Agent: {agent}</span> : null}
            </div>
          </div>
        </div>
      }
      tabs={<Tabs items={visibleTabs} value={tab} variant="underline" aria-label="User sections" onChange={setTab} />}
    >
      {error ? <p className={styles.empty}>{error}</p> : null}

      {tab === 'Overview' ? (
        <div>
          <div className={styles.metrics}>
            <MetricTile label="Balance" value={formatRupees(account.walletBalance)} color="var(--color-success)" />
            <MetricTile label="Total Bets" value={String(detail.summary.bets)} color="var(--color-primary)" />
            <MetricTile label="KYC Status" value={account.kyc.toLowerCase()} color={TONE_COLOR[KYC_TONE[account.kyc]]} />
            <MetricTile
              label="Risk Level"
              value={detail.summary.risk.toUpperCase()}
              color={TONE_COLOR[RISK_TONE[detail.summary.risk]]}
            />
          </div>

          <div className={styles.panel}>
            <p className={styles.panelTitle}>Contact Details</p>
            <DetailRow icon={<MailIcon size={12.991} />} label="Email" value={account.email || '—'} />
            <DetailRow icon={<PhoneIcon size={12.991} />} label="Phone" value={account.phone || '—'} />
            <DetailRow
              icon={<MapPinIcon size={12.991} />}
              label="Location"
              value={[account.city, account.state].filter(Boolean).join(', ') || '—'}
            />
            {agent ? <DetailRow icon={<UserIcon size={12.991} />} label="Agent" value={agent} /> : null}
            <DetailRow icon={<CalendarIcon size={12.991} />} label="Joined" value={formatDate(account.createdAt)} />
          </div>

          {abilities.edit || abilities.suspend ? (
            <div className={styles.actions}>
              {abilities.edit ? (
                <Button variant="primary" size="sm" icon={<PencilIcon size={12.991} />} onClick={() => setEditing(true)}>
                  Edit User
                </Button>
              ) : null}
              {abilities.suspend ? (
                <Button
                  className={account.status === 'suspended' ? undefined : styles.danger}
                  size="sm"
                  disabled={pending}
                  icon={account.status === 'suspended' ? <CheckCircleIcon size={12.991} /> : <BanIcon size={12.991} />}
                  onClick={toggleStatus}
                >
                  {account.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {tab === 'Bets' ? (
        <BetsTab
          bets={detail.bets}
          total={detail.summary.bets}
          onVoid={
            can('bettingMarkets', 'voidBet', 'X') && accessToken
              ? (bet) => {
                  const reason = window.prompt(`Void this ₹${bet.amount} bet? The stake goes back to the player.\nReason (optional):`);
                  if (reason !== null) void run(() => networkApi.voidBet(accessToken, bet._id, reason.trim() || undefined));
                }
              : undefined
          }
        />
      ) : null}

      {tab === 'Transactions' ? (
        <div className={styles.list}>
          <p className={styles.listTitle}>Transaction History</p>
          {detail.transactions.length === 0 ? (
            <p className={styles.empty}>No transactions yet.</p>
          ) : (
            detail.transactions.map((txn) => (
              <article key={txn._id} className={`${styles.row} ${styles.rowTight}`}>
                <div>
                  <p className={styles.rowTitle}>{/^Cash out/i.test(txn.note || '') ? 'Cash Out' : txn.type}</p>
                  <p className={styles.rowRef}>{txn.reference || txn.note || txn._id.slice(-8).toUpperCase()}</p>
                  <p className={styles.rowMeta}>
                    {[txn.method, formatRelativeTime(txn.createdAt)].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div className={styles.rowRight}>
                  <span className={txn.amount >= 0 ? styles.amountUp : styles.amountDown}>
                    {txn.amount >= 0 ? '+' : '-'}
                    {formatRupees(Math.abs(txn.amount))}
                  </span>
                  <Badge tone={txn.status === 'Completed' ? 'success' : txn.status === 'Failed' ? 'danger' : 'warning'}>
                    {txn.status}
                  </Badge>
                </div>
              </article>
            ))
          )}
        </div>
      ) : null}

      {tab === 'Kyc' ? (
        <KycTab kyc={account.kyc} submission={detail.kycSubmission} canEdit={abilities.edit} pending={pending} onSet={setKyc} />
      ) : null}

      {tab === 'Activity' ? (
        <div>
          <p className={styles.listTitle}>Activity Timeline</p>
          {detail.activity.length === 0 ? <p className={styles.empty}>No activity recorded yet.</p> : null}
          {detail.activity.map((event, index) => (
            <article key={event._id} className={styles.timelineRow}>
              <div className={styles.timelineRail}>
                <span className={styles.timelineDot}>
                  <PulseIcon size={12} />
                </span>
                {index < detail.activity.length - 1 ? <span className={styles.timelineLine} /> : null}
              </div>
              <div>
                <p className={styles.timelineTitle}>
                  {ACTIVITY_TITLE[event.action] ?? event.action}
                  {event.status === 'failed' ? ' (failed)' : ''}
                  {activityExtras(event.metadata) ? ` — ${activityExtras(event.metadata)}` : ''}
                </p>
                <p className={styles.timelineDetail}>
                  {[
                    typeof event.actor === 'object' && event.actor && event.actor._id !== account._id
                      ? `by ${event.actor.name || event.actor.username}`
                      : null,
                    describeUserAgent(event.userAgent).name,
                    formatIp(event.ip),
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                <p className={styles.timelineWhen}>{formatRelativeTime(event.createdAt)}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {tab === 'Devices' ? <DevicesTab detail={detail} pending={pending} run={run} /> : null}

      {editing ? (
        <AddUserModal
          title="User"
          account={account}
          agents={[]}
          agentOptional
          canSetKyc={abilities.edit}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            void load();
            onChanged?.();
          }}
        />
      ) : null}
    </Drawer>
  );
}

const TONE_COLOR = {
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  neutral: 'var(--color-text-muted)',
} as const;

function DetailRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      {icon}
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}

const betName = (bet: DetailBet) =>
  !bet.event ? '—' : typeof bet.event === 'string' ? bet.event.slice(-6) : bet.event.name;
const marketName = (bet: DetailBet) =>
  !bet.market || typeof bet.market === 'string' ? bet.selection : `${bet.market.name} · ${bet.selection}`;

const BET_TONE = { Pending: 'info', Won: 'success', Lost: 'danger', Void: 'neutral' } as const;

export function BetsTab({
  bets,
  total,
  onVoid,
}: {
  bets: DetailBet[];
  total: number;
  /** Shown on open bets when the role holds "Void Bet" (edit). */
  onVoid?: (bet: DetailBet) => void;
}) {
  return (
    <div>
      <div className={styles.sectionHead}>
        <p className={styles.panelTitle}>Bet History</p>
        <Badge tone="brand">{total} total bets</Badge>
      </div>

      {bets.length === 0 ? (
        <p className={styles.empty}>No bets placed yet.</p>
      ) : (
        bets.map((bet) => {
          const payout = bet.status === 'Won' ? bet.amount * bet.odds : bet.amount;
          return (
            <article key={bet._id} className={styles.betCard}>
              <div className={styles.betTop}>
                <div>
                  <p className={styles.betEvent}>{betName(bet)}</p>
                  <p className={styles.betMarket}>{marketName(bet)}</p>
                </div>
                <div>
                  <p className={bet.status === 'Lost' ? styles.betAmountLost : styles.betAmountWon}>
                    {bet.status === 'Lost' ? '-' : ''}
                    {formatRupees(payout)}
                  </p>
                  <p className={styles.betDate}>{formatRelativeTime(bet.createdAt)}</p>
                </div>
              </div>
              <div className={styles.betBottom}>
                <span className={styles.betId}>{bet._id.slice(-8).toUpperCase()}</span>
                <span>Odds: {bet.odds.toFixed(2)}</span>
                <span>Stake: {formatRupees(bet.amount)}</span>
                <Badge tone={BET_TONE[bet.status]}>{bet.status === 'Pending' ? 'Open' : bet.status}</Badge>
                {onVoid && bet.status === 'Pending' ? (
                  <button type="button" className={styles.voidBet} onClick={() => onVoid(bet)}>
                    Void
                  </button>
                ) : null}
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}

const KYC_BANNER_RGB: Record<KycState, string> = {
  'Not Submitted': '184, 194, 204',
  Verified: '34, 197, 94',
  Pending: '250, 204, 21',
  Rejected: '239, 68, 68',
};

const KYC_BANNER_META: Record<KycState, string> = {
  'Not Submitted': 'The user has not submitted KYC documents from the app yet.',
  Pending: 'Documents submitted — waiting for review.',
  Verified: 'Identity verified.',
  Rejected: 'Rejected — the user can resubmit from the app.',
};

/** KYC file — node 79:9518, showing what the player submitted from the app's KYC flow. */
function KycTab({
  kyc,
  submission,
  canEdit,
  pending,
  onSet,
}: {
  kyc: KycState;
  submission: NetworkDetail['kycSubmission'];
  canEdit: boolean;
  pending: boolean;
  onSet: (kyc: KycState, reason?: string) => void;
}) {
  const [reason, setReason] = useState('');
  const rgb = KYC_BANNER_RGB[kyc];
  const fields = submission
    ? [
        { label: 'Full Name', value: submission.fullName },
        { label: 'Mobile Number', value: submission.phone ? formatMobile(submission.phone) : '—' },
        { label: 'Date of Birth', value: formatDate(submission.dob) },
        { label: 'Address', value: submission.address },
        { label: 'City / State', value: `${submission.city}, ${submission.state}` },
        { label: 'Country', value: submission.country },
        { label: 'Postal Code', value: submission.postalCode },
        { label: submission.documentType, value: submission.documentNumber },
      ]
    : [];

  return (
    <div className={styles.kycStack}>
      <div
        className={styles.kycBanner}
        style={
          {
            '--banner-bg': `rgba(${rgb}, 0.08)`,
            '--banner-border': `rgba(${rgb}, 0.2)`,
            '--banner-color': `rgb(${rgb})`,
          } as CSSProperties
        }
      >
        <UserCheckIcon size={23.999} />
        <div>
          <p className={styles.kycBannerTitle}>KYC Status: {kyc}</p>
          <p className={styles.kycBannerMeta}>
            {submission ? `Ref ${submission.referenceId} · submitted ${formatDate(submission.createdAt)}. ` : ''}
            {KYC_BANNER_META[kyc]}
            {kyc === 'Rejected' && submission?.rejectionReason ? ` Reason: ${submission.rejectionReason}` : ''}
          </p>
        </div>
      </div>

      {submission ? (
        <>
          <div className={styles.list}>
            {fields.map((field) => (
              <article key={field.label} className={styles.row}>
                <p className={styles.rowTitle}>{field.label}</p>
                <p className={styles.kycValue}>{field.value}</p>
              </article>
            ))}
          </div>
          <div className={styles.kycDocs}>
            {[
              { label: 'Front', file: submission.front },
              { label: 'Back', file: submission.back },
            ].map(({ label, file }) =>
              file ? (
                <a key={label} className={styles.kycDoc} href={file.data} target="_blank" rel="noreferrer" download={file.name}>
                  {file.mime.startsWith('image/') ? (
                    <img className={styles.kycDocImage} src={file.data} alt={`${label} of ${submission.documentType}`} />
                  ) : (
                    <span className={styles.kycDocFile}>PDF</span>
                  )}
                  <span className={styles.kycDocLabel}>
                    {label} · {file.name || 'document'}
                  </span>
                </a>
              ) : null,
            )}
          </div>
        </>
      ) : kyc !== 'Not Submitted' ? (
        <p className={styles.empty}>You don't have permission to view this user's KYC documents.</p>
      ) : null}

      {canEdit && kyc === 'Pending' ? (
        <>
          <input
            className={styles.kycReason}
            placeholder="Rejection reason (shown to the user)"
            value={reason}
            maxLength={200}
            onChange={(event) => setReason(event.target.value)}
          />
          <div className={styles.kycActions}>
            <Button
              className={styles.approve}
              size="sm"
              disabled={pending}
              icon={<CheckCircleIcon size={12.991} />}
              onClick={() => onSet('Verified')}
            >
              Approve KYC
            </Button>
            <Button
              className={styles.reject}
              size="sm"
              disabled={pending || !reason.trim()}
              icon={<XCircleIcon size={12.991} />}
              onClick={() => onSet('Rejected', reason.trim())}
            >
              Reject KYC
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}

/** Logged-in devices — node 79:12074, from the account's live refresh-token sessions. */
function DevicesTab({
  detail,
  pending,
  run,
}: {
  detail: NetworkDetail;
  pending: boolean;
  run: (action: () => Promise<unknown>) => void;
}) {
  const { accessToken, user } = useAuth();
  const canRevoke = user?.roleId === 'super-admin';

  return (
    <div className={styles.list}>
      <p className={styles.listTitle}>Logged-in Devices</p>
      {detail.sessions.length === 0 ? <p className={styles.empty}>No active sessions.</p> : null}
      {detail.sessions.map((session, index) => {
        const device = describeUserAgent(session.userAgent);
        const Icon = device.mobile ? SmartphoneIcon : MonitorIcon;
        const latest = index === 0;
        return (
          <article key={session._id} className={`${styles.row} ${latest ? styles.deviceCurrent : ''}`}>
            <div className={styles.deviceMain}>
              <span className={`${styles.deviceTile} ${latest ? styles.deviceTileCurrent : ''}`}>
                <Icon size={17.993} />
              </span>
              <div>
                <p className={styles.rowTitle}>{device.name}</p>
                <p className={styles.deviceMeta}>
                  <GlobeIcon size={9.994} />
                  {formatIp(session.ip) || '—'}
                </p>
                <p className={`${styles.deviceSeen} ${latest ? styles.deviceSeenActive : ''}`}>
                  Last active {formatRelativeTime(session.updatedAt)}
                </p>
              </div>
            </div>
            {canRevoke && accessToken ? (
              <button
                type="button"
                className={styles.chipRevoke}
                disabled={pending}
                onClick={() => run(() => networkApi.revokeSession(session._id, accessToken))}
              >
                Revoke
              </button>
            ) : latest ? (
              <span className={styles.chipCurrent}>Latest</span>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
