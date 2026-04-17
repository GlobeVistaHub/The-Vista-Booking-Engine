"use client";

import { CheckCircle, Home, Calendar, Loader2, MailCheck, X, Info } from "lucide-react";
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
  const [status, setStatus] = useState<"verifying" | "success" | "error" | "pending">("verifying");
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  
  const isCanceled = searchParams.get("success") === "false";
  const email = searchParams.get("email") || "guest@example.com"; // We can pass this in success_url

  useEffect(() => {
    // -------------------------------------------------------------------------
    // FRAME-BUSTER: If this page is stuck in an iframe, break out to top level!
    // -------------------------------------------------------------------------
    if (window.top !== window.self) {
      window.top!.location.href = window.location.href;
      return;
    }

    if (isCanceled) {
      setStatus("error");
      return;
    }

    const verifyBooking = async () => {
      // -------------------------------------------------------------------------
      // FULL-STACK DASHBOARD SYNC (Localhost / Demo Bridge)
      // -------------------------------------------------------------------------
      if (searchParams.get("success") === "true") {
        const transactionId = searchParams.get("id");
        const propertyId = searchParams.get("propertyId");
        const checkIn = searchParams.get("checkIn");
        const checkOut = searchParams.get("checkOut");

        // 1. Mark as SUCCESS immediately for UI
        setStatus("success");

        // 2. Persist to Local Storage for "My Trips" dashboard
        if (propertyId) {
          try {
            const existingBookings = JSON.parse(localStorage.getItem("vista_bookings") || "[]");
            const newBookingRecord = {
              bookingId: transactionId || `VST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              propertyId: propertyId,
              checkIn: checkIn,
              checkOut: checkOut,
              verifiedAt: new Date().toISOString()
            };
            
            // Avoid duplicates
            if (!existingBookings.find((b: any) => b.bookingId === newBookingRecord.bookingId)) {
               localStorage.setItem("vista_bookings", JSON.stringify([newBookingRecord, ...existingBookings]));
            }
          } catch (e) {
            console.error("LocalStorage Sync Failed:", e);
          }
        }

        // 3. SECURE SYNC: Update Database via POST (Bypasses missing webhook on localhost)
        try {
          await fetch("/api/bookings/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email,
              transactionId: transactionId,
              status: "success"
            })
          });
        } catch (e) {
          console.error("Database Manual Sync Failed:", e);
        }
      }

      // 4. Standard verification check
      try {
        const vistaId = searchParams.get("vista_id");
        const fetchUrl = `/api/bookings/verify?email=${encodeURIComponent(email)}&id=${transactionId || ""}&vista_id=${vistaId || ""}`;
        
        const response = await fetch(fetchUrl);
        const data = await response.json();

        if (data.status === "paid" || data.status === "confirmed") {
          setBookingDetails(data);
          setStatus("success");
        } else if ((status as string) !== "success") {
          // Fallback polling for slow database updates
          let attempts = 0;
          const interval = setInterval(async () => {
            attempts++;
            const pollRes = await fetch(fetchUrl);
            const pollData = await pollRes.json();
            
            if (pollData.status === "paid" || pollData.status === "confirmed") {
              setBookingDetails(pollData);
              setStatus("success");
              clearInterval(interval);
            } else if (attempts >= 5) {
              if ((status as string) !== "success") setStatus("pending");
              clearInterval(interval);
            }
          }, 3000);
        }
      } catch (err) {
        console.error("Verification failed:", err);
        if ((status as string) !== "success") setStatus("pending");
      }
    };

    verifyBooking();
  }, [isCanceled, email]);

  if (isCanceled) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-v-background text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-navy">Payment Canceled</h1>
          <p className="text-muted">Your transaction was not completed. No charges were made.</p>
          <button onClick={() => router.push("/checkout")} className="w-full py-4 bg-navy text-white rounded-2xl font-bold">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-v-background min-h-[85vh] flex items-center justify-center py-20 px-6 overflow-hidden">
      <div className="max-w-xl w-full text-center space-y-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

        {status === "verifying" && (
          <div className="space-y-6 animate-pulse">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-navy">Verifying Payment...</h1>
            <p className="text-muted">Waiting for confirmation from Paymob. This usually takes a few seconds.</p>
          </div>
        )}

        {status === "success" && (
          <>
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy tracking-tight">
                {t('bookingConfirmed')}
              </h1>
              <p className="text-lg text-green-600 font-bold leading-relaxed max-w-sm mx-auto">
                Payment Received. Your stay at The Vista is secured.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/" className="w-full sm:w-auto px-8 py-4 bg-white border border-navy/10 text-navy rounded-2xl font-bold shadow-soft">
                {t('backToHome')}
              </Link>
              <Link href="/profile" className="w-full sm:w-auto px-8 py-4 bg-navy text-white rounded-2xl font-bold shadow-soft">
                {t('viewBookings')}
              </Link>
            </div>

            <div className="pt-12 border-t border-navy/5">
              <p className="text-sm text-muted font-medium">
                Booking ID: <span className="text-navy font-bold uppercase">{bookingDetails?.bookingReference || bookingDetails?.booking_reference || bookingDetails?.id || "VST-PAYMOB-SUCCESS"}</span>
              </p>
            </div>
          </>
        )}

        {status === "pending" && (
          <div className="space-y-6">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
              <Info className="w-12 h-12 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-navy">Payment Still Processing</h1>
            <p className="text-muted">Paymob is still verifying your transaction. We will update your dashboard and send an email once confirmed.</p>
            <Link href="/profile" className="block w-full py-4 bg-navy text-white rounded-2xl font-bold">Go to My Bookings</Link>
          </div>
        )}
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
