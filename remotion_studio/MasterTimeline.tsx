import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Phase1_Office } from "./commercial/Phase1_Office";
import { Phase2_MobileTransition } from "./commercial/Phase2_MobileTransition";
import { Phase3_ViralMap } from "./commercial/Phase3_ViralMap";
import { Phase4_AICallouts } from "./commercial/Phase4_AICallouts";
import { Phase5_Jogging } from "./commercial/Phase5_Jogging";

export const MasterTimeline: React.FC = () => {
  const { fps } = useVideoConfig();

  // Helper to convert decimal seconds to frames
  const f = (s: number) => Math.round(s * fps);

  // Core Timings (Based on our 37.6s Implementation Plan)
  const timings = {
    phase1_office: { in: 0, out: 12.6 },
    phase2_mobile: { in: 12.6, out: 14.6 },
    phase3_cities: { in: 14.6, out: 22.6 },
    phase4_ui: { in: 22.6, out: 29.6 },
    phase5_jogging: { in: 29.6, out: 37.6 },
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      
      {/* PHASE 1: The Office (0s - 12.6s) */}
      <Sequence 
        from={f(timings.phase1_office.in)} 
        durationInFrames={f(timings.phase1_office.out - timings.phase1_office.in)}
      >
        <Phase1_Office />
      </Sequence>

      {/* PHASE 2: Mobile Transition (12.6s - 14.6s) */}
      <Sequence 
        from={f(timings.phase2_mobile.in)} 
        durationInFrames={f(timings.phase2_mobile.out - timings.phase2_mobile.in)}
      >
        <Phase2_MobileTransition />
      </Sequence>

      {/* PHASE 3: Viral Map & Cities (14.6s - 22.6s) */}
      <Sequence 
        from={f(timings.phase3_cities.in)} 
        durationInFrames={f(timings.phase3_cities.out - timings.phase3_cities.in)}
      >
        <Phase3_ViralMap />
      </Sequence>

      {/* PHASE 4: AI Callouts (22.6s - 29.6s) */}
      <Sequence 
        from={f(timings.phase4_ui.in)} 
        durationInFrames={f(timings.phase4_ui.out - timings.phase4_ui.in)}
      >
        <Phase4_AICallouts />
      </Sequence>

      {/* PHASE 5: Jogging Outro (29.6s - 37.6s) */}
      <Sequence 
        from={f(timings.phase5_jogging.in)} 
        durationInFrames={f(timings.phase5_jogging.out - timings.phase5_jogging.in)}
      >
        <Phase5_Jogging />
      </Sequence>

    </AbsoluteFill>
  );
};
