"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useAppModeStore } from "@/store/appModeStore";
import { useAppStore } from "@/hooks/useAppStore";

export default function Footer() {
  const { t, lang } = useLanguage();
  const isWhiteLabel = useAppStore(useAppModeStore, (s) => s.isWhiteLabel);
  const brandName = useAppStore(useAppModeStore, (s) => s.brandName) as string;

  return (
    <footer className="w-full bg-v-background border-t border-navy/5 pt-16 pb-12 mt-auto" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* TOP ROW: LOGO & SOCIALS */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-navy/5">
          {/* BRAND */}
          <Link href="/" className="md:order-1">
            <span className={`text-2xl font-heading font-bold text-navy tracking-tight ${(isWhiteLabel || (brandName && brandName !== "The Vista")) ? "" : "uppercase"}`}>
              {(isWhiteLabel || (brandName && brandName !== "The Vista")) ? brandName : "THE VISTA"}
            </span>
          </Link>

          {/* SOCIALS */}
          <div className="flex items-center gap-6 md:order-2">
            <a href="#" aria-label="Instagram" className="text-navy/40 hover:text-primary transition-all hover:scale-110">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="text-navy/40 hover:text-primary transition-all hover:scale-110">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" aria-label="X" className="text-navy/40 hover:text-primary transition-all hover:scale-110">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* BOTTOM ROW: COPYRIGHT, LINKS, TAGLINE */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-sm">
          {/* TAGLINE */}
          <p className="text-muted font-medium order-3 lg:order-1 text-center lg:text-start">{t('footerTagline')}</p>

          {/* LINKS */}
          <div className="flex items-center gap-10 font-bold text-navy/60 order-1 lg:order-2">
            <Link href="/privacy" className="hover:text-primary transition-colors">{t('footerPrivacy')}</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">{t('footerTerms')}</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">{t('footerContact')}</Link>
          </div>

          {/* COPYRIGHT */}
          <div className="text-muted font-medium order-2 lg:order-3 text-center lg:text-end">
            {t('footerCopyright')}
          </div>
        </div>
      </div>
    </footer>
  );
}
