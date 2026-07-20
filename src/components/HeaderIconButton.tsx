import type { ReactNode } from 'react';
import styles from './HeaderIconButton.module.css';

interface Props {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  /** External link target. When set, renders an <a> instead of a <button>. */
  href?: string;
}

/** Icon-only header control, shared by internal actions (About) and external links (e.g. source code). */
export function HeaderIconButton({ label, children, onClick, href }: Props) {
  if (href) {
    return (
      <a
        className={styles.button}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        title={label}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
