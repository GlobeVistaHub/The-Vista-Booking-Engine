"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-v-background border-t border-navy/5 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">

          {/* BRAND — logo always in English */}
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <span className="text-xl font-heading font-bold text-navy">THE VISTA</span>
            <p className="text-sm text-muted">{t('footerTagline')}</p>
          </div>

          {/* LINKS */}
          <div className="flex gap-8 text-sm font-medium text-navy/60">
            <a href="#" className="hover:text-primary transition-colors">{t('footerPrivacy')}</a>
            <a href="#" className="hover:text-primary transition-colors">{t('footerTerms')}</a>
            <a href="#" className="hover:text-primary transition-colors">{t('footerContact')}</a>
          </div>

          {/* SOCIALS & COPYRIGHT */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex items-center gap-5">

              {/* INSTAGRAM */}
              <a href="#" aria-label="Instagram" className="text-navy/40 hover:text-primary transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              {/* FACEBOOK */}
              <a href="#" aria-label="Facebook" className="text-navy/40 hover:text-primary transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>

              {/* X (TWITTER) */}
              <a href="#" aria-label="X" className="text-navy/40 hover:text-primary transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

            </div>
            <div className="text-sm text-muted">
              {t('footerCopyright')}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
