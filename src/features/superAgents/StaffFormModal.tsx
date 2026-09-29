import { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircleIcon } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { SelectField } from '../../components/ui/TextField/SelectField';
import { TextField } from '../../components/ui/TextField/TextField';
import { useAuth } from '../auth/authContext';
import { usePermissions } from '../auth/usePermissions';
import { accountLabel, networkApi } from '../../lib/api/network';
import type { AccountDraft, AccountRef, CommissionType, NetworkAccount } from '../../lib/api/network';
import styles from './CreateSuperAgentModal.module.css';

type StaffRole = 'franchise' | 'super-agent' | 'agent';

const COMMISSION_TYPES: CommissionType[] = ['Flat', 'Slab based', 'Turnover based'];

const COPY: Record<StaffRole, { noun: string; subtitle: string; parent?: string }> = {
  franchise: { noun: 'Franchise', subtitle: 'Register a new franchise account' },
  'super-agent': { noun: 'Super Agent', subtitle: 'Manage super agent account', parent: 'Franchise' },
  agent: { noun: 'Agent', subtitle: 'Manage agent account', parent: 'Super Agent' },
};

const SPLITS = [
  ['matchCommission', 'Match Commission'],
  ['myMatchCommission', 'My Match Commission'],
  ['sessionCommission', 'Session Commission'],
  ['mySessionCommission', 'My Session Commission'],
] as const;

const str = (value: number | null | undefined) => (value === null || value === undefined ? '' : String(value));

export type StaffFormModalProps = {
  role: StaffRole;
  /** The account being edited, or null to create one. */
  account: NetworkAccount | null;
  /** Accounts the new one can sit under (unused for franchises and when editing). */
  parents: AccountRef[];
  onClose: () => void;
  onSaved: () => void;
};

/**
 * Create / edit dialog for staff accounts — Create Franchise (101:2, 101:803),
 * Create Super Agent and Create Agent (116:26729) share one form; fields that
 * only make sense for one role are shown just for it.
 */
export function StaffFormModal({ role, account, parents, onClose, onSaved }: StaffFormModalProps) {
  const { accessToken } = useAuth();
  const { can } = usePermissions();
  /** Commission terms are set by whoever holds the "Commission Settings" grant (the admin, by default). */
  const canSetCommission = can('accountSettings', 'commissionSettings', 'X');
  const copy = COPY[role];
  const isEdit = account !== null;
  const isFranchise = role === 'franchise';
  const parentLabels = parents.map(accountLabel);

  const [form, setForm] = useState({
    businessName: account?.businessName ?? '',
    name: account?.name ?? '',
    parent: parents.length === 1 ? parentLabels[0] : '',
    phone: account?.phone ?? '',
    email: account?.email ?? '',
    state: account?.state ?? '',
    city: account?.city ?? '',
    creditLimit: account ? str(account.creditLimit) : '',
    bettingLimit: account?.bettingLimit ? str(account.bettingLimit) : '',
    maxExposure: account?.maxExposure ? str(account.maxExposure) : '',
    commissionRate: str(account?.commissionRate),
    commissionType: account?.commissionType ?? '',
    shareHolding: str(account?.shareHolding),
    matchCommission: str(account?.matchCommission),
    myMatchCommission: str(account?.myMatchCommission),
    sessionCommission: str(account?.sessionCommission),
    mySessionCommission: str(account?.mySessionCommission),
    username: account?.username ?? '',
    password: '',
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  /** '' = no limit of its own (the platform's applies). */
  const rupeeLimit = (label: string, raw: string) => {
    if (raw.trim() === '') return 0;
    const value = Number(raw);
    if (Number.isNaN(value) || value < 0) throw new Error(`${label} must be a positive number.`);
    return value;
  };

  /** Same rule as the backend: an Indian mobile, with or without +91 / spaces. */
  const isMobile = (value: string) => {
    if (!/^[\d+\-\s()]+$/.test(value)) return false;
    const digits = value.replace(/\D/g, '');
    const local =
      digits.length === 12 && digits.startsWith('91')
        ? digits.slice(2)
        : digits.length === 11 && digits.startsWith('0')
          ? digits.slice(1)
          : digits;
    return /^[6-9]\d{9}$/.test(local);
  };

  const percent = (label: string, raw: string) => {
    if (raw.trim() === '') return null;
    const value = Number(raw);
    if (Number.isNaN(value) || value < 0 || value > 100) throw new Error(`${label} must be between 0 and 100.`);
    return value;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) return;
    setError(null);
    try {
      const credit = form.creditLimit.trim() === '' ? 0 : Number(form.creditLimit);
      if (Number.isNaN(credit) || credit < 0) throw new Error('Credit limit must be a positive number.');
      if (!form.name.trim()) throw new Error(isFranchise ? 'Owner name is required.' : 'Full name is required.');
      if (isFranchise && !form.businessName.trim()) throw new Error('Franchise name is required.');
      if (form.phone.trim() && !isMobile(form.phone.trim())) throw new Error('Enter a valid 10-digit mobile number.');

      const draft: AccountDraft = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        state: form.state.trim(),
        city: form.city.trim(),
        creditLimit: credit,
        bettingLimit: rupeeLimit('Betting limit', form.bettingLimit),
        maxExposure: rupeeLimit('Max exposure', form.maxExposure),
        ...(canSetCommission ? { commissionRate: percent('Commission %', form.commissionRate) } : {}),
      };
      if (isFranchise) {
        draft.businessName = form.businessName.trim();
      }
      if (isFranchise && canSetCommission) {
        if (form.commissionType) draft.commissionType = form.commissionType as CommissionType;
        draft.shareHolding = percent('Share holding', form.shareHolding);
        for (const [key, label] of SPLITS) draft[key] = percent(label, form[key]);
      }

      setPending(true);
      if (isEdit) {
        await networkApi.update(account._id, draft, accessToken);
      } else {
        const username = form.username.trim().toLowerCase();
        if (!/^[a-z0-9_]{4,32}$/.test(username)) {
          throw new Error('Username must be 4–32 lowercase letters, numbers or underscores.');
        }
        if (form.password.length < 6) throw new Error('Password must be at least 6 characters.');
        const parent = parents[parentLabels.indexOf(form.parent)];
        if (copy.parent && !parent) throw new Error(`Choose a ${copy.parent.toLowerCase()}.`);
        await networkApi.create({ role, username, password: form.password, parentId: parent?._id, ...draft }, accessToken);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reach the server.');
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal
      title={isEdit ? `Edit ${copy.noun}` : `Create ${copy.noun}`}
      subtitle={isEdit ? `Update ${account.businessName || account.name || account.username}` : copy.subtitle}
      width={isFranchise ? 580 : 540}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          {isFranchise ? (
            <TextField
              label="Franchise Name *"
              labelCase="caps"
              placeholder="e.g. Mumbai Franchise"
              value={form.businessName}
              onChange={(event) => set('businessName')(event.target.value)}
            />
          ) : null}
          <TextField
            label={isFranchise ? 'Owner Name *' : 'Full Name *'}
            labelCase="caps"
            placeholder="Enter full name"
            value={form.name}
            onChange={(event) => set('name')(event.target.value)}
          />
          {!isEdit && copy.parent ? (
            <SelectField
              label={`Assign ${copy.parent} *`}
              options={parentLabels}
              placeholder={`— Select ${copy.parent} —`}
              value={form.parent}
              onChange={(event) => set('parent')(event.target.value)}
            />
          ) : null}
          <TextField
            label="Phone Number"
            labelCase="caps"
            placeholder="+91 XXXXX XXXXX"
            value={form.phone}
            onChange={(event) => set('phone')(event.target.value)}
          />
          <TextField
            label="Email Address"
            labelCase="caps"
            type="email"
            placeholder="name@email.com"
            value={form.email}
            onChange={(event) => set('email')(event.target.value)}
          />
          {isFranchise ? (
            <>
              <TextField
                label="State"
                labelCase="caps"
                value={form.state}
                onChange={(event) => set('state')(event.target.value)}
              />
              <TextField
                label="City"
                labelCase="caps"
                value={form.city}
                onChange={(event) => set('city')(event.target.value)}
              />
            </>
          ) : null}
          {role !== 'agent' ? (
            <TextField
              label="Credit Limit (₹)"
              labelCase="caps"
              inputMode="numeric"
              placeholder="0"
              value={form.creditLimit}
              onChange={(event) => set('creditLimit')(event.target.value)}
            />
          ) : null}
          {!isFranchise ? (
            <TextField
              label={canSetCommission ? 'Commission %' : 'Commission % (set by admin)'}
              labelCase="caps"
              inputMode="decimal"
              placeholder="Platform default"
              value={form.commissionRate}
              readOnly={!canSetCommission}
              disabled={!canSetCommission}
              onChange={(event) => set('commissionRate')(event.target.value)}
            />
          ) : null}
          <TextField
            label="Max Stake per Bet (₹)"
            labelCase="caps"
            inputMode="numeric"
            placeholder="Platform limit"
            value={form.bettingLimit}
            onChange={(event) => set('bettingLimit')(event.target.value)}
          />
          <TextField
            label="Max Open Exposure (₹)"
            labelCase="caps"
            inputMode="numeric"
            placeholder="No limit"
            value={form.maxExposure}
            onChange={(event) => set('maxExposure')(event.target.value)}
          />
          {!isEdit ? (
            <>
              <TextField
                label="Username *"
                labelCase="caps"
                placeholder="e.g. mumbai_fr01"
                value={form.username}
                onChange={(event) => set('username')(event.target.value)}
              />
              <TextField
                label="Login Password *"
                labelCase="caps"
                type="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(event) => set('password')(event.target.value)}
              />
            </>
          ) : null}
          {isFranchise ? (
            <>
              <SelectField
                label="Commission Type"
                options={COMMISSION_TYPES}
                placeholder="Select Commission Type"
                value={form.commissionType}
                onChange={(event) => set('commissionType')(event.target.value)}
              />
              <TextField
                label="Share Holding"
                labelCase="caps"
                placeholder="--%"
                value={form.shareHolding}
                onChange={(event) => set('shareHolding')(event.target.value)}
              />
              <TextField
                label="Commission %"
                labelCase="caps"
                inputMode="decimal"
                placeholder="Platform default"
                value={form.commissionRate}
                onChange={(event) => set('commissionRate')(event.target.value)}
              />
              {form.commissionType
                ? SPLITS.map(([key, label]) => (
                    <TextField
                      key={key}
                      label={label}
                      labelCase="caps"
                      placeholder="--%"
                      value={form[key]}
                      onChange={(event) => set(key)(event.target.value)}
                    />
                  ))
                : null}
            </>
          ) : null}
        </div>

        {error ? (
          <p role="alert" style={{ color: 'var(--color-danger)', margin: '12px 0 0', fontSize: 12 }}>
            {error}
          </p>
        ) : null}

        <div className={styles.footer}>
          <Button
            className={styles.submit}
            type="submit"
            variant="primary"
            size="sm"
            disabled={pending}
            icon={<CheckCircleIcon size={14} />}
          >
            {pending ? 'Saving…' : isEdit ? 'Save Changes' : `Create ${copy.noun}`}
          </Button>
          <Button className={styles.cancel} variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
