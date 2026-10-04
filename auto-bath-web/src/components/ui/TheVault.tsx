"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function TheVault() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleInteractionStart = (clientX: number) => {
    setIsDragging(true);
    handleMove(clientX);
  };

  return (
    <section id="vault" className="relative w-full py-32 bg-vantablack overflow-hidden border-t border-white/5">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl md:text-6xl text-white uppercase tracking-tighter mb-4">
            The <span className="text-electric-cyan">Vault</span>
          </h2>
          <p className="font-sans text-white/60 text-lg max-w-2xl mx-auto">
            Swipe to wipe away the grime and reveal the concourse-condition finish. This is the Auto-Bath standard.
          </p>
        </div>

        {/* The Interactive Slider Container */}
        <div 
          ref={containerRef}
          className={`relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl touch-pan-y select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={(e) => handleInteractionStart(e.clientX)}
          onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => { setIsHovered(false); setIsDragging(false); }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsDragging(false)}
        >
          {/* Dirty Car (Base Layer) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2669&auto=format&fit=crop" 
              alt="Dirty Car Placeholder" 
              className="absolute inset-0 w-full h-full object-cover grayscale-[40%] brightness-[0.55] contrast-[1.1] sepia-[30%]"
              draggable={false}
            />
            {/* Subtle Film Grain / Grit Layer specifically for the Before Status */}
            <div 
              className="absolute inset-0 w-full h-full opacity-[0.25] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }}
            />
            {/* "Dirty" label */}
            <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80 text-xs font-mono uppercase tracking-widest font-bold">
              Before
            </div>
          </div>

          {/* Clean Car (Top Layer with Clip Path) */}
          <div 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img 
              src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2669&auto=format&fit=crop" 
              alt="Clean Car Placeholder" 
              className="absolute inset-0 w-full h-full object-cover brightness-110 contrast-125 saturate-150"
              draggable={false}
            />
            {/* "Clean" label */}
            <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-electric-cyan/20 backdrop-blur-md border border-electric-cyan/30 text-electric-cyan text-xs font-mono uppercase tracking-widest font-bold shadow-[0_0_15px_rgba(0,194,212,0.3)]">
              After
            </div>
          </div>

          {/* The Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-electric-cyan shadow-[0_0_20px_rgba(0,194,212,1)] pointer-events-none z-20"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Dynamic Laser Wash Trail (Trails to the left over the clean car) */}
            <div 
              className={`absolute top-0 bottom-0 right-full w-[15vw] md:w-[250px] bg-gradient-to-l from-electric-cyan/40 via-electric-cyan/10 to-transparent transition-opacity duration-500 ${isDragging ? 'opacity-100 animate-pulse' : 'opacity-0'}`}
            />
            
            {/* Handle Knob */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#050505] border-2 border-electric-cyan rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,194,212,0.8)] transition-transform duration-300 ${isDragging ? 'scale-110 shadow-[0_0_50px_rgba(0,194,212,1)]' : 'scale-100'}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00C2D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
                <path d="M9 18l-6-6 6-6" className="opacity-50" />
              </svg>
            </div>
          </div>

          {/* Instruction Overlay (Fades out when swiped) */}
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: sliderPosition > 10 ? 0 : 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="px-6 py-3 rounded-full bg-[#050505]/80 backdrop-blur-md border border-white/20 text-white font-sans font-medium text-sm tracking-wide shadow-2xl flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" />
              Swipe to Wash
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
