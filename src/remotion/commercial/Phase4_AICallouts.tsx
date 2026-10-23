import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const Phase4_AICallouts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Glass panel slide in
  const panelY = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  // Callout 1 (90% أسرع)
  const callout1Scale = spring({
    frame: frame - 1.5 * fps, // Appears at 1.5s
    fps,
    config: { damping: 10, mass: 0.5 },
  });

  // Callout 2 (تكلفة أذكى)
  const callout2Scale = spring({
    frame: frame - 4.0 * fps, // Appears at 4.0s
    fps,
    config: { damping: 10, mass: 0.5 },
  });

  // Background glitch offset
  const glitchOffset = frame % 10 === 0 ? 5 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      
      {/* Cyberpunk Grid Background */}
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(34, 211, 238, 0.2) 0%, transparent 60%), linear-gradient(0deg, rgba(236, 72, 153, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(236, 72, 153, 0.1) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 60px 60px, 60px 60px",
          transform: `translateX(${glitchOffset}px)`,
        }}
      />

      {/* Main Glass Panel */}
      <div
        style={{
          width: "80%",
          height: "60%",
          backgroundColor: "rgba(10, 10, 15, 0.6)",
          borderRadius: "40px",
          border: "4px solid rgba(236, 72, 153, 0.5)",
          boxShadow: "0px 0px 100px rgba(236, 72, 153, 0.3)",
          backdropFilter: "blur(30px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          transform: `translateY(${interpolate(panelY, [0, 1], [1000, 0])}px)`,
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Animated Code Streams */}
        <div style={{ position: "absolute", left: "-50%", top: "20%", width: "200%", height: "2px", backgroundColor: "#22d3ee", opacity: 0.5, boxShadow: "0 0 20px #22d3ee", transform: `rotate(15deg) translateY(${Math.sin(frame / 10) * 100}px)` }} />
        
        {/* Callout 1 */}
        <div
          style={{
            transform: `scale(${callout1Scale})`,
            marginBottom: "60px",
            backgroundColor: "rgba(34, 211, 238, 0.1)",
            padding: "30px 60px",
            borderRadius: "20px",
            border: "2px solid #22d3ee",
            boxShadow: "0 0 40px rgba(34, 211, 238, 0.5)",
          }}
        >
          <h1 style={{ color: "#fff", fontSize: "120px", margin: 0, fontFamily: "Tajawal, sans-serif", fontWeight: 900, direction: "rtl" }}>
            <span style={{ color: "#22d3ee" }}>٩٠٪</span> أسرع
          </h1>
        </div>

        {/* Callout 2 */}
        <div
          style={{
            transform: `scale(${callout2Scale})`,
            backgroundColor: "rgba(236, 72, 153, 0.1)",
            padding: "30px 60px",
            borderRadius: "20px",
            border: "2px solid #ec4899",
            boxShadow: "0 0 40px rgba(236, 72, 153, 0.5)",
          }}
        >
          <h1 style={{ color: "#fff", fontSize: "100px", margin: 0, fontFamily: "Tajawal, sans-serif", fontWeight: 900, direction: "rtl" }}>
            تكلفة <span style={{ color: "#ec4899" }}>أذكى</span>
          </h1>
        </div>
      </div>
    </AbsoluteFill>
  );
};
