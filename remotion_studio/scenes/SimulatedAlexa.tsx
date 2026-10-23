import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Video,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const Scene3D: React.FC<{ frame: number; fps: number; durationInFrames: number }> = ({ frame, fps, durationInFrames }) => {
  useFrame(({ camera }) => {
    const t = frame / fps;
    camera.position.x = Math.sin(t * 0.4) * 0.2;
    camera.position.y = Math.cos(t * 0.3) * 0.2;
    camera.position.z = 8 + Math.sin(t * 0.2) * 0.2;
    camera.lookAt(0, 0, 0);
  });

  const entranceSpring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  
  // Dynamic exit starts 45 frames before the end (0.75s of slow dissolve)
  const exitStartFrame = Math.max(0, durationInFrames - 45);
  const exitSpring = spring({ frame: Math.max(0, frame - exitStartFrame), fps, config: { damping: 20, stiffness: 45 } });

  // Sleek slide-in from the bottom-right corner (Adjusted for 9:16 vertical viewport aspect ratio)
  const xPos = interpolate(entranceSpring, [0, 1], [7, 0]);
  const yPos = interpolate(entranceSpring, [0, 1], [-12, 0]);
  
  // Premium Z-drift
  const zPos = interpolate(exitSpring, [0, 1], [0, -0.6]);
  
  // Focus Blur
  const focusBlur = interpolate(exitSpring, [0, 1], [0, 25]);
  
  const rotZ = interpolate(entranceSpring, [0, 1], [-0.25, 0]); // Pronounced elegant tilt

  const sceneOpacity = interpolate(exitSpring, [0, 1], [1, 0]);

  const pulse = Math.sin(frame * 0.3) * 0.2 + 0.2;

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <Html transform position={[xPos, yPos, zPos]} rotation={[0, 0, rotZ]} scale={0.4}>
        <div style={{
          width: "600px",
          padding: "40px",
          borderRadius: "30px",
          background: "rgba(10, 14, 39, 0.22)", // Ultimate luxury high-contrast glass barrier
          backdropFilter: `blur(${20 - interpolate(exitSpring, [0, 1], [0, 10])}px)`, 
          WebkitBackdropFilter: `blur(${20 - interpolate(exitSpring, [0, 1], [0, 10])}px)`, // Native WebKit GPU acceleration
          border: "1px solid rgba(255, 200, 50, 0.4)", // Sleek gold trim
          boxShadow: "0 30px 80px rgba(0,0,0,0.9), inset 0 0 40px rgba(255,200,50,0.15)", // Deep shadow + inner glow
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "white",
          opacity: sceneOpacity,
          filter: `blur(${focusBlur}px)`,
          transition: "filter 0.1s ease-out",
          WebkitFontSmoothing: "antialiased",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "translateZ(0)"
        }}>
          {/* Header to match Dashboard style */}
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "20px", marginBottom: "30px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "42px", fontWeight: 900 }}>GEMINI 3.1 CONCIERGE</h2>
              <p style={{ margin: "5px 0 0 0", color: "#00d4ff", textTransform: "uppercase", letterSpacing: "4px" }}>Status: Listening</p>
            </div>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(45deg, #00d4ff, #ffc832)" }} />
          </div>

          {/* Voice Ring */}
          <div style={{
            width: "250px", height: "250px", borderRadius: "50%",
            border: "8px solid transparent",
            background: `linear-gradient(#000, #000) padding-box, conic-gradient(from ${frame * 2}deg, #00d4ff, #ffc832, #00d4ff) border-box`,
            boxShadow: `0 0 ${60 + pulse * 40}px rgba(0, 212, 255, 0.6)`,
            display: "flex", justifyContent: "center", alignItems: "center",
            marginBottom: "40px",
            marginTop: "20px"
          }}>
            <div style={{
              width: "120px", height: "120px", borderRadius: "50%",
              background: "rgba(0, 212, 255, 0.2)",
              transform: `scale(${1 + pulse})`,
              boxShadow: "0 0 40px #00d4ff"
            }} />
          </div>

          <p style={{ fontSize: "28px", color: "rgba(255,255,255,0.9)", fontStyle: "italic", textAlign: "center", margin: "20px 0" }}>
            "Book the Azure Penthouse for 4 nights starting August 12."
          </p>
          
          <div style={{ 
            marginTop: "30px", 
            background: "rgba(34, 197, 94, 0.15)", 
            color: "#22c55e", 
            padding: "15px 30px", 
            fontSize: "20px", 
            borderRadius: "20px", 
            fontWeight: "bold", 
            letterSpacing: "2px", 
            border: "2px solid rgba(34, 197, 94, 0.4)", // Thicker border to avoid subpixel collapse
            boxShadow: "0 0 20px rgba(34, 197, 94, 0.25), inset 0 0 10px rgba(34, 197, 94, 0.1)", // GPU-composited shadows for flawless anti-aliasing
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(0)", // Force GPU layer creation
            textAlign: "center"
          }}>
            PROCESSING VOICE COMMAND
          </div>
        </div>
      </Html>
    </>
  );
};

export const SimulatedAlexa: React.FC<{ isStandalone?: boolean }> = ({ isStandalone = true }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  // Temporarily mapped to 28.083s, user can adjust later
  const startSec = 28.083;

  return (
    <AbsoluteFill style={isStandalone ? { backgroundColor: "#000", overflow: "hidden" } : { overflow: "hidden" }}>
      {isStandalone && (
        <AbsoluteFill>
          <Video
            src={staticFile("video-assets/finale-video.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            startFrom={Math.round(startSec * (fps || 60))}
          />
        </AbsoluteFill>
      )}
      <AbsoluteFill>
        <ThreeCanvas width={width} height={height} linear>
          <Scene3D frame={frame} fps={fps} durationInFrames={durationInFrames} />
        </ThreeCanvas>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
