import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { PlusIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import type { BadgeTone } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { SectionCard } from '../../components/ui/SectionCard/SectionCard';
import { SelectField } from '../../components/ui/TextField/SelectField';
import { TextAreaField } from '../../components/ui/TextField/TextAreaField';
import { TextField } from '../../components/ui/TextField/TextField';
import { ApiRequestError } from '../../lib/api';
import { myTicketsApi } from '../../lib/api/support';
import type { ApiTicket, TicketPriority, TicketStatus } from '../../lib/api/support';
import { formatRelativeTime } from '../../lib/format';
import { useAuth } from '../auth/authContext';
import { usePermissions } from '../auth/usePermissions';
import { ticketCode } from './supportData';
import styles from './MyTickets.module.css';

const CATEGORIES = ['General', 'Wallet', 'KYC', 'Betting', 'Commission', 'Technical'];
const PRIORITIES: TicketPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

const STATUS_TONE: Record<TicketStatus, BadgeTone> = {
  Open: 'warning',
  'In Progress': 'info',
  Resolved: 'success',
  Closed: 'neutral',
};

const message = (err: unknown) => (err instanceof ApiRequestError ? err.message : 'Unable to reach the server.');

/**
 * The signed-in account's own support tickets: raising one needs the "Raise
 * Ticket" grant, the history and its replies the "View Tickets" grant — so a
 * role may have either, both or neither (then nothing is shown).
 */
export function MyTickets() {
  const { accessToken } = useAuth();
  const { can, loaded } = usePermissions();
  const canRaise = can('support', 'raiseTicket', 'X');
  const canView = can('support', 'viewTickets', 'V');

  const [tickets, setTickets] = useState<ApiTicket[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [raising, setRaising] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (!accessToken || !canView) return;
    myTicketsApi
      .list(accessToken)
      .then((res) => {
        setTickets(res.tickets);
        setError(null);
      })
      .catch((err) => setError(message(err)));
  }, [accessToken, canView]);

  useEffect(reload, [reload]);

  if (!loaded || (!canRaise && !canView)) return null;

  return (
    <SectionCard
      title="My Support Tickets"
      subtitle={canView ? 'Tickets you raised and the replies from support' : 'Raise a ticket and the support team will get back to you'}
      size="md"
      action={
        canRaise ? (
          <Button variant="primary" size="xs" icon={<PlusIcon size={12} />} onClick={() => setRaising(true)}>
            Raise Ticket
          </Button>
        ) : undefined
      }
    >
      {notice ? (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {canView ? (
        tickets === null ? (
          <p className={styles.empty}>Loading…</p>
        ) : tickets.length === 0 ? (
          <p className={styles.empty}>You haven't raised any tickets yet.</p>
        ) : (
          <ul className={styles.list}>
            {tickets.map((ticket) => (
              <li key={ticket._id}>
                <button type="button" className={styles.ticket} onClick={() => setOpenId(ticket._id)}>
                  <span className={styles.code}>{ticketCode(ticket)}</span>
                  <span className={styles.subject}>{ticket.subject}</span>
                  <span className={styles.meta}>
                    {ticket.category} · {ticket.priority} · {formatRelativeTime(ticket.updatedAt)} ·{' '}
                    {ticket.messages.length} message{ticket.messages.length === 1 ? '' : 's'}
                  </span>
                  <Badge tone={STATUS_TONE[ticket.status]}>{ticket.status}</Badge>
                </button>
              </li>
            ))}
          </ul>
        )
      ) : (
        <p className={styles.empty}>Your role can raise tickets; the support team replies on the contact you have on file.</p>
      )}

      {raising ? (
        <RaiseTicketModal
          onClose={() => setRaising(false)}
          onRaised={(ticket) => {
            setRaising(false);
            setNotice(`Ticket ${ticketCode(ticket)} raised — support has been notified.`);
            reload();
          }}
        />
      ) : null}

      {openId ? <TicketThread id={openId} onClose={() => setOpenId(null)} onChanged={reload} /> : null}
    </SectionCard>
  );
}

function RaiseTicketModal({ onClose, onRaised }: { onClose: () => void; onRaised: (ticket: ApiTicket) => void }) {
  const { accessToken } = useAuth();
  const [form, setForm] = useState({ subject: '', category: CATEGORIES[0], priority: 'Medium' as TicketPriority, body: '' });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) return;
    if (form.subject.trim().length < 4) return setError('Write a subject (at least 4 characters).');
    if (form.body.trim().length < 10) return setError('Describe the problem (at least 10 characters).');
    setPending(true);
    setError(null);
    try {
      const res = await myTicketsApi.raise({ ...form, subject: form.subject.trim(), body: form.body.trim() }, accessToken);
      onRaised(res.ticket);
    } catch (err) {
      setError(message(err));
      setPending(false);
    }
  };

  return (
    <Modal title="Raise a Support Ticket" subtitle="The support team is notified right away" width={520} onClose={onClose}>
      <form className={styles.form} onSubmit={submit}>
        <TextField
          label="Subject"
          labelCase="caps"
          placeholder="e.g. Deposit approved but balance not updated"
          maxLength={120}
          value={form.subject}
          onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
        />
        <div className={styles.pair}>
          <SelectField
            label="Category"
            options={CATEGORIES}
            placeholder={null}
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
          />
          <SelectField
            label="Priority"
            options={PRIORITIES}
            placeholder={null}
            value={form.priority}
            onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value as TicketPriority }))}
          />
        </div>
        <TextAreaField
          label="What happened?"
          placeholder="Include the User ID or Transaction ID if it's about one."
          rows={5}
          maxLength={2000}
          value={form.body}
          onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
        />
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        <div className={styles.footer}>
          <Button type="submit" variant="primary" size="sm" disabled={pending}>
            {pending ? 'Raising…' : 'Raise Ticket'}
          </Button>
          <Button variant="outline" size="sm" disabled={pending} onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function TicketThread({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const { accessToken } = useAuth();
  const [ticket, setTicket] = useState<ApiTicket | null>(null);
  const [reply, setReply] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    myTicketsApi
      .get(id, accessToken)
      .then((res) => {
        if (!cancelled) setTicket(res.ticket);
      })
      .catch((err) => {
        if (!cancelled) setError(message(err));
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken, id]);

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken || !reply.trim()) return;
    setPending(true);
    setError(null);
    try {
      const res = await myTicketsApi.reply(id, reply.trim(), accessToken);
      setTicket(res.ticket);
      setReply('');
      onChanged();
    } catch (err) {
      setError(message(err));
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal
      title={ticket ? `${ticketCode(ticket)} · ${ticket.subject}` : 'Ticket'}
      subtitle={ticket ? `${ticket.category} · ${ticket.priority} priority · ${ticket.status}` : 'Loading…'}
      width={560}
      onClose={onClose}
    >
      <div className={styles.thread}>
        {ticket?.messages.map((entry, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className={entry.fromSupport ? styles.fromSupport : styles.fromMe}>
            <p className={styles.bubbleMeta}>
              {entry.fromSupport ? 'Support' : 'You'} · {formatRelativeTime(entry.at)}
            </p>
            <p className={styles.bubble}>{entry.body}</p>
          </div>
        ))}
      </div>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      {ticket && ticket.status !== 'Closed' ? (
        <form className={styles.reply} onSubmit={send}>
          <TextAreaField
            label="Reply"
            placeholder="Write a reply to support…"
            rows={3}
            maxLength={2000}
            value={reply}
            onChange={(event) => setReply(event.target.value)}
          />
          <div className={styles.footer}>
            <Button type="submit" variant="primary" size="sm" disabled={pending || !reply.trim()}>
              {pending ? 'Sending…' : 'Send Reply'}
            </Button>
          </div>
        </form>
      ) : ticket ? (
        <p className={styles.empty}>This ticket is closed. Raise a new one if the problem is back.</p>
      ) : null}
    </Modal>
  );
}
