import HeroCar from '@/components/3d/HeroCar';
import PricingGrid from '@/components/ui/PricingGrid';
import Navbar from '@/components/ui/Navbar';
import TheVault from '@/components/ui/TheVault';
import TheLocation from '@/components/ui/TheLocation';
import FAQ from '@/components/ui/FAQ';
import Footer from '@/components/ui/Footer';

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen overflow-x-hidden">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        {/* The 3D Interactive WebGL Car Background */}
        <HeroCar />
        
        {/* Navigation Bar overlay */}
        <Navbar />

        {/* Hero Text */}
        <div className="relative z-40 text-center mt-4 md:mt-20 pointer-events-none flex flex-col items-center gap-4 md:gap-6">
          <h1 className="font-heading font-bold text-3xl md:text-7xl text-white tracking-tighter uppercase leading-tight [text-shadow:0_4px_15px_rgba(0,0,0,1)] md:[text-shadow:0_10px_40px_rgba(0,0,0,1),_0_2px_10px_rgba(0,0,0,0.8)]">
            CLEANER <span className="text-cyber-orange bg-electric-cyan/20 md:backdrop-blur-md px-3 py-1 md:px-4 md:py-1 rounded-xl border border-electric-cyan/30 inline-block shadow-[0_0_10px_rgba(0,194,212,0.2)] md:shadow-[0_0_20px_rgba(0,194,212,0.2)]">CARS</span><br/>
            HAPPIER DRIVERS
          </h1>
          
          <div className="inline-block bg-[#050505]/60 backdrop-blur-xl border border-white/10 px-6 py-3 md:px-8 md:py-3 rounded-full shadow-2xl mx-4 md:mx-0">
            <p className="shimmer-text text-sm md:text-lg max-w-lg mx-auto">
              Melbourne's premier hand car wash and uncompromising luxury detailing facility
            </p>
          </div>
        </div>

        {/* Dedicated high-z-index portal target for 3D Popups */}
        <div id="popup-root" className="absolute inset-0 z-50 pointer-events-none" />

        {/* Cyber-Luxury Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce pointer-events-none">
          <span className="text-[11px] font-mono font-bold text-electric-cyan tracking-[0.4em] uppercase drop-shadow-[0_0_10px_rgba(0,194,212,0.8)]">Scroll</span>
          <div className="w-6 h-10 border-2 border-electric-cyan/80 rounded-full flex justify-center p-1 shadow-[0_0_25px_rgba(0,194,212,0.6)] bg-[#050505]/80 backdrop-blur-md">
            <div className="w-1.5 h-2.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,1)]" />
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-electric-cyan/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* MOBILE SAFE SCROLL ZONES: These sit on top of the 3D canvas to guarantee scrolling works at the top/bottom of the screen, while leaving the middle open for car rotation */}
        <div className="absolute top-0 left-0 w-full h-[25vh] z-30 md:hidden" style={{ touchAction: 'pan-y' }} />
        <div className="absolute bottom-0 left-0 w-full h-[25vh] z-30 md:hidden" style={{ touchAction: 'pan-y' }} />
      </section>

      {/* ================= SERVICES PRICING GRID ================= */}
      <PricingGrid />
      
      {/* ================= THE VAULT ================= */}
      <TheVault />

      {/* ================= FAQ ================= */}
      <FAQ />
      
      {/* ================= LOCATION & MAP ================= */}
      <TheLocation />
      
      {/* ================= FOOTER ================= */}
      <Footer />
      
    </main>
  );
}
