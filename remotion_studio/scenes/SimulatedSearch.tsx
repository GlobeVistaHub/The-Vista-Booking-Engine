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
  // Gentle camera wobble (Deterministic for smooth renders)
  useFrame(({ camera }) => {
    const t = frame / fps;
    camera.position.x = Math.sin(t * 0.5) * 0.2;
    camera.position.y = Math.cos(t * 0.3) * 0.2;
    camera.position.z = 8 + Math.sin(t * 0.2) * 0.5;
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
    config: { damping: 20, stiffness: 45, mass: 1 }, // Heavy, luxurious fluid damping
  });

  const sceneOpacity = interpolate(exitSpring, [0, 1], [1, 0]);
  const yPos = interpolate(entranceSpring, [0, 1], [-10, 0]);
  
  // Premium Micro-Z Drift (drifts slightly away along Z axis during exit)
  const zPos = interpolate(exitSpring, [0, 1], [0, -0.6]); 
  
  // Cinematic Focus Blur (blurs as it dissolves)
  const focusBlur = interpolate(exitSpring, [0, 1], [0, 25]);

  const rotX = interpolate(entranceSpring, [0, 1], [Math.PI / 3, 0]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      
      {/* 3D Property Card - Flips up to face camera */}
      <Html
        transform
        position={[0, yPos, zPos]}
        rotation={[rotX, 0, 0]}
        scale={0.5}
      >
        <div style={{
          width: "900px",
          display: "flex",
          flexDirection: "row",
          gap: "40px",
          padding: "40px",
          borderRadius: "30px",
          background: "rgba(10, 14, 39, 0.22)", // Ultimate luxury high-contrast glass barrier
          backdropFilter: `blur(${20 - interpolate(exitSpring, [0, 1], [0, 10])}px)`, 
          WebkitBackdropFilter: `blur(${20 - interpolate(exitSpring, [0, 1], [0, 10])}px)`, // Native WebKit GPU acceleration
          border: "1px solid rgba(255, 200, 50, 0.4)", // Sleek gold trim
          boxShadow: "0 30px 80px rgba(0,0,0,0.9), inset 0 0 40px rgba(255,200,50,0.15)", // Deep shadow + inner glow
          color: "white",
          opacity: sceneOpacity,
          filter: `blur(${focusBlur}px)`, // Cinematic focus blur
          transform: "translateZ(0)", // Force hardware compositor layer
          backfaceVisibility: "hidden",
          transition: "filter 0.1s ease-out"
        }}>
          {/* Image / Video Placeholder */}
          <div style={{
            width: "400px",
            height: "300px",
            borderRadius: "20px",
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "#000"
          }}>
            <img 
              src={staticFile("video-assets/villa-serenity.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt="Villa Serenity"
            />
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(45deg, rgba(0,212,255,0.2), transparent)" }} />
            
            <div style={{ position: "absolute", top: 0, left: 0, background: "#00d4ff", color: "#000", padding: "8px 20px", fontSize: "14px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", borderBottomRightRadius: "20px" }}>
              SYSTEM LOCK
            </div>
          </div>

          {/* Details */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", gap: "10px", fontSize: "16px", fontWeight: "bold", color: "rgba(255,255,255,0.5)", letterSpacing: "3px", textTransform: "uppercase" }}>
                  <span>Villa</span><span>•</span><span>El Gouna</span>
                </div>
                <h3 style={{ fontSize: "52px", margin: "10px 0", color: "#ffc832", fontWeight: 800, textShadow: "0 0 20px rgba(255,200,50,0.5)" }}>
                  Villa Serenity
                </h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(255,255,255,0.1)", padding: "12px 25px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: "28px", color: "#ffc832" }}>★</span>
                <span style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>4.9</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", fontSize: "22px", color: "rgba(255,255,255,0.7)", fontWeight: 600, marginTop: "20px" }}>
              <span><strong style={{ color: "white" }}>8</strong> Guests</span>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>•</span>
              <span><strong style={{ color: "white" }}>4</strong> Bedrooms</span>
            </div>

            <div style={{ display: "flex", gap: "15px", marginTop: "40px", flexWrap: "wrap" }}>
              {["Private Pool", "Red Sea View", "Butler Service", "Instant Book"].map(tag => (
                <span key={tag} style={{
                  padding: "10px 20px",
                  backgroundColor: "rgba(255,200,50,0.1)",
                  border: "1px solid rgba(255,200,50,0.4)",
                  borderRadius: "15px",
                  fontSize: "14px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: "#ffc832"
                }}>
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "30px" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#00d4ff", textTransform: "uppercase", letterSpacing: "3px" }}>
                RESERVED
              </div>
              <div>
                <span style={{ fontSize: "60px", fontWeight: 900, color: "white" }}>$450</span>
                <span style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginLeft: "10px", letterSpacing: "2px" }}>/ night</span>
              </div>
            </div>
          </div>
        </div>
      </Html>
    </>
  );
};

export const SimulatedSearch: React.FC<{ isStandalone?: boolean }> = ({ isStandalone = true }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const startSec = 21.05;

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
