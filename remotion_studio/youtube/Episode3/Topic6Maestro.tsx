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
} from "remotion";
import { NewsChyron } from "./TheHook";
import { CensorBarText, ShimmerEdgeBox } from "./Topic1Google";

const CYAN    = "#00E5CC";
const MAGENTA = "#FF0055";
const GOLD    = "#FFBB00";
const RED     = "#FF3333";
const LIME    = "#00FF88";
const PURPLE  = "#B829FF";

// ─────────────────────────────────────────────────────────────────────────────
// 1. AR ANALYTICS WALL (Polished Glassmorphism Background)
// ─────────────────────────────────────────────────────────────────────────────
const ARAnalyticsWall: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  const opacity = interpolate(lf, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  const volumeBars = Array.from({ length: 24 }).map((_, i) => {
    const h = 10 + random(`vol-${i}`) * 60;
    return { h, delay: i * 2 };
  });

  return (
    <AbsoluteFill style={{ 
      zIndex: 10, opacity, 
      backgroundColor: "rgba(5,7,12, 0.35)", 
      backdropFilter: "blur(12px)", 
      borderTop: `1px solid ${CYAN}33`,
      borderBottom: `1px solid ${CYAN}33`,
      pointerEvents: "none", overflow: "hidden"
    }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${CYAN}0F 1px, transparent 1px), linear-gradient(180deg, ${CYAN}0F 1px, transparent 1px)`, backgroundSize: "100px 100px" }} />
      
      <div style={{ position: "absolute", left: `${(lf * 2) % 120}%`, top: 0, bottom: 0, width: 2, backgroundColor: CYAN, opacity: 0.4, boxShadow: `0 0 20px ${CYAN}` }} />

      <svg width="1920" height="1080" style={{ position: "absolute", top: 0, left: 0, opacity: Math.min(1, Math.max(0, (lf - 10) / 30)) }}>
        <defs>
          <filter id="glowWall">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 184, 0, 0.2)" />
            <stop offset="100%" stopColor="rgba(255, 184, 0, 0)" />
          </linearGradient>
        </defs>

        <path d="M-100 800 C 300 700, 600 900, 1000 600 C 1400 300, 1700 500, 2100 200" fill="none" stroke={CYAN} strokeWidth="3" strokeDasharray="15 15" opacity="0.5" style={{ filter: "drop-shadow(0 0 10px rgba(0,229,204,0.4))" }} />
        
        <g transform="translate(100, 950)">
          {volumeBars.map((b, i) => {
             const pop = Number(interpolate(lf, [b.delay, b.delay + 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }).toFixed(3));
             const barH = Number((b.h * 4 * pop).toFixed(1));
             return <rect key={i} x={i * 70} y={-barH} width="40" height={barH} fill={CYAN} opacity={0.4} rx="4" style={{ filter: "drop-shadow(0 0 10px rgba(0,229,204,0.3))" }} />;
          })}
        </g>

        <path d="M-100 900 C 400 800, 800 1000, 1200 500 C 1500 100, 1800 300, 2100 50" fill="url(#chartGrad)" />
        <path d="M-100 900 C 400 800, 800 1000, 1200 500 C 1500 100, 1800 300, 2100 50" fill="none" stroke={GOLD} strokeWidth="6" strokeLinecap="round" filter="url(#glowWall)" strokeDasharray="4000" strokeDashoffset={Number(interpolate(lf, [0, 120], [4000, 0], { extrapolateRight: "clamp" }).toFixed(1))} />

        {[
          { x: 300, y: 850, label: "تجميع البيانات" },
          { x: 960, y: 724, label: "تحليل الأنماط" },
          { x: 1200, y: 500, label: "النماذج التنبؤية" },
          { x: 1480, y: 270, label: "توليد الألفا" }
        ].map((p, i) => {
          const rawPop = spring({ frame: Math.max(0, lf - (40 + i*15)), fps, config: { damping: 14 } });
          const pointPop = Number(rawPop.toFixed(3)); // Stop microscopic SVG oscillation
          
          // Delay the text fade so it doesn't bleed outside the growing rectangle
          const textPop = Math.max(0, (pointPop - 0.5) * 2);

          return (
            <g key={i} style={{ transform: `translate(${p.x}px, ${p.y}px)` }}>
              {/* Geometry scales up */}
              <g style={{ transform: `scale(${pointPop})`, transformOrigin: "0px 0px" }}>
                <circle cx="0" cy="0" r="24" fill="none" stroke={CYAN} strokeWidth="4" filter="url(#glowWall)" />
                <circle cx="0" cy="0" r="10" fill={GOLD} filter="url(#glowWall)" />
                <line x1="24" y1="-24" x2="60" y2="-60" stroke={CYAN} strokeWidth="3" />
                <rect x="60" y="-90" width="280" height="56" rx="8" fill="rgba(5, 7, 12, 0.9)" stroke={CYAN} strokeWidth="2" strokeLinejoin="round" style={{ filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.8))" }} />
              </g>
              {/* Text ONLY fades, preventing Chromium SVG text-scaling jitter entirely */}
              <text x="200" y="-52" fontSize="32" fill="#FFF" fontFamily="'Cairo', sans-serif" fontWeight="900" textAnchor="middle" style={{ opacity: textPop, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.9))" }}>{p.label}</text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 1.5 INTRO WHITE TERMINAL (SearchGPT Style)
// ─────────────────────────────────────────────────────────────────────────────
const IntroWhiteTerminal: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame();
  const lf = frame - delay;
  if (lf < 0) return null;

  const exitStart = exitFrame - delay;
  const progress = interpolate(
    lf,
    [0, 12, exitStart, exitStart + 12],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  
  const scale = interpolate(progress, [0, 1], [0, 1]);
  if (lf > exitStart + 12) return null;

  return (
    <div style={{
      position: "absolute", top: "35%", right: "6%", width: 600,
      transform: `scale(${scale})`, transformOrigin: "right center", zIndex: 130
    }}>
      <ShimmerEdgeBox width={600} height={280} frameOffset={delay} primaryColor={CYAN} secondaryColor={MAGENTA}>
        {/* Terminal Header */}
        <div style={{ display: "flex", gap: 12, marginBottom: 15, borderBottom: "1px solid rgba(0,0,0,0.1)", paddingBottom: 10, alignItems: "center" }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: RED, boxShadow: `0 0 10px ${RED}` }} />
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#FFBB00", boxShadow: "0 0 10px #FFBB00" }} />
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: LIME, boxShadow: `0 0 10px ${LIME}` }} />
          <span style={{ marginLeft: 15, color: "#666", fontSize: 24, fontWeight: "bold" }}>SCRIPT_PARSER.EXE</span>
        </div>

        {/* Terminal Text - Sequential Wipe */}
        <div dir="rtl" style={{ display: "flex", flexDirection: "column", gap: 18, fontFamily: "'Cairo', sans-serif", fontSize: 28, fontWeight: 800, color: "#111" }}>
           
           <div style={{ position: "relative" }}>
              <div style={{ visibility: "hidden" }}>
                 <span style={{ color: CYAN, fontFamily: "monospace", fontSize: 32, marginLeft: 10 }}>{">"}</span>
                 وظيفة المستقبل: &nbsp;AI Orchestrator
              </div>
              
              {/* Arabic Wiping (RTL) */}
              <div style={{ position: "absolute", top: 0, right: 0, width: "100%", height: "100%", clipPath: `inset(0 0 0 ${interpolate(lf, [10, 18], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%)` }}>
                 <span style={{ color: CYAN, fontFamily: "monospace", fontSize: 32, marginLeft: 10 }}>{">"}</span>
                 وظيفة المستقبل: 
              </div>

              {/* English Wiping (LTR) */}
              <div style={{ position: "absolute", top: 0, right: 0, width: "100%", height: "100%", clipPath: `inset(0 ${interpolate(lf, [30, 37], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}% 0 0)` }}>
                 <span style={{ visibility: "hidden" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 32, marginLeft: 10 }}>{">"}</span>
                    وظيفة المستقبل: 
                 </span>
                 <span dir="ltr" style={{ color: "#E09A00", display: "inline-block", transform: "translateZ(0)", marginRight: 12, textShadow: "0 0 12px rgba(224,154,0,0.8)" }}>AI Orchestrator</span>
              </div>
           </div>

           <div style={{ clipPath: `inset(0 0 0 ${interpolate(lf, [30, 45], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%)`, transform: "translateZ(0)", textShadow: `0 0 12px ${MAGENTA}66` }}>
              <span style={{ color: MAGENTA, fontFamily: "monospace", fontSize: 32, marginLeft: 10, textShadow: `0 0 15px ${MAGENTA}` }}>{">"}</span>
              يوجّه <span style={{ color: PURPLE, textShadow: `0 0 15px ${PURPLE}` }}>5 أدوات</span> ذكاء اصطناعي
           </div>
           
           <div style={{ clipPath: `inset(0 0 0 ${interpolate(lf, [50, 65], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%)`, transform: "translateZ(0)", textShadow: `0 0 12px ${LIME}66` }}>
              <span style={{ color: LIME, fontFamily: "monospace", fontSize: 32, marginLeft: 10, textShadow: `0 0 15px ${LIME}` }}>{">"}</span>
              لبناء منتج كامل في وقت قياسي
           </div>
        </div>
      </ShimmerEdgeBox>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. OLD WAY TERMINAL (Legacy Mode)
// ─────────────────────────────────────────────────────────────────────────────
const OldWayTerminal: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame();
  const lf = frame - delay;
  if (lf < 0) return null;

  const exitStart = exitFrame - delay;
  const progress = interpolate(lf, [0, 15, exitStart, exitStart + 12], [0, 1, 1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  if (lf > exitStart + 12) return null;
  const scale = interpolate(progress, [0, 1], [0, 1]);
  const xOffset = interpolate(progress, [0, 1], [-200, 0]);

  return (
    <div style={{ position: "absolute", top: "18%", left: "10%", transform: `translateX(${xOffset}px) scale(${scale})`, transformOrigin: "right center", zIndex: 120 }}>
      <div style={{
        width: 440, height: 320, backgroundColor: "rgba(5,7,10,0.9)",
        border: `2px solid ${RED}66`, borderRadius: 16,
        boxShadow: `0 40px 80px rgba(0,0,0,0.95), 0 0 60px ${RED}22, inset 0 0 50px ${RED}33`,
        backdropFilter: "blur(25px)",
        transform: `perspective(900px) rotateY(15deg)`, transformOrigin: "right center",
        padding: "24px 30px", overflow: "hidden", position: "relative"
      }}>
        <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.06) 50%, transparent 55%)", transform: `translateX(${(lf * 1.5) % 200}%)`, pointerEvents: "none", zIndex: 10 }} />
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,51,51,0.06) 3px, rgba(255,51,51,0.06) 4px)", pointerEvents: "none" }} />
        
        <div style={{ display: "flex", gap: 10, marginBottom: 20, borderBottom: `1px solid ${RED}55`, paddingBottom: 15, alignItems: "center" }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: RED, boxShadow: `0 0 10px ${RED}` }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#555" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#333" }} />
          <span style={{ marginLeft: 15, color: "#FF6655", fontSize: 28, fontWeight: 900, fontFamily: "'Cairo', sans-serif", textShadow: "0 4px 10px rgba(0,0,0,0.9), 0 0 15px rgba(255,51,51,0.9)" }}>النظام_التقليدي</span>
        </div>
        <div dir="rtl" style={{ display: "flex", flexDirection: "column", gap: 18, color: "#FFF", fontFamily: "'Cairo', monospace", fontSize: 26, fontWeight: 700, textShadow: "0 4px 10px rgba(0,0,0,0.9)" }}>
           <div style={{ clipPath: `inset(0 0 0 ${interpolate(lf, [10, 25], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%)`, transform: "translateZ(0)" }}><span style={{ color: RED, fontFamily: "monospace", paddingLeft: 8 }}>{">"}</span>كود برمجي سطر سطر...</div>
           <div style={{ clipPath: `inset(0 0 0 ${interpolate(lf, [30, 45], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%)`, transform: "translateZ(0)" }}><span style={{ color: RED, fontFamily: "monospace", paddingLeft: 8 }}>{">"}</span>أيام لبناء واجهة واحدة</div>
           <div style={{ color: "#FF6655", textShadow: "0 0 15px rgba(255,51,51,0.9)", clipPath: `inset(0 0 0 ${interpolate(lf, [50, 65], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%)`, transform: "translateZ(0)" }}><span style={{ color: RED, fontFamily: "monospace", paddingLeft: 8 }}>{">"}</span>خطأ: بطء في الإنتاج ❌</div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAESTRO TERMINAL
// ─────────────────────────────────────────────────────────────────────────────
const MaestroTerminal: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  const exitStart = exitFrame - delay;
  const entry = spring({ frame: lf, fps, config: { damping: 14 } });
  const exitProgress = spring({ frame: Math.max(0, lf - exitStart), fps, config: { damping: 14 } });
  
  if (lf > exitStart + 12) return null;

  const scale = interpolate(entry, [0, 1], [0.8, 1]) - interpolate(exitProgress, [0, 1], [0, 0.4]);
  const opacity = interpolate(entry, [0, 1], [0, 1]) - interpolate(exitProgress, [0, 1], [0, 1]);
  const xOffset = interpolate(entry, [0, 1], [200, 0]) + interpolate(exitProgress, [0, 1], [0, 200]);

  const nodes = [
    { id: "GPT-5.6", color: LIME,    cx: 0,    cy: -165 },
    { id: "Pinecone",color: CYAN,    cx: 175,  cy: -50 },
    { id: "11Labs",  color: MAGENTA, cx: 125,  cy: 125 },
    { id: "GitHub",  color: "#FFF",  cx: -125, cy: 125 },
    { id: "MidJ v7", color: PURPLE,  cx: -175, cy: -50 },
  ];

  return (
    <div style={{
      position: "absolute", top: "15%", right: "10%",
      transform: `translateX(${xOffset}px) scale(${scale})`, opacity, zIndex: 120,
    }}>
      <div style={{
        width: 540, height: 440, backgroundColor: "rgba(5,7,10,0.9)",
        border: `2px solid ${GOLD}66`, borderRadius: 16,
        boxShadow: `0 40px 80px rgba(0,0,0,0.95), 0 0 60px ${GOLD}22, inset 0 0 50px ${GOLD}33`,
        backdropFilter: "blur(25px)",
        transform: `perspective(900px) rotateY(-15deg)`, transformOrigin: "left center",
        padding: "24px 30px", overflow: "hidden", position: "relative"
      }}>
        <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.08) 50%, transparent 55%)", transform: `translateX(${(lf * 1.8) % 200}%)`, pointerEvents: "none", zIndex: 10 }} />
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,187,0,0.06) 3px, rgba(255,187,0,0.06) 4px)", pointerEvents: "none" }} />
        
        <div style={{ display: "flex", gap: 10, marginBottom: 20, borderBottom: `1px solid ${GOLD}55`, paddingBottom: 15, alignItems: "center", position: "relative", zIndex: 2 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: GOLD, boxShadow: `0 0 10px ${GOLD}` }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: CYAN, boxShadow: `0 0 10px ${CYAN}` }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: MAGENTA, boxShadow: `0 0 10px ${MAGENTA}` }} />
          <span style={{ marginLeft: 15, color: GOLD, fontSize: 20, fontWeight: 900, fontFamily: "'Cairo', sans-serif", letterSpacing: 2, textShadow: `0 0 10px ${GOLD}` }}>N8N_ORCHESTRATOR</span>
          {/* Replaced native CSS animation with frame math to prevent 3D transform z-fighting artifacts */}
          <span style={{ marginLeft: "auto", color: CYAN, opacity: Math.sin(frame * 0.1) * 0.5 + 0.5, fontSize: 18, fontWeight: 900, fontFamily: "'Cairo', sans-serif", textShadow: `0 0 10px ${CYAN}` }}>● مباشر</span>
        </div>

        <svg width="100%" height="320" viewBox="-320 -230 640 460" style={{ overflow: "visible", position: "relative", zIndex: 2 }}>
           <g transform="translate(0, 0)">
             <circle cx="0" cy="0" r="45" fill="none" stroke={GOLD} strokeWidth="3" style={{ filter: `drop-shadow(0 0 15px ${GOLD})` }} />
             <circle cx="0" cy="0" r="55" fill="none" stroke={GOLD} strokeWidth="2" strokeDasharray="5 5" style={{ transformOrigin: "0 0", transform: `rotate(${lf}deg)`, filter: `drop-shadow(0 0 10px ${GOLD})` }} />
             <text x="0" y="8" fontSize="28" fill={GOLD} textAnchor="middle" style={{ filter: `drop-shadow(0 0 10px ${GOLD})` }}>🎼</text>
             
             {nodes.map((n, i) => {
               const delayOffset = 20 + i * 10;
               const pathPop = interpolate(lf, [delayOffset, delayOffset + 20], [250, 0], { extrapolateRight: "clamp" });
               const nodePop = interpolate(lf, [delayOffset + 15, delayOffset + 25], [0, 1], { extrapolateRight: "clamp" });
               const showPacket = lf > delayOffset + 20;

               return (
                 <g key={i}>
                   <path d={`M 0 0 L ${n.cx} ${n.cy}`} fill="none" stroke={n.color} strokeWidth="3" strokeDasharray="250" strokeDashoffset={pathPop} style={{ filter: `drop-shadow(0 0 10px ${n.color})` }} />
                   <g transform={`translate(${n.cx}, ${n.cy})`} opacity={nodePop}>
                     {/* Massively boosted node size */}
                     <rect x="-65" y="-28" width="130" height="56" rx="14" fill="rgba(10,12,15,0.95)" stroke={n.color} strokeWidth="3" style={{ filter: `drop-shadow(0 0 16px ${n.color}88)` }} />
                     <text x="0" y="8" fontSize="22" fill="#FFF" fontWeight="900" textAnchor="middle" fontFamily="'Inter', sans-serif" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.9))" }}>{n.id}</text>
                   </g>
                   {showPacket && (
                     <circle 
                        cx={n.cx * ( ( (lf * (0.02 + random(`spd-${i}`) * 0.01)) % 2 ) < 1 ? ( (lf * (0.02 + random(`spd-${i}`) * 0.01)) % 2 ) : 2 - ( (lf * (0.02 + random(`spd-${i}`) * 0.01)) % 2 ) )} 
                        cy={n.cy * ( ( (lf * (0.02 + random(`spd-${i}`) * 0.01)) % 2 ) < 1 ? ( (lf * (0.02 + random(`spd-${i}`) * 0.01)) % 2 ) : 2 - ( (lf * (0.02 + random(`spd-${i}`) * 0.01)) % 2 ) )} 
                        r="5" fill="#FFF" style={{ filter: `drop-shadow(0 0 12px ${n.color})` }} 
                     />
                   )}
                 </g>
               );
             })}
           </g>
        </svg>

        <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, top: `${(lf * 2) % 100}%`, opacity: 0.5, pointerEvents: "none", zIndex: 3 }} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. CINEMATIC PAYOFF BAR
// ─────────────────────────────────────────────────────────────────────────────
const CinematicPayoffBar: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  const exitStart = exitFrame - delay;
  if (lf > exitStart + 15) return null;

  const entry = spring({ frame: lf, fps, config: { damping: 14, stiffness: 100 } });
  const exitProgress = spring({ frame: Math.max(0, lf - exitStart), fps, config: { damping: 14, stiffness: 100 } });
  
  const scale = Number((interpolate(entry, [0, 1], [0.9, 1]) - interpolate(exitProgress, [0, 1], [0, 0.2])).toFixed(3));
  const opacity = interpolate(entry, [0, 1], [0, 1]) - interpolate(exitProgress, [0, 1], [0, 1]);
  const yOffset = Number((interpolate(entry, [0, 1], [50, 0]) + interpolate(exitProgress, [0, 1], [0, 50])).toFixed(2));

  return (
    <div dir="rtl" style={{
      position: "absolute", bottom: "10%", left: "0", width: "100%",
      display: "flex", justifyContent: "center",
      transform: `translate3d(0, ${yOffset}px, 0) scale3d(${scale}, ${scale}, 1)`, 
      opacity, zIndex: 140,
      willChange: "transform, opacity",
      backfaceVisibility: "hidden",
    }}>
      <div style={{
        backgroundColor: "rgba(5,7,12,0.92)",
        backdropFilter: "blur(30px)",
        border: `2px solid ${GOLD}55`,
        borderTop: `4px solid ${GOLD}`,
        padding: "25px 50px",
        borderRadius: "20px",
        boxShadow: `0 40px 100px rgba(0,0,0,1), 0 0 60px ${GOLD}44, inset 0 0 30px rgba(255,187,0,0.15)`,
        display: "flex", alignItems: "center", gap: 20, position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.06), transparent)", pointerEvents: "none" }} />
        
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 15px ${GOLD})`, transform: "translateZ(0)" }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" style={{ transform: `rotate(${(lf * 6) % 360}deg)`, transformOrigin: "12px 12px", willChange: "transform" }} />
        </svg>
          
        <span style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Cairo', sans-serif", color: "#FFF", lineHeight: 1.4, textShadow: "0 10px 20px rgba(0,0,0,0.9)", WebkitFontSmoothing: "antialiased", transform: "translateZ(0)", backfaceVisibility: "hidden" }}>
          إحنا بنقضي ساعات طويلة بنحلل ونربط أخبار الـ 
          <span style={{ color: GOLD, fontFamily: "monospace", margin: "0 10px", fontSize: 52, textShadow: `0 0 30px ${GOLD}` }}>AI</span> 
          المعقدة عشان نلخصها لك
        </span>
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCENE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export const Topic6Maestro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── POSE CUT FRAMES ──────────────────────────────────────────────────────
  const P1 = 103, P2 = 380, P3 = 504, P4 = 568, P5 = 644;

  const isPose1 = frame < P1;
  const isPose2 = frame >= P1 && frame < P2;
  const isPose3 = frame >= P2 && frame < P3;
  const isPose4 = frame >= P3 && frame < P4;
  const isPose5 = frame >= P4 && frame < P5;
  const isPose6 = frame >= P5;

  const mariyaImg = isPose1
    ? staticFile("images/episode3/mariya-pose3-scene2.png")  // Starts with Pose 3 (Anchored Left)
    : isPose2
    ? staticFile("images/episode3/mariya-pose1-scene2.png")    
    : isPose3
    ? staticFile("images/episode3/mariya-pose2-scene2.png")    
    : isPose4
    ? staticFile("images/episode3/mariya-pose-5-neutral.png")
    : isPose5
    ? staticFile("images/episode3/mariya-pose3-scene2.png")
    : staticFile("images/episode3/mariya-pose1-scene2.png"); // Snaps to Pose 1

  // ── PRESENTER ANCHOR & LATERAL DRIFT ─────────────────────────────────────
  const s1 = spring({ frame: Math.max(0, frame - P1), fps, config: { damping: 16 } });
  const s2 = spring({ frame: Math.max(0, frame - P2), fps, config: { damping: 16 } });
  const s3 = spring({ frame: Math.max(0, frame - P3), fps, config: { damping: 16 } });
  const s4 = spring({ frame: Math.max(0, frame - P4), fps, config: { damping: 16 } });
  const s5 = spring({ frame: Math.max(0, frame - P5), fps, config: { damping: 16 } });

  const xNum =
    -15 // Start anchored left to leave right-space for IntroWhiteTerminal
    + interpolate(s1, [0, 1], [0, 15]) // Shift back to center for the dual terminal layout
    + interpolate(s2, [0, 1], [0,  0]) 
    + interpolate(s3, [0, 1], [0,   0])
    + interpolate(s4, [0, 1], [0, -15]) // Snap back left
    + interpolate(s5, [0, 1], [0, -5]); // Slight shift left (total -20 instead of -30)

  const anchor: React.CSSProperties = { left: "0", right: "0", margin: "0 auto", textAlign: "center" as const };  

  const objPos  = "bottom center";
  const tOrigin = "bottom center";

  const scale = interpolate(frame, [0, 690], [1.0, 1.05], { extrapolateRight: "clamp" });

  const cut = (c: number) => frame - c;
  // THE FIX: >= 0 ensures it triggers on frame 0, spanning exactly 5 full frames (0,1,2,3,4)
  const isCut =
    (cut(P1) >= 0 && cut(P1) < 5) ||
    (cut(P2) >= 0 && cut(P2) < 5) ||
    (cut(P3) >= 0 && cut(P3) < 5) ||
    (cut(P4) >= 0 && cut(P4) < 5) ||
    (cut(P5) >= 0 && cut(P5) < 5);
  
  // RESTORING KINETIC VIOLENCE: Step every 2 frames, but massive 80px amplitude so it survives compression and feels like a real tear.
  const burstSeed = Math.floor(frame / 2) * 45.2;
  const caX = isCut ? (Math.sin(burstSeed) * 80) : 0;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Audio src={staticFile("audio/episode3/mariya-scene6.mp3")} startFrom={0} />

      {/* AR Glassmorphism Wall (Stock Market Analysis Chart) */}
      <ARAnalyticsWall delay={568} />

      {/* ── INTRO WHITE TERMINAL (Snaps in for the first line) ── */}
      <IntroWhiteTerminal delay={9} exitFrame={94} />

      {/* ── MARIYA PRESENTER ── */}
      <AbsoluteFill style={{ zIndex: 110, pointerEvents: "none", ...anchor, width: "100%", transform: `translateX(${xNum}%)`, display: "flex", justifyContent: "center" }}>
        <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: tOrigin, width: "100%", mixBlendMode: "multiply" }}>
          <img src={mariyaImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: objPos, filter: "contrast(1.2) brightness(0.95)" }} />
        </AbsoluteFill>
        {isCut && <>
          <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${caX}px)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-50deg) saturate(10)", width: "100%" }}>
            <img src={mariyaImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: objPos }} />
          </AbsoluteFill>
          <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${-caX}px)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-20deg) saturate(10)", width: "100%" }}>
            <img src={mariyaImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: objPos }} />
          </AbsoluteFill>
        </>}
      </AbsoluteFill>

      {/* "Breaking News" Banner inserted at 02:35.09, exiting 2 seconds later */}
      <NewsChyron
        label="وظيفة المستقبل: الـ AI Orchestrator"
        source="n8n · 2026"
        delayFrames={43}
        exitFrame={103}
        isMaskRTL={true}
      />

      {/* Delays shifted slightly to allow IntroWhiteTerminal to exit cleanly */}
      <OldWayTerminal delay={270} exitFrame={355} />

      <MaestroTerminal delay={103} exitFrame={340} />

      <CinematicPayoffBar delay={373} exitFrame={484} />

    </AbsoluteFill>
  );
};
