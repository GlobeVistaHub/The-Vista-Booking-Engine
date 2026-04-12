"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function TermsPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="w-full bg-v-background min-h-[70vh] pt-32 pb-24 text-center flex items-center justify-center">
      <main className="max-w-3xl mx-auto px-6 space-y-6">
        <h1 className="text-4xl md:text-5xl font-heading font-medium text-navy tracking-tight">
          {t('footerTerms')}
        </h1>
        <p className="text-lg text-muted font-body leading-relaxed max-w-2xl mx-auto">
          {lang === "ar" 
            ? "شروط الاستخدام والخدمة الخاصة بذا فيستا للحجز الذكي. سيتم إطلاق الوثيقة الكاملة في المرحلة القادمة." 
            : "Terms of service for The Vista booking engine. The full legal documentation will be published in the next phase."}
        </p>
      </main>
    </div>
  );
}
