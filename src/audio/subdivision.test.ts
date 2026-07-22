import { isSubdivisionCount, subdivisionLabelKey } from './subdivision';

describe('isSubdivisionCount', () => {
  it('accepts 1 through 4', () => {
    expect(isSubdivisionCount(1)).toBe(true);
    expect(isSubdivisionCount(4)).toBe(true);
  });

  it('rejects everything else', () => {
    expect(isSubdivisionCount(0)).toBe(false);
    expect(isSubdivisionCount(5)).toBe(false);
    expect(isSubdivisionCount('2')).toBe(false);
    expect(isSubdivisionCount(null)).toBe(false);
  });
});

describe('subdivisionLabelKey', () => {
  it('labels a quarter-note beat (x/4 meters) from quarter to sixteenth', () => {
    expect(subdivisionLabelKey(1, 4)).toBe('subdivQuarter');
    expect(subdivisionLabelKey(2, 4)).toBe('subdivEighth');
    expect(subdivisionLabelKey(4, 4)).toBe('subdivSixteenth');
  });

  it('labels an eighth-note beat (x/8 meters) from eighth to thirty-second', () => {
    expect(subdivisionLabelKey(1, 8)).toBe('subdivEighth');
    expect(subdivisionLabelKey(2, 8)).toBe('subdivSixteenth');
    expect(subdivisionLabelKey(4, 8)).toBe('subdivThirtySecond');
  });

  it('always labels a count of 3 as a triplet, regardless of beat unit', () => {
    expect(subdivisionLabelKey(3, 4)).toBe('subdivTriplet');
    expect(subdivisionLabelKey(3, 8)).toBe('subdivTriplet');
  });
});
