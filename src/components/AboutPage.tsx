import { useTranslation } from '../i18n';
import styles from './AboutPage.module.css';

interface Props {
  onBack: () => void;
}

/** Explains the app: privacy model, settings storage, and PWA install/update/uninstall. */
export function AboutPage({ onBack }: Props) {
  const { t } = useTranslation();
  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={onBack}>
        ← {t.back}
      </button>

      <section className={styles.section}>
        <h2 className={styles.heading}>{t.aboutSectionApp}</h2>
        <p className={styles.paragraph}>{t.aboutNoDataSent}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>{t.aboutSectionSettings}</h2>
        <p className={styles.paragraph}>{t.aboutLocalStorage}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>{t.aboutSectionInstall}</h2>
        <ul className={styles.list}>
          <li>{t.aboutOffline}</li>
          <li>{t.aboutSafariInstall}</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>{t.aboutSectionUpdate}</h2>
        <p className={styles.paragraph}>{t.aboutUpdateInfo}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>{t.aboutSectionUninstall}</h2>
        <ul className={styles.list}>
          <li>{t.aboutUninstallDesktop}</li>
          <li>{t.aboutUninstallAndroid}</li>
          <li>{t.aboutUninstallIOS}</li>
        </ul>
      </section>
    </div>
  );
}
