import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  OffthreadVideo,
  staticFile,
  Img,
  Audio
} from "remotion";

export const GlobeVistaWorldCup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // TIMELINE CALCULATIONS (Assuming 24 fps for cinematic timing)
  const clipBStartFrame = 9 * fps; // 00:09:00 -> Frame 216
  
  // --- TASK 1: HARFEN W LAKEN BRAND LUT ---
  // Desaturate and deepen the video slightly so the brand colors can take over the highlights/shadows
  const videoFilter = "contrast(1.15) saturate(0.9) brightness(0.9)";
  
  // A single, robust spring to drive the entire composition smoothly (No Remotion glitches)
  const masterSpring = spring({
    frame: frame - (11 * fps),
    fps,
    config: { damping: 14, mass: 1, stiffness: 60 } // Elegant, majestic entry
  });

  // Smooth opacity fade
  const masterOpacity = interpolate(masterSpring, [0, 1], [0, 1]);

  // Card slides smoothly from the left into its final spot
  const cardSlideX = interpolate(masterSpring, [0, 1], [-150, 0]); 
  
  // The Video Pans right smoothly to create Rule-of-Thirds balance!
  const videoPanX = interpolate(masterSpring, [0, 1], [0, 80]); // Shifts 80px right
  
  // --- NEW: LOGO ANIMATION TIMED FOR OUTRO ---
  // Starts exactly as the fan note fades out
  const logoSpring = spring({
    frame: frame - (13.5 * fps),
    fps,
    config: { damping: 18, mass: 1.5, stiffness: 40 }
  });

  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);
  const tealSlideX = interpolate(logoSpring, [0, 1], [-30, -5]);
  const pinkSlideX = interpolate(logoSpring, [0, 1], [30, 5]);

  const baseScale = interpolate(logoSpring, [0, 1], [0.5, 1.0]); 
  const pulseIntensity = interpolate(logoSpring, [0.9, 1], [0, 0.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulseScale = baseScale + (Math.sin(frame * 0.15) * pulseIntensity);

  // --- TASK 2: SIGNATURE ANIMATION SEQUENCING ---
  // In at 12.5s, Out at 13.6s
  const fanNoteOpacity = interpolate(
    frame,
    [12.5 * fps, 12.8 * fps, 13.3 * fps, 13.6 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Brand Name wipes in at 14.0s (after logo appears)
  const sigWipe = interpolate(
    frame,
    [14.0 * fps, 14.8 * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // --- TASK 3: CAMERA SHAKE AT 07:23 (7s, 23f) ---
  // Note: 07.23 in the Remotion timeline means 7 seconds and 23 frames.
  const shakeStart = (7 * fps) + 23; 
  const shakeDuration = 12; // Exact same 12-frame aggressive duration from V2
  let shakeX = 0;
  let shakeY = 0;

  if (frame >= shakeStart && frame < shakeStart + shakeDuration) {
    const decay = 1 - (frame - shakeStart) / shakeDuration;
    // Exactly the same math and 30px amplitude from ShortWorldCupV2
    shakeX = Math.sin(frame * 5.1 + shakeStart) * 30 * decay;
    shakeY = Math.cos(frame * 4.7 + shakeStart) * 30 * decay;
  }

  return (
    <AbsoluteFill style={{ 
      backgroundColor: "#000",
      transform: `translate(${shakeX}px, ${shakeY}px)`,
      transformOrigin: "center center"
    }}>
      
      {/* 0. MASTER AUDIO TRACK (Music + SFX) */}
      <Audio src={staticFile("youtube-assets/music-v-3.mp3")} />

      {/* 1. CINEMATIC BASE VIDEO */}
      <OffthreadVideo
        src={staticFile("youtube-assets/worldcup-ver-3.mp4")}
        style={{ 
          width: "100%", height: "100%", objectFit: "cover", 
          filter: videoFilter, 
          transform: `scale(1.15) translateX(${videoPanX}px)` // Bumped scale to 1.15 to guarantee no edge gaps
        }}
      />
      
      {/* 1.5: THE HARFEN W LAKEN BRAND LUT WASH */}
      {/* This physically tints the entire video with the signature Cyan and Pink colors */}
      <AbsoluteFill style={{
        background: "linear-gradient(135deg, rgba(34, 211, 238, 0.25) 0%, rgba(236, 72, 153, 0.25) 100%)",
        mixBlendMode: "color", // Maps the brand colors directly into the video's pixels
        zIndex: 1, pointerEvents: "none"
      }} />
      
      {/* A subtle vignette to make the center pop */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)", // MUST be ellipse for 16:9, otherwise it creates black pillars
        zIndex: 2, pointerEvents: "none"
      }} />

      {frame >= 11 * fps && (
        <>
          {/* LAYER 1: PREMIUM FIFA-INSPIRED CARD (Anchored safely to the Left) */}
          <AbsoluteFill style={{ zIndex: 10 }}>
            {/* The right: 54% completely prevents it from crossing the center line, leaving the Trophy 100% visible */}
            <div style={{ position: "absolute", right: "54%", top: "50%", transform: "translateY(-50%)" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 30,
                background: "linear-gradient(135deg, rgba(88, 28, 135, 0.9), rgba(15, 23, 42, 0.9))", 
                border: "1px solid rgba(216, 180, 254, 0.2)", // Base subtle border
                borderRadius: 40, padding: "30px 60px",
                boxShadow: "0 30px 60px rgba(0,0,0,0.8), inset 0 2px 20px rgba(216, 180, 254, 0.2)",
                transform: `translateX(${cardSlideX}px)`,
                opacity: masterOpacity,
                position: "relative" // For anchoring the lens flares and shimmer
              }}>
                
                {/* --- NEW: SPONTANEOUS PROPAGATING GLITTER --- */}
                {/* Uses multiple glints that organically flash and disappear based on sine waves */}
                <div style={{
                  position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                  borderRadius: 40, padding: 2.5, // Restored thickness
                  background: `conic-gradient(
                    from ${(frame * 4) % 360}deg, 
                    transparent 10%, 
                    rgba(255, 255, 255, ${Math.max(0, Math.sin(frame * 0.15))}) 15%, 
                    transparent 25%, 
                    transparent 60%, 
                    rgba(216, 180, 254, ${Math.max(0, Math.cos(frame * 0.09))}) 70%, 
                    transparent 85%
                  )`,
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor", maskComposite: "exclude",
                  pointerEvents: "none", zIndex: 35
                }} />

                {/* CINEMATIC ANAMORPHIC LENS FLARES */}
                <div style={{
                  position: "absolute", top: -2, left: "50%", width: "120%", height: 12,
                  background: "radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(216, 180, 254, 0.6) 20%, transparent 60%)",
                  transform: `translateX(-50%) translateX(${Math.sin(frame * 0.03) * 120}px)`,
                  opacity: 0.5 + (Math.sin(frame * 0.12) * 0.3),
                  mixBlendMode: "screen", filter: "blur(3px)", zIndex: 30, pointerEvents: "none"
                }} />
                
                <div style={{
                  position: "absolute", bottom: -2, left: "50%", width: "90%", height: 8,
                  background: "radial-gradient(ellipse at center, rgba(34,211,238,0.9) 0%, transparent 50%)",
                  transform: `translateX(-50%) translateX(${Math.sin(frame * 0.05 + 2) * 80}px)`,
                  opacity: 0.4 + (Math.sin(frame * 0.09) * 0.2),
                  mixBlendMode: "screen", filter: "blur(2px)", zIndex: 30, pointerEvents: "none"
                }} />

                {/* RESTORED: "WE ARE" */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", zIndex: 2 }}>
                  <h1 style={{ margin: 0, fontSize: 130, fontWeight: 900, color: "#fff", fontFamily: "'Arial Black', 'Impact', sans-serif", lineHeight: 0.8, letterSpacing: -2 }}>WE</h1>
                  <h1 style={{ margin: 0, fontSize: 130, fontWeight: 900, color: "#fff", fontFamily: "'Arial Black', 'Impact', sans-serif", lineHeight: 0.8, letterSpacing: -2 }}>ARE</h1>
                </div>

                {/* STACKED "26" GEOMETRY */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
                  <h1 style={{ 
                    margin: 0, fontSize: 280, fontWeight: 900, 
                    fontFamily: "'Arial Black', 'Impact', sans-serif", lineHeight: 0.7, letterSpacing: -10,
                    background: "linear-gradient(to bottom, #ffffff, #d8b4fe)", // Premium gradient text
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                  }}>
                    2
                  </h1>
                  <h1 style={{ 
                    margin: 0, fontSize: 280, fontWeight: 900, 
                    fontFamily: "'Arial Black', 'Impact', sans-serif", lineHeight: 0.7, letterSpacing: -10,
                    background: "linear-gradient(to top, #ffffff, #d8b4fe)", // Premium gradient text
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                  }}>
                    6
                  </h1>
                </div>

              </div>
            </div>
          </AbsoluteFill>
          
          {/* LAYER 3: GLOBAL CINEMATIC LENS FLARE (Subtle, Opposite Flow) */}
          <AbsoluteFill style={{ zIndex: 90, pointerEvents: "none", mixBlendMode: "screen" }}>
             
             {/* The Wide Anamorphic Color Streak (Cyan to Pink) */}
             <div style={{
               position: "absolute", top: "40%", left: "-20%", width: "150%", height: "15%",
               background: "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.6) 0%, rgba(34, 211, 238, 0.4) 25%, rgba(236, 72, 153, 0.2) 60%, transparent 80%)",
               transform: `rotate(-8deg) translateX(${-Math.sin(frame * 0.04) * 350}px)`,
               filter: "blur(12px)",
               opacity: (0.3 + (Math.sin(frame * 0.08) * 0.3)) * masterOpacity
             }} />

             {/* The Sharp "Hot Core" of the Lens Flare */}
             <div style={{
               position: "absolute", top: "46.5%", left: "-20%", width: "150%", height: "3px",
               background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
               transform: `rotate(-8deg) translateX(${-Math.sin(frame * 0.04 + 0.5) * 450}px)`,
               filter: "blur(2px)",
               opacity: (0.2 + (Math.sin(frame * 0.12) * 0.4)) * masterOpacity
             }} />
             
          </AbsoluteFill>
        </>
      )}

      {/* 4. SIGNATURE LOCKUP (Morph Sequence) */}
      {frame >= 12.5 * fps && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "2%", zIndex: 100 }}>
          
          {/* 1. The Fan Note (Fades in then out) */}
          <div style={{ position: "absolute", bottom: "10%", opacity: fanNoteOpacity }}>
            <h2 style={{
              margin: 0, fontSize: 45, fontWeight: 600, color: "rgba(255,255,255,0.9)",
              fontFamily: "'Tajawal', 'Cairo', sans-serif", letterSpacing: 4, direction: "rtl",
              textShadow: "0 4px 20px rgba(0,0,0,0.8)"
            }}>
              إمضاء مشجع
            </h2>
          </div>

          {/* 2. The Final Brand Reveal */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "absolute", bottom: "2%" }}>
            
            {/* The Animated Logo replacing the note */}
            <div style={{
              position: "relative", width: 180, height: 180,
              transform: `scale(${pulseScale})`, 
              opacity: logoOpacity,
              marginBottom: -10
            }}>
              <Img src={staticFile("youtube-assets/heart-teal.png")}
                style={{
                  position: "absolute", width: "100%", height: "100%", objectFit: "contain",
                  transform: `translateX(${tealSlideX}px)`,
                  mixBlendMode: "screen", filter: "drop-shadow(-5px 5px 15px rgba(0,0,0,0.6))"
                }}
              />
              <Img src={staticFile("youtube-assets/heart-pink.png")}
                style={{
                  position: "absolute", width: "100%", height: "100%", objectFit: "contain",
                  transform: `translateX(${pinkSlideX}px)`,
                  mixBlendMode: "screen", filter: "drop-shadow(5px 5px 15px rgba(0,0,0,0.6))"
                }}
              />
            </div>

            {/* The Brand Text wiping in beneath */}
            <h1 style={{
              margin: 0, fontSize: 80, fontWeight: 900, direction: "rtl",
              fontFamily: "'Tajawal', 'Cairo', sans-serif",
              background: "linear-gradient(to left, #22d3ee, #ec4899)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.9))",
              clipPath: `polygon(${100 - sigWipe}% 0, 100% 0, 100% 100%, ${100 - sigWipe}% 100%)`
            }}>
              حرفين ولكن
            </h1>
          </div>

        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
