import { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircleIcon } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { SelectField } from '../../components/ui/TextField/SelectField';
import { TextField } from '../../components/ui/TextField/TextField';
import { COMMISSION_TYPES } from './franchisesData';
import type { Franchise } from './franchisesData';
import styles from '../users/AddUserModal.module.css';

export type CreateFranchiseModalProps = {
  onClose: () => void;
  onCreate: (franchise: Franchise) => void;
};

const EMPTY = {
  name: '',
  owner: '',
  phone: '',
  email: '',
  state: '',
  city: '',
  credit: '',
  password: '',
  commissionType: '',
  shareHolding: '',
  matchCommission: '',
  myMatchCommission: '',
  sessionCommission: '',
  mySessionCommission: '',
};

/**
 * Create Franchise dialog — nodes 101:2 and 101:803. The four commission
 * splits (101:803) appear once a commission type is chosen, which is the only
 * difference between the two frames.
 */
export function CreateFranchiseModal({ onClose, onCreate }: CreateFranchiseModalProps) {
  const [form, setForm] = useState(EMPTY);
  const set = (key: keyof typeof EMPTY) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim() || 'New Franchise';
    onCreate({
      id: `new-${name}`,
      code: 'F—',
      name,
      owner: form.owner.trim() || '—',
      status: 'Active',
      superAgents: 0,
      agents: 0,
      users: '0',
      revenue: '₹0',
      credit: form.credit ? `₹${form.credit}` : '₹0',
      exposure: '₹0',
      commission: '₹0',
      phone: form.phone.trim() || '—',
      email: form.email.trim() || '—',
      location: [form.city, form.state].filter(Boolean).join(', ') || '—, —',
      joined: 'Today',
    });
  };

  return (
    <Modal title="Create Franchise" subtitle="Register a new franchise account" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className={styles.grid} style={{ paddingTop: 0 }}>
          <TextField
            label="Franchise Name *"
            labelCase="caps"
            placeholder="e.g. Hyderabad Franchise"
            value={form.name}
            onChange={(event) => set('name')(event.target.value)}
          />
          <TextField
            label="Owner Name *"
            labelCase="caps"
            placeholder="Full name"
            value={form.owner}
            onChange={(event) => set('owner')(event.target.value)}
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
            placeholder="franchise@email.com"
            value={form.email}
            onChange={(event) => set('email')(event.target.value)}
          />
          <TextField
            label="State"
            labelCase="caps"
            placeholder="Maharashtra"
            value={form.state}
            onChange={(event) => set('state')(event.target.value)}
          />
          <TextField
            label="City"
            labelCase="caps"
            placeholder="Mumbai"
            value={form.city}
            onChange={(event) => set('city')(event.target.value)}
          />
          <TextField
            label="Credit Limit (₹)"
            labelCase="caps"
            placeholder="e.g. 2Cr"
            value={form.credit}
            onChange={(event) => set('credit')(event.target.value)}
          />
          <TextField
            label="Login Password *"
            labelCase="caps"
            type="password"
            placeholder="Min 8 characters"
            value={form.password}
            onChange={(event) => set('password')(event.target.value)}
          />
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

          {form.commissionType ? (
            <>
              <TextField
                label="Match Commision"
                labelCase="caps"
                placeholder="--%"
                value={form.matchCommission}
                onChange={(event) => set('matchCommission')(event.target.value)}
              />
              <TextField
                label="My Match Commission"
                labelCase="caps"
                placeholder="--%"
                value={form.myMatchCommission}
                onChange={(event) => set('myMatchCommission')(event.target.value)}
              />
              <TextField
                label="Session Commission"
                labelCase="caps"
                placeholder="--%"
                value={form.sessionCommission}
                onChange={(event) => set('sessionCommission')(event.target.value)}
              />
              <TextField
                label="My Session Commission"
                labelCase="caps"
                placeholder="--%"
                value={form.mySessionCommission}
                onChange={(event) => set('mySessionCommission')(event.target.value)}
              />
            </>
          ) : null}
        </div>

        <div className={styles.footer}>
          <Button
            className={styles.submit}
            type="submit"
            variant="primary"
            size="sm"
            icon={<CheckCircleIcon size={13.994} />}
          >
            Create Franchise
          </Button>
          <Button className={styles.cancel} variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
