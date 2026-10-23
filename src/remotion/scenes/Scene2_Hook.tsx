import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Each word slams in one by one — Apple-style kinetic impact typography
const KineticWord: React.FC<{ word: string; delay: number; color?: string; size?: number }> = ({
  word, delay, color = "#ffffff", size = 96
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 200 }, durationInFrames: 25 });
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blur = interpolate(frame - delay, [0, 15], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <span style={{
      display: "inline-block",
      opacity,
      color,
      fontSize: size,
      fontWeight: 900,
      letterSpacing: -3,
      lineHeight: 1.1,
      filter: `blur(${blur}px)`,
      transform: `scale(${scale})`,
      transformOrigin: "center",
    }}>
      {word}{" "}
    </span>
  );
};

export const Scene2_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const exitOpacity = interpolate(frame, [220, 260], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "0 60px",
        opacity: exitOpacity,
        background: "#030308",
      }}
    >
      {/* Line 1: Big bold slam */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <KineticWord word="Stop" delay={0} color="#f59e0b" size={110} />
        <KineticWord word="fighting" delay={8} size={110} />
        <br />
        <KineticWord word="clunky" delay={18} size={110} />
        <KineticWord word="templates." delay={28} size={110} />
      </div>

      {/* Divider line */}
      <div style={{
        width: interpolate(frame, [50, 90], [0, 500], { extrapolateRight: "clamp" }),
        height: 2,
        background: "linear-gradient(to right, transparent, #f59e0b, transparent)",
        marginBottom: 40,
        opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" }),
      }} />

      {/* Line 2: Subtitle slams in */}
      <div style={{ textAlign: "center", opacity: interpolate(frame, [80, 120], [0, 1], { extrapolateRight: "clamp" }) }}>
        <p style={{
          fontSize: 36, fontWeight: 400, color: "rgba(255,255,255,0.6)", letterSpacing: 0, lineHeight: 1.5,
          transform: `translateY(${interpolate(frame, [80, 120], [20, 0], { extrapolateRight: "clamp" })}px)`,
        }}>
          The luxury property market in 2026<br />
          demands a{" "}
          <span style={{ color: "#22d3ee", fontWeight: 900 }}>platform</span>.
        </p>
      </div>

      {/* Ambient line bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(to right, transparent, rgba(245,158,11,0.3), transparent)",
      }} />
    </AbsoluteFill>
  );
};
