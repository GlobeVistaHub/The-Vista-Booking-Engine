import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
  Audio,
  random,
  Sequence,
  interpolateColors
} from "remotion";
import { NewsChyron } from "./TheHook";
import { ShimmerEdgeBox } from "./Topic1Google";
import { AnamorphicWhipPan } from "./AnamorphicWhipPan";
import { BrandOutroHorizontal } from "./BrandOutroHorizontal";

const CYAN = "#00E5CC";
const MAGENTA = "#FF0055";
const GOLD = "#FFBB00";
const RED = "#FF3333";
const LIME = "#00FF88";
const PURPLE = "#B829FF";

// ─── VERTICAL CENSOR BAR TEXT ────────────────────────────────────────────────
const VerticalCensorBarText: React.FC<{
  text: string; subtext?: string;
  delay: number; exitFrame: number;
  color?: string; bottom?: string;
  subtextDelay?: number;
}> = ({ text, subtext, delay, exitFrame, color = '#F2F2F2', bottom = '25%', subtextDelay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  if (frame < delay || frame > exitFrame + 30) return null;

  return (
    <div style={{ position: 'absolute', bottom, left: '5%', width: '90%', zIndex: 990, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          {words.map((word, i) => {
            const isBell = word.includes('🔔');
            // The bell block is delayed by 33 frames (e.g. 758 + 33 = 791)
            const startFrame = isBell ? delay + 33 : delay + (i * 3);
            const wordStamp = spring({ frame: Math.max(0, frame - startFrame), fps, config: { damping: 14, stiffness: 350 } });

            const reverseIndex = words.length - 1 - i;
            const exitStartFrame = exitFrame + (reverseIndex * 3);
            const wordExit = spring({ frame: Math.max(0, frame - exitStartFrame), fps, config: { damping: 14, stiffness: 350 } });

            const scaleX = interpolate(wordStamp, [0, 1], [0, 1], { extrapolateLeft: "clamp" }) - interpolate(wordExit, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
            const opacity = interpolate(wordStamp, [0, 0.3, 1], [0, 1, 1], { extrapolateLeft: "clamp" }) - interpolate(wordExit, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

            return (
              <div key={i} style={{
                display: 'inline-block', backgroundColor: color,
                padding: '10px 24px', boxShadow: '12px 16px 20px rgba(0,0,0,0.9)',
                borderLeft: `8px solid #F5F5F5`, opacity: Math.max(0, opacity),
                transform: `scaleX(${Math.max(0, scaleX)}) translateZ(0)`,
                willChange: 'transform', transformOrigin: 'center center',
                WebkitFontSmoothing: "antialiased"
              }}>
                <h1 style={{ margin: 0, fontSize: 58, fontWeight: 900, color: '#0A0A0A', lineHeight: 1.1, fontFamily: "'Cairo', sans-serif" }}>
                  {word}
                </h1>
              </div>
            );
          })}
        </div>
        {subtext && (() => {
          const hasBell = words.some(w => w.includes('🔔'));
          const maxWordStart = hasBell ? delay + 33 : delay + (words.length * 3);
          const actualSubDelay = subtextDelay !== undefined ? subtextDelay : maxWordStart + 4;
          const subStamp = spring({ frame: Math.max(0, frame - actualSubDelay), fps, config: { damping: 16, stiffness: 300 } });
          const subExit = spring({ frame: Math.max(0, frame - exitFrame), fps, config: { damping: 16, stiffness: 300 } });

          const subScale = interpolate(subStamp, [0, 1], [0, 1], { extrapolateLeft: "clamp" }) - interpolate(subExit, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
          const subOp = interpolate(subStamp, [0, 0.3, 1], [0, 1, 1], { extrapolateLeft: "clamp" }) - interpolate(subExit, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

          return (
            <div style={{ display: 'block', marginTop: 14, opacity: Math.max(0, subOp), transform: `scaleX(${Math.max(0, subScale)}) translateZ(0)`, willChange: 'transform', transformOrigin: 'center center', WebkitFontSmoothing: "antialiased" }}>
              <div style={{
                display: 'inline-block', backgroundColor: '#0A0A0A',
                padding: '8px 20px', boxShadow: '8px 10px 14px rgba(0,0,0,0.85)',
                borderLeft: `6px solid ${color}`,
              }}>
                <h2 style={{ margin: 0, fontSize: 48, fontWeight: 700, color: '#F5F5F5', lineHeight: 1.5, fontFamily: "'Cairo', sans-serif", paddingTop: 4 }}>
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

// ─────────────────────────────────────────────────────────────────────────────
// CYBER HUD COLLAPSE (Option 3 with Original Physics & Wipes)
// ─────────────────────────────────────────────────────────────────────────────
const CyberHudCollapse: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame(); const lf = frame - delay; if (lf < 0) return null;
  const exitStart = exitFrame - delay;
  if (lf > exitStart + 15) return null;

  const enterSpring = spring({ frame: lf, fps: 30, config: { damping: 14, stiffness: 120 } });

  // Dedicated, slower spring just for the 3D inclination effect so it swings in beautifully
  const tiltSpring = spring({ frame: lf, fps: 30, config: { damping: 22, stiffness: 50 } });

  // The camera pullback mechanic exactly as requested
  const pullBackSpring = spring({ frame: Math.max(0, frame - 118), fps: 30, config: { damping: 14, stiffness: 120 } });

  // Base scale starts 0.8->1, then shrinks to 0.3 as camera pulls away
  const baseScale = interpolate(enterSpring, [0, 1], [0.8, 1]) - interpolate(pullBackSpring, [0, 1], [0, 0.7]);

  // The collapse happens very fast (over 8 frames)
  const exitProgress = interpolate(lf, [exitStart, exitStart + 8], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Sci-Fi Hologram Collapse Math (crushes vertically, stretches horizontally, explodes in brightness)
  const scaleY = interpolate(exitProgress, [0, 0.4, 1], [1, 0.02, 0]) * baseScale;
  const scaleX = interpolate(exitProgress, [0, 0.4, 1], [1, 2.5, 0]) * baseScale;
  const brightness = interpolate(exitProgress, [0, 0.4, 1], [1, 5, 0]);
  const flashOpacity = interpolate(exitProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const opacity = interpolate(enterSpring, [0, 0.5], [0, 1]);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "52%", zIndex: 130 }}>

      {/* Background Dimming & Localized Blur — Focuses light on the HUD and separates it from the couch */}
      <div style={{
        position: "absolute", inset: "-50%",
        background: `radial-gradient(circle at center 70%, rgba(0,5,15,0.75) 0%, rgba(0,5,15,0.3) 35%, transparent 65%)`,
        backdropFilter: `blur(${interpolate(enterSpring, [0, 1], [0, 15])}px)`,
        WebkitBackdropFilter: `blur(${interpolate(enterSpring, [0, 1], [0, 15])}px)`,
        maskImage: `radial-gradient(circle at center 70%, black 30%, transparent 60%)`,
        WebkitMaskImage: `radial-gradient(circle at center 70%, black 30%, transparent 60%)`,
        opacity: interpolate(exitProgress, [0, 0.2], [1, 0]) - interpolate(pullBackSpring, [0, 1], [0, 1])
      }} />

      {/* The 3D HUD Container */}
      <div style={{
        position: "relative",
        width: 742,
        padding: "75px 45px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32,
        transform: `perspective(1200px) rotateX(${interpolate(tiltSpring, [0, 1], [45, 0])}deg) scaleX(${scaleX}) scaleY(${scaleY})`,
        filter: `brightness(${brightness}) drop-shadow(0 0 50px ${CYAN}66)`,
        opacity
      }}>

        {/* Glass & Glowing Borders */}
        <div style={{ position: "absolute", inset: 0, border: `2px solid ${CYAN}88`, borderRadius: 40, background: "rgba(0, 15, 25, 0.55)", backdropFilter: "blur(20px)", boxShadow: `inset 0 0 60px ${CYAN}44, 0 0 80px ${CYAN}66` }} />

        {/* Cybernetic targeting brackets on corners */}
        <div style={{ position: "absolute", top: 25, left: 25, width: 45, height: 45, borderTop: `5px solid ${CYAN}`, borderLeft: `5px solid ${CYAN}`, borderRadius: "12px 0 0 0" }} />
        <div style={{ position: "absolute", bottom: 25, right: 25, width: 45, height: 45, borderBottom: `5px solid ${CYAN}`, borderRight: `5px solid ${CYAN}`, borderRadius: "0 0 12px 0" }} />

        {/* Collapse Energy Flash (pure white horizontal beam that explodes during collapse) */}
        <div style={{ position: "absolute", top: "50%", left: "-20%", width: "140%", height: 16, background: "#FFF", boxShadow: `0 0 80px #FFF, 0 0 160px ${CYAN}`, transform: "translateY(-50%)", opacity: flashOpacity, borderRadius: 10, zIndex: 50 }} />

        {/* Typography with typing animations */}
        <div style={{ zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 20, fontFamily: "'Cairo', sans-serif" }}>

          <div style={{ display: "flex", alignItems: "center", clipPath: `inset(0 0 0 ${interpolate(lf, [5, 15], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%)` }}>
            <span style={{ color: "#FFF", fontSize: 44, letterSpacing: 2, opacity: 0.9, fontWeight: 700 }}>وظيفة المستقبل:</span>
            <span dir="ltr" style={{ color: GOLD, fontSize: 54, fontWeight: 900, textShadow: `0 0 50px ${GOLD}AA, 0 0 100px ${GOLD}66`, marginLeft: 20, opacity: interpolate(lf, [15, 20], [0, 1], { extrapolateRight: "clamp" }) }}>AI Orchestrator</span>
          </div>

          <div style={{ width: "65%", height: 5, backgroundColor: CYAN, margin: "18px 0", boxShadow: `0 0 40px ${CYAN}`, clipPath: `inset(0 0 0 ${interpolate(lf, [20, 30], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%)` }} />

          <div style={{ clipPath: `inset(0 0 0 ${interpolate(lf, [25, 35], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%)` }}>
            <span style={{ color: CYAN, fontSize: 56, fontWeight: 900, textShadow: `0 0 40px ${CYAN}AA` }}>يوجّه 5 أدوات ذكاء اصطناعي</span>
          </div>

          <div style={{ clipPath: `inset(0 0 0 ${interpolate(lf, [40, 50], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%)` }}>
            <span style={{ color: "#FFF", fontSize: 48, opacity: 0.95, fontWeight: 600 }}>لبناء منتج كامل في وقت قياسي</span>
          </div>

        </div>
      </div>
    </div>
  );
};

const VerticalOldWayTerminal: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const lf = frame - delay; if (lf < 0) return null;
  const exitStart = exitFrame - delay;

  // Smooth entrance cross-dissolve to replace the n8n terminal seamlessly
  const entry = spring({ frame: lf, fps, config: { damping: 14 } });
  const exitProgress = spring({ frame: Math.max(0, lf - exitStart), fps, config: { damping: 14 } });
  if (lf > exitStart + 30) return null;

  // Cross dissolve and cinematic stand-up animation
  const opacity = interpolate(entry, [0, 1], [0, 1]) - interpolate(exitProgress, [0, 1], [0, 1]);
  // Start at a steep cinematic angle (45deg) and gracefully stand up to 10deg.
  // On exit, let it physically fall backwards into the z-depth.
  const entryTilt = interpolate(lf, [0, 35], [25, 10], { extrapolateRight: "clamp" });
  const tilt = entryTilt + interpolate(exitProgress, [0, 1], [0, 25]);

  // Start exactly at Maestro scale (1.35) and slightly push in (1.45) to match the continuous zoom
  // On exit, push it backward into the z-depth (shrinking).
  const scale = interpolate(entry, [0, 1], [1.35, 1.45]) - interpolate(exitProgress, [0, 1], [0, 0.4]);

  return (
    <div style={{ position: "absolute", top: "auto", bottom: "10%", left: "50%", marginLeft: -300, transform: `scale(${scale}) perspective(1200px) rotateX(${tilt}deg)`, transformOrigin: "bottom center", opacity, zIndex: 120 }}>

      <div style={{
        width: 600, height: 360, backgroundColor: "rgba(5,7,10,0.95)",
        backdropFilter: "blur(40px)",
        border: `2px solid ${RED}`, borderRadius: 20,
        boxShadow: `0 80px 150px rgba(0,0,0,0.95), 0 0 80px ${RED}44, inset 0 0 60px ${RED}33`,
        padding: "30px 40px", overflow: "hidden", position: "relative"
      }}>
        <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${RED}11 3px, ${RED}11 4px)`, pointerEvents: "none" }} />
        <div style={{ display: "flex", gap: 12, marginBottom: 25, borderBottom: `2px solid ${RED}55`, paddingBottom: 15, alignItems: "center" }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: RED, boxShadow: `0 0 15px ${RED}` }} />
          <span style={{ marginLeft: 15, color: "#FF6655", fontSize: 32, fontWeight: 900, fontFamily: "'Cairo', sans-serif", textShadow: `0 0 20px ${RED}` }}>النظام_التقليدي</span>
        </div>
        <div dir="rtl" style={{ display: "flex", flexDirection: "column", gap: 24, color: "#FFF", fontFamily: "'Cairo', monospace", fontSize: 30, fontWeight: 700 }}>
          <div style={{ clipPath: `inset(0 0 0 ${interpolate(lf, [10, 25], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%)` }}><span style={{ color: RED, fontFamily: "monospace", paddingLeft: 12 }}>{">"}</span>كود برمجي سطر سطر...</div>
          <div style={{ clipPath: `inset(0 0 0 ${interpolate(lf, [30, 45], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%)` }}><span style={{ color: RED, fontFamily: "monospace", paddingLeft: 12 }}>{">"}</span>أيام لبناء واجهة واحدة</div>
          <div style={{ color: "#FF6655", textShadow: "0 0 20px rgba(255,51,51,0.9)", clipPath: `inset(0 0 0 ${interpolate(lf, [50, 65], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%)` }}><span style={{ color: RED, fontFamily: "monospace", paddingLeft: 12 }}>{">"}</span>خطأ: بطء في الإنتاج ❌</div>
        </div>
      </div>
    </div>
  );
};

const VerticalMaestroTerminal: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const lf = frame - delay; if (lf < 0) return null;
  const exitStart = exitFrame - delay;
  const entry = spring({ frame: lf, fps, config: { damping: 14 } });
  const exitProgress = spring({ frame: Math.max(0, lf - exitStart), fps, config: { damping: 14 } });
  if (lf > exitStart + 30) return null;
  // Scaled to 1.35 instead of 1.5 to leave perfect breathing room on 1080px width (660 * 1.35 = 891px)
  // No scale-down or translate-down on exit. It just cross-dissolves out perfectly in-place!
  const scale = interpolate(entry, [0, 1], [0.8, 1.35]);
  const opacity = interpolate(entry, [0, 1], [0, 1]) - interpolate(exitProgress, [0, 1], [0, 1]);
  const yOffset = interpolate(entry, [0, 1], [150, 0]);

  const nodes = [
    { id: "GPT-5.6", color: LIME, cx: 0, cy: -165, w: 140 },
    { id: "Pinecone", color: CYAN, cx: 175, cy: -50, w: 170 },
    { id: "11Labs", color: MAGENTA, cx: 125, cy: 125, w: 140 },
    { id: "GitHub", color: "#FFF", cx: -125, cy: 125, w: 140 },
    { id: "MidJ v7", color: PURPLE, cx: -175, cy: -50, w: 140 },
  ];

  return (
    <div style={{ position: "absolute", top: "auto", bottom: "10%", left: "50%", marginLeft: -330, transform: `translateY(${yOffset}px) scale(${scale}) perspective(1200px) rotateX(25deg)`, transformOrigin: "bottom center", opacity, zIndex: 120 }}>

      <div style={{
        width: 660, height: 500, backgroundColor: "rgba(5,7,10,0.95)",
        backdropFilter: "blur(40px)",
        border: `3px solid ${GOLD}`, borderRadius: 20,
        boxShadow: `0 80px 150px rgba(0,0,0,0.95), 0 0 80px ${GOLD}44, inset 0 0 60px ${GOLD}22`,
        padding: "30px 40px", overflow: "hidden", position: "relative"
      }}>
        <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.08) 50%, transparent 55%)", transform: `translateX(${(lf * 1.8) % 200}%)`, pointerEvents: "none", zIndex: 10 }} />
        <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${GOLD}11 3px, ${GOLD}11 4px)`, pointerEvents: "none" }} />

        <div style={{ display: "flex", gap: 12, marginBottom: 25, borderBottom: `2px solid ${GOLD}55`, paddingBottom: 15, alignItems: "center", position: "relative", zIndex: 2 }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: GOLD, boxShadow: `0 0 15px ${GOLD}` }} />
          <span style={{ marginLeft: 15, color: GOLD, fontSize: 26, fontWeight: 900, fontFamily: "'Cairo', sans-serif", letterSpacing: 2, textShadow: `0 0 15px ${GOLD}` }}>N8N_ORCHESTRATOR</span>
          <span style={{ marginLeft: "auto", color: CYAN, opacity: Math.sin(frame * 0.1) * 0.5 + 0.5, fontSize: 28, fontWeight: 900, fontFamily: "'Cairo', sans-serif" }}>● مباشر</span>
        </div>

        <svg width="100%" height="360" viewBox="-320 -200 640 400" style={{ overflow: "visible", position: "relative", zIndex: 2 }}>
          <g transform="translate(0, -10)">
            <circle cx="0" cy="0" r="50" fill="none" stroke={GOLD} strokeWidth="4" style={{ filter: `drop-shadow(0 0 20px ${GOLD})` }} />
            <circle cx="0" cy="0" r="65" fill="none" stroke={GOLD} strokeWidth="3" strokeDasharray="8 8" style={{ transformOrigin: "0 0", transform: `rotate(${lf}deg)` }} />
            <text x="0" y="10" fontSize="34" fill={GOLD} textAnchor="middle">🎼</text>

            {nodes.map((n, i) => {
              const delayOffset = 20 + i * 10;
              const pathPop = interpolate(lf, [delayOffset, delayOffset + 20], [250, 0], { extrapolateRight: "clamp" });
              const nodePop = interpolate(lf, [delayOffset + 15, delayOffset + 25], [0, 1], { extrapolateRight: "clamp" });
              const showPacket = lf > delayOffset + 20;

              return (
                <g key={i}>
                  <path d={`M 0 0 L ${n.cx} ${n.cy}`} fill="none" stroke={n.color} strokeWidth="4" strokeDasharray="250" strokeDashoffset={pathPop} />
                  
                  <g transform={`translate(${n.cx}, ${n.cy})`}>
                    <rect x={-(n.w / 2)} y="-32" width={n.w} height="64" rx="16" fill="rgba(10,12,15,1)" stroke={n.color} strokeWidth="4" style={{ opacity: nodePop }} />
                  </g>

                  {showPacket && (
                    <circle
                      cx={n.cx * (((lf * (0.02 + random(`spd-${i}`) * 0.01)) % 2) < 1 ? ((lf * (0.02 + random(`spd-${i}`) * 0.01)) % 2) : 2 - ((lf * (0.02 + random(`spd-${i}`) * 0.01)) % 2))}
                      cy={n.cy * (((lf * (0.02 + random(`spd-${i}`) * 0.01)) % 2) < 1 ? ((lf * (0.02 + random(`spd-${i}`) * 0.01)) % 2) : 2 - ((lf * (0.02 + random(`spd-${i}`) * 0.01)) % 2))}
                      r="6" fill="#FFF" style={{ filter: `drop-shadow(0 0 15px ${n.color})` }}
                    />
                  )}

                  <g transform={`translate(${n.cx}, ${n.cy})`}>
                    <text x="0" y="10" fontSize="26" fill="#FFF" fontWeight="900" textAnchor="middle" fontFamily="'Inter', sans-serif" style={{ opacity: nodePop }}>{n.id}</text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

const VerticalPayoffBar: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const lf = frame - delay; if (lf < 0) return null;
  const exitStart = exitFrame - delay; if (lf > exitStart + 30) return null;
  const entry = spring({ frame: lf, fps, config: { damping: 14, stiffness: 100 } });
  const exitProgress = spring({ frame: Math.max(0, lf - exitStart), fps, config: { damping: 14, stiffness: 100 } });
  // Scale maxes at 1.0 (with a slight 1.05 pop) to prevent 90% width container from clipping on edges
  const scale = Number((interpolate(entry, [0, 0.7, 1], [0.8, 1.05, 1.0]) - interpolate(exitProgress, [0, 1], [0, 0.2])).toFixed(3));
  const opacity = interpolate(entry, [0, 1], [0, 1]) - interpolate(exitProgress, [0, 1], [0, 1]);
  const yOffset = Number((interpolate(entry, [0, 1], [50, 0]) + interpolate(exitProgress, [0, 1], [0, 50])).toFixed(2));

  // Sequentially animate the text rendering (Direction-Aware)
  // 1. Arabic (Right-to-Left reveal): inset left edge from 100% to 0%
  const t1 = interpolate(lf, [10, 30], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 2. English (Left-to-Right reveal): inset right edge from 100% to 0%
  const t2 = interpolate(lf, [30, 40], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 3. Arabic (Right-to-Left reveal)
  const t3 = interpolate(lf, [40, 60], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div dir="rtl" style={{ position: "absolute", bottom: "18%", left: "5%", width: "90%", display: "flex", justifyContent: "center", transform: `translate3d(0, ${yOffset}px, 0) scale3d(${scale}, ${scale}, 1)`, opacity, zIndex: 140 }}>
      <div style={{ backgroundColor: "rgba(5,7,12,0.95)", backdropFilter: "blur(40px)", border: `2px solid ${GOLD}55`, borderTop: `6px solid ${GOLD}`, padding: "40px 50px", borderRadius: "24px", boxShadow: `0 80px 150px rgba(0,0,0,0.95), 0 0 80px ${GOLD}44`, display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center" }}>
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 20px ${GOLD})` }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" style={{ transform: `rotate(${(lf * 6) % 360}deg)`, transformOrigin: "12px 12px" }} />
        </svg>
        <div style={{ fontSize: 52, fontWeight: 900, fontFamily: "'Cairo', sans-serif", color: "#FFF", lineHeight: 1.4, display: "inline-block" }}>
          <span style={{ display: "inline-block", clipPath: `inset(0 0 0 ${t1}%)` }}>إحنا بنقضي ساعات بنحلل ونربط أخبار الـ</span>
          <span style={{ display: "inline-block", color: GOLD, fontFamily: "monospace", margin: "0 10px", fontSize: 64, textShadow: `0 0 40px ${GOLD}`, clipPath: `inset(0 ${t2}% 0 0)` }}>AI</span>
          <span style={{ display: "inline-block", clipPath: `inset(0 0 0 ${t3}%)` }}>عشان نلخصها لك</span>
        </div>
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// AR ANALYTICS WALL (Built FROM SCRATCH for True Vertical 9:16 Flow)
// ─────────────────────────────────────────────────────────────────────────────
const VerticalARAnalyticsWall: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  const opacity = interpolate(lf, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const volumeBars = Array.from({ length: 16 }).map((_, i) => {
    // Deterministic random heights for stability
    const h = 10 + (Math.sin(i * 4.321) * 0.5 + 0.5) * 80;
    return { h, delay: i * 1.5 };
  });

  // True vertical winding path that flows beautifully up the 1920 height
  const verticalPath = "M-100 1800 C 250 1650, 150 1150, 500 900 C 850 650, 750 300, 1200 100";

  return (
    <AbsoluteFill style={{
      zIndex: 2, opacity,
      backgroundColor: "rgba(5,7,12, 0.25)",
      pointerEvents: "none", overflow: "hidden"
    }}>
      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${CYAN}0F 1px, transparent 1px), linear-gradient(180deg, ${CYAN}0F 1px, transparent 1px)`, backgroundSize: "120px 120px" }} />

      {/* Scanning laser line (Horizontal scanning down) */}
      <div style={{ position: "absolute", top: `${(lf * 2.5) % 120}%`, left: 0, right: 0, height: 3, backgroundColor: CYAN, opacity: 0.4, boxShadow: `0 0 20px ${CYAN}` }} />

      <svg width="1080" height="1920" style={{ position: "absolute", top: 0, left: 0, opacity: Math.min(1, Math.max(0, (lf - 5) / 15)) }}>
        <defs>
          <filter id="glowWall">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g style={{ transform: "scale(0.6)", transformOrigin: "540px 960px" }}>

          {/* Background dashed path */}
          <path d={verticalPath} fill="none" stroke={CYAN} strokeWidth="4" strokeDasharray="15 15" opacity="0.4" style={{ filter: "drop-shadow(0 0 15px rgba(0,229,204,0.5))" }} />

          {/* Vertical Volume Bars anchored at bottom */}
          <g transform="translate(60, 1850)">
            {volumeBars.map((b, i) => {
              const pop = Number(interpolate(lf, [b.delay, b.delay + 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }).toFixed(3));
              const barH = Number((b.h * 5 * pop).toFixed(1));
              return <rect key={i} x={i * 60} y={-barH} width="35" height={barH} fill={CYAN} opacity={0.3} rx="4" style={{ filter: "drop-shadow(0 0 10px rgba(0,229,204,0.4))" }} />;
            })}
          </g>

          {/* Solid glowing path drawing itself */}
          <path d={verticalPath} fill="none" stroke={GOLD} strokeWidth="8" strokeLinecap="round" filter="url(#glowWall)" strokeDasharray="4000" strokeDashoffset={Number(interpolate(lf, [0, 75], [4000, 0], { extrapolateRight: "clamp" }).toFixed(1))} />

          {/* Data Nodes mapped perfectly across the vertical path */}
          {[
            { x: 131, y: 1550, label: "تجميع البيانات" },
            { x: 308, y: 1125, label: "تحليل الأنماط" },
            { x: 694, y: 698, label: "النماذج التنبؤية" },
            { x: 1031, y: 199, label: "توليد الألفا" }
          ].map((p, i) => {
            const rawPop = spring({ frame: Math.max(0, lf - (25 + i * 10)), fps, config: { damping: 14 } });
            const pointPop = Number(rawPop.toFixed(3));
            const textPop = Math.max(0, (pointPop - 0.5) * 2);

            const isRight = p.x > 540;
            const lineEndX = isRight ? -80 : 80;
            const rectX = isRight ? -500 : 80;
            const textX = isRight ? -290 : 290;

            return (
              <g key={i} style={{ transform: `translate(${p.x}px, ${p.y}px)` }}>
                <g style={{ transform: `scale(${pointPop})`, transformOrigin: "0px 0px" }}>
                  <circle cx="0" cy="0" r="28" fill="none" stroke={CYAN} strokeWidth="5" filter="url(#glowWall)" />
                  <circle cx="0" cy="0" r="12" fill={GOLD} filter="url(#glowWall)" />
                  <line x1={isRight ? -28 : 28} y1="-28" x2={lineEndX} y2="-80" stroke={CYAN} strokeWidth="3" />
                  <rect x={rectX} y="-120" width="420" height="76" rx="14" fill="rgba(5, 7, 12, 0.95)" stroke={CYAN} strokeWidth="2" strokeLinejoin="round" style={{ filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.8))" }} />
                </g>
                <text x={textX} y="-66" fontSize="46" fill="#FFF" fontFamily="'Cairo', sans-serif" fontWeight="900" textAnchor="middle" style={{ opacity: textPop, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.9))" }}>{p.label}</text>
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// KINETIC ENERGY BURST TRANSITION
// Inspired by Nike / Jordan Brand motion graphics:
// Speed lines + radial burst + chromatic split + hard flash cut
// ─────────────────────────────────────────────────────────────────────────────
const ProgrammaticCyberDunk: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const lf = frame - startFrame;
  if (lf < 0 || lf > 36) return null;

  const progress = interpolate(lf, [0, 24], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const flashOut = interpolate(lf, [24, 36], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Radial burst scale — explodes outward from center
  const burstScale = interpolate(progress, [0, 1], [0.1, 4.5]);
  const burstOpacity = interpolate(progress, [0, 0.2, 0.85, 1], [0, 1, 1, 0]);

  // Chromatic split — red left, cyan right, blooms then slams shut
  const caBloom = interpolate(progress, [0, 0.5, 1], [0, 120, 0]);

  // Speed lines rotate based on time — 12 radial lines
  const NUM_LINES = 12;

  return (
    <AbsoluteFill style={{ zIndex: 999, pointerEvents: "none", overflow: "hidden" }}>
      {lf < 24 && (
        <AbsoluteFill>
          {/* Black BG builds up */}
          <div style={{ position: "absolute", inset: 0, backgroundColor: "#000", opacity: interpolate(progress, [0, 0.3], [0, 0.7], { extrapolateRight: "clamp" }) }} />

          {/* Chromatic aberration layers */}
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 80% at 50% 50%, ${CYAN}55 0%, transparent 70%)`, transform: `translateX(${-caBloom}px)`, mixBlendMode: "screen" }} />
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 80% at 50% 50%, ${MAGENTA}55 0%, transparent 70%)`, transform: `translateX(${caBloom}px)`, mixBlendMode: "screen" }} />

          {/* Radial speed lines SVG */}
          <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", transform: `scale(${burstScale})`, transformOrigin: "center center", opacity: burstOpacity }}>
            {Array.from({ length: NUM_LINES }).map((_, i) => {
              const angle = (i / NUM_LINES) * 360;
              const x2 = 540 + Math.cos((angle * Math.PI) / 180) * 1400;
              const y2 = 960 + Math.sin((angle * Math.PI) / 180) * 1400;
              const isGold = i % 3 === 0;
              return (
                <line
                  key={i}
                  x1={540} y1={960}
                  x2={x2} y2={y2}
                  stroke={isGold ? GOLD : i % 2 === 0 ? CYAN : MAGENTA}
                  strokeWidth={isGold ? 6 : 3}
                  opacity={0.9}
                  style={{ filter: `drop-shadow(0 0 ${isGold ? 20 : 10}px ${isGold ? GOLD : CYAN})` }}
                />
              );
            })}
            {/* Central orb */}
            <circle cx={540} cy={960} r={80} fill={GOLD} opacity={burstOpacity} style={{ filter: `drop-shadow(0 0 60px ${GOLD}) drop-shadow(0 0 120px ${RED})` }} />
            <circle cx={540} cy={960} r={40} fill="#FFF" opacity={burstOpacity} style={{ filter: "drop-shadow(0 0 30px #FFF)" }} />
          </svg>
        </AbsoluteFill>
      )}

      {/* Hard white exposure flash at cut point */}
      {lf >= 24 && <AbsoluteFill style={{ backgroundColor: "#FFF", opacity: flashOut }} />}
    </AbsoluteFill>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCENE COMPONENT (SCENE 6 + 7 COMBINED)
// ─────────────────────────────────────────────────────────────────────────────
export const ShortFinaleVertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene 6 ends at 727, Anamorphic transition runs 727-742. Scene 7 starts 742. Total = 1282.
  const isScene6 = frame < 742;

  // ── MARIYA TRUE VERTICAL POSES (SCENE 6) ───────────────────────────────────
  const M_P1 = 103, M_P2 = 380, M_P3 = 504, M_P4 = 578, M_P5 = 682;
  const mariyaImg = frame < M_P1 ? staticFile("images/episode3/mariya-v-pose2-hands-open-explaining.png")
    : frame < M_P2 ? staticFile("images/episode3/mariya-v-pose1-arms-crossed.png")
      : frame < M_P3 ? staticFile("images/episode3/mariya-v-pose4-hands-looking-at-camera.png")
        : frame < M_P4 ? staticFile("images/episode3/mariya-v-pose3-hushing.png")
          : frame < M_P5 ? staticFile("images/episode3/mariya-v-pose1-arms-crossed.png") // Snaps to Pose 1 before Hologram Push!
            : staticFile("images/episode3/mariya-v-pose2-hands-open-explaining.png"); // Returns to Pose 2 when camera pulls back at 690!

  // ── MAZEN TRUE VERTICAL POSES (SCENE 7) ────────────────────────────────────
  const Z_P1 = 742 + 68, Z_P2 = 742 + 231, Z_P3 = 742 + 373;

  const isPose1 = frame < Z_P1;
  const isPose2 = frame >= Z_P1 && frame < Z_P2;
  const isPose3 = frame >= Z_P2 && frame < Z_P3;
  const isPose4 = frame >= Z_P3;

  const mazenImg = isPose1 ? staticFile("images/episode3/mazen-v-pose1-scene7.png")
    : isPose2 ? staticFile("images/episode3/mazen-v-pose2-scene7.png")
      : isPose3 ? staticFile("images/episode3/mazen-v-pose3-scene7.png")
        : staticFile("images/episode3/mazen-v-pose4-scene7.png");

  // Dynamic Height/Scale Correction for Mazen's Poses (Fixing Midjourney Parity)
  // Pose 2 was shorter, but 1.18 was too large. Dialing back to 1.08 and -20 Y.
  // Slight nudge taller to account for the dynamic zoom pull.
  const mazenTranslateY = isPose2 ? -25 : isPose3 ? -10 : isPose4 ? -5 : 0;
  const mazenPoseScale = isPose2 ? 1.10 : isPose3 ? 1.04 : 1.0;

  // ── KINETIC CUTS ───────────────────────────────────────────────────────────
  const cut = (c: number) => frame - c;
  const isCut = (
    (cut(M_P1) >= 0 && cut(M_P1) < 5) || (cut(M_P2) >= 0 && cut(M_P2) < 5) ||
    (cut(M_P3) >= 0 && cut(M_P3) < 5) || (cut(M_P4) >= 0 && cut(M_P4) < 5) ||
    (cut(M_P5) >= 0 && cut(M_P5) < 5) ||
    (cut(Z_P1) >= 0 && cut(Z_P1) < 5) || (cut(Z_P2) >= 0 && cut(Z_P2) < 5) || (cut(Z_P3) >= 0 && cut(Z_P3) < 5)
  );
  const caX = isCut ? Math.sin(Math.floor(frame / 2) * 45.2) * 80 : 0;
  const blink = Math.floor(frame / 15) % 2 === 0;

  // ── CAMERA & CINEMATIC DOF ─────
  // Frame 0-117: presenter hidden, BG zoomed in massive (3.5x) so we start "past Mariya".
  // Frame 118+: spring pulls camera back, massive motion blur hits, Mariya is revealed.
  const pullBackSpring = spring({ frame: Math.max(0, frame - 118), fps: 30, config: { damping: 14, stiffness: 120 } });

  const motionBlurVelocity = Math.sin(pullBackSpring * Math.PI);
  const dynamicMotionBlur = isScene6 ? interpolate(motionBlurVelocity, [0, 1], [0, 25]) : 0; // Huge 25px blur during whip

  // Camera pushes in at 595, stays ON HOLOGRAM, then RETURNS BACK at 682!
  const finalHologramPush = interpolate(frame, [595, 610, 667, 682], [0, 1, 1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const continuousZoom = isScene6 ? Math.max(0, frame - 118) * 0.0003 : 0; // Adds continuous slow parallax push-in

  // The background parallax zooms slightly (0.4) so the Hologram is not blown out of frame
  const bgParallaxScale6 = interpolate(pullBackSpring, [0, 1], [3.5, 1.15]) + interpolate(finalHologramPush, [0, 1], [0, 0.4]) + continuousZoom;
  const bgParallaxScale7 = interpolate(frame - 742, [0, 540], [1.02, 1.15], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const bgParallaxScale = isScene6 ? bgParallaxScale6 : bgParallaxScale7;

  // Mariya is physically translated out of frame to the left! No ghostly opacity fade!
  const presenterScale = isScene6 ? interpolate(pullBackSpring, [0, 1], [1.15, 1]) + interpolate(finalHologramPush, [0, 1], [0, 0.5]) + continuousZoom : 1;
  const presenterTranslateX = isScene6 ? interpolate(finalHologramPush, [0, 1], [0, -1000]) : 0;

  // Opacity stays at 1 so she does NOT look like a ghost ("not penetrating her")
  const presenterOpacity = isScene6
    ? interpolate(pullBackSpring, [0.4, 0.8], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
    : 1;

  // uiFocus: 0 = presenter sharp, 1 = UI terminals active
  const uiFocus = isScene6
    ? interpolate(frame, [145, 160, 365, 372, 387, 402, 478, 490], [0, 1, 1, 0, 0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Specifically isolate the three UI Cards (Maestro + Old Way + Payoff Bar) so we only blur during those cards
  const terminalFocus = isScene6
    ? interpolate(frame, [145, 160, 365, 372, 387, 402, 478, 490], [0, 1, 1, 0, 0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Removed uiFocus blur to keep Mariya fully sharp. DOF is now strictly localized behind the UI terminals.
  const transitionBlur = isScene6 ? interpolate(frame, [682, 712], [0, 60], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }) : 0;
  const presenterBlur = dynamicMotionBlur;
  const presenterDarken = 1.0;

  // Remove the backdrop-filter from AR wall and apply it directly to the img to avoid Chromium mirror glitch
  const arWallBlur = frame >= 595 ? interpolate(frame, [595, 610], [0, 12], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }) : 0;

  // Subtle 8px background blur only during the two terminals. Because it's applied directly to the <img> tag,
  // it doesn't touch the Hologram or the Opening!
  const bgBlur = dynamicMotionBlur + transitionBlur + interpolate(terminalFocus, [0, 1], [0, 8]) + arWallBlur;
  const bgDarken = 1.0;
  const bgSaturation = interpolate(uiFocus, [0, 1], [1.0, 0.7]);

  // Radial blur mask for the background: sharp on the neon logo, slightly blurred in the room
  // This fades out entirely when we pull back to Mariya.
  const roomBlurOpacity = isScene6 ? interpolate(pullBackSpring, [0, 0.5], [1, 0], { extrapolateRight: "clamp" }) : 0;

  // --- CINEMATIC TINT OVERLAY (Restored from horizontal foundation) ---
  // We apply grayscale(1) to the studio background to strip original colors, 
  // and then paint it dynamically with these neon tones using mixBlendMode="multiply"
  let tintOpacity = 0.35;
  if (isScene6) {
    if (frame >= 630) {
      tintOpacity = interpolate(frame, [630, 645], [0.35, 0.50], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
    }
  } else {
    tintOpacity = 0.35;
  }

  let tintColor = "#000000";
  if (isScene6) {
    tintColor = interpolateColors(
      frame,
      [0, 160, 175, 293, 308, 387, 407, 650, 665, 742],
      [CYAN, CYAN, MAGENTA, MAGENTA, RED, RED, GOLD, GOLD, "#FFD700", "#FFD700"]
    );
  } else {
    // Scene 7 (Mazen / Outro) perfectly synced with dynamic chyron colors
    tintColor = interpolateColors(
      frame - 742,
      [0, 140, 155, 270, 285, 350, 365, 430, 445, 500],
      [RED, RED, CYAN, CYAN, MAGENTA, MAGENTA, GOLD, GOLD, CYAN, CYAN]
    );
  }

  const bgImage = staticFile("images/episode3/vertical-studio-wide.jpeg");

  const scene6JSX = (
    <AbsoluteFill style={{ transform: `scale(1)`, transformOrigin: "center center" }}>
      {/* STUDIO BG */}
      <AbsoluteFill style={{ transform: `scale(${bgParallaxScale6}) translateZ(0)`, transformOrigin: "51% 42%", willChange: "transform" }}>
        <img src={bgImage} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${bgBlur}px) grayscale(0.5) sepia(0.4) contrast(1.3) brightness(0.9)` }} />
        <AbsoluteFill style={{ backgroundColor: tintColor, mixBlendMode: "multiply", opacity: tintOpacity, pointerEvents: "none" }} />
        {frame >= 595 && <VerticalARAnalyticsWall delay={595} />}
        {roomBlurOpacity > 0 && (
          <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(8px)", maskImage: "radial-gradient(circle at center 42%, transparent 15%, black 45%)", WebkitMaskImage: "radial-gradient(circle at center 42%, transparent 15%, black 45%)", opacity: roomBlurOpacity }} />
        )}
      </AbsoluteFill>

      {/* CINEMATIC FILM GRAIN (Restored from horizontal foundation) */}
      <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999, mixBlendMode: "overlay", opacity: 0.05 }}>
        <div style={{
          width: "100%", height: "100%",
          backgroundImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>')`,
        }} />
      </AbsoluteFill>

      {/* PRESENTER */}
      <AbsoluteFill style={{ zIndex: 10, pointerEvents: "none", opacity: presenterOpacity, transform: `scale(${bgParallaxScale6 + presenterScale - 1}) translateX(${presenterTranslateX}px) translateZ(0)`, filter: `blur(${presenterBlur}px) brightness(${presenterDarken}) contrast(1.15)`, transformOrigin: "center center", willChange: "transform, filter, opacity" }}>
        <div style={{ position: "absolute", inset: 0, transform: frame >= M_P2 ? "translateY(80px) translateZ(0)" : "translateZ(0)", willChange: "transform" }}>
          <img src={mariyaImg} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", transform: "scale(0.85) translateZ(0)", transformOrigin: "bottom center" }} />
          {isCut && (
            <>
              <AbsoluteFill style={{ transform: `translateX(${caX}px) translateZ(0)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-50deg) saturate(10)" }}>
                <img src={mariyaImg} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", transform: "scale(0.85) translateZ(0)", transformOrigin: "bottom center" }} />
              </AbsoluteFill>
              <AbsoluteFill style={{ transform: `translateX(${-caX}px) translateZ(0)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-20deg) saturate(10)" }}>
                <img src={mariyaImg} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", transform: "scale(0.85) translateZ(0)", transformOrigin: "bottom center" }} />
              </AbsoluteFill>
            </>
          )}
        </div>
      </AbsoluteFill>

      {/* UI HEROES */}
      <AbsoluteFill style={{ zIndex: 20 }}>
        <CyberHudCollapse delay={0} exitFrame={117} />
        <VerticalMaestroTerminal delay={160} exitFrame={293} />
        <VerticalOldWayTerminal delay={293} exitFrame={365} />
        <VerticalPayoffBar delay={387} exitFrame={478} />
        <VerticalCensorBarText text="عشان تكون دايما سابق 🚀" delay={682} exitFrame={737} color={GOLD} bottom="20%" />
      </AbsoluteFill>
    </AbsoluteFill>
  );

  const scene7JSX = (
    <AbsoluteFill style={{ transform: `scale(${interpolate(frame - 742, [0, 540], [1.0, 1.2], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })})`, transformOrigin: "center center" }}>
      {/* STUDIO BG */}
      <AbsoluteFill style={{ transform: `scale(${bgParallaxScale7}) translateZ(0)`, transformOrigin: "51% 42%", willChange: "transform" }}>
        <img src={bgImage} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${dynamicMotionBlur + 4}px) grayscale(0.5) sepia(0.4) contrast(1.3) brightness(0.9)` }} />
        <AbsoluteFill style={{ backgroundColor: tintColor, mixBlendMode: "multiply", opacity: tintOpacity, pointerEvents: "none" }} />
      </AbsoluteFill>

      {/* CINEMATIC FILM GRAIN (Restored from horizontal foundation) */}
      <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999, mixBlendMode: "overlay", opacity: 0.05 }}>
        <div style={{
          width: "100%", height: "100%",
          backgroundImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>')`,
        }} />
      </AbsoluteFill>

      {/* PRESENTER */}
      <AbsoluteFill style={{ zIndex: 10, pointerEvents: "none", transformOrigin: "center center", transform: `translateY(${mazenTranslateY}px) translateZ(0)`, willChange: "transform" }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${mazenPoseScale}) translateZ(0)`, transformOrigin: "bottom center", mixBlendMode: "multiply", willChange: "transform" }}>
          <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "bottom center", transform: "translateZ(0)", filter: "contrast(1.2) brightness(0.95)" }} />
          {isCut && (
            <>
              <AbsoluteFill style={{ transform: `translateX(${caX}px) translateZ(0)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-50deg) saturate(10)" }}>
                <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "bottom center", transform: "translateZ(0)", filter: "contrast(1.2) brightness(0.95)" }} />
              </AbsoluteFill>
              <AbsoluteFill style={{ transform: `translateX(${-caX}px) translateZ(0)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-20deg) saturate(10)" }}>
                <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "bottom center", transform: "translateZ(0)", filter: "contrast(1.2) brightness(0.95)" }} />
              </AbsoluteFill>
            </>
          )}
        </div>
      </AbsoluteFill>

      {/* SCENE 7 UI */}
      <AbsoluteFill style={{ zIndex: 20 }}>
        <VerticalCensorBarText
          text="اشترك وفعل الجرس 🔔"
          subtext={(() => {
            const localFrame = frame - 742;
            if (localFrame < 150) return "لايك وشير";
            if (localFrame < 210) return "أي استفسار؟";
            if (localFrame < 250) return "سيب سؤالك";
            if (localFrame < 280) return "في التعليقات";
            if (localFrame < 378) return "او ابعتلنا بريد الكترونى";
            if (localFrame < 479) return "سنلبى لكم اهتماماتكم فى الحلقات القادمة";
            return "سلام 👋";
          })()}
          delay={758}
          subtextDelay={809}
          exitFrame={742 + 530}
          color={tintColor}
          bottom={`${interpolate(frame, [Z_P2, Z_P2 + 10, Z_P3 - 10, Z_P3], [20, 12, 12, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#030308" }}>

      {/* AUDIO SCENE 6 & 7 */}
      <Sequence from={0} durationInFrames={750}>
        <Audio src={staticFile("audio/episode3/mariya-scene6.mp3")} />
      </Sequence>
      <Sequence from={742}>
        <Audio src={staticFile("audio/episode3/mazen-scene7.mp3")} />
      </Sequence>

      <AnamorphicWhipPan
        transitionStartFrame={1242}
        durationFrames={15}
        caColorA="rgba(255, 187, 0, 0.25)"
        caColorB="rgba(0, 229, 204, 0.2)"
        flareColor="rgba(0, 229, 204, 0.6)"
        childrenA={
          <AnamorphicWhipPan
            transitionStartFrame={727}
            durationFrames={15}
            caColorA="rgba(0, 229, 204, 0.2)"
            caColorB="rgba(0, 229, 204, 0.2)"
            flareColor="rgba(0, 229, 204, 0.6)"
            childrenA={scene6JSX}
            childrenB={scene7JSX}
          />
        }
        childrenB={
          <Sequence from={1242}>
            <BrandOutroHorizontal />
          </Sequence>
        }
      />

      {/* HUD & LIVE INDICATOR */}
      <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999 }}>
        <div style={{ position: "absolute", top: 60, left: 50, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: blink ? RED : "#660018", boxShadow: blink ? `0 0 24px ${RED}` : "none" }} />
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 40, letterSpacing: 6, fontFamily: "monospace" }}>REC</span>
        </div>

        {/* Scene 6 Chyron — EXACT Scene 5 wrapper: scale(1.4) bottom left. Label shortened to fit. */}
        {frame < 742 && (
          <div style={{ position: "absolute", inset: 0, transform: "scale(1.4)", transformOrigin: "bottom left" }}>
            <NewsChyron label="وظيفة المستقبل" source="AI Orchestrator · n8n" delayFrames={43} exitFrame={103} isMaskRTL={true} />
          </div>
        )}
        {/* Scene 7 Chyron */}
        {frame >= 727 && (
          <div style={{ position: "absolute", inset: 0, transform: "scale(1.4)", transformOrigin: "bottom left" }}>
            <NewsChyron label="انتظرونا كل اسبوع" source="حرفين ولكن" delayFrames={742 + 15} exitFrame={742 + 110} isMaskRTL={true} />
          </div>
        )}
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
