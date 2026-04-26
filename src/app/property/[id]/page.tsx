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
  Link2,
  Check,
  ChevronRight,
  ChevronLeft,
  Heart,
  Share,
  Calendar as CalendarIcon,
  X as CloseIcon,
  Mail,
  Send,
  Plus,
  Minus,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { getPropertyById, getPublicOccupiedDates } from "@/data/api";
import { Property } from "@/data/properties";
import { getPricingSettings } from "@/data/pricing_overrides";

function PropertyContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();
  const { t, lang } = useLanguage();
  const { toggleWishlist, isInWishlist } = useUser();
  const [currentImg, setCurrentImg] = useState(0);
  const [shared, setShared] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // BOOKING STATES
  const [activeTab, setActiveTab] = useState<"dates" | "guests" | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    getPropertyById(id as string).then(data => {
      setProperty(data);
      setIsLoading(false);
    });

    // 1. Fetch occupancy for the "Fully Booked" banner
    getPublicOccupiedDates().then(setBookings);

    // 2. Initialize states from URL
    const urlFrom = searchParams.get("from");
    const urlTo = searchParams.get("to");
    if (urlFrom) setDateRange(prev => ({ ...prev, from: new Date(urlFrom) }));
    if (urlTo) setDateRange(prev => ({ ...prev, to: new Date(urlTo) }));
    const urlAdults = Number(searchParams.get("adults"));
    const urlChildren = Number(searchParams.get("children"));
    if (urlAdults) setAdults(urlAdults);
    if (urlChildren) setChildren(urlChildren);
  }, [id, searchParams]);

  // Determine if Booked Today
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const isBookedToday = bookings.some(b => 
    String(b.property_id) === String(id) && 
    (b.status === 'confirmed' || b.status === 'pending') &&
    todayStr >= b.check_in && todayStr < b.check_out
  );

  const handleShareToPlatform = (platform: string) => {
    const url = window.location.href;
    const title = lang === "ar" ? property?.title_ar : property?.title;
    const text = `${title} - ${url}`;

    const platforms: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      instagram: `https://www.instagram.com/`, // Instagram requires manual upload, so we link to the app
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title || "The Vista")}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title || "")}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title || "")}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title || "")}`,
      email: `mailto:?subject=${encodeURIComponent(title || "The Vista")}&body=${encodeURIComponent(text)}`
    };

    if (platforms[platform]) {
      window.open(platforms[platform], '_blank', 'width=600,height=400');
    }
    setShareMenuOpen(false);
  };

  const copyToClipboard = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
      setShareMenuOpen(false);
    } catch (_) {}
  };

  const handleShareClick = () => {
    // ALWAYS use our custom "Vista Ribbon" to keep it premium and consistent.
    // This stops the "Double Menu" problem on mobile.
    setShareMenuOpen(!shareMenuOpen);
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

  // PRICING CALCULATION (Reactive to state)
  const stayNights = dateRange.from && dateRange.to ? Math.max(1, differenceInDays(dateRange.to, dateRange.from)) : 1;
  const totalGuests = adults + children;
  
  // LOGIC SYNC: Match Checkout Page exactly
  const pricing = getPricingSettings(property);
  const maxGuests = parseInt(String(property.guests)) || 8;
  const baseGuests = pricing.baseGuests;
  const extraGuestFee = pricing.extraGuestFee;
  const extraGuests = Math.max(0, totalGuests - baseGuests);
  const extraGuestTotal = extraGuests * extraGuestFee * stayNights;

  const pricePerNight = property.price;
  const cleaningFee = pricing.cleaningFee;
  const serviceFee = Math.round((pricePerNight * stayNights + extraGuestTotal) * pricing.serviceFeeRate); 
  const total = pricePerNight * stayNights + extraGuestTotal + cleaningFee + serviceFee;

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
        <div className={`absolute inset-0 bg-navy/20 mix-blend-multiply pointer-events-none ${isBookedToday ? 'opacity-60 grayscale-[0.2]' : ''}`} />

        {isBookedToday && (
          <div className="absolute top-24 left-8 z-30 bg-navy text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] border border-white/10 shadow-2xl">
            {t('fullyBooked')}
          </div>
        )}

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
          <div className="relative">
            <AnimatePresence>
              {shareMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full right-0 mb-4 p-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-navy/5 grid grid-cols-4 gap-2 min-w-[280px] z-50"
                  style={{ transformOrigin: 'bottom right' }}
                >
                  {[
                    { id: 'whatsapp', icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.35-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    ), label: 'WhatsApp', color: 'bg-[#25D366]/10 text-[#25D366]' },
                    { id: 'instagram', icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    ), label: 'Instagram', color: 'bg-[#E1306C]/10 text-[#E1306C]' },
                    { id: 'telegram', icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.257.257-.527.257l.214-3.048 5.551-5.011c.241-.214-.052-.333-.374-.121l-6.862 4.318-2.955-.924c-.642-.201-.654-.642.134-.949l11.55-4.45c.535-.195.991.13.82.956z"/></svg>
                    ), label: 'Telegram', color: 'bg-[#0088cc]/10 text-[#0088cc]' },
                    { id: 'messenger', icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.303 2.253.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.893l-3.069-3.273-5.987 3.273 6.587-7.001 3.136 3.272 5.918-3.272-6.585 7.001z"/></svg>
                    ), label: 'Messenger', color: 'bg-[#0084FF]/10 text-[#0084FF]' },
                    { id: 'facebook', icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    ), label: 'Facebook', color: 'bg-[#1877F2]/10 text-[#1877F2]' },
                    { id: 'linkedin', icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    ), label: 'LinkedIn', color: 'bg-[#0A66C2]/10 text-[#0A66C2]' },
                    { id: 'twitter', icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117v.002z"/></svg>
                    ), label: 'X', color: 'bg-[#000000]/10 text-[#000000]' },
                    { id: 'pinterest', icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.771-2.249 3.771-5.49 0-2.868-2.063-4.872-5.003-4.872-3.41 0-5.412 2.558-5.412 5.2 0 1.03.397 2.137.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.397 2.965 7.397 6.929 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.538.535 6.621 0 11.987-5.365 11.987-11.987C23.999 5.367 18.636 0 12.017 0z"/></svg>
                    ), label: 'Pinterest', color: 'bg-[#BD081C]/10 text-[#BD081C]' },
                    { id: 'reddit', icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.051l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.04.282.063.559.063.847 0 2.492-2.822 4.514-6.301 4.514-3.481 0-6.303-2.022-6.303-4.514 0-.288.023-.565.063-.847A1.737 1.737 0 0 1 6.43 12.29c0-.968.785-1.754 1.754-1.754.463 0 .875.18 1.179.465 1.183-.834 2.822-1.384 4.629-1.474l.719-3.399 2.303.486c-.005.043-.008.086-.008.129 0 .688.561 1.249 1.249 1.249zm-8.23 7.844c-.611 0-1.107.496-1.107 1.107 0 .61.496 1.106 1.107 1.106.61 0 1.106-.496 1.106-1.106 0-.611-.496-1.107-1.106-1.107zm6.442 0c-.611 0-1.107.496-1.107 1.107 0 .61.496 1.106 1.107 1.106.61 0 1.106-.496 1.106-1.106 0-.611-.496-1.107-1.106-1.107zm-4.321 3.992c-.066 0-.131-.026-.182-.077a1.648 1.648 0 0 1-.226-.282.164.164 0 0 1 .116-.242c1.393-.323 2.828-.323 4.221 0a.164.164 0 0 1 .116.242c-.062.103-.138.197-.226.282a.256.256 0 0 1-.364 0 .256.256 0 0 1-.077-.182c.038-.046.07-.091.093-.138-.853-.162-1.735-.162-2.587 0 .023.047.055.092.093.138a.256.256 0 0 1-.077.182.252.252 0 0 1-.182.077z"/></svg>
                    ), label: 'Reddit', color: 'bg-[#FF4500]/10 text-[#FF4500]' },
                    { id: 'email', icon: <Mail className="w-4 h-4" />, label: 'Gmail', color: 'bg-[#EA4335]/10 text-[#EA4335]' },
                    { id: 'copy', icon: <Link2 className="w-4 h-4" />, label: 'Copy Link', color: 'bg-navy/10 text-navy', action: copyToClipboard },
                  ].map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => platform.action ? platform.action() : handleShareToPlatform(platform.id)}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-navy/5 transition-all group/item"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover/item:scale-110 ${platform.color}`}>
                        {platform.icon}
                      </div>
                      <span className="text-[9px] font-bold text-navy/60 uppercase tracking-tighter">{platform.label}</span>
                    </button>
                  ))}
                  
                  {/* Close button for menu */}
                  <button 
                    onClick={() => setShareMenuOpen(false)}
                    className="col-span-4 mt-1 py-1.5 border-t border-navy/5 text-[9px] font-bold text-muted hover:text-navy uppercase tracking-widest transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleShareClick}
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
          </div>
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

              {/* Interactive Input Fields */}
              <div className="relative">
                <AnimatePresence>
                  {/* DATE PICKER POPOVER */}
                  {activeTab === 'dates' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-0 mb-4 bg-white rounded-3xl p-6 shadow-2xl border border-navy/5 z-50 min-w-[320px]"
                      style={{ transformOrigin: 'bottom left' }}
                    >
                      <DayPicker
                        mode="range"
                        selected={{ from: dateRange.from, to: dateRange.to }}
                        onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                        disabled={[
                          { before: new Date() },
                          ...bookings
                            .filter(b => String(b.property_id) === String(id))
                            .map(b => ({
                              from: new Date(b.check_in),
                              to: new Date(new Date(b.check_out).getTime() - 24 * 60 * 60 * 1000)
                            }))
                        ]}
                        numberOfMonths={1}
                        className="font-body"
                        dir={lang === "ar" ? "rtl" : "ltr"}
                        classNames={{
                          day_selected: "bg-primary text-white hover:bg-primary font-bold",
                          day_today: "font-bold text-navy",
                          day_disabled: "text-muted opacity-30 line-through cursor-not-allowed",
                        }}
                      />
                      <button
                        onClick={() => setActiveTab(null)}
                        className="w-full mt-4 py-3 bg-primary text-white rounded-2xl font-bold text-sm hover:brightness-110 transition-all shadow-md"
                      >
                        {t('saveChanges')}
                      </button>
                    </motion.div>
                  )}

                  {/* GUESTS POPOVER */}
                  {activeTab === 'guests' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full right-0 mb-4 bg-white rounded-3xl p-6 shadow-2xl border border-navy/5 z-50 min-w-[280px]"
                      style={{ transformOrigin: 'bottom right' }}
                    >
                      {/* ADULTS */}
                      <div className="flex items-center justify-between py-4 border-b border-navy/5">
                        <div>
                          <h4 className="font-bold text-navy">{t('adults')}</h4>
                          <p className="text-[10px] text-muted">{t('adultsAge')}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:border-navy transition-colors disabled:opacity-30"
                            disabled={adults <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-4 text-center font-medium text-navy">{adults}</span>
                          <button
                            onClick={() => {
                              if (adults + children < pricing.maxGuests) setAdults(adults + 1);
                            }}
                            className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:border-navy transition-colors disabled:opacity-30"
                            disabled={adults + children >= pricing.maxGuests}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* CHILDREN */}
                      <div className="flex items-center justify-between py-4">
                        <div>
                          <h4 className="font-bold text-navy">{t('children')}</h4>
                          <p className="text-[10px] text-muted">{t('childrenAge')}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:border-navy transition-colors disabled:opacity-30"
                            disabled={children <= 0}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-4 text-center font-medium text-navy">{children}</span>
                          <button
                            onClick={() => {
                              if (adults + children < pricing.maxGuests) setChildren(children + 1);
                            }}
                            className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:border-navy transition-colors disabled:opacity-30"
                            disabled={adults + children >= pricing.maxGuests}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab(null)}
                        className="w-full mt-4 py-3 bg-primary text-white rounded-2xl font-bold text-sm hover:brightness-110 transition-all shadow-md"
                      >
                        {t('saveChanges')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-2 border border-navy/10 rounded-2xl overflow-hidden relative z-10">
                  <div 
                    onClick={() => setActiveTab(activeTab === 'dates' ? null : 'dates')}
                    className={`p-4 border-r border-navy/10 hover:bg-navy/[0.02] transition-colors cursor-pointer text-start ${activeTab === 'dates' ? 'bg-navy/[0.05]' : ''}`}
                  >
                    <p className="text-[10px] font-bold text-navy uppercase tracking-widest mb-1">{t('checkIn')}</p>
                    <p className="text-sm font-medium text-muted">
                      {dateRange.from ? format(dateRange.from, 'dd/MM/yyyy') : t('addDates')}
                    </p>
                  </div>
                  <div 
                    onClick={() => setActiveTab(activeTab === 'dates' ? null : 'dates')}
                    className={`p-4 hover:bg-navy/[0.02] transition-colors cursor-pointer text-start ${activeTab === 'dates' ? 'bg-navy/[0.05]' : ''}`}
                  >
                    <p className="text-[10px] font-bold text-navy uppercase tracking-widest mb-1">{t('checkOut')}</p>
                    <p className="text-sm font-medium text-muted">
                      {dateRange.to ? format(dateRange.to, 'dd/MM/yyyy') : t('addDates')}
                    </p>
                  </div>
                  <div 
                    onClick={() => setActiveTab(activeTab === 'guests' ? null : 'guests')}
                    className={`col-span-2 p-4 border-t border-navy/10 hover:bg-navy/[0.02] transition-colors cursor-pointer flex justify-between items-center text-start ${activeTab === 'guests' ? 'bg-navy/[0.05]' : ''}`}
                  >
                    <div>
                      <p className="text-[10px] font-bold text-navy uppercase tracking-widest mb-1">{t('guests')}</p>
                      <p className="text-sm font-medium text-navy">
                        {totalGuests > 0 ? `${totalGuests} ${t('guestCount')}` : t('addGuests')}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-muted transition-transform ${activeTab === 'guests' ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <button className="w-full py-4 bg-primary hover:brightness-110 text-white rounded-2xl font-bold text-center text-lg shadow-md transition-all active:scale-95">
                    {t('reserve')}
                  </button>
                </SignInButton>
              ) : (
                <Link
                  href={isBookedToday ? "#" : `/checkout?id=${property.id}&from=${dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}&to=${dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}&adults=${adults}&children=${children}`}
                  className={`w-full py-4 rounded-2xl font-bold text-center text-lg shadow-md transition-all active:scale-95 ${isBookedToday ? 'bg-navy/20 text-navy/40 cursor-not-allowed pointer-events-none' : 'bg-primary hover:brightness-110 text-white'}`}
                >
                  {isBookedToday ? t('fullyBooked') : t('reserve')}
                </Link>
              )}

              <p className="text-center text-muted text-xs">
                {t('notChargedYet')}
              </p>

              {/* Price Breakdown */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between text-navy/70">
                  <span className="underline decoration-navy/20 underline-offset-4 cursor-pointer hover:text-navy">${pricePerNight} x {stayNights} {t('night')}</span>
                  <span>${pricePerNight * stayNights}</span>
                </div>
                {extraGuests > 0 && (
                  <div className="flex justify-between text-navy/70">
                    <span className="underline decoration-navy/20 underline-offset-4 cursor-pointer hover:text-navy">+{extraGuests} {t('extraGuests')} x {stayNights} {t('night')}</span>
                    <span>${extraGuestTotal}</span>
                  </div>
                )}
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
