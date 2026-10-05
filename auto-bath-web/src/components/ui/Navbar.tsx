"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useBooking } from '@/context/BookingContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { openBooking } = useBooking();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-2 md:px-6">
      <div className="max-w-7xl mx-auto bg-vantablack/40 backdrop-blur-xl border-x border-b border-white/10 rounded-b-3xl flex items-center justify-between px-3 md:px-6 py-3 shadow-2xl">
        
        {/* The Master Transparent Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image 
              src="/transparent.png" 
              alt="Auto-Bath Luxury Detailing" 
              width={500} 
              height={160} 
              className="object-contain h-14 md:h-28 lg:h-36 w-auto md:scale-[1.4] md:origin-left"
              priority
            />
          </Link>
        </div>

        {/* Center Navigation Links (Scaled to fit mobile) */}
        <div className="flex items-center space-x-2 md:space-x-12 translate-y-1 md:translate-y-0">
          <a href="#services" className="text-[9px] md:text-lg font-semibold text-liquid-silver hover:text-electric-cyan active:text-electric-cyan active:drop-shadow-[0_0_8px_rgba(0,194,212,0.8)] md:hover:drop-shadow-[0_0_8px_rgba(0,194,212,0.8)] transition-all duration-300 tracking-wide uppercase md:capitalize whitespace-nowrap">
            Services
          </a>
          <a href="#vault" className="text-[9px] md:text-lg font-semibold text-liquid-silver hover:text-electric-cyan active:text-electric-cyan active:drop-shadow-[0_0_8px_rgba(0,194,212,0.8)] md:hover:drop-shadow-[0_0_8px_rgba(0,194,212,0.8)] transition-all duration-300 tracking-wide uppercase md:capitalize whitespace-nowrap">
            The Vault
          </a>
          <a href="#location" className="text-[9px] md:text-lg font-semibold text-liquid-silver hover:text-electric-cyan active:text-electric-cyan active:drop-shadow-[0_0_8px_rgba(0,194,212,0.8)] md:hover:drop-shadow-[0_0_8px_rgba(0,194,212,0.8)] transition-all duration-300 tracking-wide uppercase md:capitalize whitespace-nowrap">
            Location
          </a>
        </div>

        {/* The Action Button */}
        <div className="flex-shrink-0">
          <button 
            onClick={() => openBooking()}
            onTouchStart={() => {}} // Forces iOS to register :active CSS pseudo-classes instantly
            className="relative overflow-hidden group px-3 py-1.5 md:px-6 md:py-2.5 rounded-full bg-cyber-orange text-vantablack font-bold text-[9px] md:text-sm transition-all duration-300 whitespace-nowrap uppercase tracking-widest scale-90 origin-right md:scale-100 hover:scale-105 active:scale-95 active:shadow-[0_0_30px_rgba(255,102,0,0.8)] hover:shadow-[0_0_30px_rgba(255,102,0,0.8)] will-change-transform"
            style={{ transform: "translateZ(0)", backfaceVisibility: "hidden", WebkitFontSmoothing: "antialiased" }}
          >
            <span className="relative z-10">BOOK NOW</span>
            {/* The Glass Shimmer Sheen (Disabled on touch devices so it doesn't get stuck) */}
            <div className="absolute top-0 left-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[120%] lg:group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-[45deg]" />
          </button>
        </div>

      </div>
    </nav>
  );
}
