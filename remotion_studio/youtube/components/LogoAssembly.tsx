import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";

export const LogoAssembly: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Enter Scale & Opacity (0 -> 30 frames)
  const enterScale = spring({ frame, fps, config: { damping: 14, stiffness: 60 }, durationInFrames: 60 });
  const enterOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // 2. The Spin (Outer ring spins fast clockwise, Inner heart spins counter-clockwise)
  // They spin fast until frame 120, then abruptly snap and lock into place with a spring.
  const isLocked = frame >= 120;
  
  // Calculate continuous spin before lock
  const preLockSpinOuter = interpolate(frame, [0, 120], [0, 1080]); // 3 full rotations
  const preLockSpinInner = interpolate(frame, [0, 120], [0, -720]); // 2 full rotations backwards

  // Lock spring (overshoots and settles at 0 degrees)
  const lockSpring = spring({
    frame: frame - 120,
    fps,
    config: { damping: 10, stiffness: 150, mass: 1.5 },
  });

  const currentOuterRotation = isLocked 
    ? interpolate(lockSpring, [0, 1], [preLockSpinOuter, 1080]) 
    : preLockSpinOuter;

  const currentInnerRotationTeal = isLocked 
    ? interpolate(lockSpring, [0, 1], [-360, -360]) 
    : interpolate(frame, [0, 120], [0, -360]); // Spins 1 time backwards

  const currentInnerRotationPink = isLocked 
    ? interpolate(lockSpring, [0, 1], [-720, -720]) 
    : interpolate(frame, [0, 120], [0, -720]); // Spins 2 times backwards

  // 3. The Pulse (Heart beats brightly at frame 125 right after locking)
  const pulseScale = interpolate(frame, [120, 125, 135], [1, 1.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulseBrightness = interpolate(frame, [120, 125, 140], [1, 1.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulseGlow = interpolate(frame, [120, 125, 150], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 4. Parallax 3D Hover (Continuous slow floating after locking)
  const floatY = isLocked ? Math.sin((frame - 120) * 0.05) * 15 : 0;
  const tiltX = isLocked ? Math.sin((frame - 120) * 0.03) * 5 : 0;
  const tiltY = isLocked ? Math.cos((frame - 120) * 0.04) * 5 : 0;

  return (
    <div style={{
      width: 600, height: 600,
      opacity: enterOpacity,
      transform: `scale(${enterScale * pulseScale}) translateY(${floatY}px) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
      transformStyle: "preserve-3d",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative",
    }}>
      
      {/* Dynamic Pulse Glow behind the logo */}
      <div style={{
        position: "absolute",
        width: "80%", height: "80%",
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(236, 72, 153, ${0.4 * pulseGlow}) 0%, rgba(34, 211, 238, ${0.4 * pulseGlow}) 40%, transparent 80%)`,
        filter: "blur(40px)",
        transform: "translateZ(-50px)",
      }} />

      {/* Outer Ring */}
      <Img 
        src={staticFile("youtube-assets/outer-ring.png")}
        style={{
          position: "absolute",
          width: "100%", height: "100%",
          transform: `rotate(${currentOuterRotation}deg) translateZ(20px)`,
          filter: `drop-shadow(0px 30px 40px rgba(0,0,0,0.8))`,
        }}
      />

      {/* Inner Heart (Teal Half) */}
      <div style={{
        position: "absolute",
        width: "60%", height: "60%",
        transform: `rotate(${currentInnerRotationTeal}deg) translateZ(60px)`,
        filter: `brightness(${pulseBrightness}) drop-shadow(0px 20px 30px rgba(0,0,0,0.6))`,
      }}>
        <Img src={staticFile("youtube-assets/heart-teal.png")} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Inner Heart (Pink Half) */}
      <div style={{
        position: "absolute",
        width: "60%", height: "60%",
        transform: `rotate(${currentInnerRotationPink}deg) translateZ(65px)`, // Slightly higher Z to separate shadows
        filter: `brightness(${pulseBrightness}) drop-shadow(0px 10px 20px rgba(236,72,153,0.3))`,
      }}>
        <Img src={staticFile("youtube-assets/heart-pink.png")} style={{ width: "100%", height: "100%" }} />
      </div>

    </div>
  );
};
