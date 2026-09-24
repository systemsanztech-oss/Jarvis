import React from 'react';

interface DefenseRadarProps {
  onRadarPing: () => void;
  cpuLoad: number;
  synapseLatency: number;
}

export const DefenseRadar: React.FC<DefenseRadarProps> = ({
  onRadarPing,
  cpuLoad,
  synapseLatency,
}) => {
  return (
    <aside className="lg:col-span-3 flex flex-col gap-3.5" data-purpose="radar-threat-assessment">
      <div className="bg-[rgba(15,8,12,0.78)] backdrop-blur-md border border-[rgba(230,25,55,0.35)] rounded-lg p-3.5 hud-glow hud-corner-bracket flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-[rgba(230,25,55,0.35)]/50 pb-2 mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#e61937] rounded-sm shadow-[0_0_6px_#e61937]" />
              <h3 className="font-orbitron text-xs md:text-sm tracking-wider font-bold text-white">
                DEFENSE RADAR
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#ffd152] tracking-widest font-semibold">
              SECURE
            </span>
          </div>

          {/* Radar Circular Sweep Visualizer */}
          <div
            className="relative w-44 h-44 mx-auto my-2 rounded-full border border-[#e61937]/60 bg-black/60 p-2 flex items-center justify-center overflow-hidden cursor-pointer shadow-[0_0_20px_rgba(230,25,55,0.25)]"
            onClick={onRadarPing}
            title="Click to ping Defense Radar"
          >
            {/* Concentric Range Circles */}
            <div className="absolute inset-4 rounded-full border border-[#e61937]/35" />
            <div className="absolute inset-10 rounded-full border border-[#ffd152]/30" />
            <div className="absolute inset-16 rounded-full border border-[#e61937]/25" />
            <div className="absolute inset-0 border-t border-b border-[rgba(230,25,55,0.35)]/30" />
            <div className="absolute inset-0 border-l border-r border-[rgba(230,25,55,0.35)]/30" />

            {/* Radar Sweep Beam (Crimson to Gold Gradient) */}
            <div className="absolute inset-0 anim-sweep pointer-events-none">
              <div className="w-1/2 h-1/2 bg-gradient-to-br from-[#e61937]/50 via-[#ffd152]/30 to-transparent origin-bottom-right transform rotate-0" />
            </div>

            {/* Tactical Target Blips */}
            <div className="absolute top-10 right-12 w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff] animate-ping" />
            <div className="absolute bottom-11 left-12 w-1.5 h-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]" />
            <div className="text-[10px] font-mono text-[#ffd152]/80 tracking-wider">RANGE 50KM</div>
          </div>

          {/* Threat Telemetry Readout */}
          <div className="mt-3 font-mono text-xs space-y-1.5 border-t border-[rgba(230,25,55,0.35)]/50 pt-2.5">
            <div className="flex justify-between">
              <span className="text-[#ffd152]/80">RADAR LOCKS:</span>
              <span className="text-white font-bold">0 HOSTILE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#ffd152]/80">DEFENSE GRID:</span>
              <span className="text-[#ffd152] font-bold">PERIMETER SAFE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#ffd152]/80">IFF BEACON:</span>
              <span className="text-[#ff2a4b] font-bold">STARK-ALPHA-01</span>
            </div>
          </div>
        </div>

        {/* Neural / Processing Load Metrics */}
        <div className="mt-3 p-2.5 rounded bg-black/60 border border-[rgba(230,25,55,0.35)]/50 font-mono text-xs space-y-2">
          <div>
            <div className="flex justify-between text-[10px]">
              <span className="text-[#ffd152]/80">QUANTUM CPU LOAD</span>
              <span className="text-white font-bold">{cpuLoad.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-[#2a111a] h-1 rounded-full mt-1 border border-[#e61937]/25">
              <div
                className="bg-gradient-to-r from-[#e61937] to-[#ffd152] h-1 rounded-full shadow-[0_0_6px_#ffd152] transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, cpuLoad))}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px]">
              <span className="text-[#ffd152]/80">NEURAL SYNAPSE LATENCY</span>
              <span className="text-white font-bold">{synapseLatency.toFixed(2)} ms</span>
            </div>
            <div className="w-full bg-[#2a111a] h-1 rounded-full mt-1 border border-[#e61937]/25">
              <div
                className="bg-gradient-to-r from-[#e61937] to-[#00f0ff] h-1 rounded-full shadow-[0_0_6px_#00f0ff] transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, synapseLatency * 30))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
