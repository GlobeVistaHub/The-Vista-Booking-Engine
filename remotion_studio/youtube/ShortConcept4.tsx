import React from "react";
import {
  AbsoluteFill, Img, staticFile, interpolate, spring,
  useCurrentFrame, useVideoConfig, Sequence, Video, Easing, OffthreadVideo, continueRender, delayRender
} from "remotion";

// ── 30fps × 900 frames = 30 seconds ──────────────────────────────────────────
// 0:00 – 0:10  →  frames 0   – 300  →  B-Roll A + News Hook Text
// 0:10 – 0:15  →  frames 300 – 450  →  Mazen Portrait + Lower Third
// 0:15 – 0:25  →  frames 450 – 750  →  B-Roll B + Secondary Text
// 0:25 – 0:30  →  frames 750 – 900  →  Mariya Portrait + Lower Third

export const TOTAL_DURATION = 1050; // 35 seconds @ 30fps

export const ShortConcept4: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#030308", overflow: "hidden" }}>

      {/* SEGMENT 1 — B-Roll A */}
      <Sequence from={0} durationInFrames={300}>
        <BrollA />
      </Sequence>

      {/* SEGMENT 2 — Mazen */}
      <Sequence from={300} durationInFrames={150}>
        <FeaturePortrait
          name="مازن"
          role="I.T. / CODE"
          origin="الإسكندرية، مصر"
          image="youtube-assets/mazen.jpeg"
          themeColor="#22d3ee"
          direction="left"
        />
      </Sequence>

      {/* SEGMENT 3 — B-Roll B */}
      <Sequence from={450} durationInFrames={300}>
        <BrollB />
      </Sequence>

      {/* SEGMENT 4 — Mariya */}
      <Sequence from={750} durationInFrames={150}>
        <FeaturePortrait
          name="ماريا"
          role="FINE ARTS / DESIGN"
          origin="الإسكندرية، مصر"
          image="youtube-assets/mariya.jpeg"
          themeColor="#ec4899"
          direction="right"
        />
      </Sequence>

      {/* SEGMENT 5 — Brand Outro */}
      <Sequence from={900} durationInFrames={150}>
        <BrandOutro />
      </Sequence>

    </AbsoluteFill>
  );
};

// ─── GLITCH TRANSITION OVERLAY ───────────────────────────────────────────────
// Renders a violent chromatic glitch + scanline flash at start/end of segments
const GlitchOverlay: React.FC<{ frameIn: number; frameOut: number; color: string }> = ({ frameIn, frameOut, color }) => {
  const frame = useCurrentFrame();

  const entryFlash = interpolate(frame, [frameIn, frameIn + 4, frameIn + 8], [1, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitFlash  = interpolate(frame, [frameOut - 8, frameOut - 4, frameOut], [0, 0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glitchOpacity = Math.max(entryFlash, exitFlash);

  const rgbShift = (entryFlash + exitFlash) * 25;

  if (glitchOpacity === 0) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
      {/* Chromatic R/G/B shift layers */}
      <AbsoluteFill style={{ opacity: glitchOpacity * 0.6, mixBlendMode: "screen", transform: `translateX(${rgbShift}px)`, background: `rgba(255,0,60,0.25)` }} />
      <AbsoluteFill style={{ opacity: glitchOpacity * 0.6, mixBlendMode: "screen", transform: `translateX(${-rgbShift}px)`, background: `rgba(0,255,255,0.25)` }} />
      {/* Horizontal scanlines flash */}
      <AbsoluteFill style={{
        opacity: glitchOpacity * 0.4,
        backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 4px)",
      }} />
      {/* White flash */}
      <AbsoluteFill style={{ backgroundColor: color, opacity: glitchOpacity * 0.12 }} />
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

  // Text Part 1: SLAM from above (word drop) — different from Concept3's typewriter
  const part1 = spring({ frame, fps, config: { damping: 10, stiffness: 120 } });
  const p1Y   = interpolate(part1, [0, 1], [-120, 0]);
  const p1Scl = interpolate(part1, [0, 1], [1.4, 1]);

  // Text Part 2: Horizontal slice-in from right @ 2s (Harder Slam)
  const part2Start = 60;
  const part2 = spring({ frame: Math.max(0, frame - part2Start), fps, config: { damping: 8, stiffness: 180 } });
  const p2X   = interpolate(part2, [0, 1], [600, 0]);
  const p2Skw = interpolate(part2, [0, 1], [40, 0]);
  const p2Opc = interpolate(frame, [part2Start, part2Start + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Suck-in exactly at 00:05.01 (151 frames) with Anticipation / Reflex
  const suckStart = 151;
  const anticipation = interpolate(frame, [suckStart, suckStart + 6], [1, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease) });
  const explosion = interpolate(frame, [suckStart + 6, suckStart + 18], [0, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.exp) });
  const suck = frame < suckStart + 6 ? anticipation : 0.85 + explosion;

  const suckO = interpolate(frame, [suckStart + 8, suckStart + 18], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const suckB = interpolate(frame, [suckStart + 6, suckStart + 18], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Slow push in on video
  const videoScale = interpolate(frame, [0, 300], [1.0, 1.12], { extrapolateRight: "clamp" });
  const videoBlur  = interpolate(frame, [285, 300], [0, 50], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Video */}
      <AbsoluteFill style={{ 
        transform: `scale(${videoScale})`, 
        filter: `blur(${videoBlur}px)`, 
        transformOrigin: "center center",
        willChange: "transform",
        backfaceVisibility: "hidden"
      }}>
        <OffthreadVideo src={staticFile("youtube-assets/broll-a.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      <Scanlines />
      <GlitchOverlay frameIn={0} frameOut={300} color="#22d3ee" />

      {/* Text Overlay */}
      <AbsoluteFill style={{
        justifyContent: "center", alignItems: "center", pointerEvents: "none",
        transform: `scale(${suck}) blur(${0}px)`,
        opacity: suckO,
        filter: `blur(${suckB}px)`,
        transformOrigin: "center center",
      }}>
        {/* Dark elliptical readability scrim */}
        <div style={{
          position: "absolute", top: "22%", bottom: "22%", left: "-15%", right: "-15%",
          background: "radial-gradient(ellipse at center, rgba(3,3,8,0.85) 0%, rgba(3,3,8,0.45) 45%, transparent 75%)",
          filter: "blur(35px)",
        }} />

        <div style={{
          position: "relative", direction: "rtl", textAlign: "center",
          fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif",
          padding: "0 60px",
          willChange: "transform", WebkitFontSmoothing: "antialiased"
        }}>

          {/* Part 1 — Drops from top */}
          <div style={{
            fontSize: 68, fontWeight: 900, color: "#fff", lineHeight: 1.35,
            textShadow: "0 12px 40px rgba(0,0,0,0.95), 0 0 30px rgba(0,0,0,0.6)",
            transform: `translateY(${p1Y}px) scale(${p1Scl})`,
            backfaceVisibility: "hidden",
          }}>
            الذكاء الاصطناعي بيكريت ألعاب{" "}
            <span style={{ color: "#22d3ee", textShadow: "0 0 40px rgba(34,211,238,1), 0 0 100px rgba(34,211,238,0.6)" }}>3D كاملة</span>
          </div>

          {/* Part 2 — Slices in from right */}
          {frame >= part2Start && (
            <div style={{
              fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1.4, marginTop: 20,
              textShadow: "0 12px 40px rgba(0,0,0,0.95)",
              transform: `translateX(${p2X}px) skewX(${-p2Skw}deg)`,
              opacity: p2Opc,
              backfaceVisibility: "hidden",
            }}>
              من مجرد{" "}
              <span style={{ color: "#ec4899", textShadow: "0 0 40px rgba(236,72,153,1), 0 0 100px rgba(236,72,153,0.6)" }}>رسمة واحدة بس.</span>
            </div>
          )}

        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── 2. B-ROLL B ─────────────────────────────────────────────────────────────
const BrollB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry shatter
  const entrySpring = spring({ frame, fps, config: { damping: 11, stiffness: 100 } });
  const entryScale  = interpolate(entrySpring, [0, 1], [1.6, 1]);
  const entryBlur   = interpolate(frame, [0, 14], [50, 0], { extrapolateRight: "clamp" });

  // Text: Rotating word-by-word cascade (different style again) @ 1s
  const textStart = 30;
  const textSpring = spring({ frame: Math.max(0, frame - textStart), fps, config: { damping: 12, stiffness: 80 } });
  const textRotate = interpolate(textSpring, [0, 1], [-25, 0]);
  const textY      = interpolate(textSpring, [0, 1], [80, 0]);
  const textOpc    = interpolate(frame, [textStart, textStart + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Part 2 text @ 3s
  const t2Start  = 90;
  const t2Spring = spring({ frame: Math.max(0, frame - t2Start), fps, config: { damping: 10, stiffness: 150 } });
  const t2Scl    = interpolate(t2Spring, [0, 1], [0.3, 1]);
  const t2Opc    = interpolate(frame, [t2Start, t2Start + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Suck out exactly at 00:22 (210 frames into Broll B) with Anticipation / Reflex
  const suckStart = 210;
  const anticipation = interpolate(frame, [suckStart, suckStart + 6], [1, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease) });
  const explosion = interpolate(frame, [suckStart + 6, suckStart + 18], [0, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.exp) });
  const suckSc = frame < suckStart + 6 ? anticipation : 0.85 + explosion;

  const suckO   = interpolate(frame, [suckStart + 8, suckStart + 18], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const suckB   = interpolate(frame, [suckStart + 6, suckStart + 18], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const videoBlur = interpolate(frame, [285, 300], [0, 50], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ 
        transform: `scale(${entryScale})`, 
        filter: `blur(${entryBlur + videoBlur}px)`, 
        transformOrigin: "center center",
        willChange: "transform",
        backfaceVisibility: "hidden"
      }}>
        <OffthreadVideo src={staticFile("youtube-assets/broll-b.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      <Scanlines />
      <GlitchOverlay frameIn={0} frameOut={300} color="#ec4899" />

      {/* Secondary info text overlay */}
      <AbsoluteFill style={{
        justifyContent: "center", alignItems: "center", pointerEvents: "none",
        transform: `scale(${suckSc})`, opacity: suckO, filter: `blur(${suckB}px)`,
        transformOrigin: "center center"
      }}>
        <div style={{
          position: "absolute", top: "20%", bottom: "20%", left: "-15%", right: "-15%",
          background: "radial-gradient(ellipse at center, rgba(3,3,8,0.85) 0%, rgba(3,3,8,0.45) 45%, transparent 75%)",
          filter: "blur(35px)"
        }} />

        <div style={{
          position: "relative", direction: "rtl", textAlign: "center",
          fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif",
          padding: "0 60px", willChange: "transform", WebkitFontSmoothing: "antialiased"
        }}>
          {frame >= textStart && (
            <div style={{
              fontSize: 62, fontWeight: 900, color: "#fff", lineHeight: 1.35,
              textShadow: "0 12px 40px rgba(0,0,0,0.95)",
              transform: `translateY(${textY}px) rotateX(${textRotate}deg)`,
              transformOrigin: "bottom center",
              opacity: textOpc, backfaceVisibility: "hidden",
            }}>
              مش بس بيكريت الكود..{" "}
              <span style={{ color: "#22d3ee", textShadow: "0 0 50px rgba(34,211,238,1)" }}>بيفهم الفيزيا</span>
            </div>
          )}
          {frame >= t2Start && (
            <div style={{
              fontSize: 50, fontWeight: 900, color: "#fff", lineHeight: 1.4, marginTop: 24,
              textShadow: "0 12px 40px rgba(0,0,0,0.95)",
              transform: `scale(${t2Scl})`,
              opacity: t2Opc, backfaceVisibility: "hidden",
            }}>
              والرسومات{" "}
              <span style={{ color: "#ec4899", textShadow: "0 0 50px rgba(236,72,153,1)" }}>والبشر.</span>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── 3. FEATURE PORTRAIT ─────────────────────────────────────────────────────
const FeaturePortrait: React.FC<{
  name: string; role: string; origin: string;
  image: string; themeColor: string; direction: "left" | "right";
}> = ({ name, role, origin, image, themeColor, direction }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── ENTRY: explosive scale-in + rgb split ──
  const entrySpring = spring({ frame, fps, config: { damping: 9, stiffness: 130 } });
  const entryScale  = interpolate(entrySpring, [0, 1], [1.4, 1]);

  // RGB chromatic split decays over first 12 frames
  const rgbStrength = interpolate(frame, [0, 6, 12], [40, 15, 0], { extrapolateRight: "clamp" });

  // ── 2.5D PARALLAX: slow push + drift ──
  const dollyScale = interpolate(frame, [0, 150], [1.0, 1.18], { extrapolateRight: "clamp" });
  const panX       = interpolate(frame, [0, 150], [direction === "left" ? 30 : -30, direction === "left" ? -30 : 30], { extrapolateRight: "clamp" });
  const breathY    = Math.sin(frame * 0.12) * 6;

  // ── VIGNETTE PULSE on heartbeat rhythm ──
  const vignetteOpacity = 0.7 + Math.sin(frame * 0.18) * 0.15;

  // ── LOWER THIRD: slides in from edge with heavy 3D spring ──
  const ltDelay  = 20;
  const ltSpring = spring({ frame: Math.max(0, frame - ltDelay), fps, config: { damping: 11, stiffness: 70 } });
  const ltX      = interpolate(ltSpring, [0, 1], [direction === "left" ? -700 : 700, 0]);
  const ltRotY   = interpolate(ltSpring, [0, 1], [direction === "left" ? -45 : 45, 0]);
  const ltScale  = interpolate(ltSpring, [0, 1], [0.7, 1]);

  // Floating bob after settling
  const floatY   = frame > ltDelay + 20 ? Math.sin((frame - ltDelay - 20) * 0.09) * 12 : 0;

  // ── EXIT ──
  const exitStart = 138;
  const exitBlur  = interpolate(frame, [exitStart, 150], [0, 50], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitScale = interpolate(frame, [exitStart, 150], [1, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Typography interactive stagger
  const textDelayStart = ltDelay + 10;
  
  const nameSpring = spring({ frame: Math.max(0, frame - textDelayStart), fps, config: { damping: 12, stiffness: 100 } });
  const nameY = interpolate(nameSpring, [0, 1], [30, 0]);
  const nameOpc = interpolate(frame, [textDelayStart, textDelayStart + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const roleSpring = spring({ frame: Math.max(0, frame - (textDelayStart + 4)), fps, config: { damping: 12, stiffness: 100 } });
  const roleY = interpolate(roleSpring, [0, 1], [30, 0]);
  const roleOpc = interpolate(frame, [textDelayStart + 4, textDelayStart + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const originSpring = spring({ frame: Math.max(0, frame - (textDelayStart + 8)), fps, config: { damping: 12, stiffness: 100 } });
  const originY = interpolate(originSpring, [0, 1], [30, 0]);
  const originOpc = interpolate(frame, [textDelayStart + 8, textDelayStart + 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>

      {/* BACKGROUND: blurred + color-shifted version of same image so no black screen */}
      <AbsoluteFill style={{ filter: "blur(60px) brightness(0.3) saturate(1.8)", transform: "scale(1.2)" }}>
        <img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* Brand color atmospheric wash over the blurred bg */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${themeColor}18 0%, #030308aa 70%)` }} />

      <Scanlines />
      <GlitchOverlay frameIn={0} frameOut={150} color={themeColor} />

      {/* ── MAIN IMAGE PANEL ── */}
      <AbsoluteFill style={{ transform: `scale(${exitScale})`, filter: `blur(${exitBlur}px)`, transformOrigin: "center center" }}>

        {/* RGB SPLIT layers (entry only) */}
        {rgbStrength > 0 && <>
          <div style={{ position: "absolute", inset: 0, opacity: 0.55, mixBlendMode: "screen", filter: "hue-rotate(180deg)", transform: `translateX(${rgbStrength}px)` }}>
            <img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: 0.55, mixBlendMode: "screen", filter: "hue-rotate(-180deg)", transform: `translateX(${-rgbStrength}px)` }}>
            <img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </>}

        {/* Main sharp image with parallax */}
        <div style={{
          position: "absolute", inset: 0,
          transform: `scale(${entryScale * dollyScale}) translateX(${panX}px) translateY(${breathY}px)`,
          transformOrigin: "center center",
          willChange: "transform", backfaceVisibility: "hidden"
        }}>
          <img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        {/* Deep bottom vignette to anchor subject */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "65%",
          background: `linear-gradient(to top, rgba(3,3,8,${vignetteOpacity}) 0%, rgba(3,3,8,0.3) 50%, transparent 100%)`,
          pointerEvents: "none"
        }} />

        {/* Side vignettes */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 90% at 50% 50%, transparent 40%, rgba(3,3,8,0.6) 100%)",
          pointerEvents: "none"
        }} />

        {/* ── LOWER THIRD ── */}
        <div style={{
          position: "absolute",
          bottom: "8%",
          [direction === "left" ? "left" : "right"]: "5%",
          transform: `perspective(900px) translateX(${ltX}px) rotateY(${ltRotY}deg) scale(${ltScale}) translateY(${floatY}px)`,
          transformOrigin: direction === "left" ? "left center" : "right center",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
          zIndex: 10,
        }}>

          {/* GLOW AURA behind the card */}
          <div style={{
            position: "absolute",
            inset: -30,
            background: `radial-gradient(ellipse at center, ${themeColor}40 0%, transparent 70%)`,
            filter: "blur(25px)",
            borderRadius: 40,
          }} />

          {/* THE CARD */}
          <div style={{
            position: "relative",
            background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: `1px solid rgba(255,255,255,0.12)`,
            borderTop: `3px solid ${themeColor}`,
            borderRadius: "24px",
            padding: "32px 56px 28px 56px",
            boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px ${themeColor}30, inset 0 1px 0 rgba(255,255,255,0.1)`,
            display: "flex",
            flexDirection: "column",
            alignItems: direction === "left" ? "flex-start" : "flex-end",
            minWidth: 420,
          }}>

            {/* Theme accent line left or right */}
            <div style={{
              position: "absolute",
              [direction === "left" ? "left" : "right"]: 0,
              top: "15%",
              bottom: "15%",
              width: 5,
              background: `linear-gradient(to bottom, transparent, ${themeColor}, transparent)`,
              borderRadius: 10,
              boxShadow: `0 0 20px ${themeColor}`,
            }} />

            {/* Name */}
            <div style={{ transform: `translateY(${nameY}px)`, opacity: nameOpc, willChange: "transform" }}>
              <h2 style={{
                margin: 0,
                fontSize: 90,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif",
                lineHeight: 1,
                textShadow: `0 0 30px rgba(255,255,255,0.3), 0 8px 30px rgba(0,0,0,0.8)`,
                letterSpacing: direction === "left" ? 2 : -2,
                willChange: "transform", backfaceVisibility: "hidden"
              }}>
                {name}
              </h2>
            </div>

            {/* Separator */}
            <div style={{
              width: "100%",
              height: 2,
              background: `linear-gradient(to right, ${themeColor}, rgba(255,255,255,0.2), transparent)`,
              margin: "12px 0",
            }} />

            {/* Role */}
            <div style={{ transform: `translateY(${roleY}px)`, opacity: roleOpc, willChange: "transform" }}>
              <p style={{
                margin: 0,
                fontSize: 38,
                fontWeight: 900,
                color: themeColor,
                letterSpacing: 6,
                textTransform: "uppercase",
                textShadow: `0 0 60px ${themeColor}, 0 0 25px ${themeColor}cc, 0 0 8px ${themeColor}, 0 6px 20px rgba(0,0,0,1)`,
                willChange: "transform", backfaceVisibility: "hidden"
              }}>
                {role}
              </p>
            </div>

            {/* Origin */}
            <div style={{ transform: `translateY(${originY}px)`, opacity: originOpc, willChange: "transform" }}>
              <p style={{
                margin: "8px 0 0 0",
                fontSize: 34,
                fontWeight: 700,
                color: "rgba(255,255,255,0.95)",
                fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif",
                direction: "rtl",
                textShadow: `0 0 20px rgba(0,0,0,0.9), 0 4px 15px rgba(0,0,0,0.9)`,
                willChange: "transform", backfaceVisibility: "hidden"
              }}>
                {origin}
              </p>
            </div>

          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── 4. BRAND OUTRO ───────────────────────────────────────────────────────────
// Background: bg-circuit.jpeg — dark, technical, already on-brand from robot outros.
// Dual teal + magenta glows unify the two-host identity of this short.
const BrandOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryBlur  = interpolate(frame, [0, 12], [50, 0], { extrapolateRight: "clamp" });
  const bgScale    = 1 + frame * 0.001;
  const tealPulse    = 0.30 + 0.20 * Math.sin(frame * 0.11);
  const magentaPulse = 0.25 + 0.20 * Math.sin(frame * 0.09 + 1.5);

  // Logo spring reveal (Hearts)
  const logoSpring  = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });
  const logoScale   = interpolate(logoSpring, [0, 1], [0, 1.45]);
  const logoOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const logoFloat   = Math.sin(frame * 0.1) * 6;
  const heartLeftX  = interpolate(logoSpring, [0, 1], [-150, 0]);
  const heartRightX = interpolate(logoSpring, [0, 1], [150, 0]);

  // Channel label pop
  const labelStart  = 25;
  const labelSpring = spring({ frame: Math.max(0, frame - labelStart), fps, config: { damping: 11, stiffness: 100 } });
  const labelScale  = interpolate(labelSpring, [0, 1], [0.4, 1]);
  const labelOpacity = interpolate(frame, [labelStart, labelStart + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Separator bar draws left to right
  const lineWidth   = interpolate(frame, [35, 75], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Kinetic slam: Arabic tagline drops from above
  const slam1Start  = 45;
  const slam1Spring = spring({ frame: Math.max(0, frame - slam1Start), fps, config: { damping: 8, stiffness: 180 } });
  const slam1Y      = interpolate(slam1Spring, [0, 1], [-180, 0]);
  const slam1Scl    = interpolate(slam1Spring, [0, 1], [2.0, 1]);
  const slam1Opc    = interpolate(frame, [slam1Start, slam1Start + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Copyright slices from right
  const slam2Start  = 70;
  const slam2Spring = spring({ frame: Math.max(0, frame - slam2Start), fps, config: { damping: 9, stiffness: 140 } });
  const slam2X      = interpolate(slam2Spring, [0, 1], [400, 0]);
  const slam2Opc    = interpolate(frame, [slam2Start, slam2Start + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", filter: `blur(${entryBlur}px)` }}>

      {/* Circuit background */}
      <AbsoluteFill style={{
        backgroundImage: `url(${staticFile("youtube-assets/bg-circuit.jpeg")})`,
        backgroundSize: `cover`,
        backgroundPosition: "center center",
        transform: `scale(${bgScale})`,
        willChange: "transform",
        filter: "contrast(1.5) brightness(0.4) saturate(0.7)",
      }} />
      {/* Teal wash left */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 80% at 15% 50%, rgba(34,211,238,${tealPulse}) 0%, transparent 65%)`, mixBlendMode: "screen" }} />
      {/* Magenta wash right */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 80% at 85% 50%, rgba(236,72,153,${magentaPulse}) 0%, transparent 65%)`, mixBlendMode: "screen" }} />
      {/* Center vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 70% at 50% 50%, transparent 30%, rgba(3,3,8,0.75) 100%)" }} />

      <Scanlines />
      <GlitchOverlay frameIn={0} frameOut={150} color="#22d3ee" />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

        {/* Split Heart Logo (No glass orb, just glowing halo) */}
        <div style={{ 
          transform: `scale(${logoScale}) translateY(${logoFloat}px)`, 
          opacity: logoOpacity, 
          willChange: "transform", 
          marginBottom: 30,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          {/* Subtle Glowing Halo */}
          <div style={{
            position: "absolute",
            width: 250, height: 250, borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(34,211,238,0.3) 0%, rgba(236,72,153,0.2) 50%, transparent 80%)",
            filter: "blur(30px)",
          }} />
          
          <div style={{ position: "relative", width: 180, height: 180 }}>
            <Img src={staticFile("youtube-assets/heart-teal.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", transform: `translateX(${heartLeftX}px)`, filter: "drop-shadow(0 0 25px rgba(34,211,238,0.7))" }} />
            <Img src={staticFile("youtube-assets/heart-pink.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", transform: `translateX(${heartRightX}px)`, filter: "drop-shadow(0 0 25px rgba(236,72,153,0.7))" }} />
          </div>
        </div>

        {/* Channel name */}
        <div style={{ transform: `scale(${labelScale})`, opacity: labelOpacity, display: "flex", flexDirection: "column", alignItems: "center", willChange: "transform", marginTop: 20 }}>
          <h1 style={{
            margin: 0, fontSize: 64, fontWeight: 900, color: "#ffffff",
            letterSpacing: 4, fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif",
            textShadow: "0 0 40px rgba(255,255,255,0.25), 0 8px 30px rgba(0,0,0,0.9)",
            direction: "rtl",
          }}>حرفين ولكن</h1>
          <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 8, textTransform: "uppercase", marginTop: 8 }}>
            <span style={{ color: "#22d3ee", textShadow: "0 0 20px rgba(34,211,238,0.8)", marginRight: 8 }}>A.I.</span>
            <span style={{ color: "#f59e0b", textShadow: "0 0 20px rgba(245,158,11,0.8)" }}>NEWS</span>
          </div>
        </div>

        {/* Animated separator */}
        <div style={{
          width: `${lineWidth}%`, height: 2, margin: "24px 0 20px 0",
          background: "linear-gradient(to right, #22d3ee, rgba(255,255,255,0.6), #ec4899)",
          boxShadow: "0 0 20px rgba(34,211,238,0.6), 0 0 20px rgba(236,72,153,0.6)", borderRadius: 2,
        }} />

        {/* Kinetic slam: tagline */}
        <div style={{ transform: `translateY(${slam1Y}px) scale(${slam1Scl})`, opacity: slam1Opc, transformOrigin: "top center", willChange: "transform", backfaceVisibility: "hidden" }}>
          <p style={{
            margin: 0, fontSize: 44, fontWeight: 900, color: "#ffffff", textAlign: "center",
            fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif",
            textShadow: "0 0 30px rgba(236,72,153,0.6), 0 8px 30px rgba(0,0,0,0.9)", direction: "rtl",
          }}>الذكاء الاصطناعي بلغتنا</p>
        </div>

        {/* Copyright slides from right */}
        <div style={{ transform: `translateX(${slam2X}px)`, opacity: slam2Opc, marginTop: 18, willChange: "transform", backfaceVisibility: "hidden" }}>
          <p style={{
            margin: 0, fontSize: 26, fontWeight: 600, color: "rgba(255,255,255,0.45)",
            fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif", letterSpacing: 1, direction: "rtl",
          }}>جميع الحقوق محفوظة</p>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
