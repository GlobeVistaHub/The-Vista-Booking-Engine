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
  },
  {
    id: "ppf",
    title: "Paint Protection Film (PPF)",
    price: "FROM $1,800",
    description: "Full front or whole vehicle ultra-durable self-healing TPU film providing impenetrable defense against stone chips, scratches, and UV damage.",
    features: ["Self-Healing Polymer", "Rock Chip Protection", "Optical Clarity Finish", "10-Year Warranty"],
    popular: false,
    badge: "Armor Defense",
  },
  {
    id: "leather",
    title: "Leather Hide Rejuvenation",
    price: "FROM $450",
    description: "Artisanal pH-balanced deep pore extraction, hydration oil replenishment, and matte barrier finish to restore factory suppleness without artificial shine.",
    features: ["Pore-Deep Extraction", "Natural Oil Replenishment", "Zero-Grease Factory Matte", "UV Anti-Cracking Barrier"],
    popular: false,
    badge: "Artisan Care",
  },
  {
    id: "engine",
    title: "Engine Bay Precision Detail",
    price: "FROM $250",
    description: "Surgical dry-ice and vapor degreasing of all engine bay plastics, metals, and firewall, sealed with an anti-static heat-resistant dressed finish.",
    features: ["Sensitive Component Masking", "Precision Vapor Degreasing", "Heat-Resistant Dressing", "Anti-Static Dust Repellent"],
    popular: false,
    badge: "Surgical Clean",
  },
  {
    id: "graphene",
    title: "Graphene Matrix 10H",
    price: "FROM $1,500",
    description: "Next-generation reduced graphene oxide matrix offering extreme 10H hardness, anti-static dust repelling, and permanent mirror-sheen.",
    features: ["10H Diamond-Grade Hardness", "Anti-Static Dust Dissipation", "Zero Water-Spot Technology", "7-Year Certified Warranty"],
    popular: false,
    badge: "Next-Gen Shield",
  }
];

export default function PricingGrid({ dynamicServices = [], dynamicContent = {} }: PricingGridProps) {
  const { openBooking } = useBooking();

  const packageIdMap: Record<string, string> = {
    wash: "c2a502e8-e825-4876-b459-9334e801e363",
    interior: "a92d99bf-11be-4afb-9860-5844233d2899",
    paint: "4b293e74-9b13-4af4-8901-49ac014ad043",
    concourse: "49d0b87f-744d-4bf8-9821-2df1f9c67a60",
    ceramic: "f90656aa-808f-41f4-a789-7dcf6a934df8",
    ppf: "7d2e4a81-9b51-4e1a-8f12-9c3f6e8a0112",
    leather: "5c3d1e92-8a40-4d2b-9e23-8b2e5f7a0223",
    engine: "3b1c9d83-7f39-4c3a-8d34-7a1e4d6a0334",
    graphene: "9e4f1a2b-3c5d-4e6f-8a0b-1c2d3e4f5a6b",
  };

  // Map dynamic prices, titles, descriptions, and features from CMS / DB
  const mappedServices = defaultServices.map(service => {
    const customTitle = dynamicContent[`service_title_${service.id}`];
    const customDesc = dynamicContent[`service_desc_${service.id}`];
    const customPrice = dynamicContent[`service_price_${service.id}`];
    
    // Check if dynamic price exists in DB by ID or fallback by name
    const dbService = dynamicServices.find(s => s.id === packageIdMap[service.id] || s.name === (customTitle || service.title) || s.name === service.title);
    
    // Check if customized features exist in CMS (one per line)
    const customFeaturesRaw = dynamicContent[`service_features_${service.id}`];
    const customFeatures = customFeaturesRaw
      ? customFeaturesRaw.split('\n').map(f => f.trim()).filter(Boolean)
      : null;

    return {
      ...service,
      title: customTitle || (dbService ? dbService.name : service.title),
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
              id={`service-${service.id}`}
              tabIndex={0}
              onClick={() => {}} // Tricks iOS Safari into allowing :hover states on touch
              className={`w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm flex flex-col justify-between relative group bg-[#050505]/60 backdrop-blur-md md:backdrop-blur-2xl border ${service.popular ? 'border-cyber-orange/80' : service.badge ? 'border-electric-cyan/60' : 'border-white/10'} rounded-2xl p-8 hover:bg-[#050505]/80 active:bg-[#050505]/90 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,194,212,0.15)] active:shadow-[0_0_40px_rgba(0,194,212,0.3)] hover:-translate-y-2 active:scale-[0.98] active:border-electric-cyan/50 cursor-pointer md:cursor-default scroll-mt-28 md:scroll-mt-36 target:border-electric-cyan target:ring-2 target:ring-electric-cyan/60 target:shadow-[0_0_50px_rgba(0,194,212,0.4)] target:scale-[1.02]`}
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
                  openBooking(service.id); 
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
