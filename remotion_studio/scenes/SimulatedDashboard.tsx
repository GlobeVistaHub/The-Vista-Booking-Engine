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
    camera.position.x = Math.sin(t * 0.4) * 0.3;
    camera.position.y = Math.cos(t * 0.5) * 0.1;
    camera.position.z = 8 + Math.sin(t * 0.3) * 0.2;
    camera.lookAt(0, 0, 0);
  });

  const entranceSpring = spring({
    frame: frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 1 },
  });

  // Dynamic exit starts 45 frames before the end (0.75s of slow dissolve)
  const exitStartFrame = Math.max(0, durationInFrames - 45);
  const exitSpring = spring({
    frame: Math.max(0, frame - exitStartFrame),
    fps,
    config: { damping: 20, stiffness: 45, mass: 1 }, // Heavy luxurious spring
  });

  const sceneOpacity = interpolate(exitSpring, [0, 1], [1, 0]);

  // Slide in from X = 15 (Right)
  const xPos = interpolate(entranceSpring, [0, 1], [15, 0]);
  
  // Premium Z-drift
  const zPos = interpolate(exitSpring, [0, 1], [0, -0.6]);
  
  // Focus Blur
  const focusBlur = interpolate(exitSpring, [0, 1], [0, 25]);
  
  // Swinging door effect (Rotate Y)
  const rotY = interpolate(entranceSpring, [0, 1], [-Math.PI / 2, 0]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />

      <Html
        transform
        position={[xPos, 0, zPos]}
        rotation={[0, rotY, 0]}
        scale={0.5}
      >
        <div style={{
          width: "1000px",
          padding: "40px",
          borderRadius: "30px",
          background: "rgba(10, 14, 39, 0.22)", // Ultimate luxury high-contrast glass barrier
          backdropFilter: `blur(${20 - interpolate(exitSpring, [0, 1], [0, 10])}px)`, 
          WebkitBackdropFilter: `blur(${20 - interpolate(exitSpring, [0, 1], [0, 10])}px)`, // Native WebKit GPU acceleration
          border: "1px solid rgba(255, 200, 50, 0.4)", // Sleek gold trim
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.9), inset 0 0 40px rgba(255,200,50,0.15)", // Deep shadow + inner glow
          opacity: sceneOpacity,
          filter: `blur(${focusBlur}px)`,
          transform: "translateZ(0)", // Force hardware compositor layer
          backfaceVisibility: "hidden",
          transition: "filter 0.1s ease-out",
          color: "white"
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "20px", marginBottom: "30px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "42px", fontWeight: 900 }}>GUEST DASHBOARD</h2>
              <p style={{ margin: "5px 0 0 0", color: "#00d4ff", textTransform: "uppercase", letterSpacing: "4px" }}>Status: Secure</p>
            </div>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(45deg, #00d4ff, #ffc832)" }} />
          </div>

          {/* Booking Card */}
          <div style={{ display: "flex", gap: "30px" }}>
            <div style={{ width: "300px", height: "200px", borderRadius: "20px", overflow: "hidden", position: "relative", background: "#000" }}>
              <img 
                src={staticFile("video-assets/villa-dashboard.jpg")}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                alt="The Azure Penthouse"
              />
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.3)" }} />
            </div>
            
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "inline-block", background: "#22c55e", color: "white", padding: "5px 15px", borderRadius: "10px", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px", alignSelf: "flex-start", marginBottom: "10px" }}>
                BOOKING CONFIRMED
              </div>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "48px", fontWeight: 800 }}>The Azure Penthouse</h3>
              <div style={{ fontSize: "20px", color: "rgba(255,255,255,0.7)", display: "flex", gap: "20px" }}>
                <span>12 Aug - 18 Aug</span>
                <span>•</span>
                <span>$320 / night</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
            <div style={{ flex: 1, padding: "20px", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)", borderRadius: "15px", textAlign: "center", fontSize: "18px", fontWeight: "bold", color: "#00d4ff", textTransform: "uppercase", letterSpacing: "2px" }}>
              View Itinerary
            </div>
            <div style={{ flex: 1, padding: "20px", background: "rgba(255,200,50,0.1)", border: "1px solid rgba(255,200,50,0.3)", borderRadius: "15px", textAlign: "center", fontSize: "18px", fontWeight: "bold", color: "#ffc832", textTransform: "uppercase", letterSpacing: "2px" }}>
              Contact Host
            </div>
          </div>
        </div>
      </Html>
    </>
  );
};

export const SimulatedDashboard: React.FC<{ isStandalone?: boolean }> = ({ isStandalone = true }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const startSec = 23.00;

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
