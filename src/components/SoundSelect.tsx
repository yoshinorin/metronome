import { SOUND_PRESETS, type SoundId } from '../audio/sounds';
import { useTranslation } from '../i18n';
import type { Dictionary } from '../i18n/en';
import styles from './SoundSelect.module.css';

interface Props {
  value: SoundId;
  onChange: (soundId: SoundId) => void;
}

const LABEL_KEYS: Record<SoundId, keyof Dictionary> = {
  click: 'soundClick',
  beep: 'soundBeep',
  wood: 'soundWood',
  bell: 'soundBell',
};

/** Segmented control for picking the metronome's click timbre. */
export function SoundSelect({ value, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <fieldset className={styles.container}>
      <legend className={styles.label}>{t.sound}</legend>
      <div className={styles.options}>
        {SOUND_PRESETS.map((preset) => {
          const selected = preset.id === value;
          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={selected}
              className={selected ? `${styles.option} ${styles.selected}` : styles.option}
              onClick={() => onChange(preset.id)}
            >
              {t[LABEL_KEYS[preset.id]]}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
