import {
  SUBDIVISION_COUNTS,
  type SubdivisionCount,
  subdivisionLabelKey,
} from '../audio/subdivision';
import { useTranslation } from '../i18n';
import type { Dictionary } from '../i18n/en';
import type { TimeSignature } from '../types';
import styles from './SubdivisionSelect.module.css';

interface Props {
  value: SubdivisionCount;
  timeSignature: TimeSignature;
  onChange: (count: SubdivisionCount) => void;
}

/**
 * Segmented control for how many equal clicks each beat is split into.
 * The available note-value labels depend on the time signature's own beat
 * unit (e.g. count 2 reads "Eighth" in 4/4 but "Sixteenth" in 6/8), so this
 * re-labels itself whenever the time signature changes rather than resetting.
 */
export function SubdivisionSelect({ value, timeSignature, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <fieldset className={styles.container}>
      <legend className={styles.label}>{t.subdivision}</legend>
      <div className={styles.options}>
        {SUBDIVISION_COUNTS.map((count) => {
          const selected = count === value;
          const labelKey: keyof Dictionary = subdivisionLabelKey(count, timeSignature.noteValue);
          return (
            <button
              key={count}
              type="button"
              aria-pressed={selected}
              className={selected ? `${styles.option} ${styles.selected}` : styles.option}
              onClick={() => onChange(count)}
            >
              {t[labelKey]}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
