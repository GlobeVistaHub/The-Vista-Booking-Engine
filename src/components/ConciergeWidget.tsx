"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Headphones, X, ChevronUp } from "lucide-react";

/**
 * Alex AI Concierge Widget
 * Integrates Superagent (Chat) and Vapi.ai (Audio)
 */
export default function ConciergeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<"chat" | "audio" | null>(null);

  // In a real production app, these would come from env or admin dashboard
  const SUPERAGENT_WIDGET_ID = ""; // User to paste here
  const VAPI_PUBLIC_KEY = ""; // User to paste here

  useEffect(() => {
    // 1. Inject Superagent Script if ID is provided
    if (SUPERAGENT_WIDGET_ID) {
      const script = document.createElement("script");
      script.src = "https://lib.superagent.sh/widget.js";
      script.async = true;
      script.setAttribute("id", SUPERAGENT_WIDGET_ID);
      document.body.appendChild(script);
    }
  }, [SUPERAGENT_WIDGET_ID]);

  const toggleAudioConcierge = () => {
    // Vapi integration placeholder
    alert("Audio Concierge (Alex) is ready. Please paste your Vapi Public Key in ConciergeWidget.tsx to activate voice mode.");
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      
      {/* EXPANDABLE MENU */}
      {isOpen && (
        <div className="flex flex-col gap-3 mb-2 animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto">
          {/* Audio Option */}
          <button 
            onClick={toggleAudioConcierge}
            className="group flex items-center gap-3 bg-white border border-navy/10 px-4 py-3 rounded-2xl shadow-xl hover:bg-navy hover:text-white transition-all scale-in duration-200"
          >
            <span className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Audio Mode</span>
            <div className="w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary flex items-center justify-center transition-colors">
              <Headphones className="w-5 h-5 text-primary group-hover:text-white" />
            </div>
          </button>

          {/* Chat Option (Standard Superagent) */}
          <button 
            className="group flex items-center gap-3 bg-white border border-navy/10 px-4 py-3 rounded-2xl shadow-xl hover:bg-navy hover:text-white transition-all scale-in duration-300"
          >
            <span className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Text Alex</span>
            <div className="w-10 h-10 rounded-xl bg-navy/5 group-hover:bg-primary flex items-center justify-center transition-colors">
              <MessageCircle className="w-5 h-5 text-navy group-hover:text-white" />
            </div>
          </button>
        </div>
      )}

      {/* MAIN LAUNCHER */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 pointer-events-auto ${
          isOpen ? "bg-navy rotate-90" : "bg-primary hover:scale-110 active:scale-95"
        }`}
      >
        {isOpen ? (
          <X className="w-8 h-8 text-white" />
        ) : (
          <div className="relative">
             <MessageCircle className="w-8 h-8 text-white" />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-primary rounded-full" />
          </div>
        )}
      </button>

    </div>
  );
}
