import { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircleIcon } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { SelectField } from '../../components/ui/TextField/SelectField';
import { TextField } from '../../components/ui/TextField/TextField';
import { ApiRequestError } from '../../lib/api';
import type { ApiEvent } from '../../lib/api/events';
import type { ApiMarket, CreateMarketPayload, UpdateMarketPayload } from '../../lib/api/markets';
import { MARKET_STATUSES, MARKET_TYPES } from './marketsData';
import styles from './MarketFormModal.module.css';

export type MarketFormModalProps = {
  /** The market being edited, or null for a new market. */
  market: ApiMarket | null;
  /** Events available to attach a new market to. */
  events: ApiEvent[];
  onClose: () => void;
  onCreate: (payload: CreateMarketPayload) => Promise<void>;
  onUpdate: (id: string, payload: UpdateMarketPayload) => Promise<void>;
};

function eventIdOf(market: ApiMarket): string {
  return typeof market.event === 'string' ? market.event : market.event._id;
}

function eventLabel(event: ApiEvent): string {
  return `${event.name} · ${event.sport}`;
}

/**
 * One dialog for both market form states — Add Market (node 119:49597) and
 * Edit Market (node 119:48795). Only the title, the event field and the
 * submit label differ, so the mode is a prop rather than a second component.
 */
export function MarketFormModal({ market, events, onClose, onCreate, onUpdate }: MarketFormModalProps) {
  const isEdit = market !== null;
  const labelByEventId = new Map(events.map((event) => [event._id, eventLabel(event)]));
  const eventIdByLabel = new Map(events.map((event) => [eventLabel(event), event._id]));

  const [form, setForm] = useState({
    event: market ? eventIdOf(market) : (events[0]?._id ?? ''),
    code: market?.code ?? '',
    name: market?.name ?? '',
    type: market?.type ?? MARKET_TYPES[0],
    status: market?.status ?? 'Active',
    backOdds: market ? String(market.backOdds) : '1.90',
    layOdds: market ? String(market.layOdds) : '1.92',
    maxBet: market ? String(market.maxBet) : '100000',
    maxExposure: market ? String(market.maxExposure) : '500000',
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isEdit && !form.event) {
      setError('Choose an event for this market.');
      return;
    }
    if (!form.code.trim() || !form.name.trim()) {
      setError('Market code and name are required.');
      return;
    }
    const backOdds = Number(form.backOdds);
    const layOdds = Number(form.layOdds);
    const maxBet = Number(form.maxBet);
    const maxExposure = Number(form.maxExposure);
    if ([backOdds, layOdds, maxBet, maxExposure].some((value) => Number.isNaN(value))) {
      setError('Odds and limits must be numbers.');
      return;
    }

    setPending(true);
    setError(null);
    try {
      if (isEdit && market) {
        await onUpdate(market._id, {
          code: form.code.trim(),
          name: form.name.trim(),
          type: form.type,
          status: form.status as ApiMarket['status'],
          backOdds,
          layOdds,
          maxBet,
          maxExposure,
        });
      } else {
        await onCreate({
          event: form.event,
          code: form.code.trim(),
          name: form.name.trim(),
          type: form.type,
          backOdds,
          layOdds,
          maxBet,
          maxExposure,
        });
      }
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to reach the server. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal title={isEdit ? 'Edit Market' : 'Add Market'} width={480} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          {!isEdit ? (
            <SelectField
              label="Event"
              options={events.map(eventLabel)}
              placeholder={events.length === 0 ? 'No events available' : null}
              value={labelByEventId.get(form.event) ?? ''}
              onChange={(evt) => {
                const id = eventIdByLabel.get(evt.target.value);
                if (id) set('event')(id);
              }}
            />
          ) : null}
          <TextField
            label="Market Code"
            labelCase="caps"
            placeholder="e.g. MKT001"
            value={form.code}
            onChange={(evt) => set('code')(evt.target.value)}
          />
          <TextField
            fieldClassName={styles.wide}
            label="Market Name"
            labelCase="caps"
            placeholder="e.g. Match Winner"
            value={form.name}
            onChange={(evt) => set('name')(evt.target.value)}
          />
          <SelectField
            label="Market Type"
            options={MARKET_TYPES}
            placeholder={null}
            value={form.type}
            onChange={(evt) => set('type')(evt.target.value)}
          />
          <SelectField
            label="Status"
            options={MARKET_STATUSES}
            placeholder={null}
            value={form.status}
            onChange={(evt) => set('status')(evt.target.value)}
          />
          <TextField
            className={styles.back}
            label="Back Odds"
            labelCase="caps"
            inputMode="decimal"
            value={form.backOdds}
            onChange={(evt) => set('backOdds')(evt.target.value)}
          />
          <TextField
            className={styles.lay}
            label="Lay Odds"
            labelCase="caps"
            inputMode="decimal"
            value={form.layOdds}
            onChange={(evt) => set('layOdds')(evt.target.value)}
          />
          <TextField
            label="Max Bet"
            labelCase="caps"
            inputMode="numeric"
            value={form.maxBet}
            onChange={(evt) => set('maxBet')(evt.target.value)}
          />
          <TextField
            label="Max Exposure"
            labelCase="caps"
            inputMode="numeric"
            value={form.maxExposure}
            onChange={(evt) => set('maxExposure')(evt.target.value)}
          />
        </div>

        {error ? (
          <p role="alert" style={{ color: 'var(--color-danger)', margin: '0 0 8px', fontSize: 12 }}>
            {error}
          </p>
        ) : null}

        <div className={styles.footer}>
          <Button
            className={styles.submit}
            type="submit"
            variant="primary"
            size="sm"
            icon={<CheckCircleIcon size={13.993} />}
            disabled={pending}
          >
            {pending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Market'}
          </Button>
          <Button className={styles.cancel} variant="outline" size="sm" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
