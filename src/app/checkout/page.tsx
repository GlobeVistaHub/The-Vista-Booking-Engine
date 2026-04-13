"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { 
  ChevronLeft, 
  Star, 
  CreditCard, 
  ShieldCheck, 
  Info,
  Calendar,
  Users
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { PROPERTIES } from "@/data/properties";
import { format, differenceInDays } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Plus, Minus, X } from "lucide-react";

// PAYMENT METHOD LOGOS (VITAL SVGS)
const VisaLogo = () => (
  <svg viewBox="0 0 60 40" className="w-12 h-8">
    <rect width="60" height="40" rx="6" fill="#1A1F71" />
    <text x="50%" y="60%" textAnchor="middle" fill="white" style={{ fontSize: '11px', fontWeight: '900', fontFamily: 'sans-serif', fontStyle: 'italic' }}>VISA</text>
  </svg>
);

const MCLogo = () => (
  <svg viewBox="0 0 60 40" className="w-12 h-8">
    <rect width="60" height="40" rx="6" fill="#F7F7F7" />
    <circle cx="24" cy="20" r="10" fill="#EB001B" />
    <circle cx="36" cy="20" r="10" fill="#F79E1B" fillOpacity="0.8" />
  </svg>
);

const AMEXLogo = () => (
  <svg viewBox="0 0 60 40" className="w-12 h-8">
    <rect width="60" height="40" rx="6" fill="#016FD0" />
    <text x="50%" y="60%" textAnchor="middle" fill="white" style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>AMEX</text>
  </svg>
);

const ApplePayLogo = () => (
  <svg viewBox="0 0 60 40" className="w-12 h-8">
    <rect width="60" height="40" rx="6" fill="#000" />
    <path d="M22 18c0-1.4 1.2-2.3 1.2-2.3-.7-1-1.8-1.1-2.2-1.1-1 0-1.9.7-2.4.7-.5 0-1.3-.6-2.1-.6-1.1 0-2 .6-2.6 1.6-1.1 2-.5 4.8 0 6.6.3 1 1 2.1 1.8 2.1.8 0 1-.5 2-.5.9 0 1.1.5 2 .5.8 0 1.4-.9 1.9-1.6.6-.8.8-1.6.8-1.6-.1 0-1-.4-1-1.6zM20.1 14.1c.4-.5.7-1.3.6-2.1-.7 0-1.6.4-2.1.9-.4.5-.8 1.3-.7 2 .7.1 1.5-.2 2.2-.8z" fill="#FFF" />
    <text x="65%" y="64%" textAnchor="middle" fill="white" style={{ fontSize: '9px', fontWeight: 'bold' }}>Pay</text>
  </svg>
);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, lang } = useLanguage();
  const propertyId = searchParams.get("id");
  const property = PROPERTIES.find(p => p.id === Number(propertyId));

  // Edit States
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [isEditingGuests, setIsEditingGuests] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"visa" | "mc" | "amex" | "apple">("visa");

  // Selection states
  const urlFrom = searchParams.get("from");
  const urlTo = searchParams.get("to");
  const [dateRange, setDateRange] = useState<{from: Date, to: Date}>({
    from: urlFrom ? new Date(urlFrom) : new Date(2026, 9, 12),
    to: urlTo ? new Date(urlTo) : new Date(2026, 9, 17)
  });
  const [adults, setAdults] = useState(Number(searchParams.get("adults")) || 2);
  const [children, setChildren] = useState(Number(searchParams.get("children")) || 0);

  // If no property found, redirect to search
  useEffect(() => {
    if (!property) {
      router.push("/search");
    }
  }, [property, router]);

  if (!property) return null;

  const stayNights = differenceInDays(dateRange.to, dateRange.from) || 1;
  const totalGuests = adults + children;
  const maxGuests = Number(property.guests) || 8;
  const extraGuestFee = 75; // $75 per extra guest per night above baseGuests
  const extraGuests = Math.max(0, totalGuests - property.baseGuests);
  const extraGuestTotal = extraGuests * extraGuestFee * stayNights;
  const pricePerNight = property.price;
  const cleaningFee = 150;
  const serviceFee = Math.round((pricePerNight * stayNights + extraGuestTotal) * 0.1);
  const total = pricePerNight * stayNights + extraGuestTotal + cleaningFee + serviceFee;

  const paymentMethods = [
    { id: "visa", logo: <VisaLogo /> },
    { id: "mc", logo: <MCLogo /> },
    { id: "amex", logo: <AMEXLogo /> },
    { id: "apple", logo: <ApplePayLogo /> },
  ];

  const handleConfirm = () => {
    const params = new URLSearchParams({
      id: propertyId || "",
      adults: adults.toString(),
      children: children.toString(),
      from: format(dateRange.from, "yyyy-MM-dd"),
      to: format(dateRange.to, "yyyy-MM-dd"),
      price: pricePerNight.toString(),
      cleaning: cleaningFee.toString(),
      service: serviceFee.toString(),
      total: total.toString()
    });
    router.push(`/success?${params.toString()}`);
  };

  return (
    <div className="w-full bg-v-background min-h-screen text-start" dir={lang === "ar" ? "rtl" : "ltr"}>
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-navy/5 rounded-full transition-colors">
            <ChevronLeft className={`w-6 h-6 text-navy ${lang === "ar" ? "rotate-180" : ""}`} />
          </button>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-navy">{t('confirmAndPay')}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          
          {/* LEFT COLUMN: PAYMENT & TRIP DETAILS */}
          <div className="space-y-12">
            
            {/* 1. Trip Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-navy">{t('yourTrip')}</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 py-2">
                  <div className="flex-grow">
                    <p className="font-bold text-navy text-sm md:text-base">{t('dates')}</p>
                    <p className="text-muted text-sm">{format(dateRange.from, "MMM d")} – {format(dateRange.to, "MMM d")}, 2026</p>
                  </div>
                  <button 
                    onClick={() => setIsEditingDates(true)}
                    className="text-primary font-bold underline underline-offset-4 hover:brightness-125 transition-all px-2 shrink-0"
                  >
                    {t('edit')}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 py-2">
                  <div className="flex-grow">
                    <p className="font-bold text-navy text-sm md:text-base">{t('guests')}</p>
                    <p className="text-muted text-sm">{adults + children} {t('guestCount')}</p>
                  </div>
                  <button 
                    onClick={() => setIsEditingGuests(true)}
                    className="text-primary font-bold underline underline-offset-4 hover:brightness-125 transition-all px-2 shrink-0"
                  >
                    {t('edit')}
                  </button>
                </div>
              </div>
            </section>

            <div className="h-px bg-navy/10 w-full" />

            {/* 2. Payment Section */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-navy">{t('paymentMethod')}</h2>
                <div className="flex flex-wrap gap-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id as any)}
                      className={`p-1.5 rounded-lg border-2 transition-all duration-300 ${
                        selectedMethod === method.id 
                          ? 'border-primary bg-primary/5 shadow-md scale-105' 
                          : 'border-navy/10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:border-navy/30'
                      }`}
                    >
                      {method.logo}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-1 px-4 border border-navy/10 rounded-2xl bg-white shadow-sm">
                <div className="border-b border-navy/10 py-4 flex items-center gap-4">
                  <CreditCard className="w-5 h-5 text-navy opacity-40 shrink-0" />
                  <input 
                    type="text" 
                    placeholder={t('cardNumber')}
                    className="w-full bg-transparent border-none outline-none font-medium placeholder:text-navy/20"
                  />
                </div>
                <div className="grid grid-cols-2">
                  <div className="border-r border-navy/10 py-4 flex items-center gap-4">
                    <Calendar className="ml-4 w-5 h-5 text-navy opacity-40 shrink-0" />
                    <input 
                      type="text" 
                      placeholder={t('expiration')}
                      className="w-full bg-transparent border-none outline-none font-medium placeholder:text-navy/20"
                    />
                  </div>
                  <div className="py-4 flex items-center gap-4">
                    <ShieldCheck className="ml-4 w-5 h-5 text-navy opacity-40 shrink-0" />
                    <input 
                      type="text" 
                      placeholder={t('cvv')}
                      className="w-full bg-transparent border-none outline-none font-medium placeholder:text-navy/20"
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-navy/10 w-full" />

            {/* 3. Ground Rules */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-navy">{t('groundRules')}</h2>
              <p className="text-muted leading-relaxed">
                {t('groundRulesDetail')}
              </p>
              <ul className="space-y-4 font-medium text-navy">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-navy/20" />
                  {t('followHouseRules')}
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-navy/20" />
                  {t('treatHomeLikeOwn')}
                </li>
              </ul>
            </section>

            <div className="pt-8 block lg:hidden">
                <button 
                  onClick={handleConfirm}
                  className="w-full block py-4 bg-primary text-white rounded-2xl font-bold text-center shadow-md hover:brightness-110 transition-all active:scale-95"
                >
                  {t('confirmAndPay')}
                </button>
            </div>
          </div>

          {/* RIGHT COLUMN: PRICE SUMMARY CARD */}
          <div className="lg:block">
            <div className="sticky top-28 border border-navy/10 rounded-3xl p-8 bg-white shadow-soft">
              
              {/* Property Mini Card */}
              <div className="flex gap-4 pb-8 border-b border-navy/10">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-navy/5 shrink-0">
                  <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold text-navy line-clamp-1">
                      {lang === "ar" ? property.title_ar : property.title}
                    </h3>
                    <p className="text-sm text-muted">{lang === "ar" ? property.location_ar : property.location}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-navy">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span>{property.rating}</span>
                    <span className="text-muted font-normal">({property.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="py-8 space-y-4">
                <h2 className="text-xl font-bold text-navy mb-6">{t('priceDetails')}</h2>
                <div className="flex justify-between items-center text-navy/70">
                  <span>${pricePerNight} x {stayNights} {t('night')} ({property.baseGuests} {t('guests')} base)</span>
                  <span>${pricePerNight * stayNights}</span>
                </div>
                {extraGuests > 0 && (
                  <div className="flex justify-between items-center text-navy/70">
                    <span>+{extraGuests} extra guest{extraGuests > 1 ? 's' : ''} × {stayNights} {t('night')}</span>
                    <span>${extraGuestTotal}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-navy/70">
                  <span>{t('cleaningFee')}</span>
                  <span>${cleaningFee}</span>
                </div>
                <div className="flex justify-between items-center text-navy/70">
                  <span>{t('serviceFee')}</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="pt-4 mt-4 border-t border-navy/10 flex justify-between items-center text-navy text-lg font-bold">
                  <span>{t('totalLabel')} (USD)</span>
                  <span>${total}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="hidden lg:block pt-4">
                <button 
                  onClick={handleConfirm}
                  className="w-full block py-4 bg-primary text-white rounded-2xl font-bold text-center shadow-md hover:brightness-110 transition-all active:scale-95"
                >
                  {t('confirmAndPay')}
                </button>
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('secureSsl')}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* MODAL: EDIT DATES */}
      {isEditingDates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 transition-all duration-500">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setIsEditingDates(false)} />
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-navy">{t('editTrip')}</h3>
              <button onClick={() => setIsEditingDates(false)} className="p-2 hover:bg-navy/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-navy" />
              </button>
            </div>
            <DayPicker
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => range?.from && range?.to && setDateRange({ from: range.from, to: range.to })}
              numberOfMonths={1}
              className="mx-auto"
              dir={lang === "ar" ? "rtl" : "ltr"}
              classNames={{
                day_selected: "bg-primary text-white hover:bg-primary font-bold",
                day_today: "font-bold text-navy border border-primary/20",
              }}
            />
            <button 
              onClick={() => setIsEditingDates(false)}
              className="w-full mt-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-md"
            >
              {t('saveChanges')}
            </button>
          </div>
        </div>
      )}

      {/* MODAL: EDIT GUESTS */}
      {isEditingGuests && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 transition-all duration-500">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setIsEditingGuests(false)} />
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-navy">{t('editGuests')}</h3>
              <button onClick={() => setIsEditingGuests(false)} className="p-2 hover:bg-navy/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-navy" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-navy">{t('adults')}</h4>
                  <p className="text-xs text-muted">Ages 13+</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center"><Minus className="w-3 h-3"/></button>
                  <span className="font-bold text-navy w-4 text-center">{adults}</span>
                  <button onClick={() => setAdults(Math.min(maxGuests - children, adults + 1))} className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center"><Plus className="w-3 h-3"/></button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-navy">{t('children')}</h4>
                  <p className="text-xs text-muted">Ages 2–12</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center"><Minus className="w-3 h-3"/></button>
                  <span className="font-bold text-navy w-4 text-center">{children}</span>
                  <button onClick={() => setChildren(Math.min(maxGuests - adults, children + 1))} className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center"><Plus className="w-3 h-3"/></button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsEditingGuests(false)}
              className="w-full mt-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-md"
            >
              {t('saveChanges')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-v-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
