import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

const AnimatedNumber: React.FC<{
  target: number;
  prefix?: string;
  suffix?: string;
  startFrame: number;
  endFrame: number;
  color?: string;
}> = ({ target, prefix = "", suffix = "", startFrame, endFrame, color = "#ffffff" }) => {
  const frame = useCurrentFrame();
  const progress = easeOutExpo(
    Math.min(1, Math.max(0, (frame - startFrame) / (endFrame - startFrame)))
  );
  const value = Math.floor(progress * target);
  const formatted = value.toLocaleString("en-US");

  return (
    <span style={{ color, fontVariantNumeric: "tabular-nums" }}>
      {prefix}{formatted}{suffix}
    </span>
  );
};

export const Scene5_Revenue: React.FC = () => {
  const frame = useCurrentFrame();
  const exitOpacity = interpolate(frame, [240, 280], [1, 0], { extrapolateRight: "clamp" });
  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 30], [20, 0], { extrapolateRight: "clamp" });

  const card1Opacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" });
  const card1Y = interpolate(frame, [20, 50], [40, 0], { extrapolateRight: "clamp" });
  const card2Opacity = interpolate(frame, [45, 75], [0, 1], { extrapolateRight: "clamp" });
  const card2Y = interpolate(frame, [45, 75], [40, 0], { extrapolateRight: "clamp" });
  const card3Opacity = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: "clamp" });
  const card3Y = interpolate(frame, [70, 100], [40, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        flexDirection: "column",
        padding: "0 60px",
        gap: 24,
        opacity: exitOpacity,
        background: "linear-gradient(180deg, #030308 0%, #050a1a 60%, #030308 100%)",
      }}
    >
      {/* Header */}
      <div style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)`, marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: 8, color: "#34d399", textTransform: "uppercase", marginBottom: 10 }}>
          Revenue Intelligence
        </div>
        <div style={{ fontSize: 58, fontWeight: 900, color: "#ffffff", letterSpacing: -2, lineHeight: 1.1 }}>
          The numbers<br />
          <span style={{ color: "#34d399" }}>speak for themselves.</span>
        </div>
      </div>

      {/* Stat Card 1 — Monthly Revenue */}
      <div style={{
        opacity: card1Opacity, transform: `translateY(${card1Y}px)`,
        background: "rgba(52,211,153,0.07)", border: "1.5px solid rgba(52,211,153,0.25)",
        borderRadius: 20, padding: "28px 32px",
      }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: 4, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
          Monthly Revenue
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: -3, lineHeight: 1 }}>
          <AnimatedNumber target={142500} prefix="$" startFrame={30} endFrame={180} color="#34d399" />
        </div>
        <div style={{ fontSize: 18, color: "#22d3ee", fontWeight: 700, marginTop: 8 }}>
          +321% vs Last Month
        </div>
      </div>

      {/* Stat Card 2 — Direct Bookings */}
      <div style={{
        opacity: card2Opacity, transform: `translateY(${card2Y}px)`,
        background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: "28px 32px",
      }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: 4, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
          Direct Bookings
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: -3, lineHeight: 1, color: "#ffffff" }}>
          <AnimatedNumber target={482} startFrame={50} endFrame={180} />
        </div>
        <div style={{ fontSize: 18, color: "#f59e0b", fontWeight: 700, marginTop: 8 }}>
          0% Commission Paid
        </div>
      </div>

      {/* Stat Card 3 — Airbnb Fees Saved */}
      <div style={{
        opacity: card3Opacity, transform: `translateY(${card3Y}px)`,
        background: "rgba(245,158,11,0.07)", border: "1.5px solid rgba(245,158,11,0.25)",
        borderRadius: 20, padding: "28px 32px",
      }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: 4, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
          Airbnb Fees Saved
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: -3, lineHeight: 1 }}>
          <AnimatedNumber target={28500} prefix="$" startFrame={70} endFrame={190} color="#f59e0b" />
        </div>
        <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", fontWeight: 700, marginTop: 8 }}>
          Taken back from middlemen
        </div>
      </div>
    </AbsoluteFill>
  );
};
