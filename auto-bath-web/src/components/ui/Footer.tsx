import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <>
      <footer className="relative bg-vantablack pt-24 pb-12 border-t border-white/5 overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[400px] bg-electric-cyan/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 pr-0 lg:pr-12">
              <Link href="/" className="inline-block mb-6">
                <Image 
                  src="/transparent.png" 
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
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-electric-cyan hover:text-[#050505] hover:border-electric-cyan hover:scale-110 transition-all duration-300 shadow-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-electric-cyan hover:text-[#050505] hover:border-electric-cyan hover:scale-110 transition-all duration-300 shadow-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-electric-cyan hover:text-[#050505] hover:border-electric-cyan hover:scale-110 transition-all duration-300 shadow-lg">
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
                <li><a href="/#services" className="text-white/50 hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300 text-sm font-sans">Our Services</a></li>
                <li><a href="/#vault" className="text-white/50 hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300 text-sm font-sans">The Vault</a></li>
                <li><a href="/#location" className="text-white/50 hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300 text-sm font-sans">Find Us</a></li>
                <li><a href="/#services" className="text-white/50 hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300 text-sm font-sans">Book an Appointment</a></li>
              </ul>
            </div>

            {/* Services */}
            <div className="col-span-1 lg:col-span-1 lg:pt-4">
              <h4 className="text-white font-heading font-bold uppercase tracking-widest mb-6 text-sm">Specialties</h4>
              <ul className="space-y-4">
                <li><a href="/#services" className="text-white/50 text-sm font-sans hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300">Premium Hand Wash</a></li>
                <li><a href="/#services" className="text-white/50 text-sm font-sans hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300">Paint Correction</a></li>
                <li><a href="/#services" className="text-white/50 text-sm font-sans hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300">Ceramic Coating</a></li>
                <li><a href="/#services" className="text-white/50 text-sm font-sans hover:text-electric-cyan hover:translate-x-1 inline-block transition-all duration-300">Interior Detailing</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-span-1 lg:col-span-1 lg:pt-4">
              <h4 className="text-white font-heading font-bold uppercase tracking-widest mb-6 text-sm">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 group">
                  <MapPin size={18} className="text-electric-cyan flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-white/50 text-sm font-sans group-hover:text-white transition-colors">64 Bulla Rd,<br/>Strathmore, VIC 3041</span>
                </li>
                <li className="flex items-center gap-4 group">
                  <Phone size={18} className="text-electric-cyan flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-white/50 text-sm font-sans group-hover:text-white transition-colors">+61 400 764 508</span>
                </li>
                <li className="flex items-center gap-4 group">
                  <Mail size={18} className="text-electric-cyan flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-white/50 text-sm font-sans group-hover:text-white transition-colors">booking@autobath.com.au</span>
                </li>
              </ul>
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

      {/* GLOBAL FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/61400764508" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-40 right-6 md:bottom-6 md:right-6 z-[100] bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,211,102,0.5)] hover:shadow-[0_0_40px_rgba(37,211,102,0.8)] hover:scale-110 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8"
        aria-label="Chat on WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
}
