import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the app under /<repository-name>/
  base: '/metronome/',
  test: {
    // Expose describe/it/expect globally. Tests cover pure logic only, so the
    // default Node environment is enough (no DOM emulation needed).
    globals: true,
  },
});
