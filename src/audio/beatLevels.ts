// Per-beat volume levels, kept free of Tone.js imports so they are unit-testable.
// Each beat has a level from 1 to 5. Level 1 is muted; 5 is full volume.
// Clicking a beat cycles 1 → 2 → ... → 5 → 1.

export const BEAT_LEVEL_MIN = 1;
export const BEAT_LEVEL_MAX = 5;

/** The level a beat moves to when clicked. Wraps back to muted after the maximum. */
export function nextBeatLevel(level: number): number {
  return level >= BEAT_LEVEL_MAX ? BEAT_LEVEL_MIN : level + 1;
}

/** Map a level to a synth velocity (0-1). Level 1 maps to 0 (silent). */
export function beatLevelToVelocity(level: number): number {
  const clamped = Math.min(BEAT_LEVEL_MAX, Math.max(BEAT_LEVEL_MIN, Math.round(level)));
  return (clamped - BEAT_LEVEL_MIN) / (BEAT_LEVEL_MAX - BEAT_LEVEL_MIN);
}

/** Initial levels for a measure: every beat at full volume. */
export function defaultBeatLevels(beats: number): number[] {
  return Array.from({ length: beats }, () => BEAT_LEVEL_MAX);
}

/**
 * Level to switch to when a beat's dedicated mute button is pressed.
 * Muting always goes to BEAT_LEVEL_MIN; un-muting restores lastLevel,
 * falling back to full volume if that's not a valid level.
 */
export function toggleMuteLevel(currentLevel: number, lastLevel: number): number {
  if (currentLevel !== BEAT_LEVEL_MIN) {
    return BEAT_LEVEL_MIN;
  }
  return lastLevel >= BEAT_LEVEL_MIN && lastLevel <= BEAT_LEVEL_MAX ? lastLevel : BEAT_LEVEL_MAX;
}
