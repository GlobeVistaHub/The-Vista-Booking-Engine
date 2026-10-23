"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="w-full bg-v-background min-h-[70vh] pt-32 pb-24 text-center flex items-center justify-center">
      <main className="max-w-3xl mx-auto px-6 space-y-6">
        <h1 className="text-4xl md:text-5xl font-heading font-medium text-navy tracking-tight">
          {t('ourStory')}
        </h1>
        <p className="text-lg text-muted font-body leading-relaxed max-w-2xl mx-auto">
          {lang === "ar" 
            ? "ذا فيستا تقدم فن المعيشة الحديثة في ريفييرا البحر الأحمر، مع مجموعة مختارة بدقة من العقارات الحصرية. سيتم إضافة التفاصيل الكاملة قريباً." 
            : "The Vista presents the art of modern living on the Red Sea Riviera, featuring a meticulously curated selection of exclusive properties. Full details coming soon."}
        </p>
      </main>
    </div>
  );
}
