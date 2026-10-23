"use client";

import { useState } from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { Info, X, CreditCard } from 'lucide-react';

export default function DemoBadge() {
  const { lang } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* The Ultra-Thin Corner Tab */}
      <button 
        onClick={() => setIsExpanded(true)}
        className={`fixed bottom-0 ${lang === 'ar' ? 'right-0 rounded-tl-xl' : 'left-0 rounded-tr-xl'} z-[50] bg-navy/90 backdrop-blur-xl border-t border-r border-primary/40 px-4 py-2 flex items-center gap-3 hover:bg-primary/20 transition-all duration-300 group shadow-[0_0_15px_rgba(212,175,55,0.1)]`}
      >
        {/* Synchronized breathing and pinging dot */}
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-[0_0_8px_rgba(212,175,55,0.8)] animate-breathe"></span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary group-hover:text-white transition-colors">
          {lang === 'ar' ? 'بيئة تجريبية' : 'Sandbox'}
        </span>

        <style jsx>{`
          @keyframes breathe {
            0%, 100% { opacity: 0.2; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1); }
          }
          .animate-breathe {
            animation: breathe 1s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
        `}</style>
      </button>

      {/* The Information Overlay (Appears on Click) */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] flex items-end justify-start p-4 md:p-8 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsExpanded(false)}>
          <div 
            className={`w-full max-w-sm bg-navy/95 backdrop-blur-2xl border border-primary/30 rounded-2xl shadow-luxury overflow-hidden animate-in slide-in-from-bottom-4 duration-500`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                <h4 className="text-white text-xs font-bold uppercase tracking-widest">
                  {lang === 'ar' ? 'معلومات النظام' : 'System Information'}
                </h4>
              </div>
              <button onClick={() => setIsExpanded(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <p className="text-white/70 text-[11px] leading-relaxed">
                {lang === 'ar' 
                  ? 'أنت الآن في البيئة التجريبية لفيستا. جميع المعاملات، الحجوزات، والملفات هي لأغراض العرض التقني فقط ولا يترتب عليها أي التزام مالي حقيقي.' 
                  : 'You are currently exploring the Vista Engine Sandbox. All transactions, bookings, and dossiers are for technical demonstration purposes only.'}
              </p>

              {/* Test Card Card */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
                <div className="flex items-center gap-2 opacity-50">
                  <CreditCard className="w-3 h-3 text-white" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white">
                    {lang === 'ar' ? 'بيانات البطاقة التجريبية' : 'Test Credentials'}
                  </span>
                </div>
                <div className="space-y-1" dir="ltr">
                  <p className="text-sm text-primary font-mono tracking-[0.2em] font-bold text-left">
                    4111 1111 1111 1111
                  </p>
                  <div className="flex gap-6 justify-start">
                    <div className="flex flex-col items-start">
                      <span className="text-[8px] text-white/30 uppercase">Expiry</span>
                      <span className="text-xs text-white/80 font-mono tracking-widest">12/30</span>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[8px] text-white/30 uppercase">CVV</span>
                      <span className="text-xs text-white/80 font-mono tracking-widest">123</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-[10px] text-primary/60 font-medium text-center pt-2">
                {lang === 'ar' ? 'جاهز للتشغيل الفعلي للمؤسسات' : 'Production Ready Enterprise Architecture'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
