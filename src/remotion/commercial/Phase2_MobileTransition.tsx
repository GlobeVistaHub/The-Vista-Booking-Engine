import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const Phase2_MobileTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background Blur effect
  const blurAmount = interpolate(frame, [0, 15], [0, 15], {
    extrapolateRight: "clamp",
  });

  // Mobile Phone Scale
  const phoneScale = spring({
    frame: frame - 5, // Starts slightly after the scene begins
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  // Kinetic Text Opacity
  const textOpacity = interpolate(frame, [20, 30], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 1. Blurred Background */}
      <AbsoluteFill>
        <Img
          src={staticFile("youtube-assets/ai-studio/office-bg.jpeg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: `blur(${blurAmount}px) brightness(0.6)`,
            transform: "scale(1.1)", // Prevent blur bleed edges
          }}
        />
      </AbsoluteFill>

      {/* 2. Mobile Phone Container */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${phoneScale})`,
        }}
      >
        <div
          style={{
            width: "450px",
            height: "900px",
            backgroundColor: "rgba(10, 10, 15, 0.85)",
            borderRadius: "60px",
            border: "8px solid #22d3ee",
            boxShadow: "0px 0px 80px rgba(34, 211, 238, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* 3. Kinetic Text */}
          <h1
            style={{
              color: "#fff",
              fontSize: "60px",
              fontFamily: "Tajawal, sans-serif",
              fontWeight: 800,
              textAlign: "center",
              lineHeight: 1.4,
              opacity: textOpacity,
              textShadow: "0px 0px 20px rgba(236, 72, 153, 0.8)",
            }}
          >
            أيوه الصبر جميل..
            <br />
            <span style={{ color: "#ec4899" }}>بس لما تعرف تصطاد</span>
          </h1>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
