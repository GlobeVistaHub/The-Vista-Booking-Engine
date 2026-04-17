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
  Users,
  MessageCircle,
  AlertTriangle
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getPropertyById } from "@/data/api";
import { Property } from "@/data/properties";
import { format, differenceInDays } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Plus, Minus, X, Loader2, Globe } from "lucide-react";
import { useAppModeStore } from "@/store/appModeStore";
import { useAppStore } from "@/hooks/useAppStore";

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
  const [property, setProperty] = useState<Property | null>(null);
  const [loadingProperty, setLoadingProperty] = useState(true);

  useEffect(() => {
    if (propertyId) {
      getPropertyById(Number(propertyId)).then(data => {
        setProperty(data);
        setLoadingProperty(false);
      });
    } else {
      setLoadingProperty(false);
    }
  }, [propertyId]);

  // Edit States
  const { user: clerkUser } = useUser();
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

  // Paymob States
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Exchange Rate from Store
  const exchangeRate = useAppStore(useAppModeStore, (s) => s.exchangeRate) as number || 50.0;

  // If no property found, redirect to search
  useEffect(() => {
    if (!loadingProperty && !property) {
      router.push("/search");
    }
  }, [property, loadingProperty, router]);

  if (loadingProperty || !property) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-v-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const stayNights = differenceInDays(dateRange.to, dateRange.from) || 1;
  const totalGuests = adults + children;
  const maxGuests = Number(property.guests) || 8;
  const extraGuestFee = 75;
  const extraGuests = Math.max(0, totalGuests - property.baseGuests);
  const extraGuestTotal = extraGuests * extraGuestFee * stayNights;
  const pricePerNight = property.price;
  const cleaningFee = 150;
  const serviceFee = Math.round((pricePerNight * stayNights + extraGuestTotal) * 0.1);
  const total = pricePerNight * stayNights + extraGuestTotal + cleaningFee + serviceFee;
  const amountEGP = Math.round(total * exchangeRate);

  const paymentMethods = [
    { id: "visa", logo: <VisaLogo /> },
    { id: "mc", logo: <MCLogo /> },
    { id: "amex", logo: <AMEXLogo /> },
    { id: "apple", logo: <ApplePayLogo /> },
  ];

  const handleConfirm = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/payments/paymob/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          guestName: clerkUser?.fullName || "Guest", 
          guestEmail: clerkUser?.primaryEmailAddress?.emailAddress || "guest@example.com",
          amountUSD: total,
          exchangeRate: exchangeRate,
          checkIn: format(dateRange.from, "yyyy-MM-dd"),
          checkOut: format(dateRange.to, "yyyy-MM-dd"),
          adults,
          children
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to initiate payment");

      if (data.paymentToken) {
        setPaymentToken(data.paymentToken);
      } else {
        throw new Error("No payment token received");
      }
    } catch (err: any) {
      console.error("Payment Error:", err);
      setError(err.message);
      setIsProcessing(false);
    }
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

        {/* PAYMENT FAILURE BANNER (RETENTION) */}
        {searchParams.get("error") === "payment_failed" && (
          <div className="mb-12 bg-rose-50 border border-rose-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-shake shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-navy">Payment Interrupted</h3>
                <p className="text-navy/60 text-sm max-w-md leading-relaxed">
                  We couldn't process your transaction. Don't worry, your preferred dates at **{property.title}** are still held for you.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <button 
                onClick={() => window.open(`https://wa.me/+201145551163?text=Hi, I had an issue booking ${property.title}. Can Alex help?`, '_blank')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-rose-200 text-rose-600 rounded-2xl text-sm font-bold hover:bg-rose-100 transition-all w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4" />
                Speak to Alex
              </button>
              <button 
                onClick={handleConfirm}
                className="px-8 py-3 bg-rose-500 text-white rounded-2xl text-sm font-bold hover:bg-rose-600 transition-all w-full sm:w-auto shadow-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          
          {/* LEFT COLUMN */}
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
                  <button onClick={() => setIsEditingDates(true)} className="text-primary font-bold underline underline-offset-4 hover:brightness-125 transition-all text-sm">{t('edit')}</button>
                </div>

                <div className="flex items-center justify-between gap-4 py-2">
                  <div className="flex-grow">
                    <p className="font-bold text-navy text-sm md:text-base">{t('guests')}</p>
                    <p className="text-muted text-sm">{adults + children} {t('guestCount')}</p>
                  </div>
                  <button onClick={() => setIsEditingGuests(true)} className="text-primary font-bold underline underline-offset-4 hover:brightness-125 transition-all text-sm">{t('edit')}</button>
                </div>
              </div>
            </section>

            <div className="h-px bg-navy/10 w-full" />

            {/* 2. Payment Strategy Info */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-navy">{t('paymentMethod')}</h2>
              <div className="p-6 bg-white border border-navy/10 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span className="font-bold text-navy">Paymob Secure Card Checkout</span>
                  </div>
                  <div className="flex gap-2">
                    <VisaLogo />
                    <MCLogo />
                  </div>
                </div>
                <p className="text-sm text-muted">
                  You will pay in **Egyptian Pounds (EGP)** at a fixed exchange rate of **1 USD = {exchangeRate} EGP**. 
                  One-time secure processing by Paymob.
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium animate-shake">
                  {error}
                </div>
              )}
            </section>

            <div className="h-px bg-navy/10 w-full" />

            {/* 3. Ground Rules */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-navy">{t('groundRules')}</h2>
              <p className="text-muted leading-relaxed">{t('groundRulesDetail')}</p>
              <ul className="space-y-4 font-medium text-navy text-sm">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-navy/20" />{t('followHouseRules')}</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-navy/20" />{t('treatHomeLikeOwn')}</li>
              </ul>
            </section>
          </div>

          {/* RIGHT COLUMN: PRICE SUMMARY */}
          <div>
            <div className="sticky top-28 border border-navy/10 rounded-3xl p-8 bg-white shadow-soft">
              <div className="flex gap-4 pb-8 border-b border-navy/10">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-navy/5 shrink-0">
                  <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold text-navy line-clamp-1">{lang === "ar" ? property.title_ar : property.title}</h3>
                    <p className="text-sm text-muted">{lang === "ar" ? property.location_ar : property.location}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-navy">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span>{property.rating}</span>
                    <span className="text-muted font-normal">({property.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="py-8 space-y-4">
                <h2 className="text-xl font-bold text-navy mb-6">{t('priceDetails')}</h2>
                <div className="flex justify-between items-center text-navy/70 text-sm">
                  <span>${pricePerNight} x {stayNights} {t('night')}</span>
                  <span>${pricePerNight * stayNights}</span>
                </div>
                {extraGuests > 0 && (
                  <div className="flex justify-between items-center text-navy/70 text-sm">
                    <span>+{extraGuests} extra guests × {stayNights} {t('night')}</span>
                    <span>${extraGuestTotal}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-navy/70 text-sm">
                  <span>{t('cleaningFee')}</span>
                  <span>${cleaningFee}</span>
                </div>
                <div className="flex justify-between items-center text-navy/70 text-sm">
                  <span>{t('serviceFee')}</span>
                  <span>${serviceFee}</span>
                </div>
                
                <div className="pt-4 border-t border-navy/10 flex justify-between items-center text-navy font-bold">
                  <span>{t('totalLabel')} (USD)</span>
                  <span className="text-xl">${total}</span>
                </div>

                {/* EGP CONVERSION BOX */}
                <div className="mt-4 p-4 bg-primary/[0.03] border border-primary/20 rounded-2xl flex justify-between items-center group hover:bg-primary/[0.05] transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Paymob Secure Total</span>
                    <span className="text-[10px] text-muted">Fixed Rate: 1 USD = {exchangeRate} EGP</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-black text-primary font-heading tracking-tight">{amountEGP.toLocaleString()} EGP</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white rounded-2xl font-bold text-center shadow-md hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                  {isProcessing ? "Processing..." : t('confirmAndPay')}
                </button>
                <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-muted font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" />
                  <span>256-bit SSL Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: PAYMOB IFRAME OVERLAY */}
      {paymentToken && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 transition-all duration-500">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-md animate-fade-in" onClick={() => setPaymentToken(null)} />
          <div className="relative w-full h-full md:max-w-xl md:h-[85vh] bg-white md:rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="absolute top-0 left-0 right-0 bg-white border-b border-navy/5 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-navy uppercase tracking-widest">Vista Secure Checkout</span>
              </div>
              <button onClick={() => setPaymentToken(null)} className="p-2 hover:bg-navy/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-navy" />
              </button>
            </div>
            <iframe
              src={`https://accept.paymob.com/api/acceptance/iframes/1033348?payment_token=${paymentToken}`}
              className="w-full h-full pt-16"
              title="Secure Payment"
            />
          </div>
        </div>
      )}

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
