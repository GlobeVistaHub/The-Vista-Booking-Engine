"use client";

import { CheckCircle, Home, Calendar, Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { PROPERTIES } from "@/data/properties";
import { VISTA_CONFIG } from "@/config/constants";

// -------------------------------------------------------------------------
// CONFIGURATION: n8n automation is now handled server-side at:
// src/app/api/booking-confirmation/route.ts
// -------------------------------------------------------------------------


function SuccessContent() {
  const { t, lang } = useLanguage();
  const searchParams = useSearchParams();
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [bookingId, setBookingId] = useState<string>("");

  const hasSaved = useRef(false);

  useEffect(() => {
    if (hasSaved.current) return;

    const propId = searchParams.get("id") || "X";
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    
    try {
      const existing = JSON.parse(localStorage.getItem("vista_bookings") || "[]");
      
      // Look for a very recent duplicate (within 5 minutes, same property and dates) 
      // This handles page refreshes and strict-mode double mounts
      const duplicate = existing.find((b: any) => 
        b.propertyId === propId && 
        b.checkIn === from && 
        b.checkOut === to &&
        (new Date().getTime() - new Date(b.timestamp).getTime() < 300000)
      );

      if (duplicate) {
        setBookingId(duplicate.bookingId);
        hasSaved.current = true;
        return;
      }

      // If no duplicate, generate new
      const random = Math.random().toString(36).substring(7).toUpperCase();
      const currentYear = new Date().getFullYear();
      const newBookingId = `VST-${currentYear}-${propId}-${random}`;
      
      setBookingId(newBookingId);
      
      existing.unshift({ 
        bookingId: newBookingId, 
        propertyId: propId, 
        checkIn: from,
        checkOut: to,
        timestamp: new Date().toISOString() 
      });
      localStorage.setItem("vista_bookings", JSON.stringify(existing.slice(0, 10)));
      hasSaved.current = true;
    } catch(e) {}
  }, [searchParams]);

  useEffect(() => {
    const triggerAutomation = async () => {
      // Only trigger if we have an ID and we haven't started yet
      if (!bookingId || status !== "idle") return;
      
      setStatus("loading");
      
      // Find the specific property to get the owner's details
      const property = PROPERTIES.find(p => p.id === Number(searchParams.get("id")));

      // Constructing robust payload for CRM/Accounting
      const payload = {
        bookingId: bookingId,
        propertyId: searchParams.get("id"),
        propertyTitle: property?.title || "Luxury Villa",
        ownerPhone: property?.ownerPhone || "+201000000000", // Prepare data for n8n/WhatsApp
        dates: {
          from: searchParams.get("from"),
          to: searchParams.get("to")
        },
        guests: {
          adults: searchParams.get("adults"),
          children: searchParams.get("children")
        },
        financials: {
          price: searchParams.get("price"),
          cleaning: searchParams.get("cleaning"),
          service: searchParams.get("service"),
          total: searchParams.get("total")
        },
        guestEmail: "guest@example.com",
        timestamp: new Date().toISOString()
      };


      try {
        const response = await fetch("/api/booking-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("n8n automation failed:", err);
        setStatus("error");
      }
    };

    triggerAutomation();
  }, [searchParams, status, bookingId]);


  return (
    <div className="w-full bg-v-background min-h-[85vh] flex items-center justify-center py-20 px-6 overflow-hidden">
      <div className="max-w-xl w-full text-center space-y-10 relative">
        
        {/* Cinematic Backdrop Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

        {/* Success Icon */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy tracking-tight">
            {t('bookingConfirmed')}
          </h1>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg text-green-600 font-bold leading-relaxed max-w-sm mx-auto animate-in fade-in zoom-in duration-500">
              {t('successSubtitle')}
            </p>
            
            {(status === "loading" || status === "idle") && (
              <div className="flex items-center gap-2 text-green-600/60 text-xs font-medium animate-pulse mt-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{t('confirmingBooking')}</span>
              </div>
            )}

            
            {status === "success" && (
              <div className="flex items-center gap-2 text-green-600 font-bold text-xs animate-in fade-in slide-in-from-bottom-2 mt-2">
                <MailCheck className="w-4 h-4" />
                <span>{t('emailSent')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/profile" 
            className="w-full sm:w-auto px-8 py-4 bg-navy text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-navy/90 transition-all shadow-soft group"
          >
            <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {t('viewBookings')}
          </Link>
          
          {/* PREMIUM WHATSAPP CONTACT BRIDGE */}
          {status === "success" && (
            <a 
              href={VISTA_CONFIG.concierge.whatsappLink(`Hello, I have just booked ${PROPERTIES.find(p => p.id === Number(searchParams.get("id")))?.title || 'a villa'} via The Vista. My Booking ID is ${bookingId}. I would like to confirm the check-in details.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg scale-105"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Contact Concierge
            </a>
          )}

          <Link 
            href="/" 
            className="w-full sm:w-auto px-8 py-4 bg-white border border-navy/10 text-navy rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-navy/[0.02] transition-all shadow-soft"
          >
            <Home className="w-5 h-5" />
            {t('backToHome')}
          </Link>
        </div>


        {/* Trip Support Info */}
        <div className="pt-12 border-t border-navy/5">
          <p className="text-sm text-muted font-medium min-h-[1.25rem]">
            {bookingId && (
              <>
                Booking ID: <span className="text-navy">{bookingId}</span>
              </>
            )}
          </p>
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
