import React from "react";
import {
  AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig,
  spring, interpolate, staticFile, random, OffthreadVideo
} from "remotion";

// ─── FILM GRAIN ───────────────────────────────────────────────────────────────
const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = 0.04 + random(`op-${frame}`) * 0.025;
  return (
    <AbsoluteFill style={{
      zIndex: 999, pointerEvents: "none", opacity, mixBlendMode: "overlay",
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      transform: `translate(${random(`x-${frame}`) * 2}px,${random(`y-${frame}`) * 2}px)`
    }} />
  );
};

// ─── MATRIX CODE RAIN (subtle, premium, deterministic) ───────────────────────
const CHARS = "٠١٢٣٤٥٦٧٨٩01█▓▒░10AIX·■□∧∨⊢";
const MatrixRain: React.FC = () => {
  const frame = useCurrentFrame();
  const cols = 18;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 60, overflow: "hidden" }}>
      {new Array(cols).fill(0).map((_, col) => {
        const xPct       = (col / cols) * 96 + random(`xoff-${col}`) * 3;
        const speed      = 0.22 + random(`spd-${col}`) * 0.4;
        const phaseOff   = random(`phase-${col}`) * 90;
        const charCount  = 4 + Math.floor(random(`len-${col}`) * 7);
        const fontSize   = 10 + Math.floor(random(`fs-${col}`) * 5);
        const baseOp     = 0.06 + random(`op-${col}`) * 0.14;   // max 0.20 — very subtle
        const color      = random(`col-${col}`) > 0.4 ? "#22d3ee" : "#fbbf24";
        const refreshRate = 4 + Math.floor(random(`ref-${col}`) * 8);
        const jitter     = (random(`jit-${col}`) - 0.5) * 20;
        // Column flicker every 10 frames
        const flickerOn  = random(`fk-${col}-${Math.floor(frame / 10)}`) > 0.1;
        const colOpacity = flickerOn ? baseOp * (0.5 + random(`fkv-${col}-${Math.floor(frame / 10)}`) * 0.5) : 0;
        const yOffset    = ((frame * speed + phaseOff) % 140) - 25;
        return (
          <div key={col} style={{
            position: "absolute", left: `${xPct}%`, top: 0, height: "100%",
            display: "flex", flexDirection: "column", gap: 1,
            transform: `translateY(${yOffset}%) translateX(${jitter}px)`,
            willChange: "transform"
          }}>
            {new Array(charCount).fill(0).map((__, row) => {
              const charIdx = Math.floor(random(`ch-${col}-${row}-${Math.floor(frame / refreshRate)}`) * CHARS.length);
              const trail   = row === 0 ? 1 : Math.pow(1 - row / charCount, 2);
              return (
                <span key={row} style={{
                  fontSize, fontFamily: "'Courier New', monospace",
                  fontWeight: row < 2 ? 700 : 400,
                  color: row === 0 ? "#fff" : color,
                  opacity: trail * colOpacity * 8,
                  textShadow: row < 2 ? `0 0 6px ${color}` : "none",
                  lineHeight: 1.3, userSelect: "none", display: "block"
                }}>
                  {CHARS[charIdx]}
                </span>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── 35MM LIGHT LEAK TRANSITION ───────────────────────────────────────────────
const LightLeakTransition: React.FC<{ frameIn: number }> = ({ frameIn }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - frameIn);
  if (local === 0 || local > 20) return null;
  const flash = interpolate(local, [0, 5, 10, 20], [0, 1, 0.8, 0]);
  const blur  = interpolate(local, [0, 5, 20], [0, 20, 0]);
  const scale = interpolate(local, [0, 20], [1, 1.1]);
  return (
    <AbsoluteFill style={{ zIndex: 100, pointerEvents: "none", mixBlendMode: "screen", transform: `scale(${scale})` }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "#fff", opacity: flash }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 78% 20%, rgba(255,100,0,0.9) 0%, transparent 55%)", opacity: flash, filter: `blur(${blur}px)` }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 80%, rgba(255,0,60,0.7) 0%, transparent 50%)", opacity: flash, filter: `blur(${blur}px)` }} />
    </AbsoluteFill>
  );
};

// ─── MAIN VIDEO LAYER — SNAP-ZOOM + SHAKE + LENS BREATH ──────────────────────
const FAST_CUTS = [152, 436, 583];
const OUTRO_FRAME = 758;

const VideoBase: React.FC<{ pauseAt?: number }> = ({ pauseAt }) => {
  const frame = useCurrentFrame();
  // pauseAt: freeze at a specific global frame (used in outro)
  const time = pauseAt !== undefined ? pauseAt / 30 : frame / 30;
  return (
    <OffthreadVideo
      src={staticFile("youtube-assets/version-2.mp4")}
      pauseWhenBuffering
      // seek to the correct time
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      // Use startFrom to offset — when pauseAt is set we render as still
      startFrom={pauseAt !== undefined ? pauseAt : 0}
      // When paused: set endAt = startFrom + 1 to show single frame
      endAt={pauseAt !== undefined ? pauseAt + 1 : undefined}
    />
  );
};

// ─── OUTRO ATMOSPHERIC BACKGROUND ────────────────────────────────────────────
// Rich procedural scene mirroring the golden-hour stadium vibe + brand identity.
// No frozen-video dependency — always renders correctly.
const OutroBackground: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-based

  // Slow atmospheric breathing
  const breathe  = Math.sin(frame * 0.04) * 0.06;
  const breathe2 = Math.sin(frame * 0.025 + 1.2) * 0.05;

  // Fade in with the card reveal
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      {/* Deep cinematic base — dark blue-black echoing a lit stadium at dusk */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #0a0d14 0%, #070b10 40%, #0d0a05 100%)" }} />

      {/* Golden-hour sun halo — top-center, echoing the final shot's sun position */}
      <div style={{
        position: "absolute", top: "-10%", left: "50%",
        width: `${600 + breathe * 200}px`, height: `${600 + breathe * 200}px`,
        marginLeft: "-300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(251,191,36,0.18) 0%, rgba(255,140,0,0.10) 35%, rgba(180,60,0,0.04) 60%, transparent 80%)",
        filter: "blur(60px)"
      }} />

      {/* Wide warm stadium horizon glow — bottom band like a floodlit pitch */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, width: "100%", height: "45%",
        background: `radial-gradient(ellipse at 50% 120%, rgba(251,191,36,${0.10 + breathe2 * 0.04}) 0%, rgba(180,80,0,0.06) 40%, transparent 70%)`,
        filter: "blur(40px)"
      }} />

      {/* Brand-left: Teal signal bloom — satellite / AI data feed */}
      <div style={{
        position: "absolute", top: "30%", left: "-5%",
        width: `${500 + breathe * 150}px`, height: `${500 + breathe * 150}px`,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, rgba(34,211,238,0.03) 50%, transparent 75%)",
        filter: "blur(50px)"
      }} />

      {/* Brand-right: Magenta/pink echo — second AI channel */}
      <div style={{
        position: "absolute", top: "25%", right: "-5%",
        width: `${420 + breathe2 * 120}px`, height: `${420 + breathe2 * 120}px`,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(236,72,153,0.07) 0%, rgba(236,72,153,0.02) 50%, transparent 75%)",
        filter: "blur(45px)"
      }} />

      {/* Center depth haze — gives the sense of stadium depth receding to center */}
      <div style={{
        position: "absolute", top: "35%", left: "50%", marginLeft: "-250px",
        width: "500px", height: "200px",
        background: "radial-gradient(ellipse, rgba(251,191,36,0.05) 0%, transparent 70%)",
        filter: "blur(30px)"
      }} />

      {/* Vignette — cinematic frame darkening */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.75) 100%)"
      }} />

      {/* Subtle scanline texture — ties to the glitch/AI language */}
      <div style={{
        position: "absolute", inset: 0,
        background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.06), rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px)",
        pointerEvents: "none"
      }} />
    </AbsoluteFill>
  );
};

const MainVideoLayer: React.FC<{ outro?: boolean }> = ({ outro }) => {
  const frame     = useCurrentFrame();

  let videoScale  = 1;
  let videoRotate = 0;
  let videoBlur   = 0;
  let shakeX      = 0;
  let shakeY      = 0;

  // Fast whip-pan impacts at mid-video cuts
  for (const cut of FAST_CUTS) {
    if (frame >= cut - 4 && frame < cut) {
      const p    = (frame - (cut - 4)) / 4;
      videoScale  = 1 + p * 0.8;
      videoRotate = p * -15;
      videoBlur   = p * 15;
    }
    if (frame >= cut && frame < cut + 12) {
      const decay = 1 - (frame - cut) / 12;
      shakeX = Math.sin(frame * 5.1 + cut) * 30 * decay;
      shakeY = Math.cos(frame * 4.7 + cut) * 30 * decay;
    }
  }
  // Cinematic lens-breath into the outro (last 30 frames of Phase 1)
  if (!outro && frame >= OUTRO_FRAME - 30 && frame < OUTRO_FRAME) {
    const p    = (frame - (OUTRO_FRAME - 30)) / 30;
    const ease = p * p * (3 - 2 * p);
    videoScale = 1 + ease * 0.10;
    videoBlur  = ease * 3;
  }
  // Gentle cinematic settle after the outro cut
  if (outro) {
    const decay = Math.max(0, 1 - frame / 20);
    shakeX = Math.sin(frame * 2.2) * 7 * decay;
    shakeY = Math.cos(frame * 1.8) * 7 * decay;
  }

  if (outro) return null; // Outro uses OutroBackground instead

  return (
    <div style={{
      width: "100%", height: "100%", position: "absolute",
      transform: `scale(${videoScale}) rotate(${videoRotate}deg) translate(${shakeX}px, ${shakeY}px)`,
      filter: `blur(${videoBlur}px)`,
      willChange: "transform, filter",
      transformOrigin: "center center"
    }}>
      <OffthreadVideo src={staticFile("youtube-assets/version-2.mp4")} pauseWhenBuffering style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%, rgba(0,0,0,0.35) 100%)" }} />
    </div>
  );
};

// ─── HOLOGRAPHIC TROPHY REVEAL ────────────────────────────────────────────────
const TrophyHolographic: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-based inside Outro Sequence
  const breathe     = Math.sin(frame * 0.05) * 0.03;
  const scale       = interpolate(frame, [0, 40], [1.12, 1], { extrapolateRight: "clamp" }) + breathe;
  const ghostOffset = interpolate(frame, [0, 20, 45], [70, -15, 0], { extrapolateRight: "clamp" });
  const opacity     = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const clipBottom  = interpolate(frame, [0, 30], [100, 0], { extrapolateRight: "clamp" });
  const scanY       = interpolate(frame, [0, 30], [-5, 105], { extrapolateRight: "clamp" });
  const floatY      = Math.sin(frame * 0.04) * 10;
  return (
    <AbsoluteFill style={{ zIndex: 500, pointerEvents: "none", justifyContent: "center", alignItems: "center" }}>
      <div style={{
        transform: `translateY(${floatY}px) scale(${scale})`,
        clipPath: `inset(0 0 ${clipBottom}% 0)`,
        opacity, position: "relative", width: 400, height: 600,
        display: "flex", justifyContent: "center", alignItems: "center",
        willChange: "transform, clip-path"
      }}>
        {frame < 33 && (
          <div style={{
            position: "absolute", top: `${scanY}%`, left: -60, width: "140%", height: 6,
            background: "linear-gradient(to right, transparent, #fbbf24, #fff, #fbbf24, transparent)",
            boxShadow: "0 0 30px #fbbf24, 0 0 60px rgba(255,255,255,0.4)", zIndex: 10
          }} />
        )}
        <img src={staticFile("youtube-assets/worldcup-trophy.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", transform: `translateX(${ghostOffset}px)`, filter: "drop-shadow(0 0 18px #22d3ee) hue-rotate(180deg)", mixBlendMode: "screen", opacity: 0.5 }} />
        <img src={staticFile("youtube-assets/worldcup-trophy.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", transform: `translateX(${-ghostOffset}px)`, filter: "drop-shadow(0 0 18px #ec4899) hue-rotate(-90deg)", mixBlendMode: "screen", opacity: 0.5 }} />
        <img src={staticFile("youtube-assets/worldcup-trophy.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 0 55px rgba(251,191,36,0.6))", zIndex: 5 }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── FILM DAMAGE GLITCH (fully deterministic) ─────────────────────────────────
const FilmDamageGlitch: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker   = random(`flicker-${frame}`) > 0.88 ? 0.1 : 0;
  const rollY     = (frame * 12) % 100;
  const showSlice = random(`show-${frame}`) > 0.72;
  const sliceY    = random(`sliceY-${frame}`) * 100;
  const sliceH    = random(`sliceH-${frame}`) * 7 + 2;
  const sliceX    = (random(`sliceX-${frame}`) - 0.5) * 28;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 600, mixBlendMode: "screen" }}>
      <div style={{ position: "absolute", width: "100%", height: "200%", top: "-50%", background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 5px)", transform: `translateY(${rollY}px)` }} />
      {showSlice && <div style={{ position: "absolute", top: `${sliceY}%`, width: "100%", height: `${sliceH}%`, backgroundColor: "rgba(34,211,238,0.07)", transform: `translateX(${sliceX}px)` }} />}
      <div style={{ position: "absolute", inset: 0, backgroundColor: "#fff", opacity: flicker }} />
    </AbsoluteFill>
  );
};

// ─── HOLOGRAPHIC OUTRO CARD ───────────────────────────────────────────────────
const HolographicOutro: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-based inside Outro Sequence
  const bgOpacity  = interpolate(frame, [0, 25], [0, 0.70], { extrapolateRight: "clamp" });
  const textScale  = interpolate(frame, [0, 30], [1.05, 1], { extrapolateRight: "clamp" });
  const baseOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const textOpacity = (frame > 4 && frame < 14 && frame % 3 === 0) ? 0.2 : baseOpacity;
  const logoFloat  = Math.sin(frame * 0.05) * 8;
  const scanlineY  = interpolate(frame, [8, 38], [-8, 110], { extrapolateRight: "clamp" });
  const clipBottom = interpolate(frame, [8, 38], [100, 0], { extrapolateRight: "clamp" });
  const showScan   = frame > 8 && frame < 42;
  const auraPulse  = 0.14 + Math.sin(frame * 0.12) * 0.07;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 200 }}>
      <div style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: `rgba(0,0,0,${bgOpacity})`, backdropFilter: `blur(${bgOpacity * 7}px)` }} />
      <div style={{ position: "absolute", width: "100%", height: "100%", background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.07), rgba(0,0,0,0.07) 2px, transparent 2px, transparent 4px)", pointerEvents: "none" }} />
      <div style={{ transform: `scale(${textScale})`, opacity: textOpacity, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10, position: "relative", clipPath: frame > 8 ? `inset(0 0 ${clipBottom}% 0)` : "none" }}>
        {showScan && <div style={{ position: "absolute", top: `${scanlineY}%`, width: "160%", left: "-30%", height: 3, background: "linear-gradient(to right, transparent, #22d3ee, #fff, #22d3ee, transparent)", boxShadow: "0 0 28px #22d3ee", zIndex: 100 }} />}
        <div style={{ position: "absolute", top: 50, width: 600, height: 200, background: `radial-gradient(ellipse, rgba(251,191,36,${auraPulse}) 0%, transparent 70%)`, filter: "blur(28px)" }} />
        <div style={{ fontSize: 160, fontWeight: 900, color: "#fff", fontFamily: "'Inter', sans-serif", letterSpacing: 20, marginTop: 100, marginBottom: 40, textShadow: "0 10px 40px rgba(251,191,36,0.65), -5px 0 18px rgba(34,211,238,0.45), 5px 0 18px rgba(236,72,153,0.45)", position: "relative" }}>
          2026
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", transform: `translateY(${logoFloat}px)` }}>
          <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.22) 0%, rgba(236,72,153,0.14) 55%, transparent 80%)", filter: "blur(32px)" }} />
          <div style={{ position: "relative", width: 160, height: 160, marginBottom: 16 }}>
            <img src={staticFile("youtube-assets/heart-teal.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(-6px 0 10px rgba(34,211,238,0.75))" }} />
            <img src={staticFile("youtube-assets/heart-pink.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(6px 0 10px rgba(236,72,153,0.75))" }} />
          </div>
          <h1 style={{ margin: 0, fontSize: 62, fontWeight: 900, color: "#fff", letterSpacing: 4, fontFamily: "'Tajawal','Cairo','Noto Sans Arabic',sans-serif", textShadow: "0 0 50px rgba(255,255,255,0.4), 0 8px 30px rgba(0,0,0,0.9)", direction: "rtl" }}>حرفين ولكن</h1>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 8, textTransform: "uppercase", marginTop: 6 }}>
            <span style={{ color: "#22d3ee", textShadow: "0 0 22px rgba(34,211,238,1)", marginRight: 8 }}>A.I.</span>
            <span style={{ color: "#fbbf24", textShadow: "0 0 22px rgba(251,191,36,1)" }}>NEWS</span>
          </div>
          <div style={{ marginTop: 28, background: "linear-gradient(135deg,rgba(255,255,255,0.95),rgba(240,240,240,0.85))", padding: "10px 32px", borderRadius: "50px", transform: "skew(-8deg)", boxShadow: "0 8px 28px rgba(0,0,0,0.4), 0 0 0 1px rgba(34,211,238,0.25)" }}>
            <p style={{ margin: 0, fontSize: 30, fontWeight: 900, color: "#000", textAlign: "center", fontFamily: "'Tajawal','Cairo','Noto Sans Arabic',sans-serif", direction: "rtl", transform: "skew(8deg)" }}>الذكاء الاصطناعي بلغتنا</p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── KINETIC TEXT — shadow stack + chromatic glitch (no Math.random) ──────────
const KineticText: React.FC<{
  text: string; startFrame: number; endFrame: number;
  color?: string; size?: number; align?: "center" | "left" | "right";
}> = ({ text, startFrame, endFrame, color = "#fff", size = 80, align = "center" }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame > endFrame + 8) return null;
  const words      = text.split(" ");
  const isExiting  = frame >= endFrame;
  const exitFlick  = isExiting ? (random(`ef-${frame}`) > 0.5 ? 1 : 0.1) : 1;
  const exitOp     = frame > endFrame + 4 ? 0 : exitFlick;
  // Cinematic 3-layer hard shadow stack — NO pulsing, NO WebkitTextStroke
  const acc = color === "#22d3ee" ? "rgba(34,211,238" : color === "#fbbf24" ? "rgba(251,191,36" : "rgba(255,255,255";
  const shadow = `1px 1px 0 #000, 2px 2px 0 #000, 3px 3px 0 rgba(0,0,0,0.85), 0 7px 14px rgba(0,0,0,0.95), 0 18px 40px rgba(0,0,0,0.8), 0 0 44px ${acc},0.20)`;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", paddingBottom: "18%", alignItems: "center", paddingLeft: "60px", paddingRight: "60px", zIndex: 80, pointerEvents: "none", opacity: exitOp }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: align, gap: "16px", direction: "rtl" }}>
        {words.map((w, i) => {
          const wDelay  = startFrame + i * 3;
          if (frame < wDelay) return null;
          const local   = frame - wDelay;
          let wOp = 1;
          if (local === 0 || local === 2) wOp = 0;
          if (local === 1 || local === 3) wOp = 0.45;
          const sX = local < 4 ? 1.3 : 1;
          const sY = local < 4 ? 0.7 : 1;
          // Chromatic glitch: seeded, fires ~22% of 2-frame windows after entry
          const gs  = random(`gs-${i}-${Math.floor(frame / 2)}`);
          const isG = local > 4 && gs > 0.78;
          const gX  = isG ? (random(`gx-${i}-${frame}`) - 0.5) * 14 : 0;
          const gY  = isG ? (random(`gy-${i}-${frame}`) - 0.5) * 4  : 0;
          const glitch = isG ? `drop-shadow(${gX}px ${gY}px 0 rgba(34,211,238,0.85)) drop-shadow(${-gX}px ${-gY}px 0 rgba(236,72,153,0.85))` : "none";
          const cOp = isG && random(`co-${i}-${frame}`) > 0.6 ? 0.55 : 1;
          return (
            <span key={i} style={{
              fontSize: size, fontWeight: 900, color,
              fontFamily: "'Inter','Cairo','Noto Sans Arabic',sans-serif",
              transform: `scale(${sX},${sY})`,
              opacity: wOp * cOp,
              display: "inline-block",
              willChange: "transform,opacity,filter",
              lineHeight: 1.2,
              textShadow: shadow,
              filter: glitch
            }}>
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── MAIN V2 COMPOSITION ──────────────────────────────────────────────────────
export const ShortWorldCupV2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>

      {/* PHASE 1: Video (0 → 758) */}
      <Sequence from={0} durationInFrames={758}>
        <AbsoluteFill><MainVideoLayer /></AbsoluteFill>
      </Sequence>

      {/* PHASE 2: Outro (758 → 910) — rich atmospheric background + holographic overlay */}
      <Sequence from={758} durationInFrames={152}>
        <AbsoluteFill><OutroBackground /></AbsoluteFill>
        <HolographicOutro />
        <TrophyHolographic />
        <FilmDamageGlitch />
      </Sequence>

      {/* GLOBAL */}
      <FilmGrain />
      <MatrixRain />

      {/* 35mm light leaks at ALL cuts */}
      <LightLeakTransition frameIn={152} />
      <LightLeakTransition frameIn={436} />
      <LightLeakTransition frameIn={583} />
      <LightLeakTransition frameIn={758} />

      {/* KINETIC TEXT */}
      <KineticText text="لو الذكاء الاصطناعي" startFrame={10}  endFrame={60}  color="#fff"    size={70} />
      <KineticText text="درب منتخب كامل..."    startFrame={70}  endFrame={140} color="#22d3ee" size={80} />
      <KineticText text="هل يهزم أفضل مدرب في العالم؟" startFrame={160} endFrame={220} color="#fff"    size={60} />
      <KineticText text="أو يقدر يبني"                  startFrame={240} endFrame={290} color="#fff"    size={70} />
      <KineticText text="المنتخب المثالي؟"               startFrame={290} endFrame={400} color="#fbbf24" size={90} />
      <KineticText text="خلينا نقول على الأقل..." startFrame={440} endFrame={490} color="#fff"    size={60} />
      <KineticText text="يقدر يتوقع"               startFrame={490} endFrame={530} color="#22d3ee" size={80} />
      <KineticText text="بطل كأس العالم؟"          startFrame={530} endFrame={570} color="#fbbf24" size={90} />
      <KineticText text="هل تتوقع يقدر يعمل"      startFrame={590} endFrame={640} color="#fff"    size={70} />
      <KineticText text="واحدة من الحاجات دي؟"    startFrame={640} endFrame={690} color="#fff"    size={80} />
      <KineticText text="ولا يقدر يعملهم كلهم؟!"  startFrame={700} endFrame={750} color="#22d3ee" size={90} />

    </AbsoluteFill>
  );
};
