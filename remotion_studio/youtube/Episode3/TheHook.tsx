import React from "react";
import {
  AbsoluteFill, Audio, Sequence, staticFile,
  useCurrentFrame, useVideoConfig,
  spring, interpolate, interpolateColors, random
} from "remotion";

// ─── EPISODE 2 COMPONENTS PORTED TO EP3 HOOK ─────────────────────────────────

const CYAN    = "#00E5CC";
const MAGENTA = "#FF3CAC";
const RED     = "#FF1111";

// Halftone dot print texture — identical to Episode 2 DioramaOverlay
const DioramaOverlay: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 90, mixBlendMode: "multiply" }}>
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: "radial-gradient(circle, #1a1a1a 1px, transparent 1px)",
      backgroundSize: "5px 5px",
      opacity: 0.3,
    }} />
  </AbsoluteFill>
);

// Rusty Film Damage (Erratically moving oil spills)
const FilmDamageOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 6); // Jittery update
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 110, mixBlendMode: "color-burn", opacity: 0.85 }}>
      <svg width="100%" height="100%">
        <filter id="film-damage">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed={seed} result="noise" />
          <feColorMatrix type="matrix" values="
            1 0 0 0 0.8
            0 1 0 0 0.4
            0 0 1 0 0.1
            0 0 0 12 -5
          " in="noise" result="coloredNoise" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-damage)" />
      </svg>
    </AbsoluteFill>
  );
};

// Warm cream editorial grid — identical to Episode 2 EditorialGrid
const EditorialGrid: React.FC = () => (
  <AbsoluteFill style={{ zIndex: 2, opacity: 0.04, pointerEvents: "none" }}>
    <div style={{
      width: "100%", height: "100%",
      backgroundImage: `linear-gradient(to right, #d9cdb4 1px, transparent 1px), linear-gradient(to bottom, #d9cdb4 1px, transparent 1px)`,
      backgroundSize: "80px 80px",
    }} />
  </AbsoluteFill>
);

// News chyron with clip-wipe RIGHT-TO-LEFT exit at exitFrame
export const NewsChyron: React.FC<{ label: string; source?: string; delayFrames?: number; exitFrame?: number; isMaskRTL?: boolean }> = ({ label, source, delayFrames = 5, exitFrame, isMaskRTL = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Base animation for the badge (and container if not masking)
  const slideIn = spring({ frame: frame - delayFrames, fps, config: { damping: 22, stiffness: 200 } });
  const x = interpolate(slideIn, [0, 1], [-400, 0]);
  const opacity = interpolate(slideIn, [0, 0.3, 1], [0, 1, 1]);

  // Independent animation for the Arabic text block sweep
  const textSpring = spring({ frame: frame - (delayFrames + (isMaskRTL ? 15 : 0)), fps, config: { damping: 12, stiffness: 180 } });
  const textScale = isMaskRTL ? interpolate(textSpring, [0, 1], [1.05, 1]) : 1;
  const maskLeft = interpolate(textSpring, [0, 1], [100, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const textOpacity = isMaskRTL ? interpolate(textSpring, [0, 0.2, 1], [0, 1, 1]) : 1;

  // Clip-wipe RIGHT-TO-LEFT exit — erases from right to left like a physical wiper
  const localExitFrame = exitFrame ? frame - exitFrame : -1;
  const wipeOut = exitFrame && localExitFrame >= 0
    ? spring({ frame: localExitFrame, fps, config: { damping: 20, stiffness: 260 } })
    : 0;
  
  let clipRight = exitFrame ? interpolate(wipeOut, [0, 1], [100, 0], { extrapolateLeft: "clamp" }) : 100;
  
  // The first visible undershoot (the beautiful single tail bounce) happens between frames 13 and 20.
  // We clamp it to 0 (fully invisible) at frame 22 to physically prevent any 2nd or 3rd ghost shadows.
  if (localExitFrame >= 22) {
    clipRight = 0;
  }

  return (
    <AbsoluteFill style={{ zIndex: 120, pointerEvents: "none" }}>
      <div style={{
        position: "absolute", bottom: "4%", left: 0,
        display: "flex", alignItems: "stretch",
        transform: isMaskRTL ? "none" : `translateX(${x}px)`,
        opacity: isMaskRTL ? 1 : opacity,
        clipPath: `inset(0 ${100 - clipRight}% 0 0)`, // Parent handles the exit wipe
        filter: "drop-shadow(8px 12px 16px rgba(0,0,0,0.95))",
      }}>
        {/* BREAKING label */}
        <div style={{
          backgroundColor: MAGENTA, padding: "8px 18px", display: "flex", alignItems: "center",
          transform: isMaskRTL ? `translateX(${x}px)` : "none",
          opacity: isMaskRTL ? opacity : 1,
        }}>
          <span style={{ color: "#fff", fontSize: 24, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase" }}>BREAKING</span>
        </div>
        
        {/* Headline text */}
        <div style={{
          backgroundColor: "rgba(0,0,0,0.92)", padding: "8px 24px",
          borderTop: `2px solid ${CYAN}`,
          display: "flex", alignItems: "center", gap: 20,
          clipPath: isMaskRTL ? `inset(0 0 0 ${maskLeft}%)` : "none", // Child handles the entry sweep
          transform: `scale(${textScale}) translateZ(0)`,
          willChange: 'transform',
          transformOrigin: 'left center',
          opacity: isMaskRTL ? textOpacity : 1,
        }}>
          <span dir="rtl" style={{ color: "#F5F5F5", fontSize: 32, fontWeight: 700, whiteSpace: "nowrap" }}>{label}</span>
          {source && <span style={{ color: CYAN, fontSize: 28, fontWeight: 700, opacity: 1, whiteSpace: "nowrap" }}>• {source}</span>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── THE HOOK SCENE ───────────────────────────────────────────────────────────

// Glitching Google Logo — exact Episode 2 mask-based CA glitch
const GoogleGlitchLogo: React.FC<{ startFrame: number, duration: number }> = ({ startFrame, duration }) => {
  const frame = useCurrentFrame();
  const fps = useVideoConfig().fps;
  
  if (frame < startFrame || frame > startFrame + duration) return null;
  
  const localF = frame - startFrame;
  
  // Stamp in
  const stampIn = spring({ frame: localF, fps, config: { damping: 14, stiffness: 200 } });
  
  // Episode 2 Mask-based Glitch Logic
  // Reduced intensity on entry for a cleaner stamp-in (0.8 instead of 1.5)
  const glitchIntensity = interpolate(localF, [0, 15], [0.8, 0.2], { extrapolateRight: "clamp" });
  
  const jitterX = Math.sin(frame * 12) * 55 * glitchIntensity;
  const jitterY = Math.cos(frame * 15) * 35 * glitchIntensity;
  const glitchScale = 1 + (Math.sin(frame * 25) * 0.12 * glitchIntensity);
  
  // Slow deflate
  const deflate = interpolate(localF, [0, duration], [1, 0.94], { extrapolateRight: "clamp" });

  // Faint and disappear before the shot ends
  const fadeOut = interpolate(localF, [duration - 15, duration], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Turns reddish as it decays, syncing with the background tint shift
  const redTint = interpolate(localF, [duration - 30, duration], [0, 0.8], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  
  const maskStyle: React.CSSProperties = {
    position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
    maskImage: `url(${staticFile("logos/google.svg")})`,
    WebkitMaskImage: `url(${staticFile("logos/google.svg")})`,
    maskSize: "contain", WebkitMaskSize: "contain",
    maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat",
    mixBlendMode: "screen",
  };

  return (
    <AbsoluteFill style={{ zIndex: 110, pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
      <div style={{
        position: "absolute",
        left: "14%",
        top: "45%",
        width: 260, height: 260,
        opacity: fadeOut,
        transform: `translateY(-50%) scale(${stampIn * deflate * glitchScale})`,
      }}>
        {/* Base Logo */}
        <img src={staticFile("logos/google.svg")} style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.9 }} />

        {/* Red Decay Tint */}
        <div style={{
          ...maskStyle,
          backgroundColor: "#ff1111",
          opacity: redTint,
          mixBlendMode: "color"
        }} />

        {/* Pink Ghost CA */}
        <div style={{
          ...maskStyle,
          backgroundColor: "#ec4899",
          transform: `translateX(${jitterX}px) translateY(${jitterY}px)`,
          opacity: glitchIntensity * 0.7
        }} />

        {/* Pink Smear */}
        <div style={{
          ...maskStyle,
          backgroundColor: "#ec4899",
          transform: `translateX(${jitterX * 1.5}px) translateY(${jitterY * 1.2}px)`,
          opacity: glitchIntensity * 0.3
        }} />

        {/* Cyan Ghost CA */}
        <div style={{
          ...maskStyle,
          backgroundColor: "#22d3ee",
          transform: `translateX(${-jitterX}px) translateY(${-jitterY}px)`,
          opacity: glitchIntensity * 0.7
        }} />

        {/* Cyan Smear */}
        <div style={{
          ...maskStyle,
          backgroundColor: "#22d3ee",
          transform: `translateX(${-jitterX * 1.5}px) translateY(${-jitterY * 1.2}px)`,
          opacity: glitchIntensity * 0.3
        }} />
      </div>
    </AbsoluteFill>
  );
};

// Premium 2026 Kinetic Caption (Boxless, Dynamic Typography)
const KineticCaption: React.FC<{ text: string, startFrame: number, duration: number, accentColor: string }> = ({ text, startFrame, duration, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - startFrame;
  if (lf < 0 || lf > duration) return null;
  
  // Split into words for staggered animation
  const words = text.split(" ");

  return (
    <div style={{
      position: "absolute", bottom: "6%", left: 0, right: 0,
      display: "flex", justifyContent: "center", gap: "15px", zIndex: 200, pointerEvents: "none",
      direction: "rtl" // RTL for Arabic layout
    }}>
      {words.map((word, i) => {
        // Stagger each word by 4 frames
        const enterFrame = i * 4;
        const wordLf = Math.max(0, lf - enterFrame);
        
        const pop = spring({ frame: wordLf, fps, config: { damping: 14, stiffness: 220 } });
        
        // 1.00s (30 frames) after the word fully enters (roughly 10 frames), it starts exiting. 
        // So exit starts at enterFrame + 40.
        const exitLf = Math.max(0, lf - (enterFrame + 40));
        const exitPop = spring({ frame: exitLf, fps, config: { damping: 14, stiffness: 220 } });
        
        // Frame-by-frame perfect decoupling: Independent scale and position multipliers
        const enterScale = interpolate(pop, [0, 1], [0.3, 1]);
        const exitScaleMultiplier = interpolate(exitPop, [0, 1], [1, 0]);
        const scale = enterScale * exitScaleMultiplier;
        
        const enterOpacity = interpolate(pop, [0, 1], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        const exitOpacity = interpolate(exitPop, [0, 1], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        const opacity = enterOpacity * exitOpacity;
        
        const enterY = interpolate(pop, [0, 1], [40, 0]);
        const exitY = interpolate(exitPop, [0, 1], [0, -40]); // Floats slightly up on exit
        const yOffset = enterY + exitY;

        // Accent coloring for punctuation
        const hasPunctuation = /!!|؟/.test(word);
        const cleanWord = word.replace(/!!|؟/g, '');
        const punctuation = word.match(/!!|؟/)?.[0] || '';

        return (
          <div key={i} style={{
            transform: `translateY(${yOffset}px) scale(${scale}) translateZ(0)`,
            opacity,
            willChange: "transform, opacity",
            WebkitFontSmoothing: "antialiased",
            color: "#FFF",
            fontFamily: "'Cairo', sans-serif",
            fontSize: 75,
            fontWeight: 900,
            letterSpacing: -1,
            // Heavy 3D drop shadow to pop against any background
            textShadow: `
              0px 15px 40px rgba(0,0,0,0.95),
              0px 5px 15px rgba(0,0,0,0.85),
              0px 0px 50px ${accentColor}66
            `
          }}>
            {cleanWord}
            {hasPunctuation && (
              <span style={{ color: accentColor, textShadow: `0 0 40px ${accentColor}` }}>
                {punctuation}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const TheHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Camera Snap Timecodes ──
  // Wide:     0   → 70   (0s to 2s 10f)
  // Angle:    70  → 148  (2s 10f to 4s 28f)
  // Close-Up: 148 → 200  (4s 28f to end)
  const isWide    = frame < 70;
  const isAngle   = frame >= 70  && frame < 148;
  const isCloseUp = frame >= 148;

  const drift = frame * 0.05;

  // ── 3. Mazen spring slide-up ONLY on first wide shot entrance ──
  // Angle and close-up are hard snaps — no spring, just instant cut
  const wideSlide = spring({ frame: frame - 0, fps, config: { damping: 18, stiffness: 180 } });
  const wideY = interpolate(wideSlide, [0, 1], [1000, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // Starts fully off-screen
  const wideOpacity = interpolate(wideSlide, [0, 0.2, 1], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // Fades in quickly like Episode 2

  // ── 4. Slow imperceptible push-in per pose (scale 1 → 1.03 over pose duration) ──
  const widePush  = interpolate(frame, [0,   70],  [1.00, 1.03], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const anglePush = interpolate(frame, [70,  148], [1.00, 1.03], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const closePush = interpolate(frame, [148, 200], [1.00, 1.03], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent", overflow: "hidden", fontFamily: "'Cairo', sans-serif" }}>
      <Audio src={staticFile("audio/episode3/hook_mazen.mp3")} />

      {/* (STUDIO BACKGROUND AND DYNAMIC COLOR TINT MOVED TO EPISODE3.TSX TO PREVENT BACKGROUND SWIPE DURING WHIP PAN) */}

      {/* 3. EDITORIAL GRID */}
      <EditorialGrid />

      {/* 4. PAPER CUTOUTS — spring slide-up entrance + slow push per pose */}
      <AbsoluteFill style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", zIndex: 30 }}>
        {isWide && (
          <img src={staticFile("images/episode3/mazen-wide-shot.png")} style={{
            height: "90%", objectFit: "contain",
            transform: `scale(${widePush}) translateY(${wideY + drift}px)`,
            opacity: wideOpacity,
            filter: "drop-shadow(-18px 25px 50px rgba(0,0,0,0.99))",
          }} />
        )}
        {isAngle && (
          <img src={staticFile("images/episode3/mazen-angle.png")} style={{
            height: "95%", objectFit: "contain",
            // Centered on the right half, leaving the left open for Google
            transform: `scale(${anglePush * 1.1}) translateX(5%) translateY(${drift}px)`,
            filter: "drop-shadow(-25px 35px 60px rgba(0,0,0,0.99))",
          }} />
        )}
        {isCloseUp && (
          <img src={staticFile("images/episode3/mazen-closeup.png")} style={{
            height: "150%", objectFit: "contain",
            transform: `scale(${closePush * 1.4}) translateY(${10 + drift}%)`,
            filter: "drop-shadow(-35px 45px 70px rgba(0,0,0,0.99))",
          }} />
        )}
      </AbsoluteFill>

      {/* 6. VIGNETTE — double layer, exactly Episode 2 */}
      <AbsoluteFill style={{
        zIndex: 110, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.97) 100%)",
      }} />
      <AbsoluteFill style={{
        zIndex: 110, pointerEvents: "none",
        background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 40%)",
      }} />

      {/* 7. HALFTONE PRINT TEXTURE */}
      <DioramaOverlay />

      {/* 8. CRT SCANLINES */}
      <AbsoluteFill style={{
        zIndex: 115, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px)",
        mixBlendMode: "overlay",
      }} />

      {/* 9. NEWS CHYRON — slides in at 00:04.04 (frame 124), wipes out at 00:05.24 (frame 174) */}
      <Sequence from={124}>
        <NewsChyron label="هل جوجل في خطر حقيقي؟" source="تقرير خاص · 2026" delayFrames={0} exitFrame={50} />
      </Sequence>

      {/* 10. GOOGLE LOGO GLITCH — Appears during side shot, faints out before the close-up cut (frames 80 to 148) */}
      <GoogleGlitchLogo startFrame={80} duration={68} />

      {/* 11. KINETIC CAPTIONS */}
      <KineticCaption text="بحث جوجل!!" startFrame={0} duration={70} accentColor={CYAN} />
      <KineticCaption text="هل سيستمر؟" startFrame={70} duration={78} accentColor={MAGENTA} />

    </AbsoluteFill>
  );
};
