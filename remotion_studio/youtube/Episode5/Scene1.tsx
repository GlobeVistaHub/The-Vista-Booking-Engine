import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  spring,
  interpolateColors
} from 'remotion';
import { AnamorphicWhipPan } from '../Episode3/AnamorphicWhipPan';
import { BrandOutroHorizontal } from '../Episode3/BrandOutroHorizontal';

const CYAN = "#00E5CC";
const RED = "#FF3333";
const AMBER = "#FFB300";
const MAGENTA = "#FF0055";

// ── EPISODE 4 CORE TEXTURE ENGINE (DIORAMA HALFTONE & SVG PAPER NOISE) ──
const GlobalTexture: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999, mixBlendMode: "overlay", opacity: 0.05 }}>
    <div style={{ width: "100%", height: "100%", backgroundImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>')` }} />
  </AbsoluteFill>
);

const DioramaOverlay: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 90, mixBlendMode: "multiply" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #1a1a1a 1px, transparent 1px)", backgroundSize: "5px 5px", opacity: 0.25 }} />
  </AbsoluteFill>
);

// ── 8-FRAME CHROMATIC ABERRATION SPIKE ENGINE ──
const CharacterCA3D: React.FC<{ imgSrc: string; caX: number }> = ({ imgSrc, caX }) => {
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.85,
        filter: 'sepia(1) hue-rotate(-50deg) saturate(8)',
        transform: `translateX(${caX}px)`
      }}>
        <img src={imgSrc} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} alt="" />
      </div>
      <div style={{
        position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.85,
        filter: 'sepia(1) hue-rotate(150deg) saturate(8)',
        transform: `translateX(${-caX}px)`
      }}>
        <img src={imgSrc} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} alt="" />
      </div>
    </>
  );
};

// ── SHOT 1: 3D BACKGROUND CHATBOT WALL SCREEN (DEEP ON WALL Z=-1400px - ZERO INTERFERENCE WITH MAZEN) ──
const BackgroundChatbotScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const F_POSE2 = 240;
  if (frame >= F_POSE2) return null;

  // Kinetic Headline with atomic word-level reveal (Zero ligature jitter or bidi flip on cursive Arabic):
  const headlineWords = [
    { text: "أقنعونا", frame: 168 },
    { text: "أن", frame: 171 },
    { text: "الذكاء", frame: 174 },
    { text: "الاصطناعي", frame: 178 },
    { text: "مجرد", frame: 182 },
    { text: "شات", frame: 186 },
    { text: "بوت...", frame: 190 },
  ];

  // Text Box visual entrance spring starts at frame 188:
  const textBoxSpring = spring({
    frame: Math.max(0, frame - 188),
    fps: 30,
    config: { damping: 12, stiffness: 100, mass: 1.5 }
  });
  const textBoxScale = interpolate(textBoxSpring, [0, 1], [0.65, 1]);
  const textBoxOpacity = interpolate(frame, [188, 198], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Cinematic optical motion blur applied to the headline while HUD accelerates towards camera (frames 168 - 198) before 1.0s freeze:
  const headlineMotionBlur = frame >= 168 && frame < 198
    ? interpolate(frame, [168, 178, 192, 198], [0, 3.5, 1.8, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      })
    : 0;

  // Glitching through into the next pose right after the 1.0s freeze (frames 228 - 240) - Original high-energy electronic breach jiggle:
  const isGlitch = frame >= 228 && frame < 240;
  const glitchX = isGlitch ? ((frame * 29) % 27) - 13 : 0;
  const glitchY = isGlitch ? ((frame * 19) % 19) - 9 : 0;
  const glitchRot = isGlitch ? ((frame * 13) % 9) - 4 : 0;

  // Dissolve as camera plunges right through the screen plane
  const punchThroughDissolve = interpolate(frame, [230, 240], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const opacity = interpolate(
    frame,
    [0, 15],
    [0.88, 0.96],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  ) * punchThroughDissolve;

  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: 1550,
      height: 820,
      marginLeft: -775,
      marginTop: -410,
      transform: `translateZ(-1400px) translateX(${glitchX}px) translateY(${glitchY}px) rotateZ(${glitchRot}deg)`,
      transformStyle: 'preserve-3d',
      boxSizing: 'border-box',
      opacity,
      background: 'linear-gradient(135deg, rgba(3, 14, 25, 0.88) 0%, rgba(1, 6, 12, 0.85) 100%)',
      border: `2px solid ${isGlitch ? RED : 'rgba(0, 229, 204, 0.5)'}`,
      borderRadius: 44,
      padding: '44px 52px',
      boxShadow: `inset 0 0 90px ${isGlitch ? 'rgba(255, 51, 51, 0.35)' : 'rgba(0, 229, 204, 0.18)'}, 0 35px 90px rgba(0, 0, 0, 0.95)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      zIndex: 20,
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      {/* ── TOP HEADER STATUS BAR ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '3px solid rgba(255,255,255,0.14)', paddingBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            backgroundColor: isGlitch ? RED : CYAN,
            boxShadow: `0 0 18px ${isGlitch ? RED : CYAN}`
          }} />
          <div style={{ color: '#FFF', fontSize: 20, fontFamily: 'monospace', fontWeight: 900, letterSpacing: 1.2 }}>
            {isGlitch ? "OVERRIDE_DETECTED // BREACH_IN_PROGRESS" : "SYSTEM_STATE: CHATBOT_SANDBOX [RESTRICTED]"}
          </div>
        </div>
        <div style={{ color: CYAN, fontSize: 18, fontFamily: 'monospace', fontWeight: 700, opacity: 0.85 }}>
          TERMINAL::EP05_CORE
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', justifyContent: 'space-between', marginTop: 24 }}>
        {/* Kinetic Headline with Pre-allocated Atomic Word Flow (Zero ligature jitter + cinematic motion blur during camera surge) */}
        <div style={{
          color: '#FFFFFF',
          fontSize: 52,
          fontFamily: "'Cairo', 'Tajawal', sans-serif",
          fontWeight: 900,
          direction: 'rtl',
          lineHeight: 1.35,
          minHeight: 155,
          textShadow: '3px 3px 0px #003366, 6px 6px 0px #001133, 0 0 40px rgba(0, 229, 204, 0.75)',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
          transform: 'translateZ(0)',
          filter: headlineMotionBlur > 0.05 ? `blur(${headlineMotionBlur.toFixed(2)}px)` : 'none'
        }}>
          {headlineWords.map((w, i) => {
            const isVisible = frame >= w.frame;
            return (
              <React.Fragment key={i}>
                <span
                  style={{
                    opacity: isVisible ? 1 : 0,
                    display: 'inline',
                  }}
                >
                  {w.text}
                </span>
                {i < headlineWords.length - 1 && ' '}
              </React.Fragment>
            );
          })}
        </div>

        {/* Interactive Chat Box Container (Visualizing "مساعد ذكي عايش جوه مربع نص") */}
        <div style={{
          opacity: textBoxOpacity,
          transform: `scale(${textBoxScale})`,
          transformOrigin: 'center center',
          background: 'linear-gradient(180deg, rgba(0, 25, 38, 0.95) 0%, rgba(2, 10, 18, 0.95) 100%)',
          border: `2px solid ${isGlitch ? RED : 'rgba(0, 229, 204, 0.7)'}`,
          borderRadius: 28,
          padding: '28px 34px',
          boxShadow: `0 20px 50px rgba(0, 0, 0, 0.85), inset 0 0 35px ${isGlitch ? 'rgba(255, 51, 51, 0.2)' : 'rgba(0, 229, 204, 0.15)'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          marginTop: 14,
          marginBottom: 12
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{
              color: AMBER,
              fontSize: 30,
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 900,
              direction: 'rtl',
              textShadow: `0 0 24px ${AMBER}`
            }}>
              مساعد ذكي عايش جوه مربع نص
            </div>
            <div style={{
              padding: '6px 16px',
              borderRadius: 20,
              background: isGlitch ? 'rgba(255, 51, 51, 0.25)' : 'rgba(0, 229, 204, 0.15)',
              border: `1.5px solid ${isGlitch ? RED : CYAN}`,
              color: isGlitch ? RED : CYAN,
              fontSize: 15,
              fontFamily: 'monospace',
              fontWeight: 800
            }}>
              {isGlitch ? "FAILING..." : "BOX_BOUND [PASSIVE]"}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderRadius: 16,
            backgroundColor: 'rgba(0, 10, 18, 0.85)',
            border: '1.5px solid rgba(255, 255, 255, 0.18)'
          }}>
            <div style={{
              color: 'rgba(255, 255, 255, 0.75)',
              fontFamily: 'monospace',
              fontSize: 24,
              letterSpacing: 1
            }}>
              [ PROMPT: اكتب سؤالك هنا... <span style={{ color: CYAN, opacity: frame % 12 < 6 ? 1 : 0 }}>|</span> ]
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: `radial-gradient(circle, ${CYAN} 30%, transparent 70%)`,
                border: `2px solid ${CYAN}`,
                transform: `translateX(${Math.sin(frame * 0.25) * 8}px)`,
                boxShadow: `0 0 20px ${CYAN}`
              }} />
              <span style={{ color: CYAN, fontFamily: 'monospace', fontSize: 16, fontWeight: 800 }}>LOCKED</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 28, fontSize: 17, fontFamily: 'monospace', color: 'rgba(255,255,255,0.55)' }}>
            <div>READ_ONLY: <span style={{ color: '#00E5CC' }}>YES</span></div>
            <div>CAN_EXECUTE_CODE: <span style={{ color: RED }}>FORBIDDEN</span></div>
            <div>AUTONOMOUS_DAEMON: <span style={{ color: RED }}>BLOCKED</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── SHOT 2: 3D CLAUDE 3.5 & n8n AUTONOMOUS AGENTS STUDIO WALL HUD (0:08 - 0:18 / POSE 2) ──
const N8nClaudeStudioHUD: React.FC<{ exitFrame: number }> = ({ exitFrame }) => {
  const frame = useCurrentFrame();
  const F_POSE2 = 240;
  if (frame < F_POSE2 || frame >= exitFrame) return null;

  // Animation Triggers (Ultra-smooth, jitter-free cubic easing - zero spring ringing):
  // Headline entrance @ F_POSE2 (240 / 00:08.00):
  const headlineProgress = interpolate(frame, [F_POSE2, F_POSE2 + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });
  const headlineScale = interpolate(headlineProgress, [0, 1], [1.06, 1]);
  const headlineBlur = interpolate(headlineProgress, [0, 1], [6, 0]);

  // Everything below October 2026 animates dynamically starting @ 00:09.10 (frame 280 / "الصناعة كلها"):
  const F_CLAUDE_START = 280;
  const brandProgress = interpolate(frame, [F_CLAUDE_START, F_CLAUDE_START + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });
  const brandOpacity = interpolate(brandProgress, [0, 1], [0, 1]);
  const brandTranslateX = interpolate(brandProgress, [0, 1], [-14, 0]);
  const brandScale = interpolate(brandProgress, [0, 1], [0.96, 1]);

  // Subtitle protocol entrance @ frame 292:
  const F_SUBTITLE_START = 292;
  const subProgress = interpolate(frame, [F_SUBTITLE_START, F_SUBTITLE_START + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });
  const subOpacity = interpolate(subProgress, [0, 1], [0, 1]);
  const subTranslateY = interpolate(subProgress, [0, 1], [10, 0]);

  // Telemetry row entrances staggered starting @ frame 302:
  const F_TELEMETRY_START = 302;

  // Kinetic Typewriter entrance of "عصر المساعد الذكي انتهى" strictly @ 00:12.15 (frame 375) while Mazen says it:
  const F_ASR_START = 375; // 00:12.15 (spoken until 00:14.07 / frame 427)
  const punchText = "عصر المساعد الذكي انتهى";
  const charsTyped = frame < F_ASR_START
    ? 0
    : Math.min(punchText.length, Math.floor((frame - F_ASR_START) / 1.8));
  const typedPunch = punchText.slice(0, charsTyped);

  // ── PHASE 2: MASTER FULL-CANVAS TAKEOVER (0:14.12 - 0:19.02 / frames 432 - 572) ──
  // Starts strictly @ 00:14.12 right after Mazen completes "عصر المساعد الذكي انتهى"
  const F_TAKEOVER = 432;
  const isTakeover = frame >= F_TAKEOVER;
  const takeoverProgress = interpolate(frame, [F_TAKEOVER, F_TAKEOVER + 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic)
  });

  const cardOpacity = frame < exitFrame
    ? interpolate(frame, [F_POSE2, F_POSE2 + 12], [0, 0.98], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Dynamic container geometry: morphs from tilted wall card (42% width) to immersive full canvas (100% width)
  const hudLeft = interpolate(takeoverProgress, [0, 1], [4.5, 0]);
  const hudTop = interpolate(takeoverProgress, [0, 1], [16, 0]);
  const hudWidth = interpolate(takeoverProgress, [0, 1], [42, 100]);
  const hudHeight = interpolate(takeoverProgress, [0, 1], [66, 100]);
  const hudRadius = interpolate(takeoverProgress, [0, 1], [40, 0]);
  const hudRotY = interpolate(takeoverProgress, [0, 1], [18, 0]);
  const hudRotX = interpolate(takeoverProgress, [0, 1], [2, 0]);
  const hudBorderWidth = interpolate(takeoverProgress, [0, 1], [2, 0]);

  // Butter-smooth continuous padding, shadow, and border transitions (eliminates layout pops & snap jitters)
  const padY = interpolate(takeoverProgress, [0, 1], [30, 24]);
  const padX = interpolate(takeoverProgress, [0, 1], [36, 44]);
  const shadowFade = interpolate(takeoverProgress, [0.35, 0.85], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const borderAlpha = interpolate(takeoverProgress, [0.5, 0.95], [0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase A (wall card content) fades out as takeover expands
  const phaseAOpacity = interpolate(takeoverProgress, [0, 0.45], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  // Phase B (full workflow architecture) fades in
  const phaseBOpacity = interpolate(takeoverProgress, [0.35, 0.9], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <div style={{
      position: 'absolute',
      left: `${hudLeft}%`,
      top: `${hudTop}%`,
      width: `${hudWidth}%`,
      height: `${hudHeight}%`,
      boxSizing: 'border-box',
      opacity: cardOpacity,
      background: 'linear-gradient(180deg, rgba(2, 9, 18, 0.98) 0%, rgba(1, 4, 10, 0.99) 100%)',
      border: `${hudBorderWidth}px solid rgba(0, 229, 204, ${borderAlpha})`,
      borderRadius: hudRadius,
      padding: `${padY}px ${padX}px`,
      boxShadow: shadowFade > 0.01 ? `inset 0 0 ${90 * shadowFade}px rgba(0, 229, 204, ${0.18 * shadowFade}), 0 ${40 * shadowFade}px ${90 * shadowFade}px rgba(0, 0, 0, ${0.95 * shadowFade})` : 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      transform: `perspective(1200px) rotateY(${hudRotY}deg) rotateX(${hudRotX}deg) translateZ(0)`,
      zIndex: 40,
      overflow: 'hidden',
      willChange: 'transform, opacity'
    }}>
      {/* ── PHASE A: INITIAL WALL CARD VIEW (Frames 240 - 432) ── */}
      {phaseAOpacity > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          opacity: phaseAOpacity,
          pointerEvents: phaseAOpacity > 0.5 ? 'auto' : 'none',
          position: 'absolute',
          inset: 0,
          padding: '30px 36px',
          boxSizing: 'border-box'
        }}>
          {/* Top Header Status Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '2.5px solid rgba(255,255,255,0.14)', paddingBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                backgroundColor: CYAN,
                boxShadow: `0 0 16px ${CYAN}`
              }} />
              <div style={{ color: '#FFF', fontSize: 16, fontFamily: 'monospace', fontWeight: 900, letterSpacing: 1.0 }}>
                SYSTEM: AUTONOMOUS_DAEMON [OVERRIDE_ACTIVE]
              </div>
            </div>
            <div style={{ color: CYAN, fontSize: 16, fontFamily: 'monospace', fontWeight: 800, opacity: 0.9, paddingRight: 6 }}>
              TERMINAL::EP05_CORE
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', marginTop: 14 }}>
            {/* Kinetic Headline: Original location next to October 2026 with Typewriter Effect @ 00:12.15 */}
            <div style={{
              color: '#FFFFFF',
              fontSize: 36,
              fontFamily: "'Cairo', 'Tajawal', sans-serif",
              fontWeight: 900,
              direction: 'rtl',
              lineHeight: 1.35,
              paddingRight: 10,
              textShadow: '0 4px 18px rgba(0, 25, 50, 0.9), 0 0 35px rgba(0, 229, 204, 0.7)',
              transform: `scale(${headlineScale})`,
              filter: headlineBlur > 0.1 ? `blur(${headlineBlur}px)` : 'none',
              transformOrigin: 'right center',
              willChange: 'transform, opacity'
            }}>
              <span>في أكتوبر 2026:</span>
              {frame >= F_ASR_START && (
                <>
                  {' '}
                  <span style={{ color: CYAN, textShadow: `0 0 25px ${CYAN}` }}>
                    {typedPunch}
                  </span>
                  {charsTyped < punchText.length && (
                    <span style={{ color: CYAN, opacity: frame % 8 < 4 ? 1 : 0, fontWeight: 300 }}> |</span>
                  )}
                </>
              )}
            </div>

            {/* Brand & Extruded Logo Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              borderBottom: '2.5px solid rgba(255,255,255,0.18)',
              paddingBottom: 14,
              marginTop: 12,
              width: '100%',
              opacity: brandOpacity,
              transform: `translateX(${brandTranslateX}px) scale(${brandScale})`,
              transformOrigin: 'left center',
              willChange: 'transform, opacity'
            }}>
              <div style={{ position: 'relative', width: 72, height: 72, perspective: 800, marginLeft: 10, marginRight: 6, flexShrink: 0 }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${frame * 3}deg)`,
                }}>
                  {[...Array(6)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{
                      position: 'absolute', inset: 0, width: 62, height: 62, top: 5, left: 5,
                      transform: `translateZ(${i * -2.5}px)`,
                      filter: i === 0 ? `drop-shadow(0 0 15px ${CYAN})` : 'none',
                    }}>
                      <rect x="2" y="2" width="12" height="12" rx="3" fill={i === 0 ? AMBER : '#996600'} />
                      <rect x="18" y="2" width="12" height="12" rx="3" fill={i === 0 ? CYAN : '#007766'} />
                      <rect x="2" y="18" width="12" height="12" rx="3" fill={i === 0 ? CYAN : '#007766'} />
                      <rect x="18" y="18" width="12" height="12" rx="3" fill={i === 0 ? RED : '#991111'} />
                      <circle cx="16" cy="16" r="4" fill="#FFFFFF" />
                    </svg>
                  ))}
                </div>
              </div>

              <div style={{
                color: '#FFF', fontSize: 50, fontWeight: 900, fontFamily: 'monospace', letterSpacing: -1.2,
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 229, 204, 0.45)',
                willChange: 'transform, opacity'
              }}>
                CLAUDE<span style={{ fontSize: 34, opacity: 0.8, color: CYAN }}>::n8n</span>
              </div>
            </div>

            {/* Subtitle Protocol */}
            <div style={{
              color: CYAN, fontSize: 24, fontFamily: "'Cairo', sans-serif", marginTop: 10, fontWeight: 900,
              textShadow: `0 0 25px ${CYAN}`, direction: 'rtl', alignSelf: 'flex-end',
              paddingRight: 10,
              opacity: subOpacity,
              transform: `translateY(${subTranslateY}px)`
            }}>
              بروتوكول الوكلاء المستقلين (Autonomous Agents)
            </div>

            {/* Key-Value Pipeline Telemetry */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 9,
              marginTop: 10,
              width: '100%',
              paddingLeft: 24,
              paddingRight: 12,
              boxSizing: 'border-box'
            }}>
              {[
                { label: 'AGENT:', val: 'CLAUDE_3.5_SONNET', color: CYAN, glow: true },
                { label: 'PIPELINE:', val: 'n8n_AUTONOMOUS_CORE', color: AMBER, glow: true },
                { label: 'DAEMON:', val: 'python daemon.py --stealth --24x7', color: '#FFF', glow: false },
                { label: 'STATUS:', val: 'ACTIVE_UNSUPERVISED [100%]', color: RED, glow: true },
              ].map((row, idx) => {
                const rowStart = F_TELEMETRY_START + idx * 8;
                const rowOpacity = interpolate(frame, [rowStart, rowStart + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                const rowTranslateX = interpolate(frame, [rowStart, rowStart + 8], [-10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
                return (
                  <div key={idx} style={{
                    display: 'flex', gap: 14, alignItems: 'center',
                    opacity: rowOpacity,
                    transform: `translateX(${rowTranslateX}px)`
                  }}>
                    <div style={{ color: '#FFF', fontSize: 19, fontFamily: 'monospace', opacity: 0.85, fontWeight: 900, minWidth: 95 }}>{row.label}</div>
                    <div style={{
                      color: row.color,
                      fontSize: 19,
                      fontFamily: 'monospace',
                      fontWeight: 900,
                      textShadow: row.glow ? `0 0 16px ${row.color}` : 'none'
                    }}>
                      {row.val}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── PHASE B: MASTER FULL-CANVAS AUTONOMOUS AGENT MANIFESTATION (Frames 432 - 571) ── */}
      {phaseBOpacity > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          opacity: phaseBOpacity,
          position: 'absolute',
          inset: 0,
          padding: '28px 48px',
          boxSizing: 'border-box',
          justifyContent: 'space-between'
        }}>
          {/* 1. Global Master Cyber Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '2.5px solid rgba(0, 229, 204, 0.35)', paddingBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                backgroundColor: '#00FF88',
                boxShadow: '0 0 18px #00FF88',
                transform: `scale(${frame % 14 < 7 ? 1.2 : 0.9})`
              }} />
              <div style={{ color: '#FFF', fontSize: 24, fontFamily: 'monospace', fontWeight: 900, letterSpacing: 1.2 }}>
                AUTONOMOUS_MATRIX // ZERO_HUMAN_IN_THE_LOOP [EXECUTION_ACTIVE]
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ color: AMBER, fontSize: 20, fontFamily: 'monospace', fontWeight: 800 }}>
                PIPELINE: CLAUDE_3.5_SONNET::n8n_SWARM
              </div>
              <div style={{
                padding: '7px 18px', borderRadius: 16, background: 'rgba(0, 229, 204, 0.15)',
                border: `1.5px solid ${CYAN}`, color: CYAN, fontSize: 19, fontFamily: 'monospace', fontWeight: 800
              }}>
                CLOCK: {(frame / 30).toFixed(2)}s
              </div>
            </div>
          </div>

          {/* 2. Headline & Subtitle Banner (Elevating Mazen's exact script) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', marginTop: 8 }}>
            <div style={{
              color: '#FFFFFF',
              fontSize: 50,
              fontFamily: "'Cairo', 'Tajawal', sans-serif",
              fontWeight: 900,
              direction: 'rtl',
              letterSpacing: 2,
              textShadow: `0 0 25px ${CYAN}, 0 0 50px rgba(0, 229, 204, 0.65), 0 8px 30px rgba(0,0,0,0.9)`
            }}>
              عصر الوكلاء المستقلين // AUTONOMOUS AGENTS
            </div>
            <div style={{
              color: AMBER,
              fontSize: 28,
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 800,
              direction: 'rtl',
              marginTop: 4,
              textShadow: `0 0 18px ${AMBER}`
            }}>
              برامج مربوطة بالنماذج الكبيرة — متصممة عشان تشتغل وتنفذ بدالك في الخلفية 24/7
            </div>
          </div>

          {/* 3. The 4-Node Live Workflow Architecture Canvas (n8n + Claude Swarm) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 10px', marginTop: 10 }}>
            {/* NODE 1: Trigger / Cron */}
            <div style={{
              flex: 1,
              padding: '20px 22px',
              borderRadius: 20,
              background: 'linear-gradient(180deg, rgba(10, 24, 38, 0.9) 0%, rgba(3, 10, 18, 0.95) 100%)',
              border: `2px solid ${AMBER}`,
              boxShadow: `0 15px 35px rgba(0,0,0,0.8), inset 0 0 25px rgba(255, 179, 0, 0.2)`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ color: AMBER, fontSize: 17, fontFamily: 'monospace', fontWeight: 900 }}>NODE 01</span>
                <span style={{ padding: '3px 10px', borderRadius: 10, background: 'rgba(255,179,0,0.2)', color: AMBER, fontSize: 14.5, fontFamily: 'monospace', fontWeight: 800 }}>TRIGGER</span>
              </div>
              <div style={{ color: '#FFF', fontSize: 26, fontFamily: 'monospace', fontWeight: 900 }}>CRON_DAEMON</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, fontFamily: 'monospace', fontWeight: 700, marginTop: 4 }}>cron(0 * * * *) // 24x7</div>
              <div style={{ color: '#00FF88', fontSize: 17.5, fontFamily: 'monospace', fontWeight: 800, marginTop: 6 }}>● LISTENER_ACTIVE</div>
            </div>

            {/* CONNECTOR 1 */}
            <div style={{ width: 45, height: 3, position: 'relative', background: 'rgba(0, 229, 204, 0.4)', margin: '0 6px' }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%', background: CYAN,
                position: 'absolute', top: -5.5,
                left: `${(frame * 2.5) % 45}px`,
                boxShadow: `0 0 16px ${CYAN}`
              }} />
            </div>

            {/* NODE 2: Claude 3.5 Sonnet Brain */}
            <div style={{
              flex: 1.15,
              padding: '20px 22px',
              borderRadius: 20,
              background: 'linear-gradient(180deg, rgba(3, 28, 42, 0.95) 0%, rgba(1, 14, 22, 0.95) 100%)',
              border: `2.5px solid ${CYAN}`,
              boxShadow: `0 15px 35px rgba(0,0,0,0.85), inset 0 0 35px rgba(0, 229, 204, 0.25)`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ color: CYAN, fontSize: 17, fontFamily: 'monospace', fontWeight: 900 }}>NODE 02 // BRAIN</span>
                <span style={{ padding: '3px 10px', borderRadius: 10, background: 'rgba(0,229,204,0.2)', color: CYAN, fontSize: 14.5, fontFamily: 'monospace', fontWeight: 800 }}>LLM CORE</span>
              </div>
              <div style={{ color: '#FFF', fontSize: 27, fontFamily: 'monospace', fontWeight: 900 }}>CLAUDE_3.5_SONNET</div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, fontFamily: 'monospace', fontWeight: 700, marginTop: 4 }}>REASONING: AUTONOMOUS_AGENTS</div>
              <div style={{ color: CYAN, fontSize: 17.5, fontFamily: 'monospace', fontWeight: 800, marginTop: 6 }}>● STREAMING_TOKENS</div>
            </div>

            {/* CONNECTOR 2 */}
            <div style={{ width: 45, height: 3, position: 'relative', background: 'rgba(255, 179, 0, 0.4)', margin: '0 6px' }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%', background: AMBER,
                position: 'absolute', top: -5.5,
                left: `${(frame * 2.5) % 45}px`,
                boxShadow: `0 0 16px ${AMBER}`
              }} />
            </div>

            {/* NODE 3: n8n Pipeline Router */}
            <div style={{
              flex: 1,
              padding: '20px 22px',
              borderRadius: 20,
              background: 'linear-gradient(180deg, rgba(28, 14, 3, 0.9) 0%, rgba(14, 6, 1, 0.95) 100%)',
              border: '2px solid #FF6600',
              boxShadow: '0 15px 35px rgba(0,0,0,0.8), inset 0 0 25px rgba(255, 102, 0, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ color: '#FF6600', fontSize: 17, fontFamily: 'monospace', fontWeight: 900 }}>NODE 03</span>
                <span style={{ padding: '3px 10px', borderRadius: 10, background: 'rgba(255,102,0,0.2)', color: '#FF6600', fontSize: 14.5, fontFamily: 'monospace', fontWeight: 800 }}>ROUTER</span>
              </div>
              <div style={{ color: '#FFF', fontSize: 26, fontFamily: 'monospace', fontWeight: 900 }}>n8n_ORCHESTRATOR</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, fontFamily: 'monospace', fontWeight: 700, marginTop: 4 }}>3 PARALLEL BRANCHES</div>
              <div style={{ color: '#FF6600', fontSize: 17.5, fontFamily: 'monospace', fontWeight: 800, marginTop: 6 }}>● DISPATCHING_TOOLS</div>
            </div>

            {/* CONNECTOR 3 */}
            <div style={{ width: 45, height: 3, position: 'relative', background: 'rgba(0, 255, 136, 0.4)', margin: '0 6px' }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%', background: '#00FF88',
                position: 'absolute', top: -5.5,
                left: `${(frame * 2.5) % 45}px`,
                boxShadow: `0 0 16px #00FF88`
              }} />
            </div>

            {/* NODE 4: Background Stealth Daemon */}
            <div style={{
              flex: 1,
              padding: '20px 22px',
              borderRadius: 20,
              background: 'linear-gradient(180deg, rgba(3, 26, 14, 0.9) 0%, rgba(1, 12, 6, 0.95) 100%)',
              border: '2px solid #00FF88',
              boxShadow: '0 15px 35px rgba(0,0,0,0.8), inset 0 0 25px rgba(0, 255, 136, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ color: '#00FF88', fontSize: 17, fontFamily: 'monospace', fontWeight: 900 }}>NODE 04</span>
                <span style={{ padding: '3px 10px', borderRadius: 10, background: 'rgba(0,255,136,0.2)', color: '#00FF88', fontSize: 14.5, fontFamily: 'monospace', fontWeight: 800 }}>EXECUTION</span>
              </div>
              <div style={{ color: '#FFF', fontSize: 26, fontFamily: 'monospace', fontWeight: 900 }}>STEALTH_DAEMON</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, fontFamily: 'monospace', fontWeight: 700, marginTop: 4 }}>python daemon.py --stealth</div>
              <div style={{ color: '#00FF88', fontSize: 17.5, fontFamily: 'monospace', fontWeight: 900, marginTop: 6 }}>● 100% UNSUPERVISED</div>
            </div>
          </div>

          {/* 4. Live Forensic Terminal Console (Streaming live code logs synced to Mazen's VO) */}
          <div style={{
            width: '100%',
            borderRadius: 18,
            backgroundColor: 'rgba(1, 8, 16, 0.92)',
            border: '1.5px solid rgba(0, 229, 204, 0.35)',
            padding: '16px 26px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
            marginTop: 8
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 6 }}>
              <span style={{ color: CYAN, fontSize: 20, fontFamily: 'monospace', fontWeight: 900 }}>LIVE_AGENT_STREAM::DAEMON_LOGS</span>
              <span style={{ color: '#FFF', fontSize: 17, fontFamily: 'monospace', opacity: 0.75 }}>BUFFER: 512KB // REAL_TIME_FORENSIC</span>
            </div>

            {[
              { f: 440, text: '> [00:14.20] MISSION_RECEIVED: "تراقب، تبيع، تقفل صفقات، وتخترق أنظمة في الخلفية وأنت نايم"', color: '#FFF' },
              { f: 466, text: '> [00:15.16] REASONING_ENGINE: Claude 3.5 Sonnet generating autonomous decision tree... [OK]', color: CYAN },
              { f: 492, text: '> [00:16.12] TOOL_DISPATCH: [BrowserAgent, FileSystemWriter, CloudAPI] -> DISPATCHED', color: AMBER },
              { f: 516, text: '> [00:17.06] HUMAN_SUPERVISION_STATUS: [BYPASSED -- STRICT ZERO_SUPERVISION MODE]', color: RED },
              { f: 538, text: '> [00:17.28] DAEMON_EXECUTION: Transactions executed, systems monitored 24/7 in background.', color: '#00FF88' },
              { f: 558, text: '> [00:18.18] TASK_COMPLETE: 100% AUTONOMOUS SUCCESS // PROCEEDING TO HERO PHASE', color: CYAN },
            ].map((log, lIdx) => {
              if (frame < log.f) return null;
              return (
                <div key={lIdx} style={{
                  color: log.color,
                  fontSize: 21.5,
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  letterSpacing: 0.7,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>
                  <span>{log.text}</span>
                  {lIdx === 5 && (
                    <span style={{ color: CYAN, opacity: frame % 10 < 5 ? 1 : 0 }}>_</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ACTIVE SCANNING LASER (CYAN BEFORE 00:14.18, TURNS SIGNATURE MAGENTA @ 00:14.18 / FRAME 438) ── */}
      {(() => {
        const F_LASER_MAGENTA = 438; // 00:14.18 (exact cue when laser turns magenta)
        const isMagenta = frame >= F_LASER_MAGENTA;
        const laserColor = isMagenta ? MAGENTA : CYAN;
        const laserGlow = isMagenta
          ? (frame < F_LASER_MAGENTA + 5 ? '0 0 40px 12px rgba(255, 0, 85, 0.95)' : '0 0 30px 8px rgba(255, 0, 85, 0.85)')
          : '0 0 30px 8px rgba(0, 229, 204, 0.85)';

        return (
          <div style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            height: 3,
            backgroundColor: laserColor,
            boxShadow: laserGlow,
            top: `${(frame * 1.6) % 100}%`,
            opacity: 0.9,
            zIndex: 50,
            pointerEvents: 'none'
          }} />
        );
      })()}
    </div>
  );
};

// ── ANALOG REEL-TO-REEL ROTATING SPOOL OVERLAY (HORIZONTALLY TILTED & ALIGNED) ──
const RotatingTapeReel: React.FC<{ frame: number }> = ({ frame }) => {
  // Oscillates and spins dynamically matching Mazen's scrub rhythm
  const reelAngle = Math.sin(frame * 0.22) * 110 + frame * 9;

  return (
    <div style={{
      position: 'absolute',
      left: 365,
      top: 990,
      width: 460,
      height: 460,
      pointerEvents: 'none',
      zIndex: 15,
      mixBlendMode: 'screen',
      opacity: 0.9,
      transformStyle: 'preserve-3d',
      transform: `translate(-50%, -50%) rotateZ(-3deg) rotateX(76deg) rotateZ(${reelAngle}deg)`,
      transformOrigin: 'center center'
    }}>
      <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%' }}>
        {/* Outer Rim */}
        <circle cx="200" cy="200" r="192" fill="none" stroke="rgba(220, 235, 245, 0.75)" strokeWidth="5" />
        <circle cx="200" cy="200" r="184" fill="none" stroke="rgba(0, 229, 204, 0.45)" strokeWidth="2.5" />
        
        {/* 3 Authentic Aluminum Reel Cutouts */}
        {[0, 120, 240].map((deg, i) => (
          <g key={i} transform={`rotate(${deg} 200 200)`}>
            {/* Triangular Spoke Cutout */}
            <path
              d="M 170 90 Q 200 76 230 90 L 250 156 Q 200 140 150 156 Z"
              fill="rgba(0, 0, 0, 0.88)"
              stroke="rgba(0, 229, 204, 0.75)"
              strokeWidth="3.5"
            />
            {/* Spoke Highlight Line */}
            <line x1="200" y1="80" x2="200" y2="150" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2" />
          </g>
        ))}

        {/* Inner Tape Pack Core */}
        <circle cx="200" cy="200" r="84" fill="rgba(30, 20, 15, 0.75)" stroke="rgba(200, 180, 160, 0.5)" strokeWidth="4" />
        
        {/* Center Metal Hub & Spindle */}
        <circle cx="200" cy="200" r="44" fill="rgba(180, 195, 210, 0.85)" stroke="#FFFFFF" strokeWidth="3" />
        <circle cx="200" cy="200" r="16" fill="#111111" stroke="rgba(0, 229, 204, 0.9)" strokeWidth="2.5" />
        
        {/* NAB 3 Locking Slots */}
        {[30, 150, 270].map((deg, i) => (
          <rect
            key={i}
            x="194"
            y="152"
            width="12"
            height="28"
            rx="4"
            fill="#111111"
            transform={`rotate(${deg} 200 200)`}
          />
        ))}

        {/* Dynamic Metallic Sheen Sweep */}
        <circle
          cx="200"
          cy="200"
          r="188"
          fill="none"
          stroke="url(#metallicSheen)"
          strokeWidth="10"
          opacity="0.65"
        />
        <defs>
          <linearGradient id="metallicSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="50%" stopColor="transparent" />
            <stop offset="100%" stopColor="#00E5CC" stopOpacity="0.85" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// ── THE "انتظرونا" 3D KINETIC TYPOGRAPHY RIBBON (TEASER CLIMAX) ──
const AntezeronaTeaserRibbon: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - startFrame);

  if (frame < startFrame) return null;

  const ribbonSpring = spring({ frame: localFrame, fps: 30, config: { damping: 12, stiffness: 90, mass: 1.8 } });
  const scale = interpolate(ribbonSpring, [0, 1], [0.25, 1.0]);
  const rotateX = interpolate(ribbonSpring, [0, 1], [35, 0]);
  const translateZ = interpolate(ribbonSpring, [0, 1], [-450, 60]);
  const opacity = interpolate(ribbonSpring, [0, 0.3, 1], [0, 1, 1], { extrapolateRight: 'clamp' });
  const glowPulse = Math.sin(localFrame * 0.15) * 20 + 40;

  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '42%',
      transform: `translate(-50%, -50%) perspective(1200px) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`,
      opacity,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 90,
      pointerEvents: 'none'
    }}>
      {/* 3D Cyan Calligraphic Ribbon */}
      <div style={{
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        fontSize: 140,
        fontWeight: 900,
        color: '#FFFFFF',
        letterSpacing: 4,
        textShadow: `0 0 25px ${CYAN}, 0 0 ${glowPulse}px ${CYAN}, 0 10px 40px rgba(0,0,0,0.9)`,
        background: 'linear-gradient(180deg, #FFFFFF 0%, #00E5CC 85%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.85))'
      }}>
        انتظرونا
      </div>

      {/* Subtitle Badge */}
      <div style={{
        marginTop: 10,
        padding: '10px 32px',
        borderRadius: 50,
        background: 'rgba(3, 14, 24, 0.85)',
        border: `2px solid ${CYAN}`,
        boxShadow: `0 0 25px rgba(0, 229, 204, 0.35)`,
        color: '#FFF',
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        fontSize: 32,
        fontWeight: 700,
        letterSpacing: 2
      }}>
        الحلقة الكاملة قريباً :: حرفين ولكن
      </div>
    </div>
  );
};

// ── SHOT 3: BROADCAST NEWS / DOCUMENTARY TEXT BANNER ("متصممة عشان تشتغل بدلنا للأسف") ──
const AutonomousReplacementBanner: React.FC<{ startFrame: number; endFrame: number }> = ({ startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame > endFrame + 15) return null;

  // Butter-smooth entrance starting @ startFrame (00:20.26 / frame 626)
  const enterProgress = interpolate(frame, [startFrame, startFrame + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });

  // Exit fade out before endFrame (frame 780)
  const exitProgress = interpolate(frame, [endFrame - 15, endFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic)
  });

  const bannerOpacity = frame < endFrame - 15 ? enterProgress : 1 - exitProgress;
  const bannerTranslateY = interpolate(enterProgress, [0, 1], [40, 0]) + interpolate(exitProgress, [0, 1], [0, 40]);
  const bannerScale = interpolate(enterProgress, [0, 1], [0.96, 1]);

  // Continuous rock-solid heartbeat pulse (~1.2Hz) without any subpixel flex layout jitter
  const pulse = Math.sin((frame - startFrame) * 0.22);
  const pulseScale = interpolate(pulse, [-1, 1], [0.94, 1.05]);
  const pulseGlow = interpolate(pulse, [-1, 1], [15, 38]);
  const pulseAlpha = interpolate(pulse, [-1, 1], [0.82, 1]);

  return (
    <div style={{
      position: 'absolute',
      bottom: 80,
      left: '50%',
      transform: `translateX(-50%) translateY(${bannerTranslateY}px) scale(${bannerScale})`,
      display: 'flex',
      alignItems: 'stretch',
      zIndex: 65,
      opacity: bannerOpacity,
      boxShadow: '0 25px 65px rgba(0, 0, 0, 0.95), 0 0 50px rgba(255, 51, 51, 0.45)',
      borderRadius: 20,
      overflow: 'hidden',
      border: '2px solid rgba(255, 51, 51, 0.7)',
      backgroundColor: 'rgba(2, 8, 16, 0.94)',
      direction: 'rtl',
      pointerEvents: 'none',
      willChange: 'transform, opacity'
    }}>
      {/* Red Alert Pill / Badge (Fixed layout bounds with isolated compositor pulse) */}
      <div style={{
        position: 'relative',
        minWidth: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderLeft: '2px solid rgba(255, 255, 255, 0.25)',
        background: 'linear-gradient(135deg, #FF1A4B 0%, #B30026 100%)',
        boxShadow: `inset 0 0 15px rgba(255, 255, 255, 0.25), 0 0 ${pulseGlow}px rgba(255, 26, 75, 0.7)`,
        overflow: 'hidden',
        flexShrink: 0
      }}>
        {/* Pulsing Alert Radar Ring */}
        <div style={{
          position: 'absolute',
          inset: 5,
          borderRadius: 8,
          border: '1.5px solid rgba(255, 255, 255, 0.5)',
          opacity: interpolate(pulse, [-1, 1], [0.15, 0.65]),
          transform: `scale(${interpolate(pulse, [-1, 1], [0.98, 1.04])}) translateZ(0)`,
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
          padding: '18px 24px',
          transform: `scale(${pulseScale}) translateZ(0)`,
          transformOrigin: 'center center',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased'
        }}>
          <div style={{
            color: '#FFF',
            fontSize: 23,
            fontWeight: 900,
            fontFamily: 'monospace',
            letterSpacing: 2,
            textShadow: `0 0 ${interpolate(pulse, [-1, 1], [8, 22])}px rgba(255, 255, 255, 0.95)`
          }}>
            CRITICAL
          </div>
          <div style={{
            color: `rgba(255, 255, 255, ${pulseAlpha})`,
            fontSize: 18,
            fontWeight: 900,
            fontFamily: 'monospace',
            letterSpacing: 1.5,
            textShadow: '0 0 12px rgba(255, 26, 75, 0.85)'
          }}>
            OVERRIDE
          </div>
        </div>
      </div>

      {/* Main Headline Body */}
      <div style={{
        padding: '18px 44px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 6
      }}>
        <div style={{
          color: '#FFFFFF',
          fontSize: 36,
          fontFamily: "'Cairo', 'Tajawal', sans-serif",
          fontWeight: 900,
          lineHeight: 1.25,
          textShadow: '0 0 25px rgba(255, 51, 51, 0.7), 0 4px 18px rgba(0, 0, 0, 0.95)'
        }}>
          متصممة عشان تشتغل بدلنا للأسف
        </div>
        <div style={{
          color: CYAN,
          fontSize: 22,
          fontFamily: 'monospace',
          fontWeight: 900,
          letterSpacing: 1.2,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textShadow: `0 0 16px ${CYAN}`
        }}>
          <span>● بروتوكول الاستبدال الكامل // ZERO_HUMAN_IN_THE_LOOP</span>
        </div>
      </div>
    </div>
  );
};

// ── MASTER SCENE 1 COMPOSITION ──
export const Episode5Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── KEY TIMINGS (Synced strictly to 35.90s Audio) ──
  const F_POSE2 = 240;
  const F_POSE3 = 569; // 00:18.29 (Mazen snaps 5 frames earlier on cue)
  const F_BANNER_START = 626; // 00:20.26 (Text banner enters)
  const F_BANNER_END = 780; // 00:26.00 (Locked banner exit preserved)
  const F_POSE4 = 849; // 00:28.09 (Mazen snaps into Pose 4 on cue "بس فى سبب" - First Button Hit)
  const F_BUTTON_SLAM = 964; // 00:32.04 (Second Button Hit on voiceover punch "يوقفهم!")
  const F_TEASER = 1020; // 00:34.00 (Mazen exits completely, "انتظرونا" 3D Teaser unfurls)
  const F_WHIP_OUT = 1110; // 00:37.00 (Anamorphic whip-pan transitions to outro)

  // ── 8-FRAME CHROMATIC ABERRATION CUT TRIGGERS ──
  const isCutPose2 = frame >= F_POSE2 && frame < F_POSE2 + 8;
  const isCutPose3 = frame >= F_POSE3 && frame < F_POSE3 + 8;
  const isCutPose4 = frame >= F_POSE4 && frame < F_POSE4 + 8;
  const isButtonShock = frame >= F_BUTTON_SLAM && frame < F_BUTTON_SLAM + 6;

  const cutOffset = isCutPose2
    ? Math.sin((frame - F_POSE2) * 45) * 80 * (1 - (frame - F_POSE2) / 8)
    : isCutPose3
      ? Math.sin((frame - F_POSE3) * 45) * 80 * (1 - (frame - F_POSE3) / 8)
      : isCutPose4
        ? Math.sin((frame - F_POSE4) * 45) * 90 * (1 - (frame - F_POSE4) / 8)
        : isButtonShock
          ? Math.sin((frame - F_BUTTON_SLAM) * 60) * 120 * (1 - (frame - F_BUTTON_SLAM) / 6)
          : 0;

  // ── ACTIVE MAZEN POSE & PRECISION FRAMING (1:1 NATIVE SCALES - NATURAL TOP FRAMING) ──
  let activePoseImg = staticFile('images/episode5/scene-1/mazen-pose1a.png');
  let poseOffsetX = 0;
  let poseOffsetY = 0;
  let poseScale = 1.0;
  let poseOrigin = 'bottom center';

  if (frame < F_POSE2) {
    // ── DYNAMIC ANALOG SURVEILLANCE SCRUB LOOP (FAST, ORGANIC & RHYTHMIC) ──
    const scrubPattern = [
      '1a', '1a', '1b', '1b', '1c', '1c', '1b', '1b', // Fast forward scrub
      '1a', '1a', '1a', '1b', '1b', '1b', '1b', '1b', // Micro-hold on audio anomaly
      '1c', '1c', '1b', '1b', '1a', '1a', '1b', '1b', // Fast reverse scrub
      '1c', '1b', '1a', '1a', '1b', '1c', '1c', '1c', // Stutter scrub
    ];
    const scrubIdx = Math.floor(frame / 2.5) % scrubPattern.length;
    const poseKey = scrubPattern[scrubIdx];
    if (poseKey === '1a') activePoseImg = staticFile('images/episode5/scene-1/mazen-pose1a.png');
    else if (poseKey === '1b') activePoseImg = staticFile('images/episode5/scene-1/mazen-pose1b.png');
    else activePoseImg = staticFile('images/episode5/scene-1/mazen-pose1c.png');

    // Subtle 2-frame stop-motion analog paper jitter for raw documentary tactile energy
    const stopMotionJitterX = (Math.floor(frame / 2) * 7) % 3 - 1;
    const stopMotionJitterY = (Math.floor(frame / 2) * 11) % 3 - 1;

    poseScale = 1.0;
    poseOffsetX = stopMotionJitterX;
    poseOffsetY = stopMotionJitterY;
    poseOrigin = 'bottom center';
  } else if (frame < F_POSE3) {
    // ── POSE 2: 3/4 WARNING ANGLE & HUD SHOWCASE (0:08 - 0:14.12) ──
    // Mazen speaks until 00:14.07 (frame 427).
    // At frame 432 (00:14.12), he rapidly pushes/pans off right (with zero opacity reduction - 100% solid)
    activePoseImg = staticFile('images/episode5/scene-1/mazen-pose2.png');
    poseScale = 1.0;
    const mazenExitProgress = interpolate(frame, [432, 452], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.in(Easing.cubic)
    });
    poseOffsetX = interpolate(mazenExitProgress, [0, 1], [430, 1750]);
    poseOffsetY = 0;
    poseOrigin = 'bottom center';
  } else if (frame < F_POSE4) {
    // ── POSE 3: THREAT AUTHORITY (CENTERED HERO) ──
    // Scale 1.02 firmly grounds Mazen with 2% bleed down and out, eliminating any corner or edge gaps
    activePoseImg = staticFile('images/episode5/scene-1/mazen-pose3.png');
    poseScale = 1.02;
    poseOffsetX = 0;
    poseOffsetY = 0;
    poseOrigin = 'bottom center';
  } else {
    // ── POSE 4: RED BUTTON CONSOLE SLAM ──
    activePoseImg = staticFile('images/episode5/scene-1/mazen-pose4.png');
    poseScale = 1.0;
    poseOffsetX = 0;
    poseOffsetY = 0;
    poseOrigin = 'bottom center';
  }

  // ── PURE 3D PARALLAX CRANE (EPISODE 4 SIGNATURE CAMERA DIVE) ──
  let cameraZ = 0;
  let cameraX = 0;
  let cameraY = 0;

  if (frame < F_POSE2) {
    // SHOT 1: Wiretap Tape Scrub + 1.0s Freeze @ 00:06.18 + Speed-Ramp Plunge into Pose 2
    // Frame 0 - 168: Rock-solid on Mazen scrubbing deck
    // Frame 168 - 198: Fast camera surge to HUD face (Z: 0 -> 1450px)
    // Frame 198 - 228: 1.0 sec dramatic freeze hold on the textbox
    // Frame 228 - 240: Speed-ramp acceleration straight through HUD (Z: 1450 -> 3200px) into Pose 2
    if (frame < 168) {
      cameraZ = 0;
      cameraX = 0;
    } else if (frame < 198) {
      const pushProgress = interpolate(frame, [168, 198], [0, 1], {
        easing: Easing.out(Easing.cubic)
      });
      cameraZ = interpolate(pushProgress, [0, 1], [0, 1450]);
      cameraX = interpolate(pushProgress, [0, 1], [15, 0]);
    } else if (frame < 228) {
      // 1.0s Freeze Hold (30 frames)
      cameraZ = 1450;
      cameraX = 0;
    } else {
      // Frame 228 - 240: Speed-ramp plunge through HUD into Pose 2
      const rampProgress = interpolate(frame, [228, 240], [0, 1], {
        easing: Easing.in(Easing.cubic)
      });
      cameraZ = interpolate(rampProgress, [0, 1], [1450, 3200]);
      cameraX = 0;
    }
    cameraY = 0;
  } else if (frame < F_POSE3) {
    // SHOT 2: 3/4 Warning Angle (0:08 - 0:14.12) & Full Canvas Takeover (0:14.12 - 0:19.02)
    if (frame < 432) {
      const p2Progress = interpolate(frame, [F_POSE2, 432], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.quad)
      });
      cameraZ = interpolate(p2Progress, [0, 1], [0, 50]);
      cameraX = interpolate(p2Progress, [0, 1], [20, 0]);
      cameraY = Math.sin((frame - F_POSE2) * 0.04) * 4;
    } else {
      // Settle into centered full-screen master view smoothly without vertical jump
      const settleProgress = interpolate(frame, [432, 456], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic)
      });
      const yAt432 = Math.sin((432 - F_POSE2) * 0.04) * 4;
      cameraZ = interpolate(settleProgress, [0, 1], [50, 0]);
      cameraX = 0;
      cameraY = interpolate(settleProgress, [0, 1], [yAt432, 0]);
    }
  } else if (frame < F_POSE4) {
    // SHOT 3: Threat Authority (0:18.29 - 0:28.09 / Frames 569 - 849)
    // Camera is rock-solid centered & grounded on Mazen (eliminates detached edge & corner gaps)
    cameraZ = 0;
    cameraX = 0;
    cameraY = 0;
  } else if (frame < F_TEASER) {
    // SHOT 4: Red Button Slam (0:28.09 - 0:34.00 / Frames 849 - 1020) - Subtle punch
    cameraZ = interpolate(frame, [F_POSE4, F_TEASER], [0, 30], { extrapolateRight: 'clamp' });
    cameraX = 0;
    cameraY = 0;
  } else {
    // SHOT 5: 3D Teaser Ribbon "انتظرونا" Pullback (0:34 - 0:37 / Frames 1020 - 1110)
    const teaserProgress = interpolate(frame, [F_TEASER, F_TEASER + 25], [0, 1], {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic)
    });
    cameraZ = interpolate(teaserProgress, [0, 1], [30, 0]);
    cameraX = 0;
    cameraY = 0;
  }

  // Camera Shake on button slam impact
  const shakeX = isButtonShock ? (Math.random() - 0.5) * 22 : 0;
  const shakeY = isButtonShock ? (Math.random() - 0.5) * 22 : 0;

  // ── CINEMATIC RACK FOCUS & DEPTH OF FIELD ENGINE (ANAMORPHIC FOCUS PULL) ──
  // Starts at 0:00 with background in pristine focus and foreground Mazen blurred out;
  // then smoothly pulls focus into Mazen as voiceover takes command (frames 15 to 65).
  const rackFocusProgress = interpolate(frame, [15, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic)
  });

  // Mazen foreground rack blur: 14px down to 0px
  const mazenBlur = interpolate(rackFocusProgress, [0, 1], [14, 0]);

  // Studio background rack blur: 0px up to 4.5px cinematic bokeh
  const bgRackBlur = interpolate(rackFocusProgress, [0, 1], [0, 4.5]);

  const bgParallaxX = interpolate(frame, [0, F_WHIP_OUT], [0, -140], { extrapolateRight: 'clamp' });

  // ── POSE 3 STUDIO BACKGROUND MULTI-PLANE PARALLAX (DRIFT, FLOAT & CINEMATIC DEPTH) ──
  // Applied directly to Layer 1 (scale 5.8) to deliver rich studio depth with ZERO displacement of Mazen
  const p3Progress = interpolate(frame, [F_POSE3, F_POSE4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad)
  });
  const p3BgDriftX = frame >= F_POSE3 && frame < F_POSE4
    ? interpolate(p3Progress, [0, 1], [35, -35])
    : 0;
  const p3BgFloatY = frame >= F_POSE3 && frame < F_POSE4
    ? Math.sin((frame - F_POSE3) * 0.04) * 14
    : 0;
  const p3BgZoom = frame >= F_POSE3 && frame < F_POSE4
    ? interpolate(p3Progress, [0, 1], [1.0, 1.04])
    : 1.0;
  const isCutActive = isCutPose2 || isCutPose3 || isCutPose4 || isButtonShock;
  const cutMotionBlur = isCutActive ? 6 : 0;
  const whipMotionBlur = interpolate(frame, [F_WHIP_OUT - 15, F_WHIP_OUT], [0, 22], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bgBlur = bgRackBlur + cutMotionBlur + whipMotionBlur;

  return (
    <AbsoluteFill style={{ backgroundColor: "#020202", overflow: "hidden" }}>
      {/* ── AUDIO TRACK ── */}
      <Audio src={staticFile('audio/episode5/mazen-vo-scene1.mp3')} volume={1} />

      {/* ── MAIN WHIP-PAN WRAPPER TO OUTRO AT 0:39 ── */}
      <AnamorphicWhipPan
        transitionStartFrame={F_WHIP_OUT}
        durationFrames={18}
        caColorA="rgba(0, 229, 204, 0.3)"
        caColorB="rgba(255, 0, 85, 0.3)"
        flareColor="rgba(0, 229, 204, 0.7)"
        childrenA={
          <AbsoluteFill style={{ overflow: 'hidden', perspective: 1200 }}>
            {/* 3D VIRTUAL WORLD (Pure Parallax Translation - No 2D host skew) */}
            <div style={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              transform: `translateZ(${cameraZ}px) translateX(${-cameraX + shakeX}px) translateY(${cameraY + shakeY}px)`
            }}>
              {/* LAYER 1: EPISODE 4 BROADCAST STUDIO BACKGROUND (Z = -3600px) */}
              <div style={{
                position: 'absolute',
                width: 1920,
                height: 1080,
                left: '50%',
                top: '50%',
                marginLeft: -960,
                marginTop: -540,
                transform: `translateZ(-3600px) translateX(${bgParallaxX + p3BgDriftX}px) translateY(${p3BgFloatY}px) scale(${5.8 * p3BgZoom})`,
                transformStyle: 'preserve-3d'
              }}>
                {/* Master Studio Plate: Brightness 0.9 + Warm Sepia/Grayscale Documentary Grade from Ep 4 */}
                <img
                  src={staticFile('images/episode5/harfen-studio.jpeg')}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: `blur(${bgBlur}px) grayscale(0.5) sepia(0.4) contrast(1.3) brightness(0.9)`
                  }}
                  alt=""
                />

                {/* VOLUMETRIC LIGHTING BEAMS (Cyan Key & Warm Amber Fill) */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'radial-gradient(ellipse 1100px 700px at 75% 25%, rgba(0, 229, 204, 0.22) 0%, rgba(0, 229, 204, 0.05) 45%, transparent 75%)',
                  mixBlendMode: 'screen'
                }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'radial-gradient(ellipse 900px 600px at 20% 80%, rgba(255, 179, 0, 0.16) 0%, transparent 60%)',
                  mixBlendMode: 'screen'
                }} />

                {/* DYNAMIC VOICEOVER TONE SHIFT OVERLAYS (Episode 4 Authentic Multiply Gel Engine) */}
                {/* Phase 1: Investigative Cold Cyan (0:00 - 0:08) */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: CYAN,
                  mixBlendMode: 'multiply',
                  opacity: interpolate(frame, [0, F_POSE2 - 20, F_POSE2], [0.35, 0.35, 0], { extrapolateRight: 'clamp' })
                }} />

                {/* Phase 2: Autonomous Pivot / Alert Amber (0:08 - 0:18) */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: AMBER,
                  mixBlendMode: 'multiply',
                  opacity: interpolate(frame, [F_POSE2, F_POSE2 + 15, F_POSE3 - 15, F_POSE3], [0, 0.45, 0.45, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
                }} />

                {/* Phase 3: Rogue Threat / Deep Crimson (0:18 - 0:32 - Multiply Gel eliminates division-by-zero black stains and prevents violet wash) */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: MAGENTA,
                  mixBlendMode: 'multiply',
                  opacity: interpolate(frame, [F_POSE3, F_POSE3 + 15, F_POSE4 - 15, F_POSE4], [0, 0.5, 0.5, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
                }} />

                {/* Phase 4: Emergency Red Button Slam (Hit 1 @ 00:28.09 / Hit 2 @ 00:32.04) */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: RED,
                  mixBlendMode: 'multiply',
                  opacity: frame < F_POSE4 || frame >= F_TEASER
                    ? 0
                    : interpolate(
                        frame,
                        [F_POSE4, F_POSE4 + 6, F_BUTTON_SLAM - 1, F_BUTTON_SLAM, F_BUTTON_SLAM + 6, F_TEASER],
                        [0.55, 0.40, 0.40, 0.75, 0.50, 0],
                        { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
                      )
                }} />

                {/* Subtle Cinematic Edge Vignette */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle at 50% 50%, transparent 55%, rgba(2, 6, 12, 0.5) 100%)',
                  pointerEvents: 'none'
                }} />
              </div>

              {/* LAYER 1.5: 3D BACKGROUND CHATBOT WALL SCREEN (Shot 1 Only - Deep on Wall Z=-1400px - Zero Obstruction) */}
              {frame < F_POSE2 && <BackgroundChatbotScreen />}

              {/* LAYER 2: 3D CLAUDE + n8n STUDIO WALL HUD (Shot 2 Only - Pose 2 Anchor on Left) */}
              {frame >= F_POSE2 && <N8nClaudeStudioHUD exitFrame={F_POSE3} />}

              {/* LAYER 3: FOREGROUND MAZEN & CONSOLE (Z = 0px - Precision Grounded & Scaled) */}
              {(() => {
                // Pure dissolve exit at 00:34.00 (F_TEASER = 1020) with ZERO position displacement (strictly preserving original dissolve style)
                if (frame >= F_TEASER) return null;

                const mazenOpacity = frame >= F_TEASER - 8
                  ? interpolate(frame, [F_TEASER - 8, F_TEASER], [1, 0], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                      easing: Easing.inOut(Easing.quad)
                    })
                  : 1;

                // During Shot 1 dive (synchronized to camera push starting at frame 168), Mazen slides off right with motion blur (100% opacity maintained)
                const mazenDivePushX = frame < F_POSE2
                  ? interpolate(frame, [168, 198], [0, 1400], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                      easing: Easing.in(Easing.cubic)
                    })
                  : 0;

                // Motion blur during rapid camera dive and horizontal slide
                const mazenMotionBlur = frame < F_POSE2
                  ? interpolate(frame, [168, 198], [0, 28], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                      easing: Easing.in(Easing.cubic)
                    })
                  : 0;

                // Motion blur during rapid whip pan-off (zero cross-fade, 100% solid opacity)
                const mazenTakeoverBlur = frame >= 432 && frame < F_POSE3
                  ? interpolate(frame, [432, 444, 452], [0, 32, 8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) })
                  : 0;

                const totalMazenBlur = mazenBlur + mazenMotionBlur + mazenTakeoverBlur;

                return (
                  <div style={{
                    position: 'absolute',
                    width: 1920,
                    height: 1080,
                    left: '50%',
                    top: '50%',
                    marginLeft: -960,
                    marginTop: -540,
                    transformStyle: 'preserve-3d',
                    transformOrigin: poseOrigin,
                    transform: `translateZ(0px) translateX(${poseOffsetX + mazenDivePushX}px) translateY(${poseOffsetY}px) scale(${poseScale})`,
                    filter: totalMazenBlur > 0.05 ? `blur(${totalMazenBlur.toFixed(2)}px)` : 'none',
                    opacity: mazenOpacity
                  }}>
                    <img
                      src={activePoseImg}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }}
                      alt=""
                    />

                    {/* Vintage Tape Deck Rotating Reel Overlay (Pose 1 Only) */}
                    {frame < F_POSE2 && <RotatingTapeReel frame={frame} />}

                    {/* 8-Frame Motion Stop Chromatic Aberration Overlay */}
                    {cutOffset !== 0 && (
                      <CharacterCA3D imgSrc={activePoseImg} caX={cutOffset} />
                    )}
                  </div>
                );
              })()}

              {/* LAYER 3.5: THE "متصممة عشان تشتغل بدلنا للأسف" BROADCAST TEXT BANNER (@ 00:20.26 / Frame 626) */}
              <AutonomousReplacementBanner startFrame={F_BANNER_START} endFrame={F_BANNER_END} />

              {/* LAYER 4: THE "انتظرونا" 3D TEASER CLIMAX */}
              <AntezeronaTeaserRibbon startFrame={F_TEASER} />
            </div>

            {/* EPISODE 4 CORE TEXTURE ENGINE (DIORAMA HALFTONE & SVG PAPER NOISE) */}
            <DioramaOverlay />
            <GlobalTexture />
          </AbsoluteFill>
        }
        childrenB={
          <Sequence from={F_WHIP_OUT} durationInFrames={180}>
            <BrandOutroHorizontal />
          </Sequence>
        }
      />
    </AbsoluteFill>
  );
};
