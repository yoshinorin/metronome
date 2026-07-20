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
};

/** Shape shared by every dictionary. */
export type Dictionary = { [K in keyof typeof en]: string };
