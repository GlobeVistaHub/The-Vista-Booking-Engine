import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate, Easing, Video, staticFile, random } from "remotion";

// ─── WORLD CUP PARTICLES ───────────────────────────────────────────────────
const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  // Rapidly fluctuating opacity to simulate authentic celluloid grain (must be deterministic!)
  const opacity = 0.05 + random(`op-${frame}`) * 0.03;
  return (
    <AbsoluteFill style={{
      zIndex: 999, pointerEvents: "none", opacity, mixBlendMode: "overlay",
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      transform: `translate(${random(`x-${frame}`) * 2}px, ${random(`y-${frame}`) * 2}px)`
    }} />
  );
};

const GoldDust: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = new Array(20).fill(0).map((_, i) => {
    const startX = (i * 87) % 100;
    const speed = 0.4 + ((i * 13) % 10) * 0.1;
    const size = 3 + ((i * 7) % 12);
    const blur = 2 + ((i * 3) % 5);
    return { startX, speed, size, blur };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 60, opacity: 0.6 }}>
      {particles.map((p, i) => {
        const yPos = 110 - ((frame * p.speed) % 120);
        const floatX = Math.sin(frame * 0.02 + i) * 15;
        const color = i % 3 === 0 ? "#22d3ee" : "#fbbf24"; // Mix of Cyan and Gold
        return (
          <div key={i} style={{
            position: "absolute", left: `calc(${p.startX}% + ${floatX}px)`, top: `${yPos}%`,
            width: p.size, height: p.size, backgroundColor: color, borderRadius: "50%",
            boxShadow: `0 0 ${p.size * 2}px ${color}`, filter: `blur(${p.blur}px)`,
            opacity: Math.sin((frame * 0.04) + i) * 0.4 + 0.6
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── TRANSITIONS ─────────────────────────────────────────────────────────────
const NeuralSphereTransition: React.FC<{ frameIn: number }> = ({ frameIn }) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - frameIn);
  const { fps } = useVideoConfig();
  
  // A massive light burst and lens warp
  const progress = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  
  if (localFrame === 0 || localFrame > 60) return null;
  
  const scale = interpolate(progress, [0, 1], [0.5, 4]);
  const opacity = interpolate(localFrame, [0, 15, 30], [0, 1, 0]);
  const blur = interpolate(localFrame, [0, 15, 30], [0, 50, 0]);

  return (
    <AbsoluteFill style={{ zIndex: 100, pointerEvents: "none", justifyContent: "center", alignItems: "center" }}>
      <div style={{
        width: "100%", height: "100%", position: "absolute",
        background: `radial-gradient(circle at center, rgba(34, 211, 238, ${opacity}) 0%, transparent 60%)`,
        transform: `scale(${scale})`, filter: `blur(${blur}px)`, mixBlendMode: "screen"
      }} />
      <div style={{
        width: "150%", height: "150%", position: "absolute",
        background: `rgba(255, 255, 255, ${opacity * 0.8})`, mixBlendMode: "overlay"
      }} />
    </AbsoluteFill>
  );
};

// ─── WORLD CUP TROPHY 3D FLY-IN ──────────────────────────────────────────────
const TrophyFlyIn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation starts at frame 880. Total composition is 1050 frames.
  if (frame < 880) return null;

  const localFrame = frame - 880; 

  // Phase 1: Emerging from the Oracle light burst (880 -> 900)
  const emergeY = interpolate(localFrame, [0, 20], [400, -150], { extrapolateRight: "clamp" });
  const emergeScale = interpolate(localFrame, [0, 20], [0.1, 4.5], { extrapolateRight: "clamp" });
  const emergeOpacity = interpolate(localFrame, [0, 5], [0, 1], { extrapolateRight: "clamp" });
  
  // Phase 2: Slamming into place on the Outro Card (900 -> 920)
  const slamSpring = spring({ frame: Math.max(0, localFrame - 20), fps, config: { damping: 10, stiffness: 150 } });
  const finalScale = interpolate(slamSpring, [0, 1], [4.5, 1.2]);
  const finalY = interpolate(slamSpring, [0, 1], [-150, -60]); 
  
  const currentScale = localFrame < 20 ? emergeScale : finalScale;
  const currentY = localFrame < 20 ? emergeY : finalY;
  const currentOpacity = localFrame < 20 ? emergeOpacity : 1;

  const motionBlur = interpolate(localFrame, [0, 20, 25], [20, 40, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const rotation = interpolate(localFrame, [0, 20], [25, 0], { extrapolateRight: "clamp" });
  const floatY = localFrame > 35 ? Math.sin((localFrame - 35) * 0.08) * 20 : 0;

  const shakeLocal = localFrame - 20;
  const shakeX = shakeLocal > 0 && shakeLocal < 15 ? Math.sin(shakeLocal * 2.5) * (15 - shakeLocal) : 0;
  const shakeY = shakeLocal > 0 && shakeLocal < 15 ? Math.cos(shakeLocal * 3) * (15 - shakeLocal) : 0;

  return (
    <AbsoluteFill style={{ zIndex: 500, pointerEvents: "none", justifyContent: "center", alignItems: "center", transform: `translate(${shakeX}px, ${shakeY}px)` }}>
      <div style={{
        transform: `translateY(${currentY + floatY}px) scale(${currentScale}) rotate(${rotation}deg)`,
        filter: `blur(${motionBlur}px) drop-shadow(0 0 80px rgba(251,191,36,0.9)) drop-shadow(0 0 20px rgba(255,255,255,0.5))`,
        willChange: "transform, filter", opacity: currentOpacity,
        display: "flex", justifyContent: "center", alignItems: "center"
      }}>
        {/* We use standard img so it won't crash if the user hasn't placed the file yet */}
        <img src={staticFile("youtube-assets/worldcup-trophy.png")} style={{ width: 450, height: "auto", objectFit: "contain" }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── PREMIUM 2026 3D TEXT ───────────────────────────────────────────────────
const Premium2026Text: React.FC = () => {
  return (
    <div style={{
      fontSize: 140, fontWeight: 900, color: "#fff", fontFamily: "sans-serif",
      letterSpacing: 20, marginTop: 200,
      // Pulled outwards on Z-axis with a heavy perspective curve
      transform: "perspective(600px) rotateX(25deg) scale(1.1)",
      // Core gold shadow, flanked by very subtle, elegant magenta & teal chromatic aberration
      textShadow: "0 10px 40px rgba(251,191,36,0.8), -6px 0 20px rgba(34,211,238,0.3), 6px 0 20px rgba(236,72,153,0.3)",
      // Center focal point sharp, blurred/faded at the edges
      WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.1) 100%)",
      display: "flex", justifyContent: "center"
    }}>
      2026
    </div>
  );
};

// ─── WORLD CUP OUTRO BRANDING ────────────────────────────────────────────────
const WorldCupOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Violent entrance for 2026 Typography
  const entrance = spring({ frame, fps, config: { damping: 10, stiffness: 150 } });
  const scale = interpolate(entrance, [0, 1], [4, 1]);
  const blur = interpolate(entrance, [0, 1], [40, 0]);
  const opacity = interpolate(frame, [0, 5], [0, 1]);

  // Camera Shake on impact
  const shakeX = frame < 15 ? Math.sin(frame * 2.5) * (15 - frame) : 0;
  const shakeY = frame < 15 ? Math.cos(frame * 3) * (15 - frame) : 0;

  // Flash bang effect
  const flashOpacity = interpolate(frame, [0, 12], [1, 0], { extrapolateRight: "clamp" });

  const auraScale = 1 + Math.sin(frame * 0.05) * 0.2;

  // ── Harfen W Laken Brand Animations ──
  const logoSpring  = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 12, stiffness: 60 } });
  const logoScale   = interpolate(logoSpring, [0, 1], [0, 1.2]);
  const logoOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" });
  const logoFloat   = Math.sin(frame * 0.1) * 6;
  const heartLeftX  = interpolate(logoSpring, [0, 1], [-150, 0]);
  const heartRightX = interpolate(logoSpring, [0, 1], [150, 0]);

  const labelStart  = 35;
  const labelSpring = spring({ frame: Math.max(0, frame - labelStart), fps, config: { damping: 11, stiffness: 100 } });
  const labelScale  = interpolate(labelSpring, [0, 1], [0.4, 1]);
  const labelOpacity = interpolate(frame, [labelStart, labelStart + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const slam1Start  = 55;
  const slam1Spring = spring({ frame: Math.max(0, frame - slam1Start), fps, config: { damping: 8, stiffness: 180 } });
  const slam1Y      = interpolate(slam1Spring, [0, 1], [-100, 0]);
  const slam1Scl    = interpolate(slam1Spring, [0, 1], [1.5, 1]);
  const slam1Opc    = interpolate(frame, [slam1Start, slam1Start + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center", zIndex: 200, transform: `translate(${shakeX}px, ${shakeY}px)` }}>
      <div style={{ position: "absolute", width: "150%", height: "150%", background: "radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 60%)", transform: `scale(${auraScale})`, opacity }} />

      {/* Main Impact Container */}
      <div style={{ transform: `scale(${scale}) translateY(-100px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, filter: `blur(${blur}px)`, opacity }}>
        <Premium2026Text />
      </div>

      {/* Harfen W Laken Brand Container */}
      <div style={{ position: "absolute", bottom: 100, display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {/* Heart Logo */}
        <div style={{ transform: `scale(${logoScale}) translateY(${logoFloat}px)`, opacity: logoOpacity, willChange: "transform", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle at center, rgba(34,211,238,0.3) 0%, rgba(236,72,153,0.2) 50%, transparent 80%)", filter: "blur(30px)" }} />
          <div style={{ position: "relative", width: 140, height: 140 }}>
            <img src={staticFile("youtube-assets/heart-teal.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", transform: `translateX(${heartLeftX}px)`, filter: "drop-shadow(0 0 25px rgba(34,211,238,0.7))" }} />
            <img src={staticFile("youtube-assets/heart-pink.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", transform: `translateX(${heartRightX}px)`, filter: "drop-shadow(0 0 25px rgba(236,72,153,0.7))" }} />
          </div>
        </div>

        {/* Channel Name */}
        <div style={{ transform: `scale(${labelScale})`, opacity: labelOpacity, display: "flex", flexDirection: "column", alignItems: "center", willChange: "transform", marginTop: 20 }}>
          <h1 style={{ margin: 0, fontSize: 54, fontWeight: 900, color: "#ffffff", letterSpacing: 4, fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif", textShadow: "0 0 40px rgba(255,255,255,0.25), 0 8px 30px rgba(0,0,0,0.9)", direction: "rtl" }}>حرفين ولكن</h1>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 8, textTransform: "uppercase", marginTop: 4 }}>
            <span style={{ color: "#22d3ee", textShadow: "0 0 20px rgba(34,211,238,0.8)", marginRight: 8 }}>A.I.</span>
            <span style={{ color: "#fbbf24", textShadow: "0 0 20px rgba(251,191,36,0.8)" }}>NEWS</span>
          </div>
        </div>

        {/* Tagline */}
        <div style={{ transform: `translateY(${slam1Y}px) scale(${slam1Scl})`, opacity: slam1Opc, transformOrigin: "top center", willChange: "transform", backfaceVisibility: "hidden", marginTop: 24 }}>
          <p style={{ margin: 0, fontSize: 36, fontWeight: 900, color: "#ffffff", textAlign: "center", fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif", textShadow: "0 0 30px rgba(236,72,153,0.6), 0 8px 30px rgba(0,0,0,0.9)", direction: "rtl" }}>الذكاء الاصطناعي بلغتنا</p>
        </div>

      </div>

      {/* Extreme Light Flash Overlay (Cyan to White) */}
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flashOpacity, mixBlendMode: "screen", zIndex: 300 }} />
      <AbsoluteFill style={{ backgroundColor: "#22d3ee", opacity: flashOpacity * 0.8, mixBlendMode: "screen", zIndex: 299 }} />
    </AbsoluteFill>
  );
};

// ─── VIRAL KINETIC TYPOGRAPHY ────────────────────────────────────────────────
const KineticText: React.FC<{
  text: string; startFrame: number; endFrame: number; 
  color?: string; size?: number; align?: "center" | "left" | "right"
}> = ({ text, startFrame, endFrame, color = "#fff", size = 96, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  if (frame < startFrame || frame > endFrame + 30) return null;

  const words = text.split(" ");
  
  const exitOpacity = interpolate(frame, [endFrame, endFrame + 15], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const exitScale = interpolate(frame, [endFrame, endFrame + 15], [1, 1.15], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const exitBlur = interpolate(frame, [endFrame, endFrame + 15], [0, 15], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ 
      justifyContent: "flex-end", 
      alignItems: "center", 
      paddingBottom: "14%", 
      paddingLeft: "60px", paddingRight: "60px",
      zIndex: 80, pointerEvents: "none",
      opacity: exitOpacity, transform: `scale(${exitScale})`, filter: `blur(${exitBlur}px)`
    }}>
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: align, gap: "24px", direction: "rtl",
        textShadow: "0 10px 40px rgba(0,0,0,0.9), 0 0 15px rgba(0,0,0,0.8)"
      }}>
        {words.map((w, i) => {
          const wDelay = startFrame + i * 5;
          const wProgress = spring({ frame: Math.max(0, frame - wDelay), fps, config: { damping: 12, stiffness: 200 } });
          const wScale = interpolate(wProgress, [0, 1], [0.5, 1]);
          const wY = interpolate(wProgress, [0, 1], [80, 0]);
          const wOpacity = interpolate(frame, [wDelay, wDelay + 5], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          const wBlur = interpolate(frame, [wDelay, wDelay + 5], [20, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          
          return (
            <span key={i} style={{
              fontSize: size, fontWeight: 900, color: color, fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif",
              transform: `translateY(${wY}px) scale(${wScale})`, opacity: wOpacity, filter: `blur(${wBlur}px)`,
              display: "inline-block", willChange: "transform, opacity, filter", lineHeight: 1.2
            }}>
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── MAIN COMPOSITION ────────────────────────────────────────────────────────
export const ShortWorldCup: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      
      {/* SHOT A: The Human Game (0 - 300) */}
      <Sequence from={0} durationInFrames={300}>
        <AbsoluteFill>
          <Video src={staticFile("youtube-assets/broll-a-worldcup.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)" }} />
        </AbsoluteFill>
      </Sequence>

      {/* SHOT B: The AI Coach (300 - 600) */}
      <Sequence from={300} durationInFrames={300}>
        <AbsoluteFill>
          <Video src={staticFile("youtube-assets/broll-b-worldcup.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)" }} />
        </AbsoluteFill>
      </Sequence>

      {/* SHOT C: The AI Oracle (600 - 900) */}
      <Sequence from={600} durationInFrames={300}>
        <AbsoluteFill>
          <Video src={staticFile("youtube-assets/broll-c-worldcup.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)" }} />
        </AbsoluteFill>
      </Sequence>

      {/* BRAND OUTRO (900 - 1050) */}
      <Sequence from={900} durationInFrames={150}>
        <WorldCupOutro />
      </Sequence>

      {/* GLOBAL EFFECTS & TRANSITIONS */}
      <FilmGrain />
      <GoldDust />
      <NeuralSphereTransition frameIn={300} />
      <NeuralSphereTransition frameIn={600} />

      {/* The 3D Trophy flies in over the final cut */}
      <TrophyFlyIn />

      {/* ─── KINETIC TYPOGRAPHY LAYER ─── */}
      
      {/* PHASE 1 (0s - 6s) */}
      <KineticText text="لو الذكاء الاصطناعي" startFrame={20} endFrame={80} color="#fff" size={110} />
      <KineticText text="درب منتخب كامل..." startFrame={90} endFrame={170} color="#22d3ee" size={130} />

      {/* PHASE 2 (6s - 14s) */}
      <KineticText text="هل يهزم أفضل مدرب في العالم؟" startFrame={180} endFrame={242} color="#fff" size={100} />
      <KineticText text="أو يقدر يبني" startFrame={280} endFrame={310} color="#fff" size={110} />
      <KineticText text="المنتخب المثالي؟" startFrame={310} endFrame={420} color="#fbbf24" size={140} />

      {/* PHASE 3 (14s - 24s) */}
      <KineticText text="خلينا نقول على الأقل..." startFrame={430} endFrame={490} color="#fff" size={96} />
      <KineticText text="يقدر يتوقع" startFrame={490} endFrame={530} color="#22d3ee" size={120} />
      <KineticText text="بطل كأس العالم؟" startFrame={530} endFrame={575} color="#fbbf24" size={150} />
      
      <KineticText text="هل تتوقع يقدر يعمل" startFrame={640} endFrame={690} color="#fff" size={100} />
      <KineticText text="واحدة من الحاجات دي؟" startFrame={690} endFrame={750} color="#fff" size={110} />
      <KineticText text="ولا يقدر يعملهم كلهم؟!" startFrame={770} endFrame={880} color="#22d3ee" size={140} />

    </AbsoluteFill>
  );
};
