import { BEAT_LEVEL_MAX, BEAT_LEVEL_MIN } from '../audio/beatLevels';
import { isAccentedBeat } from '../audio/timing';
import { useTranslation } from '../i18n';
import type { TimeSignature } from '../types';
import styles from './BeatIndicator.module.css';
import { SpeakerIcon } from './icons/SpeakerIcon';

interface Props {
  timeSignature: TimeSignature;
  /** Zero-indexed current beat, or null while stopped. */
  currentBeat: number | null;
  /** Per-beat volume levels (1-5, level 1 is muted). */
  beatLevels: number[];
  /** Whether accented beats get pitch/visual emphasis. */
  accentEnabled: boolean;
  /** Called when a beat is clicked to cycle its volume level. */
  onBeatClick: (beat: number) => void;
  /** Called when a beat's mute button is clicked. */
  onMuteToggle: (beat: number) => void;
}

/**
 * One bar per beat, like a tiny equalizer: a fixed-height track (marked
 * with divider lines at each volume step) holds a fill whose height
 * encodes the level (1-5). Level 1 (muted) renders as zero fill height,
 * leaving the empty track visible. The current beat lights up in accent
 * color; on an accented beat that color is a distinct shade, but every
 * track is the same width — accent is color-only. A dedicated mute
 * button sits below each bar for direct access, independent of cycling
 * through the bar itself.
 */
export function BeatIndicator({
  timeSignature,
  currentBeat,
  beatLevels,
  accentEnabled,
  onBeatClick,
  onMuteToggle,
}: Props) {
  const { t } = useTranslation();
  return (
    <div className={styles.row}>
      {Array.from({ length: timeSignature.beats }, (_, beat) => {
        const level = beatLevels[beat] ?? BEAT_LEVEL_MAX;
        const muted = level === BEAT_LEVEL_MIN;
        const trackClassNames = [styles.track];
        if (accentEnabled && isAccentedBeat(beat, timeSignature)) {
          trackClassNames.push(styles.accent);
        }
        const fillClassNames = [styles.fill, styles[`level${level}`]];
        if (beat === currentBeat) {
          fillClassNames.push(styles.active);
        }
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: a beat's position within the measure is its identity
          <div key={beat} className={styles.column}>
            <button
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
            <button
              type="button"
              className={muted ? `${styles.muteButton} ${styles.muted}` : styles.muteButton}
              onClick={() => onMuteToggle(beat)}
              aria-pressed={muted}
              aria-label={`${t.beat} ${beat + 1}: ${muted ? t.unmute : t.mute}`}
              data-testid="beat-mute"
            >
              <SpeakerIcon muted={muted} className={styles.muteIcon} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
