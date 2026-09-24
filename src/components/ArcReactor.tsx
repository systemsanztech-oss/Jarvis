import React, { useEffect, useRef } from 'react';
import { AssistantState } from '../types';

interface ArcReactorProps {
  state: AssistantState;
  audioLevel: number;
  accentColor: string;
}

export const ArcReactor: React.FC<ArcReactorProps> = ({
  state,
  audioLevel,
  accentColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotation1 = 0;
    let rotation2 = 0;
    let rotation3 = 0;
    let pulseTime = 0;

    const render = () => {
      pulseTime += 0.05;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.42;

      ctx.clearRect(0, 0, width, height);

      // Rotation speeds driven by assistant state
      let speedMult = 1.0;
      if (state === 'THINKING') speedMult = 2.8;
      else if (state === 'SPEAKING') speedMult = 1.6;
      else if (state === 'SLEEPING') speedMult = 0.25;

      rotation1 += 0.012 * speedMult;
      rotation2 -= 0.018 * speedMult;
      rotation3 += 0.008 * speedMult;

      // Outer Static Gauge Ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `${accentColor}33`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Outer Tick Marks (60 ticks like a dial)
      ctx.save();
      ctx.translate(cx, cy);
      for (let i = 0; i < 60; i++) {
        ctx.rotate((Math.PI * 2) / 60);
        ctx.beginPath();
        const isMajor = i % 5 === 0;
        ctx.moveTo(radius - (isMajor ? 12 : 6), 0);
        ctx.lineTo(radius, 0);
        ctx.strokeStyle = isMajor ? `${accentColor}aa` : `${accentColor}44`;
        ctx.lineWidth = isMajor ? 2 : 1;
        ctx.stroke();
      }
      ctx.restore();

      // Spectrum Wave Ring (Driven by real audio level)
      const specRadius = radius * 0.85;
      const numSpikes = 48;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation3);
      for (let i = 0; i < numSpikes; i++) {
        const angle = (i / numSpikes) * Math.PI * 2;
        const spikeBase = 4 + Math.sin(pulseTime * 2 + i) * 3;
        const spikeLen = spikeBase + audioLevel * 30 * (1 + Math.sin(i * 1.5) * 0.5);

        const x1 = Math.cos(angle) * specRadius;
        const y1 = Math.sin(angle) * specRadius;
        const x2 = Math.cos(angle) * (specRadius - spikeLen);
        const y2 = Math.sin(angle) * (specRadius - spikeLen);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `${accentColor}${Math.floor(Math.min(255, (0.3 + audioLevel * 0.7) * 255)).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();

      // Arc Segment 1 (Counter-clockwise tri-arcs)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation1);
      ctx.lineWidth = 5;
      ctx.strokeStyle = `${accentColor}bb`;
      for (let a = 0; a < 3; a++) {
        ctx.beginPath();
        const start = a * ((Math.PI * 2) / 3) + 0.1;
        const end = start + ((Math.PI * 2) / 3) - 0.4;
        ctx.arc(0, 0, radius * 0.68, start, end);
        ctx.stroke();
      }
      ctx.restore();

      // Arc Segment 2 (Clockwise segmented ring)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = `${accentColor}ee`;
      for (let a = 0; a < 6; a++) {
        ctx.beginPath();
        const start = a * ((Math.PI * 2) / 6) + 0.15;
        const end = start + ((Math.PI * 2) / 6) - 0.25;
        ctx.arc(0, 0, radius * 0.52, start, end);
        ctx.stroke();
      }
      ctx.restore();

      // Inner Core Ring
      const coreRadius = radius * 0.35;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Central Plasma Glowing Core
      const coreBrightness = 0.5 + audioLevel * 0.5 + Math.sin(pulseTime * 3) * 0.1;
      const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreRadius);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.3, accentColor);
      coreGrad.addColorStop(0.8, `${accentColor}66`);
      coreGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * coreBrightness, 0, Math.PI * 2);
      ctx.fill();

      // Palladium Triangular Core Geometry
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(pulseTime * 0.5);
      ctx.beginPath();
      for (let t = 0; t < 3; t++) {
        const triAngle = t * ((Math.PI * 2) / 3) - Math.PI / 2;
        const tx = Math.cos(triAngle) * (coreRadius * 0.55);
        const ty = Math.sin(triAngle) * (coreRadius * 0.55);
        if (t === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.closePath();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [state, audioLevel, accentColor]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={420}
        height={420}
        className="w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] object-contain"
      />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded bg-[#010f18]/80 border border-[#0d3347] backdrop-blur-sm text-[11px] font-mono tracking-widest uppercase">
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: accentColor }}
        />
        <span className="text-[#8ffcff] font-semibold">ARC REACTOR MK.54</span>
        <span className="text-[#3a8a9a]">|</span>
        <span className="text-[#3a8a9a]">OUTPUT 98.7%</span>
      </div>
    </div>
  );
};
