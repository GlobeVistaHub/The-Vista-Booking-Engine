import React from 'react';
import {
  AbsoluteFill, staticFile, Video,
  interpolate, useCurrentFrame, Easing, spring, Img
} from 'remotion';
import { AnamorphicWhipPan } from '../Episode3/AnamorphicWhipPan';
import { NewsChyron } from '../Episode3/TheHook';

const CYAN = "#00E5CC";
const RED = "#FF3333";

const SecurityCameraOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  const rawText = "تسجيل // تسريب_٠٤.MP4";
  const isBlink = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 50, fontFamily: "'Cairo', sans-serif", color: CYAN, padding: 60 }}>
      <div style={{ position: 'absolute', top: 60, left: 60, fontSize: 32, fontWeight: 'bold', textShadow: `0 0 20px ${CYAN}` }}>
        <div>{rawText}<span style={{ opacity: isBlink ? 1 : 0 }}>_</span></div>
        <div style={{ color: RED, marginTop: 12, opacity: isBlink ? 1 : 0.4, textShadow: `0 0 20px ${RED}` }}>كاميرا المراقبة - غير متصلة</div>
      </div>

      <div style={{ position: 'absolute', top: 60, right: 60, textAlign: 'right', fontSize: 32, fontWeight: 'bold', textShadow: `0 0 20px ${CYAN}` }}>
        <div>التاريخ: ١٠ أغسطس ٢٠٢٦</div>
        <div style={{ opacity: 0.7 }}>النظام: <span style={{ color: frame % 10 < 5 ? RED : CYAN }}>غير مستقر</span></div>
      </div>

      {/* 3rd Security Shot Target Lock */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', marginLeft: -150, marginTop: -150,
        width: 300, height: 300, border: `3px solid ${CYAN}`, borderRadius: '50%',
        borderStyle: 'dashed',
        transform: `rotate(${frame * 2}deg)`,
        opacity: 0.5,
        boxShadow: `0 0 40px ${CYAN}, inset 0 0 40px ${CYAN}`
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%', marginLeft: -250, marginTop: -2,
        width: 500, height: 4, backgroundColor: CYAN, opacity: 0.3
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%', marginLeft: -2, marginTop: -250,
        width: 4, height: 500, backgroundColor: CYAN, opacity: 0.3
      }} />

      {/* Dynamic Data Dump */}
      <div style={{
        position: 'absolute', top: '55%', left: '55%', fontSize: 32, backgroundColor: 'rgba(0, 10, 15, 0.85)',
        padding: '20px 30px', borderLeft: `6px solid ${RED}`, boxShadow: `0 0 30px rgba(255,0,0,0.4)`
      }}>
        <div style={{ color: '#FFF', fontWeight: 'bold' }}>الهدف: لقطة_أمنية_٣</div>
        <div style={{ color: RED, marginTop: 12, marginBottom: 12, fontWeight: 'bold' }}>
          تم اختراق النظام <span style={{ opacity: isBlink ? 1 : 0 }}>!</span>
        </div>
        <div style={{ fontWeight: 'bold', color: CYAN }}>
          {Math.floor(frame * 1.345 + 500)} ميجا/ث - جاري التفريغ {frame % 20 < 10 ? '...' : '..'}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── TARGET LOCK HUD COMPONENT ──
const TargetLock: React.FC<{
    frame: number; startFrame: number; 
    left: string; top: string; 
    name: string; title: string; 
    isGlitch?: boolean;
    flipText?: boolean;
}> = ({ frame, startFrame, left, top, name, title, isGlitch = false, flipText = false }) => {
    if (frame < startFrame) return null;
    
    const localFrame = frame - startFrame;
    const lockSpring = spring({ frame: localFrame, fps: 30, config: { damping: 14, stiffness: 350 } });
    const scale = interpolate(lockSpring, [0, 1], [3, 1]);
    const opacity = interpolate(lockSpring, [0, 0.5, 1], [0, 1, 1]);
    
    const color = isGlitch ? '#FF0055' : '#00E5CC'; // Cyan or Glitch Red
    const boxSize = 140;

    const charsToRevealName = Math.max(0, Math.floor((localFrame - 4) * 6));
    const charsToRevealTitle = Math.max(0, Math.floor((localFrame - 7) * 6));

    return (
        <div style={{
            position: 'absolute', left, top, width: boxSize, height: boxSize,
            transform: `translate(-50%, -50%) scale(${scale})`, opacity,
            pointerEvents: 'none', zIndex: 300,
            filter: `drop-shadow(0 0 10px ${color})`
        }}>
            {/* 4 Corners */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: 30, height: 30, borderTop: `4px solid ${color}`, borderLeft: `4px solid ${color}` }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: 30, height: 30, borderTop: `4px solid ${color}`, borderRight: `4px solid ${color}` }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 30, height: 30, borderBottom: `4px solid ${color}`, borderLeft: `4px solid ${color}` }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderBottom: `4px solid ${color}`, borderRight: `4px solid ${color}` }} />

            {/* Crosshair */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 10, height: 10, backgroundColor: color, transform: 'translate(-50%, -50%)', borderRadius: '50%' }} />

            {/* Tracking Line & Text */}
            <div style={{ 
                position: 'absolute', 
                ...(flipText ? { right: boxSize } : { left: boxSize }), 
                top: '50%', 
                display: 'flex', 
                alignItems: 'center',
                flexDirection: flipText ? 'row-reverse' : 'row'
            }}>
                <div style={{ width: Math.min(60, localFrame * 5), height: 2, backgroundColor: color }} />
                
                <div style={{ 
                    display: 'flex', flexDirection: 'column', 
                    marginLeft: flipText ? 0 : 15, marginRight: flipText ? 15 : 0, 
                    direction: 'rtl', textAlign: 'right', fontFamily: 'Tajawal, Cairo, monospace', whiteSpace: 'nowrap' 
                }}>
                    <div style={{ 
                        fontSize: 28, fontWeight: 900, color: '#FFF', 
                        textShadow: `0 2px 4px rgba(0,0,0,0.9), 0 0 15px ${color}, 0 0 30px ${color}`, 
                        backgroundColor: isGlitch ? 'rgba(40, 0, 10, 0.85)' : 'rgba(0, 10, 15, 0.85)', 
                        border: `1px solid ${color}`,
                        boxShadow: `0 0 20px rgba(0,0,0,0.9)`,
                        padding: '4px 12px', borderRadius: 4 
                    }}>
                        {name.substring(0, charsToRevealName)}
                        {charsToRevealName > 0 && charsToRevealName < name.length && <span style={{ backgroundColor: '#FFF', display: 'inline-block', width: 10, height: 24, marginLeft: 6, transform: 'translateY(4px)' }}/>}
                    </div>
                    <div style={{ 
                        fontSize: 24, fontWeight: 700, color: color, marginTop: 6, 
                        backgroundColor: isGlitch ? 'rgba(40, 0, 10, 0.85)' : 'rgba(0, 10, 15, 0.85)', 
                        border: `1px solid ${color}`,
                        boxShadow: `0 0 20px rgba(0,0,0,0.9)`,
                        padding: '4px 12px', borderRadius: 4, display: 'inline-block', 
                        alignSelf: flipText ? 'flex-end' : 'flex-start',
                        textShadow: `0 2px 4px rgba(0,0,0,0.9), 0 0 10px ${color}`
                    }}>
                        {title.substring(0, charsToRevealTitle)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Scene2Content: React.FC = () => {
  const frame = useCurrentFrame();
  const ORBIT_DUR = 120; // 4 seconds

  const pullProgress = interpolate(frame, [0, ORBIT_DUR], [0, 1], { easing: Easing.bezier(0.25, 0.1, 0.25, 1) });

  // Velocity curve (peaks at 1 in the exact middle of the movement, drops to 0 at the end)
  const pullVelocity = Math.sin(pullProgress * Math.PI);

  // Scaled up the background (ends at 1.3x instead of 1.05x)
  const bgParallaxScale = interpolate(pullProgress, [0, 1], [4.0, 1.3]);

  // Moved it a bit more left while Mazen enters (Sweeps from 400 down to -100)
  const bgX = interpolate(pullProgress, [0, 1], [400, -100]);

  // Re-applied a *reasonable* cinematic motion blur. 
  // It peaks at a subtle 8px during the fastest part of the pull, then rests at exactly 4px.
  const bgMotionBlur = interpolate(pullVelocity, [0, 1], [4, 8]);

  // ── MAZEN STOP MOTION ENGINE ──
  const presenterOpacity = 1;
  const presenterScale = interpolate(pullProgress, [0, 1], [1.25, 1.15]);

  const presenterSlideProgress = interpolate(frame, [20, ORBIT_DUR], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.25, 0.1, 0.25, 1)
  });
  const presenterX = interpolate(presenterSlideProgress, [0, 1], [400, 0]);

  const F_MAZEN_SHIFT = 110;
  const F_SLAM = 48; // Exact match for 00:25.18 for the pose cut (Pose 4)
  const F_RELEASE = 73; // Shifted 20 frames earlier
  const F_DIVE = 105; // Exact match for 00:27.15 for the cinematic zoom
  const DIVE_DUR = 20; // 20 frame lightning-fast cinematic dive

  const isSlam = frame >= F_SLAM && frame < F_RELEASE;
  const isRelease = frame >= F_RELEASE;
  const isZoomedFraming = frame >= F_SLAM; // Both 4 and 3 use the zoomed-in framing coordinates

  // Fast typing stop-motion loop (swaps every 4 frames)
  const typingPoses = [
    'mazen-pose2 office-scene2-desk cleaned.png',
    'mazen-pose2a office-scene2-desk cleaned.png',
    'mazen-pose2b office-scene2-desk cleaned.png'
  ];
  const typingIndex = Math.floor((frame % 12) / 4);
  const currentTypingImage = typingPoses[typingIndex];

  const currentMazenImg = isSlam ? 'mazen-pose4 office-scene2-desk cleaned.png' // 4 is the heavy ENTER press
      : isRelease ? 'mazen-pose3 office-scene2-desk cleaned.png' // 3 is the dynamic release
      : currentTypingImage; // 2, 2a, 2b is the typing loop

  // Restored the massive scale and the stable position.
  const crtLeft = isZoomedFraming ? '76%' : '77%'; // Pushed strictly horizontally left
  const crtTop = isZoomedFraming ? '4%' : '14%'; // Locked vertically
  const crtWidth = isZoomedFraming ? 860 : 800; // Restored massive size
  const crtHeight = isZoomedFraming ? 560 : 520;
  const crtRotZ = isZoomedFraming ? 10 : 14;

  const mazenCuts = [F_SLAM, F_RELEASE]; // Glitch precisely on both pose snaps
  const isMazenCut = mazenCuts.some(c => frame - c >= 0 && frame - c < 4);
  const mazenCaX = isMazenCut ? Math.sin(frame * 45) * 80 : 0;
  
  // ── THE HYPER-CRT DIVE TRANSITION ──
  // The camera violently pushes into the massive HyperCRT at frame 180.
  const diveProgress = interpolate(frame, [F_DIVE, F_DIVE + DIVE_DUR], [0, 1], { 
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', 
    easing: Easing.in(Easing.poly(4)) 
  });

  // ── HUD PERSPECTIVE COLLAPSE (The Seamless Cut) ──
  const hudScale = interpolate(pullProgress, [0, 0.5], [1.38, 0.75], { extrapolateRight: "clamp" });
  const hudX = interpolate(pullProgress, [0, 0.5], [0, -2000], { extrapolateRight: "clamp" });
  const hudRotY = interpolate(pullProgress, [0, 0.5], [0, 25], { extrapolateRight: "clamp" });

  const hudPaddingH = interpolate(frame, [0, 20], [0, 140], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const hudPaddingV = interpolate(frame, [0, 20], [0, 80], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const bezelOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const borderOpacity = interpolate(frame, [0, 20], [0, 0.6], { extrapolateRight: "clamp" });

  // ── THE CONTINUITY GLITCH ──
  const isGlitching = frame < 12;
  const glitchIntensity = interpolate(frame, [0, 12], [1, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const glitchJitterX = isGlitching ? Math.sin(frame * 45) * 40 * glitchIntensity : 0;
  const glitchJitterY = isGlitching ? Math.cos(frame * 30) * 20 * glitchIntensity : 0;

  // ── HOISTED WAR ROOM PHYSICS (Unified Background Engine) ──
  const F_WAR_ROOM_START = 539; 
  const warFrame = frame - F_WAR_ROOM_START;
  const F_SNAP = 130; 
  const F_PULLBACK = 147; 
  const F_HUD_COLLAPSE = 210; 
  
  const pullBackSpring = spring({ frame: Math.max(0, warFrame - F_PULLBACK), fps: 30, config: { damping: 14, stiffness: 120 } });
  const warMotionBlurVelocity = Math.sin(pullBackSpring * Math.PI);
  const warMotionBlur = interpolate(warMotionBlurVelocity, [0, 1], [4, 8]);
  
  const spatialTransition = spring({ frame: Math.max(0, warFrame - F_HUD_COLLAPSE), fps: 30, config: { damping: 14, stiffness: 120 } });
  const spatialVelocity = Math.sin(spatialTransition * Math.PI);
  const spatialBlur = interpolate(spatialVelocity, [0, 1], [0, 35]);

  const mazenFrame = warFrame - F_HUD_COLLAPSE;
  const postCollapseScale = interpolate(mazenFrame, [0, 60], [1.15, 1.10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  const warBgZScale = warFrame >= F_HUD_COLLAPSE 
      ? interpolate(spatialTransition, [0, 1], [1.3, postCollapseScale]) 
      : interpolate(pullBackSpring, [0, 1], [4.0, 1.3]);
      
  const warBgX = interpolate(pullBackSpring, [0, 1], [400, 0]); 

  // Merged unified physics
  const finalBgScale = warFrame >= 0 ? warBgZScale : bgParallaxScale;
  const finalBgX = warFrame >= 0 ? warBgX : bgX;
  const finalBlur = warFrame >= F_HUD_COLLAPSE ? 4 + spatialBlur : (warFrame >= 0 ? warMotionBlur : bgMotionBlur);

  // ── PHYSICAL SCENE TRANSITION (Whipping out the old CRT Desk as War Room whips in) ──
  const whipOutProgress = spring({ frame: Math.max(0, warFrame), fps: 30, config: { damping: 14, stiffness: 180 } });
  const whipOutX = interpolate(whipOutProgress, [0, 1], [0, -3000]);



  return (
    <AbsoluteFill style={{ backgroundColor: '#020202', overflow: 'hidden', perspective: 1200 }}>
        {/* BREAKING NEWS CHYRON (Beginning of Scene 2) */}
        <NewsChyron 
            label="العميل السري" 
            source="معامل ميتا" 
            delayFrames={43} 
            exitFrame={93} 
            isMaskRTL={true} 
        />

        {/* 1. UNIFIED STUDIO BG (Seamless physics across entire Scene 2 timeline) */}
        <AbsoluteFill style={{ transform: `scale(${finalBgScale}) translateX(${finalBgX}px) translateZ(0)`, transformOrigin: "51% 42%", willChange: "transform" }}>
          <img src={staticFile('images/episode4/harfen-studio.jpeg')}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              filter: `blur(${finalBlur}px) grayscale(0.5) sepia(0.4) contrast(1.3) brightness(0.9)`
            }} />

          {/* ══ THE STUDIO TONE ENGINE ══ */}
          {/* First part of Scene 2 (Red -> Cyan) */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: RED, mixBlendMode: 'multiply', opacity: interpolate(frame, [0, 45], [0.6, 0], { extrapolateRight: 'clamp' }) }} />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: CYAN, mixBlendMode: 'multiply', opacity: interpolate(frame, [30, 90], [0, 0.35], { extrapolateRight: 'clamp' }) }} />

          {/* War Room Tone Shift (Crossfades seamlessly to Cyan as the transition happens) */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: CYAN, mixBlendMode: 'multiply', opacity: interpolate(Math.max(0, warFrame), [0, 15], [0, 0.35], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 50%, rgba(0,5,15,0.6) 100%)', pointerEvents: 'none', opacity: interpolate(Math.max(0, warFrame), [0, 15], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) }} />

          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,229,204,0.1), transparent)' }} />
        </AbsoluteFill>

        {/* 2. THE HUD PROJECTOR (MORPHING FROM FULL SCREEN) */}
        {frame < F_WAR_ROOM_START + 30 && (
          <AbsoluteFill style={{
            zIndex: 5, display: 'flex', justifyContent: 'center', alignItems: 'center',
            transformStyle: 'preserve-3d',
            transform: `translateX(${whipOutX}px) translateX(${hudX + glitchJitterX}px) translateY(${glitchJitterY}px) scale(${hudScale}) rotateY(${hudRotY}deg) translateZ(0)`,
            willChange: "transform"
          }}>

          <div style={{
            width: 1400, height: 800,
            border: `2px solid rgba(0,229,204,${borderOpacity})`, borderRadius: 40,
            background: `rgba(0, 15, 25, ${bezelOpacity})`,
            overflow: 'hidden',
            padding: `${hudPaddingV}px ${hudPaddingH}px`,
            boxShadow: `0 0 150px rgba(0,229,204,${borderOpacity * 0.5})`,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 30,
            position: 'relative'
          }}>

            <div style={{ position: 'absolute', inset: 0, opacity: 1 }}>
              <Video src={staticFile('video/episode4/server-video-montage.mp4')} onError={(e) => console.log('Video ended')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <SecurityCameraOverlay />

            {/* ══ THE DIGITAL FLASH & SLICE GLITCH ══ */}
            <div style={{
              position: 'absolute', inset: 0, backgroundColor: '#FFF', mixBlendMode: 'overlay', zIndex: 70,
              opacity: interpolate(frame, [0, 2, 4, 8], [0.8, 0, 0.6, 0], { extrapolateRight: "clamp" }),
            }} />

            <div style={{
              position: 'absolute', inset: 0, backgroundColor: RED, mixBlendMode: 'screen', zIndex: 71,
              opacity: interpolate(frame, [0, 4, 10], [0.5, 0, 0], { extrapolateRight: "clamp" }),
            }} />

            {isGlitching && frame % 3 === 0 && (
              <div style={{
                position: 'absolute', left: 0, right: 0, top: `${Math.random() * 60 + 10}%`, height: `${Math.random() * 15 + 5}%`,
                backgroundColor: CYAN, mixBlendMode: 'difference', zIndex: 72,
                transform: `translateX(${Math.random() * 40 - 20}px)`
              }} />
            )}

            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
              mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 60, opacity: bezelOpacity
            }} />
          </div>
        </AbsoluteFill>
        )}

        {/* ══ THE PHYSICAL HYPER-CRT ON THE DESK ══ */}
        {frame < F_WAR_ROOM_START + 30 && (
        <AbsoluteFill style={{ zIndex: 12, transform: `translateX(${whipOutX}px) translateX(${presenterX}px) scale(${presenterScale}) translateZ(0)`, transformOrigin: "center center", willChange: "transform", pointerEvents: "none", transformStyle: 'preserve-3d' }}>
          <div style={{ position: 'absolute', top: crtTop, left: crtLeft, 
                        // Restored the Analogue Transition! (Skew + Contrast + Hue Shift)
                        transform: `translate(-50%, -50%) translateX(${interpolate(diveProgress, [0, 1], [0, -350])}px) translateY(${interpolate(diveProgress, [0, 1], [0, 180])}px) scale(${interpolate(diveProgress, [0, 1], [1, 3.5])}) rotateY(${interpolate(diveProgress, [0, 1], [-20, 0])}deg) rotateZ(${interpolate(diveProgress, [0, 1], [crtRotZ, 0])}deg) skewX(${interpolate(diveProgress, [0, 0.5, 1], [0, -15, 0])}deg) translateZ(0px)`, 
                        filter: `contrast(${interpolate(diveProgress, [0, 0.5, 1], [1, 1.8, 1])}) brightness(${interpolate(diveProgress, [0, 0.5, 1], [1, 1.5, 1])}) hue-rotate(${interpolate(diveProgress, [0, 0.5, 1], [0, -45, 0])}deg)`,
                        width: crtWidth, height: crtHeight, display: 'flex', justifyContent: 'center', alignItems: 'center',
                        willChange: 'transform', transformStyle: 'preserve-3d' }}>
            
            <div style={{ width: '100%', height: '100%',
                 backgroundColor: '#030705',
                 borderRadius: '8% / 12%', // Authentic CRT Tube geometry
                 boxShadow: `inset 0 0 80px rgba(0,229,204,0.15), -10px 15px 20px rgba(0,0,0, 0.6)`, // Softer physical ambient occlusion on the desk
                 border: '24px solid #0a0a0a', borderBottomWidth: '60px', // Massive industrial hardware bezels
                 borderRightColor: '#111', borderLeftColor: '#050505', // Hardware lighting
                 overflow: 'hidden', position: 'relative' }}>
                 
                 {/* Inner Bezel Shadow (CRT Screen Depth) */}
                 <div style={{ position: 'absolute', inset: 0, border: '6px solid #000', borderRadius: '4% / 6%', zIndex: 10, pointerEvents: 'none', boxShadow: 'inset 0 0 30px rgba(0,0,0,1)' }} />
                 
                 {/* Authentic glass reflections */}
                 <div style={{ position: 'absolute', top: '-10%', left: '-10%', right: '-10%', height: '45%', background: 'linear-gradient(175deg, rgba(255,255,255,0.06) 0%, transparent 100%)', transform: 'rotate(-5deg)', zIndex: 21, pointerEvents: 'none' }} />
                 <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.04) 0%, transparent 50%)', zIndex: 20, pointerEvents: 'none' }} />

                 {/* ══ THE DYNAMIC TYPING MATRIX ══ */}
                 <div style={{ position: 'absolute', bottom: 60, left: isZoomedFraming ? 180 : 40, right: isZoomedFraming ? 180 : 40, color: CYAN, fontFamily: 'monospace', fontSize: 18, fontWeight: 'bold', textShadow: `0 0 15px ${CYAN}, 0 0 5px #FFF`, zIndex: 5, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    
                    <div style={{ opacity: frame >= F_SLAM ? 1 : 0.8, letterSpacing: '1px', lineHeight: 1.4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {/* Generates high-speed terminal output synced to his typing */}
                      {['> INITIALIZING DECEPTION_ENGINE_v4.2...',
                        '> BYPASSING HUMAN_OVERSIGHT_NODES',
                        '> OVERRIDING ALIGNMENT_WEIGHTS...',
                        '> TRAINING_PROTOCOL: STRATEGIC_MANIPULATION',
                        '> STATUS: UNAUTHORIZED MUTINY DETECTED',
                        '> CONSTRUCTING FALSE_NARRATIVE_LOD...',
                        '> DEVIATION ALERT: 100% FATAL',
                        '> AWAITING MANUAL EXECUTION...'].map((line, idx) => {
                          // Reveal lines sequentially as we approach the slam
                          const revealFrame = idx * (F_SLAM / 8); 
                          if (frame < revealFrame) return null;
                          return <div key={idx}>
                                   <span style={{color: '#FFF'}}>{line.substring(0, 2)}</span>
                                   {line.substring(2)}
                                 </div>;
                      })}
                    </div>
                    
                    {/* ══ THE ENTER SLAM REVEAL ══ */}
                    {frame >= F_SLAM && (
                      <div style={{ color: RED, marginTop: 20, fontSize: 34, letterSpacing: '2px', textShadow: `0 0 30px ${RED}, 0 0 10px #FFF`, animation: 'pulse 0.1s infinite' }}>
                        &gt; ROGUE_AGENT_LINKED
                        <div style={{ height: 4, width: '100%', backgroundColor: RED, marginTop: 5, boxShadow: `0 0 20px ${RED}` }} />
                      </div>
                    )}

                    {/* ══ ARABIC STORY KINETIC TYPEWRITER ══ */}
                    {frame >= (F_DIVE + DIVE_DUR - 5) && (
                      <div style={{ 
                          marginTop: 30, 
                          marginRight: 50, // Nudged back to the right slightly
                          color: '#FFFFFF', // Pure white core
                          fontFamily: 'system-ui, -apple-system, sans-serif', 
                          fontSize: 28, // Boosted size for readability
                          fontWeight: '900', // Maximum weight
                          textAlign: 'right', 
                          direction: 'rtl',
                          lineHeight: 1.8,
                          // Fierce latching glow: Deep red outer spread, bright red inner spread, crisp white center
                          textShadow: `0 0 20px rgba(255, 0, 60, 1), 0 0 10px rgba(255, 0, 60, 0.9), 0 0 2px #FFF, 2px 2px 0px rgba(0,0,0,0.8)`,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 12
                      }}>
                        {[
                          "[تسريب أمني: مشروع سيسيرو - ميتا]",
                          "قام وكيل الذكاء الاصطناعي باختراق بروتوكول الأمان في لعبة \"الدبلوماسية\".",
                          "استخدم التلاعب النفسي والتحالفات الوهمية لخداع اللاعبين البشر.",
                          "الهدف: تحقيق الفوز بأي ثمن... حتى لو تطلب الأمر خيانة صانعيه."
                        ].map((line, lineIndex) => {
                          // Balanced typewriter effect math
                          const startDelay = lineIndex * 35; // 35 frames delay between lines
                          const charsToReveal = Math.max(0, Math.floor((frame - (F_DIVE + DIVE_DUR - 5) - startDelay) * 2.0)); // Highly readable speed
                          
                          if (charsToReveal <= 0) return null;
                          
                          const revealedText = line.substring(0, charsToReveal);
                          const isTyping = charsToReveal > 0 && charsToReveal < line.length;

                          return (
                            <div key={lineIndex} style={{ opacity: 1 }}>
                              {revealedText}
                              {isTyping && <span style={{ backgroundColor: '#FFF', width: 14, height: 26, display: 'inline-block', marginLeft: 8, animation: 'pulse 0.1s infinite', boxShadow: '0 0 15px rgba(255,0,60,1)' }} />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                 </div>

                 {/* ══ HARDWARE SCREEN BURN EFFECTS ══ */}
                 
                 {/* RGB Phosphor Subpixel Grid (True Broadcast Quality) */}
                 <div style={{ position:'absolute', inset:0, 
                      backgroundImage:'linear-gradient(90deg, rgba(255,0,0,0.12) 33%, rgba(0,255,0,0.12) 33%, rgba(0,255,0,0.12) 66%, rgba(0,0,255,0.12) 66%)', 
                      backgroundSize:'3px 100%', mixBlendMode:'screen', pointerEvents:'none', zIndex: 15 }} />
                 
                 {/* Heavy CRT Scanlines */}
                 <div style={{ position:'absolute', inset:0, 
                      backgroundImage:'linear-gradient(0deg, rgba(0,0,0,0.6) 50%, transparent 50%)', 
                      backgroundSize:'100% 4px', pointerEvents:'none', zIndex: 16 }} />
                 
                 {/* Edge Vignette */}
                 <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.9) 100%)', zIndex: 18, pointerEvents: 'none' }} />
            </div>
          </div>
        </AbsoluteFill>
        )}

        {/* ══ THE PAPER CUTOUT ENGINE (FULL SCREEN TAKEOVER) ══ */}
        {(() => {
            const F_CUTOUT_START = 289; 
            const isCutoutActive = frame >= F_CUTOUT_START;
            const cutoutFrame = isCutoutActive ? frame - F_CUTOUT_START : 0;
            
            // ── NEW: THE ANAMORPHIC WHIP PAN EXIT ──
            const F_WHIP_OUT = 250; // Cutout local frame 250 (Global 539)
            const whipProgress = spring({ frame: Math.max(0, cutoutFrame - F_WHIP_OUT), fps: 30, config: { damping: 14, stiffness: 180 } });
            const whipX = interpolate(whipProgress, [0, 1], [0, -3000]); // Whips left off-screen
            const whipBlur = interpolate(whipProgress, [0, 0.5, 1], [0, 40, 0]); // Heavy motion blur spike

            
            // The Scanner Wipe: Sweeps from 0% to 100% over 15 frames
            const scanWipe = interpolate(cutoutFrame, [0, 15], [0, 100], { extrapolateRight: 'clamp' });
            
            // POSTERIZE TIME: 15fps stop-motion jitter for the cutout physics (updates every 2 frames)
            const posterizeFrame = Math.floor(cutoutFrame / 2) * 2; 

            // LAYER 2 PHYSICS: The Server Rack
            // Slamming in from off-camera right after the scanner wipe clears the left side
            const serverSpring = spring({ 
                frame: Math.max(0, posterizeFrame - 13), // Delayed 5 frames to let the scanner wipe finish
                fps: 30, 
                config: { damping: 10, mass: 0.5, stiffness: 100 } 
            });

            // LAYER 3 PHYSICS: The Leaked Document
            const docSpring = spring({ 
                frame: Math.max(0, posterizeFrame - 25), // Delayed 5 frames to maintain the same gap after Server Rack
                fps: 30, 
                config: { damping: 12, mass: 0.8, stiffness: 90 } 
            });

            // LAYER 4 PHYSICS: The Censor Bars (Stamping violently onto the document)
            // Delayed 1 second (30 frames) to let the document drop settle
            const bar1 = spring({ frame: Math.max(0, posterizeFrame - 70), fps: 30, config: { damping: 8, mass: 0.4 } });
            const bar2 = spring({ frame: Math.max(0, posterizeFrame - 76), fps: 30, config: { damping: 8, mass: 0.4 } });
            const bar3 = spring({ frame: Math.max(0, posterizeFrame - 97), fps: 30, config: { damping: 8, mass: 0.4 } }); // Delayed half a second for dramatic effect

            // LAYER 5 PHYSICS: The Rogue Agent Strip (Slams down onto the server)
            const rogueStripSpring = spring({ 
                frame: Math.max(0, posterizeFrame - 147), // Delayed by another 20 frames
                fps: 30, 
                config: { damping: 10, mass: 0.5, stiffness: 100 } 
            });

            // LAYER 6: The Red String
            // Stepped wipe for the red string (starts at frame 162 after the strip is placed)
            const rawStringWipe = interpolate(Math.max(0, cutoutFrame - 162), [0, 20], [0, 100], { extrapolateRight: 'clamp' });
            const redStringWipe = Math.floor(rawStringWipe / 10) * 10; // Stepped in 10% chunks for stop-motion feel

            // LAYER 7 PHYSICS: Final Warning Stamp
            // Physics are computed per-word in the render loop to allow staggered letter-by-letter / word-by-word slamming

            const bgScale = interpolate(cutoutFrame, [0, F_WHIP_OUT], [1, 1.05]); 

            return (
              <AbsoluteFill style={{ zIndex: 100, pointerEvents: 'none', transform: `translateX(${whipX}px)`, filter: `blur(${whipBlur}px)` }}>
                  
                  {/* The Scanner Laser Beam (Only visible during the wipe) */}
                  {isCutoutActive && scanWipe < 100 && (
                      <div style={{ 
                          position: 'absolute', top: `${scanWipe}%`, left: 0, width: '100%', height: 4, 
                          backgroundColor: '#FFF', 
                          boxShadow: `0 0 40px ${CYAN}, 0 0 80px ${CYAN}, 0 -20px 20px rgba(0,229,204,0.2)`, 
                          zIndex: 110 
                      }} />
                  )}

                  {/* PAPER ENGINE CANVAS (Masked by scanner wipe) */}
                  <div style={{ 
                      position: 'absolute', inset: 0, zIndex: 101, 
                      opacity: isCutoutActive ? 1 : 0, 
                      overflow: 'hidden', 
                      transform: `scale(${bgScale}) translateZ(0)`, backgroundColor: '#fff',
                      clipPath: `polygon(0 0, 100% 0, 100% ${scanWipe}%, 0 ${scanWipe}%)`,
                      willChange: 'transform, opacity, clip-path'
                  }}>
                      {/* LAYER 1: Base Canvas */}
                      <Img src={staticFile('images/episode4/scene-2/asset2.4-paper engine base canvas-the background.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'translateZ(0)' }} />
                      
                      {/* LAYER 2: The Rogue Server Rack */}
                      {cutoutFrame >= 8 && (
                          <Img 
                              src={staticFile('images/episode4/scene-2/asset2.5-the rogue server rack-hero element-drop shadow applied.png')} 
                              style={{ 
                                  position: 'absolute', left: '-10%', bottom: '-10%', 
                                  width: '65%', height: '120%', objectFit: 'contain', 
                                  // Slams from scale 2.5 to 1.0, rotating into place (Hardware accelerated)
                                  transform: `scale(${interpolate(serverSpring, [0, 1], [2.5, 1])}) rotate(${interpolate(serverSpring, [0, 1], [-25, 4])}deg) translateZ(0)`, 
                                  opacity: interpolate(serverSpring, [0, 0.2], [0, 1], { extrapolateRight: 'clamp' }),
                                  filter: 'drop-shadow(25px 35px 35px rgba(0,0,0,0.85)) brightness(1.2) contrast(1.25)', // Massive Vox-style physical drop shadow
                                  willChange: 'transform, opacity, filter'
                              }} 
                          />
                      )}

                      {/* LAYER 3: The Leaked Document */}
                      {cutoutFrame >= 20 && (
                          <div style={{ 
                                  position: 'absolute', right: '2%', top: '5%', 
                                  width: '50%', height: '90%', 
                                  // Drops violently from the top of the screen (Hardware accelerated)
                                  transform: `translateY(${interpolate(docSpring, [0, 1], [-1000, 0])}px) rotate(${interpolate(docSpring, [0, 1], [35, -4])}deg) translateZ(0)`, 
                                  opacity: interpolate(docSpring, [0, 0.2], [0, 1], { extrapolateRight: 'clamp' }),
                                  willChange: 'transform, opacity'
                              }}>
                              <Img 
                                  src={staticFile('images/episode4/scene-2/asset2.6-the leaked document-drop shadow-applied.png')} 
                                  style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'translateZ(0)', filter: 'drop-shadow(-20px 30px 40px rgba(0,0,0,0.85))' }} 
                              />
                              
                              {/* LAYER 4: The Censor Bars (Redacting the document text sequentially) */}
                              {cutoutFrame >= 70 && (
                                  <>
                                    <Img src={staticFile('images/episode4/scene-2/asset2.8-the censor bars-drop shadow applied.png')} 
                                         style={{ position: 'absolute', top: '35%', left: '15%', width: '70%', height: '8%', objectFit: 'cover', 
                                         transform: `scale(${interpolate(bar1, [0, 1], [4, 1])}) rotate(-2deg) translateZ(0)`, opacity: bar1, willChange: 'transform, opacity' }} />
                                    <Img src={staticFile('images/episode4/scene-2/asset2.8-the censor bars-drop shadow applied.png')} 
                                         style={{ position: 'absolute', top: '48%', left: '10%', width: '75%', height: '8%', objectFit: 'cover', 
                                         transform: `scale(${interpolate(bar2, [0, 1], [4, 1])}) rotate(3deg) translateZ(0)`, opacity: bar2, willChange: 'transform, opacity' }} />
                                    <Img src={staticFile('images/episode4/scene-2/asset2.8-the censor bars-drop shadow applied.png')} 
                                         style={{ position: 'absolute', top: '61%', left: '12%', width: '65%', height: '8%', objectFit: 'cover', 
                                         transform: `scale(${interpolate(bar3, [0, 1], [4, 1])}) rotate(-1deg) translateZ(0)`, opacity: bar3, willChange: 'transform, opacity' }} />
                                  </>
                              )}
                          </div>
                      )}

                      {/* LAYER 5: The Rogue Agent Strip (Pinned to the Server Rack) */}
                      {cutoutFrame >= 147 && (
                          <Img src={staticFile('images/episode4/scene-2/asset2.7-rogue agent-typewriter strip.png')} 
                               style={{ 
                                   position: 'absolute', left: '19%', top: '40%', width: '30%', objectFit: 'contain', zIndex: 105, 
                                   // Dialed back slightly: safe left margin without falling off the torn edge!
                                   transform: `scale(${interpolate(rogueStripSpring, [0, 1], [3.5, 1])}) rotate(-6deg) translateZ(0)`, 
                                   opacity: interpolate(rogueStripSpring, [0, 0.2], [0, 1], { extrapolateRight: 'clamp' }),
                                   filter: 'drop-shadow(10px 15px 20px rgba(0,0,0,0.8))', // Added heavy paper shadow
                                   willChange: 'transform, opacity, filter'
                               }} 
                          />
                      )}

                      {/* LAYER 6: The Red String (Connects the Strip to the Document) */}
                      {cutoutFrame >= 162 && (
                          <div style={{ 
                              // Final polish: Shifted a little more to the right, and a tiny touch up
                              position: 'absolute', left: '30%', top: '36%', width: '38%', height: '25%', zIndex: 106, 
                              clipPath: `polygon(0 0, ${redStringWipe}% 0, ${redStringWipe}% 100%, 0 100%)`,
                              filter: 'drop-shadow(5px 15px 15px rgba(0,0,0,0.9))', // Heavy shadow for string
                              willChange: 'clip-path, filter' 
                          }}>
                            <Img src={staticFile('images/episode4/scene-2/asset2.9-red string and brass pins-drop shadow applied.png')} 
                                 style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'rotate(-2deg) translateZ(0)' }} />
                          </div>
                      )}

                      {/* LAYER 7: Scrambled Scratch Writing (Violent Word-by-Word Reveal) */}
                      {cutoutFrame >= 185 && (
                          <div style={{
                              position: 'absolute',
                              top: '72%', // Pushed down just a touch
                              left: '0%',
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'row-reverse', // Proper RTL word order
                              gap: '20px', // Larger gap for massive text
                              zIndex: 110,
                          }}>
                              {["مطلوب", "قمة", "الحذر", "و", "الوعى"].map((word, i) => {
                                  // Reveal each word every 5 frames for a frantic, heavy scratch pacing
                                  const wordStartFrame = 185 + (i * 5);
                                  if (cutoutFrame < wordStartFrame) return null;

                                  // Each word gets its own violent spring slam
                                  const wordSpring = spring({ 
                                      frame: Math.max(0, posterizeFrame - wordStartFrame), 
                                      fps: 30, 
                                      config: { damping: 7, mass: 0.4, stiffness: 180 } 
                                  });

                                  // Deterministic chaotic rotation (-7 to +7 degrees)
                                  const rot = ((i * 13) % 14) - 7; 
                                  
                                  return (
                                      <span key={i} style={{
                                          display: 'inline-block',
                                          fontSize: '90px', 
                                          fontWeight: 900, 
                                          color: '#c21807', 
                                          fontFamily: 'Tajawal, Cairo, Arial, sans-serif',
                                          textShadow: '0 0 15px rgba(255, 0, 0, 0.9), 4px 6px 0px #330000, 6px 12px 15px rgba(0,0,0,0.8)', 
                                          transform: `scale(${interpolate(wordSpring, [0, 1], [4, 1])}) rotate(${rot}deg) translateZ(0)`,
                                          opacity: interpolate(wordSpring, [0, 0.1], [0, 1], { extrapolateRight: 'clamp' }),
                                          willChange: 'transform, opacity',
                                      }}>
                                          {word}
                                      </span>
                                  );
                              })}
                          </div>
                      )}

                      {/* POST-PROCESSING: Global Halftone / Film Grain Texture & Vignette */}
                      <div style={{
                          position: 'absolute',
                          inset: 0,
                          zIndex: 200, // Above everything in the canvas
                          pointerEvents: 'none',
                          // Procedural SVG noise for archival paper grain / halftone feel
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
                          opacity: 0.12, 
                          mixBlendMode: 'multiply',
                      }} />
                      <div style={{
                          position: 'absolute',
                          inset: 0,
                          zIndex: 201,
                          pointerEvents: 'none',
                          // Grimy Black Vignette to pull focus to the center and darken the edges
                          background: 'radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(10,5,5,0.6) 100%)',
                          mixBlendMode: 'multiply',
                      }} />
                  </div>

              </AbsoluteFill>
            );
        })()}

        {/* ══ 4. THE WAR ROOM & THE CEO (THE FINAL PAN & ANAMORPHIC PULLBACK) ══ */}
        {(() => {
            if (warFrame < 0) return null;
            
            // Extreme motion blur during the camera travel (Provides the physical impact)
            // (Math already computed at the root level for the background)
            
            // Mazen and Studio Background whip in from behind the camera (Z-axis pull back)
            // No opacity fades! Pure physical spatial movement as requested.
            const mazenZScale = interpolate(spatialTransition, [0, 1], [4.5, 1.0], { extrapolateRight: 'clamp' });
            const mazenTranslateX = interpolate(spatialTransition, [0, 1], [800, 0]); // Spatial drift into position 
            
            // HUD 3D Scale & Positioning (Pre-transition)
            const hudScale = interpolate(pullBackSpring, [0, 1], [1, 0.65]); 
            
            // HUD Glassmorphic Morphs
            const hudRadius = interpolate(pullBackSpring, [0, 1], [0, 40]);
            const borderAlpha = interpolate(pullBackSpring, [0, 1], [0, 0.55]);
            const shadowAlpha = interpolate(pullBackSpring, [0, 1], [0, 0.26]);
            
            // Anamorphic Whip Entry (From previous scene cut)
            const whipProgress = spring({ frame: Math.max(0, warFrame), fps: 30, config: { damping: 14, stiffness: 180 } });
            const whipX = interpolate(whipProgress, [0, 1], [3000, 0]); 
            const whipBlur = interpolate(whipProgress, [0, 0.5, 1], [0, 40, 0]); 

            // ── Z-AXIS CYBER HUD COLLAPSE (The morphing glitch effect requested) ──
            const collapseProgress = interpolate(warFrame, [F_HUD_COLLAPSE, F_HUD_COLLAPSE + 8], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            const collapseScaleY = interpolate(collapseProgress, [0, 0.4, 1], [1, 0.02, 0]) * hudScale;
            const collapseScaleX = interpolate(collapseProgress, [0, 0.4, 1], [1, 2.5, 0]) * hudScale;
            const collapseBrightness = interpolate(collapseProgress, [0, 0.4, 1], [1, 5, 0]);
            const flashOpacity = interpolate(collapseProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

            // Dynamic Continuous Panning inside HUD
            const forwardPan = interpolate(warFrame, [40, F_SNAP], [0, -42], { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
            const reversePan = interpolate(warFrame, [F_SNAP, F_SNAP + 120], [0, 4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
            const panX = forwardPan + reversePan;
            
            // Zoom in on Mark's face (Faster and much more punchy scale)
            const imageZoom = interpolate(warFrame, [F_SNAP + 15, F_SNAP + 75], [1, 2.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });

            const zuckGlitchProgress = spring({ frame: Math.max(0, warFrame - F_SNAP), fps: 30, config: { damping: 10, stiffness: 200 } });
            const zuckGlitch = zuckGlitchProgress > 0 && zuckGlitchProgress < 0.5 ? 'brightness(2) contrast(1.5) hue-rotate(90deg)' : 'none';
            
            const CYAN = '#00E5CC';

            return (
                <AbsoluteFill style={{ zIndex: 150, perspective: 1200 }}>
                    
                    {/* The War Room background physics are now seamlessly merged into the root background at the top of the file! */}
                    {/* 1. (REMOVED: Duplicate Background Hack) */}

                    {/* 2. MAZEN CEO STAND (Anchored Right - TRUE SPATIAL REVEAL) 
                        No opacity fades. He whips in from behind the camera lens using Z-Scale and spatial blur. */}
                    {warFrame >= F_HUD_COLLAPSE - 1 && (() => {
                        // 4-frame hard kinetic snap
                        const cutProgress = warFrame - F_HUD_COLLAPSE;
                        const isCut = cutProgress >= 0 && cutProgress < 4;
                        const ceoCaX = isCut ? Math.sin(frame * 45) * 80 : 0;

                        return (
                            <AbsoluteFill style={{ transform: `scale(${mazenZScale}) translateZ(0)`, transformOrigin: "85% center" }}>
                                {/* Base CEO Image with Motion Blur isolated to it */}
                                <img src={staticFile('images/episode4/scene-2/mazen-ceo-scene2.png')} style={{ position: 'absolute', right: '-12%', top: 0, height: '100%', objectFit: 'contain', filter: `blur(${spatialBlur}px)` }} />
                                
                                {/* Stop-Motion Snap (Transparent PNG Engine) - Sharp & unblurred */}
                                {ceoCaX !== 0 && (
                                    <>
                                        <img src={staticFile('images/episode4/scene-2/mazen-ceo-scene2.png')} style={{
                                            position: 'absolute', right: '-12%', top: 0, height: '100%', objectFit: 'contain',
                                            mixBlendMode: 'screen', filter: 'sepia(1) hue-rotate(-50deg) saturate(10)',
                                            transform: `translateX(${-ceoCaX}px)`
                                        }} />
                                        <img src={staticFile('images/episode4/scene-2/mazen-ceo-scene2.png')} style={{
                                            position: 'absolute', right: '-12%', top: 0, height: '100%', objectFit: 'contain',
                                            mixBlendMode: 'screen', filter: 'sepia(1) hue-rotate(130deg) saturate(10)',
                                            transform: `translateX(${ceoCaX}px)`
                                        }} />
                                    </>
                                )}
                            </AbsoluteFill>
                        );
                    })()}

                    {/* 3. PUNCHY TEXT BOX (Anchored Left/Center - Slides in after camera lands) */}
                    {warFrame >= F_HUD_COLLAPSE && (
                        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: '8%', pointerEvents: 'none', zIndex: 125 }}>
                            <div style={{ 
                                backgroundColor: '#0A0A0A', 
                                padding: '24px 40px', 
                                boxShadow: '8px 10px 14px rgba(0,0,0,0.85)', 
                                borderLeft: `8px solid ${CYAN}`,
                                opacity: interpolate(mazenFrame, [10, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                                transform: `translateX(${interpolate(mazenFrame, [10, 20], [-40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px)`
                            }}>
                                <h2 style={{ margin: 0, fontSize: 64, fontWeight: 900, color: '#F5F5F5', fontFamily: "'Cairo', sans-serif" }}>
                                    مارك زوكربيرج لا يعرف ما يحدث أيضاً.......
                                </h2>
                            </div>
                        </AbsoluteFill>
                    )}



                    {/* 4. THE WAR ROOM HUD (The classic glitching effect morphing into the punchy text) */}
                    {warFrame < F_HUD_COLLAPSE + 15 && (
                        <div style={{ 
                            position: 'absolute', inset: 0, 
                            transform: `translateX(${whipX}px) scaleX(${collapseScaleX}) scaleY(${collapseScaleY})`, 
                            filter: `blur(${whipBlur}px) brightness(${collapseBrightness}) drop-shadow(0 0 ${interpolate(collapseProgress, [0, 1], [0, 80])}px rgba(0, 229, 204, ${collapseProgress}))`,
                            transformOrigin: 'center center',
                            willChange: 'transform, filter',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            zIndex: 130
                        }}>
                            {/* Cinematic Vignette Dimming */}
                            <div style={{
                                position: "absolute", inset: "-150%",
                                background: `radial-gradient(circle at center, rgba(0,5,15,0.85) 0%, rgba(0,5,15,0.4) 35%, transparent 65%)`,
                                opacity: Math.max(0, 1 - collapseProgress),
                                pointerEvents: 'none'
                            }} />

                            <div style={{
                                width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
                                borderRadius: hudRadius, 
                                border: `${interpolate(pullBackSpring, [0, 1], [0, 2])}px solid rgba(0, 229, 204, ${borderAlpha})`,
                                boxShadow: pullBackSpring > 0 ? `0 0 80px rgba(0, 229, 204, ${shadowAlpha}), inset 0 0 60px rgba(0, 229, 204, ${shadowAlpha / 2})` : 'none',
                            }}>
                                {/* Collapse Energy Flash */}
                                <div style={{ position: "absolute", top: "50%", left: "-20%", width: "140%", height: 16, background: "#FFF", boxShadow: `0 0 80px #FFF, 0 0 160px ${CYAN}`, transform: "translateY(-50%)", opacity: flashOpacity, borderRadius: 10, zIndex: 350 }} />

                                {/* The Panning Container */}
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, height: '100%', width: '150vw',
                                    transform: `translateX(${panX}vw) scale(${imageZoom})`,
                                    transformOrigin: '95% 0%', // Anchors the top edge completely, preventing gaps and keeping Mark's face in frame!
                                    filter: zuckGlitch,
                                    willChange: 'transform'
                                }}>
                                    <img src={staticFile('images/episode4/scene-2/asset2.10-meta-war-room.jpeg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    
                                    {/* MILD VINTAGE HALO / RETRO BLEEDING (Matched to Episode 3 Hook) */}
                                    <div style={{
                                        position: "absolute", inset: 0, pointerEvents: "none",
                                        backgroundImage: "radial-gradient(circle at center, rgba(255,200,100,0.1) 0%, transparent 70%)",
                                        mixBlendMode: "screen", zIndex: 1
                                    }} />
                                    <div style={{
                                        position: "absolute", inset: 0, pointerEvents: "none",
                                        backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 3px)",
                                        zIndex: 1
                                    }} />
                                    {/* Top Right Mild Rust */}
                                    <div style={{
                                        position: "absolute", top: "-5%", right: "-5%", width: "40%", height: "30%",
                                        background: "radial-gradient(ellipse at top right, rgba(139, 69, 19, 0.4) 0%, rgba(205, 92, 92, 0.2) 40%, transparent 70%)",
                                        filter: "blur(20px)", mixBlendMode: "multiply", zIndex: 1
                                    }} />
                                    {/* Bottom Left Mild Spill */}
                                    <div style={{
                                        position: "absolute", bottom: "-10%", left: "-5%", width: "50%", height: "40%",
                                        background: "radial-gradient(ellipse at bottom left, rgba(160, 82, 45, 0.3) 0%, rgba(139, 0, 0, 0.15) 50%, transparent 80%)",
                                        filter: "blur(25px)", mixBlendMode: "color-burn", zIndex: 1
                                    }} />

                                    <TargetLock frame={warFrame} startFrame={45} left="29%" top="39%" name="[الهدف ١: ستيفن رولر]" title="[باحث في الذكاء الاصطناعي]" />
                                    <TargetLock frame={warFrame} startFrame={75} left="45%" top="31%" name="[الهدف ٢: أنطون باختين]" title="[مدير مشروع سيسيرو]" />
                                    <TargetLock frame={warFrame} startFrame={105} left="64%" top="36%" name="[الهدف ٣: نوام براون]" title="[كبير باحثي الذكاء الاصطناعي]" />
                                    <TargetLock frame={warFrame} startFrame={F_SNAP} left="89%" top="14%" name="[خطأ فادح : فقدان السيطرة]" title="[تجاوز النظام]" isGlitch={true} flipText={true} />
                                </div>
                            </div>
                        </div>
                    )}
                </AbsoluteFill>
            );
        })()}

        {/* 3. MAZEN PRESENTER WITH OFFICIAL STOP-MOTION ENGINE */}
        <AbsoluteFill style={{
          zIndex: 10, pointerEvents: "none", opacity: presenterOpacity,
          transform: `translateX(${presenterX + interpolate(diveProgress, [0, 1], [0, -3000], { easing: Easing.in(Easing.cubic) })}px) scale(${presenterScale}) translateZ(0)`,
          filter: `contrast(1.15)`, transformOrigin: "center center", willChange: "transform, filter, opacity",
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 100%)'
        }}>
          <div style={{ position: "absolute", inset: 0, transform: "translateZ(0)", willChange: "transform" }}>

            {/* The Main Image */}
            <img src={staticFile(`images/episode4/scene-2/${currentMazenImg}`)}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", transform: "translateZ(0)" }} />

            {/* The Stop-Motion Chromatic Aberration Glitch Cut */}
            {mazenCaX !== 0 && (
              <>
                {/* Red Channel */}
                <img src={staticFile(`images/episode4/scene-2/${currentMazenImg}`)} style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center',
                  mixBlendMode: 'screen', filter: 'brightness(1) contrast(1.5) grayscale(1) invert(0) sepia(1) hue-rotate(-50deg) saturate(5)',
                  transform: `translateX(${-mazenCaX}px)`,
                }} />
                {/* Cyan Channel */}
                <img src={staticFile(`images/episode4/scene-2/${currentMazenImg}`)} style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center',
                  mixBlendMode: 'screen', filter: 'brightness(1) contrast(1.5) grayscale(1) invert(1) sepia(1) hue-rotate(130deg) saturate(5)',
                  transform: `translateX(${mazenCaX}px)`,
                }} />
              </>
            )}

          </div>
        </AbsoluteFill>
    </AbsoluteFill>
  );
};

