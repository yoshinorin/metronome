import { type Language, useTranslation } from '../i18n';
import styles from './LanguageSwitch.module.css';

const LANGUAGES: ReadonlyArray<{ value: Language; label: string }> = [
  { value: 'en', label: 'EN' },
  { value: 'ja', label: '日本語' },
];

/** Toggle between the available UI languages. */
export function LanguageSwitch() {
  const { language, setLanguage, t } = useTranslation();
  return (
    <fieldset className={styles.container} aria-label={t.languageSwitch}>
      {LANGUAGES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          aria-pressed={language === value}
          className={language === value ? `${styles.option} ${styles.selected}` : styles.option}
          onClick={() => setLanguage(value)}
        >
          {label}
        </button>
      ))}
    </fieldset>
  );
}
