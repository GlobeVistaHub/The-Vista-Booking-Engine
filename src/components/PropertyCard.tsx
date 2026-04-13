"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Star, ChevronLeft, ChevronRight, ChevronRight as ArrowRight, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";

interface Property {
  id: number;
  title: string;
  title_ar: string;
  type: string;
  guests: string;
  bedrooms: string;
  location: string;
  location_ar: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  tags: string[];
  isBooked?: boolean;
}

export default function PropertyCard({ property, searchContext }: { property: Property, searchContext?: {from: string, to: string, adults: number, children: number} }) {
  const [currentImg, setCurrentImg] = useState(0);
  const { toggleWishlist, isInWishlist } = useUser();
  const { t, lang } = useLanguage();
  const liked = isInWishlist(property.id);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImg((i) => (i === 0 ? property.images.length - 1 : i - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImg((i) => (i === property.images.length - 1 ? 0 : i + 1));
  };

  const linkHref = searchContext 
    ? `/property/${property.id}?from=${searchContext.from}&to=${searchContext.to}&adults=${searchContext.adults}&children=${searchContext.children}`
    : `/property/${property.id}`;

  return (
    <div 
      className="group flex flex-col sm:flex-row gap-6 border-b border-navy/5 pb-10 last:border-0 p-4 -mx-4 rounded-3xl transition-all hover:bg-navy/[0.01]" 
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* 1. INTERACTIVE ZONE: IMAGE & CAROUSEL (NO LINK) */}
      <div className="relative w-full sm:w-72 h-56 sm:h-56 rounded-2xl overflow-hidden flex-shrink-0 bg-navy/5 shadow-sm">
        {/* Images */}
        <div className="relative w-full h-full">
          {property.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${property.title} view ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${idx === currentImg ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
            />
          ))}
        </div>

        {/* Carousel Controls - Responsive: Always on for mobile, Hover for desktop */}
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between items-center z-20 pointer-events-none opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={prev}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl text-navy pointer-events-auto hover:bg-primary hover:text-white transition-all transform hover:scale-110 active:scale-95 translate-x-1"
            aria-label="Previous image"
          >
            <ChevronLeft className={`w-5 h-5 ${lang === "ar" ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={next}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl text-navy pointer-events-auto hover:bg-primary hover:text-white transition-all transform hover:scale-110 active:scale-95 -translate-x-1"
            aria-label="Next image"
          >
            <ChevronRight className={`w-5 h-5 ${lang === "ar" ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Wishlist Button - Isolated */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(property.id); }}
          className={`absolute top-3 ${lang === "ar" ? "left-3" : "right-3"} p-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-xl transition-all z-20 hover:scale-110 active:scale-90 group/heart`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-4 h-4 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-muted group-hover/heart:text-red-500"}`} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
          {property.images.map((_, idx) => (
            <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImg ? "bg-white w-4" : "bg-white/40"}`} />
          ))}
        </div>

        {/* Booked Ribbon */}
        {property.isBooked && (
          <div className="absolute top-0 left-0 z-30 bg-navy text-white px-3 py-1 rounded-br-xl text-[10px] font-black uppercase tracking-widest border-r border-b border-white/10">
            {t('fullyBooked')}
          </div>
        )}
      </div>

      {/* 2. NAVIGATION ZONE: DETAILS (WRAPPED IN LINK) */}
      <Link 
        href={linkHref}
        className="flex flex-col flex-1 py-1 min-h-[180px] group/details"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted">
              <span>{t(property.type as any) || property.type}</span>
              <span className="opacity-30">•</span>
              <span>{lang === "ar" ? property.location_ar : property.location}</span>
            </div>
            <h3 className="text-2xl font-heading text-navy group-hover/details:text-primary transition-colors leading-tight">{lang === "ar" ? property.title_ar : property.title}</h3>
          </div>
          <div className="flex items-center gap-1 bg-navy/5 px-2 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
            <span className="text-sm font-bold text-navy">{property.rating}</span>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted font-medium flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-navy">{property.guests}</span> {t('guestCount')}
          </div>
          <div className="w-1 h-1 rounded-full bg-navy/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-navy">{property.bedrooms}</span> {t('bedroomCount')}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {property.tags.map(tag => (
            <span key={tag} className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-navy/5 rounded-md text-navy/60 group-hover/details:bg-primary/5 group-hover/details:text-primary transition-colors">
              {t(tag as any)}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6 flex justify-between items-end border-t border-navy/5">
          <div className="flex items-center gap-2 text-sm font-bold text-navy group-hover/details:text-primary transition-all">
            {t('viewDetails')} 
            <ArrowRight className={`w-4 h-4 transition-transform group-hover/details:translate-x-1 ${lang === "ar" ? "rotate-180" : ""}`} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-navy">${property.price}</span>
            <span className="text-xs text-muted uppercase tracking-widest font-bold">{t('perNight')}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
