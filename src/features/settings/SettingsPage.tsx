import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  CheckCircleIcon,
  CopyIcon,
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
import { APP } from '../../config/app';
import {
  API_KEYS,
  API_STATUS_TONE,
  BETTING_LIMITS,
  BRAND_COLORS,
  BRAND_FIELDS,
  COMMISSION_CEILING,
  COMMISSION_RATES,
  EXPOSURE_LIMITS,
  PLATFORM_CONFIG,
  SETTINGS_TABS,
  SMS_FIELDS,
  SMTP_FIELDS,
  WALLET_RULES,
} from './settingsData';
import type { Field } from './settingsData';
import styles from './SettingsPage.module.css';

const TABS = SETTINGS_TABS.map((label) => ({ label }));

/** Platform settings — node 112:11029 plus its five other tab states. */
export function SettingsPage() {
  const [tab, setTab] = useState<string>(SETTINGS_TABS[0]);

  return (
    <div className={styles.page}>
      <PillTabs
        items={TABS}
        value={tab}
        variant="segmented"
        label="Settings sections"
        onChange={setTab}
      />

      {tab === 'General' ? (
        <div className={styles.pair}>
          <SettingsCard title="Platform Configuration" fields={PLATFORM_CONFIG} action="Save Changes" />
          <SettingsCard title="Wallet Rules" fields={WALLET_RULES} action="Update Wallet Rules" />
        </div>
      ) : null}

      {tab === 'Limits' ? (
        <div className={styles.pair}>
          <SettingsCard
            title="Betting Limits"
            subtitle="Global stake and exposure limits"
            fields={BETTING_LIMITS}
            action="Update Limits"
          />
          <SettingsCard
            title="Exposure Limits"
            subtitle="Risk control thresholds"
            fields={EXPOSURE_LIMITS}
            action="Update Exposure Limits"
          />
        </div>
      ) : null}

      {tab === 'Commission' ? <CommissionTab /> : null}

      {tab === 'Notifications' ? (
        <div className={styles.pair}>
          <SettingsCard
            title="Email Notifications"
            subtitle="SMTP / email provider config"
            fields={SMTP_FIELDS}
            fieldIcon={<MailIcon size={12.992} />}
            action="Save SMTP"
            secondary={{ label: 'Send Test Email', icon: <MailIcon size={13.993} /> }}
          />
          <SettingsCard
            title="SMS / OTP Config"
            subtitle="SMS gateway settings"
            fields={SMS_FIELDS}
            fieldIcon={<PhoneIcon size={12.992} />}
            action="Save SMS Config"
            actionIcon={<PhoneIcon size={13.993} />}
          />
        </div>
      ) : null}

      {tab === 'Brand' ? <BrandTab /> : null}

      {tab === 'API Keys' ? <ApiKeysTab /> : null}
    </div>
  );
}

type SettingsCardProps = {
  title: string;
  subtitle?: string;
  fields: Field[];
  /** Leading glyph inside every input — the SMTP and SMS cards use one. */
  fieldIcon?: ReactNode;
  action: string;
  actionIcon?: ReactNode;
  secondary?: { label: string; icon: ReactNode };
};

/** One settings panel: a titled card of fields over its save button. */
function SettingsCard({
  title,
  subtitle,
  fields,
  fieldIcon,
  action,
  actionIcon,
  secondary,
}: SettingsCardProps) {
  return (
    <section className={styles.card}>
      <p className={styles.cardTitle}>{title}</p>
      {subtitle ? <p className={styles.cardSubtitle}>{subtitle}</p> : null}

      <div className={styles.fields}>
        {fields.map((field) => (
          <TextField
            key={field.label}
            label={field.label}
            icon={fieldIcon}
            defaultValue={field.value}
          />
        ))}
      </div>

      <div className={styles.cardActions}>
        <Button variant="primary" size="sm" icon={actionIcon ?? <CheckCircleIcon size={13.993} />}>
          {action}
        </Button>
        {secondary ? (
          <Button className={styles.secondary} size="sm" icon={secondary.icon}>
            {secondary.label}
          </Button>
        ) : null}
      </div>
    </section>
  );
}

function CommissionTab() {
  return (
    <section className={styles.card}>
      <p className={styles.cardTitle}>Commission Structure</p>
      <p className={styles.cardSubtitle}>Set commission percentages by hierarchy level</p>

      <div className={styles.rates}>
        {COMMISSION_RATES.map((rate) => (
          <div key={rate.label}>
            <TextField
              className={styles.rateInput}
              label={rate.label}
              defaultValue={String(rate.rate)}
              inputMode="decimal"
            />
            <span className={styles.suffix}>%</span>
            <Meter
              className={styles.rateBar}
              label={`${rate.label} share`}
              percent={(rate.rate / COMMISSION_CEILING) * 100}
              fill="var(--color-primary)"
              height={6}
            />
          </div>
        ))}
      </div>

      <div className={styles.cardActions}>
        <Button variant="primary" size="sm" icon={<CheckCircleIcon size={13.993} />}>
          Save Commission Structure
        </Button>
      </div>
    </section>
  );
}

function BrandTab() {
  return (
    <div className={styles.pair}>
      <section className={styles.card}>
        <p className={styles.cardTitle}>Brand Identity</p>
        <p className={styles.cardSubtitle}>Logo, colors and platform name</p>

        <div className={styles.fields}>
          <div className={styles.upload}>
            <span className={styles.logoMark}>{APP.initial}</span>
            <p className={styles.uploadHint}>Click to upload · PNG, SVG · Max 2MB</p>
          </div>
          {BRAND_FIELDS.map((field) => (
            <TextField key={field.label} label={field.label} defaultValue={field.value} />
          ))}
        </div>

        <div className={styles.cardActions}>
          <Button variant="primary" size="sm" icon={<CheckCircleIcon size={13.993} />}>
            Save Brand Settings
          </Button>
        </div>
      </section>

      <section className={styles.card}>
        <p className={styles.cardTitle}>Brand Colors</p>
        <p className={styles.cardSubtitle}>Primary and accent color scheme</p>

        <div className={styles.fields}>
          {BRAND_COLORS.map((color) => (
            <div key={color.label} className={styles.colorField}>
              <p className={styles.colorLabel}>{color.label}</p>
              <div className={styles.colorRow}>
                <span className={styles.swatch} style={{ backgroundColor: color.hex }} />
                <TextField
                  fieldClassName={styles.colorInput}
                  label={color.label}
                  aria-label={color.label}
                  defaultValue={color.hex}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ApiKeysTab() {
  return (
    <section className={styles.card}>
      <div className={styles.apiHead}>
        <div>
          <p className={styles.cardTitle}>API Keys &amp; Integrations</p>
          <p className={styles.cardSubtitle}>Betting provider API connections</p>
        </div>
        <Button variant="primary" size="xs" icon={<PlusIcon size={12} />}>
          Add API Key
        </Button>
      </div>

      <div className={styles.apiList}>
        {API_KEYS.map((entry) => (
          <article key={entry.name} className={styles.apiRow}>
            <div className={styles.apiMain}>
              <div className={styles.apiMeta}>
                <p className={styles.apiName}>{entry.name}</p>
                <Badge tone={API_STATUS_TONE[entry.status]}>{entry.status}</Badge>
                {entry.latency ? <span className={styles.latency}>{entry.latency}</span> : null}
              </div>
              <p className={styles.apiKey}>{entry.key}</p>
            </div>

            <div className={styles.apiActions}>
              <Button className={styles.quiet} size="xs" aria-label={`Copy ${entry.name} key`}>
                <CopyIcon size={12.992} />
              </Button>
              <Button className={styles.quiet} size="xs" aria-label={`Edit ${entry.name}`}>
                <PencilIcon size={12.992} />
              </Button>
              <Button className={styles.delete} size="xs" aria-label={`Remove ${entry.name}`}>
                <TrashIcon size={12.992} />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
