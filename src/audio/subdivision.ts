// Pure subdivision helpers, kept free of Tone.js imports so they are unit-testable.

/** How many equal clicks a beat is split into. 1 means no subdivision. */
export const SUBDIVISION_COUNTS = [1, 2, 3, 4] as const;
export type SubdivisionCount = (typeof SUBDIVISION_COUNTS)[number];

export const DEFAULT_SUBDIVISION: SubdivisionCount = 1;

export function isSubdivisionCount(value: unknown): value is SubdivisionCount {
  return SUBDIVISION_COUNTS.includes(value as SubdivisionCount);
}

/** A subdivision "tick" past the first (the downbeat) plays at this fraction of the beat's own velocity. */
export const GHOST_TICK_VELOCITY_RATIO = 0.5;

export type SubdivisionLabelKey =
  | 'subdivQuarter'
  | 'subdivEighth'
  | 'subdivTriplet'
  | 'subdivSixteenth'
  | 'subdivThirtySecond';

/**
 * Which note-value label to show for a subdivision count, given the time
 * signature's own beat unit (4 = quarter-note beat, 8 = eighth-note beat, as
 * in 6/8). A count of 3 is always "Triplet" regardless of beat unit, since
 * that's how musicians talk about it. Other counts shift by one note value
 * between simple (x/4) and compound (x/8) meters — e.g. count 2 is "Eighth"
 * in 4/4 but "Sixteenth" in 6/8, because the beat itself is already an
 * eighth note there.
 */
export function subdivisionLabelKey(
  count: SubdivisionCount,
  beatNoteValue: 4 | 8,
): SubdivisionLabelKey {
  if (count === 3) {
    return 'subdivTriplet';
  }
  if (beatNoteValue === 4) {
    if (count === 1) return 'subdivQuarter';
    if (count === 2) return 'subdivEighth';
    return 'subdivSixteenth';
  }
  if (count === 1) return 'subdivEighth';
  if (count === 2) return 'subdivSixteenth';
  return 'subdivThirtySecond';
}
