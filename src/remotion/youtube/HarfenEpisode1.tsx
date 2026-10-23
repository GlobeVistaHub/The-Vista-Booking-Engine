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
  Img,
  Easing
} from "remotion";

export const EPISODE_1_DURATION = 3290; // 1m 49s 20f (Extended to show final seconds)

// ─── 1. EXACT LOWER THIRD (From ShortConcept4) ───────────────────────────────
const LowerThird: React.FC<{
  name: string; role: string; themeColor: string; direction: "left" | "right";
  startFrame: number; duration: number;
}> = ({ name, role, themeColor, direction, startFrame, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  if (frame < startFrame || frame > startFrame + duration + 30) return null;

  const localFrame = frame - startFrame;
  const ltDelay = 10;
  
  const ltSpring = spring({ frame: Math.max(0, localFrame - ltDelay), fps, config: { damping: 11, stiffness: 70 } });
  const ltX = interpolate(ltSpring, [0, 1], [direction === "left" ? -700 : 700, 0]);
  const ltRotY = interpolate(ltSpring, [0, 1], [direction === "left" ? -45 : 45, 0]);
  const ltScale = interpolate(ltSpring, [0, 1], [0.7, 1]);
  const floatY = localFrame > ltDelay + 20 ? Math.sin((localFrame - ltDelay - 20) * 0.09) * 12 : 0;

  const exitStart = duration - 15;
  const exitScale = interpolate(localFrame, [exitStart, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  const textDelayStart = ltDelay + 10;
  const nameSpring = spring({ frame: Math.max(0, localFrame - textDelayStart), fps, config: { damping: 12, stiffness: 100 } });
  const nameY = interpolate(nameSpring, [0, 1], [30, 0]);
  const nameOpc = interpolate(localFrame, [textDelayStart, textDelayStart + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const roleSpring = spring({ frame: Math.max(0, localFrame - (textDelayStart + 4)), fps, config: { damping: 12, stiffness: 100 } });
  const roleY = interpolate(roleSpring, [0, 1], [30, 0]);
  const roleOpc = interpolate(localFrame, [textDelayStart + 4, textDelayStart + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", bottom: "8%", [direction === "left" ? "left" : "right"]: "5%",
      transform: `perspective(900px) translateX(${ltX}px) rotateY(${ltRotY}deg) scale(${ltScale * exitScale}) translateY(${floatY}px)`,
      transformOrigin: direction === "left" ? "left center" : "right center",
      willChange: "transform", backfaceVisibility: "hidden", WebkitFontSmoothing: "antialiased", zIndex: 10,
    }}>
      <div style={{
        position: "absolute", inset: -30,
        background: `radial-gradient(ellipse at center, ${themeColor}40 0%, transparent 70%)`,
        filter: "blur(25px)", borderRadius: 40,
      }} />
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
        backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
        border: `1px solid rgba(255,255,255,0.12)`, borderTop: `3px solid ${themeColor}`,
        borderRadius: "24px", padding: "32px 56px 28px 56px",
        boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px ${themeColor}30, inset 0 1px 0 rgba(255,255,255,0.1)`,
        display: "flex", flexDirection: "column",
        alignItems: direction === "left" ? "flex-start" : "flex-end", minWidth: 420,
      }}>
        <div style={{
          position: "absolute", [direction === "left" ? "left" : "right"]: 0,
          top: "15%", bottom: "15%", width: 5,
          background: `linear-gradient(to bottom, transparent, ${themeColor}, transparent)`,
          borderRadius: 10, boxShadow: `0 0 20px ${themeColor}`,
        }} />
        <div style={{ transform: `translateY(${nameY}px)`, opacity: nameOpc, willChange: "transform" }}>
          <h2 style={{
            margin: 0, fontSize: 90, fontWeight: 900, color: "#ffffff",
            fontFamily: "'Tajawal', 'Cairo', sans-serif", lineHeight: 1,
            textShadow: `0 0 30px rgba(255,255,255,0.3), 0 8px 30px rgba(0,0,0,0.8)`,
            letterSpacing: direction === "left" ? 2 : -2,
          }}>{name}</h2>
        </div>
        <div style={{
          width: "100%", height: 2, margin: "12px 0",
          background: `linear-gradient(to right, ${themeColor}, rgba(255,255,255,0.2), transparent)`,
        }} />
        <div style={{ transform: `translateY(${roleY}px)`, opacity: roleOpc, willChange: "transform" }}>
          <p style={{
            margin: 0, fontSize: 38, fontWeight: 900, color: themeColor,
            letterSpacing: 6, textTransform: "uppercase",
            textShadow: direction === "left"
              ? `0 3px 5px rgba(0,0,0,0.9), 0 10px 30px rgba(0,0,0,1), 0 0 20px ${themeColor}`
              : `0 0 60px ${themeColor}, 0 0 25px ${themeColor}cc, 0 0 8px ${themeColor}, 0 6px 20px rgba(0,0,0,1)`,
          }}>{role}</p>
        </div>
      </div>
    </div>
  );
};

// ─── 2. PREMIUM HOLOGRAPHIC CLUSTER ───────────────────────────────────────────
const HologramCluster: React.FC<{ startFrame: number; duration: number }> = ({ startFrame, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < startFrame || frame > startFrame + duration + 30) return null;
  
  const localFrame = frame - startFrame;
  const exitScale = interpolate(localFrame, [duration - 15, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const renderIcon = (src: string, color: string, index: number) => {
    const pop = spring({ frame: Math.max(0, localFrame - index * 10), fps, config: { damping: 14, stiffness: 80 } });
    const yFloat = Math.sin((localFrame + index * 20) * 0.05) * 20;
    
    return (
      <div style={{
        position: "relative",
        width: 220, height: 220, margin: "0 40px",
        background: `radial-gradient(circle at center, ${color}20 0%, rgba(10,15,30,0.8) 100%)`,
        border: `1px solid ${color}80`, borderRadius: "32px",
        boxShadow: `0 30px 60px rgba(0,0,0,0.8), 0 0 40px ${color}40, inset 0 2px 20px ${color}60`,
        backdropFilter: "blur(25px)", display: "flex", justifyContent: "center", alignItems: "center",
        transform: `scale(${pop * exitScale}) translateY(${yFloat}px) rotateY(${Math.sin(localFrame * 0.02) * 10}deg)`,
      }}>
        <div style={{ position: "absolute", inset: -2, background: `linear-gradient(180deg, ${color}, transparent)`, borderRadius: "34px", zIndex: -1, opacity: 0.5 }} />
        <Img src={staticFile(src)} style={{ width: "65%", height: "65%", objectFit: "contain", filter: `drop-shadow(0 0 25px ${color})` }} />
      </div>
    );
  };

  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center",
      transform: `perspective(1200px) translateY(250px)`, zIndex: 40
    }}>
      {renderIcon("youtube-assets/openai-logo.png", "#22d3ee", 0)}
      {renderIcon("youtube-assets/google-logo.png", "#ec4899", 1)}
      {renderIcon("youtube-assets/midjourney-logo.png", "#eab308", 2)}
    </div>
  );
};

// ─── 3. STANDALONE 3D NEWS TITLE WITH BACKGROUND ─────────────────────────────
const NewsTitle3D: React.FC<{ title: string; subtitle: string; startFrame: number; duration: number; titleDelay?: number }> = ({ title, subtitle, startFrame, duration, titleDelay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  if (localFrame < 0 || localFrame > duration + 30) return null;
  
  const titleLocalFrame = localFrame - titleDelay;
  const entry = spring({ frame: Math.max(0, titleLocalFrame), fps, config: { damping: 12, stiffness: 80 } });
  const exit = interpolate(localFrame, [duration - 15, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  return (
    <AbsoluteFill style={{ zIndex: 50, display: "flex", justifyContent: "center", alignItems: "center" }}>
      {/* Gorgeous Static Full-Screen Background to immediately cover the black placeholder */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at center, rgba(10, 15, 40, 1) 0%, rgba(5, 5, 10, 1) 100%)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px", transform: `translateY(${(localFrame * 0.5) % 60}px)` }} />
      </AbsoluteFill>

      {/* The 3D Title */}
      {titleLocalFrame >= 0 && (
        <div style={{
          position: "relative", overflow: "hidden",
          transform: `scale(${entry * exit}) perspective(1000px) rotateX(${Math.sin(titleLocalFrame * 0.05) * 5}deg)`,
          background: "linear-gradient(135deg, rgba(20, 25, 40, 0.8) 0%, rgba(34, 211, 238, 0.2) 100%)",
          backdropFilter: "blur(40px)", border: "2px solid rgba(34,211,238,0.3)",
          padding: "60px 100px", borderRadius: "32px",
          boxShadow: "0 60px 120px rgba(0,0,0,0.9), 0 0 60px rgba(34,211,238,0.2)",
          textAlign: "center"
        }}>
          {/* Elegant Wide Cyan Shimmer Wash */}
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
            <defs>
              <linearGradient id="shimmerNews"
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
            <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="31" fill="none" stroke="url(#shimmerNews)" strokeWidth="4" style={{ mixBlendMode: "screen" }} />
          </svg>
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 100, fontWeight: 900, color: "#fff", fontFamily: "'Tajawal', sans-serif", textShadow: "0 0 40px rgba(34,211,238,0.8)", letterSpacing: 4 }}>
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

// ─── 4. CINEMATIC B-ROLL CONTAINER (COVERS PLACEHOLDERS) ───────────────────
const CinematicBRoll: React.FC<{ videoSrc: string; duration: number }> = ({ videoSrc, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entry = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const zoom = interpolate(frame, [0, duration], [1, 1.05]);
  const exit = interpolate(frame, [duration - 10, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rotation = (frame * 4) % 360;
  const gId = videoSrc.replace(/[^a-zA-Z]/g, '');

  return (
    <AbsoluteFill style={{ zIndex: 30 }}>
      {/* Background */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at center, rgba(10, 15, 40, 1) 0%, rgba(5, 5, 10, 1) 100%)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px", transform: `translateY(${(frame * 0.5) % 60}px)` }} />
      </AbsoluteFill>

      {/* Entry/exit scale — video and border both scale in/out together */}
      <AbsoluteFill style={{ transform: `scale(${entry * exit})`, transformOrigin: "center center" }}>

        {/* Ken Burns zoom on VIDEO ONLY — clipped so it doesn't overflow the border */}
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}>
            <Video src={videoSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        </AbsoluteFill>

        {/* Border + shimmer — sibling to zoom, NOT inside it, so it stays at the correct frame size */}
        <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
          <defs>
            <radialGradient id={`vig-${gId}`} cx="50%" cy="50%" r="65%" gradientUnits="objectBoundingBox">
              <stop offset="40%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.9)" />
            </radialGradient>
            <linearGradient id={`shimmerBRoll-${gId}`}
              x1={50 + Math.cos(rotation * 1.2 * Math.PI / 180) * 50 + "%"}
              y1={50 + Math.sin(rotation * 1.2 * Math.PI / 180) * 50 + "%"}
              x2={50 - Math.cos(rotation * 1.2 * Math.PI / 180) * 50 + "%"}
              y2={50 - Math.sin(rotation * 1.2 * Math.PI / 180) * 50 + "%"}
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
    </AbsoluteFill>
  );
};

// ─── 5. COFFEE CUP WITH SMOKE ────────────────────────────────────────────────
const SmokeParticle: React.FC<{ delay: number; startFrame: number }> = ({ delay, startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame - delay;
  if (localFrame < 0 || localFrame > 60) return null; // Particle lives for 2 seconds
  
  const progress = Math.min(localFrame / 60, 1);
  const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.5, 0.5, 0]);
  const y = interpolate(progress, [0, 1], [0, -200]);
  const x = Math.sin(localFrame * 0.1) * 40;
  const scale = interpolate(progress, [0, 1], [0.5, 3]);
  
  return (
    <div style={{
      position: "absolute", top: "40%", left: "50%",
      width: 60, height: 60, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
      transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
      opacity, filter: "blur(10px)", zIndex: 1
    }} />
  );
};

const CoffeeJokeWithSmoke: React.FC<{ startFrame: number; duration: number }> = ({ startFrame, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  if (localFrame < 0 || localFrame > duration + 30) return null;

  const pop = spring({ frame: localFrame, fps, config: { mass: 0.6, damping: 9, stiffness: 120 } });
  const exit = interpolate(localFrame, [duration - 15, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // Generate a stream of smoke particles
  const particles = Array.from({ length: 15 }).map((_, i) => (
    <SmokeParticle key={i} delay={i * 8} startFrame={startFrame} />
  ));
  
  return (
    <div style={{ position: "absolute", bottom: "25%", left: "55%", transform: `scale(${pop * exit}) rotate(-5deg)`, zIndex: 40 }}>
      {particles}
      <Img src={staticFile("youtube-assets/coffe-cup.png")} style={{ width: 280, filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.8))", position: "relative", zIndex: 2 }} />
      <div style={{
        position: "absolute", top: -30, right: -40, background: "#ec4899", color: "#fff", padding: "12px 24px",
        borderRadius: 40, fontWeight: 900, fontSize: 35, boxShadow: "0 10px 30px rgba(236,72,153,0.6)",
        transform: `translateY(${Math.sin(frame * 0.2) * 10}px)`, border: "2px solid #fff", zIndex: 3
      }}>+1 HAMOU</div>
    </div>
  );
};

// ─── 6. FLOATING CHECKLIST (GOOGLE UPDATE) ──────────────────────────────────
const FloatingChecklist: React.FC<{ startFrame: number; duration: number }> = ({ startFrame, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < startFrame || frame > startFrame + duration) return null;
  
  const localFrame = frame - startFrame;
  const slide = spring({ frame: Math.max(0, localFrame), fps, config: { damping: 14 } });
  const exit = interpolate(localFrame, [duration - 15, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  const items = ["Google Gemini", "Study Notebooks", "Audio Generation", "AI Research"];
  const rotation = (frame * 5) % 360;
  
  return (
    <div style={{
      position: "absolute", top: "25%", right: "5%",
      transform: `perspective(800px) rotateY(-10deg) translateX(${interpolate(slide, [0, 1], [500, 0])}px) scale(${exit})`,
      background: "linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(10, 15, 30, 0.9) 100%)",
      backdropFilter: "blur(30px)", border: "2px solid rgba(236,72,153,0.3)",
      borderRadius: 24, padding: "40px 50px", boxShadow: "0 30px 60px rgba(0,0,0,0.8)", zIndex: 20,
      overflow: "hidden"
    }}>
      {/* Elegant Wide Cyan Shimmer Wash */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <defs>
          <linearGradient id="shimmerChecklist"
            x1={50 + Math.cos(rotation * 1.2 * Math.PI / 180) * 50 + "%"} 
            y1={50 + Math.sin(rotation * 1.2 * Math.PI / 180) * 50 + "%"} 
            x2={50 - Math.cos(rotation * 1.2 * Math.PI / 180) * 50 + "%"} 
            y2={50 - Math.sin(rotation * 1.2 * Math.PI / 180) * 50 + "%"}
          >
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="rgba(34,211,238,0.1)" />
            <stop offset="50%" stopColor="rgba(34,211,238,0.8)" />
            <stop offset="70%" stopColor="rgba(34,211,238,0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="23" fill="none" stroke="url(#shimmerChecklist)" strokeWidth="3" style={{ mixBlendMode: "screen" }} />
      </svg>
      
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 style={{ color: "#fff", margin: "0 0 20px 0", fontSize: 45, fontWeight: 900, fontFamily: "'Tajawal', sans-serif" }}>GOOGLE NEW UPDATE</h2>
        <div style={{ height: 3, width: "100%", background: "linear-gradient(90deg, #ec4899, transparent)", marginBottom: 30 }} />
        {items.map((item, i) => {
          const itemSpring = spring({ frame: Math.max(0, localFrame - (20 + i * 15)), fps, config: { damping: 12 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 25, transform: `translateX(${interpolate(itemSpring, [0,1], [100, 0])}px)`, opacity: itemSpring }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(236,72,153,0.2)", border: "2px solid #ec4899", display: "flex", justifyContent: "center", alignItems: "center", marginRight: 20 }}>
                {localFrame > 40 + i * 15 && <div style={{ width: 16, height: 16, background: "#ec4899", borderRadius: 4 }} />}
              </div>
              <span style={{ color: "#fff", fontSize: 32, fontWeight: "bold", fontFamily: "'Tajawal', sans-serif", letterSpacing: 1 }}>{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── 7. QUIZ CARD (PLACEMENT TEST) ─────────────────────────────────────────────
const QuizCard: React.FC<{ startFrame: number; duration: number }> = ({ startFrame, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < startFrame || frame > startFrame + duration) return null;
  const localFrame = frame - startFrame;
  const entry = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 90 } });
  const exit = interpolate(localFrame, [duration - 10, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  return (
    <div style={{
      position: "absolute", top: "65%", left: "10%",
      transform: `perspective(800px) rotateY(10deg) scale(${entry * exit})`,
      background: "linear-gradient(135deg, rgba(236, 72, 153, 0.95) 0%, rgba(10, 15, 30, 0.95) 100%)",
      backdropFilter: "blur(20px)", border: "2px solid #ec4899",
      padding: "30px 50px", borderRadius: 24, boxShadow: "0 30px 60px rgba(0,0,0,0.8)", zIndex: 40,
      display: "flex", alignItems: "center", gap: 20
    }}>
      <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: 25, height: 25, background: "#ec4899", borderRadius: "50%" }} />
      </div>
      <h2 style={{ color: "#fff", margin: 0, fontSize: 50, fontWeight: 900, fontFamily: "'Tajawal', sans-serif" }}>اختبارات تحديد المستوى</h2>
    </div>
  );
};

// ─── 8. INTENTIONAL TRAUMA ALERT MODAL ───────────────────────────────────────
const TraumaAlert: React.FC<{ frameIn: number; frameOut: number }> = ({ frameIn, frameOut }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Keep alive for 20 frames past frameOut to allow smooth fade out
  if (frame < frameIn || frame > frameOut + 20) return null;
  const localFrame = frame - frameIn;
  
  const scale = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 100 } });
  const fadeOutOpacity = interpolate(frame, [frameOut, frameOut + 15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  return (
    <AbsoluteFill style={{ zIndex: 100, backgroundColor: "rgba(255,0,0,0.12)", opacity: fadeOutOpacity }}>
      <div style={{ position: "absolute", top: "65%", left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10 }}>
        <div style={{
          transform: `scale(${scale})`,
          background: "rgba(18, 0, 0, 0.97)",
          border: "2px solid #ff003c", borderRadius: 24, padding: "40px 80px",
          boxShadow: "0 0 100px rgba(255,0,60,0.5), 0 30px 60px rgba(0,0,0,0.9)", textAlign: "center"
        }}>
          <h1 style={{
            color: "#ff003c", fontSize: 80, margin: 0,
            fontFamily: "'Tajawal', sans-serif", fontWeight: 900,
            textShadow: [
              `${Math.sin(localFrame * 0.7) * 2.5}px 0 rgba(0,255,255,0.7)`,
              `${Math.sin(localFrame * 0.7) * -2.5}px 0 rgba(255,0,60,0.7)`,
              `0 0 20px #ff003c`
            ].join(", ")
          }}>⚠️ تحذير: نكتة سمجة</h1>
          <p style={{ color: "#fff", fontSize: 40, margin: "20px 0 0 0", letterSpacing: 2, fontFamily: "'Tajawal', sans-serif" }}>تم تفعيل بروتوكول الصدمة</p>
        </div>
      </div>
      {/* Intentional deterministic screen glitch — white flash on specific frame intervals */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundColor: "white",
        mixBlendMode: "difference",
        opacity: Math.sin(localFrame * 1.8) > 0.88 ? 0.18 : 0
      }} />
    </AbsoluteFill>
  );
};


// ─── MAIN COMPOSITION ────────────────────────────────────────────────────────
export const HarfenEpisode1: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      
      {/* 0. CONTINUOUS MASTER VIDEO */}
      <AbsoluteFill>
        <Video 
          src={staticFile("youtube-assets/episode-1-master.mp4")} 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </AbsoluteFill>

      {/* ─── EXACT FRAME MAPPINGS (30fps) ─── */}
      
      {/* 1. Mareya Lower Third: 0:00 to 03:10 (0 - 100) */}
      <LowerThird name="ماريا" role="FINE ARTS / DESIGN" themeColor="#ec4899" direction="left" startFrame={0} duration={100} />

      {/* 2. Holograms: 12:19 to 15:09 (379 - 459) */}
      <HologramCluster startFrame={379} duration={80} />

      {/* 3. Mazen Lower Third: 15:20 to 18:20 (470 - 560) */}
      <LowerThird name="مازن" role="I.T. / CODE" themeColor="#22d3ee" direction="right" startFrame={470} duration={90} />

      {/* 4. News Title #1 (Codex) PADDED to cover placeholder completely: 32:12 to 36:14 (972 - 1094) */}
      <NewsTitle3D title="OPENAI CODEX" subtitle="RECORD & REPLAY" startFrame={972} duration={122} />

      {/* 5. B-Roll 1 (Placeholder 46:00) PADDED: 45:28 to 48:21 (1377 - 1461) */}
      <Sequence from={1377} durationInFrames={84}>
        <CinematicBRoll videoSrc={staticFile("youtube-assets/broll-codex.mp4")} duration={84} />
      </Sequence>

      {/* 6. Coffee Cup Joke with Smoke: 1:00:00 to 1:02:11 (1800 - 1871) */}
      <CoffeeJokeWithSmoke startFrame={1800} duration={71} />

      {/* 7. B-Roll 2 (broll-split) PADDED: 1:09:12 to 1:15:27 (2082 - 2277) */}
      <Sequence from={2082} durationInFrames={196}>
        <CinematicBRoll videoSrc={staticFile("youtube-assets/broll-split.mp4")} duration={196} />
      </Sequence>

      {/* 8. News Title #2 (Gemini) bg starts exactly when broll ends: 1:15:27 to 1:19:27 (2277 - 2397) */}
      <NewsTitle3D title="GOOGLE GEMINI" subtitle="STUDY NOTEBOOKS" startFrame={2277} duration={120} titleDelay={0} />

      {/* 9. Floating Checklist (Google Update): 01:25:08 to 01:29:09 (2558 - 2679) */}
      <FloatingChecklist startFrame={2558} duration={121} />

      {/* 10. Quiz Card: 01:38:19 for 3 seconds (2959 - 3049) */}
      <QuizCard startFrame={2959} duration={90} />

      {/* 11. Mazen Joke Trauma Alert: 1:44:13 to 1:46:20 (3133 - 3200) */}
      <TraumaAlert frameIn={3133} frameOut={3200} />

    </AbsoluteFill>
  );
};
