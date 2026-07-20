import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { type Dictionary, en } from './en';
import { ja } from './ja';

export type Language = 'en' | 'ja';

const dictionaries: Record<Language, Dictionary> = { en, ja };
const LANGUAGE_STORAGE_KEY = 'metronome:language';

/** Pick the initial UI language from a BCP 47 language tag (e.g. `navigator.language`). */
export function detectLanguage(languageTag: string): Language {
  return languageTag.toLowerCase().startsWith('ja') ? 'ja' : 'en';
}

function loadLanguage(): Language | null {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === 'en' || stored === 'ja' ? stored : null;
  } catch {
    return null;
  }
}

function saveLanguage(language: Language): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Persistence is best-effort; the app works fine without it.
  }
}

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(
    () => loadLanguage() ?? detectLanguage(navigator.language),
  );
  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    saveLanguage(next);
  }, []);
  const value = useMemo<I18nContextValue>(
    () => ({ language, setLanguage, t: dictionaries[language] }),
    [language, setLanguage],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
}
