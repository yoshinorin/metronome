import { useState } from 'react';
import styles from './App.module.css';
import { AboutPage } from './components/AboutPage';
import { BeatIndicator } from './components/BeatIndicator';
import { HeaderIconButton } from './components/HeaderIconButton';
import { CodeIcon } from './components/icons/CodeIcon';
import { InfoIcon } from './components/icons/InfoIcon';
import { InstallIcon } from './components/icons/InstallIcon';
import { ThemeIcon } from './components/icons/ThemeIcon';
import { LanguageSwitch } from './components/LanguageSwitch';
import { SoundSelect } from './components/SoundSelect';
import { SubdivisionSelect } from './components/SubdivisionSelect';
import { TempoControl } from './components/TempoControl';
import { TimeSignatureSelect } from './components/TimeSignature';
import { ToggleSwitch } from './components/ToggleSwitch';
import { TransportButton } from './components/TransportButton';
import { VolumeControl } from './components/VolumeControl';
import { useInstallPrompt } from './hooks/useInstallPrompt';
import { useMetronome } from './hooks/useMetronome';
import { useTheme } from './hooks/useTheme';
import { useTranslation } from './i18n';

const SOURCE_CODE_URL = 'https://github.com/yoshinorin/metronome';

export default function App() {
  const { t } = useTranslation();
  const [view, setView] = useState<'main' | 'about'>('main');
  const {
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
  } = useMetronome();
  const { theme, toggleTheme } = useTheme();
  const { canInstall, promptInstall } = useInstallPrompt();

  return (
    <main className={styles.app}>
      <div className={styles.headerBlock}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t.appTitle}</h1>
          <div className={styles.headerLinks}>
            <HeaderIconButton
              label={theme === 'dark' ? t.switchToLightMode : t.switchToDarkMode}
              onClick={toggleTheme}
            >
              <ThemeIcon theme={theme} className={styles.icon} />
            </HeaderIconButton>
            <HeaderIconButton label={t.sourceCode} href={SOURCE_CODE_URL}>
              <CodeIcon className={styles.icon} />
            </HeaderIconButton>
            <HeaderIconButton label={t.about} onClick={() => setView('about')}>
              <InfoIcon className={styles.icon} />
            </HeaderIconButton>
            {canInstall && (
              <HeaderIconButton label={t.installApp} onClick={promptInstall}>
                <InstallIcon className={styles.icon} />
              </HeaderIconButton>
            )}
          </div>
        </header>
        <div className={styles.languageRow}>
          <LanguageSwitch />
        </div>
      </div>
      {view === 'about' ? (
        <AboutPage onBack={() => setView('main')} />
      ) : (
        <>
          <BeatIndicator
            timeSignature={timeSignature}
            currentBeat={currentBeat}
            currentSubTick={currentSubTick}
            beatLevels={beatLevels}
            accentEnabled={accentEnabled}
            subdivision={subdivision}
            onBeatClick={cycleBeatLevel}
            onMuteToggle={toggleBeatMute}
          />
          <ToggleSwitch
            id="accent-toggle"
            label={t.accent}
            checked={accentEnabled}
            onChange={setAccentEnabled}
          />
          <TempoControl bpm={bpm} onChange={setBpm} />
          <TimeSignatureSelect value={timeSignature} onChange={setTimeSignature} />
          <SubdivisionSelect
            value={subdivision}
            timeSignature={timeSignature}
            onChange={setSubdivision}
          />
          <SoundSelect value={sound} onChange={setSound} />
          <VolumeControl volume={volume} onChange={setVolume} />
          <TransportButton isPlaying={isPlaying} onToggle={toggle} />
        </>
      )}
    </main>
  );
}
