import React from 'react';
import { Newspaper, CloudSun, CheckCircle2, Search, RotateCcw, Sparkles } from 'lucide-react';
import { BriefingData } from '../types';

interface DynamicContentPanelProps {
  briefing: BriefingData | null;
  lastAction: string | null;
  onQuickCommand: (cmd: string) => void;
  accentColor: string;
}

export const DynamicContentPanel: React.FC<DynamicContentPanelProps> = ({
  briefing,
  lastAction,
  onQuickCommand,
  accentColor,
}) => {
  return (
    <div className="flex flex-col gap-3 p-3 bg-[#010d14]/90 border border-[#0d3347] rounded-lg hud-box-glow">
      <div className="flex items-center justify-between border-b border-[#0d3347] pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
          <span className="text-xs font-mono font-bold tracking-widest text-[#8ffcff] uppercase">
            DYNAMIC INTEL &amp; BRIEFING
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#3a8a9a]">LAYER 2 ACTIVE</span>
      </div>

      {/* Quick Directives row */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { label: 'Morning Briefing', cmd: 'Give me the morning briefing' },
          { label: 'System Diagnostics', cmd: 'Run complete system diagnostics' },
          { label: 'Organize Files', cmd: 'Organize files on my desktop' },
          { label: 'Weather Forecast', cmd: "What is today's weather report?" },
          { label: 'Undo Last Action', cmd: 'Undo last action' },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() => onQuickCommand(btn.cmd)}
            className="px-2.5 py-1 text-[11px] font-mono rounded bg-[#001f2e]/60 border border-[#0d3347] text-[#8ffcff] hover:bg-[#002f47] hover:border-[#1a5c7a] transition-colors"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Briefing or Intelligence stream */}
      {briefing ? (
        <div className="flex flex-col gap-2.5 p-2.5 bg-[#000d14] rounded border border-[#0d3347]/80 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono font-semibold text-[#ffaa00]">{briefing.greeting}</span>
            <span className="font-mono text-[#3a8a9a] text-[10px]">{briefing.date}</span>
          </div>

          {/* Weather & Core Info */}
          <div className="flex items-center gap-3 p-2 rounded bg-[#011520] border border-[#0d3347]">
            <CloudSun className="w-6 h-6 shrink-0" style={{ color: accentColor }} />
            <div className="flex flex-col">
              <span className="text-[#8ffcff] font-medium text-[11px]">
                {briefing.weather.condition} • {briefing.weather.tempC}°C ({briefing.weather.tempF}°F)
              </span>
              <span className="text-[#3a8a9a] text-[10px]">{briefing.weather.forecast}</span>
            </div>
          </div>

          {/* News Headlines */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-[#3a8a9a] uppercase flex items-center gap-1">
              <Newspaper className="w-3 h-3" /> INTEL HEADLINES:
            </span>
            {briefing.headlines.map((item, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#5ab8cc]">
                <span className="text-[#3a8a9a] font-mono">[{idx + 1}]</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 text-center text-[11px] font-mono text-[#3a8a9a] bg-[#000d14] rounded border border-[#0d3347]/50">
          Ready for incoming mission parameters.
        </div>
      )}

      {lastAction && (
        <div className="flex items-center justify-between p-2 rounded bg-[#002f47]/40 border border-[#1a5c7a]/60 text-[11px]">
          <span className="flex items-center gap-1.5 font-mono text-[#8ffcff]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88]" />
            LAST OPERATION: {lastAction}
          </span>
          <button
            onClick={() => onQuickCommand('Undo last action')}
            className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#ffaa00]/10 text-[#ffaa00] border border-[#ffaa00]/30 hover:bg-[#ffaa00]/20"
          >
            <RotateCcw className="w-2.5 h-2.5" /> UNDO
          </button>
        </div>
      )}
    </div>
  );
};
