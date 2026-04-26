"use client";

import { useEffect, useState } from "react";
import { MapPin, Heart, Star } from "lucide-react";
import Link from "next/link";
import BookingWidget from "@/components/BookingWidget";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { getProperties, getPublicOccupiedDates } from "@/data/api";
import { Property } from "@/data/properties";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const { t, lang } = useLanguage();
  const { toggleWishlist, isInWishlist } = useUser();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllData = () => {
      // 1. Fetch properties that aren't manually hidden
      getProperties({ includeHidden: false }).then(setProperties);

      // 2. Smart Fetch: Get occupancy dates (handles Demo vs Real automatically)
      getPublicOccupiedDates().then(data => {
        console.log(`[Vista-Sync] Today's Occupancy Report: ${data.length} active bookings found.`);
        if (data.length > 0) {
          console.table(data.map(b => ({ property: b.property_id, check_in: b.check_in, check_out: b.check_out, status: b.status })));
        }
        setBookings(data);
      });
    };

    fetchAllData();

    // ENABLE REALTIME SYNC (Visibility + Occupancy)
    const propertiesChannel = supabase
      .channel('public-properties-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
        console.log("[Vista-Sync] Property visibility change detected...");
        fetchAllData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        console.log("[Vista-Sync] Booking occupancy change detected...");
        fetchAllData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(propertiesChannel);
    };
  }, []);

  // Filter properties: ON is visible, OFF is invisible
  const visibleProperties = properties.filter(p => !p.isBooked);

  return (
    <main className="w-full min-h-screen pb-24">
      {/* 1. THE HERO SECTION */}
      <div className="relative w-full min-h-[85vh] flex flex-col items-center justify-start pt-[18vh] md:pt-[25vh]">
        {/* BACKGROUND IMAGE & OVERLAY */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070')" }}
        />
        <div className="absolute inset-0 z-10 bg-slate-900/40 mix-blend-multiply" />

        {/* HERO TYPOGRAPHY */}
        <div className="relative z-20 text-center px-6 pb-24 md:pb-32 mt-10 md:mt-0">
          <h1 className="text-5xl md:text-7xl font-heading font-medium text-white tracking-tight drop-shadow-lg max-w-4xl mx-auto">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 text-lg md:text-xl font-body text-white/90 font-light drop-shadow-md max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
        </div>

        {/* THE BOOKING WIDGET (INTERACTIVE CLIENT COMPONENT) */}
        <div className="absolute -bottom-8 md:-bottom-[4.5rem] z-[100] w-full flex justify-center px-4">
          <BookingWidget properties={visibleProperties} />
        </div>
      </div>

      {/* 2. CURATED PROPERTIES GRID */}
      <section className="max-w-7xl mx-auto px-6 mt-32 md:mt-40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-medium text-navy tracking-tight">
              {t('curatedTitle')}
            </h2>
            <p className="mt-2 text-muted font-body text-lg">
              {t('curatedSub')}
            </p>
          </div>
          <Link href="/search" className="mt-4 md:mt-0 self-start md:self-auto">
            <button className="bg-transparent text-primary font-medium border-b border-primary pb-1 hover:brightness-110 transition-all uppercase tracking-wide text-sm">
              {t('viewPortfolio')}
            </button>
          </Link>
        </div>

        {/* CSS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProperties.length === 0 ? (
            <div className="col-span-full py-24 flex justify-center items-center gap-2">
              <div className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-pulse"></div>
              <div className="w-2.5 h-2.5 bg-primary/70 rounded-full animate-pulse delay-75"></div>
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse delay-150"></div>
            </div>
          ) : visibleProperties.map((property) => {
            // Check occupancy for Today
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;

            // Show FULLY BOOKED ribbon only if occupied TODAY
            // This allows guests to still click and book for future/other dates
            const isBooked = bookings.some(b =>
              String(b.property_id) === String(property.id) &&
              b.status === 'confirmed' &&
              todayStr >= b.check_in && todayStr < b.check_out
            );

            return (
              <Link
                href={`/property/${property.id}`}
                key={property.id}
                className={isBooked ? "pointer-events-none cursor-default" : ""}
              >
                <article
                  className={`group bg-surface rounded-2xl overflow-hidden h-full transition-all ${isBooked ? 'opacity-60 grayscale-[0.2]' : 'cursor-pointer'}`}
                  style={{ boxShadow: "var(--shadow-soft)" }}
                >
                  {/* IMAGE WRAPPER */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />

                    {isBooked && (
                      <div className="absolute top-0 left-0 z-30 bg-navy text-white px-3 py-1 rounded-br-xl text-[10px] font-black uppercase tracking-widest border-r border-b border-white/10">
                        {t('fullyBooked')}
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(property.id);
                      }}
                      className={`absolute top-4 right-4 p-2.5 bg-white/95 hover:bg-white backdrop-blur-md rounded-full shadow-lg transition-all z-20 hover:scale-110 active:scale-95 ${isInWishlist(property.id) ? 'text-red-500' : 'text-muted hover:text-red-500'
                        }`}
                    >
                      <Heart className={`w-5 h-5 transition-all ${isInWishlist(property.id) ? 'fill-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* CARD DETAILS */}
                  <div className="p-6 pb-8">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-heading text-xl text-navy font-medium group-hover:text-primary transition-colors">
                        {lang === "ar" ? property.title_ar : property.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm font-medium text-navy">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span>{property.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-muted text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{lang === "ar" ? property.location_ar : property.location}</span>
                    </div>

                    <div className="flex items-end gap-1">
                      <span className="font-bold text-lg text-navy">${property.price}</span>
                      <span className="text-sm text-muted mb-0.5">{t('perNight')}</span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>

    </main>
  );
}

