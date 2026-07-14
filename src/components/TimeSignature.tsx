import { useTranslation } from '../i18n';
import { TIME_SIGNATURES, type TimeSignature } from '../types';
import styles from './TimeSignature.module.css';

interface Props {
  value: TimeSignature;
  onChange: (timeSignature: TimeSignature) => void;
}

/** Segmented control for picking the time signature. */
export function TimeSignatureSelect({ value, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <fieldset className={styles.container}>
      <legend className={styles.label}>{t.timeSignature}</legend>
      <div className={styles.options}>
        {TIME_SIGNATURES.map((timeSignature) => {
          const label = `${timeSignature.beats}/${timeSignature.noteValue}`;
          const selected =
            timeSignature.beats === value.beats && timeSignature.noteValue === value.noteValue;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={selected}
              className={selected ? `${styles.option} ${styles.selected}` : styles.option}
              onClick={() => onChange(timeSignature)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
