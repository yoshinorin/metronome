import * as Tone from 'tone';

/** Click frequency in Hz. The accented beat is one octave higher. */
export const CLICK_FREQUENCY = 880;
export const ACCENT_FREQUENCY = 1760;

/** Duration of a single click. */
export const CLICK_DURATION = '32n';

export type SoundId = 'click' | 'beep' | 'wood' | 'bell';

type BasicOscillatorType = 'sine' | 'square' | 'triangle' | 'sawtooth';

interface SoundPreset {
  id: SoundId;
  oscillatorType: BasicOscillatorType;
  envelope: { attack: number; decay: number; sustain: number; release: number };
}

/**
 * Preset click timbres. Only the oscillator waveform and envelope differ, so
 * every preset stays a plain Tone.Synth and the engine's trigger call never
 * needs to branch on which sound is selected.
 */
export const SOUND_PRESETS: readonly SoundPreset[] = [
  {
    id: 'click',
    oscillatorType: 'sine',
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 },
  },
  {
    id: 'beep',
    oscillatorType: 'square',
    envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
  },
  {
    id: 'wood',
    oscillatorType: 'triangle',
    envelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.02 },
  },
  {
    id: 'bell',
    oscillatorType: 'sine',
    envelope: { attack: 0.001, decay: 0.15, sustain: 0.1, release: 0.3 },
  },
];

export const DEFAULT_SOUND_ID: SoundId = 'click';

export function isSoundId(value: unknown): value is SoundId {
  return typeof value === 'string' && SOUND_PRESETS.some((preset) => preset.id === value);
}

function findSoundPreset(id: SoundId): SoundPreset {
  return SOUND_PRESETS.find((preset) => preset.id === id) ?? SOUND_PRESETS[0];
}

/** Create the short percussive synth used for the metronome click. */
export function createClickSynth(soundId: SoundId): Tone.Synth {
  const preset = findSoundPreset(soundId);
  return new Tone.Synth({
    oscillator: { type: preset.oscillatorType },
    envelope: preset.envelope,
  }).toDestination();
}
