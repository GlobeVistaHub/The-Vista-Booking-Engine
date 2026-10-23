import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const Scene4_Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainScale = spring({ frame, fps, config: { damping: 18, stiffness: 60 }, durationInFrames: 60 });
  const titleOpacity = interpolate(frame, [20, 60], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [20, 60], [30, 0], { extrapolateRight: "clamp" });
  const badgeOpacity = interpolate(frame, [60, 100], [0, 1], { extrapolateRight: "clamp" });
  const line1Opacity = interpolate(frame, [80, 130], [0, 1], { extrapolateRight: "clamp" });
  const line2Opacity = interpolate(frame, [110, 160], [0, 1], { extrapolateRight: "clamp" });
  const line3Opacity = interpolate(frame, [140, 190], [0, 1], { extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [260, 300], [1, 0], { extrapolateRight: "clamp" });

  const glowRadius = interpolate(frame, [0, 120], [0, 1], { extrapolateRight: "clamp" });

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
      {/* Dynamic background glow */}
      <div style={{
        position: "absolute",
        width: 800, height: 800, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(245,158,11,${0.12 * glowRadius}) 0%, transparent 70%)`,
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
      }} />

      {/* Eyebrow badge */}
      <div style={{
        opacity: badgeOpacity,
        border: "1px solid rgba(245,158,11,0.4)",
        background: "rgba(245,158,11,0.08)",
        borderRadius: 100,
        padding: "10px 28px",
        fontSize: 12, fontWeight: 900, letterSpacing: 6, color: "#f59e0b", textTransform: "uppercase",
        marginBottom: 28,
      }}>
        ✦ Proprietary Architecture
      </div>

      {/* Main statement */}
      <div style={{ textAlign: "center", opacity: titleOpacity, transform: `translateY(${titleY}px) scale(${mainScale})` }}>
        <div style={{ fontSize: 90, fontWeight: 900, color: "#ffffff", letterSpacing: -4, lineHeight: 1 }}>
          THIS ISN'T<br />A TEMPLATE.
        </div>
        <div style={{ fontSize: 90, fontWeight: 900, color: "#f59e0b", letterSpacing: -4, lineHeight: 1, marginTop: 8 }}>
          IT'S YOUR<br />ADVANTAGE.
        </div>
      </div>

      {/* Feature list */}
      <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 16, alignSelf: "stretch" }}>
        {[
          { text: "Higher margins", color: "#34d399", opacity: line1Opacity },
          { text: "Direct guest relationships", color: "#22d3ee", opacity: line2Opacity },
          { text: "Zero middlemen", color: "#f59e0b", opacity: line3Opacity },
        ].map(({ text, color, opacity }) => (
          <div key={text} style={{
            opacity,
            display: "flex", alignItems: "center", gap: 16,
            transform: `translateX(${interpolate(opacity, [0, 1], [-20, 0])}px)`,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 12px ${color}`, flexShrink: 0 }} />
            <span style={{ fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{text}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
