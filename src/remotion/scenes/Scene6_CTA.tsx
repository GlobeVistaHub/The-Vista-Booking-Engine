import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";

export const Scene6_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgGlow = interpolate(frame, [0, 90], [0, 1], { extrapolateRight: "clamp" });
  const tagOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const tagY = interpolate(frame, [0, 25], [15, 0], { extrapolateRight: "clamp" });

  const mainScale = spring({ frame, fps, config: { damping: 16, stiffness: 70 }, durationInFrames: 50 });
  const mainOpacity = interpolate(frame, [10, 45], [0, 1], { extrapolateRight: "clamp" });

  const subOpacity = interpolate(frame, [50, 85], [0, 1], { extrapolateRight: "clamp" });
  const subY = interpolate(frame, [50, 85], [15, 0], { extrapolateRight: "clamp" });

  const urlOpacity = interpolate(frame, [80, 120], [0, 1], { extrapolateRight: "clamp" });
  const urlGlow = interpolate(frame, [100, 170], [0, 1], { extrapolateRight: "clamp" });

  const dividerWidth = interpolate(frame, [60, 110], [0, 960], { extrapolateRight: "clamp" });

  // Partners badge pulses
  const pulseBadge = 0.85 + 0.15 * Math.sin((frame / fps) * Math.PI * 2);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "0 60px",
        gap: 20,
        background: "#030308",
      }}
    >
      {/* Radial glow */}
      <div style={{
        position: "absolute",
        width: 900, height: 900, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(245,158,11,${0.18 * bgGlow}) 0%, transparent 65%)`,
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }} />

      {/* Tag */}
      <div style={{
        opacity: tagOpacity, transform: `translateY(${tagY}px)`,
        fontSize: 13, fontWeight: 900, letterSpacing: 8, color: "#f59e0b",
        textTransform: "uppercase",
      }}>
        ✦ Exclusive Offer
      </div>

      {/* Main CTA (Replaced with Harfen Animating Logo) */}
      <div style={{
        position: "relative",
        width: 300, height: 300,
        opacity: mainOpacity,
        transform: `scale(${mainScale})`,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        {/* Outer Ring */}
        <Img 
          src={staticFile("youtube-assets/outer-ring.png")}
          style={{
            position: "absolute",
            width: "100%", height: "100%",
            transform: `rotate(${(frame * 2) % 360}deg)`,
            filter: `brightness(1.5) drop-shadow(0px 0px 40px rgba(34,211,238,0.5))`,
          }}
        />
        {/* Inner Heart (Teal Half) */}
        <div style={{
          position: "absolute",
          width: "60%", height: "60%",
          transform: `rotate(${-(frame * 1.5) % 360}deg)`,
          filter: `drop-shadow(0px 0px 20px rgba(34,211,238,0.6))`,
        }}>
          <Img src={staticFile("youtube-assets/heart-teal.png")} style={{ width: "100%", height: "100%" }} />
        </div>
        {/* Inner Heart (Pink Half) */}
        <div style={{
          position: "absolute",
          width: "60%", height: "60%",
          transform: `rotate(${-(frame * 2.5) % 360}deg)`,
          filter: `drop-shadow(0px 0px 20px rgba(236,72,153,0.6))`,
        }}>
          <Img src={staticFile("youtube-assets/heart-pink.png")} style={{ width: "100%", height: "100%" }} />
        </div>
      </div>

      {/* Pulsing partners badge */}
      <div style={{
        opacity: subOpacity,
        transform: `translateY(${subY}px) scale(${pulseBadge})`,
        background: "rgba(245,158,11,0.1)",
        border: "1.5px solid rgba(245,158,11,0.5)",
        borderRadius: 100,
        padding: "14px 36px",
        fontSize: 18, fontWeight: 700, color: "#f59e0b", letterSpacing: 2,
        boxShadow: `0 0 ${30 * urlGlow}px rgba(245,158,11,0.4)`,
      }}>
        If you're ready to own your funnel — let's talk.
      </div>

      {/* Divider */}
      <div style={{
        width: dividerWidth, height: 1,
        background: "linear-gradient(to right, transparent, rgba(245,158,11,0.5), transparent)",
      }} />

      {/* URL Glow */}
      <div style={{
        opacity: urlOpacity,
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 28, fontWeight: 900, letterSpacing: 4, color: "#ffffff",
          textShadow: `0 0 ${40 * urlGlow}px rgba(34,211,238,0.9), 0 0 ${80 * urlGlow}px rgba(34,211,238,0.4)`,
        }}>
          youtube.com/@HarfenWLaken
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", letterSpacing: 3, marginTop: 8, textTransform: "uppercase" }}>
          Subscribe Now ↗
        </div>
      </div>
    </AbsoluteFill>
  );
};
