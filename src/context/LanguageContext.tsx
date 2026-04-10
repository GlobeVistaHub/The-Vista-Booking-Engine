"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { dictionaries, Language } from "@/i18n/dictionaries";

type LanguageContextType = {
  lang: Language;
  t: (key: keyof typeof dictionaries) => string;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  // On mount, check if there's a preferred language in localStorage or just default to 'en'
  useEffect(() => {
    const savedLang = localStorage.getItem("vista_lang") as Language;
    if (savedLang === "ar" || savedLang === "en") {
      setLang(savedLang);
      document.documentElement.lang = savedLang;
      document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ar" : "en";
    setLang(newLang);
    localStorage.setItem("vista_lang", newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  const t = (key: keyof typeof dictionaries): string => {
    if (!dictionaries[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return dictionaries[key][lang];
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage }}>
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
