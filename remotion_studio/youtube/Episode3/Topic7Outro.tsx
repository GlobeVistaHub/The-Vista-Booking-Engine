import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate, interpolateColors } from "remotion";
import { NewsChyron } from "./TheHook";

const CYAN = "#00E5CC";
const MAGENTA = "#FF0055";
const RED = "#FF3333";
const GOLD = "#FFBB00";

// ─── EPISODE 2 KINETIC RUBBER BLOCKS (EXACT COPY) ──────────────────────────
const CensorBarText: React.FC<{ text: string; subtext?: string; color: string; align: 'left' | 'right'; targetColor?: string; colorShiftFrame?: number }> = ({ text, subtext, color, align, targetColor, colorShiftFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const leftPos = align === 'left' ? '5%' : '48%';
  const words = text.split(' ');
  const BRAND_LIGHT = '#F5F5F5';
  const BRAND_DARK = '#0A0A0A';
  
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
            // Bell pops exactly when its caption appears at frame 48
            const startFrame = isBell ? 48 : (18 + i * 4);
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
                <h1 style={{ margin: 0, fontSize: 72, fontWeight: 900, color: BRAND_DARK, lineHeight: 1.1, letterSpacing: '-1px', fontFamily: "'Cairo', sans-serif" }}>
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

export const Topic7Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Voiceover beats (16 seconds total)
  const P1 = 68;  // 03:00.04 (Pose 3)
  const P2 = 231; // 03:05.17 (Wide shot)
  const P3 = 373; // 03:10.09 (2 fingers salute / salam)

  const isPose1 = frame < P1;
  const isPose2 = frame >= P1 && frame < P2;
  const isPose3 = frame >= P2 && frame < P3;
  const isPose4 = frame >= P3;

  const mazenImg = isPose1
    ? staticFile("images/episode3/mazen-pose7-pointing down to link.png")
    : isPose2
    ? staticFile("images/episode3/mazen-pose3-scene1.png")
    : isPose3
    ? staticFile("images/episode3/mazen-wide-shot.png")
    : staticFile("images/episode3/mazen-pose9-2 fingers salute.png");

  // Anchor him tight to the right side of the screen
  const anchor: React.CSSProperties = { transform: "translateX(23%)" };

  const cut = (c: number) => frame - c;
  const isCut =
    (cut(P1) >= 0 && cut(P1) < 5) ||
    (cut(P2) >= 0 && cut(P2) < 5) ||
    (cut(P3) >= 0 && cut(P3) < 5);
  const caX = isCut ? (Math.random() - 0.5) * 28 : 0;
  
  // Slow base zoom
  const baseScale = interpolate(frame, [0, 480], [1.0, 1.05], { extrapolateRight: "clamp" });

  // Punchy TikTok snap physics on cuts
  const snap1 = spring({ frame: Math.max(0, frame - P1), fps, config: { damping: 12, stiffness: 220 } });
  const snap2 = spring({ frame: Math.max(0, frame - P2), fps, config: { damping: 12, stiffness: 220 } });
  const snap3 = spring({ frame: Math.max(0, frame - P3), fps, config: { damping: 12, stiffness: 220 } });
  
  const currentSnap = isPose4 ? snap3 : isPose3 ? snap2 : isPose2 ? snap1 : 0;
  const snapPop = isPose1 ? 0 : interpolate(currentSnap, [0, 1], [0.12, 0]);
  const scale = baseScale + snapPop;

  // Sync color tint shifts perfectly with the vocal beats and caption changes
  const dynamicTint = interpolateColors(
    frame,
    [0, 140, 155, 270, 285, 350, 365, 430, 445, 500],
    [RED, RED, CYAN, CYAN, MAGENTA, MAGENTA, GOLD, GOLD, CYAN, CYAN]
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Audio src={staticFile("audio/episode3/mazen-scene7.mp3")} startFrom={0} />

      {/* MAZEN */}
      <AbsoluteFill style={{ zIndex: 110, pointerEvents: "none", ...anchor, width: "100%" }}>
        <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "bottom right", width: "100%", mixBlendMode: "multiply" }}>
          <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom right", filter: "contrast(1.2) brightness(0.95)" }} />
        </AbsoluteFill>
        {isCut && <>
          <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${caX}px)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-50deg) saturate(10)", width: "100%" }}>
            <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom right" }} />
          </AbsoluteFill>
          <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${-caX}px)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-20deg) saturate(10)", width: "100%" }}>
            <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom right" }} />
          </AbsoluteFill>
        </>}
      </AbsoluteFill>

      {/* RED SPIKE BANNER at the start */}
      <NewsChyron
        label="انتظرونا كل اسبوع — كن أول من يعرف"
        source="حرفين ولكن"
        delayFrames={15}
        exitFrame={110}
        isMaskRTL={true}
      />

      {/* PUNCHY KINETIC CAPTIONS - Main blocks stay static, ONLY subtext changes */}
      <CensorBarText
        text="اشترك وفعل الجرس 🔔"
        subtext={(() => {
          if (frame < 150) return "لايك وشير";
          if (frame < 210) return "أي استفسار؟";
          if (frame < 250) return "سيب سؤالك";
          if (frame < 280) return "في التعليقات";
          if (frame < 378) return "او ابعتلنا بريد الكترونى";
          if (frame < 479) return "سنلبى لكم اهتماماتكم فى الحلقات القادمة";
          return "سلام 👋";
        })()}
        color={dynamicTint}
        align="left"
      />
    </AbsoluteFill>
  );
};
