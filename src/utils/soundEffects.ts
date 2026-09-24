// Pure Web Audio SFX Engine for Stark Mark LXXXV HUD

let audioCtx: AudioContext | null = null;
let ambientHumOsc: OscillatorNode | null = null;
let ambientHumGain: GainNode | null = null;
let isHumming = false;

export function getAudioContext(): AudioContext | null {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Stark HUD Hologram Dual-Tone Startup Chime
export function playStartupChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  const gain2 = ctx.createGain();

  osc1.type = 'sine';
  osc2.type = 'triangle';

  osc1.frequency.setValueAtTime(587.33, now);
  osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12);

  osc2.frequency.setValueAtTime(880, now);
  osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.22);

  gain1.gain.setValueAtTime(0.001, now);
  gain1.gain.linearRampToValueAtTime(0.2, now + 0.03);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

  gain2.gain.setValueAtTime(0.001, now + 0.08);
  gain2.gain.linearRampToValueAtTime(0.25, now + 0.14);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);

  osc1.start(now);
  osc1.stop(now + 0.5);
  osc2.start(now + 0.08);
  osc2.stop(now + 0.65);
}

// Tactical affirmative sci-fi beep / click
export function playTacticalBeep(freq = 740, type: OscillatorType = 'sine', duration = 0.09) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + duration * 0.7);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

// Toggle Ambient Arc Reactor Low-frequency Sci-Fi Hum
export function toggleAmbientHum(): boolean {
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (!isHumming) {
    ambientHumOsc = ctx.createOscillator();
    ambientHumGain = ctx.createGain();

    ambientHumOsc.type = 'sawtooth';
    ambientHumOsc.frequency.setValueAtTime(68, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, ctx.currentTime);

    ambientHumGain.gain.setValueAtTime(0.001, ctx.currentTime);
    ambientHumGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.2);

    ambientHumOsc.connect(filter);
    filter.connect(ambientHumGain);
    ambientHumGain.connect(ctx.destination);

    ambientHumOsc.start();
    isHumming = true;
    playTacticalBeep(600, 'sine', 0.12);
    return true;
  } else {
    if (ambientHumGain) {
      ambientHumGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      setTimeout(() => {
        if (ambientHumOsc) {
          try {
            ambientHumOsc.stop();
            ambientHumOsc.disconnect();
          } catch {}
          ambientHumOsc = null;
        }
      }, 450);
    }
    isHumming = false;
    playTacticalBeep(320, 'sine', 0.12);
    return false;
  }
}
