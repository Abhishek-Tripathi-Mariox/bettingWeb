import { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircleIcon } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { SelectField } from '../../components/ui/TextField/SelectField';
import { TextAreaField } from '../../components/ui/TextField/TextAreaField';
import { TextField } from '../../components/ui/TextField/TextField';
import { NEW_PARTNER, PARTNER_STATUSES, PARTNER_TYPES } from './partnershipData';
import type { Partner } from './partnershipData';
import styles from './PartnerFormModal.module.css';

export type PartnerFormModalProps = {
  /** The partner being edited, or null for a new one. */
  partner: Partner | null;
  onClose: () => void;
  onSubmit: (partner: Partner) => void;
};

/**
 * One dialog for both partner form states — Add Partnership (node 119:51060)
 * and Edit Partnership (node 119:54518). Only the title, the field values and
 * the submit label differ, so the mode is a prop rather than a second file.
 */
export function PartnerFormModal({ partner, onClose, onSubmit }: PartnerFormModalProps) {
  const isEdit = partner !== null;
  const base = partner ?? NEW_PARTNER;

  const [form, setForm] = useState({
    name: base.name,
    type: base.type,
    revShare: base.revShare,
    monthlyFee: base.monthlyFee,
    contact: base.contact,
    email: base.email,
    website: base.website,
    status: base.status,
    apiKey: base.apiKey,
    notes: base.notes,
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...base,
      ...form,
      name: form.name.trim() || 'New Partner',
    });
  };

  return (
    <Modal title={isEdit ? 'Edit Partnership' : 'Add Partnership'} width={560} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <TextField
            fieldClassName={styles.wide}
            label="Partner Name"
            labelCase="caps"
            placeholder="e.g. Diamond Exchange"
            value={form.name}
            onChange={(event) => set('name')(event.target.value)}
          />
          <SelectField
            label="Partner Type"
            options={PARTNER_TYPES}
            placeholder={null}
            value={form.type}
            onChange={(event) => set('type')(event.target.value)}
          />
          <TextField
            label="Revenue Share %"
            labelCase="caps"
            value={form.revShare}
            onChange={(event) => set('revShare')(event.target.value)}
          />
          <TextField
            label="Monthly Fee"
            labelCase="caps"
            value={form.monthlyFee}
            onChange={(event) => set('monthlyFee')(event.target.value)}
          />
          <TextField
            label="Contact Person"
            labelCase="caps"
            placeholder="Name"
            value={form.contact}
            onChange={(event) => set('contact')(event.target.value)}
          />
          <TextField
            label="Email"
            labelCase="caps"
            type="email"
            placeholder="partner@example.com"
            value={form.email}
            onChange={(event) => set('email')(event.target.value)}
          />
          <TextField
            label="Website"
            labelCase="caps"
            placeholder="https://..."
            value={form.website}
            onChange={(event) => set('website')(event.target.value)}
          />
          <SelectField
            label="Status"
            options={PARTNER_STATUSES}
            placeholder={null}
            value={form.status}
            onChange={(event) => set('status')(event.target.value)}
          />
          <TextField
            fieldClassName={styles.wide}
            label="API Key / Token"
            labelCase="caps"
            placeholder="API key or integration token"
            value={form.apiKey}
            onChange={(event) => set('apiKey')(event.target.value)}
          />
          <TextAreaField
            fieldClassName={styles.wide}
            label="Notes"
            placeholder="Integration notes, SLA terms..."
            value={form.notes}
            onChange={(event) => set('notes')(event.target.value)}
          />
        </div>

        <div className={styles.footer}>
          <Button
            className={styles.submit}
            type="submit"
            variant="primary"
            size="sm"
            icon={<CheckCircleIcon size={13.993} />}
          >
            {isEdit ? 'Save Changes' : 'Add Partnership'}
          </Button>
          <Button className={styles.cancel} variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
