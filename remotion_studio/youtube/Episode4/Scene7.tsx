import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate, interpolateColors, random } from "remotion";

const CYAN = "#00E5CC";
const MAGENTA = "#FF0055";
const RED = "#FF3333";
const GOLD = "#FFBB00";

// ─── KINETIC RUBBER BLOCKS (OUTRO ENGINE) ──────────────────────────
const CensorBarText: React.FC<{ text: string; subtext?: string; color: string; align: 'left' | 'right'; subtextPopFrame?: number }> = ({ text, subtext, color, align, subtextPopFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Anchor to the right half since Mariya is on the left
  const rightPos = align === 'right' ? '5%' : '48%'; 
  const words = text.split(' ');
  const BRAND_LIGHT = '#F5F5F5';
  const BRAND_DARK = '#0A0A0A';
  
  // Color handles the dynamic tint globally now from the parent scene
  const currentBgColor = color;

  return (
    <AbsoluteFill style={{ zIndex: 110, pointerEvents: 'none' }}>
      <div dir="rtl" style={{
        position: 'absolute', right: rightPos, bottom: '15%', width: '48%',
        display: 'flex', flexDirection: 'column', alignItems: align === 'right' ? 'flex-start' : 'flex-end',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: align === 'right' ? 'flex-start' : 'flex-end' }}>
          {words.map((word, i) => {
            const isBell = word.includes('🔔');
            // Base entrance moved to local frame 81 (Global 02:54.02)
            // Bell pops exactly at local frame 129 (Global 02:55.20)
            const startFrame = isBell ? 129 : (81 + i * 4); 
            const springConfig = isBell ? { damping: 12, stiffness: 220 } : { damping: 16, stiffness: 350 };
            
            const wordStamp = spring({ frame: Math.max(0, frame - startFrame), fps, config: springConfig });
            const scaleX = interpolate(wordStamp, [0, 1], [0, 1]);
            const scaleY = isBell ? wordStamp : 1;
            const opacity = interpolate(wordStamp, [0, 0.3, 1], [0, 1, 1]);
            
            return (
              <div key={i} style={{
                display: 'inline-block', backgroundColor: currentBgColor,
                padding: '8px 22px', boxShadow: '12px 16px 20px rgba(0,0,0,0.9)',
                borderRight: `8px solid ${BRAND_LIGHT}`, opacity,
                transform: `scaleX(${isBell ? wordStamp : scaleX}) scaleY(${scaleY}) translateZ(0)`,
                willChange: 'background-color, transform',
                transformOrigin: align === 'right' ? 'right center' : 'left center',
              }}>
                <h1 style={{ margin: 0, fontSize: 72, fontWeight: 900, color: BRAND_DARK, lineHeight: 1.1, letterSpacing: '-1px', fontFamily: "'Cairo', sans-serif" }}>
                  {word}
                </h1>
              </div>
            );
          })}
        </div>
        {subtext && (() => {
          // Use the provided pop frame, or default to the initial load
          const popFrame = subtextPopFrame !== undefined ? subtextPopFrame : (18 + words.length * 4 + 4);
          const subStamp = spring({ frame: Math.max(0, frame - popFrame), fps, config: { damping: 14, stiffness: 280 } });
          const subScale = interpolate(subStamp, [0, 1], [0.8, 1]); // Pop from 80% instead of 0% so it's a punch, not a full entrance
          const subOp = interpolate(subStamp, [0, 0.3, 1], [0, 1, 1]);
          return (
            <div style={{ display: 'block', marginTop: 12, opacity: subOp, transform: `scaleX(${subScale}) translateZ(0)`, willChange: 'transform', transformOrigin: align === 'right' ? 'right center' : 'left center' }}>
              <div style={{
                display: 'inline-block', backgroundColor: BRAND_DARK,
                padding: '5px 16px', boxShadow: '8px 10px 14px rgba(0,0,0,0.85)',
                borderRight: `6px solid ${currentBgColor}`,
                willChange: 'border-color',
              }}>
                <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: BRAND_LIGHT, lineHeight: 1.3, fontFamily: "'Cairo', sans-serif" }}>
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

export const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Voiceover beats (18 seconds total, 540 frames)
  const P1 = 90;  
  const P2 = 259; 
  const P3 = 343; 
  const P4 = 508;

  const isPose1 = frame < P1;
  const isPose2 = frame >= P1 && frame < P2;
  const isPose3 = frame >= P2 && frame < P3;
  const isPose4 = frame >= P3 && frame < P4;
  const isPose5 = frame >= P4;

  const mariyaImg = isPose1
    ? staticFile("images/episode4/scene-7/mariya-pose1-scene7.png")
    : isPose2
    ? staticFile("images/episode4/scene-7/mariya-pose2-scene7.png")
    : isPose3
    ? staticFile("images/episode4/scene-7/mariya-pose3-scene7.png")
    : isPose4
    ? staticFile("images/episode4/scene-7/mariya-pose4-scene7.png")
    : staticFile("images/episode4/scene-7/mariya-pose5-scene7.png");

  // Anchor her tight to the left side of the screen
  const anchor: React.CSSProperties = { transform: "translateX(-15%)" };

  const cut = (c: number) => frame - c;
  const isCut =
    (cut(P1) >= 0 && cut(P1) < 5) ||
    (cut(P2) >= 0 && cut(P2) < 5) ||
    (cut(P3) >= 0 && cut(P3) < 5) ||
    (cut(P4) >= 0 && cut(P4) < 5);
    
  const caX = isCut ? (random(`cax-${frame}`) - 0.5) * 28 : 0;
  
  // Slow base zoom (Restored to 0.92 so she is prominent in the outro)
  const baseScale = interpolate(frame, [0, 540], [0.92, 0.97], { extrapolateRight: "clamp" });

  // Punchy TikTok snap physics on cuts
  const snap1 = spring({ frame: Math.max(0, frame - P1), fps, config: { damping: 12, stiffness: 220 } });
  const snap2 = spring({ frame: Math.max(0, frame - P2), fps, config: { damping: 12, stiffness: 220 } });
  const snap3 = spring({ frame: Math.max(0, frame - P3), fps, config: { damping: 12, stiffness: 220 } });
  const snap4 = spring({ frame: Math.max(0, frame - P4), fps, config: { damping: 12, stiffness: 220 } });
  
  const currentSnap = isPose5 ? snap4 : isPose4 ? snap3 : isPose3 ? snap2 : isPose2 ? snap1 : 0;
  const snapPop = isPose1 ? 0 : interpolate(currentSnap, [0, 1], [0.12, 0]);
  const scale = baseScale + snapPop;

  // By pushing the Magenta towards Fuchsia and the Red towards a fiery Orange-Red, 
  // they will look completely distinct when blended over the background!
  const OUTRO_MAGENTA = "#FF0088"; 
  const OUTRO_RED = "#FF2200";     

  // Sync color tint shifts perfectly with the vocal beats and pose cuts!
  // Sequence: Cyan -> Distinct Magenta -> Gold -> Distinct Red -> Cyan
  const dynamicTint = interpolateColors(
    frame,
    [0, Math.max(0, P1-10), P1, Math.max(0, P2-10), P2, Math.max(0, P3-10), P3, Math.max(0, P4-10), P4],
    [CYAN, CYAN, OUTRO_MAGENTA, OUTRO_MAGENTA, GOLD, GOLD, OUTRO_RED, OUTRO_RED, CYAN]
  );
  
  // Subtext Transcriptive Sync Timestamps (Independent of Poses)
  const T1 = 75;  // "اشترك في القناة، فعل الجرس"
  const T2 = 135; // "لايك لو استفدت حقيقي"
  const T3 = 195; // "وشير مع كل اللي يهمك أمرهم"
  const T4 = 270; // "لو عندك أي سؤال عن الذكاء الاصطناعي"
  const T5 = 350; // "سيبه في التعليقات أو ابعته على الإيميل"
  const T6 = 430; // "وهنناقش أكتر مواضيع طلبتوها"
  const T6B = 474; // "فى الحلقات المقبلة" (Global 03:07.05)
  const T7 = 510; // "سلام 👋"

  // Cleanly calculate subtext text and pop frame before render to avoid React HMR looping on inline IIFEs
  const currentSubtext = frame >= T7 ? "سلام 👋" 
    : frame >= T6B ? "فى الحلقات المقبلة"
    : frame >= T6 ? "وهنناقش أكتر مواضيع طلبتوها" 
    : frame >= T5 ? "سيبه في التعليقات أو ابعته على الإيميل" 
    : frame >= T4 ? "لو عندك أي سؤال عن الذكاء الاصطناعي" 
    : frame >= T3 ? "وشير مع كل اللي يهمك أمرهم" 
    : frame >= T2 ? "لايك لو استفدت حقيقي" 
    : frame >= T1 ? "اشترك في القناة، فعل الجرس" 
    : "عشان تكون دايماً سابق وتفهم اللي بيحصل";
    
  const currentSubtextPopFrame = frame >= T7 ? T7 
    : frame >= T6B ? T6B
    : frame >= T6 ? T6 
    : frame >= T5 ? T5 
    : frame >= T4 ? T4 
    : frame >= T3 ? T3 
    : frame >= T2 ? T2 
    : frame >= T1 ? T1 
    : 40;

  // Cinematic Parallax for the background
  const bgScale = interpolate(frame, [0, 540], [1.1, 1.0], { extrapolateRight: 'clamp' });
  const bgX = interpolate(frame, [0, 540], [0, -30], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#020202', overflow: "hidden" }}>
      <Audio src={staticFile("audio/episode4/scene7/maryia-chunk-scene-7.mp3")} startFrom={0} />

      {/* STUDIO BACKGROUND */}
      <AbsoluteFill style={{ zIndex: 0 }}>
        <img 
            src={staticFile("images/episode4/harfen-studio.jpeg")} 
            style={{ 
                width: "100%", height: "100%", objectFit: "cover", 
                filter: "blur(6px) brightness(0.7)", // Restored natural contrast/saturation
                transform: `scale(${bgScale}) translateX(${bgX}px)`,
                willChange: "transform"
            }} 
        />
        {/* DYNAMIC STUDIO LIGHTING (Episode 3 Parity - Natural Volumetric Glows) 
            Instead of a flat pigmented color, we use massive soft radial gradients 
            to simulate practical studio gel lights shifting dynamically! */}
        <AbsoluteFill style={{ 
            background: `radial-gradient(circle at 85% 15%, ${dynamicTint} 0%, transparent 60%)`,
            mixBlendMode: 'screen', 
            opacity: 0.35, 
            willChange: 'background'
        }} />
        <AbsoluteFill style={{ 
            background: `radial-gradient(circle at 15% 85%, ${dynamicTint} 0%, transparent 70%)`,
            mixBlendMode: 'overlay', 
            opacity: 0.45, 
            willChange: 'background'
        }} />
      </AbsoluteFill>

      {/* MARIYA (LEFT ANCHORED) */}
      <AbsoluteFill style={{ zIndex: 110, pointerEvents: "none", ...anchor, width: "100%" }}>
        <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "bottom left", width: "100%" }}>
          <img src={mariyaImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom left", filter: "drop-shadow(20px 20px 30px rgba(0,0,0,0.8))" }} />
        </AbsoluteFill>
        {isCut && <>
          <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${caX}px)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-50deg) saturate(10)", width: "100%" }}>
            <img src={mariyaImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom left" }} />
          </AbsoluteFill>
          <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${-caX}px)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-20deg) saturate(10)", width: "100%" }}>
            <img src={mariyaImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom left" }} />
          </AbsoluteFill>
        </>}
      </AbsoluteFill>

      {/* PUNCHY KINETIC CAPTIONS - Main blocks stay static, ONLY subtext changes */}
      <CensorBarText
        text="اشترك وفعل الجرس 🔔"
        subtext={currentSubtext}
        color={dynamicTint}
        subtextPopFrame={currentSubtextPopFrame}
        align="right"
      />
      {/* ── GLOBAL TEXTURES & DIORAMA (HALFTONE DOTS) ── */}
      <AbsoluteFill style={{ pointerEvents: "none", zIndex: 900, mixBlendMode: "multiply" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #1a1a1a 1px, transparent 1px)", backgroundSize: "5px 5px", opacity: 0.25 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999, mixBlendMode: "overlay", opacity: 0.05 }}>
        <div style={{ width: "100%", height: "100%", backgroundImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>')` }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
