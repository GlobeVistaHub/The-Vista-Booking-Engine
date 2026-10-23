import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TECH_STACK = [
  { name: "Next.js 16",   sub: "Near-instant load times",       color: "#ffffff", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.15)", icon: "⚡" },
  { name: "n8n",          sub: "Real-time automation engine",   color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.3)",  icon: "⚙️" },
  { name: "Gemini AI",    sub: "Native voice concierge",        color: "#22d3ee", bg: "rgba(34,211,238,0.08)",  border: "rgba(34,211,238,0.3)",  icon: "🧠" },
  { name: "Paymob",       sub: "Seamless native payments",      color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.3)", icon: "💳" },
];

const TechCard: React.FC<{ item: typeof TECH_STACK[0]; delay: number }> = ({ item, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardY = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 100 }, durationInFrames: 40 });
  const cardOpacity = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      opacity: cardOpacity,
      transform: `translateY(${interpolate(cardY, [0, 1], [60, 0])}px)`,
      background: item.bg,
      border: `1.5px solid ${item.border}`,
      borderRadius: 20,
      padding: "28px 32px",
      display: "flex",
      alignItems: "center",
      gap: 20,
      backdropFilter: "blur(20px)",
    }}>
      <div style={{ fontSize: 40 }}>{item.icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 900, color: item.color, letterSpacing: -0.5 }}>{item.name}</div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", marginTop: 4, fontWeight: 500 }}>{item.sub}</div>
      </div>
      {/* Glowing right indicator */}
      <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: item.color, boxShadow: `0 0 16px ${item.color}` }} />
    </div>
  );
};

export const Scene3_Tech: React.FC = () => {
  const frame = useCurrentFrame();
  const exitOpacity = interpolate(frame, [240, 280], [1, 0], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 25], [20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        flexDirection: "column",
        padding: "0 60px",
        gap: 20,
        opacity: exitOpacity,
        background: "linear-gradient(180deg, #030308 0%, #0a0e27 50%, #030308 100%)",
      }}
    >
      {/* Section label */}
      <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: 8, color: "#f59e0b", textTransform: "uppercase", marginBottom: 12 }}>
          Under the Hood
        </div>
        <div style={{ fontSize: 54, fontWeight: 900, color: "#ffffff", letterSpacing: -2, lineHeight: 1.1 }}>
          Industrial-Grade<br />
          <span style={{ color: "#22d3ee" }}>Technology.</span>
        </div>
      </div>

      {/* Cards fly in staggered */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
        {TECH_STACK.map((item, i) => (
          <TechCard key={item.name} item={item} delay={30 + i * 18} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
