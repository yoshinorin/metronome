import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'metronome:theme';

/**
 * Reads the theme already applied to <html>. A bootstrap script in index.html
 * sets this before first paint (from localStorage or prefers-color-scheme),
 * so React just picks up whatever is there instead of re-detecting it.
 */
function readAppliedTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Persistence is best-effort; the app works fine without it.
  }
}

export interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

/** Tracks the active color theme, persists it, and reflects it via `data-theme` on <html>. */
export function useTheme(): ThemeState {
  const [theme, setTheme] = useState<Theme>(() => readAppliedTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
