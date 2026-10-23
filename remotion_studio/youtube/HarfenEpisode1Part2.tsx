import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Video,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img
} from "remotion";

export const EPISODE_1_PART_2_DURATION = 3500; // ~1m 56s

const ASSET_PATH = "youtube-assets/episode-1-part-2-assets";

// ─── 1. GOLDEN COIN DROP & BAM BUBBLE ─────────────────────────────────────
// ─── 1. GOLDEN COIN DROP & BAM BUBBLE ─────────────────────────────────────
const GoldenCoinDrop: React.FC<{ startFrame: number; duration: number }> = ({ startFrame, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Coin starts at 00:01.18 (48). Switch to bubble exactly at 00:03.23 (113). Bubble disappears at 00:04.27 (147).
  if (frame < startFrame || frame > 147 + 5) return null; // Small buffer for fade

  const localFrame = frame - startFrame;
  const pop = spring({ frame: localFrame, fps, config: { damping: 10, stiffness: 90, mass: 1.5 } });
  
  const bamStart = 65; // (113 - 48) Switch to bubble exactly at 00:03.23
  const bamEnd = 99; // (147 - 48) Disappears at 00:04.27
  const isBam = localFrame >= bamStart && localFrame <= bamEnd;
  const isAfterBam = localFrame > bamEnd;
  const bamLocal = Math.max(0, localFrame - bamStart);
  
  const bamPop = spring({ frame: bamLocal, fps, config: { damping: 14, stiffness: 120 } });
  
  // Intentional vibration VFX
  const shakeX = isBam ? (Math.random() - 0.5) * 5 : 0;
  const shakeY = isBam ? (Math.random() - 0.5) * 5 : 0;
  const yFloat = Math.sin(localFrame * 0.1) * 10;

  if (isAfterBam) return null; // Totally disappears after 00:04.27

  return (
    <div style={{
      position: "absolute", bottom: "30%", right: "10%",
      transform: `translate(${shakeX}px, ${yFloat + shakeY}px)`,
      zIndex: 40, display: "flex", flexDirection: "column", alignItems: "center"
    }}>
      {!isBam ? (
        <>
          <Img src={staticFile(`${ASSET_PATH}/coin-gold.png`)} style={{ width: 300, transform: `scale(${pop})`, filter: "drop-shadow(0 20px 40px rgba(236,72,153,0.5))" }} />
          <div style={{
            marginTop: -30, background: "linear-gradient(135deg, #ec4899, #be185d)", padding: "10px 40px",
            borderRadius: 30, color: "#fff", fontSize: 45, fontWeight: 900, fontFamily: "'Tajawal', sans-serif",
            border: "3px solid #fff", boxShadow: "0 15px 30px rgba(0,0,0,0.8), 0 0 30px rgba(236,72,153,0.8)",
            transform: `scale(${pop})`
          }}>$1M</div>
        </>
      ) : (
        <div style={{
          position: "relative",
          transform: `scale(${bamPop})`,
          background: "linear-gradient(135deg, #ef4444, #b91c1c)",
          borderRadius: "40px",
          padding: "20px 40px",
          color: "#fff", fontSize: 60, fontWeight: 900, fontFamily: "'Impact', sans-serif",
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ position: "absolute", bottom: -15, left: 20, width: 0, height: 0, borderLeft: "15px solid transparent", borderRight: "15px solid transparent", borderTop: "20px solid #b91c1c", transform: "rotate(-20deg)" }} />
          <span style={{ transform: `scale(${1 + Math.sin(bamLocal * 0.5) * 0.5})`, display: "inline-block" }}>BAMM!!</span>
          {Array.from({ length: 8 }).map((_, i) => {
             const angle = (i / 8) * Math.PI * 2;
             const dist = bamLocal * 15;
             return (
               <div key={i} style={{
                 position: "absolute", top: "50%", left: "50%", width: 10, height: 10,
                 background: ["#ec4899", "#22d3ee", "#eab308", "#fff"][i%4], borderRadius: "50%",
                 transform: `translate(-50%, -50%) translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px)`,
                 opacity: 1 - (bamLocal / (bamEnd - bamStart))
               }} />
             )
          })}
        </div>
      )}
    </div>
  );
};

// ─── 2. EXACT 3D NEWS TITLE (FROM PART 1) ──────────────────────────────────
const NewsTitle3D: React.FC<{ title: string; subtitle: string; startFrame: number; duration: number; titleDelay?: number; fontSizeTitle?: number }> = ({ title, subtitle, startFrame, duration, titleDelay = 0, fontSizeTitle = 100 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Padding frames to hide burnt-in placeholders before and after the text animation
  const bleedPad = 20; 
  if (frame < startFrame - bleedPad || frame > startFrame + duration + bleedPad) return null;
  
  const bgLocalFrame = frame - (startFrame - bleedPad);
  const totalBgDuration = duration + bleedPad * 2;
  // Fade in the background gradient instantly to mask bleeding, and hold it until the very end
  const bgOpacity = interpolate(bgLocalFrame, [0, 5, totalBgDuration - 5, totalBgDuration], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  const localFrame = frame - startFrame;
  const titleLocalFrame = localFrame - titleDelay;
  
  const entry = spring({ frame: Math.max(0, titleLocalFrame), fps, config: { damping: 12, stiffness: 80 } });
  const exit = interpolate(localFrame, [duration - 15, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  return (
    <AbsoluteFill style={{ zIndex: 50, display: "flex", justifyContent: "center", alignItems: "center", opacity: bgOpacity }}>
      {/* Solid masking background over the entire screen */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at center, rgba(10, 15, 40, 1) 0%, rgba(5, 5, 10, 1) 100%)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px", transform: `translateY(${(frame * 0.5) % 60}px)` }} />
      </AbsoluteFill>

      {/* The 3D text card only shows exactly during its duration */}
      {localFrame >= 0 && localFrame <= duration && (
        <div style={{
          position: "relative", overflow: "hidden",
          transform: `scale(${entry * exit}) perspective(1000px) rotateX(${Math.sin(titleLocalFrame * 0.05) * 5}deg)`,
          background: "linear-gradient(135deg, rgba(20, 25, 40, 0.8) 0%, rgba(34, 211, 238, 0.2) 100%)",
          backdropFilter: "blur(40px)", border: "2px solid rgba(34,211,238,0.3)",
          padding: "60px 100px", borderRadius: "32px",
          boxShadow: "0 60px 120px rgba(0,0,0,0.9), 0 0 60px rgba(34,211,238,0.2)",
          textAlign: "center"
        }}>
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
            <defs>
              <linearGradient id={`shimmerNews-${title.replace(/[^a-zA-Z]/g,'')}`}
                x1={50 + Math.cos((titleLocalFrame * 4) * 1.2 * Math.PI / 180) * 50 + "%"} 
                y1={50 + Math.sin((titleLocalFrame * 4) * 1.2 * Math.PI / 180) * 50 + "%"} 
                x2={50 - Math.cos((titleLocalFrame * 4) * 1.2 * Math.PI / 180) * 50 + "%"} 
                y2={50 - Math.sin((titleLocalFrame * 4) * 1.2 * Math.PI / 180) * 50 + "%"}
              >
                <stop offset="0%" stopColor="transparent" />
                <stop offset="30%" stopColor="rgba(34,211,238,0.1)" />
                <stop offset="50%" stopColor="rgba(34,211,238,0.9)" />
                <stop offset="70%" stopColor="rgba(34,211,238,0.1)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="31" fill="none" stroke={`url(#shimmerNews-${title.replace(/[^a-zA-Z]/g,'')})`} strokeWidth="4" style={{ mixBlendMode: "screen" }} />
          </svg>
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ margin: 0, fontSize: fontSizeTitle, fontWeight: 900, color: "#fff", fontFamily: "'Tajawal', sans-serif", textShadow: "0 0 40px rgba(34,211,238,0.8)", letterSpacing: 4 }}>
              {title}
            </h1>
            <div style={{ height: 4, width: "100%", background: "linear-gradient(90deg, transparent, #22d3ee, transparent)", margin: "25px 0" }} />
            <p style={{ margin: 0, fontSize: 45, color: "#22d3ee", letterSpacing: 8, textShadow: "0 0 20px #22d3ee", textTransform: "uppercase" }}>
              {subtitle}
            </p>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─── 3. CINEMATIC B-ROLL ───────────────────────────────────────────────────
const CinematicBRoll: React.FC<{ videoSrc: string; startFrame: number; duration: number; applyBrandLUT?: boolean }> = ({ videoSrc, startFrame, duration, applyBrandLUT = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Padding frames to hide burnt-in placeholders before and after the b-roll animation
  const bleedPad = 20; 
  if (frame < startFrame - bleedPad || frame > startFrame + duration + bleedPad) return null;
  
  const bgLocalFrame = frame - (startFrame - bleedPad);
  const totalBgDuration = duration + bleedPad * 2;
  const bgOpacity = interpolate(bgLocalFrame, [0, 5, totalBgDuration - 5, totalBgDuration], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  const localFrame = frame - startFrame;
  
  const entry = spring({ frame: Math.max(0, localFrame), fps, config: { damping: 14, stiffness: 80 } });
  const zoom = interpolate(localFrame, [0, duration], [1, 1.05]);
  const exit = interpolate(localFrame, [duration - 10, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rotation = (localFrame * 4) % 360;
  const gId = videoSrc.replace(/[^a-zA-Z]/g, '');

  return (
    <AbsoluteFill style={{ zIndex: 30, opacity: bgOpacity }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at center, rgba(10, 15, 40, 1) 0%, rgba(5, 5, 10, 1) 100%)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px", transform: `translateY(${(frame * 0.5) % 60}px)` }} />
      </AbsoluteFill>

      {localFrame >= 0 && localFrame <= duration && (
        <AbsoluteFill style={{ transform: `scale(${entry * exit})`, transformOrigin: "center center" }}>
          <AbsoluteFill style={{ overflow: "hidden" }}>
            <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}>
              <Sequence from={startFrame} durationInFrames={duration}>
                <Video src={videoSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Sequence>
            </AbsoluteFill>
          
          {/* Brand LUT Overlay */}
          {applyBrandLUT && (
            <AbsoluteFill style={{
              background: "linear-gradient(135deg, rgba(236,72,153,0.3) 0%, rgba(34,211,238,0.3) 100%)",
              mixBlendMode: "color"
            }} />
          )}
        </AbsoluteFill>
        <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
          <defs>
            <radialGradient id={`vig-${gId}`} cx="50%" cy="50%" r="65%" gradientUnits="objectBoundingBox">
              <stop offset="40%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.9)" />
            </radialGradient>
            <linearGradient id={`shimmerBRoll-${gId}`}
              x1={50 + Math.cos(rotation * 1.2 * Math.PI / 180) * 50 + "%"} y1={50 + Math.sin(rotation * 1.2 * Math.PI / 180) * 50 + "%"}
              x2={50 - Math.cos(rotation * 1.2 * Math.PI / 180) * 50 + "%"} y2={50 - Math.sin(rotation * 1.2 * Math.PI / 180) * 50 + "%"}
            >
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor="rgba(34,211,238,0.1)" />
              <stop offset="50%" stopColor="rgba(34,211,238,0.9)" />
              <stop offset="70%" stopColor="rgba(34,211,238,0.1)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#vig-${gId})`} />
          <rect x="4" y="4" style={{ width: "calc(100% - 8px)", height: "calc(100% - 8px)" }} fill="none" stroke="rgba(236,72,153,0.5)" strokeWidth="8" />
          <rect x="4" y="4" style={{ width: "calc(100% - 8px)", height: "calc(100% - 8px)", mixBlendMode: "screen" }} fill="none" stroke={`url(#shimmerBRoll-${gId})`} strokeWidth="8" />
        </svg>
      </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ─── 3.1 GOOGLE GEMINI CLICK VFX ───────────────────────────────────────────
const GoogleGeminiClickVFX: React.FC<{ startFrame: number; duration: number }> = ({ startFrame, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < startFrame || frame > startFrame + duration) return null;
  const localFrame = frame - startFrame;
  
  const cursorMove = spring({ frame: localFrame, fps, config: { damping: 15 } });
  const cursorClick = spring({ frame: Math.max(0, localFrame - 30), fps, config: { damping: 10, stiffness: 200 } });
  const responsePop = spring({ frame: Math.max(0, localFrame - 45), fps, config: { damping: 12 } });
  
  const exitOpacity = interpolate(localFrame, [duration - 10, duration], [1, 0]);

  return (
    <AbsoluteFill style={{ zIndex: 60, pointerEvents: "none", opacity: exitOpacity }}>
      {/* Fake cursor moving to center and clicking */}
      <div style={{
        position: "absolute", top: `${interpolate(cursorMove, [0, 1], [80, 50])}%`, left: `${interpolate(cursorMove, [0, 1], [80, 50])}%`,
        transform: `translate(-50%, -50%) scale(${interpolate(cursorClick, [0, 0.5, 1], [1, 0.8, 1])})`,
      }}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="white" stroke="#22d3ee" strokeWidth="2" style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.8))" }}>
          <path d="M4 4l5 16 3-7 7-3z"/>
        </svg>
        {/* Click ripple */}
        {localFrame > 30 && <div style={{ position: "absolute", inset: -30, border: "3px solid #22d3ee", borderRadius: "50%", scale: interpolate(localFrame - 30, [0, 15], [0, 2]), opacity: interpolate(localFrame - 30, [0, 15], [1, 0]) }} />}
      </div>
      
      {/* Gemini Response Card */}
      {localFrame > 45 && (
        <div style={{
          position: "absolute", top: "35%", left: "50%", transform: `translate(-50%, -50%) scale(${responsePop})`,
          background: "linear-gradient(135deg, rgba(10,15,30,0.95), rgba(34,211,238,0.1))",
          backdropFilter: "blur(30px)", border: "2px solid #22d3ee", borderRadius: 24, padding: "30px 40px",
          display: "flex", alignItems: "center", gap: 20, boxShadow: "0 20px 50px rgba(0,0,0,0.9)"
        }}>
          <Img src={staticFile(`youtube-assets/google-logo.png`)} style={{ width: 80, filter: "drop-shadow(0 0 20px #22d3ee)" }} />
          <div>
            <h4 style={{ margin: 0, color: "#fff", fontSize: 50, fontFamily: "'Tajawal', sans-serif" }}>Gemini AI</h4>
            <p style={{ margin: 0, color: "#22d3ee", fontSize: 40, fontFamily: "'Tajawal', sans-serif", fontWeight: 900, textShadow: "0 0 20px rgba(34,211,238,0.5)" }}>جاري تحليل بيانات الشاشة...</p>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─── 3.5 ELIMINATED MODELS VFX ──────────────────────────────────────────────
const EliminatedModelsVFX: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // They appear at frame 30, stamped at frame 70 and 90
  const model1Pop = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 12 } });
  const model2Pop = spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 12 } });
  
  const stamp1 = spring({ frame: Math.max(0, frame - 70), fps, config: { damping: 20, stiffness: 300 } });
  const stamp2 = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 20, stiffness: 300 } });

  const exit = interpolate(frame, [duration - 15, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const renderCard = (title: string, pop: number, stamp: number, x: number, rotation: number) => (
    <div style={{
      position: "absolute", left: `calc(50% + ${x}px)`, top: "50%",
      transform: `translate(-50%, -50%) scale(${pop * exit}) rotate(${rotation}deg)`,
      background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)", 
      backdropFilter: "blur(20px)",
      border: "2px solid rgba(255,255,255,0.2)", borderRadius: 24, padding: "40px 60px",
      display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.8)"
    }}>
      <h3 style={{ color: "#fff", margin: 0, fontSize: 50, fontFamily: "'Tajawal', sans-serif", fontWeight: 900 }}>{title}</h3>
      {stamp > 0 && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center",
          transform: `scale(${interpolate(stamp, [0, 1], [3, 1])})`, opacity: stamp,
        }}>
          <div style={{
            border: "8px solid #ef4444", color: "#ef4444", padding: "15px 50px",
            fontSize: 90, fontWeight: 900, fontFamily: "'Tajawal', sans-serif", transform: "rotate(-15deg)",
            textShadow: "0 0 30px #ef4444", boxShadow: "inset 0 0 30px #ef4444, 0 0 30px #ef4444",
            background: "rgba(239, 68, 68, 0.2)", borderRadius: 20, zIndex: 10
          }}>مؤجل</div>
        </div>
      )}
    </div>
  );

  return (
    <AbsoluteFill style={{ zIndex: 60, pointerEvents: "none" }}>
      {renderCard("GEMINI 3.5 PRO", model1Pop, stamp1, -300, -5)}
      {renderCard("GPT 5.6", model2Pop, stamp2, 300, 5)}
    </AbsoluteFill>
  );
};

// ─── 4. RED WARNING SHIELD ─────────────────────────────────────────────────
const RedWarningShield: React.FC<{ startFrame: number; duration: number }> = ({ startFrame, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < startFrame || frame > startFrame + duration) return null;

  const localFrame = frame - startFrame;
  const pop = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 100 } });
  const exit = interpolate(localFrame, [duration - 15, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgOpacity = interpolate(localFrame, [duration - 15, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  const pulse = Math.sin(localFrame * 0.15) > 0 ? 1 : 0.6;
  const rotation = Math.sin(localFrame * 0.05) * 5;

  return (
    <AbsoluteFill style={{ zIndex: 60, opacity: bgOpacity, pointerEvents: "none" }}>
      {/* Moved down to LOWER THIRD */}
      <div style={{
        position: "absolute", bottom: "10%", left: "0", right: "0",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        transform: `scale(${pop * exit}) rotate(${rotation}deg)`
      }}>
        <Img src={staticFile(`${ASSET_PATH}/warning-shield.png`)} style={{ 
          width: 300, 
          filter: `drop-shadow(0 0 60px rgba(255,0,60,${pulse})) drop-shadow(0 0 20px rgba(245,158,11,0.8))` 
        }} />
        <h2 style={{
          color: "#fff", fontSize: 75, margin: "20px 0 0 0", fontFamily: "'Tajawal', sans-serif",
          fontWeight: 900, textShadow: "0 0 40px #ff003c, 0 10px 20px rgba(0,0,0,0.9)",
          letterSpacing: 2
        }}>
          تدخل حكومي في الذكاء الاصطناعي
        </h2>
      </div>
    </AbsoluteFill>
  );
};

// ─── 5. PIN CHAT GLASSMORPHIC ──────────────────────────────────────────────
const PinChatGlassmorphic: React.FC<{ startFrame: number; duration: number }> = ({ startFrame, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < startFrame || frame > startFrame + duration + 30) return null;

  const localFrame = frame - startFrame;
  const ltDelay = 10;
  const ltSpring = spring({ frame: Math.max(0, localFrame - ltDelay), fps, config: { damping: 11, stiffness: 70 } });
  const ltY = interpolate(ltSpring, [0, 1], [300, 0]);
  const ltRotX = interpolate(ltSpring, [0, 1], [45, 0]);
  const ltScale = interpolate(ltSpring, [0, 1], [0.7, 1]);
  
  // Animate Pin Icon popping
  const iconPop = spring({ frame: Math.max(0, localFrame - ltDelay - 5), fps, config: { damping: 10, stiffness: 120 } });
  
  // Animate Text and Line
  const textDelayStart = ltDelay + 10;
  const textSpring = spring({ frame: Math.max(0, localFrame - textDelayStart), fps, config: { damping: 12, stiffness: 100 } });
  const textX = interpolate(textSpring, [0, 1], [50, 0]);
  const textOpc = interpolate(localFrame, [textDelayStart, textDelayStart + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineProgress = spring({ frame: Math.max(0, localFrame - textDelayStart), fps, config: { damping: 14, stiffness: 60 } }) * 100;

  const exitStart = duration - 15;
  const exitScale = interpolate(localFrame, [exitStart, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", bottom: "8%", left: "0", right: "0", zIndex: 40,
      display: "flex", justifyContent: "center"
    }}>
      <div style={{
        transform: `perspective(900px) translateY(${ltY}px) rotateX(${ltRotX}deg) scale(${ltScale * exitScale})`,
        transformOrigin: "bottom center",
        background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
        backdropFilter: "blur(40px)", border: `1px solid rgba(255,255,255,0.12)`, borderTop: `3px solid #22d3ee`,
        borderRadius: "24px", padding: "20px 40px", display: "flex", alignItems: "center", gap: 30,
        boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,211,238,0.3), inset 0 1px 0 rgba(255,255,255,0.1)`
      }}>
        <div style={{ position: "absolute", inset: -30, background: `radial-gradient(ellipse at center, rgba(34,211,238,0.4) 0%, transparent 70%)`, filter: "blur(25px)", borderRadius: 40, zIndex: -1 }} />
        
        <Img src={staticFile(`${ASSET_PATH}/pin-icon.png`)} style={{ 
          width: 100, 
          filter: "drop-shadow(0 0 20px #22d3ee)",
          transform: `scale(${iconPop}) rotate(${Math.sin(localFrame * 0.1) * 10}deg)`
        }} />
        
        {/* Animated Line and Text Container with generous padding to prevent clipping */}
        <div style={{ position: "relative", padding: "20px 40px", overflow: "hidden", textAlign: "right" }}>
          <div style={{
            position: "absolute", bottom: 10, right: 0,
            height: 4, width: `${lineProgress}%`, backgroundColor: "#22d3ee",
            boxShadow: `0 0 15px #22d3ee`
          }} />
          
          <div style={{ transform: `translateX(${textX}px)`, opacity: textOpc, willChange: "transform" }}>
            <h3 style={{ margin: 0, color: "#fff", fontSize: 60, fontFamily: "'Tajawal', sans-serif", fontWeight: 900, textShadow: "0 0 20px rgba(34,211,238,0.8)" }}>تثبيت المحادثة</h3>
          </div>
          <div style={{ transform: `translateX(${textX}px)`, opacity: textOpc, willChange: "transform", transitionDelay: "0.1s", paddingBottom: 15 }}>
            <p style={{ margin: 0, color: "#22d3ee", fontSize: 35, fontFamily: "'Tajawal', sans-serif", letterSpacing: 4, textTransform: "uppercase" }}>Pinned Chat Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── 7. FLOATING CTA BUTTONS (Slam & Settle) ───────────────────────────────
const FloatingCTAButtons: React.FC<{ startFrame: number; duration: number }> = ({ startFrame, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < startFrame || frame > startFrame + duration) return null;

  const localFrame = frame - startFrame;
  const exit = interpolate(localFrame, [duration - 15, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // 1. Initial Slam (giant icons in center)
  const slamSpring = spring({ frame: localFrame, fps, config: { damping: 10, stiffness: 100 } }); 
  
  // 2. Settle (move to cards)
  const settleDelay = 30;
  const settleSpring = spring({ frame: Math.max(0, localFrame - settleDelay), fps, config: { damping: 12, stiffness: 80 } }); 
  
  const iconScaleLike = interpolate(slamSpring, [0, 1], [0, 4]) - interpolate(settleSpring, [0, 1], [0, 3]); 
  const iconScaleSub = interpolate(slamSpring, [0, 1], [0, 4]) - interpolate(settleSpring, [0, 1], [0, 3]);

  const likeX = interpolate(settleSpring, [0, 1], [800, 0]); 
  const subX = interpolate(settleSpring, [0, 1], [-800, 0]); 
  
  const likeY = interpolate(settleSpring, [0, 1], [-400, 0]);
  const subY = interpolate(settleSpring, [0, 1], [-400, 0]);

  const floatY = Math.sin(localFrame * 0.05) * 10;

  return (
    <>
      {localFrame >= 0 && (
        <div style={{
          position: "absolute", bottom: "10%", left: "5%", zIndex: 50,
          transform: `perspective(800px) rotateY(10deg) scale(${exit}) translateY(${floatY}px)`,
          display: "flex", alignItems: "center", gap: 25,
          padding: "20px 40px"
        }}>
          <div style={{
            position: "absolute", inset: 0, zIndex: -1,
            background: "linear-gradient(135deg, rgba(236,72,153,0.3) 0%, rgba(10,15,30,0.95) 100%)",
            backdropFilter: "blur(20px)", border: "2px solid #ec4899",
            borderRadius: 100, boxShadow: "0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(236,72,153,0.3)",
            opacity: settleSpring, transform: `scale(${interpolate(settleSpring, [0, 1], [0.8, 1])})`
          }} />
          <Img src={staticFile(`${ASSET_PATH}/like-3d.png`)} style={{ 
            width: 80, filter: "drop-shadow(0 10px 20px rgba(236,72,153,0.8))",
            transform: `translate(${likeX}px, ${likeY}px) scale(${Math.max(1, iconScaleLike)}) rotate(${Math.sin(localFrame*0.1)*10}deg)` 
          }} />
          <span style={{ opacity: settleSpring, color: "#fff", fontSize: 45, fontWeight: 900, fontFamily: "'Tajawal', sans-serif", textShadow: "0 0 20px #ec4899" }}>لايك للبرنامج</span>
        </div>
      )}

      {localFrame >= 0 && (
        <div style={{
          position: "absolute", bottom: "10%", right: "5%", zIndex: 50,
          transform: `perspective(800px) rotateY(-10deg) scale(${exit}) translateY(${-floatY}px)`,
          display: "flex", alignItems: "center", gap: 25,
          padding: "20px 40px"
        }}>
          <div style={{
            position: "absolute", inset: 0, zIndex: -1,
            background: "linear-gradient(135deg, rgba(34,211,238,0.3) 0%, rgba(10,15,30,0.95) 100%)",
            backdropFilter: "blur(20px)", border: "2px solid #22d3ee",
            borderRadius: 100, boxShadow: "0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(34,211,238,0.3)",
            opacity: settleSpring, transform: `scale(${interpolate(settleSpring, [0, 1], [0.8, 1])})`
          }} />
          <span style={{ opacity: settleSpring, color: "#fff", fontSize: 45, fontWeight: 900, fontFamily: "'Tajawal', sans-serif", textShadow: "0 0 20px #22d3ee" }}>اشترك في القناة</span>
          <Img src={staticFile(`${ASSET_PATH}/subscribe-3d.png`)} style={{ 
            width: 80, filter: "drop-shadow(0 10px 20px rgba(34,211,238,0.8))",
            transform: `translate(${subX}px, ${subY}px) scale(${Math.max(1, iconScaleSub)}) rotate(${Math.cos(localFrame*0.1)*10}deg)` 
          }} />
        </div>
      )}
    </>
  );
};

// ─── MAIN COMPOSITION ────────────────────────────────────────────────────────
export const HarfenEpisode1Part2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      
      <AbsoluteFill>
        <Video 
          src={staticFile(`${ASSET_PATH}/episode-1-master-2.mp4`)} 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </AbsoluteFill>

      {/* 1. Golden Coin Drop (0:01.18 - 0:04.27) -> 48 - 147 */}
      <GoldenCoinDrop startFrame={48} duration={99} />

      {/* 2. News Title #3 (Shifted 2 frames earlier, ends 2 frames earlier) */}
      <NewsTitle3D 
        title="CHROME: SELECT FROM SCREEN" subtitle="EASY DATA EXTRACTION" 
        startFrame={199} duration={99} fontSizeTitle={75}
      />

      {/* 3. B-Roll 3 (0:16 - 0:25) -> 480 - 780 */}
      <CinematicBRoll videoSrc={staticFile(`${ASSET_PATH}/broll-chrome.mp4`)} startFrame={480} duration={300} />
      
      {/* 3.1 Google Click VFX (0:21.06 - 0:25.06) -> 636 - 756 */}
      <GoogleGeminiClickVFX startFrame={636} duration={120} />

      {/* 4. News Title #4 (Ends 2 frames earlier) */}
      <NewsTitle3D 
        title="GPT & GEMINI: DELAYED" subtitle="SECURITY FEARS" 
        startFrame={940} duration={210}
      />

      {/* 5. B-Roll 4 (0:44.22 - 0:52.08) -> 1342 - 1568 */}
      <CinematicBRoll videoSrc={staticFile(`${ASSET_PATH}/broll-lockdown.mp4`)} startFrame={1342} duration={226} />
      <Sequence from={1342} durationInFrames={226}>
        <EliminatedModelsVFX duration={226} />
      </Sequence>

      {/* 6. Red Warning Shield (0:52.08 - 0:58.05) -> 1568 - 1745 */}
      <RedWarningShield startFrame={1568} duration={177} />

      {/* 7. News Title #5 (1:01.21 - 1:05.28) -> 1851 - 1978 */}
      <NewsTitle3D 
        title="OPENAI: SPORTS & PINS" subtitle="NEW FEATURES" 
        startFrame={1851} duration={127}
      />

      {/* 8. Pin Chat Glassmorphic (1:09.16 - 1:13.23) -> 2086 - 2213 */}
      <PinChatGlassmorphic startFrame={2086} duration={127} />

      {/* 9. B-Roll 5 (soccer - extended to 7s) (1:16.15 - 1:23.16) -> 2295 - 2506 */}
      <CinematicBRoll videoSrc={staticFile(`${ASSET_PATH}/broll-soccer.mp4`)} startFrame={2295} duration={211} applyBrandLUT={true} />

      {/* 10. Floating CTA Buttons (1:41 - 1:54) -> 3030 - 3420 */}
      <FloatingCTAButtons startFrame={3030} duration={390} />
    </AbsoluteFill>
  );
};
