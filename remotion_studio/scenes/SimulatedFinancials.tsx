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
    camera.position.x = Math.sin(t * 0.5) * 0.3;
    camera.position.y = Math.cos(t * 0.4) * 0.2;
    camera.position.z = 8 + Math.sin(t * 0.3) * 0.2;
    camera.lookAt(0, 0, 0);
  });

  const entranceSpring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  
  // Dynamic exit starts 45 frames before the end (0.75s of slow dissolve)
  const exitStartFrame = Math.max(0, durationInFrames - 45);
  const exitSpring = spring({ frame: Math.max(0, frame - exitStartFrame), fps, config: { damping: 20, stiffness: 45 } });

  const sceneOpacity = interpolate(exitSpring, [0, 1], [1, 0]);
  const rotX = interpolate(entranceSpring, [0, 1], [Math.PI/6, 0]);
  const yPos = interpolate(entranceSpring, [0, 1], [-10, 0]);
  
  // Premium Z-drift
  const zPos = interpolate(exitSpring, [0, 1], [0, -0.6]);
  
  // Focus Blur
  const focusBlur = interpolate(exitSpring, [0, 1], [0, 25]);

  // Counting numbers (animates up as scene reveals)
  const rev = Math.round(interpolate(entranceSpring, [0, 1], [14250, 45800]));
  const bookings = Math.round(interpolate(entranceSpring, [0, 1], [42, 128]));

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <Html transform position={[0, yPos, zPos]} rotation={[rotX, 0, 0]} scale={0.5}>
        <div style={{
          width: "1000px",
          padding: "40px",
          borderRadius: "30px",
          background: "rgba(10, 14, 39, 0.22)", // Ultimate luxury high-contrast glass barrier
          backdropFilter: `blur(${20 - interpolate(exitSpring, [0, 1], [0, 10])}px)`, 
          WebkitBackdropFilter: `blur(${20 - interpolate(exitSpring, [0, 1], [0, 10])}px)`, // Native WebKit GPU acceleration
          border: "1px solid rgba(255, 200, 50, 0.4)", // Sleek gold trim
          boxShadow: "0 30px 80px rgba(0,0,0,0.9), inset 0 0 40px rgba(255,200,50,0.15)", // Deep shadow + inner glow
          color: "white",
          opacity: sceneOpacity,
          filter: `blur(${focusBlur}px)`,
          transform: "translateZ(0)", // Force hardware compositor layer
          backfaceVisibility: "hidden",
          transition: "filter 0.1s ease-out"
        }}>
          {/* Header to match Dashboard style */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "20px", marginBottom: "30px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "42px", fontWeight: 900 }}>FINANCIAL PERFORMANCE</h2>
              <p style={{ margin: "5px 0 0 0", color: "#ffc832", textTransform: "uppercase", letterSpacing: "4px" }}>Status: Revenue Unlocked</p>
            </div>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(45deg, #ffc832, #22c55e)" }} />
          </div>
          
          <div style={{ display: "flex", gap: "40px" }}>
            <div style={{ flex: 1, background: "rgba(0,0,0,0.4)", padding: "40px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "2px" }}>Monthly Revenue</div>
              <div style={{ fontSize: "72px", fontWeight: 900, color: "#22c55e", margin: "20px 0" }}>${rev.toLocaleString()}</div>
              <div style={{ color: "#00d4ff", fontWeight: "bold", fontSize: "20px" }}>+321% vs Last Month</div>
            </div>

            <div style={{ flex: 1, background: "rgba(0,0,0,0.4)", padding: "40px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "2px" }}>Direct Bookings</div>
              <div style={{ fontSize: "72px", fontWeight: 900, color: "white", margin: "20px 0" }}>{bookings}</div>
              <div style={{ color: "#ffc832", fontWeight: "bold", fontSize: "24px", textTransform: "uppercase" }}>0% Commission Paid</div>
            </div>
          </div>
        </div>
      </Html>
    </>
  );
};

export const SimulatedFinancials: React.FC<{ isStandalone?: boolean }> = ({ isStandalone = true }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  // Temporarily mapped to 45.0s, user can adjust later
  const startSec = 30.717;

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
