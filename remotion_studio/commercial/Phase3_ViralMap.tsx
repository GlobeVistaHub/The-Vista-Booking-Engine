import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const Phase3_ViralMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Create a zooming effect for the background video to make it dynamic
  const videoScale = interpolate(frame, [0, 8 * fps], [1.1, 1.0], {
    extrapolateRight: "clamp",
  });

  // Calculate which city we are currently showing (each is 2 seconds)
  const cityIndex = Math.floor(frame / (2 * fps));
  const cities = ["The Gulf", "Europe", "United Kingdom", "United States"];
  const currentCity = cities[cityIndex] || cities[3];

  // Hologram text pop-in animation (triggers every 2 seconds when city changes)
  const cityFrame = frame % (2 * fps);
  const textScale = spring({
    frame: cityFrame,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Background Stitched Video */}
      <AbsoluteFill style={{ transform: `scale(${videoScale})` }}>
        <OffthreadVideo
          src={staticFile("youtube-assets/ai-studio/cities.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        
        {/* Hologram Overlay Wash */}
        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, rgba(34, 211, 238, 0.2) 0%, rgba(236, 72, 153, 0.3) 100%)",
            mixBlendMode: "overlay",
          }}
        />
        
        {/* High-Tech Grid Overlay */}
        <AbsoluteFill
          style={{
            backgroundImage: "linear-gradient(rgba(34, 211, 238, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            backgroundPosition: "center center",
            opacity: 0.6,
          }}
        />
      </AbsoluteFill>

      {/* Dynamic Target HUD */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: "150px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            backgroundColor: "rgba(10, 10, 15, 0.7)",
            padding: "20px 50px",
            borderRadius: "100px",
            border: "2px solid #22d3ee",
            transform: `scale(${textScale})`,
            boxShadow: "0px 0px 40px rgba(34, 211, 238, 0.6)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ width: "20px", height: "20px", backgroundColor: "#ec4899", borderRadius: "50%", boxShadow: "0 0 20px #ec4899" }} />
          <h2 style={{ color: "#fff", fontSize: "45px", fontFamily: "monospace", margin: 0, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "5px" }}>
            TARGET: {currentCity}
          </h2>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
