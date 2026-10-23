import React from "react";
import {
  AbsoluteFill, Audio, Sequence, staticFile,
  useCurrentFrame, useVideoConfig, spring, interpolate, interpolateColors, Video
} from "remotion";
import { NewsChyron } from "./TheHook";
import { AnamorphicWhipPan } from "./AnamorphicWhipPan";

const CYAN = "#00E5CC";
const MAGENTA = "#FF0055";
const RED = "#FF3333";

// ─────────────────────────────────────────────────────────────────────────────
// TIMING CONSTANTS (frames relative to Topic1Google mount)
// ─────────────────────────────────────────────────────────────────────────────
const TORN_PAPER_START = 105;
const STUDIO_START = 105; // Matches tear start so it reveals the studio immediately
const GOLDEN_ERA_END = 145; // Extended to ensure it fully clears the screen before unmounting

// ─── GOLDEN ERA B-ROLL (Nostalgic Google Era) ───────────────────────────────
const GoldenEra: React.FC = () => {
  const frame = useCurrentFrame();
  const videoScale = interpolate(frame, [0, 120], [1.02, 1.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const logoX = interpolate(frame, [0, 120], [0, -30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoY = interpolate(frame, [0, 120], [0, -15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${videoScale})`, transformOrigin: "center center" }}>
        <Video
          src={staticFile("video/episode3/google-golden-era.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.1) brightness(1.1) sepia(0.2)" }}
        />
      </AbsoluteFill>

      {/* Vintage Glow & Film Grain */}
      <AbsoluteFill style={{
        backgroundImage: "radial-gradient(circle at center, rgba(255,200,100,0.15) 0%, transparent 60%)",
        mixBlendMode: "screen", pointerEvents: "none"
      }} />
      <AbsoluteFill style={{
        backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 3px)",
        pointerEvents: "none"
      }} />

      {/* Film Damage / Rusting Spillage at Edges */}
      <AbsoluteFill style={{ pointerEvents: "none", zIndex: 5 }}>
        {/* Top Right Rust */}
        <div style={{
          position: "absolute", top: "-5%", right: "-5%", width: "40%", height: "30%",
          background: "radial-gradient(ellipse at top right, rgba(139, 69, 19, 0.8) 0%, rgba(205, 92, 92, 0.4) 40%, transparent 70%)",
          filter: "blur(20px)", mixBlendMode: "multiply"
        }} />
        {/* Bottom Left Spill */}
        <div style={{
          position: "absolute", bottom: "-10%", left: "-5%", width: "50%", height: "40%",
          background: "radial-gradient(ellipse at bottom left, rgba(160, 82, 45, 0.7) 0%, rgba(139, 0, 0, 0.3) 50%, transparent 80%)",
          filter: "blur(25px)", mixBlendMode: "color-burn"
        }} />
        {/* Top Left Minor Burn */}
        <div style={{
          position: "absolute", top: "-2%", left: "-2%", width: "25%", height: "20%",
          background: "radial-gradient(circle at top left, rgba(210, 105, 30, 0.6) 0%, transparent 70%)",
          filter: "blur(15px)", mixBlendMode: "multiply"
        }} />
      </AbsoluteFill>

      {/* GOOGLE CLASSIC WORDMARK */}
      <AbsoluteFill style={{ pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `translate(${logoX}px, calc(-25% + ${logoY}px))` }}>
          <h1 style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 260, fontWeight: "bold", letterSpacing: "-14px", margin: 0,
            textShadow: "0px 20px 60px rgba(0,0,0,0.8)",
          }}>
            <span style={{ color: "#4285F4" }}>G</span>
            <span style={{ color: "#EA4335" }}>o</span>
            <span style={{ color: "#FBBC05" }}>o</span>
            <span style={{ color: "#4285F4" }}>g</span>
            <span style={{ color: "#34A853" }}>l</span>
            <span style={{ color: "#EA4335" }}>e</span>
          </h1>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};


// ─── SHIMMERING PREMIUM EDGE BOX (Vox Style - Restored) ──────────────────────────────
export const ShimmerEdgeBox: React.FC<{
  children: React.ReactNode; width: number; height: number;
  frameOffset: number; padding?: string;
  primaryColor?: string; secondaryColor?: string;
}> = ({ children, width, height, frameOffset, padding = "20px 25px", primaryColor = CYAN, secondaryColor = MAGENTA }) => {
  const frame = useCurrentFrame();
  const perimeter = (width + height) * 2;
  const dashOffset = (frame - frameOffset) * -15;

  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, overflow: "visible", zIndex: 0 }}>
        {/* Glow Trace Primary */}
        <rect x="1" y="1" width={width - 2} height={height - 2} rx="16" ry="16" fill="none"
          stroke={primaryColor} strokeWidth="4" strokeDasharray={`${perimeter * 0.15} ${perimeter * 0.85}`} strokeDashoffset={dashOffset}
          style={{ filter: `drop-shadow(0px 0px 8px ${primaryColor})` }} />
        {/* Glow Trace Secondary — same speed, 50% offset so they never overlap */}
        <rect x="1" y="1" width={width - 2} height={height - 2} rx="16" ry="16" fill="none"
          stroke={secondaryColor} strokeWidth="4" strokeDasharray={`${perimeter * 0.15} ${perimeter * 0.85}`} strokeDashoffset={dashOffset + (perimeter * 0.5)}
          style={{ filter: `drop-shadow(0px 0px 8px ${secondaryColor})` }} />
      </svg>

      {/* Bright, Readable Vox-Style Box (Restored Off-White) */}
      <div style={{
        position: "absolute", inset: 3,
        backgroundColor: "#F8F9FA", // Premium Off-White
        borderRadius: 14, boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        zIndex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding
      }}>
        {children}
      </div>
    </div>
  );
};

// ─── TRAFFIC BAR CHART (Organic vs AI) ─────────────────────────────────────
export const TrafficBarChart: React.FC<{ delay: number; exitFrame?: number; data?: any[], containerStyle?: React.CSSProperties }> = ({ delay, exitFrame, data: overrideData, containerStyle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  // Optional Exit Animation (12 frame collapse)
  const exitDuration = 12;
  const exitStart = exitFrame ? exitFrame - delay - exitDuration : 999999;
  const exitProgress = interpolate(
    lf,
    [exitStart, exitStart + exitDuration],
    [1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  if (exitFrame && lf > exitStart + exitDuration) return null;

  const defaultData = [
    { label: 'الزيارات العضوية (Organic)', start: 100, end: 25, color: MAGENTA, labelColor: '#FFF' },
    { label: 'إجابات AI المباشرة', start: 0, end: 85, color: CYAN, labelColor: '#FFF', highlight: true }
  ];

  const data = overrideData || defaultData;

  return (
    <AbsoluteFill style={{ zIndex: 120, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', left: '8%', top: '35%',
        display: 'flex', flexDirection: 'column', gap: 40, width: 650,
        ...containerStyle
      }}>
        {data.map((item, i) => {
          // 1. Stamp in the bars
          const enterProgress = spring({ frame: lf - (i * 8), fps, config: { damping: 20, stiffness: 220 } });

          // 2. Start the aggressive deterioration shortly after they are steady
          const shiftProgress = spring({ frame: lf - 45 - (i * 5), fps, config: { damping: 14, stiffness: 90 } });

          const currentWidth = interpolate(shiftProgress, [0, 1], [item.start, item.end]);
          const currentVal = Math.floor(currentWidth);

          // Organic starts white when "normal", turns magenta as it decays
          const currentColor = item.label.includes('Organic')
            ? interpolateColors(shiftProgress, [0, 1], ["#FFFFFF", MAGENTA])
            : item.color;

          return (
            <div key={item.label} style={{
              display: 'flex', flexDirection: 'column', gap: 15,
              opacity: enterProgress * exitProgress
            }}>
              <div dir="rtl" style={{
                display: 'flex', justifyContent: 'space-between', color: item.labelColor, fontSize: 38, fontWeight: 900, fontFamily: "'Cairo', sans-serif", textShadow: '0 4px 15px rgba(0,0,0,0.95), 0 2px 5px rgba(0,0,0,1), 0 0 15px rgba(0,0,0,0.8)',
                clipPath: `inset(0 0 ${100 - (enterProgress * exitProgress * 100)}% 0)`
              }}>
                <span>{item.label}</span>
                <span style={{ color: currentColor }}>{currentVal}%</span>
              </div>
              <div style={{
                width: '100%', height: 45, backgroundColor: 'rgba(10,10,10,0.85)',
                border: `1px solid ${currentColor}`, boxShadow: '12px 16px 25px rgba(0,0,0,0.95)',
                transform: `scaleY(${enterProgress * exitProgress})`,
                transformOrigin: 'top center'
              }}>
                <div style={{
                  width: `${currentWidth}%`, height: '100%',
                  backgroundColor: currentColor,
                  boxShadow: item.highlight ? `0 0 35px ${currentColor}` : 'none'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── SAAS + SEARCH DECAY COMPONENT ───────────────────────────────────────────
const SaasSearchDecay: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;

  if (lf < 0) return null;

  const duration = 116;

  const stampIn = spring({ frame: lf, fps, config: { damping: 30, stiffness: 200 } });
  
  // Sped up intensity so it peaks earlier before transition
  const glitchIntensity = interpolate(lf, [0, 20, 50, duration - 15], [0, 0, 0.15, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const steppedFrame = Math.floor(frame / 2);
  
  // Physical shake on the entire component
  const jitterX = Math.sin(steppedFrame * 22) * 50 * glitchIntensity;
  const jitterY = Math.cos(steppedFrame * 27) * 15 * glitchIntensity;
  const glitchScale = 1 + (Math.sin(steppedFrame * 12) * 0.1 * glitchIntensity);

  // Fades out completely 15 frames earlier so there is no trace during transition
  const fadeOut = interpolate(lf, [duration - 35, duration - 15], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const redTint = interpolate(lf, [duration - 45, duration - 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Pure Base Component with internal color shifting
  const BaseComponent = (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      color: interpolateColors(redTint, [0, 1], ["#FFF", "#FF1111"]),
      fontSize: 36, fontWeight: 900,
      textShadow: redTint > 0.5 ? "0px 10px 25px rgba(255,0,0,0.9), 0px 0px 15px rgba(255,0,0,0.5)" : "0px 10px 25px rgba(0,0,0,0.9), 0px 0px 15px rgba(0,0,0,0.5)",
      whiteSpace: "nowrap",
      position: "relative"
    }}>
      SaaS <span style={{ color: interpolateColors(redTint, [0, 1], [CYAN, "#FF1111"]), margin: "0 10px" }}>+</span> SEARCH
    </div>
  );

  return (
    <AbsoluteFill style={{ zIndex: 120, pointerEvents: "none" }}>
      <div style={{
        position: "absolute",
        left: "8%",
        top: "63%",
        opacity: fadeOut,
        transform: `scale(${stampIn * glitchScale}) translateX(${jitterX}px) translateY(${jitterY}px) translateZ(0)`,
        transformOrigin: "left center",
        willChange: "transform, opacity",
        filter: glitchIntensity > 0.2 ? `saturate(${1 + glitchIntensity * 5}) contrast(${1 + glitchIntensity})` : "none"
      }}>
        {/* We ONLY render the BaseComponent, no layered color ghosting at all */}
        {BaseComponent}

        {/* Physical tearing on the same layer (creates hard cuts without phase ghosting) */}
        {glitchIntensity > 0.1 && (
          <div style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            transform: `translateX(${Math.sin(steppedFrame * 44) * 40 * glitchIntensity}px)`,
            clipPath: `inset(${20 + Math.sin(steppedFrame * 31)*20}% 0 ${60 + Math.cos(steppedFrame * 19)*20}% 0)`
          }}>
            {BaseComponent}
          </div>
        )}
        
        {glitchIntensity > 0.1 && (
          <div style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            transform: `translateX(${Math.cos(steppedFrame * 24) * -40 * glitchIntensity}px)`,
            clipPath: `inset(${60 + Math.cos(steppedFrame * 43)*20}% 0 ${10 + Math.sin(steppedFrame * 27)*20}% 0)`
          }}>
            {BaseComponent}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─── TERMINAL TYPING (SearchGPT Mimic - Left Side) ──────────────────────────
const TerminalTyping: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  // Global 00:17.17 (Frame 527) -> StudioScene Local Frame 224
  const exitStart = 224 - delay;

  // Fast pop-in scale (ChatGPT's original format)
  const progress = interpolate(
    lf,
    [0, 12, exitStart, exitStart + 12],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const scale = interpolate(progress, [0, 1], [0, 1]);

  if (lf > exitStart + 12) return null;

  const lines = [
    "> تهيئة محرك SearchGPT...",
    "> تخطي فهرس جوجل...",
    "> سحب الزيارات: نشط",
    "> تحذير: تراجع البحث التقليدي"
  ];

  return (
    <div style={{
      position: "absolute", top: "12%", left: "6%",
      transform: `scale(${scale})`, transformOrigin: "left center", zIndex: 120
    }}>
      <ShimmerEdgeBox width={600} height={320} frameOffset={delay}>
        {/* Terminal Header */}
        <div style={{ display: "flex", gap: 12, marginBottom: 15, borderBottom: "1px solid rgba(0,0,0,0.1)", paddingBottom: 10, alignItems: "center" }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: RED }} />
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#FFBB00" }} />
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: CYAN }} />
          <span style={{ marginLeft: 15, color: "#666", fontSize: 24, fontWeight: "bold" }}>SearchGPT_Kernel</span>
        </div>

        {/* Terminal Text - Sequential Wipe (NO LIGATURE JITTER) */}
        <div dir="rtl" style={{ display: "flex", flexDirection: "column" }}>
          {lines.map((line, index) => {
            // Stagger the start time for each line. Each line takes 15 frames to type.
            const lineStart = 10 + (index * 15);
            const lineEnd = lineStart + 15;
            const wipe = interpolate(lf, [lineStart, lineEnd], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

            let content: React.ReactNode = line;
            if (index === 0) {
              content = (
                <>
                  {"> تهيئة محرك "}
                  <span style={{ direction: "ltr", display: "inline-block", clipPath: `inset(0 ${interpolate(frame, [85, 100], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}% 0 0)` }}>SearchGPT</span>
                  {"..."}
                </>
              );
            }

            if (index === 3) {
              content = (
                <>
                  <span style={{ color: RED }}>{"> تحذير:"}</span>
                  <span style={{ color: CYAN }}>{" تراجع البحث التقليدي"}</span>
                </>
              );
            }

            return (
              <div key={index} style={{
                fontWeight: "900", color: "#111",
                fontFamily: "'Cairo', sans-serif", fontSize: 38, lineHeight: 1.5,
                clipPath: `inset(0 0 0 ${wipe}%)`
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

// ─── SEARCH BOX (Perplexity Mimic - Left Side) ──────────────────────────────
const SearchBox: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  // Global 00:17.17 (Frame 527) -> StudioScene Local Frame 224 + 5 frames stagger
  const exitStart = 229 - delay;

  // Fast pop-in scale (Following ChatGPT's exact format)
  const progress = interpolate(
    lf,
    [0, 12, exitStart, exitStart + 12],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const scale = interpolate(progress, [0, 1], [0, 1]);

  if (lf > exitStart + 12) return null;

  const query = "Perplexity: إجابات مباشرة بدون روابط";
  // ClipPath reveal for Arabic typing (NO LIGATURE JITTER)
  const wipeProgress = interpolate(lf, [5, 45], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div style={{
      position: "absolute", top: "45%", left: "6%",
      transform: `scale(${scale})`, transformOrigin: "left center",
      zIndex: 120
    }}>
      <ShimmerEdgeBox width={650} height={100} frameOffset={delay} padding="0 25px">
        <div style={{ display: "flex", alignItems: "center", gap: 20, width: "100%", height: "100%", justifyContent: "flex-end" }} dir="rtl">
          <div style={{
            color: "#111", fontFamily: "'Cairo', sans-serif", fontSize: 32, fontWeight: "900", opacity: 0.9,
            clipPath: `inset(0 0 0 ${wipeProgress}%)`,
            display: "flex", gap: "8px", alignItems: "center"
          }}>
            <span style={{ direction: "ltr", display: "inline-block", clipPath: `inset(0 ${interpolate(frame, [124, 139], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}% 0 0)` }}>Perplexity</span>
            <span>: إجابات مباشرة بدون روابط</span>
          </div>
          <div style={{ color: CYAN, fontSize: 36, transform: `rotate(${frame * 3}deg)` }}>✦</div>
        </div>
      </ShimmerEdgeBox>
    </div>
  );
};

// ─── GARTNER REPORT (Left Side, Replaces ChatGPT) ─────────────────────────
const GartnerReport: React.FC<{ delay: number; exitFrame?: number }> = ({ delay, exitFrame = 9999 }) => {
  const frame = useCurrentFrame();
  const lf = frame - delay;
  if (lf < 0) return null;

  const progress = interpolate(
    lf,
    [0, 12, exitFrame - delay, exitFrame - delay + 12],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const scale = interpolate(progress, [0, 1], [0, 1]);

  if (frame > exitFrame + 12) return null;

  return (
    <div style={{
      position: "absolute", top: "25%", left: "6%",
      transform: `scale(${scale})`, transformOrigin: "left center", zIndex: 120
    }}>
      <ShimmerEdgeBox width={550} height={160} frameOffset={delay} padding="25px 30px">
        <h3 dir="rtl" style={{ margin: 0, color: "#111", fontFamily: "'Cairo', sans-serif", fontSize: 28, marginBottom: 5, fontWeight: "900" }}>تقرير Gartner (2026)</h3>
        <div dir="rtl" style={{ color: RED, fontFamily: "'Cairo', sans-serif", fontSize: 42, fontWeight: "900" }}>
          -25% <span style={{ color: "#555", fontSize: 24, fontWeight: "bold" }}>حجم البحث التقليدي</span>
        </div>
      </ShimmerEdgeBox>
    </div>
  );
};

// ─── STACKOVERFLOW CHART (Left Side, Middle of video) ──────────────────────
const StackOverflowChart: React.FC<{ delay: number; exitFrame?: number }> = ({ delay, exitFrame = 9999 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  if (frame > exitFrame + 30) return null;

  const enterScale = interpolate(lf, [0, 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const exitSpring = spring({ frame: frame - exitFrame, fps, config: { damping: 14 } });
  const exitScale = interpolate(exitSpring, [0, 1], [1, 0]);
  const currentScale = Math.max(0, enterScale * exitScale);

  // Keep the drop animation fluid
  const drop = spring({ frame: lf - 20, fps, config: { damping: 14 } });
  const height = interpolate(drop, [0, 1], [160, 40]);
  const dropValue = Math.floor(interpolate(drop, [0, 1], [0, -35]));

  return (
    <div style={{
      position: "absolute", top: "12%", right: "6%",
      transform: `scale(${currentScale})`, transformOrigin: "bottom right", zIndex: 120
    }}>
      <ShimmerEdgeBox width={550} height={260} frameOffset={delay} primaryColor={CYAN} secondaryColor={MAGENTA} padding="20px 30px">
        <div style={{ backgroundColor: "rgba(20,10,10,0.95)", position: "absolute", inset: 3, borderRadius: 14 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h3 dir="rtl" style={{ margin: 0, color: "#FFF", fontFamily: "'Cairo', sans-serif", fontSize: 32, marginBottom: 10, textAlign: "right", fontWeight: "900" }}>زيارات StackOverflow (2026)</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 30, height: 160, borderBottom: "2px solid #444" }}>
            <div style={{ width: 100, height: 140, backgroundColor: "#444", borderRadius: "4px 4px 0 0" }} />
            <div style={{ width: 100, height: 150, backgroundColor: "#444", borderRadius: "4px 4px 0 0" }} />
            <div style={{
              width: 100, height, backgroundColor: RED, borderRadius: "4px 4px 0 0", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: 10, overflow: "hidden",
              boxShadow: `0 0 20px rgba(255,51,51,0.6)`
            }}>
              <span style={{ color: "#FFF", fontWeight: "bold", fontSize: 28 }}>{dropValue}%</span>
            </div>
          </div>
        </div>
      </ShimmerEdgeBox>
    </div>
  );
};
export const CensorBarText: React.FC<{ text: string; subtext?: string; color: string; align: 'left' | 'right'; delay: number; exitFrame?: number }> = ({ text, subtext, color, align, delay, exitFrame = 9999 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const leftPos = align === 'left' ? '5%' : '48%';
  const words = text.split(' ');

  if (frame > exitFrame + 30) return null;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      zIndex: 110, pointerEvents: 'none'
    }}>
      <div dir="rtl" style={{
        position: 'absolute', left: leftPos, bottom: '12%', width: '48%',
        display: 'flex', flexDirection: 'column', alignItems: align === 'left' ? 'flex-end' : 'flex-start',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: align === 'left' ? 'flex-end' : 'flex-start' }}>
          {words.map((word, i) => {
            const startFrame = delay + (i * 4);
            const wordStamp = spring({ frame: frame - startFrame, fps, config: { damping: 16, stiffness: 350 } });

            const reverseIndex = words.length - 1 - i;
            const exitStartFrame = exitFrame + 4 + (reverseIndex * 4);
            const wordExit = spring({ frame: frame - exitStartFrame, fps, config: { damping: 16, stiffness: 350 } });

            const scaleX = interpolate(wordStamp, [0, 1], [0, 1], { extrapolateLeft: "clamp" }) - interpolate(wordExit, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
            const opacity = interpolate(wordStamp, [0, 0.3, 1], [0, 1, 1], { extrapolateLeft: "clamp" }) - interpolate(wordExit, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

            return (
              <div key={i} style={{
                display: 'inline-block', backgroundColor: color,
                padding: '8px 22px', boxShadow: '12px 16px 20px rgba(0,0,0,0.9)',
                borderLeft: `8px solid #F5F5F5`, opacity: Math.max(0, opacity),
                transform: `scaleX(${Math.max(0, scaleX)}) translateZ(0)`,
                willChange: 'transform',
                backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased',
                transformOrigin: align === 'right' ? 'left center' : 'right center',
              }}>
                <h1 style={{ margin: 0, fontSize: 72, fontWeight: 900, color: '#0A0A0A', lineHeight: 1.1, letterSpacing: '-1px', fontFamily: "'Cairo', sans-serif" }}>
                  {word}
                </h1>
              </div>
            );
          })}
        </div>
        {subtext && (() => {
          const subStamp = spring({ frame: frame - (delay + words.length * 4 + 4), fps, config: { damping: 20, stiffness: 300 } });
          const subExit = spring({ frame: frame - exitFrame, fps, config: { damping: 20, stiffness: 300 } });

          const subScale = interpolate(subStamp, [0, 1], [0, 1], { extrapolateLeft: "clamp" }) - interpolate(subExit, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
          const subOp = interpolate(subStamp, [0, 0.3, 1], [0, 1, 1], { extrapolateLeft: "clamp" }) - interpolate(subExit, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

          return (
            <div style={{ display: 'block', marginTop: 12, opacity: Math.max(0, subOp), transform: `scaleX(${Math.max(0, subScale)}) translateZ(0)`, willChange: 'transform', transformOrigin: align === 'right' ? 'left center' : 'right center' }}>
              <div style={{
                display: 'inline-block', backgroundColor: '#0A0A0A',
                padding: '5px 16px', boxShadow: '8px 10px 14px rgba(0,0,0,0.85)',
                borderLeft: `6px solid ${color}`,
              }}>
                <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#F5F5F5', lineHeight: 1.3, fontFamily: "'Cairo', sans-serif" }}>
                  {subtext}
                </h2>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

const StudioScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Tight, dynamic storytelling pacing: back-and-forth poses
  const isPose1 = (frame >= 0 && frame < 105) || (frame >= 250 && frame < 330) || (frame >= 781);
  const isPose2 = (frame >= 105 && frame < 250);
  const isPose3 = (frame >= 330 && frame < 524);
  const isPose10 = (frame >= 524 && frame < 781);

  const mazenImg = isPose1
    ? staticFile("images/episode3/mazen-pose1-scene1.png")
    : isPose2
      ? staticFile("images/episode3/mazen-pose2-scene1.png")
      : isPose3
        ? staticFile("images/episode3/mazen-pose3-scene1.png")
        : isPose10
          ? staticFile("images/episode3/mazen-pose10-holding his head.png")
          : staticFile("images/episode3/mazen-pose1-scene1.png");

  // Smooth sliding mechanics
  const slideLeftSpring = spring({ frame: frame - 330, fps, config: { damping: 16 } });
  const slidePose10Spring = spring({ frame: frame - 524, fps, config: { damping: 16 } });
  const slideRightSpring = spring({ frame: frame - 781, fps, config: { damping: 16 } });

  // Static framing offset for Pose 2 only (instant cut, no slide bleed into the next pose)
  const pose2Offset = isPose2 ? 4 : 0;

  const xOffsetNum =
    pose2Offset
    + interpolate(slideLeftSpring, [0, 1], [0, -33])
    + interpolate(slidePose10Spring, [0, 1], [0, 18]) // Shifts back to -15 (anchored left but leaving room on the right)
    + interpolate(slideRightSpring, [0, 1], [0, 20.5]); // Adjusted to +5.5% for the final pose (-33 + 18 + 20.5 = 5.5)

  const xOffset = `${xOffsetNum}%`;

  // Subtle breathing scale over time to create cinematic depth
  const scale = interpolate(frame, [0, 1000], [1.0, 1.05], { extrapolateRight: "clamp" });

  // The Entrance Spring: Disabled because AnamorphicWhipPan naturally reveals him sliding in
  const mazenEnterY = 0;

  // Chromatic Aberration burst exactly on the Pose cuts
  const cut1 = 105;
  const cut2 = 250;
  const cut3 = 330;
  const cut4 = 524;
  const cut5 = 781;

  const getCutProgress = (c: number) => frame - c;
  // THE FIX: >= 0 ensures it triggers on frame 0, spanning exactly 5 full frames (0,1,2,3,4)
  const isCutBurst = (getCutProgress(cut1) >= 0 && getCutProgress(cut1) < 5) ||
    (getCutProgress(cut2) >= 0 && getCutProgress(cut2) < 5) ||
    (getCutProgress(cut3) >= 0 && getCutProgress(cut3) < 5) ||
    (getCutProgress(cut4) >= 0 && getCutProgress(cut4) < 5) ||
    (getCutProgress(cut5) >= 0 && getCutProgress(cut5) < 5);

  // RESTORING KINETIC VIOLENCE: Step every 2 frames, but massive 80px amplitude so it survives compression and feels like a real tear.
  const burstSeed = Math.floor(frame / 2) * 45.2;
  const caX = isCutBurst ? (Math.sin(burstSeed) * 80) : 0;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* ── PROGRAMMATIC UI ELEMENTS (LEFT SIDE) ── */}
      {/* ChatGPT is delayed precisely 1 second (30 frames) after scene start */}
      <TerminalTyping delay={30} />
      {/* Perplexity is delayed 1.25 seconds (38 frames) after scene start */}
      <SearchBox delay={38} />

      {/* Gartner Report (Censor blocks copied from Ep 2) */}
      <CensorBarText text="-25% حجم البحث التقليدي" subtext="تقرير Gartner (2026)" color={RED} align="right" delay={331} exitFrame={453} />

      {/* StackOverflowChart (Top Right) */}
      <StackOverflowChart delay={593} exitFrame={766} />

      {/* Traffic Bar Chart for Organic vs AI (Left Side) */}
      <TrafficBarChart delay={781} />

      {/* SaaS + Search Glitching Decay (Starts at 00:40.02) */}
      <SaasSearchDecay delay={899} />

      {/* ── MAZEN (ENTRANCE SPRING & AUDIO-SYNCED SNAPS) ── */}
      {(() => {
        const isLeft = isPose3 || isPose10;
        return (
          <AbsoluteFill style={{ zIndex: 110, pointerEvents: "none", right: "-5%", left: "auto", width: "100%", transform: `translateY(${mazenEnterY}%) translateX(${xOffset})` }}>
            <AbsoluteFill style={{
              transform: `scale(${scale})`,
              transformOrigin: isLeft ? "bottom center" : "bottom right",
              right: "-5%", left: "auto", width: "100%",
              // Mix-blend-mode multiply to key out pure white backgrounds natively in CSS
              mixBlendMode: "multiply"
            }}>
              <img
                src={mazenImg}
                style={{
                  width: "100%", height: "100%",
                  objectFit: "contain", objectPosition: isLeft ? "bottom center" : "bottom right",
                  // Apply harsh cinematic contrast
                  filter: `contrast(1.2) brightness(0.95)`
                }}
              />
            </AbsoluteFill>

            {isCutBurst && (
              <>
                <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${caX}px)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-50deg) saturate(10)", right: "-5%", left: "auto", width: "100%" }}>
                  <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: isLeft ? "bottom center" : "bottom right" }} />
                </AbsoluteFill>
                <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${-caX}px)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(150deg) saturate(10)", right: "-5%", left: "auto", width: "100%" }}>
                  <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: isLeft ? "bottom center" : "bottom right" }} />
                </AbsoluteFill>
              </>
            )}
          </AbsoluteFill>
        );
      })()}

      {/* ── CHYRON (Emerges at 00:11.04, Exits at 00:13.17) ── */}
      <NewsChyron label="سقوط جوجل" source="تقرير خاص" delayFrames={31} exitFrame={104} isMaskRTL={true} />

      {/* Lighting / Vignette */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 115, pointerEvents: "none",
        background: "radial-gradient(ellipse 75% 65% at 60% 50%, transparent 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.95) 100%)"
      }} />
    </AbsoluteFill>
  );
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export const Topic1Google: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "transparent" }}>
    <AnamorphicWhipPan
      transitionStartFrame={TORN_PAPER_START}
      durationFrames={30} // Smooth, visceral whip pan
      childrenA={
        <Sequence from={0} durationInFrames={TORN_PAPER_START + 30}>
          <GoldenEra />
        </Sequence>
      }
      childrenB={
        <Sequence from={STUDIO_START}>
          <StudioScene />
          {/* Audio starts exactly when Studio is revealed */}
          <Sequence from={15}>
            <Audio src={staticFile("audio/episode3/mazen-scene1.mp3")} />
          </Sequence>
        </Sequence>
      }
    />
  </AbsoluteFill>
);
