"use client";

import { useDemoStore } from "@/store/demoStore";
import { Database, LayoutTemplate } from "lucide-react";
import { useEffect, useState } from "react";

export default function SystemControlToggle() {
  const { isDemoMode, setDemoMode } = useDemoStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch since it relies on localStorage under the hood
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-soft border border-navy/5 relative overflow-hidden">
      {/* Decorative luxury gradient indicator */}
      <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors duration-500 ${isDemoMode ? 'bg-primary' : 'bg-emerald-500'}`} />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pl-2">
        <div>
          <h3 className="text-xl font-bold text-navy flex items-center gap-3">
            System Data Mode
            <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-black shadow-sm ${isDemoMode ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
              {isDemoMode ? 'Presentation' : 'Live Production'}
            </span>
          </h3>
          <p className="text-muted text-sm mt-2 max-w-xl">
            {isDemoMode 
              ? "Currently displaying high-end static mock data for luxury sales presentations. Database queries are paused." 
              : "Currently displaying live data directly from the Supabase PostgreSQL database. All bookings trigger live writes."}
          </p>
        </div>

        {/* The beautiful glassmorphism toggle switch */}
        <div className="flex items-center bg-navy/[0.03] p-1.5 rounded-full w-full sm:w-auto h-14 relative border border-navy/5 shadow-inner flex-shrink-0">
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-4px)] bg-white rounded-full shadow-md transition-all duration-500 ease-out z-0 ${isDemoMode ? 'transform translate-x-[calc(100%+2px)]' : 'translate-x-[2px]'}`}
          />
          
          <button 
            onClick={() => setDemoMode(false)}
            className={`flex-1 sm:w-36 flex justify-center items-center gap-2 text-sm font-bold z-10 transition-all duration-300 ${!isDemoMode ? 'text-emerald-600 scale-105' : 'text-navy/40 hover:text-navy'}`}
          >
            <Database className="w-4 h-4" />
            Live DB
          </button>

          <button 
            onClick={() => setDemoMode(true)}
            className={`flex-1 sm:w-36 flex justify-center items-center gap-2 text-sm font-bold z-10 transition-all duration-300 ${isDemoMode ? 'text-primary scale-105' : 'text-navy/40 hover:text-navy'}`}
          >
            <LayoutTemplate className="w-4 h-4" />
            Demo Mode
          </button>
        </div>
      </div>
    </div>
  );
}
