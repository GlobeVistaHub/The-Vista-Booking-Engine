import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  interpolateColors,
  staticFile,
  Img,
  spring,
  useVideoConfig,
} from "remotion";
import { TheHook } from "./Episode3/TheHook";
import { Topic1Google } from "./Episode3/Topic1Google";
import { Topic2Strawberry } from "./Episode3/Topic2Strawberry";
import { Topic3Grok } from "./Episode3/Topic3Grok";
import { Topic4AlphaFold } from "./Episode3/Topic4AlphaFold";
import { Topic5Survival } from "./Episode3/Topic5Survival";
import { Topic6Maestro } from "./Episode3/Topic6Maestro";
import { Topic7Outro } from "./Episode3/Topic7Outro";
import { AnamorphicWhipPan } from "./Episode3/AnamorphicWhipPan";
import { BrandOutroHorizontal } from "./Episode3/BrandOutroHorizontal";

export const TOTAL_DURATION = 6032; // Includes 6-second final brand outro

const CYAN    = "#00E5CC";
const MAGENTA = "#FF0055";
const RED     = "#FF3333";
const EMERALD = "#10B981";

// ─────────────────────────────────────────────────────────────────────────────
// ANAMORPHIC WHIP-PAN TRANSITION (Original)
// ─────────────────────────────────────────────────────────────────────────────
const WIPE_START = 198;
const WIPE_END   = 218;

const WIPE_2_START = 1315;
const WIPE_2_END   = 1333;

const WIPE_3_START = 2150;
const WIPE_3_END   = 2168;

const WIPE_4_START = 2974;
const WIPE_4_END   = 2992;

const WIPE_5_START = WIPE_4_END + 990 - 18 + 23; // Add 0.75s (23 frames) delay to transition
const WIPE_5_END   = WIPE_5_START + 18;

const WIPE_6_START = WIPE_5_END + 570 + 23; // Scene 5 (570f) + 0.75s breath (23f)
const WIPE_6_END   = WIPE_6_START + 18;

const WIPE_7_START = WIPE_6_END + 690 + 30; // Scene 6 (690f) + 1s breath (30f)
const WIPE_7_END   = WIPE_7_START + 18;

const WIPE_8_START = WIPE_7_END + 480; // Scene 7 (480f)
const WIPE_8_END   = WIPE_8_START + 18;

const AnamorphicWhipPanDefs: React.FC<{ blurX: number, rgbOffset: number }> = ({ blurX, rgbOffset }) => (
  <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
    <defs>
      {/* Heavy horizontal anamorphic blur */}
      <filter id="ep3-hblur" x="-50%" width="200%" y="0%" height="100%">
        <feGaussianBlur in="SourceGraphic" stdDeviation={`${blurX},0`} />
      </filter>
      {/* RGB Split (Chromatic Aberration) during the whip */}
      <filter id="ep3-rgb-split" x="-50%" width="200%" y="-50%" height="200%">
        <feOffset in="SourceGraphic" dx={rgbOffset} dy="0" result="red-shift" />
        <feOffset in="SourceGraphic" dx={-rgbOffset} dy="0" result="blue-shift" />
        <feColorMatrix in="red-shift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red-only" />
        <feColorMatrix in="blue-shift" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue-only" />
        <feBlend in="red-only" in2="blue-only" mode="screen" result="rb-split" />
        <feBlend in="SourceGraphic" in2="rb-split" mode="screen" />
      </filter>
    </defs>
  </svg>
);

// Global Gritty Film Grain Overlay
const GlobalTexture: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999, mixBlendMode: "overlay", opacity: 0.05 }}>
    <div style={{
      width: "100%", height: "100%",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>')`,
    }} />
  </AbsoluteFill>
);

export const Episode3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── GLOBAL BACKGROUND ──────────────────────────────────────────────────────
  const isHookWide    = frame < 70;
  const isHookAngle   = frame >= 70  && frame < 148;
  const isTopic1      = frame >= 200 && frame < WIPE_2_END;
  const isTopic2      = frame >= WIPE_2_END && frame < WIPE_3_END;
  const isTopic3      = frame >= WIPE_3_END && frame < WIPE_4_END;
  const isTopic4      = frame >= WIPE_4_END && frame < WIPE_5_END;
  const isTopic5      = frame >= WIPE_5_END && frame < WIPE_6_END;
  const isTopic6      = frame >= WIPE_6_END && frame < WIPE_7_END;
  const isTopic7      = frame >= WIPE_7_END;

  // Scene 4 exact duration is 990 frames. t4End = WIPE_4_END + 990
  const t4End = WIPE_5_START + 18;
  const t5End = WIPE_5_END + 570; // Scene 5 is 19 seconds
  const t6End = WIPE_6_END + 690; // Scene 6 is 23 seconds
  const t7End = WIPE_7_END + 480; // Scene 7 is 16 seconds

  const bgScale = isTopic7
    ? interpolate(frame, [WIPE_7_END, t7End], [1.1, 1.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isTopic6
    ? interpolate(frame, [WIPE_6_END, t6End], [1.4, 1.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isTopic5
    ? interpolate(frame, [WIPE_5_END, t5End], [1.4, 1.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isTopic4
    ? interpolate(frame, [WIPE_4_END, WIPE_5_END], [1.1, 1.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isTopic3
    ? interpolate(frame, [WIPE_3_END, WIPE_4_END], [1.4, 1.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isTopic2
    ? interpolate(frame, [WIPE_2_END, WIPE_3_END], [1.1, 1.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isTopic1
    ? interpolate(frame, [200, WIPE_2_END], [1.1, 2.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isHookWide
    ? interpolate(frame, [0,   70],  [1.05, 1.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isHookAngle
    ? interpolate(frame, [70,  148], [1.25, 1.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : interpolate(frame, [148, 200], [2.0,  2.1],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bgPanX = isTopic7
    ? interpolate(frame, [WIPE_7_END, t7End], [100, -50], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isTopic6
    ? interpolate(frame, [WIPE_6_END, t6End], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isTopic5
    ? interpolate(frame, [WIPE_5_END, t5End], [0, -100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isTopic4
    ? interpolate(frame, [WIPE_4_END, WIPE_5_END], [0, 250], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isTopic3
    ? interpolate(frame, [WIPE_3_END, WIPE_4_END], [100, -100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isTopic2
    ? interpolate(frame, [WIPE_2_END, WIPE_3_END], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isTopic1
    ? interpolate(frame, [200, WIPE_2_END], [0, -250], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isHookWide
    ? interpolate(frame, [0,   70],  [0,   -4],   { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isHookAngle
    ? interpolate(frame, [70,  148], [-10, -16],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : interpolate(frame, [148, 200], [-2,  -5],   { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const crtStart = WIPE_3_END + 273;
  const crtEnd = WIPE_3_END + 551;
  const topic3Blur = interpolate(
    frame,
    [crtStart - 15, crtStart, crtEnd, crtEnd + 15],
    [4, 16, 16, 4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scientistsStart = WIPE_2_END + 555; // Frame 1888 (01:02.28)
  const scientistsEnd = WIPE_2_END + 816;
  const topic2Blur = interpolate(
    frame,
    [1899, 1911, scientistsEnd, scientistsEnd + 15],
    [4, 16, 16, 4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scene 4 specific blur: Unblurs sharply at stamp impact (frame 972)
  const isTopic4Unblur = frame >= WIPE_4_START + 972;
  const topic4Blur = isTopic4Unblur ? interpolate(frame, [WIPE_4_START + 972, WIPE_4_START + 980], [15, 4], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }) : 15;
  const bgBlur  = isTopic7 ? 4 : isTopic6 ? 15 : isTopic5 ? 15 : isTopic4 ? topic4Blur : isTopic3 ? topic3Blur : isTopic2 ? topic2Blur : isTopic1 ? 4 : isHookWide ? 8 : isHookAngle ? 18 : 40;

  const toneShiftFrame = 1898; // 01:03.08 (Mariya's angry pose / "Loss of Control" tone shift)

  const tintColor = frame < WIPE_START 
    ? (isHookWide 
        ? CYAN 
        : isHookAngle 
          ? interpolateColors(frame, [70, 110], [CYAN, MAGENTA]) 
          : interpolateColors(frame, [148, 165], [MAGENTA, RED]))
    : frame < 1300 
      ? (frame < 528 
        ? interpolateColors(frame, [WIPE_END, 303], [CYAN, "#003344"]) // Google Fall (Darker Teal)
        : frame < 979
          ? interpolateColors(frame, [528, 570], ["#003344", "#440000"]) // StackOverflow Terror (Deep Red)
          : interpolateColors(frame, [979, 1020], ["#440000", "#552200"])) // Era of search ending (Rust Orange)
      // Scene 3 (Mariya / Strawberry) - Tone shifts synchronized with poses
      : frame < WIPE_3_START // Keeps Mariya's red tint until Scene 3 starts
        ? (
            frame < 1315 + 180 // Pose 1: Ironic -> TEAL
              ? interpolateColors(frame, [WIPE_2_START, WIPE_2_END], ["#552200", "#005566"]) 
            : frame < 1315 + 360 // Pose 2: Suspenseful -> CYAN
              ? interpolateColors(frame, [1315 + 180, 1315 + 180 + 15], ["#005566", CYAN]) 
            : frame < toneShiftFrame // Pose 3: Authoritative -> MAGENTA
              ? interpolateColors(frame, [1315 + 360, 1315 + 360 + 15], [CYAN, MAGENTA]) 
            // Pose 4: Aggressive / Loss of Control -> RED
            : interpolateColors(frame, [toneShiftFrame, toneShiftFrame + 15], [MAGENTA, RED])
          )
      // Scene 3 (Mazen / Grok) - Tone shifts synchronized with voiceover beats
      : frame < WIPE_3_START + 120 // 0-4s: "Here emerges..." -> Desaturated / Dark
        ? "#000000" // We handle desaturation with tintOpacity below
      : frame < WIPE_3_START + 330 // 4s-11s: "Musk turned on the biggest supercomputer..." -> Tech / CYAN
        ? interpolateColors(frame, [WIPE_3_START + 120, WIPE_3_START + 150], ["#000000", CYAN])
      : frame < WIPE_3_START + 570 // 11s-19s: "100k GPUs, 3 billion dollars..." -> High Stakes / MAGENTA
        ? interpolateColors(frame, [WIPE_3_START + 330, WIPE_3_START + 360], [CYAN, MAGENTA])
      // 19s+: "Open war..." -> War / RED
      : frame < WIPE_4_START
        ? interpolateColors(frame, [WIPE_3_START + 570, WIPE_3_START + 600], [MAGENTA, RED])
      // Scene 4 (Mariya / AlphaFold) - Dynamic Tone Shifts
      : frame < WIPE_4_END + 240 // Pose 1: Silent Miracle / Intro (Teal)
        ? interpolateColors(frame, [WIPE_4_START, WIPE_4_START + 60], [RED, "#005566"])
      : frame < WIPE_4_END + 450 // Pose 2: AlphaFold Prediction (CYAN)
        ? interpolateColors(frame, [WIPE_4_END + 240, WIPE_4_END + 255], ["#005566", CYAN])
      : frame < WIPE_4_END + 720 // Pose 3: Drug Discovery (MAGENTA)
        ? interpolateColors(frame, [WIPE_4_END + 450, WIPE_4_END + 465], [CYAN, MAGENTA])
      // Pose 4: Threatening Job Glitch (RED)
      : frame < WIPE_5_START // Keep Red until Scene 5 wipe starts
        ? interpolateColors(frame, [WIPE_4_END + 720, WIPE_4_END + 735], [MAGENTA, RED])
      // Scene 5 (Mazen / Survival) - Dynamic Tone Shifts
      : frame < WIPE_5_END + 180 // Act 1: Dead Network (Dark Teal)
        ? interpolateColors(frame, [WIPE_5_START, WIPE_5_START + 30], [RED, "#003344"])
      : frame < WIPE_5_END + 492 // Act 2: Bot Duel (Magenta)
        ? interpolateColors(frame, [WIPE_5_END + 180, WIPE_5_END + 195], ["#003344", MAGENTA])
      : frame < WIPE_6_START // Act 3: Code Tear (Cyan) — hold until S6 wipe
        ? interpolateColors(frame, [WIPE_5_END + 492, WIPE_5_END + 507], [MAGENTA, CYAN])
      // Scene 6 (Mariya / Maestro) — Dynamic Tone Shifts matching Voiceover Beats
      : frame < WIPE_6_END + 103 // Act 1: Intro / Future Job (Cyan)
        ? interpolateColors(frame, [WIPE_6_START, WIPE_6_START + 30], [CYAN, CYAN])
      : frame < WIPE_6_END + 345 // Act 2: N8N Orchestrator (Magenta)
        ? interpolateColors(frame, [WIPE_6_END + 103, WIPE_6_END + 118], [CYAN, MAGENTA])
      : frame < WIPE_6_END + 530 // Act 3: The "Old Way" of coding (Red for Error/Slow)
        ? interpolateColors(frame, [WIPE_6_END + 345, WIPE_6_END + 360], [MAGENTA, RED])
      // Act 4: Cinematic Payoff (Gold)
      : frame < WIPE_6_END + 630
        ? interpolateColors(frame, [WIPE_6_END + 530, WIPE_6_END + 550], [MAGENTA, "#FFBB00"])
      // Final Phrase Flare: عشان تكون دايما سابق (Pure Bright Gold)
      : frame < WIPE_7_START
        ? interpolateColors(frame, [WIPE_6_END + 630, WIPE_6_END + 645], ["#FFBB00", "#FFD700"])
      // Scene 7 (Mazen / Outro) perfectly synced with dynamic chyron colors
      : interpolateColors(
          frame - WIPE_7_START,
          [0, 140, 155, 270, 285, 350, 365, 430, 445, 500],
          [RED, RED, CYAN, CYAN, MAGENTA, MAGENTA, "#FFBB00", "#FFBB00", CYAN, CYAN]
        );

  const bgBrightness = isTopic4 ? 0.95 : isTopic2 ? 0.95 : isTopic1 ? 0.85 : 0.90;
  
  // Tint Opacity Logic:
  // Scene 1: 0.50 (Aggressive camera moves hide it)
  // Scene 2: 0.20 (Unsaturated touch)
  // Scene 3: Starts at 0 (desaturated intro), fades to 0.20 max
  // Scene 4: Fades to 0.40 for Medical AI tone
  const tintOpacity = frame < WIPE_2_START 
    ? 0.50 // Scene 1
    : frame < WIPE_3_START
      ? 0.20 // Scene 2
      : frame < WIPE_4_START
        ? (frame < WIPE_3_START + 120
            ? interpolate(frame, [WIPE_3_START, WIPE_3_START + 120], [0, 0.20], { extrapolateRight: "clamp" })
            : 0.20) // Scene 3
        : frame < WIPE_6_START
          ? 0.20 // Scenes 4, 5
          : frame < WIPE_7_START
            ? frame < WIPE_6_END + 630
              ? 0.20 // Scene 6 Acts 1-4 standard
              : interpolate(frame, [WIPE_6_END + 630, WIPE_6_END + 645], [0.20, 0.45], { extrapolateRight: "clamp" }) // Golden flare for "سابِق"
            : 0.35; // Scene 7

  // ── WIPE TRANSITION MATH (FOR HOOK TO TOPIC 1 ONLY) ──────────────────────
  const wipeProgress = interpolate(frame, [WIPE_START, WIPE_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // Heavy blur peaking at 80
  const blurX = interpolate(wipeProgress, [0, 0.4, 0.6, 1], [0, 80, 80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // RGB Split peaks during the motion
  const rgbOffset = interpolate(wipeProgress, [0, 0.5, 1], [0, 45, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // Lens flare opacity peaks exactly at midpoint
  const flareOpacity = interpolate(wipeProgress, [0.3, 0.5, 0.7], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Physical slide for the Anamorphic Whip Pan
  const hookSlide = interpolate(wipeProgress, [0, 1], [0, -100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // NOTE: topic1Slide starts at 100 and goes to 0 during WIPE_START to WIPE_END
  // We do NOT slide it out during WIPE_2 because AnamorphicWhipPan handles it.
  const topic1Slide = interpolate(wipeProgress, [0, 1], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const wipeFilter = blurX > 0.5 ? `url(#ep3-hblur) url(#ep3-rgb-split)` : "none";

  return (
    <AbsoluteFill style={{ backgroundColor: "#030308", overflow: "hidden" }}>

      {/* ── TRANSITION DEFS ── */}
      <AnamorphicWhipPanDefs blurX={blurX} rgbOffset={rgbOffset} />

      {/* ── ANAMORPHIC LENS FLARE (Razor Thin) - CYAN FOR MAZEN ── */}
      <div style={{
        position: "absolute", top: "50%", left: 0, right: 0, height: 2,
        backgroundColor: "rgba(0, 255, 255, 0.8)",
        boxShadow: "0px 0px 20px 5px rgba(0, 255, 255, 0.6), 0px 0px 50px 10px rgba(0, 100, 255, 0.4)",
        opacity: flareOpacity,
        transform: `scaleY(${flareOpacity})`,
        zIndex: 100, pointerEvents: "none",
      }} />

      {/* ── GLOBAL BACKGROUND ── */}
      <AbsoluteFill style={{ zIndex: 0, overflow: "hidden", backgroundColor: "#020202" }}>
        <Img
          src={staticFile("images/episode3/harfen-studio.jpeg")}
          style={{
            position: "absolute", width: "130%", height: "130%", left: "-15%", top: "-15%",
            objectFit: "cover", transform: `scale(${bgScale}) translateX(${bgPanX}px)`,
            transformOrigin: "center center",
            filter: `blur(${bgBlur}px) grayscale(1) sepia(0.4) contrast(1.3) brightness(${bgBrightness})`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: tintColor, mixBlendMode: "multiply", opacity: tintOpacity, pointerEvents: "none", zIndex: 1 }} />

      {/* ── SCENE A: THE HOOK ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10, transform: `translateX(${hookSlide}%)`, filter: wipeFilter }}>
        <Sequence from={0} durationInFrames={WIPE_END + 150}>
          <TheHook />
        </Sequence>
      </div>

      {/* ── SCENE B (TOPIC 1) TO SCENE C (TOPIC 2) USING ANAMORPHIC WHIP PAN ── */}
      <AbsoluteFill style={{ zIndex: 10 }}>
        <AnamorphicWhipPan
          transitionStartFrame={WIPE_2_START}
          durationFrames={WIPE_2_END - WIPE_2_START}
          caColorA="rgba(0, 229, 204, 0.2)"
          caColorB="rgba(255, 0, 85, 0.2)"
          flareColor="rgba(255, 0, 85, 0.6)"
          childrenA={
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${topic1Slide}%)`, filter: wipeFilter }}>
              <Sequence from={198} durationInFrames={(WIPE_2_END - 198) + 150}>
                <Topic1Google />
              </Sequence>
            </div>
          }
          childrenB={
            <AnamorphicWhipPan
              transitionStartFrame={WIPE_3_START}
              durationFrames={WIPE_3_END - WIPE_3_START}
              caColorA="rgba(255, 0, 85, 0.2)"
              caColorB="rgba(0, 229, 204, 0.2)"
              flareColor="rgba(0, 229, 204, 0.6)"
              childrenA={
                <Sequence from={WIPE_2_START} durationInFrames={(WIPE_3_END - WIPE_2_START) + 150}>
                  <Topic2Strawberry />
                </Sequence>
              }
              childrenB={
                <AnamorphicWhipPan
                  transitionStartFrame={WIPE_4_START}
                  durationFrames={WIPE_4_END - WIPE_4_START}
                  caColorA="rgba(0, 229, 204, 0.2)"
                  caColorB="rgba(255, 0, 85, 0.2)"
                  flareColor="rgba(255, 0, 85, 0.6)"
                  childrenA={
                    <Sequence from={WIPE_3_START} durationInFrames={(WIPE_4_END - WIPE_3_START) + 150}>
                      <Topic3Grok />
                    </Sequence>
                  }
                  childrenB={
                    <AnamorphicWhipPan
                      transitionStartFrame={WIPE_5_START}
                      durationFrames={WIPE_5_END - WIPE_5_START}
                      caColorA="rgba(255, 0, 85, 0.2)"
                      caColorB="rgba(0, 229, 204, 0.2)"
                      flareColor="rgba(0, 229, 204, 0.6)"
                      childrenA={
                        <Sequence from={WIPE_4_START} durationInFrames={(WIPE_5_END - WIPE_4_START) + 150}>
                          <Topic4AlphaFold />
                        </Sequence>
                      }
                      childrenB={
                        <AnamorphicWhipPan
                          transitionStartFrame={WIPE_6_START}
                          durationFrames={WIPE_6_END - WIPE_6_START}
                          caColorA="rgba(0, 229, 204, 0.2)"
                          caColorB="rgba(255, 187, 0, 0.25)"
                          flareColor="rgba(255, 187, 0, 0.7)"
                          childrenA={
                            <Sequence from={WIPE_5_START} durationInFrames={(WIPE_6_END - WIPE_5_START) + 150}>
                              <Topic5Survival />
                            </Sequence>
                          }
                          childrenB={
                            <AnamorphicWhipPan
                              transitionStartFrame={WIPE_7_START}
                              durationFrames={WIPE_7_END - WIPE_7_START}
                              caColorA="rgba(255, 187, 0, 0.25)"
                              caColorB="rgba(0, 229, 204, 0.2)"
                              flareColor="rgba(0, 229, 204, 0.6)"
                              childrenA={
                                <Sequence from={WIPE_6_START} durationInFrames={(WIPE_7_END - WIPE_6_START) + 150}>
                                  <Topic6Maestro />
                                </Sequence>
                              }
                              childrenB={
                                <AnamorphicWhipPan
                                  transitionStartFrame={WIPE_8_START}
                                  durationFrames={WIPE_8_END - WIPE_8_START}
                                  caColorA="rgba(0, 229, 204, 0.25)"
                                  caColorB="rgba(236, 72, 153, 0.2)"
                                  flareColor="rgba(236, 72, 153, 0.6)"
                                  childrenA={
                                    <Sequence from={WIPE_7_START} durationInFrames={(WIPE_8_END - WIPE_7_START) + 150}>
                                      <Topic7Outro />
                                    </Sequence>
                                  }
                                  childrenB={
                                    <Sequence from={WIPE_8_START}>
                                      <BrandOutroHorizontal />
                                    </Sequence>
                                  }
                                />
                              }
                            />
                          }
                        />
                      }
                    />
                  }
                />
              }
            />
          }
        />
      </AbsoluteFill>

      {/* ── GLOBAL GRAIN ── */}
      <GlobalTexture />

    </AbsoluteFill>
  );
};
