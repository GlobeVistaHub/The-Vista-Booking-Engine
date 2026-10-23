import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, staticFile, interpolate } from "remotion";
import { LogoAssembly } from "./components/LogoAssembly";
import { KineticText } from "./components/KineticText";
import { Particles } from "./components/Particles";

export const IntroVariantA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // At frame 243 (4.05s), blur and fade the logo to make room for the text over it
  const logoBlur = interpolate(frame, [243, 258], [0, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoOpacity = interpolate(frame, [243, 258], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#030308", overflow: "hidden" }}>
      
      {/* ── Background Layer ── */}
      <Sequence from={0} durationInFrames={360}>
        <AbsoluteFill style={{
          backgroundImage: `url(${staticFile("youtube-assets/bg-circuit.jpeg")})`,
          backgroundSize: `${100 + frame * 0.05}%`,
          backgroundPosition: "center",
          opacity: 0.4,
          filter: "contrast(1.2) brightness(0.8)",
        }} />
      </Sequence>

      {/* ── Contrast Vignette ── */}
      <Sequence from={0} durationInFrames={360}>
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
      <Sequence from={0} durationInFrames={360}>
        <Particles count={100} seed={99} />
      </Sequence>

      {/* ── Logo Assembly (Centered, Blurs at 243) ── */}
      <Sequence from={0} durationInFrames={360}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%", // CENTERED
          transform: "translate(-50%, -50%)",
          filter: `blur(${logoBlur}px)`,
          opacity: logoOpacity,
        }}>
          <LogoAssembly />
        </div>
      </Sequence>

      {/* ── Kinetic Text (A.I. NEWS slams over it) ── */}
      <Sequence from={243} durationInFrames={117}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%", // CENTERED
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Center text alignment
          gap: 20,
        }}>
          <KineticText text="A.I." delay={0} color="#22d3ee" />
          <KineticText text="NEWS" delay={15} color="#f59e0b" />
        </div>
      </Sequence>

    </AbsoluteFill>
  );
};
