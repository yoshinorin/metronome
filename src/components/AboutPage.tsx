import { useTranslation } from '../i18n';
import styles from './AboutPage.module.css';

interface Props {
  onBack: () => void;
}

/** Explains the app's privacy model: no network calls, settings kept in localStorage only. */
export function AboutPage({ onBack }: Props) {
  const { t } = useTranslation();
  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={onBack}>
        ← {t.back}
      </button>
      <h2 className={styles.heading}>{t.about}</h2>
      <ul className={styles.list}>
        <li>{t.aboutNoDataSent}</li>
        <li>{t.aboutLocalStorage}</li>
      </ul>
    </div>
  );
}
