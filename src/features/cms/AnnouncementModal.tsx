import { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircleIcon } from '../../components/icons';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { TextAreaField } from '../../components/ui/TextField/TextAreaField';
import { TextField } from '../../components/ui/TextField/TextField';
import styles from './AnnouncementModal.module.css';

export type AnnouncementModalProps = {
  /** Section being added to — the title reads "Create New {section}". */
  section: string;
  onClose: () => void;
  onPublish: (draft: { title: string; target: string; body: string }) => void;
};

/** Create New dialog — node 119:56306. */
export function AnnouncementModal({ section, onClose, onPublish }: AnnouncementModalProps) {
  const [form, setForm] = useState({ title: '', target: '', body: '' });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onPublish({
      title: form.title.trim() || 'Untitled',
      target: form.target.trim() || 'All Users',
      body: form.body.trim(),
    });
  };

  return (
    <Modal title={`Create New ${section}`} width={520} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className={styles.fields}>
          <TextField
            label="Title"
            placeholder="Enter title..."
            value={form.title}
            onChange={(event) => set('title')(event.target.value)}
          />
          <TextField
            label="Target Audience"
            placeholder="Enter target audience..."
            value={form.target}
            onChange={(event) => set('target')(event.target.value)}
          />
          <TextAreaField
            className={styles.body}
            label="Message Body"
            placeholder="Enter message body..."
            value={form.body}
            onChange={(event) => set('body')(event.target.value)}
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
            Publish
          </Button>
          <Button className={styles.cancel} variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
