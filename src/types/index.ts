/** A musical time signature, e.g. 4/4 or 6/8. */
export interface TimeSignature {
  /** Number of beats per measure (numerator). */
  beats: number;
  /** Note value that represents one beat (denominator). */
  noteValue: 4 | 8;
}

/** Time signatures selectable in the UI. */
export const TIME_SIGNATURES: readonly TimeSignature[] = [
  { beats: 2, noteValue: 4 },
  { beats: 3, noteValue: 4 },
  { beats: 4, noteValue: 4 },
  { beats: 6, noteValue: 8 },
];

export const BPM_MIN = 1;
export const BPM_MAX = 999;
export const BPM_DEFAULT = 100;
