import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  RefreshIcon,
  TransactionsIcon,
} from '../../components/icons';
import type { IconProps } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { SelectField } from '../../components/ui/TextField/SelectField';
import { TextAreaField } from '../../components/ui/TextField/TextAreaField';
import { TextField } from '../../components/ui/TextField/TextField';
import { WALLET_USERS } from './walletData';
import styles from './WalletActionModal.module.css';
import type { ComponentType } from 'react';

export type WalletAction = 'Manual Credit' | 'Manual Debit' | 'Transfer' | 'Adjustment';

type ActionSpec = {
  icon: ComponentType<IconProps>;
  rgb: string;
  /** Solid confirm button colour; yellow needs dark text. */
  darkLabel?: boolean;
  /** Transfer also picks a destination user. */
  destination?: boolean;
};

const ACTIONS: Record<WalletAction, ActionSpec> = {
  'Manual Credit': { icon: ArrowDownIcon, rgb: '34, 197, 94' },
  'Manual Debit': { icon: ArrowUpIcon, rgb: '239, 68, 68' },
  Transfer: { icon: TransactionsIcon, rgb: '33, 150, 243', destination: true },
  Adjustment: { icon: RefreshIcon, rgb: '250, 204, 21', darkLabel: true },
};

export type WalletActionModalProps = {
  action: WalletAction;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * One dialog for all four manual wallet operations — nodes 117:35363,
 * 119:36414, 119:37465 and 119:38529 differ only by accent, icon and the
 * extra destination field on Transfer.
 */
export function WalletActionModal({ action, onClose, onConfirm }: WalletActionModalProps) {
  const spec = ACTIONS[action];
  const Icon = spec.icon;
  const [form, setForm] = useState({ user: '', amount: '', destination: '', note: '' });
  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onConfirm();
  };

  return (
    <Modal
      title={action}
      subtitle="Manual wallet operation"
      width={500}
      leading={
        <span
          className={styles.tile}
          style={
            {
              '--action-bg': `rgba(${spec.rgb}, 0.09)`,
              '--action-color': `rgb(${spec.rgb})`,
            } as CSSProperties
          }
        >
          <Icon size={17.999} />
        </span>
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} style={{ '--action-color': `rgb(${spec.rgb})` } as CSSProperties}>
        <div className={styles.fields}>
          <SelectField
            label="Select User *"
            options={WALLET_USERS}
            placeholder="— Search and select user —"
            value={form.user}
            onChange={(event) => set('user')(event.target.value)}
          />
          <TextField
            className={styles.amount}
            style={{ borderColor: `rgba(${spec.rgb}, 0.25)` }}
            label="Amount (₹) *"
            labelCase="caps"
            inputMode="numeric"
            placeholder="Enter amount"
            value={form.amount}
            onChange={(event) => set('amount')(event.target.value)}
          />
          {spec.destination ? (
            <SelectField
              label="Transfer to User *"
              options={WALLET_USERS}
              placeholder="— Select destination user —"
              value={form.destination}
              onChange={(event) => set('destination')(event.target.value)}
            />
          ) : null}
          <TextAreaField
            label="Reference / Note"
            placeholder="Enter reason or reference number..."
            value={form.note}
            onChange={(event) => set('note')(event.target.value)}
          />
        </div>

        <div className={styles.footer}>
          <Button
            className={`${styles.confirm} ${spec.darkLabel ? styles.confirmDark : ''}`}
            style={{ backgroundColor: `rgb(${spec.rgb})` }}
            type="submit"
            size="sm"
            icon={<CheckCircleIcon size={13.993} />}
          >
            Confirm {action}
          </Button>
          <Button className={styles.cancel} variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
