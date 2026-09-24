import React, { useEffect, useRef } from 'react';
import { AssistantState, VisemeFrame } from '../types';

interface HoloAvatarProps {
  state: AssistantState;
  viseme: VisemeFrame;
  audioLevel: number;
  accentColor: string;
}

// 3D Point interface
interface Point3D {
  x: number;
  y: number;
  z: number;
}

export const HoloAvatar: React.FC<HoloAvatarProps> = ({
  state,
  viseme,
  audioLevel,
  accentColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let blink = 0; // 0 = open, 1 = closed
    let nextBlinkTime = 120;
    let saccadeX = 0;
    let saccadeY = 0;
    let nextSaccadeTime = 80;

    // Canonical Face & Skull Nodes (Normalized -1.0 to 1.0)
    // Structure: Brow, Eyes, Nose, Cheek, Lips, Jaw, Cranium
    const baseMeshNodes: Point3D[] = [
      // Cranium / Head Contour (0..8)
      { x: 0, y: -0.92, z: -0.1 },
      { x: -0.45, y: -0.78, z: -0.2 },
      { x: 0.45, y: -0.78, z: -0.2 },
      { x: -0.65, y: -0.45, z: -0.25 },
      { x: 0.65, y: -0.45, z: -0.25 },
      { x: -0.72, y: 0.0, z: -0.2 },
      { x: 0.72, y: 0.0, z: -0.2 },
      { x: -0.6, y: 0.45, z: -0.1 },
      { x: 0.6, y: 0.45, z: -0.1 },

      // Jaw and Chin (9..13)
      { x: -0.4, y: 0.75, z: 0.1 },
      { x: 0.4, y: 0.75, z: 0.1 },
      { x: -0.2, y: 0.92, z: 0.25 },
      { x: 0.2, y: 0.92, z: 0.25 },
      { x: 0, y: 0.95, z: 0.3 }, // Chin tip (13)

      // Eyebrows (14..19)
      { x: -0.5, y: -0.32, z: 0.35 },
      { x: -0.32, y: -0.36, z: 0.42 },
      { x: -0.12, y: -0.32, z: 0.45 },
      { x: 0.12, y: -0.32, z: 0.45 },
      { x: 0.32, y: -0.36, z: 0.42 },
      { x: 0.5, y: -0.32, z: 0.35 },

      // Eyes (20..27)
      // Left eye: inner, top, outer, bottom (20..23)
      { x: -0.14, y: -0.18, z: 0.42 },
      { x: -0.26, y: -0.22, z: 0.4 },
      { x: -0.42, y: -0.18, z: 0.35 },
      { x: -0.26, y: -0.15, z: 0.38 },
      // Right eye: inner, top, outer, bottom (24..27)
      { x: 0.14, y: -0.18, z: 0.42 },
      { x: 0.26, y: -0.22, z: 0.4 },
      { x: 0.42, y: -0.18, z: 0.35 },
      { x: 0.26, y: -0.15, z: 0.38 },

      // Nose (28..33)
      { x: 0, y: -0.28, z: 0.46 },     // Bridge top (28)
      { x: 0, y: 0.05, z: 0.62 },      // Nose tip (29)
      { x: -0.12, y: 0.12, z: 0.5 },   // Left nostril (30)
      { x: 0.12, y: 0.12, z: 0.5 },    // Right nostril (31)
      { x: 0, y: 0.14, z: 0.55 },      // Nose columella (32)
      { x: 0, y: -0.1, z: 0.52 },      // Mid bridge (33)

      // Cheeks (34..37)
      { x: -0.45, y: 0.1, z: 0.3 },
      { x: 0.45, y: 0.1, z: 0.3 },
      { x: -0.3, y: 0.32, z: 0.35 },
      { x: 0.3, y: 0.32, z: 0.35 },

      // Lips / Mouth (38..45)
      // Corners: Left(38), Right(39)
      { x: -0.24, y: 0.42, z: 0.42 },
      { x: 0.24, y: 0.42, z: 0.42 },
      // Upper lip: center top(40), center bottom(41)
      { x: 0, y: 0.35, z: 0.48 },
      { x: 0, y: 0.41, z: 0.45 },
      // Lower lip: center top(42), center bottom(43)
      { x: 0, y: 0.43, z: 0.44 },
      { x: 0, y: 0.52, z: 0.46 },
      // Lip sides (44, 45)
      { x: -0.14, y: 0.38, z: 0.45 },
      { x: 0.14, y: 0.38, z: 0.45 },
    ];

    // Mesh Edges (Wireframe connections)
    const meshEdges: [number, number][] = [
      // Cranium
      [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 8],
      [7, 9], [8, 10], [9, 11], [10, 12], [11, 13], [12, 13],
      // Brow
      [14, 15], [15, 16], [16, 28], [28, 17], [17, 18], [18, 19],
      // Left Eye
      [20, 21], [21, 22], [22, 23], [23, 20],
      // Right Eye
      [24, 25], [25, 26], [26, 27], [27, 24],
      // Nose
      [28, 33], [33, 29], [29, 30], [29, 31], [30, 32], [31, 32],
      [33, 20], [33, 24],
      // Cheeks & Structure
      [22, 34], [26, 35], [34, 36], [35, 37], [30, 36], [31, 37],
      [36, 38], [37, 39], [36, 9], [37, 10],
      // Mouth
      [38, 44], [44, 40], [40, 45], [45, 39], // Upper outline
      [38, 41], [41, 39],                      // Inner upper
      [38, 42], [42, 39],                      // Inner lower
      [38, 43], [43, 39],                      // Lower outline
      [43, 13], [38, 11], [39, 12],            // Chin anchors
      // Forehead ribs
      [0, 15], [0, 18], [1, 14], [2, 19]
    ];

    const render = () => {
      time++;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Natural Saccade and Gaze computation
      if (time > nextSaccadeTime) {
        if (state === 'THINKING') {
          saccadeX = 0.25 + (Math.random() - 0.5) * 0.15; // glance up-right
          saccadeY = -0.3 + (Math.random() - 0.5) * 0.1;
        } else if (state === 'LISTENING') {
          saccadeX = (Math.random() - 0.5) * 0.04; // steady direct eye contact
          saccadeY = (Math.random() - 0.5) * 0.04;
        } else if (state === 'SLEEPING') {
          saccadeX = 0;
          saccadeY = 0.2; // eyes cast down
        } else {
          saccadeX = (Math.random() - 0.5) * 0.16;
          saccadeY = (Math.random() - 0.5) * 0.12;
        }
        nextSaccadeTime = time + 60 + Math.floor(Math.random() * 120);
      }

      // Blink animation
      if (state === 'SLEEPING') {
        blink = 1.0;
      } else if (state === 'THINKING') {
        blink = 0.15; // slightly narrowed eyes in concentration
      } else {
        if (time > nextBlinkTime) {
          blink = Math.sin((time - nextBlinkTime) * 0.4);
          if (blink < 0) {
            blink = 0;
            nextBlinkTime = time + 140 + Math.floor(Math.random() * 200);
          }
        }
      }

      // Breathing Sway & Posture
      const breathPhase = time * (state === 'SLEEPING' ? 0.02 : 0.04);
      const breathY = Math.sin(breathPhase) * 6;
      const swayYaw = Math.cos(time * 0.02) * (state === 'THINKING' ? 0.25 : 0.06);
      const swayPitch = Math.sin(time * 0.03) * 0.04 + (state === 'THINKING' ? -0.1 : 0.0);
      
      // Dynamic Speech Nods
      const speechNod = state === 'SPEAKING' ? Math.sin(time * 0.25) * (audioLevel * 0.12) : 0;
      const pitch = swayPitch + speechNod + saccadeY * 0.15;
      const yaw = swayYaw + saccadeX * 0.2;
      const roll = Math.sin(time * 0.015) * 0.02;

      // Jaw and Viseme modulation
      const jawDrop = (viseme.openness * 0.28 + audioLevel * 0.22) * (state === 'SPEAKING' ? 1.0 : 0.0);
      const mouthSpread = viseme.width * (state === 'SPEAKING' ? 0.08 : 0.0);

      // Transform, Project & Lighting
      const scale = Math.min(width, height) * 0.44;
      const projectedNodes: { x: number; y: number; z: number; origZ: number }[] = [];

      for (let i = 0; i < baseMeshNodes.length; i++) {
        let node = { ...baseMeshNodes[i] };

        // Deform mouth & jaw vertices according to speech formant
        if (i >= 9 && i <= 13) {
          // Jaw drop
          node.y += jawDrop * 0.7;
          node.z += jawDrop * 0.2;
        } else if (i === 42 || i === 43) {
          // Lower lip
          node.y += jawDrop * 0.9;
        } else if (i === 40 || i === 41) {
          // Upper lip
          node.y -= jawDrop * 0.2;
        } else if (i === 38) {
          // Left mouth corner
          node.x -= mouthSpread;
        } else if (i === 39) {
          // Right mouth corner
          node.x += mouthSpread;
        }

        // Brow expression deformation
        if (i >= 14 && i <= 19) {
          if (state === 'THINKING') {
            node.y += 0.04; // furrowed brows
          } else if (state === 'LISTENING') {
            node.y -= 0.03; // attentive raised brows
          }
        }

        // Eyelid blink deformation
        if ((i === 21 || i === 25) && blink > 0) {
          node.y += blink * 0.08; // upper eyelid drops
        }
        if ((i === 23 || i === 27) && blink > 0) {
          node.y -= blink * 0.04; // lower eyelid rises
        }

        // 3D Rotation (Euler XYZ)
        // Yaw (Y-axis)
        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        let x1 = node.x * cosY + node.z * sinY;
        let z1 = -node.x * sinY + node.z * cosY;

        // Pitch (X-axis)
        const cosP = Math.cos(pitch);
        const sinP = Math.sin(pitch);
        let y2 = node.y * cosP - z1 * sinP;
        let z2 = node.y * sinP + z1 * cosP;

        // Roll (Z-axis)
        const cosR = Math.cos(roll);
        const sinR = Math.sin(roll);
        let x3 = x1 * cosR - y2 * sinR;
        let y3 = x1 * sinR + y2 * cosR;

        // Perspective Projection
        const fov = 3.2;
        const perspective = fov / (fov + z2);
        const projX = centerX + x3 * scale * perspective;
        const projY = centerY + (y3 * scale + breathY) * perspective;

        projectedNodes.push({ x: projX, y: projY, z: perspective, origZ: z2 });
      }

      // Draw Depth-Glow Halo around head
      const haloGrad = ctx.createRadialGradient(centerX, centerY, scale * 0.2, centerX, centerY, scale * 1.1);
      haloGrad.addColorStop(0, `${accentColor}18`);
      haloGrad.addColorStop(0.7, `${accentColor}08`);
      haloGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY + breathY, scale * 0.9, 0, Math.PI * 2);
      ctx.fill();

      // Render Wireframe Mesh Edges
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      meshEdges.forEach(([startIdx, endIdx]) => {
        const p1 = projectedNodes[startIdx];
        const p2 = projectedNodes[endIdx];

        // Depth cueing & brightness calculation
        const avgZ = (p1.origZ + p2.origZ) / 2;
        const depthAlpha = Math.max(0.12, Math.min(0.9, (avgZ + 0.6) * 0.8));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        // Highlight facial features (eyes, nose, mouth) with sharper lines
        const isFaceCore = (startIdx >= 14 && endIdx >= 14);
        ctx.strokeStyle = `${accentColor}${Math.floor(depthAlpha * (isFaceCore ? 240 : 140)).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = isFaceCore ? 1.4 : 0.9;
        ctx.stroke();
      });

      // Draw Pupils / Gaze Reticles inside Eyes
      if (blink < 0.8) {
        const leftEyeCenter = {
          x: (projectedNodes[20].x + projectedNodes[22].x) / 2 + saccadeX * 12,
          y: (projectedNodes[21].y + projectedNodes[23].y) / 2 + saccadeY * 8,
        };
        const rightEyeCenter = {
          x: (projectedNodes[24].x + projectedNodes[26].x) / 2 + saccadeX * 12,
          y: (projectedNodes[21].y + projectedNodes[23].y) / 2 + saccadeY * 8,
        };

        [leftEyeCenter, rightEyeCenter].forEach(eye => {
          ctx.beginPath();
          ctx.arc(eye.x, eye.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = accentColor;
          ctx.shadowColor = accentColor;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // Draw Geometric Tracking Markers (Mark LIV Signature HUD elements)
      const markerAlpha = 0.4 + Math.sin(time * 0.05) * 0.2;
      ctx.strokeStyle = `${accentColor}${Math.floor(markerAlpha * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 1;

      // Chin tracker
      const chin = projectedNodes[13];
      ctx.strokeRect(chin.x - 4, chin.y - 4, 8, 8);

      // Nose tracking reticle
      const noseTip = projectedNodes[29];
      ctx.beginPath();
      ctx.arc(noseTip.x, noseTip.y, 4, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, viseme, audioLevel, accentColor]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={420}
        height={420}
        className="w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] object-contain"
      />
      {/* HUD status badge positioned underneath avatar */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded bg-[#010f18]/80 border border-[#0d3347] backdrop-blur-sm text-[11px] font-mono tracking-widest uppercase">
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: accentColor }}
        />
        <span className="text-[#8ffcff] font-semibold">{state}</span>
        <span className="text-[#3a8a9a]">|</span>
        <span className="text-[#3a8a9a]">50 FPS FORMANT</span>
      </div>
    </div>
  );
};
