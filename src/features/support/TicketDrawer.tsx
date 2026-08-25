import type { CSSProperties } from 'react';
import { ChevronRightIcon, SendIcon } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { Drawer } from '../../components/ui/Drawer/Drawer';
import { TextAreaField } from '../../components/ui/TextField/TextAreaField';
import { cx } from '../../lib/cx';
import { PRIORITY_RGB, STATUS_RGB, TICKET_ACTIONS, TICKET_THREAD } from './supportData';
import type { Ticket } from './supportData';
import styles from './TicketDrawer.module.css';

/** Ticket detail sheet — node 119:63200. */
export function TicketDrawer({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  const meta = [
    { label: 'Category', value: ticket.category },
    { label: 'Assigned To', value: ticket.assignedTo },
    { label: 'Created', value: ticket.created },
    { label: 'Last Updated', value: ticket.updated },
  ];

  return (
    <Drawer
      label={`${ticket.id} detail`}
      width={620}
      headerClassName={styles.header}
      headerLayout="stack"
      onClose={onClose}
      header={
        <div className={styles.identity}>
          <p className={styles.breadcrumb}>
            <span className={styles.crumbRoot}>Support Tickets</span>
            <ChevronRightIcon size={9.996} />
            <span>{ticket.id}</span>
          </p>
          <p className={styles.subject}>{ticket.subject}</p>
          <div className={styles.chips}>
            <span className={styles.code}>{ticket.id}</span>
            <span
              className={styles.chip}
              style={{ '--chip-rgb': PRIORITY_RGB[ticket.priority] } as CSSProperties}
            >
              {ticket.priority.toUpperCase()}
            </span>
            <span
              className={styles.chip}
              style={{ '--chip-rgb': STATUS_RGB[ticket.status] } as CSSProperties}
            >
              {ticket.status}
            </span>
          </div>
        </div>
      }
    >
      <div className={styles.body}>
        <div className={styles.meta}>
          {meta.map((cell) => (
            <div key={cell.label} className={styles.metaCell}>
              <p className={styles.metaLabel}>{cell.label}</p>
              <p className={styles.metaValue}>{cell.value}</p>
            </div>
          ))}
        </div>

        <section className={styles.panel}>
          <p className={styles.panelLabel}>Raised By</p>
          <div className={styles.raisedBy}>
            <div className={styles.person}>
              <span className={styles.personAvatar}>{ticket.raisedBy.slice(0, 1)}</span>
              <div>
                <p className={styles.personName}>{ticket.raisedBy}</p>
                <p className={styles.personMeta}>
                  <span className={styles.roleChip}>{ticket.role}</span>
                  <span className={styles.code}>{ticket.raisedByCode}</span>
                </p>
              </div>
            </div>
            <Button className={styles.viewProfile} size="xs" trailingIcon={<ChevronRightIcon size={12} />}>
              View Profile
            </Button>
          </div>
        </section>

        <div className={styles.actions}>
          {TICKET_ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              className={styles.action}
              style={{ '--action-rgb': action.rgb } as CSSProperties}
            >
              {action.label}
            </button>
          ))}
          <button type="button" className={cx(styles.action, styles.actionNeutral)}>
            + Internal Note
          </button>
        </div>

        <section className={styles.panel}>
          <p className={styles.panelTitle}>Conversation</p>
          <div className={styles.thread}>
            {TICKET_THREAD.map((message) => (
              <article
                key={message.time}
                className={cx(styles.message, message.fromSupport && styles.fromSupport)}
              >
                <span
                  className={cx(styles.messageAvatar, message.fromSupport && styles.supportAvatar)}
                >
                  {message.author.slice(0, 1)}
                </span>
                <div className={styles.messageMain}>
                  <p className={styles.messageHead}>
                    <span className={styles.messageAuthor}>{message.author}</span>
                    <span className={styles.messageTime}>{message.time}</span>
                  </p>
                  <p className={cx(styles.bubble, message.fromSupport && styles.bubbleSupport)}>
                    {message.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <p className={styles.panelTitle}>Reply</p>
          <div className={styles.reply}>
            <TextAreaField
              className={styles.replyBox}
              label="Reply"
              aria-label="Reply"
              placeholder="Type your reply..."
            />
          </div>
          <div className={styles.replyActions}>
            <Button className={styles.clear} size="xs">
              Clear
            </Button>
            <Button variant="primary" size="xs" icon={<SendIcon size={12} />}>
              Send Reply
            </Button>
          </div>
        </section>
      </div>
    </Drawer>
  );
}
