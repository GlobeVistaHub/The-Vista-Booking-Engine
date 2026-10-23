import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";

export const KineticText: React.FC<{
  text: string; 
  startFrame: number; 
  endFrame: number;
  color?: string; 
  size?: number; 
  align?: "center" | "left" | "right";
  showAntigravityLogo?: boolean;
}> = ({ text, startFrame, endFrame, color = "#fff", size = 90, align = "center", showAntigravityLogo = false }) => {
  const frame = useCurrentFrame();
  
  // Cleanly exit out of the render tree if we are outside the bounds
  if (frame < startFrame || frame > endFrame + 8) return null;
  
  const words = text.split(" ");
  const isExiting = frame >= endFrame;
  const exitFlick = isExiting ? (random(`ef-${frame}`) > 0.5 ? 1 : 0.1) : 1;
  const exitOp = frame > endFrame + 4 ? 0 : exitFlick;
  
  // Cinematic 3-layer hard shadow stack — NO pulsing for maximum legibility
  // We use the brand colors: Cyan, Magenta, or White for the ambient glow
  const acc = color === "#00d4ff" ? "rgba(0,212,255" : color === "#ec4899" ? "rgba(236,72,153" : "rgba(255,255,255";
  const shadow = `1px 1px 0 #000, 2px 2px 0 #000, 3px 3px 0 rgba(0,0,0,0.85), 0 7px 14px rgba(0,0,0,0.95), 0 18px 40px rgba(0,0,0,0.8), 0 0 44px ${acc},0.30)`;
  
  return (
    <AbsoluteFill 
      style={{ 
        justifyContent: "flex-end", // Align to bottom
        paddingBottom: "2%", // Lowered significantly to avoid tangling with center VFX
        alignItems: "center", 
        paddingLeft: "10%", 
        paddingRight: "10%", 
        zIndex: 500, // Ensure it sits above all UI elements and HUDs
        pointerEvents: "none", 
        opacity: exitOp 
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: align, gap: "16px", direction: "rtl", alignItems: "center" }}>
        
        {words.map((w, i) => {
          const wDelay = startFrame + i * 3; // Pop in each word 3 frames apart
          if (frame < wDelay) return null;
          
          const local = frame - wDelay;
          let wOp = 1;
          
          // Glitchy pop-in sequence
          if (local === 0 || local === 2) wOp = 0;
          if (local === 1 || local === 3) wOp = 0.45;
          
          const sX = local < 4 ? 1.3 : 1;
          const sY = local < 4 ? 0.7 : 1;
          
          // Chromatic glitch: seeded, fires occasionally after entry
          const gs = random(`gs-${i}-${Math.floor(frame / 2)}`);
          const isG = local > 4 && gs > 0.78;
          const gX = isG ? (random(`gx-${i}-${frame}`) - 0.5) * 14 : 0;
          const gY = isG ? (random(`gy-${i}-${frame}`) - 0.5) * 4 : 0;
          
          const glitch = isG 
            ? `drop-shadow(${gX}px ${gY}px 0 rgba(0,212,255,0.85)) drop-shadow(${-gX}px ${-gY}px 0 rgba(236,72,153,0.85))` 
            : "none";
            
          const cOp = isG && random(`co-${i}-${frame}`) > 0.6 ? 0.55 : 1;
          
          return (
            <span key={i} style={{
              fontSize: size, 
              fontWeight: 900, 
              color,
              fontFamily: "'Tajawal', 'Cairo', 'IBM Plex Sans Arabic', sans-serif",
              transform: `scale(${sX},${sY})`,
              opacity: wOp * cOp,
              display: "inline-block",
              willChange: "transform,opacity,filter",
              lineHeight: 1.2,
              textShadow: shadow,
              filter: glitch
            }}>
              {w.replace(/_/g, " ")}
            </span>
          );
        })}

        {/* ANTIGRAVITY 2 GLOWING CSS LOGO */}
        {showAntigravityLogo && (
          <div style={{
            width: size * 1.2, 
            height: size * 1.2,
            borderRadius: "22%",
            background: "linear-gradient(135deg, #00d4ff 0%, #ec4899 100%)",
            boxShadow: "0 10px 30px rgba(236,72,153,0.5), 0 0 40px rgba(0,212,255,0.4), inset 0 0 20px rgba(255,255,255,0.5)",
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            marginRight: 24, // RTL margin (places it to the left of the text)
            border: "2px solid rgba(255,255,255,0.8)",
            opacity: words.length > 0 ? 1 : 0, // syncs roughly with text
            transform: `scale(${frame >= startFrame && frame < endFrame ? 1 : 0})`,
            transition: "transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          }}>
            <span style={{
              color: "#fff", 
              fontWeight: 900, 
              fontSize: size * 0.55, 
              fontFamily: "'Inter', sans-serif",
              letterSpacing: -2,
              textShadow: "0 4px 10px rgba(0,0,0,0.5)"
            }}>AG²</span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
