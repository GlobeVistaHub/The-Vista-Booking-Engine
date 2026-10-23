import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const AnamorphicWhipPan: React.FC<{
  childrenA: React.ReactNode;
  childrenB: React.ReactNode;
  transitionStartFrame: number;
  durationFrames?: number;
  caColorA?: string;
  caColorB?: string;
  flareColor?: string;
}> = ({ 
  childrenA, childrenB, transitionStartFrame, durationFrames = 10,
  caColorA = "rgba(255, 0, 85, 0.2)",
  caColorB = "rgba(0, 229, 204, 0.2)",
  flareColor = "rgba(0, 255, 255, 0.6)"
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progress of the transition (0 to 1)
  const progress = interpolate(
    frame,
    [transitionStartFrame, transitionStartFrame + durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Eased progress for smooth but fast whipping motion
  const easeProgress = spring({
    frame: frame - transitionStartFrame,
    fps,
    config: { damping: 14, stiffness: 200, overshootClamping: true },
    durationInFrames: durationFrames,
  });

  // Whip Pan Translation: A slides out Left (-100%), B slides in from Right (100% to 0)
  const translateX_A = interpolate(easeProgress, [0, 1], [0, -100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); 
  const translateX_B = interpolate(easeProgress, [0, 1], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Directional Blur intensity (Peaks in the middle of the transition)
  const blurIntensity = interpolate(
    easeProgress,
    [0, 0.5, 1],
    [0, 80, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // RGB Split intensity (Chromatic Aberration during the whip)
  const rgbSplit = interpolate(
    easeProgress,
    [0, 0.5, 1],
    [0, 35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Extreme Contrast and Brightness spike for the swipe effect
  const contrast = interpolate(easeProgress, [0, 0.5, 1], [1, 1.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const brightness = interpolate(easeProgress, [0, 0.5, 1], [1, 2.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Add a slight scale-up during the wipe to simulate mirrored edges / cover the borders
  const wipeScale = interpolate(easeProgress, [0, 0.5, 1], [1, 1.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const isBefore = frame < transitionStartFrame;
  const isAfterSafe = frame > transitionStartFrame + durationFrames + 150; // Keep alive for 5 extra seconds to let audio reverb/tails finish

  const filterId = `directional-blur-${transitionStartFrame}`;

  const activeFilter = blurIntensity > 0 
    ? `url(#${filterId}) contrast(${contrast}) brightness(${brightness})` 
    : "none";

  return (
    <AbsoluteFill>
      {/* ─── SVG FILTER FOR DIRECTIONAL BLUR ─── */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={`${blurIntensity}, 0`} />
          </filter>
        </defs>
      </svg>

      {/* SCENE A */}
      {!isAfterSafe && (
        <AbsoluteFill
          style={{
            transform: `translateX(${translateX_A}%) scale(${wipeScale})`,
            filter: activeFilter,
            transformOrigin: "center center",
          }}
        >
          {childrenA}
          
          {/* Chromatic Aberration Layer for Scene A */}
          {rgbSplit > 0 && (
            <AbsoluteFill
              style={{
                transform: `translateX(-${rgbSplit}px)`,
                mixBlendMode: "screen",
                opacity: 0.6,
                filter: activeFilter,
              }}
            >
              <div style={{ backgroundColor: caColorA, width: "100%", height: "100%" }} />
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}

      {/* SCENE B */}
      {!isBefore && (
        <AbsoluteFill
          style={{
            transform: `translateX(${translateX_B}%) scale(${wipeScale})`,
            filter: activeFilter,
            transformOrigin: "center center",
          }}
        >
          {childrenB}
          
          {/* Chromatic Aberration Layer for Scene B */}
          {rgbSplit > 0 && (
            <AbsoluteFill
              style={{
                transform: `translateX(${rgbSplit}px)`,
                mixBlendMode: "screen",
                opacity: 0.6,
                filter: activeFilter,
              }}
            >
              <div style={{ backgroundColor: caColorB, width: "100%", height: "100%" }} />
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}

      {/* ─── RAZOR-THIN HORIZONTAL LENS FLARE ─── */}
      {blurIntensity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "200%",
              height: "4px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              boxShadow: `0 0 20px 5px ${flareColor}, 0 0 40px 10px ${flareColor.replace("0.6", "0.4")}`,
              opacity: interpolate(easeProgress, [0, 0.5, 1], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              transform: `scaleX(${interpolate(easeProgress, [0, 0.5, 1], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
