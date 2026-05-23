"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScroll, MotionValue } from "framer-motion";
import Link from "next/link";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function SpatialCard({
  scrollYProgress,
  rangeIn,
  rangeOut,
  children,
}: {
  scrollYProgress: MotionValue<number>;
  rangeIn: number;
  rangeOut: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  
  const fadeIn = Math.max(0, rangeIn - 0.08);
  const fadeOut = Math.min(1, rangeOut + 0.08);

  // Mutable state for imperative mouse tracking and physics
  const mouseState = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0, active: false, px: 0, py: 0 });

  useEffect(() => {
    let animationFrameId: number;
    let lastScrollV = scrollYProgress.get();

    const renderLoop = () => {
      if (!ref.current) return;
      
      // 1. Fluid Mouse Lerping
      const ms = mouseState.current;
      if (ms.active) {
        ms.currentX = lerp(ms.currentX, ms.targetX, 0.1);
        ms.currentY = lerp(ms.currentY, ms.targetY, 0.1);
      } else {
        ms.currentX = lerp(ms.currentX, 0, 0.05);
        ms.currentY = lerp(ms.currentY, 0, 0.05);
      }

      // 2. 3D Scroll Math
      const v = lastScrollV;
      let opacity = 0, scale = 0.6, z = -400, rotX = 25, blur = 12;
      let isActive = false;

      if (v < fadeIn) {
        opacity = 0; scale = 0.6; z = -400; rotX = 25; blur = 12;
      } else if (v < rangeIn) {
        const t = (v - fadeIn) / (rangeIn - fadeIn);
        opacity = lerp(0, 1, t); scale = lerp(0.6, 1, t); z = lerp(-400, 0, t); rotX = lerp(25, 0, t); blur = lerp(12, 0, t);
      } else if (v <= rangeOut) {
        // Active settling range
        opacity = 1; scale = 1; z = lerp(0, 50, (v - rangeIn)/(rangeOut - rangeIn)); rotX = 0; blur = 0;
        isActive = true;
      } else if (v < fadeOut) {
        const t = (v - rangeOut) / (fadeOut - rangeOut);
        opacity = lerp(1, 0, t); scale = lerp(1, 1.8, t); z = lerp(50, 450, t); rotX = lerp(0, -25, t); blur = lerp(0, 25, t);
      } else {
        opacity = 0; scale = 1.8; z = 450; rotX = -25; blur = 25;
      }

      // 3. Combine Scroll + Mouse Tilt
      const tiltY = ms.currentX * 12; // -0.5 to 0.5 -> -6 to 6 deg
      const tiltX = -(ms.currentY * 12); 
      
      ref.current.style.opacity = String(opacity);
      ref.current.style.pointerEvents = isActive ? "all" : "none";
      ref.current.style.filter = blur > 0.1 ? `blur(${blur}px)` : "none";
      ref.current.style.transform = `translateZ(${z}px) scale(${scale}) rotateX(${rotX + tiltX}deg) rotateY(${tiltY}deg)`;

      // 4. Shimmer Update
      if (shimmerRef.current) {
        if (ms.active && isActive) {
          shimmerRef.current.style.background = `radial-gradient(circle 350px at ${ms.px}px ${ms.py}px, rgba(255, 200, 50, 0.12) 0%, transparent 80%)`;
        } else {
          shimmerRef.current.style.background = `radial-gradient(circle 300px at 50% 50%, rgba(255, 200, 50, 0) 0%, transparent 100%)`;
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    const unsubScroll = scrollYProgress.on("change", (latest) => {
      lastScrollV = latest;
    });

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      unsubScroll();
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollYProgress, fadeIn, rangeIn, rangeOut, fadeOut]);

  const handlePointerAt = (clientX: number, clientY: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    mouseState.current.active = true;
    mouseState.current.px = x;
    mouseState.current.py = y;
    mouseState.current.targetX = (x / rect.width) - 0.5;
    mouseState.current.targetY = (y / rect.height) - 0.5;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) =>
    handlePointerAt(e.clientX, e.clientY);

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    if (t) handlePointerAt(t.clientX, t.clientY);
  };

  const handlePointerEnd = () => { mouseState.current.active = false; };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        perspective: "1200px",
      }}
    >
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => { mouseState.current.active = true; }}
        onMouseLeave={handlePointerEnd}
        onTouchMove={handleTouchMove}
        onTouchEnd={handlePointerEnd}
        onTouchCancel={handlePointerEnd}
        style={{
          opacity: 0,
          transformStyle: "preserve-3d",
          willChange: "transform, opacity, filter",
        }}
        className="cursor-pointer select-none relative w-full flex justify-center px-3 sm:px-4"
      >
        <div className="relative rounded-[30px] overflow-hidden">
          {children}
          <div 
            ref={shimmerRef} 
            className="absolute inset-0 pointer-events-none z-30 mix-blend-overlay transition-colors duration-500" 
          />
        </div>
      </div>
    </div>
  );
}

export default function ExperiencePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Drive the title fade imperatively too
  const titleRef = useRef<HTMLDivElement>(null);

  // Revenue Intelligence counters
  const revRef = useRef<HTMLSpanElement>(null);
  const bookRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stages = ["Overview","Villa Lock Engine","Command Center","n8n Orchestrator","Gemini Dialog","Revenue Intel","Finale"];
    return scrollYProgress.on("change", (v) => {
      if (titleRef.current) {
        const op = Math.max(0, 1 - v / 0.09);
        const ty = v < 0.09 ? -v * 400 : -40;
        titleRef.current.style.opacity = String(op);
        titleRef.current.style.transform = `translateY(${ty}px)`;
      }
      if (hudRef.current) {
        let idx = 0;
        if (v < 0.10) idx = 0;
        else if (v < 0.28) idx = 1;
        else if (v < 0.46) idx = 2;
        else if (v < 0.64) idx = 3;
        else if (v < 0.80) idx = 4;
        else if (v < 0.93) idx = 5;
        else idx = 6;
        hudRef.current.textContent = `0${idx + 1}  ${stages[idx]}`;
      }
      if (revRef.current && bookRef.current) {
        const revStart = 0.78;
        const revEnd = 0.90;
        let progress = 0;
        if (v > revStart) {
          progress = Math.min(1, (v - revStart) / (revEnd - revStart));
        }
        const revValue = Math.floor(progress * 142500);
        const bookValue = Math.floor(progress * 482);
        revRef.current.textContent = `$${revValue.toLocaleString("en-US")}`;
        bookRef.current.textContent = String(bookValue);
      }
    });
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} style={{ height: "700vh" }} className="relative w-full">

      {/* Fixed background */}
      <div className="fixed inset-0 -z-10 bg-[#030308] pointer-events-none">
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-70"
        >
          <source src="/video-assets/compressed-finale-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#030308] via-transparent to-[#030308]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#030308_95%)]" />
      </div>

      {/* HUD */}
      <div className="fixed top-8 left-8 z-50 select-none pointer-events-none">
        <p className="text-[10px] tracking-[6px] font-black uppercase text-amber-500 mb-1">STAGE</p>
        <span ref={hudRef} className="font-mono text-2xl font-black text-white/90">01  Overview</span>
      </div>

      {/* Badge */}
      <div 
        onClick={toggleAudio}
        className="fixed top-8 right-8 z-50 flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full cursor-pointer hover:bg-white/10 transition-colors select-none"
      >
        <span className={`w-2 h-2 rounded-full ${isMuted ? "bg-white/40" : "bg-amber-500 animate-pulse"}`} />
        <span className={`text-[10px] tracking-widest font-bold uppercase ${isMuted ? "text-white/40" : "text-white/80"}`}>
          {isMuted ? "UNMUTE TRACK" : "COMMERCIAL TRACK ACTIVE"}
        </span>
      </div>

      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Hero */}
        <div
          ref={titleRef}
          style={{ willChange: "transform, opacity" }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-30 select-none pointer-events-none"
        >
          <div className="inline-flex items-center gap-3 border border-amber-500/30 bg-amber-500/5 px-6 py-2 rounded-full mb-8">
            <span className="text-xs font-black tracking-[4px] text-amber-400 uppercase">✦ Spatial Portfolio Series</span>
          </div>
          <h1 className="text-[clamp(56px,11vw,120px)] font-black tracking-[-4px] text-white leading-none">THE VISTA</h1>
          <p className="text-lg font-light text-amber-400/90 tracking-[10px] uppercase mt-4">BY GLOBEVISTAHUB</p>
          <p className="text-base text-white/40 max-w-lg mt-6 leading-relaxed font-light">
            Scroll to explore the world&apos;s most premium luxury booking engine — built for Upwork&apos;s top 1%.
          </p>
          <div className="mt-14 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-[9px] font-black tracking-[5px] text-white/30 uppercase">Scroll to unfold</span>
            <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* CARD 1 — Villa Search */}
        <SpatialCard scrollYProgress={scrollYProgress} rangeIn={0.10} rangeOut={0.27}>
          <div className="w-full max-w-3xl flex flex-col md:flex-row gap-7 bg-[#0a0e27]/85 border border-amber-500/40 rounded-[26px] backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.9)] p-8">
            <div className="w-full md:w-[320px] h-[200px] rounded-[18px] overflow-hidden relative flex-shrink-0 border border-white/10">
              <img src="/video-assets/villa-serenity.jpg" className="w-full h-full object-cover" alt="Villa Serenity" />
              <div className="absolute top-0 left-0 bg-cyan-400 text-black px-4 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-br-[18px]">SYSTEM LOCK</div>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="text-white/40 text-[10px] font-bold tracking-[3px] uppercase">Villa · El Gouna</p>
                <h3 className="text-4xl font-black text-amber-400 tracking-tight mt-2">Villa Serenity</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {["Private Pool","Red Sea View","Butler","Instant Book"].map(t => (
                  <span key={t} className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest text-amber-400">{t}</span>
                ))}
              </div>
              <div className="flex justify-between items-end border-t border-white/10 pt-5 mt-5">
                <span className="text-sm font-black text-cyan-400 tracking-widest uppercase">Reserved</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$450</span>
                  <span className="text-xs text-white/40 uppercase tracking-wider">/ night</span>
                </div>
              </div>
            </div>
          </div>
        </SpatialCard>

        {/* CARD 2 — Guest Dashboard */}
        <SpatialCard scrollYProgress={scrollYProgress} rangeIn={0.28} rangeOut={0.45}>
          <div className="w-full max-w-3xl bg-[#0a0e27]/85 border border-amber-500/40 rounded-[26px] backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.9)] p-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-5 mb-6">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">GUEST DASHBOARD</h2>
                <p className="text-[10px] text-cyan-400 tracking-[4px] uppercase font-black mt-1">Status: Secure</p>
              </div>
              <div className="w-11 h-11 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                <span className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-[200px] h-[140px] rounded-[16px] overflow-hidden border border-white/10 flex-shrink-0">
                <img src="/video-assets/villa-dashboard.jpg" className="w-full h-full object-cover" alt="Dashboard" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <span className="inline-block bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase mb-2 self-start">BOOKING CONFIRMED</span>
                <h3 className="text-2xl font-black text-white">The Azure Penthouse</h3>
                <p className="text-white/50 mt-1 text-sm">12 Aug – 18 Aug · $320 / night</p>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <div className="flex-1 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-[14px] text-center text-[10px] font-black uppercase tracking-widest text-cyan-400 cursor-pointer hover:bg-cyan-500/20 transition-colors">View Itinerary</div>
              <div className="flex-1 py-3 bg-amber-500/10 border border-amber-500/30 rounded-[14px] text-center text-[10px] font-black uppercase tracking-widest text-amber-400 cursor-pointer hover:bg-amber-500/20 transition-colors">Contact Host</div>
            </div>
          </div>
        </SpatialCard>

        {/* CARD 3 — n8n Orchestrator */}
        <SpatialCard scrollYProgress={scrollYProgress} rangeIn={0.46} rangeOut={0.63}>
          <div className="w-full max-w-2xl bg-[#0a0e27]/85 border border-amber-500/40 rounded-[26px] backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.9)] p-8 flex flex-col items-center gap-7">
            <p className="text-xl font-black text-white text-center">
              &ldquo;Your itinerary for <span className="text-amber-400">Villa Serenity</span> is optimized.&rdquo;
            </p>
            <div className="flex items-center gap-6 w-full justify-center relative">
              <div className="absolute top-1/2 left-[8%] right-[8%] h-px bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 opacity-30" />
              {[
                { label:"TRIGGER", sub:"Webhook Active", cls:"border-cyan-400 text-cyan-400" },
                { label:"AI CORE", sub:"Processing",     cls:"border-amber-400 text-amber-400" },
                { label:"ACTION",  sub:"API Dispatch",   cls:"border-emerald-400 text-emerald-400" },
              ].map(n => (
                <div key={n.label} className={`w-[140px] p-4 bg-black/70 border-2 ${n.cls} rounded-[14px] flex flex-col items-center z-10`}>
                  <span className={`text-[9px] font-black tracking-widest uppercase ${n.cls.split(" ")[1]}`}>{n.label}</span>
                  <span className="text-white text-xs font-semibold mt-1 text-center">{n.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </SpatialCard>

        {/* CARD 4 — Gemini Voice */}
        <SpatialCard scrollYProgress={scrollYProgress} rangeIn={0.64} rangeOut={0.79}>
          <div className="w-full max-w-sm bg-[#0a0e27]/85 border border-amber-500/40 rounded-[26px] backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.9)] p-8 flex flex-col items-center">
            <div className="flex w-full justify-between items-center border-b border-white/10 pb-5 mb-6">
              <div>
                <h2 className="text-2xl font-black text-white">CONCIERGE VOICE</h2>
                <p className="text-[10px] text-cyan-400 tracking-[4px] uppercase font-black mt-1">Listening</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                <span className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
              </div>
            </div>
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-cyan-400 to-amber-400 p-[3px] shadow-[0_0_40px_rgba(0,212,255,0.35)] flex items-center justify-center mb-6">
              <div className="w-full h-full rounded-full bg-[#0a0e27] flex items-center justify-center">
                <span className="w-8 h-8 bg-cyan-400/20 rounded-full flex items-center justify-center">
                  <span className="w-4 h-4 bg-cyan-400 rounded-full animate-ping" />
                </span>
              </div>
            </div>
            <p className="text-base text-white/75 italic text-center leading-relaxed">
              &ldquo;Book the Azure Penthouse for 4 nights starting August 12.&rdquo;
            </p>
            <div className="mt-6 bg-emerald-500/15 text-emerald-400 px-5 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase border border-emerald-500/35">
              PROCESSING VOICE COMMAND
            </div>
          </div>
        </SpatialCard>

        {/* CARD 5 — Revenue */}
        <SpatialCard scrollYProgress={scrollYProgress} rangeIn={0.80} rangeOut={0.93}>
          <div className="w-full max-w-3xl bg-[#0a0e27]/85 border border-amber-500/40 rounded-[26px] backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.9)] p-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-5 mb-6">
              <div>
                <h2 className="text-3xl font-black text-white">REVENUE INTELLIGENCE</h2>
                <p className="text-[10px] text-amber-400 tracking-[4px] uppercase font-black mt-1">Status: Unlocked</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex-1 bg-black/40 border border-white/10 p-7 rounded-[18px] flex flex-col items-center text-center">
                <span className="text-white/45 text-[10px] font-bold tracking-widest uppercase">Monthly Revenue</span>
                <span ref={revRef} className="text-5xl font-black text-emerald-400 my-3">$0</span>
                <span className="text-cyan-400 font-bold text-sm">+321% vs Last Month</span>
              </div>
              <div className="flex-1 bg-black/40 border border-white/10 p-7 rounded-[18px] flex flex-col items-center text-center">
                <span className="text-white/45 text-[10px] font-bold tracking-widest uppercase">Direct Bookings</span>
                <span ref={bookRef} className="text-5xl font-black text-white my-3">0</span>
                <span className="text-amber-400 font-bold text-sm">0% Commission Paid</span>
              </div>
            </div>
          </div>
        </SpatialCard>

        {/* CARD 6 — Outro */}
        <SpatialCard scrollYProgress={scrollYProgress} rangeIn={0.93} rangeOut={1.0}>
          <div className="w-full max-w-xl bg-[#0a0e27]/85 border border-amber-500/40 rounded-[26px] backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.95)] p-12 flex flex-col items-center gap-5 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full scale-150" />
              <img src="/video-assets/vista-logo.png" alt="Vista Logo" className="w-24 h-auto rounded-[20px] border-2 border-amber-500/40 shadow-[0_0_30px_rgba(255,200,50,0.3)] relative z-10" />
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-[8px] text-white">THE VISTA</h1>
              <p className="text-sm tracking-[6px] font-light text-amber-400 mt-2">BY GlobeVistaHub</p>
            </div>
            <Link
              href="/"
              className="mt-2 bg-gradient-to-r from-amber-500 to-amber-600 border border-amber-400 hover:border-white px-10 py-4 rounded-full text-sm font-black tracking-[4px] uppercase text-black hover:text-white transition-all shadow-[0_0_40px_rgba(255,200,50,0.3)]"
            >
              LAUNCH PLATFORM
            </Link>
            <span className="text-[11px] text-white/25 tracking-widest uppercase">www.globevistahub.com</span>
          </div>
        </SpatialCard>

      </div>
    </div>
  );
}
