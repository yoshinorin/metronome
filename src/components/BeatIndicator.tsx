import { BEAT_LEVEL_MAX } from '../audio/beatLevels';
import { isAccentedBeat } from '../audio/timing';
import { useTranslation } from '../i18n';
import type { TimeSignature } from '../types';
import styles from './BeatIndicator.module.css';

interface Props {
  timeSignature: TimeSignature;
  /** Zero-indexed current beat, or null while stopped. */
  currentBeat: number | null;
  /** Per-beat volume levels (1-5, level 1 is muted). */
  beatLevels: number[];
  /** Called when a beat is clicked to cycle its volume level. */
  onBeatClick: (beat: number) => void;
}

/**
 * One bar per beat, like a tiny equalizer: a fixed-height track (marked
 * with divider lines at each volume step) holds a fill whose height
 * encodes the level (1-5). Level 1 (muted) renders as zero fill height,
 * leaving the empty track visible. The current beat lights up in accent
 * color; on an accented beat that color is a distinct shade, but every
 * track is the same width — accent is color-only.
 */
export function BeatIndicator({ timeSignature, currentBeat, beatLevels, onBeatClick }: Props) {
  const { t } = useTranslation();
  return (
    <div className={styles.row}>
      {Array.from({ length: timeSignature.beats }, (_, beat) => {
        const level = beatLevels[beat] ?? BEAT_LEVEL_MAX;
        const trackClassNames = [styles.track];
        if (isAccentedBeat(beat, timeSignature)) {
          trackClassNames.push(styles.accent);
        }
        const fillClassNames = [styles.fill, styles[`level${level}`]];
        if (beat === currentBeat) {
          fillClassNames.push(styles.active);
        }
        return (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: a beat's position within the measure is its identity
            key={beat}
            type="button"
            className={styles.beat}
            onClick={() => onBeatClick(beat)}
            aria-label={`${t.beat} ${beat + 1} (${level}/${BEAT_LEVEL_MAX})`}
          >
            <span className={trackClassNames.join(' ')}>
              <span
                className={fillClassNames.join(' ')}
                data-testid="beat-bar"
                data-level={level}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
