import { BEAT_LEVEL_MAX, BEAT_LEVEL_MIN } from '../audio/beatLevels';
import type { SubdivisionCount } from '../audio/subdivision';
import { isAccentedBeat } from '../audio/timing';
import { useTranslation } from '../i18n';
import type { TimeSignature } from '../types';
import styles from './BeatIndicator.module.css';
import { SpeakerIcon } from './icons/SpeakerIcon';

// Must match .column / .beat / .track widths and the .columns gap in
// BeatIndicator.module.css. Ticks are placed in the space between one
// beat's bar and the next, not across the raw column width, so they
// never render on top of a bar.
const COLUMN_WIDTH_REM = 2.75;
const TRACK_WIDTH_REM = 1;
const COLUMN_GAP_REM = 0.5;
const STRIDE_REM = COLUMN_WIDTH_REM + COLUMN_GAP_REM;
const GAP_WIDTH_REM = STRIDE_REM - TRACK_WIDTH_REM;

/** Left offset (rem, from the start of the whole row) of the gap after this beat's bar. */
function gapStartRem(beat: number): number {
  return beat * STRIDE_REM + (COLUMN_WIDTH_REM + TRACK_WIDTH_REM) / 2;
}

interface Props {
  timeSignature: TimeSignature;
  /** Zero-indexed current beat, or null while stopped. */
  currentBeat: number | null;
  /** Zero-indexed current subdivision tick within the current beat, or null while stopped. */
  currentSubTick: number | null;
  /** Per-beat volume levels (1-5, level 1 is muted). */
  beatLevels: number[];
  /** Whether accented beats get pitch/visual emphasis. */
  accentEnabled: boolean;
  /** How many equal clicks each beat is split into (1 = no subdivision dots shown). */
  subdivision: SubdivisionCount;
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
 * track is the same width — accent is color-only. A muted beat still
 * blinks on its turn via a glowing track outline, since its fill has no
 * height to light up. When subdivision is active, small dots at bar
 * height mark the finer clicks — skipping the downbeat (already shown by
 * the bar itself) and placed at their true proportional position across
 * the whole measure, so e.g. a triplet's 2nd and 3rd ticks visually sit
 * between this beat's bar and the next one, not tucked underneath. A
 * dedicated mute button sits below each bar for direct access,
 * independent of cycling through the bar itself.
 */
export function BeatIndicator({
  timeSignature,
  currentBeat,
  currentSubTick,
  beatLevels,
  accentEnabled,
  subdivision,
  onBeatClick,
  onMuteToggle,
}: Props) {
  const { t } = useTranslation();
  const totalBeats = timeSignature.beats;
  return (
    <div className={styles.row}>
      <div className={styles.columns}>
        {Array.from({ length: totalBeats }, (_, beat) => {
          const level = beatLevels[beat] ?? BEAT_LEVEL_MAX;
          const muted = level === BEAT_LEVEL_MIN;
          const active = beat === currentBeat;
          const trackClassNames = [styles.track];
          if (accentEnabled && isAccentedBeat(beat, timeSignature)) {
            trackClassNames.push(styles.accent);
          }
          // The fill has zero height when muted, so its own active glow would be
          // invisible; flash the track outline instead so muted beats still blink.
          if (muted && active) {
            trackClassNames.push(styles.mutedActive);
          }
          const fillClassNames = [styles.fill, styles[`level${level}`]];
          if (active) {
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
        {subdivision > 1 && (
          <div className={styles.subTickOverlay} aria-hidden="true">
            {/* Skip sub 0 (the downbeat): the bar already represents it. Later
                ticks are spread across the gap after this beat's own bar and
                before the next one, in time order, so they read as landing
                between the two bars instead of overlapping either of them. */}
            {Array.from({ length: totalBeats }, (_, beat) =>
              Array.from({ length: subdivision - 1 }, (_, i) => {
                const sub = i + 1;
                const positionRem = gapStartRem(beat) + (sub / subdivision) * GAP_WIDTH_REM;
                const totalWidthRem =
                  totalBeats * COLUMN_WIDTH_REM + (totalBeats - 1) * COLUMN_GAP_REM;
                const position = positionRem / totalWidthRem;
                const tickActive = beat === currentBeat && sub === currentSubTick;
                return (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: a tick's (beat, sub) position within the measure is its identity
                    key={`${beat}-${sub}`}
                    className={
                      tickActive ? `${styles.subTick} ${styles.subTickActive}` : styles.subTick
                    }
                    style={{ left: `${position * 100}%` }}
                    data-testid="sub-tick"
                    data-beat={beat}
                    data-sub={sub}
                  />
                );
              }),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
