import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate, Img } from "remotion";
import { NewsChyron } from "./TheHook";
import { ShimmerEdgeBox, CensorBarText } from "./Topic1Google";

const CYAN = "#00E5CC";
const MAGENTA = "#FF0055";
const RED = "#FF3333";

// ─────────────────────────────────────────────────────────────────────────────
// 1. PROGRAMMATIC UI: GPU COUNTER & COST
// ─────────────────────────────────────────────────────────────────────────────
const GpuCounter: React.FC<{ delay: number; exitFrame?: number }> = ({ delay, exitFrame = 9999 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  // 12-frame linear pop-in/pop-out (matches ChatGPT terminal)
  const exitStart = exitFrame - delay;
  const progress = interpolate(
    lf,
    [0, 12, exitStart, exitStart + 12],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  const currentScale = interpolate(progress, [0, 1], [0, 1]);

  if (lf > exitStart + 12) return null;

  // Fast counter up to 100,000
  const count = interpolate(lf, [10, 40], [0, 100000], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div style={{
      position: "absolute", top: "48%", left: "8%",
      transform: `scale(${currentScale})`, transformOrigin: "left center",
      zIndex: 120
    }}>
      <ShimmerEdgeBox width={380} height={160} frameOffset={delay} primaryColor={CYAN} secondaryColor={MAGENTA}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", width: "100%", height: "100%", justifyContent: "center" }}>
          <div dir="rtl" style={{ color: "#333", fontSize: 34, fontFamily: "'Cairo', sans-serif", fontWeight: 900, marginBottom: -10, letterSpacing: 0.5 }}>
            معالجات إنفيديا (H100)
          </div>
          <div style={{ color: MAGENTA, fontSize: 64, fontFamily: "monospace", fontWeight: 900 }}>
            {Math.floor(count).toLocaleString('en-US')}
          </div>
        </div>
      </ShimmerEdgeBox>
    </div>
  );
};

const CostTicker: React.FC<{ delay: number; exitFrame?: number }> = ({ delay, exitFrame = 9999 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  // Wipe reveal
  const wipe = interpolate(lf, [0, 15], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Reverse wipe hide (left to right)
  const isExiting = frame >= exitFrame;
  const exitF = isExiting ? frame - exitFrame : 0;
  const exitWipe = interpolate(exitF, [0, 15], [0, 100], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const finalClip = isExiting ? `inset(0 0 0 ${exitWipe}%)` : `inset(0 ${wipe}% 0 0)`;

  return (
    <div style={{
      position: "absolute", top: "65%", left: "8%", zIndex: 120,
      clipPath: finalClip
    }}>
      <div style={{
        backgroundColor: "#FF0055", padding: "10px 30px", borderRadius: 8,
        boxShadow: "0 10px 30px rgba(255,0,85,0.5)",
        display: "flex", alignItems: "center"
      }}>
        <span style={{ color: "#FFF", fontSize: 48, fontFamily: "monospace", fontWeight: 900 }}>$3,000,000,000</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. PROGRAMMATIC UI: TRACKER MAP (SF -> MEMPHIS)
// ─────────────────────────────────────────────────────────────────────────────
const MemphisTrackerMap: React.FC<{ delay: number; exitFrame?: number }> = ({ delay, exitFrame = 9999 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  // 1. Container Pop-in
  const pop = spring({ frame: lf, fps, config: { damping: 14 } });

  // Reverse Pop for Exit
  const isExiting = frame >= exitFrame;
  const exitF = isExiting ? frame - exitFrame : 0;
  const exitPop = isExiting ? spring({ frame: exitF, fps, config: { damping: 14 } }) : 0;

  if (isExiting && exitF > 30) return null;

  // 2. Trajectory Line Animation (Draws the path over 30 frames)
  const pathLength = 500;
  const drawProgress = interpolate(lf, [10, 40], [pathLength, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // 3. Pin Drop Animations
  const sfPinPop = spring({ frame: lf - 5, fps, config: { damping: 12 } });
  const memphisPinPop = spring({ frame: lf - 40, fps, config: { damping: 10, mass: 2 } });
  const ringPulse = ((lf - 40) % 60) / 60; // Continuous pulse after pin drops

  // Coordinated Label Animations
  const sfLabelAnim = spring({ frame: lf - 12, fps, config: { damping: 14, stiffness: 220 } });
  const memphisLabelAnim = spring({ frame: lf - 50, fps, config: { damping: 12, stiffness: 180 } });

  // Coordinates Typewriter Animations
  const sfCoords = "37.7749° N, 122.4194° W";
  const sfCoordsType = Math.max(0, Math.min(sfCoords.length, Math.floor((lf - 20) * 0.8)));

  const memphisCoords = "35.1495° N, 90.0490° W";
  const memphisCoordsType = Math.max(0, Math.min(memphisCoords.length, Math.floor((lf - 60) * 0.8)));

  const currentScale = Math.max(0, pop - exitPop);

  return (
    <div style={{
      position: "absolute", top: "15%", right: "5%", zIndex: 105,
      transform: `scale(${currentScale})`, transformOrigin: "center center",
      backfaceVisibility: "hidden", WebkitFontSmoothing: "antialiased", filter: "blur(0px)", willChange: "transform"
    }}>
      <ShimmerEdgeBox width={800} height={500} frameOffset={delay} primaryColor={CYAN} secondaryColor={MAGENTA} padding="0px">
        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", backgroundColor: "#F8F9FA" }}>
          {/* Base Map Layer (Greyish Green for contrast against off-white) */}
          <Img
            src={staticFile("images/episode3/usa-map.svg")}
            style={{ position: "absolute", width: "90%", height: "90%", opacity: 0.9, objectFit: "contain", filter: "invert(0.2) sepia(1) hue-rotate(90deg) saturate(1.5) contrast(1.2)" }}
          />

          {/* Target Crosshairs */}
          <div style={{ position: "absolute", inset: "20%", border: `1px solid rgba(0,0,0,0.1)`, borderRadius: "50%" }} />

          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
            {/* The arched trajectory from SF to Memphis */}
            <path
              d="M 120 220 Q 300 120 500 270"
              fill="none" stroke={CYAN} strokeWidth="4"
              strokeDasharray={pathLength} strokeDashoffset={drawProgress} strokeLinecap="round"
            />
            {/* Faint continuous flowing track (Marching Ants) */}
            <path
              d="M 120 220 Q 300 120 500 270"
              fill="none" stroke={`${CYAN}80`} strokeWidth="2" strokeDasharray="5 5"
              strokeDashoffset={-(lf * 3) % 20}
            />
          </svg>

          {/* San Francisco Node (Origin) */}
          <div style={{
            position: "absolute", left: "120px", top: "220px", transform: `translate(-50%, -50%)`,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10
          }}>
            <div style={{ transform: `scale(${sfPinPop})`, width: 14, height: 14, backgroundColor: "#000", borderRadius: "50%", boxShadow: `0 0 10px rgba(0,0,0,0.5)` }} />
            <div style={{
              transform: `scale(${sfLabelAnim}) translate(30px, ${interpolate(sfLabelAnim, [0, 1], [15, 0])}px) translateZ(0)`,
              opacity: sfLabelAnim,
              marginTop: 10,
              color: "#FFF", fontFamily: "monospace", fontSize: 18, fontWeight: "bold",
              backgroundColor: "#111", padding: "6px 14px", borderRadius: 6, whiteSpace: "nowrap",
              boxShadow: "0px 8px 20px rgba(0,0,0,0.5)",
              display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start",
              willChange: "transform, opacity",
              backfaceVisibility: "hidden", WebkitFontSmoothing: "antialiased", filter: "blur(0px)"
            }}>
              <div>SAN FRANCISCO <span style={{ fontSize: 24 }}>(OpenAI)</span></div>
              <div style={{ fontSize: 18, color: "#00E5CC", fontWeight: "bold", textShadow: "0 0 10px rgba(0, 229, 204, 0.6)" }}>
                {sfCoords.substring(0, sfCoordsType)}
                {sfCoordsType < sfCoords.length && sfCoordsType > 0 ? "█" : ""}
              </div>
            </div>
          </div>

          {/* Memphis Node (Destination) */}
          {lf >= 40 && (
            <div style={{
              position: "absolute", left: "500px", top: "270px", transform: `translate(-50%, -50%)`,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12
            }}>
              <div style={{ transform: `scale(${memphisPinPop})`, position: "relative", width: 28, height: 28, display: "flex", justifyContent: "center", alignItems: "center" }}>
                {ringPulse > 0 && (
                  <div style={{
                    position: "absolute", width: `${ringPulse * 300}%`, height: `${ringPulse * 300}%`,
                    border: `2px solid ${MAGENTA}`, borderRadius: "50%", opacity: 1 - ringPulse
                  }} />
                )}
                <div style={{ width: 18, height: 18, backgroundColor: MAGENTA, borderRadius: "50%", boxShadow: `0 0 25px ${MAGENTA}` }} />
              </div>
              <div style={{
                transform: `scale(${memphisLabelAnim}) translateY(${interpolate(memphisLabelAnim, [0, 1], [20, 0])}px) translateZ(0)`,
                opacity: memphisLabelAnim,
                marginTop: 15,
                color: "#FFF", fontFamily: "monospace", fontSize: 24, fontWeight: "900",
                backgroundColor: "#111", padding: "8px 18px", borderRadius: 6, whiteSpace: "nowrap",
                border: `2px solid ${MAGENTA}`, boxShadow: `0px 10px 25px rgba(255, 0, 85, 0.4)`,
                display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start",
                willChange: "transform, opacity",
                backfaceVisibility: "hidden", WebkitFontSmoothing: "antialiased", filter: "blur(0px)"
              }}>
                <div>MEMPHIS (xAI Supercluster)</div>
                <div style={{ fontSize: 22, color: "#FF0055", fontWeight: "bold", textShadow: "0 0 10px rgba(255, 0, 85, 0.6)" }}>
                  {memphisCoords.substring(0, memphisCoordsType)}
                  {memphisCoordsType < memphisCoords.length && memphisCoordsType > 0 ? "█" : ""}
                </div>
              </div>
            </div>
          )}
        </div>
      </ShimmerEdgeBox>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. PROGRAMMATIC UI: GROK 3 TERMINAL
// ─────────────────────────────────────────────────────────────────────────────
const GrokTerminal: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const lf = frame - delay;
  if (lf < 0) return null;

  // 12-frame linear pop-in (matches ChatGPT terminal)
  const progress = interpolate(
    lf,
    [0, 12],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  const currentScale = interpolate(progress, [0, 1], [0, 1]);

  // Line 1: "> تهيئة Grok-3..."
  const arabicWipe1 = interpolate(lf, [10, 20], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const grokWipe = interpolate(lf, [20, 30], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Line 2: "> الوضع: مفتوح المصدر"
  const arabicWipe2 = interpolate(lf, [45, 60], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div style={{ position: "absolute", top: "45%", left: "5%", right: "auto", zIndex: 120, transform: `scale(${currentScale})`, transformOrigin: "left center" }}>
      <ShimmerEdgeBox width={650} height={220} frameOffset={delay} primaryColor={CYAN} secondaryColor={MAGENTA}>
        <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif", fontSize: 36, color: "#111", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ opacity: 0.85, marginBottom: 15, fontSize: 32, fontWeight: "900", letterSpacing: 1 }}>حاسوب xAI العملاق // ميمفيس، تينيسي</div>
          
          <div style={{ color: MAGENTA, fontWeight: "900", clipPath: `inset(0 0 0 ${arabicWipe1}%)` }}>
            {"> تهيئة "}
            <span style={{ direction: "ltr", display: "inline-block", clipPath: `inset(0 ${grokWipe}% 0 0)` }}>Grok-3</span>
            {"..."}
          </div>
          
          {lf > 45 && (
            <div style={{ color: "#111", marginTop: 10, fontWeight: "900", clipPath: `inset(0 0 0 ${arabicWipe2}%)` }}>
              {"> الوضع: مفتوح المصدر"}
            </div>
          )}
        </div>
      </ShimmerEdgeBox>
    </div>
  );
};

const GlowingServerBroll: React.FC<{ delay: number; exitFrame?: number }> = ({ delay, exitFrame = 9999 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - delay;
  if (lf < 0) return null;

  const scale = spring({ frame: lf, fps, config: { damping: 14 } });
  const panX = interpolate(lf, [0, 600], [0, -10], { extrapolateRight: "clamp" });
  const zoom = interpolate(lf, [0, 600], [1.05, 1.15], { extrapolateRight: "clamp" });

  const isExiting = frame >= exitFrame;
  const exitF = isExiting ? frame - exitFrame : 0;

  // Silver shimmer scan effect (bright flash, desaturation, scanline artifact)
  const exitGlitch = interpolate(exitF, [0, 5, 12], [0, 1, 0], { extrapolateRight: "clamp" });
  const exitOpacity = interpolate(exitF, [8, 15], [1, 0], { extrapolateRight: "clamp" });
  const exitScale = interpolate(exitF, [0, 15], [1, 1.05], { extrapolateRight: "clamp" });
  const exitFilter = isExiting
    ? `contrast(1.4) brightness(${0.9 + exitGlitch * 2}) saturate(${1.0 - exitGlitch * 1.2}) sepia(0.8) hue-rotate(-15deg) blur(${exitGlitch * 4}px)`
    : "contrast(1.2) brightness(0.9) saturate(0.9) sepia(0.7) hue-rotate(-15deg)";

  return (
    <div style={{
      position: "absolute", top: "10%", left: "5%", zIndex: 115,
      transform: `scale(${scale * exitScale})`, transformOrigin: "left center",
      opacity: exitOpacity
    }}>
      <ShimmerEdgeBox width={650} height={360} frameOffset={delay} primaryColor={CYAN} secondaryColor={MAGENTA}>
        <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
          <Img
            src={staticFile("images/episode3/glowing-servers.png")}
            style={{
              width: "120%", height: "120%", objectFit: "cover",
              transform: `translateX(${panX}%) scale(${zoom})`,
              filter: exitFilter
            }}
          />
          {/* Static Documentary Scanlines */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)",
            pointerEvents: "none"
          }} />
          {/* Rusty Glow / Vignette */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, rgba(160, 82, 45, 0.2) 0%, rgba(30, 10, 5, 0.6) 80%)",
            mixBlendMode: "multiply", pointerEvents: "none"
          }} />
          {/* Glitch Overlay */}
          {isExiting && (
            <div style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              backgroundColor: "#FFFFFF", mixBlendMode: "overlay", opacity: exitGlitch
            }} />
          )}
        </AbsoluteFill>
      </ShimmerEdgeBox>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCENE 3: TOPIC 3 (MAZEN - ELON MUSK & GROK 3)
// ─────────────────────────────────────────────────────────────────────────────
export const Topic3Grok: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pacing / Poses Synced to Voiceover
  const pose1End = 86;  // 01:14.16 global (86 local) - Switch to Pose 2 (Pointing)
  const pose2End = 137; // 01:16.07 global (137 local) - Switch to Pose 1 (Opening hands)
  const pose3End = 335; // 01:22.25 global (335 local) - Extra dynamism cut (Chin on hand)
  const pose3bEnd = 598; // 01:31.18 global (598 local) - Switch to Pose 3 (Arms crossed climax)
  const pose4End = 730; // 01:36.00 global (730 local) - Switch to Pose 5 (Angle shot / Snap right)

  const isPose1 = frame >= 0 && frame < pose1End;
  const isPose2 = frame >= pose1End && frame < pose2End;
  const isPose3 = frame >= pose2End && frame < pose3End;
  const isPose3b = frame >= pose3End && frame < pose3bEnd;
  const isPose4 = frame >= pose3bEnd && frame < pose4End;
  const isPose5 = frame >= pose4End;

  // We are mapping Mazen's poses precisely to the voiceover beats:
  // Timeline State 1: Chin on hand (mazen-pose4.png)
  // Timeline State 2 (starts 01:14.16): Pointing (mazen-pose2-scene1.png)
  // Timeline State 3 (starts 01:16.07): Opening hands (mazen-pose1-scene1.png - User calls this 'pose 1')
  // Timeline State 3b (starts 01:22.25): Chin on hand (mazen-pose4.png)
  // Timeline State 4 (starts 01:31.18): Open War / Climax (mazen-pose3-scene1.png)
  // Timeline State 5 (starts 01:36.00): Angle shot (mazen-angle.png)
  const mazenImg = isPose1
    ? staticFile("images/episode3/mazen-pose4.png")
    : isPose2
      ? staticFile("images/episode3/mazen-pose2-scene1.png")
      : isPose3
        ? staticFile("images/episode3/mazen-pose1-scene1.png")
        : isPose3b
          ? staticFile("images/episode3/mazen-pose4.png")
          : isPose4
            ? staticFile("images/episode3/mazen-pose3-scene1.png")
            : staticFile("images/episode3/mazen-angle.png");

  // Mazen Placement Logic
  let mazenAnchor: React.CSSProperties = { right: "-6%", left: "auto" };

  if (isPose4) {
    mazenAnchor = { left: "-12%", right: "auto" }; // Snap left for Climax
  } else if (isPose3b) {
    mazenAnchor = { right: "-7%", left: "auto" }; // Very slight touch to the right at 01:22.25
  } else if (isPose5) {
    mazenAnchor = { right: "-9%", left: "auto" }; // Move a bit to the right for final angle shot
  }

  const xOffset = "0%";

  // Chromatic Aberration Burst on Pose Cuts
  const getCutProgress = (c: number) => frame - c;
  // THE FIX: >= 0 ensures it triggers on frame 0, spanning exactly 5 full frames (0,1,2,3,4)
  const isCutBurst =
    (getCutProgress(pose1End) >= 0 && getCutProgress(pose1End) < 5) ||
    (getCutProgress(pose2End) >= 0 && getCutProgress(pose2End) < 5) ||
    (getCutProgress(pose3End) >= 0 && getCutProgress(pose3End) < 5) ||
    (getCutProgress(pose3bEnd) >= 0 && getCutProgress(pose3bEnd) < 5) ||
    (getCutProgress(pose4End) >= 0 && getCutProgress(pose4End) < 5);

  // RESTORING KINETIC VIOLENCE: Step every 2 frames, but massive 80px amplitude so it survives compression and feels like a real tear.
  const burstSeed = Math.floor(frame / 2) * 45.2;
  const caX = isCutBurst ? (Math.sin(burstSeed) * 80) : 0;
  const scale = interpolate(frame, [0, 1000], [1.0, 1.05], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* AUDIO TRACK */}
      <Audio src={staticFile("audio/episode3/mazen-scene3.mp3")} />

      {/* MAZEN PRESENTER */}
      <AbsoluteFill style={{ zIndex: 110, pointerEvents: "none", ...mazenAnchor, width: "100%", transform: `translateX(${xOffset})` }}>
        <AbsoluteFill style={{
          transform: `scale(${scale})`, transformOrigin: "bottom center",
          ...mazenAnchor, width: "100%", mixBlendMode: "multiply"
        }}>
          <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom center", filter: `contrast(1.2) brightness(0.95)` }} />
        </AbsoluteFill>

        {isCutBurst && (
          <>
            <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${caX}px)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-50deg) saturate(10)", ...mazenAnchor, width: "100%" }}>
              <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom center" }} />
            </AbsoluteFill>
            <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${-caX}px)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-20deg) saturate(10)", ...mazenAnchor, width: "100%" }}>
              <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom center" }} />
            </AbsoluteFill>
          </>
        )}
      </AbsoluteFill>

      {/* BREAKING BANNER (Restored) */}
      <NewsChyron label="Grok 3" source="وحش ممفيس" delayFrames={15} exitFrame={84} isMaskRTL={true} />

      {/* RUBBER CHYRON BLOCKS (Left aligned, entering at the end) */}
      <CensorBarText
        text="حاسوب ممفيس العملاق"
        subtext="١٠٠،٠٠٠ معالج H100 (قيمة ٣ مليار دولار)"
        color={MAGENTA}
        align="left"
        delay={730}
      />

      {/* UI ELEMENTS - SYNCHRONIZED TO AUDIO */}
      <GlowingServerBroll delay={273} exitFrame={551} /> {/* 01:20.23 global (273 local). Exits at 01:30.01 (551 local) */}
      <MemphisTrackerMap delay={607} exitFrame={721} />
      <GpuCounter delay={330} exitFrame={561} />         {/* 11s - "100k GPUs..." */}
      <CostTicker delay={420} exitFrame={571} />         {/* 14s - "Costing 3 billion..." */}
      <GrokTerminal delay={742} />       {/* 01:36.12 global (742 local) - Enters on left */}

    </AbsoluteFill>
  );
};
