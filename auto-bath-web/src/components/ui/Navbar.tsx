"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useBooking } from '@/context/BookingContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { openBooking } = useBooking();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        {/* The Docked Glass Card */}
        <div className="bg-vantablack/40 backdrop-blur-xl border-x border-b border-white/10 rounded-b-3xl flex items-center justify-between px-6 py-3 shadow-2xl">
        
        {/* The Master Transparent Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image 
              src="/transparent.png" 
              alt="Auto-Bath Luxury Detailing" 
              width={500} 
              height={160} 
              className="object-contain h-16 md:h-28 lg:h-36 w-auto scale-[1.2] md:scale-[1.4] origin-left"
              priority
            />
          </Link>
        </div>

        {/* Center Navigation Links (Hidden on mobile) */}
        <div className="hidden lg:flex items-center space-x-12">
          <a href="#services" className="text-lg font-semibold text-liquid-silver hover:text-white transition-colors tracking-wide">
            Services
          </a>
          <a href="#vault" className="text-lg font-semibold text-liquid-silver hover:text-white transition-colors tracking-wide">
            The Vault
          </a>
          <a href="#location" className="text-lg font-semibold text-liquid-silver hover:text-white transition-colors tracking-wide">
            Location
          </a>
        </div>

        {/* The Action Button */}
        <div className="flex-shrink-0">
          <button 
            onClick={() => openBooking()}
            className="relative overflow-hidden group px-5 py-2 md:px-6 md:py-2.5 rounded-full bg-cyber-orange text-vantablack font-bold text-[10px] md:text-sm transition-all duration-500 whitespace-nowrap uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_30px_rgba(255,102,0,0.8)] will-change-transform"
            style={{ transform: "translateZ(0)", backfaceVisibility: "hidden", WebkitFontSmoothing: "antialiased" }}
          >
            <span className="relative z-10">BOOK NOW</span>
            {/* The Glass Shimmer Sheen (Disabled on touch devices so it doesn't get stuck) */}
            <div className="absolute top-0 left-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[120%] lg:group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-[45deg]" />
          </button>
        </div>

        </div>
      </div>

      {/* Mobile Floating Pills */}
      <div className="flex lg:hidden justify-center gap-3 max-w-7xl mx-auto mt-2 px-2">
        <a href="#services" className="px-4 py-1.5 bg-vantablack/60 backdrop-blur-xl border border-white/10 rounded-full text-[10px] text-white uppercase font-bold tracking-widest shadow-xl hover:bg-electric-cyan/20 hover:border-electric-cyan/50 transition-all">Services</a>
        <a href="#vault" className="px-4 py-1.5 bg-vantablack/60 backdrop-blur-xl border border-white/10 rounded-full text-[10px] text-white uppercase font-bold tracking-widest shadow-xl hover:bg-electric-cyan/20 hover:border-electric-cyan/50 transition-all">The Vault</a>
        <a href="#location" className="px-4 py-1.5 bg-vantablack/60 backdrop-blur-xl border border-white/10 rounded-full text-[10px] text-white uppercase font-bold tracking-widest shadow-xl hover:bg-electric-cyan/20 hover:border-electric-cyan/50 transition-all">Location</a>
      </div>
    </nav>
  );
}
