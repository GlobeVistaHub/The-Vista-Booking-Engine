import React from "react";
import { AbsoluteFill, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const BrandOutroHorizontal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fast fade/blur in
  const entryBlur  = interpolate(frame, [0, 12], [50, 0], { extrapolateRight: "clamp" });
  const bgScale    = 1 + frame * 0.001;
  const tealPulse    = 0.30 + 0.20 * Math.sin(frame * 0.11);
  const magentaPulse = 0.25 + 0.20 * Math.sin(frame * 0.09 + 1.5);

  const logoSpring  = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });
  const logoScale   = interpolate(logoSpring, [0, 1], [0, 1.8]); // Scaled up for 16:9
  const logoOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const logoFloat   = Math.sin(frame * 0.1) * 8;
  const heartLeftX  = interpolate(logoSpring, [0, 1], [-200, 0]);
  const heartRightX = interpolate(logoSpring, [0, 1], [200, 0]);

  const labelStart  = 25;
  const labelSpring = spring({ frame: Math.max(0, frame - labelStart), fps, config: { damping: 11, stiffness: 100 } });
  const labelScale  = interpolate(labelSpring, [0, 1], [0.4, 1]);
  const labelOpacity = interpolate(frame, [labelStart, labelStart + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineWidth   = interpolate(frame, [35, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const slam1Start  = 45;
  const slam1Spring = spring({ frame: Math.max(0, frame - slam1Start), fps, config: { damping: 8, stiffness: 180 } });
  const slam1Y      = interpolate(slam1Spring, [0, 1], [-250, 0]);
  const slam1Scl    = interpolate(slam1Spring, [0, 1], [2.0, 1]);
  const slam1Opc    = interpolate(frame, [slam1Start, slam1Start + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const slam2Start  = 70;
  const slam2Spring = spring({ frame: Math.max(0, frame - slam2Start), fps, config: { damping: 9, stiffness: 140 } });
  const slam2X      = interpolate(slam2Spring, [0, 1], [600, 0]);
  const slam2Opc    = interpolate(frame, [slam2Start, slam2Start + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", filter: `blur(${entryBlur}px)` }}>
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile("youtube-assets/bg-circuit.jpeg")})`, backgroundSize: `cover`, backgroundPosition: "center center", transform: `scale(${bgScale})`, willChange: "transform", filter: "contrast(1.5) brightness(0.4) saturate(0.7)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 80% at 15% 50%, rgba(34,211,238,${tealPulse}) 0%, transparent 65%)`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 80% at 85% 50%, rgba(236,72,153,${magentaPulse}) 0%, transparent 65%)`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 70% at 50% 50%, transparent 30%, rgba(3,3,8,0.75) 100%)" }} />

      {/* Grid Scanlines */}
      <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 3px)", zIndex: 50 }} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
        
        {/* LOGO */}
        <div style={{ transform: `scale(${logoScale}) translateY(${logoFloat}px)`, opacity: logoOpacity, willChange: "transform", marginBottom: 50, position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle at center, rgba(34,211,238,0.3) 0%, rgba(236,72,153,0.2) 50%, transparent 80%)", filter: "blur(40px)" }} />
          <div style={{ position: "relative", width: 250, height: 250 }}>
            <img src={staticFile("youtube-assets/heart-teal.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", transform: `translateX(${heartLeftX}px)`, filter: "drop-shadow(0 0 35px rgba(34,211,238,0.7))" }} />
            <img src={staticFile("youtube-assets/heart-pink.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", transform: `translateX(${heartRightX}px)`, filter: "drop-shadow(0 0 35px rgba(236,72,153,0.7))" }} />
          </div>
        </div>

        {/* TEXT BLOCK */}
        <div style={{ transform: `scale(${labelScale})`, opacity: labelOpacity, display: "flex", flexDirection: "column", alignItems: "center", willChange: "transform", marginTop: 20 }}>
          <h1 style={{ margin: 0, fontSize: 110, fontWeight: 900, color: "#ffffff", letterSpacing: 4, fontFamily: "'Cairo', sans-serif", textShadow: "0 0 50px rgba(255,255,255,0.25), 0 10px 40px rgba(0,0,0,0.9)", direction: "rtl" }}>حرفين ولكن</h1>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: 12, textTransform: "uppercase", marginTop: 12 }}>
            <span style={{ color: "#22d3ee", textShadow: "0 0 30px rgba(34,211,238,0.8)", marginRight: 12 }}>A.I.</span>
            <span style={{ color: "#ec4899", textShadow: "0 0 30px rgba(236,72,153,0.8)" }}>NEWS</span>
          </div>
        </div>

        {/* DIVIDER LINE */}
        <div style={{ width: "60%", transform: `scaleX(${lineWidth}) translateZ(0)`, transformOrigin: "center center", willChange: "transform", backfaceVisibility: "hidden", height: 4, margin: "40px 0 35px 0", background: "linear-gradient(to right, transparent, #22d3ee, rgba(255,255,255,0.8), #ec4899, transparent)", boxShadow: "0 0 30px rgba(34,211,238,0.6), 0 0 30px rgba(236,72,153,0.6)", borderRadius: 2 }} />

        {/* SLOGAN */}
        <div style={{ transform: `translateY(${slam1Y}px) scale(${slam1Scl})`, opacity: slam1Opc, transformOrigin: "top center", willChange: "transform", backfaceVisibility: "hidden", WebkitFontSmoothing: "antialiased" }}>
          <p style={{ margin: 0, padding: 50, fontSize: 72, fontWeight: 900, color: "#ffffff", textAlign: "center", fontFamily: "'Cairo', sans-serif", textShadow: "0 0 40px rgba(236,72,153,0.6), 0 10px 40px rgba(0,0,0,0.9)", direction: "rtl" }}>الذكاء الاصطناعي بلغتنا</p>
        </div>

        {/* COPYRIGHT */}
        <div style={{ transform: `translateX(${slam2X}px)`, opacity: slam2Opc, marginTop: 30, willChange: "transform" }}>
          <p style={{ margin: 0, fontSize: 48, fontWeight: 600, color: "#A9B0B7", fontFamily: "'Cairo', sans-serif", textShadow: "0 0 15px rgba(169, 176, 183, 0.5), 0 4px 10px rgba(0,0,0,0.8)", direction: "rtl" }}>جميع الحقوق محفوظة</p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
