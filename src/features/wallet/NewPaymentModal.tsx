import { useState } from 'react';
import type { FormEvent } from 'react';
import { TransactionsIcon } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { SelectField } from '../../components/ui/TextField/SelectField';
import { TextField } from '../../components/ui/TextField/TextField';
import { PAYMENT_METHODS, PAYMENT_TYPES, RECIPIENTS, RECIPIENT_TYPES } from './walletData';
import styles from './NewPaymentModal.module.css';

export type NewPaymentModalProps = {
  onClose: () => void;
  onConfirm: () => void;
};

/** Pay a partner — node 119:39582. */
export function NewPaymentModal({ onClose, onConfirm }: NewPaymentModalProps) {
  const [form, setForm] = useState({
    recipientType: RECIPIENT_TYPES[0] as string,
    recipient: '',
    paymentType: PAYMENT_TYPES[0] as string,
    method: PAYMENT_METHODS[0] as string,
    amount: '',
    note: '',
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onConfirm();
  };

  return (
    <Modal
      title="New Payment"
      subtitle="Send payment to Super Agent, Agent, or Franchise"
      width={500}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <SelectField
            label="Recipient Type"
            options={RECIPIENT_TYPES}
            placeholder="Super Agent"
            value={form.recipientType}
            onChange={(event) => set('recipientType')(event.target.value)}
          />
          <SelectField
            label="Select Recipient *"
            options={RECIPIENTS}
            placeholder="— Select —"
            value={form.recipient}
            onChange={(event) => set('recipient')(event.target.value)}
          />
          <SelectField
            label="Payment Type"
            options={PAYMENT_TYPES}
            placeholder="Commission"
            value={form.paymentType}
            onChange={(event) => set('paymentType')(event.target.value)}
          />
          <SelectField
            label="Payment Method"
            options={PAYMENT_METHODS}
            placeholder="Bank Transfer"
            value={form.method}
            onChange={(event) => set('method')(event.target.value)}
          />
          <TextField
            fieldClassName={styles.wide}
            label="Amount (₹) *"
            labelCase="caps"
            inputMode="numeric"
            placeholder="Enter amount"
            value={form.amount}
            onChange={(event) => set('amount')(event.target.value)}
          />
          <TextField
            fieldClassName={styles.wide}
            label="Note / Reference"
            labelCase="caps"
            placeholder="e.g. July 2025 commission"
            value={form.note}
            onChange={(event) => set('note')(event.target.value)}
          />
        </div>

        <div className={styles.footer}>
          <Button
            className={styles.submit}
            type="submit"
            variant="primary"
            size="sm"
            icon={<TransactionsIcon size={13} />}
          >
            Confirm &amp; Pay
          </Button>
          <Button className={styles.cancel} variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
