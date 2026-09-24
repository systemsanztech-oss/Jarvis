import React from 'react';
import { Cpu, HardDrive, Zap, Thermometer, Wifi, Activity } from 'lucide-react';
import { SystemStats } from '../types';

interface SystemTelemetryProps {
  stats: SystemStats | null;
  accentColor: string;
}

export const SystemTelemetry: React.FC<SystemTelemetryProps> = ({ stats, accentColor }) => {
  const cpu = stats ? stats.cpu : 24;
  const ramPercent = stats ? stats.ram.percentage : 20;
  const ramUsed = stats ? stats.ram.usedGb : 6.4;
  const gpu = stats ? stats.gpu : 38;
  const temp = stats ? stats.temperatureC : 42;
  const ping = stats ? stats.networkPingMs : 22;

  const getMeterColor = (val: number) => {
    if (val > 85) return '#ff3355';
    if (val > 65) return '#ffaa00';
    return accentColor;
  };

  return (
    <div className="flex flex-col gap-3 p-3 bg-[#010d14]/90 border border-[#0d3347] rounded-lg hud-box-glow">
      <div className="flex items-center justify-between border-b border-[#0d3347] pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" style={{ color: accentColor }} />
          <span className="text-xs font-mono font-bold tracking-widest text-[#8ffcff] uppercase">
            DIAGNOSTICS // MARK LIV
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30">
          SYS_ONLINE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* CPU Load */}
        <div className="p-2 rounded bg-[#000d14] border border-[#0d3347]/60 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#3a8a9a]">
            <span className="flex items-center gap-1 font-mono">
              <Cpu className="w-3.5 h-3.5" style={{ color: accentColor }} /> CPU
            </span>
            <span className="font-mono font-semibold text-[#8ffcff]">{cpu}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#011520] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${cpu}%`,
                backgroundColor: getMeterColor(cpu),
                boxShadow: `0 0 6px ${getMeterColor(cpu)}`,
              }}
            />
          </div>
          <span className="text-[9px] font-mono text-[#3a8a9a]">16 CORES ACTIVE</span>
        </div>

        {/* RAM Usage */}
        <div className="p-2 rounded bg-[#000d14] border border-[#0d3347]/60 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#3a8a9a]">
            <span className="flex items-center gap-1 font-mono">
              <HardDrive className="w-3.5 h-3.5" style={{ color: accentColor }} /> RAM
            </span>
            <span className="font-mono font-semibold text-[#8ffcff]">{ramPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#011520] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${ramPercent}%`,
                backgroundColor: getMeterColor(ramPercent),
                boxShadow: `0 0 6px ${getMeterColor(ramPercent)}`,
              }}
            />
          </div>
          <span className="text-[9px] font-mono text-[#3a8a9a]">{ramUsed} / 32 GB</span>
        </div>

        {/* GPU Cluster */}
        <div className="p-2 rounded bg-[#000d14] border border-[#0d3347]/60 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#3a8a9a]">
            <span className="flex items-center gap-1 font-mono">
              <Zap className="w-3.5 h-3.5" style={{ color: accentColor }} /> GPU
            </span>
            <span className="font-mono font-semibold text-[#8ffcff]">{gpu}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#011520] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${gpu}%`,
                backgroundColor: getMeterColor(gpu),
                boxShadow: `0 0 6px ${getMeterColor(gpu)}`,
              }}
            />
          </div>
          <span className="text-[9px] font-mono text-[#3a8a9a]">CUDA MATRIX MK54</span>
        </div>

        {/* Thermal Sensor */}
        <div className="p-2 rounded bg-[#000d14] border border-[#0d3347]/60 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#3a8a9a]">
            <span className="flex items-center gap-1 font-mono">
              <Thermometer className="w-3.5 h-3.5" style={{ color: accentColor }} /> CORE TEMP
            </span>
            <span className="font-mono font-semibold text-[#8ffcff]">{temp}°C</span>
          </div>
          <div className="w-full h-1.5 bg-[#011520] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${(temp / 100) * 100}%`,
                backgroundColor: temp > 75 ? '#ff3355' : accentColor,
              }}
            />
          </div>
          <span className="text-[9px] font-mono text-[#3a8a9a]">COOLING NOMINAL</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 px-1 text-[10px] font-mono text-[#3a8a9a]">
        <span className="flex items-center gap-1">
          <Wifi className="w-3 h-3 text-[#00ff88]" /> PING: {ping}ms
        </span>
        <span>SECURITY: LEVEL 5 (STARK)</span>
      </div>
    </div>
  );
};
