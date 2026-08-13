import { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircleIcon, UserIcon } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { SelectField } from '../../components/ui/TextField/SelectField';
import { TextField } from '../../components/ui/TextField/TextField';
import type { Person } from './usersData';
import styles from './AddUserModal.module.css';

const AGENTS = ['Sahil Verma (AG-3310)', 'Nitin Yadav (AG-3324)', 'Farhan Ali (AG-3341)'] as const;
const KYC_OPTIONS = ['Verified', 'Pending', 'Rejected'] as const;

export type AddUserModalProps = {
  /** Singular noun for the record being created, e.g. "User". */
  title: string;
  onClose: () => void;
  onCreate: (person: Person) => void;
};

/** The create dialog from node 79:4484. */
export function AddUserModal({ title, onClose, onCreate }: AddUserModalProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    dob: '',
    balance: '0',
    city: '',
    state: '',
    agent: '',
    kyc: '',
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim() || `New ${title}`;
    onCreate({
      id: `U${Math.floor(1000 + form.name.length * 37 + form.phone.length)}`,
      name,
      email: form.email.trim() || '—',
      phone: form.phone.trim() || '—',
      balance: `₹${form.balance || '0'}`,
      totalBets: 0,
      kyc: (form.kyc as Person['kyc']) || 'Pending',
      status: 'Active',
      risk: 'low',
      joined: 'Today',
      bets: [],
    });
  };

  return (
    <Modal
      title={`Add New ${title}`}
      subtitle={`Create a new platform ${title.toLowerCase()} account`}
      onClose={onClose}
    >
      <div className={styles.banner}>
        <span className={styles.avatar}>
          <UserIcon size={19.999} />
        </span>
        <div>
          <p className={styles.bannerTitle}>New {title}</p>
          <p className={styles.bannerSubtitle}>Enter details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <TextField
            label="Full Name *"
            labelCase="caps"
            placeholder="Enter full name"
            value={form.name}
            onChange={(event) => set('name')(event.target.value)}
          />
          <TextField
            label="Email Address *"
            labelCase="caps"
            type="email"
            placeholder="user@example.com"
            value={form.email}
            onChange={(event) => set('email')(event.target.value)}
          />
          <TextField
            label="Phone Number *"
            labelCase="caps"
            placeholder="+91 XXXXX XXXXX"
            value={form.phone}
            onChange={(event) => set('phone')(event.target.value)}
          />
          <TextField
            label="Password *"
            labelCase="caps"
            type="password"
            placeholder="Min 8 characters"
            value={form.password}
            onChange={(event) => set('password')(event.target.value)}
          />
          <TextField
            label="Date of Birth"
            labelCase="caps"
            type="date"
            value={form.dob}
            onChange={(event) => set('dob')(event.target.value)}
          />
          <TextField
            label="Initial Balance (₹)"
            labelCase="caps"
            inputMode="numeric"
            placeholder="0"
            value={form.balance}
            onChange={(event) => set('balance')(event.target.value)}
          />
          <TextField
            label="City"
            labelCase="caps"
            placeholder="Mumbai"
            value={form.city}
            onChange={(event) => set('city')(event.target.value)}
          />
          <TextField
            label="State"
            labelCase="caps"
            placeholder="Maharashtra"
            value={form.state}
            onChange={(event) => set('state')(event.target.value)}
          />
          <SelectField
            label="Assign Agent"
            options={AGENTS}
            value={form.agent}
            onChange={(event) => set('agent')(event.target.value)}
          />
          <SelectField
            label="KYC Status"
            options={KYC_OPTIONS}
            value={form.kyc}
            onChange={(event) => set('kyc')(event.target.value)}
          />
        </div>

        <div className={styles.footer}>
          <Button
            className={styles.submit}
            type="submit"
            variant="primary"
            size="sm"
            icon={<CheckCircleIcon size={13.994} />}
          >
            Create {title}
          </Button>
          <Button className={styles.cancel} variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
