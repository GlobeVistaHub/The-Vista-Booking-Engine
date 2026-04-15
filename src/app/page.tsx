"use client";

import { useEffect, useState } from "react";
import { MapPin, Heart, Star } from "lucide-react";
import Link from "next/link";
import BookingWidget from "@/components/BookingWidget";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { getProperties } from "@/data/api";
import { Property } from "@/data/properties";

export default function Home() {
  const { t, lang } = useLanguage();
  const { toggleWishlist, isInWishlist } = useUser();
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    getProperties({ includeHidden: false }).then(setProperties);
  }, []);

  return (
    <main className="w-full min-h-screen pb-24">
      {/* 1. THE HERO SECTION */}
      <div className="relative w-full min-h-[85vh] flex flex-col items-center justify-start pt-[18vh] md:pt-[25vh]">
        {/* BACKGROUND IMAGE & OVERLAY */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070')" }}
        />
        <div className="absolute inset-0 z-10 bg-slate-900/40 mix-blend-multiply" />

        {/* HERO TYPOGRAPHY */}
        <div className="relative z-20 text-center px-6 pb-24 md:pb-32 mt-10 md:mt-0">
          <h1 className="text-5xl md:text-7xl font-heading font-medium text-white tracking-tight drop-shadow-lg max-w-4xl mx-auto">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 text-lg md:text-xl font-body text-white/90 font-light drop-shadow-md max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
        </div>

        {/* THE BOOKING WIDGET (INTERACTIVE CLIENT COMPONENT) */}
        <div className="absolute -bottom-8 md:-bottom-[4.5rem] z-30 w-full flex justify-center px-4">
          <BookingWidget />
        </div>
      </div>

      {/* 2. CURATED PROPERTIES GRID */}
      <section className="max-w-7xl mx-auto px-6 mt-32 md:mt-40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-medium text-navy tracking-tight">
              {t('curatedTitle')}
            </h2>
            <p className="mt-2 text-muted font-body text-lg">
              {t('curatedSubtitle')}
            </p>
          </div>
          <Link href="/search" className="mt-4 md:mt-0 self-start md:self-auto">
            <button className="bg-transparent text-primary font-medium border-b border-primary pb-1 hover:brightness-110 transition-all uppercase tracking-wide text-sm">
              {t('viewPortfolio')}
            </button>
          </Link>
        </div>

        {/* CSS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.length === 0 ? (
             <div className="col-span-full py-24 flex justify-center items-center gap-2">
               <div className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-pulse"></div>
               <div className="w-2.5 h-2.5 bg-primary/70 rounded-full animate-pulse delay-75"></div>
               <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse delay-150"></div>
             </div>
          ) : properties.map((property) => (
            <Link href={`/property/${property.id}`} key={property.id}>
              <article 
                className="group bg-surface rounded-2xl overflow-hidden cursor-pointer h-full"
                style={{ boxShadow: "var(--shadow-soft)" }}
              >
                {/* IMAGE WRAPPER */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                  <button 
                    onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation(); 
                      toggleWishlist(property.id); 
                    }}
                    className={`absolute top-4 right-4 p-2.5 bg-white/95 hover:bg-white backdrop-blur-md rounded-full shadow-lg transition-all z-20 hover:scale-110 active:scale-95 ${
                      isInWishlist(property.id) ? 'text-red-500' : 'text-muted hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 transition-all ${isInWishlist(property.id) ? 'fill-red-500' : ''}`} />
                  </button>
                </div>

                {/* CARD DETAILS (The "No-Line" Rule adhered to) */}
                <div className="p-6 pb-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading text-xl text-navy font-medium group-hover:text-primary transition-colors">
                      {lang === "ar" ? property.title_ar : property.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm font-medium text-navy">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span>{property.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-muted text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{lang === "ar" ? property.location_ar : property.location}</span>
                  </div>

                  <div className="flex items-end gap-1">
                    <span className="font-bold text-lg text-navy">${property.price}</span>
                    <span className="text-sm text-muted mb-0.5">{t('perNight')}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}

