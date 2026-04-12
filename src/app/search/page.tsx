"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, X, Map as MapIcon, LayoutGrid, Zap } from "lucide-react";

import PropertyCard from "@/components/PropertyCard";
import MapWrapper from "@/components/MapWrapper";
import { useLanguage } from "@/context/LanguageContext";

import { PROPERTIES, Property } from "@/data/properties";

export default function SearchResultsPage() {
  const { t, lang } = useLanguage();
  const [showMap, setShowMap] = useState(false);
  
  // REAL FILTER STATE
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [instantBookOnly, setInstantBookOnly] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  // AUTOMATED SCALE Logic: Scan data for unique types at runtime
  const allTypes = useMemo(() => Array.from(new Set(PROPERTIES.map(p => p.type))), []);


  // DYNAMIC FILTERING & PRIORITY LOGIC (Option B)
  const filteredProperties = useMemo(() => {
    // 1. First, apply hard filters (Type and Price)
    let results = PROPERTIES.filter(property => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(property.type)) return false;
      if (property.price < priceRange.min || property.price > priceRange.max) return false;
      return true;
    });

    // 2. Then, apply Priority Sorting and filtering if Instant Book is active
    if (instantBookOnly) {
      return results.filter(p => p.tags.includes('tagInstantBook'));
    }

    return results;
  }, [selectedTypes, priceRange, instantBookOnly]);


  // MAP FOCUS LOGIC: Restoring the "Alive" feel
  // When Instant Book is toggled, the map focuses ONLY on the featured properties
  const mapProperties = useMemo(() => {
    if (instantBookOnly) {
      return filteredProperties.filter(p => p.tags.includes('tagInstantBook'));
    }
    return filteredProperties;
  }, [filteredProperties, instantBookOnly]);


  return (
    <div className="w-full flex relative bg-white min-h-screen">



      {/* LEFT COLUMN: THE INVENTORY — full width on mobile, half on desktop */}
      <section className="w-full lg:w-1/2 flex flex-col h-full bg-white">

        {/* HEADER TEXT - Simple Original Style */}
        <div className="px-4 sm:px-6 lg:px-12 pt-8 pb-4">
          <p className="text-xs uppercase tracking-widest text-muted mb-1">{t('searchHeaderSubtitle')}</p>
          <h1 className="text-2xl sm:text-3xl font-heading text-navy">
            {t('searchHeaderTitle')}
          </h1>
        </div>




        {/* FILTER BAR - FULL ORIGINAL RESTORATION */}
        <div className="px-4 sm:px-6 lg:px-12 py-5 border-b border-navy/5 flex flex-wrap items-center gap-3 bg-white sticky top-0 z-[100]">

          {/* 1. FILTER ICON BUTTON */}
          <button 
            onClick={() => { setSelectedTypes([]); setPriceRange({ min: 0, max: 2000 }); setInstantBookOnly(false); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-navy/10 text-muted hover:bg-navy/5 transition-colors uppercase text-[10px] font-bold tracking-widest"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t('filtersOut')}</span>
          </button>

          {/* 2. TYPE OF PLACE BUTTON */}
          <div className="relative">
            <button 
              onClick={() => { setIsTypeOpen(!isTypeOpen); setIsPriceOpen(false); }}
              className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${selectedTypes.length > 0 ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-navy/20 hover:border-navy'}`}
            >
              {t('typeOfPlace')}
            </button>
            
            {isTypeOpen && (
              <div dir={lang === "ar" ? "rtl" : "ltr"} className={`absolute top-12 ${lang === "ar" ? "right-0" : "left-0"} w-64 bg-white rounded-2xl shadow-2xl border border-navy/5 p-5 z-[60] animate-in fade-in zoom-in-95 duration-200`}>
                <p className="text-[10px] font-black text-navy/30 tracking-widest uppercase mb-4 text-start">{t('selectCategories')}</p>
                <div className="space-y-4 text-start">
                  {allTypes.map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => {
                          setSelectedTypes(prev => 
                            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                          );
                        }}
                        className="w-5 h-5 rounded border-navy/10 text-navy focus:ring-navy cursor-pointer"
                      />
                      <span className="text-sm font-bold text-navy/80 group-hover:text-primary transition-colors">{t(type as any) || type}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. PRICE BUTTON */}
          <div className="relative">
            <button 
              onClick={() => { setIsPriceOpen(!isPriceOpen); setIsTypeOpen(false); }}
              className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${(priceRange.min > 0 || priceRange.max < 2000) ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-navy/20 hover:border-navy'}`}
            >
              {t('price')}
            </button>
            
            {isPriceOpen && (
              <div dir={lang === "ar" ? "rtl" : "ltr"} className={`absolute top-12 ${lang === "ar" ? "right-0" : "left-0"} w-80 bg-white rounded-2xl shadow-2xl border border-navy/5 p-8 z-[60] animate-in fade-in zoom-in-95 duration-200`}>
                <h4 className="text-xs font-black text-navy uppercase tracking-widest mb-6 border-b border-navy/5 pb-2 text-start">{t('priceRange')}</h4>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input 
                      type="number" 
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 bg-navy/5 border border-navy/10 rounded-xl text-sm font-black text-navy outline-none"
                      placeholder="Min"
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="number" 
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 2000 }))}
                      className="w-full px-4 py-3 bg-navy/5 border border-navy/10 rounded-xl text-sm font-black text-navy outline-none"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. INSTANT BOOK BUTTON */}
          <button 
            onClick={() => setInstantBookOnly(!instantBookOnly)}
            className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${instantBookOnly ? 'bg-navy text-white border-navy shadow-lg' : 'bg-white text-navy/40 border-navy/10 hover:border-navy/30 hover:bg-navy/5'}`}
          >
            <Zap className={`w-3.5 h-3.5 ${instantBookOnly ? 'fill-current' : 'text-primary'}`} />
            {t('instantBook')}
          </button>
        </div>





        <div className="px-4 sm:px-6 lg:px-12 py-8 flex-1 overflow-y-auto">
          {filteredProperties.length > 0 ? (
            <div className="flex flex-col">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
              <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center border border-navy/10 animate-pulse">
                <X className="w-8 h-8 text-navy/20" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-navy tracking-tight">{t('noResultsFound')}</h3>
                <p className="text-sm text-navy/40 max-w-xs mx-auto leading-relaxed">{t('noResultsDesc')}</p>
              </div>
              <button 
                onClick={() => { setSelectedTypes([]); setPriceRange({ min: 0, max: 2000 }); setInstantBookOnly(false); }}
                className="px-8 py-3 bg-navy text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-navy/90 transition-all hover:scale-[1.05] active:scale-95 shadow-lg shadow-navy/10"
              >
                {t('clearAllFilters')}
              </button>
            </div>
          )}
        </div>



      </section>

      {/* RIGHT COLUMN: THE MAP — hidden on mobile, sticky on desktop */}
      <section className="hidden lg:block w-1/2 h-[calc(100vh-5rem)] sticky top-20 border-l border-navy/5 relative overflow-hidden">
        <MapWrapper properties={mapProperties} />
      </section>


      {/* MOBILE ONLY: Floating "Map View" pill button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setShowMap(true)}
          className="flex items-center gap-2.5 px-6 py-3.5 bg-navy text-white rounded-full shadow-2xl font-bold text-sm hover:bg-navy/90 active:scale-95 transition-all"
        >
          <MapIcon className="w-4 h-4" />
          <span>{t('mapView')}</span>
        </button>
      </div>

      {/* MOBILE MAP MODAL — full screen slide-up overlay */}
      {showMap && (
        <div className="lg:hidden fixed inset-0 z-[100] flex flex-col bg-white">
          <div className="flex-1 relative">
            <MapWrapper properties={mapProperties} />
          </div>


          {/* Close / List View button — translated */}
          <button
            onClick={() => setShowMap(false)}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3.5 bg-navy text-white rounded-full shadow-2xl font-bold text-sm z-10"
          >
            <X className="w-4 h-4" />
            <span>{t('listView')}</span>
          </button>
        </div>
      )}

    </div>
  );
}
