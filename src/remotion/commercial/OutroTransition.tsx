import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Video,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  staticFile,
} from "remotion";

export const OutroTransition: React.FC<{ isStandalone?: boolean }> = ({ isStandalone = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- TIMING ---
  const cardInSec = 38.0;
  const logoRevealSec = 38.2;
  const typeStartSec = 38.8;
  const typeEndSec = 40.0;
  const linkSec = 40.2;
  const pokeSec = 41.0;

  const cardFrame = cardInSec * fps;
  const logoFrame = logoRevealSec * fps;
  const typeStartF = typeStartSec * fps;
  const typeEndF = typeEndSec * fps;
  const linkF = linkSec * fps;
  const pokeF = pokeSec * fps;

  // --- 1. THE FLOATING GLASS CARD ---
  const cardSpring = spring({
    frame: Math.max(0, frame - cardFrame),
    fps,
    config: { damping: 14, stiffness: 100, mass: 1 },
  });

  const clampedCardSpring = cardSpring > 0.995 ? 1 : cardSpring;
  const cardScale = interpolate(clampedCardSpring, [0, 1], [2, 1]);
  const cardOpacity = interpolate(clampedCardSpring, [0, 1], [0, 1]);

  // --- 2. LOGO REVEAL (STAMP BURNING EFFECT) ---
  const logoSpring = spring({
    frame: Math.max(0, frame - logoFrame),
    fps,
    config: { damping: 18, stiffness: 45, mass: 1 }, // Smoother, elegant buildup
  });
  
  const clampedLogoSpring = logoSpring > 0.995 ? 1 : logoSpring;
  const logoScale = interpolate(clampedLogoSpring, [0, 1], [3.5, 1.25]); // Scaled up to be more prominent
  const logoOpacity = interpolate(clampedLogoSpring, [0, 1], [0, 1]);
  const logoBrightness = interpolate(clampedLogoSpring, [0, 0.5, 1], [5, 2, 1], { extrapolateRight: "clamp" });
  const logoBlur = interpolate(clampedLogoSpring, [0, 0.5, 1], [20, 0, 0], { extrapolateRight: "clamp" });
  
  // Harfen logo parts slide in
  const tealSlideX = Math.round(interpolate(clampedLogoSpring, [0, 1], [-40, -5]));
  const pinkSlideX = Math.round(interpolate(clampedLogoSpring, [0, 1], [40, 5]));
  
  // Subtly pulse ONLY the heart halves after locking
  const pulseScale = 1 + Math.max(0, Math.sin((frame - logoFrame - 30) * 0.15)) * 0.06;
  
  // Text reveal spring
  const textRevealSpring = spring({
    frame: Math.max(0, frame - typeStartF),
    fps,
    config: { damping: 20, stiffness: 60 }, // Clamp to prevent bouncy text jitter
  });
  const clampedTextSpring = textRevealSpring > 0.995 ? 1 : textRevealSpring;

  // --- 3. OPPOSING LASER TYPEWRITER ---
  const sweep = interpolate(frame, [typeStartF, typeEndF], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- 4. VERCEL LINK REVEAL & POKE ---
  const linkOpacity = interpolate(frame, [linkF, linkF + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // Hand cursor moves in
  const handMoveProgress = spring({
    frame: Math.max(0, frame - (pokeF - 20)), // Starts 20 frames before poke
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  // Hand cursor leaves
  const handLeaveProgress = spring({
    frame: Math.max(0, frame - (pokeF + 15)), // Starts 15 frames after poke
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // The actual click (down and up)
  const pokeClickSpring = spring({
    frame: Math.max(0, frame - pokeF),
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  // Combine move in and move out animations
  const handX = Math.round(interpolate(handMoveProgress, [0, 1], [150, 0]) + interpolate(handLeaveProgress, [0, 1], [0, 100]));
  const handY = Math.round(interpolate(handMoveProgress, [0, 1], [200, 10]) + interpolate(handLeaveProgress, [0, 1], [0, 200])); 
  
  // Opacity fades in, stays, then fades out as it leaves
  const handOpacity = interpolate(handMoveProgress, [0, 0.2, 1], [0, 1, 1]) - interpolate(handLeaveProgress, [0, 0.5, 1], [0, 0, 1]);
  
  const clampedPokeSpring = pokeClickSpring > 0.995 ? 1 : pokeClickSpring;
  
  // Scale down during click
  const linkScale = interpolate(clampedPokeSpring, [0, 0.2, 1], [1, 0.95, 1]);
  const handScale = interpolate(clampedPokeSpring, [0, 0.2, 1], [1, 0.85, 1]);
  
  // Glow effect on click
  const linkGlowOpacity = interpolate(clampedPokeSpring, [0, 0.2, 1], [0, 1, 0]);

  // --- SMOKE PARTICLES GENERATOR ---
  const generateSmoke = (isLeftToRight: boolean, yOffset: number, color: string) => {
    const particleCount = 60; // Increased smoke volume
    return Array.from({ length: particleCount }).map((_, i) => {
      const spawnProgress = i / particleCount;
      const spawnFrame = typeStartF + spawnProgress * (typeEndF - typeStartF);
      const age = Math.max(0, frame - spawnFrame);
      if (age === 0 || frame < typeStartF || frame > typeEndF + 120) return null;

      const yDrift = Math.round(interpolate(age, [0, 60], [0, -40])); // Rounded
      const xDrift = Math.round(Math.sin(i) * 20); // Rounded
      const opacity = interpolate(age, [0, 15, 50], [0, 0.9, 0]); // Slightly higher opacity and longer life
      const scale = interpolate(age, [0, 50], [0.8, 2.5]); // Slightly larger

      const startX = isLeftToRight ? -250 : 250;
      const endX = isLeftToRight ? 250 : -250;
      const xPos = Math.round(interpolate(spawnProgress, [0, 1], [startX, endX]));

      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `calc(50% + ${xPos + xDrift}px)`,
            top: `calc(50% + ${yOffset + yDrift}px)`,
            width: "8px",
            height: "8px",
            background: color,
            borderRadius: "50%",
            filter: "blur(4px)",
            opacity,
            transform: `scale(${scale}) translateZ(0)`, // Hardware accelerated
            zIndex: 30,
            willChange: "transform, opacity",
            backfaceVisibility: "hidden"
          }}
        />
      );
    });
  };

  return (
    <AbsoluteFill style={isStandalone ? { backgroundColor: "#000", overflow: "hidden", color: "white", fontFamily: "system-ui, sans-serif" } : { overflow: "hidden", color: "white", fontFamily: "system-ui, sans-serif" }}>
      
      {/* LAYER 1: BASE COMMERCIAL FOOTAGE */}
      {isStandalone && (
        <AbsoluteFill>
          <Video
            src={staticFile("video-assets/finale-video.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            startFrom={0}
            onError={(e) => console.log("Video format error: ", e)}
          />
        </AbsoluteFill>
      )}

      {/* LAYER 2: THE FLOATING GLASS CARD */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", zIndex: 10 }}>
        <div
          style={{
            width: "60vw",
            height: "70vh",
            background: "rgba(10, 14, 39, 0.05)", // Made much more transparent as requested
            backdropFilter: "blur(4px)", // Reduced blur to show more of the background
            border: "1px solid rgba(255, 200, 50, 0.4)", 
            boxShadow: "0 0 60px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(0,212,255,0.1)", // Added inner glow for better depth
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${cardScale}) translateZ(0)`, // Clamped scale + GPU acceleration
            opacity: cardOpacity,
            position: "relative",
            willChange: "transform, opacity",
            backfaceVisibility: "hidden", // Prevents text shifting/twitching
            WebkitFontSmoothing: "antialiased"
          }}
        >
          {/* INNER CONTENT WRAPPER PROPORTIONALLY SCALED FOR MOBILE VISIBILITY */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: "scale(1.5)" }}>
            
            {/* LAYER 3: LOGO REVEAL (THE BURN/STAMP) */}
            {frame > logoFrame && (
              <div
                style={{
                  transform: `scale(${logoScale})`,
                  opacity: logoOpacity,
                  filter: `brightness(${logoBrightness}) blur(${logoBlur}px)`,
                  marginBottom: "30px",
                  position: "relative",
                  width: "160px",
                  height: "160px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {/* Outer Ring - Spins initially then stops firmly */}
                <img 
                  src={staticFile("video-assets/outer-ring.png")}
                  style={{
                    position: "absolute",
                    width: "100%", height: "100%",
                    transform: `rotate(${interpolate(logoSpring, [0, 1], [-180, 0])}deg)`,
                    filter: `drop-shadow(0px 0px 30px rgba(34,211,238,0.4))`,
                  }}
                />
                {/* Inner Heart (Teal Half) - Locks and Pulses */}
                <div style={{
                  position: "absolute",
                  width: "70%", height: "70%",
                  transform: `translateX(${tealSlideX}px) scale(${frame > logoFrame + 30 ? pulseScale : 1}) translateZ(0)`,
                  filter: `drop-shadow(-5px 5px 15px rgba(34,211,238,0.6))`,
                  willChange: "transform",
                  backfaceVisibility: "hidden"
                }}>
                  <img src={staticFile("video-assets/heart-teal.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
                {/* Inner Heart (Pink Half) - Locks and Pulses */}
                <div style={{
                  position: "absolute",
                  width: "70%", height: "70%",
                  transform: `translateX(${pinkSlideX}px) scale(${frame > logoFrame + 30 ? pulseScale : 1}) translateZ(0)`,
                  filter: `drop-shadow(5px 5px 15px rgba(236,72,153,0.6))`,
                  willChange: "transform",
                  backfaceVisibility: "hidden"
                }}>
                  <img src={staticFile("video-assets/heart-pink.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
              </div>
            )}

            {/* LAYER 4: HARFEN TYPOGRAPHY */}
            <div style={{ 
              position: "relative", 
              width: "500px", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              transform: `translateY(${Math.round(interpolate(clampedTextSpring, [0, 1], [20, 0]))}px) translateZ(0)`, // Snapped integer transform
              opacity: clampedTextSpring,
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
              WebkitFontSmoothing: "antialiased"
            }}>
              
              <h1 style={{ 
                fontSize: "46px", letterSpacing: "2px", margin: 0, color: "#fff",
                textShadow: "0 8px 30px rgba(0,0,0,1), 0 0 35px #22d3ee",
              }}>
                حرفين ولكن
              </h1>

              <div style={{ display: "flex", flexDirection: "row", gap: 15, marginTop: 5, marginBottom: 5 }}>
                <h2 style={{ fontSize: "28px", letterSpacing: "4px", margin: 0, color: "#22d3ee", fontWeight: 900, textShadow: "0 8px 20px rgba(0,0,0,1), 0 0 20px rgba(34,211,238,0.8)" }}>A.I.</h2>
                <h2 style={{ fontSize: "28px", letterSpacing: "4px", margin: 0, color: "#ec4899", fontWeight: 900, textShadow: "0 8px 20px rgba(0,0,0,1), 0 0 20px rgba(236,72,153,0.8)" }}>NEWS</h2>
              </div>

              <h3 style={{ fontSize: "20px", color: "rgba(255,255,255,0.9)", margin: "8px 0 0 0", fontWeight: 500, textShadow: "0 4px 10px rgba(0,0,0,0.8)" }}>
                الذكاء الصناعى بلغتنا
              </h3>

              <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", margin: "15px 0 0 0", textShadow: "0 2px 5px rgba(0,0,0,0.8)" }}>
                جميع الحقوق محفوظة
              </p>

              {/* SMOKE PARTICLES */}
              {generateSmoke(true, 10, "rgba(34, 211, 238, 0.4)")}
              {generateSmoke(false, 70, "rgba(236, 72, 153, 0.4)")}
            </div>

            {/* LAYER 5: THE VERCEL LINK WITH POKE ANIMATION */}
            <div style={{ position: "relative", marginTop: "60px", opacity: linkOpacity, willChange: "opacity" }}>
              {/* The Link Text */}
              <div style={{ 
                transform: `scale(${linkScale}) translateZ(0)`, // Snap and GPU accel
                position: "relative",
                transition: "transform 0.1s",
                backfaceVisibility: "hidden",
                WebkitFontSmoothing: "antialiased"
              }}>
                <p style={{ 
                  fontSize: "18px", letterSpacing: "2px", color: "rgba(255,255,255,0.9)", 
                  borderBottom: "1px solid rgba(255,255,255,0.4)", paddingBottom: "5px",
                  margin: 0
                }}>
                  https://www.youtube.com/@HarfenWLaken
                </p>
                
                {/* Click Glow Effect */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                  width: "140%", height: "250%", background: "radial-gradient(ellipse, rgba(34, 211, 238, 0.6) 0%, rgba(236, 72, 153, 0.4) 40%, transparent 80%)",
                  opacity: linkGlowOpacity, zIndex: -1, pointerEvents: "none"
                }}/>
              </div>

              {/* The Animated Hand Cursor */}
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                opacity: handOpacity,
                transform: `translate(${handX}px, ${handY}px) scale(${handScale}) translateZ(0)`,
                zIndex: 50,
                pointerEvents: "none",
                willChange: "transform, opacity",
                backfaceVisibility: "hidden"
              }}>
                <svg width="45" height="45" viewBox="0 0 24 24" fill="#ffffff" style={{ filter: "drop-shadow(3px 5px 10px rgba(0,0,0,0.6))" }}>
                  <path d="M10 2a2 2 0 0 1 2 2v6h1.5a1.5 1.5 0 0 1 1.5 1.5v.5h1a1.5 1.5 0 0 1 1.5 1.5v.5h1a1.5 1.5 0 0 1 1.5 1.5v4c0 2.76-2.24 5-5 5h-4.5c-1.38 0-2.65-.56-3.54-1.46l-4.46-4.46a1 1 0 0 1 1.42-1.42l3.08 3.08V4a2 2 0 0 1 2-2z" stroke="#000" strokeWidth="1"/>
                </svg>
              </div>
            </div>
            
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
