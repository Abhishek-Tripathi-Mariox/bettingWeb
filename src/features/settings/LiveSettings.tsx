import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  BanIcon,
  CheckCircleIcon,
  MailIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  TrashIcon,
} from '../../components/icons';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { Meter } from '../../components/ui/ProgressBar/ProgressBar';
import { PillTabs } from '../../components/ui/PillTabs/PillTabs';
import { TextField } from '../../components/ui/TextField/TextField';
import { useBranding } from '../../lib/brandingContext';
import { useAuth } from '../auth/authContext';
import { ApiRequestError } from '../../lib/api';
import { settingsApi } from '../../lib/api/settings';
import type { ApiKeyEntry, ApiSettings, SettingsSection, SettingsValues } from '../../lib/api/settings';
import { BRAND_COLOR_FIELDS, COMMISSION_CEILING, SECTION_FIELDS, SETTINGS_TABS } from './settingsData';
import type { SectionField } from './settingsData';
import styles from './SettingsPage.module.css';

const TABS = SETTINGS_TABS.map((label) => ({ label }));

const errorMessage = (err: unknown) =>
  err instanceof ApiRequestError ? err.message : 'Unable to reach the server.';

type SaveSection = (section: SettingsSection, values: SettingsValues) => Promise<void>;

/** Super-admin view of Platform Settings — every card reads and writes `/api/settings`. */
export function LiveSettings() {
  const { accessToken } = useAuth();
  const [tab, setTab] = useState<string>(SETTINGS_TABS[0]);
  const [settings, setSettings] = useState<ApiSettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    settingsApi
      .get(accessToken)
      .then((res) => {
        if (!cancelled) setSettings(res.settings);
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const { brand, initial: brandInitial, refresh: refreshBranding } = useBranding();

  const saveSection: SaveSection = async (section, values) => {
    if (!accessToken) return;
    // The backend replaces the whole section, so merge onto what's stored to keep untouched keys.
    // Brand is merged (and validated) server-side, so only this card's fields go up.
    const payload = section === 'brand' ? values : { ...(settings?.[section] ?? {}), ...values };
    const res = await settingsApi.updateSection(section, payload, accessToken);
    setSettings(res.settings);
    // The panel wears the brand: re-read it so the new colours / name / logo show at once.
    if (section === 'brand') await refreshBranding();
  };

  if (!settings) {
    return (
      <div className={styles.page}>
        <p className={styles.cardSubtitle}>{error ?? 'Loading…'}</p>
      </div>
    );
  }

  const card = (
    section: SettingsSection,
    title: string,
    action: string,
    extra: Partial<SectionCardProps> = {},
  ) => (
    <SectionCard
      title={title}
      action={action}
      fields={SECTION_FIELDS[section]}
      values={settings[section] ?? {}}
      onSave={(values) => saveSection(section, values)}
      {...extra}
    />
  );

  return (
    <div className={styles.page}>
      <PillTabs items={TABS} value={tab} variant="segmented" label="Settings sections" onChange={setTab} />

      {tab === 'General' ? (
        <div className={styles.pair}>
          {card('general', 'Platform Configuration', 'Save Changes')}
          {card('walletRules', 'Wallet Rules', 'Update Wallet Rules')}
        </div>
      ) : null}

      {tab === 'Limits' ? (
        <div className={styles.pair}>
          {card('bettingLimits', 'Betting Limits', 'Update Limits', { subtitle: 'Global stake limits' })}
          {card('exposureLimits', 'Exposure Limits', 'Update Exposure Limits', {
            subtitle: 'Risk control thresholds',
          })}
        </div>
      ) : null}

      {tab === 'Commission'
        ? card('commissionRates', 'Commission Structure', 'Save Commission Structure', {
            subtitle: 'Set commission percentages by hierarchy level',
            rates: true,
          })
        : null}

      {tab === 'Notifications' ? (
        <div className={styles.pair}>
          {card('smtp', 'Email Notifications', 'Save SMTP', {
            subtitle: 'SMTP / email provider config',
            fieldIcon: <MailIcon size={12.992} />,
          })}
          {card('sms', 'SMS / OTP Config', 'Save SMS Config', {
            subtitle: 'SMS gateway settings',
            fieldIcon: <PhoneIcon size={12.992} />,
            actionIcon: <PhoneIcon size={13.993} />,
          })}
        </div>
      ) : null}

      {tab === 'Brand' ? (
        <div className={styles.pair}>
          {card('brand', 'Brand Identity', 'Save Brand Settings', {
            subtitle: 'Logo, colors and platform name',
            leading: (
              <div className={styles.upload}>
                {brand.logoUrl ? (
                  <img className={styles.logoMark} src={brand.logoUrl} alt="Current logo" style={{ objectFit: 'cover' }} />
                ) : (
                  <span className={styles.logoMark}>{brandInitial}</span>
                )}
              </div>
            ),
          })}
          {card('brand', 'Brand Colors', 'Save Brand Colors', {
            subtitle: 'Primary and accent color scheme',
            fields: BRAND_COLOR_FIELDS,
            swatches: true,
          })}
        </div>
      ) : null}

      {tab === 'API Keys' ? <ApiKeysTab apiKeys={settings.apiKeys} onChange={setSettings} /> : null}
    </div>
  );
}

type SectionCardProps = {
  title: string;
  subtitle?: string;
  fields: readonly SectionField[];
  values: SettingsValues;
  fieldIcon?: ReactNode;
  action: string;
  actionIcon?: ReactNode;
  leading?: ReactNode;
  /** Commission layout: `%` suffix and a share bar under each input. */
  rates?: boolean;
  /** Brand-colour layout: a swatch beside each input. */
  swatches?: boolean;
  onSave: (values: SettingsValues) => Promise<void>;
};

const toDraft = (fields: readonly SectionField[], values: SettingsValues) =>
  Object.fromEntries(fields.map((field) => [field.key, values[field.key] == null ? '' : String(values[field.key])]));

function SectionCard({
  title,
  subtitle,
  fields,
  values,
  fieldIcon,
  action,
  actionIcon,
  leading,
  rates,
  swatches,
  onSave,
}: SectionCardProps) {
  const [draft, setDraft] = useState<Record<string, string>>(() => toDraft(fields, values));
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async () => {
    const next: SettingsValues = {};
    for (const field of fields) {
      const raw = draft[field.key].trim();
      if (field.type === 'number') {
        if (raw === '') continue;
        const parsed = Number(raw);
        if (Number.isNaN(parsed)) {
          setMessage(`${field.label} must be a number.`);
          return;
        }
        next[field.key] = parsed;
      } else {
        next[field.key] = raw;
      }
    }
    setPending(true);
    setMessage(null);
    try {
      await onSave(next);
      setMessage('Saved.');
    } catch (err) {
      setMessage(errorMessage(err));
    } finally {
      setPending(false);
    }
  };

  const set = (key: string) => (value: string) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <section className={styles.card}>
      <p className={styles.cardTitle}>{title}</p>
      {subtitle ? <p className={styles.cardSubtitle}>{subtitle}</p> : null}

      <div className={rates ? styles.rates : styles.fields}>
        {leading}
        {fields.map((field) => {
          const input = (
            <TextField
              key={field.key}
              className={rates ? styles.rateInput : undefined}
              fieldClassName={swatches ? styles.colorInput : undefined}
              label={field.label}
              aria-label={field.label}
              icon={fieldIcon}
              inputMode={field.type === 'number' ? 'decimal' : undefined}
              value={draft[field.key]}
              onChange={(event) => set(field.key)(event.target.value)}
            />
          );

          if (rates) {
            const rate = Number(draft[field.key]) || 0;
            return (
              <div key={field.key}>
                {input}
                <span className={styles.suffix}>%</span>
                <Meter
                  className={styles.rateBar}
                  label={`${field.label} share`}
                  percent={Math.min(100, (rate / COMMISSION_CEILING) * 100)}
                  fill="var(--color-primary)"
                  height={6}
                />
              </div>
            );
          }

          if (swatches) {
            return (
              <div key={field.key} className={styles.colorField}>
                <p className={styles.colorLabel}>{field.label}</p>
                <div className={styles.colorRow}>
                  <span className={styles.swatch} style={{ backgroundColor: draft[field.key] || 'transparent' }} />
                  {input}
                </div>
              </div>
            );
          }

          return input;
        })}
      </div>

      {message ? <p className={styles.cardSubtitle}>{message}</p> : null}

      <div className={styles.cardActions}>
        <Button
          variant="primary"
          size="sm"
          disabled={pending}
          icon={actionIcon ?? <CheckCircleIcon size={13.993} />}
          onClick={save}
        >
          {pending ? 'Saving…' : action}
        </Button>
      </div>
    </section>
  );
}

function ApiKeysTab({ apiKeys, onChange }: { apiKeys: ApiKeyEntry[]; onChange: (settings: ApiSettings) => void }) {
  const { accessToken } = useAuth();
  /** null = no form, 'new' = add, an entry = edit. */
  const [editing, setEditing] = useState<ApiKeyEntry | 'new' | null>(null);
  const [form, setForm] = useState({ name: '', key: '' });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: () => Promise<{ settings: ApiSettings }>) => {
    setPending(true);
    setError(null);
    try {
      const res = await action();
      onChange(res.settings);
      return true;
    } catch (err) {
      setError(errorMessage(err));
      return false;
    } finally {
      setPending(false);
    }
  };

  const openForm = (entry: ApiKeyEntry | 'new') => {
    setEditing(entry);
    setForm({ name: entry === 'new' ? '' : entry.name, key: '' });
    setError(null);
  };

  const submit = async () => {
    if (!accessToken || !editing) return;
    if (!form.name.trim() || (editing === 'new' && !form.key.trim())) {
      setError(editing === 'new' ? 'Name and key are required.' : 'Name is required.');
      return;
    }
    const ok = await run(() =>
      editing === 'new'
        ? settingsApi.addApiKey({ name: form.name.trim(), key: form.key.trim() }, accessToken)
        : settingsApi.updateApiKey(
            editing._id,
            { name: form.name.trim(), ...(form.key.trim() ? { key: form.key.trim() } : {}) },
            accessToken,
          ),
    );
    if (ok) setEditing(null);
  };

  return (
    <section className={styles.card}>
      <div className={styles.apiHead}>
        <div>
          <p className={styles.cardTitle}>API Keys &amp; Integrations</p>
          <p className={styles.cardSubtitle}>Betting provider API connections</p>
        </div>
        <Button variant="primary" size="xs" icon={<PlusIcon size={12} />} onClick={() => openForm('new')}>
          Add API Key
        </Button>
      </div>

      {editing ? (
        <div className={styles.fields}>
          <TextField label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <TextField
            label={editing === 'new' ? 'Key' : 'New Key (leave blank to keep current)'}
            value={form.key}
            onChange={(event) => setForm({ ...form, key: event.target.value })}
          />
          <div className={styles.cardActions}>
            <Button variant="primary" size="sm" disabled={pending} onClick={submit}>
              {pending ? 'Saving…' : editing === 'new' ? 'Add Key' : 'Save Key'}
            </Button>
            <Button className={styles.secondary} size="sm" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {error ? <p className={styles.cardSubtitle}>{error}</p> : null}

      <div className={styles.apiList}>
        {apiKeys.length === 0 ? <p className={styles.cardSubtitle}>No API keys configured.</p> : null}
        {apiKeys.map((entry) => {
          const active = entry.status === 'Active';
          return (
            <article key={entry._id} className={styles.apiRow}>
              <div className={styles.apiMain}>
                <div className={styles.apiMeta}>
                  <p className={styles.apiName}>{entry.name}</p>
                  <Badge tone={active ? 'success' : 'warning'}>{entry.status}</Badge>
                  {entry.latency > 0 ? <span className={styles.latency}>{entry.latency}ms</span> : null}
                </div>
                <p className={styles.apiKey}>{entry.key}</p>
              </div>

              <div className={styles.apiActions}>
                <Button
                  className={styles.quiet}
                  size="xs"
                  aria-label={`${active ? 'Deactivate' : 'Activate'} ${entry.name}`}
                  disabled={pending || !accessToken}
                  onClick={() =>
                    accessToken &&
                    run(() =>
                      settingsApi.updateApiKey(entry._id, { status: active ? 'Inactive' : 'Active' }, accessToken),
                    )
                  }
                >
                  {active ? <BanIcon size={12.992} /> : <CheckCircleIcon size={12.992} />}
                </Button>
                <Button
                  className={styles.quiet}
                  size="xs"
                  aria-label={`Edit ${entry.name}`}
                  onClick={() => openForm(entry)}
                >
                  <PencilIcon size={12.992} />
                </Button>
                <Button
                  className={styles.delete}
                  size="xs"
                  aria-label={`Remove ${entry.name}`}
                  disabled={pending || !accessToken}
                  onClick={() => accessToken && run(() => settingsApi.removeApiKey(entry._id, accessToken))}
                >
                  <TrashIcon size={12.992} />
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
