"use client";

import { useState } from "react";
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
  Heart,
  Share,
  Calendar
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PropertyPage() {
  const { t, lang } = useLanguage();
  const [liked, setLiked] = useState(false);

  // Mock pricing logic
  const pricePerNight = 1200;
  const cleaningFee = 150;
  const serviceFee = 210;
  const total = pricePerNight * 5 + cleaningFee + serviceFee;

  return (
    <div className="w-full bg-v-background min-h-screen">
      
      {/* 1. CINEMATIC HERO SECTION (Behind Transparent Header) */}
      <div className="relative w-full h-[60vh] md:h-[70vh] -mt-20 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071" 
          alt="Azure Palms Villa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/20 mix-blend-multiply" />
        
        {/* Top Overlay Buttons (Heart/Share) */}
        <div className="absolute bottom-8 right-8 flex gap-4 z-20">
          <button className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all group">
            <Share className="w-5 h-5 text-navy" />
          </button>
          <button 
            onClick={() => setLiked(!liked)}
            className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all group"
          >
            <Heart className={`w-5 h-5 transition-all ${liked ? 'fill-red-500 text-red-500' : 'text-navy'}`} />
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
              <h1 className="text-4xl md:text-5xl font-heading font-medium text-navy tracking-tight mb-4">
                {t('propertyTitle')}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-navy/70">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-medium">{t('propertyLocationDetail')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="font-bold text-navy">4.98</span>
                  <span className="text-muted">(128 reviews)</span>
                </div>
              </div>
            </div>

            {/* Host Section */}
            <div className="flex items-center justify-between py-6 border-b border-navy/5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-navy text-lg">{t('hostedBy')}</h3>
                  <p className="text-muted text-sm">Joined in 2021 • Superhost</p>
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
              <div>
                <h4 className="font-bold text-navy">{t('rareFind')}</h4>
                <p className="text-muted text-sm">{t('rareFindDetail')}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-medium text-navy tracking-tight">
                {t('aboutThisHome')}
              </h2>
              <p className="text-navy/80 font-body leading-relaxed text-lg lg:text-xl font-light">
                {t('descriptionBody')}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-8 pt-4">
              <h2 className="text-2xl font-heading font-medium text-navy tracking-tight">
                {t('offers')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                <div className="flex items-center gap-4">
                  <Waves className="w-6 h-6 text-primary opacity-70" />
                  <span className="text-navy font-medium">{t('tagRedSeaView')}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Utensils className="w-6 h-6 text-primary opacity-70" />
                  <span className="text-navy font-medium">{t('tagChefIncluded')}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Wifi className="w-6 h-6 text-primary opacity-70" />
                  <span className="text-navy font-medium">Ultra High-speed WiFi</span>
                </div>
                <div className="flex items-center gap-4">
                  <Car className="w-6 h-6 text-primary opacity-70" />
                  <span className="text-navy font-medium">{t('tagPrivatePool')}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Wind className="w-6 h-6 text-primary opacity-70" />
                  <span className="text-navy font-medium">Central Air Conditioning</span>
                </div>
                <div className="flex items-center gap-4">
                  <ShieldCheck className="w-6 h-6 text-primary opacity-70" />
                  <span className="text-navy font-medium">24/7 Gated Security</span>
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
                  <span>4.98</span>
                </div>
              </div>

              {/* Mock Input Fields */}
              <div className="grid grid-cols-2 border border-navy/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-r border-navy/10 hover:bg-navy/[0.02] transition-colors cursor-pointer">
                  <p className="text-[10px] font-bold text-navy uppercase tracking-widest mb-1">Check-In</p>
                  <p className="text-sm font-medium text-muted">10/12/2026</p>
                </div>
                <div className="p-4 hover:bg-navy/[0.02] transition-colors cursor-pointer">
                  <p className="text-[10px] font-bold text-navy uppercase tracking-widest mb-1">Check-Out</p>
                  <p className="text-sm font-medium text-muted">15/12/2026</p>
                </div>
                <div className="col-span-2 p-4 border-t border-navy/10 hover:bg-navy/[0.02] transition-colors cursor-pointer flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-navy uppercase tracking-widest mb-1">{t('guests')}</p>
                    <p className="text-sm font-medium text-navy">2 Adults, 1 Child</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full py-4 bg-primary hover:brightness-110 text-white rounded-2xl font-bold text-lg shadow-md transition-all active:scale-95">
                {t('reserve')}
              </button>

              <p className="text-center text-muted text-xs">
                You won't be charged yet
              </p>

              {/* Price Breakdown */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between text-navy/70">
                  <span className="underline decoration-navy/20 underline-offset-4 cursor-pointer hover:text-navy">${pricePerNight} x 5 {t('night')}</span>
                  <span>${pricePerNight * 5}</span>
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
