"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Sparkles, MessageCircle } from "lucide-react";

export default function Footer({ dynamicContent = {} }: { dynamicContent?: Record<string, string> }) {
  const ensureHttp = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:')) return url;
    return `https://${url}`;
  };

  const instagram = ensureHttp(dynamicContent['social_instagram'] || "https://instagram.com");
  const facebook = ensureHttp(dynamicContent['social_facebook'] || "https://facebook.com");
  const tiktok = ensureHttp(dynamicContent['social_tiktok'] || "https://tiktok.com");
  const email = dynamicContent['contact_email'] || "booking@autobath.com.au";
  const phone = dynamicContent['contact_phone'] || "+61 400 764 508";
  
  // Clean phone number for WhatsApp link
  const rawPhone = phone.replace(/[^0-9]/g, '');
  // Default to Australian country code if they just type 04...
  const waPhone = rawPhone.startsWith('0') ? `61${rawPhone.substring(1)}` : rawPhone;
  return (
    <>
      <footer className="relative bg-vantablack pt-12 md:pt-24 pb-12 border-t border-white/5 overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[400px] bg-electric-cyan/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 pr-0 lg:pr-12">
              <Link href="/" className="inline-block mb-6">
                <Image 
                  src={dynamicContent['site_logo'] || "/transparent.png"} 
                  alt="Auto-Bath Detailing" 
                  width={300} 
                  height={120} 
                  className="object-contain h-20 w-auto origin-left opacity-90 hover:opacity-100 transition-opacity"
                />
              </Link>
              <p className="text-white/50 text-sm font-sans mb-8 leading-relaxed">
                Elevating automotive care to an art form. Exclusive hand-washing, meticulous detailing, and concourse-level restoration for those who demand absolute perfection.
              </p>
              <div className="flex space-x-4">
                <a href={instagram} target="_blank" rel="noopener noreferrer" onTouchStart={() => {}} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-electric-cyan active:bg-electric-cyan hover:text-[#050505] active:text-[#050505] hover:border-electric-cyan active:border-electric-cyan hover:scale-110 active:scale-110 transition-all duration-300 shadow-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href={facebook} target="_blank" rel="noopener noreferrer" onTouchStart={() => {}} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-electric-cyan active:bg-electric-cyan hover:text-[#050505] active:text-[#050505] hover:border-electric-cyan active:border-electric-cyan hover:scale-110 active:scale-110 transition-all duration-300 shadow-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href={tiktok} target="_blank" rel="noopener noreferrer" onTouchStart={() => {}} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-electric-cyan active:bg-electric-cyan hover:text-[#050505] active:text-[#050505] hover:border-electric-cyan active:border-electric-cyan hover:scale-110 active:scale-110 transition-all duration-300 shadow-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1 lg:col-span-1 lg:pl-8 lg:pt-4">
              <h4 className="text-white font-heading font-bold uppercase tracking-widest mb-6 text-sm">Quick Links</h4>
              <ul className="space-y-4">
                <li><Link href="/#services" className="text-white/50 hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300 text-sm font-sans">Our Services</Link></li>
                <li><Link href="/insights" className="text-white/50 hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300 text-sm font-sans">Detailing Insights</Link></li>
                <li><Link href="/#vault" className="text-white/50 hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300 text-sm font-sans">The Vault</Link></li>
                <li><Link href="/#location" className="text-white/50 hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300 text-sm font-sans">Find Us</Link></li>
                <li><Link href="/#services" className="text-white/50 hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300 text-sm font-sans">Book an Appointment</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className="col-span-1 lg:col-span-1 lg:pt-4">
              <h4 className="text-white font-heading font-bold uppercase tracking-widest mb-6 text-sm">Specialties</h4>
              <ul className="space-y-4">
                <li><Link href="/#services" className="text-white/50 text-sm font-sans hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300">Premium Hand Wash</Link></li>
                <li><Link href="/#services" className="text-white/50 text-sm font-sans hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300">Paint Correction</Link></li>
                <li><Link href="/#services" className="text-white/50 text-sm font-sans hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300">Ceramic Coating</Link></li>
                <li><Link href="/#services" className="text-white/50 text-sm font-sans hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300">Interior Detailing</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-span-1 lg:col-span-1 lg:pt-4">
              <h4 className="text-white font-heading font-bold uppercase tracking-widest mb-6 text-sm">Contact</h4>
              <ul className="space-y-4">
                <li className="group cursor-pointer">
                  <a href="https://maps.google.com/?q=64+Bulla+Rd,+Strathmore,+VIC+3041" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4">
                    <MapPin size={18} className="text-electric-cyan flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-white/50 text-sm font-sans group-hover:text-white transition-colors">64 Bulla Rd,<br/>Strathmore, VIC 3041</span>
                  </a>
                </li>
                <li className="flex items-center gap-4 group">
                  <Phone size={18} className="text-electric-cyan flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <a href={`tel:${rawPhone}`} className="text-white/50 text-sm font-sans group-hover:text-white transition-colors">{phone}</a>
                </li>
                <li className="flex items-center gap-4 group">
                  <Mail size={18} className="text-electric-cyan flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <a href={`mailto:${email}`} className="text-white/50 text-sm font-sans group-hover:text-white transition-colors">{email}</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile Concierge Block */}
          <div className="md:hidden pt-8 pb-8 flex flex-col gap-4 relative z-10">
            <h4 className="text-white font-heading font-bold uppercase tracking-widest text-center text-sm mb-2">Digital Concierge</h4>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).openAIConcierge) {
                    (window as any).openAIConcierge();
                  }
                }}
                className="flex-1 py-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-electric-cyan hover:text-black hover:border-electric-cyan active:bg-electric-cyan active:text-black active:scale-95 transition-all text-white shadow-[0_0_30px_rgba(0,194,212,0.1)]"
              >
                <Sparkles size={24} className="text-electric-cyan" />
                <span className="text-xs font-bold uppercase tracking-widest">Ask AI</span>
              </button>
              <a 
                href={`https://wa.me/${waPhone}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 py-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] active:bg-[#25D366] active:text-white active:scale-95 transition-all text-white shadow-[0_0_30px_rgba(37,211,102,0.1)]"
              >
                <MessageCircle size={24} className="text-[#25D366]" />
                <span className="text-xs font-bold uppercase tracking-widest">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Copyright Line */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/30 text-xs font-mono flex flex-wrap justify-center md:justify-start items-center gap-3">
              <span>&copy; {new Date().getFullYear()} Auto-Bath Detailing. All rights reserved.</span>
              <span className="hidden md:inline text-white/10">|</span>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span className="text-white/10">|</span>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
            <p className="text-white/30 text-xs font-mono flex items-center gap-2 uppercase">
              Architected by <span className="text-cyber-orange font-bold tracking-widest hover:text-white transition-colors cursor-pointer">GoodBrains.Pro</span>
            </p>
          </div>
        </div>
      </footer>

    </>
  );
}
