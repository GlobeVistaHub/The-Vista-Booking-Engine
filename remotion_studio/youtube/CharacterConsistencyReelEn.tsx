import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
  Img
} from 'remotion';

// ── COLOR PALETTE & DESIGN SYSTEM ──
const CYAN = '#00f2fe';
const GOLD = '#ffb800';
const WHITE = '#ffffff';
const DARK_BG = '#06070a';
const MUTED = '#94a3b8';
const NEON_RED = '#ff0055';

// ── GLOBAL STYLES & FONTS ──
const FontInject: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800;900&display=swap');
    * { box-sizing: border-box; }
  `}</style>
);

// ── AMBIENT CYBERNETIC BACKGROUND GLOW (100% IDENTICAL TO REFERENCE) ──
const AmbientBackground: React.FC<{ accentColor?: string }> = ({
  accentColor = CYAN
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(Math.sin(frame / 20), [-1, 1], [0.1, 0.22]);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, overflow: 'hidden' }}>
      {/* High-tech subtle background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.85
        }}
      />
      {/* Ambient center radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 980,
          height: 980,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 68%)`,
          opacity,
          filter: 'blur(110px)',
          pointerEvents: 'none'
        }}
      />
      {/* Cinematic vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(6, 7, 10, 0.92) 95%)',
          pointerEvents: 'none'
        }}
      />
    </AbsoluteFill>
  );
};

// ── BROADCAST TOP HEADER & DYNAMIC STEP TRACKER BAR (ENGLISH LTR MIRRORED) ──
const BroadcastHeaderEn: React.FC<{
  currentStep: number;
  totalSteps?: number;
  stepTitle: string;
  categoryTag?: string;
  accentColor?: string;
}> = ({
  currentStep,
  totalSteps = 6,
  stepTitle,
  categoryTag = 'AI PIPELINE SYSTEMS 2026',
  accentColor = CYAN
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const pulseDot = interpolate(Math.sin(frame / 6), [-1, 1], [0.4, 1]);

  // ── 120 BPM BEAT-SYNCED AUDIO VISUALIZER (100% IDENTICAL BEAT PHYSICS) ──
  const isClimax = accentColor === GOLD;
  const isScene6Build = currentStep === 6 && !isClimax;
  const isScene1Hook = currentStep === 1;

  // Beat transient physics (15 frames = 1 beat @ 120 BPM / 30 FPS)
  const beatPhase = (frame % 15) / 15;
  const halfBeatPhase = (frame % 7.5) / 7.5;
  const quarterBeatPhase = (frame % 3.75) / 3.75;

  // Transient decay curves (Kick, Snare, Hi-Hat)
  const kickTransient = Math.exp(-beatPhase * 4.2);
  const snareTransient = Math.exp(-(((frame + 15) % 30) / 30) * 4.8);
  const hatTransient = Math.exp(-halfBeatPhase * 5.5);
  const fastHatTransient = Math.exp(-quarterBeatPhase * 6.0);

  // Scene-specific musical dynamics
  let vuBars: number[];

  if (isScene6Build && frame >= 135) {
    // 0.5s ZERO-GRAVITY VACUUM DROP (Frames 135–150): Complete audio silence
    vuBars = [4, 4, 4, 4, 4];
  } else if (isScene6Build && frame >= 105) {
    // Triple-time screaming riser (Frames 105–135)
    const riserHeight = interpolate(frame, [105, 135], [16, 28]);
    vuBars = [0, 1, 2, 3, 4].map((i) =>
      Math.min(28, riserHeight + Math.sin(frame * 1.5 + i) * 3)
    );
  } else if (isScene1Hook && frame >= 120) {
    // Scene 1 Pre-transition Glitch Riser (Frames 120–135)
    const riser = interpolate(frame, [120, 135], [10, 27]);
    vuBars = [0, 1, 2, 3, 4].map((i) => Math.min(28, riser + Math.sin(frame * 1.2 + i) * 2));
  } else if (isScene1Hook && frame < 15) {
    // Scene 1 Intro Sub-drone (Frames 0–15): Low rumble, hats quiet
    vuBars = [
      14 + Math.sin(frame * 0.4) * 4,
      10 + Math.sin(frame * 0.3) * 3,
      7,
      6,
      6
    ];
  } else {
    // Standard Driving Trap Groove (Synced 120 BPM)
    const energyMult = isClimax ? 1.25 : 1.0;
    const bar0 = interpolate(kickTransient, [0, 1], [6, 27 * energyMult]);
    const bar1 = interpolate(
      0.6 * kickTransient + 0.4 * snareTransient,
      [0, 1],
      [7, 25 * energyMult]
    );
    const bar2 = interpolate(snareTransient, [0, 1], [6, 26 * energyMult]);
    const bar3 = interpolate(
      isScene6Build ? fastHatTransient : hatTransient,
      [0, 1],
      [6, 24 * energyMult]
    );
    const bar4 = interpolate(
      isScene6Build ? fastHatTransient : hatTransient,
      [0, 1],
      [6, 22 * energyMult]
    );

    vuBars = [
      Math.min(28, Math.max(5, bar0)),
      Math.min(28, Math.max(5, bar1)),
      Math.min(28, Math.max(5, bar2)),
      Math.min(28, Math.max(5, bar3)),
      Math.min(28, Math.max(5, bar4))
    ];
  }

  // Kinetic line width expansion under title (100% identical easing)
  const lineWidth = interpolate(frame, [0, 24], [0, 100], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 70,
        left: 50,
        right: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        zIndex: 50,
        transform: `translateY(${interpolate(enter, [0, 1], [-35, 0])}px)`,
        opacity: enter
      }}
    >
      {/* Top Bar: Live Pill + Branding + Dancing VU Meters + Step Counter */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Left Side: Live Badge + Channel Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Pulsing Live Dot */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 30,
              background: 'rgba(255, 0, 85, 0.12)',
              border: `1px solid ${NEON_RED}66`
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: NEON_RED,
                boxShadow: `0 0 10px ${NEON_RED}`,
                opacity: pulseDot
              }}
            />
            <span
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 13,
                fontWeight: 800,
                color: WHITE,
                letterSpacing: 1
              }}
            >
              LIVE // CASE STUDY
            </span>
          </div>

          <span
            style={{
              fontFamily: 'Inter',
              fontSize: 24,
              fontWeight: 900,
              color: WHITE,
              letterSpacing: 0.5
            }}
          >
            GOODBRAINS
          </span>
          <span
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 14,
              fontWeight: 700,
              color: MUTED
            }}
          >
            // {categoryTag}
          </span>
        </div>

        {/* Right side: Dancing Audio Waveform + Step Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* 5-Bar Dancing VU Meter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 3,
              height: 28,
              padding: '0 4px'
            }}
          >
            {vuBars.map((height, idx) => (
              <div
                key={idx}
                style={{
                  width: 3.5,
                  height,
                  borderRadius: 2,
                  background: accentColor,
                  boxShadow: `0 0 6px ${accentColor}88`
                }}
              />
            ))}
          </div>

          {/* Step Counter Badge */}
          <div
            style={{
              padding: '6px 20px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: `1.5px solid ${accentColor}77`,
              borderRadius: 50,
              backdropFilter: 'blur(10px)',
              fontFamily: 'JetBrains Mono',
              fontSize: 17,
              fontWeight: 800,
              color: accentColor,
              boxShadow: `0 0 16px ${accentColor}33`
            }}
          >
            {String(currentStep).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Multi-Segment Step Progress Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${totalSteps}, 1fr)`,
          gap: 8,
          width: '100%'
        }}
      >
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepIndex = i + 1;
          const isDone = stepIndex < currentStep;
          const isCurrent = stepIndex === currentStep;

          return (
            <div
              key={i}
              style={{
                height: 6,
                borderRadius: 4,
                background: isDone
                  ? accentColor
                  : isCurrent
                  ? `linear-gradient(90deg, ${accentColor}, rgba(255, 255, 255, 0.9))`
                  : 'rgba(255, 255, 255, 0.12)',
                boxShadow: isCurrent ? `0 0 12px ${accentColor}` : 'none'
              }}
            />
          );
        })}
      </div>

      {/* Kinetic Title Box with Animated Glowing Underline (Mirrored LTR) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 4
        }}
      >
        <div
          style={{
            textAlign: 'left',
            direction: 'ltr',
            fontFamily: 'Inter',
            fontSize: 22,
            fontWeight: 800,
            color: accentColor,
            textShadow: `0 0 14px ${accentColor}44`,
            letterSpacing: 0.2
          }}
        >
          {stepTitle}
        </div>
        {/* Animated kinetic line expanding LTR */}
        <div
          style={{
            height: 2.5,
            width: `${lineWidth}%`,
            background: `linear-gradient(90deg, ${accentColor}, transparent)`,
            borderRadius: 2
          }}
        />
      </div>
    </div>
  );
};

// ── DYNAMIC SLEEK CINEMATIC VIEWPORT (100% IDENTICAL CAMERA, RETICLES & SHEEN) ──
const SleekCinematicViewport: React.FC<{
  imgSrc: string;
  zoomFrom?: number;
  zoomTo?: number;
  panYFrom?: number;
  panYTo?: number;
  badgeLabel?: string;
  accentColor?: string;
  fadeOutBadge?: boolean;
  children?: React.ReactNode;
}> = ({
  imgSrc,
  zoomFrom = 1.0,
  zoomTo = 1.07,
  panYFrom = 0,
  panYTo = -18,
  badgeLabel = '// TOPOLOGY MATRIX: LOCKED',
  accentColor = CYAN,
  fadeOutBadge = true,
  children
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Smooth cinematic spring entrance (critically damped, zero overshoot)
  const enter = spring({
    frame,
    fps,
    config: { damping: 20, mass: 0.6 }
  });

  // Intentional badge fadeout across ALL slides to reveal underlying slide titles after initial scan lock
  const badgeOpacity = fadeOutBadge
    ? interpolate(frame, [25, 45], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.quad)
      })
    : 1;

  // Corner brackets snap-lock animation
  const reticleLock = spring({
    frame,
    fps,
    delay: 4,
    config: { damping: 12, mass: 0.5 }
  });

  // Buttery-smooth cinematic Ken Burns zoom & slow drift (EXACT REFERENCE PHYSICS)
  const scale = interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], {
    easing: Easing.out(Easing.quad)
  });
  const translateY = interpolate(frame, [0, durationInFrames], [panYFrom, panYTo], {
    easing: Easing.out(Easing.quad)
  });

  // Brilliant Glass Light Sheen Sweep on Entrance (Frames 8 to 48)
  const sheenX = interpolate(frame, [8, 48], [-120, 220], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  // Pulsing telemetry dot and ambient border glow
  const dotPulse = interpolate(Math.sin(frame / 5), [-1, 1], [0.85, 1.25]);
  const borderGlow = interpolate(Math.sin(frame / 10), [-1, 1], [0.4, 0.85]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 280,
        left: 45,
        width: 990,
        height: 990,
        borderRadius: 24,
        overflow: 'hidden',
        border: `2px solid ${accentColor}`,
        boxShadow: `0 30px 80px rgba(0, 0, 0, 0.9), 0 0 45px ${accentColor}${Math.round(borderGlow * 80)}`,
        zIndex: 20,
        transform: `translateY(${interpolate(enter, [0, 1], [15, 0])}px)`,
        opacity: enter
      }}
    >
      {/* Background container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          backgroundColor: '#050709',
          overflow: 'hidden'
        }}
      >
        {/* Dynamic Image with Cinematic Zoom and Slow Pan (objectFit: contain) */}
        <Img
          src={imgSrc}
          alt="Slide Content"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: `scale(${scale}) translateY(${translateY}px)`
          }}
        />

        {/* Dynamic Children Overlays (Staggered Step Highlights tracking motion) */}
        {children && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: `scale(${scale}) translateY(${translateY}px)`,
              pointerEvents: 'none'
            }}
          >
            {children}
          </div>
        )}

        {/* Dynamic Glass Light Sheen (Glides across the glass on scene start) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${sheenX}%`,
            width: '60%',
            height: '100%',
            background:
              'linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.16) 45%, rgba(0, 242, 254, 0.22) 50%, transparent 75%)',
            transform: 'skewX(-20deg)',
            pointerEvents: 'none'
          }}
        />

        {/* Subtle Horizontal CRT Scanlines Texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12) 2px, transparent 2px, transparent 4px)',
            pointerEvents: 'none',
            opacity: 0.5
          }}
        />

        {/* Floating Living Telemetry Badge */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            padding: '6px 16px',
            background: 'rgba(6, 7, 10, 0.88)',
            border: `1.5px solid ${accentColor}88`,
            borderRadius: 8,
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
            opacity: badgeOpacity
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: accentColor,
              transform: `scale(${dotPulse})`,
              boxShadow: `0 0 10px ${accentColor}`
            }}
          />
          <span
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 14,
              fontWeight: 800,
              color: WHITE,
              letterSpacing: 0.5
            }}
          >
            {badgeLabel}
          </span>
        </div>
      </div>

      {/* Dynamic Snapping Viewfinder Reticles (Animated Corner Lock-In) */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          width: 30,
          height: 30,
          borderTop: `3.5px solid ${accentColor}`,
          borderLeft: `3.5px solid ${accentColor}`,
          transform: `scale(${interpolate(reticleLock, [0, 1], [1.4, 1])})`,
          opacity: reticleLock,
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          width: 30,
          height: 30,
          borderTop: `3.5px solid ${accentColor}`,
          borderRight: `3.5px solid ${accentColor}`,
          transform: `scale(${interpolate(reticleLock, [0, 1], [1.4, 1])})`,
          opacity: reticleLock,
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: 14,
          width: 30,
          height: 30,
          borderBottom: `3.5px solid ${accentColor}`,
          borderLeft: `3.5px solid ${accentColor}`,
          transform: `scale(${interpolate(reticleLock, [0, 1], [1.4, 1])})`,
          opacity: reticleLock,
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          right: 14,
          width: 30,
          height: 30,
          borderBottom: `3.5px solid ${accentColor}`,
          borderRight: `3.5px solid ${accentColor}`,
          transform: `scale(${interpolate(reticleLock, [0, 1], [1.4, 1])})`,
          opacity: reticleLock,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

// ── ORIGINAL POST LINK PILL (ENGLISH LTR MIRRORED WITH ANIMATED DOWNLOAD SYMBOL) ──
const OriginalLinkPillEn: React.FC<{ accentColor?: string }> = ({ accentColor = CYAN }) => {
  const frame = useCurrentFrame();

  const borderPulse = interpolate(Math.sin(frame / 8), [-1, 1], [0.45, 0.95]);
  
  // Smooth continuous downward bounce for download arrow (24 frames = 0.8s loop)
  const downloadBounce = interpolate((frame % 24) / 24, [0, 0.5, 1], [0, 4, 0], {
    easing: Easing.inOut(Easing.quad)
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '12px 24px',
        background: 'linear-gradient(135deg, rgba(8, 12, 20, 0.96) 0%, rgba(12, 18, 28, 0.94) 100%)',
        border: `2px solid ${accentColor}`,
        borderRadius: 16,
        boxShadow: `0 12px 35px rgba(0, 0, 0, 0.95), 0 0 25px ${accentColor}${Math.round(borderPulse * 60)}`,
        direction: 'ltr',
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* Left: Mini Icon Badge + Copy */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `${accentColor}22`,
            border: `1.5px solid ${accentColor}`,
            boxShadow: `0 0 10px ${accentColor}66`
          }}
        >
          <span style={{ fontSize: 16, color: accentColor }}>🔗</span>
        </div>

        {/* Typography */}
        <span
          style={{
            fontFamily: 'Inter',
            fontSize: 18,
            fontWeight: 800,
            color: '#ffffff',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.95)',
            letterSpacing: 0.2
          }}
        >
          <span style={{ color: accentColor, fontWeight: 900 }}>Original Technical Breakdown</span> & Full Blueprint link in description below
        </span>
      </div>

      {/* Right: High-Tech Animated Download Indicator (Directs eyes down to description) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 10,
          background: `${accentColor}18`,
          border: `1.5px solid ${accentColor}88`,
          boxShadow: `0 0 14px ${accentColor}44`,
          flexShrink: 0
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: `drop-shadow(0 0 6px ${accentColor})`
          }}
        >
          {/* Download Tray Base */}
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          {/* Animated Arrow Cycling Down */}
          <g transform={`translate(0, ${downloadBounce})`}>
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </g>
        </svg>
        <span
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 13,
            fontWeight: 900,
            color: accentColor,
            letterSpacing: 1
          }}
        >
          GET PDF
        </span>
      </div>
    </div>
  );
};

// ── PREMIUM KINETIC CALLOUT & DYNAMIC ACTION BAR (ENGLISH LTR MIRRORED) ──
const BottomKineticCalloutEn: React.FC<{
  primaryText: string;
  secondaryText: string;
  buttonText: string;
  chipLabel?: string;
  isClimax?: boolean;
  accentColor?: string;
  bullets?: Array<{ tag: string; title: string }>;
  highlightNotice?: string;
}> = ({
  primaryText,
  secondaryText,
  buttonText,
  chipLabel = '// PROMPT PROTOCOL',
  isClimax = false,
  accentColor = CYAN,
  bullets,
  highlightNotice
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const color = isClimax ? GOLD : accentColor;

  // Staggered spring animations (100% IDENTICAL TO REFERENCE)
  const cardEnter = spring({ frame, fps, delay: 3, config: { damping: 15, mass: 0.7 } });
  const titleEnter = spring({ frame, fps, delay: 7, config: { damping: 14, mass: 0.6 } });
  const descEnter = spring({ frame, fps, delay: 12, config: { damping: 14, mass: 0.6 } });
  const btnEnter = spring({ frame, fps, delay: 18, config: { damping: 12, mass: 0.5 } });

  // Arrow kinetic bounce
  const arrowShift = interpolate(Math.sin(frame / 4), [-1, 1], [-6, 6]);
  const btnPulse = isClimax
    ? interpolate(Math.sin(frame / 6), [-1, 1], [0.985, 1.025])
    : 1;

  // Deep shadow glow for high contrast
  const shadowGlow = isClimax
    ? '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(255, 184, 0, 0.25)'
    : '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(0, 242, 254, 0.18)';

  return (
    <>
      {/* ── THE ORIGINAL POST LINK PILL ── */}
      <div
        style={{
          position: 'absolute',
          top: 1350,
          left: 45,
          right: 45,
          zIndex: 55,
          transform: `translateY(${interpolate(cardEnter, [0, 1], [15, 0])}px)`,
          opacity: cardEnter
        }}
      >
        <OriginalLinkPillEn accentColor={color} />
      </div>

      {/* ── INFORMATION GLASS CARD + ACTION BUTTON ── */}
      <div
        style={{
          position: 'absolute',
          top: 1475,
          left: 45,
          right: 45,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          zIndex: 50,
          transform: `translateY(${interpolate(cardEnter, [0, 1], [25, 0])}px)`,
          opacity: cardEnter
        }}
      >
        {/* Information Glass Card with Deep Contrast Backing (Mirrored LTR: borderLeft) */}
        <div
          style={{
            position: 'relative',
            padding: '22px 28px',
            background: isClimax
              ? 'linear-gradient(135deg, rgba(255, 184, 0, 0.15) 0%, rgba(5, 7, 10, 0.96) 100%)'
              : 'linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, rgba(5, 7, 10, 0.96) 100%)',
            border: `2px solid ${color}`,
            borderLeft: `8px solid ${color}`,
            borderRadius: 22,
            backdropFilter: 'blur(25px)',
            direction: 'ltr',
            textAlign: 'left',
            boxShadow: shadowGlow
          }}
        >
          {/* Micro-chip header tag */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: 8
            }}
          >
            <span
              style={{
                padding: '4px 14px',
                borderRadius: 6,
                background: isClimax ? 'rgba(255, 184, 0, 0.25)' : 'rgba(0, 242, 254, 0.18)',
                border: `1.5px solid ${color}`,
                fontFamily: 'JetBrains Mono',
                fontSize: 15,
                fontWeight: 800,
                color: color,
                letterSpacing: 0.5,
                textShadow: `0 0 10px ${color}88`
              }}
            >
              {chipLabel}
            </span>
          </div>

          {/* Primary Title */}
          <p
            style={{
              fontFamily: 'Inter',
              fontSize: 26,
              fontWeight: 900,
              color: WHITE,
              margin: '0 0 8px 0',
              lineHeight: 1.35,
              transform: `translateY(${interpolate(titleEnter, [0, 1], [12, 0])}px)`,
              opacity: titleEnter,
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.95), 0 0 20px rgba(0, 0, 0, 0.8)'
            }}
          >
            {primaryText}
          </p>

          {/* 2x2 Kinetic Bullet Grid (Mirrored LTR) */}
          {bullets && bullets.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                margin: '10px 0',
                direction: 'ltr'
              }}
            >
              {bullets.map((b, idx) => {
                const bEnter = spring({
                  frame,
                  fps,
                  delay: 10 + idx * 3,
                  config: { damping: 13, mass: 0.6 }
                });
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 14px',
                      background: 'rgba(0, 0, 0, 0.65)',
                      border: `1.5px solid ${color}77`,
                      borderRadius: 10,
                      transform: `translateY(${interpolate(bEnter, [0, 1], [15, 0])}px)`,
                      opacity: bEnter,
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.85)'
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: 14,
                        fontWeight: 900,
                        color: color,
                        background: `${color}22`,
                        padding: '2px 6px',
                        borderRadius: 4
                      }}
                    >
                      {b.tag}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Inter',
                        fontSize: 15,
                        fontWeight: 700,
                        color: '#ffffff',
                        textShadow: '0 1px 6px rgba(0,0,0,0.9)'
                      }}
                    >
                      {b.title}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Secondary Subtitle */}
          <p
            style={{
              fontFamily: 'Inter',
              fontSize: 19,
              fontWeight: 600,
              color: isClimax ? '#fef08a' : '#cbd5e1',
              margin: 0,
              lineHeight: 1.45,
              transform: `translateY(${interpolate(descEnter, [0, 1], [10, 0])}px)`,
              opacity: descEnter,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.95)'
            }}
          >
            {secondaryText}
          </p>

          {/* Highlight Notice */}
          {highlightNotice && (
            <div
              style={{
                marginTop: 10,
                padding: '8px 16px',
                background: 'rgba(0, 0, 0, 0.75)',
                border: `1.5px solid ${color}`,
                borderRadius: 10,
                boxShadow: '0 4px 18px rgba(0,0,0,0.9)'
              }}
            >
              <p
                style={{
                  fontFamily: 'Inter',
                  fontSize: 18,
                  fontWeight: 800,
                  color: WHITE,
                  margin: 0,
                  textShadow: '0 2px 8px rgba(0,0,0,0.95)'
                }}
              >
                {highlightNotice}
              </p>
            </div>
          )}
        </div>

        {/* Kinetic Action Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            padding: '16px 28px',
            background: isClimax
              ? `linear-gradient(90deg, #ffb800, #f59e0b)`
              : 'rgba(0, 242, 254, 0.16)',
            border: isClimax ? 'none' : `2px solid ${CYAN}`,
            borderRadius: 18,
            backdropFilter: 'blur(16px)',
            transform: `scale(${btnPulse}) translateY(${interpolate(btnEnter, [0, 1], [12, 0])}px) translateZ(0)`,
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            opacity: btnEnter,
            boxShadow: isClimax
              ? '0 15px 40px rgba(255, 184, 0, 0.5), 0 0 25px rgba(255, 184, 0, 0.3)'
              : '0 12px 35px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 242, 254, 0.3)'
          }}
        >
          <span
            style={{
              fontFamily: 'Inter',
              fontSize: isClimax ? 24 : 22,
              fontWeight: 900,
              color: isClimax ? '#06070a' : CYAN,
              letterSpacing: 0.5,
              textRendering: 'geometricPrecision',
              WebkitFontSmoothing: 'antialiased',
              display: 'inline-block',
              transform: 'translateZ(0)',
              textShadow: isClimax ? 'none' : `0 0 12px ${CYAN}99`
            }}
          >
            {buttonText}
          </span>
          {!isClimax && (
            <span
              style={{
                fontSize: 26,
                transform: `translateX(${arrowShift}px)`,
                display: 'inline-block',
                filter: `drop-shadow(0 0 10px ${CYAN})`
              }}
            >
              👈
            </span>
          )}
        </div>
      </div>
    </>
  );
};

// ── CINEMATIC SMOOTH SCENE ENTRANCE WRAPPER (100% IDENTICAL) ──
const SceneSlideTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 15, mass: 0.7 } });

  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${interpolate(enter, [0, 1], [25, 0])}px)`,
        opacity: enter
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 1: THE MASTER HOOK (Slide 0 - Demystifying Complexity)
// ══════════════════════════════════════════════════════════════════════════════
const Scene1HookEn: React.FC = () => {
  return (
    <SceneSlideTransition>
      <AmbientBackground accentColor={CYAN} />
      <BroadcastHeaderEn
        currentStep={1}
        stepTitle="PHASE 01 // Demystifying AI Consistency & Saving 80% Effort"
      />
      <SleekCinematicViewport
        imgSrc={staticFile('carousel/Slide_0_Master_Header_EN.png')}
        badgeLabel="// MASTER HOOK // V6.1 ARCHITECTURE"
      />
      <BottomKineticCalloutEn
        chipLabel="// CORE ARCHITECTURE DISCOVERY"
        primaryText="⚡ Say goodbye to 10-step workarounds and bloated prompt chains!"
        secondaryText="Next-gen models (Midjourney v6.1 & Flux) solved the puzzle with a single modular prompt."
        buttonText="Swipe Left for Secret 01"
      />
    </SceneSlideTransition>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 2: THE 3D MESH TOPOLOGY COVER (Slide 1 - 3D Facial Mesh Topology)
// ══════════════════════════════════════════════════════════════════════════════
const Scene2CoverEn: React.FC = () => {
  return (
    <SceneSlideTransition>
      <AmbientBackground accentColor={CYAN} />
      <BroadcastHeaderEn
        currentStep={2}
        stepTitle="SECRET 01 // 3D Facial Mesh Topology & Landmark Locking"
      />
      <SleekCinematicViewport
        imgSrc={staticFile('carousel/Slide_1_Cover.jpg')}
        badgeLabel="// 3D FACIAL MESH: ANCHORED"
        fadeOutBadge={true}
      />
      <BottomKineticCalloutEn
        chipLabel="// STEP 01: FACIAL ANCHOR"
        primaryText="🎯 100% Facial Topology Lock Across Every Single Camera Frame"
        secondaryText="Locking cranial landmarks and facial proportions without distortion across angles."
        buttonText="Swipe Left for Reference Sheet"
      />
    </SceneSlideTransition>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 3: THE REFERENCE SHEET (Slide 2 - Multi-Angle Character Model Sheet)
// ══════════════════════════════════════════════════════════════════════════════
const Scene3ReferenceSheetEn: React.FC = () => {
  return (
    <SceneSlideTransition>
      <AmbientBackground accentColor={CYAN} />
      <BroadcastHeaderEn
        currentStep={3}
        stepTitle="SECRET 02 // Multi-Angle Character Model Sheet (Turnaround)"
      />
      <SleekCinematicViewport
        imgSrc={staticFile('carousel/Slide_2_Reference_Sheet_EN.png')}
        badgeLabel="// MULTI-ANGLE TURNAROUND: LOCKED"
      />
      <BottomKineticCalloutEn
        chipLabel="// STEP 02: THE GOLDEN TURNAROUND"
        primaryText="📐 Step Zero: One Widescreen Turnaround Anchors Every Viewpoint"
        secondaryText="Standard prompt: front view, 3/4 profile, side view, neutral expressions."
        buttonText="Swipe Left for the Truth"
      />
    </SceneSlideTransition>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 4: THE TRUTH (Slide 3 - 10-Step Pipelines Are Dead)
// ══════════════════════════════════════════════════════════════════════════════
const Scene4TheTruthEn: React.FC = () => {
  return (
    <SceneSlideTransition>
      <AmbientBackground accentColor={GOLD} />
      <BroadcastHeaderEn
        currentStep={4}
        stepTitle="THE SHIFT // 10-Step Pipelines Are Officially Obsolete"
        accentColor={GOLD}
      />
      <SleekCinematicViewport
        imgSrc={staticFile('carousel/Slide_3_The_Truth_EN.png')}
        accentColor={GOLD}
        badgeLabel="// REALITY CHECK: OLD HABITS DEAD"
      />
      <BottomKineticCalloutEn
        chipLabel="// ARCHITECTURAL SHIFT"
        primaryText="💡 In Generative AI, 60 days ago is ancient history!"
        secondaryText="Stop overcomplicating workflows. Modular prompting is the modern industry standard."
        buttonText="Swipe Left for the Formula"
        accentColor={GOLD}
      />
    </SceneSlideTransition>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 5: THE FORMULA (Slide 4 - Modular Prompt Architecture)
// ══════════════════════════════════════════════════════════════════════════════
const Scene5TheFormulaEn: React.FC = () => {
  return (
    <SceneSlideTransition>
      <AmbientBackground accentColor={CYAN} />
      <BroadcastHeaderEn
        currentStep={5}
        stepTitle="THE FORMULA // Anatomical Breakdown of Modular Prompting"
      />
      <SleekCinematicViewport
        imgSrc={staticFile('carousel/Slide_4_The_Formula_EN.png')}
        badgeLabel="// MODULAR BLOCKS // 4 PILLARS"
      />
      <BottomKineticCalloutEn
        chipLabel="// FORMULA BREAKDOWN"
        primaryText="🧩 4 Modular Pillars to Construct Any Scene in Seconds:"
        secondaryText="Lock identity as a Master Seed — mutate shot, action & lighting at will!"
        buttonText="Swipe Left for Style Switching"
        bullets={[
          { tag: '01', title: 'MASTER SEED: Facial Anchor' },
          { tag: '02', title: 'SCENE ACTION: Motion & Pose' },
          { tag: '03', title: 'CAMERA & LENS: Optical Framing' },
          { tag: '04', title: 'LIGHTING: Ambient Mood' }
        ]}
      />
    </SceneSlideTransition>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 6: THE 5 STYLES (Slide 5 - Art Direction Switching)
// ══════════════════════════════════════════════════════════════════════════════
const Scene6The5StylesEn: React.FC = () => {
  return (
    <SceneSlideTransition>
      <AmbientBackground accentColor={CYAN} />
      <BroadcastHeaderEn
        currentStep={6}
        stepTitle="ART DIRECTION // Swap Visual Styles with a Single Token"
      />
      <SleekCinematicViewport
        imgSrc={staticFile('carousel/Slide_5_The_5_Styles_EN.png')}
        badgeLabel="// MULTI-STYLE LATENT SPACE"
      />
      <BottomKineticCalloutEn
        chipLabel="// ARTISTIC FREEDOM"
        primaryText="🎨 Mutate {VISUAL_STYLE} to Instantly Shift Art Direction:"
        secondaryText="Identical character identity 100% locked across 5 cinematic universes!"
        buttonText="Swipe Left for Master Gift"
        bullets={[
          { tag: '🎨', title: 'Pixar 3D: Stylized Animation' },
          { tag: '📸', title: '35mm Photo: Photoreal Film' },
          { tag: '⚡', title: 'Neo-Tokyo: Cyberpunk Anime' },
          { tag: '🎮', title: 'Unreal Engine 5: Game Asset' }
        ]}
      />
    </SceneSlideTransition>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCENE 7: THE GRAND CLIMAX & CTA (Slide 6 - Exclusive 18-Page Blueprint)
// ══════════════════════════════════════════════════════════════════════════════
const Scene7ClimaxCTAEn: React.FC = () => {
  return (
    <SceneSlideTransition>
      <AmbientBackground accentColor={GOLD} />
      <BroadcastHeaderEn
        currentStep={6}
        stepTitle="EXCLUSIVE ASSET // The AI Architect's Blueprint (18 Pages)"
        accentColor={GOLD}
      />
      <SleekCinematicViewport
        imgSrc={staticFile('carousel/Slide_6_Course_Announcement_EN.png')}
        accentColor={GOLD}
        badgeLabel="// 18-PAGE BLUEPRINT: AVAILABLE"
      />
      <BottomKineticCalloutEn
        chipLabel="// EXCLUSIVE ARCHITECT ASSET"
        primaryText="🎁 Claim Your Complete 18-Page Systems Blueprint Today!"
        secondaryText="The definitive production handbook to transform AI prompting into commercial client value."
        highlightNotice="⚡ Instant direct PDF download + exclusive access to the VIP community!"
        buttonText="Comment: [ ANTIGRAVITY ] for Instant Access 👇"
        isClimax={true}
        accentColor={GOLD}
      />
    </SceneSlideTransition>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MASTER COMPOSITION EXPORT (ENGLISH MIRRORED)
// Total Duration: 1050 frames @ 30 FPS = 35.0 seconds (100% IDENTICAL SEQUENCING)
// ══════════════════════════════════════════════════════════════════════════════
export const CHARACTER_CONSISTENCY_REEL_EN_DURATION = 1050;

export const CharacterConsistencyReelEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <FontInject />

      {/* Scene 1: The Hook (4.5s = 135 frames) */}
      <Sequence from={0} durationInFrames={135}>
        <Scene1HookEn />
      </Sequence>

      {/* Scene 2: 3D Facial Mesh Anchor (4.0s = 120 frames) */}
      <Sequence from={135} durationInFrames={120}>
        <Scene2CoverEn />
      </Sequence>

      {/* Scene 3: The Turnaround Sheet (5.5s = 165 frames) */}
      <Sequence from={255} durationInFrames={165}>
        <Scene3ReferenceSheetEn />
      </Sequence>

      {/* Scene 4: The Truth & End of Complexity (4.5s = 135 frames) */}
      <Sequence from={420} durationInFrames={135}>
        <Scene4TheTruthEn />
      </Sequence>

      {/* Scene 5: The Modular Formula (5.5s = 165 frames) */}
      <Sequence from={555} durationInFrames={165}>
        <Scene5TheFormulaEn />
      </Sequence>

      {/* Scene 6: The 5 Styles Switching (5.0s = 150 frames) */}
      <Sequence from={720} durationInFrames={150}>
        <Scene6The5StylesEn />
      </Sequence>

      {/* Scene 7: The Grand Climax & CTA (6.0s = 180 frames) */}
      <Sequence from={870} durationInFrames={180}>
        <Scene7ClimaxCTAEn />
      </Sequence>
    </AbsoluteFill>
  );
};
