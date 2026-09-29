import { useEffect, useState } from 'react';
import { TextField } from '../../components/ui/TextField/TextField';
import { useAuth } from '../auth/authContext';
import { ApiRequestError, authApi } from '../../lib/api';
import { networkApi } from '../../lib/api/network';
import type { MyProfile, NetworkAccount } from '../../lib/api/network';
import { formatRupees } from '../../lib/format';
import { LiveSettings } from './LiveSettings';
import styles from './SettingsPage.module.css';

/**
 * Platform settings — node 112:11029 plus its five other tab states, for
 * super-admin. Other roles can't change platform config, so their Settings
 * page shows their own account's business settings (read-only; their upline
 * or the super-admin changes them from the Franchise / Super Agent / Agent pages).
 */
export function SettingsPage() {
  const { user } = useAuth();
  return user?.roleId === 'super-admin' ? <LiveSettings /> : <MyAccountSettings />;
}

function MyAccountSettings() {
  const { accessToken } = useAuth();
  const [me, setMe] = useState<NetworkAccount | null>(null);
  const [limits, setLimits] = useState<MyProfile['limits'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    Promise.all([authApi.me(accessToken), networkApi.myProfile(accessToken)])
      .then(([account, profile]) => {
        if (cancelled) return;
        // /auth/me returns the full account, including the staff business fields.
        setMe(account.user as unknown as NetworkAccount);
        setLimits(profile.limits);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiRequestError ? err.message : 'Unable to reach the server.');
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  if (!me || !limits) {
    return <p className={styles.cardSubtitle}>{error ?? 'Loading…'}</p>;
  }

  /** The value in force, marked when it's the platform's default rather than one set on this account. */
  const inForce = (limit: { value: number | null; isDefault: boolean }, format: (n: number) => string) =>
    limit.value === null ? 'Not set' : `${format(limit.value)}${limit.isDefault ? ' (platform default)' : ''}`;
  const money = (value: number | null, none: string) => (value === null ? none : formatRupees(value));
  const rules = limits.walletRules;

  const fields = [
    { label: 'Username', value: me.username },
    ...(me.referralCode ? [{ label: 'Referral Code', value: me.referralCode }] : []),
    { label: 'Commission Rate', value: inForce(limits.commissionRate, (n) => `${n}% of turnover`) },
    { label: 'Commission Type', value: me.commissionType ?? 'Flat' },
    { label: 'Settlement Cycle', value: me.settlementCycle ?? 'Weekly' },
    { label: 'Credit Limit', value: money(limits.creditLimit, 'Not set') },
    {
      label: 'Stake per Bet (each user)',
      value: `${money(limits.minBet, '—')} – ${inForce(limits.bettingLimit, formatRupees)}`,
    },
    { label: 'Open Bets Limit (each user)', value: money(limits.maxUserExposure, 'No limit') },
    { label: 'Max Exposure (my whole book)', value: money(limits.maxExposure, 'No limit set') },
    ...(rules
      ? [
          { label: 'Deposit per Request', value: `${formatRupees(rules.minDeposit)} – ${formatRupees(rules.maxDeposit)}` },
          {
            label: 'Withdrawal per Request',
            value: `${formatRupees(rules.minWithdrawal)} – ${formatRupees(rules.maxWithdrawal)}`,
          },
        ]
      : []),
  ];

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <p className={styles.cardTitle}>My Account Settings</p>
        <p className={styles.cardSubtitle}>Set by your upline or the platform admin — contact them to change these.</p>
        <div className={styles.fields}>
          {fields.map((field) => (
            <TextField key={field.label} label={field.label} value={field.value} readOnly />
          ))}
        </div>
      </section>
    </div>
  );
}
