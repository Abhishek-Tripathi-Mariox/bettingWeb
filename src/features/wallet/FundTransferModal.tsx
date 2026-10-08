import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { TransactionsIcon } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { SelectField } from '../../components/ui/TextField/SelectField';
import { TextField } from '../../components/ui/TextField/TextField';
import { ApiRequestError } from '../../lib/api';
import { networkApi } from '../../lib/api/network';
import { walletApi } from '../../lib/api/wallet';
import { formatRupees } from '../../lib/format';
import { useAuth } from '../auth/authContext';
import styles from './ReviewRequestModal.module.css';

type Recipient = { id: string; label: string };

type Props = {
  /** What the sender holds right now. */
  balance: number;
  onClose: () => void;
  /** Called with the sender's balance after the transfer. */
  onDone: (balance: number) => void;
};

/**
 * Fund Transfer: moves money from the signed-in account's own wallet to an
 * agent or user in its network. Needs the "Fund Transfer" grant.
 */
export function FundTransferModal({ balance, onClose, onDone }: Props) {
  const { accessToken } = useAuth();
  const [recipients, setRecipients] = useState<Recipient[] | null>(null);
  const [form, setForm] = useState({ to: '', amount: '', note: '' });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    Promise.all([
      networkApi.list({ role: 'agent', status: 'active', limit: 100 }, accessToken).catch(() => null),
      networkApi.list({ role: 'player', status: 'active', limit: 100 }, accessToken).catch(() => null),
    ]).then(([agents, players]) => {
      if (cancelled) return;
      setRecipients([
        ...(agents?.items ?? []).map((a) => ({ id: a._id, label: `${a.name || a.username} (${a.username}) · Agent` })),
        ...(players?.items ?? []).map((u) => ({ id: u._id, label: `${u.name || u.username} (${u.username}) · User` })),
      ]);
    });
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const amount = Number(form.amount);
  const recipient = recipients?.find((option) => option.label === form.to);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) return;
    if (!recipient) return setError('Choose who to transfer to.');
    if (!Number.isFinite(amount) || amount <= 0) return setError('Enter an amount to transfer.');
    if (amount > balance) return setError(`Your wallet balance is ${formatRupees(balance)}.`);
    setPending(true);
    setError(null);
    try {
      const result = await walletApi.transfer({ toUserId: recipient.id, amount, note: form.note.trim() }, accessToken);
      onDone(result.balance);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to reach the server.');
      setPending(false);
    }
  };

  return (
    <Modal
      title="Fund Transfer"
      subtitle={`From your wallet · ${formatRupees(balance)} available`}
      width={480}
      onClose={onClose}
    >
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SelectField
          label="Transfer to"
          options={(recipients ?? []).map((option) => option.label)}
          placeholder={recipients === null ? 'Loading…' : recipients.length ? 'Choose an agent or user' : 'No active accounts in your network'}
          value={form.to}
          onChange={(event) => setForm((current) => ({ ...current, to: event.target.value }))}
        />
        <TextField
          label="Amount (₹)"
          inputMode="numeric"
          placeholder="0"
          value={form.amount}
          onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value.replace(/[^0-9]/g, '') }))}
        />
        <TextField
          label="Note (optional)"
          placeholder="e.g. Weekly float"
          maxLength={120}
          value={form.note}
          onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
        />

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        <div className={styles.footer}>
          <Button className={styles.approve} type="submit" icon={<TransactionsIcon size={14} />} disabled={pending}>
            {pending ? 'Transferring…' : amount > 0 ? `Transfer ${formatRupees(amount)}` : 'Transfer'}
          </Button>
          <Button className={styles.cancel} disabled={pending} onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
