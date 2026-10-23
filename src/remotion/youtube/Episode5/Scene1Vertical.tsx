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
  spring
} from 'remotion';
import { AnamorphicWhipPan } from '../Episode3/AnamorphicWhipPan';

const CYAN = "#00E5CC";
const RED = "#FF3333";
const AMBER = "#FFB300";
const MAGENTA = "#FF0055";
const GOLD = "#FFBB00";

// ── GLOBAL SUBTITLE LANGUAGE TOGGLE (SET TO TRUE FOR GOODBRAINS / LINKEDIN ENGLISH REEL) ──
export const USE_ENGLISH_SUBTITLES = true;

// ── EPISODE 4 CORE TEXTURE ENGINE (DIORAMA HALFTONE & SVG PAPER NOISE + FONT INJECTION) ──
const GlobalTexture: React.FC = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800;900&family=Cairo:wght@700;900&display=swap');
    `}</style>
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999, mixBlendMode: "overlay", opacity: 0.05 }}>
      <div style={{ width: "100%", height: "100%", backgroundImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>')` }} />
    </AbsoluteFill>
  </>
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

// ── AUTHENTIC STUDER 3D ALUMINUM ROTATING TAPE REEL (LOCKED TO MAZEN'S DECK) ──
const RotatingTapeReel: React.FC<{ frame: number }> = ({ frame }) => {
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
            <path
              d="M 170 90 Q 200 76 230 90 L 250 156 Q 200 140 150 156 Z"
              fill="rgba(0, 0, 0, 0.88)"
              stroke="rgba(0, 229, 204, 0.75)"
              strokeWidth="3.5"
            />
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
          stroke="url(#metallicSheenVert)"
          strokeWidth="10"
          opacity="0.65"
        />
        <defs>
          <linearGradient id="metallicSheenVert" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="50%" stopColor="transparent" />
            <stop offset="100%" stopColor="#00E5CC" stopOpacity="0.85" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// ── SHOT 1: 3D BACKGROUND CHATBOT WALL SCREEN (DEDICATED VERTICAL REFRAME) ──
const BackgroundChatbotScreenVertical: React.FC = () => {
  const frame = useCurrentFrame();
  const F_POSE2 = 240;
  if (frame >= F_POSE2) return null;

  // Kinetic Headline with atomic word-level reveal (Zero ligature jitter on cursive Arabic / clean flow on English):
  const headlineWords = USE_ENGLISH_SUBTITLES
    ? [
        { text: "They", frame: 168 },
        { text: "convinced", frame: 171 },
        { text: "us", frame: 174 },
        { text: "that AI", frame: 178 },
        { text: "was", frame: 182 },
        { text: "just a", frame: 186 },
        { text: "chatbot...", frame: 190 },
      ]
    : [
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
      top: '30%',
      width: 980,
      height: 820,
      marginLeft: -490,
      marginTop: -410,
      transform: `translateZ(-1400px) translateX(${glitchX}px) translateY(${glitchY}px) rotateZ(${glitchRot}deg)`,
      transformStyle: 'preserve-3d',
      boxSizing: 'border-box',
      opacity,
      background: 'linear-gradient(135deg, rgba(3, 14, 25, 0.94) 0%, rgba(1, 6, 12, 0.92) 100%)',
      border: `2.5px solid ${isGlitch ? RED : 'rgba(0, 229, 204, 0.55)'}`,
      borderRadius: 40,
      padding: '38px 44px',
      boxShadow: `inset 0 0 90px ${isGlitch ? 'rgba(255, 51, 51, 0.35)' : 'rgba(0, 229, 204, 0.18)'}, 0 35px 90px rgba(0, 0, 0, 0.95)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      zIndex: 20,
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      {/* ── TOP HEADER STATUS BAR ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '3px solid rgba(255,255,255,0.14)', paddingBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            backgroundColor: isGlitch ? RED : CYAN,
            boxShadow: `0 0 18px ${isGlitch ? RED : CYAN}`
          }} />
          <div style={{ color: '#FFF', fontSize: 18, fontFamily: 'monospace', fontWeight: 900, letterSpacing: 1.1 }}>
            {isGlitch ? "OVERRIDE_DETECTED // BREACH_IN_PROGRESS" : "SYSTEM_STATE: CHATBOT_SANDBOX [RESTRICTED]"}
          </div>
        </div>
        <div style={{ color: CYAN, fontSize: 16, fontFamily: 'monospace', fontWeight: 700, opacity: 0.85 }}>
          TERMINAL::EP05_CORE
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', justifyContent: 'space-between', marginTop: 22 }}>
        {/* Kinetic Headline with Pre-allocated Atomic Word Flow (Zero ligature jitter + cinematic motion blur during camera surge) */}
        <div style={{
          color: '#FFFFFF',
          fontSize: USE_ENGLISH_SUBTITLES ? 42 : 48,
          fontFamily: USE_ENGLISH_SUBTITLES ? "'Inter', sans-serif" : "'Cairo', 'Tajawal', sans-serif",
          fontWeight: 900,
          direction: USE_ENGLISH_SUBTITLES ? 'ltr' : 'rtl',
          lineHeight: 1.3,
          minHeight: 145,
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

        {/* Interactive Chat Box Container */}
        <div style={{
          opacity: textBoxOpacity,
          transform: `scale(${textBoxScale})`,
          transformOrigin: 'center center',
          background: 'linear-gradient(180deg, rgba(0, 25, 38, 0.95) 0%, rgba(2, 10, 18, 0.95) 100%)',
          border: `2px solid ${isGlitch ? RED : 'rgba(0, 229, 204, 0.7)'}`,
          borderRadius: 26,
          padding: '24px 30px',
          boxShadow: `0 20px 50px rgba(0, 0, 0, 0.85), inset 0 0 35px ${isGlitch ? 'rgba(255, 51, 51, 0.2)' : 'rgba(0, 229, 204, 0.15)'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginTop: 10,
          marginBottom: 10
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{
              color: AMBER,
              fontSize: USE_ENGLISH_SUBTITLES ? 24 : 27,
              fontFamily: USE_ENGLISH_SUBTITLES ? "'Inter', sans-serif" : "'Cairo', sans-serif",
              fontWeight: 900,
              direction: USE_ENGLISH_SUBTITLES ? 'ltr' : 'rtl',
              textShadow: `0 0 24px ${AMBER}`
            }}>
              {USE_ENGLISH_SUBTITLES ? "Smart Assistant Trapped Inside a Text Box" : "مساعد ذكي عايش جوه مربع نص"}
            </div>
            <div style={{
              padding: '6px 14px',
              borderRadius: 20,
              background: isGlitch ? 'rgba(255, 51, 51, 0.25)' : 'rgba(0, 229, 204, 0.15)',
              border: `1.5px solid ${isGlitch ? RED : CYAN}`,
              color: isGlitch ? RED : CYAN,
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 800
            }}>
              {isGlitch ? "FAILING..." : "BOX_BOUND [PASSIVE]"}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 22px',
            borderRadius: 14,
            backgroundColor: 'rgba(0, 10, 18, 0.85)',
            border: '1.5px solid rgba(255, 255, 255, 0.18)'
          }}>
            <div style={{
              color: 'rgba(255, 255, 255, 0.75)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 20,
              letterSpacing: 1
            }}>
              [ PROMPT: {USE_ENGLISH_SUBTITLES ? "Ask anything here..." : "اكتب سؤالك هنا..."} <span style={{ color: CYAN, opacity: frame % 12 < 6 ? 1 : 0 }}>|</span> ]
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: `radial-gradient(circle, ${CYAN} 30%, transparent 70%)`,
                border: `2px solid ${CYAN}`,
                transform: `translateX(${Math.sin(frame * 0.25) * 6}px)`,
                boxShadow: `0 0 16px ${CYAN}`
              }} />
              <span style={{ color: CYAN, fontFamily: 'monospace', fontSize: 14, fontWeight: 800 }}>LOCKED</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)' }}>
            <div>READ_ONLY: <span style={{ color: '#00E5CC' }}>YES</span></div>
            <div>EXECUTE: <span style={{ color: RED }}>FORBIDDEN</span></div>
            <div>DAEMON: <span style={{ color: RED }}>BLOCKED</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── SHOT 2: 3D CLAUDE 3.5 & n8n AUTONOMOUS AGENTS STUDIO WALL HUD (FULL FIDELITY VERTICAL) ──
const N8nClaudeStudioHUDVertical: React.FC<{ exitFrame: number }> = ({ exitFrame }) => {
  const frame = useCurrentFrame();
  const F_POSE2 = 240;
  if (frame < F_POSE2 || frame >= exitFrame) return null;

  const headlineProgress = interpolate(frame, [F_POSE2, F_POSE2 + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });
  const headlineScale = interpolate(headlineProgress, [0, 1], [1.06, 1]);

  const F_CLAUDE_START = 280;
  const brandProgress = interpolate(frame, [F_CLAUDE_START, F_CLAUDE_START + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });
  const brandOpacity = interpolate(brandProgress, [0, 1], [0, 1]);
  const brandTranslateX = interpolate(brandProgress, [0, 1], [-14, 0]);

  const F_SUBTITLE_START = 292;
  const subProgress = interpolate(frame, [F_SUBTITLE_START, F_SUBTITLE_START + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });
  const subOpacity = interpolate(subProgress, [0, 1], [0, 1]);

  const F_TELEMETRY_START = 302;

  const F_ASR_START = 375;
  const punchText = "عصر المساعد الذكي انتهى";
  const charsTyped = frame < F_ASR_START
    ? 0
    : Math.min(punchText.length, Math.floor((frame - F_ASR_START) / 1.8));
  const typedPunch = punchText.slice(0, charsTyped);

  // Takeover: from top floating card to full 1080x1920 vertical canvas
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

  // Geometry transition: Top card in 9:16 -> Full Canvas
  // Top: 16px and height: 480px provides clean headroom above Mazen's head (39px clear gap)
  const hudLeft = interpolate(takeoverProgress, [0, 1], [50, 50]);
  const hudTop = interpolate(takeoverProgress, [0, 1], [16, 0]);
  const hudWidth = interpolate(takeoverProgress, [0, 1], [990, 1080]);
  const hudHeight = interpolate(takeoverProgress, [0, 1], [480, 1920]);
  const hudRadius = interpolate(takeoverProgress, [0, 1], [34, 0]);
  const hudRotY = interpolate(takeoverProgress, [0, 1], [-1.5, 0]);
  const hudRotX = interpolate(takeoverProgress, [0, 1], [0, 0]);

  const phaseAOpacity = interpolate(takeoverProgress, [0, 0.45], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const phaseBOpacity = interpolate(takeoverProgress, [0.35, 0.9], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <div style={{
      position: 'absolute',
      left: `${hudLeft}%`,
      top: `${hudTop}px`,
      width: hudWidth,
      height: hudHeight,
      marginLeft: isTakeover ? -540 : -495,
      boxSizing: 'border-box',
      opacity: cardOpacity,
      background: isTakeover
        ? 'linear-gradient(180deg, rgba(2, 9, 18, 0.98) 0%, rgba(1, 4, 10, 0.99) 100%)'
        : 'linear-gradient(135deg, rgba(2, 14, 28, 0.78) 0%, rgba(1, 8, 16, 0.86) 100%)',
      backdropFilter: isTakeover ? 'none' : 'blur(22px)',
      WebkitBackdropFilter: isTakeover ? 'none' : 'blur(22px)',
      border: isTakeover ? 'none' : '1.5px solid rgba(0, 229, 204, 0.55)',
      borderRadius: hudRadius,
      boxShadow: isTakeover
        ? 'none'
        : '0 25px 80px rgba(0, 0, 0, 0.85), inset 0 0 60px rgba(0, 229, 204, 0.14)',
      transform: `translateZ(-150px) perspective(1200px) rotateY(${hudRotY}deg) rotateX(${hudRotX}deg)`,
      zIndex: 20,
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      {/* ── PHASE A: INITIAL FLOATING TOP CARD (Frames 240 - 432) ── */}
      {phaseAOpacity > 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          padding: '16px 26px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          opacity: phaseAOpacity,
          boxSizing: 'border-box'
        }}>
          {/* Top Status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '2.5px solid rgba(255,255,255,0.22)', paddingBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: CYAN, boxShadow: `0 0 18px ${CYAN}` }} />
              <div style={{ color: '#FFF', fontSize: 23, fontFamily: "'JetBrains Mono', monospace", fontWeight: 900, letterSpacing: 1.0 }}>
                SYSTEM: AUTONOMOUS_DAEMON [OVERRIDE_ACTIVE]
              </div>
            </div>
            <div style={{ color: CYAN, fontSize: 23, fontFamily: "'JetBrains Mono', monospace", fontWeight: 900 }}>
              TERMINAL::EP05_CORE
            </div>
          </div>

          {/* Kinetic Headline - Synced with zero empty gap */}
          <div style={{
            color: '#FFFFFF',
            fontSize: USE_ENGLISH_SUBTITLES ? 38 : 48,
            fontFamily: USE_ENGLISH_SUBTITLES ? "'Inter', sans-serif" : "'Cairo', 'Tajawal', sans-serif",
            fontWeight: 900,
            letterSpacing: USE_ENGLISH_SUBTITLES ? -0.5 : 0,
            direction: USE_ENGLISH_SUBTITLES ? 'ltr' : 'rtl',
            lineHeight: 1.25,
            textShadow: '0 4px 18px rgba(0, 25, 50, 0.9), 0 0 35px rgba(0, 229, 204, 0.7)',
            transform: `scale(${headlineScale})`,
            marginTop: 2
          }}>
            <span>{USE_ENGLISH_SUBTITLES ? "OCTOBER 2026:" : "في أكتوبر 2026:"}</span>
            {frame >= 286 && frame < 377 && (
              <>
                {' '}
                <span style={{ color: CYAN, textShadow: `0 0 25px ${CYAN}` }}>
                  {USE_ENGLISH_SUBTITLES ? "THE INDUSTRY PIVOTED" : "الصناعة كلها قلبت الموازين"}
                </span>
              </>
            )}
            {frame >= 377 && (
              <>
                {' '}
                <span style={{ color: '#FF3333', textShadow: '0 0 25px rgba(255,51,51,0.85)' }}>
                  {USE_ENGLISH_SUBTITLES ? "THE ASSISTANT ERA IS DEAD!" : "عصر المساعد الذكي انتهى!"}
                </span>
              </>
            )}
          </div>

          {/* Brand & Extruded 3D Rotating Cubes */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            borderBottom: '2.5px solid rgba(255,255,255,0.22)',
            paddingBottom: 6,
            opacity: brandOpacity,
            transform: `translateX(${brandTranslateX}px)`
          }}>
            <div style={{ position: 'relative', width: 66, height: 66, perspective: 800, flexShrink: 0 }}>
              <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${frame * 3}deg)` }}>
                {[...Array(6)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{
                    position: 'absolute', inset: 0, width: 60, height: 60, top: 3, left: 3,
                    transform: `translateZ(${i * -2.2}px)`,
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
              color: '#FFF',
              fontSize: 46,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 900,
              letterSpacing: 2
            }}>
              CLAUDE<span style={{ fontSize: 34, opacity: 0.85, color: CYAN }}>::n8n</span>
            </div>
          </div>

          {/* Subtitle Protocol */}
          <div style={{
            color: CYAN,
            fontSize: USE_ENGLISH_SUBTITLES ? 24 : 30,
            fontFamily: USE_ENGLISH_SUBTITLES ? "'Inter', sans-serif" : "'Cairo', sans-serif",
            fontWeight: 800,
            letterSpacing: 0.5,
            direction: USE_ENGLISH_SUBTITLES ? 'ltr' : 'rtl',
            opacity: subOpacity
          }}>
            {USE_ENGLISH_SUBTITLES ? "PROTOCOL: AUTONOMOUS AGENTS [DEPLOYED]" : "بروتوكول الوكلاء المستقلين (Autonomous Agents)"}
          </div>

          {/* Key-Value Pipeline Telemetry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 4px' }}>
            {[
              { label: 'AGENT:', val: 'CLAUDE_5.5_SONNET', color: CYAN, glow: true },
              { label: 'PIPELINE:', val: 'n8n_AUTONOMOUS_CORE', color: AMBER, glow: true },
              { label: 'DAEMON:', val: 'python daemon.py --stealth --24x7', color: '#FFF', glow: false },
              { label: 'STATUS:', val: 'ACTIVE_UNSUPERVISED [100%]', color: RED, glow: true },
            ].map((row, idx) => {
              const rowStart = F_TELEMETRY_START + idx * 8;
              const rowOpacity = interpolate(frame, [rowStart, rowStart + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              return (
                <div key={idx} style={{ display: 'flex', gap: 14, alignItems: 'center', opacity: rowOpacity }}>
                  <div style={{ color: '#FFF', fontSize: 24, fontFamily: "'JetBrains Mono', monospace", opacity: 0.9, fontWeight: 800, minWidth: 120 }}>{row.label}</div>
                  <div style={{ color: row.color, fontSize: 26, fontFamily: "'JetBrains Mono', monospace", fontWeight: 900, textShadow: row.glow ? `0 0 18px ${row.color}` : 'none' }}>
                    {row.val}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PHASE B: MASTER FULL-CANVAS AUTONOMOUS AGENT TAKEOVER (Frames 432 - 569) ── */}
      {phaseBOpacity > 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          padding: '70px 44px 50px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          opacity: phaseBOpacity,
          boxSizing: 'border-box'
        }}>
          {/* Global Master Cyber Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '2.5px solid rgba(0, 229, 204, 0.4)', paddingBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#00FF88', boxShadow: '0 0 20px #00FF88' }} />
              <div style={{ color: '#FFF', fontSize: 32, fontFamily: 'monospace', fontWeight: 900, letterSpacing: 1.5 }}>
                AUTONOMOUS_MATRIX // SYSTEM_TAKEOVER
              </div>
            </div>
            <div style={{ padding: '8px 22px', borderRadius: 16, background: 'rgba(0, 229, 204, 0.16)', border: `2px solid ${CYAN}`, color: CYAN, fontSize: 26, fontFamily: 'monospace', fontWeight: 900 }}>
              STATUS: 100%_AUTONOMOUS
            </div>
          </div>

          {/* Script-Synced Dynamic Hero Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', marginTop: 8 }}>
            <div style={{
              color: '#FFFFFF',
              fontSize: USE_ENGLISH_SUBTITLES ? 52 : 66,
              fontFamily: USE_ENGLISH_SUBTITLES ? "'Inter', sans-serif" : "'Cairo', sans-serif",
              fontWeight: 900,
              direction: USE_ENGLISH_SUBTITLES ? 'ltr' : 'rtl',
              textShadow: `0 0 35px ${CYAN}, 0 4px 15px rgba(0,0,0,0.9)`,
              lineHeight: 1.2
            }}>
              {USE_ENGLISH_SUBTITLES ? "ERA OF AUTONOMOUS AGENTS" : "عصر الوكلاء المستقلين"}
            </div>
            <div style={{ color: CYAN, fontSize: 32, fontFamily: 'monospace', fontWeight: 900, letterSpacing: 3, marginTop: 4 }}>
              AUTONOMOUS AGENTS // REASONING & EXECUTION
            </div>
            
            {/* Dynamic Voiceover Script Callout Banner */}
            <div style={{
              marginTop: 10,
              padding: '12px 30px',
              borderRadius: 22,
              background: 'linear-gradient(135deg, rgba(255, 179, 0, 0.15) 0%, rgba(255, 102, 0, 0.18) 100%)',
              border: `2.5px solid ${AMBER}`,
              boxShadow: '0 0 30px rgba(255, 179, 0, 0.3)',
              color: '#FFE082',
              fontSize: USE_ENGLISH_SUBTITLES ? 28 : 36,
              fontFamily: USE_ENGLISH_SUBTITLES ? "'Inter', sans-serif" : "'Cairo', sans-serif",
              fontWeight: 900,
              direction: USE_ENGLISH_SUBTITLES ? 'ltr' : 'rtl',
              transform: `scale(${interpolate(frame, [438, 450], [0.92, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) })})`,
              opacity: interpolate(frame, [438, 446], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            }}>
              {USE_ENGLISH_SUBTITLES ? "Frontier LLM Workflows — Engineered to Execute 24/7" : "برامج مربوطة بالنماذج الكبيرة — متصممة تنفذ بدالك 24/7"}
            </div>
          </div>

          {/* The 4-Node Live Workflow Architecture Stack (With boosted code & subtext sizes) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', marginTop: 6 }}>
            {/* NODE 1: Trigger */}
            <div style={{
              padding: '16px 26px',
              borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(16, 12, 2, 0.96) 0%, rgba(8, 6, 1, 0.98) 100%)',
              border: `2.5px solid ${AMBER}`,
              boxShadow: '0 12px 35px rgba(0,0,0,0.85), 0 0 25px rgba(255, 179, 0, 0.25)',
              transform: `scale(${interpolate(frame, [434, 444], [0.94, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
              opacity: interpolate(frame, [434, 440], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: AMBER, fontSize: 28, fontFamily: 'monospace', fontWeight: 900 }}>NODE 01 // CRON TRIGGER</span>
                <span style={{ color: '#00FF88', fontSize: 25, fontFamily: 'monospace', fontWeight: 800 }}>● LISTENER_ACTIVE 24/7</span>
              </div>
              <div style={{ color: '#FFF', fontSize: 44, fontFamily: 'monospace', fontWeight: 900, marginTop: 4 }}>CRON_DAEMON (0 * * * *)</div>
              <div style={{ color: AMBER, fontSize: 28, fontFamily: 'monospace', fontWeight: 800, opacity: 0.95, marginTop: 2 }}>UNSUPERVISED TIME-BASED HEARTBEAT</div>
            </div>

            {/* Connecting Flow Cable 1 */}
            <div style={{ height: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: 4, height: '100%', backgroundColor: AMBER, boxShadow: `0 0 10px ${AMBER}` }} />
            </div>

            {/* NODE 2: Claude 5.5 Sonnet Brain */}
            <div style={{
              padding: '16px 26px',
              borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(2, 24, 38, 0.96) 0%, rgba(1, 12, 20, 0.98) 100%)',
              border: `3px solid ${CYAN}`,
              boxShadow: '0 12px 40px rgba(0,0,0,0.9), 0 0 35px rgba(0, 229, 204, 0.35)',
              transform: `scale(${interpolate(frame, [442, 452], [0.94, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
              opacity: interpolate(frame, [442, 448], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: CYAN, fontSize: 28, fontFamily: 'monospace', fontWeight: 900 }}>NODE 02 // COGNITIVE REASONING ENGINE</span>
                <span style={{ color: CYAN, fontSize: 25, fontFamily: 'monospace', fontWeight: 800 }}>● STREAMING TOKENS</span>
              </div>
              <div style={{ color: '#FFF', fontSize: 46, fontFamily: 'monospace', fontWeight: 900, marginTop: 4, textShadow: `0 0 20px ${CYAN}` }}>
                CLAUDE 5.5 SONNET [REASONING]
              </div>
              <div style={{ color: CYAN, fontSize: 28, fontFamily: 'monospace', fontWeight: 800, opacity: 0.95, marginTop: 2 }}>
                STREAMING: {Math.floor(1840 + Math.sin(frame * 0.4) * 160)} TOKENS/SEC | MULTI-STEP PLAN
              </div>
            </div>

            {/* Connecting Flow Cable 2 */}
            <div style={{ height: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: 4, height: '100%', backgroundColor: '#FF6600', boxShadow: '0 0 10px #FF6600' }} />
            </div>

            {/* NODE 3: n8n Router */}
            <div style={{
              padding: '16px 26px',
              borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(26, 12, 2, 0.96) 0%, rgba(12, 5, 1, 0.98) 100%)',
              border: '2.5px solid #FF6600',
              boxShadow: '0 12px 35px rgba(0,0,0,0.85), 0 0 25px rgba(255, 102, 0, 0.25)',
              transform: `scale(${interpolate(frame, [450, 460], [0.94, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
              opacity: interpolate(frame, [450, 456], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#FF6600', fontSize: 28, fontFamily: 'monospace', fontWeight: 900 }}>NODE 03 // DISPATCH ORCHESTRATOR</span>
                <span style={{ color: '#FF6600', fontSize: 25, fontFamily: 'monospace', fontWeight: 800 }}>● 3 BRANCHES ACTIVE</span>
              </div>
              <div style={{ color: '#FFF', fontSize: 44, fontFamily: 'monospace', fontWeight: 900, marginTop: 4 }}>n8n_ORCHESTRATOR [CORE]</div>
              <div style={{ color: '#FF9944', fontSize: 28, fontFamily: 'monospace', fontWeight: 800, opacity: 0.95, marginTop: 2 }}>DISPATCHING TOOLS: API | BROWSER | DATABASE</div>
            </div>

            {/* Connecting Flow Cable 3 */}
            <div style={{ height: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: 4, height: '100%', backgroundColor: '#00FF88', boxShadow: '0 0 10px #00FF88' }} />
            </div>

            {/* NODE 4: Execution Daemon */}
            <div style={{
              padding: '16px 26px',
              borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(2, 24, 12, 0.96) 0%, rgba(1, 10, 5, 0.98) 100%)',
              border: '2.5px solid #00FF88',
              boxShadow: '0 12px 35px rgba(0,0,0,0.85), 0 0 25px rgba(0, 255, 136, 0.25)',
              transform: `scale(${interpolate(frame, [458, 468], [0.94, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
              opacity: interpolate(frame, [458, 464], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#00FF88', fontSize: 28, fontFamily: 'monospace', fontWeight: 900 }}>NODE 04 // BACKGROUND EXECUTION</span>
                <span style={{ color: '#00FF88', fontSize: 25, fontFamily: 'monospace', fontWeight: 800 }}>● ZERO_HUMAN_IN_THE_LOOP</span>
              </div>
              <div style={{ color: '#FFF', fontSize: 44, fontFamily: 'monospace', fontWeight: 900, marginTop: 4 }}>STEALTH_BACKGROUND_DAEMON</div>
              <div style={{ color: '#88FFAA', fontSize: 28, fontFamily: 'monospace', fontWeight: 800, opacity: 0.95, marginTop: 2 }}>STATUS: RUNNING CONTINUOUSLY ON SERVER (24/7/365)</div>
            </div>
          </div>

          {/* Bottom Live Telemetry Terminal Feed */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderRadius: 16,
            background: 'rgba(0, 10, 18, 0.88)',
            border: '1.5px solid rgba(0, 229, 204, 0.45)',
            marginTop: 6
          }}>
            <div style={{ color: CYAN, fontSize: 28, fontFamily: 'monospace', fontWeight: 800 }}>
              {`> [TASK_RUNNER]: claude_agent.cycle_${Math.floor((frame - 432) / 4)} -> STATUS 200 OK`}
            </div>
            <div style={{ color: '#00FF88', fontSize: 26, fontFamily: 'monospace', fontWeight: 900 }}>
              UNSUPERVISED [100%]
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── LAYER 3.5: THE "متصممة عشان تشتغل بدلنا للأسف" BROADCAST TEXT BANNER (DEDICATED VERTICAL) ──
const AutonomousReplacementBannerVertical: React.FC<{ startFrame: number; endFrame: number }> = ({ startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame > endFrame) return null;

  const entrySpring = spring({ frame: frame - startFrame, fps, config: { damping: 14, stiffness: 120, mass: 1.0 } });
  const exitOpacity = interpolate(frame, [endFrame - 8, endFrame], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const translateY = interpolate(entrySpring, [0, 1], [120, 0]);
  const opacity = interpolate(entrySpring, [0, 1], [0, 1]) * exitOpacity;

  const pulse = Math.sin((frame - startFrame) * 0.22);
  const badgePulseScale = interpolate(pulse, [-1, 1], [0.95, 1.05]);
  const pulseGlow = interpolate(pulse, [-1, 1], [18, 42]);

  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      bottom: 360, // Safely across lower third on top of Mazen
      width: 980,
      marginLeft: -490,
      transform: `translateZ(260px) translateY(${translateY}px)`, // Rock solid container - ZERO text jitter!
      opacity,
      zIndex: 100,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(14, 2, 4, 0.98) 0%, rgba(28, 4, 8, 0.99) 100%)',
      border: `3px solid ${RED}`,
      boxShadow: `0 25px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(255, 51, 51, 0.5), inset 0 0 40px rgba(255, 51, 51, 0.35)`,
      display: 'flex',
      alignItems: 'stretch',
      direction: USE_ENGLISH_SUBTITLES ? 'ltr' : 'rtl',
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      {/* Alert Badge (Pulse restricted strictly to this badge - matching horizontal master) */}
      <div style={{
        backgroundColor: RED,
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        transform: `scale(${badgePulseScale})`,
        transformOrigin: 'center center',
        boxShadow: `0 0 ${pulseGlow}px rgba(255, 26, 75, 0.75)`,
        flexShrink: 0
      }}>
        <div style={{ color: '#FFF', fontSize: 24, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2 }}>
          CRITICAL
        </div>
        <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1.5 }}>
          OVERRIDE
        </div>
      </div>

      {/* Main Headline */}
      <div style={{ padding: '22px 34px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
        <div style={{
          color: '#FFFFFF',
          fontSize: USE_ENGLISH_SUBTITLES ? 32 : 38,
          fontFamily: USE_ENGLISH_SUBTITLES ? "'Inter', sans-serif" : "'Cairo', sans-serif",
          fontWeight: 900,
          textShadow: '0 0 25px rgba(255, 51, 51, 0.8), 0 4px 12px rgba(0,0,0,0.9)'
        }}>
          {USE_ENGLISH_SUBTITLES ? "Engineered to Replace Human Workers" : "متصممة عشان تشتغل بدلنا للأسف"}
        </div>
        <div style={{ color: CYAN, fontSize: USE_ENGLISH_SUBTITLES ? 20 : 21, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: 0.8 }}>
          {USE_ENGLISH_SUBTITLES ? "● TOTAL AUTONOMY PROTOCOL // ZERO_HUMAN_IN_THE_LOOP" : "● بروتوكول الاستبدال الكامل // ZERO_HUMAN_IN_THE_LOOP"}
        </div>
      </div>
    </div>
  );
};

// ── LAYER 4: THE "انتظرونا" 3D TEASER CLIMAX (VERTICAL) ──
const AntezeronaTeaserRibbonVertical: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - startFrame);

  if (frame < startFrame) return null;

  const ribbonSpring = spring({ frame: localFrame, fps: 30, config: { damping: 12, stiffness: 90, mass: 1.8 } });
  const scale = interpolate(ribbonSpring, [0, 1], [0.35, 1.0]);
  const rotateX = interpolate(ribbonSpring, [0, 1], [35, 0]);
  const translateZ = interpolate(ribbonSpring, [0, 1], [-450, 60]);
  const opacity = interpolate(ribbonSpring, [0, 0.3, 1], [0, 1, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '44%',
      width: 960,
      marginLeft: -480,
      marginTop: -160,
      transform: `perspective(1200px) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`,
      opacity,
      zIndex: 85,
      borderRadius: 28,
      background: 'linear-gradient(135deg, rgba(2, 8, 16, 0.95) 0%, rgba(1, 4, 8, 0.95) 100%)',
      border: `2.5px solid ${GOLD}`,
      boxShadow: `0 30px 80px rgba(0, 0, 0, 0.95), inset 0 0 50px rgba(255, 187, 0, 0.35)`,
      padding: '40px 48px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      pointerEvents: 'none'
    }}>
      <div style={{
        color: GOLD,
        fontSize: USE_ENGLISH_SUBTITLES ? 78 : 84,
        fontFamily: USE_ENGLISH_SUBTITLES ? "'Inter', sans-serif" : "'Cairo', sans-serif",
        fontWeight: 900,
        direction: USE_ENGLISH_SUBTITLES ? 'ltr' : 'rtl',
        textShadow: `0 0 40px ${GOLD}, 0 4px 18px rgba(0,0,0,0.9)`
      }}>
        {USE_ENGLISH_SUBTITLES ? "COMING SOON!" : "انتظرونا!"}
      </div>
      <div style={{
        color: '#FFFFFF',
        fontSize: USE_ENGLISH_SUBTITLES ? 26 : 30,
        fontFamily: USE_ENGLISH_SUBTITLES ? "'Inter', sans-serif" : "'Cairo', sans-serif",
        fontWeight: 800,
        direction: USE_ENGLISH_SUBTITLES ? 'ltr' : 'rtl',
        opacity: 0.95
      }}>
        {USE_ENGLISH_SUBTITLES ? "Full Episode Dropping on GoodBrains" : "الحلقة الكاملة قادمة قريبًا على القناة"}
      </div>
    </div>
  );
};

// ── LAYER 5: BEAT-CAPCUT VERTICAL MASTER VOICE-OVER CAPTIONS (CYBER FORENSIC KARAOKE) ──
interface CaptionSegment {
  start: number;
  end: number;
  words: { text: string; hit: number; highlightColor?: string }[];
}

const SCENE1_CAPTIONS_EN: CaptionSegment[] = [
  // 1. 00:00.24 - 00:01.84 (Frames 10 - 58)
  {
    start: 10,
    end: 58,
    words: [
      { text: "For two", hit: 10, highlightColor: "#00E5CC" },
      { text: "whole years,", hit: 26, highlightColor: "#FFE600" },
    ]
  },
  // 2. 00:01.97 - 00:03.73 (Frames 59 - 114)
  {
    start: 59,
    end: 114,
    words: [
      { text: "They convinced us", hit: 60 },
      { text: "that", hit: 78 },
      { text: "AI", hit: 83, highlightColor: "#00E5CC" },
      { text: "was", hit: 94 },
    ]
  },
  // 3. 00:03.86 - 00:04.90 (Frames 115 - 152)
  {
    start: 115,
    end: 152,
    words: [
      { text: "Just a", hit: 116 },
      { text: "simple", hit: 124, highlightColor: "#FF3333" },
      { text: "chatbot..", hit: 132, highlightColor: "#FF3333" },
    ]
  },
  // 4. 00:05.10 - 00:07.10 (Frames 153 - 216)
  {
    start: 153,
    end: 216,
    words: [
      { text: "A smart assistant", hit: 155 },
      { text: "living", hit: 174, highlightColor: "#FFE600" },
      { text: "inside a", hit: 184 },
      { text: "text box.", hit: 196 },
    ]
  },
  // 5. 00:07.39 - 00:09.25 (Frames 220 - 278)
  {
    start: 220,
    end: 278,
    words: [
      { text: "Until", hit: 222 },
      { text: "October", hit: 234, highlightColor: "#FFE600" },
      { text: "2026,", hit: 255, highlightColor: "#FFE600" },
    ]
  },
  // 6a. 00:09.30 - 00:10.36 (Frames 280 - 311)
  {
    start: 280,
    end: 311,
    words: [
      { text: "When the industry", hit: 281 },
      { text: "secretly", hit: 300 },
    ]
  },
  // 6b. 00:10.36 - 00:11.96 (Frames 312 - 364)
  {
    start: 312,
    end: 364,
    words: [
      { text: "FLIPPED", hit: 312, highlightColor: "#00E5CC" },
      { text: "THE SCRIPT.", hit: 326, highlightColor: "#00E5CC" },
    ]
  },
  // 7. 00:12.01 - 00:14.00 (Frames 365 - 426)
  {
    start: 365,
    end: 426,
    words: [
      { text: "The assistant era", hit: 368 },
      { text: "is officially", hit: 384, highlightColor: "#FF3333" },
      { text: "DEAD!", hit: 400, highlightColor: "#FF0055" },
    ]
  },
  // 8. 00:14.07 - 00:16.90 (Frames 428 - 510)
  {
    start: 428,
    end: 510,
    words: [
      { text: "We entered", hit: 430 },
      { text: "the era of", hit: 442 },
      { text: "AUTONOMOUS", hit: 456, highlightColor: "#00E5CC" },
      { text: "AGENTS.", hit: 474, highlightColor: "#00E5CC" },
    ]
  },
  // 9. 00:17.06 - 00:18.96 (Frames 512 - 569)
  {
    start: 512,
    end: 569,
    words: [
      { text: "Programs", hit: 516 },
      { text: "wired directly", hit: 528 },
      { text: "to frontier", hit: 540, highlightColor: "#FFE600" },
      { text: "LLMs..", hit: 554, highlightColor: "#FFE600" },
    ]
  },
  // 10. 00:19.00 - 00:21.10 (Frames 569 - 634)
  {
    start: 569,
    end: 634,
    words: [
      { text: "Designed", hit: 578, highlightColor: "#00E5CC" },
      { text: "not to", hit: 590 },
      { text: "chat with", hit: 598 },
      { text: "you..", hit: 614 },
    ]
  },
  // 11. 00:21.23 - 00:22.97 (Frames 636 - 694)
  {
    start: 636,
    end: 694,
    words: [
      { text: "But to", hit: 638 },
      { text: "WORK", hit: 654, highlightColor: "#00FF88" },
      { text: "INSTEAD OF YOU!", hit: 668, highlightColor: "#00FF88" },
    ]
  },
  // 12. 00:23.15 - 00:25.25 (Frames 695 - 760)
  {
    start: 695,
    end: 760,
    words: [
      { text: "Monitoring,", hit: 698, highlightColor: "#00E5CC" },
      { text: "selling,", hit: 716, highlightColor: "#FFE600" },
      { text: "closing deals..", hit: 728, highlightColor: "#FF8800" },
    ]
  },
  // 13. 00:25.29 - 00:28.00 (Frames 760 - 845)
  {
    start: 760,
    end: 845,
    words: [
      { text: "Breaching systems", hit: 764, highlightColor: "#FF3333" },
      { text: "silently", hit: 788 },
      { text: "while you", hit: 808 },
      { text: "sleep!", hit: 822, highlightColor: "#00E5CC" },
    ]
  },
  // 14a. 00:28.47 - 00:29.90 (Frames 852 - 898)
  {
    start: 852,
    end: 898,
    words: [
      { text: "There's a reason", hit: 856, highlightColor: "#FFE600" },
      { text: "they dumped", hit: 876 },
      { text: "this tech..", hit: 886, highlightColor: "#FF3333" },
    ]
  },
  // 14b. 00:29.90 - 00:31.04 (Frames 898 - 934)
  {
    start: 898,
    end: 934,
    words: [
      { text: "Into the wild", hit: 902, highlightColor: "#00E5CC" },
      { text: "at this speed..", hit: 920, highlightColor: "#FFE600" },
    ]
  },
  // 16a. 00:31.06 - 00:32.18 (Frames 936 - 978) - Shifted to start @ 00:31.06
  {
    start: 936,
    end: 978,
    words: [
      { text: "And a reason", hit: 938 },
      { text: "they fired", hit: 952 },
      { text: "anyone who..", hit: 966, highlightColor: "#FF3333" },
    ]
  },
  // 16b. 00:32.18 - 00:33.24 (Frames 978 - 1014)
  {
    start: 978,
    end: 1014,
    words: [
      { text: "Ever dared", hit: 982 },
      { text: "to try and..", hit: 996 },
    ]
  },
  // 17. 00:33.24 - 00:35.04 (Frames 1014 - 1054)
  {
    start: 1014,
    end: 1054,
    words: [
      { text: "STOP THEM!", hit: 1018, highlightColor: "#FF0055" },
    ]
  }
];

const SCENE1_CAPTIONS: CaptionSegment[] = [
  // 1. 00:00.24 - 00:01.84 (Frames 10 - 58) [2 words]
  {
    start: 10,
    end: 58,
    words: [
      { text: "لسنتين", hit: 10, highlightColor: "#00E5CC" },
      { text: "كاملين،", hit: 26, highlightColor: "#FFE600" },
    ]
  },
  // 2. 00:01.97 - 00:03.73 (Frames 59 - 114) [4 words]
  {
    start: 59,
    end: 114,
    words: [
      { text: "أقنعونا", hit: 60 },
      { text: "إن", hit: 78 },
      { text: "الذكاء", hit: 83, highlightColor: "#00E5CC" },
      { text: "الاصطناعي", hit: 94, highlightColor: "#00E5CC" },
    ]
  },
  // 3. 00:03.86 - 00:04.90 (Frames 115 - 152) [3 words]
  {
    start: 115,
    end: 152,
    words: [
      { text: "مجرد", hit: 116 },
      { text: "شات", hit: 124, highlightColor: "#FF3333" },
      { text: "بوت..", hit: 132, highlightColor: "#FF3333" },
    ]
  },
  // 4. 00:05.10 - 00:07.10 (Frames 153 - 216) [6 words]
  {
    start: 153,
    end: 216,
    words: [
      { text: "مساعد", hit: 155 },
      { text: "ذكي", hit: 164 },
      { text: "عايش", hit: 174, highlightColor: "#FFE600" },
      { text: "جوه", hit: 184 },
      { text: "مربع", hit: 192 },
      { text: "نص.", hit: 202 },
    ]
  },
  // 5. 00:07.39 - 00:09.25 (Frames 220 - 278) [5 words: "ستة وعشرين" spoken verbatim]
  {
    start: 220,
    end: 278,
    words: [
      { text: "بس", hit: 222 },
      { text: "في", hit: 228 },
      { text: "أكتوبر", hit: 234, highlightColor: "#FFE600" },
      { text: "ستة", hit: 252, highlightColor: "#FFE600" },
      { text: "وعشرين،", hit: 261, highlightColor: "#FFE600" },
    ]
  },
  // 6. 00:09.30 - 00:11.96 (Frames 280 - 364) [6 words]
  {
    start: 280,
    end: 364,
    words: [
      { text: "الصناعة", hit: 281 },
      { text: "كلها", hit: 298 },
      { text: "قلبت", hit: 310, highlightColor: "#00E5CC" },
      { text: "الموازين", hit: 322, highlightColor: "#00E5CC" },
      { text: "في", hit: 334 },
      { text: "السر.", hit: 338 },
    ]
  },
  // 7. 00:12.01 - 00:14.00 (Frames 365 - 426) [4 words]
  {
    start: 365,
    end: 426,
    words: [
      { text: "عصر", hit: 368 },
      { text: "المساعد", hit: 376, highlightColor: "#FF3333" },
      { text: "الذكي", hit: 388, highlightColor: "#FF3333" },
      { text: "انتهى!", hit: 400, highlightColor: "#FF0055" },
    ]
  },
  // 8. 00:14.07 - 00:16.90 (Frames 428 - 510) [5 words]
  {
    start: 428,
    end: 510,
    words: [
      { text: "إحنا", hit: 430 },
      { text: "دخلنا", hit: 438 },
      { text: "عصر", hit: 446 },
      { text: "الوكلاء", hit: 456, highlightColor: "#00E5CC" },
      { text: "المستقلين", hit: 474, highlightColor: "#00E5CC" },
    ]
  },
  // 9. 00:17.06 - 00:18.96 (Frames 512 - 569) [4 words: strictly ends at Pose 3 cut]
  {
    start: 512,
    end: 569,
    words: [
      { text: "برامج", hit: 516 },
      { text: "مربوطة", hit: 526 },
      { text: "بالنماذج", hit: 540, highlightColor: "#FFE600" },
      { text: "الكبيرة..", hit: 554, highlightColor: "#FFE600" },
    ]
  },
  // 10. 00:19.00 - 00:21.10 (Frames 569 - 634) [5 words: starts clean on Pose 3 cut]
  {
    start: 569,
    end: 634,
    words: [
      { text: "متصممة", hit: 578, highlightColor: "#00E5CC" },
      { text: "مش", hit: 590 },
      { text: "عشان", hit: 596 },
      { text: "تتكلم", hit: 606 },
      { text: "معاك..", hit: 618 },
    ]
  },
  // 11. 00:21.23 - 00:22.97 (Frames 636 - 694) [4 words]
  {
    start: 636,
    end: 694,
    words: [
      { text: "لكن", hit: 638 },
      { text: "عشان", hit: 646 },
      { text: "تشتغل", hit: 654, highlightColor: "#00FF88" },
      { text: "بدالك!", hit: 668, highlightColor: "#00FF88" },
    ]
  },
  // 12. 00:23.15 - 00:25.25 (Frames 695 - 760) [4 words]
  {
    start: 695,
    end: 760,
    words: [
      { text: "تراقب،", hit: 698, highlightColor: "#00E5CC" },
      { text: "تبيع،", hit: 716, highlightColor: "#FFE600" },
      { text: "تقفل", hit: 726, highlightColor: "#FF8800" },
      { text: "صفقات..", hit: 738, highlightColor: "#FF8800" },
    ]
  },
  // 13. 00:25.29 - 00:28.00 (Frames 760 - 845) [6 words]
  {
    start: 760,
    end: 845,
    words: [
      { text: "وتخترق", hit: 764, highlightColor: "#FF3333" },
      { text: "أنظمة", hit: 778, highlightColor: "#FF3333" },
      { text: "في", hit: 788 },
      { text: "الخلفية", hit: 794 },
      { text: "وأنت", hit: 814 },
      { text: "نايم!", hit: 822, highlightColor: "#00E5CC" },
    ]
  },
  // 14a. 00:28.47 - 00:29.90 (Frames 852 - 898) [5 words: rock-solid single line]
  {
    start: 852,
    end: 898,
    words: [
      { text: "بس", hit: 856 },
      { text: "في", hit: 862 },
      { text: "سبب", hit: 866, highlightColor: "#FFE600" },
      { text: "خلاهم", hit: 876 },
      { text: "يرموا..", hit: 886, highlightColor: "#FF3333" },
    ]
  },
  // 14b. 00:29.90 - 00:31.25 (Frames 898 - 936) [4 words: rock-solid single line]
  {
    start: 898,
    end: 936,
    words: [
      { text: "التكنولوجيا", hit: 902, highlightColor: "#00E5CC" },
      { text: "دي", hit: 918 },
      { text: "في", hit: 922 },
      { text: "السوق..", hit: 926, highlightColor: "#FFE600" },
    ]
  },
  // 15. 00:31.25 - 00:32.10 (Frames 936 - 966) [2 words: high-impact punchline]
  {
    start: 936,
    end: 966,
    words: [
      { text: "بالسرعة", hit: 938, highlightColor: "#FF3333" },
      { text: "دي!", hit: 950, highlightColor: "#FF3333" },
    ]
  },
  // 16a. 00:32.22 - 00:33.72 (Frames 968 - 1012) [4 words: rock-solid single line]
  {
    start: 968,
    end: 1012,
    words: [
      { text: "وفي", hit: 970 },
      { text: "سبب", hit: 980 },
      { text: "خلاهم", hit: 990 },
      { text: "يطردوا..", hit: 1004, highlightColor: "#FF3333" },
    ]
  },
  // 16b. 00:33.72 - 00:34.58 (Frames 1012 - 1036) [3 words: rock-solid single line]
  {
    start: 1012,
    end: 1036,
    words: [
      { text: "أي", hit: 1014 },
      { text: "حد", hit: 1018 },
      { text: "بيحاول..", hit: 1024 },
    ]
  },
  // 17. 00:34.58 - 00:35.12 (Frames 1036 - 1054) [1 word: Climax button hit @ 00:35.12]
  {
    start: 1036,
    end: 1054,
    words: [
      { text: "يوقفهم!", hit: 1038, highlightColor: "#FF0055" },
    ]
  }
];

const VerticalMasterCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find active segment
  const captionsList = USE_ENGLISH_SUBTITLES ? SCENE1_CAPTIONS_EN : SCENE1_CAPTIONS;
  const activeSegment = captionsList.find(s => frame >= s.start && frame < s.end);
  if (!activeSegment) return null;

  // Spring entrance on segment start
  const segmentAge = frame - activeSegment.start;
  const entrySpring = spring({ frame: segmentAge, fps, config: { damping: 13, stiffness: 150, mass: 0.8 } });
  const entryScale = interpolate(entrySpring, [0, 1], [0.88, 1]);
  const entryOpacity = interpolate(entrySpring, [0, 1], [0, 1]);
  const entryTranslateY = interpolate(entrySpring, [0, 1], [14, 0]);

  // Platform UI Safe Area Routing:
  let captionBottom = 420;
  if (frame >= 240 && frame < 432) {
    captionBottom = 280;
  } else if (frame >= 432 && frame < 570) {
    captionBottom = 240;
  }

  const captionFloatY = Math.sin(frame * 0.08) * 3;

  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      bottom: captionBottom,
      transform: `translateX(-50%) translateY(${entryTranslateY + captionFloatY}px) scale(${entryScale})`,
      opacity: entryOpacity,
      zIndex: 120,
      pointerEvents: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 'auto',
      maxWidth: 960,
      direction: USE_ENGLISH_SUBTITLES ? 'ltr' : 'rtl'
    }}>
      <div style={{
        padding: '12px 28px',
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(2, 10, 20, 0.90) 0%, rgba(1, 6, 12, 0.96) 100%)',
        border: '1.5px solid rgba(0, 229, 204, 0.55)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(0, 229, 204, 0.25), inset 0 0 25px rgba(0, 229, 204, 0.12)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexWrap: 'nowrap',
        whiteSpace: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px 18px',
        position: 'relative'
      }}>
        {/* Subtle Cyber Forensic Top Accent Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: 2,
          background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`,
          boxShadow: `0 0 10px ${CYAN}`
        }} />

        {activeSegment.words.map((w, wIdx) => {
          const isSpoken = frame >= w.hit;
          const nextWord = activeSegment.words[wIdx + 1];
          const isCurrentlyActive = isSpoken && (!nextWord || frame < nextWord.hit);
          const activeColor = w.highlightColor || CYAN;

          // 8-way heavy solid black outline + deep diffuse drop shadow (100% contrast against any background)
          const heavyBlackOutline = '3.5px 3.5px 0 #000, -3.5px -3.5px 0 #000, 3.5px -3.5px 0 #000, -3.5px 3.5px 0 #000, 0 4px 0 #000, 0 -4px 0 #000, 4px 0 0 #000, -4px 0 0 #000, 0 12px 28px rgba(0, 0, 0, 0.98), 0 2px 4px rgba(0, 0, 0, 1)';

          return (
            <span
              key={wIdx}
              style={{
                fontFamily: USE_ENGLISH_SUBTITLES ? "'Inter', sans-serif" : "'Cairo', 'Tajawal', sans-serif",
                fontSize: isCurrentlyActive ? (USE_ENGLISH_SUBTITLES ? 44 : 54) : (USE_ENGLISH_SUBTITLES ? 38 : 48),
                fontWeight: 900,
                letterSpacing: USE_ENGLISH_SUBTITLES ? -0.2 : 0.5,
                color: isCurrentlyActive ? activeColor : (isSpoken ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)'),
                textShadow: isCurrentlyActive
                  ? `${heavyBlackOutline}, 0 0 35px ${activeColor}, 0 0 15px ${activeColor}`
                  : heavyBlackOutline,
                transform: isCurrentlyActive ? 'scale(1.08)' : 'scale(1.0)',
                transition: 'transform 0.08s ease-out, color 0.08s ease-out',
                display: 'inline-block'
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ── MASTER BRAND OUTRO VERTICAL (NATURALLY ADAPTED FROM BRANDOUTROHORIZONTAL) ──
const BrandOutroVertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryBlur  = interpolate(frame, [0, 12], [50, 0], { extrapolateRight: "clamp" });
  const bgScale    = 1 + frame * 0.001;
  const tealPulse    = 0.30 + 0.20 * Math.sin(frame * 0.11);
  const magentaPulse = 0.25 + 0.20 * Math.sin(frame * 0.09 + 1.5);

  const logoSpring  = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });
  const logoScale   = interpolate(logoSpring, [0, 1], [0, 1.4]);
  const logoOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const logoFloat   = Math.sin(frame * 0.1) * 8;
  const heartLeftX  = interpolate(logoSpring, [0, 1], [-180, 0]);
  const heartRightX = interpolate(logoSpring, [0, 1], [180, 0]);

  const labelStart  = 25;
  const labelSpring = spring({ frame: Math.max(0, frame - labelStart), fps, config: { damping: 11, stiffness: 100 } });
  const labelScale  = interpolate(labelSpring, [0, 1], [0.4, 1]);
  const labelOpacity = interpolate(frame, [labelStart, labelStart + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineWidth   = interpolate(frame, [35, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const slam1Start  = 45;
  const slam1Spring = spring({ frame: Math.max(0, frame - slam1Start), fps, config: { damping: 8, stiffness: 180 } });
  const slam1Y      = interpolate(slam1Spring, [0, 1], [-250, 0]);
  const slam1Scl    = interpolate(slam1Spring, [0, 1], [2.0, 1]);
  const slam1Opc    = interpolate(frame, [slam1Start, slam1Start + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const slam2Start  = 70;
  const slam2Spring = spring({ frame: Math.max(0, frame - slam2Start), fps, config: { damping: 9, stiffness: 140 } });
  const slam2X      = interpolate(slam2Spring, [0, 1], [600, 0]);
  const slam2Opc    = interpolate(frame, [slam2Start, slam2Start + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", filter: `blur(${entryBlur}px)`, backgroundColor: "#020205" }}>
      <AbsoluteFill style={{
        backgroundImage: `url(${staticFile("youtube-assets/bg-circuit.jpeg")})`,
        backgroundSize: `cover`,
        backgroundPosition: "center center",
        transform: `scale(${bgScale})`,
        willChange: "transform",
        filter: "contrast(1.5) brightness(0.4) saturate(0.7)"
      }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 80% at 15% 50%, rgba(34,211,238,${tealPulse}) 0%, transparent 65%)`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 80% at 85% 50%, rgba(236,72,153,${magentaPulse}) 0%, transparent 65%)`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 70% at 50% 50%, transparent 30%, rgba(3,3,8,0.75) 100%)" }} />

      {/* Grid Scanlines */}
      <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 3px)", zIndex: 50 }} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 40 }}>
        {/* LOGO */}
        <div style={{ transform: `scale(${logoScale}) translateY(${logoFloat}px)`, opacity: logoOpacity, willChange: "transform", marginBottom: 35, position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle at center, rgba(34,211,238,0.3) 0%, rgba(236,72,153,0.2) 50%, transparent 80%)", filter: "blur(40px)" }} />
          <div style={{ position: "relative", width: 220, height: 220 }}>
            <img src={staticFile("youtube-assets/heart-teal.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", transform: `translateX(${heartLeftX}px)`, filter: "drop-shadow(0 0 35px rgba(34,211,238,0.7))" }} alt="" />
            <img src={staticFile("youtube-assets/heart-pink.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", transform: `translateX(${heartRightX}px)`, filter: "drop-shadow(0 0 35px rgba(236,72,153,0.7))" }} alt="" />
          </div>
        </div>

        {/* TEXT BLOCK */}
        <div style={{ transform: `scale(${labelScale})`, opacity: labelOpacity, display: "flex", flexDirection: "column", alignItems: "center", willChange: "transform", marginTop: 10 }}>
          <h1 style={{ margin: 0, fontSize: 88, fontWeight: 900, color: "#ffffff", letterSpacing: 4, fontFamily: "'Cairo', 'Inter', sans-serif", textShadow: "0 0 50px rgba(255,255,255,0.25), 0 10px 40px rgba(0,0,0,0.9)", direction: "rtl" }}>
            حرفين ولكن
          </h1>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 8, textTransform: "uppercase", marginTop: 10 }}>
            <span style={{ color: "#22d3ee", textShadow: "0 0 30px rgba(34,211,238,0.8)", marginRight: 10 }}>GOODBRAINS</span>
            <span style={{ color: "#ec4899", textShadow: "0 0 30px rgba(236,72,153,0.8)" }}>STUDIOS</span>
          </div>
        </div>

        {/* DIVIDER LINE */}
        <div style={{ width: "75%", transform: `scaleX(${lineWidth}) translateZ(0)`, transformOrigin: "center center", willChange: "transform", height: 4, margin: "32px 0 25px 0", background: "linear-gradient(to right, transparent, #22d3ee, rgba(255,255,255,0.8), #ec4899, transparent)", boxShadow: "0 0 30px rgba(34,211,238,0.6), 0 0 30px rgba(236,72,153,0.6)", borderRadius: 2 }} />

        {/* SLOGAN */}
        <div style={{ transform: `translateY(${slam1Y}px) scale(${slam1Scl})`, opacity: slam1Opc, transformOrigin: "top center", willChange: "transform" }}>
          <p style={{
            margin: 0,
            padding: '8px 24px',
            fontSize: 36,
            fontWeight: 900,
            whiteSpace: 'nowrap',
            color: "#ffffff",
            textAlign: "center",
            fontFamily: "'Inter', sans-serif",
            textShadow: "0 0 40px rgba(236,72,153,0.6), 0 10px 40px rgba(0,0,0,0.9)"
          }}>
            A GoodBrains Production for Harfen w Laken
          </p>
        </div>

        {/* COPYRIGHT */}
        <div style={{ transform: `translateX(${slam2X}px)`, opacity: slam2Opc, marginTop: 20, willChange: "transform" }}>
          <p style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            color: "#A9B0B7",
            fontFamily: "'Inter', monospace",
            textShadow: "0 0 15px rgba(169, 176, 183, 0.5), 0 4px 10px rgba(0,0,0,0.8)"
          }}>
            goodbrains.pro • all rights reserved
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── MASTER VERTICAL SCENE 1 COMPOSITION (1080×1920) ──
export const Episode5Scene1Vertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── KEY TIMINGS (Preserved 100% strictly from horizontal master) ──
  const F_POSE2 = 240;
  const F_POSE3 = 569; // 00:18.29
  const F_BANNER_START = 626; // 00:20.26
  const F_BANNER_END = 780; // 00:26.00
  const F_POSE4 = 849; // 00:28.09 (Hit 1 on "بس فى سبب")
  const F_BUTTON_SLAM = 964; // 00:32.04 (Hit 2 on "يوقفهم!")
  const F_TEASER = 1054; // 00:35.12 (Exact entry of the wait for us card @ 00:35.12)
  const F_WHIP_OUT = 1140; // 00:38.00 (Whip-pan out to outro)

  // ── 8-FRAME CHROMATIC ABERRATION CUT TRIGGERS ──
  const isCutPose2 = frame >= F_POSE2 && frame < F_POSE2 + 8;
  const isCutPose3 = frame >= F_POSE3 && frame < F_POSE3 + 8;
  const isCutPose4 = frame >= F_POSE4 && frame < F_POSE4 + 8;
  const isButtonShock = frame >= F_BUTTON_SLAM && frame < F_BUTTON_SLAM + 6;

  const cutOffset = isCutPose2
    ? Math.sin((frame - F_POSE2) * 45) * 60 * (1 - (frame - F_POSE2) / 8)
    : isCutPose3
      ? Math.sin((frame - F_POSE3) * 45) * 60 * (1 - (frame - F_POSE3) / 8)
      : isCutPose4
        ? Math.sin((frame - F_POSE4) * 45) * 70 * (1 - (frame - F_POSE4) / 8)
        : isButtonShock
          ? Math.sin((frame - F_BUTTON_SLAM) * 60) * 90 * (1 - (frame - F_BUTTON_SLAM) / 6)
          : 0;

  // ── ACTIVE MAZEN POSE & PRECISION VERTICAL GROUNDING (NOT CRUSHED!) ──
  // Container: 1920x1080 anchored at bottom: 0, left: 50%, marginLeft: -960px
  // Mazen displays at full 100% native resolution, filling the lower 60-65% of the 1920 canvas naturally!
  let activePoseImg = staticFile('images/episode5/scene-1/mazen-pose1a.png');
  let poseOffsetX = 0;
  let poseOffsetY = 0;
  let poseScale = 1.18;
  let poseOrigin = 'bottom center';

  if (frame < F_POSE2) {
    const scrubPattern = [
      '1a', '1a', '1b', '1b', '1c', '1c', '1b', '1b',
      '1a', '1a', '1a', '1b', '1b', '1b', '1b', '1b',
      '1c', '1c', '1b', '1b', '1a', '1a', '1b', '1b',
      '1c', '1b', '1a', '1a', '1b', '1c', '1c', '1c',
    ];
    const scrubIdx = Math.floor(frame / 2.5) % scrubPattern.length;
    const poseKey = scrubPattern[scrubIdx];
    if (poseKey === '1a') activePoseImg = staticFile('images/episode5/scene-1/mazen-pose1a.png');
    else if (poseKey === '1b') activePoseImg = staticFile('images/episode5/scene-1/mazen-pose1b.png');
    else activePoseImg = staticFile('images/episode5/scene-1/mazen-pose1c.png');

    const stopMotionJitterX = (Math.floor(frame / 2) * 7) % 3 - 1;
    const stopMotionJitterY = (Math.floor(frame / 2) * 11) % 3 - 1;

    const baseShiftX = 85; // Shift slightly right to frame tape console and Mazen naturally in 9:16
    poseScale = 1.20;
    poseOffsetX = baseShiftX + stopMotionJitterX;
    poseOffsetY = stopMotionJitterY;
    poseOrigin = 'bottom center';
  } else if (frame < F_POSE3) {
    activePoseImg = staticFile('images/episode5/scene-1/mazen-pose-2-vertical.png');
    poseScale = 1.0;
    const mazenExitProgress = interpolate(frame, [432, 452], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.in(Easing.cubic)
    });
    // Final calibrated position (-64px) for perfect headroom and chest framing
    poseOffsetX = 0;
    poseOffsetY = interpolate(mazenExitProgress, [0, 1], [-64, 1600]);
    poseOrigin = 'bottom center';
  } else if (frame < F_POSE4) {
    activePoseImg = staticFile('images/episode5/scene-1/mazen-pose-3-vertical.png');
    poseScale = 1.0;
    poseOffsetX = 0;
    poseOffsetY = 0;
    poseOrigin = 'bottom center';
  } else {
    activePoseImg = staticFile('images/episode5/scene-1/mazen-pose-4-vertical.png');
    poseScale = 1.0;
    poseOffsetX = 0;
    poseOffsetY = 0;
    poseOrigin = 'bottom center';
  }

  // ── 3D CAMERA DIVE ──
  let cameraZ = 0;
  let cameraX = 0;
  let cameraY = 0;

  if (frame < F_POSE2) {
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
      cameraZ = 1450;
      cameraX = 0;
    } else {
      const rampProgress = interpolate(frame, [228, 240], [0, 1], {
        easing: Easing.in(Easing.cubic)
      });
      cameraZ = interpolate(rampProgress, [0, 1], [1450, 3200]);
      cameraX = 0;
    }
    cameraY = 0;
  } else if (frame < F_POSE3) {
    if (frame < 432) {
      const p2Progress = interpolate(frame, [F_POSE2, 432], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.quad)
      });
      cameraZ = interpolate(p2Progress, [0, 1], [0, 45]);
      cameraX = interpolate(p2Progress, [0, 1], [15, 0]);
      cameraY = Math.sin((frame - F_POSE2) * 0.04) * 4;
    } else {
      const settleProgress = interpolate(frame, [432, 456], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic)
      });
      cameraZ = interpolate(settleProgress, [0, 1], [45, 0]);
      cameraX = 0;
      cameraY = 0;
    }
  } else if (frame < F_POSE4) {
    cameraZ = 0;
    cameraX = 0;
    cameraY = 0;
  } else if (frame < F_TEASER) {
    cameraZ = interpolate(frame, [F_POSE4, F_TEASER], [0, 25], { extrapolateRight: 'clamp' });
    cameraX = 0;
    cameraY = 0;
  } else {
    cameraZ = 0;
    cameraX = 0;
    cameraY = 0;
  }

  // Multi-plane organic camera parallax drift (creates rich 3D separation between Studio BG, HUD, Mazen, and Captions)
  const organicCamX = Math.sin(frame * 0.02) * 8;
  const organicCamY = Math.cos(frame * 0.025) * 6;

  const shakeX = isButtonShock ? (Math.random() - 0.5) * 18 : 0;
  const shakeY = isButtonShock ? (Math.random() - 0.5) * 18 : 0;

  // Rack focus on Mazen
  const rackFocusProgress = interpolate(frame, [15, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic)
  });
  const mazenBlur = interpolate(rackFocusProgress, [0, 1], [12, 0]);
  const bgRackBlur = interpolate(rackFocusProgress, [0, 1], [0, 4.0]);

  // Background drift & multi-plane parallax across entire scene
  const bgParallaxX = interpolate(frame, [0, F_WHIP_OUT], [0, -120], { extrapolateRight: 'clamp' });
  const p3Progress = interpolate(frame, [F_POSE3, F_POSE4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad)
  });
  const p3BgDriftX = frame >= F_POSE3 && frame < F_POSE4
    ? interpolate(p3Progress, [0, 1], [25, -25])
    : 0;
  const p3BgFloatY = frame >= F_POSE3 && frame < F_POSE4
    ? Math.sin((frame - F_POSE3) * 0.04) * 12
    : 0;
  const p3BgZoom = frame >= F_POSE3 && frame < F_POSE4
    ? interpolate(p3Progress, [0, 1], [1.0, 1.08])
    : 1.0;

  // ── CINEMATIC OPTICAL BLURS BEFORE ANAMORPHIC WHIP-PAN TO OUTRO ──
  const isCutActive = isCutPose2 || isCutPose3 || isCutPose4 || isButtonShock;
  const cutMotionBlur = isCutActive ? 6 : 0;
  const whipMotionBlur = interpolate(frame, [F_WHIP_OUT - 18, F_WHIP_OUT], [0, 26], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bgBlur = bgRackBlur + cutMotionBlur + whipMotionBlur;

  return (
    <AbsoluteFill style={{ backgroundColor: "#020202", overflow: "hidden" }}>
      {/* ── AUDIO TRACK ── */}
      <Audio src={staticFile('audio/episode5/mazen-vo-scene1.mp3')} volume={1} />

      {/* ── MAIN WHIP-PAN WRAPPER TO OUTRO AT 0:38 ── */}
      <AnamorphicWhipPan
        transitionStartFrame={F_WHIP_OUT}
        durationFrames={18}
        caColorA="rgba(0, 229, 204, 0.3)"
        caColorB="rgba(255, 0, 85, 0.3)"
        flareColor="rgba(0, 229, 204, 0.7)"
        childrenA={
          <AbsoluteFill style={{ overflow: 'hidden', perspective: 1400 }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              transform: `translateZ(${cameraZ}px) translateX(${-cameraX + shakeX + organicCamX}px) translateY(${cameraY + shakeY + organicCamY}px)`
            }}>
              {/* LAYER 1: STUDIO BACKGROUND (Z = -3600px - Multi-plane deep parallax) */}
              <div style={{
                position: 'absolute',
                width: 1080,
                height: 1920,
                left: '50%',
                top: '50%',
                marginLeft: -540,
                marginTop: -960,
                transform: `translateZ(-3600px) translateX(${bgParallaxX + p3BgDriftX}px) translateY(${p3BgFloatY}px) scale(${5.0 * p3BgZoom})`,
                transformStyle: 'preserve-3d'
              }}>
                <img
                  src={staticFile('images/episode5/harfen-studio.jpeg')}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: `blur(${bgBlur.toFixed(1)}px) grayscale(0.5) sepia(0.4) contrast(1.3) brightness(0.9)`
                  }}
                  alt=""
                />

                {/* Lighting Gels */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: CYAN,
                  mixBlendMode: 'multiply',
                  opacity: interpolate(frame, [0, F_POSE2 - 20, F_POSE2], [0.35, 0.35, 0], { extrapolateRight: 'clamp' })
                }} />

                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: AMBER,
                  mixBlendMode: 'multiply',
                  opacity: interpolate(frame, [F_POSE2, F_POSE2 + 15, F_POSE3 - 15, F_POSE3], [0, 0.45, 0.45, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
                }} />

                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: MAGENTA,
                  mixBlendMode: 'multiply',
                  opacity: interpolate(frame, [F_POSE3, F_POSE3 + 15, F_POSE4 - 15, F_POSE4], [0, 0.5, 0.5, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
                }} />

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
              </div>

              {/* LAYER 1.5: 3D CHATBOT WALL SCREEN (Shot 1 Only) */}
              {frame < F_POSE2 && <BackgroundChatbotScreenVertical />}

              {/* LAYER 2: 3D CLAUDE + n8n STUDIO WALL HUD (Shot 2 Only) */}
              {frame >= F_POSE2 && <N8nClaudeStudioHUDVertical exitFrame={F_POSE3} />}

              {/* LAYER 3: FOREGROUND MAZEN & CONSOLE (1920x1080 Anchor - NEVER CRUSHED!) */}
              {(() => {
                if (frame >= F_TEASER) return null;

                const mazenOpacity = frame >= F_TEASER - 8
                  ? interpolate(frame, [F_TEASER - 8, F_TEASER], [1, 0], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                      easing: Easing.inOut(Easing.quad)
                    })
                  : 1;

                const mazenDivePushX = frame < F_POSE2
                  ? interpolate(frame, [168, 198], [0, 1400], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                      easing: Easing.in(Easing.cubic)
                    })
                  : 0;

                const mazenMotionBlur = frame < F_POSE2
                  ? interpolate(frame, [168, 198], [0, 26], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                      easing: Easing.in(Easing.cubic)
                    })
                  : 0;

                const mazenExitMotionBlur = frame >= 430 && frame <= 455
                  ? interpolate(frame, [430, 442, 455], [0, 26, 0], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                      easing: Easing.inOut(Easing.quad)
                    })
                  : 0;

                const whipMazenBlur = interpolate(frame, [F_WHIP_OUT - 15, F_WHIP_OUT], [0, 20], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp'
                });

                const totalMazenBlur = mazenBlur + mazenMotionBlur + mazenExitMotionBlur + whipMazenBlur;

                const isVerticalPose = frame >= F_POSE2;
                const containerWidth = isVerticalPose ? 1080 : 1920;
                const containerHeight = isVerticalPose ? 1920 : 1080;
                const containerMarginLeft = isVerticalPose ? -540 : -960;

                return (
                  <div style={{
                    position: 'absolute',
                    width: containerWidth,
                    height: containerHeight,
                    left: '50%',
                    bottom: 0,
                    marginLeft: containerMarginLeft,
                    transformStyle: 'preserve-3d',
                    transformOrigin: poseOrigin,
                    transform: `translateZ(80px) translateX(${poseOffsetX + mazenDivePushX}px) translateY(${poseOffsetY}px) scale(${poseScale})`,
                    filter: totalMazenBlur > 0.05 ? `blur(${totalMazenBlur.toFixed(2)}px)` : 'none',
                    opacity: mazenOpacity,
                    zIndex: 50
                  }}>
                    <img
                      src={activePoseImg}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }}
                      alt=""
                    />

                    {/* Authentic Studer 3D Aluminum Tape Reel SVG physically mounted on Mazen's deck */}
                    {frame < F_POSE2 && <RotatingTapeReel frame={frame} />}

                    {/* 8-Frame Motion Stop Chromatic Aberration Overlay */}
                    {cutOffset !== 0 && (
                      <CharacterCA3D imgSrc={activePoseImg} caX={cutOffset} />
                    )}
                  </div>
                );
              })()}

              {/* LAYER 4: TEASER CLIMAX */}
              <AntezeronaTeaserRibbonVertical startFrame={F_TEASER} />
            </div>

            {/* LAYER 5: BEAT-CAPCUT VERTICAL MASTER VOICE-OVER CAPTIONS */}
            <VerticalMasterCaptions />

            <DioramaOverlay />
            <GlobalTexture />
          </AbsoluteFill>
        }
        childrenB={
          <Sequence from={F_WHIP_OUT} durationInFrames={180}>
            <BrandOutroVertical />
          </Sequence>
        }
      />
    </AbsoluteFill>
  );
};
