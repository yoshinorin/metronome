import { VOLUME_MAX, VOLUME_MIN } from '../audio/volume';
import { useTranslation } from '../i18n';
import styles from './VolumeControl.module.css';

interface Props {
  volume: number;
  onChange: (volume: number) => void;
}

/** Master volume slider (0-100%). */
export function VolumeControl({ volume, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label} htmlFor="volume-input">
          {t.volume}
        </label>
        <span className={styles.value}>{volume}%</span>
      </div>
      <input
        id="volume-input"
        className={styles.slider}
        type="range"
        min={VOLUME_MIN}
        max={VOLUME_MAX}
        value={volume}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
