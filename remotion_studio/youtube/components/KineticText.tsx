import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const KineticLetter: React.FC<{ letter: string; delay: number; color: string; index: number }> = ({
  letter, delay, color, index
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Spring scale from 1000% to 100% (much harder slam)
  const baseScale = spring({ 
    frame: frame - delay, 
    fps, 
    config: { damping: 12, stiffness: 150, mass: 2.0 }, // Heavier mass for harder impact
    durationInFrames: 30 
  });
  
  const scale = interpolate(baseScale, [0, 1], [10, 1]); // Maps spring 0->1 to scale 1000%->100%

  const opacity = interpolate(frame - delay, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // Extreme motion blur that clears up as it lands
  const blur = interpolate(frame - delay, [0, 15], [80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // A slight random rotation per letter as it flies in, snapping to 0
  const randomRot = (index % 2 === 0 ? 1 : -1) * 60;
  const rotation = interpolate(frame - delay, [0, 25], [randomRot, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <span style={{
      display: "inline-block",
      opacity,
      color,
      filter: `blur(${blur}px)`,
      transform: `scale(${scale}) rotate(${rotation}deg)`,
      transformOrigin: "center",
      textShadow: `0 0 40px ${color}80, 0 10px 30px rgba(0,0,0,0.8)`,
    }}>
      {letter === " " ? "\u00A0" : letter}
    </span>
  );
};

export const KineticText: React.FC<{ text: string; delay: number; color: string }> = ({ text, delay, color }) => {
  return (
    <div style={{
      fontSize: 160, // Massive typography
      fontWeight: 900,
      fontFamily: "'Inter', sans-serif",
      letterSpacing: -6,
      lineHeight: 1,
      display: "flex",
    }}>
      {text.split("").map((letter, i) => (
        <KineticLetter 
          key={`${letter}-${i}`} 
          letter={letter} 
          delay={delay + i * 6} // Increased latency from 3 to 6 frames between letters
          color={color} 
          index={i}
        />
      ))}
    </div>
  );
};
