import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, staticFile } from "remotion";

export const BurnThroughFakeOner: React.FC<{
  childrenA: React.ReactNode;
  childrenB: React.ReactNode;
  transitionStartFrame: number;
  durationFrames?: number;
}> = ({ 
  childrenA, childrenB, transitionStartFrame, durationFrames = 30 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const RED = "#FF0055";

  // --- TIMING PHASES (30 Frames Total) ---
  // Phase 1 (0-10): Analogue Glitch & CRT Strobe on Scene A
  // Phase 2 (10-20): Vertical CRT Collapse of Scene A to the Red Line
  // Phase 3 (20-30): Optical Split-Wipe Reveal of Scene B (No Whip, No Squashing)

  if (frame < transitionStartFrame) return null;

  const phaseFrame = frame - transitionStartFrame;

  // --- PHASE 1: ANALOGUE GLITCH (0-10) ---
  const isGlitching = phaseFrame >= 0 && phaseFrame < 10;
  const crtStrobe = isGlitching && (phaseFrame % 3 === 0 || phaseFrame % 4 === 0) ? 0.8 : 0;
  const rgbSplit = isGlitching ? Math.sin(phaseFrame * 123) * 15 : 0;
  const skewX = isGlitching ? Math.cos(phaseFrame * 89) * 5 : 0;

  // --- PHASE 2: THE COLLAPSE OF SCENE A (10-20) ---
  const collapseSpring = spring({
    frame: Math.max(0, phaseFrame - 10),
    fps,
    config: { damping: 16, stiffness: 200, overshootClamping: true },
    durationInFrames: 10,
  });
  
  // Scene A actually squashes, mimicking a CRT power-down
  const scaleY_A = interpolate(collapseSpring, [0, 1], [1, 0.005]); 
  const opacity_A = phaseFrame >= 20 ? 0 : 1; 
  const lineBrightness = interpolate(collapseSpring, [0, 1], [1, 5]);

  // --- PHASE 3: THE REVEAL OF SCENE B (20-30) ---
  const expandSpring = spring({
    frame: Math.max(0, phaseFrame - 20),
    fps,
    config: { damping: 14, stiffness: 180 },
    durationInFrames: 10,
  });

  // Apply digital glitch overlay timing
  const isRevealing = phaseFrame >= 20 && phaseFrame < 30;
  const skewXOverlay = isRevealing ? Math.cos(phaseFrame * 89) * 5 : 0; // Increased skew slightly
  
  const isBefore = frame < transitionStartFrame;
  const isAfterSafe = frame > transitionStartFrame + durationFrames + 100;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      
      {/* ── LAYER 1: SCENE B (Paper Cutout Engine) ── */}
      {/* Sits completely still at Z: 10. No scaling, no clipping, zero GPU overhead. */}
      {!isBefore && phaseFrame >= 20 && (
        <AbsoluteFill style={{ 
          zIndex: 10,
          transform: `skewX(${skewXOverlay}deg)`,
          willChange: 'transform'
        }}>
          {childrenB}
          
          {/* Transient CRT Digital Glitch Overlay over Scene B */}
          {isRevealing && (
            <AbsoluteFill style={{ 
              zIndex: 20, 
              opacity: (phaseFrame % 2 === 0) ? 0.9 : 0.5, // Bumped slightly higher for premium pop
              mixBlendMode: 'overlay',
              transform: `skewX(${skewXOverlay}deg)`, 
              willChange: 'transform'
            }}>
              {/* CRT Scanlines */}
              <div style={{
                 position: "absolute", inset: 0,
                 backgroundImage: "repeating-linear-gradient(0deg, rgba(255,200,100,0.3) 0px, transparent 2px, rgba(255,200,100,0.3) 4px)",
                 pointerEvents: "none"
              }} />
              
              {/* Digital Block Glitch (Smooth & Elegant White Streaks) */}
              {phaseFrame % 2 === 0 && (
                 <div style={{
                   position: 'absolute',
                   top: '20%', left: '-10%', right: '-10%', height: '15%',
                   backgroundColor: 'rgba(255,255,255,0.75)', // Increased
                   mixBlendMode: 'color-dodge',
                   transform: `translateX(${Math.sin(phaseFrame) * 200}px)`
                 }} />
              )}
              {phaseFrame % 3 === 0 && (
                 <div style={{
                   position: 'absolute',
                   bottom: '15%', left: '-10%', right: '-10%', height: '20%',
                   backgroundColor: 'rgba(255,255,255,0.65)', // Increased
                   mixBlendMode: 'color-dodge',
                   transform: `translateX(${Math.cos(phaseFrame) * -200}px)`
                 }} />
              )}
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}

      {/* ── LAYER 2: THE HARFEN STUDIO SHUTTERS ── */}
      {/* These hide Scene B and act as the physical background for the Red Line. 
          They smoothly translate UP and DOWN to reveal Scene B without lagging the browser. */}
      {phaseFrame >= 10 && phaseFrame < 40 && (
        <AbsoluteFill style={{ zIndex: 20 }}>
          {/* TOP SHUTTER */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
            overflow: 'hidden',
            transform: `translateY(${interpolate(expandSpring, [0, 1], [0, -100])}%)`,
            willChange: 'transform'
          }}>
             {/* Base Harfen Studio EXACTLY matched to the last frame of Scene 3 */}
             <img src={staticFile('images/episode4/scene-3/harfen-studio.jpeg')} style={{ 
               width: '100%', height: '200%', objectFit: 'cover', 
               filter: 'blur(19px) grayscale(0.5) sepia(0.4) contrast(1.3) brightness(0.9)', 
               transform: `scale(2) translateX(70px)` 
             }} />

             {/* Glitchy Glowing Edge for the top shutter */}
             <div style={{ 
               position: 'absolute', bottom: 0, width: '100%', 
               height: phaseFrame % 2 === 0 ? '6px' : '3px', 
               backgroundColor: phaseFrame % 3 === 0 ? '#fff' : RED, 
               boxShadow: `0 0 30px ${RED}`, 
               opacity: interpolate(expandSpring, [0, 1], [1, 0]),
               transform: `translateX(${phaseFrame % 2 === 0 ? '10px' : '-10px'})`
             }} />
          </div>

          {/* BOTTOM SHUTTER */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
            overflow: 'hidden',
            transform: `translateY(${interpolate(expandSpring, [0, 1], [0, 100])}%)`,
            willChange: 'transform'
          }}>
             {/* Base Harfen Studio EXACTLY matched to the last frame of Scene 3 */}
             <img src={staticFile('images/episode4/scene-3/harfen-studio.jpeg')} style={{ 
               width: '100%', height: '200%', objectFit: 'cover', 
               filter: 'blur(19px) grayscale(0.5) sepia(0.4) contrast(1.3) brightness(0.9)', 
               transform: `translateY(-50%) scale(2) translateX(70px)` 
             }} />

             {/* Glitchy Glowing Edge for the bottom shutter */}
             <div style={{ 
               position: 'absolute', top: 0, width: '100%', 
               height: phaseFrame % 3 === 0 ? '5px' : '2px', 
               backgroundColor: phaseFrame % 2 === 0 ? '#fff' : RED, 
               boxShadow: `0 0 30px ${RED}`, 
               opacity: interpolate(expandSpring, [0, 1], [1, 0]),
               transform: `translateX(${phaseFrame % 3 === 0 ? '-15px' : '15px'})`
             }} />
          </div>
        </AbsoluteFill>
      )}

      {/* ── LAYER 3: SCENE A (Glitches, then Collapses to line) ── */}
      {!isAfterSafe && opacity_A > 0 && (
        <AbsoluteFill
          style={{
            transform: `scaleY(${scaleY_A}) skewX(${skewX}deg)`,
            filter: `brightness(${lineBrightness})`,
            transformOrigin: "center center",
            zIndex: 30,
            willChange: 'transform'
          }}
        >
          <AbsoluteFill>
            {childrenA}
            {rgbSplit !== 0 && (
              <AbsoluteFill style={{ transform: `translateX(-${rgbSplit}px)`, mixBlendMode: 'screen', backgroundColor: 'rgba(255,0,85,0.4)', zIndex: 5 }} />
            )}
          </AbsoluteFill>

          {/* CRT MATERIAL STROBE OVERLAY */}
          {crtStrobe > 0 && (
            <AbsoluteFill
              style={{
                zIndex: 10,
                opacity: crtStrobe,
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}
            >
              <div style={{ width: '100%', height: '100%',
                   backgroundColor: 'rgba(3, 7, 5, 0.4)',
                   borderRadius: '8% / 12%', 
                   boxShadow: `inset 0 0 150px rgba(0,0,0,1)`, 
                   border: '24px solid #0a0a0a', borderBottomWidth: '60px', 
                   overflow: 'hidden', position: 'relative' }}>
                   
                   <div style={{
                     position: "absolute", inset: 0,
                     backgroundImage: "repeating-linear-gradient(0deg, rgba(255,150,0,0.4) 0px, transparent 2px, rgba(255,150,0,0.4) 4px)",
                     mixBlendMode: "color-dodge",
                     zIndex: 15
                   }} />
              </div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}

      {/* ── GLOWING WAR-ROOM RED LINE (Highly Jittery & Glitchy) ── */}
      {phaseFrame > 15 && phaseFrame < 20 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{
            width: `${100 + (phaseFrame % 2 === 0 ? 5 : -5)}%`, 
            height: phaseFrame % 3 === 0 ? '8px' : '3px', 
            backgroundColor: phaseFrame % 4 === 0 ? '#FFFFFF' : RED, 
            boxShadow: `0 0 50px ${RED}, 0 0 100px ${RED}, 0 0 150px ${phaseFrame % 2 === 0 ? '#FFF' : RED}`, 
            opacity: interpolate(phaseFrame, [15, 18, 20], [0, 1, 0]),
            transform: `
              scaleX(${interpolate(phaseFrame, [15, 18], [0, 1])}) 
              translateY(${phaseFrame % 2 === 0 ? 3 : -3}px) 
              skewX(${phaseFrame % 3 === 0 ? 15 : -15}deg)
            `,
            mixBlendMode: 'screen',
            filter: `blur(${phaseFrame % 2 === 0 ? 0 : 2}px)`
          }} />
          
          {/* Secondary Core Line for extra electric intensity */}
          <div style={{
            position: 'absolute',
            width: '100%', 
            height: '2px', 
            backgroundColor: '#FFFFFF',
            boxShadow: `0 0 20px #FFF`, 
            opacity: interpolate(phaseFrame, [15, 18, 20], [0, 0.8, 0]),
            transform: `scaleX(${interpolate(phaseFrame, [15, 18], [0, 1])}) translateY(${phaseFrame % 3 === 0 ? -2 : 2}px)`
          }} />
        </AbsoluteFill>
      )}

    </AbsoluteFill>
  );
};
