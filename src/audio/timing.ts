// Pure timing helpers, kept free of Tone.js imports so they are unit-testable.

import { BPM_MAX, BPM_MIN, type TimeSignature } from '../types';

/** Clamp a BPM value into the supported range. Non-finite input falls back to the minimum. */
export function clampBpm(value: number): number {
  if (!Number.isFinite(value)) {
    return BPM_MIN;
  }
  return Math.min(BPM_MAX, Math.max(BPM_MIN, Math.round(value)));
}

/**
 * Zero-indexed beats that receive the accent click.
 * Compound meters (e.g. 6/8) are felt in groups of three, so every third beat is accented.
 */
export function accentedBeats(timeSignature: TimeSignature): number[] {
  if (timeSignature.noteValue === 8 && timeSignature.beats % 3 === 0) {
    const accents: number[] = [];
    for (let beat = 0; beat < timeSignature.beats; beat += 3) {
      accents.push(beat);
    }
    return accents;
  }
  return [0];
}

/** Whether the given zero-indexed beat should be accented. */
export function isAccentedBeat(beat: number, timeSignature: TimeSignature): boolean {
  return accentedBeats(timeSignature).includes(beat);
}

/** Tone.js subdivision string for one beat of the given time signature. */
export function beatSubdivision(timeSignature: TimeSignature): '4n' | '8n' {
  return timeSignature.noteValue === 8 ? '8n' : '4n';
}
