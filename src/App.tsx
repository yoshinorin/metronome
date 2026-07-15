import styles from './App.module.css';
import { BeatIndicator } from './components/BeatIndicator';
import { LanguageSwitch } from './components/LanguageSwitch';
import { TempoControl } from './components/TempoControl';
import { TimeSignatureSelect } from './components/TimeSignature';
import { TransportButton } from './components/TransportButton';
import { VolumeControl } from './components/VolumeControl';
import { useMetronome } from './hooks/useMetronome';
import { useTranslation } from './i18n';

export default function App() {
  const { t } = useTranslation();
  const {
    bpm,
    timeSignature,
    isPlaying,
    currentBeat,
    volume,
    setBpm,
    setTimeSignature,
    setVolume,
    toggle,
  } = useMetronome();

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t.appTitle}</h1>
        <LanguageSwitch />
      </header>
      <BeatIndicator timeSignature={timeSignature} currentBeat={currentBeat} />
      <TempoControl bpm={bpm} onChange={setBpm} />
      <TimeSignatureSelect value={timeSignature} onChange={setTimeSignature} />
      <VolumeControl volume={volume} onChange={setVolume} />
      <TransportButton isPlaying={isPlaying} onToggle={toggle} />
    </main>
  );
}
