import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";

const Particle: React.FC<{
  index: number;
  seed: number;
}> = ({ index, seed }) => {
  const frame = useCurrentFrame();

  // Pre-calculate randomized base traits
  const { startX, startY, baseSpeed, size, color, delay, flickerSpeed, chaosFreq1, chaosFreq2 } = useMemo(() => {
    const rand = (salt: string) => random(`${seed}-${index}-${salt}`);
    return {
      startX: rand("x") * 100, // 0 to 100vw
      startY: 110 + rand("y") * 40, // Start way below screen
      baseSpeed: 2.0 + rand("speed") * 5, // Faster speeds
      size: 2 + rand("size") * 6, // 2px to 8px (Middle ground)
      color: rand("color") > 0.6 ? "#22d3ee" : "#f59e0b", // Teal or Amber
      delay: Math.floor(rand("delay") * 80),
      flickerSpeed: 0.1 + rand("flicker") * 0.4, // Random twinkling speed
      chaosFreq1: 0.02 + rand("c1") * 0.05,
      chaosFreq2: 0.03 + rand("c2") * 0.06,
    };
  }, [index, seed]);

  const activeFrame = Math.max(0, frame - delay);
  if (activeFrame === 0) return null;

  // --- 1. The Shockwave Reaction ---
  // When the logo locks at frame 120, particles get a massive speed burst upwards
  const shockwaveMultiplier = interpolate(frame, [118, 120, 150], [1, 6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // Calculate vertical position using the integrated shockwave speed
  const currentY = startY - (activeFrame * baseSpeed * 0.1 * shockwaveMultiplier);

  // --- 2. Chaotic Horizontal Drift ---
  // Combine two sine waves at different frequencies for unpredictable swarming
  const driftX = Math.sin(activeFrame * chaosFreq1 + index) * 8 
               + Math.cos(activeFrame * chaosFreq2 - index) * 6;
               
  // Add an explosive outward push at frame 120 from the center (50vw)
  const pushDirection = startX > 50 ? 1 : -1;
  const shockwavePushX = interpolate(frame, [118, 120, 140], [0, 15 * pushDirection, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- 3. Spontaneous Twinkling ---
  // Base fade in/out over life (Now fades out much faster after the shockwave)
  const lifeOpacity = interpolate(activeFrame, [0, 30, 110, 150], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Rapid flicker combined with life opacity (kept high for visibility)
  const flicker = 0.7 + Math.sin(activeFrame * flickerSpeed) * 0.3; 
  const opacity = lifeOpacity * flicker;

  // --- 4. Z-Depth (Scale) ---
  const zScale = 0.5 + Math.sin((activeFrame * chaosFreq1) * 0.5) * 0.5;

  return (
    <div style={{
      position: "absolute",
      left: `${startX + driftX + shockwavePushX}%`,
      top: `${currentY}%`,
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: "50%",
      opacity,
      transform: `scale(${zScale})`,
      boxShadow: `0 0 ${size * 3}px ${size}px ${color}`, // Toned down the neon glow
      filter: `blur(${Math.max(0, 2 - size * 0.5)}px)`, 
    }} />
  );
};

// Helper for consistent random floats
function randFloat(seed: number, index: number, salt: string) {
  return 0.3 + random(`${seed}-${index}-${salt}`) * 0.7; // 0.3 to 1.0 opacity
}

export const Particles: React.FC<{ count?: number; seed?: number }> = ({ 
  count = 60, 
  seed = 42 
}) => {
  const particles = useMemo(() => Array.from({ length: count }).map((_, i) => i), [count]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {particles.map((i) => (
        <Particle key={i} index={i} seed={seed} />
      ))}
    </AbsoluteFill>
  );
};
