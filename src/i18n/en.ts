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
  mute: 'Mute',
  unmute: 'Unmute',
  accent: 'Accent',
  sound: 'Sound',
  soundClick: 'Click',
  soundBeep: 'Beep',
  soundWood: 'Wood',
  soundBell: 'Bell',
  languageSwitch: 'Language',
  about: 'About',
  sourceCode: 'Source code',
  switchToLightMode: 'Switch to light mode',
  switchToDarkMode: 'Switch to dark mode',
  installApp: 'Install app',
  aboutSectionApp: 'About this app',
  aboutSectionSettings: 'Settings',
  aboutSectionInstall: 'Install',
  aboutSectionUpdate: 'Updates',
  aboutSectionUninstall: 'Uninstall',
  aboutNoDataSent:
    'This app runs entirely in your browser. It never sends your settings, audio, or usage data to any server.',
  aboutLocalStorage:
    "Your settings (tempo, time signature, volume, per-beat levels, and language) are saved only in your browser's local storage. Clearing your browser data will reset them.",
  aboutOffline:
    'This app is a PWA (Progressive Web App): once installed, it keeps working offline, since everything it needs is cached on your device.',
  aboutSafariInstall:
    'On Safari (iOS/iPadOS), there is no install button here — the browser doesn\'t support it. Use the Share button and choose "Add to Home Screen" instead.',
  aboutUpdateInfo:
    "Updates happen automatically: the app checks for a new version each time you open it and applies updates in the background — no action needed. If you don't see recent changes, close and reopen the app (or reload the page).",
  aboutUninstallDesktop:
    'Chrome / Edge (desktop): open chrome://apps (or edge://apps), right-click the app, and choose Uninstall — or right-click its icon in your taskbar/dock.',
  aboutUninstallAndroid:
    'Android: press and hold the app icon on your home screen, then choose Uninstall.',
  aboutUninstallIOS: 'iOS / iPadOS: press and hold the app icon, then choose Remove App.',
  back: 'Back',
};

/** Shape shared by every dictionary. */
export type Dictionary = { [K in keyof typeof en]: string };
