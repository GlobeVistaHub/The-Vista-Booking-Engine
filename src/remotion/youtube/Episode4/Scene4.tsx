import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, Img, staticFile, Sequence, Audio, Video, spring, interpolateColors, Loop, random } from 'remotion';
import { NewsChyron } from '../Episode3/TheHook';

export const CharacterCA3D: React.FC<{ imgSrc: string; caX: number }> = ({ imgSrc, caX }) => {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.8, filter: 'sepia(1) hue-rotate(-50deg) saturate(8)', transform: `translateX(${caX}px)` }}>
        <img src={imgSrc} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.8, filter: 'sepia(1) hue-rotate(150deg) saturate(8)', transform: `translateX(${-caX}px)` }}>
        <img src={imgSrc} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} />
      </div>
    </>
  )
}

// ── TYPES & CONSTANTS ──
const FPS = 30;
const AUDIO1_DURATION = 360; // 12s
const AUDIO2_DURATION = 360; // 12s
const AUDIO3_DURATION = 360; // 12s
const TOTAL_DURATION = AUDIO1_DURATION + AUDIO2_DURATION + AUDIO3_DURATION;
const AUDIO1_DELAY = 45; // 1.5 seconds breathing room (Voiceover starts exactly at 01:21.03)

// ── ELECTRICITY ENHANCEMENT ──
const LiveElectricityEffect: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  // Only show intense sparks for the first 2 seconds (60 frames)
  const opacity = interpolate(localFrame, [0, 10, 50, 60], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  
  // Chaotic random strobe effect
  const strobe = Math.random() > 0.5 ? 1 : 0.5;
  
  return (
    <AbsoluteFill style={{ opacity: opacity * strobe, mixBlendMode: 'color-dodge', pointerEvents: 'none' }}>
      <div style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(45deg, rgba(255,180,0,0.4) 0%, rgba(0,255,255,0.4) 100%)',
        filter: 'contrast(200%) brightness(150%)',
      }} />
      {/* Dynamic CSS Sparks could be added here if needed */}
    </AbsoluteFill>
  );
};

// ── SCENE COMPONENTS ──

const CRTPaperEngine: React.FC = () => {
  const frame = useCurrentFrame();
  
  // ── EVIDENCE BOARD CHOREOGRAPHY ──
  // 01:21.03 is exactly Frame 45 in this composition (AUDIO1_DELAY).
  const ELON_DROP_FRAME = AUDIO1_DELAY; 

  const elonSpring = spring({ 
    frame: Math.max(0, frame - ELON_DROP_FRAME), 
    fps: FPS, 
    config: { damping: 11, stiffness: 200 } // Hard, violent snap 
  });
  
  // Physics for Elon slamming onto the board
  const elonY = interpolate(elonSpring, [0, 1], [-1500, 0]);
  const elonRot = interpolate(elonSpring, [0, 1], [-25, -4]); // Rotates into place
  const elonScale = interpolate(elonSpring, [0, 1], [3, 1]); // Slams from camera to board
  const elonShadow = interpolate(elonSpring, [0, 1], [100, 20]); // Shadow tightens on impact
  
  // Impact Glitch (Chromatic aberration for 3 frames exactly on impact)
  const isElonImpact = frame >= ELON_DROP_FRAME + 8 && frame <= ELON_DROP_FRAME + 11;
  const elonImpactRGB = isElonImpact ? 15 : 0;
  // ── TEXT ANIMATION (VivaTech Paris 2024) ──
  // Red banner pops at exactly 01:22.15 (Frame 77)
  const RED_TAG_FRAME = 77;
  const textSpring1 = spring({ 
    frame: Math.max(0, frame - RED_TAG_FRAME), 
    fps: FPS, 
    config: { damping: 14, stiffness: 150 } 
  });
  
  // White banner (2024) pops at exactly 01:23.09 (Frame 105)
  const WHITE_TAG_FRAME = 105;
  const textSpring2 = spring({ 
    frame: Math.max(0, frame - WHITE_TAG_FRAME), 
    fps: FPS, 
    config: { damping: 14, stiffness: 150 } 
  });

  // ── MASKING TAPE ANIMATIONS (Smooth Reveal) ──
  // Upper tape slaps exactly at 01:22.08 (Frame 74) + 5 frame delay = Frame 79
  const TAPE1_FRAME = 79; 
  // Lower tape slaps exactly at 01:22.17 (Frame 77) + 5 frame delay = Frame 82
  const TAPE2_FRAME = 82; 
  
  // Replaced bouncy springs with strict Easing to completely eliminate vibration/jitter
  const tape1Inset = interpolate(frame, [TAPE1_FRAME, TAPE1_FRAME + 6], [240, 0], { 
    extrapolateLeft: 'clamp', 
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad)
  }); 

  const tape2Inset = interpolate(frame, [TAPE2_FRAME, TAPE2_FRAME + 6], [200, 0], { 
    extrapolateLeft: 'clamp', 
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad)
  }); 
  
  // ── AI TEXT TYPEWRITER ANIMATION ──
  // "قريب جداً الذكاء الاصطناعي هيعمل كل حاجة"
  // Starts typing exactly at 01:24.30 + 15 frames (Frame 156)
  const AI_TEXT_FRAME = 156; 
  const aiTextFull = "قريب جداً الذكاء الاصطناعي هيعمل كل حاجة";
  const charsToShow = Math.max(0, Math.floor((frame - AI_TEXT_FRAME) / 1.5));
  const visibleAiText = aiTextFull.slice(0, charsToShow);

  const text1X = interpolate(textSpring1, [0, 1], [200, 0]);
  const text1Scale = interpolate(textSpring1, [0, 1], [0.8, 1]);
  const text1Opacity = interpolate(textSpring1, [0, 1], [0, 1]);

  const text2X = interpolate(textSpring2, [0, 1], [-200, 0]);
  const text2Scale = interpolate(textSpring2, [0, 1], [1.2, 1]);
  const text2Opacity = interpolate(textSpring2, [0, 1], [0, 1]);

  // ── CUBICLE ANIMATION (Soft Radial Mask Reveal) ──
  const CUBICLE_DROP_FRAME = 256;
  const cubicleProgress = spring({
    frame: Math.max(0, frame - CUBICLE_DROP_FRAME),
    fps: FPS,
    config: { damping: 18, stiffness: 90 } // Softer, organic spring
  });
  
  // Animates from -20% to 120% to guarantee it starts fully invisible and ends fully visible
  const cubicleRadius = interpolate(cubicleProgress, [0, 1], [-20, 120]);

  // ── TERMINATION NOTICE ANIMATION (01:29.15 / Frame 287) ──
  const NOTICE_DROP_FRAME = 287;
  const noticeSpring = spring({
    frame: Math.max(0, frame - NOTICE_DROP_FRAME),
    fps: FPS,
    config: { damping: 20, stiffness: 400 } // EXTREME physical slam
  });
  // Removed translateY entirely so it stamps straight down from the camera lens (Z-axis) rather than sliding down the wall
  const noticeScale = interpolate(noticeSpring, [0, 1], [4, 1]); // Plummets from in front of the lens
  const noticeRot = interpolate(noticeSpring, [0, 1], [30, -12]); // Reverted to the aggressive leftward twist
  const noticeShadow = interpolate(noticeSpring, [0, 1], [100, 15]); // Massive depth shadow slamming flat
  const noticeImpactRGB = interpolate(noticeSpring, [0, 0.6, 1], [0, -30, 0]); // Severe RGB glitch on impact

  // ── BURNED MONEY ANIMATION (01:30.18 / Frame 317) ──
  const MONEY_DROP_FRAME = 317;
  const moneySpring = spring({
    frame: Math.max(0, frame - MONEY_DROP_FRAME),
    fps: FPS,
    config: { damping: 15, stiffness: 140 } // Fast, smooth slide
  });
  const moneyX = interpolate(moneySpring, [0, 1], [1500, 0]); // Slides in from off-screen right
  const moneyRot = interpolate(moneySpring, [0, 1], [45, -5]); // Slight spin as it slides
  
  // Violent Red Marker Strike occurs after the money fully settles
  const MARKER_STRIKE_FRAME = MONEY_DROP_FRAME + 30; // Delayed an additional 10 frames (30 total)
  const markerWidth = interpolate(frame, [MARKER_STRIKE_FRAME, MARKER_STRIKE_FRAME + 4], [0, 90], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad)
  });

  // ── BURNED MONEY MOVEMENT & MORPH (01:35.25 / Frame 470) ──
  const MONEY_MOVE_FRAME = 470;
  const moneyMoveSpring = spring({
    frame: Math.max(0, frame - MONEY_MOVE_FRAME),
    fps: FPS,
    config: { damping: 18, stiffness: 60 } // Smooth, deliberate float to center
  });
  const moneyCenterX = interpolate(moneyMoveSpring, [0, 1], [0, -400]); // Pushed further left to clear space
  const moneyCenterY = interpolate(moneyMoveSpring, [0, 1], [0, -300]); // Pushed higher up

  // ── THE KINETIC 3D FLIP MORPH (Delayed by 15 frames) ──
  const MORPH_FRAME = 542; // Delayed to give the money more time to settle before flipping
  const morphSpring = spring({
    frame: Math.max(0, frame - MORPH_FRAME),
    fps: FPS,
    config: { damping: 14, stiffness: 120 } // Snappy 3D flip
  });
  // CRITICAL FIX: The 250B card is mathematically settling and causing a wobble.
  // We force continuous drift on the Flip and Scale variables so it stays locked in GPU.
  const moneyFlipY = interpolate(morphSpring, [0, 1], [0, 180]); // 3D Y-axis rotation
  const moneyScaleUp = interpolate(morphSpring, [0, 0.5, 1], [1, 1.1, 0.85]); // Pops up to 1.1x during flip, then settles smaller (85%) in the center

  // ── TEXT BLING REVEAL (Triggers after the back face is exposed) ──
  // The animation is now handled character-by-character in the JSX below
  const textRevealStart = MORPH_FRAME + 5;

  // ── LAID OFF WORKERS REVEAL (01:41.21 / Frame 648) ──
  const WORKERS_DROP_FRAME = 648;
  const workersSpring = spring({
    frame: Math.max(0, frame - WORKERS_DROP_FRAME),
    fps: FPS,
    config: { damping: 14, stiffness: 140 }
  });
  // Instead of dropping from the ceiling, they slide aggressively out from the Office/Notice direction (Left to Right)
  const workersX = interpolate(workersSpring, [0, 1], [-800, 0]); 
  const workersY = interpolate(workersSpring, [0, 1], [100, 0]); // Slight arc
  const workersRot = interpolate(workersSpring, [0, 1], [-25, 8]); // Tumbles into place
  const workersScale = interpolate(workersSpring, [0, 1], [0.5, 1]); // Scales up as it slides in

  // ── QUESTION MARK SLAM (01:43.27 / Frame 710) ──
  const Q_MARK_FRAME = 710;
  const qMarkSpring = spring({
    frame: Math.max(0, frame - Q_MARK_FRAME),
    fps: FPS,
    config: { damping: 12, stiffness: 250 } // Super aggressive stamp
  });
  const qMarkScale = interpolate(qMarkSpring, [0, 1], [5, 1]); // Stamps down from camera lens
  const qMarkRot = interpolate(qMarkSpring, [0, 1], [45, -15]);
  
  // ── ANALOG TRANSITION & HUD SHRINK ──
  const ANALOG_START = 730; // 01:43.28
  const HUD_SHRINK = 750; // Delay shrink by 20 frames
  
  // Slower, cinematic 3D push back instead of a harsh snap
  const snapOutSpring = spring({
    frame: Math.max(0, frame - HUD_SHRINK),
    fps: FPS,
    config: { damping: 24, stiffness: 70 } // Buttery smooth interpolation
  });

  // Analog Glitch Math (Active for 20 frames before the shrink)
  const isAnalogPhase = frame >= ANALOG_START && frame < HUD_SHRINK;
  const rgbSplit = isAnalogPhase ? Math.sin(frame * 34) * 4 : 0;
  const glitchSkew = isAnalogPhase && frame % 3 === 0 ? Math.cos(frame * 12) * 1.5 : 0;
  const crtStrobe = isAnalogPhase && frame % 4 === 0 ? 0.08 : 0;
  
  // ── HUD DIGITAL GLITCH & MP4 INJECTION (01:50.14 / Frame 926) ──
  const HUD_MP4_START = 926; // Exactly SMPTE 01:50.14
  const isDigitalGlitchHUD = frame >= HUD_MP4_START && frame < HUD_MP4_START + 8;
  const digitalGlitchSkew = isDigitalGlitchHUD ? (frame % 2 === 0 ? 4 : -4) : 0;

  // Continuity Digital Glitch (from Scene 2) when MP4 injects
  const glitchIntensity1 = interpolate(frame, [HUD_MP4_START, HUD_MP4_START + 12], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const glitchJitterX1 = glitchIntensity1 > 0 ? Math.sin(frame * 45) * 40 * glitchIntensity1 : 0;
  const glitchJitterY1 = glitchIntensity1 > 0 ? Math.cos(frame * 30) * 20 * glitchIntensity1 : 0;

  // ── HUD EXPANDS TO COVER BACKGROUND (Frame 965) ──
  const TAKEOVER_FRAME = 965; // Maintains precise 39 frame gap from injection!
  const isTakeoverGlitch = frame >= TAKEOVER_FRAME && frame < TAKEOVER_FRAME + 10;
  const takeoverGlitchSkew = isTakeoverGlitch ? (frame % 3 === 0 ? 6 : -6) : 0;
  
  // Continuity Digital Glitch (from Scene 2) when Takeover begins
  const glitchIntensity2 = interpolate(frame, [TAKEOVER_FRAME, TAKEOVER_FRAME + 12], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const glitchJitterX2 = glitchIntensity2 > 0 ? Math.sin(frame * 45) * 40 * glitchIntensity2 : 0;
  const glitchJitterY2 = glitchIntensity2 > 0 ? Math.cos(frame * 30) * 20 * glitchIntensity2 : 0;
  
  const totalGlitchJitterX = glitchJitterX1 + glitchJitterX2;
  const totalGlitchJitterY = glitchJitterY1 + glitchJitterY2;

  const takeoverSpring = spring({
    frame: Math.max(0, frame - TAKEOVER_FRAME),
    fps: FPS,
    config: { damping: 40, stiffness: 30 } // Very slow, creeping expansion
  });

  // Microsoft HUD Physics (Snaps out, then gradually expands back to full screen)
  const hudScale = interpolate(snapOutSpring, [0, 1], [1, 0.55]) + interpolate(takeoverSpring, [0, 1], [0, 0.65]); // Expands to 1.2x to cover screen
  const hudX = interpolate(snapOutSpring, [0, 1], [0, -380]) + interpolate(takeoverSpring, [0, 1], [0, 380]); // Returns to center
  const hudY = interpolate(snapOutSpring, [0, 1], [0, -80]) + interpolate(takeoverSpring, [0, 1], [0, 80]); // Returns to center
  const hudRotY = interpolate(snapOutSpring, [0, 1], [0, 18]) + interpolate(takeoverSpring, [0, 1], [0, -18]); // Flattens out
  const hudRotX = interpolate(snapOutSpring, [0, 1], [0, 2]) + interpolate(takeoverSpring, [0, 1], [0, -2]); // Flattens out

  const hudBorderRadius = interpolate(snapOutSpring, [0, 1], [0, 40]) + interpolate(takeoverSpring, [0, 1], [0, -40]); // Loses border radius
  const hudBorderWidth = interpolate(snapOutSpring, [0, 1], [0, 2]) + interpolate(takeoverSpring, [0, 1], [0, -2]); // Loses border
  const hudShadow = interpolate(snapOutSpring, [0, 1], [0, 80]) + interpolate(takeoverSpring, [0, 1], [0, -80]); // Loses shadow
  
  return (
    <AbsoluteFill style={{ 
      // The microscopic translateZ(Math.sin(frame) * 0.01) is completely invisible to the eye.
      // It forces Chromium to NEVER offload the layer to a static 2D raster state, 
      // Using linear frame movement (frame * 0.001) instead of Math.sin to prevent sub-pixel high-frequency vibration jitter.
      transform: `perspective(1200px) translateX(${hudX}px) translateY(${hudY}px) scale(${hudScale}) rotateY(${hudRotY}deg) rotateX(${hudRotX}deg) skewX(${glitchSkew}deg) translateZ(${frame * 0.001}px)`,
      transformOrigin: 'center center',
      borderRadius: `${hudBorderRadius}px`,
      border: `${hudBorderWidth}px solid rgba(0, 164, 239, 0.4)`, // MS Blue instead of Cyan
      boxShadow: `inset 0 0 ${hudShadow}px rgba(0, 164, 239, 0.15), 0 40px ${hudShadow}px rgba(0, 0, 0, 0.95)`, // MS Blue inner glow + heavy drop shadow
      overflow: 'hidden',
      zIndex: 10, // Sits on top of Mariya's studio
      backgroundColor: '#111',
      filter: rgbSplit !== 0 ? `drop-shadow(${rgbSplit}px 0 0 rgba(255,0,0,0.8)) drop-shadow(${-rgbSplit}px 0 0 rgba(0,255,255,0.8))` : 'none',
      willChange: 'transform', // Forces hardware acceleration
      backfaceVisibility: 'hidden', // Prevents sub-pixel jitter when spring physics settle
      WebkitFontSmoothing: 'antialiased',
      transformStyle: 'preserve-3d',
    }}>
      {/* Heavy CRT Strobe & Analog Burn (Extends through the shrink) - Softened */}
      <AbsoluteFill style={{
        opacity: interpolate(frame, [ANALOG_START, HUD_SHRINK], [0, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, transparent 2px, rgba(255,255,255,0.05) 4px)",
        backgroundColor: crtStrobe > 0 ? `rgba(255,255,255,${crtStrobe})` : 'transparent',
        pointerEvents: 'none',
        zIndex: 99,
        mixBlendMode: 'overlay'
      }} />
      <AbsoluteFill style={{
        opacity: interpolate(frame, [ANALOG_START, HUD_SHRINK], [0, 0.25], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        backgroundImage: "radial-gradient(circle, transparent 50%, rgba(0,0,0,0.9) 100%)",
        pointerEvents: 'none',
        zIndex: 99
      }} />

      {/* ── DIGITAL HUD MP4 INJECTION (Frame 791) ── */}
      <Sequence from={HUD_MP4_START}>
        <AbsoluteFill style={{ 
          zIndex: 100, 
          backgroundColor: '#000',
          transform: `translateX(${totalGlitchJitterX}px) translateY(${totalGlitchJitterY}px) skewX(${digitalGlitchSkew + takeoverGlitchSkew}deg) scale(${isDigitalGlitchHUD || isTakeoverGlitch ? (frame % 2 === 0 ? 1.1 : 1.05) : 1.05})`,
          filter: isDigitalGlitchHUD || isTakeoverGlitch ? `saturate(2) hue-rotate(${frame * 45}deg)` : 'none'
        }}>
          <Loop durationInFrames={180}>
            <Video src={staticFile('video/episode4/scene4/power-plant.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Loop>
          
          {/* Scene 1 Server Montage Scanlines Overlay */}
          <AbsoluteFill style={{ 
            zIndex: 10, 
            pointerEvents: "none", 
            backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)", 
            mixBlendMode: "overlay" 
          }} />
          
          {/* ══ THE DIGITAL FLASH & SLICE GLITCH (MATCHING SCENE 2) ══ */}
          {/* White Flash */}
          <AbsoluteFill style={{
            backgroundColor: '#FFF', mixBlendMode: 'overlay', zIndex: 70,
            opacity: interpolate(frame, [HUD_MP4_START, HUD_MP4_START + 2, HUD_MP4_START + 4, HUD_MP4_START + 8], [0.8, 0, 0.6, 0], { extrapolateLeft: 'clamp', extrapolateRight: "clamp" }),
          }} />
          
          {/* Red Flash */}
          <AbsoluteFill style={{
            backgroundColor: 'rgba(255, 0, 0, 0.8)', mixBlendMode: 'screen', zIndex: 71,
            opacity: interpolate(frame, [HUD_MP4_START, HUD_MP4_START + 4, HUD_MP4_START + 10], [0.5, 0, 0], { extrapolateLeft: 'clamp', extrapolateRight: "clamp" }),
          }} />

          {/* Cyan Slice Glitches */}
          {isDigitalGlitchHUD && frame % 3 === 0 && (
            <div style={{
              position: 'absolute', left: 0, right: 0, top: `${Math.random() * 60 + 10}%`, height: `${Math.random() * 15 + 5}%`,
              backgroundColor: 'rgba(0, 255, 255, 0.9)', mixBlendMode: 'difference', zIndex: 72,
              transform: `translateX(${Math.random() * 40 - 20}px)`
            }} />
          )}

          {isTakeoverGlitch && frame % 3 === 0 && (
            <div style={{
              position: 'absolute', left: 0, right: 0, top: `${Math.random() * 60 + 10}%`, height: `${Math.random() * 15 + 5}%`,
              backgroundColor: 'rgba(0, 255, 255, 0.9)', mixBlendMode: 'difference', zIndex: 72,
              transform: `translateX(${Math.random() * 40 - 20}px)`
            }} />
          )}

          {/* ── HIGH-VOLTAGE ELECTRICITY ENHANCEMENT (First 2 Seconds of MP4) ── */}
          {/* Intense amber heat pulsations driven by deterministic chaos */}
          <AbsoluteFill style={{
            backgroundColor: '#FF6600',
            mixBlendMode: 'color-dodge',
            opacity: interpolate(frame, [HUD_MP4_START, HUD_MP4_START + 60], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) 
                     * (0.3 + random(`heat-${frame}`) * 0.7), 
            zIndex: 75,
            pointerEvents: 'none'
          }} />

          {/* Kinetic Electrical Arcs/Sparks */}
          {frame >= HUD_MP4_START && frame < HUD_MP4_START + 60 && frame % 3 === 0 && (
             <div style={{
               position: 'absolute',
               top: `${random(`spark-y-${frame}`) * 100}%`,
               left: `${random(`spark-x-${frame}`) * 100}%`,
               width: `${random(`spark-w-${frame}`) * 300 + 100}px`,
               height: `${random(`spark-h-${frame}`) * 6 + 2}px`,
               backgroundColor: '#FFF',
               boxShadow: '0 0 40px 10px #00E5CC, 0 0 80px 20px #FFF', // Cyan/White plasma glow
               transform: `rotate(${random(`spark-rot-${frame}`) * 180}deg)`,
               zIndex: 80,
               mixBlendMode: 'screen',
               pointerEvents: 'none'
             }} />
          )}

          {/* Brief Takeover Digital Glitch (when HUD starts expanding) */}
          <AbsoluteFill style={{
            opacity: interpolate(frame, [TAKEOVER_FRAME, TAKEOVER_FRAME + 10], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            backgroundColor: 'rgba(255, 200, 0, 0.4)', // Toxic glitch
            mixBlendMode: 'color-dodge'
          }} />
        </AbsoluteFill>
      </Sequence>
      {/* ── INTERNAL PARALLAX PUSH (HUD COLLAPSED PHASE) ── */}
      {/* Slowly creeping zoom to maintain tension before the MP4 injects */}
      <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [HUD_SHRINK, HUD_MP4_START], [1, 1.08], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`, transformOrigin: 'center center' }}>
        <Img 
          src={staticFile('images/episode4/scene-4/asset2.4-paper engine base canvas-the background.png')} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} 
        />
      </AbsoluteFill>
      
      {/* ── EVIDENCE BOARD ASSETS ── */}
      <AbsoluteFill style={{ 
        padding: '100px',
        transform: `scale(${interpolate(frame, [HUD_SHRINK, HUD_MP4_START], [1, 1.18], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
        transformOrigin: 'center center',
        // INTENTIONAL MASK: A highly elegant 8-frame glow + blur centering exactly on 01:43.25 (Local Frame 823).
        // Uses a smooth mathematical bell-curve to ramp in and out, making the effect look completely intentional.
        filter: frame >= 819 && frame <= 827 
          ? `blur(${Math.max(0, 1 - Math.abs(frame - 823) / 4) * 5}px) brightness(${1 + Math.max(0, 1 - Math.abs(frame - 823) / 4) * 0.4})` 
          : 'none',
        willChange: 'filter, transform'
      }}>
         {/* 1. ELON MUSK */}
         {frame >= ELON_DROP_FRAME && (
           <div style={{
             position: 'absolute',
             top: '2%', left: '0%', // Pushed UP and LEFT to un-clutter the canvas
             width: '920px', // Boosted scale (up from 850px)
             transform: `translateY(${elonY}px) scale(${elonScale}) rotateZ(${elonRot}deg)`,
             filter: `drop-shadow(${elonShadow}px ${elonShadow}px ${elonShadow}px rgba(0,0,0,0.8))`,
             willChange: 'transform, filter'
           }}>
             <Img src={staticFile('images/episode4/scene-4/Elon-mask-paper-cutout-asset.png')} style={{ width: '100%', objectFit: 'contain' }} />
             
             {/* Masking Tape 1 (Top Left) - Smooth Reveal */}
             {frame >= TAPE1_FRAME && (
               <div style={{
                 position: 'absolute',
                 top: '18%', left: '15%',
                 width: '240px',
                 height: '60px',
                 clipPath: `inset(0px ${tape1Inset}px 0px 0px)`, // GPU-accelerated wipe using exact pixels
                 transform: 'rotateZ(-25deg) translateZ(0)', // Force dedicated GPU layer
                 transformOrigin: 'left center',
                 zIndex: 10,
                 willChange: 'clip-path'
               }}>
                 <div style={{
                   width: '100%', height: '100%',
                   backgroundColor: 'rgba(216, 211, 196, 0.95)',
                   clipPath: 'polygon(2% 0, 98% 3%, 96% 100%, 0 95%)',
                 }} />
               </div>
             )}

             {/* Masking Tape 2 (Bottom Right) - Smooth Reveal */}
             {frame >= TAPE2_FRAME && (
               <div style={{
                 position: 'absolute',
                 top: '75%', left: '72%', // Switched to top/left to fix Chromium bottom/right subpixel jitter
                 width: '200px',
                 height: '50px',
                 clipPath: `inset(0px 0px 0px ${tape2Inset}px)`, // GPU-accelerated wipe using exact pixels
                 transform: 'rotateZ(-18deg) translateZ(0)', // Force dedicated GPU layer
                 transformOrigin: 'right center', 
                 zIndex: 10,
                 willChange: 'clip-path'
               }}>
                 <div style={{
                   width: '100%', height: '100%',
                   backgroundColor: 'rgba(216, 211, 196, 0.95)',
                   clipPath: 'polygon(0 3%, 97% 0, 100% 98%, 4% 97%)',
                 }} />
               </div>
             )}

             {/* Typewriter Text on Blank Paper Rectangle */}
             {frame >= AI_TEXT_FRAME && (
               <div style={{
                 position: 'absolute',
                 top: '14%', 
                 left: '23%', // Touched very slightly to the left (halfway)
                 width: '490px', // Proportionally scaled up to match the 920px Elon image
                 whiteSpace: 'nowrap', 
                 fontFamily: "'Cairo', sans-serif",
                 fontSize: '28px', // Proportionally scaled up
                 fontWeight: 900,
                 color: '#111', 
                 transform: 'rotateZ(-2deg) translateZ(0)', // Forced GPU layer to completely prevent text layout jitter
                 direction: 'rtl',
                 textShadow: '1px 1px 2px rgba(0,0,0,0.2)', 
               }}>
                 {visibleAiText}
               </div>
             )}

             {/* Transient Impact Snap */}
             {elonImpactRGB > 0 && (
               <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', transform: `translateX(${elonImpactRGB}px)` }}>
                 <Img src={staticFile('images/episode4/scene-4/Elon-mask-paper-cutout-asset.png')} style={{ width: '100%', objectFit: 'contain', filter: 'sepia(1) hue-rotate(180deg) saturate(300%)' }} />
               </div>
             )}
           </div>
         )}

         {/* 2. VIVA TECH PARIS 2024 (Arabic Typography) */}
         {frame >= RED_TAG_FRAME && (
           <div style={{
             position: 'absolute',
             top: '15%', right: '15%', // Lifted upwards to improve compositional balance
             display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
             fontFamily: "'Cairo', sans-serif",
             direction: 'rtl',
           }}>
             <div style={{
               backgroundColor: '#FF0055', // Project's signature War Room Red
               color: '#FFF',
               padding: '8px 20px', 
               fontSize: '45px', // Drastically smaller
               fontWeight: 900,
               boxShadow: '8px 8px 0px rgba(0,0,0,0.9)', 
               letterSpacing: '-2px',
               transform: `translateX(${text1X}px) scale(${text1Scale}) rotateZ(2deg)`,
               opacity: text1Opacity,
               willChange: 'transform, opacity'
             }}>
               فيفا تيك باريس
             </div>
             
             {frame >= WHITE_TAG_FRAME && (
               <div style={{
                 backgroundColor: '#FFF',
                 color: '#000',
                 padding: '5px 20px', 
                 fontSize: '65px', // Drastically smaller
                 fontWeight: 900,
                 marginTop: '5px',
                 boxShadow: '8px 8px 0px rgba(0,0,0,0.9)', 
                 alignSelf: 'flex-start',
                 letterSpacing: '-3px',
                 transform: `translateX(${text2X}px) scale(${text2Scale}) rotateZ(-1deg)`,
                 opacity: text2Opacity,
                 willChange: 'transform, opacity'
               }}>
                 2024
               </div>
             )}
           </div>
         )}

         {/* 2. CUBICLE */}
         {frame >= CUBICLE_DROP_FRAME && (
           <div style={{
             position: 'absolute',
             top: '55%', left: '8%', // Switched from bottom to top to prevent layout collapse
             width: '720px', // Scaled up for more presence
             height: '500px', // Scaled up proportionally to guarantee clip-path space
             // Beautiful, soft-edged radial gradient reveal instead of a sharp circle
             WebkitMaskImage: `radial-gradient(circle at 50% 50%, black ${cubicleRadius}%, transparent ${cubicleRadius + 20}%)`,
             maskImage: `radial-gradient(circle at 50% 50%, black ${cubicleRadius}%, transparent ${cubicleRadius + 20}%)`,
             willChange: 'mask-image, -webkit-mask-image',
             zIndex: 5,
           }}>
             <div style={{
               width: '100%', height: '100%',
               transform: `rotateZ(-6deg) translateZ(0)`, // Inner wrapper is completely static and cached to GPU
               filter: 'drop-shadow(8px 8px 12px rgba(0,0,0,0.6))', // Static shadow calculated once
             }}>
               <Img src={staticFile('images/episode4/scene-4/cubicle office-asset.png')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
             </div>
           </div>
         )}

         {/* 3. TERMINATION NOTICE (Pink Slip) */}
         {frame >= NOTICE_DROP_FRAME && (
           <div style={{
             position: 'absolute',
             top: '58%', left: '5%', // Pushed significantly further left
             width: '500px', // Scaled up to balance against the larger cubicle
             transform: `scale(${noticeScale}) rotateZ(${noticeRot}deg)`, // Pure Z-axis stamp (no Y translation)
             filter: `drop-shadow(${noticeShadow}px ${noticeShadow}px ${noticeShadow}px rgba(0,0,0,0.8))`,
             willChange: 'transform, filter',
             zIndex: 6, 
           }}>
             <Img src={staticFile('images/episode4/scene-4/termination-notice-asset.png')} style={{ width: '100%', objectFit: 'contain' }} />
             
             {/* Transient Impact Snap */}
             {noticeImpactRGB < 0 && (
               <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', transform: `translateX(${noticeImpactRGB}px)` }}>
                 <Img src={staticFile('images/episode4/scene-4/termination-notice-asset.png')} style={{ width: '100%', objectFit: 'contain', filter: 'sepia(1) hue-rotate(300deg) saturate(10) blur(2px)', opacity: 0.7 }} />
               </div>
             )}
           </div>
         )}

         {/* 4. BURNED MONEY -> $250B MORPH */}
         {frame >= MONEY_DROP_FRAME && (
           <div style={{
             position: 'absolute',
             bottom: '5%', right: '2%', // Original bottom-right quadrant
             width: '720px', height: '280px', // Tightened height so the text fits proportionally
             // Slides in initially, then floats diagonally to the center (moneyCenter), while growing (moneyScaleUp)
             transform: `translateX(${moneyX + moneyCenterX}px) translateY(${moneyCenterY}px) rotateZ(${moneyRot + (frame * 0.001)}deg) scale(${moneyScaleUp})`,
             willChange: 'transform',
             zIndex: 7, // Elevate above everything during the center float
             perspective: '1500px', // Crucial for the 3D flip
             backfaceVisibility: 'hidden', // Prevent jitter on settle
             transformStyle: 'preserve-3d',
           }}>
             <div style={{
               width: '100%', height: '100%', position: 'relative',
               transform: `rotateY(${moneyFlipY}deg)`,
               transformStyle: 'preserve-3d', // Maintains the 3D space for the flip
             }}>
               {/* FRONT FACE: The Burned Money & Red Strike */}
               <div style={{
                 position: 'absolute', inset: 0,
                 backfaceVisibility: 'hidden',
                 filter: `drop-shadow(25px 25px 35px rgba(0,0,0,0.8))`, // High z-index (7) means deeper physical shadow
               }}>
                 <Img src={staticFile('images/episode4/scene-4/dollar-bill-asset.png')} style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.25)' }} />
                 {/* Violent Red Marker Strike */}
                 {frame >= MARKER_STRIKE_FRAME && (
                   <div style={{
                     position: 'absolute',
                     top: '48%', left: '5%', 
                     width: `${markerWidth}%`, height: '25px', 
                     backgroundColor: '#d62828', transform: 'rotateZ(-6deg)', 
                     borderRadius: '10px', boxShadow: '0 0 12px rgba(214, 40, 40, 0.6)', 
                   }} />
                 )}
               </div>

               {/* BACK FACE: The $250 Billion Data Core */}
               <div style={{
                 position: 'absolute', inset: 0,
                 backfaceVisibility: 'hidden',
                 transform: 'rotateY(180deg)', // So it is readable when flipped
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 backgroundColor: 'rgba(17, 17, 17, 0.95)', // Dark paper background
                 border: '8px solid #FF0055', // Harsh red accent border
                 padding: '20px',
                 boxShadow: 'inset 0 0 50px rgba(255, 0, 85, 0.3), 25px 25px 35px rgba(0,0,0,0.8)' // Matches front face shadow
               }}>
                 <h1 style={{
                   fontFamily: "'Cairo', sans-serif", fontSize: '60px', fontWeight: 900,
                   color: '#FFF', margin: 0, 
                   display: 'flex', // Ensures spans sit perfectly next to each other
                 }}>
                   {"$250,000,000,000".split('').map((char, i) => {
                     // Stagger each character by 2 frames
                     const charStartFrame = textRevealStart + (i * 2);
                     
                     // Each character scales from 0 to 1.3 (pop) down to 1
                     const charScale = interpolate(frame, [charStartFrame, charStartFrame + 6, charStartFrame + 15], [0, 1.3, 1], {
                       extrapolateLeft: 'clamp',
                       extrapolateRight: 'clamp',
                       easing: Easing.out(Easing.quad)
                     });
                     
                     // Each character flashes subtle gold then settles
                     const charGlowRadius = interpolate(frame, [charStartFrame, charStartFrame + 6, charStartFrame + 15], [0, 40, 10], {
                       extrapolateLeft: 'clamp',
                       extrapolateRight: 'clamp',
                       easing: Easing.out(Easing.quad)
                     });
                     
                     const charGlowOpacity = interpolate(frame, [charStartFrame, charStartFrame + 6, charStartFrame + 15], [0, 1, 0.4], {
                       extrapolateLeft: 'clamp',
                       extrapolateRight: 'clamp',
                       easing: Easing.out(Easing.quad)
                     });

                     return (
                       <span key={i} style={{
                         display: 'inline-block', // Crucial to allow transform scaling
                         transform: `scale(${charScale})`,
                         willChange: 'transform, text-shadow',
                         textShadow: `0 0 ${charGlowRadius}px rgba(255, 215, 0, ${charGlowOpacity}), 0 0 5px rgba(255,255,255,0.3)`
                       }}>
                         {char}
                       </span>
                     );
                   })}
                 </h1>
               </div>
             </div>
           </div>
         )}

         {/* 5. FIRED WORKERS SLIDE REVEAL */}
         {frame >= WORKERS_DROP_FRAME && (
           <div style={{
             position: 'absolute',
             bottom: '5%', right: '5%', // Final resting place
             width: '900px', // Scaled up to truly anchor the right side of the board
             transform: `translateX(${workersX}px) translateY(${workersY}px) scale(${workersScale}) rotateZ(${workersRot + (frame * 0.001)}deg)`,
             filter: `drop-shadow(35px 35px 40px rgba(0,0,0,0.9))`, // Highest z-index (10) casts the most massive shadow
             willChange: 'transform',
             zIndex: 10, // Forces the workers to slide OVER the $250B container (which is zIndex 7)
             backfaceVisibility: 'hidden', // Prevent layout snapping jitter
             transformStyle: 'preserve-3d',
           }}>
             <Img src={staticFile('images/episode4/scene-4/laidoff-workers-asset.png')} style={{ width: '100%', objectFit: 'contain' }} />
             
             {/* 6. RED QUESTION MARK SLAM */}
             {frame >= Q_MARK_FRAME && (
               <div style={{
                 position: 'absolute',
                 top: '10%', left: '45.5%', // Sub-percent micro-adjustment
                 transform: `scale(${qMarkScale}) rotateZ(${qMarkRot + (frame * 0.001)}deg)`,
                 transformOrigin: 'center center',
                 filter: `drop-shadow(15px 15px 20px rgba(0,0,0,0.9))`, // Tight, harsh stamp shadow
                 zIndex: 8,
               }}>
                 <h1 style={{
                   fontFamily: "'Cairo', sans-serif", fontSize: '300px', fontWeight: 900,
                   color: '#FF0055', margin: 0, lineHeight: 1, textShadow: '4px 4px 0 #FFF'
                 }}>
                   ؟
                 </h1>
               </div>
             )}
           </div>
         )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Scene4Background: React.FC<{ startFrame: number; takeoverFrame: number }> = ({ startFrame, takeoverFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - startFrame);

  // Toxic Industrial Yellow transition:
  // Starts transitioning as she speaks (over 60 frames)
  const yellowOpacity = interpolate(localFrame, [0, 60], [0, 0.45], { extrapolateRight: 'clamp' });
  const yellowBlur = interpolate(localFrame, [0, 60], [20, 10], { extrapolateRight: 'clamp' }); // Sharpen slightly to reveal the gritty details

  // ── 3D FAKE ONER PARALLAX ENGINE (SYNCED PHYSICS) ──
  // We must perfectly mirror the exact spring physics of the CRTPaperEngine to synchronize.
  
  // Phase 1: The Pull-Out (Starts at local frame 20 / global 750)
  const snapOutSpring = spring({
    frame: Math.max(0, frame - 20),
    fps: 30,
    config: { damping: 24, stiffness: 70 } // Exact match to HUD shrink
  });

  // Phase 2: The Ambient Breathe (Continuous Camera Drift)
  // Increased the magnitude so the breathing is clearly perceptible during the long hold.
  const ambientScale = interpolate(frame, [0, 1000], [0, 0.15]); // Noticeable continuous push
  const ambientX = interpolate(frame, [0, 1000], [0, -35]); // Noticeable continuous pan

  // Phase 3: The Takeover (Starts at local frame 235 / global 965)
  const takeoverSpring = spring({
    frame: Math.max(0, frame - 235), // 965 - 730
    fps: 30,
    config: { damping: 40, stiffness: 30 } // Exact match to HUD takeover
  });

  // Physics Mappings
  const pullOutScale = interpolate(snapOutSpring, [0, 1], [1.15, 1]);
  const pullOutY = interpolate(snapOutSpring, [0, 1], [40, 0]);

  const pushInScaleAdd = interpolate(takeoverSpring, [0, 1], [0, 0.25]);
  const pushInX = interpolate(takeoverSpring, [0, 1], [0, -80]);

  // Mathematical synthesis of the full 3D timeline (including ambient drift)
  const finalScale = pullOutScale + pushInScaleAdd + ambientScale;
  const finalX = pushInX + ambientX;

  return (
    <AbsoluteFill style={{ 
      backgroundColor: '#020202',
      transform: `scale(${finalScale}) translateX(${finalX}px) translateY(${pullOutY}px)`,
      transformOrigin: '75% center', // Anchor focus on the HUD side
      willChange: 'transform'
    }}>
      {/* Harfen Studio Background (Transitions to Industrial Yellow) */}
      <Img 
        src={staticFile('images/episode4/harfen-studio.jpeg')} 
        style={{ 
          width: '100%', height: '100%', objectFit: 'cover', 
          filter: `blur(${yellowBlur}px) grayscale(0.5) sepia(0.4) contrast(1.3) brightness(0.9)` 
        }} 
      />
      
      {/* ── TOXIC INDUSTRIAL YELLOW AMBIENT ENGINE ── */}
      <div style={{
        position: 'absolute', inset: 0, 
        backgroundColor: '#FFCC00', 
        mixBlendMode: 'color', 
        opacity: yellowOpacity,
        transition: 'opacity 0.2s'
      }} />
      <div style={{
        position: 'absolute', inset: 0, 
        backgroundColor: '#FF5500', // Deep nuclear orange edge
        mixBlendMode: 'multiply', 
        opacity: yellowOpacity * 0.5,
      }} />

      {/* Dark vignette to make the HUD and Mariya pop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.8) 100%)'
      }} />
    </AbsoluteFill>
  );
};

// ── KINETIC TYPOGRAPHY ENGINE (Alternative 1: Hollywood Location Stamp) ──
const KineticTypography: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const text = "الطاقة اللانهائية الى متى ؟!";
  
  // Rhythmic mechanical typewriter (Right-to-Left Arabic)
  const charsToShow = Math.max(0, Math.floor((frame - startFrame) / 2.5));
  const visibleText = text.slice(0, charsToShow);
  const isTyping = charsToShow < text.length && frame >= startFrame;
  const showCursor = isTyping || (frame >= startFrame && frame % 15 < 7);
  
  // Aggressive Glitch on impact
  const rgbGlitch = isTyping && frame % 3 === 0 ? 15 : 0;

  if (frame < startFrame) return null;

  return (
    <AbsoluteFill style={{ 
      zIndex: 30, // Raised above Mariya (20) to guarantee it never clips behind her invisible bounding box
      pointerEvents: 'none'
    }}>
       <h1 style={{
          position: 'absolute',
          right: '120px', // Pinned strictly to the right edge (the empty canvas)
          top: '15%', // Brought much higher up on the screen
          width: '600px', // Balanced for two lines
          fontFamily: "'Cairo', sans-serif",
          fontSize: '100px', // Middle ground between 80px and 130px
          fontWeight: 900,
          color: '#FFCC00', // Toxic Yellow match
          textShadow: `
            6px 6px 0px rgba(0,0,0,1),
            10px 10px 0px rgba(0,0,0,0.8),
            -2px -2px 0px rgba(0,0,0,1),
            0 0 60px rgba(255,204,0,0.5),
            0 0 120px rgba(0,0,0,0.9)
          `, // Heavy multi-layered drop shadow to punch out maximum contrast against the bright generators
          direction: 'rtl',
          textAlign: 'right', // Forces Arabic right alignment from the pinned right edge
          lineHeight: 1.2,
          mixBlendMode: 'screen',
          transform: `translateX(${rgbGlitch}px)`,
          filter: rgbGlitch > 0 ? `drop-shadow(-${rgbGlitch * 2}px 0 0 rgba(255,0,85,0.9))` : 'none'
       }}>
         {visibleText}<span style={{ color: '#FF0055' }}>{showCursor ? '█' : ''}</span>
       </h1>
    </AbsoluteFill>
  );
};

const Scene4Mariya: React.FC = () => {
  const frame = useCurrentFrame();
  
  // ── FAKE-ONER SNAP OUT (CAMERA PULL-BACK) ──
  // The camera pulls backward out of the CRT monitor, passing Mariya to reveal her in the room.
  // We use the exact same spring config as the HUD shrink to keep her locked in 3D space.
  const pullOutSpring = spring({
    frame: frame, // Mounted at 750, so frame 0 is exactly when the pull-out begins
    fps: 30,
    config: { damping: 24, stiffness: 70 } 
  });

  const mariyaScale = interpolate(pullOutSpring, [0, 1], [3, 1]); // Passes from behind the lens to normal size
  const mariyaY = interpolate(pullOutSpring, [0, 1], [400, 0]); // Slides down from the top edge of the lens
  const mariyaOpacity = interpolate(pullOutSpring, [0, 0.15], [0, 1], { extrapolateRight: 'clamp' }); // Instant fade to hide raw edge
  const mariyaBlur = interpolate(pullOutSpring, [0, 0.8, 1], [6, 0, 0], { extrapolateRight: 'clamp' }); // Base motion blur
  
  // Fake Directional & Lens Distortion Blur
  const mariyaStretchY = interpolate(pullOutSpring, [0, 0.8, 1], [1.15, 1, 1], { extrapolateRight: 'clamp' }); // Vertical speed stretch
  const lensDistortion = interpolate(pullOutSpring, [0, 0.8, 1], [15, 0, 0], { extrapolateRight: 'clamp' }); // RGB chromatic trailing

  // ── POSE PROGRESSION & STATIC ANCHORS ──
  // Since she mounts 15 frames early (750) to execute the camera pull-out, 
  // we offset her internal audio timing so her cuts still perfectly sync to her voice at 765.
  const audioFrame = Math.max(0, frame - 15);
  
  let poseIndex = 1;
  let staticX = 250; // Pose 1: Anchored slightly to the right

  if (audioFrame > 90) {
    poseIndex = 2; // at 3 seconds
    staticX = 0; // Pose 2: Anchored to the middle
  }
  
  if (audioFrame > 231) { // Shifted another 5 frames earlier for perfect voice sync
    poseIndex = 1; // Back to pose 1 for more dynamism
    staticX = 0; // Anchored at the exact same position as pose 2
  }

  if (audioFrame > 325) { // 01:55.29
    poseIndex = 3; 
    staticX = -250; // Pose 3: Anchored to the left
  }

  // ── BURST STOP MOTION ENGINE (caX) ──
  // Matching Scene 1 exactly: 4 frame window, smooth sine wave at 45 multiplier.
  const mariyaCuts = [91, 232, 326]; // The exact audioFrame the pose changes
  const isCutBurst = mariyaCuts.some(c => audioFrame - c >= 0 && audioFrame - c < 4);
  const mariyaCaX = isCutBurst ? Math.sin(audioFrame * 45) * 80 : 0;
  
  const currentMariyaPoseImg = staticFile(`images/episode4/scene-4/mariya-pose${poseIndex}-scene4.png`);

  return (
    <AbsoluteFill style={{ zIndex: 20 }}> {/* Forces Mariya IN FRONT of the HUD */}
      {/* Mariya (Foreground) at true 1:1 scale */}
      <div style={{ 
        position: 'absolute', width: 1920, height: 1080, left: '50%', top: '50%', marginLeft: -960, marginTop: -540, 
        transform: `translateX(${staticX}px) translateY(${mariyaY}px) scaleX(${mariyaScale}) scaleY(${mariyaScale * mariyaStretchY})`,
        opacity: mariyaOpacity,
        filter: `blur(${mariyaBlur}px) drop-shadow(0px ${lensDistortion}px 0px rgba(255,0,0,0.5)) drop-shadow(0px ${-lensDistortion}px 0px rgba(0,255,255,0.5))`,
        willChange: 'transform, filter'
      }}>
         {/* 
           PRELOAD FIX: 
           We render all 3 poses simultaneously and toggle opacity. 
           If we just change the 'src', the browser takes a few frames to decode the new PNG, 
           meaning the image is BLANK during the exact 5 frames the glitch is supposed to fire!
         */}
         <img src={staticFile(`images/episode4/scene-4/mariya-pose1-scene4.png`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center', opacity: poseIndex === 1 ? 1 : 0, filter: 'drop-shadow(20px 20px 30px rgba(0,0,0,0.8))' }} />
         <img src={staticFile(`images/episode4/scene-4/mariya-pose2-scene4.png`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center', opacity: poseIndex === 2 ? 1 : 0, filter: 'drop-shadow(20px 20px 30px rgba(0,0,0,0.8))' }} />
         <img src={staticFile(`images/episode4/scene-4/mariya-pose3-scene4.png`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center', opacity: poseIndex === 3 ? 1 : 0, filter: 'drop-shadow(20px 20px 30px rgba(0,0,0,0.8))' }} />

         {/* Official Signature Stop-Motion RGB Glitch Component */}
         {mariyaCaX !== 0 && poseIndex === 1 && <CharacterCA3D imgSrc={staticFile('images/episode4/scene-4/mariya-pose1-scene4.png')} caX={mariyaCaX} />}
         {mariyaCaX !== 0 && poseIndex === 2 && <CharacterCA3D imgSrc={staticFile('images/episode4/scene-4/mariya-pose2-scene4.png')} caX={mariyaCaX} />}
         {mariyaCaX !== 0 && poseIndex === 3 && <CharacterCA3D imgSrc={staticFile('images/episode4/scene-4/mariya-pose3-scene4.png')} caX={mariyaCaX} />}
      </div>
      
    </AbsoluteFill>
  );
};

// ── CINEMATIC WHITE FUMES TRANSITION (SUBCONSCIOUS BUILD-UP) ──
// Generates a barely perceptible volumetric steam that rolls over the lens in the final frames.
const WhiteFumesTransition: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Master opacity fade in - drastically reduced to be a subconscious implication (max 15%)
  const opacity = interpolate(frame, [0, 30], [0, 0.15], { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease) });
  
  // Independent Cloud Drift Physics
  const cloud1X = interpolate(frame, [0, 45], [0, -200]);
  const cloud1Y = interpolate(frame, [0, 45], [100, -150]);
  const cloud1Scale = interpolate(frame, [0, 45], [1, 1.5]);

  const cloud2X = interpolate(frame, [0, 45], [0, 200]);
  const cloud2Y = interpolate(frame, [0, 45], [200, -200]);
  const cloud2Scale = interpolate(frame, [0, 45], [1, 1.8]);

  const cloud3Y = interpolate(frame, [0, 45], [150, -300]);
  const cloud3Scale = interpolate(frame, [0, 45], [1, 2]);

  return (
    <AbsoluteFill style={{ 
      opacity,
      mixBlendMode: 'screen', // Blends naturally
      pointerEvents: 'none',
      zIndex: 1000, 
      filter: 'blur(60px)' // Extreme blur to make it atmospheric haze
    }}>
      {/* Cloud 1 (Left flank) */}
      <div style={{
        position: 'absolute', width: 1200, height: 1200, left: '-10%', top: '30%',
        transform: `translateX(${cloud1X}px) translateY(${cloud1Y}px) scale(${cloud1Scale})`,
        background: 'radial-gradient(circle, rgba(200,220,255,0.3) 0%, transparent 65%)',
        borderRadius: '50%',
        willChange: 'transform'
      }} />

      {/* Cloud 2 (Right flank) */}
      <div style={{
        position: 'absolute', width: 1400, height: 1400, left: '40%', top: '40%',
        transform: `translateX(${cloud2X}px) translateY(${cloud2Y}px) scale(${cloud2Scale})`,
        background: 'radial-gradient(circle, rgba(230,240,255,0.35) 0%, transparent 70%)',
        borderRadius: '50%',
        willChange: 'transform'
      }} />

      {/* Cloud 3 (Center blowout) */}
      <div style={{
        position: 'absolute', width: 1600, height: 1600, left: '10%', top: '50%',
        transform: `translateY(${cloud3Y}px) scale(${cloud3Scale})`,
        background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 75%)',
        borderRadius: '50%',
        willChange: 'transform'
      }} />
    </AbsoluteFill>
  );
};

export const Scene4: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={AUDIO1_DELAY} durationInFrames={AUDIO1_DURATION}>
        <Audio src={staticFile('audio/episode4/scene4/mazen-scene4-audio1.mp3')} />
      </Sequence>
      
      <Sequence from={AUDIO1_DELAY + AUDIO1_DURATION} durationInFrames={AUDIO2_DURATION}>
        <Audio src={staticFile('audio/episode4/scene4/mazen-scene4-audio2.mp3')} />
      </Sequence>
      
      <Sequence from={AUDIO1_DELAY + AUDIO1_DURATION + AUDIO2_DURATION} durationInFrames={AUDIO3_DURATION}>
        <Audio src={staticFile('audio/episode4/scene4/mariya-scene4-audio1.mp3')} />
      </Sequence>

      {/* LAYER 1: Background Studio (Mounts exactly as the HUD snaps out at frame 730) */}
      <Sequence from={730} durationInFrames={AUDIO3_DURATION + 35 + 45 + 30}>
        <Scene4Background 
          startFrame={AUDIO1_DELAY + AUDIO1_DURATION + AUDIO2_DURATION - 730} 
          takeoverFrame={965 - 730} // HUD takeover is at 965 in absolute Scene4 time
        />
      </Sequence>

      {/* LAYER 2: The Evidence board (Starts full screen, shrinks into the HUD) */}
      <Sequence from={0} durationInFrames={AUDIO1_DELAY + AUDIO1_DURATION + AUDIO2_DURATION + AUDIO3_DURATION + 45 + 30}>
        <CRTPaperEngine />
      </Sequence>
      
      {/* LAYER 3: Kinetic Typography Background (Starts typing exactly at 01:54:08) */}
      <Sequence from={0} durationInFrames={1500}>
        <KineticTypography startFrame={1040} />
      </Sequence>

      {/* LAYER 4: Mariya Foreground (Revealed perfectly as the camera snaps out of the CRT) */}
      <Sequence from={750} durationInFrames={AUDIO3_DURATION + 45 + 15 + 30}>
        <Scene4Mariya />
      </Sequence>

      {/* LAYER 5: The White Fumes Cinematic Transition */}
      {/* Rolls over the lens during the exact 30-frame buffer before the transition to Scene 5 at 01:56.26 (local frame 1148) */}
      <Sequence from={1148 - 30} durationInFrames={30}>
        <WhiteFumesTransition />
      </Sequence>

      {/* ── CHYRON BANNER (01:20.20) ── */}
      {/* 01:20.20 = 2420 global frames. Scene 4 starts at 2388. So local frame = 32. Exits after 2.0s (60 frames) = 92 */}
      <NewsChyron 
        label="أزمة طاقة عالمية" 
        source="تقرير استهلاك الذكاء الاصطناعي" 
        delayFrames={32} 
        exitFrame={92} 
        isMaskRTL={true} 
      />

    </AbsoluteFill>
  );
};
