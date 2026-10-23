import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame, interpolate, Easing, interpolateColors, spring } from 'remotion';
import { NewsChyron } from '../Episode3/TheHook';

export const Scene3Content: React.FC = () => {
  const frame = useCurrentFrame();

  // ── CUT TIMINGS ──
  const M_CUT_2 = 94; // Exactly 00:59.04
  const M_CUT_3 = 205;
  const HUD2_EXIT = 370;

  const MARIYA_REVEAL_SNAP = 377; // Exactly 01:08.17 (After HUD fully clears screen)
  const M_CUT_4 = MARIYA_REVEAL_SNAP; // Sync pose cut so the snap is visible!
  const MAZEN_ENTER = 460; // Spatial Pan delayed significantly (20 frames) for Mariya to finish phrase and breathe
  const Z_CUT_2 = 510; // Exactly 01:13.00 in the master timeline
  const Z_CUT_3 = 545; // Exactly 01:14.05 in the master timeline
  const HUD_ENTER = 109; // Microsoft Studio HUD enters at 00:59.19
  const HUD_EXIT = 200; // Exits exactly at 01:02.20
  const HUD2_ENTER = 211; // Red Terminated HUD enters at 01:03.01

  // ── 3D SPATIAL CAMERA PAN (Mariya -> Mazen) ──
  // The camera breathes slowly, then violently pans at frame 375 when Mazen speaks.
  const spatialPan = spring({
    frame: Math.max(0, frame - MAZEN_ENTER),
    fps: 30,
    config: { damping: 14, stiffness: 120 }
  });

  // ── Z-AXIS HUD TAKEOVER ──
  const uiWhipIn = spring({ frame: Math.max(0, frame - HUD2_ENTER), fps: 30, config: { damping: 14, stiffness: 120 } });
  const uiWhipOut = spring({ frame: Math.max(0, frame - HUD2_EXIT), fps: 30, config: { damping: 14, stiffness: 120 } });
  const uiWhipProgress = uiWhipIn - uiWhipOut;

  // ── TRUE 3D CAMERA ENGINE (Smooth Cinematic Plunge over Pose 2 & 3) ──
  // A beautiful, continuous camera push that starts at Pose 2 and accelerates smoothly to the very last frame.
  const diveProgress = interpolate(frame, [Z_CUT_2, 678], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic)
  });

  // Z-Axis Cinematic Push: The background breathes slowly during Mariya's segment, 
  // then aggressively parallaxes WITH the 3D camera dive during Mazen's segment to sell maximum depth!
  const bgBreatheX = interpolate(frame, [0, 600], [0, -60], { extrapolateRight: 'clamp' });
  const bgDivePanX = interpolate(diveProgress, [0, 1], [0, 200]); // Moves right as camera moves left
  const bgArcPanX = Math.sin(diveProgress * Math.PI) * -50; // Moves left as camera arcs right
  const bgX = bgBreatheX + bgDivePanX + bgArcPanX;

  const baseScale = interpolate(frame, [0, 600], [1.3, 1.4], { extrapolateRight: 'clamp' });
  const spatialZoom = interpolate(spatialPan, [0, 0.5, 1], [0, 0.25, 0]); // Camera dives forward during Mariya's pan
  const diveZoom = interpolate(diveProgress, [0, 1], [0, 0.6]); // Deep push into the background during Mazen's dive
  const bgScale = baseScale + spatialZoom + diveZoom;

  // Dynamic Reactive Motion Blur (Environmental breathing + Heavy Spatial Blur during Pan)
  const baseBlur = interpolate(frame, [0, 30, 600], [8, 4, 4], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const panVelocity = Math.sin(spatialPan * Math.PI); // Peaks at 1 in the middle of the spring
  const spatialBlur = interpolate(panVelocity, [0, 1], [0, 30]);

  // Gradual background blur that matches the exact fade-in of the Microsoft HUD
  const hudBlur = interpolate(frame, [HUD_ENTER, HUD_ENTER + 20, HUD_EXIT - 20, HUD_EXIT], [0, 12, 12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const diveBlur = interpolate(Math.sin(diveProgress * Math.PI), [0, 1], [0, 15]); // Reduced to 15px for a more subtle optical response
  const finalBgBlur = baseBlur + spatialBlur + hudBlur + diveBlur;

  // ── TONE ENGINE (Color Math) ──
  // Replaced CSS transition with deterministic frame-synced interpolation to prevent Remotion rendering flicker
  const toneColor = interpolateColors(
    frame,
    [
      0, M_CUT_2 - 4, M_CUT_2, 
      HUD2_ENTER - 4, HUD2_ENTER, 
      M_CUT_4 - 4, M_CUT_4, 
      MAZEN_ENTER - 4, MAZEN_ENTER, 
      Z_CUT_2 - 4, Z_CUT_2, 
      Z_CUT_3 - 4, Z_CUT_3, 
      2000 // Safely out of bounds
    ],
    [
      '#FF0055', '#FF0055', '#00E5CC', 
      '#00E5CC', '#FF3333', 
      '#FF3333', '#550011', 
      '#550011', '#00E5CC', 
      '#00E5CC', '#005566', 
      '#005566', '#001122', 
      '#001122'
    ]
  );

  const toneOpacity = interpolate(spatialPan, [0, 1], [0.35, 0.45]); // Darkens slightly for Mazen's segment

  // ── CHARACTER POSES (Mariya) ──
  // Anchor Rule: Mariya starts Left, moves Right to open space for UI, then back Left.
  const mShift1 = spring({ frame: Math.max(0, frame - M_CUT_2), fps: 30, config: { damping: 14, stiffness: 120 } });
  const mShift2 = spring({ frame: Math.max(0, frame - M_CUT_3), fps: 30, config: { damping: 14, stiffness: 120 } });
  const mShift3 = spring({ frame: Math.max(0, frame - M_CUT_4), fps: 30, config: { damping: 14, stiffness: 120 } });

  const mariyaInteractX = interpolate(mShift1, [0, 1], [0, 450])
    + interpolate(mShift2, [0, 1], [0, -450])
    + interpolate(mShift3, [0, 1], [0, -200]); // Pushes Pose 4 slightly further left

  // Z-Axis Exit: Instead of sliding off screen, she physically steps backwards into the shadow.
  // Parallax drifts her violently off-screen left to ensure she doesn't linger behind Mazen
  const mariyaX = mariyaInteractX + interpolate(spatialPan, [0, 1], [0, -2500]); // Thrown into the next dimension

  const isRevealDistortion = frame >= MARIYA_REVEAL_SNAP && frame < MARIYA_REVEAL_SNAP + 5;

  // 5-Frame Stop Motion Lens Distortion Pop & Blur exactly at reveal
  const lensDistortion = isRevealDistortion ? 1.05 : 1.0;
  const revealBlur = isRevealDistortion ? 15 : 0;

  const mariyaScale = interpolate(spatialPan, [0, 1], [1.0, 0.85]) * lensDistortion;
  const mariyaBrightness = interpolate(spatialPan, [0, 0.7], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }); // Clamped to prevent invalid negative CSS values

  const currentMariyaPose = frame < M_CUT_2 ? 'mariya-pose1-scene3.png'
    : frame < M_CUT_3 ? 'mariya-pose2-scene3.png'
      : frame < M_CUT_4 ? 'mariya-pose3-scene3.png'
        : 'mariya-pose4-scene3.png';

  // ── CHARACTER POSES (Mazen) ──
  // Anchor Rule: Mazen starts Right, steps Left to interact with UI, then turns back Right.
  const zShift1 = spring({ frame: Math.max(0, frame - Z_CUT_2), fps: 30, config: { damping: 14, stiffness: 120 } });
  const zShift2 = spring({ frame: Math.max(0, frame - Z_CUT_3), fps: 30, config: { damping: 14, stiffness: 120 } });
  const mazenInteractX = interpolate(zShift1, [0, 1], [0, -150]) + interpolate(zShift2, [0, 1], [0, 150]); // Moderate step-in

  // Scale starts exactly at 1.0 (baseline) so his head meets the top and his body meets the bottom.
  const mazenScale = interpolate(spatialPan, [0, 1], [1.0, 1.03]);
  const mazenBrightness = interpolate(spatialPan, [0, 1], [0.1, 1.1]); // Steps out of dark
  const mazenX = interpolate(spatialPan, [0, 1], [-400, 50]) + mazenInteractX; // Base position nudged just 50px right

  const currentMazenPose = frame < Z_CUT_2 ? 'mazen-pose1-scene3.png'
    : frame < Z_CUT_3 ? 'mazen-pose2-scene3.png'
      : 'mazen-pose3-scene3.png';

  // ── CHROMATIC ABERRATION (RGB SPLIT) ON CUTS ──
  const cuts = [M_CUT_2, M_CUT_3, M_CUT_4, MAZEN_ENTER, Z_CUT_2, Z_CUT_3];
  // CRITICAL FIX: Sync M_CUT_4 to exactly 5 frames to match the 5-frame radial blur/lens distortion window
  const isCut = cuts.some(c => frame - c >= 0 && frame - c < (c === M_CUT_4 ? 5 : 4)); 
  
  const caX = isCut ? Math.sin(frame * 45) * 80 : 0; // STANDARD: 80 strength (not 40)

  const textPanExit = interpolate(spatialPan, [0, 1], [0, -1500]); // Thrown off screen
  const textPanBlur = interpolate(spatialPan, [0, 0.5, 1], [0, 40, 60], { extrapolateRight: 'clamp' });

  // Z-axis physically plunges forward into the HUD background.
  // 840px provides exactly 3.22x optical scale against the Z=-20 HUD to flawlessly fill the 1920x1080 canvas!
  const cameraZ = interpolate(diveProgress, [0, 1], [0, 840]);

  // Cinematic Camera Arc: The camera slightly sweeps to the RIGHT (showing off the charts) before plunging LEFT into the final 16:9 lock.
  const arcPanX = Math.sin(diveProgress * Math.PI) * 100;

  // X and Y physically translate to the exact absolute center coordinates of the Video partition!
  // Tweaked by precision offsets to guarantee all borders overflow off-screen perfectly.
  const cameraX = interpolate(diveProgress, [0, 1], [0, -427]) + arcPanX;
  const cameraY = interpolate(diveProgress, [0, 1], [0, -152]);

  // Mazen is smoothly pushed 1400px to the right so he naturally clears the lens over the dive
  const mazenDivePushX = interpolate(diveProgress, [0, 1], [0, 1400], { extrapolateRight: 'clamp' });

  // Mazen fades out right as he exits the screen to prevent clipping
  const mazenDiveOpacity = interpolate(cameraZ, [300, 800], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const mazenDiveBlur = interpolate(cameraZ, [100, 800], [0, 25], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }); // Reduced to 25px

  return (
    <AbsoluteFill style={{ backgroundColor: '#020202', overflow: 'hidden' }}>

      {/* ── BASE HARFEN STUDIO LAYER (With Parallax & Depth) ── */}
      <AbsoluteFill style={{
        transform: `scale(${bgScale}) translateX(${bgX}px) translateZ(0)`,
        transformOrigin: "center center",
        willChange: "transform",
        pointerEvents: 'none'
      }}>
        <img
          src={staticFile('images/episode4/scene-3/harfen-studio.jpeg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: `blur(${finalBgBlur}px) grayscale(0.5) sepia(0.4) contrast(1.3) brightness(0.9)`,
            willChange: 'filter'
          }}
        />

        {/* ── MICROSOFT STUDIO WALL HUD (Projected behind Mariya) ── */}
        {frame >= HUD_ENTER && frame <= HUD_EXIT && (
          <div style={{
            position: 'absolute',
            left: '15%',
            top: '20%', // Nudged slightly down from 18%
            width: '40%',
            height: '60%',
            boxSizing: 'border-box',
            opacity: interpolate(frame, [HUD_ENTER, HUD_ENTER + 20, HUD_EXIT - 20, HUD_EXIT], [0, 0.95, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            // Deep glass background (removed backdropFilter to prevent Chrome GPU crashes on 3D planes)
            background: 'linear-gradient(135deg, rgba(5, 15, 25, 0.95) 0%, rgba(0, 5, 10, 0.9) 100%)',
            border: '2px solid rgba(0, 164, 239, 0.4)', // MS Blue
            borderRadius: 40,
            padding: '40px',
            boxShadow: 'inset 0 0 80px rgba(0, 164, 239, 0.15), 0 40px 80px rgba(0, 0, 0, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            transform: 'perspective(1200px) rotateY(18deg) rotateX(2deg)',
          }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 30, borderBottom: '4px solid rgba(255,255,255,0.2)', paddingBottom: 25, width: '100%' }}>
              {/* OPTIMIZED VOLUMETRIC 3D LOGO (Restored Extrusion) */}
              <div style={{ position: 'relative', width: 100, height: 100, perspective: 800 }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${frame * 3}deg)`,
                }}>
                  {[...Array(8)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" style={{
                      position: 'absolute', inset: 0, width: 100, height: 100,
                      transform: `translateZ(${i * -2}px)`,
                      filter: i === 0 ? `drop-shadow(0 0 15px rgba(255,255,255,0.4))` : 'none',
                    }}>
                      <rect x="1" y="1" width="9" height="9" fill={i === 0 ? '#F25022' : '#B03000'} />
                      <rect x="11" y="1" width="9" height="9" fill={i === 0 ? '#7FBA00' : '#407000'} />
                      <rect x="1" y="11" width="9" height="9" fill={i === 0 ? '#00A4EF' : '#006090'} />
                      <rect x="11" y="11" width="9" height="9" fill={i === 0 ? '#FFB900' : '#B07000'} />
                    </svg>
                  ))}
                </div>
              </div>

              <div style={{
                color: '#FFF', fontSize: 110, fontWeight: 900, fontFamily: 'monospace', letterSpacing: -2,
                textShadow: '3px 3px 0px #222, 6px 6px 0px #000, 0 0 40px rgba(0, 164, 239, 0.4)'
              }}>
                MSFT<span style={{ fontSize: 50, opacity: 0.7 }}>.CORP</span>
              </div>
            </div>

            <div style={{
              color: '#FFF', fontSize: 45, fontFamily: "'Cairo', sans-serif", marginTop: 30, fontWeight: 900,
              // Blue Corporate drop shadow
              textShadow: '3px 3px 0px #003366, 6px 6px 0px #001133, 0 0 35px rgba(0, 164, 239, 0.8)',
              alignSelf: 'flex-end',
              direction: 'rtl'
            }}>
              بروتوكول تسريح العمالة
            </div>

            <div style={{ display: 'flex', gap: 20, marginTop: 25, width: '100%' }}>
              <div style={{ color: '#FFF', fontSize: 28, fontFamily: 'monospace', opacity: 0.7, fontWeight: 900 }}>TARGET:</div>
              <div style={{ color: '#00E5CC', fontSize: 28, fontFamily: 'monospace', fontWeight: 900, letterSpacing: 1, textShadow: '2px 2px 0px #004444, 0 0 20px #00E5CC' }}>ETHICS_&_SOCIETY</div>
            </div>

            <div style={{ display: 'flex', gap: 20, marginTop: 15, width: '100%' }}>
              <div style={{ color: '#FFF', fontSize: 28, fontFamily: 'monospace', opacity: 0.7, fontWeight: 900 }}>STATUS:</div>
              {/* Keep Terminated Red for pure impact! */}
              <div style={{ color: '#FF0055', fontSize: 28, fontFamily: 'monospace', fontWeight: 900, letterSpacing: 1, textShadow: '2px 2px 0px #501, 4px 4px 0px #200, 0 0 40px #FF0055' }}>TERMINATED_100%</div>
            </div>

            {/* Active Scanning Laser - Thinner & Magenta */}
            <div style={{ position: 'absolute', left: 0, width: '100%', height: 3, backgroundColor: '#FF0055', boxShadow: '0 0 30px 8px rgba(255, 0, 85, 0.8)', top: `${(frame * 1.5) % 100}%`, opacity: 0.9, zIndex: 10 }} />

            {/* Hex Data Stream - Cyan Tint */}
            <div style={{ marginTop: 'auto', fontSize: 20, color: '#00E5CC', opacity: 0.5, fontFamily: 'monospace', lineHeight: 1.6, fontWeight: 900, textShadow: '1px 1px 0px #002222', width: '100%' }}>
              <div>0x7A9B3F ... ALLOC_ERROR ... DISCONNECT</div>
              <div>0x11C4D2 ... NODE_OFFLINE ... TERMINATED</div>
              <div>0x99F1A3 ... PERMISSION_DENIED ... PURGED</div>
              <div>0x44B8E1 ... SOCKET_CLOSED ... END_OF_LINE</div>
            </div>
          </div>
        )}
      </AbsoluteFill>

      {/* ── TONE ENGINE ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: toneColor,
        mixBlendMode: 'multiply',
        opacity: toneOpacity,
        pointerEvents: 'none'
      }} />

      {/* ── MARIYA ── */}
      {frame < MAZEN_ENTER + 20 && ( // Ensure Mariya has time to slide fully off-screen
        <div style={{
          position: 'absolute', width: 1920, height: 1080, left: '50%', top: '50%', marginLeft: -960, marginTop: -540,
          transform: `translateX(${mariyaX}px) scale(${mariyaScale})`, transformOrigin: 'bottom center'
        }}>
          <div style={{ position: 'absolute', inset: 0, filter: `brightness(${mariyaBrightness}) drop-shadow(20px 20px 30px rgba(0,0,0,0.8))` }}>
            <img src={staticFile(`images/episode4/scene-3/${currentMariyaPose}`)}
              style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center', filter: `blur(${spatialBlur + revealBlur}px)` }} />

            {caX !== 0 && (
              <>
                <img src={staticFile(`images/episode4/scene-3/${currentMariyaPose}`)}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center', mixBlendMode: 'screen', filter: `blur(${spatialBlur + revealBlur}px) sepia(1) hue-rotate(-50deg) saturate(10) brightness(${mariyaBrightness})`, transform: `translateX(${-caX}px)` }} />
                <img src={staticFile(`images/episode4/scene-3/${currentMariyaPose}`)}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center', mixBlendMode: 'screen', filter: `blur(${spatialBlur + revealBlur}px) sepia(1) hue-rotate(130deg) saturate(10) brightness(${mariyaBrightness})`, transform: `translateX(${caX}px)` }} />
              </>
            )}
          </div>
        </div>
      )}

      {/* ── MARIYA FINAL PHRASE TEXT (Anchored Right with Magenta Glitch Line) ── */}
      {frame >= HUD2_EXIT && frame < MAZEN_ENTER + 10 && (() => {
        // Exactly mirrors Mazen's Scene 2 HUD CRT Collapse (but reversed to reveal!)
        const revealProgress = interpolate(frame, [HUD2_EXIT, HUD2_EXIT + 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

        // 0 to 0.4: Holds as a thin, extremely bright, stretched laser line
        // 0.4 to 1: Pops open into the full text box
        const revealScaleY = interpolate(revealProgress, [0, 0.4, 1], [0.02, 0.02, 1], { easing: Easing.out(Easing.cubic) });
        const revealScaleX = interpolate(revealProgress, [0, 0.4, 1], [2.5, 2.5, 1], { easing: Easing.out(Easing.cubic) });
        const revealBrightness = interpolate(revealProgress, [0, 0.4, 1], [5, 5, 1]);
        const revealOpacity = interpolate(revealProgress, [0, 0.2], [0, 1], { extrapolateRight: 'clamp' });

        return (
          <div style={{
            position: 'absolute',
            right: '8%', // Moved a touch to the right
            top: '40%',
            width: '38%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            direction: 'rtl',
            transformOrigin: 'center right',
            opacity: interpolate(spatialPan, [0, 0.3], [1, 0]) * revealOpacity,
            transform: `translateX(${textPanExit}px) scaleX(${revealScaleX}) scaleY(${revealScaleY})`,
            filter: `blur(${textPanBlur}px) brightness(${revealBrightness})`,
            willChange: 'transform, opacity, filter'
          }}>
            {/* The Glass Box (Squished into a laser initially!) */}
            <div style={{
              width: '100%',
              background: 'linear-gradient(135deg, rgba(15, 0, 5, 1) 0%, rgba(5, 0, 0, 1) 100%)', // Completely solid so Mariya doesn't show through
              borderRight: '6px solid #FF0055', // Changed to Mariya's signature Magenta
              // The glitch explosion remains Mariya's signature Magenta
              boxShadow: `0 30px 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(255, 0, 85, 0.15), 0 0 ${interpolate(revealProgress, [0, 0.4, 1], [150, 150, 0])}px #FF0055`,
              borderRadius: '20px 0 0 20px',
              padding: '40px 50px',
              overflow: 'hidden' // Keeps the squished text inside the laser
            }}>
              <div style={{ color: '#FF0055', fontSize: 34, fontFamily: 'monospace', letterSpacing: 3, marginBottom: 20, fontWeight: 900 }}>
                // DIRECTIVE_OVERRIDE
              </div>
              <div style={{ color: '#FFF', fontSize: 65, fontWeight: 900, fontFamily: "'Cairo', sans-serif", lineHeight: 1.4, textShadow: '0 10px 30px rgba(0,0,0,0.9)' }}>
                للأسف السرعة أهم من الأمان حالياً
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── TRUE 3D CAMERA ENGINE WRAPPER ── */}
      <div style={{ position: 'absolute', inset: 0, perspective: 1200, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, transformStyle: 'preserve-3d',
          transform: `translateZ(${cameraZ}px) translateX(${-cameraX}px) translateY(${-cameraY}px)`,
          willChange: 'transform'
        }}>

          {/* ── LAYER 1.5: HOLOGRAM UI (Behind Mazen, pushed back slightly to prevent Z-fighting) ── */}
          {frame >= MAZEN_ENTER && (
            <div style={{
              position: 'absolute', width: 1920, height: 1080, left: '50%', top: '50%', marginLeft: -960, marginTop: -540,
              transform: `translateZ(-20px) scale(1.02)` // Pushed back slightly, scaled up to remain optically 1.0x!
            }}>
              <CorporateMergerHUD frame={frame} enterFrame={MAZEN_ENTER + 10} diveStart={Z_CUT_3} textStartFrame={552} />
            </div>
          )}

          {/* ── MAZEN (Frames 375 - 588) ── */}
          {frame >= MAZEN_ENTER && (
            <div style={{
              position: 'absolute', width: 1920, height: 1080, left: '50%', top: '50%', marginLeft: -960, marginTop: -540,
              // We bind his Z depth to the camera so the lens NEVER passes him as it pushes forward!
              transform: `translateX(${mazenX + mazenDivePushX}px) translateZ(${cameraZ + 20}px) scale(${mazenScale})`, transformOrigin: 'bottom center',
              opacity: mazenDiveOpacity
            }}>
              <div style={{ position: 'absolute', inset: 0, filter: `brightness(${mazenBrightness}) drop-shadow(20px 20px 30px rgba(0,0,0,0.8))` }}>
                <img src={staticFile(`images/episode4/scene-3/${currentMazenPose}`)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center', filter: `blur(${mazenDiveBlur}px)` }} />

                {caX !== 0 && (
                  <>
                    <img src={staticFile(`images/episode4/scene-3/${currentMazenPose}`)}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center', mixBlendMode: 'screen', filter: `blur(${mazenDiveBlur}px) sepia(1) hue-rotate(-50deg) saturate(10) brightness(${mazenBrightness})`, transform: `translateX(${-caX}px)` }} />
                    <img src={staticFile(`images/episode4/scene-3/${currentMazenPose}`)}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center', mixBlendMode: 'screen', filter: `blur(${mazenDiveBlur}px) sepia(1) hue-rotate(130deg) saturate(10) brightness(${mazenBrightness})`, transform: `translateX(${caX}px)` }} />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── LAYER 3: RED TERMINATED HUD (Full-Screen Takeover) ── */}
      {frame >= HUD2_ENTER && frame < HUD2_EXIT + 30 && (
        <div style={{ position: 'absolute', width: 1920, height: 1080, left: '50%', top: '50%', marginLeft: -960, marginTop: -540 }}>
          <EthicsTeamUI frame={frame} enterFrame={HUD2_ENTER} exitFrame={HUD2_EXIT} />
        </div>
      )}



      {/* POST-PROCESSING: Global Halftone / Film Grain Texture & Vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1000, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.12, mixBlendMode: 'multiply',
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1001, pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(10,5,5,0.6) 100%)',
        mixBlendMode: 'multiply',
      }} />

    </AbsoluteFill>
  );
};

// ── SUBCOMPONENTS: HOLOGRAM UI (Cinematic Hologram Court Style) ──

const EthicsTeamUI: React.FC<{ frame: number, enterFrame: number, exitFrame: number }> = ({ frame, enterFrame, exitFrame }) => {
  const enterSpring = spring({ frame: Math.max(0, frame - enterFrame), fps: 30, config: { damping: 14, stiffness: 120 } });
  const exitSpring = spring({ frame: Math.max(0, frame - exitFrame), fps: 30, config: { damping: 14, stiffness: 120 } });

  const flightProgress = enterSpring - exitSpring;

  // Massive 16:9 Full-Screen Crash Zoom! 
  const scale = interpolate(flightProgress, [0, 1], [3.5, 1.0]);

  // Hard geometric snap instead of a mushy cross-dissolve! Stays solid until the very end.
  const opacity = interpolate(flightProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Violent radial motion blur during the exit
  const exitBlur = interpolate(exitSpring, [0, 0.6, 1], [0, 0, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // CRITICAL FIX: Keep the heavy background 100% solid for 85% of the crash-zoom so it stays punchy.
  // Then snap it to 0 opacity right before it hits the camera lens to prevent the black shadow anomaly!
  const bgOpacity = interpolate(exitSpring, [0, 0.85, 0.95, 1], [1, 1, 0, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const MAGENTA = '#FF0055';
  const RED = '#FF3333';

  // ── ANIMATION TIMELINE (Accelerated 2x) ──
  const localFrame = Math.max(0, frame - enterFrame);
  const HEADSHOT_START = 15;
  const HEADSHOT_STAGGER = 10;
  const TITLE_START = HEADSHOT_START + (4 * HEADSHOT_STAGGER) + 10; // 65
  const SUBTITLE_START = TITLE_START + 15; // 80
  const SLAM_START = SUBTITLE_START + 10; // 90

  return (
    <div style={{
      // Perfect 1920x1080 coverage with no edge clipping
      position: 'absolute', left: 0, top: 0, width: 1920, height: 1080,
      transform: `scale(${scale}) translateZ(0)`, // Pure 2D scale to perfectly lock into screen borders
      opacity, zIndex: 50,
      filter: `blur(${exitBlur}px)`, // Applies the violent motion blur on exit
      willChange: 'transform, opacity, filter', transformOrigin: 'center center',
      backfaceVisibility: 'hidden'
    }}>
      {/* MASSIVE 16:9 VOLUMETRIC CONTAINER */}
      <div style={{
        width: '100%', height: '100%',
        overflow: 'hidden', padding: "80px 100px",
        position: 'relative', display: 'flex', flexDirection: 'column',
        direction: 'rtl' // Proper Arabic UI Layout
      }}>
        {/* HEAVY BACKGROUND LAYER: Stays solid for impact, snaps out before hitting the lens */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(circle at center, rgba(30, 0, 10, 0.95) 0%, rgba(5, 0, 0, 0.99) 100%),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,85,0.03) 2px, rgba(255,0,85,0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,0,85,0.03) 2px, rgba(255,0,85,0.03) 4px)
          `,
          backgroundColor: '#050000',
          boxShadow: `inset 0 0 150px rgba(255, 51, 51, 0.4)`,
          opacity: bgOpacity,
          zIndex: -1
        }} />
        {/* CRT Scanline Overlay & Screen Glare */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 2px, transparent 2px, transparent 4px)', mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 100 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 40%)', pointerEvents: 'none', zIndex: 90 }} />

        {/* ── KINETIC TYPOGRAPHY TITLE & SLAM ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 60 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 25 }}>
            {['فريق', 'أخلاقيات', 'الذكاء', 'الاصطناعي'].map((word, wIdx) => {
              const wordSpring = spring({ frame: Math.max(0, localFrame - (TITLE_START + wIdx * 5)), fps: 30, config: { damping: 12 } });
              const wY = interpolate(wordSpring, [0, 1], [50, 0]);
              const wOp = interpolate(wordSpring, [0, 1], [0, 1]);
              return (
                <div key={wIdx} style={{
                  color: RED, fontSize: 110, fontWeight: 900, fontFamily: "'Cairo', sans-serif",
                  textShadow: `0 0 50px ${RED}`, lineHeight: 1.1,
                  transform: `translateY(${wY}px)`, opacity: wOp
                }}>
                  {word}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 25, height: 90 }}>
            <div style={{
              color: '#FFF', fontSize: 60, fontWeight: 700, fontFamily: "'Cairo', sans-serif",
              opacity: interpolate(localFrame, [SUBTITLE_START, SUBTITLE_START + 10], [0, 1], { extrapolateRight: 'clamp' })
            }}>
              الحالة:
            </div>
            {localFrame >= SLAM_START && (() => {
              // Premium Heavy Slam
              const slamSpring = spring({ frame: localFrame - SLAM_START, fps: 30, config: { mass: 1.5, damping: 18, stiffness: 220 } });
              const slamScale = interpolate(slamSpring, [0, 1], [5, 1]);
              const slamOp = interpolate(slamSpring, [0, 0.2, 1], [0, 1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

              // Cinematic directional motion blur restored! 
              const slamBlur = interpolate(slamSpring, [0, 0.8, 1], [25, 5, 0], { extrapolateRight: 'clamp' });

              return (
                <div style={{ position: 'relative', display: 'inline-block', width: 450, height: 100 }}>
                  {/* LAYER 1: The heavy text shadows (NO BLUR applied here to save GPU and prevent jitter) */}
                  <span style={{
                    position: 'absolute', inset: 0,
                    color: 'transparent', textShadow: `0 0 40px ${MAGENTA}, 0 0 80px ${MAGENTA}`, fontSize: 75, fontWeight: 900, fontFamily: "'Cairo', sans-serif",
                    transform: `scale(${slamScale})`, opacity: slamOp,
                  }}>
                    مفصول بالكامل
                  </span>

                  {/* LAYER 2: The actual text with Motion Blur (Fast GPU rendering) */}
                  <span style={{
                    position: 'absolute', inset: 0,
                    color: MAGENTA, fontSize: 75, fontWeight: 900, fontFamily: "'Cairo', sans-serif",
                    transform: `scale(${slamScale})`, opacity: slamOp,
                    filter: `blur(${slamBlur}px)`
                  }}>
                    مفصول بالكامل
                  </span>
                </div>
              )
            })()}
          </div>
        </div>

        {/* ── SEQUENTIAL HEADSHOT CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, flex: 1, zIndex: 10 }}>
          {[1, 2, 3, 4].map((i, index) => {
            const cardStart = HEADSHOT_START + (index * HEADSHOT_STAGGER);
            const streakStart = cardStart + 6; // Streak happens much faster after card pops

            // Snappier, aggressive card reveal physics
            const cardSpring = spring({ frame: Math.max(0, localFrame - cardStart), fps: 30, config: { damping: 10, stiffness: 250 } });
            
            // Hard snap at the end of the spring to MATHEMATICALLY DESTROY sub-pixel font hinting jitter
            const cardScaleRaw = interpolate(cardSpring, [0, 1], [0.4, 1]);
            const cardScale = cardScaleRaw > 0.995 ? 1 : cardScaleRaw;
            
            const cardRotateRaw = interpolate(cardSpring, [0, 1], [-15, 0]); // Slams in with a rotation
            const cardRotate = Math.abs(cardRotateRaw) < 0.1 ? 0 : cardRotateRaw;

            const cardOpacity = interpolate(cardSpring, [0, 0.4, 1], [0, 1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

            const streakSpring = spring({ frame: Math.max(0, localFrame - streakStart), fps: 30, config: { damping: 16, stiffness: 200 } });
            const streakScaleX = interpolate(streakSpring, [0, 1], [0, 1.2]); // Draws across aggressively

            return (
              <div key={i} style={{
                background: 'linear-gradient(135deg, rgba(40, 0, 10, 0.8) 0%, rgba(10, 0, 0, 0.9) 100%)',
                border: `2px solid rgba(255,0,85,0.5)`,
                boxShadow: `0 15px 35px rgba(0,0,0,0.9), inset 0 0 25px rgba(255,0,85,0.25)`,
                borderRadius: 30, padding: 35, display: 'flex', alignItems: 'center', gap: 35,
                position: 'relative', overflow: 'hidden',
                opacity: cardOpacity, 
                // CRITICAL FIX: Truncating decimals prevents sub-pixel font re-hinting jitter
                transform: `scale(${cardScale.toFixed(3)}) rotate(${cardRotate.toFixed(2)}deg)`
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,0,85,0.1)', zIndex: 10 }} />
                
                {/* Animated Strike-through 
                    CRITICAL FIX: Animating scaleX instead of width prevents layout thrashing and font re-hinting jitter! */}
                <div style={{
                  position: 'absolute', top: '50%', right: '-10%', height: 12, background: MAGENTA,
                  width: '100%',
                  transform: `rotate(12deg) scaleX(${streakScaleX})`, transformOrigin: 'right center',
                  willChange: 'transform',
                  zIndex: 11, boxShadow: `0 0 35px ${MAGENTA}`
                }} />

                <img src={staticFile(`images/episode4/scene-3/headshot${i}.png`)} style={{ width: 220, height: 220, borderRadius: 20, objectFit: 'cover', filter: 'grayscale(1) contrast(1.2)', zIndex: 5 }} />
                <div style={{ zIndex: 5, backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
                  <div style={{ color: '#FFF', fontSize: 40, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 3 }}>MSFT-{84920 + i}</div>
                  <div style={{ color: RED, fontSize: 38, fontWeight: 700, fontFamily: "'Cairo', sans-serif" }}>تم إلغاء التصريح</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const VoiceEqualizer: React.FC<{ frame: number; activeFrame: number }> = ({ frame, activeFrame }) => {
  const isActive = frame >= activeFrame;
  const MAGENTA = "#FF0055";
  const CYAN = "#00E5CC";

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 200, paddingBottom: 20 }}>
      {new Array(10).fill(0).map((_, i) => {
        // Pseudo-random high-frequency vibration synced to the voiceover timing
        const height = isActive ? 20 + Math.abs(Math.sin((frame + i * 15) * 0.7) * Math.cos((frame - i * 5) * 0.4) * 160) : 10;
        return (
          <div key={i} style={{
            width: 10,
            height,
            backgroundColor: i % 2 === 0 ? CYAN : MAGENTA,
            borderRadius: 5,
            boxShadow: `0 0 15px ${i % 2 === 0 ? CYAN : MAGENTA}`
          }} />
        )
      })}
    </div>
  )
}

const AnimatedChart: React.FC<{ frame: number; activeFrame: number }> = ({ frame, activeFrame }) => {
  const progress = spring({ frame: Math.max(0, frame - activeFrame), fps: 30, config: { damping: 100, stiffness: 40, mass: 3 } });

  // A beautiful exponential curve for Profits
  const pathData1 = "M 0 250 C 100 250, 150 150, 250 100 S 350 50, 400 20";
  // A volatile jagged line for Layoffs/Anger
  const pathData2 = "M 0 280 L 80 260 L 120 200 L 180 230 L 250 120 L 320 160 L 400 50";

  // Text labels pop in sequentially 20 frames earlier
  const textPop1 = spring({ frame: Math.max(0, frame - 575), fps: 30, config: { damping: 14, stiffness: 120 } });
  const textPop2 = spring({ frame: Math.max(0, frame - 585), fps: 30, config: { damping: 14, stiffness: 120 } });

  return (
    <div style={{ width: 400, height: 300, position: 'relative', borderLeft: '2px solid rgba(0,229,204,0.3)', borderBottom: '2px solid rgba(0,229,204,0.3)' }}>
      {/* Holographic Grid lines */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,229,204,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,204,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <svg width="400" height="300" viewBox="0 0 400 300" style={{ position: 'absolute', inset: 0 }}>
        {/* Record Profits Line */}
        <path d={pathData1} fill="none" stroke="#00E5CC" strokeWidth="6"
          strokeDasharray="1000" strokeDashoffset={1000 - (progress * 1000)}
          style={{ filter: 'drop-shadow(0 0 12px #00E5CC)' }} />

        {/* Worker Anger Line */}
        <path d={pathData2} fill="none" stroke="#FF0055" strokeWidth="4"
          strokeDasharray="1000" strokeDashoffset={1000 - (progress * 1000)}
          style={{ filter: 'drop-shadow(0 0 12px #FF0055)' }} />
      </svg>

      {/* Chart Labels */}
      <div style={{ position: 'absolute', top: -42, right: 0, filter: `blur(${interpolate(textPop1, [0, 1], [20, 0], { extrapolateRight: 'clamp' })}px)` }}>
        <div style={{
          color: '#00E5CC', fontFamily: "'Cairo', sans-serif", fontSize: 30, fontWeight: '900',
          textShadow: '0 0 15px rgba(0,229,204,0.8)',
          opacity: textPop1, transform: `translateY(${interpolate(textPop1, [0, 1], [15, 0])})`
        }}>
          +9,402% YOY
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: -56, right: 0, filter: `blur(${interpolate(textPop2, [0, 1], [20, 0], { extrapolateRight: 'clamp' })}px)` }}>
        <div style={{
          color: '#FF0055', fontFamily: "'Cairo', sans-serif", fontSize: 44, fontWeight: '900',
          textShadow: '0 0 15px rgba(255,0,85,0.8)',
          opacity: textPop2, transform: `translateY(${interpolate(textPop2, [0, 1], [-15, 0])})`
        }}>
          خطر الإضراب: حرج
        </div>
      </div>
    </div>
  )
}


const StrikeLiveEffects: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>

      {/* ── UNIFIED SYSTEM: RUSTY GOLDEN RETRO FILM DAMAGE ── */}

      {/* 1. Rusty Golden Halo / Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle, transparent 40%, rgba(80, 40, 0, 0.8) 100%)',
        mixBlendMode: 'multiply'
      }} />

      {/* 2. Barely-there CRT Scanlines dedicated to the video feed */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1.5px, transparent 1.5px, transparent 3px)',
        mixBlendMode: 'overlay',
        opacity: 0.2
      }} />

      {/* 3. Rolling Golden Signal Damage / Jitter */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: '15%',
        background: 'linear-gradient(to bottom, transparent, rgba(255, 180, 50, 0.15), transparent)',
        top: `${(frame * 5) % 120}%`, // Rolls down quickly
        filter: 'blur(4px)',
        mixBlendMode: 'screen',
        opacity: Math.sin(frame * 0.5) > 0 ? 0.7 : 0.2
      }} />

      {/* ── LIVE ACTION EFFECTS ── */}

      {/* 4. Pulsing Fire/Flare Glow (Bottom Left) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 30% 120%, rgba(255, 60, 0, 0.8) 0%, transparent 60%)',
        mixBlendMode: 'color-dodge',
        opacity: 0.6 + Math.sin(frame * 0.8) * 0.3 + Math.random() * 0.1
      }} />

      {/* 5. Pulsing Siren Glow (Top Right) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 80% 0%, rgba(255, 0, 85, 0.5) 0%, transparent 50%)',
        mixBlendMode: 'screen',
        opacity: Math.sin(frame * 0.2) > 0 ? 0.8 : 0.2
      }} />

      {/* 6. Floating Embers/Sparks (Reduced heavily to 5) */}
      {new Array(5).fill(0).map((_, i) => {
        // Frame-driven looping math for sparks floating upwards
        const startY = 340 + (i * 20); // start off screen bottom
        const speed = 1.5 + (i % 3);
        const floatY = (startY - (frame * speed)) % 400; // Loops every 400px

        // Wrap floatY so it resets properly without snapping
        const actualY = floatY < -20 ? 360 + floatY : floatY;
        const driftX = Math.sin((frame + i * 50) * 0.05) * 30; // Side-to-side drift

        return (
          <div key={i} style={{
            position: 'absolute',
            left: 20 + (i * 110) + driftX, // Spread very wide to account for only 5 particles
            top: actualY,
            width: 3 + (i % 3),
            height: 3 + (i % 3),
            backgroundColor: '#FF8800',
            borderRadius: '50%',
            boxShadow: '0 0 10px 3px rgba(255,100,0,0.8)',
            opacity: Math.max(0.1, Math.sin((frame + i * 20) * 0.2)),
            mixBlendMode: 'screen'
          }} />
        )
      })}
    </div>
  )
}

const CorporateMergerHUD: React.FC<{ frame: number; enterFrame: number; diveStart: number; textStartFrame: number }> = ({ frame, enterFrame, diveStart, textStartFrame }) => {
  const localFrame = Math.max(0, frame - enterFrame);

  // HUD background fades in
  const enterSpring = spring({ frame: localFrame, fps: 30, config: { damping: 14, stiffness: 120 } });

  // ── CAMERA DIVE TRANSITION ──
  // The HUD now STAYS VISIBLE through Pose 3 so Mazen can deliver his line in front of the massive strike footage!
  const diveSpring = spring({ frame: Math.max(0, frame - diveStart), fps: 30, config: { damping: 20, stiffness: 60 } });

  const CYAN = "#00E5CC";
  const MAGENTA = "#FF0055";

  // Text Animation Timing - Hard locked to the 01:14:12 audio beat
  const text1Spring = spring({ frame: Math.max(0, frame - textStartFrame), fps: 30, config: { damping: 12, stiffness: 150 } });
  const text2Spring = spring({ frame: Math.max(0, frame - (textStartFrame + 8)), fps: 30, config: { damping: 12, stiffness: 150 } });

  // Exact Timestamp Mapping: 01:17:04 (2314 global frames) -> 634 local frames
  const typeStartFrame = 634;

  // Sequential fade-in for the "Recorded Broadcast" pill perfectly timed right before typing starts
  const tagPillOpacity = interpolate(frame, [typeStartFrame - 15, typeStartFrame], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Hardcore Typewriter Effect starts EXACTLY at 01:17.04
  const textStr = "بث مسجل // اضطرابات عالمية";
  const typingFrame = Math.max(0, frame - typeStartFrame);
  const charsToShow = Math.min(textStr.length, Math.floor(typingFrame * 1.5)); // Types 1.5 characters per frame
  const displayedText = textStr.slice(0, charsToShow);

  return (
    <div style={{
      position: 'absolute', width: 1400, height: 800, left: '50%', top: '50%', marginLeft: -700, marginTop: -400,
      opacity: interpolate(enterSpring, [0, 1], [0, 1]), // Opaque forever!
      transform: `translate(-100.5px, -0.5px)`, // Pushed 0.5px left and 0.5px up for sub-pixel precision
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      {/* EXACT SCENE 1 PROJECTOR HUD MASSIVE CONTAINER */}
      <div style={{
        border: `2px solid rgba(0,229,204,0.6)`, borderRadius: 40,
        background: "rgba(0, 15, 25, 0.75)", overflow: 'hidden',
        boxShadow: `0 0 150px rgba(0,229,204,0.3), inset 0 0 50px rgba(0,229,204,0.1)`,
        position: 'relative', width: '100%', height: '100%',
      }}>
        {/* CRT Noise Overlay on the entire massive UI */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 2px, transparent 2px, transparent 4px)', pointerEvents: 'none', zIndex: 5 }} />

        {/* ── LEFT SIDE: VIDEO PARTITION & TEXT ── */}
        <div style={{ position: 'absolute', left: 80, top: 80, width: 600, height: '100%', display: 'flex', flexDirection: 'column', gap: 40, zIndex: 10 }}>

          {/* The Video Window */}
          <div style={{
            width: '100%', height: 340,
            border: `2px solid rgba(0,229,204,0.6)`, borderRadius: 20,
            background: "rgba(0, 5, 10, 0.9)", overflow: 'hidden',
            boxShadow: `0 0 50px rgba(0,229,204,0.2), inset 0 0 30px rgba(0,229,204,0.2)`,
            position: 'relative'
          }}>
            {/* Protesting/Strike Footage Background */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.9 }}>
              <img
                src={staticFile('images/episode4/scene-3/strike-footage.png')}
                style={{
                  width: '120%', height: '120%', objectFit: 'cover',
                  // Handheld/chaotic slow pan to simulate live B-Roll
                  transform: `scale(${interpolate(diveSpring, [0, 1], [1, 1.2])}) translateX(${interpolate(localFrame, [0, 200], [0, -30])}px) translateY(${interpolate(localFrame, [0, 200], [0, -10])}px)`,
                  filter: 'contrast(1.3) brightness(0.8) saturate(1.2)'
                }}
              />
            </div>

            {/* INJECT DYNAMIC LIVE FEED EFFECTS (Fire, Smoke, Sparks) */}
            <StrikeLiveEffects frame={frame} />

            <div style={{
              position: 'absolute', top: 20, left: 20, display: 'flex', gap: 12, alignItems: 'center', zIndex: 10,
              direction: 'rtl', // Forces correct right-to-left typing for Arabic!
              background: `rgba(0,0,0,${tagPillOpacity * 0.7})`, padding: '6px 16px', borderRadius: 20, border: `1px solid rgba(255,0,85,${tagPillOpacity * 0.3})`,
              backdropFilter: `blur(${tagPillOpacity * 4}px)`, boxShadow: `0 10px 20px rgba(0,0,0,${tagPillOpacity * 0.8})`,
              minWidth: 260, minHeight: 40 // Hardcoded bounds so the pill doesn't grow/shrink violently while typing
            }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: MAGENTA, opacity: charsToShow > 0 && Math.floor(frame / 15) % 2 === 0 ? 1 : 0, boxShadow: `0 0 10px ${MAGENTA}`, flexShrink: 0 }} />
              <div style={{ color: '#FFF', fontFamily: "'Cairo', sans-serif", fontSize: 18, fontWeight: '900', letterSpacing: 1, textShadow: '0 2px 4px #000' }}>
                {displayedText}
              </div>
            </div>
          </div>

          {/* Voice Over Punchy Text */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 15, zIndex: 10 }}>
            <div style={{ filter: `blur(${interpolate(text1Spring, [0, 1], [20, 0], { extrapolateRight: 'clamp' })}px)` }}>
              <h1 style={{
                color: "#FFF", fontSize: 100, fontWeight: 900, fontFamily: "'Cairo', sans-serif",
                textShadow: `6px 6px 0px #000, 0 0 40px ${MAGENTA}`, margin: 0,
                transform: `translateX(${interpolate(text1Spring, [0, 1], [-50, 0])}) scale(${interpolate(text1Spring, [0, 1], [0.9, 1])})`,
                opacity: text1Spring
              }}>
                أرباح قياسية
              </h1>
            </div>

            <div style={{ filter: `blur(${interpolate(text2Spring, [0, 1], [20, 0], { extrapolateRight: 'clamp' })}px)` }}>
              <div style={{ width: 400, height: 4, backgroundColor: CYAN, boxShadow: `0 0 30px ${CYAN}, 0 5px 10px rgba(0,0,0,0.8)`, transform: `scaleX(${text2Spring})`, transformOrigin: 'left', opacity: text2Spring }} />
            </div>

            <div style={{ filter: `blur(${interpolate(text2Spring, [0, 1], [20, 0], { extrapolateRight: 'clamp' })}px)` }}>
              <h2 style={{
                color: CYAN, fontSize: 80, fontWeight: 700, fontFamily: "'Cairo', sans-serif", margin: 0,
                transform: `translateX(${interpolate(text2Spring, [0, 1], [50, 0])})`,
                opacity: text2Spring,
                textShadow: `5px 5px 0px #000, 0 0 30px ${CYAN}`
              }}>
                غضب عمالي
              </h2>
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDE: DYNAMIC DATA VISUALIZATION ── */}
        <div style={{ position: 'absolute', right: 80, top: 180, width: 550, display: 'flex', flexDirection: 'row', gap: 50, alignItems: 'center', opacity: text1Spring, zIndex: 10 }}>
          <div style={{ filter: `blur(${interpolate(text1Spring, [0, 1], [20, 0], { extrapolateRight: 'clamp' })}px)` }}>
            <AnimatedChart frame={frame} activeFrame={580} />
          </div>
          <div style={{ filter: `blur(${interpolate(text1Spring, [0, 1], [20, 0], { extrapolateRight: 'clamp' })}px)` }}>
            <VoiceEqualizer frame={frame} activeFrame={textStartFrame} />
          </div>
        </div>
      </div>
    </div>
  );
};


