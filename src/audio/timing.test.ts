import { BPM_MAX, BPM_MIN, type TimeSignature } from '../types';
import { accentedBeats, beatSubdivision, clampBpm, isAccentedBeat } from './timing';

const fourFour: TimeSignature = { beats: 4, noteValue: 4 };
const threeFour: TimeSignature = { beats: 3, noteValue: 4 };
const sixEight: TimeSignature = { beats: 6, noteValue: 8 };

describe('clampBpm', () => {
  it('keeps values inside the range unchanged', () => {
    expect(clampBpm(120)).toBe(120);
  });

  it('clamps values below the minimum', () => {
    expect(clampBpm(1)).toBe(BPM_MIN);
  });

  it('clamps values above the maximum', () => {
    expect(clampBpm(999)).toBe(BPM_MAX);
  });

  it('rounds fractional values', () => {
    expect(clampBpm(120.6)).toBe(121);
  });

  it('falls back to the minimum for non-finite input', () => {
    expect(clampBpm(Number.NaN)).toBe(BPM_MIN);
    expect(clampBpm(Number.POSITIVE_INFINITY)).toBe(BPM_MIN);
  });
});

describe('accentedBeats', () => {
  it('accents only the first beat in simple meters', () => {
    expect(accentedBeats(fourFour)).toEqual([0]);
    expect(accentedBeats(threeFour)).toEqual([0]);
  });

  it('accents every third beat in 6/8', () => {
    expect(accentedBeats(sixEight)).toEqual([0, 3]);
  });
});

describe('isAccentedBeat', () => {
  it('matches the accent list', () => {
    expect(isAccentedBeat(0, fourFour)).toBe(true);
    expect(isAccentedBeat(1, fourFour)).toBe(false);
    expect(isAccentedBeat(3, sixEight)).toBe(true);
    expect(isAccentedBeat(4, sixEight)).toBe(false);
  });
});

describe('beatSubdivision', () => {
  it('uses quarter notes for x/4 meters', () => {
    expect(beatSubdivision(fourFour)).toBe('4n');
  });

  it('uses eighth notes for x/8 meters', () => {
    expect(beatSubdivision(sixEight)).toBe('8n');
  });
});
