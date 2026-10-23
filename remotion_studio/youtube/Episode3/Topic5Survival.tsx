import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, staticFile, Audio, Sequence } from "remotion";
import { CensorBarText } from "./Topic1Google";
import { NewsChyron } from "./TheHook";
import { DeadNetworkField, BotDuelTerminals, CodeTearReveal } from "./Topic5Components";

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 5 — SURVIVAL IN THE MACHINE AGE (MAZEN) — 570 frames / 19 sec
//
// VO beat map:
//   0   – 90  : "الإنترنت بيحتضِر"
//   90  – 270 : "سبعين في المية... روبوت بيكلم روبوت"
//   270 – 390 : "إزاي تنجو؟"
//   390 – 570 : "بيع النتايج... مش الكود"
//
// Pose / anchor map:
//   Pose 1 – WARNING  – RIGHT  – 0   → 180
//   Pose 2 – ANALYTIC – LEFT   – 180 → 360
//   Pose 3 – QUESTION – CENTER – 360 → 420
//   Pose 4 – CONFIDENT– RIGHT  – 420 → 570
// ─────────────────────────────────────────────────────────────────────────────
export const Topic5Survival: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const P1 = 185, P2 = 361, P3 = 420, P4 = 462;

  const isPose1 = frame < P1;
  const isPose2 = frame >= P1 && frame < P2;
  const isPose3 = frame >= P2 && frame < P3;
  const isPose4 = frame >= P3 && frame < P4;
  const isPose5 = frame >= P4;

  const mazenImg = isPose1
    ? staticFile("images/episode3/maze-pose6-warning.png")
    : isPose2
    ? staticFile("images/episode3/mazen-pose3-scene1.png") // Pose 3
    : isPose3
    ? staticFile("images/episode3/mazen-pose2-scene1.png") // Pose 2
    : isPose4
    ? staticFile("images/episode3/mazen-pose4.png")
    : staticFile("images/episode3/mazen-pose1-scene1.png"); // Pose 1

  // Presenter anchor: RIGHT(0%) → LEFT(−34%) → CENTER(−18%) → RIGHT(0%)
  const s1 = spring({ frame: Math.max(0, frame - P1), fps, config: { damping: 16 } });
  const s2 = spring({ frame: Math.max(0, frame - P2), fps, config: { damping: 16 } });
  const s3 = spring({ frame: Math.max(0, frame - P3), fps, config: { damping: 16 } });
  const s4 = spring({ frame: Math.max(0, frame - P4), fps, config: { damping: 16 } });

  const xNum =
    interpolate(s1, [0,1], [0, -18])
    + interpolate(s2, [0,1], [0,  18])
    + interpolate(s3, [0,1], [0,   8])
    + interpolate(s4, [0,1], [0,  -1]);

  const isRight = isPose1 || isPose4 || isPose5;
  let anchor: React.CSSProperties = { left: "-5%", right: "auto" };
  if (isPose1) anchor = { right: "-2%", left: "auto" };
  else if (isPose4) anchor = { right: "-5%", left: "auto" };
  else if (isPose5) anchor = { right: "-5%", left: "auto" };
  
  const objPos  = isRight ? "bottom right" : "bottom left";
  const tOrigin = isRight ? "bottom right" : "bottom left";

  const scale = interpolate(frame, [0, 1000], [1.0, 1.05], { extrapolateRight: "clamp" });

  const cut = (c: number) => frame - c;
  // THE FIX: >= 0 ensures it triggers on frame 0, spanning exactly 5 full frames (0,1,2,3,4)
  const isCut =
    (cut(P1) >= 0 && cut(P1) < 5) ||
    (cut(P2) >= 0 && cut(P2) < 5) ||
    (cut(P3) >= 0 && cut(P3) < 5) ||
    (cut(P4) >= 0 && cut(P4) < 5);
  // RESTORING KINETIC VIOLENCE: Step every 2 frames, but massive 80px amplitude so it survives compression and feels like a real tear.
  const burstSeed = Math.floor(frame / 2) * 45.2;
  const caX = isCut ? (Math.sin(burstSeed) * 80) : 0;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Audio src={staticFile("audio/episode3/mazen-scene5.mp3")} startFrom={0} endAt={147} />
      <Sequence from={170}>
        <Audio src={staticFile("audio/episode3/mazen-scene5.mp3")} startFrom={147} />
      </Sequence>

      {/* ── MAZEN ─────────────────────────────────────────────────────────── */}
      <AbsoluteFill style={{ zIndex: 110, pointerEvents: "none", ...anchor, width: "100%", transform: `translateX(${xNum}%)` }}>
        <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: tOrigin, ...anchor, width: "100%", mixBlendMode: "multiply" }}>
          <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: objPos, filter: "contrast(1.2) brightness(0.95)" }} />
        </AbsoluteFill>
        {isCut && <>
          <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${caX}px)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-50deg) saturate(10)", ...anchor, width: "100%" }}>
            <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: objPos }} />
          </AbsoluteFill>
          <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${-caX}px)`, mixBlendMode: "screen", filter: "sepia(1) hue-rotate(-20deg) saturate(10)", ...anchor, width: "100%" }}>
            <img src={mazenImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: objPos }} />
          </AbsoluteFill>
        </>}
      </AbsoluteFill>

      {/* ── CHYRON ─────────────────────────────────────────────────────────── */}
      <NewsChyron label="إنذار أخير" source="الإنترنت يحتضر" delayFrames={12} exitFrame={88} isMaskRTL={true} />

      {/* ── ACT 1: DEAD NETWORK (LEFT zone, Mazen RIGHT) — 0 → 180 ────────── */}
      <DeadNetworkField delay={74} exitFrame={190} />

      {/* ── CENSOR BAR — "70% روبوت" slams at 230, exits at 356 ─────────── */}
      <CensorBarText text="70% روبوت ↔ روبوت" subtext="محتوى آلي مغلق" color="#FF3333" align="right" delay={230} exitFrame={351} />

      {/* ── ACT 2: BOT DUEL (RIGHT zone, Mazen LEFT) — 180 → 400 ─────────── */}
      <BotDuelTerminals delay={235} exitFrame={400} />

      {/* ── ACT 3: CODE TEAR (LEFT zone, Mazen CENTER→RIGHT) — 492 → ∞ ──── */}
      <CodeTearReveal delay={492} />

    </AbsoluteFill>
  );
};
