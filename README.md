# Metronome

A metronome that runs in your browser. Built with React and the Web Audio API (via Tone.js), it will grow into a small drum machine with a step sequencer over time.

## Features

- Accurate audio scheduling via Tone.js Transport (no `setInterval` drift)
- Tempo control from 1 to 999 BPM (slider + numeric input)
- Time signatures: 2/4, 3/4, 4/4, 6/8 (compound-meter accents in 6/8)
- Accented first beat and visual beat indicator
- Per-beat volume: click a beat dot to cycle its level (1-5, level 1 mutes it)
- Master volume control
- UI in English and Japanese (auto-detected, switchable)
- Responsive layout for mobile and desktop
- Settings (tempo, time signature, volume, per-beat levels, language) persist locally across reloads

## Development

Requires Node.js 24 or later.

```sh
npm ci          # install dependencies
npm run dev     # start the dev server
npm test        # run unit tests (Vitest)
npm run lint    # lint & format check (Biome)
npm run build   # type-check and build for production
```

## Deployment

The site is deployed to GitHub Pages by GitHub Actions whenever `main` is pushed.

## Using Stacks

| Area | Choice |
| --- | --- |
| Build | Vite |
| UI | React 19 + TypeScript (strict) |
| Audio | Tone.js |
| Styling | CSS Modules |
| i18n | Hand-rolled, type-safe dictionaries (en / ja) |
| Lint / format | Biome |
| Tests | Vitest |
