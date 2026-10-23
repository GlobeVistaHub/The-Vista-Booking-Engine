import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Img, staticFile, Sequence, Audio, random, Easing, interpolateColors } from 'remotion';
import { NewsChyron } from '../Episode3/TheHook';

const FPS = 30;
export const AUDIO1_DURATION = 10 * FPS; // 300 frames
export const AUDIO2_DURATION = 11 * FPS; // 330 frames

// ── SVG TEXTURES ──
const CircuitPattern: React.FC<{ isRed?: boolean }> = ({ isRed }) => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8, position: 'absolute', inset: 0 }}>
    <defs>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke={isRed ? "rgba(255, 0, 85, 0.4)" : "rgba(0, 229, 204, 0.3)"} strokeWidth="2" />
        <path d="M 60 60 L 0 60 L 0 0" fill="none" stroke={isRed ? "rgba(255, 0, 85, 0.1)" : "rgba(0, 229, 204, 0.1)"} strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
    {/* Geometric data tracks */}
    {[...Array(8)].map((_, i) => (
      <React.Fragment key={i}>
        <path d={`M ${50 + i * 60} 50 L ${120 + i * 40} 50 L ${160 + i * 50} 100 L ${600} ${100 + i * 40}`} fill="none" stroke={isRed ? "#FF0055" : "#00E5CC"} strokeWidth="4" opacity={0.8} />
        <circle cx={50 + i * 60} cy="50" r="8" fill={isRed ? "#FF3333" : "#FFD700"} />
      </React.Fragment>
    ))}
  </svg>
);

// ── COMPONENT: GLITCH TRANSITION ENGINE ──
const GlitchTransitionEngine: React.FC<{ progress: number }> = ({ progress }) => {
  if (progress <= 0 || progress >= 1) return null;

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 85 }}>
      {/* Glitch Rings / Waves */}
      <div style={{ position: 'absolute', width: 1000, height: 1000, border: '4px solid rgba(0, 229, 204, 0.6)', borderRadius: '50%', opacity: Math.sin(progress * Math.PI) * 0.8, transform: `scale(${progress * 2.5})`, filter: 'blur(4px)', mixBlendMode: 'screen' }} />
      <div style={{ position: 'absolute', width: 1200, height: 1200, border: '2px solid rgba(255, 0, 85, 0.5)', borderRadius: '50%', opacity: Math.sin(progress * Math.PI) * 0.5, transform: `scale(${progress * 1.8})`, filter: 'blur(8px)', mixBlendMode: 'screen' }} />

      {/* Mathematical Data Burst */}
      {[...Array(40)].map((_, i) => {
        const angle = random(`ang-${i}`) * Math.PI * 2;
        const dist = interpolate(progress, [0, 1], [0, 300 + random(`dst-${i}`) * 800]);
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        const symbols = ['∑', '∫', '∇', '∂', '∞', '01', '{x}', 'λ', 'μ', '≈', 'π', 'Ω'];
        const symbol = symbols[Math.floor(random(`sym-${i}`) * symbols.length)];
        return (
          <div key={`m-${i}`} style={{
            position: 'absolute',
            color: random(`c-${i}`) > 0.8 ? '#FF0055' : '#00E5CC',
            fontFamily: 'monospace',
            fontSize: 40 + random(`fz-${i}`) * 80,
            fontWeight: 900,
            transform: `translate(${x}px, ${y}px) rotate(${progress * 360 * (random(`r-${i}`) > 0.5 ? 1 : -1)}deg) scale(${interpolate(progress, [0, 0.5, 1], [0.5, 1.5, 0])})`,
            opacity: interpolate(progress, [0, 0.5, 1], [0, 1, 0]),
            textShadow: '0 0 25px currentColor'
          }}>
            {symbol}
          </div>
        )
      })}


      {/* Geometric 3D Wireframes */}
      {[...Array(6)].map((_, i) => (
        <div key={`geo-${i}`} style={{
          position: 'absolute',
          width: 150 + random(`gw-${i}`) * 400,
          height: 150 + random(`gh-${i}`) * 400,
          border: `2px solid ${random(`gc-${i}`) > 0.7 ? '#FF0055' : '#00E5CC'}`,
          transform: `rotateX(${progress * 720 * random(`rx-${i}`)}deg) rotateY(${progress * 720 * random(`ry-${i}`)}deg) rotateZ(${progress * 360}deg) scale(${Math.sin(progress * Math.PI) * (1.5 + random(`s-${i}`) * 2)})`,
          opacity: Math.sin(progress * Math.PI) * 0.6,
          transformStyle: 'preserve-3d',
          mixBlendMode: 'screen'
        }} />
      ))}
    </AbsoluteFill>
  );
};

// ── COMPONENT: SOFTWARE UI ──
const SoftwareUI: React.FC<{ foldProgress: number, frame: number }> = ({ foldProgress, frame }) => {
  // Folds from a tall rectangle (UI) into a flat wide line, then into a square (Hardware), then completely vanishes!
  // Accelerated the time of the small rectangle to zero (vanishes by 0.7 instead of 1.0)
  const scaleY = interpolate(foldProgress, [0, 0.5, 0.6, 0.7], [1, 0.05, 0.05, 0], { extrapolateRight: 'clamp' });
  const scaleX = interpolate(foldProgress, [0.5, 0.6, 0.7], [1, 0.3, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // Fade out completely between 0.5 and 0.7 to perfectly crossfade with the growing chip
  const opacity = interpolate(foldProgress, [0, 0.1, 0.5, 0.7], [0.9, 1, 1, 0], { extrapolateRight: 'clamp' });

  // Terminal scroll effect
  const scrollY = (frame * 3) % 200;

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', transformStyle: 'preserve-3d' }}>
      <div style={{
        width: 1400, height: 700,
        background: 'linear-gradient(135deg, rgba(0, 30, 40, 0.4) 0%, rgba(0, 10, 15, 0.7) 100%)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(0, 229, 204, 0.2)',
        boxShadow: '0 0 40px rgba(0, 229, 204, 0.1), inset 0 0 60px rgba(0, 229, 204, 0.1)',
        transform: `translateY(-50px) scaleX(${scaleX}) scaleY(${scaleY})`,
        display: 'flex', flexDirection: 'column',
        opacity: opacity,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* HUD Corner Reticles */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTop: '3px solid #00E5CC', borderLeft: '3px solid #00E5CC' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTop: '3px solid #00E5CC', borderRight: '3px solid #00E5CC' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottom: '3px solid #00E5CC', borderLeft: '3px solid #00E5CC' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottom: '3px solid #00E5CC', borderRight: '3px solid #00E5CC' }} />

        {/* HUD Header */}
        <div style={{
          width: '100%', padding: '25px 40px', borderBottom: '1px solid rgba(0,229,204,0.3)',
          display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: 32, letterSpacing: 4
        }}>
          <span style={{ color: '#FFD700', textShadow: '0 0 20px rgba(255, 215, 0, 1), 0 0 40px rgba(255, 215, 0, 0.6)', fontWeight: '900' }}>SYS.KERNEL_PANIC_PREDICTION // V5.3</span>
          <span style={{ color: '#FF0055', textShadow: '0 0 20px rgba(255, 0, 85, 1), 0 0 40px rgba(255, 0, 85, 0.6)', fontWeight: '900' }}>[OVERLOAD_DETECTED]</span>
        </div>

        {/* Scrolling Terminal Code */}
        <div style={{ position: 'relative', flex: 1, padding: '30px 50px', fontFamily: "'Fira Code', monospace", fontSize: 28, lineHeight: 1.8, color: 'rgba(0, 229, 204, 0.8)', overflow: 'hidden' }}>
          <div style={{ transform: `translateY(${-scrollY}px)` }}>
            {[...Array(25)].map((_, i) => {
              const isError = random(`c-${i}`) > 0.85;
              return (
                <div key={i} style={{ display: 'flex', gap: 30, opacity: 0.7 + random(`o-${i}`) * 0.3 }}>
                  <span style={{ opacity: 0.85, width: 120, color: '#00E5CC', textShadow: '0 0 15px rgba(0,229,204,0.8)' }}>
                    {`0x${(8000 + i * 16).toString(16).toUpperCase()}`}
                  </span>
                  <span style={{ 
                    color: isError ? '#FF0055' : '#00E5CC', 
                    fontWeight: isError ? '900' : 'bold',
                    textShadow: isError ? '0 0 20px rgba(255, 0, 85, 1)' : '0 0 20px rgba(0, 229, 204, 1)'
                  }}>
                    {random(`t-${i}`) > 0.7 ? 'sys.allocate_tensor(grid_limit);' : (random(`t-${i}`) > 0.4 ? 'await network.balance_load();' : 'WARNING: GRID_CAPACITY_EXCEEDED')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scanline Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0, 229, 204, 0.03) 50%)', backgroundSize: '100% 4px', pointerEvents: 'none' }} />
      </div>
    </AbsoluteFill>
  );
};

// ── COMPONENT: GOLDEN CORE 3D (RESTORED ORIGINAL) ──
const GoldenCore3D: React.FC<{ progress: number, scale?: number, translateY?: number, opacity?: number, additionalSpin?: number }> = ({ progress, scale = 1, translateY = 0, opacity = 1, additionalSpin = 0 }) => {
  const size = 600;
  const depth = 40;

  // Rotating the entire core 360 degrees based on progress (0 to 1), plus the violent attack spin
  const rotY = interpolate(progress, [0, 1], [0, 180]) + additionalSpin;
  const rotX = Math.sin(progress * Math.PI) * 20 + 10;

  return (
    <AbsoluteFill style={{ transformStyle: 'preserve-3d', pointerEvents: 'none' }}>
      <div style={{
        width: size, height: size,
        position: 'absolute', left: '50%', top: '50%', marginLeft: -size / 2, marginTop: -size / 2,
        transformStyle: 'preserve-3d',
        transform: `translateY(${translateY}px) scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        opacity: opacity
      }}>
        {/* BOTTOM FACE */}
        <div style={{
          position: 'absolute', width: size, height: size, transform: `translateZ(${-depth / 2}px)`,
          backgroundColor: '#0a0a0a', border: '2px solid rgba(0, 229, 204, 0.4)',
          transformStyle: 'preserve-3d', overflow: 'hidden'
        }}><CircuitPattern /></div>

        {/* TOP FACE */}
        <div style={{
          position: 'absolute', width: size, height: size, transform: `translateZ(${depth / 2}px)`,
          backgroundColor: 'rgba(5, 10, 15, 0.95)', border: '4px solid #00E5CC',
          boxShadow: 'inset 0 0 100px rgba(0, 229, 204, 0.4), 0 0 80px rgba(255, 215, 0, 0.3)',
          transformStyle: 'preserve-3d', overflow: 'hidden'
        }}>
          <CircuitPattern />
          <div style={{
            position: 'absolute', inset: 0, transform: 'translateZ(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            textShadow: '0 0 15px rgba(0, 229, 204, 1), 0 0 30px rgba(255, 215, 0, 0.8)'
          }}>
            <h1 style={{ fontFamily: "'Cairo', sans-serif", fontSize: '45px', fontWeight: 900, color: '#FFF', margin: 0, letterSpacing: '4px' }}>NEURAL CORE</h1>
            <h2 style={{ fontFamily: "'Cairo', sans-serif", fontSize: '20px', fontWeight: 800, color: '#FFD700', margin: 0, letterSpacing: '6px' }}>V5.3 ARCHITECTURE</h2>
          </div>
        </div>

        {/* EDGES */}
        <div style={{ position: 'absolute', width: size, height: depth, top: size / 2 - depth / 2, left: 0, transform: `rotateX(90deg) translateZ(${size / 2}px)`, backgroundImage: 'repeating-linear-gradient(90deg, #FFD700 0px, #FFD700 6px, transparent 6px, transparent 12px)', backgroundColor: '#111', borderTop: '2px solid #00E5CC', borderBottom: '2px solid #00E5CC' }} />
        <div style={{ position: 'absolute', width: size, height: depth, top: size / 2 - depth / 2, left: 0, transform: `rotateX(-90deg) translateZ(${size / 2}px)`, backgroundImage: 'repeating-linear-gradient(90deg, #FFD700 0px, #FFD700 6px, transparent 6px, transparent 12px)', backgroundColor: '#111', borderTop: '2px solid #00E5CC', borderBottom: '2px solid #00E5CC' }} />
        <div style={{ position: 'absolute', width: depth, height: size, top: 0, left: size / 2 - depth / 2, transform: `rotateY(-90deg) translateZ(${size / 2}px)`, backgroundImage: 'repeating-linear-gradient(0deg, #FFD700 0px, #FFD700 6px, transparent 6px, transparent 12px)', backgroundColor: '#111', borderLeft: '2px solid #00E5CC', borderRight: '2px solid #00E5CC' }} />
        <div style={{ position: 'absolute', width: depth, height: size, top: 0, left: size / 2 - depth / 2, transform: `rotateY(90deg) translateZ(${size / 2}px)`, backgroundImage: 'repeating-linear-gradient(0deg, #FFD700 0px, #FFD700 6px, transparent 6px, transparent 12px)', backgroundColor: '#111', borderLeft: '2px solid #00E5CC', borderRight: '2px solid #00E5CC' }} />
      </div>

      {/* Optical Lens Flares */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translateY(${translateY}px) scale(${scale})`, pointerEvents: 'none', opacity }}>
        <div style={{ position: 'absolute', left: -400, top: -400, width: 800, height: 800, backgroundImage: 'radial-gradient(circle, rgba(0, 229, 204, 0.4) 0%, transparent 60%)', mixBlendMode: 'screen' }} />
        <div style={{ position: 'absolute', left: -300, top: -400, width: 600, height: 600, backgroundImage: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 60%)', mixBlendMode: 'color-dodge' }} />
      </div>
    </AbsoluteFill>
  );
};


// ── COMPONENT: GLASSMORPHISM STOCK MARKET ──
const GlassmorphismStockMarket: React.FC<{ frame: number }> = ({ frame }) => {
  const WORLD_START = 210;
  const POP_FRAME = 295; // 02:06.21
  
  // Paper Cutout Engine Entrance
  const entranceFrame = Math.max(0, frame - WORLD_START);
  const steppedEntrance = Math.floor(entranceFrame / 3) * 3;
  const entranceSpring = spring({ frame: steppedEntrance, fps: 30, config: { damping: 14, stiffness: 150 } });
  
  // Entering from the left with massive depth, collapsing in from a 3D perspective angle and resting back perfectly flat (0)
  const entranceX = interpolate(steppedEntrance, [0, 30], [-1500, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const entranceZ = interpolate(entranceSpring, [0, 1], [-3000, 0]); 
  const entranceRotY = interpolate(entranceSpring, [0, 1], [45, 0]); 

  const popSpring = spring({ frame: Math.max(0, frame - POP_FRAME), fps: 30, config: { damping: 20, stiffness: 35 } });

  return (
    <AbsoluteFill style={{ 
      transformStyle: 'preserve-3d', display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: `perspective(1200px) translateZ(${entranceZ}px) translateX(${entranceX}px) rotateY(${entranceRotY}deg)`,
      opacity: interpolate(steppedEntrance, [0, 9], [0, 1], { extrapolateRight: 'clamp' })
    }}>

      {/* ── MASSIVE CENTER GLASS PANEL (MAIN CRASH CHART) ── */}
      <div style={{
        position: 'absolute', width: 1200, height: 700,
        backgroundColor: 'rgba(0, 15, 25, 0.45)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0, 229, 204, 0.3)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 0 80px rgba(0, 229, 204, 0.1)',
        borderRadius: 24, padding: 40,
        transformStyle: 'preserve-3d',
        // Floating ambient motion before the pop, then violently falls down and rotates back
        transform: `
          translateZ(${-500 + Math.sin(frame * 0.02) * 50}px) 
          translateY(${interpolate(popSpring, [0, 1], [Math.sin(frame * 0.03) * 20, 1500])}px)
          rotateX(${interpolate(popSpring, [0, 1], [0, -60])}deg)
          rotateZ(${interpolate(popSpring, [0, 1], [0, -15])}deg)
        `,
        opacity: interpolate(popSpring, [0.5, 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      }}>
        {/* Header (Translated & Flashing) */}
        {(() => {
          const overloadProg = interpolate(frame, [200, POP_FRAME], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          // The warning flashes faster and faster as overloadProg increases
          const flashRate = interpolate(overloadProg, [0, 1], [0.1, 0.8]);
          const warningOpacity = Math.sin(frame * flashRate * Math.PI) > 0 ? 1 : 0.3;
          
          // Warning text gradually turns from Gold to Toxic Red
          const warningColor = interpolateColors(frame, [200, 250, POP_FRAME], ['#FFD700', '#FF8C00', '#FF0055']);

          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00E5CC', fontFamily: "'Cairo', sans-serif", fontSize: 44, fontWeight: 900, borderBottom: '3px solid rgba(0, 229, 204, 0.5)', paddingBottom: 25, marginBottom: 25, direction: 'rtl' }}>
              <span style={{ textShadow: '0 0 20px rgba(0, 229, 204, 1), 0 0 40px rgba(0, 229, 204, 0.6)' }}>سعة شبكة الطاقة العالمية</span>
              <span style={{ color: warningColor, textShadow: `0 0 25px ${warningColor}, 0 0 50px ${warningColor}`, opacity: warningOpacity }}>[تحذير: ضغط أقصى]</span>
            </div>
          );
        })()}

        {/* SVG Electrical Surge Chart (Oscilloscope) */}
        <svg width="100%" height="80%" viewBox="0 0 1000 400" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
          {/* Grid lines */}
          {[100, 200, 300].map(y => <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(0,229,204,0.1)" strokeWidth="2" strokeDasharray="10 10" />)}

          {/* Oscilloscope AC Wave - Exponential Overload */}
          {(() => {
            // Calculate exponential overload as we approach the crash (frame 350)
            const overloadProg = interpolate(frame, [200, POP_FRAME], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.poly(3)) });
            
            // Frequency starts slow (0.05) and goes crazy fast (1.5)
            const freq = interpolate(overloadProg, [0, 1], [0.05, 1.5]);
            // Amplitude starts small (20px) and gets violently large (300px)
            const amp = interpolate(overloadProg, [0, 1], [20, 300]);
            
            // Post-crash physics
            const crashDrop = interpolate(popSpring, [0, 1], [0, 800]);

            // Gradual color transition: Cyan -> Gold -> Red
            const waveColor = interpolateColors(frame, [200, 250, POP_FRAME], ['#00E5CC', '#FFD700', '#FF0055']);

            return (
              <>
                <path d={`
                  M 0 200 
                  L 100 ${200 + Math.sin(frame * freq) * amp} 
                  L 200 ${200 + Math.cos(frame * freq * 1.1) * (amp * 1.1)}
                  L 300 ${200 + Math.sin(frame * freq * 1.2) * (amp * 1.2)}
                  L 450 ${200 + Math.cos(frame * freq * 1.3) * (amp * 1.3)}
                  L 550 ${200 + Math.sin(frame * freq * 1.4) * (amp * 1.4)}
                  L 650 ${200 + Math.cos(frame * freq * 1.5) * (amp * 1.5) + (crashDrop > 0 ? -150 * popSpring : 0)}
                  L 750 ${200 + Math.sin(frame * freq * 1.6) * (amp * 1.6) + (crashDrop > 0 ? -400 * popSpring : 0)}
                  L 850 ${200 + Math.cos(frame * freq * 1.7) * (amp * 1.7) + (crashDrop > 0 ? 500 * popSpring : 0)}
                  L 1000 ${200 + Math.sin(frame * freq * 1.8) * (amp * 1.8) + crashDrop}
                `} fill="none" stroke={waveColor} strokeWidth="12" style={{ filter: `drop-shadow(0 0 20px ${waveColor})` }} />
                
                {/* High Voltage Arc Points following the wave */}
                <circle cx="550" cy={200 + Math.sin(frame * freq * 1.4) * (amp * 1.4)} r="10" fill={waveColor} style={{ filter: 'blur(2px)' }} />
                <circle cx="750" cy={200 + Math.sin(frame * freq * 1.6) * (amp * 1.6) + (crashDrop > 0 ? -400 * popSpring : 0)} r="16" fill={waveColor} style={{ filter: 'blur(4px)' }} />
              </>
            );
          })()}

          {/* Grid Load Capacity Bars (Equalizers) */}
          {[...Array(30)].map((_, i) => {
            // Bars fill up higher and become more erratic as overloadProg approaches 1
            const overloadProg = interpolate(frame, [200, POP_FRAME], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const baseHeight = 20 + (overloadProg * 150); 
            const erraticJump = overloadProg * (random(i + frame) * 100);
            const barHeight = Math.min(300, baseHeight + erraticJump);
            const isFailing = frame >= POP_FRAME && i > 10;
            return (
              <rect key={i} x={i * 34} y={380 - barHeight} width="20" height={barHeight} fill={isFailing ? "rgba(255, 0, 85, 0.6)" : "rgba(255, 215, 0, 0.4)"} />
            );
          })}
        </svg>
      </div>

      {/* ── LEFT FLOATING PANEL (SECONDARY DATA) ── */}
      <div style={{
        position: 'absolute', width: 600, height: 800, left: -200, top: 100,
        backgroundColor: 'rgba(0, 15, 25, 0.3)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 229, 204, 0.15)', borderRadius: 16,
        transformStyle: 'preserve-3d',
        transform: `
          translateZ(${-1200 + Math.cos(frame * 0.02) * 40}px) 
          translateY(${interpolate(popSpring, [0, 1], [0, 2000], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)
          rotateY(25deg)
          rotateZ(${interpolate(popSpring, [0, 1], [0, 20], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}deg)
        `,
        opacity: interpolate(popSpring, [0.5, 1], [0.8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        padding: 30, display: 'flex', flexDirection: 'column', gap: 20
      }}>
        {[...Array(10)].map((_, i) => (
          <div key={i} style={{ width: '100%', height: 40, backgroundColor: random(i) > 0.8 ? 'rgba(255,0,85,0.2)' : 'rgba(0,229,204,0.1)', borderLeft: `4px solid ${random(i) > 0.8 ? '#FF0055' : '#00E5CC'}`, display: 'flex', alignItems: 'center', paddingLeft: 15, color: '#FFF', fontFamily: 'monospace' }}>
            NODE_{i} // STATUS: {random(i) > 0.8 ? 'FAIL' : 'OK'}
          </div>
        ))}
      </div>



    </AbsoluteFill>
  );
};

// ── COMPONENT: 3D DATA PILLAR ──
const DataPillar: React.FC<{ index: number, frame: number }> = ({ index, frame }) => {
  // Generate deterministic architectural layout based on the index
  const width = 100 + random(`w-${index}`) * 150;
  const depth = width;
  const height = 1500 + random(`h-${index}`) * 2000;
  
  // Scatter them wide on the X axis, and deep into the Z axis (Trench)
  const xPos = (random(`x-${index}`) - 0.5) * 4000; 
  const zPos = -1000 - (random(`z-${index}`) * 5000); 

  const POP_FRAME = 295;
  const isCrashed = frame >= POP_FRAME;
  
  // Grid Overload Colors (Cyan -> Gold Warning -> Red Crash)
  const color = isCrashed ? '#FF0055' : (frame > 250 ? '#FFD700' : '#00E5CC');
  const glow = isCrashed ? 'rgba(255, 0, 85, 0.6)' : (frame > 250 ? 'rgba(255, 215, 0, 0.5)' : 'rgba(0, 229, 204, 0.3)');
  const bg = isCrashed ? 'rgba(255, 0, 85, 0.15)' : (frame > 250 ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 229, 204, 0.15)');

  // ── DYNAMIC ARCHITECTURAL EXTRUSION ──
  // Pillars shoot out of the ground like assembling architecture as the camera dives in
  const DIVE_START = 180;
  const popDelay = random(`delay-${index}`) * 50; // Random stagger up to 50 frames
  
  // Use a heavy spring so they slam into place
  const heightSpring = spring({ 
    frame: Math.max(0, frame - DIVE_START - popDelay), 
    fps: 30, 
    config: { damping: 16, stiffness: 100 } 
  });
  
  // The height physically grows
  const currentHeight = Math.max(1, height * heightSpring);
  
  // To make it extrude from the floor UPWARDS, we must shift it down by half the missing height
  const extrudeY = 500 + (height / 2) - (currentHeight / 2);

  // Power Surge electrical beam shooting upwards
  const powerSurgeY = ((frame * 25) + (index * 200)) % (height + 500) - 500;

  const wallStyle: React.CSSProperties = {
    position: 'absolute', width: '100%', height: '100%', 
    backgroundColor: bg, 
    border: `2px solid ${color}`, 
    boxShadow: `inset 0 0 60px ${glow}`,
    // Highly sophisticated CSS circuitboard/server rack tiling pattern
    backgroundImage: `
      radial-gradient(circle at 50% 50%, ${color} 2px, transparent 3px),
      linear-gradient(90deg, transparent 95%, ${color} 95%),
      linear-gradient(0deg, transparent 95%, ${color} 95%),
      repeating-linear-gradient(0deg, transparent 0, transparent 30px, rgba(0,0,0,0.4) 30px, rgba(0,0,0,0.4) 60px)
    `,
    backgroundSize: '60px 60px, 60px 60px, 60px 60px, 100% 60px',
    backgroundPosition: 'center',
    overflow: 'hidden'
  };

  const surgeStyle: React.CSSProperties = {
    position: 'absolute', width: '100%', height: 400, left: 0,
    transform: `translateY(${currentHeight - powerSurgeY}px)`,
    background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
    opacity: 0.8, filter: `blur(4px)`
  };

  return (
    <div style={{
      position: 'absolute',
      width: width, height: currentHeight,
      left: '50%', top: '50%', marginLeft: -width/2, marginTop: -currentHeight/2,
      transformStyle: 'preserve-3d',
      transform: `translateX(${xPos}px) translateZ(${zPos}px) translateY(${extrudeY}px)`
    }}>
      {/* FRONT */}
      <div style={{ ...wallStyle, transform: `translateZ(${depth/2}px)` }}>
        <div style={surgeStyle} />
      </div>
      {/* LEFT */}
      <div style={{ ...wallStyle, width: depth, transform: `translateX(${-depth/2}px) rotateY(-90deg)` }}>
        <div style={surgeStyle} />
      </div>
      {/* RIGHT */}
      <div style={{ ...wallStyle, width: depth, transform: `translateX(${width - depth/2}px) rotateY(90deg)` }}>
        <div style={surgeStyle} />
      </div>
      {/* TOP */}
      <div style={{ position: 'absolute', width: width, height: depth, transform: `translateY(${-depth/2}px) rotateX(90deg)`, backgroundColor: color, opacity: 0.8, boxShadow: `0 0 50px ${color}` }} />
    </div>
  );
};

// ── COMPONENT: PREMIUM PANORAMIC MARKET DASHBOARD ──
const PanoramicMarketDashboard: React.FC<{ frame: number }> = ({ frame }) => {
  const START_FRAME = 411; // 02:10.17
  
  const entranceFrame = Math.max(0, frame - START_FRAME);
  const entranceSpring = spring({ frame: entranceFrame, fps: 30, config: { damping: 20, stiffness: 100 } });
  
  const dashboardOpacity = interpolate(entranceFrame, [0, 5], [0, 1], { extrapolateRight: 'clamp' });
  const dashboardScale = interpolate(entranceSpring, [0, 1], [1.1, 1]);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: frame < START_FRAME ? 'none' : 'flex',
      alignItems: 'center', justifyContent: 'center',
      transformStyle: 'preserve-3d', pointerEvents: 'none',
      opacity: dashboardOpacity,
      // Pushed deeper so it wraps behind Mazen completely without overlapping his shoulders, and shifted left to balance his new offset
      transform: `translateZ(-1200px) translateX(-80px) scale(${dashboardScale})`
    }}>
      <div style={{
        width: 3200, height: 1500,
        backgroundColor: 'rgba(10, 12, 16, 0.85)',
        backdropFilter: 'blur(50px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderTop: '4px solid #131722',
        borderRadius: 50,
        boxShadow: '0 60px 150px rgba(0,0,0,0.9)',
        display: 'flex', flexDirection: 'column', padding: 80, gap: 50
      }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 40 }}>
          <h1 style={{ color: '#E0E3EB', fontFamily: "'Inter', sans-serif", fontSize: 55, margin: 0, letterSpacing: '4px' }}>
            GLOBAL_MACRO_TERMINAL <span style={{ color: 'rgba(255,255,255,0.1)' }}>//</span> SYS.OVERLOAD
          </h1>
          <h1 style={{ color: '#F23645', fontFamily: 'monospace', fontSize: 55, margin: 0 }}>
            CRITICAL_FAILURE_DETECTED
          </h1>
        </div>

        {/* 3 COLUMNS */}
        <div style={{ display: 'flex', flex: 1, gap: 80 }}>
          {/* COL 1: MASSIVE CRASH */}
          <div style={{ flex: 1.5, position: 'relative', borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: 40 }}>
            <div style={{ transform: 'translateX(650px)', width: '100%', height: '100%' }}>
            <h2 style={{ color: '#787B86', fontFamily: "'Inter', sans-serif", fontSize: 35, letterSpacing: '2px' }}>AGGREGATE VOLATILITY INDEX</h2>
            <h1 style={{ color: '#F23645', fontFamily: "'Inter', sans-serif", fontSize: 160, fontWeight: 900, margin: '20px 0' }}>
              -{(87.42 + Math.min(10, frame * 0.05)).toFixed(2)}%
            </h1>
             <svg viewBox="0 0 1400 400" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%' }} preserveAspectRatio="none">
               <polygon points="0,100 200,80 400,150 600,100 800,200 1000,150 1200,300 1400,400 1400,400 0,400" fill="url(#termGlow)" opacity={interpolate(entranceFrame, [0, 10], [0, 0.15], { extrapolateRight: 'clamp' })} />
               <path 
                 d="M 0 100 L 200 80 L 400 150 L 600 100 L 800 200 L 1000 150 L 1200 300 L 1400 400" 
                 fill="none" stroke="#F23645" strokeWidth="6" 
                 strokeDasharray="2500" strokeDashoffset={interpolate(entranceFrame, [0, 30], [2500, 0], { extrapolateRight: 'clamp' })}
               />
               <defs><linearGradient id="termGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F23645" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
             </svg>
            </div>
          </div>

          {/* COL 2: ORDER BOOK */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 40, borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: 80 }}>
            <h2 style={{ color: '#787B86', fontFamily: "'Inter', sans-serif", fontSize: 35, letterSpacing: '2px' }}>LIVE LIQUIDATIONS</h2>
            {['NYSE: -4502.1', 'LSE: -1844.9', 'TSE: -3901.4', 'HKG: -2105.8', 'FRA: -1102.1'].map((m, i) => {
               const delay = i * 4;
               const itemEntrance = Math.max(0, entranceFrame - delay);
               const itemSpring = spring({ frame: itemEntrance, fps: 30, config: { damping: 14, stiffness: 120 } });
               const itemOpacity = interpolate(itemEntrance, [0, 5], [0, 1], { extrapolateRight: 'clamp' });
               const itemX = interpolate(itemSpring, [0, 1], [100, 0]);

               const base = parseFloat(m.split(':')[1]);
               const dyn = (base - Math.min(1000, entranceFrame * (i+1) * 0.8)).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
               return (
                 <div key={i} style={{ 
                   display: 'flex', justifyContent: 'space-between', backgroundColor: 'rgba(242,54,69,0.05)', 
                   padding: '35px 40px', borderRadius: 8, border: '1px solid rgba(242,54,69,0.15)',
                   opacity: itemOpacity, transform: `translateX(${itemX}px)` 
                 }}>
                   <span style={{ color: '#E0E3EB', fontFamily: "'Inter', sans-serif", fontSize: 40, fontWeight: 700 }}>{m.split(':')[0]}</span>
                   <span style={{ color: '#F23645', fontFamily: 'monospace', fontSize: 45, fontWeight: 'bold' }}>{dyn}</span>
                 </div>
               );
            })}
          </div>

          {/* COL 3: ALGORITHMIC PREDICTIVE CURVE */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 40, position: 'relative' }}>
            <h2 style={{ color: '#787B86', fontFamily: "'Inter', sans-serif", fontSize: 35, letterSpacing: '2px' }}>ALGORITHMIC TRAJECTORY</h2>
            
            <svg style={{ flex: 1, width: '100%', overflow: 'visible' }} preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="20%" x2="100%" y2="20%" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="10, 10" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
              <line x1="0" y1="80%" x2="100%" y2="80%" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="10, 10" />
              
              {/* Fast Moving Average (Institutional Blue) */}
              <path 
                d={`M ${new Array(35).fill(0).map((_, i) => `${i * 20},${180 + Math.sin((frame * 0.15) + i * 0.4) * 60 + Math.cos((frame * 0.05) + i * 0.1) * 30}`).join(' L ')}`} 
                fill="none" stroke="#2962FF" strokeWidth="4" 
              />
              
              {/* Heavy Predictive Crash Trend (TradingView Red) */}
              <path 
                d={`M ${new Array(35).fill(0).map((_, i) => `${i * 20},${220 + Math.cos((frame * 0.1) + i * 0.3) * 80 - i * 5}`).join(' L ')}`} 
                fill="none" stroke="#F23645" strokeWidth="6" 
              />
              
              {/* Menace Burst Anomaly Bubble */}
              <circle 
                cx={400} 
                cy={180 + Math.sin((frame * 0.15) + 20 * 0.4) * 60 + Math.cos((frame * 0.05) + 20 * 0.1) * 30} 
                r={interpolate(entranceFrame, [0, 90], [8, 20], { extrapolateRight: 'clamp' }) + Math.sin(frame * 0.4) * 2} 
                fill={interpolateColors(entranceFrame, [0, 90], ['#E0E3EB', '#F23645'])} 
                stroke="rgba(242,54,69,0.5)"
                strokeWidth={interpolate(entranceFrame, [0, 90], [0, 8], { extrapolateRight: 'clamp' }) + Math.sin(frame * 0.3) * 4}
              />
            </svg>
            
            {/* Overlay UI elements */}
            <div style={{ position: 'absolute', bottom: 40, left: 0, display: 'flex', gap: 20 }}>
               <div style={{ backgroundColor: 'rgba(41,98,255,0.15)', color: '#2962FF', padding: '12px 20px', borderRadius: 6, fontFamily: 'monospace', fontSize: 24, fontWeight: 'bold' }}>EMA: SHORT</div>
               <div style={{ backgroundColor: 'rgba(242,54,69,0.15)', color: '#F23645', padding: '12px 20px', borderRadius: 6, fontFamily: 'monospace', fontSize: 24, fontWeight: 'bold' }}>MACD: CRITICAL</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── COMPONENT: $500B FINANCIAL CRASH HOLOGRAM ──
const FinancialCrashHologram: React.FC<{ frame: number }> = ({ frame }) => {
  const START_FRAME = 349; // Global time 02:08.15
  const MARKER_FRAME = START_FRAME + 20; // Strike hits after the massive 3D drop settles
  
  const entranceFrame = Math.max(0, frame - START_FRAME);
  const entranceSpring = spring({ frame: entranceFrame, fps: 30, config: { damping: 14, stiffness: 200 } });
  
  // Plummets down from above the lens with a 3D rotateY perspective!
  const hologramScale = interpolate(entranceSpring, [0, 1], [3, 1]);
  const hologramY = interpolate(entranceSpring, [0, 1], [-2000, -200]);
  const hologramRotY = interpolate(entranceSpring, [0, 1], [45, 18]); // Matches the 18-degree HUD perspective

  // RGB Glitch right as the red marker strikes
  const isPopping = frame >= MARKER_FRAME && frame < MARKER_FRAME + 5;
  const rgbGlitch = isPopping ? (frame % 2 === 0 ? 25 : -25) : 0;

  // Fade out exactly when the dashboard arrives to clean up the center
  const dashboardStart = 411;
  const exitOpacity = interpolate(frame, [dashboardStart, dashboardStart + 5], [1, 0], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      position: 'absolute', width: 1920, height: 1080, left: '50%', top: '50%', marginLeft: -960, marginTop: -540,
      transformStyle: 'preserve-3d', display: frame < START_FRAME ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
      opacity: exitOpacity,
      transform: `translateZ(-500px)` // Just behind Mazen
    }}>
      <div style={{
        position: 'absolute',
        // Tucked behind Mazen to his right (compositional balance)
        top: '25%', right: '15%',
        transform: `perspective(1200px) translateY(${hologramY}px) scale(${hologramScale}) rotateY(${hologramRotY}deg) rotateZ(-5deg)`,
        filter: `drop-shadow(30px 30px 40px rgba(0,0,0,0.9))`
      }}>
        <div style={{
          backgroundColor: '#111', padding: '20px 40px',
          border: '4px solid #FF0055', boxShadow: 'inset 0 0 20px rgba(255,0,85,0.4)',
          position: 'relative'
        }}>
          <h1 style={{ 
            color: '#FFF', fontFamily: "'Cairo', sans-serif", fontSize: 110, fontWeight: 900, 
            margin: 0, textShadow: '0 0 20px rgba(255,255,255,0.5)' 
          }}>
            $500,000,000,000
          </h1>
          
          {/* Violent Red Marker Strike across the text */}
          {frame >= MARKER_FRAME && (
            <div style={{
              position: 'absolute', left: 0, top: '45%', width: '100%', height: 16,
              backgroundColor: '#FF0055', transform: 'rotateZ(2deg)',
              boxShadow: '0 0 25px #FF0055'
            }} />
          )}

          {/* RGB Glitch during impact */}
          {rgbGlitch !== 0 && (
            <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', transform: `translateX(${rgbGlitch}px)` }}>
              <h1 style={{ color: '#00E5CC', fontFamily: "'Cairo', sans-serif", fontSize: 110, fontWeight: 900, margin: 0, padding: '20px 40px' }}>
                $500,000,000,000
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── MAIN SCENE 5 COMPONENT ──
export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();

  const FOLD_START = 60;
  const DIVE_START = 180;
  const WORLD_START = 210;
  const POP_FRAME = 295;
  const RIP_FRAME = 516;
  const END = 630;

  const foldSpring = spring({ frame: Math.max(0, frame - FOLD_START), fps: FPS, config: { damping: 30, stiffness: 15 } });

  // ── TRUE 3D CAMERA ENGINE ──
  // Camera dives from Z=0 to Z=3000. 
  // Lens collision occurs exactly at cameraZ = 1200.
  const cameraZ = interpolate(frame,
    [0, DIVE_START, WORLD_START, RIP_FRAME, RIP_FRAME + 15],
    [0, 0, 3000, 3000, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
  );

  const cameraX = interpolate(frame,
    [0, DIVE_START, WORLD_START],
    [0, 0, 300],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
  );

  // VIOLENT COLLISION TRAJECTORY (Chip)
  // Chip starts at X=-500, attacks to X=300, Z=0. Hits camera lens perfectly at cameraZ=1200.
  const chipAttackX = interpolate(cameraZ, [0, 1200], [-500, 300], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const chipAttackZ = interpolate(cameraZ, [0, 1200], [-500, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const chipAdditionalSpin = interpolate(cameraZ, [0, 1200], [0, 1440], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.poly(2)) });

  // MAZEN PAPER CUTOUT REVEAL (Phase 3)
  // Stops motion step every 3 frames for the gritty Vox look
  const mazenRevealFrame = Math.max(0, frame - 195); // Starts exactly when he passes the lens at cameraZ=1200
  const steppedFrame = Math.floor(mazenRevealFrame / 3) * 3;

  // Flies in from the BOTTOM RIGHT corner to honor the exit trajectory
  // The camera lens is at absolute Z=1200. At world_Z=3000, the lens is at local_Z=-1800.
  // Mazen starts at local_Z=-1000 (absolute 2000, behind the camera) and lands at local_Z=-3000 (absolute 0, normal scale).
  // Applying an aggressive ease-out so he snaps in fast and settles slowly, smoothing the stop-motion feel.
  const mazenTrenchX = interpolate(steppedFrame, [0, 30], [1500, 250], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  // Perfect Perspective Compensation: As cameraZ pulls back, Mazen gets smaller and his bottom edge floats up.
  // This math dynamically pushes him down exactly enough to keep his bottom edge locked to the bottom of the screen.
  const absoluteZ = cameraZ - 3000;
  const currentScale = 1200 / (1200 - absoluteZ);
  const mazenPerspectiveCompY = (540 / currentScale) - 540;
  
  const mazenTrenchY = interpolate(steppedFrame, [0, 30], [1000, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }) + mazenPerspectiveCompY;
  const mazenTrenchZ = interpolate(steppedFrame, [0, 30], [-1000, -3000], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  
  // Violent spring rotation for Mazen locking into place (Restored premium weight, balanced stiffness)
  const mazenLockSpring = spring({ frame: steppedFrame, fps: 30, config: { damping: 14, stiffness: 150 } });
  const mazenTrenchRot = interpolate(mazenLockSpring, [0, 1], [-30, 0]);
  
  // Cinematic Directional Speed Stretch & Lens Distortion Trails (Perfect middle ground: high velocity without visual mush)
  const mazenTrenchScaleY = interpolate(steppedFrame, [0, 20, 40], [1.25, 1.05, 1], { extrapolateRight: 'clamp' });
  const mazenTrenchBlur = interpolate(steppedFrame, [0, 20, 40], [15, 4, 0], { extrapolateRight: 'clamp' });
  const mazenLensDistortion = interpolate(steppedFrame, [0, 20, 40], [30, 8, 0], { extrapolateRight: 'clamp' });

  const ATTACK_FRAME = 60;
  // ── BACKGROUND PARALLAX ENGINE ──
  // 1. Slow ambient breathe
  // Reduced scale to [5.0, 5.3] - mathematically verified to keep a 604px margin against a max 463px pan! Safe.
  const bgBreatheScale = interpolate(frame, [0, 600], [5.0, 5.3]);
  const bgBreatheX = interpolate(frame, [0, 600], [0, -100]);

  // 2. The Attack (Camera pushes slightly in when Code Panel folds)
  const attackZoom = interpolate(foldSpring, [0, 1], [0, 0.3]);
  const attackPanX = interpolate(foldSpring, [0, 1], [0, 200]);

  // 3. The 360 Orbit Parallax (Simulating the camera circling the chip)
  const orbitProgress = interpolate(frame, [ATTACK_FRAME, POP_FRAME], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // Parallax perfectly balanced to stay within the massive 6.0 scale bounds
  const orbitPanX = interpolate(orbitProgress, [0, 1], [0, -600]);
  const orbitArcY = Math.sin(orbitProgress * Math.PI) * 150; // Camera dips slightly during orbit

  // 4. The Pullback & Dive
  const pullbackSpring = spring({ frame: Math.max(0, frame - POP_FRAME), fps: FPS, config: { damping: 14, stiffness: 120 } });
  const pullbackZoom = interpolate(pullbackSpring, [0, 1], [0, -0.6]); // Snap backwards

  // Reverse everything back to 0 at RIP_FRAME to fix black edges
  const ripReverse = interpolate(frame, [RIP_FRAME, RIP_FRAME + 15], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  const bgScale = bgBreatheScale + (attackZoom + pullbackZoom) * ripReverse;
  const bgX = bgBreatheX + (attackPanX + orbitPanX) * ripReverse;
  const bgY = orbitArcY * ripReverse;

  // ── MOTION BLUR & TONE ENGINE ──
  const baseBlur = interpolate(frame, [0, 30, POP_FRAME], [10, 0, 0], { extrapolateRight: 'clamp' });
  const orbitBlur = Math.sin(orbitProgress * Math.PI) * 5;
  const pullbackBlur = Math.sin(pullbackSpring * Math.PI) * 25;
  const diveBlurBg = interpolate(cameraZ, [0, 1200], [0, 40]);
  const returnStudioBlur = interpolate(frame, [RIP_FRAME, RIP_FRAME + 15], [0, 4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const finalBgBlur = baseBlur + orbitBlur + pullbackBlur + diveBlurBg + returnStudioBlur;

  const toneColor = interpolateColors(frame,
    [0, ATTACK_FRAME, ATTACK_FRAME + 40, POP_FRAME - 10, POP_FRAME + 20],
    ['rgba(0, 229, 204, 0.1)', 'rgba(0, 229, 204, 0.1)', 'rgba(255, 215, 0, 0.25)', 'rgba(255, 215, 0, 0.25)', 'rgba(255, 0, 85, 0.4)']
  );

  const dropShadowColor = interpolateColors(frame,
    [0, ATTACK_FRAME, ATTACK_FRAME + 40, POP_FRAME - 10, POP_FRAME + 20],
    ['rgba(0,229,204,0.3)', 'rgba(0,229,204,0.3)', 'rgba(255,215,0,0.5)', 'rgba(255,215,0,0.5)', 'rgba(255,0,85,0.6)']
  );

  // Subtle motion blur just for Mazen during the camera dive
  const mazenDiveBlur = interpolate(cameraZ, [0, 1200], [0, 6], { extrapolateRight: 'clamp' });
  const mazenBlur = pullbackBlur + mazenDiveBlur;
  
  // Cinematic speed stretch during the camera dive to simulate lens distortion
  const mazenDiveStretch = interpolate(cameraZ, [0, 1200], [1, 1.3], { extrapolateRight: 'clamp' });

  // ── SIGNATURE STOP-MOTION POSE SWITCHING ──
  const MAZEN_POSE2_FRAME = 172; // Global 02:02.18
  const MAZEN_POINT_FRAME = 311; // Global 02:07.07
  const DASHBOARD_FRAME = 411; // Global 02:10.17
  
  const poseIndex = frame < MAZEN_POSE2_FRAME ? 1
    : frame < MAZEN_POINT_FRAME ? 2
      : frame < DASHBOARD_FRAME ? 3
        : frame < RIP_FRAME ? 4 
          : 5; // Use chopped head cross-scene asset: mazen-pose2-scene3.png for the studio

  // The signature Chromatic Aberration glitch for exactly 4 frames during pose switches
  const isMazenCut = [MAZEN_POSE2_FRAME, MAZEN_POINT_FRAME, DASHBOARD_FRAME, RIP_FRAME].some(c => frame - c >= 0 && frame - c < 4);
  const mazenCaX = isMazenCut ? Math.sin(frame * 45) * 80 : 0;
  
  // Dynamic offset for Mazen: push right during Dashboard to balance the new pose's natural crop
  const mazenXOffset = frame >= DASHBOARD_FRAME ? 480 : 450;

  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: '#050505', perspective: 1200, overflow: 'hidden' }}>

      <Sequence from={0} durationInFrames={AUDIO1_DURATION}>
        <Audio src={staticFile('audio/episode4/scene5/mazen-first-chunk-scene5.mp3')} />
      </Sequence>
      <Sequence from={AUDIO1_DURATION} durationInFrames={AUDIO2_DURATION}>
        <Audio src={staticFile('audio/episode4/scene5/mazen-second-chunk-scene5.mp3')} />
      </Sequence>

      {/* ── UNIFIED 3D WORLD CONTAINER ── */}
      {/* We never unmount. Everything exists in true physical space. */}
      <div style={{
        position: 'absolute', inset: 0, transformStyle: 'preserve-3d',
        transform: `translateZ(${cameraZ}px) translateX(${-cameraX}px)`
      }}>

          {/* ── PHASE 1: STUDIO (Anchored at Z=0) ── */}
          <div style={{
            position: 'absolute', inset: 0, transformStyle: 'preserve-3d',
            display: cameraZ > 1200 ? 'none' : 'block'
          }}>
            <div style={{
              position: 'absolute', width: 1920, height: 1080, left: '50%', top: '50%', marginLeft: -960, marginTop: -540,
              transform: `translateZ(-2000px) scale(${bgScale}) translateX(${bgX}px) translateY(${bgY}px)`,
              filter: `blur(${finalBgBlur}px)`
            }}>
              <Img src={staticFile('images/episode4/scene-5/harfen-studio.jpeg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, backgroundColor: toneColor, mixBlendMode: 'color' }} />
            </div>

            {/* THE CODE PANEL & GOLDEN CORE */}
            <div style={{
              position: 'absolute', inset: 0, transformStyle: 'preserve-3d',
              transform: `translateX(${chipAttackX}px) translateZ(${chipAttackZ}px)`
            }}>
              {foldSpring < 0.99 && <SoftwareUI foldProgress={foldSpring} frame={frame} />}
              {foldSpring > 0 && foldSpring < 0.99 && <GlitchTransitionEngine progress={foldSpring} />}
              {foldSpring >= 0.5 && frame < RIP_FRAME && <GoldenCore3D progress={frame / 300} additionalSpin={chipAdditionalSpin} scale={interpolate(foldSpring, [0.5, 1], [0, 1], { extrapolateRight: 'clamp' })} />}
            </div>

            {/* MAZEN FOREGROUND */}
            {(() => {
              // Spike the blur during the initial dive in (DIVE_START to WORLD_START) and immediately clear it
              const diveBlur = interpolate(frame, [DIVE_START, WORLD_START, WORLD_START + 5], [0, 1.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              // Spike the blur during the return snap (RIP_FRAME to RIP_FRAME + 15)
              const returnBlur = interpolate(frame, [RIP_FRAME, RIP_FRAME + 5, RIP_FRAME + 15], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              
              const mazenMotionBlur = diveBlur + returnBlur;
              
              return (
                <div style={{
                  position: 'absolute', width: 1920, height: 1080, left: '50%', top: '50%', marginLeft: -960, marginTop: -540,
                  display: 'flex', justifyContent: 'center', alignItems: 'flex-end', zIndex: 90,
                  filter: mazenMotionBlur > 0 ? `blur(${mazenMotionBlur * 12}px) drop-shadow(${mazenMotionBlur * 20}px 0px 0px rgba(255,0,85,0.6)) drop-shadow(${-mazenMotionBlur * 20}px 0px 0px rgba(0,229,204,0.6))` : 'none'
                }}>
                  {/* PRELOAD FIX: Stack images and toggle opacity instead of changing src mid-render */}
              <img src={staticFile('images/episode4/scene-5/mazen-pose1-scene4.png')} style={{ position: 'absolute', height: '90%', marginLeft: '35%', objectFit: 'contain', filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.6))', opacity: poseIndex === 1 ? 1 : 0 }} />
              <img src={staticFile('images/episode4/scene-5/mazen-pose2-scene4.png')} style={{ position: 'absolute', height: '90%', marginLeft: '35%', objectFit: 'contain', filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.6))', opacity: poseIndex === 2 ? 1 : 0 }} />
              <img src={staticFile('images/episode4/scene-5/mazen-pose3-scene4.png')} style={{ position: 'absolute', height: '90%', marginLeft: '35%', objectFit: 'contain', filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.6))', opacity: poseIndex === 3 ? 1 : 0 }} />
              <img src={staticFile('images/episode4/scene-5/mazen-pose2-scene3.png')} style={{ position: 'absolute', height: '102%', marginLeft: '35%', objectFit: 'contain', filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.6))', opacity: poseIndex === 5 ? 1 : 0 }} />
              
              {/* Signature Snap Glitch (Phase 1) */}
              {mazenCaX !== 0 && poseIndex === 1 && (
                <>
                  <img src={staticFile(`images/episode4/scene-5/mazen-pose1-scene4.png`)} style={{ position: 'absolute', height: '90%', marginLeft: '35%', objectFit: 'contain', mixBlendMode: 'screen', filter: 'sepia(1) hue-rotate(-50deg) saturate(10)', transform: `translateX(${-mazenCaX}px)` }} />
                  <img src={staticFile(`images/episode4/scene-5/mazen-pose1-scene4.png`)} style={{ position: 'absolute', height: '90%', marginLeft: '35%', objectFit: 'contain', mixBlendMode: 'screen', filter: 'sepia(1) hue-rotate(130deg) saturate(10)', transform: `translateX(${mazenCaX}px)` }} />
                </>
              )}
              {mazenCaX !== 0 && poseIndex === 2 && (
                <>
                  <img src={staticFile(`images/episode4/scene-5/mazen-pose2-scene4.png`)} style={{ position: 'absolute', height: '90%', marginLeft: '35%', objectFit: 'contain', mixBlendMode: 'screen', filter: 'sepia(1) hue-rotate(-50deg) saturate(10)', transform: `translateX(${-mazenCaX}px)` }} />
                  <img src={staticFile(`images/episode4/scene-5/mazen-pose2-scene4.png`)} style={{ position: 'absolute', height: '90%', marginLeft: '35%', objectFit: 'contain', mixBlendMode: 'screen', filter: 'sepia(1) hue-rotate(130deg) saturate(10)', transform: `translateX(${mazenCaX}px)` }} />
                </>
              )}
              {mazenCaX !== 0 && poseIndex === 3 && (
                <>
                  <img src={staticFile(`images/episode4/scene-5/mazen-pose3-scene4.png`)} style={{ position: 'absolute', height: '90%', marginLeft: '35%', objectFit: 'contain', mixBlendMode: 'screen', filter: 'sepia(1) hue-rotate(-50deg) saturate(10)', transform: `translateX(${-mazenCaX}px)` }} />
                  <img src={staticFile(`images/episode4/scene-5/mazen-pose3-scene4.png`)} style={{ position: 'absolute', height: '90%', marginLeft: '35%', objectFit: 'contain', mixBlendMode: 'screen', filter: 'sepia(1) hue-rotate(130deg) saturate(10)', transform: `translateX(${mazenCaX}px)` }} />
                </>
              )}
              {mazenCaX !== 0 && poseIndex === 5 && (
                <>
                  <img src={staticFile(`images/episode4/scene-5/mazen-pose2-scene3.png`)} style={{ position: 'absolute', height: '102%', marginLeft: '35%', objectFit: 'contain', mixBlendMode: 'screen', filter: 'sepia(1) hue-rotate(-50deg) saturate(10)', transform: `translateX(${-mazenCaX}px)` }} />
                  <img src={staticFile(`images/episode4/scene-5/mazen-pose2-scene3.png`)} style={{ position: 'absolute', height: '102%', marginLeft: '35%', objectFit: 'contain', mixBlendMode: 'screen', filter: 'sepia(1) hue-rotate(130deg) saturate(10)', transform: `translateX(${mazenCaX}px)` }} />
                </>
              )}
            </div>
            );
          })()}
          </div>


          {/* ── PHASE 3: THE TRENCH (Anchored at local_Z=-3000) ── */}
          <div style={{
            position: 'absolute', inset: 0, transformStyle: 'preserve-3d',
            // Hard cut: Instantly spawns around the camera exactly when it crashes through the chip at Z=1200.
            display: cameraZ > 1200 ? 'block' : 'none',
            // THE DRAGGING DOWN EXPLOSION - The entire universe plummets when the camera reverses
            transform: `translateY(${interpolate(frame, [RIP_FRAME, RIP_FRAME + 15], [0, 4000], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.exp) })}px) rotateX(${interpolate(frame, [RIP_FRAME, RIP_FRAME + 15], [0, -60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}deg)`
          }}>
            {/* Using a massive 4000x4000 plane instead of AbsoluteFill to prevent black edges when the camera pans left/right */}
            <div style={{
              position: 'absolute', width: 4000, height: 4000, left: '50%', top: '50%', marginLeft: -2000, marginTop: -2000,
              backgroundColor: '#00141e', overflow: 'hidden', transformStyle: 'preserve-3d', transform: 'translateZ(-3000px)'
            }}>

              <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 50% 0%, ${frame < 350 ? 'rgba(0, 229, 204, 0.25)' : 'rgba(255, 0, 85, 0.3)'} 0%, transparent 70%)` }} />
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 50% 100%, ${frame < 350 ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 0, 85, 0.15)'} 0%, transparent 70%)` }} />

              {/* THE SILICON FLOOR */}
              <div style={{
                position: 'absolute', width: 4000, height: 4000, left: '50%', top: '50%', marginLeft: -2000, marginTop: -2000,
                transform: 'translateY(540px) rotateX(90deg)',
                backgroundImage: `url(${staticFile('images/episode4/scene-5/golden_core_circuit_texture_1788081585368.png')})`,
                backgroundSize: '800px 800px',
                opacity: 0.4,
                boxShadow: 'inset 0 0 1000px 500px #00141e',
                filter: `drop-shadow(0 0 20px rgba(0, 229, 204, 0.5))`
              }}>
                <div style={{ width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(0, 229, 204, 0.3) 2px, transparent 2px), linear-gradient(90deg, rgba(0, 229, 204, 0.3) 2px, transparent 2px)', backgroundSize: '100px 100px' }} />
              </div>

              {/* THE ORIGINAL BACKGROUND REMAINS (So the Dashboard has something to blur against!) */}
              <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
                {/* THE DATA PILLARS (3D CITY/ABYSS) */}
                <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
                  {[...Array(50)].map((_, i) => (
                    <DataPillar key={i} index={i} frame={frame} />
                  ))}
                </div>

                {/* THE GLASSMORPHIC CANYON (Moved physically forward and rendered LAST to guarantee it floats on top of the transparent pillars) */}
                <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: 'translateZ(-200px)' }}>
                  <GlassmorphismStockMarket frame={frame} />
                </div>
              </div>

              {/* NEW PREMIUM PANORAMIC TERMINAL (Takes over exactly at 411, blurring the background) */}
              <PanoramicMarketDashboard frame={frame} />

              {/* THE $500B FINANCIAL HOLOGRAM (Renders directly above) */}
              <FinancialCrashHologram frame={frame} />
            </div>
          </div>

          {/* ── MAZEN PAPER CUTOUT STOP-MOTION COLLAPSE ── */}
          {/* This renders dynamically inside the global 3D space, honoring the camera Z! */}
          {cameraZ > 1200 && (
            <div style={{
              position: 'absolute', width: 1920, height: 1080, left: '50%', top: '50%', marginLeft: -960, marginTop: -540,
              display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
              transformStyle: 'preserve-3d',
              // Physically slides from X=1500 (Right), Y=1000 (Bottom), Z=5000 (Behind Camera) perfectly into Z=3000 (Trench Anchor)
              transform: `
                translateZ(${mazenTrenchZ}px) 
                translateX(${mazenTrenchX}px) 
                translateY(${mazenTrenchY}px)
                rotateZ(${mazenTrenchRot}deg)
                scaleY(${mazenTrenchScaleY})
              `,
              opacity: interpolate(steppedFrame, [0, 9], [0, 1], { extrapolateRight: 'clamp' }),
              filter: `drop-shadow(0 20px 50px rgba(0,0,0,0.8)) blur(${mazenTrenchBlur}px) drop-shadow(${mazenLensDistortion}px 0px 0px rgba(255,0,85,0.5)) drop-shadow(${-mazenLensDistortion}px 0px 0px rgba(0,229,204,0.5))`
            }}>
              {/* PRELOAD FIX: Render all poses simultaneously and toggle opacity to prevent blank frames during PNG decode */}
              <img src={staticFile(`images/episode4/scene-5/mazen-pose1-scene4.png`)} style={{ position: 'absolute', height: '90%', transform: `translateX(${mazenXOffset}px)`, objectFit: 'contain', opacity: poseIndex === 1 ? 1 : 0 }} />
              <img src={staticFile(`images/episode4/scene-5/mazen-pose2-scene4.png`)} style={{ position: 'absolute', height: '90%', transform: `translateX(${mazenXOffset}px)`, objectFit: 'contain', opacity: poseIndex === 2 ? 1 : 0 }} />
              <img src={staticFile(`images/episode4/scene-5/mazen-pose3-scene4.png`)} style={{ position: 'absolute', height: '90%', transform: `translateX(${mazenXOffset}px)`, objectFit: 'contain', opacity: poseIndex === 3 ? 1 : 0 }} />
              <img src={staticFile(`images/episode4/scene-3/mazen-pose3-scene3.png`)} style={{ position: 'absolute', height: '90%', transform: `translateX(${mazenXOffset}px)`, objectFit: 'contain', opacity: poseIndex === 4 ? 1 : 0 }} />
              <img src={staticFile(`images/episode4/scene-5/mazen-pose2-scene3.png`)} style={{ position: 'absolute', height: '102%', transform: `translateX(${mazenXOffset}px)`, objectFit: 'contain', opacity: poseIndex === 5 ? 1 : 0 }} />
              
              {/* Signature Snap Glitch (Unified dynamic rendering) */}
              {mazenCaX !== 0 && (
                <>
                  <img src={staticFile(poseIndex === 5 ? `images/episode4/scene-5/mazen-pose2-scene3.png` : poseIndex === 4 ? `images/episode4/scene-3/mazen-pose3-scene3.png` : `images/episode4/scene-5/mazen-pose${poseIndex}-scene4.png`)} style={{ position: 'absolute', height: poseIndex === 5 ? '102%' : '90%', transform: `translateX(${mazenXOffset - mazenCaX}px)`, objectFit: 'contain', mixBlendMode: 'screen', filter: 'sepia(1) hue-rotate(-50deg) saturate(10)' }} />
                  <img src={staticFile(poseIndex === 5 ? `images/episode4/scene-5/mazen-pose2-scene3.png` : poseIndex === 4 ? `images/episode4/scene-3/mazen-pose3-scene3.png` : `images/episode4/scene-5/mazen-pose${poseIndex}-scene4.png`)} style={{ position: 'absolute', height: poseIndex === 5 ? '102%' : '90%', transform: `translateX(${mazenXOffset + mazenCaX}px)`, objectFit: 'contain', mixBlendMode: 'screen', filter: 'sepia(1) hue-rotate(130deg) saturate(10)' }} />
                </>
              )}
            </div>
          )}
        </div>
        
        {/* ── FINAL MAZEN CAPTION (Matches Mariya's Scene 3 style) ── */}
        {frame >= 571 && (() => {
          const revealProgress = interpolate(frame, [571, 571 + 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          
          const revealScaleY = interpolate(revealProgress, [0, 0.4, 1], [0.02, 0.02, 1], { easing: Easing.out(Easing.cubic) });
          const revealScaleX = interpolate(revealProgress, [0, 0.4, 1], [2.5, 2.5, 1], { easing: Easing.out(Easing.cubic) });
          const revealBrightness = interpolate(revealProgress, [0, 0.4, 1], [5, 5, 1]);
          const revealOpacity = interpolate(revealProgress, [0, 0.2], [0, 1], { extrapolateRight: 'clamp' });

          return (
            <div style={{
              position: 'absolute',
              left: '50%',
              marginLeft: '-22%', // Centers the 44% width box
              top: '65%', // Chest height
              width: '44%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              direction: 'rtl',
              transformOrigin: 'center center',
              opacity: revealOpacity,
              transform: `scaleX(${revealScaleX}) scaleY(${revealScaleY})`,
              filter: `brightness(${revealBrightness})`,
              willChange: 'transform, opacity, filter',
              zIndex: 100 // On top of everything
            }}>
              {/* The Glass Box (Squished into a laser initially!) */}
              <div style={{
                width: '100%',
                background: 'linear-gradient(135deg, rgba(15, 0, 5, 0.95) 0%, rgba(5, 0, 0, 0.98) 100%)', 
                borderRight: '6px solid #00E5CC', // Right border like Mariya
                boxShadow: `0 30px 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(0, 229, 204, 0.15), 0 0 ${interpolate(revealProgress, [0, 0.4, 1], [150, 150, 0])}px #FF0055`,
                borderRadius: '20px 0 0 20px',
                padding: '40px 50px',
                overflow: 'hidden'
              }}>
                <div style={{ color: '#00E5CC', fontSize: 50, fontFamily: 'monospace', letterSpacing: 3, marginBottom: 10, fontWeight: 900 }}>
                  // وضع هش للغاية !!
                </div>
                <div style={{ color: '#FFF', fontSize: 60, fontWeight: 900, fontFamily: "'Cairo', sans-serif", lineHeight: 1.4, textShadow: '0 10px 30px rgba(0,0,0,0.9)' }}>
                  هتسحب الاقتصاد العالمى كله معاها
                </div>
              </div>
            </div>
          )
        })()}

        {/* ── BREAKING NEWS CHYRON REMOVED (No room in this scene, just like Scene 3) ── */}
        
        {/* POST-PROCESSING: Global Halftone / Film Grain Texture & Vignette */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1000, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.12, mixBlendMode: 'multiply',
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1001, pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(10,5,5,0.6) 100%)',
          mixBlendMode: 'multiply',
        }} />
        
    </div>
  );
};
