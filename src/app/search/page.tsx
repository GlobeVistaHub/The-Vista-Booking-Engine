"use client";

import { useState } from "react";
import { SlidersHorizontal, Map, X } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { useLanguage } from "@/context/LanguageContext";

const SEARCH_RESULTS = [
  {
    id: 1,
    title: "Villa Serenity",
    title_ar: "فيلا سيرينيتي",
    type: "entireVilla",
    guests: "8",
    bedrooms: "4",
    location: "El Gouna",
    location_ar: "الجونة",
    price: 450,
    rating: 4.9,
    reviews: 124,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    ],
    tags: ["tagPrivatePool", "tagRedSeaView", "tagButlerService"],
  },
  {
    id: 2,
    title: "The Azure Penthouse",
    title_ar: "البنتهاوس الأزرق",
    type: "luxuryApartment",
    guests: "4",
    bedrooms: "2",
    location: "Sahl Hasheesh",
    location_ar: "سهل حشيش",
    price: 320,
    rating: 5.0,
    reviews: 89,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    ],
    tags: ["tagPanoramicViews", "tagBeachAccess"],
  },
  {
    id: 3,
    title: "Sea Breeze Estate",
    title_ar: "عقار النسيم البحري",
    type: "entireEstate",
    guests: "12",
    bedrooms: "6",
    location: "Soma Bay",
    location_ar: "صوما باي",
    price: 850,
    rating: 4.8,
    reviews: 42,
    images: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    ],
    tags: ["tagGolfCourseView", "tagChefIncluded"],
  },
];

export default function SearchResultsPage() {
  const { t } = useLanguage();
  const [showMap, setShowMap] = useState(false);
  const [selectedPin, setSelectedPin] = useState<number | null>(null);

  const togglePin = (pin: number) =>
    setSelectedPin(prev => (prev === pin ? null : pin));

  return (
    <div className="w-full flex relative">

      {/* LEFT COLUMN: THE INVENTORY — full width on mobile, half on desktop */}
      <section className="w-full lg:w-1/2 flex flex-col pb-24 lg:pb-0">

        {/* HEADER TEXT — padded */}
        <div className="px-4 sm:px-6 lg:px-12 pt-8 pb-4">
          <p className="text-sm font-medium text-muted mb-2">{t('searchHeaderSubtitle')}</p>
          <h1 className="text-2xl sm:text-3xl font-heading font-medium text-navy tracking-tight">
            {t('searchHeaderTitle')}
          </h1>
        </div>

        {/* FILTERS — scrollable with a gradient fade to indicate more content */}
        <div className="relative border-b border-navy/5">
          <div className="overflow-x-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-3 pl-4 sm:pl-6 lg:pl-12 pr-16 w-max">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-navy/20 text-sm font-medium text-navy hover:border-navy transition-colors whitespace-nowrap flex-shrink-0">
                <SlidersHorizontal className="w-4 h-4" /> {t('filtersOut')}
              </button>
              <button className="px-4 py-2 rounded-full border border-navy/20 text-sm font-medium text-navy hover:border-navy transition-colors whitespace-nowrap flex-shrink-0">
                {t('typeOfPlace')}
              </button>
              <button className="px-4 py-2 rounded-full border border-navy/20 text-sm font-medium text-navy hover:border-navy transition-colors whitespace-nowrap flex-shrink-0">
                {t('price')}
              </button>
              <button className="px-4 py-2 rounded-full border border-navy/20 text-sm font-medium text-navy hover:border-navy transition-colors whitespace-nowrap flex-shrink-0">
                {t('instantBook')}
              </button>
            </div>
          </div>
          {/* Gradient fade — Airbnb standard, signals scroll without cutting harshly */}
          <div className="lg:hidden absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#FAFAF8] via-[#FAFAF8]/80 to-transparent pointer-events-none" />
        </div>

        {/* RESULTS FEED — full width cards on mobile */}
        <div className="px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-4">
          {SEARCH_RESULTS.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* RIGHT COLUMN: THE MAP — hidden on mobile, sticky on desktop */}
      <section className="hidden lg:block w-1/2 h-[calc(100vh-5rem)] sticky top-20 border-l border-navy/5 relative overflow-hidden">
        {/* PROTOTYPE MAP BACKGROUND */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')",
            filter: "grayscale(20%) contrast(110%) brightness(105%)"
          }}
        />
        <div className="absolute inset-0 bg-primary/[0.03]" />

        {/* PROTOTYPE CSS PINS */}
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer antialiased">
          <div className="bg-surface text-navy font-bold text-sm px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] group-hover:bg-navy group-hover:text-white transition-colors duration-200">
            $450
          </div>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-surface mt-[-1px] group-hover:border-t-navy transition-colors duration-200"></div>
        </div>

        <div className="absolute top-[45%] right-[30%] flex flex-col items-center group cursor-pointer antialiased">
          <div className="bg-surface text-navy font-bold text-sm px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] group-hover:bg-navy group-hover:text-white transition-colors duration-200">
            $320
          </div>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-surface mt-[-1px] group-hover:border-t-navy transition-colors duration-200"></div>
        </div>

        <div className="absolute bottom-[25%] left-[48%] flex flex-col items-center group cursor-pointer antialiased">
          <div className="bg-surface text-navy font-bold text-sm px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] group-hover:bg-navy group-hover:text-white transition-colors duration-200">
            $850
          </div>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-surface mt-[-1px] group-hover:border-t-navy transition-colors duration-200"></div>
        </div>

        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-surface/90 backdrop-blur-md px-6 py-2 rounded-full shadow-md text-xs font-bold text-navy tracking-widest uppercase border border-navy/10 z-10">
          {t('prototypeMap')}
        </div>
      </section>

      {/* MOBILE ONLY: Floating "Map View" pill button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setShowMap(true)}
          className="flex items-center gap-2.5 px-6 py-3.5 bg-navy text-white rounded-full shadow-2xl font-bold text-sm hover:bg-navy/90 active:scale-95 transition-all"
        >
          <Map className="w-4 h-4" />
          <span>{t('mapView')}</span>
        </button>
      </div>

      {/* MOBILE MAP MODAL — full screen slide-up overlay */}
      {showMap && (
        <div className="lg:hidden fixed inset-0 z-[100] flex flex-col">
          {/* Map background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')",
              filter: "grayscale(20%) contrast(110%) brightness(105%)"
            }}
          />
          <div className="absolute inset-0 bg-primary/[0.03]" />

          {/* Mobile map pins — click to select (stays navy), click again to deselect */}
          <div
            onClick={() => togglePin(450)}
            className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer antialiased"
          >
            <div className={`font-bold text-sm px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-colors duration-200 ${selectedPin === 450 ? 'bg-navy text-white' : 'bg-surface text-navy'}`}>$450</div>
            <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] mt-[-1px] transition-colors duration-200 ${selectedPin === 450 ? 'border-t-navy' : 'border-t-surface'}`}></div>
          </div>
          <div
            onClick={() => togglePin(320)}
            className="absolute top-[45%] right-[30%] flex flex-col items-center cursor-pointer antialiased"
          >
            <div className={`font-bold text-sm px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-colors duration-200 ${selectedPin === 320 ? 'bg-navy text-white' : 'bg-surface text-navy'}`}>$320</div>
            <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] mt-[-1px] transition-colors duration-200 ${selectedPin === 320 ? 'border-t-navy' : 'border-t-surface'}`}></div>
          </div>
          <div
            onClick={() => togglePin(850)}
            className="absolute bottom-[30%] left-[48%] flex flex-col items-center cursor-pointer antialiased"
          >
            <div className={`font-bold text-sm px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-colors duration-200 ${selectedPin === 850 ? 'bg-navy text-white' : 'bg-surface text-navy'}`}>$850</div>
            <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] mt-[-1px] transition-colors duration-200 ${selectedPin === 850 ? 'border-t-navy' : 'border-t-surface'}`}></div>
          </div>

          {/* Prototype label */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-surface/90 backdrop-blur-md px-5 py-2 rounded-full shadow-md text-xs font-bold text-navy tracking-widest uppercase border border-navy/10 z-10">
            {t('prototypeMap')}
          </div>

          {/* Close / List View button — translated */}
          <button
            onClick={() => setShowMap(false)}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3.5 bg-navy text-white rounded-full shadow-2xl font-bold text-sm z-10"
          >
            <X className="w-4 h-4" />
            <span>{t('listView')}</span>
          </button>
        </div>
      )}

    </div>
  );
}
