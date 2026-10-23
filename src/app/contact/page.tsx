"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="w-full bg-v-background min-h-[70vh] pt-32 pb-24 text-center flex items-center justify-center">
      <main className="max-w-3xl mx-auto px-6 space-y-6">
        <h1 className="text-4xl md:text-5xl font-heading font-medium text-navy tracking-tight">
          {t('footerContact')}
        </h1>
        <p className="text-lg text-muted font-body leading-relaxed max-w-2xl mx-auto">
          {lang === "ar" 
            ? "نحن هنا لمساعدتك على تخطيط إقامتك المثالية في البحر الأحمر. ستتوفر معلومات الاتصال ونموذج المراسلة قريباً." 
            : "We are here to help you plan your perfect Red Sea escape. Contact details and form will be available shortly."}
        </p>
      </main>
    </div>
  );
}
