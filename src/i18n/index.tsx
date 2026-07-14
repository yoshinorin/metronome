import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';
import { type Dictionary, en } from './en';
import { ja } from './ja';

export type Language = 'en' | 'ja';

const dictionaries: Record<Language, Dictionary> = { en, ja };

/** Pick the initial UI language from a BCP 47 language tag (e.g. `navigator.language`). */
export function detectLanguage(languageTag: string): Language {
  return languageTag.toLowerCase().startsWith('ja') ? 'ja' : 'en';
}

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => detectLanguage(navigator.language));
  const value = useMemo<I18nContextValue>(
    () => ({ language, setLanguage, t: dictionaries[language] }),
    [language],
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
