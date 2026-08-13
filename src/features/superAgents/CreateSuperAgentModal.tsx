import { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircleIcon } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { SelectField } from '../../components/ui/TextField/SelectField';
import { TextField } from '../../components/ui/TextField/TextField';
import { FRANCHISE_OPTIONS } from './superAgentsData';
import type { SuperAgentRow } from './superAgentsData';
import styles from './CreateSuperAgentModal.module.css';

export type CreateSuperAgentModalProps = {
  onClose: () => void;
  onCreate: (row: SuperAgentRow) => void;
};

/** Create Super Agent dialog — node 116:21713. */
export function CreateSuperAgentModal({ onClose, onCreate }: CreateSuperAgentModalProps) {
  const [form, setForm] = useState({
    name: '',
    franchise: '',
    phone: '',
    email: '',
    credit: '50L',
    commission: '10',
    password: '',
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim() || 'New Super Agent';
    onCreate({
      id: `new-${name}`,
      code: 'SA—',
      name,
      franchise: form.franchise || '—',
      city: form.franchise.split(' ')[0] || '—',
      agents: 0,
      users: '0',
      turnover: '₹0',
      commission: '₹0',
      credit: form.credit ? `₹${form.credit}` : '₹0',
      exposure: '₹0',
      status: 'Active',
      phone: form.phone.trim() || '—',
      email: form.email.trim() || '—',
      joined: 'Today',
    });
  };

  return (
    <Modal
      title="Create Super Agent"
      subtitle="Manage super agent account"
      width={540}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <TextField
            label="Full Name *"
            labelCase="caps"
            placeholder="Enter full name"
            value={form.name}
            onChange={(event) => set('name')(event.target.value)}
          />
          <SelectField
            label="Assign Franchise *"
            options={FRANCHISE_OPTIONS}
            placeholder="— Select Franchise —"
            value={form.franchise}
            onChange={(event) => set('franchise')(event.target.value)}
          />
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
            placeholder="sa@email.com"
            value={form.email}
            onChange={(event) => set('email')(event.target.value)}
          />
          <TextField
            label="Credit Limit"
            labelCase="caps"
            placeholder="50L"
            value={form.credit}
            onChange={(event) => set('credit')(event.target.value)}
          />
          <TextField
            label="Commission %"
            labelCase="caps"
            inputMode="numeric"
            value={form.commission}
            onChange={(event) => set('commission')(event.target.value)}
          />
          <TextField
            fieldClassName={styles.wide}
            label="Password *"
            labelCase="caps"
            type="password"
            placeholder="Min 8 characters"
            value={form.password}
            onChange={(event) => set('password')(event.target.value)}
          />
        </div>

        <div className={styles.footer}>
          <Button
            className={styles.submit}
            type="submit"
            variant="primary"
            size="sm"
            icon={<CheckCircleIcon size={14} />}
          >
            Create Super Agent
          </Button>
          <Button className={styles.cancel} variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
