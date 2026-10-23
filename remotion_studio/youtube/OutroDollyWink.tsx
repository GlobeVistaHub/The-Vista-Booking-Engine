import React from "react";
import { AbsoluteFill, Sequence, Img, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Particles } from "./components/Particles";
import { KineticText } from "./components/KineticText";

// ─── Phase 1: Logo Implosion ──
const LogoImplosion: React.FC = () => {
  const frame = useCurrentFrame();

  const isImploding = frame >= 60;
  const implodeFrame = isImploding ? frame - 60 : 0;

  const spinSpeed = interpolate(implodeFrame, [0, 50], [0, 1440], { extrapolateRight: "clamp" });
  const scale = interpolate(implodeFrame, [0, 35, 55], [1, 0.7, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(implodeFrame, [50, 55], [1, 0], { extrapolateRight: "clamp" });
  const brightness = interpolate(implodeFrame, [0, 35, 55], [1, 1.8, 8], { extrapolateRight: "clamp" });

  const floatY = Math.sin(frame * 0.05) * 10;

  return (
    <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: `translate(-50%, -50%) scale(${scale}) translateY(${floatY}px)`,
      opacity,
      width: 600,
      height: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Img 
        src={staticFile("youtube-assets/outer-ring.png")}
        style={{
          position: "absolute",
          width: "100%", height: "100%",
          transform: `rotate(${spinSpeed}deg)`,
          filter: `brightness(${brightness}) drop-shadow(0px 30px 40px rgba(0,0,0,0.8))`,
        }}
      />
      <div style={{
        position: "absolute",
        width: "60%", height: "60%",
        transform: `rotate(${-spinSpeed * 0.7}deg)`,
        filter: `brightness(${brightness}) drop-shadow(0px 20px 30px rgba(0,0,0,0.6))`,
      }}>
        <Img src={staticFile("youtube-assets/heart-teal.png")} style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{
        position: "absolute",
        width: "60%", height: "60%",
        transform: `rotate(${-spinSpeed * 1.3}deg)`,
        filter: `brightness(${brightness}) drop-shadow(0px 10px 20px rgba(236,72,153,0.3))`,
      }}>
        <Img src={staticFile("youtube-assets/heart-pink.png")} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

// ─── Phase 2: Singularity Flash ───────
const SingularityFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const flashOpacity = interpolate(frame, [0, 3, 15], [1, 1, 0], { extrapolateRight: "clamp" });
  const ringScale = interpolate(frame, [0, 25], [0, 10], { extrapolateRight: "clamp" });
  const ringOpacity = interpolate(frame, [0, 5, 25], [0, 0.8, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: `rgba(255,255,255,${flashOpacity})`,
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: 200, height: 200, borderRadius: "50%",
        border: "6px solid rgba(34,211,238,1)", opacity: ringOpacity, 
        transform: `translate(-50%, -50%) scale(${ringScale})`,
        boxShadow: "0 0 80px rgba(34,211,238,0.8), inset 0 0 80px rgba(34,211,238,0.5)",
      }} />
    </AbsoluteFill>
  );
};

// ─── Phase 3: Robot Reveal with Dolly Zoom & Wink ─
const RobotReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glitchIntensity = interpolate(frame, [0, 15, 20], [1, 1, 0], { extrapolateRight: "clamp" });
  const jitterX = Math.sin(frame * 12) * 55 * glitchIntensity;
  const jitterY = Math.cos(frame * 15) * 35 * glitchIntensity;
  const glitchScale = 1 + (Math.sin(frame * 25) * 0.12 * glitchIntensity);
  
  const baseScale = spring({ frame, fps, config: { damping: 12, stiffness: 85 } });
  const baseOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Dolly Zoom logic (Robot scales up starting at absolute frame 300. Here, relative frame is 190)
  const dollyZoomProgress = spring({ frame: Math.max(0, frame - 190), fps, config: { damping: 18, stiffness: 60 } });
  // Grow the robot by 40% during the dolly zoom
  const robotScale = baseScale * glitchScale * (1 + dollyZoomProgress * 0.4);

  // Eye Wink logic: Wink at absolute frame 327 (relative frame 217). Close for 8 frames.
  const isWinking = frame >= 217 && frame <= 225;
  const robotImageSource = isWinking ? "youtube-assets/robot-outro-wink.png" : "youtube-assets/robot-outro.png";

  const heartScale = interpolate(frame, [20, 60], [2.0, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const heartY = interpolate(frame, [20, 60], [-400, 145], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const heartOpacity = interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  const isLanded = frame >= 60;
  const pulseScale = isLanded ? 1 + 0.1 * Math.sin((frame - 60) * 0.15) : 1;
  const pulseGlow = isLanded ? 0.8 + 0.5 * Math.sin((frame - 60) * 0.15) : 0;
  const floatY = isLanded ? Math.sin((frame - 60) * 0.05) * 10 : 0;

  const maskBaseStyle: React.CSSProperties = {
    position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
    maskImage: `url(${staticFile("youtube-assets/robot-outro.png")})`,
    WebkitMaskImage: `url(${staticFile("youtube-assets/robot-outro.png")})`,
    maskSize: "contain", WebkitMaskSize: "contain",
    maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat",
    mixBlendMode: "screen",
  };

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", transform: `scale(${robotScale}) translateY(${floatY}px)` }}>
        
        {glitchIntensity > 0 && (
          <div style={{ ...maskBaseStyle, backgroundColor: "#ec4899", transform: `translateX(${jitterX}px) translateY(${jitterY}px)`, opacity: glitchIntensity * 0.7 }} />
        )}
        {glitchIntensity > 0 && (
          <div style={{ ...maskBaseStyle, backgroundColor: "#ec4899", transform: `translateX(${jitterX * 1.5}px) translateY(${jitterY * 1.2}px)`, opacity: glitchIntensity * 0.3 }} />
        )}
        {glitchIntensity > 0 && (
          <div style={{ ...maskBaseStyle, backgroundColor: "#22d3ee", transform: `translateX(${-jitterX}px) translateY(${-jitterY}px)`, opacity: glitchIntensity * 0.7 }} />
        )}
        {glitchIntensity > 0 && (
          <div style={{ ...maskBaseStyle, backgroundColor: "#22d3ee", transform: `translateX(${-jitterX * 1.5}px) translateY(${-jitterY * 1.2}px)`, opacity: glitchIntensity * 0.3 }} />
        )}

        {/* Main Base Robot */}
        <div style={{ position: "relative", width: 700, height: "auto" }}>
          <Img 
            src={staticFile(robotImageSource)} 
            style={{ width: "100%", height: "auto", opacity: baseOpacity, display: "block" }} 
          />
        </div>

        {/* Arc Reactor Heart */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          opacity: heartOpacity,
          transform: `translate(-50%, -50%) translateY(${heartY}px) scale(${heartScale * pulseScale})`,
          filter: `brightness(${isLanded ? 1.6 : 1}) drop-shadow(0px 10px 20px rgba(0,0,0,0.5))`,
        }}>
          {isLanded && (
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: 300, height: 300, borderRadius: "50%",
              background: `radial-gradient(circle, rgba(34,211,238,${pulseGlow}) 0%, rgba(236,72,153,${pulseGlow * 0.7}) 30%, transparent 70%)`,
              filter: "blur(25px)",
            }} />
          )}
          <Img src={staticFile("youtube-assets/heart-teal.png")} style={{ position: "absolute", width: 300, height: 300 }} />
          <Img src={staticFile("youtube-assets/heart-pink.png")} style={{ position: "absolute", width: 300, height: 300 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Phase 4: End Screen UI ─
const EndScreenUI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subY = spring({ frame: Math.max(0, frame), fps, config: { damping: 14, stiffness: 100 } });
  const subOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  
  const cardY = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 14, stiffness: 100 } });
  const cardOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" });

  const nameOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
  const nameScale = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 80 } });

  // Floating settle effect: floats while materializing, then locks for YouTube clickable regions
  const floatSettle = interpolate(frame, [0, 60, 90], [1, 1, 0], { extrapolateRight: "clamp" });
  const hoverRotateX = Math.sin(frame * 0.05) * 4 * floatSettle;
  const hoverRotateY = Math.cos(frame * 0.04) * 6 * floatSettle;
  const hoverTranslateZ = Math.sin(frame * 0.03) * 10 * floatSettle;

  // Fix: Round final position pixel to prevent sub-pixel text jittering
  const subTranslateY = Math.round(interpolate(subY, [0, 1], [80, 0]));
  const cardTranslateY = Math.round(interpolate(cardY, [0, 1], [80, 0]));

  return (
    <AbsoluteFill style={{ perspective: "1000px" }}>
      
      {/* Premium Clean Subscribe Circle */}
      <div style={{
        position: "absolute", top: 230, left: 180, opacity: subOpacity,
        transform: `translateY(${subTranslateY}px) rotateX(${hoverRotateX}deg) rotateY(${hoverRotateY}deg) translateZ(${hoverTranslateZ}px)`,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}>
        <div style={{
          width: 190, height: 190, borderRadius: "50%",
          backgroundColor: "rgba(10, 15, 30, 0.9)", 
          border: "3px solid #22d3ee",
          display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
          boxShadow: "0 25px 50px rgba(0,0,0,0.8), 0 0 30px rgba(34,211,238,0.3)",
          WebkitFontSmoothing: "antialiased",
        }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", letterSpacing: 1 }}>اشترك</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#22d3ee", marginTop: 4, letterSpacing: 2, textTransform: "uppercase" }}>Subscribe</div>
        </div>
      </div>

      {/* Premium Clean Watch Next Card */}
      <div style={{
        position: "absolute", top: 200, right: 150, opacity: cardOpacity,
        transform: `translateY(${cardTranslateY}px) rotateX(${-hoverRotateX}deg) rotateY(${-hoverRotateY}deg) translateZ(${-hoverTranslateZ}px)`,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}>
        <div style={{
          width: 380, height: 214, 
          borderRadius: 16,
          backgroundColor: "rgba(10, 15, 30, 0.9)",
          border: "3px solid #ec4899", 
          display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
          boxShadow: "0 25px 50px rgba(0,0,0,0.8), 0 0 30px rgba(236,72,153,0.2)",
          overflow: "hidden",
          WebkitFontSmoothing: "antialiased",
        }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", letterSpacing: 1 }}>التالي</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#ec4899", marginTop: 8, letterSpacing: 3, textTransform: "uppercase" }}>Watch Next</div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 50, left: "50%",
        transform: `translateX(-50%) scale(${interpolate(nameScale, [0, 1], [0.9, 1])})`, 
        opacity: nameOpacity, textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        <div style={{ fontSize: 52, fontWeight: 900, color: "#ffffff", letterSpacing: 2, textShadow: "0px 4px 15px rgba(0,0,0,0.9), 0 0 40px #22d3ee" }}>
          حرفين ولكن
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: 30, justifyContent: "center", transform: "scale(0.25)", transformOrigin: "top center", marginTop: -10 }}>
          <KineticText text="A.I." delay={0} color="#22d3ee" />
          <KineticText text="NEWS" delay={15} color="#f59e0b" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const OutroDollyWink: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dolly Zoom logic for background: starts scaling DOWN at frame 300
  const isDollyZoom = frame >= 300;
  const dollyZoomSpring = spring({ frame: isDollyZoom ? frame - 300 : 0, fps, config: { damping: 18, stiffness: 60 } });
  
  // Normal slow zoom from 125% to 132.5% at frame 300.
  // Then shrink back to 100% via the spring so we don't expose repeating edges
  const normalZoom = 125 + Math.min(frame, 300) * 0.025;
  const backgroundSize = interpolate(dollyZoomSpring, [0, 1], [normalZoom, 100]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#030308", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={600}>
        <AbsoluteFill style={{
          backgroundImage: `url(${staticFile("youtube-assets/bg-circuit.jpeg")})`,
          backgroundSize: `${backgroundSize}%`,
          backgroundPosition: "center",
          opacity: 0.4,
          filter: "contrast(1.2) brightness(0.8)",
        }} />
      </Sequence>

      <Sequence from={0} durationInFrames={600}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "150%", height: "150%",
          background: "radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)",
          pointerEvents: "none",
        }} />
      </Sequence>

      <Sequence from={0} durationInFrames={600}>
        <Particles count={100} seed={77} />
      </Sequence>

      <Sequence from={0} durationInFrames={120}>
        <LogoImplosion />
      </Sequence>

      <Sequence from={105} durationInFrames={25}>
        <SingularityFlash />
      </Sequence>

      <Sequence from={110} durationInFrames={490}>
        <RobotReveal />
      </Sequence>

      <Sequence from={180} durationInFrames={420}>
        <EndScreenUI />
      </Sequence>
    </AbsoluteFill>
  );
};
