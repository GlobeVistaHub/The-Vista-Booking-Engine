"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Map as MapIcon, Zap } from "lucide-react";
import { parseISO } from "date-fns";

import PropertyCard from "@/components/PropertyCard";
import MapWrapper from "@/components/MapWrapper";
import { useLanguage } from "@/context/LanguageContext";
import { PROPERTIES } from "@/data/properties";

// ─── Inner component (needs useSearchParams inside Suspense) ────────────────
function SearchContent() {
  const { t, lang } = useLanguage();
  const searchParams = useSearchParams();
  const [showMap, setShowMap] = useState(false);

  // ── Read URL params from the Search Widget ──────────────────────────────
  const urlLocation = searchParams.get("location") ?? "";
  const urlFrom     = searchParams.get("from") ?? "";
  const urlTo       = searchParams.get("to") ?? "";
  const urlAdults   = Number(searchParams.get("adults") ?? 0);
  const urlChildren = Number(searchParams.get("children") ?? 0);
  const totalGuests = urlAdults + urlChildren;

  // ── Secondary filter state (filter bar on search page) ──────────────────
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [instantBookOnly, setInstantBookOnly] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);

  // ── Step 1: Apply URL-level filters (location + guests) ──────────────────
  const urlFilteredProperties = useMemo(() => {
    return PROPERTIES.filter(p => {
      if (urlLocation && p.location !== urlLocation) return false;
      if (totalGuests > 0 && Number(p.guests) < totalGuests) return false;
      return true;
    });
  }, [urlLocation, totalGuests]);

  // ── Step 2: Apply secondary filters (type + price + instantBook) ─────────
  const filteredProperties = useMemo(() => {
    let results = urlFilteredProperties.filter(p => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(p.type)) return false;
      if (p.price < priceRange.min || p.price > priceRange.max) return false;
      return true;
    });
    if (instantBookOnly) results = results.filter(p => p.tags.includes("tagInstantBook"));
    return results;
  }, [urlFilteredProperties, selectedTypes, priceRange, instantBookOnly]);

  // ── Type chips are derived from the URL-filtered set, not all properties ──
  const availableTypes = useMemo(
    () => Array.from(new Set(urlFilteredProperties.map(p => p.type))),
    [urlFilteredProperties]
  );

  // ── Dynamic header subtitle ──────────────────────────────────────────────
  const headerSubtitle = useMemo(() => {
    const parts: string[] = [];
    if (filteredProperties.length > 0)
      parts.push(`${filteredProperties.length} ${filteredProperties.length === 1 ? "stay" : "stays"}`);
    if (urlFrom && urlTo) parts.push(`${urlFrom} → ${urlTo}`);
    if (totalGuests > 0) parts.push(`${totalGuests} ${t("guests")}`);
    return parts.length > 0 ? parts.join("  ·  ") : t("searchHeaderSubtitle");
  }, [filteredProperties.length, urlFrom, urlTo, totalGuests, t]);

  const headerTitle = useMemo(() => {
    if (urlLocation) {
      const sample = PROPERTIES.find(p => p.location === urlLocation);
      const displayLocation = lang === "ar" && sample ? sample.location_ar : urlLocation;
      return lang === "ar"
        ? `إقامات مختارة في ${displayLocation}`
        : `Curated Stays in ${displayLocation}`;
    }
    return t("searchHeaderTitle");
  }, [urlLocation, lang, t]);

  const resetAll = () => {
    setSelectedTypes([]);
    setPriceRange({ min: 0, max: 2000 });
    setInstantBookOnly(false);
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-full flex relative">

        {/* LEFT COLUMN */}
        <section className="w-full lg:w-1/2 flex flex-col bg-white overflow-x-hidden">

          {/* HEADER */}
          <div className="px-4 sm:px-6 lg:px-12 pt-12 pb-4">
            <p className="text-xs uppercase tracking-widest text-muted mb-1">{headerSubtitle}</p>
            <h1 className="text-2xl sm:text-3xl font-heading text-navy">{headerTitle}</h1>
          </div>

          {/* FILTER BAR */}
          <div className="border-b border-navy/5 bg-white sticky top-20 z-[100] relative">

            {/* SLIDER ROW */}
            <div
              onScroll={(e) => setScrollLeft(e.currentTarget.scrollLeft)}
              className="overflow-x-auto no-scrollbar"
            >
              <div className="flex items-center gap-2.5 px-4 sm:px-6 lg:px-12 py-5 min-w-max">

                {/* RESET BUTTON */}
                <button
                  onClick={resetAll}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border border-navy/10 text-navy/40 hover:text-navy hover:bg-navy/5 transition-all uppercase text-[10px] font-black tracking-[0.15em]"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{t("filtersOut")}</span>
                </button>

                {/* TYPE BUTTON */}
                <button
                  id="type-filter-btn"
                  onClick={() => { setIsTypeOpen(!isTypeOpen); setIsPriceOpen(false); }}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                    selectedTypes.length > 0
                      ? "bg-navy text-white border-navy shadow-lg shadow-navy/20"
                      : "bg-white text-navy border-navy/10 hover:border-navy hover:bg-navy/[0.02]"
                  }`}
                >
                  {t("typeOfPlace")}
                </button>

                {/* PRICE BUTTON */}
                <button
                  id="price-filter-btn"
                  onClick={() => { setIsPriceOpen(!isPriceOpen); setIsTypeOpen(false); }}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                    priceRange.min > 0 || priceRange.max < 2000
                      ? "bg-navy text-white border-navy shadow-lg shadow-navy/20"
                      : "bg-white text-navy border-navy/10 hover:border-navy hover:bg-navy/[0.02]"
                  }`}
                >
                  {t("price")}
                </button>

                {/* INSTANT BOOK BUTTON */}
                <button
                  onClick={() => setInstantBookOnly(!instantBookOnly)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-2 ${
                    instantBookOnly
                      ? "bg-navy text-white border-navy shadow-lg shadow-navy/30"
                      : "bg-white text-navy/40 border-navy/10 hover:border-navy/30 hover:bg-navy/5"
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 ${instantBookOnly ? "fill-current" : "text-primary"}`} />
                  {t("instantBook")}
                </button>
              </div>
            </div>

            {/* FLOATING DROPDOWN LAYER */}
            <div
              className="absolute top-0 left-0 w-full pointer-events-none z-[110]"
              style={{ transform: `translateX(-${scrollLeft}px)` }}
            >
              {isTypeOpen && (
                <div
                  className={`absolute top-16 pointer-events-auto ${lang === "ar" ? "right-[calc(100vw-280px)]" : "left-[140px]"} w-64 bg-white rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.15)] border border-navy/5 p-6 animate-in fade-in zoom-in-95 duration-300`}
                  dir={lang === "ar" ? "rtl" : "ltr"}
                >
                  <p className="text-[10px] font-black text-navy/30 tracking-widest uppercase mb-4 text-start">{t("selectCategories")}</p>
                  <div className="space-y-4 text-start">
                    {availableTypes.map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() =>
                            setSelectedTypes(prev =>
                              prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                            )
                          }
                          className="w-5 h-5 rounded border-navy/10 text-navy focus:ring-navy cursor-pointer transition-all"
                        />
                        <span className="text-sm font-bold text-navy/80 group-hover:text-primary transition-colors">
                          {(t as any)(type) || type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {isPriceOpen && (
                <div
                  className={`absolute top-16 pointer-events-auto ${lang === "ar" ? "right-[calc(100vw-400px)]" : "left-[200px]"} w-80 bg-white rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.15)] border border-navy/10 p-10 animate-in fade-in zoom-in-95 duration-300`}
                  dir={lang === "ar" ? "rtl" : "ltr"}
                >
                  <h4 className="text-xs font-black text-navy uppercase tracking-widest mb-8 border-b border-navy/5 pb-4 text-start">{t("priceRange")}</h4>
                  <div className="flex items-center gap-6">
                    <div className="flex-1 space-y-2">
                      <p className="text-[10px] font-black uppercase text-navy/30 tracking-wider">Min</p>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                        className="w-full px-5 py-4 bg-navy/[0.03] border border-navy/5 rounded-2xl text-base font-black text-navy outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-[10px] font-black uppercase text-navy/30 tracking-wider">Max</p>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 2000 }))}
                        className="w-full px-5 py-4 bg-navy/[0.03] border border-navy/5 rounded-2xl text-base font-black text-navy outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PROPERTY LIST */}
          <div className="px-4 sm:px-6 lg:px-12 py-8 flex-1">
            {filteredProperties.length > 0 ? (
              <div className="flex flex-col">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    // Pass search context forward so PropertyDetails → Checkout inherits it
                    searchContext={{ from: urlFrom, to: urlTo, adults: urlAdults, children: urlChildren }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
                <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center border border-navy/10 animate-pulse">
                  <X className="w-8 h-8 text-navy/20" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-navy tracking-tight">{t("noResultsFound")}</h3>
                  <p className="text-sm text-navy/40 max-w-xs mx-auto leading-relaxed">{t("noResultsDesc")}</p>
                </div>
                <button
                  onClick={resetAll}
                  className="px-8 py-3 bg-navy text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-navy/90 transition-all hover:scale-[1.05] active:scale-95 shadow-lg shadow-navy/10"
                >
                  {t("clearAllFilters")}
                </button>
              </div>
            )}
          </div>

        </section>

        {/* RIGHT COLUMN: MAP */}
        <section className="hidden lg:block w-1/2 h-[calc(100vh-5rem)] sticky top-20 border-l border-navy/5 relative overflow-hidden">
          <MapWrapper properties={filteredProperties} />
        </section>

        {/* MOBILE: Floating Map Button */}
        <div className="lg:hidden fixed bottom-[360px] left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={() => setShowMap(true)}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-navy text-white rounded-full shadow-2xl font-bold text-sm hover:bg-navy/90 active:scale-95 transition-all"
          >
            <MapIcon className="w-4 h-4" />
            <span>{t("mapView")}</span>
          </button>
        </div>

        {/* MOBILE MAP MODAL */}
        {showMap && (
          <div className="lg:hidden fixed inset-0 z-[100] flex flex-col bg-white">
            <div className="flex-1 relative">
              <MapWrapper properties={filteredProperties} />
            </div>
            <button
              onClick={() => setShowMap(false)}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3.5 bg-navy text-white rounded-full shadow-2xl font-bold text-sm z-10"
            >
              <X className="w-4 h-4" />
              <span>{t("listView")}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Page wrapper with Suspense (required for useSearchParams in Next.js 15) ──
export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
