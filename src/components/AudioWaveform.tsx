import React, { useEffect, useRef } from 'react';
import { AssistantState } from '../types';

interface AudioWaveformProps {
  state: AssistantState;
  audioLevel: number;
  accentColor: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
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
    let time = 0;
    const barCount = 48;
    const history: number[] = new Array(barCount).fill(0);

    const render = () => {
      time += 0.08;
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Shift history and add new sample
      history.shift();
      const currentEnergy = Math.max(0.04, audioLevel * (state === 'LISTENING' || state === 'SPEAKING' ? 1.0 : 0.15));
      history.push(currentEnergy);

      const barWidth = width / barCount;

      // Draw center reference guide line
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.strokeStyle = `${accentColor}22`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw symmetrical equalizer bars
      for (let i = 0; i < barCount; i++) {
        const val = history[i];
        // Add subtle harmonic modulation across bars
        const harmonic = Math.sin(time + i * 0.25) * 0.08;
        const normalized = Math.min(1.0, val + Math.abs(harmonic));
        const barHeight = Math.max(4, normalized * (height * 0.85));

        const x = i * barWidth;
        const yTop = centerY - barHeight / 2;

        const grad = ctx.createLinearGradient(0, yTop, 0, yTop + barHeight);
        grad.addColorStop(0, accentColor);
        grad.addColorStop(0.5, '#ffffff');
        grad.addColorStop(1, accentColor);

        ctx.fillStyle = grad;
        ctx.fillRect(x + 1, yTop, Math.max(1, barWidth - 2), barHeight);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [state, audioLevel, accentColor]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex items-center justify-between px-2 text-[10px] font-mono text-[#3a8a9a] uppercase tracking-wider mb-1">
        <span>AUDIO SPECTRUM // 16kHz PCM</span>
        <span>LEVEL: {(audioLevel * 100).toFixed(0)}%</span>
      </div>
      <canvas
        ref={canvasRef}
        width={360}
        height={50}
        className="w-full h-[40px] bg-[#000d14]/70 rounded border border-[#0d3347]"
      />
    </div>
  );
};
