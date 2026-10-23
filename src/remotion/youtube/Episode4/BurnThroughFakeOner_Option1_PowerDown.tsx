import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const BurnThroughFakeOner: React.FC<{
  childrenA: React.ReactNode;
  childrenB: React.ReactNode;
  transitionStartFrame: number;
  durationFrames?: number;
}> = ({ 
  childrenA, childrenB, transitionStartFrame, durationFrames = 45 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const RED = "#FF0055";

  const phaseFrame = frame - transitionStartFrame;

  const isGlitching = phaseFrame >= 0 && phaseFrame < 10;
  const crtStrobe = isGlitching && (phaseFrame % 3 === 0 || phaseFrame % 4 === 0) ? 0.8 : 0;
  const rgbSplit = isGlitching ? Math.sin(phaseFrame * 123) * 15 : 0;
  const skewX = isGlitching ? Math.cos(phaseFrame * 89) * 5 : 0;

  const collapseSpring = spring({
    frame: Math.max(0, phaseFrame - 10),
    fps,
    config: { damping: 16, stiffness: 200, overshootClamping: true },
    durationInFrames: 10,
  });
  
  const scaleY_A = interpolate(collapseSpring, [0, 1], [1, 0.005]); 
  const opacity_A = phaseFrame >= 20 ? 0 : 1; 
  const lineBrightness = interpolate(collapseSpring, [0, 1], [1, 5]);

  const expandSpring = spring({
    frame: Math.max(0, phaseFrame - 20),
    fps,
    config: { damping: 14, stiffness: 180 },
    durationInFrames: 10,
  });

  const scaleY_CRT = interpolate(expandSpring, [0, 1], [0.005, 1]); 

  const whipSpring = spring({
    frame: Math.max(0, phaseFrame - 30),
    fps,
    config: { damping: 14, stiffness: 200, overshootClamping: true },
    durationInFrames: 15,
  });

  const whipX_CRT = interpolate(whipSpring, [0, 1], [0, -100], { extrapolateRight: "clamp" }); 
  const whipBlur = interpolate(whipSpring, [0, 0.5, 1], [0, 40, 0], { extrapolateRight: "clamp" });
  const whipRgbSplit = interpolate(whipSpring, [0, 0.5, 1], [0, 30, 0], { extrapolateRight: "clamp" });

  const isBefore = frame < transitionStartFrame;
  const isAfterSafe = frame > transitionStartFrame + durationFrames + 100;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      {!isBefore && phaseFrame >= 20 && (
        <AbsoluteFill style={{ zIndex: 10 }}>
          {childrenB}
          {whipRgbSplit > 0 && (
            <AbsoluteFill style={{ transform: `translateX(${whipRgbSplit}px)`, mixBlendMode: 'screen', backgroundColor: 'rgba(0,255,255,0.4)' }} />
          )}
        </AbsoluteFill>
      )}

      {phaseFrame >= 20 && phaseFrame < 45 && (
        <AbsoluteFill
          style={{
            zIndex: 20,
            transform: `scaleY(${scaleY_CRT}) translateX(${whipX_CRT}%)`,
            filter: `blur(${whipBlur}px)`,
            transformOrigin: "center center",
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
        >
          <div style={{ width: '100%', height: '100%',
               backgroundColor: '#050505',
               borderRadius: '8% / 12%', 
               boxShadow: `inset 0 0 150px rgba(0,0,0,1)`, 
               border: '24px solid #0a0a0a', borderBottomWidth: '60px', 
               overflow: 'hidden', position: 'relative' }}>
               <div style={{ position: 'absolute', inset: 0, border: '6px solid #000', borderRadius: '4% / 6%', zIndex: 10, pointerEvents: 'none', boxShadow: 'inset 0 0 30px rgba(0,0,0,1)' }} />
               <div style={{ position: 'absolute', top: '-10%', left: '-10%', right: '-10%', height: '45%', background: 'linear-gradient(175deg, rgba(255,255,255,0.06) 0%, transparent 100%)', transform: 'rotate(-5deg)', zIndex: 21, pointerEvents: 'none' }} />
               <div style={{
                 position: "absolute", inset: 0,
                 backgroundImage: "repeating-linear-gradient(0deg, rgba(255,150,0,0.2) 0px, transparent 2px, rgba(255,150,0,0.2) 4px)",
                 mixBlendMode: "color-dodge",
                 zIndex: 15
               }} />
          </div>
        </AbsoluteFill>
      )}

      {!isAfterSafe && opacity_A > 0 && (
        <AbsoluteFill
          style={{
            transform: `scaleY(${scaleY_A}) skewX(${skewX}deg)`,
            filter: `brightness(${lineBrightness})`,
            transformOrigin: "center center",
            zIndex: 30
          }}
        >
          <AbsoluteFill>
            {childrenA}
            {rgbSplit !== 0 && (
              <AbsoluteFill style={{ transform: `translateX(-${rgbSplit}px)`, mixBlendMode: 'screen', backgroundColor: 'rgba(255,0,85,0.4)', zIndex: 5 }} />
            )}
          </AbsoluteFill>
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

      {whipBlur > 0 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 100 }}>
          <div style={{
            width: "200%", height: "6px", backgroundColor: "#fff",
            boxShadow: `0 0 30px 10px rgba(255, 150, 0, 0.8)`,
            transform: `scaleX(${interpolate(phaseFrame, [30, 38, 45], [0, 1, 0])})`
          }} />
        </AbsoluteFill>
      )}

      {phaseFrame > 15 && phaseFrame < 25 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{
            width: '100%', 
            height: '4px', 
            backgroundColor: RED, 
            boxShadow: `0 0 40px ${RED}, 0 0 80px ${RED}, 0 0 120px #FFF`, 
            opacity: interpolate(phaseFrame, [15, 20, 25], [0, 1, 0]),
            transform: `scaleX(${interpolate(phaseFrame, [15, 18], [0, 1])})`
          }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
