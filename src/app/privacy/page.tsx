"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="w-full bg-v-background min-h-[70vh] pt-32 pb-24 text-center flex items-center justify-center">
      <main className="max-w-3xl mx-auto px-6 space-y-6">
        <h1 className="text-4xl md:text-5xl font-heading font-medium text-navy tracking-tight">
          {t('footerPrivacy')}
        </h1>
        <p className="text-lg text-muted font-body leading-relaxed max-w-2xl mx-auto">
          {lang === "ar" 
            ? "نحن نأخذ خصوصيتك بجدية في ذا فيستا. سيتم تحديث هذه الصفحة بسياسة الخصوصية الكاملة قريباً." 
            : "We take your privacy seriously at The Vista. This page will be updated with our full privacy policy shortly."}
        </p>
      </main>
    </div>
  );
}
