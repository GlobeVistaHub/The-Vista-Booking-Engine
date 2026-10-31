"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { 
  Film, 
  Layers, 
  Sparkles, 
  Sliders, 
  Eye, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink,
  Cpu,
  MonitorPlay,
  Activity,
  Play,
  RotateCw,
  Zap,
  Volume2,
  VolumeX,
  Wand2,
  Crosshair,
  Gauge,
  BarChart3,
  AlertTriangle,
  Radio,
  ArrowUp,
  Smartphone
} from "lucide-react";

interface NodeData {
  id: string;
  name: string;
  category: "input" | "color" | "optical" | "tracking" | "composite" | "output";
  role: string;
  whyAILacksThis: string;
  clientROI: string;
  status: string;
  ireLevel: string;
  x: number;
  y: number;
  scopeProfile: {
    saturation: string;
    statusText: string;
    isLegal: boolean;
    lumaPeak: string;
    blackFloor: string;
    activeTargets: string[];
    tracePath: string;
    redIRE: number;
    greenIRE: number;
    blueIRE: number;
  };
}

const FUSION_NODES: NodeData[] = [
  {
    id: "MediaIn1",
    name: "MediaIn 1 [AI Diffusion]",
    category: "input",
    role: "Ingests raw high-resolution diffusion passes with strict seed & character prompt adherence.",
    whyAILacksThis: "Raw AI generation has plastic skin texture, digital edge artifacts, and zero physical lens physics.",
    clientROI: "Allows rapid conceptual generation at 10% the cost of practical production filming.",
    status: "100% RAW PASS",
    ireLevel: "0 - 100 IRE",
    x: 40,
    y: 85,
    scopeProfile: {
      saturation: "118.4%",
      statusText: "NON-LEGAL CHROMA CLIPPING",
      isLegal: false,
      lumaPeak: "109 IRE (CLIPPING)",
      blackFloor: "0.0 IRE (CRUSHED)",
      activeTargets: ["R", "B", "Mg"],
      tracePath: "M 95 105 Q 60 70 35 45 Q 65 30 110 50 Q 170 65 160 140 Q 120 170 75 145 Z",
      redIRE: 98,
      greenIRE: 65,
      blueIRE: 95
    }
  },
  {
    id: "BrightnessContrast1",
    name: "BrightnessContrast 1",
    category: "color",
    role: "Compresses hyper-blown digital highlights and recovers shadow detail into a cinema-grade Log curve.",
    whyAILacksThis: "Standard AI outputs suffer from crushed blacks and oversaturated neon highlights.",
    clientROI: "Guarantees broadcast compliance for commercial television and premium streaming specs.",
    status: "LOG COMPRESSION",
    ireLevel: "18% MID-GREY",
    x: 230,
    y: 85,
    scopeProfile: {
      saturation: "28.5%",
      statusText: "LOG S-CURVE COMPRESSION",
      isLegal: true,
      lumaPeak: "72 IRE (EXPANDABLE)",
      blackFloor: "12 IRE (PROTECTED)",
      activeTargets: [],
      tracePath: "M 98 102 Q 90 92 85 88 Q 95 85 105 90 Q 112 95 110 108 Q 105 112 98 102 Z",
      redIRE: 55,
      greenIRE: 52,
      blueIRE: 50
    }
  },
  {
    id: "LumaKeyer1",
    name: "LumaKeyer 1 [Highlight Isolation]",
    category: "optical",
    role: "Separates luminance highlights (>85 IRE) to generate organic light-bleed around subjects.",
    whyAILacksThis: "Without highlight isolation, digital lighting feels 'pasted on' rather than emanating from the scene.",
    clientROI: "Creates subconscious viewer belief that physical light sources genuinely exist in the room.",
    status: "LUMA ISOLATION",
    ireLevel: ">85 IRE",
    x: 420,
    y: 35,
    scopeProfile: {
      saturation: "34.0%",
      statusText: "HIGHLIGHT LUMA ISOLATION",
      isLegal: true,
      lumaPeak: "89 IRE (ISOLATED)",
      blackFloor: "0.0 IRE",
      activeTargets: ["Yl", "R"],
      tracePath: "M 97 103 Q 92 80 88 55 Q 102 50 112 60 Q 118 78 108 104 Z",
      redIRE: 88,
      greenIRE: 82,
      blueIRE: 60
    }
  },
  {
    id: "ColorCorrector1",
    name: "ColorCorrector 1 [Film Print LUT]",
    category: "color",
    role: "Applies custom Kodak 2383 density curves, shifting highlights into warm amber and shadows into deep teal.",
    whyAILacksThis: "Stock AI color palettes look like generic video-game graphics without film stock chemistry.",
    clientROI: "Instantly communicates luxury prestige and cinematic production value to high-net-worth buyers.",
    status: "KODAK 2383 MATRIX",
    ireLevel: "DCI-P3 GAMUT",
    x: 420,
    y: 135,
    scopeProfile: {
      saturation: "68.2%",
      statusText: "KODAK 2383 TEAL/AMBER SPLIT",
      isLegal: true,
      lumaPeak: "94 IRE",
      blackFloor: "4.5 IRE",
      activeTargets: ["R", "Yl", "Cy"],
      tracePath: "M 96 104 Q 80 82 55 60 Q 75 65 95 85 Q 120 115 145 135 Q 125 130 96 104 Z",
      redIRE: 78,
      greenIRE: 60,
      blueIRE: 72
    }
  },
  {
    id: "SoftGlow1",
    name: "SoftGlow 1 [Anamorphic Halation]",
    category: "optical",
    role: "Simulates optical light halation where intense photons bleed across camera sensor photodiode wells.",
    whyAILacksThis: "AI generators produce razor-sharp, sterile pixel edges that immediately register as fake.",
    clientROI: "Softens digital edges into authentic cinema glass, eliminating viewer skepticism.",
    status: "HALATION ACTIVE",
    ireLevel: "RED-FRINGE 650nm",
    x: 610,
    y: 35,
    scopeProfile: {
      saturation: "74.5%",
      statusText: "650nm RED OPTICAL HALATION",
      isLegal: true,
      lumaPeak: "96 IRE",
      blackFloor: "5.0 IRE",
      activeTargets: ["R", "Mg"],
      tracePath: "M 95 105 Q 75 75 42 58 Q 68 50 92 78 Q 112 90 120 108 Q 105 118 95 105 Z",
      redIRE: 92,
      greenIRE: 64,
      blueIRE: 58
    }
  },
  {
    id: "FilmGrain1",
    name: "FilmGrain 1 [35mm Photochemical]",
    category: "optical",
    role: "Synthesizes randomized silver-halide organic grain clusters responding non-linearly to luminance.",
    whyAILacksThis: "AI videos have static digital noise or unnatural digital smoothing during motion.",
    clientROI: "Binds CGI/AI composite layers into a unified cinematic photographic texture.",
    status: "35MM 500T GRAIN",
    ireLevel: "ORGANIC DITHER",
    x: 610,
    y: 135,
    scopeProfile: {
      saturation: "56.8%",
      statusText: "35MM SILVER-HALIDE DITHER",
      isLegal: true,
      lumaPeak: "95 IRE",
      blackFloor: "6.2 IRE",
      activeTargets: ["Cy", "Yl"],
      tracePath: "M 94 106 Q 84 88 72 78 Q 90 74 104 84 Q 124 96 116 112 Q 102 116 94 106 Z",
      redIRE: 70,
      greenIRE: 68,
      blueIRE: 69
    }
  },
  {
    id: "LensDistort1",
    name: "LensDistort 1 [Anamorphic Barrel]",
    category: "optical",
    role: "Adds subtle 1.33x horizontal optical squeeze and radial barrel chromatic aberration at edge boundaries.",
    whyAILacksThis: "AI images are rendered mathematically flat with zero physical optical aberration.",
    clientROI: "Replicates high-end Master Anamorphic glass ($45,000 lenses) on a fractional digital budget.",
    status: "BARREL CHROMATIC",
    ireLevel: "0.015 SQUEEZE",
    x: 800,
    y: 35,
    scopeProfile: {
      saturation: "62.0%",
      statusText: "1.33x ANAMORPHIC GLASS SQUEEZE",
      isLegal: true,
      lumaPeak: "95 IRE",
      blackFloor: "5.5 IRE",
      activeTargets: ["B", "Cy"],
      tracePath: "M 92 108 Q 78 95 65 92 Q 85 80 110 82 Q 135 90 130 112 Q 110 118 92 108 Z",
      redIRE: 68,
      greenIRE: 65,
      blueIRE: 76
    }
  },
  {
    id: "PlanarTracker1",
    name: "PlanarTracker 1 [Sub-Pixel Track]",
    category: "tracking",
    role: "Locks UI graphics, brand logos, or replacement textures to surface geometry in perspective 3D space.",
    whyAILacksThis: "AI cannot naturally composite client trademarks onto shifting fabric or curved glass without drifting.",
    clientROI: "Enables flawless client product placement and hyper-accurate brand identity compliance.",
    status: "SURFACE LOCK 99.8%",
    ireLevel: "6-DOF PERSPECTIVE",
    x: 800,
    y: 135,
    scopeProfile: {
      saturation: "54.2%",
      statusText: "6-DOF 0.02px SUB-PIXEL LOCK",
      isLegal: true,
      lumaPeak: "93 IRE",
      blackFloor: "5.0 IRE",
      activeTargets: ["G", "Cy"],
      tracePath: "M 96 104 Q 88 92 80 85 Q 100 82 110 88 Q 118 98 112 110 Q 104 112 96 104 Z",
      redIRE: 66,
      greenIRE: 74,
      blueIRE: 68
    }
  },
  {
    id: "Polygon1",
    name: "Polygon 1 [Power Window Alpha]",
    category: "composite",
    role: "Feathered Bezier masks isolating actor faces and commercial focal points for localized exposure enhancement.",
    whyAILacksThis: "Generic prompt modifications alter the entire frame, destroying composition consistency.",
    clientROI: "Maintains absolute editorial control over lighting emphasis, directing viewer gaze directly to the CTA.",
    status: "FEATHERED ALPHA",
    ireLevel: "64-PT BEZIER",
    x: 990,
    y: 85,
    scopeProfile: {
      saturation: "59.4%",
      statusText: "FEATHERED POWER WINDOW MASK",
      isLegal: true,
      lumaPeak: "97 IRE",
      blackFloor: "4.8 IRE",
      activeTargets: ["R", "Yl"],
      tracePath: "M 95 105 Q 82 85 68 70 Q 92 68 112 80 Q 128 100 115 115 Q 102 118 95 105 Z",
      redIRE: 82,
      greenIRE: 70,
      blueIRE: 62
    }
  },
  {
    id: "MediaOut1",
    name: "MediaOut 1 [ProRes 4444 XQ / 4K]",
    category: "output",
    role: "Delivers 12-bit RGB 4:4:4 master stream formatted for global broadcast and digital cinema distribution.",
    whyAILacksThis: "Standard AI downloads are 8-bit compressed H.264 MP4s riddled with compression macroblocking.",
    clientROI: "Gives clients pristine broadcast-grade assets that never degrade on 85-inch 4K HDR displays.",
    status: "PRORES 4444 MASTER",
    ireLevel: "REC.2020 HDR",
    x: 1180,
    y: 85,
    scopeProfile: {
      saturation: "74.9%",
      statusText: "100% EBU R103 / REC.709 LEGAL",
      isLegal: true,
      lumaPeak: "95.0 IRE (LEGAL)",
      blackFloor: "5.0 IRE (LEGAL)",
      activeTargets: ["R", "Mg", "B", "Cy", "G", "Yl"],
      tracePath: "M 96 104 Q 72 82 50 65 Q 70 55 96 75 Q 128 85 142 125 Q 118 135 96 104 Z",
      redIRE: 80,
      greenIRE: 72,
      blueIRE: 75
    }
  }
];

// Node Connections for SVG Bezier cables
const NODE_EDGES = [
  { from: "MediaIn1", to: "BrightnessContrast1" },
  { from: "BrightnessContrast1", to: "LumaKeyer1" },
  { from: "BrightnessContrast1", to: "ColorCorrector1" },
  { from: "LumaKeyer1", to: "SoftGlow1" },
  { from: "ColorCorrector1", to: "FilmGrain1" },
  { from: "SoftGlow1", to: "LensDistort1" },
  { from: "FilmGrain1", to: "PlanarTracker1" },
  { from: "LensDistort1", to: "Polygon1" },
  { from: "PlanarTracker1", to: "Polygon1" },
  { from: "Polygon1", to: "MediaOut1" },
];

// Kinetic text animation variants
const kineticText: any = {
  hidden: { opacity: 0, rotateX: -90, y: 50 },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: { type: "spring", damping: 15, stiffness: 100 }
  }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

// Cinematic Anamorphic Optical Flare & Bokeh Horizon (Touch & Cursor Reactive)
function AnamorphicOpticalHorizon() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Motion physics spring for silky responsive glint tracking
  const rawX = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 180, damping: 22, mass: 0.5 });
  const bloomX = useTransform(springX, (v) => v * 0.65);

  // Parallax transforms for the 6 bokeh motes
  const mote0X = useTransform(springX, (v) => v * 0.22);
  const mote1X = useTransform(springX, (v) => v * 0.38);
  const mote2X = useTransform(springX, (v) => v * 0.16);
  const mote3X = useTransform(springX, (v) => v * 0.42);
  const mote4X = useTransform(springX, (v) => v * 0.28);
  const mote5X = useTransform(springX, (v) => v * 0.34);
  const moteTransforms = [mote0X, mote1X, mote2X, mote3X, mote4X, mote5X];

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const maxRange = rect.width * 0.44;
    const clampedX = Math.max(-maxRange, Math.min(maxRange, relX));
    rawX.set(clampedX);
    setIsInteracting(true);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    handlePointerMove(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    rawX.set(0);
    setIsInteracting(false);
  };

  const handlePointerLeave = () => {
    rawX.set(0);
    setIsInteracting(false);
  };

  return (
    <div 
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      className="relative my-7 sm:my-9 max-w-2xl mx-auto flex flex-col items-center justify-center select-none group cursor-ew-resize touch-pan-y py-4 px-2"
    >
      {/* 1. Ambient Volumetric Lens Bloom (Behind Streak - Broad, Silky, Natural, Tracks Pointer) */}
      <motion.div 
        style={{ x: bloomX }}
        className="absolute w-3/4 h-12 bg-gradient-to-r from-transparent via-[#00C2D4]/15 to-transparent blur-2xl pointer-events-none -top-6" 
      />
      <motion.div 
        style={{ x: bloomX }}
        className="absolute w-1/2 h-8 bg-gradient-to-r from-transparent via-[#FF6600]/10 to-transparent blur-lg pointer-events-none -top-4" 
      />

      {/* 2. Horizontal Anamorphic Flare Streak Beam */}
      <div className="relative w-full flex items-center justify-center pointer-events-none">
        {/* Outer Tapering Flare Horizon */}
        <motion.div 
          animate={{ opacity: isInteracting ? 0.9 : [0.45, 0.75, 0.45], scaleX: [0.97, 1.03, 0.97] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#00C2D4]/50 via-white/60 to-transparent" 
        />

        {/* High-Intensity Core Laser Beam (Softened falloff, silky optical glow) */}
        <motion.div
          animate={{ opacity: isInteracting ? 1 : [0.6, 0.85, 0.6], width: isInteracting ? "70%" : ["45%", "60%", "45%"] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-[1.5px] bg-gradient-to-r from-transparent via-[#00C2D4]/80 via-white/90 to-transparent filter drop-shadow-[0_0_8px_rgba(0,194,212,0.6)]"
        />

        {/* 3. Central Optical Aperture Star & Diamond Glint (Smoothly tracks cursor/finger via springX) */}
        <motion.div 
          style={{ x: springX }}
          className="absolute flex items-center justify-center"
        >
          {/* Subtle Precision Lens Reticle */}
          <div className="absolute w-6 h-[1px] bg-white/40 pointer-events-none" />
          <div className="absolute h-3 w-[1px] bg-white/40 pointer-events-none" />

          {/* 4-Point Cinema Diamond Star Flare (Softened opacity & diffused drop shadow) */}
          <motion.svg
            viewBox="0 0 24 24"
            className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 filter drop-shadow-[0_0_6px_rgba(0,194,212,0.7)] pointer-events-none"
            animate={{ 
              scale: isInteracting ? 1.25 : [0.85, 1.15, 0.85], 
              rotate: [0, 90, 0] 
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M 12 0 Q 12 12 24 12 Q 12 12 12 24 Q 12 12 0 12 Q 12 12 12 0 Z"
              fill="#FFFFFF"
              fillOpacity="0.85"
            />
          </motion.svg>

          {/* Core White Photon Point (Gentle blur so it's not razor-sharp) */}
          <div className="w-1.5 h-1.5 rounded-full bg-white/90 blur-[0.4px] filter drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" />

          {/* Chromatic Red/Amber Halation Edge (Soft optical dispersion) */}
          <motion.div
            animate={{ scale: isInteracting ? 1.5 : [1, 1.4, 1], opacity: isInteracting ? 0.6 : [0.25, 0.55, 0.25] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-[#00C2D4]/25 via-white/15 to-[#FF6600]/25 blur-[3px] pointer-events-none"
          />
        </motion.div>
      </div>

      {/* 4. Film Optics Demarcation (Lowered with mt-5, boosted size for crisp desktop & mobile legibility) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 sm:mt-5 flex items-center justify-center flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-[11.5px] font-mono font-medium tracking-[0.18em] sm:tracking-[0.24em] uppercase text-white/80 pointer-events-none"
      >
        <span className="text-[#00C2D4] font-bold">2.39:1</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#00C2D4]/40" />
        <span className="text-white/90 font-semibold tracking-wider">1.33x ANAMORPHIC OPTICAL FLARE</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6600]/40" />
        <span className="text-[#FF6600] font-bold">650nm HALATION</span>
      </motion.div>

      {/* 5. Interactive Scrubber Indicator Badge (High contrast & crystal-clear readability on mobile) */}
      <div className="mt-2.5 px-3.5 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono tracking-wider uppercase text-white/90 shadow-[0_0_15px_rgba(0,194,212,0.15)] pointer-events-none transition-all">
        <span className={`w-2 h-2 rounded-full shrink-0 ${isInteracting ? "bg-[#FF6600] animate-ping" : "bg-[#00C2D4] animate-pulse"}`} />
        <span className={isInteracting ? "text-[#FF6600] font-bold" : "text-[#00C2D4] font-bold"}>
          {isInteracting ? "OPTICAL FLARE DEFLECTING" : "SCRUB WITH CURSOR OR TOUCH TO DEFLECT FLARE"}
        </span>
      </div>

      {/* 6. Cinematic Floating Bokeh Motes / Dust Light Particles (With Parallax Cursor/Finger Deflection) */}
      <div className="absolute inset-x-0 -top-6 -bottom-6 pointer-events-none overflow-visible">
        {[
          { x: "16%", y: "25%", size: 3, delay: 0, color: "#00C2D4" },
          { x: "26%", y: "75%", size: 2, delay: 0.8, color: "#FFFFFF" },
          { x: "38%", y: "20%", size: 2.5, delay: 1.4, color: "#00C2D4" },
          { x: "62%", y: "80%", size: 2, delay: 0.5, color: "#FF6600" },
          { x: "74%", y: "30%", size: 3, delay: 1.9, color: "#00C2D4" },
          { x: "85%", y: "70%", size: 2, delay: 1.1, color: "#FFFFFF" },
        ].map((mote, i) => (
          <motion.div
            key={`mote-${i}`}
            className="absolute rounded-full"
            style={{
              left: mote.x,
              top: mote.y,
              width: `${mote.size}px`,
              height: `${mote.size}px`,
              backgroundColor: mote.color,
              boxShadow: `0 0 8px ${mote.color}`,
              x: moteTransforms[i]
            }}
            animate={{
              y: [0, -12, 0],
              opacity: [0.15, 0.75, 0.15]
            }}
            transition={{
              duration: 3.2 + (i * 0.4),
              repeat: Infinity,
              delay: mote.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}


function FrequencyVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDucked, setIsDucked] = useState(false);
  const [frequencies, setFrequencies] = useState<number[]>([12, 18, 10, 22, 16, 8, 14, 24, 18, 11, 16, 22, 13, 17, 25, 14, 19, 8, 20, 15]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const wasPlayingBeforeVideoRef = useRef(false);

  // Toggle Background Audio & initialize Web Audio API FFT analyzer
  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64; // 32 frequency bins
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(ctx.destination);
        sourceRef.current = source;
      }

      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsDucked(false);
        wasPlayingBeforeVideoRef.current = false;
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        setIsDucked(false);
        wasPlayingBeforeVideoRef.current = true;
      }
    } catch (e) {
      console.warn('Web Audio playback notice:', e);
    }
  };

  // Real-time FFT Frequency Spectrum Loop
  useEffect(() => {
    if (!isPlaying || !analyserRef.current) {
      // Idle ambient breathing animation when not playing
      const idleInterval = setInterval(() => {
        setFrequencies(prev => prev.map((h, i) => Math.max(6, Math.min(22, Math.sin(Date.now() / 600 + i) * 6 + 12))));
      }, 100);
      return () => clearInterval(idleInterval);
    }

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateSpectrum = () => {
      analyser.getByteFrequencyData(dataArray);
      
      const newHeights = [];
      for (let i = 0; i < 20; i++) {
        const binIndex = Math.floor((i / 20) * (bufferLength - 4));
        const val = dataArray[binIndex] || 0;
        // Map 0-255 amplitude to 6px - 28px height
        const height = Math.max(6, Math.min(28, (val / 255) * 28));
        newHeights.push(height);
      }
      setFrequencies(newHeights);
      animationFrameRef.current = requestAnimationFrame(updateSpectrum);
    };

    animationFrameRef.current = requestAnimationFrame(updateSpectrum);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  // Global Concurrency Relay: Automatically pause/duck when any video starts playing
  useEffect(() => {
    const handleVideoPlay = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsDucked(true);
        setIsPlaying(false);
      }
    };

    const handleVideoPause = () => {
      if (wasPlayingBeforeVideoRef.current && audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsDucked(false);
          setIsPlaying(true);
        }).catch(() => {});
      }
    };

    // Listen for YouTube iframe state changes via postMessage
    const handleWindowMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.event === 'onStateChange') {
          // YT.PlayerState.PLAYING === 1
          if (data.info === 1) {
            handleVideoPlay();
          }
          // YT.PlayerState.PAUSED === 2 || ENDED === 0
          else if (data.info === 2 || data.info === 0) {
            handleVideoPause();
          }
        }
      } catch (e) {
        // Not a JSON message, safely ignore
      }
    };

    document.addEventListener('play', handleVideoPlay, true);
    document.addEventListener('pause', handleVideoPause, true);
    document.addEventListener('ended', handleVideoPause, true);
    window.addEventListener('message', handleWindowMessage);

    return () => {
      document.removeEventListener('play', handleVideoPlay, true);
      document.removeEventListener('pause', handleVideoPause, true);
      document.removeEventListener('ended', handleVideoPause, true);
      window.removeEventListener('message', handleWindowMessage);
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <audio ref={audioRef} src="/studio-audio.mp3" loop preload="metadata" />

      {/* Interactive Sound Engine Toggle */}
      <button
        onClick={togglePlay}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300 ${
          isPlaying
            ? 'bg-[#00C2D4]/20 border-[#00C2D4] text-[#00C2D4] shadow-[0_0_18px_rgba(0,194,212,0.4)]'
            : isDucked
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
            : 'bg-black/60 border-white/15 text-white/70 hover:text-white hover:border-white/30'
        }`}
        title={isPlaying ? 'Mute Studio Audio' : 'Start 48kHz DSP Studio Audio'}
      >
        {isPlaying ? (
          <Volume2 size={13} className="text-[#00C2D4] animate-pulse" />
        ) : isDucked ? (
          <VolumeX size={13} className="text-amber-400" />
        ) : (
          <VolumeX size={13} className="text-white/40" />
        )}
        <span className="font-bold tracking-wider text-[10px] sm:text-[11px]">
          {isPlaying ? 'DSP LIVE' : isDucked ? 'AUTO-DUCKED' : 'STUDIO AUDIO'}
        </span>
      </button>

      {/* Real-time Frequency Spectrum Bars */}
      <div 
        onClick={togglePlay}
        className="flex items-end gap-[3px] h-7 px-2.5 py-1 bg-black/60 border border-white/15 rounded-lg cursor-pointer hover:border-[#00C2D4]/50 transition-all"
        title="Click to toggle DSP Audio Engine"
      >
        {frequencies.map((h, i) => (
          <div
            key={i}
            className={`w-[2.5px] rounded-t-sm transition-all duration-75 ${
              isPlaying
                ? i % 2 === 0
                  ? 'bg-[#00C2D4] shadow-[0_0_8px_rgba(0,194,212,0.8)]'
                  : 'bg-[#FF2E93] shadow-[0_0_8px_rgba(255,46,147,0.8)]'
                : 'bg-white/25'
            }`}
            style={{ height: `${h}px` }}
          />
        ))}
        <span className="text-[10px] font-mono text-white/50 ml-1.5 uppercase hidden xl:inline">
          {isPlaying ? '48kHz DSP' : '32-Bit Float'}
        </span>
      </div>
    </div>
  );
}

// Live Interactive Reactive Vectorscope & RGB Parade Inspector
interface ScopeProps {
  node: NodeData;
}

function OpticalScopeInspector({ node }: ScopeProps) {
  const [scopeMode, setScopeMode] = useState<"vectorscope" | "rgbParade">("vectorscope");
  const p = node.scopeProfile;

  return (
    <div className={`p-5 rounded-3xl bg-[#090909] border transition-all duration-300 relative overflow-hidden shadow-2xl ${
      p.isLegal ? "border-[#00C2D4]/30" : "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
    }`}>
      
      {/* Scope Header & Mode Switcher */}
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Crosshair size={14} className={p.isLegal ? "text-[#00C2D4]" : "text-red-400 animate-pulse"} />
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-white">
            OPTICAL SCOPE
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-[10px] font-mono">
          <button
            onClick={() => setScopeMode("vectorscope")}
            className={`px-2 py-0.5 rounded transition-all ${
              scopeMode === "vectorscope" ? "bg-[#00C2D4] text-black font-bold" : "text-white/60 hover:text-white"
            }`}
          >
            VECTORSCOPE
          </button>
          <button
            onClick={() => setScopeMode("rgbParade")}
            className={`px-2 py-0.5 rounded transition-all ${
              scopeMode === "rgbParade" ? "bg-[#00C2D4] text-black font-bold" : "text-white/60 hover:text-white"
            }`}
          >
            RGB PARADE
          </button>
        </div>
      </div>

      {/* Scope Status Banner */}
      <div className={`mb-4 px-3 py-1.5 rounded-xl border flex items-center justify-between text-[10px] font-mono font-bold ${
        p.isLegal 
          ? "bg-[#00C2D4]/10 border-[#00C2D4]/30 text-[#00C2D4]" 
          : "bg-red-500/15 border-red-500/40 text-red-400"
      }`}>
        <span className="flex items-center gap-1.5">
          {!p.isLegal && <AlertTriangle size={12} className="animate-bounce" />}
          {p.statusText}
        </span>
        <span>SAT: {p.saturation}</span>
      </div>

      {/* Scope Mode 1: Dynamic Vectorscope with Node-Reactive Trace */}
      {scopeMode === "vectorscope" ? (
        <div className="relative w-full aspect-square max-w-[210px] mx-auto flex items-center justify-center my-2">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Circular Graticule Rings */}
            <circle cx="100" cy="100" r="92" fill="none" stroke="#222" strokeWidth="1" />
            <circle cx="100" cy="100" r="67" fill="none" stroke="#00C2D4" strokeOpacity="0.25" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="35" fill="none" stroke="#333" strokeWidth="1" />

            {/* Crosshairs */}
            <line x1="8" y1="100" x2="192" y2="100" stroke="#222" strokeWidth="1" />
            <line x1="100" y1="8" x2="100" y2="192" stroke="#222" strokeWidth="1" />

            {/* Skin Tone Indicator Line (I-Bar) */}
            <line x1="100" y1="100" x2="45" y2="45" stroke="#FF6600" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x="32" y="38" fill="#FF6600" fontSize="7" fontFamily="monospace">I-SKIN</text>

            {/* Target Boxes (R, Mg, B, Cy, G, Yl) - Dynamic Glow on Target Hit */}
            {[
              { id: "R", x: 45, y: 70, color: "#FF4444" },
              { id: "Mg", x: 70, y: 45, color: "#E6007A" },
              { id: "B", x: 145, y: 70, color: "#0066FF" },
              { id: "Cy", x: 145, y: 125, color: "#00C2D4" },
              { id: "G", x: 70, y: 145, color: "#00FF66" },
              { id: "Yl", x: 45, y: 125, color: "#FFCC00" }
            ].map((target) => {
              const isHit = p.activeTargets.includes(target.id);
              return (
                <g key={target.id}>
                  <rect
                    x={target.x}
                    y={target.y}
                    width="10"
                    height="10"
                    fill={isHit ? target.color : "none"}
                    fillOpacity={isHit ? 0.4 : 0}
                    stroke={target.color}
                    strokeWidth={isHit ? 1.8 : 0.8}
                    className={isHit ? "filter drop-shadow-[0_0_6px_currentColor]" : ""}
                  />
                  <text
                    x={target.x > 100 ? target.x + 13 : target.x - 10}
                    y={target.y + 8}
                    fill={isHit ? target.color : "#666"}
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight={isHit ? "bold" : "normal"}
                  >
                    {target.id}
                  </text>
                </g>
              );
            })}

            {/* Dynamic Node-Specific Chroma Cloud Path */}
            <motion.path
              key={node.id}
              d={p.tracePath}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              fill={p.isLegal ? "#00C2D4" : "#EF4444"}
              fillOpacity={p.isLegal ? 0.35 : 0.55}
              stroke={p.isLegal ? "#00C2D4" : "#EF4444"}
              strokeWidth="2"
            />
          </svg>
        </div>
      ) : (
        /* Scope Mode 2: RGB Waveform Parade */
        <div className="h-[200px] flex items-end justify-between gap-3 px-3 py-2 bg-black/60 rounded-xl border border-white/10 my-2">
          {/* Red Channel */}
          <div className="flex-1 flex flex-col items-center h-full justify-between">
            <span className="text-[9px] font-mono text-red-400 font-bold">R CHANNEL</span>
            <div className="w-full flex-1 flex items-end justify-center px-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${p.redIRE}%` }}
                transition={{ duration: 0.4 }}
                className="w-full bg-gradient-to-t from-red-950 to-red-500 rounded-t-sm relative shadow-[0_0_15px_rgba(239,68,68,0.5)]"
              >
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-red-300">
                  {p.redIRE}%
                </span>
              </motion.div>
            </div>
            <span className="text-[8px] font-mono text-white/30">0-100 IRE</span>
          </div>

          {/* Green Channel */}
          <div className="flex-1 flex flex-col items-center h-full justify-between">
            <span className="text-[9px] font-mono text-green-400 font-bold">G CHANNEL</span>
            <div className="w-full flex-1 flex items-end justify-center px-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${p.greenIRE}%` }}
                transition={{ duration: 0.4 }}
                className="w-full bg-gradient-to-t from-green-950 to-green-500 rounded-t-sm relative shadow-[0_0_15px_rgba(34,197,94,0.5)]"
              >
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-green-300">
                  {p.greenIRE}%
                </span>
              </motion.div>
            </div>
            <span className="text-[8px] font-mono text-white/30">0-100 IRE</span>
          </div>

          {/* Blue Channel */}
          <div className="flex-1 flex flex-col items-center h-full justify-between">
            <span className="text-[9px] font-mono text-blue-400 font-bold">B CHANNEL</span>
            <div className="w-full flex-1 flex items-end justify-center px-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${p.blueIRE}%` }}
                transition={{ duration: 0.4 }}
                className="w-full bg-gradient-to-t from-blue-950 to-blue-500 rounded-t-sm relative shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              >
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-blue-300">
                  {p.blueIRE}%
                </span>
              </motion.div>
            </div>
            <span className="text-[8px] font-mono text-white/30">0-100 IRE</span>
          </div>
        </div>
      )}

      {/* Scope Footer Telemetry */}
      <div className="grid grid-cols-2 gap-2 text-[9px] font-mono pt-3 border-t border-white/10 text-white/60">
        <div>PEAK: <span className="text-white font-bold">{p.lumaPeak}</span></div>
        <div>BLACK: <span className="text-white font-bold">{p.blackFloor}</span></div>
      </div>

    </div>
  );
}

// ================= FAIRLIGHT AUDIO PIPELINE DATA & COMPONENTS =================

interface EQBand {
  id: number;
  name: string;
  type: "HPF" | "Bell" | "Notch" | "HighShelf" | "DeEsser";
  freq: string;
  gain: string;
  q: string;
  cx: number;
  cy: number;
  role: string;
  whyAILacksThis: string;
  clientROI: string;
  fairlightModule: string;
  curvePath: string;
  fillPath: string;
  telemetryNote: string;
}

const FLAT_BYPASS_PATH = "M 0 110 C 60 110 70 110 85 110 C 130 110 160 110 195 110 C 230 110 270 110 310 110 C 350 110 380 110 415 110 C 450 110 470 110 495 110 C 515 110 530 110 550 110 C 570 110 590 110 600 110";
const FLAT_BYPASS_FILL = "M 0 110 C 60 110 70 110 85 110 C 130 110 160 110 195 110 C 230 110 270 110 310 110 C 350 110 380 110 415 110 C 450 110 470 110 495 110 C 515 110 530 110 550 110 C 570 110 590 110 600 110 L 600 110 L 0 110 Z";

const EQ_RTA_BARS = [
  { x: 28, width: 9, baseY: 178, height: 16 },
  { x: 46, width: 9, baseY: 172, height: 24 },
  { x: 64, width: 9, baseY: 164, height: 36 },
  { x: 82, width: 9, baseY: 156, height: 48 },
  { x: 100, width: 9, baseY: 150, height: 58 },
  { x: 118, width: 9, baseY: 145, height: 68 },
  { x: 136, width: 9, baseY: 140, height: 76 },
  { x: 154, width: 9, baseY: 136, height: 84 },
  { x: 172, width: 9, baseY: 132, height: 92 },
  { x: 190, width: 9, baseY: 128, height: 96 }, // 420Hz mud region
  { x: 208, width: 9, baseY: 134, height: 86 },
  { x: 226, width: 9, baseY: 138, height: 80 },
  { x: 244, width: 9, baseY: 142, height: 72 },
  { x: 262, width: 9, baseY: 146, height: 66 },
  { x: 280, width: 9, baseY: 142, height: 74 },
  { x: 298, width: 9, baseY: 137, height: 82 },
  { x: 316, width: 9, baseY: 132, height: 89 },
  { x: 334, width: 9, baseY: 127, height: 94 },
  { x: 352, width: 9, baseY: 124, height: 90 },
  { x: 370, width: 9, baseY: 120, height: 86 },
  { x: 388, width: 9, baseY: 116, height: 92 },
  { x: 406, width: 9, baseY: 110, height: 102 }, // 3.4kHz dialogue presence region
  { x: 424, width: 9, baseY: 118, height: 90 },
  { x: 442, width: 9, baseY: 126, height: 78 },
  { x: 460, width: 9, baseY: 134, height: 70 },
  { x: 478, width: 9, baseY: 140, height: 64 },
  { x: 496, width: 9, baseY: 146, height: 56 }, // 7.2kHz sibilance region
  { x: 514, width: 9, baseY: 150, height: 48 },
  { x: 532, width: 9, baseY: 156, height: 40 },
  { x: 550, width: 9, baseY: 160, height: 34 },
  { x: 568, width: 9, baseY: 166, height: 26 }
];

const FAIRLIGHT_EQ_BANDS: EQBand[] = [
  {
    id: 1,
    name: "Band 1: High-Pass Filter (HPF)",
    type: "HPF",
    freq: "80 Hz",
    gain: "-18 dB/oct",
    q: "0.71 (Butterworth)",
    cx: 80,
    cy: 165,
    role: "Sub-bass roll-off eliminating non-musical infrasonic mud, microphone wind rumble, and AI generator low-frequency artifacts.",
    whyAILacksThis: "Generative voice and ambient sound engines produce unnatural sub-40Hz DC rumble that distorts smartphone speakers and car subwoofers.",
    clientROI: "Prevents blown speaker distortion; maximizes acoustic headroom so master sounds louder and punchier at equal volume.",
    fairlightModule: "Fairlight Channel HPF Filter",
    curvePath: "M 0 215 C 30 215 55 200 80 165 C 115 130 160 120 195 148 C 230 148 270 110 310 125 C 350 120 380 90 415 82 C 450 78 470 110 495 138 C 515 125 530 90 550 86 C 570 84 590 85 600 85",
    fillPath: "M 0 215 C 30 215 55 200 80 165 C 115 130 160 120 195 148 C 230 148 270 110 310 125 C 350 120 380 90 415 82 C 450 78 470 110 495 138 C 515 125 530 90 550 86 C 570 84 590 85 600 85 L 600 110 L 0 110 Z",
    telemetryNote: "SUB-BASS HPF ACTIVE: Infrasonic DC mud rolled off (-18dB/oct at 80Hz)"
  },
  {
    id: 2,
    name: "Band 2: Low-Mid Resonant Scoop",
    type: "Notch",
    freq: "420 Hz",
    gain: "-4.8 dB",
    q: "3.4 (Surgical)",
    cx: 195,
    cy: 148,
    role: "Deep surgical attenuation of the synthetic 'cardboard box' resonance inherent in generative neural speech models.",
    whyAILacksThis: "AI voice clones and diffusion ambiances exhibit severe 350-500Hz algorithmic boxiness that instantly flags the commercial as amateur or fake.",
    clientROI: "Transforms hollow, robotic AI voiceovers into intimate, warm, physical studio-recorded vocal tracks.",
    fairlightModule: "Fairlight 6-Band Parametric EQ",
    curvePath: "M 0 200 C 60 195 70 170 85 140 C 130 115 155 110 195 168 C 235 168 270 110 310 125 C 350 120 380 90 415 82 C 450 78 470 110 495 138 C 515 125 530 90 550 86 C 570 84 590 85 600 85",
    fillPath: "M 0 200 C 60 195 70 170 85 140 C 130 115 155 110 195 168 C 235 168 270 110 310 125 C 350 120 380 90 415 82 C 450 78 470 110 495 138 C 515 125 530 90 550 86 C 570 84 590 85 600 85 L 600 110 L 0 110 Z",
    telemetryNote: "420Hz NOTCH ACTIVE: Synthetic AI cardboard boxiness scooped (-4.8dB, Q=3.4)"
  },
  {
    id: 3,
    name: "Band 3: Formant Neutralizer",
    type: "Bell",
    freq: "1.4 kHz",
    gain: "-1.5 dB",
    q: "2.1 (Moderate)",
    cx: 310,
    cy: 125,
    role: "Gentle dip in the nasal acoustic register to tame harsh phase whistling and digital comb filtering.",
    whyAILacksThis: "Diffusion vocoders introduce metallic phase cancellations and telephone-like nasal spikes between 1kHz and 2kHz.",
    clientROI: "Ensures the voiceover sits naturally in the mix, giving the commercial believable human warmth.",
    fairlightModule: "Fairlight 6-Band Parametric EQ",
    curvePath: "M 0 200 C 60 195 70 170 85 140 C 130 115 160 115 195 148 C 230 148 265 110 310 142 C 355 142 380 90 415 82 C 450 78 470 110 495 138 C 515 125 530 90 550 86 C 570 84 590 85 600 85",
    fillPath: "M 0 200 C 60 195 70 170 85 140 C 130 115 160 115 195 148 C 230 148 265 110 310 142 C 355 142 380 90 415 82 C 450 78 470 110 495 138 C 515 125 530 90 550 86 C 570 84 590 85 600 85 L 600 110 L 0 110 Z",
    telemetryNote: "1.4kHz FORMANT ATTENUATED: Nasal digital vocoder whistling smoothed"
  },
  {
    id: 4,
    name: "Band 4: Commercial Presence Peak",
    type: "Bell",
    freq: "3.4 kHz",
    gain: "+3.2 dB",
    q: "1.8 (Musical)",
    cx: 415,
    cy: 82,
    role: "Hollywood dialogue punch and clarity boost that cuts through complex cinematic orchestral scores and sound effects.",
    whyAILacksThis: "AI tracks sound muffled and submerged behind background music because synthetic stems lack transient bite.",
    clientROI: "100% dialogue intelligibility on Instagram, TikTok, YouTube, and noisy mobile environments without raising volume.",
    fairlightModule: "Fairlight 6-Band Parametric EQ",
    curvePath: "M 0 200 C 60 195 70 170 85 140 C 130 115 160 115 195 148 C 230 148 270 110 310 125 C 350 115 375 70 415 62 C 455 62 470 110 495 138 C 515 125 530 90 550 86 C 570 84 590 85 600 85",
    fillPath: "M 0 200 C 60 195 70 170 85 140 C 130 115 160 115 195 148 C 230 148 270 110 310 125 C 350 115 375 70 415 62 C 455 62 470 110 495 138 C 515 125 530 90 550 86 C 570 84 590 85 600 85 L 600 110 L 0 110 Z",
    telemetryNote: "3.4kHz PRESENCE LIFTED: Hollywood dialogue punch boosted (+3.2dB, Q=1.8)"
  },
  {
    id: 5,
    name: "Band 5: Spectral De-Esser",
    type: "DeEsser",
    freq: "7.2 kHz",
    gain: "-5.5 dB",
    q: "4.2 (Dynamic)",
    cx: 495,
    cy: 138,
    role: "Frequency-targeted dynamic de-essing that eliminates ear-piercing sibilance ('S', 'T', 'SH') without dulling overall brilliance.",
    whyAILacksThis: "Neural text-to-speech generates piercing sibilant hiss that physically hurts listener ears on AirPods and high-end headphones.",
    clientROI: "Eliminates listener acoustic fatigue, driving 40% higher commercial video completion rates.",
    fairlightModule: "Fairlight Dynamic Spectral De-Esser",
    curvePath: "M 0 200 C 60 195 70 170 85 140 C 130 115 160 115 195 148 C 230 148 270 110 310 125 C 350 120 380 90 415 82 C 450 78 465 115 495 156 C 525 156 530 90 550 86 C 570 84 590 85 600 85",
    fillPath: "M 0 200 C 60 195 70 170 85 140 C 130 115 160 115 195 148 C 230 148 270 110 310 125 C 350 120 380 90 415 82 C 450 78 465 115 495 156 C 525 156 530 90 550 86 C 570 84 590 85 600 85 L 600 110 L 0 110 Z",
    telemetryNote: "7.2kHz SIBILANCE DAMPENED: Ear-piercing vocal sibilants clamped (-5.5dB dynamic)"
  },
  {
    id: 6,
    name: "Band 6: Hollywood Silk High-Shelf",
    type: "HighShelf",
    freq: "12.5 kHz",
    gain: "+2.8 dB",
    q: "0.8 (Smooth)",
    cx: 550,
    cy: 86,
    role: "Ultra-high-frequency shelf adding air, acoustic space, and high-fidelity sheen reminiscent of million-dollar cinema dubbing stages.",
    whyAILacksThis: "AI audio models are typically trained on 22kHz or 32kHz sample rates with steep 10kHz low-pass cutoffs that sound flat and dead.",
    clientROI: "Bestows an immediate luxury acoustic polish that commands enterprise brand prestige.",
    fairlightModule: "Fairlight High-Frequency Silk Shelf",
    curvePath: "M 0 200 C 60 195 70 170 85 140 C 130 115 160 115 195 148 C 230 148 270 110 310 125 C 350 120 380 90 415 82 C 450 78 470 110 495 138 C 515 110 530 75 550 68 C 570 65 590 65 600 65",
    fillPath: "M 0 200 C 60 195 70 170 85 140 C 130 115 160 115 195 148 C 230 148 270 110 310 125 C 350 120 380 90 415 82 C 450 78 470 110 495 138 C 515 110 530 75 550 68 C 570 65 590 65 600 65 L 600 110 L 0 110 Z",
    telemetryNote: "12.5kHz SILK SHELF ACTIVE: Luxury 20kHz acoustic air & sheen engaged (+2.8dB)"
  }
];

interface DynamicsBand {
  id: string;
  range: string;
  role: string;
  ratio: string;
  attack: string;
  release: string;
  threshold: string;
  gainReduction: number;
  color: string;
}

const FAIRLIGHT_DYNAMICS_BANDS: DynamicsBand[] = [
  {
    id: "LOW",
    range: "20 Hz – 160 Hz",
    role: "Sub-weight stabilization; prevents bass thumps from triggering global limiter pumping.",
    ratio: "3.2:1",
    attack: "15 ms",
    release: "120 ms",
    threshold: "-22 dBFS",
    gainReduction: -3.5,
    color: "#00C2D4"
  },
  {
    id: "LOW-MID",
    range: "160 Hz – 1.2 kHz",
    role: "Tames acoustic body and vocal warmth; prevents muddy clouding during loud orchestral climaxes.",
    ratio: "2.5:1",
    attack: "25 ms",
    release: "180 ms",
    threshold: "-18 dBFS",
    gainReduction: -2.8,
    color: "#FF6600"
  },
  {
    id: "HIGH-MID",
    range: "1.2 kHz – 6.0 kHz",
    role: "Voice intelligibility lock; holds spoken word upfront regardless of background Foley intensity.",
    ratio: "3.0:1",
    attack: "10 ms",
    release: "90 ms",
    threshold: "-16 dBFS",
    gainReduction: -4.5,
    color: "#00FF66"
  },
  {
    id: "HIGH",
    range: "6.0 kHz – 20 kHz",
    role: "Air and transient peak limiter; keeps high-frequency sparkle pristine under lossy streaming compression.",
    ratio: "2.0:1",
    attack: "5 ms",
    release: "60 ms",
    threshold: "-14 dBFS",
    gainReduction: -1.8,
    color: "#E6007A"
  }
];

// Animated Studio Sound Engineer with Headphones and Thumbs Up!
function SoundEngineerAvatar() {
  return (
    <div className="relative w-40 h-40 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
      {/* Outer Acoustic Waves */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.65, 0.25] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full border border-[#00C2D4]/30 bg-[#00C2D4]/5 blur-[2px]"
      />
      <motion.div
        animate={{ scale: [1.1, 1.3, 1.1], opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.35, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full border border-[#00C2D4]/20 blur-[6px]"
      />

      {/* Main Character SVG */}
      <motion.svg
        viewBox="0 0 240 240"
        className="w-full h-full relative z-10 overflow-visible"
        animate={{ y: [0, -3.5, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="headphoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#00838F" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0AC69" />
            <stop offset="100%" stopColor="#C68642" />
          </linearGradient>
          <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E232A" />
            <stop offset="100%" stopColor="#0F1216" />
          </linearGradient>
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shoulders & Studio Hoodie */}
        <path
          d="M 40 220 C 50 170 85 160 120 160 C 155 160 190 170 200 220 Z"
          fill="url(#hoodieGrad)"
          stroke="#2A303C"
          strokeWidth="2"
        />
        {/* Hoodie Collar / Drawstrings */}
        <path d="M 105 162 L 120 185 L 135 162" stroke="#00C2D4" strokeWidth="2" fill="none" opacity="0.6" />

        {/* Neck */}
        <rect x="106" y="132" width="28" height="34" rx="4" fill="#C68642" />

        {/* Head Base */}
        <g>
          {/* Face */}
          <ellipse cx="120" cy="105" rx="36" ry="42" fill="url(#skinGrad)" />

          {/* Hair / Cap Style */}
          <path
            d="M 84 95 C 84 62 100 52 120 52 C 140 52 156 62 156 95 C 150 82 135 80 120 80 C 105 80 90 82 84 95 Z"
            fill="#1A1C20"
          />

          {/* Stylish Studio Glasses */}
          <rect x="92" y="94" width="22" height="14" rx="3" fill="#111" stroke="#00C2D4" strokeWidth="1.8" />
          <rect x="126" y="94" width="22" height="14" rx="3" fill="#111" stroke="#00C2D4" strokeWidth="1.8" />
          <line x1="114" y1="101" x2="126" y2="101" stroke="#00C2D4" strokeWidth="2" />
          {/* Glasses Lens Reflection */}
          <line x1="95" y1="97" x2="105" y2="105" stroke="#00C2D4" strokeWidth="1" opacity="0.6" />
          <line x1="129" y1="97" x2="139" y2="105" stroke="#00C2D4" strokeWidth="1" opacity="0.6" />

          {/* Nose & Confident Smirk */}
          <path d="M 119 110 L 117 118 L 122 118" stroke="#9E642A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M 110 128 Q 120 135 130 128" stroke="#3D2314" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Studio Headphone Headband */}
          <path
            d="M 76 102 C 72 50 168 50 164 102"
            fill="none"
            stroke="#1E232A"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 82 95 C 80 56 160 56 158 95"
            fill="none"
            stroke="#00C2D4"
            strokeWidth="2.5"
            opacity="0.8"
          />

          {/* Left Headphone Earcup */}
          <g>
            <rect x="70" y="85" width="16" height="42" rx="8" fill="#15181E" stroke="#00C2D4" strokeWidth="2" />
            <circle cx="78" cy="106" r="4" fill="#00C2D4" filter="url(#cyanGlow)" />
            {/* Audio Wave lines from Left Ear */}
            <motion.path
              d="M 64 96 A 12 12 0 0 0 64 116"
              fill="none"
              stroke="#00C2D4"
              strokeWidth="2"
              animate={{ opacity: [0.2, 1, 0.2], x: [0, -4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <motion.path
              d="M 58 90 A 18 18 0 0 0 58 122"
              fill="none"
              stroke="#00C2D4"
              strokeWidth="2"
              animate={{ opacity: [0.1, 0.8, 0.1], x: [0, -6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
            />
          </g>

          {/* Right Headphone Earcup */}
          <g>
            <rect x="154" y="85" width="16" height="42" rx="8" fill="#15181E" stroke="#00C2D4" strokeWidth="2" />
            <circle cx="162" cy="106" r="4" fill="#00C2D4" filter="url(#cyanGlow)" />
            {/* Audio Wave lines from Right Ear */}
            <motion.path
              d="M 176 96 A 12 12 0 0 1 176 116"
              fill="none"
              stroke="#00C2D4"
              strokeWidth="2"
              animate={{ opacity: [0.2, 1, 0.2], x: [0, 4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <motion.path
              d="M 182 90 A 18 18 0 0 1 182 122"
              fill="none"
              stroke="#00C2D4"
              strokeWidth="2"
              animate={{ opacity: [0.1, 0.8, 0.1], x: [0, 6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
            />
          </g>
        </g>

        {/* THUMBS UP HAND (Bottom Right Foreground) */}
        <motion.g
          animate={{ scale: [1, 1.08, 1], y: [0, -3, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Forearm / Wrist */}
          <path d="M 175 220 L 180 185 L 198 190 L 195 220 Z" fill="#C68642" />
          <path d="M 170 215 L 202 215" stroke="#1E232A" strokeWidth="5" strokeLinecap="round" />

          {/* Fist Body */}
          <circle cx="186" cy="178" r="13" fill="#E0AC69" stroke="#9E642A" strokeWidth="1.5" />
          
          {/* Folded Fingers Detail */}
          <path d="M 178 174 Q 186 172 194 174" stroke="#9E642A" strokeWidth="1.5" fill="none" />
          <path d="M 177 180 Q 186 178 194 180" stroke="#9E642A" strokeWidth="1.5" fill="none" />
          <path d="M 178 186 Q 186 184 194 186" stroke="#9E642A" strokeWidth="1.5" fill="none" />

          {/* EXTENDED THUMB UP */}
          <path
            d="M 179 174 C 176 155 178 142 186 142 C 193 142 193 154 191 172 Z"
            fill="#E0AC69"
            stroke="#9E642A"
            strokeWidth="1.8"
          />

          {/* Thumbs Up Glow / Star Accent */}
          <motion.path
            d="M 186 134 L 188 138 L 192 138 L 189 141 L 190 145 L 186 143 L 182 145 L 183 141 L 180 138 L 184 138 Z"
            fill="#00C2D4"
            filter="url(#cyanGlow)"
            animate={{ scale: [0.8, 1.25, 0.8], rotate: [0, 20, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </motion.g>
      </motion.svg>
    </div>
  );
}

// Interactive Block-by-Block Fairlight Audio Console
function FairlightAudioConsole() {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [selectedBand, setSelectedBand] = useState<EQBand>(FAIRLIGHT_EQ_BANDS[1]); // Band 2 (420Hz Notch)
  const [isSimulatingAudio, setIsSimulatingAudio] = useState<boolean>(false);
  const [autoCameraActive, setAutoCameraActive] = useState<boolean>(false);
  const [isEqBypassed, setIsEqBypassed] = useState<boolean>(false);

  // Autonomous vertical camera glide references
  const stageAreaRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const stages = [
    { num: 1, label: "Parametric EQ", desc: "6-Band Surgical Sculpting" },
    { num: 2, label: "Spectral De-Esser", desc: "Sibilance Suppression" },
    { num: 3, label: "Multiband Dynamics", desc: "4-Band Pumping Prevention" },
    { num: 4, label: "Loudness & Limiter", desc: "-14 LUFS & True Peak" },
    { num: 5, label: "Master Approved", desc: "Sound Engineer Sign-off 👍" }
  ];

  // Autonomous Camera Glide: Smoothly frames and centers active audio stage in viewport
  const glideCameraToStage = (stageNum: number = currentStage) => {
    if (typeof window === "undefined" || !stageAreaRef.current) return;
    
    // Defer slightly to ensure the new stage DOM element has mounted
    setTimeout(() => {
      if (!stageAreaRef.current) return;
      const rect = stageAreaRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const navBarClearance = 72; // sticky header clearance
      const availableHeight = viewportHeight - navBarClearance;

      let targetY: number;

      if (stageNum === 5) {
        // Stage 5 is the animated Sound Engineer Avatar
        // Center the avatar and sign-off card directly in the visible screen!
        const centerOffset = Math.max(0, (availableHeight - rect.height) / 2);
        targetY = rect.top + scrollTop - navBarClearance - centerOffset;
      } else if (rect.height <= availableHeight) {
        // If block fits within available viewport, center it smoothly!
        const centerOffset = (availableHeight - rect.height) / 2;
        targetY = rect.top + scrollTop - navBarClearance - Math.max(10, centerOffset);
      } else {
        // If card is taller than viewport (e.g. mobile Stage 1), position comfortably with breathing room
        targetY = rect.top + scrollTop - navBarClearance - 8;
      }

      window.scrollTo({
        top: Math.max(0, Math.round(targetY)),
        behavior: "smooth"
      });
    }, 90);
  };

  const scrollToHeader = () => {
    if (typeof window === "undefined" || !headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    window.scrollTo({
      top: Math.max(0, rect.top + scrollTop - 85),
      behavior: "smooth"
    });
  };

  const handleSelectStage = (num: number) => {
    setCurrentStage(num);
    // On mobile screens, smoothly glide camera to show stage grid
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setTimeout(() => {
        glideCameraToStage(num);
      }, 60);
    }
  };

  const runAudioSimulation = () => {
    if (isSimulatingAudio) return;
    setIsSimulatingAudio(true);
    setAutoCameraActive(true);
    let stage = 1;
    setCurrentStage(1);

    // AUTONOMOUS CAMERA TRACKING: Glide down immediately so mobile viewers see Stage 1 live!
    glideCameraToStage(1);

    const interval = setInterval(() => {
      stage += 1;
      if (stage <= 5) {
        setCurrentStage(stage);
        // Autonomously keep the active grid centered in view
        glideCameraToStage(stage);
      } else {
        clearInterval(interval);
        // Final Stage 5 Sign-off: Calmly stay on Stage 5 and smoothly fade out tracking indicator with ZERO jerk
        setTimeout(() => {
          setIsSimulatingAudio(false);
          setAutoCameraActive(false);
        }, 2500);
      }
    }, 2100); // 2.1s per stage gives optimal tempo for camera tracking and telemetry absorption
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 sm:space-y-10 relative z-10">
      
      {/* Fairlight Header */}
      <div ref={headerRef} className="bg-[#0A0A0A] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/10 pb-6 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-[#00C2D4]/10 border border-[#00C2D4]/30 text-[#00C2D4] font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold rounded">
                DaVinci Resolve 19 Fairlight
              </span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/60 font-mono text-[10px] sm:text-xs uppercase tracking-widest rounded">
                32-Bit Float 48kHz Broadcast Engine
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase tracking-tight text-white">
              Raw AI Audio → Broadcast-Ready Cinema Sound
            </h2>
            <p className="text-white/60 text-xs sm:text-sm md:text-base mt-2 max-w-3xl leading-relaxed">
              Generative video tools (Runway, Kling, Sora, ElevenLabs) spit out thin, mono audio riddled with 400Hz room mud, ear-piercing sibilance, and dynamic distortion. We process every stem block-by-block through DaVinci Fairlight's multichannel mastering chain until certified broadcast ready.
            </p>
          </div>

          {/* Autonomous Signal Chain Simulation Trigger */}
          <div className="shrink-0 w-full lg:w-auto">
            <button
              onClick={runAudioSimulation}
              disabled={isSimulatingAudio}
              className={`w-full lg:w-auto px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 ${
                isSimulatingAudio
                  ? "bg-amber-500 text-black shadow-[0_0_25px_rgba(245,158,11,0.5)] animate-pulse"
                  : "bg-[#00C2D4] text-black hover:bg-white shadow-[0_0_25px_rgba(0,194,212,0.4)] active:scale-95"
              }`}
            >
              <RotateCw size={14} className={isSimulatingAudio ? "animate-spin" : ""} />
              {isSimulatingAudio ? `Processing Stage 0${currentStage}/05...` : "Run Fairlight Mastering Chain"}
            </button>

            {/* Live Camera Glide Mobile Hint (Fixed h-5 to prevent layout shift jerk when stopping) */}
            <div className={`mt-2 h-5 flex items-center justify-center lg:justify-end gap-1.5 text-amber-400 font-mono text-[11px] transition-opacity duration-300 ${
              isSimulatingAudio ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-ping" />
              <span>Autonomous camera tracking Stage 0{currentStage}/05...</span>
            </div>
          </div>
        </div>

        {/* Step-by-Step Block Navigation (Clickable Stages) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono">
          {stages.map((stg) => {
            const isActive = currentStage === stg.num;
            const isCompleted = currentStage > stg.num;
            return (
              <button
                key={stg.num}
                onClick={() => handleSelectStage(stg.num)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  stg.num === 5 ? "col-span-2 sm:col-span-1" : ""
                } ${
                  isActive
                    ? "bg-[#00C2D4]/15 border-[#00C2D4] text-white shadow-[0_0_20px_rgba(0,194,212,0.3)]"
                    : isCompleted
                    ? "bg-white/5 border-[#00C2D4]/40 text-white/80"
                    : "bg-black/40 border-white/10 text-white/40 hover:text-white/70"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className={isActive ? "text-[#00C2D4] font-bold" : isCompleted ? "text-green-400" : "text-white/40"}>
                    STAGE 0{stg.num}
                  </span>
                  {isCompleted && <CheckCircle2 size={12} className="text-green-400" />}
                </div>
                <div className="text-xs font-bold text-white leading-tight">{stg.label}</div>
                <div className="text-[9px] text-white/50 mt-0.5 truncate">{stg.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= DYNAMIC STAGE CONTAINER WITH AUTONOMOUS CAMERA TRACKING ================= */}
      <div ref={stageAreaRef} className="scroll-mt-24 space-y-5">

        {/* LIVE AUTONOMOUS FAIRLIGHT TELEMETRY HUD */}
        <div className="bg-[#050505] border border-white/10 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Live 10-Band Animated VU Equalizer */}
            <div className="flex items-end gap-1 h-6 px-2 py-1 bg-black/60 rounded-lg border border-white/10 shrink-0">
              {[60, 85, 45, 95, 70, 50, 90, 65, 40, 80].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isSimulatingAudio 
                      ? [`${Math.max(15, (h * 0.3))}%`, `${h}%`, `${Math.max(20, (h * 0.5))}%`]
                      : `${h * 0.55}%`
                  }}
                  transition={{
                    duration: 0.5 + (i % 3) * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className={`w-1 rounded-sm ${
                    i < 6 ? "bg-[#00C2D4]" : i < 8 ? "bg-[#00FF66]" : "bg-[#FF6600]"
                  }`}
                />
              ))}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${autoCameraActive ? "bg-amber-400 animate-ping" : "bg-[#00C2D4]"}`} />
                <span className="text-[10px] font-mono text-[#00C2D4] uppercase font-bold tracking-wider truncate">
                  {autoCameraActive ? "AUTONOMOUS CAMERA TRACKING" : "FAIRLIGHT MASTER BUS"}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight truncate">
                STAGE 0{currentStage}/05: {stages[currentStage - 1].label}
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end text-xs font-mono">
            <span className="text-[10px] text-white/50 hidden md:inline truncate max-w-[220px]">
              {stages[currentStage - 1].desc}
            </span>
            
            <button
              onClick={scrollToHeader}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 text-[10px] flex items-center gap-1 transition-all"
            >
              <ArrowUp size={11} /> Top Controls
            </button>
          </div>
        </div>

        {/* ================= STAGE 1: 6-BAND PARAMETRIC EQUALIZER ================= */}
      {currentStage === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* Left: Interactive 6-Band EQ Screen (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0A0A0A] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-[#00C2D4]" />
                <h3 className="text-sm sm:text-base font-mono uppercase font-bold text-white tracking-wider">
                  Fairlight 6-Band Parametric Equalizer
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {/* A/B Bypass Toggle: Mastered vs Raw AI Audio */}
                <button
                  onClick={() => setIsEqBypassed(!isEqBypassed)}
                  title="Toggle between Fairlight master sculpting and unmastered Raw AI Audio"
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border transition-all flex items-center gap-1.5 ${
                    isEqBypassed
                      ? "bg-red-500/20 border-red-500/60 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-pulse"
                      : "bg-[#00C2D4]/15 border-[#00C2D4]/50 text-[#00C2D4] hover:bg-[#00C2D4]/25 shadow-[0_0_12px_rgba(0,194,212,0.25)]"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isEqBypassed ? "bg-red-400" : "bg-[#00C2D4] animate-ping"}`} />
                  {isEqBypassed ? "BYPASS: Raw AI (Flat)" : "ENGAGED: Fairlight Master"}
                </button>
                <span className="hidden sm:inline-block text-[10px] font-mono text-white/40 uppercase">
                  STAGE 01
                </span>
              </div>
            </div>

            <div className="relative bg-[#050505] rounded-xl border border-white/10 p-3 overflow-hidden shadow-inner">
              {/* Frequency Demarcations */}
              <div className="absolute top-2 left-3 right-3 flex justify-between text-[9px] font-mono text-white/30 pointer-events-none">
                <span>20Hz</span>
                <span>100Hz</span>
                <span>500Hz</span>
                <span>1kHz</span>
                <span>5kHz</span>
                <span>10kHz</span>
                <span>20kHz</span>
              </div>

              {/* dB Scale */}
              <div className="absolute left-2 top-8 bottom-8 flex flex-col justify-between text-[8px] font-mono text-white/30 pointer-events-none">
                <span>+12dB</span>
                <span>+6dB</span>
                <span className="text-white/60 font-bold">0dB</span>
                <span>-6dB</span>
                <span>-12dB</span>
              </div>

              {/* SVG Frequency Curve */}
              <div className="pt-6 pb-2 px-4 sm:px-6">
                <svg viewBox="0 0 600 220" className="w-full h-[220px] overflow-visible">
                  <defs>
                    {/* Fairlight Master Gradient Fill */}
                    <linearGradient id="eqFillMaster" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00C2D4" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#00C2D4" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#00C2D4" stopOpacity="0.0" />
                    </linearGradient>

                    {/* Bypassed Flat Audio Gradient Fill */}
                    <linearGradient id="eqFillBypass" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                    </linearGradient>

                    {/* Live RTA Spectrum Analyzer Bar Gradient */}
                    <linearGradient id="rtaBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00C2D4" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#005B66" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="0" y1="55" x2="600" y2="55" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <line x1="0" y1="82" x2="600" y2="82" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <line x1="0" y1="110" x2="600" y2="110" stroke={isEqBypassed ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.2)"} strokeWidth={isEqBypassed ? "1.5" : "1"} />
                  <line x1="0" y1="138" x2="600" y2="138" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <line x1="0" y1="165" x2="600" y2="165" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                  {/* LIVE REAL-TIME AUDIO SPECTRUM ANALYZER (RTA) BARS */}
                  <g className="pointer-events-none">
                    {EQ_RTA_BARS.map((bar, idx) => {
                      // Modulate bar height if bypassed vs engaged
                      const animHeight = isEqBypassed ? [bar.height * 0.4, bar.height * 0.7, bar.height * 0.4] : [bar.height * 0.7, bar.height * 1.25, bar.height * 0.6];
                      const animY = isEqBypassed ? [200 - bar.height * 0.4, 200 - bar.height * 0.7, 200 - bar.height * 0.4] : [200 - bar.height * 0.7, 200 - bar.height * 1.25, 200 - bar.height * 0.6];
                      return (
                        <motion.rect
                          key={`rta-${idx}`}
                          x={bar.x}
                          width={bar.width}
                          rx={1.5}
                          fill={isEqBypassed ? "rgba(239,68,68,0.15)" : "url(#rtaBarGrad)"}
                          animate={{
                            height: animHeight,
                            y: animY
                          }}
                          transition={{
                            duration: 0.8 + ((idx % 5) * 0.15),
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: (idx * 0.03) % 0.4
                          }}
                        />
                      );
                    })}
                  </g>

                  {/* Vertical Frequency Laser Guide at Selected Band */}
                  <g className="pointer-events-none">
                    <line
                      x1={selectedBand.cx}
                      y1={25}
                      x2={selectedBand.cx}
                      y2={205}
                      stroke={isEqBypassed ? "rgba(239,68,68,0.35)" : "rgba(0,194,212,0.4)"}
                      strokeWidth="1"
                      strokeDasharray="2 3"
                    />
                    {/* Acoustic Ripple Pulse radiating from selected band node */}
                    {!isEqBypassed && (
                      <motion.circle
                        cx={selectedBand.cx}
                        cy={selectedBand.cy}
                        animate={{ r: [10, 26], opacity: [0.75, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                        fill="none"
                        stroke="#FF6600"
                        strokeWidth="1.2"
                      />
                    )}
                  </g>

                  {/* Shaded Fill Under Curve (Morphs dynamically between bands & bypass) */}
                  <motion.path
                    animate={{
                      d: isEqBypassed ? FLAT_BYPASS_FILL : selectedBand.fillPath
                    }}
                    transition={{
                      duration: 0.55,
                      ease: [0.25, 1, 0.5, 1]
                    }}
                    fill={isEqBypassed ? "url(#eqFillBypass)" : "url(#eqFillMaster)"}
                    className="pointer-events-none"
                  />

                  {/* Dynamic Morphing Curve Line */}
                  <motion.path
                    animate={{
                      d: isEqBypassed ? FLAT_BYPASS_PATH : selectedBand.curvePath
                    }}
                    transition={{
                      duration: 0.55,
                      ease: [0.25, 1, 0.5, 1]
                    }}
                    fill="none"
                    stroke={isEqBypassed ? "#EF4444" : "#00C2D4"}
                    strokeWidth="2.5"
                    className={isEqBypassed ? "filter drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]" : "filter drop-shadow-[0_0_10px_rgba(0,194,212,0.85)]"}
                  />

                  {/* Traveling Electric Audio Signal Pulse (Flows continuously along the curve) */}
                  {!isEqBypassed && (
                    <motion.path
                      animate={{
                        d: selectedBand.curvePath,
                        strokeDashoffset: [0, -480]
                      }}
                      transition={{
                        d: { duration: 0.55, ease: [0.25, 1, 0.5, 1] },
                        strokeDashoffset: { duration: 2.2, repeat: Infinity, ease: "linear" }
                      }}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="3.2"
                      strokeDasharray="18 200"
                      strokeLinecap="round"
                      className="pointer-events-none filter drop-shadow-[0_0_8px_#FFFFFF]"
                    />
                  )}

                  {/* Clickable Band Handles (Flicker-Free with 22px Hit Targets) */}
                  {FAIRLIGHT_EQ_BANDS.map((band) => {
                    const isSelected = selectedBand.id === band.id;
                    const nodeY = isEqBypassed ? 110 : band.cy;

                    return (
                      <g 
                        key={band.id} 
                        onClick={() => setSelectedBand(band)}
                        className="cursor-pointer group select-none"
                      >
                        {/* 1. Large 22px Stable Hit Target: Mouse never loses hover boundary */}
                        <circle
                          cx={band.cx}
                          cy={nodeY}
                          r={22}
                          fill="transparent"
                          className="cursor-pointer"
                        />

                        {/* 2. Ambient Hover Halo (Zero coordinate displacement) */}
                        <circle
                          cx={band.cx}
                          cy={nodeY}
                          r={isSelected ? 16 : 13}
                          fill={isEqBypassed ? "rgba(239,68,68,0.2)" : (isSelected ? "rgba(255,102,0,0.25)" : "rgba(0,194,212,0.2)")}
                          className={`transition-opacity duration-200 pointer-events-none ${
                            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        />

                        {/* 3. Outer Selected Dashed Ring */}
                        {isSelected && (
                          <circle
                            cx={band.cx}
                            cy={nodeY}
                            r={14}
                            fill="none"
                            stroke={isEqBypassed ? "#EF4444" : "#FF6600"}
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            className="pointer-events-none animate-spin"
                            style={{ transformOrigin: `${band.cx}px ${nodeY}px`, animationDuration: "8s" }}
                          />
                        )}

                        {/* 4. Core Node Circle */}
                        <circle
                          cx={band.cx}
                          cy={nodeY}
                          r={isSelected ? 9.5 : 7.5}
                          fill={isEqBypassed ? "#EF4444" : (isSelected ? "#FF6600" : "#00C2D4")}
                          stroke="#050505"
                          strokeWidth="2.5"
                          className="transition-colors duration-200 filter drop-shadow-[0_0_8px_currentColor] pointer-events-none"
                        />

                        {/* 5. Frequency Band Text Label */}
                        <text
                          x={band.cx}
                          y={nodeY - 14}
                          textAnchor="middle"
                          fill={isEqBypassed ? "#EF4444" : (isSelected ? "#FF6600" : "#FFFFFF")}
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                          className="select-none pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                        >
                          B{band.id}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Live Relatable Acoustic Telemetry Readout Banner */}
              <div className="mb-3 px-3 py-2 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between text-[10px] font-mono gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isEqBypassed ? "bg-red-500" : "bg-[#00C2D4] animate-pulse"}`} />
                  <span className={isEqBypassed ? "text-red-400 font-bold" : "text-[#00C2D4] font-bold"}>
                    {isEqBypassed ? "AI RAW BYPASS (FLAT 0dB)" : `ACTIVE TELEMETRY [B${selectedBand.id}]`}
                  </span>
                  <span className="text-white/70 hidden sm:inline">
                    {isEqBypassed 
                      ? "Unmastered 48kHz feed: 420Hz boxiness & 7.2kHz sibilance uncorrected" 
                      : selectedBand.telemetryNote}
                  </span>
                </div>
                <div className="text-white/40 text-[9px]">
                  {selectedBand.freq} // {selectedBand.gain} // Q:{selectedBand.q.split(" ")[0]}
                </div>
              </div>

              {/* Band Quick Switcher */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-3 border-t border-white/10">
                {FAIRLIGHT_EQ_BANDS.map((b) => {
                  const isSelected = selectedBand.id === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBand(b)}
                      className={`p-2 rounded-lg text-left transition-all font-mono border ${
                        isSelected
                          ? "bg-[#FF6600]/20 border-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.4)]"
                          : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      <div className="text-[10px] font-bold text-[#00C2D4]">B{b.id} {b.type}</div>
                      <div className="text-[11px] font-bold text-white mt-0.5">{b.freq}</div>
                      <div className="text-[9px] text-white/50">{b.gain}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Selected Band Engineering Card (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0A0A0A] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 sm:pb-4 sm:mb-4">
              <div>
                <span className="text-[10px] font-mono text-[#00C2D4] uppercase font-bold tracking-wider block">
                  {selectedBand.fairlightModule}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                  {selectedBand.name}
                </h4>
              </div>
              <span className="px-2.5 py-1 bg-[#FF6600]/10 border border-[#FF6600]/30 text-[#FF6600] font-mono text-xs font-bold rounded">
                {selectedBand.freq}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-2.5 sm:p-3 bg-white/5 rounded-xl border border-white/10 font-mono text-center mb-3 sm:mb-5">
              <div>
                <span className="text-[8px] sm:text-[9px] text-white/40 uppercase block">Gain / Slope</span>
                <span className="text-xs sm:text-sm font-bold text-[#00C2D4]">{selectedBand.gain}</span>
              </div>
              <div>
                <span className="text-[8px] sm:text-[9px] text-white/40 uppercase block">Q / Bandwidth</span>
                <span className="text-xs sm:text-sm font-bold text-white">{selectedBand.q}</span>
              </div>
              <div>
                <span className="text-[8px] sm:text-[9px] text-white/40 uppercase block">Filter Type</span>
                <span className="text-xs sm:text-sm font-bold text-[#FF6600]">{selectedBand.type}</span>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 space-y-1">
                <h5 className="font-mono text-[9px] sm:text-[10px] uppercase font-bold text-red-400 flex items-center gap-1.5">
                  <AlertTriangle size={12} /> The Raw AI Audio Flaw
                </h5>
                <p className="text-white/80 leading-relaxed text-[11px] sm:text-xs">
                  {selectedBand.whyAILacksThis}
                </p>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <h5 className="font-mono text-[9px] sm:text-[10px] uppercase font-bold text-white/90 flex items-center gap-1.5">
                  <Sliders size={12} className="text-[#00C2D4]" /> Fairlight Action
                </h5>
                <p className="text-white/70 leading-relaxed text-[11px] sm:text-xs">
                  {selectedBand.role}
                </p>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 space-y-1">
                <h5 className="font-mono text-[9px] sm:text-[10px] uppercase font-bold text-green-400 flex items-center gap-1.5">
                  <CheckCircle2 size={12} /> Conversion ROI
                </h5>
                <p className="text-white/80 leading-relaxed text-[11px] sm:text-xs">
                  {selectedBand.clientROI}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ================= STAGE 2: SPECTRAL DE-ESSER ================= */}
      {currentStage === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#0A0A0A] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 sm:pb-4 sm:mb-6">
            <div>
              <span className="text-[10px] font-mono text-[#00C2D4] uppercase font-bold">
                STAGE 02 // DYNAMICS
              </span>
              <h3 className="text-lg sm:text-2xl font-bold uppercase tracking-tight text-white mt-1">
                Fairlight Dynamic Spectral De-Esser
              </h3>
            </div>
            <span className="px-2.5 sm:px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-[10px] sm:text-xs font-bold rounded">
              Active Suppression
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
            <div className="p-4 sm:p-5 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 space-y-1.5 sm:space-y-3">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-[#00C2D4] uppercase">Listening Band</span>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">6,800 Hz – 8,400 Hz</div>
              <p className="text-[11px] sm:text-xs text-white/60 leading-relaxed">
                Targets the exact resonant whistle frequency generated by diffusion text-to-speech vocoders.
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 space-y-1.5 sm:space-y-3">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-[#FF6600] uppercase">Dynamic Threshold</span>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">-24.0 dBFS // -5.5 dB GR</div>
              <p className="text-[11px] sm:text-xs text-white/60 leading-relaxed">
                Only triggers when harsh sibilants ("S", "T", "CH") occur, preserving high-frequency acoustic brilliance.
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 space-y-1.5 sm:space-y-3">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-green-400 uppercase">Acoustic Result</span>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">Zero Ear Fatigue</div>
              <p className="text-[11px] sm:text-xs text-white/60 leading-relaxed">
                Listeners on AirPods and studio headphones experience silky, comfortable dialogue without piercing hiss.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ================= STAGE 3: 4-BAND MULTIBAND DYNAMICS ================= */}
      {currentStage === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#0A0A0A] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div>
              <span className="text-[10px] font-mono text-[#00C2D4] uppercase font-bold">
                STAGE 03 // COMPRESSION
              </span>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mt-1">
                Fairlight 4-Band Multiband Dynamics Compressor
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#00C2D4] uppercase font-bold">
              Zero Pumping // Independent Bands
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {FAIRLIGHT_DYNAMICS_BANDS.map((band, idx) => (
              <div 
                key={band.id}
                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] sm:text-xs font-bold" style={{ color: band.color }}>
                      {band.id} BAND
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono text-white/50">{band.ratio}</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono text-white/70 mb-2 truncate">{band.range}</div>
                  <p className="text-[10px] sm:text-[11px] text-white/60 leading-relaxed mb-3 line-clamp-2 sm:line-clamp-none">{band.role}</p>
                </div>

                {/* Animated GR Meter */}
                <div className="space-y-1 my-1.5">
                  <div className="flex justify-between text-[8px] sm:text-[9px] font-mono text-white/50">
                    <span>GAIN REDUCTION</span>
                    <span className="text-[#00C2D4] font-bold">{band.gainReduction} dB</span>
                  </div>
                  <div className="w-full h-2.5 sm:h-3 bg-white/10 rounded-full overflow-hidden flex justify-end">
                    <motion.div
                      animate={{ width: ["20%", "55%", "30%", "70%", "25%"] }}
                      transition={{
                        duration: 1.4 + idx * 0.3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                      className="h-full rounded-full bg-gradient-to-l from-[#00C2D4] to-[#00FF66]"
                    />
                  </div>
                </div>

                <div className="text-[8px] sm:text-[9px] font-mono text-white/40 pt-2 border-t border-white/10 flex justify-between">
                  <span>ATT: {band.attack}</span>
                  <span>REL: {band.release}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ================= STAGE 4: BROADCAST LOUDNESS RADAR & LIMITER ================= */}
      {currentStage === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#0A0A0A] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 sm:mb-6">
            <div>
              <span className="text-[10px] font-mono text-[#00C2D4] uppercase font-bold">
                STAGE 04 // BROADCAST COMPLIANCE
              </span>
              <h3 className="text-lg sm:text-2xl font-bold uppercase tracking-tight text-white mt-1">
                EBU R128 & True Peak Limiter Telemetry
              </h3>
            </div>
            <span className="px-2.5 sm:px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-[10px] sm:text-xs font-bold rounded flex items-center gap-1.5">
              <CheckCircle2 size={13} /> ITU BS.1770-4 PASS
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 font-mono">
            <div className="p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10">
              <span className="text-[9px] sm:text-[10px] text-white/40 uppercase block mb-1">Integrated Loudness</span>
              <div className="text-lg sm:text-xl font-bold text-green-400">-14.0 LUFS</div>
              <span className="text-[9px] sm:text-[10px] text-white/50 block mt-1">Web / YouTube Legal</span>
            </div>

            <div className="p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10">
              <span className="text-[9px] sm:text-[10px] text-white/40 uppercase block mb-1">True Peak Ceiling</span>
              <div className="text-lg sm:text-xl font-bold text-[#00C2D4]">-1.00 dBTP</div>
              <span className="text-[9px] sm:text-[10px] text-white/50 block mt-1">Zero DAC Clipping</span>
            </div>

            <div className="p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10">
              <span className="text-[9px] sm:text-[10px] text-white/40 uppercase block mb-1">Loudness Range (LRA)</span>
              <div className="text-lg sm:text-xl font-bold text-[#FF6600]">6.5 LU</div>
              <span className="text-[9px] sm:text-[10px] text-white/50 block mt-1">Cinema Cohesion</span>
            </div>

            <div className="p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10">
              <span className="text-[9px] sm:text-[10px] text-white/40 uppercase block mb-1">Stereo Phase Correlation</span>
              <div className="text-lg sm:text-xl font-bold text-white">+0.92</div>
              <span className="text-[9px] sm:text-[10px] text-white/50 block mt-1">100% Mono-Safe Playback</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ================= STAGE 5: FINAL APPROVAL - ANIMATED SOUND ENGINEER WITH HEADPHONES & THUMBS UP! ================= */}
      {currentStage === 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-[#0A0A0A] border border-[#00C2D4]/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 shadow-[0_0_50px_rgba(0,194,212,0.15)] relative overflow-hidden text-center"
        >
          {/* Cyan Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#00C2D4]/10 rounded-full blur-[140px] pointer-events-none" />

          {/* THE ANIMATED SOUND ENGINEER AVATAR! */}
          <SoundEngineerAvatar />

          <div className="max-w-2xl mx-auto space-y-2.5 sm:space-y-3 mt-3 sm:mt-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold">
              <CheckCircle2 size={13} /> Sound Engineer Approved // 100% Broadcast Ready
            </span>

            <h3 className="text-xl sm:text-3xl md:text-4xl font-heading font-bold uppercase tracking-tight text-white">
              Pristine Hollywood Master Verified
            </h3>

            <p className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed font-sans max-w-xl mx-auto">
              "The audio stem has been sculpted through DaVinci Resolve Fairlight. The 420Hz boxy AI resonance is eliminated, sibilants are tamed without dulling highs, and loudness is locked at -14.0 LUFS with a -1.0 dBTP ceiling. This commercial will sound immense on Apple AirPods, OLED TVs, and smartphone speakers."
            </p>

            <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono">
              <span className="px-2.5 py-1 bg-white/5 rounded-full border border-white/10 text-white/80">32-Bit Float 48kHz</span>
              <span className="px-2.5 py-1 bg-white/5 rounded-full border border-white/10 text-white/80">EBU R128 Certified</span>
              <span className="px-2.5 py-1 bg-white/5 rounded-full border border-white/10 text-white/80">Linear Phase EQ</span>
              <span className="px-2.5 py-1 bg-white/5 rounded-full border border-white/10 text-white/80">Dialogue Intimacy Lock</span>
            </div>
          </div>
        </motion.div>
      )}

      </div>

      {/* Navigation Controls: Previous / Next Stage */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => handleSelectStage(Math.max(1, currentStage - 1))}
          disabled={currentStage === 1}
          className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-mono font-bold uppercase tracking-wider text-white/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          ← Previous Stage
        </button>

        <span className="font-mono text-xs text-white/40">
          STAGE {currentStage} OF 5
        </span>

        <button
          onClick={() => handleSelectStage(Math.min(5, currentStage + 1))}
          disabled={currentStage === 5}
          className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-mono font-bold uppercase tracking-wider text-[#00C2D4] hover:bg-[#00C2D4]/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          Next Stage →
        </button>
      </div>

    </section>
  );
}

export function StudioClient() {
  const [activeNode, setActiveNode] = useState<NodeData>(FUSION_NODES[4]); // SoftGlow
  const [activeTab, setActiveTab] = useState<"reel" | "fusion" | "fairlight" | "matrix">("reel");
  const [logoError, setLogoError] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);

  // Canvas auto-scroll reference
  const canvasScrollRef = useRef<HTMLDivElement>(null);

  // Responsive typography auto-fit references
  const titleRef = useRef<HTMLHeadingElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const word = wordRef.current;
    if (!title || !word) return;

    const fit = () => {
      if (window.innerWidth >= 1024) {
        title.style.fontSize = "";
        return;
      }
      const REFERENCE_PX = 100;
      title.style.fontSize = `${REFERENCE_PX}px`;
      const wordWidth = word.offsetWidth;
      const available = title.clientWidth;
      if (!wordWidth || !available) return;
      title.style.fontSize = `${Math.min((available / wordWidth) * REFERENCE_PX * 0.95, 64)}px`;
    };

    fit();
    const fonts = (document as any).fonts;
    fonts?.ready?.then(fit);
    fonts?.addEventListener?.("loadingdone", fit);
    window.addEventListener("load", fit);
    window.addEventListener("resize", fit);
    const timers = [300, 1000, 2500].map((ms) => window.setTimeout(fit, ms));
    return () => {
      fonts?.removeEventListener?.("loadingdone", fit);
      window.removeEventListener("load", fit);
      window.removeEventListener("resize", fit);
      timers.forEach(window.clearTimeout);
    };
  }, []);

  // Autonomous Optical simulation trigger with auto-scrolling
  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimProgress(0);

    // Scroll smoothly to start (MediaIn1)
    if (canvasScrollRef.current) {
      canvasScrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const progress = Math.min(100, step * 10);
      setSimProgress(progress);

      if (step < FUSION_NODES.length) {
        const targetNode = FUSION_NODES[step];
        setActiveNode(targetNode);

        // AUTONOMOUS CAMERA TRACKING: Smoothly scroll canvas horizontally to center active node!
        if (canvasScrollRef.current) {
          const container = canvasScrollRef.current;
          const targetScrollX = Math.max(0, targetNode.x - (container.clientWidth / 2) + 70);
          container.scrollTo({ left: targetScrollX, behavior: "smooth" });
        }
      }

      if (step >= 10) {
        clearInterval(interval);
        // Autonomously glide all the way to reveal the final MediaOut node!
        if (canvasScrollRef.current) {
          canvasScrollRef.current.scrollTo({
            left: canvasScrollRef.current.scrollWidth,
            behavior: "smooth"
          });
        }
        setTimeout(() => setIsSimulating(false), 700);
      }
    }, 450);
  };

  const handleSelectNode = (node: NodeData) => {
    setActiveNode(node);
    // Smooth scroll to selected node
    if (canvasScrollRef.current) {
      const container = canvasScrollRef.current;
      const targetScrollX = Math.max(0, node.x - (container.clientWidth / 2) + 70);
      container.scrollTo({ left: targetScrollX, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#00C2D4] selection:text-black font-sans relative overflow-x-hidden">
      


      {/* Optical Ambient Blur Blooms */}
      <div className="fixed top-0 left-1/4 w-[750px] h-[550px] bg-[#00C2D4]/5 rounded-full blur-[170px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[650px] h-[650px] bg-[#FF6600]/5 rounded-full blur-[190px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <nav className="border-b border-white/10 bg-[#050505]/85 backdrop-blur-2xl sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img 
              src="/goodbrains-logo.png" 
              alt="Good Brains Studio"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-contain shrink-0 filter drop-shadow-[0_0_12px_rgba(255,180,0,0.5)] border border-amber-500/30"
            />
            <div>
              <span className="font-mono text-xs sm:text-sm tracking-widest uppercase font-bold text-white block">
                GOOD BRAINS <span className="text-[#00C2D4]">STUDIO</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-white/40 uppercase tracking-widest hidden xs:block">
                CINEMATIC AI & FAIRLIGHT AUDIO PIPELINE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex">
              <FrequencyVisualizer />
            </div>

            {/* Visit GoodBrains.pro Header Button */}
            <a 
              href="https://www.goodbrains.pro"
              target="_top"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/15 text-white/80 hover:bg-white/10 hover:text-white transition-all"
            >
              GoodBrains.pro <ExternalLink size={12} />
            </a>

            <Link 
              href="https://www.upwork.com/freelancers/~01c65e863ec5fb99c7"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-[#00C2D4] text-black hover:bg-white transition-all shadow-[0_0_20px_rgba(0,194,212,0.4)] whitespace-nowrap"
            >
              Hire on Upwork <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Kinetic Typography Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 md:pt-24 pb-12 sm:pb-16 text-center relative z-10">
        
        {/* Kinetic Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#00C2D4]/30 text-[#00C2D4] font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-6 shadow-[0_0_25px_rgba(0,194,212,0.2)]"
        >
          <Sparkles size={13} /> BEYOND GENERATIVE PROMPTS // TRUE OPTICAL & FAIRLIGHT COMPOSITION
        </motion.div>

        {/* 3D Kinetic Typography Headline (Locked to Exactly 2 Lines) */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="perspective-1000 mb-6"
        >
          <h1 
            ref={titleRef}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-white tracking-tight uppercase leading-[1.05] sm:leading-[1.08] mb-6 max-w-5xl mx-auto flex flex-col items-center justify-center text-center"
            style={{ perspective: "1000px" }}
          >
            {/* Line 1: TRANSFORMING alone */}
            <div className="whitespace-nowrap">
              <motion.span variants={kineticText} className="inline-block">
                TRANSFORMING
              </motion.span>
            </div>

            {/* Line 2: RAW AI INTO */}
            <div className="whitespace-nowrap mt-1 sm:mt-2 flex items-center justify-center gap-2.5 sm:gap-4">
              <motion.span variants={kineticText} className="inline-block text-[#00C2D4]">
                RAW AI
              </motion.span>{" "}
              <motion.span variants={kineticText} className="inline-block text-white">
                INTO
              </motion.span>
            </div>

            {/* Line 3: HOLLYWOOD CINEMA (centered, gradient) */}
            <div 
              ref={wordRef}
              className="whitespace-nowrap mt-1 sm:mt-2"
            >
              <motion.span 
                variants={kineticText} 
                className="inline-block bg-gradient-to-r from-white via-[#00C2D4] to-[#FF6600] bg-clip-text text-transparent"
              >
                HOLLYWOOD CINEMA
              </motion.span>
            </div>
          </h1>
        </motion.div>

        {/* Intentional Cinematic Anamorphic Optical Horizon */}
        <AnamorphicOpticalHorizon />

        {/* Subtitle with Kinetic Fade */}
        <motion.p 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-white/60 text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 font-sans"
        >
          We do not deliver plastic AI slop. We fuse state-of-the-art generative passes with DaVinci Resolve 19 Fusion color science, anamorphic halation, 35mm photochemical grain, and Fairlight 32-bit broadcast audio mastering—delivering commercials that arrest thumb-scrolling and command high-ticket enterprise trust.
        </motion.p>

        {/* Interactive Tab Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 p-1.5 bg-[#111]/90 border border-white/10 rounded-xl sm:rounded-2xl max-w-2xl mx-auto backdrop-blur-xl shadow-2xl">
          <button 
            onClick={() => setActiveTab("reel")}
            className={`py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === "reel" 
                ? "bg-[#00C2D4] text-black shadow-[0_0_25px_rgba(0,194,212,0.5)]" 
                : "text-white/60 hover:text-white"
            }`}
          >
            Commercial Reel
          </button>
          <button 
            onClick={() => setActiveTab("fusion")}
            className={`py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === "fusion" 
                ? "bg-[#00C2D4] text-black shadow-[0_0_25px_rgba(0,194,212,0.5)]" 
                : "text-white/60 hover:text-white"
            }`}
          >
            Fusion Graph
          </button>
          <button 
            onClick={() => setActiveTab("fairlight")}
            className={`py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "fairlight" 
                ? "bg-[#00C2D4] text-black shadow-[0_0_25px_rgba(0,194,212,0.5)]" 
                : "text-white/60 hover:text-white"
            }`}
          >
            <Volume2 size={13} />
            <span>Fairlight Audio</span>
          </button>
          <button 
            onClick={() => setActiveTab("matrix")}
            className={`py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === "matrix" 
                ? "bg-[#00C2D4] text-black shadow-[0_0_25px_rgba(0,194,212,0.5)]" 
                : "text-white/60 hover:text-white"
            }`}
          >
            ROI Matrix
          </button>
        </div>
      </section>

      {/* ================= TAB 1: COMMERCIAL REEL ================= */}
      {activeTab === "reel" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-16 sm:space-y-24 relative z-10">
          
          {/* COMMERCIAL 1: REAL ESTATE */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-[#0A0A0A] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-10 items-center">
              
              {/* Cinema Player Container */}
              <div className="w-full lg:w-7/12">
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_0_40px_rgba(0,194,212,0.2)]">
                  <div className="relative aspect-video w-full">
                    <iframe 
                      src="https://www.youtube-nocookie.com/embed/f4dQBbeSF2I?rel=0&modestbranding=1&enablejsapi=1" 
                      title="Real Estate Commercial - Stop Selling Barren Land" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                  
                  <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#050505] border-t border-white/10 flex items-center justify-between text-[10px] sm:text-xs font-mono text-white/50">
                    <span className="flex items-center gap-1.5 sm:gap-2 text-[#00C2D4]">
                      <MonitorPlay size={13} /> 4K 60FPS MASTER
                    </span>
                    <span>2.39:1 ANAMORPHIC DCI-P3</span>
                  </div>
                </div>
              </div>

              {/* Client Business Breakdown */}
              <div className="w-full lg:w-5/12 space-y-4 sm:space-y-6">
                <div>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#00C2D4] font-bold block mb-1">
                    Commercial Spot 01 // Luxury Real Estate
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
                    "Stop Selling Barren Land — Sell The Dream"
                  </h3>
                </div>

                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-white/70">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck size={14} className="text-[#00C2D4]" /> The Business Hook (Why It Converts)
                    </h4>
                    <p className="leading-relaxed">
                      Pre-construction luxury real estate can't sell vacant dirt at premium valuations. This spot sells emotional aspiration, architectural prestige, and lifestyle status to high-net-worth investors before a single foundation is poured.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sliders size={14} className="text-[#FF6600]" /> Optical Science (How It Was Engineered)
                    </h4>
                    <p className="leading-relaxed">
                      Color-graded using custom Kodak 2383 emulation curves in DaVinci Resolve. Micro-contrast highlight compression eliminates AI waxiness, creating photorealistic morning golden hour lighting that commands confidence.
                    </p>
                  </div>
                </div>

                <div className="pt-1 sm:pt-2 flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-white/50">
                  <span className="px-2.5 sm:px-3 py-1 bg-[#111] rounded border border-white/10">Architecture Pre-Viz</span>
                  <span className="px-2.5 sm:px-3 py-1 bg-[#111] rounded border border-white/10">Kodak 2383 LUT</span>
                  <span className="px-2.5 sm:px-3 py-1 bg-[#111] rounded border border-white/10">35mm Halation</span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* COMMERCIAL 2: NARRATIVE SCI-FI DRAMA */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-[#0A0A0A] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row-reverse gap-6 sm:gap-10 items-center">
              
              {/* Cinema Player Container */}
              <div className="w-full lg:w-7/12">
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_0_40px_rgba(255,102,0,0.2)]">
                  <div className="relative aspect-video w-full">
                    <iframe 
                      src="https://www.youtube-nocookie.com/embed/34LMdZ_wU6A?rel=0&modestbranding=1&enablejsapi=1" 
                      title="Cinematic Sci-Fi Drama - Stop Lagging, Start Living" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                  
                  <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#050505] border-t border-white/10 flex items-center justify-between text-[10px] sm:text-xs font-mono text-white/50">
                    <span className="flex items-center gap-1.5 sm:gap-2 text-[#FF6600]">
                      <MonitorPlay size={13} /> 4K 60FPS CINEMATIC MASTER
                    </span>
                    <span>2.39:1 ARRI RAW REC.709</span>
                  </div>
                </div>
              </div>

              {/* Client Business Breakdown */}
              <div className="w-full lg:w-5/12 space-y-4 sm:space-y-6">
                <div>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#FF6600] font-bold block mb-1">
                    Commercial Spot 02 // Tech & Consumer Drama
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
                    "Stop Lagging, Start Living"
                  </h3>
                </div>

                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-white/70">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck size={14} className="text-[#FF6600]" /> The Business Hook (Why It Converts)
                    </h4>
                    <p className="leading-relaxed">
                      Engineered for high-stakes narrative tension that arrests thumb-scrolling within the critical first 1.8 seconds. Uses dramatic character pacing to trigger immediate viewer curiosity and viral retention.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sliders size={14} className="text-[#00C2D4]" /> Optical Science (How It Was Engineered)
                    </h4>
                    <p className="leading-relaxed">
                      Multi-plane DaVinci Resolve Fusion color grading with authentic 35mm photochemical grain overlay. Maintains strict actor facial fidelity across camera pans and lighting changes without digital drift.
                    </p>
                  </div>
                </div>

                <div className="pt-1 sm:pt-2 flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-white/50">
                  <span className="px-2.5 sm:px-3 py-1 bg-[#111] rounded border border-white/10">Character Lock</span>
                  <span className="px-2.5 sm:px-3 py-1 bg-[#111] rounded border border-white/10">Planar Motion</span>
                  <span className="px-2.5 sm:px-3 py-1 bg-[#111] rounded border border-white/10">DCI-P3 Color</span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* SECTION HEADER: VERTICAL VIRAL REELS & SOCIAL ARCHITECTURE */}
          <div className="pt-8 sm:pt-14 border-t border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#00C2D4] font-bold block mb-1">
                OMNICHANNEL PIPELINE // 9:16 MOBILE ARCHITECTURE
              </span>
              <h3 className="text-xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                Vertical Social Campaigns & Generative Systems
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-white/60 max-w-md">
              High-velocity viral reels engineered for sub-2-second thumb arrest, 60 FPS mobile kinetic typography, and deterministic character consistency across TikTok, Reels, and YouTube Shorts.
            </p>
          </div>

          {/* VERTICAL SPOT 01: AUTONOMOUS AI WORKFLOWS */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-[#0A0A0A] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-10 items-center">
              
              {/* Vertical Mobile Player Container */}
              <div className="w-full lg:w-5/12 flex justify-center">
                <div className="relative w-full max-w-[320px] sm:max-w-[340px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 bg-black shadow-[0_0_50px_rgba(0,194,212,0.25)]">
                  <div className="relative aspect-[9/16] w-full bg-[#050505]">
                    <iframe 
                      src="https://www.youtube-nocookie.com/embed/FYcQeFGnW3o?rel=0&modestbranding=1&enablejsapi=1" 
                      title="Autonomous AI Workflows — The Assistant Era is Dead" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                  
                  <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#050505] border-t border-white/10 flex items-center justify-between text-[10px] sm:text-xs font-mono text-white/50">
                    <span className="flex items-center gap-1.5 sm:gap-2 text-[#00C2D4]">
                      <Smartphone size={13} /> 9:16 MOBILE MASTER
                    </span>
                    <span>1080x1920 60FPS</span>
                  </div>
                </div>
              </div>

              {/* Client Business Breakdown */}
              <div className="w-full lg:w-7/12 space-y-4 sm:space-y-6">
                <div>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#00C2D4] font-bold block mb-1">
                    Vertical Spot 01 // Agentic Automation & Viral Hook
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
                    "The Assistant Era is Dead — Autonomous AI Workflows Are Here"
                  </h3>
                </div>

                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-white/70">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck size={14} className="text-[#00C2D4]" /> The Business Hook (Why It Converts)
                    </h4>
                    <p className="leading-relaxed">
                      Traditional AI tech demos suffer an 80% drop-off in the first 3 seconds. This vertical commercial deploys rapid dynamic camera reframing, high-contrast kinetic titles, and tension-building pacing to command 85%+ completion rates on TikTok, Instagram Reels, and YouTube Shorts.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sliders size={14} className="text-[#FF6600]" /> Optical & Acoustic Science (How It Was Engineered)
                    </h4>
                    <p className="leading-relaxed">
                      Reframed from anamorphic source footage with intelligent optical re-centering. Dialogue track mastered through Fairlight spectral de-essing and dynamic multiband compression to eliminate mobile phone speaker distortion and harsh sibilance.
                    </p>
                  </div>
                </div>

                <div className="pt-1 sm:pt-2 flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-white/50">
                  <span className="px-2.5 sm:px-3 py-1 bg-[#111] rounded border border-white/10">9:16 Social Reframe</span>
                  <span className="px-2.5 sm:px-3 py-1 bg-[#111] rounded border border-white/10">Autonomous Agents</span>
                  <span className="px-2.5 sm:px-3 py-1 bg-[#111] rounded border border-white/10">Mobile Fairlight EQ</span>
                  <span className="px-2.5 sm:px-3 py-1 bg-[#111] rounded border border-white/10">Sub-2s Hook</span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* VERTICAL SPOT 02: GENERATIVE CHARACTER CONSISTENCY */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-[#0A0A0A] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row-reverse gap-6 sm:gap-10 items-center">
              
              {/* Vertical Mobile Player Container */}
              <div className="w-full lg:w-5/12 flex justify-center">
                <div className="relative w-full max-w-[320px] sm:max-w-[340px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 bg-black shadow-[0_0_50px_rgba(255,184,0,0.25)]">
                  <div className="relative aspect-[9/16] w-full bg-[#050505]">
                    <iframe 
                      src="https://www.youtube-nocookie.com/embed/Qu8r5Dmapmo?rel=0&modestbranding=1&enablejsapi=1" 
                      title="Character Consistency in AI Video — 4-Pillar Modular Architecture" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                  
                  <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#050505] border-t border-white/10 flex items-center justify-between text-[10px] sm:text-xs font-mono text-white/50">
                    <span className="flex items-center gap-1.5 sm:gap-2 text-[#FFB800]">
                      <Smartphone size={13} /> 9:16 CODE-RENDERED MASTER
                    </span>
                    <span>REMOTION TS // 1080x1920</span>
                  </div>
                </div>
              </div>

              {/* Client Business Breakdown */}
              <div className="w-full lg:w-7/12 space-y-4 sm:space-y-6">
                <div>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#FFB800] font-bold block mb-1">
                    Vertical Spot 02 // Generative Character Consistency & Systems
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
                    "100% Character Consistency Architecture (No Chained Prompts)"
                  </h3>
                </div>

                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-white/70">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck size={14} className="text-[#FFB800]" /> The Business Hook (Why It Converts)
                    </h4>
                    <p className="leading-relaxed">
                      Solves the #1 enterprise blocker in AI commercial filmmaking: character face drift across shots. Eliminates amateur 10-prompt daisy-chaining by proving deterministic identity anchoring across 5 completely different aesthetic styles (Pixar 3D, 35mm film, Anime, Unreal Engine 5).
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sliders size={14} className="text-[#00C2D4]" /> Optical & Programmatic Engine (How It Was Engineered)
                    </h4>
                    <p className="leading-relaxed">
                      Programmatically compiled via Remotion (React/TypeScript). Features 120 BPM beat-synced audio visualizer transients, CRT scanline raster simulation, dynamic Ken Burns camera push-in, and snapping HUD facial topology reticles.
                    </p>
                  </div>
                </div>

                <div className="pt-1 sm:pt-2 flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-white/50">
                  <span className="px-2.5 sm:px-3 py-1 bg-[#111] rounded border border-white/10">Remotion Engine</span>
                  <span className="px-2.5 sm:px-3 py-1 bg-[#111] rounded border border-white/10">3D Facial Topology</span>
                  <span className="px-2.5 sm:px-3 py-1 bg-[#111] rounded border border-white/10">120 BPM Audio Sync</span>
                  <span className="px-2.5 sm:px-3 py-1 bg-[#111] rounded border border-white/10">Multi-Style Latent Lock</span>
                </div>
              </div>

            </div>
          </motion.div>

        </section>
      )}

      {/* ================= TAB 2: ADVANCED INTERACTIVE FUSION NODE GRAPH ================= */}
      {activeTab === "fusion" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <span className="px-3 py-1 bg-[#00C2D4]/10 border border-[#00C2D4]/30 text-[#00C2D4] font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold rounded">
              DaVinci Resolve 19 // Fusion Engine Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold uppercase tracking-tight mt-3 sm:mt-4 mb-3 sm:mb-4">
              The Optical Node Canvas
            </h2>
            <p className="text-white/60 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
              Click any node or trigger the autonomous signal simulation. The camera viewport autonomously tracks photon flow all the way to ProRes Master output.
            </p>

            {/* Simulation Trigger Button */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={runSimulation}
                disabled={isSimulating}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#00C2D4] to-[#FF6600] text-black font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_35px_rgba(0,194,212,0.55)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RotateCw size={14} className="animate-spin" /> Autonomous Signal Tracking: {simProgress}%
                  </>
                ) : (
                  <>
                    <Zap size={14} /> Run Optical Signal Simulation (Autonomous Camera)
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* The Visual Node Flow Canvas with SVG Bezier Wiring */}
            <div className="lg:col-span-8 bg-[#080808] border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              
              {/* Header HUD */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <span className="font-mono text-xs font-bold text-white/60 tracking-wider flex items-center gap-2">
                  <Activity size={14} className="text-[#00C2D4]" /> DAVINCI 19 FUSION WORKSPACE // 10-STAGE GRAPH
                </span>
                <span className="text-[11px] font-mono text-[#00C2D4] bg-[#00C2D4]/10 px-2.5 py-1 rounded border border-[#00C2D4]/30">
                  ACTIVE: {activeNode.name}
                </span>
              </div>

              {/* Interactive SVG Wiring Diagram with Horizontal Auto-Scroll */}
              <div ref={canvasScrollRef} className="relative w-full overflow-x-auto pb-4 scroll-smooth">
                <div className="min-w-[1380px] h-[260px] relative bg-[#050505]/95 rounded-2xl border border-white/10 p-4">
                  
                  {/* SVG Bezier Cables with Animated Signal Pulse */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <defs>
                      <linearGradient id="cyanOrangeCable" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00C2D4" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#FF6600" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>

                    {NODE_EDGES.map((edge, idx) => {
                      const fromNode = FUSION_NODES.find(n => n.id === edge.from)!;
                      const toNode = FUSION_NODES.find(n => n.id === edge.to)!;
                      const x1 = fromNode.x + 85;
                      const y1 = fromNode.y + 25;
                      const x2 = toNode.x;
                      const y2 = toNode.y + 25;
                      const midX = (x1 + x2) / 2;
                      const isHot = activeNode.id === fromNode.id || activeNode.id === toNode.id;

                      return (
                        <g key={idx}>
                          {/* Base Cable */}
                          <path
                            d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                            fill="none"
                            stroke={isHot ? "#00C2D4" : "#ffffff"}
                            strokeOpacity={isHot ? 0.9 : 0.15}
                            strokeWidth={isHot ? 2.5 : 1.5}
                          />

                          {/* Animated Running Signal Pulse */}
                          <path
                            d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                            fill="none"
                            stroke={isHot ? "#00C2D4" : "url(#cyanOrangeCable)"}
                            strokeWidth={isHot ? 2.5 : 1.5}
                            strokeDasharray="6 8"
                            className="animate-[dash_1.5s_linear_infinite]"
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Node Blocks in Coordinate Space */}
                  {FUSION_NODES.map((node) => {
                    const isSelected = activeNode.id === node.id;
                    return (
                      <button
                        key={node.id}
                        onClick={() => handleSelectNode(node)}
                        style={{
                          left: `${node.x}px`,
                          top: `${node.y}px`,
                        }}
                        className={`absolute w-[150px] p-2.5 rounded-xl border text-left transition-all z-10 ${
                          isSelected
                            ? "bg-[#00C2D4]/25 border-[#00C2D4] shadow-[0_0_25px_rgba(0,194,212,0.7)] scale-105 ring-2 ring-[#00C2D4]/50"
                            : "bg-[#111]/95 border-white/15 hover:border-white/40 hover:bg-[#161616]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[8px] font-mono font-bold uppercase px-1 py-0.2 rounded ${
                            node.category === "optical" ? "bg-[#FF6600]/20 text-[#FF6600]" :
                            node.category === "color" ? "bg-[#00C2D4]/20 text-[#00C2D4]" :
                            node.category === "output" ? "bg-green-500/20 text-green-400" :
                            "bg-white/10 text-white/70"
                          }`}>
                            {node.category}
                          </span>
                          <span className="text-[8px] font-mono text-white/40">{node.ireLevel}</span>
                        </div>
                        <h4 className="font-mono font-bold text-[11px] text-white truncate">
                          {node.name}
                        </h4>
                      </button>
                    );
                  })}

                </div>
              </div>

              {/* Node Graph Blocks Grid (Full List For Quick Selection) */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <span className="text-[11px] font-mono uppercase tracking-widest text-white/50 block mb-3">
                  Quick Node Selector (Click to Jump Camera)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {FUSION_NODES.map((node) => {
                    const isSelected = activeNode.id === node.id;
                    return (
                      <button
                        key={node.id}
                        onClick={() => handleSelectNode(node)}
                        className={`p-2 rounded-lg border text-left text-[11px] font-mono truncate transition-all ${
                          isSelected
                            ? "bg-[#00C2D4] text-black font-bold border-[#00C2D4] shadow-[0_0_15px_rgba(0,194,212,0.4)]"
                            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        {node.id}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Signal Flow Legend */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-white/40">
                <span>PIPELINE: Diffusion ➔ Log Comp ➔ Luma Key ➔ 35mm Halation ➔ Planar Lock ➔ ProRes 4444</span>
                <span className="text-[#00C2D4]">DAVINCI RESOLVE STUDIO 19 CERTIFIED</span>
              </div>
            </div>

            {/* Right: Active Node Live Telemetry Inspector & Reactive Scope */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Active Node Details Panel */}
              <div className="bg-[#0D0D0D] border border-[#00C2D4]/30 rounded-3xl p-6 md:p-8 shadow-2xl relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded bg-[#00C2D4]/10 text-[#00C2D4] font-mono text-[10px] font-bold uppercase tracking-wider">
                    {activeNode.category} ENGINE
                  </span>
                  <span className="font-mono text-xs text-white/50">
                    {activeNode.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-mono text-white mb-2">
                  {activeNode.name}
                </h3>

                <div className="space-y-4 text-xs font-sans mt-4">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <h5 className="font-mono text-[10px] uppercase font-bold text-[#00C2D4] flex items-center gap-1.5">
                      <Cpu size={12} /> Optical Function
                    </h5>
                    <p className="text-white/80 leading-relaxed">
                      {activeNode.role}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 space-y-1">
                    <h5 className="font-mono text-[10px] uppercase font-bold text-red-400 flex items-center gap-1.5">
                      <Eye size={12} /> The Flaw in Raw AI
                    </h5>
                    <p className="text-white/80 leading-relaxed">
                      {activeNode.whyAILacksThis}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 space-y-1">
                    <h5 className="font-mono text-[10px] uppercase font-bold text-green-400 flex items-center gap-1.5">
                      <CheckCircle2 size={12} /> High-Ticket Client ROI
                    </h5>
                    <p className="text-white/80 leading-relaxed">
                      {activeNode.clientROI}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-white/50">
                  <span>GAMUT: REC.709 / P3</span>
                  <span className="text-[#00C2D4]">PASS VERIFIED</span>
                </div>
              </div>

              {/* Reactive Optical Scope Widget */}
              <OpticalScopeInspector node={activeNode} />

            </div>

          </div>

        </section>
      )}

      {/* ================= TAB 3: FAIRLIGHT AUDIO CONSOLE ================= */}
      {activeTab === "fairlight" && (
        <FairlightAudioConsole />
      )}

      {/* ================= TAB 4: COMPETITIVE PRODUCTION ECONOMICS MATRIX ================= */}
      {activeTab === "matrix" && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="px-3 py-1 bg-[#FF6600]/10 border border-[#FF6600]/30 text-[#FF6600] font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold rounded">
              Competitive Market Economics
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold uppercase tracking-tight mt-3 sm:mt-4 mb-3 sm:mb-4">
              Real-World Commercial ROI
            </h2>
            <p className="text-white/60 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
              Why high-converting brands choose Good Brains Studio over $35k traditional agencies and $50 amateur AI prompt slop.
            </p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/15 rounded-2xl sm:rounded-3xl overflow-x-auto shadow-2xl -mx-2 sm:mx-0">
            <table className="w-full min-w-[620px] text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/15 bg-white/5 font-mono text-white/70 uppercase">
                  <th className="p-3.5 sm:p-4 md:p-6">Deliverable / Parameter</th>
                  <th className="p-3.5 sm:p-4 md:p-6 text-white/40">Traditional Agency</th>
                  <th className="p-3.5 sm:p-4 md:p-6 text-white/40">Amateur AI Prompters ($50)</th>
                  <th className="p-3.5 sm:p-4 md:p-6 text-[#00C2D4] bg-[#00C2D4]/5">Good Brains Studio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-sans">
                <tr>
                  <td className="p-3.5 sm:p-4 md:p-6 font-bold text-white">Investment per Commercial</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-white/50">$35,000 – $80,000+</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-white/50">&lt;$50 – $200 (Unusable for ads)</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-[#00C2D4] font-bold font-mono">
                    $650 – $1,850 <span className="text-[10px] text-white/50 font-normal block sm:inline">(Sprints from $450)</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 md:p-6 font-bold text-white">Production Velocity</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-white/50">6 to 10 Weeks</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-white/50">24 Hours (Random hallucinations)</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-[#00C2D4] font-bold font-mono">48 to 72 Hours (Broadcast Master)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 md:p-6 font-bold text-white">Visual Texture & Glass</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-white/50">ARRI Alexa / Cooke Lenses ($45k)</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-red-400">Plastic AI Sheen, Flickering Hands</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-[#00C2D4] font-bold font-mono">Photochemical 35mm Halation</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 md:p-6 font-bold text-white">Color Science & Fidelity</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-white/50">Manual DaVinci Grade ($350/hr)</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-red-400">None (8-bit banding, clipped neon)</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-[#00C2D4] font-bold font-mono">DaVinci 19 Fusion Multi-Plane Curve</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 md:p-6 font-bold text-white">Audio Mastering & Dialogue</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-white/50">Full Audio Post Suite ($250/hr)</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-red-400">Robotic AI hiss, 420Hz mud, clipping</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-[#00C2D4] font-bold font-mono">Fairlight 6-Band EQ, 4-Band Dynamics & -14 LUFS Master</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 md:p-6 font-bold text-white">Character & Seed Consistency</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-white/50">Practical Live Cast</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-red-400">Zero (Faces morph every cut)</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-[#00C2D4] font-bold font-mono">Strict Seed Locks & Planar Tracking</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 md:p-6 font-bold text-white">Delivery Codec & Export</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-white/50">Apple ProRes 4444 XQ</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-red-400">Compressed 1080p MP4</td>
                  <td className="p-3.5 sm:p-4 md:p-6 text-[#00C2D4] font-bold font-mono">12-Bit ProRes 4444 + Social 9:16 Cuts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ================= FINAL CALL TO ACTION (MATCHING AUTO-BATH CASE STUDY) ================= */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center py-20 sm:py-28 px-4 sm:px-6 border-t border-white/10 relative overflow-hidden bg-[#070707]"
      >
        {/* Glow ambient circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00C2D4]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 relative z-10">
          
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-[#00C2D4] font-mono text-[10px] sm:text-xs uppercase tracking-widest">
            <Sparkles size={13} /> Global Studio Retainers & Sprints
          </span>

          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase tracking-tight text-white leading-tight">
            Ready to experience the studio?
          </h2>

          <p className="text-white/60 text-xs sm:text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Directly contract Sherif on Upwork for high-impact brand films, or explore the flagship Good Brains studio ecosystem.
          </p>

          {/* THE SIGNATURE BUTTONS */}
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            
            {/* PRIMARY BUTTON TO HTTPS://GOODBRAINS.PRO */}
            <a
              href="https://www.goodbrains.pro"
              target="_top"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 sm:gap-3 bg-white text-[#050505] px-8 sm:px-10 py-3.5 sm:py-4.5 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-[#00C2D4] hover:shadow-[0_0_50px_rgba(0,194,212,0.6)] active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.25)] min-h-[48px]"
            >
              Visit GoodBrains.pro <ExternalLink size={15} />
            </a>

            {/* HIRE ON UPWORK BUTTON */}
            <a
              href="https://www.upwork.com/freelancers/~01c65e863ec5fb99c7"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 sm:gap-3 bg-white/5 border border-white/20 text-white px-8 sm:px-9 py-3.5 sm:py-4.5 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-white/10 hover:border-white/40 active:scale-95 transition-all duration-300 min-h-[48px]"
            >
              Hire Sherif on Upwork <ArrowRight size={15} />
            </a>

            {/* VIRAL HYBRID MOTION ENGINE SHOWCASE */}
            <a
              href="https://www.goodbrains.pro/hybrid-motion"
              target="_top"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF2E93]/15 hover:bg-[#FF2E93]/25 border border-[#FF2E93]/40 text-[#FF2E93] hover:text-white px-7 sm:px-8 py-3.5 sm:py-4.5 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm hover:shadow-[0_0_35px_rgba(255,46,147,0.4)] transition-all min-h-[48px]"
            >
              <Zap size={15} className="text-[#FF2E93]" />
              <span>Hybrid Motion Engine</span>
            </a>

            {/* VIEW SAAS ARCHITECTURE */}
            <Link
              href="/showcase"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white/50 hover:text-white px-5 sm:px-6 py-3 sm:py-4.5 font-mono text-xs uppercase tracking-wider transition-all min-h-[48px]"
            >
              View SaaS Architecture
            </Link>

          </div>

          <p className="text-[11px] font-mono text-white/30 pt-10">
            © 2026 GOOD BRAINS STUDIO // GLOBE VISTA HUB // POWERED BY DAVINCI RESOLVE 19 & NEXT.JS 16
          </p>

        </div>
      </motion.section>

    </main>
  );
}

export default StudioClient;
