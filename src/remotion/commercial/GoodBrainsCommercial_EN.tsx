import React from "react";
import {
  AbsoluteFill,
  Video,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  random,
} from "remotion";
import { GoodBrainsHookEN } from "./GoodBrainsHook_EN";

// ─────────────────────────────────────────────
// DESIGN TOKENS — Standalone Cinematic Palette
// ─────────────────────────────────────────────
const TOKENS = {
  // UI Box shared
  boxBg: "rgba(5, 5, 10, 0.65)",
  boxBlur: "blur(18px)",
  borderRadius: 12,
  fontEnglish: "'Inter', 'Outfit', 'Segoe UI', Tahoma, Arial, sans-serif",
  fontMono: "'Courier New', monospace",

  // Act 1 — Error (Red)
  act1Border: "#FF3B30",
  act1Glow: "rgba(255, 59, 48, 0.9)",
  act1Tag: "#FF3B30",

  // Act 2 — Pivot (Cyber Teal)
  act2Border: "#00C2D4",
  act2Glow: "rgba(0, 194, 212, 0.85)",
  act2Tag: "#00C2D4",
  act2Text: "#E0FEFF",

  // Act 3 — Success (GoodBrains Green)
  act3Border: "#0C7735",
  act3Glow: "rgba(12, 119, 53, 0.7)",
  act3Tag: "#34D058",
};

// ─────────────────────────────────────────────
// SCENE TIMELINE  (30 fps)
// ─────────────────────────────────────────────
const FPS = 30;
const f = (sec: number) => Math.round(sec * FPS);

// Act 1 scenes
const SCENES = [
  // ACT 1: THE NIGHTMARE
  { id: "s1",  from: f(0),   dur: f(4),  icon: "⏳", tag: "[ LOADING FAILED ]",        caption: "You wake up to find the day is already ahead of you", act: 1, sync: "snap"   },
  { id: "s2",  from: 140,    dur: 55,    icon: "⚠️", tag: "[ WARNING: TASK OVERLOAD ]",         caption: "Frustrated for no apparent reason",    act: 1, sync: "hover"  },
  { id: "s3",  from: f(10),  dur: 52,    icon: "🔒", tag: "[ ACCESS DENIED ]",              caption: "And doors keep shutting in your face",           act: 1, sync: "shatter" },
  { id: "s4",  from: 432,    dur: f(3),  icon: "🔄", tag: "[ CLIENT SYNC FAILED ]",          caption: "You feel like it's out to get you",            act: 1, sync: "track"  },
  { id: "s5",  from: 612,    dur: 73,    icon: "🚨", tag: "[ CRITICAL ERROR: IMBALANCE ]",   caption: "And the ones closest to you pay the price", act: 1, sync: "overlay" },
  { id: "s67", from: 876,    dur: 114,   icon: "🔋", tag: "[ SYSTEM POWER: 0% ]",            caption: "Running out of breath with no results",              act: 1, sync: "drain"  },
  // ACT 2: THE PIVOT
  { id: "s8",  from: 1048,   dur: 158,   icon: "🔍", tag: "[ SCANNING SYSTEM ]",         caption: "There's a glitch disrupting your rhythm", act: 2, sync: "sweep"  },
  // ACT 3: AHEAD OF THE CURVE
  { id: "s9",  from: f(43),  dur: 59,    icon: "✅", tag: "[ WORKFLOWS OPTIMIZED ]",      caption: "Take back control of your time",        act: 3, sync: "fade"   },
  { id: "s10", from: 1408,   dur: 122,   icon: "⏩", tag: "[ AUTO-PATH ACTIVE ]",           caption: "Always stay one step ahead",        act: 3, sync: "track"  },
  { id: "s11", from: f(52),  dur: f(3),  icon: "🔓", tag: "[ CONTROL RESTORED ]",          caption: "Open new doors to success",                   act: 3, sync: "fade"   },
  { id: "s12", from: 1698,   dur: 79,    icon: "📅", tag: "[ SCHEDULE FREED ]",            caption: "And be present in the moments that matter", act: 3, sync: "fade"   },
  { id: "s13", from: f(61),  dur: 58,    icon: "⚙️", tag: "[ BACKGROUND TASKS: COMPLETE ]",  caption: "Because we carry the entire load for you",     act: 3, sync: "watch"  }
] as const;

type SyncType = (typeof SCENES)[number]["sync"];

// ─────────────────────────────────────────────
// ACT COLOR HELPER
// ─────────────────────────────────────────────
function actColors(act: number) {
  if (act === 1) return { border: TOKENS.act1Border, glow: TOKENS.act1Glow, tag: TOKENS.act1Tag,  text: "#FFFFFF" };
  if (act === 2) return { border: TOKENS.act2Border, glow: TOKENS.act2Glow, tag: TOKENS.act2Tag,  text: TOKENS.act2Text };
  return          { border: TOKENS.act3Border, glow: TOKENS.act3Glow, tag: TOKENS.act3Tag,  text: "#FFFFFF" };
}

// ─────────────────────────────────────────────
// GLASSMORPHIC UI BOX
// ─────────────────────────────────────────────
const UIBox: React.FC<{
  icon: string;
  tag: string;
  caption: string;
  act: number;
  sync: SyncType;
  totalDur: number;
}> = ({ icon, tag, caption, act, sync, totalDur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const colors = actColors(act);

  // ── ENTRY ANIMATION ──
  const snapProgress = spring({ frame, fps, config: { damping: 14, stiffness: 200 }, durationInFrames: 12 });

  // Snap / glitch entry (Act 1)
  const entryScale = act === 1
    ? interpolate(snapProgress, [0, 1], [0.5, 1])
    : interpolate(Math.min(frame / 12, 1), [0, 1], [0.92, 1]);

  const entryOpacity = act === 3
    ? interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" })
    : interpolate(snapProgress, [0, 0.4, 0.6, 1], [0, 1, 0.3, 1]);

  // ── EXIT ANIMATION ──
  const exitStart = totalDur - 8;
  const exitProgress = frame >= exitStart ? interpolate(frame, [exitStart, totalDur], [0, 1], { extrapolateRight: "clamp" }) : 0;
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]); // Universal smooth fade out

  // ── HOVER & CAMERA TRACKING ──
  let trackX = 0;
  let trackY = sync === "hover" ? Math.sin(frame * 0.1) * 4 : 0; // Smoothed hover
  
  if (sync === "track") {
    // Very slow, smooth cinematic drift. No rotation.
    trackX = Math.sin(frame * 0.05) * 5;
    trackY = Math.cos(frame * 0.08) * 4;
  }

  // Caption smooth fade-in after box appears
  const captionOp = interpolate(frame, [5, 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // ── DRAIN ANIMATION (Scene 6/7 battery) ──
  const batteryWidth = sync === "drain"
    ? interpolate(frame, [0, totalDur], [100, 0], { extrapolateRight: "clamp" })
    : 100;

  const opacity = entryOpacity * exitOpacity;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: "6%", // Unified level for all Acts
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          transform: `scale(${entryScale}) translate(${trackX}px, ${trackY}px)`,
          opacity,
          willChange: "transform, opacity",
          maxWidth: "1000px", // Increased max width for English text
          width: "90%",
        }}
      >
        {/* THE GLASSMORPHIC BOX */}
        <div
          style={{
            background: TOKENS.boxBg,
            backdropFilter: TOKENS.boxBlur,
            WebkitBackdropFilter: TOKENS.boxBlur,
            border: `2px solid ${colors.border}`,
            borderRadius: TOKENS.borderRadius,
            padding: "36px 48px", // Roomy luxurious padding
            boxShadow: `0 0 24px ${colors.glow}, 0 8px 32px rgba(0,0,0,0.6)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center",
            gap: 12,
          }}
        >
          {/* TAG LINE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              direction: "ltr", // Ensure LTR layout
            }}
          >
            <span style={{ 
              fontSize: 46, // Scaled back from 52 to a perfect middle ground
              display: "inline-block",
              transform: icon === "⏳" 
                ? `rotate(${interpolate(frame % 90, [0, 15], [0, 180], { extrapolateRight: "clamp" })}deg)` 
                : icon === "⚠️"
                ? `scale(${1 + Math.sin(frame * 0.4) * (interpolate(frame, [0, totalDur], [0, 0.25], { extrapolateRight: "clamp" }))})`
                : icon === "🔄"
                ? `rotate(${frame * -10}deg) scale(${1 + Math.sin(frame * 0.5) * 0.1})`
                : icon === "🚨"
                ? `rotate(${Math.sin(frame * 0.8) * 15}deg) scale(${1 + Math.abs(Math.sin(frame * 0.4)) * 0.2})` 
                : icon === "🔍"
                ? `translateX(${Math.sin(frame * 0.1) * 8}px) rotate(${Math.cos(frame * 0.1) * 12}deg)` 
                : icon === "✅"
                ? `scale(${interpolate(frame, [0, 20], [0.5, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })})` 
                : icon === "⏩"
                ? `translateX(${Math.sin(frame * 0.15) * 6}px)` 
                : icon === "🔓"
                ? `rotate(${interpolate(frame, [0, 15], [25, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}deg)` 
                : icon === "📅"
                ? `translateY(${Math.sin(frame * 0.08) * -5}px)` 
                : icon === "⚙️"
                ? `rotate(${frame * 2}deg)` 
                : "none",
              opacity: icon === "🔋" ? (Math.floor(frame / 8) % 2 === 0 ? 0.2 : 0.8) : 1, // Flashing low power
              filter: icon === "⚠️"
                ? `hue-rotate(${interpolate(frame, [0, totalDur], [0, -55], { extrapolateRight: "clamp" })}deg) saturate(${interpolate(frame, [0, totalDur], [1, 4], { extrapolateRight: "clamp" })})`
                : icon === "🔋"
                ? "grayscale(100%) brightness(0.8)" // Turn the green battery completely dead grey
                : "none"
            }}>
              {icon}
            </span>
            <span
              style={{
                fontFamily: TOKENS.fontMono,
                fontSize: 36, // Dialed back for balance
                color: colors.tag,
                textShadow: `0 0 16px ${colors.glow}`,
                letterSpacing: 2,
                fontWeight: 800,
                whiteSpace: "nowrap", // Prevents the closing bracket from wrapping to a new line
              }}
            >
              {tag.includes("FAILED") ? (
                <>
                  {tag.split("FAILED")[0]}
                  <span style={{ 
                    color: "#FF2A2A", 
                    display: "inline-block", 
                    transform: `scale(${1 + Math.sin(frame * 0.1) * 0.12})`, 
                    transformOrigin: "center",
                    willChange: "transform",
                    textShadow: "0 0 24px #FF2A2A" 
                  }}>
                    FAILED
                  </span>
                  {tag.split("FAILED")[1]}
                </>
              ) : tag}
            </span>
          </div>

          {/* ENGLISH CAPTION (Smooth Fade-in) */}
          <div
            style={{
              fontFamily: TOKENS.fontEnglish,
              fontSize: 56, // The perfect sweet spot (between 50 and 64)
              fontWeight: 900,
              color: colors.text,
              textAlign: "center",
              direction: "ltr",
              lineHeight: 1.25,
              textShadow: `
                0px 6px 16px rgba(0,0,0,0.8), 
                0px 2px 4px rgba(0,0,0,0.9), 
                0 0 24px ${colors.glow}
              `,
              opacity: captionOp, 
            }}
          >
            {caption}
          </div>

          {/* DRAIN BAR (Scene 6/7 only) */}
          {sync === "drain" && (
            <div
              style={{
                width: "100%",
                height: 6,
                background: "rgba(255,255,255,0.15)",
                borderRadius: 3,
                overflow: "hidden",
                marginTop: 4,
              }}
            >
              <div
                style={{
                  width: `${batteryWidth}%`,
                  height: "100%",
                  background: batteryWidth > 30 ? colors.border : "#FF3B30",
                  borderRadius: 3,
                  transition: "background 0.3s",
                  boxShadow: `0 0 8px ${colors.glow}`,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────
// ACT 2 LASER SHARD — shatters old red boxes
// ─────────────────────────────────────────────
const LaserWashTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 20], [0, 1920], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 3, 18, 20], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ zIndex: 200, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: progress - 4,
          width: 4,
          height: "100%",
          background: "linear-gradient(180deg, transparent 0%, #00C2D4 40%, #ffffff 50%, #00C2D4 60%, transparent 100%)",
          boxShadow: "0 0 40px #00C2D4, 0 0 80px rgba(0,194,212,0.5)",
          opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: progress,
          height: "100%",
          background: "linear-gradient(90deg, rgba(0,194,212,0.04) 0%, rgba(0,194,212,0.01) 100%)",
          opacity,
        }}
      />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────
// INTRO LIGHT LEAK TRANSITION (Hook -> Commercial)
// ─────────────────────────────────────────────
const IntroLightLeakTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10, 20], [0, 1, 0]);
  const scale = interpolate(frame, [0, 20], [1, 5]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 1000, pointerEvents: "none" }}>
      <div style={{
        width: "100%", height: "100%",
        background: "radial-gradient(ellipse at center, rgba(167, 255, 187, 1) 0%, rgba(52, 208, 88, 0.8) 40%, transparent 80%)",
        opacity,
        transform: `scale(${scale})`,
        mixBlendMode: "screen"
      }} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPOSITION
// ─────────────────────────────────────────────
export const GoodBrainsCommercialEN: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>

      {/* ── 0. HOOK (0 to 75 frames) ── */}
      <Sequence from={0} durationInFrames={75}>
        <GoodBrainsHookEN />
      </Sequence>

      {/* ── 0.5 LIGHT LEAK TRANSITION (65 to 85 frames) ── */}
      <Sequence from={65} durationInFrames={20}>
        <IntroLightLeakTransition />
      </Sequence>

      {/* ── MAIN COMMERCIAL (Shifted 75 frames forward) ── */}
      <Sequence from={75}>
        {/* ── 1. BASE VIDEO ── */}
        <AbsoluteFill>
          <Video
            src={staticFile(
              "standalone-studycase-gb-commercial/Commercial_2_Study_Case_Harfen_W_Laken_Good_Brains_MP4_English_280926.mp4"
            )}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>

        {/* ── 2. SCENE UI OVERLAYS ── */}
        {SCENES.map((scene) => (
          <Sequence key={scene.id} from={scene.from} durationInFrames={scene.dur}>
            <UIBox
              icon={scene.icon}
              tag={scene.tag}
              caption={scene.caption}
              act={scene.act}
              sync={scene.sync}
              totalDur={scene.dur}
            />
          </Sequence>
        ))}

        {/* ── 3. ACT 1→2 LASER WASH TRANSITION (at 00:36 = frame 1080) ── */}
        <Sequence from={f(36)} durationInFrames={20}>
          <LaserWashTransition />
        </Sequence>

        {/* ── 4. VIGNETTE & CINEMATIC BLEND LAYER (Removed per user request) ── */}
      </Sequence>

    </AbsoluteFill>
  );
};

export const GB_COMMERCIAL_EN_DURATION = f(69) + 75;
