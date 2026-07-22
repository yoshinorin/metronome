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
import {
  DEFAULT_SUBDIVISION,
  GHOST_TICK_VELOCITY_RATIO,
  type SubdivisionCount,
} from './subdivision';
import { beatSubdivision, isAccentedBeat } from './timing';
import { volumeToDecibels } from './volume';

/** Called on every beat, on the UI thread, with the zero-indexed beat number. */
export type BeatCallback = (beat: number) => void;

/** Called on every subdivision tick after the downbeat, with its zero-indexed position within the beat. */
export type SubTickCallback = (subTick: number) => void;

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
  private subdivision: SubdivisionCount = DEFAULT_SUBDIVISION;
  private readonly onBeat: BeatCallback;
  private readonly onSubTick: SubTickCallback;

  constructor(onBeat: BeatCallback, onSubTick: SubTickCallback) {
    this.onBeat = onBeat;
    this.onSubTick = onSubTick;
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

  /** Set how many equal clicks each beat is split into (1 = no subdivision). */
  setSubdivision(count: SubdivisionCount): void {
    this.subdivision = count;
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

      const subdivision = this.subdivision;
      const beatDuration = Tone.Time(beatSubdivision(this.timeSignature)).toSeconds();
      const tickInterval = beatDuration / subdivision;

      for (let sub = 0; sub < subdivision; sub++) {
        const tickTime = time + sub * tickInterval;
        // Only the downbeat (sub 0) carries the beat's pitch/accent; later
        // ticks are quieter "ghost" clicks at the plain pitch, silenced
        // along with the rest of the beat when it's muted.
        const tickFrequency = sub === 0 ? frequency : CLICK_FREQUENCY;
        const tickVelocity = sub === 0 ? velocity : velocity * GHOST_TICK_VELOCITY_RATIO;
        if (tickVelocity > 0) {
          this.synth?.triggerAttackRelease(tickFrequency, CLICK_DURATION, tickTime, tickVelocity);
        }
        if (sub === 0) {
          Tone.getDraw().schedule(() => this.onBeat(beat), tickTime);
        } else {
          Tone.getDraw().schedule(() => this.onSubTick(sub), tickTime);
        }
      }

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
