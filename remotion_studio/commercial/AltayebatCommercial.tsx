import React from "react";
import {
  AbsoluteFill,
  Video,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  random
} from "remotion";

export const AltayebatCommercial: React.FC = () => {
  const frame = useCurrentFrame();

  // Exactly mathematically calculated from the user's provided timecodes!
  const textData = [
    { text: "الانتعاش", start: 75, end: 150 },  // 00:02.15 to 00:05.00
    { text: "الحيوية", start: 169, end: 219 }, // 00:05.19 to 00:07.09
    { text: "الخفة", start: 225, end: 275 },    // 00:07.15 to 00:09.05
    { text: "الإصرار", start: 304, end: 340 }, // 00:10.04 to 00:11.10
    { text: "المرونة", start: 345, end: 414 },  // ... to 00:13.24
    { text: "متعة الشباب", start: 415, end: 474 }, // 00:13.25 to 00:15.24
    { text: "الاحساس بالقوة", start: 475, end: 549 }, // ... to 00:18.09
    { text: "الحماس", start: 557, end: 635 },   // 00:18.17 to 00:21.05
    { text: "الدقة", start: 655, end: 701 },    // 00:21.25 to 00:23.11
    { text: "تحدى الجاذبية", start: 705, end: 824 }, // ... to 00:27.14
    { text: "الطيبات", start: 830, end: 860 }   // Exits early to make room
  ];

  // Exact Camera Shakes per user timecodes
  const shake1Frame = 415; // 00:13.25 (Bottles smashing effect)
  const shake2Frame = 652; // 00:21.22 (Racket Ball effect)

  const isShake1 = frame >= shake1Frame && frame < shake1Frame + 15; 
  const isShake2 = frame >= shake2Frame && frame < shake2Frame + 15; 
  
  const shakeIntensity = isShake1 ? interpolate(frame - shake1Frame, [0, 15], [35, 0], { extrapolateRight: "clamp" }) :
                         isShake2 ? interpolate(frame - shake2Frame, [0, 15], [35, 0], { extrapolateRight: "clamp" }) : 0;
  
  const shakeX = shakeIntensity > 0 ? random(`x-${frame}`) * shakeIntensity - (shakeIntensity / 2) : 0;
  const shakeY = shakeIntensity > 0 ? random(`y-${frame}`) * shakeIntensity - (shakeIntensity / 2) : 0;
  const finalScale = shakeIntensity > 0 ? 1.05 : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      
      {/* 1. MASTER VIDEO */}
      <AbsoluteFill 
        style={{ 
          transform: `translate(${shakeX}px, ${shakeY}px) scale(${finalScale})`,
          willChange: "transform"
        }}
      >
        <Video
          src={staticFile("altayebat-master.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* 2. PRECISE TYPOGRAPHY LAYER */}
      {textData.map((item, index) => {
        const duration = item.end - item.start;
        return (
          <Sequence
            key={index}
            from={item.start}
            durationInFrames={duration}
          >
            <LowerThirdTypography text={item.text} duration={duration} />
          </Sequence>
        );
      })}

      {/* FLOATING TEXT (احلى عصير جوافة) */}
      <FloatingGuavaText />

      {/* 3. AUTHENTIC HARFEN OUTRO CARD (Synced to original music beat at 904) */}
      <Sequence from={904}>
        <OutroCard />
      </Sequence>

    </AbsoluteFill>
  );
};

const LowerThirdTypography: React.FC<{ text: string; duration: number }> = ({ text, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const translateY = spring({ frame, fps, config: { damping: 14, mass: 0.5 }, from: 100, to: 0 });
  // Fades in over 10 frames, stays solid, then fades out perfectly in the last 10 frames before it disappears.
  const opacity = interpolate(frame, [0, 10, duration - 10, duration], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-end", paddingBottom: "120px", paddingRight: "60px", zIndex: 10 }}>
      <div style={{ transform: `translateY(${translateY}px)`, opacity, display: "flex", flexDirection: "column" }}>
        <div style={{
            background: "rgba(20, 20, 20, 0.4)", backdropFilter: "blur(12px)", padding: "16px 32px",
            borderRadius: "8px", borderRight: "6px solid #B4D330", width: "fit-content",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)", position: "relative", overflow: "hidden",
          }}
        >
          <div style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)",
              transform: `translateX(${interpolate(frame % 60, [0, 60], [-100, 200])}%)`,
              zIndex: 1, pointerEvents: "none",
            }}
          />
          <h1 style={{
              color: "white", fontFamily: "'Tajawal', 'Cairo', system-ui, -apple-system, sans-serif",
              fontSize: "96px", fontWeight: 900, margin: 0, letterSpacing: "0px", position: "relative", zIndex: 2,
            }}
          >
            {text}
          </h1>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Custom Floating Typography (No Card) for 'احلى عصير جوافة'
const FloatingGuavaText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = 860; // Triggers right after الطيبات leaves
  const duration = 44; // Fades out before 904 Outro
  
  if (frame < startFrame || frame > startFrame + duration) return null;
  
  const localFrame = frame - startFrame;
  const opacity = interpolate(localFrame, [0, 5, duration - 5, duration], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  
  // Fast Smooth right-to-left reveal
  const clipProgress = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 80 } });
  const clipLeft = interpolate(clipProgress, [0, 1], [100, 0]); // 100% (fully clipped on right) to 0% (fully revealed to left)
  
  const glossProgress = (localFrame % 30) / 30; // Faster sweep

  return (
    <AbsoluteFill style={{ zIndex: 15, pointerEvents: "none", justifyContent: "flex-end", alignItems: "center", paddingBottom: "120px" }}>
      <div style={{ display: "flex", justifyContent: "center", width: "100%", opacity }}>
         <h2 style={{
             fontFamily: "'Cairo', system-ui, sans-serif",
             fontSize: "96px",
             color: "white",
             margin: 0,
             fontWeight: 900,
             clipPath: `polygon(${clipLeft}% 0, 100% 0, 100% 100%, ${clipLeft}% 100%)`,
             textShadow: "0 10px 30px rgba(0,0,0,0.9)",
             position: "relative"
         }}>
             احلى عصير جوافة

            {/* The Red Guava Scanning Effect */}
            <div style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              background: `linear-gradient(110deg, transparent 0%, transparent ${glossProgress * 100 - 15}%, rgba(255, 90, 120, 0.95) ${glossProgress * 100}%, transparent ${glossProgress * 100 + 15}%, transparent 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", zIndex: 3
            }}>
              احلى عصير جوافة
            </div>
         </h2>
      </div>
    </AbsoluteFill>
  );
};

// THE AUTHENTIC HARFEN W LAKEN OUTRO ANIMATION
const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1]);
  const bgBlur = interpolate(frame, [0, 15], [0, 20]);

  const cardScale = spring({ frame, fps, config: { damping: 14, stiffness: 100 }, from: 0.5, to: 1 });
  
  // LOGO REVEAL
  const logoFrame = 10;
  const logoSpring = spring({ frame: Math.max(0, frame - logoFrame), fps, config: { damping: 18, stiffness: 45 } });
  const clampedLogoSpring = logoSpring > 0.995 ? 1 : logoSpring;
  const logoScale = interpolate(clampedLogoSpring, [0, 1], [3.5, 1.25]);
  const logoOpacity = interpolate(clampedLogoSpring, [0, 1], [0, 1]);
  const logoBrightness = interpolate(clampedLogoSpring, [0, 0.5, 1], [5, 2, 1], { extrapolateRight: "clamp" });
  const logoBlur = interpolate(clampedLogoSpring, [0, 0.5, 1], [40, 0, 0], { extrapolateRight: "clamp" });
  const tealSlideX = interpolate(clampedLogoSpring, [0, 1], [-80, -10]);
  const pinkSlideX = interpolate(clampedLogoSpring, [0, 1], [80, 10]);
  const pulseScale = 1 + Math.max(0, Math.sin((frame - logoFrame - 30) * 0.15)) * 0.06;

  // TEXT
  const typeStartF = 25;
  const textRevealSpring = spring({ frame: Math.max(0, frame - typeStartF), fps, config: { damping: 20, stiffness: 60 } });

  // LINK POKE
  const linkF = 45;
  const pokeF = 65;
  const linkOpacity = interpolate(frame, [linkF, linkF + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const handMoveProgress = spring({ frame: Math.max(0, frame - (pokeF - 20)), fps, config: { damping: 15, stiffness: 90 } });
  const handLeaveProgress = spring({ frame: Math.max(0, frame - (pokeF + 15)), fps, config: { damping: 12, stiffness: 80 } });
  const pokeClickSpring = spring({ frame: Math.max(0, frame - pokeF), fps, config: { damping: 10, stiffness: 150 } });

  const handX = interpolate(handMoveProgress, [0, 1], [300, 0]) + interpolate(handLeaveProgress, [0, 1], [0, 200]);
  const handY = interpolate(handMoveProgress, [0, 1], [400, 20]) + interpolate(handLeaveProgress, [0, 1], [0, 400]); 
  const handOpacity = interpolate(handMoveProgress, [0, 0.2, 1], [0, 1, 1]) - interpolate(handLeaveProgress, [0, 0.5, 1], [0, 0, 1]);
  const clampedPokeSpring = pokeClickSpring > 0.995 ? 1 : pokeClickSpring;
  const linkScale = interpolate(clampedPokeSpring, [0, 0.2, 1], [1, 0.95, 1]);
  const handScale = interpolate(clampedPokeSpring, [0, 0.2, 1], [1, 0.85, 1]);
  const linkGlowOpacity = interpolate(clampedPokeSpring, [0, 0.2, 1], [0, 1, 0]);

  // DEDICATION — delayed fade-in, dignified
  const dedicationReveal = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 28, stiffness: 40 } });

  // SMOKE
  const generateSmoke = (isLeftToRight: boolean, yOffset: number, color: string) => {
    const particleCount = 60; 
    return Array.from({ length: particleCount }).map((_, i) => {
      const spawnProgress = i / particleCount;
      const spawnFrame = typeStartF + spawnProgress * 40;
      const age = Math.max(0, frame - spawnFrame);
      if (age === 0 || frame < typeStartF || frame > typeStartF + 120) return null;

      const yDrift = interpolate(age, [0, 60], [0, -80]);
      const xDrift = Math.sin(i) * 40;
      const smokeOpacity = interpolate(age, [0, 15, 50], [0, 0.9, 0]);
      const smokeScale = interpolate(age, [0, 50], [1.6, 5.0]);

      const startX = isLeftToRight ? -500 : 500;
      const endX = isLeftToRight ? 500 : -500;
      const xPos = interpolate(spawnProgress, [0, 1], [startX, endX]);

      return (
        <div key={i} style={{ position: "absolute", left: `calc(50% + ${xPos + xDrift}px)`, top: `calc(50% + ${yOffset * 2 + yDrift}px)`, width: "16px", height: "16px", background: color, borderRadius: "50%", filter: "blur(8px)", opacity: smokeOpacity, transform: `scale(${smokeScale}) translateZ(0)`, zIndex: 30 }} />
      );
    });
  };

  return (
    <AbsoluteFill style={{ zIndex: 20, backgroundColor: "black", overflow: "hidden", color: "white", fontFamily: "system-ui, sans-serif" }}>
      <AbsoluteFill 
        style={{ 
          opacity, 
          backdropFilter: `blur(${bgBlur}px)`, 
          backgroundColor: `rgba(0,0,0,${interpolate(opacity, [0, 1], [0, 0.4])})`,
          pointerEvents: "none" 
        }} 
      />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", zIndex: 10 }}>
        <div style={{ width: "100%", height: "100%", background: "rgba(255, 255, 255, 0.06)", backdropFilter: "blur(20px)", border: "none", boxShadow: "none", borderRadius: "0px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${cardScale}) translateZ(0) rotate(0.001deg)`, opacity, willChange: "transform, opacity", WebkitFontSmoothing: "antialiased" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            
            {/* LOGO */}
            {frame > logoFrame && (
              <div style={{ transform: `scale(${logoScale})`, opacity: logoOpacity, filter: `brightness(${logoBrightness}) blur(${logoBlur}px)`, marginBottom: "60px", position: "relative", width: "320px", height: "320px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={staticFile("youtube-assets/outer-ring.png")} style={{ position: "absolute", width: "100%", height: "100%", transform: `rotate(${interpolate(logoSpring, [0, 1], [-180, 0])}deg)`, filter: `drop-shadow(0px 0px 30px rgba(34,211,238,0.4))` }} />
                <div style={{ position: "absolute", width: "70%", height: "70%", transform: `translateX(${tealSlideX}px) scale(${frame > logoFrame + 30 ? pulseScale : 1}) translateZ(0)`, filter: `drop-shadow(-5px 5px 15px rgba(34,211,238,0.6))` }}>
                  <img src={staticFile("youtube-assets/heart-teal.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
                <div style={{ position: "absolute", width: "70%", height: "70%", transform: `translateX(${pinkSlideX}px) scale(${frame > logoFrame + 30 ? pulseScale : 1}) translateZ(0)`, filter: `drop-shadow(5px 5px 15px rgba(236,72,153,0.6))` }}>
                  <img src={staticFile("youtube-assets/heart-pink.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
              </div>
            )}

            {/* TYPOGRAPHY */}
            <div style={{ position: "relative", width: "1000px", display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(${interpolate(textRevealSpring, [0, 1], [40, 0])}px) translateZ(0) rotate(0.001deg)`, opacity: textRevealSpring, willChange: "transform, opacity", WebkitFontSmoothing: "antialiased" }}>
              <h1 style={{ fontSize: "92px", letterSpacing: "4px", margin: 0, color: "#fff", textShadow: "0 8px 30px rgba(0,0,0,1), 0 0 35px #22d3ee" }}>حرفين ولكن</h1>
              <div style={{ display: "flex", flexDirection: "row", gap: 30, marginTop: 10, marginBottom: 10 }}>
                <h2 style={{ fontSize: "56px", letterSpacing: "8px", margin: 0, color: "#22d3ee", fontWeight: 900, textShadow: "0 8px 20px rgba(0,0,0,1), 0 0 20px rgba(34,211,238,0.8)" }}>A.I.</h2>
                <h2 style={{ fontSize: "56px", letterSpacing: "8px", margin: 0, color: "#ec4899", fontWeight: 900, textShadow: "0 8px 20px rgba(0,0,0,1), 0 0 20px rgba(236,72,153,0.8)" }}>NEWS</h2>
              </div>
              <h3 style={{ fontSize: "40px", color: "rgba(255,255,255,0.9)", margin: "16px 0 0 0", fontWeight: 500, textShadow: "0 4px 10px rgba(0,0,0,0.8)" }}>الذكاء الصناعى بلغتنا</h3>
              <p style={{ fontSize: "36px", color: "rgba(255,255,255,0.7)", margin: "30px 0 0 0", textShadow: "0 2px 5px rgba(0,0,0,0.8)" }}>جميع الحقوق محفوظة</p>
              {generateSmoke(true, 20, "rgba(34, 211, 238, 0.4)")}
              {generateSmoke(false, 140, "rgba(236, 72, 153, 0.4)")}
            </div>

            {/* VERCEL LINK */}
            <div style={{ position: "relative", marginTop: "120px", opacity: linkOpacity }}>
              <div style={{ transform: `scale(${linkScale}) translateZ(0)`, position: "relative" }}>
                <p style={{ fontSize: "30px", letterSpacing: "3px", color: "rgba(255,255,255,0.9)", borderBottom: "2px solid rgba(255,255,255,0.4)", paddingBottom: "10px", margin: 0 }}>https://www.youtube.com/@HarfenWLaken</p>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "140%", height: "250%", background: "radial-gradient(ellipse, rgba(34, 211, 238, 0.6) 0%, rgba(236, 72, 153, 0.4) 40%, transparent 80%)", opacity: linkGlowOpacity, zIndex: -1, pointerEvents: "none" }}/>
              </div>
              <div style={{ position: "absolute", top: "50%", left: "50%", opacity: handOpacity, transform: `translate(${handX}px, ${handY}px) scale(${handScale}) translateZ(0)`, zIndex: 50, pointerEvents: "none" }}>
                <svg width="90" height="90" viewBox="0 0 24 24" fill="#ffffff" style={{ filter: "drop-shadow(3px 5px 10px rgba(0,0,0,0.6))" }}>
                  <path d="M10 2a2 2 0 0 1 2 2v6h1.5a1.5 1.5 0 0 1 1.5 1.5v.5h1a1.5 1.5 0 0 1 1.5 1.5v.5h1a1.5 1.5 0 0 1 1.5 1.5v4c0 2.76-2.24 5-5 5h-4.5c-1.38 0-2.65-.56-3.54-1.46l-4.46-4.46a1 1 0 0 1 1.42-1.42l3.08 3.08V4a2 2 0 0 1 2-2z" stroke="#000" strokeWidth="1"/>
                </svg>
              </div>
            </div>

            {/* DEDICATION */}
            <div style={{
              marginTop: "80px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: dedicationReveal,
              transform: `translateY(${interpolate(dedicationReveal, [0, 1], [30, 0])}px) translateZ(0)`,
              willChange: "transform, opacity"
            }}>
              <div style={{ width: "600px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)", marginBottom: "28px" }} />
              <p style={{
                fontFamily: "'Cairo', system-ui, sans-serif",
                fontSize: "34px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.75)",
                margin: 0,
                letterSpacing: "1px",
                textAlign: "center",
                textShadow: "0 4px 20px rgba(0,0,0,0.9)"
              }}>اهداء لروح الدكتور ضياء العوضى</p>
            </div>

          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
