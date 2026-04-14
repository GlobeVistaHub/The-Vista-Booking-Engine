"use client";

import { useState, Suspense, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import Link from "next/link";
import { 
  MapPin, 
  Users, 
  Star, 
  Waves, 
  Wifi, 
  Utensils, 
  Car, 
  Wind, 
  ShieldCheck, 
  Check, 
  ChevronRight,
  ChevronLeft,
  Heart,
  Share,
  Calendar
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { getPropertyById } from "@/data/api";
import { Property } from "@/data/properties";

function PropertyContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const { t, lang } = useLanguage();
  const { toggleWishlist, isInWishlist } = useUser();
  const [currentImg, setCurrentImg] = useState(0);
  const [shared, setShared] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPropertyById(Number(id)).then(data => {
      setProperty(data);
      setIsLoading(false);
    });
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    const title = lang === "ar" ? property?.title_ar : property?.title;

    // Tier 1: Native share sheet (mobile HTTPS)
    if (navigator.share) {
      try { await navigator.share({ title: title || "The Vista", url }); return; } catch (_) {}
    }

    // Tier 2: Clipboard API (desktop HTTPS)
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(url); setShared(true); setTimeout(() => setShared(false), 2000); return; } catch (_) {}
    }

    // Tier 3: execCommand fallback — works on localhost/HTTP
    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-v-background">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-primary/40 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-primary/70 rounded-full animate-pulse delay-75"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    );
  }

  // Fallback if property doesn't exist
  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-v-background p-6 text-center">
        <h1 className="text-2xl font-bold text-navy mb-4">Property not found</h1>
        <p className="text-muted mb-8 max-w-md">Our apologies, the luxury escape you requested no longer exists or the link has expired.</p>
        <button onClick={() => window.history.back()} className="px-8 py-3 bg-primary hover:brightness-110 transition-all text-white rounded-full font-bold shadow-soft">
          Go Back
        </button>
      </div>
    );
  }

  // PARSE SEARCH PARAMS FROM URL
  const urlFrom = searchParams.get("from");
  const urlTo = searchParams.get("to");
  const parsedFrom = urlFrom ? new Date(urlFrom) : null;
  const parsedTo = urlTo ? new Date(urlTo) : null;
  const stayNights = parsedFrom && parsedTo ? Math.max(1, differenceInDays(parsedTo, parsedFrom)) : 5;
  const urlAdults = Number(searchParams.get("adults")) || 0;
  const urlChildren = Number(searchParams.get("children")) || 0;
  const totalGuests = urlAdults + urlChildren;

  // Real pricing from model
  const pricePerNight = property.price;
  const cleaningFee = 150;
  const serviceFee = Math.round(pricePerNight * stayNights * 0.1); // 10% service fee
  const total = pricePerNight * stayNights + cleaningFee + serviceFee;

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((i) => (i === property.images.length - 1 ? 0 : i + 1));
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((i) => (i === 0 ? property.images.length - 1 : i - 1));
  };

  return (
    <div className="w-full bg-v-background min-h-screen">
      
      {/* 1. CINEMATIC HERO SECTION (Behind Transparent Header) */}
      <div className="relative w-full h-[60vh] md:h-[70vh] -mt-20 overflow-hidden group">
        {property.images.map((img, idx) => (
          <img 
            key={idx}
            src={img} 
            alt={`${lang === "ar" ? property.title_ar : property.title} view ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${idx === currentImg ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-navy/20 mix-blend-multiply pointer-events-none" />

        {/* Carousel Arrows */}
        <button
          onClick={prevImg}
          className={`absolute ${lang === "ar" ? "right-8" : "left-8"} top-1/2 -translate-y-1/2 w-12 h-12 bg-white/40 hover:bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-white hover:text-navy opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-20`}
          aria-label="Previous image"
        >
          <ChevronLeft className={`w-6 h-6 ${lang === "ar" ? "rotate-180" : ""}`} />
        </button>
        <button
          onClick={nextImg}
          className={`absolute ${lang === "ar" ? "left-8" : "right-8"} top-1/2 -translate-y-1/2 w-12 h-12 bg-white/40 hover:bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-white hover:text-navy opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-20`}
          aria-label="Next image"
        >
          <ChevronRight className={`w-6 h-6 ${lang === "ar" ? "rotate-180" : ""}`} />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-20 pointer-events-none">
          {property.images.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentImg ? "bg-white w-4" : "bg-white/50"}`}
            />
          ))}
        </div>
        
        {/* Top Overlay Buttons (Heart/Share) */}
        <div className="absolute bottom-8 right-8 flex gap-4 z-20">
          <button
            onClick={handleShare}
            className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all group relative"
            aria-label="Share property"
          >
            {shared ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Share className="w-5 h-5 text-navy group-hover:text-primary transition-colors" />
            )}
            {shared && (
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-navy text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                Link copied!
              </span>
            )}
          </button>
          <button 
            onClick={() => toggleWishlist(property.id)}
            className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all group"
          >
            <Heart className={`w-5 h-5 transition-all ${isInWishlist(property.id) ? 'fill-red-500 text-red-500' : 'text-navy group-hover:text-red-500'}`} />
          </button>
        </div>
      </div>

      {/* 2. MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          
          {/* LEFT COLUMN: THE PITCH (2/3) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Header Info */}
            <div className="border-b border-navy/5 pb-8">
              <h1 className="text-4xl md:text-5xl font-heading font-medium text-navy tracking-tight mb-4 text-start">
                {lang === "ar" ? property.title_ar : property.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-navy/70">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-medium">{lang === "ar" ? property.location_ar : property.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="font-bold text-navy">{property.rating}</span>
                  <span className="text-muted">({property.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Host Section */}
            <div className="flex items-center justify-between py-6 border-b border-navy/5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="text-start">
                  <h3 className="font-bold text-navy text-lg">{t('hostedBy')}</h3>
                  <p className="text-muted text-sm">Joined in 2026 • Superhost</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-v-background border border-navy/10 rounded-full text-xs font-bold text-navy uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Verified
              </div>
            </div>

            {/* Rare Find Callout */}
            <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div className="text-start">
                <h4 className="font-bold text-navy">{t('rareFind')}</h4>
                <p className="text-muted text-sm">{t('rareFindDetail')}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6 text-start">
              <h2 className="text-2xl font-heading font-medium text-navy tracking-tight">
                {t('aboutThisHome')}
              </h2>
              <p className="text-navy/80 font-body leading-relaxed text-lg lg:text-xl font-light">
                {lang === "ar" ? property.description_ar : property.description_en}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-8 pt-4 text-start">
              <h2 className="text-2xl font-heading font-medium text-navy tracking-tight">
                {t('offers')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                {property.tags.map((tag) => (
                  <div key={tag} className="flex items-center gap-4 text-navy">
                    <Check className="w-5 h-5 text-primary opacity-60" />
                    <span className="font-medium">{t(tag as any)}</span>
                  </div>
                ))}
                <div className="flex items-center gap-4 text-navy">
                  <Wifi className="w-5 h-5 text-primary opacity-60" />
                  <span className="font-medium">{t('tagUltraWifi')}</span>
                </div>
                <div className="flex items-center gap-4 text-navy">
                  <ShieldCheck className="w-5 h-5 text-primary opacity-60" />
                  <span className="font-medium">{t('tagSecurity')}</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: STICKY BOOKING CARD (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-3xl p-8 border border-navy/5 shadow-soft flex flex-col gap-6">
              
              <div className="flex justify-between items-end">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-navy">${pricePerNight}</span>
                  <span className="text-muted font-medium">{t('perNight')}</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-navy">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span>{property.rating}</span>
                </div>
              </div>

              {/* Mock Input Fields */}
              <div className="grid grid-cols-2 border border-navy/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-r border-navy/10 hover:bg-navy/[0.02] transition-colors cursor-pointer text-start">
                  <p className="text-[10px] font-bold text-navy uppercase tracking-widest mb-1">{t('checkIn')}</p>
                  <p className="text-sm font-medium text-muted">{parsedFrom ? format(parsedFrom, 'dd/MM/yyyy') : 'Add date'}</p>
                </div>
                <div className="p-4 hover:bg-navy/[0.02] transition-colors cursor-pointer text-start">
                  <p className="text-[10px] font-bold text-navy uppercase tracking-widest mb-1">{t('checkOut')}</p>
                  <p className="text-sm font-medium text-muted">{parsedTo ? format(parsedTo, 'dd/MM/yyyy') : 'Add date'}</p>
                </div>
                <div className="col-span-2 p-4 border-t border-navy/10 hover:bg-navy/[0.02] transition-colors cursor-pointer flex justify-between items-center text-start">
                  <div>
                    <p className="text-[10px] font-bold text-navy uppercase tracking-widest mb-1">{t('guests')}</p>
                    <p className="text-sm font-medium text-navy">{totalGuests > 0 ? totalGuests : property.guests} {t('guestCount')}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </div>
              </div>

              {/* CTA Button */}
              <Link 
                href={`/checkout?id=${property.id}&from=${urlFrom||''}&to=${urlTo||''}&adults=${urlAdults||2}&children=${urlChildren||0}`}
                className="w-full py-4 bg-primary hover:brightness-110 text-white rounded-2xl font-bold text-center text-lg shadow-md transition-all active:scale-95"
              >
                {t('reserve')}
              </Link>

              <p className="text-center text-muted text-xs">
                {t('notChargedYet')}
              </p>

              {/* Price Breakdown */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between text-navy/70">
                  <span className="underline decoration-navy/20 underline-offset-4 cursor-pointer hover:text-navy">${pricePerNight} x {stayNights} {t('night')}</span>
                  <span>${pricePerNight * stayNights}</span>
                </div>
                <div className="flex justify-between text-navy/70">
                  <span className="underline decoration-navy/20 underline-offset-4 cursor-pointer hover:text-navy">{t('cleaningFee')}</span>
                  <span>${cleaningFee}</span>
                </div>
                <div className="flex justify-between text-navy/70">
                  <span className="underline decoration-navy/20 underline-offset-4 cursor-pointer hover:text-navy">{t('serviceFee')}</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="h-px bg-navy/10 my-4" />
                <div className="flex justify-between text-navy text-lg font-bold">
                  <span>{t('totalLabel')}</span>
                  <span>${total}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

    </div>
  );
}

// WRAP WITH SUSPENSE FOR NEXTJS 15 COMPATIBILITY
export default function PropertyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    }>
      <PropertyContent />
    </Suspense>
  );
}
