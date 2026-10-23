import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, staticFile, Audio, Sequence } from "remotion";
import { NewsChyron } from "./TheHook";

const CYAN = "#00E5CC", MAGENTA = "#FF0055", RED = "#FF3333", LIME = "#00FF88", GOLD = "#FFBB00";

// ─── 0.5. VERTICAL CENSOR BAR TEXT (Premium Wood Strike Style) ─────────────────
const VerticalCensorBarText: React.FC<{
  text: string; subtext?: string;
  delay: number; exitFrame: number;
  color?: string; bottom?: string;
}> = ({ text, subtext, delay, exitFrame, color = '#F2F2F2', bottom = '25%' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  if (frame < delay || frame > exitFrame + 30) return null;

  return (
    <div style={{ position: 'absolute', bottom, left: '5%', width: '90%', zIndex: 990, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          {words.map((word, i) => {
            const startFrame = delay + (i * 3);
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
                transform: `scaleX(${Math.max(0, scaleX)})`,
                willChange: 'transform', transformOrigin: 'center center',
              }}>
                <h1 style={{ margin: 0, fontSize: 58, fontWeight: 900, color: '#0A0A0A', lineHeight: 1.1, fontFamily: "'Cairo', sans-serif" }}>
                  {word}
                </h1>
              </div>
            );
          })}
        </div>
        {subtext && (() => {
          const subStamp = spring({ frame: Math.max(0, frame - (delay + words.length * 3 + 4)), fps, config: { damping: 16, stiffness: 300 } });
          const subExit = spring({ frame: Math.max(0, frame - exitFrame), fps, config: { damping: 16, stiffness: 300 } });

          const subScale = interpolate(subStamp, [0, 1], [0, 1], { extrapolateLeft: "clamp" }) - interpolate(subExit, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
          const subOp = interpolate(subStamp, [0, 0.3, 1], [0, 1, 1], { extrapolateLeft: "clamp" }) - interpolate(subExit, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

          return (
            <div style={{ display: 'block', marginTop: 14, opacity: Math.max(0, subOp), transform: `scaleX(${Math.max(0, subScale)})`, willChange: 'transform', transformOrigin: 'center center' }}>
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

// ─── 1. VERTICAL SERVER CRASH (Replaces DeadNetwork for a better 9:16 fit) ─────
const VerticalServerCrash: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame(); const lf = frame - delay;
  if (lf < 0) return null; const xE = exitFrame - delay; if (lf > xE) return null;
  const entry = spring({ frame: lf, fps: 30, config: { damping: 16, stiffness: 180 } });
  const exitP = interpolate(lf, [xE - 10, xE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = interpolate(entry, [0, 1], [0, 1]) * (1 - exitP);
  const slideY = interpolate(entry, [0, 1], [-200, 0]) + interpolate(exitP, [0, 1], [0, 200]);

  const blades = Array.from({ length: 8 });
  const isFatal = lf > 65;
  const shakeX = isFatal && lf < 85 ? (Math.random() - 0.5) * 20 : 0;
  const shakeY = isFatal && lf < 85 ? (Math.random() - 0.5) * 20 : 0;

  const offlineS = spring({ frame: Math.max(0, lf - 75), fps: 30, config: { damping: 10, stiffness: 200 } });
  
  return (
    <div style={{ position: "absolute", top: "20%", left: "50%", marginLeft: -400, width: 800, transform: `translate(${shakeX}px, ${slideY + shakeY}px)`, opacity, zIndex: 120 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <span style={{ color: RED, fontFamily: "monospace", fontSize: 42, fontWeight: 900, textShadow: `0 0 15px ${RED}`, opacity: isFatal ? Math.random() > 0.3 ? 1 : 0 : 1 }}>[SYSTEM_FAILURE]</span>
        <span style={{ color: CYAN, fontFamily: "'Cairo',sans-serif", fontSize: 48, fontWeight: 900, opacity: isFatal ? 0.3 : 1 }}>خوادم الإنترنت</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {blades.map((_, i) => {
          const deathFrame = i * 6 + 15;
          const isDead = lf > deathFrame;
          const glitch = lf > deathFrame && lf < deathFrame + 8 ? Math.sin(lf * 2) > 0 : false;
          const lightCol = isDead ? (glitch ? "#FFF" : RED) : CYAN;
          const bgCol = isDead ? "rgba(40,0,0,0.8)" : "rgba(0,25,35,0.8)";
          return (
            <div key={i} style={{ width: "100%", height: 75, backgroundColor: bgCol, border: `2px solid ${isDead ? RED : CYAN}44`, borderRadius: 12, display: "flex", alignItems: "center", padding: "0 24px", boxSizing: "border-box", boxShadow: isDead ? `inset 0 0 40px ${RED}33` : "none" }}>
              <div style={{ display: "flex", gap: 12 }}>
                {[1, 2, 3].map(j => <div key={j} style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: lightCol, filter: `drop-shadow(0 0 10px ${lightCol})` }} />)}
              </div>
              <div style={{ marginLeft: "auto", width: "60%", height: 8, backgroundColor: isDead ? "#222" : `${CYAN}55`, borderRadius: 4, overflow: "hidden" }}>
                {!isDead && <div style={{ width: "40%", height: "100%", backgroundColor: CYAN, transform: `translateX(${(lf * 4 + i * 20) % 200}%)` }} />}
              </div>
            </div>
          );
        })}
      </div>
      {lf > 75 && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%, -50%) scale(${interpolate(offlineS, [0, 1], [3, 1])})`, textAlign: "center", color: RED, fontFamily: "monospace", fontSize: 110, fontWeight: 900, letterSpacing: 12, textShadow: `0 0 50px ${RED}, 0 0 100px ${RED}`, background: "rgba(0,0,0,0.8)", padding: "20px 40px", borderRadius: 20, border: `4px solid ${RED}` }}>
          OFFLINE
        </div>
      )}
    </div>
  );
};

// ─── 2. BOT DUEL TERMINALS (Original side-by-side) ────────────────────────────
const LA = ["> بحث_متجه --سريع", "> استخراج --عمق=9", "> توليد_محتوى --ذكاء_اصطناعي", "> نشر --تجاوز-البشر", "> حلقة --لانهائية"];
const LB = ["> استقبال_بيانات", "> تحليل_رموز --تلقائي", "> توليف_مقال --ذكاء_اصطناعي", "> توزيع --الكل", "> تأكيد --لا-تدخل-بشري"];

const BotCard: React.FC<{ lines: string[]; label: string; color: string; rotY: number; side: "left" | "right"; lf: number }> = ({ lines, label, color, rotY, side, lf }) => (
  <div style={{ width: 400, height: 650, backgroundColor: "rgba(0,0,0,0.85)", border: `2px solid ${color}66`, borderRadius: 20, boxShadow: `0 30px 80px rgba(0,0,0,0.9),inset 0 0 50px ${color}22`, backdropFilter: "blur(20px)", transform: `perspective(1000px) rotateY(${rotY}deg) translateZ(50px)`, transformOrigin: side === "left" ? "right center" : "left center", padding: "35px 25px", overflow: "hidden", position: "relative", flexShrink: 0, display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", gap: 9, marginBottom: 24, borderBottom: `2px solid ${color}33`, paddingBottom: 20, alignItems: "center" }}>
      {[RED, LIME, color].map((c, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: c }} />)}
      <span style={{ marginLeft: 12, color, fontFamily: "monospace", fontSize: 36, fontWeight: 900, textShadow: `0 0 15px ${color}` }}>{label}</span>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1, justifyContent: "center" }}>
      {lines.map((line, i) => {
        const rev = interpolate(lf, [i * 15, i * 15 + 16], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        const chars = Math.floor(rev * line.length);
        return <div key={i} style={{ fontFamily: "monospace", fontSize: 32, fontWeight: 700, whiteSpace: "normal", color: i === lines.length - 1 ? color : "#888", textShadow: i === lines.length - 1 && rev > 0.5 ? `0 0 12px ${color}88` : "none", lineHeight: 1.4 }}>{line.slice(0, chars)}{rev > 0 && rev < 1 && <span style={{ opacity: Math.sin(lf * 0.6) > 0 ? 1 : 0 }}>█</span>}</div>;
      })}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${color},transparent)`, top: `${(lf * 3) % 100}%`, opacity: 0.4, pointerEvents: "none", boxShadow: `0 0 20px ${color}` }} />
  </div>
);

const BotDuelV: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const lf = frame - delay;
  if (lf < 0) return null; const xE = exitFrame - delay; if (lf > xE) return null;
  const eA = spring({ frame: lf, fps, config: { damping: 18, stiffness: 180 } });
  const eB = spring({ frame: Math.max(0, lf - 6), fps, config: { damping: 18, stiffness: 180 } });
  const exitP = interpolate(lf, [xE - 12, xE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = interpolate(lf, [0, 8], [0, 1], { extrapolateRight: "clamp" }) * (1 - exitP);
  const xA = interpolate(eA, [0, 1], [-550, -20]) + interpolate(exitP, [0, 1], [0, -550]);
  const xB = interpolate(eB, [0, 1], [550, 20]) + interpolate(exitP, [0, 1], [0, 550]);
  const rotA = interpolate(eA, [0, 1], [45, 20]) + interpolate(exitP, [0, 1], [0, 45]);
  const rotB = interpolate(eB, [0, 1], [-45, -20]) + interpolate(exitP, [0, 1], [0, -45]);

  const ppT = (Math.sin(lf * 0.22) + 1) / 2;
  const ppX = ppT * 265; const ppY = 95 + Math.sin(lf * 0.22) * 20;
  const nhS = spring({ frame: Math.max(0, lf - 80), fps, config: { damping: 8, stiffness: 380 } });
  const nhO = interpolate(lf, [80, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flO = interpolate(lf, [82, 106], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flSc = interpolate(lf, [82, 106], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = nhS > 0.9 ? (Math.sin(Math.floor(lf / 2) * 30) * 16 * (1 - (nhS - 0.9) / 0.1)) : 0;

  return (
    <div style={{ position: "absolute", top: "22%", left: 0, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 30, zIndex: 140 }}>
      <div style={{ transform: `translateX(${xA}px)`, opacity }}>
        <BotCard lines={LA} label="[BOT_ALPHA]" color={CYAN} rotY={rotA} side="left" lf={lf} />
      </div>
      <div style={{ position: "absolute", top: 220, left: "50%", marginLeft: -140, width: 280, height: 180, zIndex: 145, opacity, transform: `scale(${eA})` }}>
        <svg width="280" height="180" viewBox="0 0 280 180" style={{ overflow: "visible" }}>
          <defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={CYAN} /><stop offset="50%" stopColor="#FFF" /><stop offset="100%" stopColor={MAGENTA} /></linearGradient></defs>
          <path d="M 0 95 Q 140 130 280 95" stroke="url(#sg)" strokeWidth="4" fill="none" opacity={0.8} style={{ filter: "drop-shadow(0 0 10px rgba(0,229,204,0.8))" }} />
          <circle cx={ppX} cy={ppY} r={12} fill={CYAN} style={{ filter: `drop-shadow(0 0 20px ${CYAN}) drop-shadow(0 0 40px ${CYAN})` }} />
          <circle cx={280 - ppX} cy={180 - ppY} r={8} fill={MAGENTA} opacity={0.8} style={{ filter: `drop-shadow(0 0 12px ${MAGENTA})` }} />
        </svg>
        <div style={{ position: "absolute", top: 40, left: "50%", transform: `translate(-50%, 0) scale(${nhS})`, opacity: nhO, zIndex: 10 }}>
          <div style={{ backgroundColor: RED, border: "3px solid #FFF", borderRadius: 14, padding: "12px 22px", boxShadow: `0 0 40px ${RED}, 0 0 80px ${RED}88`, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 }}>
            <span style={{ color: "#FFF", fontFamily: "'Cairo',sans-serif", fontSize: 32, fontWeight: 900, textAlign: "center", lineHeight: 1.1 }}>ممنوع<br />للبشر</span>
          </div>
          <div style={{ position: "absolute", inset: -15, border: `2px solid ${RED}`, borderRadius: 20, opacity: flO, transform: `scale(${flSc})`, pointerEvents: "none" }} />
        </div>
      </div>
      <div style={{ transform: `translateX(${xB}px)`, opacity }}>
        <BotCard lines={LB} label="[BOT_BETA]" color={MAGENTA} rotY={rotB} side="right" lf={lf} />
      </div>
    </div>
  );
};

// ─── 3. FREELANCER SURVIVAL (High-End Kinetic Typography) ─────────────────────
const FreelancerSurvivalV: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const lf = frame - delay;
  if (lf < 0) return null; const xE = exitFrame - delay; if (lf > xE) return null;
  const exitP = interpolate(lf, [xE - 10, xE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const words = ["فريلانسر", "أو", "مطوّر؟"];
  
  // Sine Wave Data Noise
  const wavePoints1 = Array.from({ length: 41 }).map((_, i) => `${i * 10},${50 + Math.sin(i * 0.2 + lf * 0.15) * 35}`).join(" L ");
  const wavePoints2 = Array.from({ length: 41 }).map((_, i) => `${i * 10},${50 + Math.cos(i * 0.25 - lf * 0.1) * 25}`).join(" L ");

  const tLf = lf - 22;
  const sliceSpring = spring({ frame: Math.max(0, tLf), fps, config: { damping: 14, stiffness: 220 } });
  const topX = interpolate(sliceSpring, [0, 1], [-300, 0]);
  const botX = interpolate(sliceSpring, [0, 1], [300, 0]);

  return (
    <div style={{ position: "absolute", top: "35%", left: 0, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 150, opacity: 1 - exitP }}>
      
      {/* 3D Background Sine Waves */}
      <div style={{ position: "absolute", top: -80, left: "50%", marginLeft: -200, width: 400, height: 100, opacity: 0.6, zIndex: -1 }}>
        <svg width="400" height="100" viewBox="0 0 400 100" style={{ filter: "drop-shadow(0 0 20px rgba(0,229,204,0.5))" }}>
          <path d={`M 0 50 L ${wavePoints1}`} fill="none" stroke={CYAN} strokeWidth={3} opacity={0.8} />
          <path d={`M 0 50 L ${wavePoints2}`} fill="none" stroke={MAGENTA} strokeWidth={2} opacity={0.6} />
        </svg>
      </div>

      {/* 3D Word-by-Word Slam */}
      <div style={{ display: "flex", gap: 15, direction: "rtl", padding: "16px 40px", backgroundColor: "rgba(0,0,0,0.7)", border: `1px solid ${CYAN}44`, borderRadius: 100, backdropFilter: "blur(15px)", boxShadow: `0 20px 50px rgba(0,0,0,0.8)` }}>
        {words.map((w, i) => {
          const wLf = lf - i * 6;
          const wSpring = spring({ frame: Math.max(0, wLf), fps, config: { damping: 12, stiffness: 180 } });
          const wZ = interpolate(wSpring, [0, 1], [600, 0]);
          const wRotX = interpolate(wSpring, [0, 1], [90, 0]);
          const wO = interpolate(wSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ transform: `perspective(800px) translateZ(${wZ}px) rotateX(${wRotX}deg)`, opacity: wO }}>
              <span style={{ fontFamily: "'Cairo',sans-serif", fontSize: 50, fontWeight: 900, color: "#FFF", textShadow: `0 0 20px ${CYAN}` }}>{w}</span>
            </div>
          );
        })}
      </div>

      {/* Kinetic Glitch Slice */}
      <div style={{ position: "relative", marginTop: 40, width: 400, height: 120, display: "flex", justifyContent: "center" }}>
        {/* TOP SLICE */}
        <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)", transform: `translateX(${topX}px)`, opacity: sliceSpring, display: "flex", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Cairo',sans-serif", fontSize: 80, fontWeight: 900, color: LIME, textShadow: `0 0 40px ${LIME}` }}>إزاي تنجو؟</span>
        </div>
        {/* BOTTOM SLICE */}
        <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)", transform: `translateX(${botX}px)`, opacity: sliceSpring, display: "flex", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Cairo',sans-serif", fontSize: 80, fontWeight: 900, color: LIME, textShadow: `0 0 40px ${LIME}` }}>إزاي تنجو؟</span>
        </div>
        {/* Impact Flash */}
        <div style={{ position: "absolute", top: "50%", left: 50, right: 50, height: 4, backgroundColor: "#FFF", opacity: tLf > 0 && tLf < 6 ? 1 : 0, boxShadow: `0 0 30px ${LIME}` }} />
      </div>

    </div>
  );
};

// ─── 4. CODE TEAR REVEAL (Original Pristine Horizontal Version, Scaled for Vertical) 
const CL = ["const res = await api.post('/data');", "function parse(x:string[]){", "  return x.map(transform);", "}", "export default async(req,res)=>{", "  const d=await db.query();", "  res.json({d});", "}", "import{useState}from 'react'", "const[v,set]=useState('')"];
const CM = ["#4EC9B0", "#DCDCAA", "#9CDCFE", "#CE9178", "#4EC9B0", "#569CD6", "#9CDCFE", "#4EC9B0", "#DCDCAA", "#6A9955"];

const CodeTearV: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const lf = frame - delay;
  if (lf < 0) return null;

  // Exact original timing logic
  const rE = spring({ frame: lf, fps, config: { damping: 14, stiffness: 220 } });
  const rY = interpolate(rE, [0, 1], [200, 0]);
  const rO = rE;

  const tearLf = lf - 49;
  const panelEntry = spring({ frame: Math.max(0, tearLf), fps, config: { damping: 16, stiffness: 200 } });
  const panelX = interpolate(panelEntry, [0, 1], [-700, 0]);
  const panelOpacity = tearLf < 0 ? 0 : 1;

  const splitX = interpolate(tearLf, [0, 30], [0, 230], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const lightBleed = interpolate(tearLf, [8, 42], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const tearGlow = interpolate(tearLf, [0, 18], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const isFlicker = [8, 10, 11, 14, 17, 18, 21, 23, 24, 27, 29, 32, 33, 36, 38, 41, 42, 45, 48, 50, 53, 54].includes(Math.floor(tearLf));
  const flickerOpacity = isFlicker ? 0.6 : 1;
  const flickerFilter = isFlicker ? `saturate(2.5) hue-rotate(-45deg) brightness(1.4) blur(1px)` : `none`;
  const flickerSkew = isFlicker ? (Math.floor(tearLf) % 2 === 0 ? -2 : 2) : 0;

  const check1 = interpolate(lf, [40, 50], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const check2 = interpolate(lf, [52, 62], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const check3 = interpolate(lf, [64, 74], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const titleW = interpolate(lf, [37, 52], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Scaled 1.4x to fit 1080px width perfectly (650 * 1.4 = 910px)
  return (
    <div style={{ position: "absolute", top: "18%", left: "50%", transform: "translateX(-50%) scale(1.4)", transformOrigin: "top center", zIndex: 140, width: 650 }}>
      {/* Code panels splitting */}
      <div style={{ position: "relative", width: 650, height: 400, overflow: "hidden", transform: `translateX(${panelX}px) skewX(${flickerSkew}deg)`, opacity: panelOpacity === 0 ? 0 : flickerOpacity, filter: flickerFilter }}>
        <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: `${lightBleed * 300}px`, height: `${lightBleed * 300}px`, borderRadius: "50%", background: `radial-gradient(circle,${CYAN}CC 0%,${CYAN}55 40%,transparent 70%)`, opacity: lightBleed * 0.85, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", clipPath: `inset(0 ${splitX}px 0 0)`, overflow: "hidden", backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(20px)", border: `2px solid ${CYAN}44`, borderRadius: "16px 0 0 16px", padding: "18px 16px", boxSizing: "border-box", boxShadow: `inset 0 0 50px ${CYAN}22,-10px 0 30px rgba(0,0,0,0.9)` }}>
          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom,transparent,${CYAN},transparent)`, opacity: 0.6 }} />
          {CL.slice(0, 5).map((l, i) => <div key={i} style={{ fontFamily: "monospace", fontSize: 18, color: CM[i], marginBottom: 11, whiteSpace: "nowrap" }}>{l}</div>)}
        </div>
        <div style={{ position: "absolute", top: 0, right: 0, width: "50%", height: "100%", clipPath: `inset(0 0 0 ${splitX}px)`, overflow: "hidden", backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(20px)", border: `2px solid ${MAGENTA}44`, borderRadius: "0 16px 16px 0", padding: "18px 16px", boxSizing: "border-box", boxShadow: `inset 0 0 50px ${MAGENTA}22,10px 0 30px rgba(0,0,0,0.9)` }}>
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom,transparent,${MAGENTA},transparent)`, opacity: 0.6 }} />
          {CL.slice(5).map((l, i) => <div key={i} style={{ fontFamily: "monospace", fontSize: 18, color: CM[i + 5], marginBottom: 11, whiteSpace: "nowrap" }}>{l}</div>)}
        </div>
        <div style={{ position: "absolute", top: 0, left: "calc(50% - 4px)", width: 8, height: "100%", background: `linear-gradient(to bottom,transparent,${CYAN},#FFF 50%,${CYAN},transparent)`, boxShadow: `0 0 30px ${CYAN},0 0 60px ${CYAN}88`, opacity: tearGlow * (1 - splitX / 230) }} />
      </div>

      {/* PRODUCT CARD (Original Custom SVG Glow Border, No ShimmerEdgeBox Clipping) */}
      <div style={{ transform: `translateY(${rY}px) translateZ(0)`, opacity: rO, marginTop: -55, position: "relative", zIndex: 2, willChange: "transform, opacity" }}>
        <div style={{ position: "relative", backgroundColor: "rgba(8,12,18,0.95)", border: `2px solid ${CYAN}55`, borderRadius: 24, padding: "30px 40px", boxShadow: `0 30px 60px rgba(0,0,0,0.9), inset 0 0 60px ${CYAN}22` }}>
          <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 22, pointerEvents: "none", overflow: "visible", zIndex: 10 }}>
            <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="22" ry="22" fill="none" pathLength="100" stroke={CYAN} strokeWidth="3" strokeDasharray="15 85" strokeDashoffset={-((lf * 0.5) % 100)} style={{ filter: `drop-shadow(0px 0px 8px ${CYAN})` }} />
            <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="22" ry="22" fill="none" pathLength="100" stroke={MAGENTA} strokeWidth="3" strokeDasharray="15 85" strokeDashoffset={-((lf * 0.5 + 50) % 100)} style={{ filter: `drop-shadow(0px 0px 8px ${MAGENTA})` }} />
          </svg>
          <div dir="rtl" style={{ display: "flex", gap: 12, marginBottom: 16, borderBottom: `1px solid ${CYAN}33`, paddingBottom: 12, alignItems: "center" }}>
            {[RED, LIME, CYAN].map((c, i) => <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: c, filter: `drop-shadow(0 0 8px ${c})` }} />)}
            <span style={{ marginRight: 12, color: CYAN, fontFamily: "'Cairo', sans-serif", fontSize: 34, fontWeight: 900, textShadow: `0 0 15px ${CYAN}` }}>[بروتوكول_النجاة]</span>
          </div>
          <div dir="rtl" style={{ marginBottom: 16, clipPath: `inset(0 0 0 ${titleW}%)` }}>
            <span style={{ fontFamily: "'Cairo',sans-serif", fontSize: 44, fontWeight: 900, color: "#FFF", textShadow: `0 0 25px ${CYAN}88` }}>
              بيع <span style={{ color: RED, textDecoration: "line-through", opacity: 0.55, fontSize: 38 }}>الكود</span> ... <span style={{ color: CYAN }}>النتائج</span>
            </span>
          </div>
          <div dir="rtl" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[{ label: "تسليم المنتج جاهزاً للعميل", icon: "📦", prog: check1, col: LIME }, { label: "قيمة قابلة للقياس والنمو", icon: "📈", prog: check2, col: LIME }, { label: "أنت المايسترو... مش البرمجة", icon: "🎯", prog: check3, col: LIME }].map(({ label, icon, prog, col }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, opacity: prog, transform: `translateX(${interpolate(prog, [0, 1], [30, 0])}px)` }}>
                <span style={{ fontSize: 26 }}>{icon}</span>
                <span style={{ fontFamily: "'Cairo',sans-serif", fontSize: 30, fontWeight: 700, color: "#FFF" }}>{label}</span>
                <span style={{ color: col, fontSize: 28, fontWeight: 900, marginRight: "auto", textShadow: `0 0 12px ${col}` }}>✓</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN COMPOSITION (Synchronized Full-Screen Sequential Cut) ───────────────
export const ShortScene5Vertical: React.FC = () => {
  const frame = useCurrentFrame();

  const cameraPush = interpolate(frame, [0, 600], [1.0, 1.2], { extrapolateRight: "clamp" });
  const bgImage = staticFile("images/episode3/vertical-studio-wide.jpeg");

  // Exact pose timing from Topic5Survival
  const P1 = 185, P2 = 361, P3 = 445;
  const mazenImg = frame < P1
    ? staticFile("images/episode3/mazen-v-pose1-warning.png")
    : frame < P2
    ? staticFile("images/episode3/mazen-v-pose2-analytic.png")
    : frame < P3
    ? staticFile("images/episode3/mazen-v-pose3-questioning.png")
    : staticFile("images/episode3/mazen-v-pose4-confident.png");

  // RGB Glitch on cuts
  const cut = (c: number) => frame - c;
  const isCut = (cut(P1) >= 0 && cut(P1) < 5) || (cut(P2) >= 0 && cut(P2) < 5) || (cut(P3) >= 0 && cut(P3) < 5);
  const caX = isCut ? Math.sin(Math.floor(frame / 2) * 45.2) * 80 : 0;
  const blink = Math.floor(frame / 15) % 2 === 0;

  // CINEMATIC FOCUS PULL
  // Sharp Windows (Pose Snaps): 170-195 (Snap 185), 350-365 (Snap 361), 435-455 (Snap 445)
  const uiFocus = interpolate(
    frame,
    [45, 60, 160, 175, 200, 215, 345, 355, 370, 380, 435, 445, 455, 465],
    [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const mazenBlur = interpolate(uiFocus, [0, 1], [3, 16]);
  const mazenDarken = interpolate(uiFocus, [0, 1], [1.05, 0.35]);
  const mazenScale = interpolate(uiFocus, [0, 1], [1, 1.08]);
  const bgParallaxScale = interpolate(frame, [0, 570], [1.02, 1.15], { extrapolateRight: "clamp" });
  const scriptSaturation = interpolate(frame, [0, 185, 361, 445], [0.85, 0.65, 0.75, 0.95], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const scriptHue = interpolate(frame, [0, 185, 361, 445], [0, -25, -10, 15], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const showNet = frame >= 45 && frame < 175;
  const showBot = frame >= 200 && frame < 360;
  const showFreelancer = frame >= 370 && frame < 435;
  const showCode = frame >= 480;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#030308" }}>
      <Audio src={staticFile("audio/episode3/mazen-scene5.mp3")} startFrom={0} endAt={147} />
      <Sequence from={170}><Audio src={staticFile("audio/episode3/mazen-scene5.mp3")} startFrom={147} /></Sequence>

      <AbsoluteFill style={{ transform: `scale(${cameraPush})`, transformOrigin: "center center", willChange: "transform" }}>
        
        {/* STUDIO BG */}
        {/* STUDIO BG */}
        <AbsoluteFill style={{ filter: `blur(${mazenBlur}px) brightness(${mazenDarken * 0.65}) saturate(${scriptSaturation}) sepia(0.3) hue-rotate(${scriptHue}deg)`, transform: `scale(${bgParallaxScale})`, transformOrigin: "center center", willChange: "transform, filter" }}>
          <img src={bgImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>

        {/* VHS grain */}
        <AbsoluteFill style={{ pointerEvents: "none", zIndex: 5 }}>
          <svg style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.05, mixBlendMode: "overlay" }}>
            <filter id="vn"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" /></filter>
            <rect width="100%" height="100%" filter="url(#vn)" />
          </svg>
        </AbsoluteFill>

        {/* MAZEN HERO — 100% visible, dynamically blurs when UI is active to create cinematic depth */}
        <AbsoluteFill style={{ zIndex: 10, pointerEvents: "none", transform: `scale(${bgParallaxScale + mazenScale - 1})`, filter: `blur(${mazenBlur}px) brightness(${mazenDarken}) contrast(1.15)`, willChange: "transform, filter", transformOrigin: "center center" }}>
          <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
          {isCut && <>
            <AbsoluteFill style={{ transform: `translateX(${caX}px)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-50deg) saturate(10)" }}>
              <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
            </AbsoluteFill>
            <AbsoluteFill style={{ transform: `translateX(${-caX}px)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-20deg) saturate(10)" }}>
              <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
            </AbsoluteFill>
          </>}
        </AbsoluteFill>

        {/* Ambient Dust Motes & Anamorphic Light Leaks (Premium Depth of Field) */}
        <AbsoluteFill style={{ zIndex: 12, opacity: uiFocus * 0.8, pointerEvents: "none" }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", width: Math.random() * 8 + 4, height: Math.random() * 8 + 4, borderRadius: "50%", backgroundColor: "#FFF", filter: "blur(2px)", opacity: Math.random() * 0.5 + 0.2, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, transform: `translateY(${-(frame % 300) * (Math.random() * 2 + 1)}px)`, willChange: "transform" }} />
          ))}
          {/* Cyan Anamorphic Flare */}
          <div style={{ position: "absolute", top: "30%", left: "-10%", width: "120%", height: 100, background: `linear-gradient(90deg, transparent, ${CYAN}44, transparent)`, filter: "blur(30px)", transform: `rotate(-15deg)`, mixBlendMode: "screen" }} />
        </AbsoluteFill>

        {/* Cold world overlay */}
        <AbsoluteFill style={{ zIndex: 15, pointerEvents: "none", backgroundColor: `rgba(0,35,45,${uiFocus * 0.45})`, mixBlendMode: "multiply", boxShadow: `inset 0 0 150px rgba(0,0,0,${uiFocus * 0.7})` }} />

        {/* UI HEROES */}
        <AbsoluteFill style={{ zIndex: 20 }}>
          {showNet && <VerticalServerCrash delay={60} exitFrame={160} />}
          {showBot && <BotDuelV delay={215} exitFrame={350} />}
          {showFreelancer && <FreelancerSurvivalV delay={370} exitFrame={435} />}
          {showCode && <CodeTearV delay={480} />}
        </AbsoluteFill>

      </AbsoluteFill>

      {/* HUD & Censor Bars */}
      <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999 }}>
        <div style={{ position: "absolute", top: 60, left: 50, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: blink ? RED : "#660018", boxShadow: blink ? `0 0 20px ${RED}` : "none" }} />
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 28, letterSpacing: 4, fontFamily: "monospace" }}>LIVE</span>
        </div>
        <div style={{ position: "absolute", inset: 0, transform: "scale(1.4)", transformOrigin: "bottom left" }}>
          <NewsChyron label="إنذار أخير" source="الإنترنت يحتضر" delayFrames={12} exitFrame={88} isMaskRTL={true} />
        </div>
        
        {/* Premium Censor Bars (Wood Strike Style) - Anchored to Bottom Safe Zone */}
        <VerticalCensorBarText text="الإنترنت بيحتضِر" subtext="تحذير خطير" color={CYAN} delay={114} exitFrame={156} bottom="18%" />
        <VerticalCensorBarText text="70% روبوت ↔ روبوت" subtext="محتوى آلي مغلق" color={RED} delay={240} exitFrame={320} bottom="18%" />
        <VerticalCensorBarText text="بيع النتايج... مش الكود" subtext="النجاة للذكي" color={LIME} delay={480} exitFrame={560} bottom="18%" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
