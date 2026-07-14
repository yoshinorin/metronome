import { isAccentedBeat } from '../audio/timing';
import { useTranslation } from '../i18n';
import type { TimeSignature } from '../types';
import styles from './BeatIndicator.module.css';

interface Props {
  timeSignature: TimeSignature;
  /** Zero-indexed current beat, or null while stopped. */
  currentBeat: number | null;
}

/** One dot per beat; the current beat lights up, accented beats are larger. */
export function BeatIndicator({ timeSignature, currentBeat }: Props) {
  const { t } = useTranslation();
  return (
    <div className={styles.row} role="status" aria-label={t.beatIndicator}>
      {Array.from({ length: timeSignature.beats }, (_, beat) => {
        const classNames = [styles.dot];
        if (isAccentedBeat(beat, timeSignature)) {
          classNames.push(styles.accent);
        }
        if (beat === currentBeat) {
          classNames.push(styles.active);
        }
        // biome-ignore lint/suspicious/noArrayIndexKey: a beat's position within the measure is its identity
        return <span key={beat} className={classNames.join(' ')} data-testid="beat-dot" />;
      })}
    </div>
  );
}
