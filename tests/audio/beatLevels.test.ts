import {
  BEAT_LEVEL_MAX,
  BEAT_LEVEL_MIN,
  beatLevelToVelocity,
  defaultBeatLevels,
  nextBeatLevel,
  toggleMuteLevel,
} from '../../src/audio/beatLevels';

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

describe('toggleMuteLevel', () => {
  it('mutes an audible beat regardless of the remembered level', () => {
    expect(toggleMuteLevel(3, 3)).toBe(BEAT_LEVEL_MIN);
    expect(toggleMuteLevel(BEAT_LEVEL_MAX, 2)).toBe(BEAT_LEVEL_MIN);
  });

  it('restores the remembered level when un-muting', () => {
    expect(toggleMuteLevel(BEAT_LEVEL_MIN, 4)).toBe(4);
  });

  it('falls back to full volume when the remembered level is invalid', () => {
    expect(toggleMuteLevel(BEAT_LEVEL_MIN, 0)).toBe(BEAT_LEVEL_MAX);
    expect(toggleMuteLevel(BEAT_LEVEL_MIN, 99)).toBe(BEAT_LEVEL_MAX);
  });
});
