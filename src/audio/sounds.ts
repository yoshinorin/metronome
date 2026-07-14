import * as Tone from 'tone';

/** Click frequency in Hz. The accented beat is one octave higher. */
export const CLICK_FREQUENCY = 880;
export const ACCENT_FREQUENCY = 1760;

/** Duration of a single click. */
export const CLICK_DURATION = '32n';

/** Create the short percussive synth used for the metronome click. */
export function createClickSynth(): Tone.Synth {
  return new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 },
  }).toDestination();
}
