// Master volume helpers, kept free of Tone.js imports so they are unit-testable.

export const VOLUME_MIN = 0;
export const VOLUME_MAX = 100;
export const VOLUME_DEFAULT = 80;

/** Clamp a volume percentage into 0-100. Non-finite input falls back to the default. */
export function clampVolume(value: number): number {
  if (!Number.isFinite(value)) {
    return VOLUME_DEFAULT;
  }
  return Math.min(VOLUME_MAX, Math.max(VOLUME_MIN, Math.round(value)));
}

/**
 * Map a 0-100 slider value to decibels for Tone's volume params.
 * 100% is unity gain (0 dB); 0% is silence.
 */
export function volumeToDecibels(percent: number): number {
  if (percent <= 0) {
    return Number.NEGATIVE_INFINITY;
  }
  return 20 * Math.log10(percent / 100);
}
