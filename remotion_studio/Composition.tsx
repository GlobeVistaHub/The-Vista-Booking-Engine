import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Scene1_Logo } from "./scenes/Scene1_Logo";
import { Scene2_Hook } from "./scenes/Scene2_Hook";
import { Scene3_Tech } from "./scenes/Scene3_Tech";
import { Scene4_Reveal } from "./scenes/Scene4_Reveal";
import { Scene5_Revenue } from "./scenes/Scene5_Revenue";
import { Scene6_CTA } from "./scenes/Scene6_CTA";

// ─── TIMELINE (60fps × 20s = 1200 frames) ─────────────────────────────────────
// Scene 1 — Logo Reveal      : 0   → 120  (0–2s)
// Scene 2 — Hook Text        : 100 → 360  (1.6–6s)
// Scene 3 — Tech Stack       : 320 → 600  (5.3–10s)
// Scene 4 — Spatial Reveal   : 560 → 840  (9.3–14s)
// Scene 5 — Revenue Numbers  : 800 → 1060 (13.3–17.6s)
// Scene 6 — CTA + URL        : 1020 → 1200 (17–20s)
// ──────────────────────────────────────────────────────────────────────────────

export const VistaPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#030308", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Background Music ─────────────────────────────────────── */}
      {/* Swap to your actual track filename once confirmed */}
      {/* <Audio src={staticFile("video-assets/Foundation_Complete_Music_Sound_Effects_MP4_150526.mp4")} volume={0.35} /> */}

      {/* ── Voiceover (add your AI voiceover .mp3 file name below) ── */}
      {/* <Audio src={staticFile("video-assets/voiceover-option-a.mp3")} volume={1} /> */}

      {/* ── Scene 1: Logo Reveal ─────────────────────────────────── */}
      <Sequence from={0} durationInFrames={200}>
        <Scene1_Logo />
      </Sequence>

      {/* ── Scene 2: Hook Text ───────────────────────────────────── */}
      <Sequence from={100} durationInFrames={260}>
        <Scene2_Hook />
      </Sequence>

      {/* ── Scene 3: Tech Stack ──────────────────────────────────── */}
      <Sequence from={320} durationInFrames={280}>
        <Scene3_Tech />
      </Sequence>

      {/* ── Scene 4: Spatial UI Reveal ───────────────────────────── */}
      <Sequence from={560} durationInFrames={300}>
        <Scene4_Reveal />
      </Sequence>

      {/* ── Scene 5: Revenue Numbers ─────────────────────────────── */}
      <Sequence from={800} durationInFrames={280}>
        <Scene5_Revenue />
      </Sequence>

      {/* ── Scene 6: CTA + URL ───────────────────────────────────── */}
      <Sequence from={1020} durationInFrames={180}>
        <Scene6_CTA />
      </Sequence>

    </AbsoluteFill>
  );
};
