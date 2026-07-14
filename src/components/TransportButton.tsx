import { useTranslation } from '../i18n';
import styles from './TransportButton.module.css';

interface Props {
  isPlaying: boolean;
  onToggle: () => void;
}

/** Large start / stop button. */
export function TransportButton({ isPlaying, onToggle }: Props) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      className={isPlaying ? `${styles.button} ${styles.playing}` : styles.button}
      onClick={onToggle}
    >
      {isPlaying ? t.stop : t.start}
    </button>
  );
}
