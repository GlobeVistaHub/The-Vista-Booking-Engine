"use client";

import { useRef, useState } from "react";
import Map, { Marker, MapRef, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Auto Bath Coordinates (Strathmore, VIC)
const LATITUDE = -37.7346;
const LONGITUDE = 144.9194;

export default function TheLocation() {
  const mapRef = useRef<MapRef>(null);
  const [currentZoom, setCurrentZoom] = useState(11);

  const handleMapLoad = () => {
    if (mapRef.current) {
      // A premium, smooth drone-dive that doesn't start too far out
      mapRef.current.flyTo({
        center: [LONGITUDE, LATITUDE],
        zoom: 15, // Zoom into street level
        pitch: 60, // 3D perspective
        bearing: -20, // Dramatic angle
        duration: 3500, // 3.5 seconds
        essential: true,
      });
    }
  };

  return (
    <section id="location" className="relative w-full py-12 md:py-32 bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-12 items-center">
        
        {/* Left: Text & Info */}
        <div className="w-full md:w-1/3 flex flex-col gap-6 text-center md:text-left">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tighter">
            Our <span className="text-cyber-orange">Facility</span>
          </h2>
          <p className="font-sans text-white/60 text-lg leading-relaxed">
            The Auto-Bath Premium Automotive Rejuvenation Center is a climate-controlled, dust-free environment engineered specifically for elite vehicle care.
          </p>
          
          <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
            <h3 className="text-white font-mono font-bold tracking-widest text-sm mb-2 uppercase">Headquarters</h3>
            <p className="text-white/80 font-sans">
              64 Bulla Rd<br />
              Strathmore, VIC 3041
            </p>
            <div className="mt-6 flex gap-4 justify-center md:justify-start">
              <a 
                href="https://maps.app.goo.gl/hnKD2MNYfeNwmSBd6?g_st=iw" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-5 py-2 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan font-bold text-xs uppercase tracking-widest hover:bg-electric-cyan hover:text-[#050505] transition-all whitespace-nowrap"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>

        {/* Right: The Mapbox Cinematic Map */}
        <div className="w-full md:w-2/3 h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group bg-[#111] [&_.mapboxgl-ctrl-bottom-left]:ml-4 [&_.mapboxgl-ctrl-bottom-left]:mb-4 [&_.mapboxgl-ctrl-bottom-right]:mr-4 [&_.mapboxgl-ctrl-bottom-right]:mb-4">
          {/* Cyan Atmospheric Vignette overlay (inner shadow) without washing out the map */}
          <div className="absolute inset-0 pointer-events-none rounded-3xl z-10 shadow-[inset_0_0_120px_rgba(0,255,255,0.15)] ring-1 ring-inset ring-white/10" />
          
          {MAPBOX_TOKEN ? (
            <Map
              ref={mapRef}
              onLoad={handleMapLoad}
              onZoom={(e) => setCurrentZoom(e.viewState.zoom)}
              minZoom={8}  // Don't let them zoom out to space
              maxZoom={18} // Don't let them zoom into blank data
              initialViewState={{
                latitude: LATITUDE,
                longitude: LONGITUDE,
                zoom: 11, // Start moderately zoomed out (city view)
                pitch: 30, // Slight angle
                bearing: 0,
              }}
              mapStyle="mapbox://styles/mapbox/dark-v11"
              mapboxAccessToken={MAPBOX_TOKEN}
              interactive={true}
              scrollZoom={false} // Don't steal user scroll!
              dragPan={true}
              cooperativeGestures={true} // Requires two fingers to pan on mobile, allowing one-finger vertical page scroll
            >
              {/* Native Zoom Controls (+/-) */}
              <NavigationControl position="bottom-right" showCompass={false} />
              
              {/* The Glowing Marker */}
              <Marker longitude={LONGITUDE} latitude={LATITUDE} anchor="bottom">
                <div className="relative flex flex-col items-center justify-center group cursor-crosshair">
                  
                  {/* The Coordinates overlay (appears only at max zoom) */}
                  <div 
                    className={`absolute bottom-full mb-2 flex flex-col items-center transition-all duration-700 ease-out ${
                      currentZoom >= 17.5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
                  >
                    <div className="bg-[#050505]/95 border border-electric-cyan/40 backdrop-blur-xl px-3 py-1.5 rounded flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,255,0.3)] mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-electric-cyan animate-pulse" />
                      <span className="font-mono text-electric-cyan text-[11px] font-bold tracking-widest whitespace-nowrap">
                        TARGET: {LATITUDE.toFixed(4)}°, {LONGITUDE.toFixed(4)}°
                      </span>
                    </div>
                    {/* Futuristic targeting line */}
                    <div className="w-[1px] h-4 bg-electric-cyan/60 absolute bottom-0 translate-y-full" />
                  </div>

                  {/* The Cyber-orange radar */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-12 h-12 bg-cyber-orange rounded-full animate-ping opacity-30" />
                    <div className="relative w-4 h-4 bg-cyber-orange rounded-full border-2 border-black shadow-[0_0_15px_rgba(255,102,0,0.8)]" />
                  </div>
                  
                </div>
              </Marker>
            </Map>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50 font-mono text-sm">
              Loading Cinematic Map...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
