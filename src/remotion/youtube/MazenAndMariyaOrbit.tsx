import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  OffthreadVideo,
  staticFile
} from "remotion";

// ─── MATHEMATICAL 3D ORBITAL TEXT RIG ─────────────────────────────────────────
const OrbitalText: React.FC<{
  text: string;
  startFrame: number;
  duration: number; // For fading out entire rig
  orbitRadiusX: number; // Width of orbit
  orbitRadiusZ: number; // Depth of orbit
  baseAngle: number;
  rotationSpeed: number;
}> = ({ text, startFrame, duration, orbitRadiusX, orbitRadiusZ, baseAngle, rotationSpeed }) => {
  const frame = useCurrentFrame();

  if (frame < startFrame || frame > startFrame + duration) return null;

  const localFrame = frame - startFrame;
  // Softened fade-in: 30 frames (1 second) instead of 15 frames to prevent popping/jitter
  const introOpacity = interpolate(localFrame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  
  // Dramatically softened fade-out: 40 frames (1.3 seconds). 
  // This ensures the final text ("السرعة ضد الدقة") fades out beautifully even if it hasn't reached the kill switch.
  const outroOpacity = interpolate(frame - startFrame, [duration - 40, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Calculate current angle in degrees
  const currentAngleDeg = baseAngle + (localFrame * rotationSpeed);
  
  // Permanent Kill Switch (Reversed): Since we are orbiting backwards (Right to Left),
  // the angle goes from positive to negative. We fade out when it passes -90 degrees.
  const lapFade = interpolate(currentAngleDeg, [-120, -90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const radians = (currentAngleDeg * Math.PI) / 180;

  // Mathematical 3D Space mapped to 2D
  const xPos = Math.sin(radians) * orbitRadiusX;
  const zPos = Math.cos(radians) * orbitRadiusZ;

  // Scale: Smaller when in back, larger when in front
  const scale = interpolate(zPos, [-orbitRadiusZ, orbitRadiusZ], [0.4, 1.6]);
  
  // Depth Fade: Slightly darker/transparent when far back
  const depthOpacity = interpolate(zPos, [-orbitRadiusZ, orbitRadiusZ], [0.3, 1]);
  
  // Depth of Field Blur: Reduced from 8 to 3. 
  // High dynamic blur + heavy text shadow causes severe GPU jitter in Chromium, especially on RTL text.
  const blur = interpolate(zPos, [-orbitRadiusZ, orbitRadiusZ], [3, 0]);
  
  const zIndex = Math.round(zPos + orbitRadiusZ);

  // Combine all opacities
  const finalOpacity = introOpacity * depthOpacity * outroOpacity * lapFade;

  // Intense Bloom shader equivalent
  const bloomShadow = "0 0 15px rgba(34,211,238,1), 0 0 30px rgba(34,211,238,0.8), 0 0 60px rgba(34,211,238,0.6), 0 0 100px rgba(34,211,238,0.4)";

  return (
    <div style={{
      position: "absolute",
      left: "50%",
      top: "65%", // Moved to lower-third to avoid blocking faces
      transform: `translate(-50%, -50%) translateX(${xPos}px) scale(${scale})`,
      opacity: finalOpacity,
      filter: `blur(${blur}px)`, // RESTORED BLUR
      zIndex,
      willChange: "transform, opacity, filter",
      backfaceVisibility: "hidden", // Forces hardware acceleration and stops sub-pixel popping
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <h1 style={{
        fontSize: 65,
        fontWeight: 900,
        color: "#fff",
        fontFamily: "'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif",
        textShadow: bloomShadow,
        whiteSpace: "nowrap",
        margin: 0,
        padding: "0 80px", // Kept padding to protect 'ة'
        direction: "rtl",
        WebkitFontSmoothing: "antialiased",
        fontVariantLigatures: "none" // Kept to stop RTL character snapping
      }}>
        {text}
      </h1>
    </div>
  );
};

// ─── MAIN COMPOSITION ────────────────────────────────────────────────────────
export const MazenAndMariyaOrbit: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Animation starts at 14s (420 frames)
  const ANIMATION_START_FRAME = 420;

  // Disappears at 22.12 seconds (Frame 664) -> Total duration = 244 frames
  const TOTAL_LOCAL_DURATION = 244;

  // REVERSED AND SLIGHTLY FASTER: 
  const rotationSpeed = -1.4;
  
  const radiusX = 450; 
  const radiusZ = 600; 

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}> {/* Removed overflow: hidden which might have ruined the layout */}
      
      {/* BASE VIDEO LAYER */}
      <OffthreadVideo
        src={staticFile("youtube-assets/mazen-and-mariya.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      
      {/* VIGNETTE TO HELP NEON POP */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle, transparent 40%, rgba(0,0,0,0.6) 100%)",
        pointerEvents: "none"
      }} />

      <div style={{
        position: "absolute", inset: 0,
        perspective: "1200px",
        transformStyle: "preserve-3d",
        pointerEvents: "none"
      }}>
        <Sequence from={ANIMATION_START_FRAME} durationInFrames={TOTAL_LOCAL_DURATION}>
          {/* RESTORED 45 FRAME STAGGER (1.5s) */}
          
          <OrbitalText 
            text="الذكاء الاصطناعي" 
            startFrame={0} 
            duration={TOTAL_LOCAL_DURATION}
            orbitRadiusX={radiusX} 
            orbitRadiusZ={radiusZ}
            baseAngle={80} 
            rotationSpeed={rotationSpeed} 
          />
          
          <OrbitalText 
            text="هندسة ولا فن؟" 
            startFrame={45} 
            duration={TOTAL_LOCAL_DURATION - 45}
            orbitRadiusX={radiusX} 
            orbitRadiusZ={radiusZ}
            baseAngle={80} 
            rotationSpeed={rotationSpeed} 
          />

          <OrbitalText 
            text="الذكاء الاصطناعي" 
            startFrame={90} 
            duration={TOTAL_LOCAL_DURATION - 90}
            orbitRadiusX={radiusX} 
            orbitRadiusZ={radiusZ}
            baseAngle={80} 
            rotationSpeed={rotationSpeed} 
          />
          
          {/* Has exactly 109 frames to cross */}
          <OrbitalText 
            text="السرعة ضد الدقة" 
            startFrame={135} 
            duration={TOTAL_LOCAL_DURATION - 135}
            orbitRadiusX={radiusX} 
            orbitRadiusZ={radiusZ}
            baseAngle={80} 
            rotationSpeed={rotationSpeed} 
          />
        </Sequence>
      </div>
      
    </AbsoluteFill>
  );
};
