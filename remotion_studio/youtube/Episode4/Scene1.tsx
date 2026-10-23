import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  Video,
  interpolate,
  useCurrentFrame,
  random,
  Easing,
  spring,
  interpolateColors
} from 'remotion';
import { AnamorphicWhipPan } from '../Episode3/AnamorphicWhipPan';
import { NewsChyron } from '../Episode3/TheHook';

const CYAN = "#00E5CC";
const RED = "#FF3333";
const MAGENTA = "#FF0055";

// 1,300 Signatures array (Optimized length for seamless scrolling)
const SIG_DATA = [
  "Prof. G. Hinton - [GOOG-AI] RESIGNED", "Dr. Y. Bengio - [MIT-IBM] SIGNED",
  "S. Russell - [BERKELEY] WARNING", "M. Suleyman - [DEEPMIND] BREACH",
  "Dr. T. Gebru - [DAIR] CRITICAL", "J. Altman - [OAI] AUTHORIZED",
  "L. Torvalds - [LINUX] OVERRIDE", "E. Snowden - [NSA-X] EXPOSED",
  "N. Bostrom - [OXFORD] ROGUE", "A. Ng - [DEEPLEARNING] RED",
  "F. Chollet - [GOOGLE] HALT", "K. Crawford - [NYU] BREACH",
  "D. Hassabis - [DM] CRITICAL", "I. Goodfellow - [APPLE] VOID",
  "Y. LeCun - [META] OVERRIDE", "B. Selman - [CORNELL] WARN",
  "P. Abbeel - [UC BERKE] FAIL", "R. Sutton - [ALBERTA] LOOP",
  "G. Marcus - [NYU] PROTEST", "C. Manning - [STANFORD] ERR",
];
const SIGNATURES = Array(3).fill(SIG_DATA).flat();

const GlobalTexture: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999, mixBlendMode: "overlay", opacity: 0.05 }}>
    <div style={{ width: "100%", height: "100%", backgroundImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>')` }} />
  </AbsoluteFill>
);

const DioramaOverlay: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 90, mixBlendMode: "multiply" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #1a1a1a 1px, transparent 1px)", backgroundSize: "5px 5px", opacity: 0.25 }} />
  </AbsoluteFill>
);

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

const CylinderPanel: React.FC<{ i: number; frame: number; opacityMultiplier: number; whipBlur: number }> = ({ i, frame, opacityMultiplier, whipBlur }) => {
  return (
    <div style={{
      position: 'absolute', width: 400, height: 4000,
      left: '50%', top: '50%', marginLeft: -200, marginTop: -2000,
      transformStyle: 'preserve-3d',
      transform: `rotateY(${i * 30}deg) translateZ(750px)`,
    }}>
      {/* 
        CRITICAL: Opacity is applied to the INNER div. 
        This prevents CSS 3D depth-sorting failure against Mariya and the Studio!
      */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: 0.9 * opacityMultiplier,
        backgroundColor: 'rgba(0, 40, 50, 0.4)',
        borderLeft: '2px solid rgba(0, 229, 204, 0.3)',
        borderRight: '2px solid rgba(0, 229, 204, 0.3)',
        boxShadow: 'inset 0 0 40px rgba(0,229,204,0.15)',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', width: '100%',
          fontFamily: 'monospace', fontSize: 24, fontWeight: 'bold',
          textAlign: 'center',
          transform: `translateY(${-((frame * 4 + i * 150) % 2000)}px)`,
          opacity: ((frame * 4 + i * 150) % 2000) > 1800 ? (2000 - ((frame * 4 + i * 150) % 2000)) / 200 : 1,
          display: 'flex', flexDirection: 'column', gap: '22px',
          padding: '20px 0',
          // 1px constant blur for the vertical scroll speed, plus whipBlur for the camera pan!
          filter: `blur(${1 + whipBlur}px)`
        }}>
          {/* Restored the original array (no duplication) so it 'refreshes' loop by loop */}
          {SIGNATURES.map((s, idx) => {
            // Split the signature to highlight the status tag in Magenta/Red
            const parts = s.split(' - ');
            const isCritical = s.includes('RESIGNED') || s.includes('CRITICAL') || s.includes('BREACH') || s.includes('EXPOSED');
            const highlightColor = isCritical ? '#FF00FF' : CYAN; // Magenta for criticals

            return (
              <span key={idx} style={{ color: CYAN, textShadow: `0 0 16px ${CYAN}` }}>
                {parts[0]} - <span style={{ color: highlightColor, textShadow: `0 0 16px ${highlightColor}` }}>{parts[1]}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export const True3DScene_Export: React.FC = () => { return <True3DScene />; }
const True3DScene: React.FC = () => {
  const frame = useCurrentFrame();

  // ADJUSTED TIMINGS (Perfectly Synced to Audio Track & Voiceover Beats)
  const F_M_POSE2 = 60;        // 0:02 Mazen Shift
  const F_DIVE_START = 100;    // 0:03.3 Camera begins plunge
  const F_DIVE_END = 195;      // 0:06.5 Dive completes at Mariya (Cylinder formed)
  const F_MARIYA_STARE = 277;  // 0:09.07 Severe Stare (Pose 3)
  const F_MARIYA_SNAP = 365;   // Shifted 15 frames to hit 'out of control'
  const WHIP_START = 405;      // 0:13.5 Whip Pan begins (B-Roll hits)

  // 3D CAMERA ENGINE
  // Z-axis pushes forward violently, X-axis pans left to gracefully slide PAST Mazen's shoulder instead of through him.
  const cameraZ = interpolate(frame,
    [0, F_DIVE_START, F_DIVE_END, WHIP_START - 15, WHIP_START + 18],
    [0, 100, 2000, 2000, 4500],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  const cameraX = interpolate(frame,
    [0, F_DIVE_START, F_DIVE_END, WHIP_START - 15, WHIP_START + 18],
    [0, -50, -300, -300, -800],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // HUD DYNAMICS
  const hudOpacity = interpolate(cameraZ, [1600, 1950], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hudText = "١٠ أغسطس";
  // Slower typing speed to match his entrance (1 char every 6 frames)
  const typedChars = Math.min(Math.max(0, Math.floor((frame - 5) / 2)), hudText.length);
  const typedText = hudText.slice(0, typedChars);

  // Render the second line strictly at 00:04.08 (frame 128) with a heavy cinematic slam
  const F_SUBTITLE_RENDER = 128;
  const subtitleSpring = spring({
    frame: frame - F_SUBTITLE_RENDER,
    fps: 30,
    config: { damping: 12, stiffness: 90, mass: 2 } // Heavy, powerful drop
  });
  const subtitleScale = interpolate(subtitleSpring, [0, 1], [1.3, 1]);
  const subtitleOpacity = interpolate(frame, [F_SUBTITLE_RENDER, F_SUBTITLE_RENDER + 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subtitleBlur = interpolate(subtitleSpring, [0, 1], [15, 0]);
  const subtitleY = interpolate(subtitleSpring, [0, 1], [40, 0]);

  // Motion blur specifically for the HUD text: Delays the blur until Z=650 (after the text slams down)
  const hudMotionBlurH1 = interpolate(cameraZ, [650, 800], [0, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
  const hudMotionBlurH2 = interpolate(cameraZ, [650, 800], [0, 1.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });

  // MAZEN DYNAMICS
  const isMazenPose2 = frame >= F_M_POSE2;
  const mazenImg = isMazenPose2 ? staticFile('images/episode4/mazen-scene1-pose2.png') : staticFile('images/episode4/mazen-scene1-pose1.png');
  const mazenCutP = frame - F_M_POSE2;
  const mazenCaX = (mazenCutP >= 0 && mazenCutP < 4) ? Math.sin(frame * 45) * 80 : 0;
  // Fades out just as he flies past the camera to avoid mesh intersection
  const mazenOpacity = interpolate(cameraZ, [800, 1150], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const mazenBlur = interpolate(cameraZ, [300, 800], [0, 20], { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.in(Easing.cubic) });

  // Mazen slides in from the right gracefully while the HUD types behind him
  const mazenEnterX = interpolate(frame, [0, 75], [1200, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic)
  });

  // Push Mazen out to the right starting at 00:03.00 (frame 90) to clear the camera dive
  const mazenDivePushX = interpolate(frame, [90, 160], [0, 1200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic)
  });
  const mazenTotalX = mazenEnterX + mazenDivePushX;

  // MARIYA DYNAMICS
  const F_MARIYA_SHIFT = 230;  // 0:07.20 Shifts to Pose 2
  const isMariyaPose2 = frame >= F_MARIYA_SHIFT;
  const isMariyaPose3 = frame >= F_MARIYA_STARE;
  const isMariyaPose4 = frame >= F_MARIYA_SNAP && frame < F_MARIYA_SNAP + 3;
  const isMariyaPose5 = frame >= F_MARIYA_SNAP + 3;

  const mariyaImg = isMariyaPose5 ? staticFile('images/episode4/mariya-scene1-pose5.png')
    : isMariyaPose4 ? staticFile('images/episode4/mariya-scene1-pose4.png')
      : isMariyaPose3 ? staticFile('images/episode4/mariya-scene1-pose3.png')
        : isMariyaPose2 ? staticFile('images/episode4/mariya-scene1-pose2.png')
          : staticFile('images/episode4/mariya-scene1-pose1.png');

  const mariyaCuts = [F_MARIYA_SHIFT, F_MARIYA_STARE, F_MARIYA_SNAP, F_MARIYA_SNAP + 3];
  const isMariyaCut = mariyaCuts.some(c => frame - c >= 0 && frame - c < 4);
  const mariyaCaX = isMariyaCut ? Math.sin(frame * 45) * 80 : 0;

  const mariyaOpacity = interpolate(cameraZ, [1000, 1800], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const cylinderOpacity = interpolate(cameraZ, [1000, 1800], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // STUDIO LIGHTING & PARALLAX
  // Lighting drop removed per user request.

  // Exaggerated parallax: physically pulls the background left as the camera passes Mazen
  const diveParallax = interpolate(frame, [90, 160], [0, -1200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic)
  });
  // Continuous drift opposing the cylinder's rotation to sell the massive 3D volume
  const continuousParallax = interpolate(frame, [160, WHIP_START], [0, -600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const bgParallaxX = diveParallax + continuousParallax;

  // CAMERA SHAKE (Reduced intensity as requested)
  const isDiving = frame > F_DIVE_START && frame < F_DIVE_END;
  const isPunching = frame > WHIP_START - 15 && frame < WHIP_START + 18;
  const shakeX = (isDiving || isPunching) ? Math.sin(frame * 8) * 5 : 0;
  const shakeY = (isDiving || isPunching) ? Math.cos(frame * 12) * 5 : 0;

  // CINEMATIC BLUR (Dynamic Depth of Field + Whip Pan)
  // Starts perfectly sharp (0px). As Mazen enters and settles, it blurs to 4px to pull focus to him.
  const mazenFocusBlur = interpolate(frame, [0, 75], [0, 4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const motionBlur = interpolate(frame, [WHIP_START - 15, WHIP_START], [0, 25], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const bgBlur = mazenFocusBlur + motionBlur;

  return (
    <div style={{ position: 'absolute', inset: 0, perspective: 1200, overflow: 'hidden', backgroundColor: '#020202' }}>

      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `translateZ(${cameraZ}px) translateX(${-cameraX}px) translateX(${shakeX}px) translateY(${shakeY}px)` }}>

        {/* MASSIVE STUDIO BG (Pushed way back to Z=-4000 to prevent intersecting Mariya!) */}
        <div style={{ position: 'absolute', width: 1920, height: 1080, left: '50%', top: '50%', marginLeft: -960, marginTop: -540, transform: `translateZ(-4000px) translateX(${bgParallaxX}px) scale(6.25)` }}>
          {/* Opacity is 1 so it stays solid; blur applied directly to the image exactly like ShortFinaleVertical */}
          <div style={{ position: 'absolute', inset: 0, opacity: 1 }}>
            <img src={staticFile("images/episode4/harfen-studio.jpeg")} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: `blur(${bgBlur}px) grayscale(0.5) sepia(0.4) contrast(1.3) brightness(0.9)` }} />
            
            {/* Dynamic Tone Shift (Syncs exactly with Voiceover Tone Cuts) */}
            <div style={{ position: 'absolute', inset: 0, backgroundColor: MAGENTA, mixBlendMode: 'multiply', opacity: interpolate(frame, [F_DIVE_END, F_DIVE_END + 15, F_MARIYA_STARE, F_MARIYA_STARE + 15], [0, 0.6, 0.6, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) }} />
            <div style={{ position: 'absolute', inset: 0, backgroundColor: RED, mixBlendMode: 'multiply', opacity: interpolate(frame, [F_MARIYA_STARE, F_MARIYA_STARE + 15], [0, 0.6], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) }} />
          </div>
        </div>

        {/* MARIYA & HOLOGRAPHIC CYLINDER (Z = -2000, X = -300) */}
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: 'translateZ(-2000px) translateX(-300px)' }}>

          {/* Cylinder Back Wall */}
          <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${frame * 0.5}deg)` }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const globalAngle = (i * 30) + (frame * 0.5);
              const isBack = Math.cos(globalAngle * Math.PI / 180) < 0;
              if (!isBack) return null;
              return <CylinderPanel key={i} i={i} frame={frame} opacityMultiplier={cylinderOpacity} whipBlur={motionBlur} />
            })}
          </div>

          {/* Mariya */}
          <div style={{ position: 'absolute', width: 1920, height: 1080, left: '50%', top: '50%', marginLeft: -960, marginTop: -540 }}>
            {/* Opacity strictly on the inner div */}
            <div style={{ position: 'absolute', inset: 0, opacity: mariyaOpacity }}>
              <img src={mariyaImg} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} />
              {mariyaCaX !== 0 && <CharacterCA3D imgSrc={mariyaImg} caX={mariyaCaX} />}
            </div>
          </div>

          {/* Cylinder Front Wall */}
          <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${frame * 0.5}deg)` }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const globalAngle = (i * 30) + (frame * 0.5);
              const isFront = Math.cos(globalAngle * Math.PI / 180) >= 0;
              if (!isFront) return null;
              return <CylinderPanel key={i} i={i} frame={frame} opacityMultiplier={cylinderOpacity} whipBlur={motionBlur} />
            })}
          </div>
        </div>

        {/* 3D PROJECTOR HUD (Z = -800, X = -300) */}
        <div style={{ position: 'absolute', width: 1400, height: 800, left: '50%', top: '50%', marginLeft: -700, marginTop: -400, transform: 'translateZ(-800px) translateX(-300px)' }}>
          {/* Opacity strictly on the inner div */}
          <div style={{ position: 'absolute', inset: 0, opacity: hudOpacity, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
              border: `2px solid rgba(0,229,204,0.6)`, borderRadius: 40, background: "rgba(0, 15, 25, 0.75)", overflow: 'hidden', padding: "80px 140px", boxShadow: `0 0 150px rgba(0,229,204,0.3)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 30, position: 'relative', width: '100%', height: '100%', justifyContent: 'center'
            }}>
              {/* Video AMMOED into the HUD itself to serve as the background projector */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
                <Video src={staticFile('video/episode4/server-video-montage.mp4')} onError={(e) => console.log('Video ended')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <h1 style={{ color: "#FFF", fontSize: 130, fontWeight: 900, fontFamily: "'Cairo', sans-serif", textShadow: `0 0 50px ${CYAN}`, margin: 0, zIndex: 2, filter: `blur(${hudMotionBlurH1}px)` }}>
                <span style={{ color: CYAN }}>يوم </span>{typedText}<span style={{ opacity: frame % 10 < 5 ? 1 : 0, color: CYAN }}>_</span>
              </h1>
              <div style={{ width: "80%", height: 6, backgroundColor: CYAN, boxShadow: `0 0 40px ${CYAN}`, zIndex: 2, opacity: subtitleOpacity, transform: `scaleX(${subtitleSpring})` }} />
              <h2 style={{
                color: "rgba(255,255,255,0.9)", fontSize: 60, fontWeight: 700, fontFamily: "'Cairo', sans-serif", margin: 0, zIndex: 2,
                opacity: subtitleOpacity,
                transform: `translateY(${subtitleY}px) scale(${subtitleScale})`,
                filter: `blur(${subtitleBlur + hudMotionBlurH2}px)`,
                textShadow: `0 0 ${interpolate(subtitleSpring, [0, 1], [80, 10])}px ${CYAN}`
              }}>قواعد اللعبة اتغيرت للأبد</h2>
            </div>
          </div>
        </div>

        {/* MAZEN (Enters from right, settles at Z = 0, X = 200, then pushes right to clear dive) */}
        <div style={{ position: 'absolute', width: 1920, height: 1080, left: '50%', top: '50%', marginLeft: -960, marginTop: -540, transform: `translateZ(0px) translateX(${mazenTotalX}px)` }}>
          {/* Opacity strictly on the inner div */}
          <div style={{ position: 'absolute', inset: 0, opacity: mazenOpacity, filter: `blur(${mazenBlur}px)` }}>
            <img src={mariyaImg /* Preload fix: will instantly swap to Mazen */} style={{ display: 'none' }} />
            <img src={mazenImg} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} />
            {mazenCaX !== 0 && <CharacterCA3D imgSrc={mazenImg} caX={mazenCaX} />}
          </div>
        </div>

      </div>

      {/* SCENE 1 CHYRON - Introduce the 1300 Signatures context just before the heavy text slam */}
      <NewsChyron label="١٣٠٠ توقيع" source="رسالة تمرد" delayFrames={40} exitFrame={95} isMaskRTL={true} />
    </div>
  )
}

// THE MISSING SECURITY CAMERA OVERLAYS FOR THE SERVER MONTAGE B-ROLL
const SecurityCameraOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  // Dynamic typing and blinking
  const rawText = "تسجيل // تسريب_٠٤.MP4";
  const typedLen = Math.max(0, Math.floor(frame / 2));
  const isBlink = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 50, fontFamily: "'Cairo', sans-serif", color: CYAN, padding: 60 }}>
      <div style={{ position: 'absolute', top: 60, left: 60, fontSize: 32, fontWeight: 'bold' }}>
        <div>{rawText.slice(0, typedLen)}<span style={{ opacity: isBlink ? 1 : 0 }}>_</span></div>
        <div style={{ color: RED, marginTop: 12, opacity: frame > 20 && isBlink ? 1 : 0.4 }}>كاميرا المراقبة - غير متصلة</div>
      </div>

      <div style={{ position: 'absolute', top: 60, right: 60, textAlign: 'right', fontSize: 32, fontWeight: 'bold' }}>
        <div>التاريخ: ١٠ أغسطس ٢٠٢٦</div>
        <div style={{ opacity: 0.7 }}>النظام: <span style={{ color: frame % 10 < 5 ? RED : CYAN }}>غير مستقر</span></div>
      </div>

      {/* 3rd Security Shot Target Lock - Upgraded with scale & rotation */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', marginLeft: -150, marginTop: -150,
        width: 300, height: 300, border: `3px solid ${CYAN}`, borderRadius: '50%',
        borderStyle: 'dashed',
        transform: `rotate(${frame * 2}deg) scale(${interpolate(frame, [0, 20], [1.5, 1], { extrapolateRight: 'clamp' })})`,
        opacity: interpolate(frame, [0, 20], [0, 0.5])
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%', marginLeft: -250, marginTop: -2,
        width: 500, height: 4, backgroundColor: CYAN, opacity: 0.3,
        transform: `scaleX(${interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })})`
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%', marginLeft: -2, marginTop: -250,
        width: 4, height: 500, backgroundColor: CYAN, opacity: 0.3,
        transform: `scaleY(${interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })})`
      }} />

      {/* Dynamic Data Dump - Slides in violently */}
      <div style={{
        position: 'absolute', top: '55%', left: '55%', fontSize: 32, backgroundColor: 'rgba(0, 10, 15, 0.85)',
        padding: '20px 30px', borderLeft: `6px solid ${RED}`, boxShadow: `0 0 30px rgba(255,0,0,0.4)`,
        opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' }),
        transform: `translateX(${interpolate(frame, [15, 30], [50, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })})`
      }}>
        <div style={{ color: '#FFF', fontWeight: 'bold' }}>الهدف: لقطة_أمنية_٣</div>
        <div style={{ color: RED, marginTop: 12, marginBottom: 12, fontWeight: 'bold' }}>
          تم اختراق النظام <span style={{ opacity: isBlink ? 1 : 0 }}>!</span>
        </div>
        <div style={{ fontWeight: 'bold' }}>
          {Math.floor(frame * 1.345)} ميجا/ث - جاري التفريغ {frame % 20 < 10 ? '...' : '..'}
        </div>
      </div>
    </AbsoluteFill>
  );
}

export const ServerFarmScene_Export: React.FC = () => { return <ServerFarmScene />; }
const ServerFarmScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#020202", overflow: 'hidden' }}>

      {/* FULL SCREEN B-ROLL (No pull-out effect, transition happens in Scene 2) */}
      <Video src={staticFile('video/episode4/server-video-montage.mp4')} onError={(e) => console.log('Video ended')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <AbsoluteFill style={{ zIndex: 10, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)", mixBlendMode: "overlay" }} />

      {/* Glitch overlays */}
      {frame < 6 && <AbsoluteFill style={{ mixBlendMode: 'screen', backgroundColor: 'rgba(255,51,51,0.5)', opacity: random(frame) > 0.5 ? 1 : 0 }} />}
      {frame % 40 > 35 && <AbsoluteFill style={{ mixBlendMode: 'screen', backgroundColor: 'rgba(255,51,51,0.2)' }} />}

      {/* Security Camera Overlays (Unchanged) */}
      <SecurityCameraOverlay />

    </AbsoluteFill>
  );
};

export const Episode4Scene1: React.FC = () => {
  const WHIP_START = 405;
  const WHIP_DUR = 18;

  return (
    <AbsoluteFill style={{ backgroundColor: "#020202", overflow: "hidden" }}>
      <Audio src={staticFile('audio/episode4/scene1_episode4.mp3')} />

      <AnamorphicWhipPan
        transitionStartFrame={WHIP_START}
        durationFrames={WHIP_DUR}
        caColorA="rgba(0, 229, 204, 0.20)"
        caColorB="rgba(255, 51, 51, 0.25)"
        flareColor="rgba(255, 51, 51, 0.70)"
        childrenA={
          <Sequence from={0} durationInFrames={WHIP_START + WHIP_DUR}>
            <True3DScene />
          </Sequence>
        }
        childrenB={
          <Sequence from={WHIP_START}>
            <ServerFarmScene />
          </Sequence>
        }
      />

      <DioramaOverlay />
      <GlobalTexture />
    </AbsoluteFill>
  );
};
