import {
  BEAT_LEVEL_MAX,
  BEAT_LEVEL_MIN,
  beatLevelToVelocity,
  defaultBeatLevels,
  nextBeatLevel,
} from './beatLevels';

describe('nextBeatLevel', () => {
  it('cycles 1 through 5 and wraps back to 1', () => {
    expect(nextBeatLevel(1)).toBe(2);
    expect(nextBeatLevel(2)).toBe(3);
    expect(nextBeatLevel(3)).toBe(4);
    expect(nextBeatLevel(4)).toBe(5);
    expect(nextBeatLevel(5)).toBe(1);
  });
});

describe('beatLevelToVelocity', () => {
  it('maps the minimum level to silence', () => {
    expect(beatLevelToVelocity(BEAT_LEVEL_MIN)).toBe(0);
  });

  it('maps the maximum level to full velocity', () => {
    expect(beatLevelToVelocity(BEAT_LEVEL_MAX)).toBe(1);
  });

  it('maps intermediate levels linearly', () => {
    expect(beatLevelToVelocity(3)).toBe(0.5);
  });

  it('clamps out-of-range levels', () => {
    expect(beatLevelToVelocity(0)).toBe(0);
    expect(beatLevelToVelocity(99)).toBe(1);
  });
});

describe('defaultBeatLevels', () => {
  it('creates one full-volume level per beat', () => {
    expect(defaultBeatLevels(4)).toEqual([5, 5, 5, 5]);
    expect(defaultBeatLevels(6)).toHaveLength(6);
  });
});
