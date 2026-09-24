import React, { useEffect, useRef } from 'react';

interface HelmetHeroProps {
  isSpeaking: boolean;
  onTestSpeech: () => void;
  onQuickPhrase: (phrase: string) => void;
}

export const HelmetHero: React.FC<HelmetHeroProps> = ({
  isSpeaking,
  onTestSpeech,
  onQuickPhrase,
}) => {
  const anchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let targetRoll = 0;
    let currentRoll = 0;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = anchor.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      targetRotateX = -(deltaY * 11);
      targetRotateY = deltaX * 14;
      targetRoll = deltaX * 3.5;
    };

    const handleMouseLeave = () => {
      targetRotateX = 0;
      targetRotateY = 0;
      targetRoll = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const renderHelmetParallax = () => {
      const ease = 0.082;
      currentRotateX += (targetRotateX - currentRotateX) * ease;
      currentRotateY += (targetRotateY - currentRotateY) * ease;
      currentRoll += (targetRoll - currentRoll) * ease;

      if (anchor) {
        anchor.style.transform = `rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) rotateZ(${currentRoll.toFixed(2)}deg)`;
      }
      animId = requestAnimationFrame(renderHelmetParallax);
    };

    renderHelmetParallax();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="lg:col-span-6 flex flex-col gap-3.5" data-purpose="holographic-arc-core">
      <div className="relative bg-[rgba(15,8,12,0.78)] backdrop-blur-md border border-[rgba(230,25,55,0.35)] rounded-lg p-4 hud-glow-lg hud-corner-bracket flex-1 flex flex-col items-center justify-center min-h-[470px] overflow-hidden">
        {/* Tactical Overlay Coordinate Markings */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-[#ffd152]/70 tracking-widest z-20">
          GRID // 34.0259° N, 118.7798° W [MALIBU POINT]
        </div>
        <div className="absolute top-3 right-3 text-[10px] font-mono tracking-widest z-20 flex items-center gap-1.5" id="vocal-synapse-badge">
          <span
            className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-[#ffd152] animate-ping shadow-[0_0_10px_#ffd152]' : 'bg-[#ffd152]/70'}`}
          />
          <span className={isSpeaking ? 'text-[#ffd152] font-bold text-glow tracking-widest' : 'text-[#ffd152]/80 font-semibold'}>
            {isSpeaking ? 'VOCAL SYNAPSE: ACTIVE // TRANSMITTING' : 'VOCAL SYNAPSE: STANDBY'}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 text-[10px] font-mono text-[#ffd152]/70 tracking-widest z-20">
          REACTOR MODEL: MK-VI HYPER-PULSE
        </div>
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#ff2a4b] tracking-widest animate-pulse z-20 font-bold">
          SAFETY LIMITER: BYPASSED
        </div>

        {/* Concentric Arc Reactor Hologram Graphics & Animated Helmet Container */}
        <div
          ref={anchorRef}
          className="relative flex items-center justify-center w-full max-w-[440px] aspect-square my-2 helmet-3d-wrapper"
          id="helmet-3d-anchor"
        >
          {/* Dynamic Rotating Reticle Ring 1: Stark Crimson (Clockwise 20s) */}
          <div className="absolute -inset-6 rounded-full border border-dashed border-[#e61937]/45 anim-reticle-clockwise pointer-events-none shadow-[0_0_15px_rgba(230,25,55,0.25)]" />

          {/* Dynamic Rotating Reticle Ring 2: Stark Gold with Cross-Ticks (Counter-Clockwise 15s) */}
          <div className="absolute -inset-1.5 rounded-full border-2 border-dotted border-[#ffd152]/40 anim-reticle-counter pointer-events-none flex items-center justify-center shadow-[0_0_20px_rgba(255,209,82,0.2)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-1 bg-[#ffd152] shadow-[0_0_8px_#ffd152]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-1 bg-[#ffd152] shadow-[0_0_8px_#ffd152]" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2.5 w-1 bg-[#ffd152] shadow-[0_0_8px_#ffd152]" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2.5 w-1 bg-[#ffd152] shadow-[0_0_8px_#ffd152]" />
          </div>

          {/* Dual-Tone Radial Aura Bloom: Warm Gold and Vibrant Crimson behind Helmet */}
          <div className="absolute inset-2 rounded-full border border-[#ffd152]/25 pointer-events-none anim-pulse" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#e61937]/35 via-[#ffd152]/25 to-[#ff2a4b]/30 rounded-full blur-3xl anim-pulse pointer-events-none" />

          {/* Left Side Equalizer / Neural Frequency Bar Graph */}
          <div className="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 flex items-end space-x-1.5 h-36 pointer-events-none z-10">
            <div className={`w-1.5 bg-gradient-to-t from-transparent via-[#e61937] to-[#ffd152] rounded-full eq-bar-1 shadow-[0_0_6px_#ffd152] ${isSpeaking ? 'speaking-eq' : ''}`} />
            <div className={`w-1.5 bg-gradient-to-t from-transparent via-[#e61937] to-[#ffd152] rounded-full eq-bar-3 shadow-[0_0_6px_#ffd152] ${isSpeaking ? 'speaking-eq' : ''}`} />
            <div className={`w-1.5 bg-gradient-to-t from-transparent via-[#ff2a4b] to-[#ffd152] rounded-full eq-bar-5 shadow-[0_0_6px_#e61937] ${isSpeaking ? 'speaking-eq' : ''}`} />
            <div className={`w-1.5 bg-gradient-to-t from-transparent via-[#e61937] to-[#00f0ff] rounded-full eq-bar-2 shadow-[0_0_6px_#00f0ff] ${isSpeaking ? 'speaking-eq' : ''}`} />
            <div className={`w-1.5 bg-gradient-to-t from-transparent via-[#e61937] to-[#ffd152] rounded-full eq-bar-4 shadow-[0_0_6px_#ffd152] ${isSpeaking ? 'speaking-eq' : ''}`} />
          </div>

          {/* Right Side Equalizer / Neural Frequency Bar Graph */}
          <div className="absolute -right-6 sm:-right-8 top-1/2 -translate-y-1/2 flex items-end space-x-1.5 h-36 pointer-events-none z-10">
            <div className={`w-1.5 bg-gradient-to-t from-transparent via-[#e61937] to-[#ffd152] rounded-full eq-bar-4 shadow-[0_0_6px_#ffd152] ${isSpeaking ? 'speaking-eq' : ''}`} />
            <div className={`w-1.5 bg-gradient-to-t from-transparent via-[#e61937] to-[#00f0ff] rounded-full eq-bar-2 shadow-[0_0_6px_#00f0ff] ${isSpeaking ? 'speaking-eq' : ''}`} />
            <div className={`w-1.5 bg-gradient-to-t from-transparent via-[#ff2a4b] to-[#ffd152] rounded-full eq-bar-6 shadow-[0_0_6px_#e61937] ${isSpeaking ? 'speaking-eq' : ''}`} />
            <div className={`w-1.5 bg-gradient-to-t from-transparent via-[#e61937] to-[#ffd152] rounded-full eq-bar-1 shadow-[0_0_6px_#ffd152] ${isSpeaking ? 'speaking-eq' : ''}`} />
            <div className={`w-1.5 bg-gradient-to-t from-transparent via-[#e61937] to-[#ffd152] rounded-full eq-bar-3 shadow-[0_0_6px_#ffd152] ${isSpeaking ? 'speaking-eq' : ''}`} />
          </div>

          {/* Animated Iron Man Helmet Frame Wrapper (Continuous Float & Alive Bobbing) */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#e61937]/50 bg-[#04070c]/85 hud-glow flex items-center justify-center anim-float-alive" id="helmet-card">
            {/* Iron Man Realistic 3D Metallic Helmet Image Base */}
            <div className="relative w-full h-full flex items-center justify-center p-2">
              <img
                alt="Realistic 3D Metallic Iron Man Helmet HUD Schematic"
                className="w-full max-w-[340px] max-h-[380px] object-contain anim-neon-pulse pointer-events-none select-none relative z-0 transition-transform duration-300"
                id="helmet-image"
                src="https://lh3.googleusercontent.com/aida/AEtjO1UD0pYFlkT64e3QKXglYBHZ6Nj7wlrTkcDwTTNN2ictuVxmzxkus9vmD42_vrAPrMrg0Z6xv0kIGxp-ePFc4KVwHSP6TL509nn4eGlCCwEucio2jZB8-dxKSefhRIURSAymNH_LDLvAk6GnObaTaJSd8h-eg44AFC05jKjmMAjH70lVrX0ytZlOljydj6Zl2AguBD2mnmYAQngy0dOHwAUkJ0jJ0yhgBdz1076dAvHBTZURnpqDZx3-8zu8"
              />

              {/* ENHANCED DYNAMIC LIVING OCULAR VISOR LAYER */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-15">
                <div className="w-full max-w-[340px] max-h-[380px] h-full relative flex items-center justify-center">
                  <svg
                    className={`absolute top-[37%] left-[32%] w-[36%] h-[8%] overflow-visible ${isSpeaking ? 'speaking-eye-flare' : ''}`}
                    viewBox="0 0 100 30"
                  >
                    <defs>
                      <filter height="200%" id="eye-glow-bloom" width="200%" x="-50%" y="-50%">
                        <feGaussianBlur result="blur1" stdDeviation="1.6" />
                        <feGaussianBlur result="blur2" stdDeviation="3.8" />
                        <feMerge>
                          <feMergeNode in="blur2" />
                          <feMergeNode in="blur1" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <radialGradient cx="50%" cy="50%" id="pupil-energy-grad" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                        <stop offset="40%" stopColor="#7bf7ff" stopOpacity="0.95" />
                        <stop offset="85%" stopColor="#00f0ff" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#00b4d8" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Left Optic Visor Aperture */}
                    <g className="left-optic">
                      <polygon fill="#00f0ff" filter="url(#eye-glow-bloom)" opacity="0.4" points="4,11 38,15 39,20 18,22 3,14" />
                      <polygon fill="#e0f7ff" opacity="0.85" points="6,12 36,15.5 37,18.5 17,20.5 5,14" />
                      <g className="anim-eye-saccade" style={{ transformOrigin: '20px 16px' }}>
                        <circle cx="21" cy="16.5" fill="url(#pupil-energy-grad)" filter="url(#eye-glow-bloom)" r="3.2" />
                        <ellipse cx="21.5" cy="16" fill="#ffffff" rx="1.4" ry="1.8" />
                      </g>
                    </g>

                    {/* Right Optic Visor Aperture */}
                    <g className="right-optic">
                      <polygon fill="#00f0ff" filter="url(#eye-glow-bloom)" opacity="0.4" points="96,11 62,15 61,20 82,22 97,14" />
                      <polygon fill="#e0f7ff" opacity="0.85" points="94,12 64,15.5 63,18.5 83,20.5 95,14" />
                      <g className="anim-eye-saccade" style={{ transformOrigin: '80px 16px' }}>
                        <circle cx="79" cy="16.5" fill="url(#pupil-energy-grad)" filter="url(#eye-glow-bloom)" r="3.2" />
                        <ellipse cx="78.5" cy="16" fill="#ffffff" rx="1.4" ry="1.8" />
                      </g>
                    </g>
                  </svg>
                </div>
              </div>

              {/* PRECISE SYNCHRONIZED ARTICULATING JAW / MOUTH HOLOGRAPHIC OVERLAY */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
                <div className="w-full max-w-[340px] max-h-[380px] h-full relative flex items-center justify-center">
                  <svg
                    className={`absolute top-[62%] left-[34%] w-[32%] h-[24%] transition-transform duration-75 origin-top ${isSpeaking ? 'mouth-speaking' : ''}`}
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 160 120"
                  >
                    <defs>
                      <filter height="150%" id="jaw-neon-glow" width="150%" x="-25%" y="-25%">
                        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="2.2" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <radialGradient cx="50%" cy="50%" id="vocalCoreGlow" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                        <stop offset="35%" stopColor="#00f0ff" stopOpacity="0.8" />
                        <stop offset="70%" stopColor="#ffd152" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#e61937" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Inner Illuminated Vocal Resonance Diaphragm */}
                    <g
                      className={`transition-opacity duration-150 ${isSpeaking ? 'vocal-core-active' : ''}`}
                      opacity={isSpeaking ? '1' : '0.35'}
                    >
                      <ellipse cx="80" cy="46" fill="url(#vocalCoreGlow)" filter="url(#jaw-neon-glow)" rx="14" ry="7" />
                      <ellipse cx="80" cy="46" fill="#ffffff" rx="5" ry="2.5" />
                    </g>

                    {/* Articulating Mouth / Faceplate Acoustic Grid */}
                    <g fill="none" filter="url(#jaw-neon-glow)" stroke="#ffd152" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 30,15 L 60,35 L 100,35 L 130,15" strokeOpacity="0.95" strokeWidth="2.5" />
                      <path d="M 60,35 L 80,44 L 100,35" stroke="#00f0ff" strokeOpacity="0.95" strokeWidth="2.8" />
                      <line strokeOpacity="0.85" strokeWidth="2" x1="72" x2="72" y1="38" y2="47" />
                      <line strokeOpacity="0.95" strokeWidth="2.4" x1="80" x2="80" y1="39" y2="50" />
                      <line strokeOpacity="0.85" strokeWidth="2" x1="88" x2="88" y1="38" y2="47" />
                      <polygon
                        fill="rgba(255, 209, 82, 0.08)"
                        points="52,48 108,48 116,74 98,98 62,98 44,74"
                        stroke="#ffd152"
                        strokeWidth="2.2"
                      />
                      <path d="M 62,98 L 74,109 L 86,109 L 98,98" stroke="#e61937" strokeOpacity="0.9" strokeWidth="2" />
                      <path d="M 64,62 L 80,72 L 96,62" stroke="#00f0ff" strokeOpacity="0.85" strokeWidth="2" />
                      <line strokeOpacity="0.75" strokeWidth="1.8" x1="80" x2="80" y1="72" y2="92" />
                      <path d="M 22,25 L 38,58 L 44,74" stroke="#e61937" strokeOpacity="0.8" strokeWidth="2" />
                      <path d="M 138,25 L 122,58 L 116,74" stroke="#e61937" strokeOpacity="0.8" strokeWidth="2" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* Continuous Holographic Laser Scanline (Cyan Arc Nanotech Beam) */}
            <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent anim-scan-laser-sweep pointer-events-none shadow-[0_0_15px_#00f0ff] z-10">
              <div className="w-full h-6 -translate-y-2 bg-gradient-to-b from-[#00f0ff]/25 to-transparent pointer-events-none" />
            </div>

            {/* HUD Overlay Corner Tags */}
            <div className="absolute top-2.5 left-3 font-mono text-[9px] text-[#ffd152] tracking-widest bg-black/80 px-2 py-0.5 rounded border border-[#e61937]/60 z-10 shadow-[0_0_8px_rgba(230,25,55,0.35)]">
              MK-LXXXV HELMET SCHEMATIC // TARGET LOCK SYNCHRONIZED
            </div>
            <div className="absolute bottom-2.5 right-3 font-mono text-[9px] text-[#ffd152] tracking-widest bg-black/80 px-2 py-0.5 rounded border border-[#e61937]/60 flex items-center gap-1.5 z-10 shadow-[0_0_8px_rgba(230,25,55,0.35)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
              OPTICAL FEED: ACTIVE
            </div>
          </div>
        </div>

        {/* Central HUD Sub-Control Banner & Interactive Voice Test Strip */}
        <div className="mt-3.5 w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 px-2">
          <span className="px-3 py-1 rounded border border-[rgba(230,25,55,0.35)] bg-black/70 font-mono text-xs tracking-widest text-[#ffd152] shadow-[0_0_10px_rgba(230,25,55,0.2)] truncate max-w-full sm:max-w-[340px] md:max-w-none">
            &lt;&lt; J.A.R.V.I.S. TACTICAL HUD: ACTIVE // LIVING AI AVATAR LINKED &gt;&gt;
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onTestSpeech}
              className="px-2.5 py-1 text-[11px] font-mono uppercase bg-[#00f0ff]/20 hover:bg-[#00f0ff] hover:text-black border border-[#00f0ff]/70 rounded text-[#00f0ff] transition-all shadow-[0_0_10px_rgba(0,240,255,0.3)] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
              <span>TEST LIVE SPEECH</span>
            </button>
            <button
              onClick={() => onQuickPhrase('Power levels at 400 percent capacity, Sir. Ready to fire.')}
              className="px-2.5 py-1 text-[11px] font-mono uppercase bg-[#ffd152]/15 hover:bg-[#ffd152] hover:text-black border border-[#ffd152]/70 rounded text-[#ffd152] transition-all shadow-[0_0_8px_rgba(255,209,82,0.3)] font-semibold cursor-pointer"
            >
              Quick Line: 400% Capacity
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
