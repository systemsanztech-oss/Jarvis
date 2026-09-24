import React, { useEffect, useRef } from 'react';
import { Terminal, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Message } from '../types';

interface TerminalLogProps {
  messages: Message[];
  onClear: () => void;
  accentColor: string;
}

export const TerminalLog: React.FC<TerminalLogProps> = ({
  messages,
  onClear,
  accentColor,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[#010d14]/90 border border-[#0d3347] rounded-lg hud-box-glow overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#0d3347] bg-[#000d14]/60">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" style={{ color: accentColor }} />
          <span className="text-xs font-mono font-bold tracking-widest text-[#8ffcff] uppercase">
            ACTIVITY STREAM // STARK TELEMETRY
          </span>
        </div>
        <button
          onClick={onClear}
          className="p-1 text-[#3a8a9a] hover:text-[#ff3355] transition-colors rounded hover:bg-[#000d14]"
          title="Clear Log"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 p-3 overflow-y-auto font-mono text-xs flex flex-col gap-2 leading-relaxed"
      >
        {messages.length === 0 ? (
          <div className="text-center text-[#3a8a9a] py-8 text-[11px]">
            &gt; STARK OS READY. AWAITING AUDIO OR TEXT DIRECTIVE...
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isSys = msg.sender === 'system';

            return (
              <div
                key={msg.id}
                className={`p-2 rounded border transition-all ${
                  isUser
                    ? 'bg-[#001f2e]/40 border-[#0d3347] text-[#8ffcff]'
                    : isSys
                    ? 'bg-[#000d14]/80 border-[#0d3347]/40 text-[#5ab8cc] text-[11px]'
                    : 'bg-[#011520]/60 border-[#1a5c7a]/60 text-[#d8f8ff]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-[#3a8a9a] mb-1">
                  <span className="flex items-center gap-1.5 font-bold uppercase">
                    {isUser ? (
                      <span className="text-[#ffaa00]">USER // COMMANDER</span>
                    ) : isSys ? (
                      <span className="text-[#3a8a9a] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> SYSTEM_EVENT
                      </span>
                    ) : (
                      <span style={{ color: accentColor }}>JARVIS // AI CORE</span>
                    )}
                  </span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                </div>

                <div className="whitespace-pre-wrap break-words">{msg.text}</div>

                {msg.action && (
                  <div className="mt-1.5 pt-1.5 border-t border-[#0d3347]/50 flex items-center gap-1.5 text-[10px] text-[#ffaa00]">
                    <ArrowRight className="w-3 h-3" />
                    <span>EXECUTED ACTION: {msg.action}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
