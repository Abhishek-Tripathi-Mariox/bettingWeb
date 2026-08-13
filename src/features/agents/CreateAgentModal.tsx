import { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircleIcon } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { SelectField } from '../../components/ui/TextField/SelectField';
import { TextField } from '../../components/ui/TextField/TextField';
import { SUPER_AGENT_OPTIONS } from './agentsData';
import type { AgentRow } from './agentsData';
import styles from '../superAgents/CreateSuperAgentModal.module.css';

export type CreateAgentModalProps = {
  onClose: () => void;
  onCreate: (row: AgentRow) => void;
};

/** Create Agent dialog — node 116:26729. */
export function CreateAgentModal({ onClose, onCreate }: CreateAgentModalProps) {
  const [form, setForm] = useState({
    name: '',
    superAgent: '',
    phone: '',
    email: '',
    wallet: '0',
    commission: '7',
    password: '',
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim() || 'New Agent';
    const code = form.superAgent.match(/\((SA\d+)\)/)?.[1] ?? 'SA001';

    onCreate({
      id: `new-${name}`,
      code: 'A—',
      name,
      users: 0,
      turnover: '₹0',
      commission: '₹0',
      wallet: `₹${form.wallet || '0'}`,
      joined: 'Today',
      status: 'Active',
      phone: form.phone.trim() || '—',
      email: form.email.trim() || '—',
      superAgentCode: code,
    });
  };

  return (
    <Modal title="Create Agent" subtitle="Manage agent account" width={540} onClose={onClose}>
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
            label="Assign Super Agent *"
            options={SUPER_AGENT_OPTIONS}
            placeholder="— Select Super Agent —"
            value={form.superAgent}
            onChange={(event) => set('superAgent')(event.target.value)}
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
            placeholder="agent@email.com"
            value={form.email}
            onChange={(event) => set('email')(event.target.value)}
          />
          <TextField
            label="Initial Wallet (₹)"
            labelCase="caps"
            inputMode="numeric"
            value={form.wallet}
            onChange={(event) => set('wallet')(event.target.value)}
          />
          <TextField
            label="Commission %"
            labelCase="caps"
            inputMode="numeric"
            value={form.commission}
            onChange={(event) => set('commission')(event.target.value)}
          />
          <TextField
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
            Create Agent
          </Button>
          <Button className={styles.cancel} variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
