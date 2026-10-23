import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
  Audio
} from "remotion";
import { ShimmerEdgeBox, CensorBarText } from "./Topic1Google";
import { NewsChyron } from "./TheHook";

const CYAN    = "#00E5CC";
const MAGENTA = "#FF0055";

// ─────────────────────────────────────────────────────────────────────────────
// 1. SILENT MIRACLE (Background Kinetic Typography)
// ─────────────────────────────────────────────────────────────────────────────
const SilentMiracle: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame();
  const lf = frame - delay;
  if (lf < 0 || frame > exitFrame + 15) return null;

  const opacity = interpolate(lf, [0, 20], [0, 0.8], { extrapolateRight: "clamp" }) * interpolate(frame, [exitFrame - 15, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const moveX = interpolate(lf, [0, 500], [150, -700]);

  return (
    <div style={{ position: "absolute", top: "25%", left: "5%", zIndex: 10, opacity, transform: `translateX(${moveX}px)` }}>
      <h1 style={{
        fontFamily: "'Cairo', sans-serif", fontSize: 320, fontWeight: 900,
        color: "rgba(0, 255, 204, 0.05)", // Transparent greenish cyan
        WebkitTextStroke: `5px #00FFCC`, // Solid greenish cyan stroke
        whiteSpace: "nowrap", margin: 0, 
        textShadow: `
          0 20px 60px rgba(0,0,0,1), 
          0 50px 100px rgba(0,0,0,1), 
          0 0 50px rgba(0, 255, 204, 0.5),
          -15px -15px 0px rgba(255, 0, 85, 0.6) /* Magenta Accent */
        `
      }}>
        معجزة في صمت
      </h1>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2A. ALPHAFOLD TERMINAL (Top-Left, Arabic + English LTR)
// ─────────────────────────────────────────────────────────────────────────────
const AlphaFoldTerminal: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  const exitEnd = exitFrame - delay;
  const exitStart = exitEnd - 12;

  // Exact StrawberryTerminal pattern: single progress drives entry AND exit identically
  const progress = interpolate(
    lf,
    [0, 12, exitStart, exitEnd],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  const scale = interpolate(progress, [0, 1], [0, 1]);
  const opacity = progress;

  if (lf > exitEnd) return null;

  return (
    <div style={{
      position: "absolute", top: "15%", left: "5%", right: "auto",
      transform: `scale(${scale})`, opacity, transformOrigin: "left top", zIndex: 120
    }}>
      <ShimmerEdgeBox width={750} height={360} frameOffset={delay} primaryColor={CYAN} secondaryColor={MAGENTA}>
        <div style={{ padding: 30, width: "100%", height: "100%", boxSizing: "border-box" }}>
          {/* Mac-Style Header */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20, borderBottom: `1px solid rgba(0, 229, 204, 0.3)`, paddingBottom: 15, alignItems: "center" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: MAGENTA, boxShadow: `0 0 10px ${MAGENTA}` }} />
            <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#FFBB00", boxShadow: "0 0 10px #FFBB00" }} />
            <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: CYAN, boxShadow: `0 0 10px ${CYAN}` }} />
            <span style={{ marginLeft: 15, color: CYAN, fontSize: 24, fontWeight: 900, fontFamily: "monospace", textShadow: `0 0 12px ${CYAN}88` }}>[MEDICAL_AI_NODE]</span>
          </div>

          {/* Terminal Content - Strawberry pattern: dual absolute divs for Arabic+English split */}
          <div dir="rtl" style={{ display: "flex", flexDirection: "column", gap: 15 }}>

            {/* Line 1: Arabic RTL wipe then English LTR wipe */}
            <div style={{ position: "relative", color: "#111", fontFamily: "'Cairo', sans-serif", fontSize: 38, fontWeight: 800, lineHeight: 1.6 }}>
              <div style={{ visibility: "hidden" }}>{"> تهيئة بيئة DeepMind ..."}</div>
              {/* Arabic wipes in RTL [8→20] */}
              <div style={{ position: "absolute", top: 0, right: 0, width: "100%", clipPath: `inset(0 0 0 ${interpolate(lf, [8, 20], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%)` }}>
                {"> تهيئة بيئة "}
              </div>
              {/* English wipes in LTR [20→32] — starts exactly when Arabic ends */}
              <div style={{ position: "absolute", top: 0, right: 0, width: "100%", clipPath: `inset(0 ${interpolate(lf, [20, 32], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}% 0 0)` }}>
                <span style={{ visibility: "hidden" }}>{"> تهيئة بيئة "}</span>
                <span style={{ display: "inline-block", direction: "ltr", color: CYAN, textShadow: `0 0 15px ${CYAN}`, fontWeight: 900 }}>DeepMind</span>
                {" ..."}
              </div>
            </div>

            {/* Line 2: Arabic RTL wipe then English LTR wipe */}
            <div style={{ position: "relative", color: "#111", fontFamily: "'Cairo', sans-serif", fontSize: 38, fontWeight: 800, lineHeight: 1.6 }}>
              <div style={{ visibility: "hidden" }}>{"> بدء تشغيل نموذج AlphaFold 3 ..."}</div>
              <div style={{ position: "absolute", top: 0, right: 0, width: "100%", clipPath: `inset(0 0 0 ${interpolate(lf, [28, 38], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%)` }}>
                {"> بدء تشغيل نموذج "}
              </div>
              <div style={{ position: "absolute", top: 0, right: 0, width: "100%", clipPath: `inset(0 ${interpolate(lf, [36, 48], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}% 0 0)` }}>
                <span style={{ visibility: "hidden" }}>{"> بدء تشغيل نموذج "}</span>
                <span style={{ display: "inline-block", direction: "ltr", color: MAGENTA, textShadow: `0 0 15px ${MAGENTA}`, fontWeight: 900 }}>AlphaFold 3</span>
                {" ..."}
              </div>
            </div>

            {/* Line 3 (Success - pure Arabic) */}
            <div style={{
              color: CYAN, fontFamily: "'Cairo', sans-serif", fontSize: 38, fontWeight: 900,
              lineHeight: 1.6,
              clipPath: `inset(0 0 0 ${interpolate(lf, [50, 62], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}%)`,
              textShadow: `0 0 15px ${CYAN}99`
            }}>
              {"> تم توقع جزيئات الحياة بنجاح: 100%"}
            </div>

          </div>
        </div>
      </ShimmerEdgeBox>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2B. SPIRAL DNA HOLOGRAM (Predicting Molecules of Life)
// ─────────────────────────────────────────────────────────────────────────────
const SpiralDNAWidget: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  const exitEnd = exitFrame - delay;
  const exitStart = exitEnd - 12;

  // Exact StrawberryTerminal pattern: single progress drives entry AND exit identically
  const progress = interpolate(
    lf,
    [0, 12, exitStart, exitEnd],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  
  const scale = interpolate(progress, [0, 1], [0.5, 1]);
  const opacity = progress;

  if (lf > exitEnd) return null;

  // "Predict" moment happens at local frame 45. Before that, it's chaotic.
  const orderProgress = spring({ frame: Math.max(0, lf - 45), fps, config: { damping: 12, stiffness: 150 } });
  const chaos = interpolate(orderProgress, [0, 1], [1, 0]);
  
  const points = 16;
  const spacing = 35;
  const amplitude = 60;
  const totalWidth = (points - 1) * spacing;

  const moveUpSpring = spring({ frame: Math.max(0, frame - 326), fps, config: { damping: 18, stiffness: 200 } });
  const moveUpY = interpolate(moveUpSpring, [0, 1], [0, -390]);

  return (
    <div style={{
      position: "absolute", top: "calc(15% + 390px)", left: "5%", right: "auto",
      transform: `scale(${scale}) translateY(${moveUpY}px)`, opacity, transformOrigin: "left center", zIndex: 120
    }}>
      <div style={{
        width: 700, height: 350, backgroundColor: "rgba(0,0,0,0.8)",
        border: `2px solid ${CYAN}55`, borderRadius: 20, padding: 30,
        boxShadow: `0 20px 50px rgba(0,0,0,0.8), inset 0 0 50px ${CYAN}22`,
        backdropFilter: "blur(20px)", display: "flex", flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${CYAN}33`, paddingBottom: 15 }}>
          <span style={{ color: "#FFF", fontSize: 24, fontWeight: 900, fontFamily: "monospace", letterSpacing: 2 }}>[ALPHAFOLD_3]</span>
          <span style={{ color: chaos > 0.1 ? MAGENTA : CYAN, fontSize: 32, fontWeight: 900, fontFamily: "'Cairo', sans-serif", textShadow: `0 0 15px ${chaos > 0.1 ? MAGENTA : CYAN}` }}>
            {chaos > 0.1 ? "جاري التوقع..." : "تم بناء الجزيء بنجاح"}
          </span>
        </div>

        {/* DNA Canvas */}
        <div style={{ flex: 1, position: "relative", marginTop: 20 }}>
          <svg width="100%" height="100%" viewBox={`0 -120 ${totalWidth + 50} 240`} style={{ overflow: "visible" }}>
            {Array.from({ length: points }).map((_, i) => {
              // Smoothly accelerating rotation phase starting precisely at 01:52.25 (local frame 105)
              const extraPhase = Math.pow(Math.max(0, lf - 105) / 25, 2);
              const phase = (frame * 0.08) + extraPhase + (i * 0.4);
              
              // Target ordered positions (Helix)
              const targetY1 = Math.sin(phase) * amplitude;
              const targetY2 = Math.sin(phase + Math.PI) * amplitude;
              
              // Pseudo-random chaotic offsets
              const randX1 = Math.sin(i * 12.3) * 300 * chaos;
              const randY1 = Math.cos(i * 32.1) * 300 * chaos;
              const randX2 = Math.cos(i * 15.2) * 300 * chaos;
              const randY2 = Math.sin(i * 44.4) * 300 * chaos;

              const x1 = (i * spacing) + 25 + randX1;
              const y1 = targetY1 + randY1;
              const x2 = (i * spacing) + 25 + randX2;
              const y2 = targetY2 + randY2;

              // Size based on Z-depth simulation (sine wave)
              const size1 = interpolate(Math.cos(phase), [-1, 1], [3, 10]);
              const size2 = interpolate(Math.cos(phase + Math.PI), [-1, 1], [3, 10]);

              return (
                <g key={i}>
                  {/* Connecting Bridge */}
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={CYAN} strokeWidth="2" strokeOpacity={0.6 + (1 - chaos) * 0.4} />
                  {/* Nodes */}
                  <circle cx={x1} cy={y1} r={size1} fill={CYAN} style={{ filter: `drop-shadow(0 0 10px ${CYAN})` }} />
                  <circle cx={x2} cy={y2} r={size2} fill={MAGENTA} style={{ filter: `drop-shadow(0 0 10px ${MAGENTA})` }} />
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. TIME COLLAPSE WIDGET (5 Years vs 3 Minutes)
// ─────────────────────────────────────────────────────────────────────────────
const TimeCollapseWidget: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  // exitFrame param = scene-local frame when BOTH panels done exiting (local 680)
  const exitEnd = exitFrame - delay; // 185
  if (lf > exitEnd) return null;

  // Panel 1: Humans 5 Years — entry [0→12], exit [171→183] (02:01.22)
  const p1Progress = interpolate(lf, [0, 12, 171, 183], [0, 1, 1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  // Exit wipe: reverse of entry (RTL exit: hide from right)
  const p1ExitWipe = interpolate(lf, [171, 183], [0, 100], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Panel 1 scan entry RTL
  const scan1 = interpolate(lf, [5, 28], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const scanLine1Visible = lf >= 5 && lf <= 28;
  const scanLine1Left = scan1;

  // Panel 2: AlphaFold 3 Minutes — entry [90→102], exit [173→185] (02:01.24)
  const p2Start = 90;
  const p2Progress = interpolate(lf, [p2Start, p2Start + 12, 173, 185], [0, 1, 1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const p2ExitWipe = interpolate(lf, [173, 185], [0, 100], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Panel 2 scan entry LTR
  const scan2 = interpolate(lf, [p2Start + 5, p2Start + 28], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const scanLine2Visible = lf >= p2Start + 5 && lf <= p2Start + 28;
  const scanLine2Left = 100 - scan2;

  // Progress bars (deterministic — no jitter)
  const labBarWipe = interpolate(lf, [10, 300], [100, 95], { extrapolateRight: "clamp" });
  const aiBarWipe = interpolate(lf, [p2Start + 30, p2Start + 45], [100, 0], { extrapolateRight: "clamp" });
  // ٣ دقايق individual RTL reveal @ 02:00.03 (lf=134 relative to widget)
  const threeMinWipe = interpolate(lf, [134, 154], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    // Wrapper: handles vertical centering WITHOUT mixing with scale
    <div style={{
      position: "absolute", top: "50%", left: "5%", right: "auto",
      transform: "translateY(-50%)",
      zIndex: 130, width: 700,
      display: "flex", flexDirection: "column", gap: 30
    }}>

      {/* PANEL 1: HUMANS IN LAB (5 YEARS) — scan entry RTL, exit wipe RTL */}
      <div style={{ position: "relative", overflow: "hidden", borderRadius: 16, opacity: p1Progress }}>
        <div style={{
          clipPath: lf < 30 ? `inset(0 0 0 ${scan1}%)` : `inset(0 ${p1ExitWipe}% 0 0)`,
          backgroundColor: "rgba(0,0,0,0.85)",
          border: `2px solid ${MAGENTA}55`, borderRadius: 16,
          padding: "25px 40px",
          boxShadow: `0 20px 40px rgba(0,0,0,0.6), inset 0 0 30px ${MAGENTA}22`,
          position: "relative", overflow: "hidden"
        }}>
          {/* Slow progress background */}
          <div style={{ position: "absolute", inset: 0, backgroundColor: `${MAGENTA}33`, clipPath: `inset(0 ${labBarWipe}% 0 0)`, pointerEvents: "none" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", position: "relative" }}>
            <span style={{ color: "#AAA", fontSize: 32, fontWeight: 900, fontFamily: "'Cairo', sans-serif" }}>البشر (في المعمل)</span>
            <span style={{ color: MAGENTA, fontSize: 60, fontWeight: 900, fontFamily: "'Cairo', sans-serif", textShadow: `0 0 20px ${MAGENTA}88` }}>٥ سنين</span>
          </div>
        </div>
        {/* Scan line glow effect */}
        {scanLine1Visible && (
          <div style={{
            position: "absolute", top: 0, bottom: 0, width: 6,
            left: `${scanLine1Left}%`,
            background: `linear-gradient(to bottom, transparent, ${MAGENTA}, transparent)`,
            boxShadow: `0 0 25px ${MAGENTA}, 0 0 50px ${MAGENTA}88`,
            zIndex: 2, borderRadius: 3
          }} />
        )}
      </div>

      {/* PANEL 2: ALPHAFOLD 3 MINUTES — enters 90 frames later, exits at 02:01.24 */}
      {lf >= p2Start && (
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 16, opacity: p2Progress }}>
          <div style={{
            clipPath: lf < p2Start + 30 ? `inset(0 ${scan2}% 0 0)` : `inset(0 0 0 ${p2ExitWipe}%)`,
            backgroundColor: "rgba(0,229,204,0.1)",
            border: `3px solid ${CYAN}`, borderRadius: 16,
            padding: "35px 40px",
            boxShadow: `0 20px 50px rgba(0,0,0,0.9), inset 0 0 50px ${CYAN}33`,
            position: "relative", overflow: "hidden"
          }}>
            {/* Instant progress bar */}
            <div style={{ position: "absolute", inset: 0, backgroundColor: `${CYAN}44`, clipPath: `inset(0 ${aiBarWipe}% 0 0)`, pointerEvents: "none" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", position: "relative" }}>
              <span style={{ display: "inline-block", direction: "ltr", color: "#FFF", fontSize: 40, fontWeight: 900, fontFamily: "'Cairo', sans-serif", textShadow: "0 0 10px rgba(0,0,0,0.8)" }}>AlphaFold 3</span>
              {/* ٣ دقايق — individual RTL reveal @ 02:00.03, clips from left = reveals from right */}
              <span style={{ color: "#FFF", fontSize: 80, fontWeight: 900, fontFamily: "'Cairo', sans-serif", textShadow: `0 0 30px ${CYAN}`, clipPath: `inset(0 0 0 ${threeMinWipe}%)` }}>٣ دقايق</span>
            </div>
          </div>
          {/* Scan line glow effect */}
          {scanLine2Visible && (
            <div style={{
              position: "absolute", top: 0, bottom: 0, width: 6,
              left: `${scanLine2Left}%`,
              background: `linear-gradient(to bottom, transparent, ${CYAN}, transparent)`,
              boxShadow: `0 0 25px ${CYAN}, 0 0 50px ${CYAN}88`,
              zIndex: 2, borderRadius: 3
            }} />
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. DRUG DISCOVERY GLASS CARD
// ─────────────────────────────────────────────────────────────────────────────
const DrugDiscoveryCard: React.FC<{ delay: number; exitFrame?: number; enterFromRight?: boolean; blurStartFrame?: number }> = ({ delay, exitFrame, enterFromRight, blurStartFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  let exitProgress = 0;
  if (exitFrame) {
    const exitStart = exitFrame - delay - 10;
    const exitEnd = exitFrame - delay;
    if (lf > exitEnd) return null;
    exitProgress = interpolate(lf, [exitStart, exitEnd], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  }

  // Entry: spring-based translateX (from left or right)
  const entrySpring = spring({ frame: lf, fps, config: { damping: 18, stiffness: 200 } });
  
  const startX = enterFromRight ? 300 : -300;
  const exitX = enterFromRight ? 300 : -300;
  const xEntry = interpolate(entrySpring, [0, 1], [startX, 0]) - interpolate(exitProgress, [0, 1], [0, -exitX]);
  const opacity = interpolate(entrySpring, [0, 1], [0, 1]) * interpolate(exitProgress, [0, 1], [1, 0]);

  // Blur on stamp impact
  const blurAmount = blurStartFrame && frame >= blurStartFrame 
    ? interpolate(frame, [blurStartFrame, blurStartFrame + 5], [0, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;


  // Staggered text wipes (RTL: reveals from right to left)
  const wipe1Timing = enterFromRight ? [5, 15] : [10, 25];
  const wipe2Timing = enterFromRight ? [15, 25] : [25, 40];
  
  const wipe1 = interpolate(lf, wipe1Timing, [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const wipe2 = interpolate(lf, wipe2Timing, [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  // Pulse: deterministic sine (no Math.random jitter)
  const pulseOpacity = interpolate(Math.sin(lf * 0.12), [-1, 1], [0.3, 0.9]);

  return (
    <div style={{
      position: "absolute", top: "30%",
      ...(enterFromRight ? { right: "10.5%", left: "auto" } : { left: "5%", right: "auto" }),
      transform: `translateX(${xEntry}px)`, opacity,
      zIndex: 140,
      backgroundColor: "rgba(0,0,0,0.75)",
      border: `2px solid ${CYAN}66`,
      borderRadius: 24,
      padding: "40px 60px",
      boxShadow: `0 30px 60px rgba(0,0,0,0.8), inset 0 0 60px ${CYAN}22`,
      backdropFilter: "blur(20px)",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 15
    }}>
      <div style={{ filter: blurAmount > 0 ? `blur(${blurAmount}px)` : "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 15, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, clipPath: `inset(0 0 0 ${wipe1}%)` }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: CYAN, boxShadow: `0 0 20px ${CYAN}` }} />
          <span style={{ color: "#FFF", fontSize: 48, fontWeight: 900, fontFamily: "'Cairo', sans-serif" }}>تصميم أدوية جديدة</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20, clipPath: `inset(0 0 0 ${wipe2}%)` }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: MAGENTA, boxShadow: `0 0 20px ${MAGENTA}` }} />
          <span style={{ color: MAGENTA, fontSize: 42, fontWeight: 900, fontFamily: "'Cairo', sans-serif", textShadow: `0 0 20px ${MAGENTA}66` }}>أقل بملايين الدولارات</span>
        </div>

        {/* Pulse Line — deterministic, no jitter */}
        <div style={{
          width: "100%", height: 4, marginTop: 20, borderRadius: 2,
          background: `linear-gradient(90deg, transparent, ${CYAN}, ${MAGENTA}, transparent)`,
          opacity: pulseOpacity
        }} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. HUMAN REDUNDANT GLITCH (Threatening Your Job)
// ─────────────────────────────────────────────────────────────────────────────
const HumanRedundantGlitch: React.FC<{ delay: number; exitFrame: number }> = ({ delay, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0 || frame > exitFrame) return null;

  // Slam springs for violent entrance
  const pop1 = spring({ frame: lf, fps, config: { damping: 10, stiffness: 200 } });
  const pop2 = spring({ frame: Math.max(0, lf - 10), fps, config: { damping: 10, stiffness: 200 } });
  
  // RESTORING KINETIC VIOLENCE: Step every 2 frames, double amplitude for severe screen shake that survives compression
  const steppedFrame = Math.floor(frame / 2);
  const shakeX = Math.sin(steppedFrame * 22) * 60;
  const shakeY = Math.cos(steppedFrame * 27) * 60;
  
  // Exit shatter (frame > exitFrame - 5)
  const isShattering = frame >= exitFrame - 5;
  const shatterX = isShattering ? Math.sin(steppedFrame * 45) * 150 : 0;
  const shatterY = isShattering ? Math.cos(steppedFrame * 55) * 150 : 0;

  // Fade out
  const opacity = interpolate(frame, [exitFrame - 15, exitFrame], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{
      zIndex: 145, mixBlendMode: "screen", pointerEvents: "none",
      transform: `translate(${shakeX + shatterX}px, ${shakeY + shatterY}px)`,
      filter: `saturate(3) hue-rotate(-20deg)`,
      opacity
    }}>
      {/* Censor Bar (Left side) */}
      <div style={{
        position: "absolute", top: "40%", left: "5%",
        width: 480, height: 95, backgroundColor: "#FF0000",
        transform: `scaleY(${pop1}) rotate(-2deg)`, transformOrigin: "center left",
        display: "flex", justifyContent: "center", alignItems: "center",
        boxShadow: "0 10px 30px rgba(255,0,0,0.5)"
      }}>
        <span style={{ color: "#FFF", fontSize: 46, fontWeight: 900, fontFamily: "'Cairo', sans-serif", letterSpacing: 2 }}>[عنصر_بشري_زائد]</span>
      </div>

      {/* Massive Error Card (Right side) */}
      <div style={{
        position: "absolute", top: "40%", right: "5%", left: "auto",
        backgroundColor: "rgba(255, 0, 0, 1)",
        border: "4px solid #FFF", padding: "20px 45px",
        transform: `scale(${pop2}) rotate(2deg)`, transformOrigin: "center right",
        boxShadow: "0 15px 40px rgba(255,0,0,0.7)",
        display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        <span style={{ color: "#FFF", fontSize: 34, fontWeight: 900, fontFamily: "'Cairo', sans-serif" }}>تحذير استبدال</span>
        <span style={{ color: "#000", fontSize: 58, fontWeight: 900, fontFamily: "'Cairo', sans-serif" }}>بروتوكول_التسريح</span>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. SAVING HUMAN LIVES (Gratitude Stamp)
// ─────────────────────────────────────────────────────────────────────────────
const SavingHumanLivesStamp: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  // Very heavy, rigid spring for the violent slam
  const slamSpring = spring({ frame: lf, fps, config: { damping: 10, mass: 1, stiffness: 250 } });
  const scale = interpolate(slamSpring, [0, 1], [3, 1]);
  const opacity = interpolate(lf, [0, 2], [0, 1], { extrapolateRight: "clamp" });
  
  // Chromatic Aberration burst exactly on impact (frame 4-8)
  const isImpact = lf >= 4 && lf <= 8;
  const rgbSplit = isImpact ? 25 : 0;
  // RESTORING KINETIC VIOLENCE: Step every 2 frames, double amplitude for the impact shake
  const steppedFrame = Math.floor(frame / 2);
  const shakeX = isImpact ? Math.sin(steppedFrame * 33) * 60 : 0;
  const shakeY = isImpact ? Math.cos(steppedFrame * 38) * 60 : 0;

  const getStampContent = (subColor: string) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.1, transform: "translateZ(0)", backfaceVisibility: "hidden", WebkitFontSmoothing: "antialiased" }}>
      <span>إنقاذ حياة البشر</span>
      <span style={{ color: subColor, fontSize: 60, marginTop: -10, textShadow: "none" }}>ختم امتنان</span>
    </div>
  );

  return (
    <div style={{
      position: "absolute", top: "31%", right: "4.5%", left: "auto",
      transform: `scale(${scale * 0.85}) translate(${shakeX}px, ${shakeY}px) rotate(12deg) translateZ(0)`, 
      opacity, transformOrigin: "center center", zIndex: 150, pointerEvents: "none",
      willChange: "transform, opacity", backfaceVisibility: "hidden", WebkitFontSmoothing: "antialiased"
    }}>
      <div style={{ position: "relative" }}>
        {/* MAGENTA Channel */}
        <div style={{
          position: "absolute", top: 0, left: -rgbSplit,
          color: MAGENTA, fontSize: 120, fontWeight: 900, fontFamily: "'Cairo', sans-serif",
          border: `10px solid ${MAGENTA}`, padding: "10px 40px", borderRadius: 15,
        }}>
          {getStampContent(MAGENTA)}
        </div>
        {/* CYAN Channel */}
        <div style={{
          position: "absolute", top: 0, left: rgbSplit,
          color: CYAN, fontSize: 120, fontWeight: 900, fontFamily: "'Cairo', sans-serif",
          border: `10px solid ${CYAN}`, padding: "10px 40px", borderRadius: 15,
        }}>
          {getStampContent(CYAN)}
        </div>
        {/* Main White Core */}
        <div style={{
          position: "relative",
          color: "#FFF", fontSize: 120, fontWeight: 900, fontFamily: "'Cairo', sans-serif",
          border: `10px solid #FFF`, padding: "10px 40px", borderRadius: 15,
          textShadow: `0 0 30px ${CYAN}88, 0 0 60px ${MAGENTA}88`,
          boxShadow: `0 0 50px rgba(0,0,0,0.8), inset 0 0 30px rgba(255,255,255,0.4)`
        }}>
          {getStampContent(CYAN)}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCENE 4: TOPIC 4 (MARIYA - ALPHAFOLD 3)
// ─────────────────────────────────────────────────────────────────────────────
export const Topic4AlphaFold: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Total Scene Duration = 990 frames (33 seconds)
  // Re-timed strictly to match the Arabic Voiceover flow
  const pose0End = 85;  // 01:41.29 - Pose 4 → Pose 5
  const pose1End = 240; // 01:47.04 - Pose 5 → Pose 1 (Terminal)
  const pose2End = 306; // 01:49.10 - Pose 1 → Pose 3 (DNA Widget)
  const pose3End = 336; // 01:50.28 - Pose 3 → Pose 1 (Terminal exits, DNA up)
  const pose4End = 495; // 01:55.19 - Pose 1 → Pose 3 (Time Collapse enters)
  const pose5End = 701; // 02:02.15 - Snap to Pose 2 and jump right
  const pose6End = 848; // 02:07.12 - Snap to center (Pose 1)
  const pose7End = 917; // 02:09.21 - Snap left (Pose 5)

  const isPose0 = frame >= 0 && frame < pose0End;
  const isPose1 = frame >= pose0End && frame < pose1End;
  const isPose2 = frame >= pose1End && frame < pose2End;
  const isPose3 = frame >= pose2End && frame < pose3End;
  const isPose4 = frame >= pose3End && frame < pose4End;   // Pose 1 (post-terminal)
  const isPose5 = frame >= pose4End && frame < pose5End;   // Pose 3 (TimeCollapse)
  const isPose6 = frame >= pose5End && frame < pose6End;   // Authoritative closing
  const isPose7 = frame >= pose6End && frame < pose7End;   // Center snap
  const isPose8 = frame >= pose7End;                       // Snap left (Pose 5)

  // Poses matching the requested narrative tone
  const mariyaImg = isPose0
    ? staticFile("images/episode3/mariya-pose4-scene2.png")
    : isPose1
      ? staticFile("images/episode3/mariya-pose-5-neutral.png")
      : isPose2
        ? staticFile("images/episode3/mariya-pose1-scene2.png")
        : isPose3
          ? staticFile("images/episode3/mariya-pose3-scene2.png")
          : isPose4
            ? staticFile("images/episode3/mariya-pose1-scene2.png") // Pose 1 post-terminal
            : isPose5
              ? staticFile("images/episode3/mariya-pose3-scene2.png") // Pose 3 @ 01:55.19
              : isPose6
                ? staticFile("images/episode3/mariya-pose2-scene2.png") // Pose 2 @ 02:02.15
                : isPose7
                  ? staticFile("images/episode3/mariya-pose1-scene2.png") // Pose 1 Center @ 02:07.12
                  : staticFile("images/episode3/mariya-pose-5-neutral.png"); // Pose 5 Left @ 02:09.21

  // Aggressive Cinematic Movements (Match Topic2Strawberry exactly)
  const slide1 = spring({ frame: Math.max(0, frame - pose1End), fps, config: { damping: 16 } });
  const slide2 = spring({ frame: Math.max(0, frame - pose2End), fps, config: { damping: 16 } });
  const slide3 = spring({ frame: Math.max(0, frame - pose3End), fps, config: { damping: 16 } });
  const slide4 = spring({ frame: Math.max(0, frame - pose4End), fps, config: { damping: 16 } });
  const slide5 = spring({ frame: Math.max(0, frame - pose5End), fps, config: { damping: 16 } });
  const slide6 = spring({ frame: Math.max(0, frame - pose6End), fps, config: { damping: 16 } });
  const slide7 = spring({ frame: Math.max(0, frame - pose7End), fps, config: { damping: 16 } });

  const xOffsetNum = 
    interpolate(slide1, [0, 1], [0, 20])   // RIGHT for white terminal
    + interpolate(slide2, [0, 1], [0, 6])  // More right for DNA Widget
    - interpolate(slide3, [0, 1], [0, 4])  // Slightly left as terminal exits
    + interpolate(slide4, [0, 1], [0, 5])  // Slightly right for pose 3 / time collapse
    - interpolate(slide5, [0, 1], [0, 6])  // SNAP LEFT (Subtle) @ 02:02.15
    - interpolate(slide6, [0, 1], [0, 16]) // SNAP TO CENTER (x=5%) @ 02:07.12
    - interpolate(slide7, [0, 1], [0, 15]); // SNAP LEFT (x=-10%) @ 02:09.21
    
  const xOffset = `${xOffsetNum}%`;

  // Cut burst logic for premium visual transitions
  const getCutProgress = (c: number) => frame - c;
  // THE FIX: >= 0 ensures it triggers on frame 0, spanning exactly 5 full frames (0,1,2,3,4)
  const isCutBurst =
    (getCutProgress(pose0End) >= 0 && getCutProgress(pose0End) < 5) ||
    (getCutProgress(pose1End) >= 0 && getCutProgress(pose1End) < 5) ||
    (getCutProgress(pose2End) >= 0 && getCutProgress(pose2End) < 5) ||
    (getCutProgress(pose3End) >= 0 && getCutProgress(pose3End) < 5) ||
    (getCutProgress(pose4End) >= 0 && getCutProgress(pose4End) < 5) ||
    (getCutProgress(pose5End) >= 0 && getCutProgress(pose5End) < 5) ||
    (getCutProgress(pose6End) >= 0 && getCutProgress(pose6End) < 5) ||
    (getCutProgress(pose7End) >= 0 && getCutProgress(pose7End) < 5);

  // RESTORING KINETIC VIOLENCE: Step every 2 frames, but massive 80px amplitude so it survives compression and feels like a real tear.
  const burstSeed = Math.floor(frame / 2) * 45.2;
  const caX = isCutBurst ? (Math.sin(burstSeed) * 80) : 0;
  const scale = interpolate(frame, [0, 1000], [1.0, 1.05], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Audio src={staticFile("audio/episode3/mariya-scene4.mp3")} />

      {/* MARIYA PRESENTER (Exact same styling as Scene 2 to prevent any layout jitter) */}
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

      {/* SCRIPT-DRIVEN DYNAMIC COMPONENTS */}
      
      {/* 1. Kinetic Typography (Visible during neutral intro) */}
      <SilentMiracle delay={10} exitFrame={240} />

      {/* 1B. Rubber Chyron (News Chyron) */}
      <NewsChyron label="اختراق طبي" source="DeepMind AlphaFold 3" delayFrames={20} exitFrame={85} isMaskRTL={true} />

      {/* 2A. Restored AlphaFold Terminal (Top-Left, Arabic) */}
      <AlphaFoldTerminal delay={244} exitFrame={338} />

      {/* 2B. Spiral DNA Hologram (Left, Below Terminal) */}
      <SpiralDNAWidget delay={306} exitFrame={465} />

      {/* 3. Time Collapse (5 Years vs 3 Minutes) — Mariya Pose 3 @01:55.19, Cyan @01:58.19 */}
      <TimeCollapseWidget delay={495} exitFrame={680} />

      {/* 4. Drug Discovery Glass Card (Appears at pose 3 shift to end) */}
      <DrugDiscoveryCard delay={728} exitFrame={841} />

      {/* 4B. Second Drug Discovery Glass Card (Re-enters from right to be stamped) */}
      <DrugDiscoveryCard delay={924} enterFromRight={true} blurStartFrame={972} />

      {/* 5. Human Redundant Glitch (Threatening Your Job) */}
      <HumanRedundantGlitch delay={842} exitFrame={916} />

      {/* 5B. Censor Bar Text (The Sensor Bar) - Rubber Chyron */}
      <CensorBarText text="مستقبل الطب الذكي" subtext="الذكاء الاصطناعي" color={CYAN} align="right" delay={922} exitFrame={1500} />

      {/* 6. Gratitude Stamp (Climax - hits precisely at 972) */}
      <SavingHumanLivesStamp delay={968} />

    </AbsoluteFill>
  );
};
