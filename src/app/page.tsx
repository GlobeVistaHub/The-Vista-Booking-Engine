"use client";

import { useState } from "react";
import { MapPin, Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BookingWidget from "@/components/BookingWidget";
import { useLanguage } from "@/context/LanguageContext";

// Placeholder data for the architectural layout
const FEATURED_PROPERTIES = [
  {
    id: 1,
    title: "Villa Serenity",
    title_ar: "فيلا سيرينيتي",
    location: "El Gouna",
    location_ar: "الجونة",
    price: 450,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    id: 2,
    title: "The Azure Penthouse",
    title_ar: "البنتهاوس الأزرق",
    location: "Sahl Hasheesh",
    location_ar: "سهل حشيش",
    price: 320,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  },
  {
    id: 3,
    title: "Sea Breeze Estate",
    title_ar: "عقار النسيم البحري",
    location: "Soma Bay",
    location_ar: "صوما باي",
    price: 850,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80",
  },
];

export default function Home() {
  const { t, lang } = useLanguage();
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <main className="w-full min-h-screen pb-24">
      {/* 1. THE HERO SECTION */}
      <div className="relative w-full min-h-[80vh] flex flex-col items-center justify-center">
        {/* BACKGROUND IMAGE & OVERLAY */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070')" }}
        />
        <div className="absolute inset-0 z-10 bg-slate-900/40 mix-blend-multiply" />

        {/* HERO TYPOGRAPHY */}
        <div className="relative z-20 text-center px-6 mt-[-10vh]">
          <h1 className="text-5xl md:text-7xl font-heading font-medium text-white tracking-tight drop-shadow-lg">
            {t('heroTitle')}
          </h1>
          <p className="mt-4 text-lg md:text-xl font-body text-white/90 font-light drop-shadow-md">
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
          {FEATURED_PROPERTIES.map((property) => (
            <article 
              key={property.id} 
              className="group bg-surface rounded-2xl overflow-hidden cursor-pointer"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              {/* IMAGE WRAPPER */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleLike(property.id); }}
                  className={`absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white backdrop-blur-md rounded-full shadow-sm transition-colors ${
                    likedIds.has(property.id) ? 'text-red-500' : 'text-muted hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 transition-all ${likedIds.has(property.id) ? 'fill-red-500' : ''}`} />
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
          ))}
        </div>
      </section>

    </main>
  );
}

