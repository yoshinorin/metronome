import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Metronome',
        short_name: 'Metronome',
        description: 'A metronome that runs in your browser',
        display: 'standalone',
        background_color: '#14161a',
        theme_color: '#14161a',
        icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
    }),
  ],
  // GitHub Pages serves the app under /<repository-name>/
  base: '/metronome/',
  test: {
    // Expose describe/it/expect globally. Tests cover pure logic only, so the
    // default Node environment is enough (no DOM emulation needed).
    globals: true,
  },
});
