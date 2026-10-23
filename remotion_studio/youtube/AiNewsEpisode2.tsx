import React from 'react';
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, staticFile, spring, interpolate, interpolateColors, random } from 'remotion';

const FPS = 30;
const SCENE_FRAMES = 10 * FPS;
export const TOTAL_FRAMES = 9 * SCENE_FRAMES;

const CYAN = '#00E5CC';
const MAGENTA = '#FF3CAC';
const BRAND_DARK = '#0A0A0A';
const BRAND_LIGHT = '#F5F5F5';

// ─── EDITORIAL MOTION PRINCIPLES (Vox / Vice) ────────────────────────────────
// 1. Assets NEVER drop from sky. They SCALE UP from zero (like a stamp / press)
// 2. Assets NEVER fall out. They SCALE DOWN and vanish (unpressed).
// 3. Text NEVER floats. It HOLDS its position like a physical censor bar.
// 4. Each element has a precise BEAT to hit. Late is better than chaotic.
// 5. Chromatic glitch is a BURST event on entry, not continuous.

// ─── GLITCH BURST (Entry only, 8 frames) ─────────────────────────────────────
const useGlitchBurst = (startFrame: number, duration = 12) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  if (localFrame < 0 || localFrame > duration) return { rx: 0, ry: 0, cx: 0, cy: 0, op: 1 };
  const t = localFrame / duration;
  const intensity = Math.sin(t * Math.PI); // Peaks at middle of burst
  const rx = (random(frame) - 0.5) * 60 * intensity;
  const ry = (random(frame + 1) - 0.5) * 15 * intensity;
  const cx = (random(frame + 2) - 0.5) * 60 * intensity;
  const cy = (random(frame + 3) - 0.5) * 15 * intensity;
  const op = 1 - intensity * 0.4;
  return { rx, ry, cx, cy, op };
};

interface GlitchWrapperProps { children: React.ReactNode; startFrame: number; }
const GlitchWrapper: React.FC<GlitchWrapperProps> = ({ children, startFrame }) => {
  const { rx, ry, cx, cy, op } = useGlitchBurst(startFrame);
  const isActive = rx !== 0 || cx !== 0;
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {isActive && (
        <>
          <div style={{ position: 'absolute', inset: 0, transform: `translate(${rx}px, ${ry}px)`, filter: 'sepia(1) hue-rotate(-50deg) saturate(8) brightness(1.5)', mixBlendMode: 'screen', opacity: 0.7 }}>{children}</div>
          <div style={{ position: 'absolute', inset: 0, transform: `translate(${cx}px, ${cy}px)`, filter: 'sepia(1) hue-rotate(150deg) saturate(8) brightness(1.5)', mixBlendMode: 'screen', opacity: 0.7 }}>{children}</div>
        </>
      )}
      <div style={{ position: 'absolute', inset: 0, opacity: op }}>{children}</div>
    </div>
  );
};


// ─── BACKGROUND: CRUSHED NEWSPRINT + ATMOSPHERE TINT ─────────────────────────
const FPVBackground: React.FC<{ tintColor?: string }> = ({ tintColor }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, SCENE_FRAMES], [1.0, 1.04], { extrapolateRight: 'clamp' });
  const panX = interpolate(frame, [0, SCENE_FRAMES], [0, -12], { extrapolateRight: 'clamp' });
  
  // Motion blur on cut (flash transition)
  const blur = interpolate(frame, [0, 5], [15, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ zIndex: 1, backgroundColor: '#050505', filter: `blur(${blur}px)` }}>
      <Img
        src={staticFile('harfen-studio.webp')}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${scale}) translateX(${panX}px)`,
          filter: 'grayscale(1) sepia(0.4) contrast(1.3) brightness(0.45)',
        }}
      />
      {tintColor && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: tintColor, mixBlendMode: 'multiply', opacity: 0.6,
        }} />
      )}
      {/* Aggressive vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.97) 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 40%)',
      }} />
    </AbsoluteFill>
  );
};

// ─── SUBTLE HALFTONE TEXTURE ─────────────────────────────────────────────────
const DioramaOverlay: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 90, mixBlendMode: 'multiply' }}>
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
      backgroundSize: '5px 5px',
      opacity: 0.3,
    }} />
  </AbsoluteFill>
);

// ─── EDITORIAL GRID (warm cream) ─────────────────────────────────────────────
const EditorialGrid: React.FC = () => (
  <AbsoluteFill style={{ zIndex: 2, opacity: 0.04, pointerEvents: 'none' }}>
    <div style={{
      width: '100%', height: '100%',
      backgroundImage: `linear-gradient(to right, #d9cdb4 1px, transparent 1px), linear-gradient(to bottom, #d9cdb4 1px, transparent 1px)`,
      backgroundSize: '80px 80px',
    }} />
  </AbsoluteFill>
);

// ─── BROADCAST NEWS CHYRON ────────────────────────────────────────────────────
// The bottom ticker strip that makes it feel like LIVE news. Key to authority.
const NewsChyron: React.FC<{ label: string; source?: string; delayFrames?: number; isMaskRTL?: boolean; badgeText?: string }> = ({ label, source, delayFrames = 5, isMaskRTL = false, badgeText = 'BREAKING' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Base animation for the badge (and container if not masking)
  const slideIn = spring({ frame: frame - delayFrames, fps, config: { damping: 22, stiffness: 200 } });
  const x = interpolate(slideIn, [0, 1], [-400, 0]);
  const opacity = interpolate(slideIn, [0, 0.3, 1], [0, 1, 1]);
  
  // Independent animation for the text block sweep
  const textSpring = spring({ frame: frame - (delayFrames + (isMaskRTL ? 15 : 0)), fps, config: { damping: 12, stiffness: 180 } });
  const textScale = isMaskRTL ? interpolate(textSpring, [0, 1], [1.05, 1]) : 1;
  const maskLeft = interpolate(textSpring, [0, 1], [100, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const textOpacity = isMaskRTL ? interpolate(textSpring, [0, 0.2, 1], [0, 1, 1]) : 1;

  return (
    <AbsoluteFill style={{ zIndex: 120, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', bottom: '4%', left: 0,
        display: 'flex', alignItems: 'stretch',
        transform: isMaskRTL ? 'none' : `translateX(${x}px)`,
        opacity: isMaskRTL ? 1 : opacity,
        filter: 'drop-shadow(8px 12px 16px rgba(0,0,0,0.95))',
      }}>
        {/* BREAKING label */}
        <div style={{
          backgroundColor: MAGENTA, padding: '6px 14px',
          display: 'flex', alignItems: 'center',
          transform: isMaskRTL ? `translateX(${x}px)` : 'none',
          opacity: isMaskRTL ? opacity : 1,
        }}>
          <span style={{ color: '#fff', fontSize: 18, fontWeight: 900, letterSpacing: 3, textTransform: 'uppercase' }}>{badgeText}</span>
        </div>
        
        {/* Headline text */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.92)', padding: '6px 20px',
          borderTop: `2px solid ${CYAN}`,
          display: 'flex', alignItems: 'center', gap: 20,
          clipPath: isMaskRTL ? `inset(0 0 0 ${maskLeft}%)` : 'none',
          transform: `scale(${textScale})`,
          transformOrigin: 'left center',
          opacity: isMaskRTL ? textOpacity : 1,
        }}>
          <span dir="rtl" style={{ color: BRAND_LIGHT, fontSize: 26, fontWeight: 700 }}>{label}</span>
          {source && (
            <span style={{ color: CYAN, fontSize: 24, fontWeight: 700, opacity: 1 }}>• {source}</span>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── DATA BAR CHART (Animated Comparison) ─────────────────────────────────────
const DataBarChart: React.FC<{ align: 'left' | 'right' }> = ({ align }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const leftPos = align === 'left' ? '8%' : '52%';
  
  const data = [
    { label: 'Intel', value: 120, color: '#0071C5' },
    { label: 'AMD', value: 240, color: '#ED1C24' },
    { label: 'Nvidia', value: 500, color: '#76B900', highlight: true }
  ];

  return (
    <AbsoluteFill style={{ zIndex: 20, pointerEvents: 'none', justifyContent: 'center' }}>
      <div style={{
        position: 'absolute', left: leftPos, top: '15%',
        display: 'flex', flexDirection: 'column', gap: 25, width: 600
      }}>
        {data.map((item, i) => {
          const progress = spring({ frame: frame - (20 + i * 10), fps, config: { damping: 14, stiffness: 120 } });
          const currentWidth = interpolate(progress, [0, 1], [0, (item.value / 500) * 100]);
          const currentVal = Math.floor(interpolate(progress, [0, 1], [0, item.value]));
          
          return (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: BRAND_LIGHT, fontSize: 34, fontWeight: 700, opacity: progress, fontFamily: 'monospace' }}>
                <span>{item.label}</span>
                <span style={{ color: item.highlight ? CYAN : BRAND_LIGHT }}>${currentVal}B</span>
              </div>
              <div style={{ width: '100%', height: 35, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ 
                  width: `${currentWidth}%`, height: '100%', 
                  backgroundColor: item.color,
                  boxShadow: item.highlight ? `0 0 20px ${item.color}` : 'none'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── CHARACTER CUTOUT (Slides up from below, like a physical stand-up) ────────
const CharacterCutout: React.FC<{ src: string; side: 'left' | 'right'; useGlitch?: boolean }> = ({ src, side, useGlitch = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slideUp = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 180 } });
  const yOffset = interpolate(slideUp, [0, 1], [600, 0]);
  const opacity = interpolate(slideUp, [0, 0.15, 1], [0, 1, 1]);
  // Subtle slow push — NOT a continuous float
  const slowScale = interpolate(frame, [0, SCENE_FRAMES], [1.0, 1.03], { extrapolateRight: 'clamp' });

  // Brief burst of static glitch when entering (starts at frame 10, lasts 8 frames)
  const { rx, ry, cx, cy, op } = useGlitchBurst(10, 8);
  const isGlitching = useGlitch && (rx !== 0 || cx !== 0);

  return (
    <AbsoluteFill style={{ zIndex: 30, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', bottom: 0, [side]: '2%', height: '80%',
        opacity: opacity * (useGlitch ? op : 1),
        transform: `translateY(${yOffset}px) scale(${slowScale})`,
        transformOrigin: `bottom ${side}`,
        filter: 'drop-shadow(18px 25px 25px rgba(0,0,0,0.9))'
      }}>
        {isGlitching && (
          <>
            <Img src={src} style={{ position: 'absolute', height: '100%', objectFit: 'contain', transform: `translate(${rx}px, ${ry}px)`, filter: 'sepia(1) hue-rotate(-50deg) saturate(8) brightness(1.5)', mixBlendMode: 'screen', opacity: 0.7 }} />
            <Img src={src} style={{ position: 'absolute', height: '100%', objectFit: 'contain', transform: `translate(${cx}px, ${cy}px)`, filter: 'sepia(1) hue-rotate(150deg) saturate(8) brightness(1.5)', mixBlendMode: 'screen', opacity: 0.7 }} />
          </>
        )}
        <Img src={src} style={{ height: '100%', objectFit: 'contain' }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── CENSOR BAR TEXT (WORD-BY-WORD KINETIC STAMP) ────────────────────────────
const CensorBarText: React.FC<{ text: string; subtext?: string; color: string; align: 'left' | 'right'; targetColor?: string; colorShiftFrame?: number }> = ({ text, subtext, color, align, targetColor, colorShiftFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const leftPos = align === 'left' ? '5%' : '48%';
  const words = text.split(' ');
  
  const currentBgColor = (targetColor && colorShiftFrame)
    ? interpolateColors(frame, [colorShiftFrame, colorShiftFrame + 15], [color, targetColor])
    : color;

  return (
    <AbsoluteFill style={{ zIndex: 110, pointerEvents: 'none' }}>
      <div dir="rtl" style={{
        position: 'absolute', left: leftPos, bottom: '12%', width: '48%',
        display: 'flex', flexDirection: 'column', alignItems: align === 'left' ? 'flex-end' : 'flex-start',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: align === 'left' ? 'flex-end' : 'flex-start' }}>
          {words.map((word, i) => {
            const isBell = word.includes('🔔');
            // Red transition takes 15 frames. 15 + 13 = 28 frames after colorShiftFrame starts.
            const startFrame = isBell && colorShiftFrame ? colorShiftFrame + 28 : (18 + i * 4);
            const springConfig = isBell ? { damping: 12, stiffness: 220 } : { damping: 16, stiffness: 350 };
            
            const wordStamp = spring({ frame: frame - startFrame, fps, config: springConfig });
            const scaleX = interpolate(wordStamp, [0, 1], [0, 1]);
            const scaleY = isBell ? wordStamp : 1;
            const opacity = interpolate(wordStamp, [0, 0.3, 1], [0, 1, 1]);
            
            return (
              <div key={i} style={{
                display: 'inline-block', backgroundColor: currentBgColor,
                padding: '8px 22px', boxShadow: '12px 16px 20px rgba(0,0,0,0.9)',
                borderLeft: `8px solid ${BRAND_LIGHT}`, opacity,
                transform: `scaleX(${isBell ? wordStamp : scaleX}) scaleY(${scaleY}) translateZ(0)`,
                willChange: 'background-color, transform',
                transformOrigin: align === 'right' ? 'left center' : 'right center',
              }}>
                <h1 style={{ margin: 0, fontSize: 72, fontWeight: 900, color: BRAND_DARK, lineHeight: 1.1, letterSpacing: '-1px' }}>
                  {word}
                </h1>
              </div>
            );
          })}
        </div>
        {subtext && (() => {
          const subStamp = spring({ frame: frame - (18 + words.length * 4 + 4), fps, config: { damping: 20, stiffness: 300 } });
          const subScale = interpolate(subStamp, [0, 1], [0, 1]);
          const subOp = interpolate(subStamp, [0, 0.3, 1], [0, 1, 1]);
          return (
            <div style={{ display: 'block', marginTop: 12, opacity: subOp, transform: `scaleX(${subScale}) translateZ(0)`, willChange: 'transform', transformOrigin: align === 'right' ? 'left center' : 'right center' }}>
              <div style={{
                display: 'inline-block', backgroundColor: BRAND_DARK,
                padding: '5px 16px', boxShadow: '8px 10px 14px rgba(0,0,0,0.85)',
                borderLeft: `6px solid ${currentBgColor}`,
                willChange: 'border-color',
              }}>
                <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: BRAND_LIGHT, lineHeight: 1.3 }}>
                  {subtext}
                </h2>
              </div>
            </div>
          );
        })()}
      </div>
    </AbsoluteFill>
  );
};

// ─── NEURAL NETWORK OVERLAY (Vox-style procedural electricity) ───────────────
const NeuralNetworkOverlay: React.FC<{ entryFrame: number }> = ({ entryFrame }) => {
  const frame = useCurrentFrame();
  const ef = entryFrame;
  
  const opacity = interpolate(
    frame, 
    [ef, ef + 15, SCENE_FRAMES - 30, SCENE_FRAMES - 15], 
    [0, 1, 1, 0], 
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  const nodes = React.useMemo(() => {
    return new Array(25).fill(0).map((_, i) => ({
      x: 30 + random(`nx-${i}`) * 40,
      y: 30 + random(`ny-${i}`) * 40,
      id: i
    }));
  }, []);

  const connections = React.useMemo(() => {
    const conns = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 18 && random(`conn-${i}-${j}`) > 0.35) {
          conns.push({ n1: nodes[i], n2: nodes[j], type: random(`type-${i}-${j}`) > 0.5 ? CYAN : MAGENTA });
        }
      }
    }
    return conns;
  }, [nodes]);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
      opacity, pointerEvents: 'none', mixBlendMode: 'screen',
      transform: `rotate(${Math.sin(frame/40)*2}deg) scale(${interpolate(Math.sin(frame/20), [-1,1], [0.95, 1.05])})`
    }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {connections.map((c, i) => (
          <g key={i}>
            <line x1={c.n1.x} y1={c.n1.y} x2={c.n2.x} y2={c.n2.y} stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />
            <line 
              x1={c.n1.x} y1={c.n1.y} x2={c.n2.x} y2={c.n2.y} 
              stroke={c.type} strokeWidth="1" 
              strokeDasharray="4 8" strokeDashoffset={-(frame * (random(`spd-${i}`) * 2 + 1))} 
              style={{ filter: `drop-shadow(0 0 5px ${c.type})` }} 
            />
          </g>
        ))}
        {nodes.map((n) => (
          <circle key={n.id} cx={n.x} cy={n.y} r={interpolate(Math.sin(frame/5 + n.id), [-1, 1], [0.5, 1.8])} fill="#FFF" style={{ filter: 'drop-shadow(0 0 4px #FFF)' }} />
        ))}
      </svg>
    </div>
  );
};

// ─── NARRATIVE ASSET (STAMP IN / STAMP OUT — editorial press style) ───────────
// Entry: Scales from 0 → 1 fast (like a rubber stamp being pressed)
// Presence: Held. No floating. A tiny, imperceptible 2px drift max.
// Exit: Scales back to 0 (like the stamp lifting up).
const NarrativeAsset: React.FC<{ src: string; align: 'left' | 'right'; rotation?: number; useGlitch?: boolean; useGlow?: boolean; entryFrame?: number; exitFrame?: number; targetSpot?: {x: string, y: string, color: string, delayFrames?: number, type?: 'radar' | 'dot' | 'crosshair'}; left?: string; useNeuralNet?: boolean }> = ({
  src, align, rotation = -5, useGlitch = false, useGlow = false, entryFrame = 20, exitFrame, targetSpot, left, useNeuralNet = false
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ef = exitFrame ?? (SCENE_FRAMES - 40);

  // Stamp IN: Fast, confident, like a physical press
  const stampIn = spring({ frame: frame - entryFrame, fps, config: { damping: 22, stiffness: 280 } });
  // Stamp OUT: Lifts cleanly before the scene ends
  const stampOut = spring({ frame: frame - ef, fps, config: { damping: 22, stiffness: 280 } });

  const scaleIn = interpolate(stampIn, [0, 1], [0, 1]);
  const scaleOut = interpolate(stampOut, [0, 1], [1, 0]);
  const scale = scaleIn * scaleOut;

  const opIn = interpolate(stampIn, [0, 0.4, 1], [0, 1, 1]);
  const opOut = interpolate(stampOut, [0, 1], [1, 0]);
  const opacity = opIn * opOut;

  // Absolutely minimal drift (2px max). Not floating. Just alive.
  const microDrift = Math.sin(frame / 40) * 2;

  const leftPos = left ?? (align === 'left' ? '4%' : '58%');

  const AssetImg = <Img src={src} style={{ width: 380, height: 380, objectFit: 'contain' }} />;

  const shimmer = useGlow ? interpolate(Math.sin(frame / 4), [-1, 1], [1, 1.4]) : 1;
  const shimmerShadow = useGlow ? `drop-shadow(0 0 ${interpolate(Math.sin(frame / 4), [-1, 1], [5, 25])}px rgba(0,255,255,0.7))` : '';

  return (
    <AbsoluteFill style={{ zIndex: 10, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', left: leftPos, top: '12%',
        opacity,
        transform: `scale(${scale}) rotate(${rotation}deg) translateY(${microDrift}px)`,
        transformOrigin: 'center center',
        filter: `sepia(0.8) hue-rotate(140deg) saturate(2.5) contrast(1.15) brightness(${shimmer}) ${shimmerShadow} drop-shadow(2px 2px 0 #fff) drop-shadow(-2px -2px 0 #fff) drop-shadow(2px -2px 0 #fff) drop-shadow(-2px 2px 0 #fff) drop-shadow(25px 35px 30px rgba(0,0,0,0.95))`,
      }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {useGlitch ? <GlitchWrapper startFrame={entryFrame + 6}>{AssetImg}</GlitchWrapper> : AssetImg}
          {targetSpot && targetSpot.type !== 'radar' && targetSpot.type !== 'crosshair' && (
            <div style={{
              position: 'absolute', left: targetSpot.x, top: targetSpot.y,
              width: 16, height: 16, borderRadius: '50%',
              backgroundColor: targetSpot.color,
              boxShadow: `0 0 15px 5px ${targetSpot.color}`,
              border: '3px solid white',
              transform: `translate(-50%, -50%) scale(${interpolate(Math.sin(frame / 5), [-1, 1], [0.7, 1.3])})`,
              opacity: interpolate(frame, [targetSpot.delayFrames || 0, (targetSpot.delayFrames || 0) + 15], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) * opacity,
            }} />
          )}
        </div>
      </div>

      {/* Neural network: rendered OUTSIDE the filter so cyan/magenta colors survive */}
      {useNeuralNet && (
        <div style={{
          position: 'absolute',
          left: leftPos,
          top: '12%',
          width: 380,
          height: 380,
          opacity,
          transform: `scale(${scale}) rotate(${rotation}deg) translateY(${microDrift}px)`,
          transformOrigin: 'center center',
          pointerEvents: 'none',
        }}>
          <NeuralNetworkOverlay entryFrame={entryFrame + 10} />
        </div>
      )}

      {/* targetSpot (radar): rendered OUTSIDE the filtered container so color is true */}
      {targetSpot && targetSpot.type === 'radar' && (() => {
        // Image is 380x380 on a 1920x1080 canvas.
        // Convert image-relative % → absolute canvas %
        const imgW = (380 / 1920) * 100; // 19.79% of canvas width
        const imgH = (380 / 1080) * 100; // 35.19% of canvas height
        const baseLeft = align === 'left' ? 4 : 58; // leftPos as number
        const absLeft = `${baseLeft + (parseFloat(targetSpot.x) / 100) * imgW}%`;
        const absTop  = `${12 + (parseFloat(targetSpot.y) / 100) * imgH}%`;

        const spotDelay = targetSpot.delayFrames || 0;
        // Fades in over 15 frames. Fades out ending exactly 15 frames (0.5s) BEFORE the asset starts moving (ef).
        const spotOpacity = interpolate(
          frame, 
          [spotDelay, spotDelay + 15, ef - 30, ef - 15], 
          [0, 1, 1, 0], 
          { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
        );
        const pulse = interpolate(Math.sin(frame / 5), [-1, 1], [0.8, 1.2]);
        const ring  = interpolate(Math.sin(frame / 8), [-1, 1], [1.0, 2.4]);
        const ringOp = interpolate(Math.sin(frame / 8), [-1, 1], [0.7, 0.05]);

        return (
          <>
            {/* Rotating radar sweep */}
            <div style={{
              position: 'absolute', left: absLeft, top: absTop,
              width: 280, height: 280,
              transform: `translate(-50%, -50%) rotate(${frame * 1.2}deg)`,
              background: `conic-gradient(from 0deg, transparent 0deg, ${targetSpot.color} 15deg, transparent 30deg, transparent 180deg, ${targetSpot.color} 195deg, transparent 210deg)`,
              mixBlendMode: 'screen',
              filter: 'blur(8px)',
              opacity: spotOpacity * 0.85,
              pointerEvents: 'none',
            }} />
            {/* Expanding sonar ring */}
            <div style={{
              position: 'absolute', left: absLeft, top: absTop,
              width: 36, height: 36, borderRadius: '50%',
              border: `2px solid ${targetSpot.color}`,
              transform: `translate(-50%, -50%) scale(${ring})`,
              opacity: spotOpacity * ringOp,
              pointerEvents: 'none',
            }} />
            {/* Core lens dot */}
            <div style={{
              position: 'absolute', left: absLeft, top: absTop,
              width: 12, height: 12, borderRadius: '50%',
              backgroundColor: targetSpot.color,
              boxShadow: `0 0 10px 5px ${targetSpot.color}, 0 0 20px 8px ${targetSpot.color}`,
              transform: `translate(-50%, -50%) scale(${pulse})`,
              opacity: spotOpacity,
              pointerEvents: 'none',
            }} />
          </>
        );
      })()}

      {/* targetSpot (crosshair): completely distinct sniper-style lock for ultimatums */}
      {targetSpot && targetSpot.type === 'crosshair' && (() => {
        const imgW = (380 / 1920) * 100;
        const imgH = (380 / 1080) * 100;
        const baseLeft = align === 'left' ? 4 : 58;
        const absLeft = `${baseLeft + (parseFloat(targetSpot.x) / 100) * imgW}%`;
        const absTop  = `${12 + (parseFloat(targetSpot.y) / 100) * imgH}%`;

        const spotDelay = targetSpot.delayFrames || 0;
        const spotOpacity = interpolate(
          frame, 
          [spotDelay, spotDelay + 15, ef - 30, ef - 15], 
          [0, 1, 1, 0], 
          { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
        );
        const lockInSpring = spring({ frame: frame - spotDelay - 10, fps, config: { damping: 14 } });
        const lockInScale = interpolate(lockInSpring, [0, 1], [3, 1]);
        // Pulse only while zooming in — freezes the moment it locks
        const pulseRaw = interpolate(Math.sin(frame / 6), [-1, 1], [0.9, 1.1]);
        const pulseStrength = interpolate(lockInSpring, [0, 0.7, 1], [1, 1, 0], { extrapolateRight: 'clamp' });
        const pulse = 1 + (pulseRaw - 1) * pulseStrength;

        return (
          <div style={{
            position: 'absolute', left: absLeft, top: absTop,
            width: 140, height: 140, borderRadius: '50%',
            border: `3px solid ${targetSpot.color}`,
            boxShadow: `0 0 25px ${targetSpot.color}, inset 0 0 25px ${targetSpot.color}`,
            transform: `translate(-50%, -50%) scale(${lockInScale * pulse})`,
            opacity: spotOpacity,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            pointerEvents: 'none'
          }}>
            {/* Vertical reticle line */}
            <div style={{ position: 'absolute', width: 2, height: 180, backgroundColor: targetSpot.color, boxShadow: `0 0 10px ${targetSpot.color}` }} />
            {/* Horizontal reticle line */}
            <div style={{ position: 'absolute', width: 180, height: 2, backgroundColor: targetSpot.color, boxShadow: `0 0 10px ${targetSpot.color}` }} />
            {/* Center dot */}
            <div style={{ width: 8, height: 8, backgroundColor: 'white', borderRadius: '50%', boxShadow: `0 0 15px white` }} />
            {/* Corner brackets */}
            <div style={{ position: 'absolute', inset: -15, border: `2px dashed ${targetSpot.color}`, borderRadius: '50%', opacity: 0.5, animation: 'spin 10s linear infinite' }} />
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

// ─── CORPORATE LOGO (HARD STAMP, no float) ────────────────────────────────────
const CorporateLogo: React.FC<{ src: string; align: 'left' | 'right'; rotation?: number; invertWhite?: boolean; top?: string; left?: string; entryFrame?: number }> = ({ src, align, rotation = 8, invertWhite = false, top = '38%', left, entryFrame = 25 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stamp = spring({ frame: frame - entryFrame, fps, config: { damping: 20, stiffness: 260 } });
  const clear = spring({ frame: frame - (SCENE_FRAMES - 35), fps, config: { damping: 20, stiffness: 260 } });

  const scale = interpolate(stamp, [0, 1], [0, 1]) * interpolate(clear, [0, 1], [1, 0]);
  const opacity = interpolate(stamp, [0, 0.4, 1], [0, 1, 1]) * interpolate(clear, [0, 1], [1, 0]);

  const leftPos = left ?? (align === 'left' ? '28%' : '80%');
  const filter = invertWhite
    ? 'invert(1) drop-shadow(3px 5px 6px rgba(0,0,0,0.9))'
    : 'drop-shadow(3px 5px 6px rgba(0,0,0,0.7))';

  return (
    <AbsoluteFill style={{ zIndex: 5, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', left: leftPos, top,
        opacity, filter,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: 'center center',
      }}>
        <Img src={src} style={{ width: 140, height: 140, objectFit: 'contain' }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── DUAL LOGO (Two logos with + sign, staggered stamp-in) ─────────────────────
const DualLogo: React.FC<{ src1: string; src2: string; align: 'left' | 'right'; top?: string; entryFrame?: number }> = ({ src1, src2, align, top = '10%', entryFrame = 20 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stamp1 = spring({ frame: frame - entryFrame, fps, config: { damping: 20, stiffness: 260 } });
  const stamp2 = spring({ frame: frame - (entryFrame + 15), fps, config: { damping: 20, stiffness: 260 } });
  const stampPlus = spring({ frame: frame - (entryFrame + 22), fps, config: { damping: 20, stiffness: 260 } });
  const clear = spring({ frame: frame - (SCENE_FRAMES - 35), fps, config: { damping: 20, stiffness: 260 } });

  const scale1 = interpolate(stamp1, [0, 1], [0, 1]) * interpolate(clear, [0, 1], [1, 0]);
  const scale2 = interpolate(stamp2, [0, 1], [0, 1]) * interpolate(clear, [0, 1], [1, 0]);
  const scalePlus = interpolate(stampPlus, [0, 1], [0, 1]) * interpolate(clear, [0, 1], [1, 0]);
  const op1 = interpolate(stamp1, [0, 0.4, 1], [0, 1, 1]) * interpolate(clear, [0, 1], [1, 0]);
  const op2 = interpolate(stamp2, [0, 0.4, 1], [0, 1, 1]) * interpolate(clear, [0, 1], [1, 0]);
  const opPlus = interpolate(stampPlus, [0, 0.4, 1], [0, 1, 1]) * interpolate(clear, [0, 1], [1, 0]);

  const leftPos = align === 'left' ? '5%' : '55%';
  const drop = 'drop-shadow(3px 5px 6px rgba(0,0,0,0.9))';

  return (
    <AbsoluteFill style={{ zIndex: 5, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', left: leftPos, top,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        {/* Logo 1: Nvidia */}
        <div style={{ opacity: op1, filter: drop, transform: `scale(${scale1})`, transformOrigin: 'center center' }}>
          <Img src={src1} style={{ width: 120, height: 120, objectFit: 'contain' }} />
        </div>
        {/* + sign */}
        <div style={{
          opacity: opPlus, transform: `scale(${scalePlus})`, transformOrigin: 'center center',
          color: '#FFFFFF', fontSize: 64, fontWeight: 900, lineHeight: 1,
          textShadow: '0 0 20px rgba(255,255,255,0.8), 3px 3px 8px rgba(0,0,0,0.9)',
        }}>+</div>
        {/* Logo 2: SK */}
        <div style={{ opacity: op2, filter: drop, transform: `scale(${scale2})`, transformOrigin: 'center center' }}>
          <Img src={src2} style={{ width: 120, height: 120, objectFit: 'contain' }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── ARABIC TYPING CODE ───────────────────────────────────────────────────────
const TypingCode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = ['> جاري اختراق النظام...', '> تخطي جدار الحماية...', '> تم الوصول.', '> الصلاحيات: كاملة'];
  const totalChars = lines.join('\n').length;
  const charsToShow = Math.min(Math.floor(frame / 1.8), totalChars);
  const visible = lines.join('\n').slice(0, charsToShow);
  const fadeOut = spring({ frame: frame - (SCENE_FRAMES - 45), fps, config: { damping: 20, stiffness: 200 } });
  const opacity = interpolate(fadeOut, [0, 1], [1, 0]);

  return (
    <AbsoluteFill style={{ zIndex: 15, pointerEvents: 'none', opacity }}>
      <div dir="rtl" style={{
        position: 'absolute', right: '4%', top: '22%', width: 500,
        color: CYAN, fontFamily: 'monospace', fontSize: 32, fontWeight: 'bold',
        whiteSpace: 'pre', transform: 'rotate(4deg)',
        textShadow: `0 0 10px ${CYAN}`,
      }}>
        {visible}<span style={{ opacity: frame % 16 < 8 ? 1 : 0 }}>█</span>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE TRANSITION: HARD CUT with flash ───────────────────────────────────
// Real Vox does hard cuts. The whip effect between scenes is done in editing, not in the clip.
// We do a 3-frame flash-to-white cut instead — exactly how broadcast editorial works.
const SceneFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 3, 6], [0.8, 0.2, 0], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ zIndex: 200, backgroundColor: 'white', opacity, pointerEvents: 'none' }} />
  );
};

// ─── SCENE WRAPPER ────────────────────────────────────────────────────────────
interface SceneProps {
  charSrc: string;
  charSide: 'left' | 'right';
  keyword: string;
  subkeyword?: string;
  keywordColor?: string;
  assetSrc?: string;
  assetLeft?: string;
  logoSrc?: string;
  logo2Src?: string;
  logoInvert?: boolean;
  logoTop?: string;
  logoLeft?: string;
  logoEntryFrame?: number;
  assetRotation?: number;
  assetEntryFrame?: number;
  hasBarChart?: boolean;
  hasTypingCode?: boolean;
  useAssetGlitch?: boolean;
  useCharGlitch?: boolean;
  useNeuralNet?: boolean;
  useGlow?: boolean;
  targetSpot?: {x: string, y: string, color: string, delayFrames?: number, type?: 'radar' | 'dot' | 'crosshair'};
  chyronLabel?: string;
  chyronSource?: string;
  chyronBadge?: string;
  chyronDelay?: number;
  chyronMaskRTL?: boolean;
  tintColor?: string;
  isFirstScene?: boolean;
  targetColor?: string;
  colorShiftFrame?: number;
}

const Scene: React.FC<SceneProps> = ({
  charSrc, charSide, keyword, subkeyword,
  keywordColor = CYAN, assetSrc, assetLeft, logoSrc, logo2Src, logoInvert = false, logoTop, logoLeft, logoEntryFrame = 25,
  assetRotation, assetEntryFrame = 20, hasBarChart = false,
  hasTypingCode = false, useAssetGlitch = false, useCharGlitch = false, useGlow = false, useNeuralNet = false,
  chyronLabel, chyronSource, chyronBadge, chyronDelay, chyronMaskRTL, tintColor, isFirstScene = false,
  targetColor, colorShiftFrame, targetSpot
}) => {
  const assetSide = charSide === 'left' ? 'right' : 'left';

  return (
    <AbsoluteFill>
      {!isFirstScene && <SceneFlash />}
      <FPVBackground tintColor={tintColor} />
      <EditorialGrid />
      <DioramaOverlay />
      {logoSrc && !logo2Src && <CorporateLogo src={logoSrc} align={assetSide} invertWhite={logoInvert} top={logoTop} left={logoLeft} entryFrame={logoEntryFrame} />}
      {logoSrc && logo2Src && <DualLogo src1={logoSrc} src2={logo2Src} align={assetSide} top={logoTop} entryFrame={logoEntryFrame} />}
      <CharacterCutout src={charSrc} side={charSide} useGlitch={useCharGlitch} />
      {hasTypingCode && <TypingCode />}
      {hasBarChart && <DataBarChart align={assetSide} />}
      {assetSrc && (
        <NarrativeAsset
          src={assetSrc} align={assetSide} rotation={assetRotation} left={assetLeft}
          useGlitch={useAssetGlitch} useGlow={useGlow} entryFrame={assetEntryFrame}
          targetSpot={targetSpot}
        />
      )}
      <CensorBarText text={keyword} subtext={subkeyword} color={keywordColor} align={assetSide} targetColor={targetColor} colorShiftFrame={colorShiftFrame} />
      {chyronLabel && <NewsChyron label={chyronLabel} source={chyronSource} badgeText={chyronBadge} delayFrames={chyronDelay} isMaskRTL={chyronMaskRTL} />}
    </AbsoluteFill>
  );
};

// ─── MAIN COMPOSITION ─────────────────────────────────────────────────────────
export const AiNewsEpisode2: React.FC = () => {
  const MAZEN = staticFile('mazen-transparent_baked.webp');
  const MARIYA = staticFile('mariya-transparent_baked.webp');

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND_DARK, fontFamily: "'Cairo', sans-serif" }}>

      {/* S1: Terminal hack — Mazen */}
      <Sequence from={0} durationInFrames={SCENE_FRAMES}>
        <Scene
          isFirstScene={true}
          charSrc={staticFile('mazen-scene-1.png')} charSide="right"
          keyword="في خطر حقيقي" subkeyword="لو فاكر إن وظيفتك في أمان..."
          targetColor="#FF0000" colorShiftFrame={150}
          assetSrc={staticFile('assets/terminal_cutout_1784982738795_baked.webp')} assetRotation={-6}
          assetEntryFrame={22} hasTypingCode useAssetGlitch useCharGlitch
          tintColor="#FF1111"
          chyronLabel="الذكاء الاصطناعي يُهدِّد 40٪ من الوظائف العالمية" chyronSource="IMF · 2026"
        />
      </Sequence>

      {/* S2: Agentic AI — Mariya */}
      <Sequence from={SCENE_FRAMES} durationInFrames={SCENE_FRAMES}>
        <Scene
          charSrc={staticFile('mariya-scene-2.png')} charSide="left"
          keyword="الآلة تتصرف لوحدها" subkeyword="أوبن إيه آي — 21 يوليو" keywordColor={MAGENTA}
          assetSrc={staticFile('assets/server_cutout_1784982746545_baked.webp')}
          assetRotation={5} assetEntryFrame={120}
          logoSrc={staticFile('logos/huggingface.svg')} logoEntryFrame={180}
          tintColor="#6600FF"
          chyronLabel="وكلاء الذكاء الاصطناعي ينجزون مهام بشرية كاملة" chyronSource="OpenAI · يوليو 2026"
        />
      </Sequence>

      {/* S3: Apple lawsuit — Mazen */}
      <Sequence from={SCENE_FRAMES * 2} durationInFrames={SCENE_FRAMES}>
        <Scene
          charSrc={staticFile('mazen-scene-3.png')} charSide="right"
          keyword="آبل فتحت النار" subkeyword="دعوى قضائية ضد أوبن إيه آي"
          assetSrc={staticFile('assets/scale_cutout_1784982754485_baked.webp')}
          assetRotation={-4} assetEntryFrame={105}
          targetSpot={{ x: '50%', y: '50%', color: '#FF0000', delayFrames: 35, type: 'crosshair' }}
          logoSrc={staticFile('logos/apple.svg')} logoInvert
          tintColor="#0066FF"
          chyronLabel="آبل تُقاضي أوبن إيه آي على بيانات التدريب" chyronSource="Bloomberg · يوليو 2026"
        />
      </Sequence>

      {/* S4: Apple × Alibaba — Mariya */}
      <Sequence from={SCENE_FRAMES * 3} durationInFrames={SCENE_FRAMES}>
        <Scene
          charSrc={staticFile('mariya-scene-4.png')} charSide="left"
          keyword="ركعت في الصين" subkeyword="آبل × علي بابا" keywordColor={MAGENTA}
          assetSrc={staticFile('assets/globe_cutout_1784982763159_baked.webp')}
          assetRotation={6} assetEntryFrame={24}
          targetSpot={{ x: '56%', y: '45%', color: '#FF0000', delayFrames: 90 }}
          logoSrc={staticFile('logos/alibaba.svg')} logoEntryFrame={150}
          tintColor="#FF9900"
          chyronLabel="آبل تُدمج نماذج علي بابا في iOS بالصين" chyronSource="WSJ · يونيو 2026"
        />
      </Sequence>

      {/* S5: $500B Nvidia — Mazen */}
      <Sequence from={SCENE_FRAMES * 4} durationInFrames={SCENE_FRAMES}>
        <Scene
          charSrc={staticFile('mazen-scene-5.png')} charSide="right"
          keyword="نص تريليون دولار" subkeyword="إنفيديا × إس كيه — مصانع الذكاء"
          hasBarChart={true}
          logoSrc={staticFile('logos/nvidia.svg')}
          logo2Src={staticFile('logos/sk.svg')}
          logoTop="50%" logoEntryFrame={120}
          tintColor="#76B900"
          chyronLabel="إنفيديا تُبرم أضخم صفقة رقائق ذكاء اصطناعي في التاريخ" chyronSource="Reuters · 2026"
        />
      </Sequence>

      {/* S6: Gemini — Mariya */}
      <Sequence from={SCENE_FRAMES * 5} durationInFrames={SCENE_FRAMES}>
        <Scene
          charSrc={staticFile('mariya-scene-6.png')} charSide="left"
          keyword="جيمناي يقرأ كل شيء" subkeyword="جوجل جيمناي 3.5 برو" keywordColor={MAGENTA}
          assetSrc={staticFile('assets/brain_cutout_1784982780521_baked.webp')}
          assetLeft="64%"
          assetRotation={4} assetEntryFrame={180}
          useGlow={true} useNeuralNet={true}
          logoSrc={staticFile('logos/google.svg')} logoEntryFrame={120} logoLeft="81.5%"
          tintColor="#00CCFF"
          chyronLabel="جيمناي 3.5 برو يتصدر كل المعايير الدولية" chyronSource="Google DeepMind · 2026"
        />
      </Sequence>

      {/* S7: Robot replacement — Mazen + Radiating Eye */}
      <Sequence from={SCENE_FRAMES * 6} durationInFrames={SCENE_FRAMES}>
        <Scene
          charSrc={staticFile('mazen-scene-7.png')} charSide="right"
          keyword="إحنا بنتستبدل" subkeyword="مؤتمر شنغهاي — جيش الروبوتات"
          assetSrc={staticFile('assets/robot_cutout_1784982789698_baked.webp')}
          assetRotation={-6} assetEntryFrame={22}
          targetSpot={{ x: '64%', y: '47%', color: '#FF0000', delayFrames: 135, type: 'radar' }} useAssetGlitch
          tintColor="#00FF33"
          chyronLabel="شنغهاي 2026: عرض مليون روبوت صناعي خلال 3 سنوات" chyronSource="Reuters · يوليو 2026"
        />
      </Sequence>

      {/* S8: Endgame — Mariya — FIXED: globe not scale (scale used in S3) */}
      <Sequence from={SCENE_FRAMES * 7} durationInFrames={SCENE_FRAMES}>
        <Scene
          charSrc={staticFile('mariya-scene-8.png')} charSide="left"
          keyword="نهاية اللعبة" subkeyword="اختار: ملايين أو تختفى" keywordColor={MAGENTA}
          assetSrc={staticFile('assets/cpu_cutout_1784982772063_baked.webp')}
          assetRotation={8} assetEntryFrame={90} useAssetGlitch
          chyronLabel="صندوق النقد الدولي: 85 مليون وظيفة ستتأثر جذرياً بالذكاء الاصطناعي" chyronSource="IMF · 2026"
        />
      </Sequence>

      {/* S9: Subscribe CTA — Mazen — NO asset, pure character power */}
      <Sequence from={SCENE_FRAMES * 8} durationInFrames={SCENE_FRAMES}>
        <Scene
          charSrc={staticFile('mazen-scene-9.png')} charSide="right"
          keyword="اشترك الآن 🔔" subkeyword="لأن منافسينك سبقوك بالفعل"
          targetColor="#FF0000" colorShiftFrame={45}
          tintColor="#FF4444"
          chyronLabel="انتظرونا كل اسبوع — كن أول من يعرف"
          chyronDelay={95} chyronMaskRTL={true}
        />
      </Sequence>

    </AbsoluteFill>
  );
};
