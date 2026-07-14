import { useState } from 'react';
import { useTranslation } from '../i18n';
import { BPM_MAX, BPM_MIN } from '../types';
import styles from './TempoControl.module.css';

interface Props {
  bpm: number;
  onChange: (bpm: number) => void;
}

/** BPM slider plus a numeric input. The numeric input commits on blur or Enter. */
export function TempoControl({ bpm, onChange }: Props) {
  const { t } = useTranslation();
  // Holds in-progress text while the user types, so partial values are not clamped.
  const [draft, setDraft] = useState<string | null>(null);

  const commitDraft = () => {
    if (draft !== null) {
      onChange(Number(draft));
      setDraft(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label} htmlFor="bpm-input">
          {t.tempo}
        </label>
        <div className={styles.value}>
          <input
            id="bpm-input"
            className={styles.number}
            type="number"
            min={BPM_MIN}
            max={BPM_MAX}
            value={draft ?? bpm}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitDraft}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.currentTarget.blur();
              }
            }}
          />
          <span className={styles.unit}>{t.bpmUnit}</span>
        </div>
      </div>
      <input
        className={styles.slider}
        type="range"
        min={BPM_MIN}
        max={BPM_MAX}
        value={bpm}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={t.tempo}
      />
    </div>
  );
}
