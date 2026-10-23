import React from "react";
import {
  AbsoluteFill, Audio, Sequence, staticFile,
  useCurrentFrame, useVideoConfig, spring, interpolate, Img, interpolateColors
} from "remotion";
import { ShimmerEdgeBox, TrafficBarChart, CensorBarText } from "./Topic1Google";
import { NewsChyron } from "./TheHook";

const CYAN = "#00E5CC";
const MAGENTA = "#FF0055";
const RED = "#FF3333";

// ─────────────────────────────────────────────────────────────────────────────
// CRT MONITOR COMPONENT FOR SCIENTISTS
// ─────────────────────────────────────────────────────────────────────────────
export const CrtMonitor: React.FC<{ delay: number; exitFrame: number; imgSrc: string; name: string; title: string }> = ({ delay, exitFrame, imgSrc, name, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;
  if (frame > exitFrame + 15) return null; // Unmount after animation

  // Cinematic heavy slide-up (feels like solid glass/metal emerging)
  const enterSlide = spring({ frame: lf, fps, config: { damping: 18, stiffness: 120, mass: 1.2 } });
  
  // Fast slide out
  const exitSlide = spring({ frame: Math.max(0, frame - exitFrame), fps, config: { damping: 18, stiffness: 150 } });
  const finalY = interpolate(enterSlide, [0, 1], [80, 0]) + interpolate(exitSlide, [0, 1], [0, 80]);
  
  const enterOpacity = interpolate(lf, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const exitOpacity = interpolate(exitSlide, [0, 0.8, 1], [1, 0, 0], { extrapolateRight: "clamp" });
  const finalOpacity = enterOpacity * exitOpacity;

  // Slow dramatic zoom on the portrait only
  const imgZoom = 1 + (lf * 0.0015);

  // Typewriter effect for name and title (merging in)
  const nameChars = Math.floor(interpolate(lf, [10, 25], [0, name.length], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }));
  const titleChars = Math.floor(interpolate(lf, [20, 35], [0, title.length], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }));
  
  const nameDisplay = name.substring(0, nameChars) + (nameChars < name.length && nameChars > 0 ? "█" : "");
  const titleDisplay = title.substring(0, titleChars) + (titleChars < title.length && titleChars > 0 ? "█" : "");

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      transform: `translateY(${finalY}px) translateZ(0)`,
      opacity: finalOpacity,
      willChange: "transform, opacity", backfaceVisibility: "hidden", WebkitFontSmoothing: "antialiased"
    }}>
      {/* Monitor Bezel */}
      <div style={{
        width: 220, height: 220, backgroundColor: "#111",
        border: "3px solid #333", borderRadius: 16,
        boxShadow: "0 20px 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.9)",
        position: "relative", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center"
      }}>
        {/* The Portrait (with dramatic slow zoom) */}
        <Img src={staticFile(imgSrc)} style={{
          width: "100%", height: "100%", objectFit: "cover",
          filter: "grayscale(0.6) contrast(1.4) brightness(0.9) sepia(0.3)",
          transform: `scale(${imgZoom})`, transformOrigin: "center center"
        }} />
        
        {/* CRT Scanlines & Vintage Screen Glare (Matched to Golden Era) */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle at center, rgba(255,200,100,0.15) 0%, transparent 60%)",
          mixBlendMode: "screen"
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 3px)"
        }} />
      </div>
      
      {/* Name and Title Plate */}
      <div dir="rtl" style={{
        marginTop: 15, backgroundColor: RED, padding: "10px 24px", borderRadius: 4,
        boxShadow: "0 10px 20px rgba(255,51,51,0.4)", display: "flex", flexDirection: "column", alignItems: "center",
        transform: "translateZ(0)", backfaceVisibility: "hidden", position: "relative"
      }}>
        {/* Invisible placeholders to force the exact final width and prevent jitter */}
        <span style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 900, fontSize: 32, whiteSpace: "nowrap", opacity: 0, pointerEvents: "none" }}>{name}</span>
        <span style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 26, whiteSpace: "nowrap", opacity: 0, pointerEvents: "none" }}>{title}</span>

        {/* Actual animated typing text overlay */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 10 }}>
          <span style={{ color: "#FFF", fontFamily: "'Cairo', sans-serif", fontWeight: 900, fontSize: 32, whiteSpace: "nowrap" }}>{nameDisplay}</span>
          <span style={{ color: "#FFF", fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 26, opacity: 0.95, whiteSpace: "nowrap" }}>{titleDisplay}</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STRAWBERRY TERMINAL (MATH OLYMPIAD)
// ─────────────────────────────────────────────────────────────────────────────
const StrawberryTerminal: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  const exitEnd = exitFrame - delay;
  const exitStart = exitEnd - 12;

  const progress = interpolate(
    lf,
    [0, 12, exitStart, exitEnd],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const scale = interpolate(progress, [0, 1], [0, 1]);

  if (lf > exitEnd) return null;

  const lines = [
    "> تهيئة مشروع Strawberry...",
    "> تجاوز الذكاء البشري...",
    "> حل مسائل الأولمبياد...",
    "> كتابة كود برمجي مستقل..."
  ];

  return (
    <div style={{
      position: "absolute", top: "25%", right: "6%", left: "auto",
      transform: `scale(${scale})`, transformOrigin: "right center", zIndex: 120
    }}>
      <ShimmerEdgeBox width={600} height={320} frameOffset={delay} primaryColor={CYAN} secondaryColor={MAGENTA}>
        {/* Terminal Header */}
        <div style={{ display: "flex", gap: 12, marginBottom: 15, borderBottom: "1px solid rgba(0,0,0,0.1)", paddingBottom: 10, alignItems: "center" }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: RED }} />
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#FFBB00" }} />
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: MAGENTA }} />
          <span style={{ marginLeft: 15, color: "#666", fontSize: 24, fontWeight: "bold" }}>Q*_Strawberry_Node</span>
        </div>

        {/* Terminal Text - Sequential Wipe */}
        <div dir="rtl" style={{ display: "flex", flexDirection: "column" }}>
          {lines.map((line, index) => {
            let lineStart = 10 + (index * 15);
            // Delay the final red line to sync exactly with "Strawberry" at 00:54.17 (global 1637 -> local 304 -> lf 79)
            if (index === 3) {
              lineStart = 79;
            }
            const lineEnd = lineStart + 15;
            const wipe = interpolate(lf, [lineStart, lineEnd], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            
            let content: React.ReactNode = line;
            let outerClipPath = `inset(0 0 0 ${wipe}%)`;
            
            if (index === 0) {
              outerClipPath = "none";
              const arabicWipe = interpolate(lf, [lineStart, lineStart + 8], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
              const englishWipe = interpolate(lf, [lineStart + 8, lineEnd], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
              
              const highlightProg = interpolate(lf, [lineEnd + 5, lineEnd + 35], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
              const currentWeight = interpolate(highlightProg, [0, 1], [800, 900]);
              const currentColor = interpolateColors(highlightProg, [0, 1], ["#111111", RED]);
              const strokeW = interpolate(highlightProg, [0, 1], [4, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
              
              content = (
                <div style={{ position: "relative" }}>
                  <div style={{ visibility: "hidden" }}>{"> تهيئة مشروع Strawberry..."}</div>
                  
                  {/* Arabic (RTL Wipe) */}
                  <div style={{ position: "absolute", top: 0, right: 0, width: "100%", height: "100%", clipPath: `inset(0 0 0 ${arabicWipe}%)` }}>
                    {"> تهيئة مشروع "}
                  </div>
                  
                  {/* English (LTR Wipe) */}
                  <div style={{ position: "absolute", top: 0, right: 0, width: "100%", height: "100%", clipPath: `inset(0 ${englishWipe}% 0 0)` }}>
                    <span style={{ visibility: "hidden" }}>{"> تهيئة مشروع "}</span>
                    <span style={{ 
                      color: currentColor, fontWeight: currentWeight, 
                      display: "inline-block", direction: "ltr",
                      WebkitTextStroke: `${strokeW}px black`
                    }}>
                      Strawberry
                    </span>
                    {"..."}
                  </div>
                </div>
              );
            }

            return (
              <div key={index} style={{
                color: index === lines.length - 1 ? MAGENTA : "#111",
                fontFamily: "'Cairo', sans-serif",
                fontSize: 38,
                lineHeight: 1.5,
                fontWeight: index === lines.length - 1 ? 900 : 800,
                clipPath: outerClipPath,
                textShadow: index === lines.length - 1 ? "0 0 10px rgba(255,0,85,0.4)" : "none"
              }}>
                {content}
              </div>
            );
          })}
        </div>
      </ShimmerEdgeBox>
    </div>
  );
};

const OpenAILogo: React.FC<{ entryFrame: number; exitFrame: number }> = ({ entryFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localF = frame - entryFrame;
  const duration = exitFrame - entryFrame;

  if (localF < 0 || frame > exitFrame) return null;

  // Episode 2 style Hard Stamp In
  const stamp = spring({ frame: localF, fps, config: { damping: 20, stiffness: 260 } });
  
  // Glitch Decay Logic (matches Google / SaaS+Search decay in Scene 1)
  const glitchIntensity = interpolate(localF, [0, duration - 60, duration - 20, duration], [0, 0, 0.15, 1.0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  
  // Logo Decay Glitch: High-end color split during decay. 2-frame step for kinetic energy, heavy amplitude for compression survival.
  const steppedFrame = Math.floor(frame / 2);

  const jitterX = Math.sin(steppedFrame * 22) * 60 * glitchIntensity;
  const jitterY = Math.cos(steppedFrame * 27) * 20 * glitchIntensity;
  const glitchScale = 1 + (Math.sin(steppedFrame * 12) * 0.15 * glitchIntensity);

  // Aggressive scale + rotation slam
  const enterScale = interpolate(stamp, [0, 1], [0, 1]);
  const rotation = 8; // Signature Ep 2 tilted slam
  
  // Fade out
  const opacityStamp = interpolate(stamp, [0, 0.4, 1], [0, 1, 1]);
  const fadeOut = interpolate(localF, [duration - 15, duration], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const finalOpacity = opacityStamp * fadeOut;
  
  // Turns Magenta/Red as it decays
  const colorTint = interpolate(localF, [duration - 30, duration], [0, 0.8], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const maskStyle: React.CSSProperties = {
    position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
    maskImage: `url(${staticFile("logos/openai.svg")})`,
    WebkitMaskImage: `url(${staticFile("logos/openai.svg")})`,
    maskSize: "contain", WebkitMaskSize: "contain",
    maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat",
    mixBlendMode: "screen",
  };

  return (
    <AbsoluteFill style={{ zIndex: 110, pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{
        position: "absolute",
        right: "14%",
        top: "45%",
        width: 260, height: 260,
        opacity: finalOpacity,
        filter: "drop-shadow(3px 5px 6px rgba(0,0,0,0.7))",
        transform: `translateY(-50%) scale(${enterScale * glitchScale}) rotate(${rotation}deg)`,
        transformOrigin: "center center",
      }}>
        {/* Base Logo */}
        <img src={staticFile("logos/openai.svg")} style={{ position: "absolute", width: "100%", height: "100%" }} />
        
        {/* Magenta Decay Tint */}
        <div style={{
          ...maskStyle,
          backgroundColor: "#FF0055",
          opacity: colorTint,
          mixBlendMode: "color"
        }} />

        {/* Pink Ghost CA */}
        <div style={{
          ...maskStyle,
          backgroundColor: "#ec4899",
          transform: `translateX(${jitterX}px) translateY(${jitterY}px)`,
          opacity: glitchIntensity * 0.7
        }} />

        {/* Cyan Ghost CA */}
        <div style={{
          ...maskStyle,
          backgroundColor: "#22d3ee",
          transform: `translateX(${-jitterX}px) translateY(${-jitterY}px)`,
          opacity: glitchIntensity * 0.7
        }} />

        {/* Localized Noise Grain (Analog Degradation) */}
        <div style={{
          ...maskStyle,
          backgroundImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>')`,
          opacity: glitchIntensity * 0.5, // Fades in with the glitch
          mixBlendMode: "overlay"
        }} />
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCENE 2: TOPIC 2 (MARIYA - OPENAI REBELLION)
// ─────────────────────────────────────────────────────────────────────────────
export const Topic2Strawberry: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pacing / Poses
  // Total Scene Duration = 810 frames
  const pose1End = 180; // "ironic"
  const pose2End = 360; // "suspenseful / shh"
  const pose3End = 583; // "authoritative" -> Delays the "angry" pose to 01:03.08
  const pose4End = 810; // "anxious / aggressive"

  const isPose1 = frame >= 0 && frame < pose1End;
  const isPose2 = frame >= pose1End && frame < pose2End;
  const isPose3 = frame >= pose2End && frame < pose3End;
  const isPose4 = frame >= pose3End;

  const pose3bStart = 450; // Switches back to "open hands" (pose1) @ 00:58.25

  const mariyaImg = isPose1
    ? staticFile("images/episode3/mariya-pose1-scene2.png")
    : isPose2
      ? staticFile("images/episode3/mariya-pose2-scene2.png")
      : isPose3
        ? (frame >= pose3bStart ? staticFile("images/episode3/mariya-pose1-scene2.png") : staticFile("images/episode3/mariya-pose3-scene2.png"))
        : staticFile("images/episode3/mariya-pose4-scene2.png");

  // At 00:49.25 (pose1End), she switches to "shh". We slide her a touch to the LEFT (-5%).
  const slidePose2LeftSpring = spring({ frame: frame - pose1End, fps, config: { damping: 16 } });

  // Cinematic Slide: Mariya starts on the LEFT (left: "-5%"). 
  // She slides RIGHT (+33%) exactly at 00:56.00 (local 365) to make room for charts.
  const slideRightSpring = spring({ frame: frame - 365, fps, config: { damping: 16 } });
  
  // At 00:58.25 (pose3bStart), she throws her hands open. 
  // We slide her slightly back LEFT (-12%) so her right hand doesn't get chopped off by the right edge.
  const slideLeftSpring = spring({ frame: frame - pose3bStart, fps, config: { damping: 16 } });
  
  // At 01:03.08 (pose3End), she switches to angry pose (Pose 4). 
  // We push her further to the LEFT (-25%) as requested to make room on the right.
  const finalSlideLeftSpring = spring({ frame: frame - pose3End, fps, config: { damping: 16 } });

  const xOffsetNum = 
    - interpolate(slidePose2LeftSpring, [0, 1], [0, 3.5])
    + interpolate(slideRightSpring, [0, 1], [0, 33]) 
    - interpolate(slideLeftSpring, [0, 1], [0, 12])
    - interpolate(finalSlideLeftSpring, [0, 1], [0, 25]);
    
  const xOffset = `${xOffsetNum}%`;
  
  // Chromatic Aberration Burst on Pose Cuts
  const getCutProgress = (c: number) => frame - c;
  // THE FIX: >= 0 ensures it triggers on frame 0, spanning exactly 5 full frames (0,1,2,3,4)
  const isCutBurst = 
    (getCutProgress(pose1End) >= 0 && getCutProgress(pose1End) < 5) ||
    (getCutProgress(pose2End) >= 0 && getCutProgress(pose2End) < 5) ||
    (getCutProgress(pose3bStart) >= 0 && getCutProgress(pose3bStart) < 5) ||
    (getCutProgress(pose3End) >= 0 && getCutProgress(pose3End) < 5);

  // RESTORING KINETIC VIOLENCE: Step every 2 frames, but massive 80px amplitude so it survives compression and feels like a real tear.
  const burstSeed = Math.floor(frame / 2) * 45.2;
  const caX = isCutBurst ? (Math.sin(burstSeed) * 80) : 0;
  const scale = interpolate(frame, [0, 1000], [1.0, 1.05], { extrapolateRight: "clamp" });
  
  // Scientists Entrance (Appears during pose4)
  const scientistsDelay = pose3End + 15; // 555

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Audio src={staticFile("audio/episode3/mariya-scene2.mp3")} />

      {/* BACKGROUND ELEMENTS */}
      <OpenAILogo entryFrame={87} exitFrame={154} />

      {/* MARIYA PRESENTER */}
      <AbsoluteFill style={{ zIndex: 110, pointerEvents: "none", left: "-5%", right: "auto", width: "100%", transform: `translateX(${xOffset})` }}>
        <AbsoluteFill style={{
          transform: `scale(${scale})`, transformOrigin: "bottom left",
          left: "-5%", right: "auto", width: "100%", mixBlendMode: "multiply"
        }}>
          <img src={mariyaImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom left", filter: `contrast(1.2) brightness(0.95)` }} />
        </AbsoluteFill>

        {isCutBurst && (
          <>
            <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${caX}px)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-50deg) saturate(10)", left: "-5%", right: "auto", width: "100%" }}>
              <img src={mariyaImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom left" }} />
            </AbsoluteFill>
            <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${-caX}px)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-20deg) saturate(10)", left: "-5%", right: "auto", width: "100%" }}>
              <img src={mariyaImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom left" }} />
            </AbsoluteFill>
          </>
        )}
      </AbsoluteFill>

      {/* CHYRON */}
      <NewsChyron label="مشروع سرّي" source="تمرد OpenAI" delayFrames={15} exitFrame={113} isMaskRTL={true} />

      {/* UI ELEMENTS */}
      
      {/* 1. Strawberry Terminal (Visible during poses 2 and 3) */}
      <StrawberryTerminal delay={pose1End + 45} exitFrame={366} />
      
      {/* 2. Math Olympiad Meter Bars (Decoupled from pose timing) */}
      {frame >= 385 && frame < 540 && (
        <AbsoluteFill style={{ zIndex: 120 }}>
          <TrafficBarChart delay={385} exitFrame={528} data={[
            { label: 'أداء الذكاء البشري', start: 100, end: 12, color: "#666", labelColor: '#FFF' },
            { label: 'مشروع Strawberry', start: 0, end: 98, color: MAGENTA, labelColor: '#FFF', highlight: true }
          ]} />
        </AbsoluteFill>
      )}

      {/* 3. Rubber Chyron (Censor Bar) */}
      <CensorBarText text="فقدان السيطرة" subtext="تحذير داخلي (OpenAI)" color={RED} align="right" delay={747} exitFrame={1500} />

      {/* 4. The 3 Resigned Scientists (Visible during pose 4) */}
      <div style={{
        position: "absolute", top: "25%", right: "5%", zIndex: 120,
        display: "flex", gap: 30
      }}>
        <CrtMonitor delay={scientistsDelay} exitFrame={1500} imgSrc="images/episode3/scientist1.png" name="إيليا سوتسكيفر" title="كبير العلماء" />
        <CrtMonitor delay={scientistsDelay + 6} exitFrame={1500} imgSrc="images/episode3/scientist2.png" name="جان لايكه" title="قائد فريق الأمان" />
        <CrtMonitor delay={scientistsDelay + 12} exitFrame={1500} imgSrc="images/episode3/scientist3.png" name="جون شولمان" title="شريك مؤسس" />
      </div>

    </AbsoluteFill>
  );
};
