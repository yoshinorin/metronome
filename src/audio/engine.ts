import * as Tone from 'tone';
import { TIME_SIGNATURES, type TimeSignature } from '../types';
import { BEAT_LEVEL_MAX, beatLevelToVelocity, defaultBeatLevels } from './beatLevels';
import {
  ACCENT_FREQUENCY,
  CLICK_DURATION,
  CLICK_FREQUENCY,
  createClickSynth,
  DEFAULT_SOUND_ID,
  type SoundId,
} from './sounds';
import { beatSubdivision, isAccentedBeat } from './timing';
import { volumeToDecibels } from './volume';

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
  private beatLevels: number[] = defaultBeatLevels(TIME_SIGNATURES[2].beats);
  private accentEnabled = true;
  private soundId: SoundId = DEFAULT_SOUND_ID;
  private readonly onBeat: BeatCallback;

  constructor(onBeat: BeatCallback) {
    this.onBeat = onBeat;
  }

  /** Start playback. Must be called from a user gesture (browser autoplay policy). */
  async start(bpm: number): Promise<void> {
    await Tone.start();
    this.synth ??= createClickSynth(this.soundId);
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

  /** Set the master output volume from a 0-100 percentage. */
  setVolume(percent: number): void {
    Tone.getDestination().volume.value = volumeToDecibels(percent);
  }

  /** Set the per-beat volume levels (1-5, level 1 is muted). */
  setBeatLevels(levels: number[]): void {
    this.beatLevels = levels;
  }

  /** Enable or disable the accent (pitch emphasis on accented beats). */
  setAccentEnabled(enabled: boolean): void {
    this.accentEnabled = enabled;
  }

  /** Switch the click timbre. Rebuilds the synth immediately if one already exists. */
  setSound(soundId: SoundId): void {
    this.soundId = soundId;
    if (this.synth) {
      this.synth.dispose();
      this.synth = createClickSynth(soundId);
    }
  }

  /**
   * Change the time signature. While playing, the transport is restarted so the
   * new measure begins on beat one immediately. Re-scheduling on a running
   * transport would leave a silent gap until the next grid boundary (up to one
   * full beat — many seconds at low BPM), which reads as the metronome stopping.
   */
  setTimeSignature(timeSignature: TimeSignature): void {
    this.timeSignature = timeSignature;
    if (this.eventId !== null) {
      const transport = Tone.getTransport();
      transport.stop();
      this.clearSchedule();
      this.scheduleClicks();
      transport.start();
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
      const frequency =
        this.accentEnabled && isAccentedBeat(beat, this.timeSignature)
          ? ACCENT_FREQUENCY
          : CLICK_FREQUENCY;
      // A muted beat (velocity 0) stays silent but still advances the indicator.
      const velocity = beatLevelToVelocity(this.beatLevels[beat] ?? BEAT_LEVEL_MAX);
      if (velocity > 0) {
        this.synth?.triggerAttackRelease(frequency, CLICK_DURATION, time, velocity);
      }
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
