import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { LogoAssembly } from "./components/LogoAssembly";
import { KineticText } from "./components/KineticText";
import { Particles } from "./components/Particles";

export const YoutubeIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#030308", overflow: "hidden" }}>
      
      {/* ── Background Layer (Fixes transparency bugs) ── */}
      {/* NOTE: We use backgroundSize interpolation instead of transform:scale() to avoid
          a GPU compositor layer conflict that caused a visible 2-second flicker on
          the Chrome preview renderer during image decode. backgroundSize stays on one layer. */}
      <Sequence from={0} durationInFrames={300}>
        <AbsoluteFill style={{
          backgroundImage: `url(${staticFile("youtube-assets/bg-circuit.jpeg")})`,
          backgroundSize: `${100 + frame * 0.05}%`,  // Slow zoom via backgroundSize - single GPU layer
          backgroundPosition: "center",
          opacity: 0.4,
          filter: "contrast(1.2) brightness(0.8)",
        }} />
      </Sequence>

      {/* ── Contrast Vignette (Ensures particles pop over bright footage) ── */}
      <Sequence from={0} durationInFrames={300}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "150%", // Covers the area where particles fly
          height: "150%",
          background: "radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)",
          pointerEvents: "none",
        }} />
      </Sequence>

      {/* ── Particles Layer ── */}
      <Sequence from={0} durationInFrames={300}>
        <Particles count={100} seed={99} />
      </Sequence>

      {/* ── Logo Assembly (Spin & Lock) ─────────────────────────── */}
      <Sequence from={0} durationInFrames={300}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "30%", // Pushed to the left to leave room for text
          transform: "translate(-50%, -50%)",
        }}>
          <LogoAssembly />
        </div>
      </Sequence>

      {/* ── Kinetic Text (A.I. NEWS) ─────────────────────────────── */}
      <Sequence from={120} durationInFrames={180}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "65%", // Pushed to the right
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
          <KineticText text="A.I." delay={0} color="#22d3ee" />
          <KineticText text="NEWS" delay={15} color="#f59e0b" />
        </div>
      </Sequence>

    </AbsoluteFill>
  );
};
