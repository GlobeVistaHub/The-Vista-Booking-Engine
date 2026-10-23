import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, staticFile, interpolate, spring } from "remotion";
import { LogoAssembly } from "./components/LogoAssembly";
import { KineticText } from "./components/KineticText";
import { Particles } from "./components/Particles";

export const IntroVariantB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // At frame 120, the logo slides up to make room for the text below it
  const isShifted = frame >= 120;
  const shiftSpring = spring({
    frame: isShifted ? frame - 120 : 0,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  
  // Interpolate the vertical shift (from centered at -50% to slightly higher)
  // Standard translateY for centering is -50%. We'll subtract pixels using calc.
  const shiftAmount = interpolate(shiftSpring, [0, 1], [0, -150]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#030308", overflow: "hidden" }}>
      
      {/* ── Background Layer ── */}
      <Sequence from={0} durationInFrames={300}>
        <AbsoluteFill style={{
          backgroundImage: `url(${staticFile("youtube-assets/bg-circuit.jpeg")})`,
          backgroundSize: `${100 + frame * 0.05}%`,
          backgroundPosition: "center",
          opacity: 0.4,
          filter: "contrast(1.2) brightness(0.8)",
        }} />
      </Sequence>

      {/* ── Contrast Vignette ── */}
      <Sequence from={0} durationInFrames={300}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "150%",
          height: "150%",
          background: "radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)",
          pointerEvents: "none",
        }} />
      </Sequence>

      {/* ── Particles Layer ── */}
      <Sequence from={0} durationInFrames={300}>
        <Particles count={100} seed={99} />
      </Sequence>

      {/* ── Logo Assembly (Centered, Slides up at 120) ── */}
      <Sequence from={0} durationInFrames={300}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%", // CENTERED
          transform: `translate(-50%, calc(-50% + ${shiftAmount}px))`,
        }}>
          <LogoAssembly />
        </div>
      </Sequence>

      {/* ── Kinetic Text (A.I. NEWS slams below the logo) ── */}
      <Sequence from={120} durationInFrames={180}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%", // CENTERED
          transform: `translate(-50%, calc(-50% + ${shiftAmount + 320}px))`, // Anchored below the shifted logo
          display: "flex",
          flexDirection: "row", // Horizontal layout since it's below
          alignItems: "center",
          gap: 40,
        }}>
          <KineticText text="A.I." delay={0} color="#22d3ee" />
          <KineticText text="NEWS" delay={15} color="#f59e0b" />
        </div>
      </Sequence>

    </AbsoluteFill>
  );
};
