# FLY MIAMI · EPIC — "Ask Facundo" kiosk

Touchscreen guide for Facundo Yebne's rubber-duck art show at the Kimpton EPIC Hotel, Miami (2026).
Runs full-screen in a browser on the portable TV. No internet, no accounts, no API keys.

## What it does
- Shows all 13 artworks with photo, price, medium and story
- Tap any piece → it speaks/explains it
- Type or 🎤 ask anything about the show (ducks, themes, prices, where to find Facundo)
- Voice read-aloud via the device's built-in speech (toggle in the corner)

## Open it on the TV (fastest)
1. Make sure the repo is on the TV, or use GitHub Pages (below).
2. Open **index.html** in Chrome.
3. Tap the menu → "Add to Home screen" / use fullscreen.
4. Done. Tap an artwork or use the chat.

### GitHub Pages option (gives a URL you can open on any device + use for NFC)
- In the repo settings → Pages → deploy from this branch → root.
- Open the published URL on the TV.
- NFC tags can later point at `…/#<artwork-slug>` per piece.

## Photos
`images/<slug>.jpg` — 10 of 13 in place. Missing show a colored emoji card:
- `peace-pride` (PNG wouldn't download — drop `images/peace-pride.png` or `.jpg`)
- `polaroid` (only a .heic exists — export a .jpg as `images/polaroid.jpg`)
- `unitybeak-love` (no photo yet — add `images/unitybeak-love.jpg`)

Drop a correctly-named file in `images/` and it appears automatically.

## Editing the show text
All artwork data and the answers live in **show.js** (the `ART` array + `answer()`). Plain, easy to edit.
