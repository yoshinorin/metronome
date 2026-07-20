import { defaultBeatLevels } from '../audio/beatLevels';
import { clampBpm } from '../audio/timing';
import { clampVolume, VOLUME_DEFAULT } from '../audio/volume';
import { BPM_DEFAULT, TIME_SIGNATURES, type TimeSignature } from '../types';

const STORAGE_KEY = 'metronome:settings';

export interface StoredMetronomeSettings {
  bpm: number;
  timeSignature: TimeSignature;
  volume: number;
  beatLevels: number[];
  accentEnabled: boolean;
}

function isTimeSignature(value: unknown): value is TimeSignature {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as TimeSignature).beats === 'number' &&
    typeof (value as TimeSignature).noteValue === 'number'
  );
}

function defaultSettings(): StoredMetronomeSettings {
  const timeSignature = TIME_SIGNATURES[2];
  return {
    bpm: BPM_DEFAULT,
    timeSignature,
    volume: VOLUME_DEFAULT,
    beatLevels: defaultBeatLevels(timeSignature.beats),
    accentEnabled: true,
  };
}

/**
 * Read persisted settings from localStorage. Falls back to defaults if
 * nothing is stored, storage is unavailable, or the stored data doesn't
 * match the expected shape (e.g. an older schema).
 */
export function loadMetronomeSettings(): StoredMetronomeSettings {
  const fallback = defaultSettings();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    const timeSignature = isTimeSignature(parsed.timeSignature)
      ? parsed.timeSignature
      : fallback.timeSignature;
    const beatLevels =
      Array.isArray(parsed.beatLevels) &&
      parsed.beatLevels.length === timeSignature.beats &&
      parsed.beatLevels.every((level: unknown) => typeof level === 'number')
        ? parsed.beatLevels
        : defaultBeatLevels(timeSignature.beats);
    return {
      bpm: typeof parsed.bpm === 'number' ? clampBpm(parsed.bpm) : fallback.bpm,
      timeSignature,
      volume: typeof parsed.volume === 'number' ? clampVolume(parsed.volume) : fallback.volume,
      beatLevels,
      accentEnabled:
        typeof parsed.accentEnabled === 'boolean' ? parsed.accentEnabled : fallback.accentEnabled,
    };
  } catch {
    return fallback;
  }
}

/** Persist settings to localStorage. Failures (storage disabled, quota exceeded) are ignored. */
export function saveMetronomeSettings(settings: StoredMetronomeSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Persistence is best-effort; the app works fine without it.
  }
}
