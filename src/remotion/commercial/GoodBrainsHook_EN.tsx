import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const TOKENS = {
  bg: "#0B0F19", // Premium Obsidian / Midnight Tech Blue
  text: "#FFFFFF",
  highlight: "#34D058", // GoodBrains Success Green
  glow: "rgba(12, 119, 53, 0.8)", 
  fontEnglish: "'Inter', 'Outfit', 'Segoe UI', Tahoma, Arial, sans-serif",
};

// High-End SVG Paths (Lucide-style wireframes)
const SVG_PATHS = {
  // SAAS / Cloud Network
  cloud: <path vectorEffect="non-scaling-stroke" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />,
  // Globe / Network (Worldwide SAAS)
  globe: <><circle vectorEffect="non-scaling-stroke" cx="12" cy="12" r="10" /><path vectorEffect="non-scaling-stroke" d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path vectorEffect="non-scaling-stroke" d="M2 12h20" /></>,
  // API / Connectivity (Nodes)
  nodes: <><circle vectorEffect="non-scaling-stroke" cx="18" cy="5" r="3" /><circle vectorEffect="non-scaling-stroke" cx="6" cy="12" r="3" /><circle vectorEffect="non-scaling-stroke" cx="18" cy="19" r="3" /><line vectorEffect="non-scaling-stroke" x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line vectorEffect="non-scaling-stroke" x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>,
  // Systems / Infrastructure (Gears)
  gear: <><path vectorEffect="non-scaling-stroke" d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle vectorEffect="non-scaling-stroke" cx="12" cy="12" r="3" /></>,
  // Abstract Data Node (Hexagon)
  hexagon: <path vectorEffect="non-scaling-stroke" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
};

// Adjusted Opacities (Massively Boosted) and centered placements so they are clearly visible
const BLUEPRINT_GRAPHICS = [
  { path: SVG_PATHS.cloud, x: 15, y: 15, size: 400, speedX: 0.5, speedY: -0.5, rotStart: -15, rotSpeed: 0.05, opacity: 0.4 },
  { path: SVG_PATHS.hexagon, x: 80, y: 20, size: 400, speedX: -0.3, speedY: 0.5, rotStart: 10, rotSpeed: -0.05, opacity: 0.35 },
  { path: SVG_PATHS.nodes, x: 85, y: 80, size: 450, speedX: -0.8, speedY: -0.4, rotStart: 45, rotSpeed: 0.04, opacity: 0.4 },
  { path: SVG_PATHS.gear, x: 10, y: 85, size: 600, speedX: 0.4, speedY: -0.6, rotStart: 0, rotSpeed: 0.2, opacity: 0.25 },
  { path: SVG_PATHS.globe, x: 50, y: 50, size: 750, speedX: 0.6, speedY: -0.2, rotStart: -5, rotSpeed: 0.02, opacity: 0.15 }, // Center massive wireframe globe
];

export const GoodBrainsHookEN: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Buttery smooth background fade
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  
  // Ultra-smooth cinematic zoom (1.0 -> 1.05 over 60 frames)
  const scale = interpolate(frame, [0, 60], [1, 1.05]);

  // --- KINETIC TYPOGRAPHY SPRINGS ---
  // Line 1: Snaps in instantly
  const line1Prog = spring({ frame: frame - 0, fps, config: { damping: 12, stiffness: 180 } });
  // Line 2: Highlight pops in
  const line2Prog = spring({ frame: frame - 12, fps, config: { damping: 12, stiffness: 180 } });
  // Line 3: Final confirmation
  const line3Prog = spring({ frame: frame - 24, fps, config: { damping: 12, stiffness: 180 } });

  return (
    <AbsoluteFill style={{ backgroundColor: TOKENS.bg, overflow: "hidden", justifyContent: "center", alignItems: "center" }}>
      {/* Background radial glow */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle at center, ${TOKENS.glow} 0%, transparent 60%)`,
          opacity: 0.15,
          zIndex: 1,
        }}
      />

      {/* Blueprint Architectural Vector Wireframes */}
      {BLUEPRINT_GRAPHICS.map((item, i) => {
        // Slow cinematic drift
        const driftX = frame * item.speedX;
        const driftY = frame * item.speedY;
        const rotation = item.rotStart + (frame * item.rotSpeed);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: item.size,
              height: item.size,
              opacity: item.opacity,
              transform: `translate(-50%, -50%) translate(${driftX}px, ${driftY}px) rotate(${rotation}deg)`,
              willChange: "transform",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={TOKENS.highlight} 
              strokeWidth="2.5" /* Thicker line */
              strokeLinecap="round" 
              strokeLinejoin="round"
              // Cyan stroke with a subtle Gold glow! 
              style={{ width: "100%", height: "100%", filter: `drop-shadow(0px 0px 16px rgba(255, 215, 0, 0.8))` }}
            >
              {item.path}
            </svg>
          </div>
        );
      })}
      
      {/* Foreground Kinetic Typography (Restored Premium Layout) */}
      <div
        style={{
          fontFamily: TOKENS.fontEnglish,
          fontSize: 72, 
          fontWeight: 900,
          color: TOKENS.text,
          textAlign: "center",
          direction: "ltr",
          lineHeight: 1.4,
          width: "80%",
          transform: `scale(${scale})`,
          transformOrigin: "center",
          willChange: "transform",
          zIndex: 10,
        }}
      >
        <span style={{
          display: "inline-block",
          opacity: interpolate(line1Prog, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(line1Prog, [0, 1], [25, 0])}px)`,
          willChange: "transform, opacity",
          textShadow: `0 8px 30px rgba(0,0,0,0.9), 0 0 50px ${TOKENS.glow}`,
        }}>
          Modern tech simplifies your life
        </span>
        <br />
        <span style={{
          display: "inline-block",
          color: TOKENS.highlight,
          opacity: interpolate(line2Prog, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(line2Prog, [0, 1], [25, 0])}px) scale(${interpolate(line2Prog, [0, 1], [0.95, 1])})`,
          willChange: "transform, opacity",
          textShadow: `0 8px 30px rgba(0,0,0,0.9), 0 0 40px rgba(52, 208, 88, 0.7)`,
        }}>
          and accelerates your workflow
        </span>
        {" "}
        <br />
        <span style={{
          display: "inline-block",
          opacity: interpolate(line3Prog, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(line3Prog, [0, 1], [25, 0])}px)`,
          willChange: "transform, opacity",
          textShadow: `0 8px 30px rgba(0,0,0,0.9), 0 0 50px ${TOKENS.glow}`,
        }}>
          with ultimate precision.
        </span>
      </div>
    </AbsoluteFill>
  );
};
