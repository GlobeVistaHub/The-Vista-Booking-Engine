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
  Wand2,
  Crosshair,
  Gauge
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
  x: number; // Node graph layout coordinate
  y: number;
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
    y: 80
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
    y: 80
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
    y: 40
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
    y: 130
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
    y: 40
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
    y: 130
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
    y: 40
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
    y: 130
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
    x: 980,
    y: 80
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
    x: 1160,
    y: 80
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

// Parallax Optical Particles
function FloatingOpticalParticles() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  const smoothX = useSpring(mouseX, { stiffness: 35, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 35, damping: 25 });

  const layer1X = useTransform(smoothX, [-1000, 1000], [-18, 18]);
  const layer1Y = useTransform(smoothY, [-1000, 1000], [-18, 18]);
  const layer2X = useTransform(smoothX, [-1000, 1000], [-45, 45]);
  const layer2Y = useTransform(smoothY, [-1000, 1000], [-45, 45]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Anamorphic Blue Streak Optics */}
      <motion.div 
        style={{ x: layer1X, y: layer1Y }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[1.5px] bg-gradient-to-r from-transparent via-[#00C2D4]/40 to-transparent blur-[1px] rotate-[-4deg]"
      />
      <motion.div 
        style={{ x: layer2X, y: layer2Y }}
        className="absolute top-2/3 left-1/3 -translate-x-1/2 w-[700px] h-[1px] bg-gradient-to-r from-transparent via-[#FF6600]/30 to-transparent blur-[1px] rotate-[3deg]"
      />

      {/* Floating Photons */}
      <motion.div style={{ x: layer1X, y: layer1Y }} className="absolute inset-0">
        {[...Array(14)].map((_, i) => (
          <div
            key={`p1-${i}`}
            className="absolute rounded-full bg-[#00C2D4]/25 shadow-[0_0_12px_rgba(0,194,212,0.8)]"
            style={{
              top: `${(i * 7 + 13) % 95}%`,
              left: `${(i * 13 + 7) % 95}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
            }}
          />
        ))}
      </motion.div>

      <motion.div style={{ x: layer2X, y: layer2Y }} className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={`p2-${i}`}
            className="absolute rounded-full bg-[#FF6600]/25 shadow-[0_0_10px_rgba(255,102,0,0.8)]"
            style={{
              top: `${(i * 11 + 23) % 90}%`,
              left: `${(i * 17 + 19) % 90}%`,
              width: `${(i % 2) + 2.5}px`,
              height: `${(i % 2) + 2.5}px`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

// Interactive Audio Frequency Visualizer Bars
function FrequencyVisualizer() {
  return (
    <div className="flex items-end gap-[3px] h-6 px-3 py-1 bg-black/40 border border-white/10 rounded-lg">
      {[14, 22, 10, 24, 18, 8, 16, 26, 20, 12, 18, 24, 14, 19, 28, 15, 21, 9, 23, 17].map((h, i) => (
        <motion.div
          key={i}
          animate={{ height: [h * 0.4, h, h * 0.6, h * 0.9, h * 0.3] }}
          transition={{
            duration: 1.2 + (i % 5) * 0.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className={`w-[2.5px] rounded-t-sm ${
            i % 2 === 0 ? "bg-[#00C2D4]" : "bg-[#FF6600]"
          }`}
          style={{ height: `${h}px` }}
        />
      ))}
      <span className="text-[10px] font-mono text-white/50 ml-1.5 uppercase">32-Bit Float 48kHz</span>
    </div>
  );
}

// Live Interactive Vectorscope SVG
function VectorscopeWidget() {
  return (
    <div className="p-4 rounded-2xl bg-black/80 border border-white/15 relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#00C2D4] flex items-center gap-1.5">
          <Crosshair size={12} /> VECTORSCOPE // CHROMA TARGETS
        </span>
        <span className="text-[9px] font-mono text-white/40">75% GRATICULE</span>
      </div>

      <div className="relative w-full aspect-square max-w-[200px] mx-auto flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Circular reticle rings */}
          <circle cx="100" cy="100" r="90" fill="none" stroke="#222" strokeWidth="1" />
          <circle cx="100" cy="100" r="67" fill="none" stroke="#00C2D4" strokeOpacity="0.25" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="35" fill="none" stroke="#333" strokeWidth="1" />

          {/* Crosshairs */}
          <line x1="10" y1="100" x2="190" y2="100" stroke="#222" strokeWidth="1" />
          <line x1="100" y1="10" x2="100" y2="190" stroke="#222" strokeWidth="1" />

          {/* Skin Tone Indicator Line (I-Bar around 10:30 position) */}
          <line x1="100" y1="100" x2="45" y2="45" stroke="#FF6600" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="35" y="40" fill="#FF6600" fontSize="8" fontFamily="monospace">SKIN I-BAR</text>

          {/* Color Graticule Targets (R, Mg, B, Cy, G, Yl) */}
          <rect x="45" y="70" width="8" height="8" fill="none" stroke="#FF6600" strokeWidth="1" />
          <text x="35" y="77" fill="#FF6600" fontSize="8" fontFamily="monospace">R</text>

          <rect x="70" y="45" width="8" height="8" fill="none" stroke="#E6007A" strokeWidth="1" />
          <text x="68" y="38" fill="#E6007A" fontSize="8" fontFamily="monospace">Mg</text>

          <rect x="145" y="70" width="8" height="8" fill="none" stroke="#0066FF" strokeWidth="1" />
          <text x="156" y="77" fill="#0066FF" fontSize="8" fontFamily="monospace">B</text>

          <rect x="145" y="125" width="8" height="8" fill="none" stroke="#00C2D4" strokeWidth="1" />
          <text x="156" y="132" fill="#00C2D4" fontSize="8" fontFamily="monospace">Cy</text>

          <rect x="70" y="145" width="8" height="8" fill="none" stroke="#00FF66" strokeWidth="1" />
          <text x="68" y="160" fill="#00FF66" fontSize="8" fontFamily="monospace">G</text>

          <rect x="45" y="125" width="8" height="8" fill="none" stroke="#FFCC00" strokeWidth="1" />
          <text x="35" y="132" fill="#FFCC00" fontSize="8" fontFamily="monospace">Yl</text>

          {/* Dynamic Chroma Cloud (Simulated organic graded trace) */}
          <motion.path
            d="M 95 105 Q 85 90 70 82 Q 80 75 90 85 Q 105 85 115 95 Q 120 110 100 115 Z"
            fill="#00C2D4"
            fillOpacity="0.4"
            stroke="#00C2D4"
            strokeWidth="1.5"
            animate={{
              d: [
                "M 95 105 Q 85 90 70 82 Q 80 75 90 85 Q 105 85 115 95 Q 120 110 100 115 Z",
                "M 93 103 Q 80 88 65 79 Q 82 72 92 82 Q 108 83 118 97 Q 118 112 98 113 Z",
                "M 95 105 Q 85 90 70 82 Q 80 75 90 85 Q 105 85 115 95 Q 120 110 100 115 Z",
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="flex items-center justify-between text-[9px] font-mono text-white/50 pt-2 border-t border-white/10">
        <span>SAT: 42.8%</span>
        <span className="text-[#00C2D4]">BROADCAST LEGAL</span>
      </div>
    </div>
  );
}

export function StudioClient() {
  const [activeNode, setActiveNode] = useState<NodeData>(FUSION_NODES[4]); // SoftGlow
  const [activeTab, setActiveTab] = useState<"reel" | "fusion" | "matrix">("reel");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);

  // Responsive typography auto-fit references
  const titleRef = useRef<HTMLHeadingElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const word = wordRef.current;
    if (!title || !word) return;

    const fit = () => {
      if (window.innerWidth >= 768) {
        title.style.fontSize = "";
        return;
      }
      const REFERENCE_PX = 100;
      title.style.fontSize = `${REFERENCE_PX}px`;
      const wordWidth = word.offsetWidth;
      const available = title.clientWidth;
      if (!wordWidth || !available) return;
      title.style.fontSize = `${Math.min((available / wordWidth) * REFERENCE_PX * 0.96, 42)}px`;
    };

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Optical simulation trigger
  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimProgress(0);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setSimProgress(step * 10);
      if (step < FUSION_NODES.length) {
        setActiveNode(FUSION_NODES[step]);
      }
      if (step >= 10) {
        clearInterval(interval);
        setTimeout(() => setIsSimulating(false), 600);
      }
    }, 400);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#00C2D4] selection:text-black font-sans relative overflow-x-hidden">
      
      {/* Background Optical Parallax & Particles */}
      <FloatingOpticalParticles />

      {/* Optical Ambient Blur Blooms */}
      <div className="fixed top-0 left-1/4 w-[750px] h-[550px] bg-[#00C2D4]/5 rounded-full blur-[170px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[650px] h-[650px] bg-[#FF6600]/5 rounded-full blur-[190px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <nav className="border-b border-white/10 bg-[#050505]/85 backdrop-blur-2xl sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00C2D4] to-[#FF6600] flex items-center justify-center font-bold text-black font-mono text-xs shadow-[0_0_25px_rgba(0,194,212,0.6)]">
              GB
            </div>
            <div>
              <span className="font-mono text-sm tracking-widest uppercase font-bold text-white block">
                GOOD BRAINS <span className="text-[#00C2D4]">STUDIO</span>
              </span>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                CINEMATIC AI & DAVINCI OPTICAL PIPELINE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <FrequencyVisualizer />

            {/* Visit GoodBrains.pro Header Button */}
            <a 
              href="https://goodbrains.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/15 text-white/80 hover:bg-white/10 hover:text-white transition-all"
            >
              GoodBrains.pro <ExternalLink size={12} />
            </a>

            <Link 
              href="https://www.upwork.com/freelancers/~01c65e863ec5fb99c7"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-[#00C2D4] text-black hover:bg-white transition-all shadow-[0_0_20px_rgba(0,194,212,0.4)]"
            >
              Hire on Upwork <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Kinetic Typography Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-16 text-center relative z-10">
        
        {/* Kinetic Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#00C2D4]/30 text-[#00C2D4] font-mono text-xs tracking-widest uppercase mb-6 shadow-[0_0_25px_rgba(0,194,212,0.2)]"
        >
          <Sparkles size={14} /> BEYOND GENERATIVE PROMPTS // TRUE OPTICAL COMPOSITION
        </motion.div>

        {/* 3D Kinetic Typography Headline */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="perspective-1000 mb-6"
        >
          <h1 
            ref={titleRef}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight uppercase leading-[1.05]"
          >
            <motion.span variants={kineticText} className="inline-block">
              TRANSFORMING
            </motion.span>{" "}
            <motion.span variants={kineticText} className="inline-block text-[#00C2D4]">
              RAW AI
            </motion.span>{" "}
            <br className="hidden sm:block" />
            <motion.span variants={kineticText} className="inline-block">
              INTO
            </motion.span>{" "}
            <motion.span 
              ref={wordRef}
              variants={kineticText} 
              className="inline-block bg-gradient-to-r from-white via-[#00C2D4] to-[#FF6600] bg-clip-text text-transparent"
            >
              HOLLYWOOD CINEMA
            </motion.span>
          </h1>
        </motion.div>

        {/* Subtitle with Kinetic Fade */}
        <motion.p 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-white/60 text-base md:text-xl max-w-3xl mx-auto leading-relaxed mb-10 font-sans"
        >
          We do not deliver plastic AI slop. We fuse state-of-the-art diffusion generative passes with DaVinci Resolve 19 Fusion color science, anamorphic halation, 35mm photochemical grain, and sub-pixel planar tracking—delivering commercials that arrest thumb-scrolling and command high-ticket enterprise trust.
        </motion.p>

        {/* Interactive Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-[#111]/90 border border-white/10 rounded-2xl max-w-md mx-auto backdrop-blur-xl shadow-2xl">
          <button 
            onClick={() => setActiveTab("reel")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === "reel" 
                ? "bg-[#00C2D4] text-black shadow-[0_0_25px_rgba(0,194,212,0.5)]" 
                : "text-white/60 hover:text-white"
            }`}
          >
            Commercial Reel
          </button>
          <button 
            onClick={() => setActiveTab("fusion")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === "fusion" 
                ? "bg-[#00C2D4] text-black shadow-[0_0_25px_rgba(0,194,212,0.5)]" 
                : "text-white/60 hover:text-white"
            }`}
          >
            Fusion Node Graph
          </button>
          <button 
            onClick={() => setActiveTab("matrix")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
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
        <section className="max-w-7xl mx-auto px-6 py-10 space-y-24 relative z-10">
          
          {/* COMMERCIAL 1: REAL ESTATE */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              
              {/* Cinema Player Container */}
              <div className="w-full lg:w-7/12">
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_0_40px_rgba(0,194,212,0.2)]">
                  <div className="relative aspect-video w-full">
                    <iframe 
                      src="https://www.youtube-nocookie.com/embed/f4dQBbeSF2I?rel=0&modestbranding=1" 
                      title="Real Estate Commercial - Stop Selling Barren Land" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                  
                  <div className="px-4 py-2.5 bg-[#050505] border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
                    <span className="flex items-center gap-2 text-[#00C2D4]">
                      <MonitorPlay size={14} /> 4K 60FPS MASTER
                    </span>
                    <span>2.39:1 ANAMORPHIC DCI-P3</span>
                  </div>
                </div>
              </div>

              {/* Client Business Breakdown */}
              <div className="w-full lg:w-5/12 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#00C2D4] font-bold block mb-1">
                    Commercial Spot 01 // Luxury Real Estate
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
                    "Stop Selling Barren Land — Sell The Dream"
                  </h3>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-white/70">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck size={14} className="text-[#00C2D4]" /> The Business Hook (Why It Converts)
                    </h4>
                    <p className="leading-relaxed">
                      Pre-construction luxury real estate can't sell vacant dirt at premium valuations. This spot sells emotional aspiration, architectural prestige, and lifestyle status to high-net-worth investors before a single foundation is poured.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sliders size={14} className="text-[#FF6600]" /> Optical Science (How It Was Engineered)
                    </h4>
                    <p className="leading-relaxed">
                      Color-graded using custom Kodak 2383 emulation curves in DaVinci Resolve. Micro-contrast highlight compression eliminates AI waxiness, creating photorealistic morning golden hour lighting that commands confidence.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-white/50">
                  <span className="px-3 py-1 bg-[#111] rounded border border-white/10">Architecture Pre-Viz</span>
                  <span className="px-3 py-1 bg-[#111] rounded border border-white/10">Kodak 2383 LUT</span>
                  <span className="px-3 py-1 bg-[#111] rounded border border-white/10">35mm Halation</span>
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
            className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row-reverse gap-10 items-center">
              
              {/* Cinema Player Container */}
              <div className="w-full lg:w-7/12">
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_0_40px_rgba(255,102,0,0.2)]">
                  <div className="relative aspect-video w-full">
                    <iframe 
                      src="https://www.youtube-nocookie.com/embed/34LMdZ_wU6A?rel=0&modestbranding=1" 
                      title="Cinematic Sci-Fi Drama - Stop Lagging, Start Living" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                  
                  <div className="px-4 py-2.5 bg-[#050505] border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
                    <span className="flex items-center gap-2 text-[#FF6600]">
                      <MonitorPlay size={14} /> 4K 60FPS CINEMATIC MASTER
                    </span>
                    <span>2.39:1 ARRI RAW REC.709</span>
                  </div>
                </div>
              </div>

              {/* Client Business Breakdown */}
              <div className="w-full lg:w-5/12 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#FF6600] font-bold block mb-1">
                    Commercial Spot 02 // Tech & Consumer Drama
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
                    "Stop Lagging, Start Living"
                  </h3>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-white/70">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck size={14} className="text-[#FF6600]" /> The Business Hook (Why It Converts)
                    </h4>
                    <p className="leading-relaxed">
                      Engineered for high-stakes narrative tension that arrests thumb-scrolling within the critical first 1.8 seconds. Uses dramatic character pacing to trigger immediate viewer curiosity and viral retention.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sliders size={14} className="text-[#00C2D4]" /> Optical Science (How It Was Engineered)
                    </h4>
                    <p className="leading-relaxed">
                      Multi-plane DaVinci Resolve Fusion color grading with authentic 35mm photochemical grain overlay. Maintains strict actor facial fidelity across camera pans and lighting changes without digital drift.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-white/50">
                  <span className="px-3 py-1 bg-[#111] rounded border border-white/10">Character Lock</span>
                  <span className="px-3 py-1 bg-[#111] rounded border border-white/10">Planar Motion</span>
                  <span className="px-3 py-1 bg-[#111] rounded border border-white/10">DCI-P3 Color</span>
                </div>
              </div>

            </div>
          </motion.div>

        </section>
      )}

      {/* ================= TAB 2: ADVANCED INTERACTIVE FUSION NODE GRAPH ================= */}
      {activeTab === "fusion" && (
        <section className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="px-3 py-1 bg-[#00C2D4]/10 border border-[#00C2D4]/30 text-[#00C2D4] font-mono text-xs uppercase tracking-widest font-bold rounded">
              DaVinci Resolve 19 // Fusion Engine Architecture
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tight mt-4 mb-4">
              The Optical Node Canvas
            </h2>
            <p className="text-white/60 text-sm md:text-base">
              Click any node or run the live optical simulation to inspect how we eliminate AI plastic sheen and fuse real photon physics directly into video pixels.
            </p>

            {/* Simulation Trigger Button */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={runSimulation}
                disabled={isSimulating}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00C2D4] to-[#FF6600] text-black font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(0,194,212,0.5)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RotateCw size={14} className="animate-spin" /> Simulating Wave: {simProgress}%
                  </>
                ) : (
                  <>
                    <Zap size={14} /> Run Optical Signal Simulation
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

              {/* Interactive SVG Wiring Diagram */}
              <div className="relative w-full overflow-x-auto pb-4">
                <div className="min-w-[700px] h-[240px] relative bg-[#050505]/90 rounded-2xl border border-white/10 p-4">
                  
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
                      const x1 = fromNode.x + 80;
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
                        onClick={() => setActiveNode(node)}
                        style={{
                          left: `${node.x}px`,
                          top: `${node.y}px`,
                        }}
                        className={`absolute w-[140px] p-2.5 rounded-xl border text-left transition-all z-10 ${
                          isSelected
                            ? "bg-[#00C2D4]/20 border-[#00C2D4] shadow-[0_0_20px_rgba(0,194,212,0.6)] scale-105"
                            : "bg-[#111]/90 border-white/15 hover:border-white/40 hover:bg-[#161616]"
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
                  Quick Node Selector
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {FUSION_NODES.map((node) => {
                    const isSelected = activeNode.id === node.id;
                    return (
                      <button
                        key={node.id}
                        onClick={() => setActiveNode(node)}
                        className={`p-2 rounded-lg border text-left text-[11px] font-mono truncate transition-all ${
                          isSelected
                            ? "bg-[#00C2D4] text-black font-bold border-[#00C2D4]"
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

            {/* Right: Active Node Live Telemetry Inspector & Vectorscope */}
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

              {/* Vectorscope Chroma Widget */}
              <VectorscopeWidget />

            </div>

          </div>

        </section>
      )}

      {/* ================= TAB 3: PRODUCTION ECONOMICS MATRIX ================= */}
      {activeTab === "matrix" && (
        <section className="max-w-6xl mx-auto px-6 py-10 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-3 py-1 bg-[#FF6600]/10 border border-[#FF6600]/30 text-[#FF6600] font-mono text-xs uppercase tracking-widest font-bold rounded">
              Cost & Velocity Economics
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tight mt-4 mb-4">
              Traditional Studio vs. Good Brains
            </h2>
            <p className="text-white/60 text-sm md:text-base">
              Why high-growth brands and enterprise agencies switch to our AI-native DaVinci Fusion pipeline.
            </p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/15 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-white/15 bg-white/5 font-mono text-white/70 uppercase">
                  <th className="p-4 md:p-6">Metric / Parameter</th>
                  <th className="p-4 md:p-6 text-white/40">Traditional Agency</th>
                  <th className="p-4 md:p-6 text-white/40">Amateur AI Prompters</th>
                  <th className="p-4 md:p-6 text-[#00C2D4] bg-[#00C2D4]/5">Good Brains Studio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-sans">
                <tr>
                  <td className="p-4 md:p-6 font-bold text-white">Cost per 30s Spot</td>
                  <td className="p-4 md:p-6 text-white/50">$35,000 – $80,000+</td>
                  <td className="p-4 md:p-6 text-white/50">$300 – $800</td>
                  <td className="p-4 md:p-6 text-[#00C2D4] font-bold font-mono">$4,500 – $8,500</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-bold text-white">Production Turnaround</td>
                  <td className="p-4 md:p-6 text-white/50">6 to 10 Weeks</td>
                  <td className="p-4 md:p-6 text-white/50">24 Hours (Unusable quality)</td>
                  <td className="p-4 md:p-6 text-[#00C2D4] font-bold font-mono">72 to 96 Hours</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-bold text-white">Visual Texture & Glass</td>
                  <td className="p-4 md:p-6 text-white/50">ARRI Alexa / Cooke Lenses</td>
                  <td className="p-4 md:p-6 text-red-400">Plastic AI Sheen / Deformed Hands</td>
                  <td className="p-4 md:p-6 text-[#00C2D4] font-bold font-mono">Photochemical 35mm Halation</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-bold text-white">Color Science Mastery</td>
                  <td className="p-4 md:p-6 text-white/50">Manual DaVinci Grade</td>
                  <td className="p-4 md:p-6 text-red-400">None (Baked-in oversaturation)</td>
                  <td className="p-4 md:p-6 text-[#00C2D4] font-bold font-mono">Multi-Plane DaVinci 19 Fusion</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-bold text-white">Commercial Deliverable</td>
                  <td className="p-4 md:p-6 text-white/50">ProRes Master</td>
                  <td className="p-4 md:p-6 text-red-400">Low-bitrate MP4</td>
                  <td className="p-4 md:p-6 text-[#00C2D4] font-bold font-mono">ProRes 4444 XQ 12-Bit Master</td>
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
        className="text-center py-28 px-6 border-t border-white/10 relative overflow-hidden bg-[#070707]"
      >
        {/* Glow ambient circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00C2D4]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-[#00C2D4] font-mono text-xs uppercase tracking-widest">
            <Sparkles size={14} /> Global Studio Retainers & Sprints
          </span>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold uppercase tracking-tight text-white leading-tight">
            Ready to experience the studio?
          </h2>

          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Directly contract Sherif on Upwork for high-impact brand films, or explore the flagship Good Brains studio ecosystem.
          </p>

          {/* THE SIGNATURE BUTTONS */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* PRIMARY BUTTON TO HTTPS://GOODBRAINS.PRO */}
            <a
              href="https://goodbrains.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-[#050505] px-10 py-4.5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#00C2D4] hover:shadow-[0_0_50px_rgba(0,194,212,0.6)] active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.25)]"
            >
              Visit GoodBrains.pro <ExternalLink size={16} />
            </a>

            {/* HIRE ON UPWORK BUTTON */}
            <a
              href="https://www.upwork.com/freelancers/~01c65e863ec5fb99c7"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/5 border border-white/20 text-white px-9 py-4.5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white/10 hover:border-white/40 active:scale-95 transition-all duration-300"
            >
              Hire Sherif on Upwork <ArrowRight size={16} />
            </a>

            {/* VIEW SAAS ARCHITECTURE */}
            <Link
              href="/showcase"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white/50 hover:text-white px-6 py-4.5 font-mono text-xs uppercase tracking-wider transition-all"
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
