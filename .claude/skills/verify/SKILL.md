---
name: verify
description: Build, launch, and drive the metronome app to verify changes at the browser surface.
---

# Verifying the metronome app

## Build / launch

```sh
npm run dev            # Vite dev server → http://localhost:5173/metronome/  (note the /metronome/ base)
```

Run it in the background; the app is a single static page, no other services needed.

## Drive (headless Chrome + CDP, no extra deps)

Chrome is installed at `/c/Program Files/Google/Chrome/Application/chrome.exe`. Launch with:

```sh
"<chrome>" --headless=new --remote-debugging-port=9222 \
  --user-data-dir=<scratch>/chrome-profile --window-size=480,900 \
  --autoplay-policy=no-user-gesture-required --no-first-run about:blank
```

`--autoplay-policy=no-user-gesture-required` is required or `Tone.start()` never resolves for
synthetic clicks. Then drive via a Node script (global `fetch`/`WebSocket`, no packages):
`GET 127.0.0.1:9222/json/list` → connect to `webSocketDebuggerUrl` → `Page.navigate`,
`Runtime.evaluate`, `Page.captureScreenshot`.

## Flows worth driving

- Start → beat dots advance (`[data-testid="beat-dot"]`, active class); Stop → no active dot.
- Time signature buttons (2/4…6/8) change dot count; switching while playing restarts the measure.
- BPM: slider dispatches `input`; the numeric input `#bpm-input` commits on `focusout`
  (dispatch `FocusEvent('focusout', { bubbles: true })`) and clamps to 30–300.
- Language buttons `EN` / `日本語` swap all labels; initial language follows `navigator.language`.

## Gotchas

- Read DOM **after a ~200ms delay** following synthetic events — React re-renders async; an
  immediate read returns the pre-render value and looks like a bug.
- On this machine `navigator.language` is `ja`, so the app boots in Japanese; button lookups
  must match both label sets.
- Headless has no audible output; sound is inferred from the beat indicator plus the absence of
  console errors. Audible click quality needs a manual listen.
- Remember one probe left BPM at a clamped extreme (e.g. 30) — reset it before timing-sensitive
  sampling, or beat progressions look frozen.
