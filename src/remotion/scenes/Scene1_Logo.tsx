import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const Scene1_Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 14, stiffness: 80 }, durationInFrames: 50 });
  const logoOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [40, 80], [0, 1], { extrapolateRight: "clamp" });
  const taglineY = interpolate(frame, [40, 80], [20, 0], { extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [160, 200], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 24,
        opacity: exitOpacity,
        background: "radial-gradient(ellipse at center, #0a0e27 0%, #030308 100%)",
      }}
    >
      {/* Ambient glow behind logo */}
      <div style={{
        position: "absolute",
        width: 400, height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)",
        transform: `scale(${logoScale})`,
      }} />

      {/* Logo wordmark */}
      <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})`, textAlign: "center" }}>
        <div style={{
          fontSize: 14, fontWeight: 900, letterSpacing: 12, color: "#f59e0b",
          textTransform: "uppercase", marginBottom: 16,
        }}>
          ✦ GLOBEVISTAHUB ✦
        </div>
        <div style={{
          fontSize: 120, fontWeight: 900, color: "#ffffff",
          letterSpacing: -4, lineHeight: 1, textShadow: "0 0 80px rgba(245,158,11,0.4)",
        }}>
          THE<br />VISTA
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        opacity: taglineOpacity,
        transform: `translateY(${taglineY}px)`,
        display: "flex", alignItems: "center", gap: 16, marginTop: 8,
      }}>
        <div style={{ width: 40, height: 1, background: "rgba(245,158,11,0.5)" }} />
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: 6, textTransform: "uppercase", fontWeight: 700 }}>
          Spatial UI Engineering
        </span>
        <div style={{ width: 40, height: 1, background: "rgba(245,158,11,0.5)" }} />
      </div>
    </AbsoluteFill>
  );
};
