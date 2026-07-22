import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BEAT_LEVEL_MAX,
  BEAT_LEVEL_MIN,
  defaultBeatLevels,
  nextBeatLevel,
  toggleMuteLevel,
} from '../audio/beatLevels';
import { MetronomeEngine } from '../audio/engine';
import type { SoundId } from '../audio/sounds';
import type { SubdivisionCount } from '../audio/subdivision';
import { clampBpm } from '../audio/timing';
import { clampVolume } from '../audio/volume';
import { loadMetronomeSettings, saveMetronomeSettings } from '../storage/metronomeSettings';
import type { TimeSignature } from '../types';

export interface MetronomeState {
  bpm: number;
  timeSignature: TimeSignature;
  isPlaying: boolean;
  /** Zero-indexed current beat, or null while stopped. */
  currentBeat: number | null;
  /** Zero-indexed current subdivision tick within the current beat, or null while stopped. */
  currentSubTick: number | null;
  /** Master volume, 0-100. */
  volume: number;
  /** Per-beat volume levels (1-5, level 1 is muted), one entry per beat. */
  beatLevels: number[];
  /** Whether accented beats get pitch/visual emphasis. */
  accentEnabled: boolean;
  /** Which preset click timbre is active. */
  sound: SoundId;
  /** How many equal clicks each beat is split into (1 = no subdivision). */
  subdivision: SubdivisionCount;
  setBpm: (bpm: number) => void;
  setTimeSignature: (timeSignature: TimeSignature) => void;
  setVolume: (volume: number) => void;
  /** Advance the given beat to its next volume level (wraps 5 → 1). */
  cycleBeatLevel: (beat: number) => void;
  /** Toggle the given beat between muted and its last audible level. */
  toggleBeatMute: (beat: number) => void;
  setAccentEnabled: (enabled: boolean) => void;
  setSound: (soundId: SoundId) => void;
  setSubdivision: (count: SubdivisionCount) => void;
  toggle: () => Promise<void>;
}

/** Bridges React state and the audio engine. The engine is created on first start. */
export function useMetronome(): MetronomeState {
  const [initialSettings] = useState(() => loadMetronomeSettings());
  const [bpm, setBpmState] = useState(initialSettings.bpm);
  const [timeSignature, setTimeSignatureState] = useState<TimeSignature>(
    initialSettings.timeSignature,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState<number | null>(null);
  const [currentSubTick, setCurrentSubTick] = useState<number | null>(null);
  const [volume, setVolumeState] = useState(initialSettings.volume);
  const [beatLevels, setBeatLevels] = useState<number[]>(initialSettings.beatLevels);
  const [accentEnabled, setAccentEnabledState] = useState(initialSettings.accentEnabled);
  const [sound, setSoundState] = useState<SoundId>(initialSettings.sound);
  const [subdivision, setSubdivisionState] = useState<SubdivisionCount>(
    initialSettings.subdivision,
  );
  // Remembers each beat's last audible level, so the mute button can restore it.
  const lastAudibleLevelsRef = useRef<number[]>(
    initialSettings.beatLevels.map((level) => (level === BEAT_LEVEL_MIN ? BEAT_LEVEL_MAX : level)),
  );
  const engineRef = useRef<MetronomeEngine | null>(null);

  // Keep the engine in sync with the levels regardless of where they changed.
  useEffect(() => {
    engineRef.current?.setBeatLevels(beatLevels);
  }, [beatLevels]);

  // Persist settings so they survive a reload.
  useEffect(() => {
    saveMetronomeSettings({
      bpm,
      timeSignature,
      volume,
      beatLevels,
      accentEnabled,
      sound,
      subdivision,
    });
  }, [bpm, timeSignature, volume, beatLevels, accentEnabled, sound, subdivision]);

  const getEngine = useCallback(() => {
    engineRef.current ??= new MetronomeEngine((beat) => {
      setCurrentBeat(beat);
      setCurrentSubTick(0);
    }, setCurrentSubTick);
    return engineRef.current;
  }, []);

  const toggle = useCallback(async () => {
    if (isPlaying) {
      getEngine().stop();
      setIsPlaying(false);
      setCurrentBeat(null);
      setCurrentSubTick(null);
      return;
    }
    const engine = getEngine();
    engine.setTimeSignature(timeSignature);
    engine.setVolume(volume);
    engine.setBeatLevels(beatLevels);
    engine.setAccentEnabled(accentEnabled);
    engine.setSound(sound);
    engine.setSubdivision(subdivision);
    await engine.start(bpm);
    setIsPlaying(true);
  }, [
    isPlaying,
    bpm,
    timeSignature,
    volume,
    beatLevels,
    accentEnabled,
    sound,
    subdivision,
    getEngine,
  ]);

  const setBpm = useCallback((value: number) => {
    const next = clampBpm(value);
    setBpmState(next);
    engineRef.current?.setBpm(next);
  }, []);

  const setTimeSignature = useCallback((next: TimeSignature) => {
    setTimeSignatureState(next);
    // A new meter has a different number of beats; start over at full volume.
    const fresh = defaultBeatLevels(next.beats);
    setBeatLevels(fresh);
    lastAudibleLevelsRef.current = [...fresh];
    engineRef.current?.setTimeSignature(next);
  }, []);

  const cycleBeatLevel = useCallback((beat: number) => {
    setBeatLevels((prev) => {
      const next = nextBeatLevel(prev[beat]);
      if (next !== BEAT_LEVEL_MIN) {
        lastAudibleLevelsRef.current[beat] = next;
      }
      return prev.map((level, index) => (index === beat ? next : level));
    });
  }, []);

  const toggleBeatMute = useCallback((beat: number) => {
    setBeatLevels((prev) => {
      const current = prev[beat];
      if (current !== BEAT_LEVEL_MIN) {
        lastAudibleLevelsRef.current[beat] = current;
      }
      const next = toggleMuteLevel(current, lastAudibleLevelsRef.current[beat] ?? BEAT_LEVEL_MAX);
      return prev.map((level, index) => (index === beat ? next : level));
    });
  }, []);

  const setVolume = useCallback((value: number) => {
    const next = clampVolume(value);
    setVolumeState(next);
    engineRef.current?.setVolume(next);
  }, []);

  const setAccentEnabled = useCallback((enabled: boolean) => {
    setAccentEnabledState(enabled);
    engineRef.current?.setAccentEnabled(enabled);
  }, []);

  const setSound = useCallback((soundId: SoundId) => {
    setSoundState(soundId);
    engineRef.current?.setSound(soundId);
  }, []);

  const setSubdivision = useCallback((count: SubdivisionCount) => {
    setSubdivisionState(count);
    engineRef.current?.setSubdivision(count);
  }, []);

  // Release audio resources when the component unmounts.
  useEffect(() => {
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  return {
    bpm,
    timeSignature,
    isPlaying,
    currentBeat,
    currentSubTick,
    volume,
    beatLevels,
    accentEnabled,
    sound,
    subdivision,
    setBpm,
    setTimeSignature,
    setVolume,
    cycleBeatLevel,
    toggleBeatMute,
    setAccentEnabled,
    setSound,
    setSubdivision,
    toggle,
  };
}
