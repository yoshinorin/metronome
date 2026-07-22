import {
  clampVolume,
  VOLUME_DEFAULT,
  VOLUME_MAX,
  VOLUME_MIN,
  volumeToDecibels,
} from '../../src/audio/volume';

describe('clampVolume', () => {
  it('keeps values inside the range unchanged', () => {
    expect(clampVolume(50)).toBe(50);
  });

  it('clamps out-of-range values', () => {
    expect(clampVolume(-10)).toBe(VOLUME_MIN);
    expect(clampVolume(150)).toBe(VOLUME_MAX);
  });

  it('falls back to the default for non-finite input', () => {
    expect(clampVolume(Number.NaN)).toBe(VOLUME_DEFAULT);
  });
});

describe('volumeToDecibels', () => {
  it('maps 100% to unity gain', () => {
    expect(volumeToDecibels(100)).toBe(0);
  });

  it('maps 50% to about -6 dB', () => {
    expect(volumeToDecibels(50)).toBeCloseTo(-6.02, 1);
  });

  it('maps 10% to -20 dB', () => {
    expect(volumeToDecibels(10)).toBeCloseTo(-20, 5);
  });

  it('maps 0% to silence', () => {
    expect(volumeToDecibels(0)).toBe(Number.NEGATIVE_INFINITY);
  });
});
