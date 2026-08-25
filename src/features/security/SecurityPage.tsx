import { useState } from 'react';
import { BanIcon, CheckCircleIcon, ExportIcon, PencilIcon, PlusIcon, ShieldCheckIcon, TrashIcon } from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { DataTable } from '../../components/ui/DataTable/DataTable';
import type { Column } from '../../components/ui/DataTable/DataTable';
import { PillTabs } from '../../components/ui/PillTabs/PillTabs';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { Switch } from '../../components/ui/Switch/Switch';
import { TextField } from '../../components/ui/TextField/TextField';
import { cx } from '../../lib/cx';
import {
  AUDIT_TRAIL,
  LOG_STATUS_TONE,
  PASSWORD_POLICY,
  SECURITY_LOGS,
  SECURITY_STATS,
  SECURITY_TABS,
  SECURITY_TOGGLES,
  SESSIONS,
  WHITELIST,
} from './securityData';
import type { SecurityLog, WhitelistEntry } from './securityData';
import styles from './SecurityPage.module.css';

const TABS = SECURITY_TABS.map((label) => ({ label }));

/** Security console — node 112:10472 plus its four tab states. */
export function SecurityPage() {
  const [tab, setTab] = useState<string>(SECURITY_TABS[0]);

  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {SECURITY_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className={styles.card}>
        <PillTabs items={TABS} value={tab} size="sm" label="Security sections" onChange={setTab} />

        <div className={styles.body}>
          {tab === 'Logs' ? <LogsTab /> : null}
          {tab === 'Sessions' ? <SessionsTab /> : null}
          {tab === 'Audit' ? <AuditTab /> : null}
          {tab === 'IP Whitelist' ? <WhitelistTab /> : null}
          {tab === 'Settings' ? <SettingsTab /> : null}
        </div>
      </section>
    </div>
  );
}

function LogsTab() {
  const columns: Column<SecurityLog>[] = [
    { key: 'user', header: 'User', render: (row) => <span className={styles.logUser}>{row.user}</span> },
    { key: 'action', header: 'Action', render: (row) => <span className={styles.logAction}>{row.action}</span> },
    {
      key: 'ip',
      header: 'IP Address',
      render: (row) => (
        <span className={cx(styles.ip, row.status === 'Failed' && styles.ipFlagged)}>{row.ip}</span>
      ),
    },
    { key: 'device', header: 'Device', render: (row) => <span className={styles.meta}>{row.device}</span> },
    { key: 'time', header: 'Time', render: (row) => <span className={styles.meta}>{row.time}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge tone={LOG_STATUS_TONE[row.status]}>{row.status}</Badge>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={SECURITY_LOGS}
      rowKey={(row) => row.id}
      rowClassName={(row) => (row.status === 'Failed' ? styles.logFailed : undefined)}
      size="md"
      emptyMessage="No security events logged."
    />
  );
}

function SessionsTab() {
  return (
    <div className={styles.stack}>
      <div className={styles.tabHead}>
        <p className={styles.tabTitle}>Active Sessions — {SESSIONS.length} users</p>
        <Button className={styles.danger} size="xs" icon={<BanIcon size={12} />}>
          Revoke All
        </Button>
      </div>

      {SESSIONS.map((session) => (
        <article key={session.id} className={cx(styles.session, session.own && styles.sessionOwn)}>
          <span className={styles.avatar}>{session.name.slice(0, 1)}</span>
          <div className={styles.sessionMain}>
            <p className={styles.sessionName}>
              {session.name}
              {session.own ? <span className={styles.you}>YOU</span> : null}
            </p>
            <p className={styles.sessionMeta}>
              {session.role} · {session.device} · {session.location} · {session.ip}
            </p>
          </div>
          <div className={styles.sessionSide}>
            <span className={styles.duration}>{session.duration}</span>
            {session.own ? null : (
              <button type="button" className={styles.revoke}>
                Revoke
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function AuditTab() {
  return (
    <div>
      <div className={styles.tabHead}>
        <p className={styles.tabTitle}>Admin Audit Trail</p>
        <Button className={styles.quiet} size="xs" icon={<ExportIcon size={12} />}>
          Export Logs
        </Button>
      </div>

      {AUDIT_TRAIL.map((entry) => (
        <article key={entry.id} className={styles.audit}>
          <span className={styles.auditTile}>
            <ShieldCheckIcon size={13.993} />
          </span>
          <div className={styles.auditMain}>
            <p className={styles.auditActor}>{entry.actor}</p>
            <p className={styles.auditDescription}>{entry.description}</p>
            <p className={styles.auditTime}>{entry.time}</p>
          </div>
          <div className={styles.auditSide}>
            <Badge tone="brand">{entry.category}</Badge>
            <span className={styles.ip}>{entry.ip}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function WhitelistTab() {
  const [enforced, setEnforced] = useState(true);

  const columns: Column<WhitelistEntry>[] = [
    {
      key: 'ip',
      header: 'IP Address',
      render: (row) => (
        <span className={cx(styles.ipLarge, row.status === 'Blocked' && styles.ipFlagged)}>{row.ip}</span>
      ),
    },
    { key: 'label', header: 'Label', render: (row) => <span className={styles.wlLabel}>{row.label}</span> },
    { key: 'added', header: 'Added', render: (row) => <span className={styles.meta}>{row.added}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge tone={row.status === 'Active' ? 'success' : 'info'}>{row.status}</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className={styles.rowActions}>
          <Button className={styles.edit} size="xs" aria-label={`Edit ${row.ip}`}>
            <PencilIcon size={12} />
          </Button>
          <Button className={styles.delete} size="xs" aria-label={`Remove ${row.ip}`}>
            <TrashIcon size={12} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.tabHead}>
        <div>
          <p className={styles.tabTitle}>IP Whitelist Management</p>
          <p className={styles.tabSubtitle}>Only whitelisted IPs can access admin panel</p>
        </div>
        <div className={styles.wlActions}>
          <span className={styles.wlToggle}>
            <span className={styles.wlToggleLabel}>Whitelist Mode</span>
            <Switch
              className={styles.wlSwitch}
              checked={enforced}
              onChange={setEnforced}
              label="Whitelist mode"
              size="sm"
            />
          </span>
          <Button variant="primary" size="xs" icon={<PlusIcon size={12} />}>
            Add IP
          </Button>
        </div>
      </div>

      <div className={styles.wlTable}>
        <DataTable
          columns={columns}
          rows={WHITELIST}
          rowKey={(row) => row.ip}
          size="md"
          emptyMessage="No addresses whitelisted."
        />
      </div>
    </div>
  );
}

function SettingsTab() {
  const [toggles, setToggles] = useState(SECURITY_TOGGLES);

  const flip = (index: number) =>
    setToggles((current) =>
      current.map((item, i) => (i === index ? { ...item, on: !item.on } : item)),
    );

  return (
    <div className={styles.settings}>
      <section>
        <p className={styles.tabTitle}>Security Toggles</p>
        <div className={styles.toggleList}>
          {toggles.map((toggle, index) => (
            <div key={toggle.title} className={styles.toggleRow}>
              <div>
                <p className={styles.toggleTitle}>{toggle.title}</p>
                <p className={styles.toggleDescription}>{toggle.description}</p>
              </div>
              <Switch
                size="lg"
                checked={toggle.on}
                onChange={() => flip(index)}
                label={toggle.title}
                color={toggle.color}
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className={styles.tabTitle}>Password Policy</p>
        <div className={styles.policy}>
          {PASSWORD_POLICY.map((field) => (
            <TextField key={field.label} label={field.label} defaultValue={field.value} />
          ))}
        </div>
        <div className={styles.policyActions}>
          <Button variant="primary" size="sm" icon={<CheckCircleIcon size={13.993} />}>
            Save Policy
          </Button>
        </div>
      </section>
    </div>
  );
}
