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
- `.github/workflows/render-narrated-mp4.yml` — workflow that muxes the WebM demo video and MP3 narration into `assets/safran-agent-demo-narrated.mp4`

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

## Render an MP4 with synced narration

Trigger the GitHub Actions workflow **Render narrated MP4**. It will:

1. Read `assets/safran-agent-demo.webm` and `assets/demo-narration.mp3`.
2. Loop the video input as needed to match narration timing.
3. Export `assets/safran-agent-demo-narrated.mp4` using H.264 video + AAC audio.
4. Commit the MP4 back to the repository when it changes.

## Hosting options

- GitHub Pages
- Netlify
- Vercel
- Any Apache/Nginx/static file server
