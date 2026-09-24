import React from 'react';
import { Settings, X, Palette, Volume2, Mic, Radio, Eye } from 'lucide-react';
import { HudMode } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
  onAccentChange: (color: string) => void;
  hudMode: HudMode;
  onHudModeChange: (mode: HudMode) => void;
  pushToTalk: boolean;
  onPushToTalkChange: (val: boolean) => void;
  wakeWordEnabled: boolean;
  onWakeWordChange: (val: boolean) => void;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: string;
  onVoiceChange: (voiceName: string) => void;
}

const PRESET_THEMES = [
  { name: 'Stark Arc Cyan', hex: '#00d4ff' },
  { name: 'Mark LIV Gold', hex: '#ffaa00' },
  { name: 'Hot Rod Red', hex: '#ff3355' },
  { name: 'Gamma Emerald', hex: '#00ff88' },
  { name: 'Quantum Purple', hex: '#a855f7' },
  { name: 'Stealth Blue', hex: '#38bdf8' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  accentColor,
  onAccentChange,
  hudMode,
  onHudModeChange,
  pushToTalk,
  onPushToTalkChange,
  wakeWordEnabled,
  onWakeWordChange,
  availableVoices,
  selectedVoice,
  onVoiceChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-[#010f18] border border-[#1a5c7a] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#0d3347] bg-[#000d14]">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" style={{ color: accentColor }} />
            <span className="font-mono font-bold text-sm tracking-widest text-[#8ffcff] uppercase">
              JARVIS PROTOCOL CONFIGURATION // MARK LIV
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#3a8a9a] hover:text-[#ff3355] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">
          {/* Theme Palette Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#8ffcff]">
              <Palette className="w-4 h-4" style={{ color: accentColor }} />
              <span>LIVE HUD THEME // ACCENT COLOR</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_THEMES.map((th) => (
                <button
                  key={th.hex}
                  onClick={() => onAccentChange(th.hex)}
                  className={`flex items-center gap-2 p-2 rounded text-xs font-mono border transition-all ${
                    accentColor.toLowerCase() === th.hex.toLowerCase()
                      ? 'border-[#ffffff] bg-[#002f47]'
                      : 'border-[#0d3347] bg-[#000d14] hover:border-[#1a5c7a]'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/40 shrink-0"
                    style={{ backgroundColor: th.hex }}
                  />
                  <span className="truncate text-[#8ffcff]">{th.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* HUD Centerpiece Mode */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#8ffcff]">
              <Eye className="w-4 h-4" style={{ color: accentColor }} />
              <span>CENTERPIECE DISPLAY MODE</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onHudModeChange('AVATAR')}
                className={`p-2.5 rounded text-xs font-mono border transition-all text-center flex flex-col gap-1 items-center ${
                  hudMode === 'AVATAR'
                    ? 'border-[#00d4ff] bg-[#002f47]'
                    : 'border-[#0d3347] bg-[#000d14] hover:border-[#1a5c7a]'
                }`}
              >
                <span className="font-bold text-[#8ffcff]">HOLOGRAPHIC AVATAR</span>
                <span className="text-[10px] text-[#3a8a9a]">MediaPipe 3D Wireframe Face</span>
              </button>
              <button
                onClick={() => onHudModeChange('REACTOR')}
                className={`p-2.5 rounded text-xs font-mono border transition-all text-center flex flex-col gap-1 items-center ${
                  hudMode === 'REACTOR'
                    ? 'border-[#00d4ff] bg-[#002f47]'
                    : 'border-[#0d3347] bg-[#000d14] hover:border-[#1a5c7a]'
                }`}
              >
                <span className="font-bold text-[#8ffcff]">ARC REACTOR CORE</span>
                <span className="text-[10px] text-[#3a8a9a]">Rotational Spectrum Rings</span>
              </button>
            </div>
          </div>

          {/* Voice Synthesis Selector */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#8ffcff]">
              <Volume2 className="w-4 h-4" style={{ color: accentColor }} />
              <span>VOICE SYNTHESIS ENGINE</span>
            </div>
            <select
              value={selectedVoice}
              onChange={(e) => onVoiceChange(e.target.value)}
              className="text-xs bg-[#000d14] border border-[#0d3347] rounded p-2 text-[#8ffcff] focus:outline-none focus:border-[#00d4ff]"
            >
              {availableVoices.length > 0 ? (
                availableVoices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))
              ) : (
                <option value="">Default Web Speech Synthesizer</option>
              )}
            </select>
          </div>

          {/* Input & Wake Control Toggles */}
          <div className="flex flex-col gap-3 pt-2 border-t border-[#0d3347]">
            {/* Push to talk */}
            <div className="flex items-center justify-between p-2 rounded bg-[#000d14] border border-[#0d3347]">
              <div className="flex flex-col">
                <span className="text-xs font-mono text-[#8ffcff] flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" style={{ color: accentColor }} /> PUSH-TO-TALK MODE
                </span>
                <span className="text-[10px] text-[#3a8a9a]">
                  Hold [Spacebar] or [Ctrl+Space] to open microphone
                </span>
              </div>
              <input
                type="checkbox"
                checked={pushToTalk}
                onChange={(e) => onPushToTalkChange(e.target.checked)}
                className="w-4 h-4 accent-[#00d4ff] cursor-pointer"
              />
            </div>

            {/* Wake Word Detection */}
            <div className="flex items-center justify-between p-2 rounded bg-[#000d14] border border-[#0d3347]">
              <div className="flex flex-col">
                <span className="text-xs font-mono text-[#8ffcff] flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" style={{ color: accentColor }} /> WAKE WORD ("HEY JARVIS")
                </span>
                <span className="text-[10px] text-[#3a8a9a]">
                  Continuous local acoustic detection
                </span>
              </div>
              <input
                type="checkbox"
                checked={wakeWordEnabled}
                onChange={(e) => onWakeWordChange(e.target.checked)}
                className="w-4 h-4 accent-[#00d4ff] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#0d3347] bg-[#000d14] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-mono font-semibold"
            style={{ backgroundColor: accentColor, color: '#00060a' }}
          >
            APPLY SETTINGS
          </button>
        </div>
      </div>
    </div>
  );
};
