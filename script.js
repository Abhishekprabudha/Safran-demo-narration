const video = document.getElementById('demoVideo');
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
let selectedVoice = null;
let narrationLoopGuard = null;

function getPreferredVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    voiceStatus.textContent = 'Voice status: waiting for browser voices';
    return null;
  }

  const preferredMatchers = [
    v => v.lang && v.lang.toLowerCase().startsWith('en-gb') && /female|susan|serena|libby|hazel|samantha|kate/i.test(v.name),
    v => v.lang && v.lang.toLowerCase().startsWith('en-gb'),
    v => /uk|british|england/i.test(v.name),
    v => v.lang && v.lang.toLowerCase().startsWith('en'),
  ];

  for (const matcher of preferredMatchers) {
    const match = voices.find(matcher);
    if (match) return match;
  }

  return voices[0] || null;
}

function refreshVoice() {
  selectedVoice = getPreferredVoice();
  if (!selectedVoice) return;
  const label = `${selectedVoice.name} (${selectedVoice.lang || 'voice'})`;
  const british = (selectedVoice.lang || '').toLowerCase().startsWith('en-gb') || /uk|british|england/i.test(selectedVoice.name);
  voiceStatus.textContent = british
    ? `Voice status: British voice loaded • ${label}`
    : `Voice status: fallback voice loaded • ${label}`;
}

function speak(text) {
  if (!narrationEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = selectedVoice;
  utterance.lang = selectedVoice?.lang || 'en-GB';
  utterance.rate = 0.96;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

function updateCue(force = false) {
  const time = video.currentTime;
  const nextIndex = narrationCues.findIndex(cue => time >= cue.start && time < cue.end);

  if (nextIndex === -1) return;
  if (!force && nextIndex === currentCueIndex) return;

  currentCueIndex = nextIndex;
  const cue = narrationCues[nextIndex];
  captionText.textContent = cue.caption;
  pulseDot.style.background = narrationEnabled ? 'var(--accent-3)' : '#8796ac';

  if (narrationEnabled) {
    speak(cue.caption);
  }
}

function startExperience() {
  userStarted = true;
  startOverlay.classList.add('hidden');
  video.play().catch(() => {
    // Some browsers still require interaction; controls remain visible.
  });
  updateCue(true);
}

function replayNarration() {
  currentCueIndex = -1;
  video.currentTime = 0;
  video.play().catch(() => {});
  updateCue(true);
}

function toggleNarration() {
  narrationEnabled = !narrationEnabled;
  if (!narrationEnabled) {
    window.speechSynthesis.cancel();
    toggleNarrationButton.textContent = 'Resume narration';
    captionText.textContent = 'Narration paused. Video continues inline.';
    pulseDot.style.background = '#8796ac';
  } else {
    toggleNarrationButton.textContent = 'Pause narration';
    updateCue(true);
  }
}

function toggleVideoMute() {
  video.muted = !video.muted;
  toggleVideoMuteButton.textContent = video.muted ? 'Keep video muted' : 'Mute video audio';
}

startButton.addEventListener('click', startExperience);
replayButton.addEventListener('click', replayNarration);
toggleNarrationButton.addEventListener('click', toggleNarration);
toggleVideoMuteButton.addEventListener('click', toggleVideoMute);

video.addEventListener('timeupdate', () => {
  if (!userStarted) return;
  updateCue(false);
});

video.addEventListener('ended', () => {
  if (!userStarted) return;
  currentCueIndex = -1;
});

video.addEventListener('play', () => {
  if (!userStarted) return;
  if (narrationLoopGuard) clearTimeout(narrationLoopGuard);
});

video.addEventListener('seeked', () => {
  if (!userStarted) return;
  updateCue(true);
});

video.addEventListener('loadedmetadata', () => {
  captionText.textContent = `Ready to begin the ${Math.round(video.duration)}-second narrated walkthrough.`;
});

window.speechSynthesis.onvoiceschanged = refreshVoice;
refreshVoice();

// Some browsers do not reliably fire `ended` on looped videos.
setInterval(() => {
  if (!userStarted) return;
  if (video.currentTime < 0.6 && currentCueIndex > 1) {
    currentCueIndex = -1;
    updateCue(true);
  }
}, 500);
