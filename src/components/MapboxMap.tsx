"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/data/properties';
import { useLanguage } from '@/context/LanguageContext';
import { Star, X } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import Link from 'next/link';

interface MapboxMapProps {
  properties: Property[];
}

export default function MapboxMap({ properties }: MapboxMapProps) {
  const { lang, t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!mapboxToken || !mapContainerRef.current) return;

    mapboxgl.accessToken = mapboxToken;

    // Initialize Mapbox
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [33.8, 27.25], // Initial coastal view
      zoom: 6,
      pitch: 45,
      attributionControl: false
    });

    mapRef.current = map;

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    // Cleanup on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [mapboxToken]);

  // SYNC MARKERS (Add/Update as properties change)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    properties.forEach(property => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      
      const root = createRoot(el);
      root.render(
        <div className="flex flex-col items-center cursor-pointer group/marker transform transition-all hover:scale-110 active:scale-95">
          <div className="bg-primary text-navy font-black text-[10px] px-3 py-1.5 rounded-full shadow-[0_10px_20px_rgba(212,175,55,0.3)] border border-primary/20 transition-colors group-hover/marker:bg-white group-hover/marker:text-primary">
            ${property.price}
          </div>
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-primary mt-[-1px]"></div>
        </div>
      );

      el.addEventListener('click', () => {
        setSelectedProperty(property);
        map.flyTo({ center: [property.lng, property.lat], zoom: 14, duration: 2500 });
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([property.lng, property.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    // THE AUTO-CENTER SYNC (Dynamic fitBounds when filters change)
    const fitToProperties = () => {
      if (!mapRef.current || properties.length === 0) return;
      
      const bounds = new mapboxgl.LngLatBounds();
      properties.forEach(p => bounds.extend([p.lng, p.lat]));

      mapRef.current.fitBounds(bounds, {
        padding: { top: 120, bottom: 120, left: 120, right: 120 },
        duration: 3500, // Luxurious slow glide
        maxZoom: 14,
        essential: true
      });
    };

    if (mapRef.current.loaded()) {
      fitToProperties();
    } else {
      mapRef.current.once('load', fitToProperties);
    }
  }, [properties]);


  if (!mapboxToken) {
    return (
      <div className="w-full h-full bg-navy/5 flex items-center justify-center p-8 text-center">
        <div className="space-y-4 max-w-xs">
          <p className="font-bold text-navy">Mapbox Token Missing</p>
          <p className="text-sm text-muted">Please add your token to <code className="bg-navy/10 px-1 py-0.5 rounded">.env.local</code> to activate the live 3D map.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* RENDER POPUP OVERLAY MANUALLY (Premium Vista Style) */}
      {selectedProperty && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] z-20 animate-in zoom-in-95 fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-navy/5">
            <div className="relative h-32">
              <img 
                src={selectedProperty.images[0]} 
                alt={selectedProperty.title} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedProperty(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-navy line-clamp-1">
                  {lang === 'ar' ? selectedProperty.title_ar : selectedProperty.title}
                </h3>
                <div className="flex items-center gap-1 text-sm font-medium text-navy">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span>{selectedProperty.rating}</span>
                </div>
              </div>
              <p className="text-xs text-muted">
                {lang === 'ar' ? selectedProperty.location_ar : selectedProperty.location}
              </p>
              <Link 
                href={`/property/${selectedProperty.id}`}
                className="block w-full py-2 bg-navy text-white text-center rounded-xl text-sm font-bold hover:bg-navy/90 transition-colors mt-2"
              >
                {t('viewProperty')}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Floating Badge for Experience — UPDATED for Premium Contrast */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-xl px-8 py-3 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-navy/10 z-10 pointer-events-none transition-all hover:scale-105">
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black text-navy/40 tracking-[0.3em] uppercase mb-0.5">Maritime Engine</span>
          <span className="text-[11px] font-bold text-navy tracking-[0.1em] uppercase">
            {lang === 'ar' ? "تجربة فيستا الحية" : "Live Vista Experience"}
          </span>
        </div>
      </div>

    </div>
  );
}
