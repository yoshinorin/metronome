import { useCallback, useEffect, useRef, useState } from 'react';
import { MetronomeEngine } from '../audio/engine';
import { clampBpm } from '../audio/timing';
import { clampVolume, VOLUME_DEFAULT } from '../audio/volume';
import { BPM_DEFAULT, TIME_SIGNATURES, type TimeSignature } from '../types';

export interface MetronomeState {
  bpm: number;
  timeSignature: TimeSignature;
  isPlaying: boolean;
  /** Zero-indexed current beat, or null while stopped. */
  currentBeat: number | null;
  /** Master volume, 0-100. */
  volume: number;
  setBpm: (bpm: number) => void;
  setTimeSignature: (timeSignature: TimeSignature) => void;
  setVolume: (volume: number) => void;
  toggle: () => Promise<void>;
}

/** Bridges React state and the audio engine. The engine is created on first start. */
export function useMetronome(): MetronomeState {
  const [bpm, setBpmState] = useState(BPM_DEFAULT);
  const [timeSignature, setTimeSignatureState] = useState<TimeSignature>(TIME_SIGNATURES[2]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState<number | null>(null);
  const [volume, setVolumeState] = useState(VOLUME_DEFAULT);
  const engineRef = useRef<MetronomeEngine | null>(null);

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
    await engine.start(bpm);
    setIsPlaying(true);
  }, [isPlaying, bpm, timeSignature, volume, getEngine]);

  const setBpm = useCallback((value: number) => {
    const next = clampBpm(value);
    setBpmState(next);
    engineRef.current?.setBpm(next);
  }, []);

  const setTimeSignature = useCallback((next: TimeSignature) => {
    setTimeSignatureState(next);
    engineRef.current?.setTimeSignature(next);
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
    setBpm,
    setTimeSignature,
    setVolume,
    toggle,
  };
}
