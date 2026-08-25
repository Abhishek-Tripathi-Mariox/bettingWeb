import { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircleIcon } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { SelectField } from '../../components/ui/TextField/SelectField';
import { TextField } from '../../components/ui/TextField/TextField';
import { MARKET_STATUSES, MARKET_TYPES, NEW_MARKET } from './marketsData';
import type { MarketRow } from './marketsData';
import styles from './MarketFormModal.module.css';

export type MarketFormModalProps = {
  /** The row being edited, or null for a new market. */
  market: MarketRow | null;
  onClose: () => void;
  onSubmit: (market: MarketRow) => void;
};

/**
 * One dialog for both market form states — Add Market (node 119:49597) and
 * Edit Market (node 119:48795). Only the title, the name placeholder and the
 * submit label differ, so the mode is a prop rather than a second component.
 */
export function MarketFormModal({ market, onClose, onSubmit }: MarketFormModalProps) {
  const isEdit = market !== null;
  const base = market ?? NEW_MARKET;

  const [form, setForm] = useState({
    name: base.name,
    type: base.type,
    status: base.status,
    backOdds: base.backOdds,
    layOdds: base.layOdds,
    maxBet: base.maxBet,
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...base,
      name: form.name.trim() || 'New Market',
      type: form.type,
      status: form.status,
      backOdds: form.backOdds,
      layOdds: form.layOdds,
      maxBet: form.maxBet,
    });
  };

  return (
    <Modal title={isEdit ? 'Edit Market' : 'Add Market'} width={480} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <TextField
            fieldClassName={styles.wide}
            label="Market Name"
            labelCase="caps"
            placeholder="e.g. Match Winner"
            value={form.name}
            onChange={(event) => set('name')(event.target.value)}
          />
          <SelectField
            label="Market Type"
            options={MARKET_TYPES}
            placeholder={null}
            value={form.type}
            onChange={(event) => set('type')(event.target.value)}
          />
          <SelectField
            label="Status"
            options={MARKET_STATUSES}
            placeholder={null}
            value={form.status}
            onChange={(event) => set('status')(event.target.value)}
          />
          <TextField
            className={styles.back}
            label="Back Odds"
            labelCase="caps"
            inputMode="decimal"
            value={form.backOdds}
            onChange={(event) => set('backOdds')(event.target.value)}
          />
          <TextField
            className={styles.lay}
            label="Lay Odds"
            labelCase="caps"
            inputMode="decimal"
            value={form.layOdds}
            onChange={(event) => set('layOdds')(event.target.value)}
          />
          <TextField
            label="Max Bet"
            labelCase="caps"
            value={form.maxBet}
            onChange={(event) => set('maxBet')(event.target.value)}
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
            {isEdit ? 'Save Changes' : 'Add Market'}
          </Button>
          <Button className={styles.cancel} variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
