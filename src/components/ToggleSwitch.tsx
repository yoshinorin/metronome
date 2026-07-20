import styles from './ToggleSwitch.module.css';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id: string;
}

/** iOS-style on/off switch for a single boolean setting. */
export function ToggleSwitch({ checked, onChange, label, id }: Props) {
  return (
    <label className={styles.row} htmlFor={id}>
      <span className={styles.label}>{label}</span>
      <span className={styles.switch}>
        <input
          id={id}
          type="checkbox"
          className={styles.input}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className={styles.track}>
          <span className={styles.thumb} />
        </span>
      </span>
    </label>
  );
}
