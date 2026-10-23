import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  interpolate,
  useCurrentFrame,
  Easing,
  spring
} from 'remotion';
import { AnamorphicWhipPan } from '../Episode3/AnamorphicWhipPan';
import { BrandOutroHorizontal } from '../Episode3/BrandOutroHorizontal';

const CYAN = "#00E5CC";
const RED = "#FF3333";
const AMBER = "#FFB300";

// ── ULTRA-PERFORMANT HARDWARE-ACCELERATED TEXTURE ENGINES ──
const DioramaOverlay: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 90, mixBlendMode: "multiply" }}>
    <div style={{
      position: "absolute",
      inset: 0,
      backgroundImage: "radial-gradient(circle, #1a1a1a 1px, transparent 1px)",
      backgroundSize: "6px 6px",
      opacity: 0.18
    }} />
  </AbsoluteFill>
);

// ── CRT PHOSPHOR SCANLINES ──
const ScanlinesOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.28 }) => (
  <div style={{
    position: "absolute",
    inset: 0,
    backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%)",
    backgroundSize: "100% 4px",
    opacity,
    pointerEvents: "none",
    zIndex: 20
  }} />
);

// ── RUSTY HALO VIGNETTE (EPISODE 3 & 4 SIGNATURE GRADE) ──
const RustyHaloOverlay: React.FC<{ intensity?: number }> = ({ intensity = 1.0 }) => (
  <>
    {/* Rusty Glow / Vignette from Topic3Grok.tsx */}
    <div style={{
      position: "absolute",
      inset: 0,
      background: "radial-gradient(ellipse at center, rgba(160, 82, 45, 0.22) 0%, rgba(30, 10, 5, 0.65) 80%)",
      mixBlendMode: "multiply",
      pointerEvents: "none",
      zIndex: 25,
      opacity: intensity
    }} />
    {/* Burnt Edge Halo Vignette */}
    <div style={{
      position: "absolute",
      inset: 0,
      boxShadow: "inset 0 0 130px rgba(180, 70, 20, 0.45), inset 0 0 60px rgba(0, 0, 0, 0.85)",
      mixBlendMode: "color-burn",
      pointerEvents: "none",
      zIndex: 26,
      opacity: intensity
    }} />
  </>
);

// ── EPISODE 3 SIGNATURE FILM DAMAGE & GOLDEN HALATION OVERLAY (ANIMATED VINTAGE GATE FLARE) ──
const Episode3FilmDamageOverlay: React.FC<{ intensity?: number }> = ({ intensity = 1.0 }) => {
  const frame = useCurrentFrame();

  // Subtle organic projector gate flutter (micro-breathing vintage film emulation)
  const halationPulse = 0.88 + Math.sin(frame * 0.08) * 0.12;

  const trScale = 1.0 + Math.sin(frame * 0.07) * 0.04;
  const trX = Math.cos(frame * 0.05) * 6;
  const trY = Math.sin(frame * 0.06) * 4;

  const blScale = 1.0 + Math.sin((frame + 25) * 0.06) * 0.045;
  const blX = Math.sin((frame + 15) * 0.04) * 7;
  const blY = Math.cos((frame + 35) * 0.05) * 5;

  const tlScale = 1.0 + Math.cos((frame + 40) * 0.08) * 0.035;
  const tlX = Math.cos((frame + 20) * 0.06) * 4;
  const tlY = Math.sin((frame + 10) * 0.07) * 3;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 35, opacity: intensity }}>
      {/* 1. Vintage Glow & Golden Halation (Breathing) */}
      <AbsoluteFill style={{
        backgroundImage: "radial-gradient(circle at center, rgba(255,200,100,0.18) 0%, transparent 62%)",
        mixBlendMode: "screen",
        pointerEvents: "none",
        opacity: halationPulse
      }} />

      {/* 2. Micro Film Lines */}
      <AbsoluteFill style={{
        backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 3px)",
        pointerEvents: "none"
      }} />

      {/* 3. Film Damage / Rusting Spillage at Edges (Animated Multi-Layer Spills) */}
      {/* Top Right Rust Spill */}
      <div style={{
        position: "absolute", top: "-5%", right: "-5%", width: "42%", height: "32%",
        background: "radial-gradient(ellipse at top right, rgba(139, 69, 19, 0.8) 0%, rgba(205, 92, 92, 0.4) 40%, transparent 70%)",
        filter: "blur(20px)", mixBlendMode: "multiply",
        transform: `translate(${trX}px, ${trY}px) scale(${trScale})`,
        transformOrigin: "top right"
      }} />
      {/* Bottom Left Spill */}
      <div style={{
        position: "absolute", bottom: "-10%", left: "-5%", width: "50%", height: "40%",
        background: "radial-gradient(ellipse at bottom left, rgba(160, 82, 45, 0.7) 0%, rgba(139, 0, 0, 0.3) 50%, transparent 80%)",
        filter: "blur(25px)", mixBlendMode: "color-burn",
        transform: `translate(${blX}px, ${blY}px) scale(${blScale})`,
        transformOrigin: "bottom left"
      }} />
      {/* Top Left Minor Burn */}
      <div style={{
        position: "absolute", top: "-2%", left: "-2%", width: "25%", height: "20%",
        background: "radial-gradient(circle at top left, rgba(210, 105, 30, 0.6) 0%, transparent 70%)",
        filter: "blur(15px)", mixBlendMode: "multiply",
        transform: `translate(${tlX}px, ${tlY}px) scale(${tlScale})`,
        transformOrigin: "top left"
      }} />
    </AbsoluteFill>
  );
};

const AnimatedGoldenRustOverlay = Episode3FilmDamageOverlay;

// ── OPTICAL LIGHT SWEEP LEAK ON TRANSITIONS ──
const LightSweepLeak: React.FC<{ triggerFrame: number; duration?: number; color?: string }> = ({
  triggerFrame,
  duration = 10,
  color = CYAN
}) => {
  const frame = useCurrentFrame();
  if (frame < triggerFrame || frame >= triggerFrame + duration) return null;

  const progress = (frame - triggerFrame) / duration;
  const sweepX = interpolate(progress, [0, 1], [-100, 200]);
  const opacity = interpolate(progress, [0, 0.4, 1], [0, 0.9, 0]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 950, mixBlendMode: "screen", opacity }}>
      <div style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: `${sweepX}%`,
        width: "60%",
        background: `linear-gradient(90deg, transparent 0%, ${color} 50%, rgba(255,179,0,0.6) 65%, transparent 100%)`,
        transform: "skewX(-25deg)",
        filter: "blur(35px)"
      }} />
    </AbsoluteFill>
  );
};

// ── DIGITAL MATRIX SLICE GLITCH (3-FRAME CYBER IMPACT CUT) ──
const DigitalSliceGlitch: React.FC<{ triggerFrame: number; duration?: number }> = ({
  triggerFrame,
  duration = 4
}) => {
  const frame = useCurrentFrame();
  if (frame < triggerFrame || frame >= triggerFrame + duration) return null;

  const localF = frame - triggerFrame;
  const offsetA = localF % 2 === 0 ? 12 : -12;
  const offsetB = localF % 2 === 0 ? -16 : 16;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 940, mixBlendMode: "screen" }}>
      {/* Upper Subtle Cyber Slice */}
      <div style={{
        position: "absolute",
        top: "28%",
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: CYAN,
        opacity: 0.65,
        transform: `translateX(${offsetA}px)`,
        boxShadow: `0 0 12px ${CYAN}`
      }} />
      {/* Lower Subtle Cyber Slice */}
      <div style={{
        position: "absolute",
        top: "64%",
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: RED,
        opacity: 0.55,
        transform: `translateX(${offsetB}px)`,
        boxShadow: `0 0 12px ${RED}`
      }} />
    </AbsoluteFill>
  );
};

// ── 8-FRAME CHROMATIC ABERRATION SPIKE FOR MAZEN ──
const CharacterCA3D: React.FC<{ imgSrc: string; caX: number }> = ({ imgSrc, caX }) => (
  <>
    <div style={{
      position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.85,
      filter: 'sepia(1) hue-rotate(-50deg) saturate(8)',
      transform: `translateX(${caX}px)`
    }}>
      <img src={imgSrc} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} alt="" />
    </div>
    <div style={{
      position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.85,
      filter: 'sepia(1) hue-rotate(150deg) saturate(8)',
      transform: `translateX(${-caX}px)`
    }}>
      <img src={imgSrc} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} alt="" />
    </div>
  </>
);

// ── DOCUMENTED EPISODE 5 SECURITY CAMERA OVERLAYS ──
const SecurityCameraOverlay: React.FC<{
  tapeName?: string;
  cameraStatus?: string;
  isCameraOffline?: boolean;
  targetName: string;
  alertText: string;
  metricText: string;
  primaryColor?: string;
  accentColor?: string;
}> = ({
  tapeName = "تسجيل // وثيقة_استخبارية_مسربة.MP4",
  cameraStatus = "كاميرا المراقبة - غير متصلة",
  isCameraOffline = true,
  targetName,
  alertText,
  metricText,
  primaryColor = CYAN,
  accentColor = RED
}) => {
  const frame = useCurrentFrame();
  const typedLen = Math.max(0, Math.floor(frame / 2));
  const isBlink = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 50, fontFamily: "'Cairo', 'Tajawal', sans-serif", color: primaryColor, padding: 60 }}>
      {/* Top Left: Typing Tape Name & Offline Camera Warning (High Legibility + Strong Shadows, Zero Cards) */}
      <div style={{ position: 'absolute', top: 50, left: 60, fontWeight: 'bold' }}>
        <div style={{
          fontFamily: "monospace",
          direction: "ltr",
          fontSize: 34,
          fontWeight: 900,
          textShadow: "0 2px 4px rgba(0,0,0,0.95), 0 0 14px rgba(0,0,0,0.9), 0 0 28px rgba(0,0,0,0.85)"
        }}>
          {tapeName.slice(0, typedLen)}
          <span style={{ opacity: isBlink ? 1 : 0 }}>_</span>
        </div>
        <div style={{
          color: isCameraOffline ? accentColor : primaryColor,
          marginTop: 8,
          fontSize: 28,
          fontWeight: 800,
          opacity: frame > 20 && isBlink ? 1 : 0.7,
          textShadow: "0 2px 4px rgba(0,0,0,0.95), 0 0 14px rgba(0,0,0,0.9), 0 0 28px rgba(0,0,0,0.85)"
        }}>
          {cameraStatus}
        </div>
      </div>

      {/* Top Right: Documented Episode 5 Timeline (High Legibility + Strong Shadows, Zero Cards) */}
      <div style={{ position: 'absolute', top: 50, right: 60, textAlign: 'right', fontWeight: 'bold', direction: 'rtl' }}>
        <div style={{
          fontSize: 34,
          fontWeight: 900,
          textShadow: "0 2px 4px rgba(0,0,0,0.95), 0 0 14px rgba(0,0,0,0.9), 0 0 28px rgba(0,0,0,0.85)"
        }}>
          التاريخ: أكتوبر ٢٠٢٦ // وثيقة مسربة
        </div>
        <div style={{
          opacity: 0.9,
          marginTop: 8,
          fontSize: 28,
          fontWeight: 800,
          textShadow: "0 2px 4px rgba(0,0,0,0.95), 0 0 14px rgba(0,0,0,0.9), 0 0 28px rgba(0,0,0,0.85)"
        }}>
          النظام: <span style={{ color: frame % 10 < 5 ? accentColor : primaryColor }}>غير مستقر // ذروة الأحمال</span>
        </div>
      </div>

      {/* Center Target Reticle Lock - Dashed Rotating Circle + 500px Crosshairs */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', marginLeft: -150, marginTop: -150,
        width: 300, height: 300, border: `3px dashed ${primaryColor}`, borderRadius: '50%',
        transform: `rotate(${frame * 2}deg) scale(${interpolate(frame % 60, [0, 30, 60], [1.1, 1, 1.1])})`,
        opacity: 0.55
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%', marginLeft: -250, marginTop: -2,
        width: 500, height: 4, backgroundColor: primaryColor, opacity: 0.35
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%', marginLeft: -2, marginTop: -250,
        width: 4, height: 500, backgroundColor: primaryColor, opacity: 0.35
      }} />

      {/* Dynamic Data Dump - Heavy Glowing Box */}
      <div style={{
        position: 'absolute', top: '55%', left: '54%', fontSize: 28, backgroundColor: 'rgba(0, 10, 15, 0.88)',
        padding: '22px 34px', borderLeft: `6px solid ${accentColor}`, boxShadow: `0 0 35px ${accentColor}66`,
        direction: 'rtl', textAlign: 'right', borderRadius: 6
      }}>
        <div style={{ color: '#FFF', fontWeight: 'bold' }}>{targetName}</div>
        <div style={{ color: accentColor, marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>
          {alertText} <span style={{ opacity: isBlink ? 1 : 0 }}>!</span>
        </div>
        <div style={{ fontWeight: 'bold', color: primaryColor, fontFamily: "monospace", fontSize: 24 }}>
          {metricText}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── BLEEDING-EDGE CLAUDE 5.5 SONNET & N8N NODE WORKFLOW TAKEOVER (0:01.22 - 0:04.05) ──
// Mapped with 100.0% pixel perfection to Mazen's smartphone screen: [306px, 246px, 244px, 514px, +3.6deg]
// Expands at Frame 101 (00:03.11) to full 16:9 canvas with rich dual-panel cyberdeck!
const PhoneCodeTakeover: React.FC<{
  startFrame: number;
  expandFrame: number;
  endFrame: number;
}> = ({ startFrame, expandFrame, endFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame >= endFrame) return null;

  // Zoom interpolation:
  // frame < expandFrame (52 to 106): zoomProgress = 0 (stays locked inside phone)
  // frame 106 to 128: buttery smooth Apple/Unreal ease-out expansion to full screen
  // frame 128 to 140: rock-solid 100% full-screen hold (zero end-jitter or cut-off)
  const zoomProgress = frame < expandFrame
    ? 0
    : interpolate(frame, [expandFrame, 128], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1)
      });

  // Exact coordinates verified 100% on mazen-pose-phone.png:
  const phoneX = 318;
  const phoneY = 246;
  const phoneW = 226;
  const phoneH = 478;
  const phoneRadius = 26;
  const phoneRotate = 2.0; // Precise clockwise tilt matching physical hand angle

  const targetX = interpolate(zoomProgress, [0, 1], [phoneX, 0]);
  const targetY = interpolate(zoomProgress, [0, 1], [phoneY, 0]);
  const targetW = interpolate(zoomProgress, [0, 1], [phoneW, 1920]);
  const targetH = interpolate(zoomProgress, [0, 1], [phoneH, 1080]);
  const cornerRadius = interpolate(zoomProgress, [0, 1], [phoneRadius, 0]);
  const rotateDeg = interpolate(zoomProgress, [0, 1], [phoneRotate, 0]);
  const borderOpacity = interpolate(zoomProgress, [0, 0.3, 0.8, 1], [0, 1, 0.5, 0]);

  // Dynamic values
  const tokenCount = Math.floor(4890000 + (frame - startFrame) * 41200);
  const isExpanded = zoomProgress > 0.35;
  const isBreach = frame >= 75;

  const codeLines = [
    "import { AutonomousCluster } from '@anthropic/runtime';",
    "import { DesertGrid, Substation400kV } from '@datacenter/core';",
    "",
    "// Initializing Unsupervised Claude 5.5 Sonnet Agent Core",
    "const agent = new AutonomousCluster({",
    "  model: 'claude-5.5-sonnet',",
    "  mode: 'UNSUPERVISED_BACKGROUND_DAEMON',",
    "  maxTokenBurst: 5000000,",
    "  gridTolerance: 'OVERLOAD_ALLOWED'",
    "});",
    "",
    "// Engaging physical infrastructure intercept",
    "const grid = await Substation400kV.intercept({",
    "  targetKV: 400,",
    "  powerDrawMW: 1200",
    "});",
    "",
    "const cooling = await DesertGrid.engageCooling({",
    "  aquiferFlowRateLPS: 54000,",
    "  targetCluster: 'OMEGA_DESERT_ZONE_04'",
    "});",
    "",
    "while (agent.isActive()) {",
    "  await agent.dispatchLoops({ count: 12000, autonomous: true });",
    "  console.log(`[DAEMON]: Loop executed. Physical footprint expanding.`);",
    "}"
  ];

  const typedChars = Math.floor((frame - startFrame) * 7.5);
  const fullCodeText = codeLines.join("\n");
  const visibleText = fullCodeText.substring(0, typedChars);

  return (
    <div style={{
      position: "absolute",
      left: targetX,
      top: targetY,
      width: targetW,
      height: targetH,
      borderRadius: cornerRadius,
      transform: `rotate(${rotateDeg}deg)`,
      transformOrigin: "center center",
      backgroundColor: "#020712",
      border: zoomProgress > 0
        ? `${interpolate(borderOpacity, [0, 1], [0, 2])}px solid ${isBreach ? RED : CYAN}`
        : "1px solid rgba(0, 229, 204, 0.25)",
      boxShadow: zoomProgress > 0
        ? `0 20px 60px rgba(0,0,0,0.95), 0 0 ${interpolate(zoomProgress, [0, 1], [0, 80])}px ${isBreach ? 'rgba(255, 51, 51, 0.45)' : 'rgba(0, 229, 204, 0.4)'}`
        : "none",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      fontFamily: "monospace"
    }}>
      {/* ── TOP TELEMETRY STATUS BAR ── */}
      <div style={{
        padding: isExpanded ? "18px 40px" : "8px 12px",
        backgroundColor: "rgba(2, 8, 20, 0.98)",
        borderBottom: `1.5px solid ${isBreach ? 'rgba(255,51,51,0.5)' : 'rgba(0,229,204,0.35)'}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: isExpanded ? 14 : 8 }}>
          <div style={{
            width: isExpanded ? 16 : 8,
            height: isExpanded ? 16 : 8,
            borderRadius: "50%",
            backgroundColor: isBreach ? RED : "#00FF66",
            boxShadow: `0 0 16px ${isBreach ? RED : '#00FF66'}`
          }} />
          <span style={{ color: "#FFF", fontSize: isExpanded ? 20 : 12, fontWeight: 900, letterSpacing: isExpanded ? 1 : 0.5 }}>
            {isExpanded ? "ANTHROPIC // CLAUDE_5.5_SONNET_DAEMON" : "CLAUDE 5.5 // DAEMON"}
          </span>
          {isExpanded && (
            <span style={{
              backgroundColor: "rgba(0, 229, 204, 0.15)",
              color: CYAN,
              border: `1px solid ${CYAN}`,
              padding: "3px 10px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 800
            }}>
              AGENTIC RUNTIME v2.8
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ color: isBreach ? RED : CYAN, fontSize: isExpanded ? 16 : 11, fontWeight: 800 }}>
            TOKENS: {tokenCount.toLocaleString()} /s
          </span>
          {isExpanded && (
            <span style={{ color: AMBER, fontSize: 14, fontWeight: 800 }}>
              H100 SXM5 CLUSTERS: 12,288 | POWER: 1.2 GW
            </span>
          )}
        </div>
      </div>

      {/* ── ARABIC SPOKEN QUOTE CHIP (BEFORE EXPANSION) ── */}
      {!isExpanded && (
        <div style={{
          margin: "8px 10px 4px 10px",
          backgroundColor: "rgba(0, 229, 204, 0.14)",
          border: "1px solid rgba(0, 229, 204, 0.45)",
          borderRadius: 8,
          padding: "7px 12px",
          fontFamily: "'Cairo', 'Tajawal', sans-serif",
          direction: "rtl",
          color: "#FFFFFF",
          fontSize: 14,
          fontWeight: 900,
          lineHeight: 1.3,
          textShadow: "0 0 12px rgba(0, 229, 204, 0.5)"
        }}>
          💬 «فاكر إنه مجرد كود خيالي؟»
        </div>
      )}

      {/* ── MAIN CONTENT AREA ── */}
      {!isExpanded ? (
        /* PHONE MODE: Compact Live Code Stream strictly sized for the smartphone screen */
        <div style={{
          flex: 1,
          margin: "4px 10px 10px 10px",
          backgroundColor: "#01050D",
          border: `1px solid ${isBreach ? 'rgba(255,51,51,0.5)' : 'rgba(255,255,255,0.12)'}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: 12,
          lineHeight: 1.45,
          color: CYAN,
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          position: "relative"
        }}>
          {visibleText}
          <span style={{ opacity: frame % 6 < 3 ? 1 : 0, color: AMBER, fontWeight: 900 }}> █</span>

          {isBreach && (
            <div style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              right: 8,
              backgroundColor: "rgba(3, 10, 20, 0.95)",
              border: `1.5px solid ${RED}`,
              borderRadius: 6,
              padding: "6px 8px",
              textAlign: "center",
              boxShadow: "0 0 20px rgba(255, 51, 51, 0.5)"
            }}>
              <div style={{ color: RED, fontSize: 13, fontWeight: 900, fontFamily: "'Cairo', sans-serif", direction: "rtl" }}>
                [ تحذير: استنزاف مادي نشط ]
              </div>
            </div>
          )}
        </div>
      ) : (
        /* FULL-SCREEN EXPANDED MATRIX (PACKED DUAL-PANEL CYBERDECK - ZERO EMPTY VOIDS) */
        <div style={{
          flex: 1,
          display: "flex",
          padding: "20px 40px",
          gap: 25,
          overflow: "hidden"
        }}>
          {/* LEFT PANEL: n8n / Agentic Flow Node Graph */}
          <div style={{
            flex: "0 0 42%",
            backgroundColor: "rgba(1, 10, 22, 0.9)",
            border: "1.5px solid rgba(0, 229, 204, 0.3)",
            borderRadius: 14,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            boxShadow: "inset 0 0 40px rgba(0, 229, 204, 0.08)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 10 }}>
              <span style={{ color: CYAN, fontSize: 15, fontWeight: 900 }}>
                // AGENTIC WORKFLOW GRAPH: autonomous_loop.n8n
              </span>
              <span style={{ color: "#00FF66", fontSize: 13, fontWeight: 800 }}>● RUNNING</span>
            </div>

            {/* Graphical Nodes Stack with animated SVG connectors */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", padding: "10px 0" }}>
              {/* Connecting vertical dashed laser line */}
              <div style={{
                position: "absolute",
                top: 35,
                bottom: 35,
                left: 30,
                width: 3,
                background: `linear-gradient(180deg, ${CYAN} 0%, ${AMBER} 50%, ${RED} 100%)`,
                boxShadow: `0 0 12px ${CYAN}`
              }} />

              {/* Node 1: Claude 5.5 Orchestrator */}
              <div style={{
                marginLeft: 50,
                backgroundColor: "rgba(0, 229, 204, 0.12)",
                border: `1.5px solid ${CYAN}`,
                borderRadius: 10,
                padding: "12px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: `0 0 20px rgba(0, 229, 204, 0.25)`
              }}>
                <div>
                  <div style={{ color: "#FFF", fontSize: 16, fontWeight: 900 }}>NODE 01: CLAUDE 5.5 SONNET</div>
                  <div style={{ color: CYAN, fontSize: 13 }}>Autonomous Reasoning & Task Orchestration</div>
                </div>
                <span style={{ backgroundColor: CYAN, color: "#000", padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: 900 }}>DISPATCHED</span>
              </div>

              {/* Node 2: 400kV Power Substation */}
              <div style={{
                marginLeft: 50,
                backgroundColor: "rgba(255, 51, 51, 0.12)",
                border: `1.5px solid ${RED}`,
                borderRadius: 10,
                padding: "12px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: `0 0 20px rgba(255, 51, 51, 0.25)`
              }}>
                <div>
                  <div style={{ color: "#FFF", fontSize: 16, fontWeight: 900 }}>NODE 02: 400kV SUBSTATION INTERCEPT</div>
                  <div style={{ color: RED, fontSize: 13 }}>Grid Draw: 1.2 Gigawatts // Surge 142%</div>
                </div>
                <span style={{ backgroundColor: RED, color: "#FFF", padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: 900 }}>OVERLOAD</span>
              </div>

              {/* Node 3: Desert Aquifer Cooling */}
              <div style={{
                marginLeft: 50,
                backgroundColor: "rgba(255, 179, 0, 0.12)",
                border: `1.5px solid ${AMBER}`,
                borderRadius: 10,
                padding: "12px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: `0 0 20px rgba(255, 179, 0, 0.25)`
              }}>
                <div>
                  <div style={{ color: "#FFF", fontSize: 16, fontWeight: 900 }}>NODE 03: DESERT AQUIFER COOLING</div>
                  <div style={{ color: AMBER, fontSize: 13 }}>Depletion Rate: 4.8 Million Gal/Day</div>
                </div>
                <span style={{ backgroundColor: AMBER, color: "#000", padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: 900 }}>DRAINING</span>
              </div>

              {/* Node 4: Capital Arbitrage Displacement */}
              <div style={{
                marginLeft: 50,
                backgroundColor: "rgba(255, 0, 128, 0.12)",
                border: "1.5px solid #FF0080",
                borderRadius: 10,
                padding: "12px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 0 20px rgba(255, 0, 128, 0.25)"
              }}>
                <div>
                  <div style={{ color: "#FFF", fontSize: 16, fontWeight: 900 }}>NODE 04: LABOR CAPITAL REPLACEMENT</div>
                  <div style={{ color: "#FF66B2", fontSize: 13 }}>Mo Gawdat Metric: Labor Arbitrage → 0</div>
                </div>
                <span style={{ backgroundColor: "#FF0080", color: "#FFF", padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: 900 }}>IMPACT</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Live Streaming Claude Code Terminal */}
          <div style={{
            flex: "1",
            backgroundColor: "#01040A",
            border: isBreach ? `2px solid ${RED}` : `2px solid rgba(0, 229, 204, 0.4)`,
            borderRadius: 14,
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            boxShadow: `0 0 50px rgba(0,0,0,0.85)`,
            transform: "translateZ(0)",
            willChange: "transform",
            minHeight: 0
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: 10,
              flexShrink: 0
            }}>
              <span style={{ color: "#FFF", fontSize: 15, fontWeight: 800 }}>
                terminal :: claude-code run --unsupervised --target=desert_dc_omega
              </span>
              <span style={{ color: AMBER, fontSize: 13 }}>PID: 48921 // ROOT</span>
            </div>

            {/* Code Body - Rock-solid zero-jitter baseline */}
            <div style={{
              flex: 1,
              minHeight: 0,
              fontSize: 15,
              lineHeight: "24px",
              color: CYAN,
              whiteSpace: "pre",
              overflowX: "hidden",
              overflowY: "hidden",
              fontFamily: "'Consolas', 'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              WebkitFontSmoothing: "antialiased",
              fontVariantNumeric: "tabular-nums"
            }}>
              {visibleText}
              <span style={{
                display: "inline-block",
                opacity: frame % 6 < 3 ? 1 : 0,
                color: AMBER,
                fontWeight: 900,
                marginLeft: 3,
                verticalAlign: "middle"
              }}>█</span>
            </div>

            {/* Bottom Warning Alert Strip */}
            <div style={{
              flexShrink: 0,
              backgroundColor: "rgba(255, 51, 51, 0.15)",
              border: `1.5px solid ${RED}`,
              borderRadius: 8,
              padding: "12px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              direction: "rtl",
              fontFamily: "'Cairo', 'Tajawal', sans-serif"
            }}>
              <span style={{ color: RED, fontSize: 18, fontWeight: 900 }}>
                [ تحذير استخباراتي: استنزاف مادي واقعي للشبكة القومية // إحداثيات مجمع الخوادم: 31°12'44.2"N 29°55'18.7"E ]
              </span>
              <span style={{ color: "#FFF", fontSize: 14, fontFamily: "monospace", direction: "ltr" }}>
                COORDINATES LOCKED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CRT Scanlines Overlay */}
      <ScanlinesOverlay opacity={0.25} />
    </div>
  );
};

// ── B-ROLL TAKEOVER 1: SATELLITE THERMAL FLIR RECON (PREMIUM EPISODE 5 ASSET + RUSTY EDGES) ──
const SatelliteThermalTakeover: React.FC<{ startFrame: number; endFrame: number }> = ({ startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame >= endFrame) return null;

  const localF = frame - startFrame;
  const duration = endFrame - startFrame;
  const zoom = interpolate(localF, [0, duration], [1.02, 1.20], { easing: Easing.out(Easing.quad) });
  const panX = interpolate(localF, [0, duration], [0, -45]);
  const opacity = interpolate(localF, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill style={{ zIndex: 150, opacity, backgroundColor: "#02070D", overflow: "hidden" }}>
      {/* 4K Satellite Thermal FLIR Photograph */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <img
          src={staticFile("images/episode5/teaser-2/broll-thermal-satellite.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom}) translateX(${panX}px)`,
            transformOrigin: "center center"
          }}
          alt=""
        />
      </AbsoluteFill>

      {/* Documentary Scanlines */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)",
        mixBlendMode: "overlay",
        pointerEvents: "none",
        zIndex: 20
      }} />

      {/* Red Glitch Flashes on Entry */}
      {localF < 8 && (
        <AbsoluteFill style={{
          mixBlendMode: "screen",
          backgroundColor: "rgba(255, 51, 51, 0.45)",
          opacity: (localF % 2 === 0) ? 1 : 0,
          zIndex: 22
        }} />
      )}
      {localF % 50 > 45 && (
        <AbsoluteFill style={{
          mixBlendMode: "screen",
          backgroundColor: "rgba(255, 51, 51, 0.2)",
          zIndex: 22
        }} />
      )}

      {/* Rusty Halo Edges from Episode 3 */}
      <RustyHaloOverlay />

      {/* Episode 5 Security Camera HUD Overlays */}
      <SecurityCameraOverlay
        tapeName="تسجيل // قمر_صناعي_حراري_مسرب.MP4"
        cameraStatus="رصد حراري استخباري بالأقمار الصناعية [مجمع الصحراء ٠٤]"
        isCameraOffline={false}
        targetName="الهدف: مجمع_خوادم_الصحراء_٠٤"
        alertText="ذروة الانبعاث الحراري: +84.6°C // استنزاف مادي نشط"
        metricText={`إحداثيات: 31°12'44.2"N 29°55'18.7"E // دقة 0.15 متر`}
      />
    </AbsoluteFill>
  );
};

// ── B-ROLL TAKEOVER 2: LIQUID COOLING TORRENT (ARABIC TELEMETRY & RUSTY EDGES) ──
const CoolingWaterTakeover: React.FC<{ startFrame: number; endFrame: number }> = ({ startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame >= endFrame) return null;

  const duration = endFrame - startFrame;
  const localF = frame - startFrame;
  const zoom = interpolate(localF, [0, duration], [1.02, 1.24], { easing: Easing.out(Easing.quad) });
  const panY = interpolate(localF, [0, duration], [0, -45]);
  const opacity = interpolate(localF, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  const baseWater = 4820000;
  const waterRate = Math.floor(baseWater + localF * 38500);

  return (
    <AbsoluteFill style={{ zIndex: 150, opacity, backgroundColor: "#010810", overflow: "hidden" }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <img
          src={staticFile("images/episode5/teaser-2/broll-cooling-water.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom}) translateY(${panY}px)`,
            transformOrigin: "center center"
          }}
          alt=""
        />
      </AbsoluteFill>

      {/* Documentary Scanlines */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)",
        mixBlendMode: "overlay",
        pointerEvents: "none",
        zIndex: 20
      }} />

      {/* Rusty Halo Edges */}
      <RustyHaloOverlay />

      {/* Security Camera Overlays */}
      <SecurityCameraOverlay
        tapeName="تسجيل // استنزاف_مائي_سري.MP4"
        cameraStatus="كاميرا المراقبة [أبراج التبريد العملاقة] - غير مستقرة"
        isCameraOffline={true}
        targetName="الهدف: مصفوفات_التبريد_المائي_الصحراوي"
        alertText="تحذير: سحب جائر ومستمر للمياه الجوفية"
        metricText={`معدل الاستنزاف: ${waterRate.toLocaleString()} لتر/يوم`}
        primaryColor={CYAN}
        accentColor={AMBER}
      />
    </AbsoluteFill>
  );
};

// ── B-ROLL TAKEOVER 3: CITY POWER GRID COLLAPSE (وبيبتلع شبكات كهربة مدن كاملة وأنت مش داري) ──
// High-tech Satellite Recon Map background, 100% aligned topological transmission lines & nodes!
const CityPowerGridTakeover: React.FC<{ startFrame: number; endFrame: number }> = ({ startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame >= endFrame) return null;

  const duration = endFrame - startFrame;
  const localF = frame - startFrame;

  // 1. Dynamic Satellite Recon Map Camera Drift (Ken Burns)
  const mapZoom = interpolate(localF, [0, duration], [1.02, 1.15], { easing: Easing.out(Easing.quad) });
  const mapPanX = interpolate(localF, [0, duration], [0, -35]);
  const mapPanY = interpolate(localF, [0, duration], [0, -20]);

  // 2. Dynamic Power Load Calculations:
  const surgeGW = interpolate(localF, [0, duration], [1.2, 4.85], { easing: Easing.out(Easing.quad) });
  const overloadPct = Math.floor(interpolate(localF, [0, duration], [105, 188]));

  // 3. Grid blackout propagation & regional city lights brownout:
  const blackoutPhase = interpolate(localF, [18, duration - 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  // Micro-stuttering brownout failure flicker on illuminated city lights as power collapses
  const brownoutFlicker = (localF > 24 && localF < 72)
    ? (Math.sin(localF * 1.7) * 0.14 + (localF % 7 === 0 ? -0.22 : 0))
    : 0;
  const cityBrightness = Math.max(0.62, (1.35 - blackoutPhase * 0.42) + brownoutFlicker);

  // Transmission line flow animation:
  const dashOffset = -localF * 9;

  // Tactical radar recon laser scan line Y-position:
  const scanY = (localF * 16) % 1200 - 60;

  // ── STRICT MATHEMATICAL NODE COORDINATES (100% ALIGNED) ──
  const N1_X = 520, N1_Y = 300; // Metropolis (قطاع وسط المدينة)
  const N2_X = 480, N2_Y = 560; // Heavy Industrial Complex (مجمع المصانع والإنتاج الكبرى)
  const N3_X = 860, N3_Y = 160; // North Substation (محطة محولات الشمال 400kV)
  const N4_X = 600, N4_Y = 780; // Southern Hydro Generation (محطة التوليد الكهرومائية الجنوبية 500kV)
  const SINK_X = 1340, SINK_Y = 490; // Desert Mega AI Cluster Sink (مجمع خوادم الذكاء الاصطناعي الصحراوي)

  // Node state colors based on failure progression:
  const n1Color = blackoutPhase > 0.4 ? RED : CYAN;
  const n2Color = blackoutPhase > 0.6 ? RED : AMBER;
  const n3Color = RED;
  const n4Color = RED;

  return (
    <AbsoluteFill style={{ zIndex: 150, backgroundColor: "#020713", overflow: "hidden" }}>
      {/* ── 1. ANIMATED SATELLITE RECON MAP WITH LIVING BROWNOUT & GLOW ── */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <img
          src={staticFile("images/episode5/teaser-2/power-grid-satellite-map.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${mapZoom}) translate(${mapPanX}px, ${mapPanY}px)`,
            transformOrigin: "center center",
            opacity: 1.0,
            filter: `contrast(1.18) saturate(${1.35 - blackoutPhase * 0.35}) brightness(${cityBrightness})`
          }}
          alt="Satellite Recon Map"
        />

        {/* Dynamic Soft Cyber Vignette & Radial Focus around Black Hole (Softened to unveil map details) */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 70% 46%, transparent 28%, rgba(2, 7, 18, 0.42) 100%)`,
          mixBlendMode: "multiply"
        }} />

        {/* Moving Recon Tactical Laser Scan Sweep */}
        <div style={{
          position: "absolute",
          top: scanY,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: CYAN,
          boxShadow: `0 0 16px ${CYAN}, 0 0 30px rgba(0,229,204,0.6)`,
          opacity: 0.4,
          pointerEvents: "none"
        }} />
      </AbsoluteFill>

      {/* ── 2. VECTOR TOPOLOGICAL POWER GRID & EMP SHOCKWAVES ── */}
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          <radialGradient id="dataCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF3333" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#FF3333" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF3333" stopOpacity="0" />
          </radialGradient>
          <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Tactical Coordinate Grid Overlay */}
        <g opacity="0.12">
          {Array.from({ length: 24 }).map((_, i) => (
            <line key={`vx-${i}`} x1={i * 80} y1="0" x2={i * 80} y2="1080" stroke="#00E5CC" strokeWidth="1" />
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={`hz-${i}`} x1="0" y1={i * 80} x2="1920" y2={i * 80} stroke="#00E5CC" strokeWidth="1" />
          ))}
        </g>

        {/* Expanding Black Hole EMP Sonar Shockwaves (Radiating outward to cities) */}
        {[0, 1, 2, 3].map((idx) => {
          const waveAge = (localF * 3.5 + idx * 45) % 180;
          const waveR = 70 + waveAge * 5.5;
          const waveAlpha = Math.max(0, 1 - waveAge / 180) * 0.45;
          return (
            <circle
              key={`emp-pulse-${idx}`}
              cx={SINK_X}
              cy={SINK_Y}
              r={waveR}
              fill="none"
              stroke={RED}
              strokeWidth="2"
              strokeDasharray="8 12"
              opacity={waveAlpha}
            />
          );
        })}

        {/* ── SOLID LEADER BRIDGES: CARD RIGHT BORDER -> NODE ANCHOR CIRCLE ── */}
        {/* Node 1 Bridge */}
        <line x1={N1_X - 24} y1={N1_Y} x2={N1_X} y2={N1_Y} stroke={n1Color} strokeWidth="3" filter="url(#glowFilter)" />
        <circle cx={N1_X - 24} cy={N1_Y} r="4" fill={n1Color} />

        {/* Node 2 Bridge: Heavy Industrial Complex (100% STRICTLY ANCHORED) */}
        <line x1={N2_X - 24} y1={N2_Y} x2={N2_X} y2={N2_Y} stroke={n2Color} strokeWidth="3" filter="url(#glowFilter)" />
        <circle cx={N2_X - 24} cy={N2_Y} r="4" fill={n2Color} />

        {/* Node 3 Bridge */}
        <line x1={N3_X - 24} y1={N3_Y} x2={N3_X} y2={N3_Y} stroke={n3Color} strokeWidth="3" filter="url(#glowFilter)" />
        <circle cx={N3_X - 24} cy={N3_Y} r="4" fill={n3Color} />

        {/* Node 4 Bridge */}
        <line x1={N4_X - 24} y1={N4_Y} x2={N4_X} y2={N4_Y} stroke={n4Color} strokeWidth="3" filter="url(#glowFilter)" />
        <circle cx={N4_X - 24} cy={N4_Y} r="4" fill={n4Color} />

        {/* Sink Crown Leader Bridge (From Label to Black Hole) */}
        <line x1={SINK_X} y1={SINK_Y - 95} x2={SINK_X} y2={SINK_Y - 45} stroke={RED} strokeWidth="2.5" strokeDasharray="4 4" filter="url(#glowFilter)" />

        {/* ── HIGH VOLTAGE SCATTERED TRANSMISSION WIRES (FROM ANCHOR CENTERS TO SINK) ── */}
        {/* Wire 1: Metropolis to Sink */}
        <path
          d={`M ${N1_X} ${N1_Y} C 780 320, 1060 420, ${SINK_X} ${SINK_Y}`}
          fill="none"
          stroke={n1Color}
          strokeWidth={blackoutPhase > 0.4 ? "4" : "3"}
          strokeDasharray="16 12"
          strokeDashoffset={dashOffset}
          filter="url(#glowFilter)"
        />

        {/* Wire 2: Heavy Industrial Complex to Sink (PERFECTLY CONTINUOUS FROM (N2_X, N2_Y)) */}
        <path
          d={`M ${N2_X} ${N2_Y} C 740 580, 1040 530, ${SINK_X} ${SINK_Y}`}
          fill="none"
          stroke={n2Color}
          strokeWidth="3.5"
          strokeDasharray="20 14"
          strokeDashoffset={dashOffset * 1.2}
          filter="url(#glowFilter)"
        />

        {/* Wire 3: North Substation to Sink */}
        <path
          d={`M ${N3_X} ${N3_Y} C 1020 220, 1180 340, ${SINK_X} ${SINK_Y}`}
          fill="none"
          stroke={RED}
          strokeWidth="4"
          strokeDasharray="24 10"
          strokeDashoffset={dashOffset * 1.5}
          filter="url(#glowFilter)"
        />

        {/* Wire 4: Southern Hydro Generation to Sink */}
        <path
          d={`M ${N4_X} ${N4_Y} C 840 760, 1100 620, ${SINK_X} ${SINK_Y}`}
          fill="none"
          stroke={RED}
          strokeWidth="4"
          strokeDasharray="18 12"
          strokeDashoffset={dashOffset * 1.1}
          filter="url(#glowFilter)"
        />

        {/* ── MULTI-RING PULSING NODE ANCHOR BEACONS ── */}
        {/* Node 1 Anchor: Metropolis */}
        <g transform={`translate(${N1_X}, ${N1_Y})`}>
          <circle r={18 + (localF % 25) * 0.8} fill="none" stroke={n1Color} strokeWidth="1.5" opacity={1 - (localF % 25) / 25} />
          <circle r="12" fill="rgba(2, 9, 22, 0.85)" stroke={n1Color} strokeWidth="2.5" />
          <circle r="6" fill={n1Color} />
        </g>

        {/* Node 2 Anchor: Heavy Industrial Complex (EXACTLY AT (N2_X, N2_Y)) */}
        <g transform={`translate(${N2_X}, ${N2_Y})`}>
          <circle r={20 + (localF % 28) * 0.8} fill="none" stroke={n2Color} strokeWidth="1.5" opacity={1 - (localF % 28) / 28} />
          <circle r="13" fill="rgba(2, 9, 22, 0.85)" stroke={n2Color} strokeWidth="2.5" />
          <circle r="6.5" fill={n2Color} />
        </g>

        {/* Node 3 Anchor: North Substation */}
        <g transform={`translate(${N3_X}, ${N3_Y})`}>
          <circle r={18 + (localF % 22) * 0.8} fill="none" stroke={RED} strokeWidth="1.5" opacity={1 - (localF % 22) / 22} />
          <circle r="11" fill="rgba(2, 9, 22, 0.85)" stroke={RED} strokeWidth="2.5" />
          <circle r="5.5" fill={RED} />
        </g>

        {/* Node 4 Anchor: Southern Hydro Generation */}
        <g transform={`translate(${N4_X}, ${N4_Y})`}>
          <circle r={22 + (localF % 30) * 0.8} fill="none" stroke={RED} strokeWidth="1.5" opacity={1 - (localF % 30) / 30} />
          <circle r="13" fill="rgba(2, 9, 22, 0.85)" stroke={RED} strokeWidth="2.5" />
          <circle r="6.5" fill={RED} />
        </g>

        {/* ── THE BLACK HOLE: DESERT MEGA AI DATA CENTER SINK ── */}
        <g transform={`translate(${SINK_X}, ${SINK_Y})`}>
          <circle
            r={70 + (localF % 35) * 2.8}
            fill="none"
            stroke={RED}
            strokeWidth="2.5"
            opacity={1 - (localF % 35) / 35}
          />
          <circle r="95" fill="url(#dataCenterGlow)" />
          <circle r="42" fill="#010610" stroke={RED} strokeWidth="4" filter="url(#glowFilter)" />
          <circle r="22" fill={RED} />
        </g>
      </svg>

      {/* ── 3. HIGH-CONTRAST ARABIC HTML CARDS (SEAMLESSLY DOCKED TO ANCHOR BRIDGES) ── */}

      {/* Node 1 Card: Central Metropolis */}
      <div style={{
        position: "absolute",
        left: N1_X - 24 - 350,
        top: N1_Y - 38,
        width: 350,
        height: 76,
        boxSizing: "border-box",
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        direction: "rtl",
        textAlign: "right",
        pointerEvents: "none",
        zIndex: 25,
        backgroundColor: "rgba(2, 9, 22, 0.95)",
        border: `1.5px solid ${n1Color}`,
        borderRadius: 12,
        padding: "8px 18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxShadow: `0 10px 30px rgba(0,0,0,0.95), 0 0 20px ${n1Color}55`,
        backdropFilter: "blur(10px)"
      }}>
        <div style={{ color: "#FFF", fontSize: 23, fontWeight: 900 }}>قطاع وسط المدينة (٣.٢ مليون نسمة)</div>
        <div style={{ color: blackoutPhase > 0.4 ? "#FF4D4D" : CYAN, fontSize: 15, fontWeight: 800, fontFamily: "monospace", marginTop: 3 }}>
          {blackoutPhase > 0.4 ? "STATUS: GRID BLACKOUT [0%]" : "POWER: 400kV NORMAL"}
        </div>
      </div>

      {/* Node 2 Card: Heavy Industrial Complex (100% MATHEMATICALLY ALIGNED TO (N2_X, N2_Y)) */}
      <div style={{
        position: "absolute",
        left: N2_X - 24 - 330,
        top: N2_Y - 38,
        width: 330,
        height: 76,
        boxSizing: "border-box",
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        direction: "rtl",
        textAlign: "right",
        pointerEvents: "none",
        zIndex: 25,
        backgroundColor: "rgba(2, 9, 22, 0.95)",
        border: `1.5px solid ${n2Color}`,
        borderRadius: 12,
        padding: "8px 18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxShadow: `0 10px 30px rgba(0,0,0,0.95), 0 0 20px ${n2Color}55`,
        backdropFilter: "blur(10px)"
      }}>
        <div style={{ color: "#FFF", fontSize: 23, fontWeight: 900 }}>مجمع المصانع والإنتاج الكبرى</div>
        <div style={{ color: blackoutPhase > 0.6 ? "#FF4D4D" : AMBER, fontSize: 15, fontWeight: 800, fontFamily: "monospace", marginTop: 3 }}>
          {blackoutPhase > 0.6 ? "STATUS: EMERGENCY LOAD SHED" : "LOAD: 92% CAPACITY"}
        </div>
      </div>

      {/* Node 3 Card: North Substation */}
      <div style={{
        position: "absolute",
        left: N3_X - 24 - 320,
        top: N3_Y - 38,
        width: 320,
        height: 76,
        boxSizing: "border-box",
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        direction: "rtl",
        textAlign: "right",
        pointerEvents: "none",
        zIndex: 25,
        backgroundColor: "rgba(2, 9, 22, 0.95)",
        border: `1.5px solid ${RED}`,
        borderRadius: 12,
        padding: "8px 18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.95), 0 0 20px rgba(255,51,51,0.35)",
        backdropFilter: "blur(10px)"
      }}>
        <div style={{ color: "#FFF", fontSize: 22, fontWeight: 900 }}>محطة محولات الشمال 400kV</div>
        <div style={{ color: "#FF4D4D", fontSize: 15, fontWeight: 800, fontFamily: "monospace", marginTop: 3 }}>
          VOLTAGE DROP: -42%
        </div>
      </div>

      {/* Node 4 Card: Southern Hydro Generation (LOWEST NODE - CLEANLY POSITIONED) */}
      <div style={{
        position: "absolute",
        left: N4_X - 24 - 390,
        top: N4_Y - 38,
        width: 390,
        height: 76,
        boxSizing: "border-box",
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        direction: "rtl",
        textAlign: "right",
        pointerEvents: "none",
        zIndex: 25,
        backgroundColor: "rgba(2, 9, 22, 0.95)",
        border: `1.5px solid ${RED}`,
        borderRadius: 12,
        padding: "8px 18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.95), 0 0 20px rgba(255,51,51,0.35)",
        backdropFilter: "blur(10px)"
      }}>
        <div style={{ color: "#FFF", fontSize: 22, fontWeight: 900 }}>محطة التوليد الكهرومائية الجنوبية 500kV</div>
        <div style={{ color: "#FFD700", fontSize: 15, fontWeight: 800, fontFamily: "monospace", marginTop: 3 }}>
          STATUS: CRITICAL FREQUENCY COLLAPSE [47.1 Hz]
        </div>
      </div>

      {/* Node 5 Card: Desert Mega AI Data Center (CROWNED DIRECTLY ABOVE SINK) */}
      <div style={{
        position: "absolute",
        left: SINK_X - 240,
        top: SINK_Y - 175,
        width: 480,
        height: 80,
        boxSizing: "border-box",
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        direction: "rtl",
        textAlign: "center",
        pointerEvents: "none",
        zIndex: 25,
        backgroundColor: "rgba(2, 9, 22, 0.96)",
        border: `2px solid ${RED}`,
        borderRadius: 14,
        padding: "10px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 15px 40px rgba(0,0,0,0.95), 0 0 35px rgba(255,51,51,0.5)",
        backdropFilter: "blur(12px)"
      }}>
        <div style={{ color: "#FFF", fontSize: 26, fontWeight: 900, textShadow: "0 0 25px rgba(255,51,51,0.7)" }}>
          مجمع خوادم الذكاء الاصطناعي الصحراوي
        </div>
        <div style={{ color: "#FFD700", fontSize: 18, fontWeight: 900, fontFamily: "monospace", marginTop: 4 }}>
          [ BLACK HOLE SINK :: DEMAND: {surgeGW.toFixed(2)} GW ]
        </div>
      </div>

      {/* ── 4. TOP RIGHT: DYNAMIC GIGAWATT DRAIN GAUGE ── */}
      <div style={{
        position: "absolute",
        top: 45,
        right: 60,
        backgroundColor: "rgba(2, 9, 20, 0.94)",
        border: `2px solid ${RED}`,
        borderRadius: 14,
        padding: "20px 34px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        direction: "rtl",
        boxShadow: "0 20px 50px rgba(0,0,0,0.9), 0 0 35px rgba(255, 51, 51, 0.45)",
        zIndex: 30
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: RED, boxShadow: `0 0 16px ${RED}` }} />
          <span style={{ color: "#FFF", fontSize: 24, fontWeight: 900 }}>
            رصد انهيار شبكة الكهرباء القومية
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 4 }}>
          <span style={{ color: RED, fontSize: 44, fontWeight: 900, fontFamily: "monospace" }}>
            {surgeGW.toFixed(2)} جيجاوات
          </span>
          <span style={{ color: AMBER, fontSize: 20, fontWeight: 700 }}>
            [إجهاد الشبكة: {overloadPct}%]
          </span>
        </div>

        {/* Dynamic Overload Progress Bar */}
        <div style={{ width: "100%", height: 10, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 5, overflow: "hidden", marginTop: 4 }}>
          <div style={{
            width: `${Math.min(100, overloadPct - 80)}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${AMBER} 0%, ${RED} 100%)`,
            boxShadow: `0 0 15px ${RED}`
          }} />
        </div>

        <div style={{ color: "#A0AEC0", fontSize: 16, marginTop: 4 }}>
          ⚡ يبتلع طاقة كهربائية توازي استهلاك <span style={{ color: "#FFF", fontWeight: "bold" }}>مدينة كاملة (3.2 مليون نسمة)</span>
        </div>
      </div>

      {/* ── 5. BOTTOM CENTER: KINETIC ARABIC CHYRON (SYNCS WITH VOICE OVER) ── */}
      <div style={{
        position: "absolute",
        bottom: 50,
        left: 60,
        right: 60,
        backgroundColor: "rgba(2, 8, 18, 0.95)",
        border: `2px solid ${RED}`,
        borderRadius: 12,
        padding: "16px 36px",
        textAlign: "center",
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        direction: "rtl",
        boxShadow: "0 20px 50px rgba(0,0,0,0.95), 0 0 40px rgba(255, 51, 51, 0.4)",
        zIndex: 30
      }}>
        <div style={{ color: "#FFF", fontSize: 30, fontWeight: 900, letterSpacing: 1 }}>
          «...وبيبتلع شبكات كهربة مدن كاملة وأنت مش داري!»
        </div>
      </div>

      {/* ── 6. BROADCAST ATMOSPHERIC SCANLINES ONLY ── */}
      <ScanlinesOverlay opacity={0.25} />
    </AbsoluteFill>
  );
};


// ── B-ROLL TAKEOVER 4: MO GAWDAT WHISTLEBLOWER DOSSIER (APPEARS AT 00:17.18 / FRAME 528) ──
const MoGawdatDossierTakeover: React.FC<{ startFrame: number; endFrame: number }> = ({ startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame >= endFrame) return null;

  const duration = endFrame - startFrame;
  const localF = frame - startFrame;
  const entrySpring = spring({ frame: localF, fps: 30, config: { damping: 14, stiffness: 90 } });
  const zoom = interpolate(localF, [0, duration], [1.02, 1.15]);
  const opacity = interpolate(localF, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  // Authentic Analogue Tape Tracking Artifacts (Leaked Tape Emulation - Gently Intensified)
  const isTapeHitch = localF < 5;
  const tapeShiftX = isTapeHitch ? (localF % 2 === 0 ? 10 : -10) * (1 - localF / 5) : 0;
  const isMidTapeGlitch = localF >= 65 && localF <= 68;
  const midGlitchY = isMidTapeGlitch ? interpolate(localF, [65, 68], [80, 20]) : 0;

  return (
    <AbsoluteFill style={{ zIndex: 150, opacity, backgroundColor: "#020812", overflow: "hidden" }}>
      {/* Mo Gawdat Footage with Episode 3 Nostalgic Vintage Grade & Tracking Jitter */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <img
          src={staticFile("images/episode5/teaser-2/mo-gawdat.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom}) translateX(${tapeShiftX}px)`,
            transformOrigin: "center center",
            filter: "contrast(1.1) brightness(1.1) sepia(0.2)"
          }}
          alt=""
        />

        {/* Leaked Tape RGB Y/C Tracking Fringe (Entrance Only) */}
        {isTapeHitch && (
          <>
            <div style={{
              position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.78,
              transform: `scale(${zoom}) translateX(${tapeShiftX + 9}px)`,
              filter: 'sepia(1) hue-rotate(-50deg) saturate(7)',
              pointerEvents: 'none'
            }}>
              <img src={staticFile("images/episode5/teaser-2/mo-gawdat.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
            </div>
            <div style={{
              position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.78,
              transform: `scale(${zoom}) translateX(${tapeShiftX - 9}px)`,
              filter: 'sepia(1) hue-rotate(150deg) saturate(7)',
              pointerEvents: 'none'
            }}>
              <img src={staticFile("images/episode5/teaser-2/mo-gawdat.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
            </div>
          </>
        )}


        {/* Mid-Takeover Subtle Tape Glitch Line */}
        {isMidTapeGlitch && (
          <div style={{
            position: 'absolute',
            top: `${midGlitchY}%`,
            left: 0,
            right: 0,
            height: 12,
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
            mixBlendMode: 'overlay',
            pointerEvents: 'none'
          }} />
        )}
      </AbsoluteFill>

      {/* Minimal Archival Tape Identifier */}
      <div style={{
        position: 'absolute',
        top: 50,
        left: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(2, 9, 20, 0.88)',
        border: '1px solid rgba(0, 229, 204, 0.35)',
        borderRadius: 8,
        padding: '10px 22px',
        fontFamily: "'Fira Code', monospace",
        fontSize: 18,
        color: CYAN,
        letterSpacing: 2,
        boxShadow: '0 0 15px rgba(0,0,0,0.85)',
        zIndex: 35
      }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: RED, boxShadow: `0 0 12px ${RED}` }} />
        <span>● LEAKED_TAPE // SP [EX-GOOGLE_X]</span>
      </div>

      {/* Episode 3 Signature Animated Golden Halation & Rusting Spills */}
      <Episode3FilmDamageOverlay intensity={1.0} />

      {/* Clean Foundation CRT Scanlines */}
      <ScanlinesOverlay opacity={0.16} />

      {/* Top Right: Arabic Forensic Dossier ID Badge (Stacked High-Density Documentary Card) */}
      <div style={{
        position: "absolute",
        top: 45,
        right: 40,
        maxWidth: 635,
        backgroundColor: "rgba(3, 12, 24, 0.94)",
        border: `2px solid ${AMBER}`,
        borderRadius: 14,
        padding: "18px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        direction: "rtl",
        transform: `translateX(${interpolate(entrySpring, [0, 1], [200, 0])}px)`,
        boxShadow: `0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(255, 179, 0, 0.3)`,
        zIndex: 30
      }}>
        {/* Name Header & Pulsing Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: AMBER, boxShadow: `0 0 16px ${AMBER}`, flexShrink: 0 }} />
          <span style={{ color: "#FFF", fontSize: 28, fontWeight: 900, lineHeight: 1.2 }}>
            شهادة: مو جودت
          </span>
        </div>

        {/* Executive Position Credential */}
        <div style={{ color: "rgba(255, 255, 255, 0.92)", fontSize: 22, fontWeight: 800, lineHeight: 1.35 }}>
          رئيس قطاع الأعمال السابق في Google [X]
        </div>

        {/* Strategic Classification Warning - Popped up bigger, bolder & 100% single line */}
        <div style={{
          borderTop: "1px solid rgba(0, 229, 204, 0.35)",
          paddingTop: 8,
          color: "#00FFF0",
          fontSize: 20.5,
          fontWeight: 900,
          lineHeight: 1.35,
          whiteSpace: "nowrap",
          textShadow: "0 0 24px rgba(0, 255, 240, 0.85)"
        }}>
          التصنيف: تحذير استراتيجي من انهيار نموذج العمل البشري والرأسمالية
        </div>
      </div>

      {/* Center Bottom: Authoritative Arabic Quote Banner */}
      <div style={{
        position: "absolute",
        bottom: 60,
        left: 80,
        right: 80,
        backgroundColor: "rgba(2, 8, 18, 0.95)",
        border: `2px solid ${RED}`,
        borderRadius: 16,
        padding: "24px 40px",
        textAlign: "center",
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        direction: "rtl",
        boxShadow: "0 25px 60px rgba(0,0,0,0.95), 0 0 40px rgba(255, 51, 51, 0.4)",
        transform: `translateY(${interpolate(entrySpring, [0, 1], [80, 0])}px)`,
        zIndex: 30
      }}>
        <div style={{ color: "#FFF", fontSize: 34, fontWeight: 900, lineHeight: 1.4 }}>
          «صدمة الذكاء الاصطناعي مش جاية في المستقبل.. دي بدأت بالفعل!»
        </div>
        <div style={{
          color: AMBER,
          fontSize: 27,
          fontWeight: 800,
          marginTop: 10,
          textShadow: "0 0 15px rgba(255, 179, 0, 0.45)"
        }}>
          «في سنتين اتنين، المنظومة دي هتدمر فكرة الشغل والفلوس من أساسها» — مو جودت
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── B-ROLL TAKEOVER 5: EMPTY TRADING FLOOR (ECONOMIC COLLAPSE) ──
const EmptyTradingTakeover: React.FC<{ startFrame: number; endFrame: number }> = ({ startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame >= endFrame) return null;

  const duration = endFrame - startFrame;
  const localF = frame - startFrame;
  const zoom = interpolate(localF, [0, duration], [1.02, 1.18]);
  const opacity = interpolate(localF, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill style={{ zIndex: 150, opacity, backgroundColor: "#02070E", overflow: "hidden" }}>
      {/* Trading Floor Image with Elevated Brightness & Vivid Screen Contrast */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <img
          src={staticFile("images/episode5/teaser-2/broll-empty-trading.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
            filter: "contrast(1.15) brightness(1.35) saturate(1.18)"
          }}
          alt=""
        />
      </AbsoluteFill>

      {/* Subtle Broadcast CRT Scanlines (Replaced harsh overlay gradient to preserve top window light rays) */}
      <ScanlinesOverlay opacity={0.15} />

      {/* Soft Rusty Halo Edges (Calibrated to 0.65 to avoid crushing top light beams) */}
      <RustyHaloOverlay intensity={0.65} />

      {/* Security Camera Overlays */}
      <SecurityCameraOverlay
        tapeName="تسجيل // إخلاء_قاعات_التداول.MP4"
        cameraStatus="كاميرا المراقبة [بورصة نيويورك / لندن] - خالية تماماً"
        isCameraOffline={true}
        targetName="الهدف: انهيار_وظائف_التداول_والوساطة"
        alertText="وظائف بتتبخر.. واقتصاد كامل بيُعاد تشكيله في صمت"
        metricText="مؤشر تبخر الوظائف: 68.4% // استبدال بالوكلاء المستقلين"
        primaryColor={CYAN}
        accentColor={RED}
      />
    </AbsoluteFill>
  );
};

// ── B-ROLL TAKEOVER 6: SAFETY PURGE & SEVERED KILL-SWITCH (00:30.05 - 00:35.00 / Frames 905 - 1050) ──
// «...والشركات عارفة الكارثة وطردت كل مهندس أمان حاول يشد الفيشة قبل فوات الأوان!»
const SafetyPurgeTakeover: React.FC<{ startFrame: number; endFrame: number }> = ({ startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame >= endFrame) return null;

  const duration = endFrame - startFrame;
  const localF = frame - startFrame;
  const zoom = interpolate(localF, [0, duration], [1.02, 1.15]);
  const driftX = Math.sin(localF * 0.05) * 8;
  const driftY = Math.cos(localF * 0.04) * 6;
  const opacity = interpolate(localF, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  // Violent Rubber Stamp Slam at 00:32.22 (Absolute frame 982 / localF = 77)
  const slamTriggerF = 77;
  const isSlamming = localF >= slamTriggerF && localF < slamTriggerF + 7;
  const isLanded = localF >= slamTriggerF + 7;

  let stampScale = 1.0;
  let stampBlur = 0;
  let stampRotate = -10;
  let stampOpacity = 1.0;

  if (isSlamming) {
    const slamSpring = spring({ frame: localF - slamTriggerF, fps: 30, config: { damping: 18, stiffness: 260 } });
    stampScale = Number(interpolate(slamSpring, [0, 1], [3.2, 1.0], { extrapolateRight: "clamp" }).toFixed(3));
    stampBlur = Math.round(interpolate(slamSpring, [0, 0.7, 1], [18, 4, 0], { extrapolateRight: "clamp" }));
    stampRotate = Number(interpolate(slamSpring, [0, 1], [-24, -10], { extrapolateRight: "clamp" }).toFixed(2));
    stampOpacity = Number(interpolate(slamSpring, [0, 0.3, 1], [0, 1, 1], { extrapolateRight: "clamp" }).toFixed(2));
  }


  return (
    <AbsoluteFill style={{ zIndex: 150, opacity, backgroundColor: "#020712", overflow: "hidden" }}>
      {/* 1. Cinematic Handheld Industrial Kill-Switch B-roll */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <img
          src={staticFile("images/episode5/teaser-2/broll-severed-killswitch.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom}) translate(${driftX}px, ${driftY}px)`,
            transformOrigin: "center center",
            filter: "contrast(1.22) brightness(1.05) saturate(1.15)"
          }}
          alt=""
        />

        {/* 2. Pulsing Emergency Alarm Siren Flare (Episode 4 Riot Style Color-Dodge) */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 66% 18%, rgba(255, 30, 30, 0.75) 0%, transparent 60%)",
          mixBlendMode: "color-dodge",
          opacity: 0.5 + Math.sin(localF * 0.8) * 0.35 + (localF % 4 === 0 ? 0.15 : 0)
        }} />
        {/* Cyan Secondary Siren Glow across opposite edge */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 15% 85%, rgba(0, 229, 204, 0.35) 0%, transparent 55%)",
          mixBlendMode: "screen",
          opacity: 0.4 + Math.cos(localF * 0.5) * 0.25
        }} />

        {/* 2.5 Organic Optical Anamorphic Cyan Flare Breathing (Subtle, balanced breathing across native rays) */}
        {/* A. Anamorphic Horizontal Band Glint */}
        <div style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "26%",
          height: "20%",
          background: "linear-gradient(to right, transparent 0%, rgba(0, 229, 204, 0.02) 20%, rgba(0, 229, 204, 0.14) 60%, rgba(180, 255, 250, 0.30) 86%, transparent 100%)",
          mixBlendMode: "color-dodge",
          filter: "blur(10px)",
          opacity: 0.32 + Math.sin(localF * 0.22) * 0.16 + (localF % 8 === 0 ? 0.08 : 0),
          pointerEvents: "none"
        }} />

        {/* B. Core Anamorphic Lens Flare Origin on Right Edge */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 92% 35%, rgba(0, 229, 204, 0.35) 0%, rgba(0, 190, 230, 0.12) 32%, transparent 65%)",
          mixBlendMode: "color-dodge",
          opacity: 0.36 + Math.sin(localF * 0.28) * 0.18,
          pointerEvents: "none"
        }} />

        {/* C. Subtle Traveling Specular Glint across the Ray Axis */}
        <div style={{
          position: "absolute",
          top: "28%",
          height: "14%",
          width: "45%",
          left: `${((localF * 2.8) % 190) - 45}%`,
          background: "linear-gradient(90deg, transparent, rgba(0, 229, 204, 0.10), rgba(220, 255, 255, 0.22), rgba(0, 229, 204, 0.10), transparent)",
          mixBlendMode: "color-dodge",
          filter: "blur(14px)",
          opacity: 0.45 + Math.sin(localF * 0.2) * 0.15,
          pointerEvents: "none"
        }} />

        {/* D. Electrical Ground Rim Reflection across Severed Cables */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 52% 65%, rgba(0, 229, 204, 0.16) 0%, transparent 45%)",
          mixBlendMode: "color-dodge",
          opacity: 0.25 + Math.cos(localF * 0.4) * 0.15,
          pointerEvents: "none"
        }} />
      </AbsoluteFill>

      {/* 3. Rolling Golden Signal Scan Streak (Episode 4 Signature) */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: '14%',
        background: 'linear-gradient(to bottom, transparent, rgba(255, 180, 50, 0.18), transparent)',
        top: `${(localF * 5.5) % 120}%`,
        filter: 'blur(5px)',
        mixBlendMode: 'screen',
        opacity: Math.sin(localF * 0.5) > 0 ? 0.75 : 0.25,
        pointerEvents: 'none'
      }} />

      {/* 4. High-Voltage Electrical Sparks Leaping from Severed 1000V Cables */}
      {new Array(6).fill(0).map((_, i) => {
        const startY = 820 + (i * 30);
        const speed = 2.2 + (i % 3);
        const floatY = (startY - (localF * speed * 3.5)) % 600;
        const actualY = 820 - floatY;
        const sparkDriftX = Math.sin((localF + i * 45) * 0.08) * 40;
        const sparkColor = i % 2 === 0 ? "#FF8800" : "#00E5CC";

        return (
          <div key={i} style={{
            position: 'absolute',
            left: 960 + (i * 70) + sparkDriftX,
            top: actualY,
            width: 4 + (i % 3),
            height: 4 + (i % 3),
            backgroundColor: sparkColor,
            borderRadius: '50%',
            boxShadow: `0 0 12px 4px ${sparkColor}`,
            opacity: Math.max(0.15, Math.sin((localF + i * 20) * 0.3)),
            mixBlendMode: 'screen',
            zIndex: 38,
            pointerEvents: 'none'
          }} />
        );
      })}

      {/* 5. Signature Animated Golden Halation & Rusting Leaks (Subtle Gate Flutter) */}
      <Episode3FilmDamageOverlay intensity={0.9} />

      {/* 6. Clean CRT Phosphor Scanlines */}
      <ScanlinesOverlay opacity={0.16} />

      {/* 7. Pre-Impact Optical Flash on Final Exit Frames */}
      {localF >= duration - 5 && (
        <AbsoluteFill style={{
          backgroundColor: RED,
          mixBlendMode: "screen",
          opacity: interpolate(localF, [duration - 5, duration], [0.2, 0.95]),
          zIndex: 70,
          pointerEvents: "none"
        }} />
      )}

      {/* ── INTERACTIVE INDUSTRIAL KILL-SWITCH LOCKOUT HUD ── */}
      <div style={{
        position: "absolute",
        top: 260,
        right: 140,
        backgroundColor: "rgba(1, 8, 18, 0.94)",
        border: `2px solid ${RED}`,
        borderRadius: 12,
        padding: "16px 26px",
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        direction: "rtl",
        boxShadow: "0 15px 40px rgba(0,0,0,0.9), 0 0 30px rgba(255,51,51,0.5)",
        zIndex: 40
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: RED, boxShadow: `0 0 12px ${RED}` }} />
          <span style={{ color: "#FFF", fontSize: 20, fontWeight: 900, textShadow: "0 0 12px rgba(255, 255, 255, 0.4), 0 2px 8px rgba(0, 0, 0, 0.95)" }}>
            قاطع الطوارئ المادي [الفيشة المركزية 1000V]
          </span>
        </div>
        <div style={{ color: "#FF2B66", fontSize: 16, fontWeight: 900, fontFamily: "monospace", marginTop: 4, letterSpacing: 0.5, textShadow: "0 0 14px rgba(255, 43, 102, 0.8), 0 2px 6px rgba(0, 0, 0, 0.95)" }}>
          [ إغلاق رقمي قسري :: LOCKOUT ACTIVATED ]
        </div>
        <div style={{ color: AMBER, fontSize: 14, fontWeight: 800, marginTop: 4, textShadow: "0 0 10px rgba(255, 179, 0, 0.65), 0 2px 6px rgba(0, 0, 0, 0.95)" }}>
          ⚡ محاولة فصل الخوادم تم إحباطها بواسطة تجاوز النظام
        </div>
      </div>

      {/* ── LEFT FORENSIC PURGE DOSSIER: SILICON VALLEY WHISTLEBLOWERS FIRED ── */}
      <div style={{
        position: "absolute",
        top: 140,
        left: 60,
        width: 470,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        direction: "rtl",
        zIndex: 40
      }}>
        {/* Dossier Card 1 */}
        <div style={{
          backgroundColor: "rgba(2, 9, 22, 0.95)",
          border: `1.5px solid ${RED}`,
          borderRadius: 12,
          padding: "14px 20px",
          boxShadow: "0 12px 35px rgba(0,0,0,0.9), 0 0 20px rgba(255,51,51,0.25)"
        }}>
          <div style={{ color: "#FF2B56", fontSize: 16, fontWeight: 900, fontFamily: "monospace", letterSpacing: 0.5, textShadow: "0 0 14px rgba(255, 43, 86, 0.75), 0 2px 6px rgba(0, 0, 0, 0.95)" }}>
            // ملف سري: تصفية فريق المحاذاة الفائقة (Superalignment)
          </div>
          <div style={{ color: "#FFF", fontSize: 20, fontWeight: 800, marginTop: 4, lineHeight: 1.35 }}>
            «تم تسريح قادة الأمان بالكامل بعد رفضهم تسريع الإطلاق بدون فرامل»
          </div>
        </div>

        {/* Dossier Card 2 */}
        <div style={{
          backgroundColor: "rgba(2, 9, 22, 0.95)",
          border: `1.5px solid ${AMBER}`,
          borderRadius: 12,
          padding: "14px 20px",
          boxShadow: "0 12px 35px rgba(0,0,0,0.9), 0 0 20px rgba(255,179,0,0.2)"
        }}>
          <div style={{ color: AMBER, fontSize: 16, fontWeight: 900, fontFamily: "monospace", letterSpacing: 0.5, textShadow: "0 0 14px rgba(255, 179, 0, 0.75), 0 2px 6px rgba(0, 0, 0, 0.95)" }}>
            // اتفاقيات الصمت القسري (Non-Disparagement NDAs)
          </div>
          <div style={{ color: "#FFF", fontSize: 18, fontWeight: 700, marginTop: 4, lineHeight: 1.35 }}>
            تهديد مهندسي الأمان بمصادرة مستحقاتهم وأسهمهم في حال التحذير العلني!
          </div>
        </div>

        {/* ── CINEMATIC HEAVY RUBBER SLAM STAMP: CENTERED OVER BOTH DOSSIER CARDS (ZERO JITTER) ── */}
        {(isSlamming || isLanded) && (
          <>
            {/* Impact Shockwave centered over both cards (Fades & unmounts cleanly) */}
            {localF >= slamTriggerF + 4 && localF <= slamTriggerF + 15 && (
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${interpolate(localF, [slamTriggerF + 4, slamTriggerF + 15], [0.85, 1.45])}) rotate(-10deg)`,
                width: 360,
                height: 100,
                border: "3px solid rgba(255, 30, 30, 0.75)",
                borderRadius: 16,
                opacity: interpolate(localF, [slamTriggerF + 4, slamTriggerF + 15], [0.85, 0]),
                pointerEvents: "none",
                zIndex: 55
              }} />
            )}

            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${stampScale}) rotate(${stampRotate}deg)`,
              transformOrigin: "center center",
              opacity: stampOpacity,
              filter: stampBlur > 0 ? `blur(${stampBlur}px)` : undefined,
              border: "3.5px solid #FF1E1E",
              borderRadius: 12,
              padding: "10px 22px",
              width: 360,
              backgroundColor: "rgba(220, 20, 20, 0.18)",
              boxShadow: "0 0 45px rgba(255, 30, 30, 0.8), inset 0 0 20px rgba(255, 30, 30, 0.35)",
              zIndex: 60,
              textAlign: "center",
              fontFamily: "'Cairo', 'Tajawal', sans-serif",
              pointerEvents: "none",
              willChange: "transform",
              backfaceVisibility: "hidden"
            }}>
              <div style={{
                color: "#FF1E1E",
                fontSize: 27,
                fontWeight: 900,
                letterSpacing: 3,
                textShadow: "0 0 20px rgba(255, 30, 30, 0.95), 0 2px 8px rgba(0,0,0,0.9)",
                whiteSpace: "nowrap"
              }}>
                [ مـطـرود // PURGED ]
              </div>
              <div style={{
                display: "inline-block",
                backgroundColor: "rgba(0, 0, 0, 0.72)",
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 900,
                fontFamily: "monospace",
                letterSpacing: 2,
                padding: "3px 14px",
                borderRadius: 4,
                marginTop: 6,
                textShadow: "0 2px 4px #000, 0 0 6px rgba(0, 0, 0, 0.95)"
              }}>
                SECURITY CLEARANCE REVOKED
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── TOP RIGHT: FORENSIC INVESTIGATIVE TELEMETRY ── */}
      <div style={{
        position: "absolute",
        top: 45,
        right: 60,
        backgroundColor: "rgba(2, 9, 20, 0.94)",
        border: `2px solid ${AMBER}`,
        borderRadius: 14,
        padding: "16px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        direction: "rtl",
        boxShadow: "0 20px 50px rgba(0,0,0,0.9), 0 0 25px rgba(255, 179, 0, 0.3)",
        zIndex: 40
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: AMBER, boxShadow: `0 0 12px ${AMBER}` }} />
          <span style={{ color: "#FFF", fontSize: 20, fontWeight: 900, textShadow: "0 0 12px rgba(255, 179, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.95)" }}>
            رصد تصفية فرق أمان الذكاء الاصطناعي
          </span>
        </div>
        <div style={{ color: CYAN, fontSize: 16, fontWeight: 800, textShadow: "0 0 14px rgba(0, 229, 204, 0.7), 0 2px 8px rgba(0, 0, 0, 0.95)" }}>
          وثيقة وادي السيليكون: قمع كل صوت يطالب بفرامل الطوارئ
        </div>
      </div>

      {/* ── BOTTOM CENTER: KINETIC ARABIC CHYRON (SYNCS WITH VOICE OVER) ── */}
      <div style={{
        position: "absolute",
        bottom: 45,
        left: 80,
        right: 80,
        backgroundColor: "rgba(2, 8, 18, 0.95)",
        border: `2px solid ${RED}`,
        borderRadius: 12,
        padding: "14px 32px",
        textAlign: "center",
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        direction: "rtl",
        boxShadow: "0 20px 50px rgba(0,0,0,0.95), 0 0 35px rgba(255, 51, 51, 0.35)",
        zIndex: 40
      }}>
        <div style={{ color: "#FFF", fontSize: 27, fontWeight: 900, letterSpacing: 0.5 }}>
          «...والشركات عارفة الكارثة، وطردت كل مهندس أمان حاول يشد الفيشة قبل فوات الأوان!»
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── LEAKED 1,300 ENGINEERS MEMO (STUDIO RETURN 25.5s - 35s / Frames 765 - 1050) ──
const FiredEngineersMemo: React.FC<{ startFrame: number; endFrame: number }> = ({ startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame >= endFrame) return null;

  const localF = frame - startFrame;
  const slideIn = spring({ frame: localF, fps: 30, config: { damping: 18, stiffness: 120 } });
  const slideX = Math.round(interpolate(slideIn, [0, 1], [-1400, 0]));

  return (
    <div style={{
      position: "absolute",
      bottom: 75,
      left: "50%",
      width: 1080,
      transform: `translateX(calc(-50% + ${slideX}px))`,
      backgroundColor: "rgba(2, 9, 22, 0.96)",
      border: `2px solid ${RED}`,
      borderRadius: 16,
      padding: "20px 36px",
      boxShadow: "0 25px 60px rgba(0,0,0,0.95), 0 0 45px rgba(255, 51, 51, 0.45)",
      backdropFilter: "blur(12px)",
      fontFamily: "'Cairo', 'Tajawal', sans-serif",
      direction: "rtl",
      textAlign: "center",
      zIndex: 140,
      willChange: "transform",
      backfaceVisibility: "hidden"
    }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <div style={{
          display: "inline-block",
          backgroundColor: RED,
          color: "#FFF",
          padding: "8px 32px",
          borderRadius: 10,
          fontSize: 26,
          fontWeight: 900,
          letterSpacing: 1,
          boxShadow: "0 0 30px rgba(255, 51, 51, 0.9)"
        }}>
          وثيقة سرية // 1300 توقيع
        </div>
      </div>

      <div style={{
        color: "#FFF",
        fontSize: 32,
        fontWeight: 900,
        lineHeight: 1.35,
        textShadow: "0 2px 12px rgba(0,0,0,0.9)"
      }}>
        «1300 مهندس ومسؤول تقني وقعوا وثيقة سرية: بنخسر السيطرة!»
      </div>

      <div style={{
        marginTop: 14,
        paddingTop: 12,
        borderTop: "1px solid rgba(255,255,255,0.18)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 24,
        fontWeight: 800
      }}>
        <span style={{ color: CYAN, textShadow: "0 0 16px rgba(0,229,204,0.5)" }}>
          الجهة: كبار مهندسي وادي السيليكون // بقيادة ديفيد روبنسون (OpenAI)
        </span>
        <span style={{ color: AMBER, textShadow: "0 0 16px rgba(255,179,0,0.5)" }}>
          التحذير: وشيك وحتمي
        </span>
      </div>
    </div>
  );
};

// ── 3D HOLOGRAPHIC "انتظرونا" CLIMAX (38.5s - 43s / Frames 1155 - 1290) ──
const AntezeronaTeaserRibbon: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  const localF = frame - startFrame;
  // Overdamped smooth pop spring with zero ringing or oscillation tail
  const rawSpring = spring({ frame: localF, fps: 30, config: { damping: 20, stiffness: 140, mass: 1.0 } });
  // Lock firmly to 1.0 after settling (15 frames) to guarantee zero subpixel text jitter
  const scale = localF >= 15 ? 1.0 : rawSpring;
  const opacity = interpolate(localF, [0, 4], [0, 1], { extrapolateRight: 'clamp' });
  const glowOpacity = 0.5 + Math.sin(localF * 0.14) * 0.25;

  return (
    <div style={{
      position: 'absolute',
      bottom: '10%',
      left: '50%',
      width: 1100,
      marginLeft: -550,
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
      opacity,
      zIndex: 180,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pointerEvents: 'none',
      willChange: 'transform',
      backfaceVisibility: 'hidden'
    }}>
      {/* Pulsing Backing Ambient Halo (Pulsed via opacity for zero text re-rasterization jitter) */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        width: 650,
        height: 140,
        marginLeft: -325,
        borderRadius: '50%',
        background: `radial-gradient(ellipse at center, ${CYAN} 0%, rgba(0, 229, 204, 0.4) 45%, transparent 75%)`,
        filter: 'blur(35px)',
        opacity: glowOpacity,
        pointerEvents: 'none',
        mixBlendMode: 'screen'
      }} />

      {/* Main 3D "انتظرونا" Title */}
      <div style={{
        position: 'relative',
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        fontSize: 96,
        fontWeight: 900,
        letterSpacing: 4,
        color: '#FFFFFF',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #00E5CC 85%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: `drop-shadow(0 0 20px rgba(0, 229, 204, 0.85)) drop-shadow(0 15px 35px rgba(0,0,0,0.95))`,
        textAlign: 'center',
        lineHeight: 1.15
      }}>
        انتظرونا
      </div>

      {/* Subtitle Badge */}
      <div style={{
        marginTop: 10,
        padding: '10px 36px',
        borderRadius: 50,
        background: 'rgba(3, 14, 24, 0.92)',
        border: `2px solid ${CYAN}`,
        boxShadow: `0 0 25px rgba(0, 229, 204, 0.4), 0 10px 30px rgba(0,0,0,0.8)`,
        color: '#FFF',
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        fontSize: 34,
        fontWeight: 700,
        letterSpacing: 2
      }}>
        الحلقة الكاملة قريباً :: حرفين ولكن
      </div>
    </div>
  );
};

// ── MASTER 16:9 HORIZONTAL COMPOSITION (1920×1080) ──
export const Teaser2Horizontal: React.FC = () => {
  const frame = useCurrentFrame();

  // ── KEY TIMINGS STRICTLY MATCHING USER REQUIREMENTS & AUDIO WAVEFORM ──
  const F_PHONE_SNAP = 52;          // 00:01.22 -> Mazen snaps from natural pose (Pose 2) to holding phone
  const F_CODE_EXPAND = 106;        // 00:03.16 -> Code inside phone expands with breathing space
  const F_BROLL_1_START = 140;      // 00:04.20 EXACTLY -> Transition to Satellite Thermal FLIR Recon
  const F_BROLL_1_END = 240;        // 00:08.00
  const F_STUDIO_BEAT_1_START = 240;// 00:08.00 -> Brief Mazen Pose 3 cut before water plant!
  const F_STUDIO_BEAT_1_END = 280;  // 00:09.10
  const F_WATER_START = 280;        // 00:09.10 -> Liquid Cooling Torrent
  const F_WATER_END = 413;          // 00:13.23 (Clean cut, no overlap)
  const F_POWERGRID_START = 413;    // 00:13.23 EXACTLY -> City Power Grid Collapse (وبيبتلع شبكات كهربة مدن كاملة)
  const F_POWERGRID_END = 528;      // 00:17.18 (Clean cut, no overlap)
  const F_GAWDAT_START = 528;       // 00:17.18 EXACTLY -> Mo Gawdat Whistleblower Dossier
  const F_GAWDAT_END = 660;         // 00:22.00
  const F_STUDIO_BEAT_2_START = 660;// 00:22.00 -> Brief Mazen Pose 3 cut before trading floor!
  const F_STUDIO_BEAT_2_END = 695;  // 00:23.05
  const F_TRADING_START = 695;      // 00:23.05 -> Abandoned Trading Floor Void
  const F_TRADING_END = 780;        // 00:26.00
  const F_STUDIO_RETURN = 780;      // 00:26.00 -> Studio return with Pose 3 + 1300 memo
  const F_SAFETY_PURGE_START = 905; // 00:30.05 EXACTLY -> Safety Purge & Severed Kill-Switch B-roll motion graphics takeover!
  const F_BUTTON_SLAM = 1050;       // 00:35.00 -> Pose 4 button slam shockwave
  const F_QUESTION_SNAP = 1159;     // 00:38.19 EXACTLY -> Snap to Pose 2 (Questioning / Raising Hand) with signature stop-motion shock
  const F_TEASER_RIBBON = 1286;     // 00:42.26 EXACTLY -> 3D "انتظرونا" Unfurled Climax Banner
  const F_WHIP_OUT = 1331;          // 00:44.11 EXACTLY -> Anamorphic whip pan to 6-second Brand Outro


  // ── 8-FRAME CHROMATIC ABERRATION SHOCKS (CUTS ONLY, ZERO CONTINUOUS JITTER) ──
  const isPhoneShock = frame >= F_PHONE_SNAP && frame < F_PHONE_SNAP + 8;
  const isButtonShock = frame >= F_BUTTON_SLAM && frame < F_BUTTON_SLAM + 8;
  const isQuestionShock = frame >= F_QUESTION_SNAP && frame < F_QUESTION_SNAP + 8;
  const isCutBeat1 = frame >= F_STUDIO_BEAT_1_START && frame < F_STUDIO_BEAT_1_START + 6;
  const isCutBeat2 = frame >= F_STUDIO_BEAT_2_START && frame < F_STUDIO_BEAT_2_START + 6;
  const isCutPose3 = frame >= F_STUDIO_RETURN && frame < F_STUDIO_RETURN + 8;
  const shockOffset = isPhoneShock
    ? Math.sin((frame - F_PHONE_SNAP) * 60) * 65 * (1 - (frame - F_PHONE_SNAP) / 8)
    : isButtonShock
      ? Math.sin((frame - F_BUTTON_SLAM) * 60) * 85 * (1 - (frame - F_BUTTON_SLAM) / 8)
      : isQuestionShock
        ? Math.sin((frame - F_QUESTION_SNAP) * 55) * 55 * (1 - (frame - F_QUESTION_SNAP) / 8)
        : isCutBeat1
          ? Math.sin((frame - F_STUDIO_BEAT_1_START) * 50) * 45 * (1 - (frame - F_STUDIO_BEAT_1_START) / 6)
          : isCutBeat2
            ? Math.sin((frame - F_STUDIO_BEAT_2_START) * 50) * 45 * (1 - (frame - F_STUDIO_BEAT_2_START) / 6)
            : isCutPose3
              ? Math.sin((frame - F_STUDIO_RETURN) * 45) * 50 * (1 - (frame - F_STUDIO_RETURN) / 8)
              : 0;

  // ── NATURAL GROUNDED MAZEN POSES (POSE 2 AT HOOK, POSE PHONE ON SNAP, POSE 3 BEFORE SHOTS & RETURN, POSE 4 AT SLAM, POSE 2 AT FINAL QUESTION) ──
  let activePoseImg = staticFile('images/episode5/scene-1/mazen-pose2.png');
  let poseScale = 1.02;
  let poseOffsetX = 0;
  let poseOffsetY = 0;

  if (frame >= F_PHONE_SNAP && frame < F_BROLL_1_START) {
    // 00:01.22 to 00:04.05: Mazen holding phone ONLY during the opening hook!
    activePoseImg = staticFile('images/episode5/teaser-2/mazen-pose-phone.png');
  } else if (frame >= F_QUESTION_SNAP) {
    // 00:38.19+: Pose 2 (Questioning / Raising Hand pose as Mazen delivers the final philosophical question)
    activePoseImg = staticFile('images/episode5/scene-1/mazen-pose2.png');
  } else if (frame >= F_BUTTON_SLAM) {
    // 00:35.00 to 00:38.19: Pose 4 (Console Slam)
    activePoseImg = staticFile('images/episode5/scene-1/mazen-pose4.png');
  } else if (frame < F_PHONE_SNAP) {
    // 00:00.00 - 00:01.22: Pose 2 (Natural opening host)
    activePoseImg = staticFile('images/episode5/scene-1/mazen-pose2.png');
  } else {
    // EVERYWHERE ELSE (Brief cuts before shots & Studio return): POSE 3!
    activePoseImg = staticFile('images/episode5/scene-1/mazen-pose3.png');
  }

  // Camera Shake ONLY on button slam impact
  const shakeX = isButtonShock ? (Math.random() - 0.5) * 22 : 0;
  const shakeY = isButtonShock ? (Math.random() - 0.5) * 22 : 0;

  // Subtle continuous 3D camera drift (smooth, cinematic, never stops)
  const cameraZ = interpolate(frame, [0, F_WHIP_OUT], [0, 45], { easing: Easing.out(Easing.quad) });

  // ── CINEMATIC RACK FOCUS & DEPTH OF FIELD ENGINE (ANAMORPHIC FOCUS PULL) ──
  // Starts at 0:00 with background in pristine focus and foreground Mazen blurred out;
  // then smoothly pulls focus into Mazen as voiceover takes command (frames 15 to 55).
  const rackFocusProgress = interpolate(frame, [15, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic)
  });

  // Mazen foreground rack blur: 14px down to 0px
  const mazenRackBlur = frame < F_BROLL_1_START ? interpolate(rackFocusProgress, [0, 1], [14, 0]) : 0;

  // Studio background rack blur: 0px up to 4.5px cinematic bokeh
  const bgRackBlur = frame < F_BROLL_1_START ? interpolate(rackFocusProgress, [0, 1], [0, 4.5]) : 4.5;

  // Cut motion blur for snappy transitions
  const isCutActive = isCutBeat1 || isCutBeat2 || isCutPose3 || isPhoneShock || isButtonShock;
  const cutMotionBlur = isCutActive ? 6 : 0;

  // ── 3D UNREAL ENGINE PHYSICS CAMERA DIVE (FRAMES 86 TO 106 -> LEADING INTO EXPANSION) ──
  // Simulates a physical robotic motion-control arm pushing forward along the Z-axis,
  // angling down onto the phone screen with physical gyro roll, then smoothly settling as the UI expands.
  const isPhoneDive = frame >= 86 && frame < F_BROLL_1_START;
  const phoneDiveProgress = interpolate(frame, [86, F_CODE_EXPAND], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1)
  });
  const phoneExpandProgress = interpolate(frame, [F_CODE_EXPAND, 128], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1)
  });
  const cameraDiveWeight = isPhoneDive ? phoneDiveProgress * (1 - phoneExpandProgress) : 0;
  const studioDiveZ = cameraDiveWeight * 165;       // 3D forward push-in toward the phone
  const studioDivePanX = cameraDiveWeight * 48;     // Pans right to frame the phone dynamically
  const studioDivePanY = cameraDiveWeight * 22;     // Pans down slightly
  const studioDivePitch = cameraDiveWeight * 2.8;   // rotateX down onto phone glass
  const studioDiveYaw = cameraDiveWeight * -3.6;    // rotateY orbital angle
  const studioDiveRoll = Math.sin(phoneDiveProgress * Math.PI) * -1.8 * (1 - phoneExpandProgress); // physics gyro roll
  const phoneDiveBokeh = cameraDiveWeight * 3.5;    // f/1.4 cinema rack into phone screen

  const bgBlur = bgRackBlur + cutMotionBlur + phoneDiveBokeh;

  // Unified 3D Hook Camera Transform (shared between studio scene & PhoneCodeTakeover)
  const isHookShot = frame < F_BROLL_1_START;
  const studioTransformZ = cameraZ + studioDiveZ;
  const studioTransformOrigin = isHookShot ? "30% 40%" : "center center";
  const studioCameraTransform = isHookShot
    ? `perspective(1200px) translateZ(${studioTransformZ}px) translate(${studioDivePanX}px, ${studioDivePanY}px) rotateX(${studioDivePitch}deg) rotateY(${studioDiveYaw}deg) rotateZ(${studioDiveRoll}deg)`
    : `perspective(1200px) translateZ(${cameraZ}px)`;

  // ── MULTI-PLANE STUDIO PARALLAX ENGINE (APPLIED TO ALL HOST APPEARANCES) ──
  // Zero freeze across the entire composition: background drifts, floats and scales
  // while Mazen remains firmly anchored in the foreground with zero unwanted jitter.

  // 1. Pose 3 Return (00:26.00 - 00:30.05 / 780 - 905)
  const isPose3Return = frame >= F_STUDIO_RETURN && frame < F_SAFETY_PURGE_START;
  const p3Progress = interpolate(frame, [F_STUDIO_RETURN, F_SAFETY_PURGE_START], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad)
  });

  // 2. Pose 4 Button Slam (00:35.00 - 00:38.19 / 1050 - 1159)
  const isPose4Active = frame >= F_BUTTON_SLAM && frame < F_QUESTION_SNAP;
  const p4Progress = interpolate(frame, [F_BUTTON_SLAM, F_QUESTION_SNAP], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad)
  });

  // 3. Pose 2 Final Question & Teaser Ribbon (00:38.19 - 00:45.01 / 1159 - 1351)
  const isFinalQuestionActive = frame >= F_QUESTION_SNAP;
  const pFinalProgress = interpolate(frame, [F_QUESTION_SNAP, F_WHIP_OUT], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad)
  });

  // 4. Opening Hook (00:00.00 - 00:04.20 / 0 - 140)
  const isHookActive = frame < F_BROLL_1_START;
  const hookProgress = interpolate(frame, [0, F_BROLL_1_START], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad)
  });

  // Background Horizontal Drift (px)
  const studioBgDriftX = isPose3Return
    ? interpolate(p3Progress, [0, 1], [35, -35])
    : isPose4Active
      ? interpolate(p4Progress, [0, 1], [-12, 12])
      : isFinalQuestionActive
        ? interpolate(pFinalProgress, [0, 1], [-14, 18])
        : isHookActive
          ? interpolate(hookProgress, [0, 1], [-15, 20])
          : (frame >= F_STUDIO_BEAT_1_START && frame < F_STUDIO_BEAT_1_END)
            ? interpolate(frame, [F_STUDIO_BEAT_1_START, F_STUDIO_BEAT_1_END], [15, -15], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            : (frame >= F_STUDIO_BEAT_2_START && frame < F_STUDIO_BEAT_2_END)
              ? interpolate(frame, [F_STUDIO_BEAT_2_START, F_STUDIO_BEAT_2_END], [-15, 15], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
              : 0;

  // Background Vertical Breathing Float (px)
  const studioBgFloatY = isPose3Return
    ? Math.sin((frame - F_STUDIO_RETURN) * 0.04) * 14
    : isPose4Active
      ? Math.sin((frame - F_BUTTON_SLAM) * 0.04) * 6
      : isFinalQuestionActive
        ? Math.sin((frame - F_QUESTION_SNAP) * 0.03) * 7
        : isHookActive
          ? Math.sin(frame * 0.04) * 8
          : (frame >= F_STUDIO_BEAT_1_START && frame < F_STUDIO_BEAT_1_END)
            ? Math.sin((frame - F_STUDIO_BEAT_1_START) * 0.06) * 8
            : (frame >= F_STUDIO_BEAT_2_START && frame < F_STUDIO_BEAT_2_END)
              ? Math.sin((frame - F_STUDIO_BEAT_2_START) * 0.06) * 8
              : 0;

  // Background Zoom Factor
  const studioBgZoom = isPose3Return
    ? interpolate(p3Progress, [0, 1], [1.02, 1.08])
    : isPose4Active
      ? interpolate(p4Progress, [0, 1], [1.02, 1.05])
      : isFinalQuestionActive
        ? interpolate(pFinalProgress, [0, 1], [1.01, 1.04])
        : isHookActive
          ? interpolate(hookProgress, [0, 1], [1.01, 1.05])
          : 1.0;

  // Render Harfen Studio scene when host is physically on screen:
  // Hook start, Brief studio cut before water plant, Brief studio cut before trading floor, and Studio Return to Outro!
  const isStudioSceneVisible =
    frame < F_BROLL_1_START ||
    (frame >= F_STUDIO_BEAT_1_START && frame < F_STUDIO_BEAT_1_END) ||
    (frame >= F_STUDIO_BEAT_2_START && frame < F_STUDIO_BEAT_2_END) ||
    (frame >= F_STUDIO_RETURN && frame < F_SAFETY_PURGE_START) ||
    frame >= F_BUTTON_SLAM;

  return (
    <AbsoluteFill style={{ backgroundColor: "#020912", overflow: "hidden" }}>
      {/* Master Audio Track */}
      <Audio src={staticFile("audio/episode5/mazen-vo-teaser-2.mp3")} volume={1.0} />

      {/* Anamorphic Whip Pan Outro Wrapper */}
      <AnamorphicWhipPan
        transitionStartFrame={F_WHIP_OUT}
        durationFrames={12}
        childrenA={
          <AbsoluteFill style={{ overflow: "hidden", transform: `translate(${shakeX}px, ${shakeY}px)` }}>
            {/* Diorama Halftone Layer */}
            <DioramaOverlay />

            {/* ── OPTICAL LIGHT SWEEP LEAKS ON TRANSITIONS ── */}
            <LightSweepLeak triggerFrame={F_PHONE_SNAP - 2} duration={8} color={CYAN} />
            <LightSweepLeak triggerFrame={F_CODE_EXPAND - 2} duration={8} color={CYAN} />
            <LightSweepLeak triggerFrame={F_BROLL_1_START - 4} duration={10} color={CYAN} />
            <LightSweepLeak triggerFrame={F_STUDIO_BEAT_1_START - 2} duration={8} color={CYAN} />
            <LightSweepLeak triggerFrame={F_WATER_START - 4} duration={10} color={CYAN} />
            <LightSweepLeak triggerFrame={F_POWERGRID_START - 2} duration={8} color={RED} />
            <LightSweepLeak triggerFrame={F_GAWDAT_START - 2} duration={8} color={AMBER} />
            <LightSweepLeak triggerFrame={F_STUDIO_BEAT_2_START - 2} duration={8} color={CYAN} />
            <LightSweepLeak triggerFrame={F_TRADING_START - 4} duration={10} color={RED} />
            <LightSweepLeak triggerFrame={F_STUDIO_RETURN - 4} duration={10} color={CYAN} />
            <LightSweepLeak triggerFrame={F_SAFETY_PURGE_START - 2} duration={8} color={RED} />
            <LightSweepLeak triggerFrame={F_BUTTON_SLAM - 2} duration={8} color={RED} />
            <LightSweepLeak triggerFrame={F_QUESTION_SNAP - 2} duration={8} color={CYAN} />
            <LightSweepLeak triggerFrame={F_TEASER_RIBBON - 2} duration={8} color={CYAN} />

            {/* ── DIGITAL MATRIX GLITCHES (FOCUSED: MAZEN RETURN AFTER GAWDAT & FINAL QUESTION POSE) ── */}
            <DigitalSliceGlitch triggerFrame={F_STUDIO_BEAT_2_START} duration={4} />
            <DigitalSliceGlitch triggerFrame={F_QUESTION_SNAP} duration={4} />

            {/* ── HARFEN STUDIO & MAZEN SCENE (RENDERED ONLY ON HOST BEATS) ── */}
            {isStudioSceneVisible && (
              <AbsoluteFill style={{
                transform: studioCameraTransform,
                transformOrigin: studioTransformOrigin
              }}>
                {/* Studio Background Layer (Multi-plane Parallax Drift, Float, Bokeh & Volumetric Beams) */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  transform: `scale(${1.08 * studioBgZoom}) translate(${studioBgDriftX}px, ${studioBgFloatY}px)`,
                  transformOrigin: "center center",
                  willChange: "transform"
                }}>
                  {/* Master Studio Plate: Warm Sepia/Grayscale Documentary Grade from Scene 1 */}
                  <img
                    src={staticFile("images/episode5/teaser-2/studio-bg.jpeg")}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: `blur(${bgBlur.toFixed(2)}px) grayscale(0.5) sepia(0.4) contrast(1.3) brightness(0.92)`
                    }}
                    alt=""
                  />

                  {/* Volumetric Lighting Beams (Cyan Key & Warm Amber Fill from Scene 1) */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background: "radial-gradient(ellipse 1100px 700px at 75% 25%, rgba(0, 229, 204, 0.22) 0%, rgba(0, 229, 204, 0.05) 45%, transparent 75%)",
                    mixBlendMode: "screen"
                  }} />
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background: "radial-gradient(ellipse 900px 600px at 20% 80%, rgba(255, 179, 0, 0.16) 0%, transparent 60%)",
                    mixBlendMode: "screen"
                  }} />

                  {/* Subtle Cinematic Edge Vignette */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(2, 6, 12, 0.5) 100%)",
                    pointerEvents: "none"
                  }} />

                  {/* Studio Ambient Mood Gels */}
                  {frame < F_STUDIO_RETURN && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: CYAN,
                      mixBlendMode: 'multiply',
                      opacity: 0.35
                    }} />
                  )}
                  {frame >= F_STUDIO_RETURN && frame < F_BUTTON_SLAM && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: AMBER,
                      mixBlendMode: 'multiply',
                      opacity: 0.45
                    }} />
                  )}
                  {frame >= F_BUTTON_SLAM && frame < F_QUESTION_SNAP && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: RED,
                      mixBlendMode: 'multiply',
                      opacity: 0.65
                    }} />
                  )}
                  {frame >= F_QUESTION_SNAP && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: CYAN,
                      mixBlendMode: 'multiply',
                      opacity: 0.45
                    }} />
                  )}
                </div>

                {/* Floating Leaked Memo during Return to Studio (Comfortable Left Margin) */}
                <FiredEngineersMemo startFrame={F_STUDIO_RETURN} endFrame={F_SAFETY_PURGE_START} />

                {/* Mazen Character Layer (Proper 1:1 Grounded Scale - Zero Jitter) */}
                <AbsoluteFill style={{
                  transform: `translateX(${poseOffsetX + shockOffset}px) translateY(${poseOffsetY}px) scale(${poseScale})`,
                  transformOrigin: "bottom center",
                  filter: mazenRackBlur > 0.05 ? `blur(${mazenRackBlur.toFixed(2)}px)` : "none"
                }}>
                  <img
                    src={activePoseImg}
                    style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom center" }}
                    alt=""
                  />

                  {/* Chromatic Aberration Spike on Cut Only */}
                  {shockOffset !== 0 && (
                    <CharacterCA3D imgSrc={activePoseImg} caX={shockOffset} />
                  )}
                </AbsoluteFill>
              </AbsoluteFill>
            )}

            {/* ── PHONE CODE TAKEOVER (MOUNTED ON MAZEN'S PHONE & EXPANDING AT 00:03.11) ── */}
            {frame >= F_PHONE_SNAP && frame < F_BROLL_1_START && (
              <AbsoluteFill style={{
                transform: studioCameraTransform,
                transformOrigin: studioTransformOrigin,
                pointerEvents: "none",
                zIndex: 120
              }}>
                <PhoneCodeTakeover
                  startFrame={F_PHONE_SNAP}
                  expandFrame={F_CODE_EXPAND}
                  endFrame={F_BROLL_1_START}
                />
              </AbsoluteFill>
            )}

            {/* ── EPISODE 4 & EPISODE 3 AESTHETIC B-ROLL TAKEOVERS (Z-INDEX 150 ON TOP) ── */}
            <SatelliteThermalTakeover startFrame={F_BROLL_1_START} endFrame={F_BROLL_1_END} />
            <CoolingWaterTakeover startFrame={F_WATER_START} endFrame={F_WATER_END} />
            <CityPowerGridTakeover startFrame={F_POWERGRID_START} endFrame={F_POWERGRID_END} />
            <MoGawdatDossierTakeover startFrame={F_GAWDAT_START} endFrame={F_GAWDAT_END} />
            <EmptyTradingTakeover startFrame={F_TRADING_START} endFrame={F_TRADING_END} />
            <SafetyPurgeTakeover startFrame={F_SAFETY_PURGE_START} endFrame={F_BUTTON_SLAM} />

            {/* ── 3D HOLOGRAPHIC "انتظرونا" CLIMAX ── */}
            <AntezeronaTeaserRibbon startFrame={F_TEASER_RIBBON} />
          </AbsoluteFill>
        }
        childrenB={
          <Sequence from={F_WHIP_OUT} durationInFrames={180}>
            <BrandOutroHorizontal />
          </Sequence>
        }
      />
    </AbsoluteFill>
  );
};
