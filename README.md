# Safran × AIonOS Engine AI Agent Demo

A static HTML demo that plays the supplied Safran engine AI-agent video inline, loops it, and adds browser-based narration in a British accent where available.

## Files

- `index.html` — main demo page
- `styles.css` — visual styling
- `script.js` — inline playback logic, narration cues, voice selection, loop sync
- `assets/safran-agent-demo.webm` — demo video

## How to use

1. Upload the full folder to any static host.
2. Open `index.html` through the hosted URL.
3. Click **Play demo with narration** once.
4. The video will play inline and loop. Narration will restart with each loop.

## Important browser note

Modern browsers usually block autoplay with audible narration until the viewer interacts once. That is why this demo begins with a clear start button.

## British voice behaviour

The page tries to use an `en-GB` voice from the browser's Speech Synthesis voices.
- If an `en-GB` voice is present, it will be used.
- If not, the page falls back to the nearest English voice available on the device/browser.

## Hosting options

- GitHub Pages
- Netlify
- Vercel
- Any Apache/Nginx/static file server
