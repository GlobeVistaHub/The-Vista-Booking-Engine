"use client";

import { CheckCircle, Home, Calendar, Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { PROPERTIES } from "@/data/properties";
import { VISTA_CONFIG } from "@/config/constants";

// -------------------------------------------------------------------------
// CONFIGURATION: n8n automation is now handled server-side at:
// src/app/api/booking-confirmation/route.ts
// -------------------------------------------------------------------------


function SuccessContent() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [bookingId, setBookingId] = useState<string>("");

  const hasSaved = useRef(false);

  useEffect(() => {
    if (hasSaved.current) return;

    // IMPORTANT: If we already have a bookingId in the URL, 
    // it means this is a re-visit to an already confirmed booking.
    // Do NOT create a new one.
    const existingId = searchParams.get("bookingId");
    if (existingId) {
      setBookingId(existingId);
      setStatus("success"); // IMMEDIATELY SUCCESS if ID exists
      hasSaved.current = true;
      return;
    }

    const propId = searchParams.get("id");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    
    // Only proceed if we have the necessary "Intent to Book" parameters
    if (!propId || !from || !to) return;
    
    try {
      const existing = JSON.parse(localStorage.getItem("vista_bookings") || "[]");
      
      // Look for a very recent duplicate (within 5 minutes, same property and dates) 
      const duplicate = existing.find((b: any) => 
        b.propertyId === propId && 
        b.checkIn === from && 
        b.checkOut === to &&
        (new Date().getTime() - new Date(b.timestamp).getTime() < 300000)
      );

      let workingId = "";

      if (duplicate) {
        workingId = duplicate.bookingId;
      } else {
        // If no duplicate, generate new
        const random = Math.random().toString(36).substring(7).toUpperCase();
        const currentYear = new Date().getFullYear();
        workingId = `VST-${currentYear}-${propId}-${random}`;
        
        existing.unshift({ 
          bookingId: workingId, 
          propertyId: propId, 
          checkIn: from,
          checkOut: to,
          timestamp: new Date().toISOString() 
        });
        localStorage.setItem("vista_bookings", JSON.stringify(existing.slice(0, 10)));
      }

      setBookingId(workingId);
      hasSaved.current = true;
    } catch(e) {}
  }, [searchParams, router]);

  useEffect(() => {
    const triggerAutomation = async () => {
      // Only trigger if we have an ID and we haven't started yet
      if (!bookingId || status !== "idle") return;
      
      const propId = searchParams.get("id");
      const from = searchParams.get("from");
      const to = searchParams.get("to");

      // Verify we have the funnel data before starting
      if (!from || !to || !propId) return;

      setStatus("loading");
      
      const property = PROPERTIES.find(p => p.id === Number(propId));

      const payload = {
        bookingId: bookingId,
        propertyId: propId,
        propertyTitle: property?.title || "Luxury Villa",
        ownerPhone: property?.ownerPhone || "+201000000000",
        dates: { from, to },
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
          
          // ONLY CLEANUP URL AFTER SUCCESS
          const newParams = new URLSearchParams({
            bookingId: bookingId,
            id: propId
          });
          router.replace(`/success?${newParams.toString()}`, { scroll: false });
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("n8n automation failed:", err);
        setStatus("error");
      }
    };

    triggerAutomation();
  }, [searchParams, status, bookingId, router]);


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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/" 
            className="w-full sm:w-auto px-8 py-4 bg-white border border-navy/10 text-navy rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-navy/[0.02] transition-all shadow-soft"
          >
            <Home className="w-5 h-5" />
            {t('backToHome')}
          </Link>

          <Link 
            href="/profile" 
            className="w-full sm:w-auto px-8 py-4 bg-navy text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-navy/90 transition-all shadow-soft group"
          >
            <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {t('viewBookings')}
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
