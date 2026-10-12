"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Activity
} from "lucide-react";

interface NodeData {
  id: string;
  name: string;
  category: "input" | "color" | "optical" | "tracking" | "composite" | "output";
  role: string;
  whyAILacksThis: string;
  clientROI: string;
  status: string;
}

const FUSION_NODES: NodeData[] = [
  {
    id: "MediaIn1",
    name: "MediaIn 1 [AI Generation]",
    category: "input",
    role: "Ingests raw high-resolution diffusion passes with strict seed & character prompt adherence.",
    whyAILacksThis: "Raw AI generation has plastic skin texture, digital edge artifacts, and zero physical lens physics.",
    clientROI: "Allows rapid conceptual generation at 10% the cost of practical production filming.",
    status: "100% RAW PASS"
  },
  {
    id: "BrightnessContrast1",
    name: "BrightnessContrast 1",
    category: "color",
    role: "Compresses hyper-blown digital highlights and recovers shadow detail into a cinema-grade Log curve.",
    whyAILacksThis: "Standard AI outputs suffer from crushed blacks and oversaturated neon highlights.",
    clientROI: "Guarantees broadcast compliance for commercial television and premium streaming specs.",
    status: "LOG COMPRESSION"
  },
  {
    id: "LumaKeyer1",
    name: "LumaKeyer 1 & Highlight Isolation",
    category: "optical",
    role: "Separates luminance highlights (>85 IRE) to generate organic light-bleed around subjects.",
    whyAILacksThis: "Without highlight isolation, digital lighting feels 'pasted on' rather than emanating from the scene.",
    clientROI: "Creates subconscious viewer belief that physical light sources genuinely exist in the room.",
    status: "LUMA ISOLATION"
  },
  {
    id: "ColorCorrector1",
    name: "ColorCorrector 1 [Film Print LUT]",
    category: "color",
    role: "Applies custom Kodak 2383 density curves, shifting highlights into warm amber and shadows into deep teal.",
    whyAILacksThis: "Stock AI color palettes look like generic video-game graphics without film stock chemistry.",
    clientROI: "Instantly communicates luxury prestige and cinematic production value to high-net-worth buyers.",
    status: "KODAK 2383 MATRIX"
  },
  {
    id: "SoftGlow1",
    name: "SoftGlow 1 [Anamorphic Halation]",
    category: "optical",
    role: "Simulates optical light halation where intense photons bleed across camera sensor photodiode wells.",
    whyAILacksThis: "AI generators produce razor-sharp, sterile pixel edges that immediately register as fake.",
    clientROI: "Softens digital edges into authentic cinema glass, eliminating viewer skepticism.",
    status: "HALATION ACTIVE"
  },
  {
    id: "FilmGrain1",
    name: "FilmGrain 1 [35mm Photochemical]",
    category: "optical",
    role: "Overlays dynamic, organic 35mm film grain scanned from real silver halide emulsion.",
    whyAILacksThis: "Eliminates the telltale waxy, airbrushed smoothness of AI faces and surfaces.",
    clientROI: "Audiences perceive high-end photochemical film rather than artificial algorithmic pixels.",
    status: "35MM GRAIN LOCK"
  },
  {
    id: "LensDistort1",
    name: "LensDistort 1 [Barrel Curvature]",
    category: "optical",
    role: "Emulates vintage 50mm Panavision anamorphic barrel distortion and slight chromatic fringing.",
    whyAILacksThis: "Flat digital sensors don't have natural spherical lens curvature or edge falloff.",
    clientROI: "Commands emotional viewer intimacy and replicates Hollywood optical equipment.",
    status: "PANAVISION PROFILE"
  },
  {
    id: "PlanarTracker1",
    name: "PlanarTracker 1 [Sub-Pixel Track]",
    category: "tracking",
    role: "Performs optical sub-pixel surface tracking across walls, elevators, and architecture.",
    whyAILacksThis: "Manual keyframing jitters and fails to respect 3D camera parallax perspective.",
    clientROI: "Enables seamless integration of brand logos, kinetic UI, and virtual architecture with zero drift.",
    status: "60 FPS SPATIAL LOCK"
  },
  {
    id: "Polygon1",
    name: "Polygon 1 & MediaIn 2",
    category: "composite",
    role: "Masks foreground architectural elements (e.g. elevator doors, window frames) for multi-plane depth.",
    whyAILacksThis: "AI clips are 2D flat renders without real physical occlusion layers.",
    clientROI: "Creates three-dimensional visual depth that pulls the customer into the environment.",
    status: "OCCLUSION PASS"
  },
  {
    id: "MediaOut1",
    name: "MediaOut 1 [4K Master Output]",
    category: "output",
    role: "Exports master 4K 10-bit ProRes 422HQ stream optimized for high-converting social campaigns.",
    whyAILacksThis: "Uncompressed delivery preserves subtle color grading without macroblocking compression.",
    clientROI: "Maximum conversion on YouTube, Instagram Reels, LinkedIn, and commercial ad networks.",
    status: "DCI-P3 MASTERED"
  }
];

export function StudioClient() {
  const [activeNode, setActiveNode] = useState<NodeData>(FUSION_NODES[4]); // Defaults to SoftGlow
  const [activeTab, setActiveTab] = useState<"reel" | "fusion" | "matrix">("reel");

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#00C2D4] selection:text-black font-sans relative overflow-x-hidden">
      
      {/* Background Optical Ambient Lighting */}
      <div className="fixed top-0 left-1/4 w-[700px] h-[500px] bg-[#00C2D4]/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#FF6B00]/5 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <nav className="border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00C2D4] to-[#FF6B00] flex items-center justify-center font-bold text-black font-mono text-xs shadow-[0_0_20px_rgba(0,194,212,0.5)]">
              GB
            </div>
            <div>
              <span className="font-mono text-sm tracking-widest uppercase font-bold text-white block">
                GOOD BRAINS <span className="text-[#00C2D4]">STUDIO</span>
              </span>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                CINEMATIC AI & OPTICAL VFX PIPELINE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-white/5 border border-white/10 text-white/70">
              <span className="w-2 h-2 rounded-full bg-[#00C2D4] animate-pulse" />
              DaVinci 19 Fusion Active
            </span>
            <Link 
              href="https://www.upwork.com/freelancers/~01c65e863ec5fb99c7"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-white text-black hover:bg-[#00C2D4] transition-all hover:shadow-[0_0_25px_rgba(0,194,212,0.5)]"
            >
              Hire on Upwork <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-16 text-center relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#00C2D4]/30 text-[#00C2D4] font-mono text-xs tracking-widest uppercase mb-6"
        >
          <Sparkles size={14} /> Beyond Generative Prompts // True Optical Engineering
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-7xl font-bold tracking-tight uppercase leading-[1.05] mb-6"
        >
          Transforming AI Generations Into <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-white via-[#00C2D4] to-[#FF6B00] bg-clip-text text-transparent">
            Hollywood Film Stock
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white/60 text-base md:text-xl max-w-3xl mx-auto leading-relaxed mb-10 font-sans"
        >
          We don't do plastic AI slop. We fuse generative diffusion models with DaVinci Resolve Fusion color science, anamorphic halation, 35mm photochemical grain, and sub-pixel motion tracking—delivering commercials that arrest thumb-scrolling and command high-ticket enterprise trust.
        </motion.p>

        {/* Tab Controls */}
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-[#111] border border-white/10 rounded-2xl max-w-md mx-auto">
          <button 
            onClick={() => setActiveTab("reel")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === "reel" 
                ? "bg-[#00C2D4] text-black shadow-[0_0_20px_rgba(0,194,212,0.4)]" 
                : "text-white/60 hover:text-white"
            }`}
          >
            Commercial Reel
          </button>
          <button 
            onClick={() => setActiveTab("fusion")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === "fusion" 
                ? "bg-[#00C2D4] text-black shadow-[0_0_20px_rgba(0,194,212,0.4)]" 
                : "text-white/60 hover:text-white"
            }`}
          >
            Fusion Node Graph
          </button>
          <button 
            onClick={() => setActiveTab("matrix")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === "matrix" 
                ? "bg-[#00C2D4] text-black shadow-[0_0_20px_rgba(0,194,212,0.4)]" 
                : "text-white/60 hover:text-white"
            }`}
          >
            Client ROI Matrix
          </button>
        </div>
      </section>

      {/* ================= TAB 1: COMMERCIAL REEL ================= */}
      {activeTab === "reel" && (
        <section className="max-w-7xl mx-auto px-6 py-10 space-y-24">
          
          {/* COMMERCIAL 1: REAL ESTATE */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              
              {/* Left: Custom Anamorphic Cinema Player Container */}
              <div className="w-full lg:w-7/12">
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_0_40px_rgba(0,194,212,0.2)]">
                  {/* Aspect Ratio 16:9 / 2.39:1 Cinema Letterbox */}
                  <div className="relative aspect-video w-full">
                    <iframe 
                      src="https://www.youtube-nocookie.com/embed/f4dQBbeSF2I?rel=0&modestbranding=1" 
                      title="Real Estate Commercial - Stop Selling Barren Land" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                  
                  {/* Top Bar Overlay */}
                  <div className="px-4 py-2.5 bg-[#050505] border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
                    <span className="flex items-center gap-2 text-[#00C2D4]">
                      <MonitorPlay size={14} /> 4K 60FPS MASTER
                    </span>
                    <span>RUN TIME: 0:42 // 2.39:1 ANAMORPHIC</span>
                  </div>
                </div>
              </div>

              {/* Right: Client-Perspective Strategic Breakdown */}
              <div className="w-full lg:w-5/12 space-y-6">
                <div>
                  <div className="inline-block px-3 py-1 rounded bg-[#00C2D4]/10 border border-[#00C2D4]/30 text-[#00C2D4] font-mono text-xs uppercase tracking-widest font-bold mb-3">
                    Commercial Specimen 01 // Luxury Real Estate
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-white">
                    Stop Selling Barren Land — <br className="hidden md:block" />
                    <span className="text-[#00C2D4]">Sell The Dream</span>
                  </h2>
                </div>

                <div className="space-y-4 text-sm font-sans text-white/70">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck size={14} className="text-[#00C2D4]" /> The Business Hook (Why It Converts)
                    </h4>
                    <p className="leading-relaxed">
                      Transforming undeveloped, barren terrain into emotional, high-status architectural desire before a single foundation stone is poured. Captures high-net-worth investor capital at the pre-construction phase.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sliders size={14} className="text-[#FF6B00]" /> Optical Science (How It Was Engineered)
                    </h4>
                    <p className="leading-relaxed">
                      Warm architectural sunlight halation via DaVinci Resolve Luma isolation, custom Kodak 2383 density curves, and spatial acoustic sound design that grounds the CGI villas into physical earth.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-white/50">
                  <span className="px-3 py-1 bg-[#111] rounded border border-white/10">Architecture CGI</span>
                  <span className="px-3 py-1 bg-[#111] rounded border border-white/10">35mm Halation</span>
                  <span className="px-3 py-1 bg-[#111] rounded border border-white/10">Pre-Construction ROI</span>
                </div>
              </div>

            </div>
          </div>

          {/* COMMERCIAL 2: NARRATIVE DRAMA */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row-reverse gap-10 items-center">
              
              {/* Left: Custom Anamorphic Cinema Player Container */}
              <div className="w-full lg:w-7/12">
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_0_40px_rgba(255,107,0,0.2)]">
                  {/* Aspect Ratio 16:9 / 2.39:1 Cinema Letterbox */}
                  <div className="relative aspect-video w-full">
                    <iframe 
                      src="https://www.youtube-nocookie.com/embed/34LMdZ_wU6A?rel=0&modestbranding=1" 
                      title="Cinematic Drama Commercial - Stop Lagging and Start Living" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                  
                  {/* Top Bar Overlay */}
                  <div className="px-4 py-2.5 bg-[#050505] border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
                    <span className="flex items-center gap-2 text-[#FF6B00]">
                      <MonitorPlay size={14} /> 4K NARRATIVE MASTER
                    </span>
                    <span>RUN TIME: 0:45 // ANAMORPHIC WIDESCREEN</span>
                  </div>
                </div>
              </div>

              {/* Right: Client-Perspective Strategic Breakdown */}
              <div className="w-full lg:w-5/12 space-y-6">
                <div>
                  <div className="inline-block px-3 py-1 rounded bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] font-mono text-xs uppercase tracking-widest font-bold mb-3">
                    Commercial Specimen 02 // Narrative Sci-Fi Drama
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-white">
                    Stop Lagging & <br className="hidden md:block" />
                    <span className="text-[#FF6B00]">Start Living</span>
                  </h2>
                </div>

                <div className="space-y-4 text-sm font-sans text-white/70">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck size={14} className="text-[#FF6B00]" /> The Business Hook (Why It Converts)
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
          </div>

        </section>
      )}

      {/* ================= TAB 2: INTERACTIVE FUSION NODE GRAPH ================= */}
      {activeTab === "fusion" && (
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-3 py-1 bg-[#00C2D4]/10 border border-[#00C2D4]/30 text-[#00C2D4] font-mono text-xs uppercase tracking-widest font-bold rounded">
              DaVinci Resolve 19 // Fusion Engine Architecture
            </span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mt-4 mb-4">
              The Optical Node Graph
            </h2>
            <p className="text-white/60 text-sm md:text-base">
              Click or hover any node below to inspect how we programmatically eliminate the plastic AI look and infuse real photochemical physics into every pixel.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* The Visual Node Flow Canvas (Modeled directly after DaVinci Fusion) */}
            <div className="lg:col-span-7 bg-[#080808] border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <span className="font-mono text-xs font-bold text-white/40 tracking-wider flex items-center gap-2">
                  <Activity size={14} className="text-[#00C2D4]" /> FUSION NODES CANVAS // LIVE INSPECTOR
                </span>
                <span className="text-[11px] font-mono text-[#00C2D4]">
                  ACTIVE NODE: {activeNode.name}
                </span>
              </div>

              {/* Node Graph Blocks Layout */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {FUSION_NODES.map((node) => {
                  const isSelected = activeNode.id === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setActiveNode(node)}
                      className={`text-left p-3.5 rounded-xl border transition-all duration-200 relative group overflow-hidden ${
                        isSelected 
                          ? "bg-[#00C2D4]/15 border-[#00C2D4] shadow-[0_0_20px_rgba(0,194,212,0.3)] scale-[1.02]" 
                          : "bg-[#111]/70 border-white/10 hover:border-white/30 hover:bg-[#161616]"
                      }`}
                    >
                      {/* Connection pip indicator */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          node.category === "optical" ? "bg-[#FF6B00]/20 text-[#FF6B00]" :
                          node.category === "color" ? "bg-[#00C2D4]/20 text-[#00C2D4]" :
                          node.category === "tracking" ? "bg-purple-500/20 text-purple-400" :
                          "bg-white/10 text-white/60"
                        }`}>
                          {node.category}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${isSelected ? "bg-[#00C2D4] shadow-[0_0_8px_#00C2D4]" : "bg-white/20"}`} />
                      </div>

                      <h4 className="font-mono font-bold text-xs text-white truncate group-hover:text-[#00C2D4] transition-colors">
                        {node.name}
                      </h4>
                      <p className="font-mono text-[10px] text-white/40 mt-1">
                        {node.status}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Node Pipeline Flow Legend */}
              <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-white/40">
                <span>PIPELINE: MediaIn ➔ LumaKey ➔ SoftGlow ➔ 35mm Grain ➔ PlanarTrack ➔ MasterOut</span>
                <span className="text-[#00C2D4]">NON-DESTRUCTIVE 32-BIT FLOAT</span>
              </div>
            </div>

            {/* Right: Live Telemetry Inspector Panel */}
            <div className="lg:col-span-5 bg-[#0A0A0A] border border-[#00C2D4]/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,194,212,0.15)] relative">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <span className="font-mono text-xs font-bold text-[#00C2D4] uppercase tracking-widest flex items-center gap-2">
                  <Sliders size={14} /> NODE TELEMETRY INSPECTOR
                </span>
                <span className="font-mono text-xs text-white/50">{activeNode.id}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold font-mono text-white mb-1">
                      {activeNode.name}
                    </h3>
                    <p className="font-mono text-xs text-[#00C2D4]">
                      STATUS: {activeNode.status} // PASS COMPLETE
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <span className="font-mono text-[11px] font-bold text-white/50 uppercase tracking-wider block mb-1">
                        Node Function:
                      </span>
                      <p className="text-sm text-white/80 leading-relaxed font-sans">
                        {activeNode.role}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FF6B00]/5 border border-[#FF6B00]/20">
                      <span className="font-mono text-[11px] font-bold text-[#FF6B00] uppercase tracking-wider block mb-1">
                        Why Raw AI Fails Without This:
                      </span>
                      <p className="text-sm text-white/80 leading-relaxed font-sans">
                        {activeNode.whyAILacksThis}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#00C2D4]/5 border border-[#00C2D4]/20">
                      <span className="font-mono text-[11px] font-bold text-[#00C2D4] uppercase tracking-wider block mb-1">
                        The Client Commercial Benefit (ROI):
                      </span>
                      <p className="text-sm text-white/80 leading-relaxed font-sans">
                        {activeNode.clientROI}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  href="https://www.upwork.com/freelancers/~01c65e863ec5fb99c7"
                  target="_blank"
                  className="w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-[#00C2D4] text-black hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,194,212,0.4)]"
                >
                  Commission a Cinematic Commercial <ExternalLink size={14} />
                </Link>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ================= TAB 3: CLIENT ROI COMPARISON MATRIX ================= */}
      {activeTab === "matrix" && (
        <section className="max-w-5xl mx-auto px-6 py-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] font-mono text-xs uppercase tracking-widest font-bold rounded">
              Commercial Production Economics
            </span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mt-4 mb-4">
              Why Brands Choose Good Brains
            </h2>
            <p className="text-white/60 text-sm md:text-base">
              Comparing traditional agency commercial shoots, low-effort AI prompts, and our Hollywood-grade optical hybrid pipeline.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 font-mono text-xs text-white/60 uppercase">
                  <th className="p-4 md:p-6">Feature / Metric</th>
                  <th className="p-4 md:p-6 text-white/40">Traditional Film Studio</th>
                  <th className="p-4 md:p-6 text-red-400">Amateur AI Prompter</th>
                  <th className="p-4 md:p-6 text-[#00C2D4]">Good Brains Studio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-sans">
                <tr>
                  <td className="p-4 md:p-6 font-bold text-white font-mono">Budget / Cost</td>
                  <td className="p-4 md:p-6 text-white/50">$45,000 – $100,000+</td>
                  <td className="p-4 md:p-6 text-white/50">$200 – $500</td>
                  <td className="p-4 md:p-6 text-[#00C2D4] font-bold font-mono">$1,800 – $4,500 (85% Savings)</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-bold text-white font-mono">Turnaround Time</td>
                  <td className="p-4 md:p-6 text-white/50">6 to 10 Weeks</td>
                  <td className="p-4 md:p-6 text-white/50">24 Hours (Low Quality)</td>
                  <td className="p-4 md:p-6 text-[#00C2D4] font-bold font-mono">5 to 7 Days (Production Ready)</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-bold text-white font-mono">Visual Aesthetic</td>
                  <td className="p-4 md:p-6 text-white/50">Cinematic 35mm</td>
                  <td className="p-4 md:p-6 text-red-400">Waxy, Plastic "AI Look"</td>
                  <td className="p-4 md:p-6 text-[#00C2D4] font-bold">Hollywood Halation & 35mm Grain</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-bold text-white font-mono">Character Consistency</td>
                  <td className="p-4 md:p-6 text-white/50">High (Live Actor)</td>
                  <td className="p-4 md:p-6 text-red-400">Zero (Face morphs constantly)</td>
                  <td className="p-4 md:p-6 text-[#00C2D4] font-bold">100% Locked Identity Matrix</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-bold text-white font-mono">Color Grading Control</td>
                  <td className="p-4 md:p-6 text-white/50">Manual DaVinci Grade</td>
                  <td className="p-4 md:p-6 text-red-400">None (Baked-in oversaturation)</td>
                  <td className="p-4 md:p-6 text-[#00C2D4] font-bold font-mono">Multi-Plane DaVinci 19 Fusion</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Footer & Final Call to Action */}
      <footer className="border-t border-white/10 mt-20 py-16 px-6 text-center bg-[#050505]">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-white">
            Ready to Build a High-Converting Brand Film?
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto">
            Directly contract our studio on Upwork for high-impact social teasers, 30s broadcast commercials, or full narrative brand films.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="https://www.upwork.com/freelancers/~01c65e863ec5fb99c7"
              target="_blank"
              className="px-8 py-4 rounded-xl font-mono text-sm font-bold uppercase tracking-widest bg-[#00C2D4] text-black hover:bg-white transition-all shadow-[0_0_30px_rgba(0,194,212,0.4)] flex items-center gap-2"
            >
              Hire Sherif on Upwork <ArrowRight size={16} />
            </Link>
            <Link
              href="/"
              className="px-8 py-4 rounded-xl font-mono text-sm font-bold uppercase tracking-widest bg-white/5 border border-white/15 text-white hover:bg-white/10 transition-all"
            >
              View SaaS Architecture
            </Link>
          </div>
          <p className="text-[11px] font-mono text-white/30 pt-6">
            © 2026 GOOD BRAINS STUDIO // POWERED BY DAVINCI RESOLVE 19 FUSION & NEXT.JS 16
          </p>
        </div>
      </footer>

    </main>
  );
}
