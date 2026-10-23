"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { Property } from '@/data/properties';

/**
 * THE VISTA SHIELD: 
 * Using next/dynamic with ssr: false is the industry-standard way 
 * to fix Mapbox build errors in Next.js.
 */
const MapboxMap = dynamic(() => import('./MapboxMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-navy/5 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="text-xs font-bold text-navy tracking-widest uppercase opacity-50">
        Initializing 3D Vista...
      </span>
    </div>
  )
});

interface MapWrapperProps {
  properties: Property[];
}

export default function MapWrapper({ properties }: MapWrapperProps) {
  return <MapboxMap properties={properties} />;
}
