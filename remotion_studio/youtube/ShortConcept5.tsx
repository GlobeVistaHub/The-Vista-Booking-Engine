import React from "react";
import {
  AbsoluteFill, staticFile, interpolate, spring,
  useCurrentFrame, useVideoConfig, Sequence, Easing, OffthreadVideo
} from "remotion";

// ── 30fps × 900 frames = 30 seconds ──────────────────────────────────────────
export const TOTAL_DURATION = 1050; // 35 seconds @ 30fps

export const ShortConcept5: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#030308", overflow: "hidden" }}>

      {/* SEGMENT 1 — B-Roll A */}
      <Sequence from={0} durationInFrames={300}>
        <BrollA />
      </Sequence>

      {/* SEGMENT 2 — Mazen */}
      <Sequence from={300} durationInFrames={150}>
        <FeaturePortrait
          image="youtube-assets/mazen.jpeg"
          themeColor="#22d3ee"
          speechText="حتى مطوريه بدأوا يقلقوا."
          cameraMotion="right-to-left"
          speakerName="مازن"
          speakerDate="الجمعة ١٤ يونيو ٢٠٢٦"
        />
      </Sequence>

      {/* SEGMENT 3 — B-Roll B */}
      <Sequence from={450} durationInFrames={300}>
        <BrollB />
      </Sequence>

      {/* SEGMENT 4 — Mariya */}
      <Sequence from={750} durationInFrames={150}>
        <FeaturePortrait
          image="youtube-assets/mariya.jpeg"
          themeColor="#ec4899"
          speechText="كان خيال علمي من سنة."
          cameraMotion="right-to-forward"
          speakerName="ماريا"
          speakerDate="السبت ١٥ يونيو ٢٠٢٦"
        />
      </Sequence>

      {/* SEGMENT 5 — Brand Outro */}
      <Sequence from={900} durationInFrames={150}>
        <BrandOutro />
      </Sequence>

      {/* GLOBAL HUD & UNIFIERS (Plays over everything) */}
      <GlobalHUD />

    </AbsoluteFill>
  );
};

// ─── PREMIUM SCENE TRANSITION ───────────────────────────────────────────────
const PremiumTransition: React.FC<{ frameIn: number; frameOut: number; color: string }> = ({ frameIn, frameOut, color }) => {
  const frame = useCurrentFrame();

  // Fix frame 0 wash: Only apply entry flash if this is NOT the very first frame of the video
  const entryFocus = frameIn > 0 ? interpolate(frame, [frameIn, frameIn + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) }) : 0;
  const exitFocus  = interpolate(frame, [frameOut - 8, frameOut], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.exp) });
  
  const intensity = Math.max(entryFocus, exitFocus);

  if (intensity === 0) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
      {/* Intense light leak flash */}
      <AbsoluteFill style={{ backgroundColor: color, opacity: intensity * 0.3, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ backgroundColor: "#ffffff", opacity: intensity * 0.9, mixBlendMode: "overlay" }} />
      
      {/* Lens Distortion / Digital Speed lines */}
      {intensity > 0.1 && (
         <AbsoluteFill style={{
           backgroundImage: "repeating-linear-gradient(90deg, transparent 0px, rgba(255,255,255,0.2) 2px, transparent 4px)",
           transform: `scale(${1 + intensity * 0.5}) skewX(${intensity * 45}deg)`,
           opacity: intensity * 0.5,
           mixBlendMode: "screen",
         }} />
      )}
    </AbsoluteFill>
  );
};

// ─── AI SPARK ICON ────────────────────────────────────────────────────────
const AISparkIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame * 0.15) * 0.15;
  const rotation = frame * 2;

  return (
    <div style={{ transform: `scale(${pulse}) rotate(${rotation}deg)`, display: "flex", willChange: "transform" }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 15px ${color})` }}>
        <path d="M12 2C12 7.52285 16.4772 12 22 12C16.4772 12 12 16.4772 12 22C12 16.4772 7.52285 12 2 12C7.52285 12 12 7.52285 12 2Z" fill={color}/>
        <path d="M19 15C19 16.6569 20.3431 18 22 18C20.3431 18 19 19.3431 19 21C19 19.3431 17.6569 18 16 18C17.6569 18 19 16.6569 19 15Z" fill={color}/>
        <path d="M5 4C5 5.65685 6.34315 7 8 7C6.34315 7 5 8.34315 5 10C5 8.34315 3.65685 7 2 7C3.65685 7 5 5.65685 5 4Z" fill={color}/>
      </svg>
    </div>
  );
};

// ─── GLOBAL BROADCAST HUD ───────────────────────────────────────────────────
const GlobalHUD: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Fade out top HUD elements during the final Brand Outro (Frame 900)
  const hudOpacity = interpolate(frame, [880, 910], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // Ticker slides away during portraits (300-450 and 750-900) and outro (900+)
  const tickerY = interpolate(
    frame,
    [
      0, 285, 300, // B-Roll A (visible), sliding out
      435, 450,    // Mazen (hidden), sliding in
      735, 750     // B-Roll B (visible), sliding out permanently
    ],
    [
      0, 0, 80, 
      80, 0, 
      0, 80
    ],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) }
  );

  const blink = Math.floor(frame / 15) % 2 === 0;
  const tickerText = "عاجل: تكنولوجيا الذكاء الاصطناعي تعيد تشكيل المستقبل • تطورات متسارعة في عالم الأخبار • بث مباشر من مركز البيانات • ";
  const tickerX = (frame * 3) % 2000; // Scrolls horizontally

  const hours = Math.floor(frame / (30 * 60 * 60)).toString().padStart(2, '0');
  const minutes = Math.floor((frame / (30 * 60)) % 60).toString().padStart(2, '0');
  const seconds = Math.floor((frame / 30) % 60).toString().padStart(2, '0');
  const frames = (frame % 30).toString().padStart(2, '0');
  const timecode = `REC ${hours}:${minutes}:${seconds}:${frames}`;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 120 }}>
      {/* Top Left: REC */}
      <div style={{ position: "absolute", top: 50, left: 50, display: "flex", alignItems: "center", gap: 16, opacity: hudOpacity }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: blink ? "#ff003c" : "#660018", boxShadow: blink ? "0 0 20px #ff003c" : "none" }} />
        <span style={{ color: "#fff", fontWeight: 900, fontSize: 26, letterSpacing: 4, fontFamily: "sans-serif", textShadow: "0 0 10px rgba(0,0,0,0.8)" }}>LIVE</span>
      </div>
      
      {/* Top Right: Timecode */}
      <div style={{ position: "absolute", top: 50, right: 50, opacity: hudOpacity }}>
        <span style={{ color: "#fff", fontWeight: 600, fontSize: 22, letterSpacing: 5, fontFamily: "monospace", opacity: 0.85, textShadow: "0 0 10px rgba(0,0,0,0.8)" }}>
          {timecode}
        </span>
      </div>

      {/* Bottom: Ticker */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 55, backgroundColor: "rgba(0,0,0,0.8)", borderTop: "2px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", overflow: "hidden", backdropFilter: "blur(10px)", transform: `translateY(${tickerY}px)` }}>
        <div style={{ position: "absolute", left: "-400%", right: "-400%", color: "#fff", fontSize: 26, fontWeight: 700, fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif", whiteSpace: "nowrap", transform: `translateX(${tickerX}px)`, textShadow: "0 0 15px rgba(255,255,255,0.4)", textAlign: "center" }}>
          {tickerText.repeat(40)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── CORNER BRACKETS ──────────────────────────────────────────────────────────
const CornerBrackets: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entry = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const scale = interpolate(entry, [0, 1], [1.1, 1]);
  const opacity = interpolate(entry, [0, 1], [0, 0.8]);

  const size = 80;
  const thick = 5;
  const padding = 40;
  const style = { position: "absolute" as const, width: size, height: size, borderColor: color, opacity, transform: `scale(${scale})`, boxShadow: `0 0 20px ${color}40` };

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 110 }}>
      <div style={{ ...style, top: padding, left: padding, borderTop: `${thick}px solid`, borderLeft: `${thick}px solid` }} />
      <div style={{ ...style, top: padding, right: padding, borderTop: `${thick}px solid`, borderRight: `${thick}px solid` }} />
      <div style={{ ...style, bottom: padding + 60, left: padding, borderBottom: `${thick}px solid`, borderLeft: `${thick}px solid` }} />
      <div style={{ ...style, bottom: padding + 60, right: padding, borderBottom: `${thick}px solid`, borderRight: `${thick}px solid` }} />
    </AbsoluteFill>
  );
};

// ─── SPEAKER HUD ─────────────────────────────────────────────────────────────
const SpeakerHUD: React.FC<{ date: string; color: string }> = ({ date, color }) => {
  const frame = useCurrentFrame();
  
  const chars = date.split("");
  const typedChars = Math.min(chars.length, Math.floor(frame / 2));
  const currentText = chars.slice(0, typedChars).join("");

  const bars = [1, 2, 3, 4].map(b => (
    <div key={b} style={{ width: 8, height: b * 8, backgroundColor: color, opacity: (Math.sin(frame * 0.1 + b) * 0.5 + 0.5) > 0.3 ? 1 : 0.3, borderRadius: 2, boxShadow: `0 0 10px ${color}` }} />
  ));

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 115 }}>
      {/* Top Right Date Typing */}
      <div style={{ position: "absolute", top: 140, right: 60, direction: "rtl", fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif" }}>
        <div style={{ color: color, fontSize: 24, letterSpacing: 2, fontWeight: 900, textShadow: `0 0 15px ${color}` }}>LOC_TRK: DATA_NODE_01</div>
        <div style={{ color: "#fff", fontSize: 34, fontWeight: 600, marginTop: 6, textShadow: `0 0 20px rgba(0,0,0,0.9)` }}>
          {currentText}<span style={{ opacity: frame % 15 < 8 ? 1 : 0 }}>_</span>
        </div>
      </div>

      {/* Top Left Signal */}
      <div style={{ position: "absolute", top: 140, left: 60, display: "flex", alignItems: "flex-end", gap: 6 }}>
        {bars}
        <span style={{ color, marginLeft: 12, fontWeight: 900, fontFamily: "sans-serif", fontSize: 20, textShadow: `0 0 10px ${color}` }}>SIG OK</span>
      </div>
    </AbsoluteFill>
  );
};

// ─── FLOATING DATA DUST VFX (PREMIUM BOKEH) ───────────────────────────────────
const DataDust: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  
  // Minimalist, elegant particle count
  const particles = new Array(12).fill(0).map((_, i) => {
    const startX = (i * 87) % 100;
    const speed = 0.3 + ((i * 13) % 10) * 0.08;
    const size = 4 + ((i * 7) % 8); // 4px - 11px
    const blur = 3 + ((i * 3) % 6); // Heavy blur for premium out-of-focus bokeh
    return { startX, speed, size, blur };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 60, opacity: 0.45 }}>
      {particles.map((p, i) => {
        const yPos = 110 - ((frame * p.speed) % 120); // Moves upwards smoothly
        const floatX = Math.sin(frame * 0.015 + i) * 10; // Wide, slow drift
        
        return (
          <div key={i} style={{
            position: "absolute",
            left: `calc(${p.startX}% + ${floatX}px)`,
            top: `${yPos}%`,
            width: p.size, height: p.size,
            backgroundColor: color,
            borderRadius: "50%",
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
            filter: `blur(${p.blur}px)`,
            opacity: Math.sin((frame * 0.03) + i) * 0.4 + 0.6 // Very subtle twinkle
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── SCANLINE TEXTURE ────────────────────────────────────────────────────────
const Scanlines: React.FC = () => (
  <AbsoluteFill style={{
    pointerEvents: "none",
    backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 3px)",
    zIndex: 50,
  }} />
);

// ─── 1. B-ROLL A ─────────────────────────────────────────────────────────────
const BrollA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cinematic Continuous Forward + Rightward Drift to match the prompt
  const videoScale = interpolate(frame, [0, 300], [1.05, 1.25], { extrapolateRight: "clamp" });
  const videoPanX  = interpolate(frame, [0, 300], [0, -40], { extrapolateRight: "clamp" }); // Camera moves right
  const videoBlur  = interpolate(frame, [285, 300], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Text Animation Timing
  const textStart = 45;

  // Suck out precisely at 00:07.14 (7 seconds, 14 frames = 224 frames)
  const suckStart = 224;
  const anticipation = interpolate(frame, [suckStart, suckStart + 6], [1, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease) });
  const explosion = interpolate(frame, [suckStart + 6, suckStart + 18], [0, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.exp) });
  const suck = frame < suckStart + 6 ? anticipation : 0.85 + explosion;
  const suckO = interpolate(frame, [suckStart + 8, suckStart + 18], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const suckB = interpolate(frame, [suckStart + 6, suckStart + 18], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ 
        transform: `scale(${videoScale}) translateX(${videoPanX}px)`, 
        filter: `blur(${videoBlur}px)`, 
        transformOrigin: "center center",
        willChange: "transform", backfaceVisibility: "hidden"
      }}>
        <OffthreadVideo src={staticFile("youtube-assets/broll-a.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      <Scanlines />
      <DataDust color="#22d3ee" />
      <PremiumTransition frameIn={0} frameOut={300} color="#22d3ee" />

      {/* Text Overlay */}
      <AbsoluteFill style={{
        justifyContent: "center", alignItems: "center", pointerEvents: "none",
        transform: `scale(${suck})`, opacity: suckO, filter: `blur(${suckB}px)`,
      }}>
        <div style={{ position: "absolute", top: "22%", bottom: "22%", left: "-15%", right: "-15%", background: "radial-gradient(ellipse at center, rgba(3,3,8,0.85) 0%, transparent 70%)", filter: "blur(35px)" }} />

          <div style={{
            position: "relative", direction: "rtl", textAlign: "center",
            fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif",
            fontSize: 84, fontWeight: 900, color: "#fff", lineHeight: 1.35,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "24px"
          }}>
            {/* Animated SVG Icon */}
            <div style={{ 
              transform: `scale(${interpolate(frame, [textStart, textStart + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              opacity: interpolate(frame, [textStart, textStart + 5], [0, 1])
            }}>
              <AISparkIcon size={90} color="#22d3ee" />
            </div>

            {/* Kinetic Word-by-Word Typography */}
            {["الذكاء", "الاصطناعي", "بيتسارع..."].map((word, i) => {
              const delay = textStart + 5 + i * 15;
              const wSpring = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12, stiffness: 150 } });
              const wY = interpolate(wSpring, [0, 1], [50, 0]);
              const wOpc = interpolate(frame, [delay, delay + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              
              const isAccent = i === 2;
              return (
                <span key={i} style={{ 
                  display: "inline-block", 
                  transform: `translateY(${wY}px)`, opacity: wOpc, 
                  color: isAccent ? "#22d3ee" : "#fff",
                  textShadow: isAccent ? "0 0 40px rgba(34,211,238,1)" : "0 12px 40px rgba(0,0,0,0.95), 0 0 30px rgba(0,0,0,0.6)",
                  willChange: "transform"
                }}>
                  {word}
                </span>
              );
            })}
          </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── 2. B-ROLL B ─────────────────────────────────────────────────────────────
const BrollB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera Continuity: Starts left moving right
  const entrySpring = spring({ frame, fps, config: { damping: 11, stiffness: 100 } });
  const entryScale  = interpolate(entrySpring, [0, 1], [1.3, 1.1]);
  const videoPanX   = interpolate(frame, [0, 300], [40, -40], { extrapolateRight: "clamp" }); // Left to Right
  const entryBlur   = interpolate(frame, [0, 14], [50, 0], { extrapolateRight: "clamp" });
  const videoBlur   = interpolate(frame, [285, 300], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Text Animation Timing
  const textStart = 45;

  const suckStart = 210;
  const anticipation = interpolate(frame, [suckStart, suckStart + 6], [1, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease) });
  const explosion = interpolate(frame, [suckStart + 6, suckStart + 18], [0, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.exp) });
  const suckSc = frame < suckStart + 6 ? anticipation : 0.85 + explosion;
  const suckO = interpolate(frame, [suckStart + 8, suckStart + 18], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const suckB = interpolate(frame, [suckStart + 6, suckStart + 18], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ 
        transform: `scale(${entryScale}) translateX(${videoPanX}px)`, 
        filter: `blur(${entryBlur + videoBlur}px)`, 
        transformOrigin: "center center",
        willChange: "transform", backfaceVisibility: "hidden"
      }}>
        <OffthreadVideo src={staticFile("youtube-assets/broll-b.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      <Scanlines />
      <DataDust color="#ec4899" />
      <PremiumTransition frameIn={0} frameOut={300} color="#ec4899" />

      {/* Text Overlay */}
      <AbsoluteFill style={{
        justifyContent: "center", alignItems: "center", pointerEvents: "none",
        transform: `scale(${suckSc})`, opacity: suckO, filter: `blur(${suckB}px)`,
      }}>
        <div style={{ position: "absolute", top: "20%", bottom: "20%", left: "-15%", right: "-15%", background: "radial-gradient(ellipse at center, rgba(3,3,8,0.85) 0%, transparent 75%)", filter: "blur(35px)" }} />

          <div style={{
            position: "relative", direction: "rtl", textAlign: "center",
            fontSize: 84, fontWeight: 900, color: "#fff", lineHeight: 1.35,
            display: "flex", flexDirection: "column", alignItems: "center", gap: "10px"
          }}>
            {/* Word 1: Higgsfield */}
            <div style={{
              transform: `scale(${interpolate(spring({ frame: Math.max(0, frame - textStart), fps, config: { damping: 10, stiffness: 200 } }), [0, 1], [0.2, 1])})`, 
              opacity: interpolate(frame, [textStart, textStart + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), 
              color: "#ec4899", textShadow: "0 0 50px rgba(236,72,153,1)", fontFamily: "sans-serif", letterSpacing: 2,
              willChange: "transform", display: "flex", alignItems: "center", gap: "24px"
            }}>
              <AISparkIcon size={70} color="#ec4899" />
              Higgsfield
              <AISparkIcon size={70} color="#ec4899" />
            </div>
            
            {/* Word 2: النهارده... */}
            <div style={{
              transform: `translateY(${interpolate(spring({ frame: Math.max(0, frame - (textStart + 18)), fps, config: { damping: 12, stiffness: 150 } }), [0, 1], [40, 0])})`, 
              opacity: interpolate(frame, [textStart + 18, textStart + 23], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), 
              textShadow: "0 12px 40px rgba(0,0,0,0.95)", fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif",
              willChange: "transform"
            }}>
              النهارده...
            </div>
          </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── 3. FEATURE PORTRAIT w/ LIVE SPEECH BUBBLE ───────────────────────────────
const FeaturePortrait: React.FC<{
  image: string; themeColor: string; speechText: string; cameraMotion: "right-to-left" | "right-to-forward";
  speakerName: string; speakerDate: string;
}> = ({ image, themeColor, speechText, cameraMotion, speakerName, speakerDate }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── 2.5D PARALLAX CONTINUITY ──
  // Smooth scale-in entry (removed magenta/teal RGB split as requested)
  const entrySpring = spring({ frame, fps, config: { damping: 10, stiffness: 100 } });
  const entryScale  = interpolate(entrySpring, [0, 1], [1.3, 1]);

  let dollyScale = 1;
  let panX = 0;

  if (cameraMotion === "right-to-left") {
    // Mazen: Enters right (from BrollA), then orbits left
    dollyScale = interpolate(frame, [0, 150], [1.1, 1.2], { extrapolateRight: "clamp" });
    panX = interpolate(frame, [0, 150], [-40, 40], { extrapolateRight: "clamp" }); 
  } else {
    // Mariya: Enters right (from BrollB), ends with aggressive forward push
    dollyScale = interpolate(frame, [0, 150], [1.0, 1.35], { extrapolateRight: "clamp", easing: Easing.in(Easing.ease) });
    panX = interpolate(frame, [0, 80], [-30, 0], { extrapolateRight: "clamp" });
  }
  
  const breathY = Math.sin(frame * 0.12) * 6;
  const vignetteOpacity = 0.7 + Math.sin(frame * 0.18) * 0.15;

  // ── EXIT ──
  const exitStart = 138;
  const exitBlur  = interpolate(frame, [exitStart, 150], [0, 50], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitScale = interpolate(frame, [exitStart, 150], [1, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── LIVE SPEECH UI ANIMATION ──
  const uiDelay = 25;
  const uiSpring = spring({ frame: Math.max(0, frame - uiDelay), fps, config: { damping: 14, stiffness: 80 } });
  
  // 3D Drop from the top (mouth area)
  const uiY = interpolate(uiSpring, [0, 1], [-150, 0]);
  const uiScale = interpolate(uiSpring, [0, 1], [0.6, 1.15]); // Increased overall size
  const uiRotX = interpolate(uiSpring, [0, 1], [60, 0]); // 3D flip down
  const uiOpc = interpolate(frame, [uiDelay, uiDelay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Continuous 3D floating parallax
  const floatY = Math.sin((frame - uiDelay) * 0.06) * 12;
  const floatRotY = Math.sin((frame - uiDelay) * 0.04) * 6;

  // Audio wave animation (simulating voice activity)
  const wave1 = 16 + Math.sin(frame * 0.8) * 12;
  const wave2 = 22 + Math.sin(frame * 0.5 + 2) * 18;
  const wave3 = 14 + Math.sin(frame * 0.9 + 4) * 10;
  
  // Light sweep VFX
  const sweepX = interpolate(frame, [uiDelay + 10, uiDelay + 35], [-300, 800], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bubbleWords = speechText.split(" ");

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>

      <AbsoluteFill style={{ filter: "blur(60px) brightness(0.3) saturate(1.8)", transform: "scale(1.2)" }}>
        <img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${themeColor}18 0%, #030308aa 70%)` }} />

      <Scanlines />
      <DataDust color={themeColor} />
      <PremiumTransition frameIn={0} frameOut={150} color={themeColor} />
      <CornerBrackets color={themeColor} />
      <SpeakerHUD date={speakerDate} color={themeColor} />

      {/* MAIN IMAGE PANEL */}
      <AbsoluteFill style={{ transform: `scale(${exitScale})`, filter: `blur(${exitBlur}px)`, transformOrigin: "center center" }}>

        <div style={{
          position: "absolute", inset: 0,
          transform: `scale(${entryScale * dollyScale}) translateX(${panX}px) translateY(${breathY}px)`,
          transformOrigin: "center center", willChange: "transform", backfaceVisibility: "hidden"
        }}>
          <img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "65%", background: `linear-gradient(to top, rgba(3,3,8,${vignetteOpacity}) 0%, rgba(3,3,8,0.3) 50%, transparent 100%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 90% at 50% 50%, transparent 40%, rgba(3,3,8,0.6) 100%)", pointerEvents: "none" }} />

        {/* ── LIVE SPEECH BUBBLE ── */}
        <div style={{
          position: "absolute", bottom: "16%", left: 0, right: 0, display: "flex", justifyContent: "center",
          transform: `perspective(1200px) translateY(${uiY + floatY}px) scale(${uiScale}) rotateX(${uiRotX}deg) rotateY(${floatRotY}deg)`, opacity: uiOpc,
          transformOrigin: "center -150%", // Anchors rotation high up towards the mouth
          willChange: "transform", zIndex: 10,
        }}>
          <div style={{
            position: "relative",
            background: "linear-gradient(135deg, rgba(15,15,25,0.85) 0%, rgba(5,5,15,0.95) 100%)",
            backdropFilter: "blur(50px)", WebkitBackdropFilter: "blur(50px)",
            border: `1px solid rgba(255,255,255,0.15)`,
            borderRadius: "36px",
            padding: "32px 56px",
            display: "flex", alignItems: "center", gap: 28,
            boxShadow: `0 40px 80px rgba(0,0,0,0.9), 0 0 0 1px ${themeColor}40, inset 0 2px 20px rgba(255,255,255,0.1)`,
            maxWidth: "85%",
          }}>
            <div style={{ position: "absolute", inset: -2, borderRadius: 42, background: `linear-gradient(90deg, transparent, ${themeColor}90, transparent)`, opacity: 0.6, zIndex: -1, filter: "blur(14px)" }} />

            {/* Speaker Name Tag */}
            <div style={{ position: "absolute", top: -20, left: 60, background: themeColor, padding: "8px 24px", borderRadius: "12px 12px 0 0", color: "#000", fontWeight: 900, fontSize: 24, fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif" }}>
              {speakerName}
            </div>

            {/* Light Sweep VFX */}
            <div style={{ position: "absolute", inset: 0, borderRadius: 40, overflow: "hidden", pointerEvents: "none" }}>
              <div style={{
                position: "absolute", top: 0, bottom: 0, width: "35%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                transform: `translateX(${sweepX}px) skewX(-25deg)`
              }} />
            </div>

            {/* AI Voice Waveform */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, height: 50, width: 45 }}>
              <div style={{ width: 5, height: wave1, backgroundColor: themeColor, borderRadius: 5, boxShadow: `0 0 15px ${themeColor}` }} />
              <div style={{ width: 5, height: wave2, backgroundColor: themeColor, borderRadius: 5, boxShadow: `0 0 15px ${themeColor}` }} />
              <div style={{ width: 5, height: wave3, backgroundColor: themeColor, borderRadius: 5, boxShadow: `0 0 15px ${themeColor}` }} />
            </div>

            {/* Transcription Text (Word by Word) */}
            <h2 style={{
              margin: 0, fontSize: 62, fontWeight: 900, color: "#ffffff",
              fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif",
              direction: "rtl", lineHeight: 1.35,
              display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "flex-start",
              textShadow: "0 8px 25px rgba(0,0,0,0.9)",
            }}>
              {bubbleWords.map((w, i) => {
                const wDelay = uiDelay + 8 + i * 6; // Fast staccato reveal
                const wSpring = spring({ frame: Math.max(0, frame - wDelay), fps, config: { damping: 11, stiffness: 120 } });
                const wY = interpolate(wSpring, [0, 1], [25, 0]);
                const wScale = interpolate(wSpring, [0, 1], [0.8, 1]);
                const wOpc = interpolate(frame, [wDelay, wDelay + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <span key={i} style={{ 
                    transform: `translateY(${wY}px) scale(${wScale})`, 
                    opacity: wOpc, 
                    willChange: "transform", 
                    display: "inline-block" 
                  }}>
                    {w}
                  </span>
                )
              })}
            </h2>
            
            {/* Live Indicator */}
            <div style={{ position: "absolute", top: -16, right: 40, background: themeColor, color: "#000", fontSize: 18, fontWeight: 900, padding: "8px 20px", borderRadius: 16, letterSpacing: 3, boxShadow: `0 0 30px ${themeColor}` }}>
              LIVE
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── 4. BRAND OUTRO ───────────────────────────────────────────────────────────
const BrandOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryBlur  = interpolate(frame, [0, 12], [50, 0], { extrapolateRight: "clamp" });
  const bgScale    = 1 + frame * 0.001;
  const tealPulse    = 0.30 + 0.20 * Math.sin(frame * 0.11);
  const magentaPulse = 0.25 + 0.20 * Math.sin(frame * 0.09 + 1.5);

  const logoSpring  = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });
  const logoScale   = interpolate(logoSpring, [0, 1], [0, 1.45]);
  const logoOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const logoFloat   = Math.sin(frame * 0.1) * 6;
  const heartLeftX  = interpolate(logoSpring, [0, 1], [-150, 0]);
  const heartRightX = interpolate(logoSpring, [0, 1], [150, 0]);

  const labelStart  = 25;
  const labelSpring = spring({ frame: Math.max(0, frame - labelStart), fps, config: { damping: 11, stiffness: 100 } });
  const labelScale  = interpolate(labelSpring, [0, 1], [0.4, 1]);
  const labelOpacity = interpolate(frame, [labelStart, labelStart + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineWidth   = interpolate(frame, [35, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const slam1Start  = 45;
  const slam1Spring = spring({ frame: Math.max(0, frame - slam1Start), fps, config: { damping: 8, stiffness: 180 } });
  const slam1Y      = interpolate(slam1Spring, [0, 1], [-180, 0]);
  const slam1Scl    = interpolate(slam1Spring, [0, 1], [2.0, 1]);
  const slam1Opc    = interpolate(frame, [slam1Start, slam1Start + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const slam2Start  = 70;
  const slam2Spring = spring({ frame: Math.max(0, frame - slam2Start), fps, config: { damping: 9, stiffness: 140 } });
  const slam2X      = interpolate(slam2Spring, [0, 1], [400, 0]);
  const slam2Opc    = interpolate(frame, [slam2Start, slam2Start + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", filter: `blur(${entryBlur}px)` }}>
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile("youtube-assets/bg-circuit.jpeg")})`, backgroundSize: `cover`, backgroundPosition: "center center", transform: `scale(${bgScale})`, willChange: "transform", filter: "contrast(1.5) brightness(0.4) saturate(0.7)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 80% at 15% 50%, rgba(34,211,238,${tealPulse}) 0%, transparent 65%)`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 80% at 85% 50%, rgba(236,72,153,${magentaPulse}) 0%, transparent 65%)`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 70% at 50% 50%, transparent 30%, rgba(3,3,8,0.75) 100%)" }} />

      <Scanlines />
      <PremiumTransition frameIn={0} frameOut={150} color="#22d3ee" />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${logoScale}) translateY(${logoFloat}px)`, opacity: logoOpacity, willChange: "transform", marginBottom: 30, position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle at center, rgba(34,211,238,0.3) 0%, rgba(236,72,153,0.2) 50%, transparent 80%)", filter: "blur(30px)" }} />
          <div style={{ position: "relative", width: 180, height: 180 }}>
            <img src={staticFile("youtube-assets/heart-teal.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", transform: `translateX(${heartLeftX}px)`, filter: "drop-shadow(0 0 25px rgba(34,211,238,0.7))" }} />
            <img src={staticFile("youtube-assets/heart-pink.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", transform: `translateX(${heartRightX}px)`, filter: "drop-shadow(0 0 25px rgba(236,72,153,0.7))" }} />
          </div>
        </div>

        <div style={{ transform: `scale(${labelScale})`, opacity: labelOpacity, display: "flex", flexDirection: "column", alignItems: "center", willChange: "transform", marginTop: 20 }}>
          <h1 style={{ margin: 0, fontSize: 64, fontWeight: 900, color: "#ffffff", letterSpacing: 4, fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif", textShadow: "0 0 40px rgba(255,255,255,0.25), 0 8px 30px rgba(0,0,0,0.9)", direction: "rtl" }}>حرفين ولكن</h1>
          <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 8, textTransform: "uppercase", marginTop: 8 }}>
            <span style={{ color: "#22d3ee", textShadow: "0 0 20px rgba(34,211,238,0.8)", marginRight: 8 }}>A.I.</span>
            <span style={{ color: "#f59e0b", textShadow: "0 0 20px rgba(245,158,11,0.8)" }}>NEWS</span>
          </div>
        </div>

        <div style={{ width: "100%", transform: `scaleX(${lineWidth}) translateZ(0)`, transformOrigin: "center center", willChange: "transform", backfaceVisibility: "hidden", height: 2, margin: "24px 0 20px 0", background: "linear-gradient(to right, #22d3ee, rgba(255,255,255,0.6), #ec4899)", boxShadow: "0 0 20px rgba(34,211,238,0.6), 0 0 20px rgba(236,72,153,0.6)", borderRadius: 2 }} />

        <div style={{ transform: `translateY(${slam1Y}px) scale(${slam1Scl})`, opacity: slam1Opc, transformOrigin: "top center", willChange: "transform", backfaceVisibility: "hidden" }}>
          <p style={{ margin: 0, fontSize: 44, fontWeight: 900, color: "#ffffff", textAlign: "center", fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif", textShadow: "0 0 30px rgba(236,72,153,0.6), 0 8px 30px rgba(0,0,0,0.9)", direction: "rtl" }}>الذكاء الاصطناعي بلغتنا</p>
        </div>

        <div style={{ transform: `translateX(${slam2X}px)`, opacity: slam2Opc, marginTop: 18, willChange: "transform", backfaceVisibility: "hidden" }}>
          <p style={{ margin: 0, fontSize: 26, fontWeight: 600, color: "rgba(255,255,255,0.45)", fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif", letterSpacing: 1, direction: "rtl" }}>جميع الحقوق محفوظة</p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
