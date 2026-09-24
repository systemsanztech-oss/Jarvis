import React, { useState, useEffect, useRef } from 'react';
import { ParticleBackground } from './components/ParticleBackground';
import { SuitDiagnostics } from './components/SuitDiagnostics';
import { HelmetHero } from './components/HelmetHero';
import { DefenseRadar } from './components/DefenseRadar';
import {
  playStartupChime,
  playTacticalBeep,
  toggleAmbientHum,
} from './utils/soundEffects';

export const App: React.FC = () => {
  // Real-time Clock UTC
  const [clockUtc, setClockUtc] = useState<string>('00:00:00 UTC');
  // Telemetry
  const [cpuLoad, setCpuLoad] = useState<number>(24.6);
  const [synapseLatency, setSynapseLatency] = useState<number>(0.32);
  // Audio & Voice States
  const [isHumming, setIsHumming] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [spokenQuote, setSpokenQuote] = useState<string>('Awaiting your instruction, Sir.');
  const [statusLabel, setStatusLabel] = useState<string>('DIRECTIVE INTERFACE: READY');
  const [eventLog, setEventLog] = useState<string>('WARP PROTOCOL READY // ALL CELLS 100%');
  const [inputText, setInputText] = useState<string>('');
  // Speech cadence timer
  const speechTimerRef = useRef<any>(null);
  const demoIntervalRef = useRef<any>(null);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);

  // Live UTC Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      setClockUtc(`${hrs}:${mins}:${secs} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch telemetry from server
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/system');
        if (res.ok) {
          const data = await res.json();
          if (typeof data.cpu === 'number') setCpuLoad(data.cpu);
          if (typeof data.networkPingMs === 'number') {
            setSynapseLatency(Math.max(0.15, data.networkPingMs * 0.015));
          }
        }
      } catch {}
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  // Trigger Jarvis HUD & Voice Visual Cadence
  const triggerJarvisVisuals = (text: string, durationMs?: number) => {
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);

    playStartupChime();
    setSpokenQuote(text);
    setStatusLabel('SYNAPSE TRANSMISSION: ACTIVE');
    setEventLog(`DIRECTIVE LOG: "${text.toUpperCase().slice(0, 34)}..."`);
    setIsSpeaking(true);

    const cadenceDuration =
      durationMs || Math.min(Math.max(text.length * 68, 2200), 7000);

    speechTimerRef.current = setTimeout(() => {
      setIsSpeaking(false);
      playTacticalBeep(520, 'sine', 0.1);
      setStatusLabel('DIRECTIVE INTERFACE: READY');
    }, cadenceDuration);
  };

  // Quick Phrase Trigger
  const handleQuickPhrase = (phrase: string) => {
    playTacticalBeep(880, 'sine', 0.08);
    triggerJarvisVisuals(phrase);
  };

  // Radar Ping
  const handleRadarPing = () => {
    playTacticalBeep(880, 'sine', 0.15);
    handleQuickPhrase('Perimeter scan completed. No hostile signatures detected within 50 kilometers.');
  };

  // Submit Directive to Gemini Backend
  const handleTransmitDirective = async () => {
    if (!inputText.trim()) return;
    const query = inputText.trim();
    setInputText('');

    playTacticalBeep(920, 'triangle', 0.12);
    setStatusLabel('TRANSMITTING TO STARK AI CORE...');
    setIsSpeaking(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) throw new Error('Orbital relay failed');
      const data = await res.json();
      const reply = data.reply || 'All Mark LXXXV systems nominal, Sir.';
      triggerJarvisVisuals(reply);
    } catch {
      triggerJarvisVisuals(`Directive received, Sir. Executing local protocols for: "${query}".`);
    }
  };

  // Toggle Live Speech Demo Loop
  const handleToggleDemoLoop = () => {
    if (isDemoRunning) {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
      setIsDemoRunning(false);
      setIsSpeaking(false);
      playTacticalBeep(440, 'sine', 0.1);
    } else {
      setIsDemoRunning(true);
      const demoLines = [
        'Deploying orbital shield barriers. Micro-thrusters active, Sir.',
        'Optical tracking calibrating. Target locks established at 34 degrees north.',
        'Repulsor capacitors at 100 percent. Ready on your command.',
        'Neural interface latency 0.32 milliseconds. Tactical HUD synchronized.',
      ];
      let idx = 0;
      triggerJarvisVisuals(demoLines[idx], 3200);
      idx = (idx + 1) % demoLines.length;

      demoIntervalRef.current = setInterval(() => {
        triggerJarvisVisuals(demoLines[idx], 3200);
        idx = (idx + 1) % demoLines.length;
      }, 4400);
    }
  };

  // Mute / Stop Audio Visuals
  const handleMute = () => {
    playTacticalBeep(260, 'sawtooth', 0.25);
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    setIsDemoRunning(false);
    setIsSpeaking(false);
    setStatusLabel('DIRECTIVE INTERFACE: READY');
  };

  // Toggle Arc Hum
  const handleToggleHum = () => {
    const active = toggleAmbientHum();
    setIsHumming(active);
  };

  return (
    <div className="bg-[#04070c] text-[#ffd152] font-rajdhani min-h-screen relative overflow-x-hidden select-none">
      {/* Dynamic Hologram Background Canvas & Scanline Layer with Stark Crimson/Gold Grid */}
      <div className="fixed inset-0 hologram-grid pointer-events-none z-0" />
      <div className="fixed inset-0 scanlines pointer-events-none z-0" />
      <ParticleBackground />

      <div className="relative z-10 flex flex-col min-h-screen p-3 md:p-5 gap-3.5 justify-between">
        {/* BEGIN: TopHeaderBar */}
        <header className="w-full bg-[rgba(15,8,12,0.78)] backdrop-blur-md border border-[rgba(230,25,55,0.35)] rounded-lg p-2.5 md:px-5 md:py-3.5 hud-glow hud-corner-bracket">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Brand & Version Telemetry */}
            <div className="flex items-center space-x-3.5">
              <button
                type="button"
                className="relative flex items-center justify-center w-11 h-11 rounded-full border border-[#e61937] bg-[#e61937]/10 hud-glow cursor-pointer hover:border-[#ffd152] transition-colors"
                onClick={() => triggerJarvisVisuals('Initializing Mark 85 OS core telemetry. J.A.R.V.I.S. online.')}
                title="Initialize Stark Tactical Transmission"
              >
                <svg className="w-6 h-6 text-[#ffd152] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                </svg>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#e61937] rounded-full animate-ping" />
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-orbitron font-extrabold text-base md:text-lg tracking-widest text-glow text-white">
                    J.A.R.V.I.S.
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#e61937]/20 border border-[#e61937]/60 text-[#ffd152] font-mono shadow-[0_0_8px_rgba(230,25,55,0.4)]">
                    v9.4.2 PRO
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border border-[#ffd152]/60 bg-[#ffd152]/10 text-[#ffd152] font-mono" id="audio-engine-badge">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffd152] animate-pulse" />
                    EXTERNAL VOICE LINK READY
                  </span>
                </div>
                <div className="text-[11px] font-mono tracking-wider text-[#e61937]">
                  STARK INDUSTRIES // MARK LXXXV TACTICAL OS
                </div>
              </div>
            </div>

            {/* Voice / Audio Frequency Telemetry Waveform */}
            <div className="hidden lg:flex flex-col items-center justify-center px-4 py-1.5 rounded border border-[rgba(230,25,55,0.35)]/60 bg-black/60 shadow-[0_0_12px_rgba(230,25,55,0.15)]" data-purpose="audio-waveform-monitor">
              <div className="text-[10px] font-mono tracking-wider text-[#ffd152]/80 flex justify-between w-full mb-1">
                <span id="speech-waveform-label">SYNAPSE AUDIO FREQ</span>
                <span className="text-white ml-3" id="speech-freq-status">
                  {isSpeaking ? 'TRANSMITTING: 48.0 kHz' : 'ACTIVE: 44.1 kHz'}
                </span>
              </div>
              <div className="flex items-end space-x-1 h-5 w-48" id="header-eq-bars">
                <div className={`w-1.5 bg-[#e61937] h-3 ${isSpeaking ? 'animate-bounce' : 'animate-pulse'}`} />
                <div className={`w-1.5 bg-[#ffd152] h-4 ${isSpeaking ? 'animate-ping' : 'animate-bounce'}`} />
                <div className={`w-1.5 bg-[#00f0ff] h-2 ${isSpeaking ? 'h-5' : ''}`} />
                <div className={`w-1.5 bg-[#e61937] h-5 ${isSpeaking ? 'animate-bounce' : 'animate-pulse'}`} />
                <div className={`w-1.5 bg-[#ffd152] h-3 ${isSpeaking ? 'h-4' : ''}`} />
                <div className={`w-1.5 bg-[#ff2a4b] h-5 ${isSpeaking ? 'animate-ping' : 'animate-bounce'}`} />
                <div className={`w-1.5 bg-[#ffd152] h-4 ${isSpeaking ? 'h-5' : ''}`} />
                <div className={`w-1.5 bg-[#00f0ff] h-2 ${isSpeaking ? 'animate-bounce' : 'animate-pulse'}`} />
                <div className={`w-1.5 bg-[#e61937] h-4 ${isSpeaking ? 'h-5' : ''}`} />
                <div className={`w-1.5 bg-[#ffd152] h-5 ${isSpeaking ? 'animate-pulse' : ''}`} />
                <div className={`w-1.5 bg-[#e61937] h-3 ${isSpeaking ? 'animate-bounce' : 'animate-pulse'}`} />
                <div className={`w-1.5 bg-[#00f0ff] h-4 ${isSpeaking ? 'h-5' : ''}`} />
                <div className={`w-1.5 bg-[#ffd152] h-1 ${isSpeaking ? 'h-4' : ''}`} />
                <div className={`w-1.5 bg-[#e61937] h-5 ${isSpeaking ? 'animate-ping' : 'animate-bounce'}`} />
                <div className={`w-1.5 bg-[#ffd152] h-2 ${isSpeaking ? 'h-4' : ''}`} />
              </div>
            </div>

            {/* Telemetry & Uplink Status */}
            <div className="flex items-center space-x-4 md:space-x-6 text-xs font-mono">
              <div className="hidden sm:block">
                <span className="text-[#ffd152]/70 block text-[10px]">ORBITAL UPLINK</span>
                <span className="text-[#00f0ff] font-bold tracking-wider flex items-center gap-1.5 text-glow-cyan">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
                  984.6 TB/S [QUANTUM]
                </span>
              </div>
              <div>
                <span className="text-[#ffd152]/70 block text-[10px]">TIME / CHRONO</span>
                <span className="text-[#ffd152] font-orbitron tracking-wider text-sm text-glow" id="system-clock">
                  {clockUtc}
                </span>
              </div>
              {/* Audio Enable & SFX Master Toggles */}
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  className="px-2.5 py-1 text-xs font-mono uppercase bg-[#ffd152]/15 hover:bg-[#ffd152] hover:text-black border border-[#ffd152]/70 rounded transition-all duration-200 flex items-center gap-1.5 text-[#ffd152] cursor-pointer"
                  id="ambient-hum-btn"
                  onClick={handleToggleHum}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isHumming ? 'bg-[#ffd152] animate-ping shadow-[0_0_8px_#ffd152]' : 'bg-[#ffd152]/50'}`}
                  />
                  <span>{isHumming ? 'ARC HUM [ON]' : 'ARC HUM'}</span>
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 text-xs font-mono uppercase bg-[#e61937]/25 hover:bg-[#e61937] hover:text-white border border-[#e61937] text-[#ffd152] rounded transition-all duration-200 shadow-[0_0_14px_rgba(230,25,55,0.5)] font-semibold cursor-pointer"
                  onClick={() => {
                    playStartupChime();
                    triggerJarvisVisuals('At your service, Sir. Audio telemetric circuits fully unlocked.');
                  }}
                >
                  ENABLE AUDIO
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 text-xs font-mono uppercase bg-[#e61937]/15 hover:bg-[#e61937] hover:text-white border border-[#e61937]/60 text-[#e61937] rounded transition-all duration-200 cursor-pointer"
                  onClick={handleMute}
                >
                  MUTE
                </button>
              </div>
            </div>
          </div>
        </header>
        {/* END: TopHeaderBar */}

        {/* BEGIN: MainTacticalGrid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-grow" id="tactical-hud-container">
          {/* Left Diagnostic Flank */}
          <SuitDiagnostics onQuickPhrase={handleQuickPhrase} />

          {/* Center Hero Arc Reactor Core Visualizer with Dynamic Speaking Jaw */}
          <HelmetHero
            isSpeaking={isSpeaking}
            onTestSpeech={handleToggleDemoLoop}
            onQuickPhrase={handleQuickPhrase}
          />

          {/* Right Tactical Flank */}
          <DefenseRadar
            onRadarPing={handleRadarPing}
            cpuLoad={cpuLoad}
            synapseLatency={synapseLatency}
          />
        </main>
        {/* END: MainTacticalGrid */}

        {/* BEGIN: BottomCommandDeck */}
        <footer className="w-full bg-[rgba(15,8,12,0.78)] backdrop-blur-md border border-[rgba(230,25,55,0.35)] rounded-lg p-3 md:px-5 md:py-3.5 hud-glow hud-corner-bracket" data-purpose="command-interface">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            {/* Live AI Dialogue Status Indicator */}
            <div className="md:col-span-4 flex items-center space-x-3">
              <div
                className={`relative flex items-center justify-center w-8 h-8 rounded-full border ${isSpeaking ? 'border-[#ffd152] shadow-[0_0_15px_#ffd152]' : 'border-[#ffd152]/70'}`}
                id="dialogue-ping-ring"
              >
                <span
                  className={`w-3 h-3 rounded-full bg-[#ffd152] ${isSpeaking ? 'animate-ping shadow-[0_0_12px_#ffd152]' : 'animate-pulse shadow-[0_0_8px_#ffd152]'}`}
                  id="dialogue-ping-dot"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-[10px] font-mono tracking-widest ${isSpeaking ? 'text-[#ffd152] font-bold' : 'text-[#ffd152]/80'}`} id="jarvis-status-label">
                  {statusLabel}
                </div>
                <div className="text-sm font-orbitron font-semibold text-white tracking-wide text-glow truncate max-w-xs md:max-w-sm" id="jarvis-spoken-quote">
                  "{spokenQuote}"
                </div>
              </div>
            </div>

            {/* Interactive Voice Command Input Bar */}
            <div className="md:col-span-5">
              <form
                className="relative flex items-center gap-1.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTransmitDirective();
                }}
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="TYPE DIRECTIVE FOR J.A.R.V.I.S. (e.g. 'Divert power to auxiliary repulsors')..."
                  className="w-full bg-black/70 border border-[rgba(230,25,55,0.35)] text-[#ffd152] placeholder-[#ffd152]/40 text-xs font-mono rounded px-3.5 py-2 focus:outline-none focus:border-[#ffd152] focus:ring-1 focus:ring-[#ffd152] tracking-wider"
                  id="voice-cmd-input"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#e61937]/25 hover:bg-[#e61937] hover:text-white text-[#ffd152] rounded text-xs font-mono uppercase tracking-wider transition-colors border border-[#e61937]/60 whitespace-nowrap shadow-[0_0_12px_rgba(230,25,55,0.4)] font-bold cursor-pointer"
                >
                  TRANSMIT DIRECTIVE
                </button>
              </form>
            </div>

            {/* System Ticker Logs */}
            <div className="md:col-span-3 text-right font-mono text-[11px] text-[#ffd152]/80 truncate hidden md:block">
              <span className="text-[#e61937]/70 font-semibold">[EVENT LOG]: </span>
              <span className="text-white" id="system-event-log">
                {eventLog}
              </span>
            </div>
          </div>
        </footer>
        {/* END: BottomCommandDeck */}
      </div>
    </div>
  );
};
