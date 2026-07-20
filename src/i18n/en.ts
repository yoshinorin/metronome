/** English dictionary. This file is the source of truth for translation keys. */
export const en = {
  appTitle: 'Metronome',
  start: 'Start',
  stop: 'Stop',
  tempo: 'Tempo',
  bpmUnit: 'BPM',
  timeSignature: 'Time signature',
  volume: 'Volume',
  beatIndicator: 'Beat indicator',
  beat: 'Beat',
  languageSwitch: 'Language',
  about: 'About',
  aboutNoDataSent:
    'This app runs entirely in your browser. It never sends your settings, audio, or usage data to any server.',
  aboutLocalStorage:
    "Your settings (tempo, time signature, volume, per-beat levels, and language) are saved only in your browser's local storage. Clearing your browser data will reset them.",
  back: 'Back',
};

/** Shape shared by every dictionary. */
export type Dictionary = { [K in keyof typeof en]: string };
