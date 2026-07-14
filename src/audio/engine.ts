import * as Tone from 'tone';
import { TIME_SIGNATURES, type TimeSignature } from '../types';
import { ACCENT_FREQUENCY, CLICK_DURATION, CLICK_FREQUENCY, createClickSynth } from './sounds';
import { beatSubdivision, isAccentedBeat } from './timing';

/** Called on every beat, on the UI thread, with the zero-indexed beat number. */
export type BeatCallback = (beat: number) => void;

/**
 * Thin wrapper around the Tone.js Transport.
 *
 * Clicks are scheduled with the `time` argument supplied by the Transport so
 * playback stays accurate regardless of UI load. UI updates go through Tone's
 * Draw scheduler, which fires as close as possible to the audible click.
 */
export class MetronomeEngine {
  private synth: Tone.Synth | null = null;
  private eventId: number | null = null;
  private beat = 0;
  private timeSignature: TimeSignature = TIME_SIGNATURES[2];
  private readonly onBeat: BeatCallback;

  constructor(onBeat: BeatCallback) {
    this.onBeat = onBeat;
  }

  /** Start playback. Must be called from a user gesture (browser autoplay policy). */
  async start(bpm: number): Promise<void> {
    await Tone.start();
    this.synth ??= createClickSynth();
    const transport = Tone.getTransport();
    transport.bpm.value = bpm;
    this.scheduleClicks();
    transport.start();
  }

  stop(): void {
    Tone.getTransport().stop();
    this.clearSchedule();
  }

  setBpm(bpm: number): void {
    Tone.getTransport().bpm.value = bpm;
  }

  /** Change the time signature. While playing, the measure restarts on beat one. */
  setTimeSignature(timeSignature: TimeSignature): void {
    this.timeSignature = timeSignature;
    if (this.eventId !== null) {
      this.clearSchedule();
      this.scheduleClicks();
    }
  }

  dispose(): void {
    this.stop();
    this.synth?.dispose();
    this.synth = null;
  }

  private scheduleClicks(): void {
    this.beat = 0;
    const transport = Tone.getTransport();
    this.eventId = transport.scheduleRepeat((time) => {
      const beat = this.beat;
      const frequency = isAccentedBeat(beat, this.timeSignature)
        ? ACCENT_FREQUENCY
        : CLICK_FREQUENCY;
      this.synth?.triggerAttackRelease(frequency, CLICK_DURATION, time);
      Tone.getDraw().schedule(() => this.onBeat(beat), time);
      this.beat = (beat + 1) % this.timeSignature.beats;
    }, beatSubdivision(this.timeSignature));
  }

  private clearSchedule(): void {
    if (this.eventId !== null) {
      Tone.getTransport().clear(this.eventId);
      this.eventId = null;
    }
    // Drop queued draw callbacks so a stale beat is not shown after the schedule changes.
    Tone.getDraw().cancel(0);
    this.beat = 0;
  }
}
