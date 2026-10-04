'use client';
import { useBooking } from "@/context/BookingContext";

const services = [
  {
    title: "Premium Hand Wash",
    price: "FROM $80",
    description: "Meticulous two-bucket exterior wash, wheel face & barrel cleaning, and streak-free glass.",
    features: ["PH-Neutral Foam", "Microfiber Drying", "Tire Dressing", "Interior Vacuum"],
    popular: false,
  },
  {
    title: "Interior Detailing",
    price: "FROM $150",
    description: "Deep extraction, steam cleaning, and UV protection for all interior surfaces.",
    features: ["Steam Sterilization", "Leather Conditioning", "Stain Removal", "Odor Neutralization"],
    popular: true,
  },
  {
    title: "Paint Correction",
    price: "FROM $400",
    description: "Multi-stage machine polishing to remove swirls, scratches, and oxidation.",
    features: ["Clay Bar Treatment", "Swirl Removal", "Gloss Enhancement", "Panel Wipe Prep"],
    popular: false,
  },
  {
    title: "Ceramic Coating",
    price: "FROM $1,200",
    description: "9H hardness liquid quartz coating offering years of extreme gloss and protection.",
    features: ["5-Year Protection", "Extreme Hydrophobics", "Self-Cleaning", "Chemical Resistance"],
    popular: false,
  }
];

export default function PricingGrid() {
  const { openBooking } = useBooking();

  return (
    <section id="services" className="relative w-full bg-[#050505] py-24 md:py-32 px-6 lg:px-12 z-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 relative z-10">
          <h2 className="font-heading font-bold text-xl md:text-5xl text-white tracking-tighter uppercase mb-4">
            Uncompromising <span className="text-electric-cyan">Detail</span>
          </h2>
          <p className="font-mono text-white/80 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Melbourne's finest automotive rejuvenation services. We don't just wash cars; we restore them to concourse condition.
          </p>
        </div>

        {/* The Glassmorphism Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {services.map((service, i) => (
            <div 
              key={i} 
              tabIndex={0}
              onClick={() => {}} // Tricks iOS Safari into allowing :hover states on touch
              className={`relative group bg-[#050505]/60 backdrop-blur-2xl border ${service.popular ? 'border-cyber-orange/80' : 'border-white/10'} rounded-2xl p-8 hover:bg-[#050505]/80 active:bg-[#050505]/90 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,194,212,0.15)] active:shadow-[0_0_40px_rgba(0,194,212,0.3)] hover:-translate-y-2 active:scale-[0.98] active:border-electric-cyan/50 cursor-pointer md:cursor-default`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyber-orange text-[#050505] font-mono text-[10px] md:text-sm font-extrabold tracking-widest uppercase px-5 py-1.5 rounded-full shadow-md md:shadow-[0_0_15px_rgba(255,107,0,0.5)] border border-cyber-orange whitespace-nowrap">
                  Most Requested
                </div>
              )}
              
              <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wider mb-2">{service.title}</h3>
              <div className="font-mono text-electric-cyan text-2xl mb-4 drop-shadow-[0_0_8px_rgba(0,194,212,0.5)]">{service.price}</div>
              <p className="text-sm text-white/70 mb-8 min-h-[60px] leading-relaxed">{service.description}</p>
              
              <ul className="space-y-4 mb-10">
                {service.features.map((feature, j) => (
                  <li key={j} className="flex items-center text-sm text-white/90">
                    <svg className="w-5 h-5 text-electric-cyan mr-3 flex-shrink-0 drop-shadow-[0_0_5px_rgba(0,194,212,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={(e) => { e.stopPropagation(); openBooking(service.title.includes("Ceramic") ? "ceramic" : service.title.includes("Paint") ? "paint" : service.title.includes("Interior") ? "interior" : "wash"); }}
                className={`w-full py-4 rounded-lg font-heading font-bold uppercase tracking-widest transition-all duration-300 active:scale-[0.98] ${service.popular ? 'bg-cyber-orange text-[#050505] hover:bg-white active:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] active:shadow-[0_0_20px_rgba(255,255,255,0.8)]' : 'bg-white/5 text-white border border-white/10 hover:bg-electric-cyan active:bg-electric-cyan hover:border-electric-cyan active:border-electric-cyan hover:text-[#050505] active:text-[#050505] hover:shadow-[0_0_20px_rgba(0,194,212,0.5)] active:shadow-[0_0_20px_rgba(0,194,212,0.8)]'}`}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background ambient light for the grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[500px] bg-electric-cyan/5 rounded-full blur-[120px] z-0 pointer-events-none" />
    </section>
  );
}
