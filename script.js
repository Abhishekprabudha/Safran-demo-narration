const video = document.getElementById('demoVideo');
const narrationAudio = document.getElementById('narrationAudio');
const startOverlay = document.getElementById('startOverlay');
const startButton = document.getElementById('startButton');
const replayButton = document.getElementById('replayButton');
const toggleNarrationButton = document.getElementById('toggleNarrationButton');
const toggleVideoMuteButton = document.getElementById('toggleVideoMuteButton');
const captionText = document.getElementById('captionText');
const voiceStatus = document.getElementById('voiceStatus');
const pulseDot = document.getElementById('pulseDot');

const narrationCues = [
  {
    start: 0,
    end: 8,
    caption: 'AIonOS opens with a live test-cell view of the LEAP-family engine and aligns that footage with the operating dashboard.',
  },
  {
    start: 8,
    end: 18,
    caption: 'The acoustic agent converts raw sound signatures into telemetry: RPM, exhaust gas temperature, oil temperature, resonance peaks, and quality score.',
  },
  {
    start: 18,
    end: 31,
    caption: 'A single executive snapshot then compresses the picture into diagnostic state, quality state, operations state, inspection pass rate, and remaining useful life.',
  },
  {
    start: 31,
    end: 43,
    caption: 'Risk is translated into action. The system estimates the next intervention window, surfaces confidence, and shows the most likely issue before a failure event occurs.',
  },
  {
    start: 43,
    end: 54,
    caption: 'The agent layer supports operational reasoning by exposing trends, root-cause prompts, and quick analytical queries for engineering and shop-floor teams.',
  },
  {
    start: 54,
    end: 62,
    caption: 'Taken together, the demo shows how Safran could combine acoustic diagnostics, operations control, and quality checks inside one AI-assisted decision flow.',
  },
];

let currentCueIndex = -1;
let narrationEnabled = true;
let userStarted = false;

function updateCue(force = false) {
  const time = narrationAudio.currentTime || video.currentTime;
  const nextIndex = narrationCues.findIndex(cue => time >= cue.start && time < cue.end);

  if (nextIndex === -1) return;
  if (!force && nextIndex === currentCueIndex) return;

  currentCueIndex = nextIndex;
  captionText.textContent = narrationCues[nextIndex].caption;
  pulseDot.style.background = narrationEnabled ? 'var(--accent-3)' : '#8796ac';
}

function syncVideoToNarration() {
  if (!narrationEnabled) return;

  const drift = Math.abs(video.currentTime - narrationAudio.currentTime);
  if (drift > 0.35) {
    video.currentTime = narrationAudio.currentTime;
  }
}

async function startExperience() {
  userStarted = true;
  startOverlay.classList.add('hidden');

  narrationAudio.currentTime = 0;
  video.currentTime = 0;

  try {
    await Promise.all([video.play(), narrationAudio.play()]);
    voiceStatus.textContent = 'Narration status: MP3 playback active';
  } catch {
    voiceStatus.textContent = 'Narration status: click replay if playback was blocked';
  }

  updateCue(true);
}

async function replayNarration() {
  currentCueIndex = -1;
  narrationAudio.currentTime = 0;
  video.currentTime = 0;

  try {
    await Promise.all([video.play(), narrationAudio.play()]);
  } catch {
    // controls remain visible for manual retry
  }

  updateCue(true);
}

function toggleNarration() {
  narrationEnabled = !narrationEnabled;

  if (!narrationEnabled) {
    narrationAudio.pause();
    toggleNarrationButton.textContent = 'Resume narration';
    voiceStatus.textContent = 'Narration status: paused';
    captionText.textContent = 'Narration paused. Video continues inline.';
    pulseDot.style.background = '#8796ac';
    return;
  }

  toggleNarrationButton.textContent = 'Pause narration';
  voiceStatus.textContent = 'Narration status: MP3 playback active';
  narrationAudio.currentTime = video.currentTime;
  narrationAudio.play().catch(() => {});
  updateCue(true);
}

function toggleVideoMute() {
  video.muted = !video.muted;
  toggleVideoMuteButton.textContent = video.muted ? 'Keep video muted' : 'Mute video audio';
}

startButton.addEventListener('click', startExperience);
replayButton.addEventListener('click', replayNarration);
toggleNarrationButton.addEventListener('click', toggleNarration);
toggleVideoMuteButton.addEventListener('click', toggleVideoMute);

narrationAudio.addEventListener('timeupdate', () => {
  if (!userStarted || !narrationEnabled) return;
  syncVideoToNarration();
  updateCue(false);
});

narrationAudio.addEventListener('ended', () => {
  if (!userStarted || !narrationEnabled) return;
  narrationAudio.currentTime = 0;
  narrationAudio.play().catch(() => {});
});

video.addEventListener('timeupdate', () => {
  if (!userStarted || narrationEnabled) return;
  updateCue(false);
});

narrationAudio.addEventListener('loadedmetadata', () => {
  captionText.textContent = `Ready to begin the ${Math.round(narrationAudio.duration)}-second narrated walkthrough.`;
  voiceStatus.textContent = 'Narration status: ready (repo MP3)';
});
