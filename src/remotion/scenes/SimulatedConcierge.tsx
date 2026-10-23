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
    camera.position.x = Math.sin(t * 0.3) * 0.2;
    camera.position.y = Math.cos(t * 0.4) * 0.2;
    camera.position.z = 8 + Math.sin(t * 0.2) * 0.3;
    camera.lookAt(0, 0, 0);
  });

  const entranceSpring = spring({
    frame: frame,
    fps,
    config: { damping: 10, stiffness: 150, mass: 1 },
  });

  // Dynamic exit starts 45 frames before the end (0.75s of slow dissolve)
  const exitStartFrame = Math.max(0, durationInFrames - 45);
  const exitSpring = spring({
    frame: Math.max(0, frame - exitStartFrame),
    fps,
    config: { damping: 20, stiffness: 45, mass: 1 }, // Heavy luxurious spring
  });

  const sceneOpacity = interpolate(exitSpring, [0, 1], [1, 0]);
  const scale = interpolate(entranceSpring, [0, 1], [0, 1]);
  
  // Premium Z-drift
  const zPos = interpolate(exitSpring, [0, 1], [0, -0.6]);
  
  // Focus Blur
  const focusBlur = interpolate(exitSpring, [0, 1], [0, 25]);
  
  // Rhythmic pulse for nodes
  const nodePulse1 = Math.sin(frame * 0.2) * 0.1;
  const nodePulse2 = Math.sin(frame * 0.2 + 2) * 0.1;
  const nodePulse3 = Math.sin(frame * 0.2 + 4) * 0.1;

  // Render a simple workflow node
  const renderNode = (title: string, subtitle: string, pulse: number, color: string) => (
    <div style={{
      width: "220px",
      padding: "20px",
      background: "rgba(10, 14, 39, 0.8)",
      border: `2px solid ${color}`,
      borderRadius: "15px",
      boxShadow: `0 0 20px ${color}40`,
      transform: `scale(${1 + pulse})`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      zIndex: 2
    }}>
      <div style={{ color: color, fontSize: "14px", fontWeight: "bold", letterSpacing: "2px" }}>{title}</div>
      <div style={{ color: "white", fontSize: "16px", marginTop: "10px", textAlign: "center" }}>{subtitle}</div>
    </div>
  );

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />

      <Html
        transform
        position={[0, 0, zPos]}
        scale={Math.max(0, scale) * 0.5}
      >
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: sceneOpacity,
          gap: "40px",
          filter: `blur(${focusBlur}px)`,
          transition: "filter 0.1s ease-out"
        }}>
          
          {/* AI Orchestration Bubble */}
          <div style={{
            background: "rgba(10, 14, 39, 0.22)", // Ultimate luxury high-contrast glass barrier
            backdropFilter: "blur(20px)", 
            WebkitBackdropFilter: "blur(20px)", // Native WebKit GPU acceleration
            border: "1px solid rgba(255, 200, 50, 0.4)", // Sleek gold trim
            padding: "30px 50px",
            borderRadius: "40px",
            color: "white",
            fontSize: "36px",
            fontWeight: 800,
            boxShadow: "0 30px 80px rgba(0,0,0,0.9), inset 0 0 40px rgba(255,200,50,0.15)", // Deep shadow + inner glow
            transform: `translateY(${interpolate(entranceSpring, [0, 1], [50, 0])}px) translateZ(0)`, // Hardware acceleration
            backfaceVisibility: "hidden",
          }}>
            "Your itinerary for <span style={{ color: "#ffc832" }}>Villa Serenity</span> is optimized."
          </div>

          {/* n8n Orchestration Visual with Integrated Orb */}
          <div style={{
            background: "rgba(10, 14, 39, 0.6)",
            backdropFilter: "blur(30px)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "50px",
            borderRadius: "30px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            gap: "40px",
            position: "relative"
          }}>
            {/* Connecting Lines */}
            <div style={{ position: "absolute", top: "50%", left: "10%", right: "10%", height: "4px", background: "linear-gradient(90deg, #00d4ff, #ffc832, #22c55e)", zIndex: 1, opacity: 0.5, boxShadow: "0 0 10px rgba(255,255,255,0.5)" }} />
            
            {/* Animated Pulses on the line */}
            <div style={{ position: "absolute", top: "calc(50% - 3px)", left: `${(frame * 2) % 100}%`, width: "10px", height: "10px", background: "#fff", borderRadius: "50%", boxShadow: "0 0 15px #fff", zIndex: 3 }} />
            
            {renderNode("TRIGGER", "Webhook Received", nodePulse1, "#00d4ff")}
            
            {/* The Integrated AI Orb (Acting as the Brain Node) */}
            <div style={{
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(0,212,255,0.6) 40%, rgba(0,34,68,0.2) 80%)",
              boxShadow: "0 0 80px rgba(0,212,255,0.6), inset 0 0 40px rgba(255,255,255,0.8)",
              backdropFilter: "blur(20px)",
              transform: `scale(${1 + Math.sin(frame * 0.2) * 0.05})`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              border: "2px solid rgba(255,255,255,0.5)"
            }}>
               <div style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 0 50px #fff",
                  transform: `scale(${1 + Math.sin(frame * 0.2) * 0.1})`,
                  marginBottom: "10px"
               }} />
               <div style={{ color: "#fff", fontSize: "16px", fontWeight: "bold", textShadow: "0 0 10px #00d4ff", letterSpacing: "2px" }}>AI ENGINE</div>
            </div>

            {renderNode("ACTION", "Generate Itinerary", nodePulse3, "#22c55e")}
          </div>

        </div>
      </Html>
    </>
  );
};

export const SimulatedConcierge: React.FC<{ isStandalone?: boolean }> = ({ isStandalone = true }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const startSec = 25.583;

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
