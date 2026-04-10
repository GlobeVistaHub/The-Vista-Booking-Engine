"use client";

import { useState } from "react";
import { Heart, Star, ChevronLeft, ChevronRight, ChevronRight as ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

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
}

export default function PropertyCard({ property }: { property: Property }) {
  const [currentImg, setCurrentImg] = useState(0);
  const [liked, setLiked] = useState(false);
  const { t, lang } = useLanguage();

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((i) => (i === 0 ? property.images.length - 1 : i - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((i) => (i === property.images.length - 1 ? 0 : i + 1));
  };

  return (
    <article className="group flex flex-col sm:flex-row gap-6 cursor-pointer border-b border-navy/5 pb-10 last:border-0 hover:bg-navy/[0.02] transition-colors p-4 -mx-4 rounded-3xl" dir={lang === "ar" ? "rtl" : "ltr"}>

      {/* IMAGE CAROUSEL */}
      <div className="relative w-full sm:w-72 h-56 sm:h-56 rounded-2xl overflow-hidden flex-shrink-0 bg-navy/5">
        {/* Images */}
        <div className="relative w-full h-full">
          {property.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${property.title} view ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${idx === currentImg ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>

        {/* Prev / Next Arrows */}
        <button
          onClick={prev}
          className={`absolute ${lang === "ar" ? "right-2" : "left-2"} top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center shadow-md text-navy opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10`}
          aria-label="Previous image"
        >
          <ChevronLeft className={`w-4 h-4 ${lang === "ar" ? "rotate-180" : ""}`} />
        </button>
        <button
          onClick={next}
          className={`absolute ${lang === "ar" ? "left-2" : "right-2"} top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center shadow-md text-navy opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10`}
          aria-label="Next image"
        >
          <ChevronRight className={`w-4 h-4 ${lang === "ar" ? "rotate-180" : ""}`} />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
          {property.images.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImg ? "bg-white w-3" : "bg-white/50"}`}
            />
          ))}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className={`absolute top-3 ${lang === "ar" ? "left-3" : "right-3"} p-2 bg-white/90 hover:bg-white backdrop-blur-md rounded-full shadow-sm transition-colors z-10`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-4 h-4 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-muted"}`} />
        </button>
      </div>

      {/* DETAILS */}
      <div className="flex flex-col flex-1 py-1">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-muted">{t(property.type as keyof typeof import('@/i18n/dictionaries').dictionaries) || property.type} {t('in')} {lang === "ar" ? property.location_ar : property.location}</span>
            <h3 className="text-xl font-heading text-navy mt-1 group-hover:text-primary transition-colors">{lang === "ar" ? property.title_ar : property.title}</h3>
          </div>
          <div className="flex items-center gap-1 mt-1 flex-shrink-0">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-medium text-navy">{property.rating}</span>
          </div>
        </div>

        <div className="mt-3 text-sm text-muted">
          {property.guests} {t('guestCount')} <span className="mx-1">•</span> {property.bedrooms} {t('bedroomCount')}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {property.tags.map(tag => (
            <span key={tag} className="text-xs font-medium px-2.5 py-1 bg-navy/5 rounded-md text-navy/70">
              {t(tag as any)}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6 flex justify-between items-end">
          <div className="flex items-center gap-1 font-medium text-sm text-navy hover:text-primary transition-colors">
            {t('viewDetails')} <ArrowRight className={`w-4 h-4 ${lang === "ar" ? "rotate-180" : ""}`} />
          </div>
          <div className="flex items-end gap-1 flex-row-reverse">
            <span className="text-sm text-muted mb-0.5">{t('perNight')}</span>
            <span className="text-xl font-bold text-navy mr-1">${property.price}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
