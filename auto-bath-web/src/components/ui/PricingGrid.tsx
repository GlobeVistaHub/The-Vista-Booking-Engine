'use client';
import { useBooking } from "@/context/BookingContext";

interface PricingGridProps {
  dynamicServices?: any[];
  dynamicContent?: Record<string, string>;
}

const defaultServices = [
  {
    id: "wash",
    title: "Premium Hand Wash",
    price: "FROM $80",
    description: "Meticulous two-bucket exterior wash, wheel face & barrel cleaning, and streak-free glass.",
    features: ["PH-Neutral Foam", "Microfiber Drying", "Tire Dressing", "Interior Vacuum"],
    popular: false,
    badge: null as string | null,
  },
  {
    id: "interior",
    title: "Interior Detailing",
    price: "FROM $150",
    description: "Deep extraction, steam cleaning, and UV protection for all interior surfaces.",
    features: ["Steam Sterilization", "Leather Conditioning", "Stain Removal", "Odor Neutralization"],
    popular: true,
    badge: "Most Requested",
  },
  {
    id: "paint",
    title: "Paint Correction",
    price: "FROM $400",
    description: "Multi-stage machine polishing to remove swirls, scratches, and oxidation.",
    features: ["Clay Bar Treatment", "Swirl Removal", "Gloss Enhancement", "Panel Wipe Prep"],
    popular: false,
    badge: null as string | null,
  },
  {
    id: "ceramic",
    title: "Ceramic Coating",
    price: "FROM $1,200",
    description: "9H hardness liquid quartz coating offering years of extreme gloss and protection.",
    features: ["5-Year Protection", "Extreme Hydrophobics", "Self-Cleaning", "Chemical Resistance"],
    popular: false,
    badge: null as string | null,
  },
  {
    id: "concourse",
    title: "Concourse Full Detail",
    price: "FROM $650",
    description: "The ultimate preservation package. Multi-stage machine paint correction, interior steam restoration, and engine bay detailing.",
    features: ["Comprehensive Interior Steam & Feed", "Multi-Stage Machine Correction", "Engine Bay Deep Rejuvenation", "Ceramic Sealant Finish", "Concourse Certificate"],
    popular: false,
    badge: "Flagship Edition",
  }
];

export default function PricingGrid({ dynamicServices = [], dynamicContent = {} }: PricingGridProps) {
  const { openBooking } = useBooking();

  // Map dynamic prices, titles, descriptions, and features from CMS / DB
  const mappedServices = defaultServices.map(service => {
    const customTitle = dynamicContent[`service_title_${service.id}`];
    const customDesc = dynamicContent[`service_desc_${service.id}`];
    const customPrice = dynamicContent[`service_price_${service.id}`];
    
    // Check if dynamic price exists in DB
    const dbService = dynamicServices.find(s => s.name === (customTitle || service.title) || s.name === service.title);
    
    // Check if customized features exist in CMS (one per line)
    const customFeaturesRaw = dynamicContent[`service_features_${service.id}`];
    const customFeatures = customFeaturesRaw
      ? customFeaturesRaw.split('\n').map(f => f.trim()).filter(Boolean)
      : null;

    return {
      ...service,
      title: customTitle || service.title,
      price: dbService 
        ? `FROM $${dbService.base_price / 100}` 
        : (customPrice ? (customPrice.startsWith("FROM") ? customPrice : `FROM $${customPrice}`) : service.price),
      description: customDesc || service.description,
      features: customFeatures && customFeatures.length > 0 ? customFeatures : service.features,
    };
  });

  return (
    <section id="services" className="relative w-full bg-[#050505] py-8 md:py-32 px-6 lg:px-12 z-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 relative z-10">
          <h2 className="font-heading font-bold text-xl md:text-5xl text-white tracking-tighter uppercase mb-4">
            {dynamicContent['services_headline'] || (
              <>Uncompromising <span className="text-electric-cyan">Detail</span></>
            )}
          </h2>
          <p className="font-mono text-white/80 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {dynamicContent['services_subheadline'] || "Melbourne's finest automotive rejuvenation services. We don't just wash cars; we restore them to concourse condition."}
          </p>
        </div>

        {/* The Responsive 5-Card Balanced Grid */}
        <div className="flex flex-wrap justify-center gap-8 relative z-10">
          {mappedServices.map((service, i) => (
            <div 
              key={service.id} 
              tabIndex={0}
              onClick={() => {}} // Tricks iOS Safari into allowing :hover states on touch
              className={`w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm flex flex-col justify-between relative group bg-[#050505]/60 backdrop-blur-md md:backdrop-blur-2xl border ${service.popular ? 'border-cyber-orange/80' : service.badge ? 'border-electric-cyan/60' : 'border-white/10'} rounded-2xl p-8 hover:bg-[#050505]/80 active:bg-[#050505]/90 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,194,212,0.15)] active:shadow-[0_0_40px_rgba(0,194,212,0.3)] hover:-translate-y-2 active:scale-[0.98] active:border-electric-cyan/50 cursor-pointer md:cursor-default`}
            >
              <div>
                {/* Badge (Most Requested or Flagship Edition) */}
                {service.badge && (
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 ${service.popular ? 'bg-cyber-orange text-[#050505] border-cyber-orange' : 'bg-electric-cyan text-[#050505] border-electric-cyan'} font-mono text-[10px] md:text-xs font-extrabold tracking-widest uppercase px-5 py-1.5 rounded-full shadow-md md:shadow-[0_0_15px_rgba(0,194,212,0.5)] border whitespace-nowrap`}>
                    {service.badge}
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
              </div>

              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  openBooking(service.id === "concourse" ? "concourse" : service.title.includes("Ceramic") ? "ceramic" : service.title.includes("Paint") ? "paint" : service.title.includes("Interior") ? "interior" : "wash"); 
                }}
                onTouchStart={() => {}} // Forces iOS to register :active CSS pseudo-classes instantly
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
