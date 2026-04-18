"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { dictionaries, Language } from "@/i18n/dictionaries";
import { getSiteContent, SiteLabel } from "@/data/api";

type LanguageContextType = {
  lang: Language;
  t: (key: string) => string;
  toggleLanguage: () => void;
  refreshLabels: () => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const [dbLabels, setDbLabels] = useState<Record<string, SiteLabel>>({});

  const refreshLabels = useCallback(async () => {
    try {
      const data = await getSiteContent();
      const labelMap: Record<string, SiteLabel> = {};
      data.forEach((item: SiteLabel) => {
        labelMap[item.key] = item;
      });
      setDbLabels(labelMap);
    } catch (error) {
      console.error("Failed to sync labels:", error);
    }
  }, []);

  useEffect(() => {
    // 1. Load saved language preference
    const savedLang = localStorage.getItem("vista_lang") as Language;
    if (savedLang === "ar" || savedLang === "en") {
      setLang(savedLang);
      document.documentElement.lang = savedLang;
      document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
    }

    // 2. Fetch remote labels
    refreshLabels();
  }, [refreshLabels]);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ar" : "en";
    setLang(newLang);
    localStorage.setItem("vista_lang", newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  const t = (key: string): string => {
    // 1. Try DB first (CMS Override)
    if (dbLabels[key]) {
      return lang === 'ar' ? dbLabels[key].value_ar : dbLabels[key].value_en;
    }

    // 2. Fallback to static dictionaries
    const entry = (dictionaries as any)[key];
    if (!entry) {
      // 3. Fallback to Key text if absolutely missing
      // console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return String(entry[lang]);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage, refreshLabels }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
