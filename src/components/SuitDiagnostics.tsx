import React from 'react';

interface SuitDiagnosticsProps {
  onQuickPhrase: (phrase: string) => void;
}

export const SuitDiagnostics: React.FC<SuitDiagnosticsProps> = ({ onQuickPhrase }) => {
  return (
    <aside className="lg:col-span-3 flex flex-col gap-3.5" data-purpose="armor-and-energy-telemetry">
      {/* Armor Integrity Card */}
      <div className="bg-[rgba(15,8,12,0.78)] backdrop-blur-md border border-[rgba(230,25,55,0.35)] rounded-lg p-3.5 hud-glow hud-corner-bracket flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-[rgba(230,25,55,0.35)]/50 pb-2 mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#e61937] rounded-sm shadow-[0_0_6px_#e61937]" />
              <h3 className="font-orbitron text-xs md:text-sm tracking-wider font-bold text-white">
                SUIT DIAGNOSTICS
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#ffd152] tracking-widest font-semibold">
              [ MK-LXXXV ]
            </span>
          </div>

          {/* Armor Status Micro Meters */}
          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#ffd152]/90 font-medium">NANOTECH PLATING</span>
                <span className="text-white font-bold">98.4%</span>
              </div>
              <div className="w-full bg-[#2a111a]/80 h-1.5 rounded-full overflow-hidden border border-[#e61937]/30">
                <div className="bg-gradient-to-r from-[#e61937] via-[#ffd152] to-[#f5c443] h-full w-[98%] shadow-[0_0_10px_#ffd152]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#ffd152]/90 font-medium">CORE SHIELD DENSITY</span>
                <span className="text-white font-bold">100.0%</span>
              </div>
              <div className="w-full bg-[#2a111a]/80 h-1.5 rounded-full overflow-hidden border border-[#e61937]/30">
                <div className="bg-gradient-to-r from-[#e61937] via-[#ff2a4b] to-[#ffd152] h-full w-full shadow-[0_0_10px_#e61937]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#ffd152]/90 font-medium">FLIGHT STABILIZERS</span>
                <span className="text-white font-bold">94.2%</span>
              </div>
              <div className="w-full bg-[#2a111a]/80 h-1.5 rounded-full overflow-hidden border border-[#e61937]/30">
                <div className="bg-gradient-to-r from-[#e5a922] via-[#ffd152] to-[#f5c443] h-full w-[94%] shadow-[0_0_10px_#ffd152]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#ff2a4b] font-medium">REPULSOR THERMALS</span>
                <span className="text-[#f5c443] font-bold">42.8°C</span>
              </div>
              <div className="w-full bg-[#2a111a]/80 h-1.5 rounded-full overflow-hidden border border-[#e61937]/30">
                <div className="bg-gradient-to-r from-[#ffd152] via-[#f5c443] to-[#e61937] h-full w-[43%] shadow-[0_0_10px_#ff2a4b]" />
              </div>
            </div>
          </div>
        </div>

        {/* Micro Suit Silhouette Schematic preview */}
        <div className="mt-4 p-2.5 border border-[rgba(230,25,55,0.35)]/60 rounded bg-black/60 flex items-center justify-around text-center text-[10px] font-mono shadow-inner">
          <button
            type="button"
            className="cursor-pointer hover:text-[#ffd152] transition-colors"
            onClick={() => onQuickPhrase('Helmet cranial mesh and heads up display online and synchronized.')}
          >
            <span className="block text-[#ffd152]/70">HELM</span>
            <span className="text-white font-bold text-glow">SYNC</span>
          </button>
          <div className="w-px h-6 bg-[rgba(230,25,55,0.35)]/50" />
          <button
            type="button"
            className="cursor-pointer hover:text-[#ffd152] transition-colors"
            onClick={() => onQuickPhrase('Arc core reactor operating at four gigajoules per second.')}
          >
            <span className="block text-[#ffd152]/70">CHEST</span>
            <span className="text-[#ffd152] font-bold">ONLINE</span>
          </button>
          <div className="w-px h-6 bg-[rgba(230,25,55,0.35)]/50" />
          <button
            type="button"
            className="cursor-pointer hover:text-[#ffd152] transition-colors"
            onClick={() => onQuickPhrase('Repulsor cannons charged and ready to fire.')}
          >
            <span className="block text-[#ffd152]/70">GAUNTLETS</span>
            <span className="text-[#00f0ff] font-bold">100%</span>
          </button>
          <div className="w-px h-6 bg-[rgba(230,25,55,0.35)]/50" />
          <button
            type="button"
            className="cursor-pointer hover:text-[#ffd152] transition-colors"
            onClick={() => onQuickPhrase('Supersonic thrusters primed for orbital takeoff.')}
          >
            <span className="block text-[#ffd152]/70">BOOTS</span>
            <span className="text-[#ff2a4b] font-bold">PRIMED</span>
          </button>
        </div>
      </div>

      {/* Tactical Direct Link Panel & Voice Commands */}
      <div className="bg-[rgba(15,8,12,0.78)] backdrop-blur-md border border-[rgba(230,25,55,0.35)] rounded-lg p-3.5 hud-glow hud-corner-bracket" data-purpose="quick-access-modules">
        <div className="text-[11px] font-orbitron font-bold tracking-widest text-[#ffd152] uppercase mb-2.5 flex justify-between items-center">
          <span>// J.A.R.V.I.S. VOICE PROTOCOLS</span>
          <span className="text-[9px] text-[#ffd152]/60 font-mono">PRE-SET</span>
        </div>
        <div className="grid grid-cols-1 gap-2 text-xs font-mono">
          <button
            onClick={() => onQuickPhrase('At your service, Sir. All systems operating at peak efficiency.')}
            className="flex items-center justify-between p-2 rounded border border-[rgba(230,25,55,0.35)]/60 hover:border-[#ffd152] bg-[#e61937]/10 hover:bg-[#e61937]/25 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffd152] group-hover:scale-125 transition-transform shadow-[0_0_6px_#ffd152]" />
              <span className="truncate text-white group-hover:text-[#ffd152] transition-colors">
                "At your service, Sir..."
              </span>
            </div>
            <span className="text-[10px] text-[#ffd152]/70 font-orbitron">SYS_01</span>
          </button>

          <button
            onClick={() => onQuickPhrase('Importing orbital telemetry. Nanotech shielding holding at 100%.')}
            className="flex items-center justify-between p-2 rounded border border-[rgba(230,25,55,0.35)]/60 hover:border-[#ffd152] bg-[#e61937]/10 hover:bg-[#e61937]/25 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffd152] group-hover:scale-125 transition-transform shadow-[0_0_6px_#ffd152]" />
              <span className="truncate text-white group-hover:text-[#ffd152] transition-colors">
                "Importing telemetry..."
              </span>
            </div>
            <span className="text-[10px] text-[#ffd152]/70 font-orbitron">SHIELD</span>
          </button>

          <button
            onClick={() => onQuickPhrase('Power redirected to repulsor arrays. Target locked.')}
            className="flex items-center justify-between p-2 rounded border border-[rgba(230,25,55,0.35)]/60 hover:border-[#ffd152] bg-[#e61937]/10 hover:bg-[#e61937]/25 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a4b] group-hover:scale-125 transition-transform shadow-[0_0_6px_#ff2a4b]" />
              <span className="truncate text-white group-hover:text-[#ff2a4b] transition-colors">
                "Power to repulsors..."
              </span>
            </div>
            <span className="text-[10px] text-[#ff2a4b]/80 font-orbitron">REPULS</span>
          </button>

          <button
            onClick={() => onQuickPhrase('Deploying drone swarm. Perimeter defense protocol activated.')}
            className="flex items-center justify-between p-2 rounded border border-[rgba(230,25,55,0.35)]/60 hover:border-[#ffd152] bg-[#ffd152]/10 hover:bg-[#ffd152]/20 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffd152] group-hover:scale-125 transition-transform shadow-[0_0_6px_#ffd152]" />
              <span className="truncate text-[#ffd152] font-medium">
                "Deploying drone swarm..."
              </span>
            </div>
            <span className="text-[10px] text-[#ffd152] font-orbitron">DEF_SWARM</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
