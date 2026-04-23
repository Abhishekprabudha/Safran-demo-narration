# Safran × AIonOS Engine AI Agent Demo

A static HTML demo that plays the supplied Safran engine AI-agent video inline, loops it, and plays a pre-generated narration MP3 from the repository.

## Files

- `index.html` — main demo page
- `styles.css` — visual styling
- `script.js` — inline playback logic, narration cues, MP3 sync, loop behaviour
- `assets/safran-agent-demo.webm` — demo video
- `assets/narration.txt` — single source narration script
- `assets/demo-narration.mp3` — generated narration audio used in the demo
- `scripts/generate_narration.py` — MP3 generator script (Edge TTS voice)
- `.github/workflows/generate-narration.yml` — workflow that regenerates and commits the narration MP3

## How to use

1. Upload the full folder to any static host.
2. Open `index.html` through the hosted URL.
3. Click **Play demo with narration** once.
4. The video and MP3 narration will play inline and loop together.

## Regenerate narration MP3

Update `assets/narration.txt`, then either:

- Run locally:

  ```bash
  pip install edge-tts
  python scripts/generate_narration.py
  ```

- Or trigger the GitHub Actions workflow **Generate narration audio**, which regenerates `assets/demo-narration.mp3` and commits it automatically.

## Hosting options

- GitHub Pages
- Netlify
- Vercel
- Any Apache/Nginx/static file server
