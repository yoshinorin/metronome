import { useCallback, useEffect, useRef, useState } from 'react';
import { defaultBeatLevels, nextBeatLevel } from '../audio/beatLevels';
import { MetronomeEngine } from '../audio/engine';
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
  /** Master volume, 0-100. */
  volume: number;
  /** Per-beat volume levels (1-5, level 1 is muted), one entry per beat. */
  beatLevels: number[];
  setBpm: (bpm: number) => void;
  setTimeSignature: (timeSignature: TimeSignature) => void;
  setVolume: (volume: number) => void;
  /** Advance the given beat to its next volume level (wraps 5 → 1). */
  cycleBeatLevel: (beat: number) => void;
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
  const [volume, setVolumeState] = useState(initialSettings.volume);
  const [beatLevels, setBeatLevels] = useState<number[]>(initialSettings.beatLevels);
  const engineRef = useRef<MetronomeEngine | null>(null);

  // Keep the engine in sync with the levels regardless of where they changed.
  useEffect(() => {
    engineRef.current?.setBeatLevels(beatLevels);
  }, [beatLevels]);

  // Persist settings so they survive a reload.
  useEffect(() => {
    saveMetronomeSettings({ bpm, timeSignature, volume, beatLevels });
  }, [bpm, timeSignature, volume, beatLevels]);

  const getEngine = useCallback(() => {
    engineRef.current ??= new MetronomeEngine(setCurrentBeat);
    return engineRef.current;
  }, []);

  const toggle = useCallback(async () => {
    if (isPlaying) {
      getEngine().stop();
      setIsPlaying(false);
      setCurrentBeat(null);
      return;
    }
    const engine = getEngine();
    engine.setTimeSignature(timeSignature);
    engine.setVolume(volume);
    engine.setBeatLevels(beatLevels);
    await engine.start(bpm);
    setIsPlaying(true);
  }, [isPlaying, bpm, timeSignature, volume, beatLevels, getEngine]);

  const setBpm = useCallback((value: number) => {
    const next = clampBpm(value);
    setBpmState(next);
    engineRef.current?.setBpm(next);
  }, []);

  const setTimeSignature = useCallback((next: TimeSignature) => {
    setTimeSignatureState(next);
    // A new meter has a different number of beats; start over at full volume.
    setBeatLevels(defaultBeatLevels(next.beats));
    engineRef.current?.setTimeSignature(next);
  }, []);

  const cycleBeatLevel = useCallback((beat: number) => {
    setBeatLevels((prev) =>
      prev.map((level, index) => (index === beat ? nextBeatLevel(level) : level)),
    );
  }, []);

  const setVolume = useCallback((value: number) => {
    const next = clampVolume(value);
    setVolumeState(next);
    engineRef.current?.setVolume(next);
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
    volume,
    beatLevels,
    setBpm,
    setTimeSignature,
    setVolume,
    cycleBeatLevel,
    toggle,
  };
}
