"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import { useAppModeStore } from "@/store/appModeStore";
import { useAppStore } from "@/hooks/useAppStore";

export default function Header() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();
  const isHome = pathname === "/";
  const isProperty = pathname.startsWith("/property/");
  const isTransparentBase = isHome || isProperty;
  const { lang, t, toggleLanguage } = useLanguage();
  const isWhiteLabel = useAppStore(useAppModeStore, (s) => s.isWhiteLabel);
  const brandName = useAppStore(useAppModeStore, (s) => s.brandName) as string;
  const brandLogo = useAppStore(useAppModeStore, (s) => s.brandLogo) as string;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSolid = !isTransparentBase || scrolled;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
      isSolid
        ? "bg-white/95 backdrop-blur-md border-b border-navy/5 shadow-sm"
        : "bg-transparent border-b border-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LOGO — dynamic branding */}
        <Link href="/" className="flex items-center gap-2">
          {brandLogo ? (
            <img src={brandLogo} alt={brandName} className={`h-8 w-auto object-contain transition-all duration-500 ${!isSolid ? "brightness-0 invert drop-shadow-md" : ""}`} />
          ) : (
            <span className={`text-2xl font-heading font-bold tracking-tight transition-colors duration-500 ${(isWhiteLabel || (brandName && brandName !== "The Vista")) ? "" : "uppercase"} ${isSolid ? "text-navy" : "text-white drop-shadow-md"}`}>
              {(isWhiteLabel || (brandName && brandName !== "The Vista")) ? brandName : "THE VISTA"}
            </span>
          )}
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/search"
              className={`text-sm font-medium transition-colors duration-300 ${isSolid ? "text-navy hover:text-primary" : "text-white/90 hover:text-white drop-shadow"}`}
            >
              {t('properties')}
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors duration-300 ${isSolid ? "text-navy hover:text-primary" : "text-white/90 hover:text-white drop-shadow"}`}
            >
              {t('ourStory')}
            </Link>
          </nav>

          {/* LANGUAGE TOGGLE */}
          <button
            onClick={toggleLanguage}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ${isSolid ? "text-navy/60 hover:text-primary" : "text-white/70 hover:text-white drop-shadow"}`}
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4" />
            <span>{lang === "en" ? "العربية" : "English"}</span>
          </button>

          {!isLoaded ? (
            <div className="w-24 h-9 bg-navy/5 rounded-full animate-pulse" />
          ) : !isSignedIn ? (
            <SignInButton mode="modal">
              <button className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-bold shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all outline-none">
                {t('signIn')}
              </button>
            </SignInButton>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className={`text-sm font-bold transition-all ${isSolid ? "text-navy hover:text-primary" : "text-white drop-shadow"}`}
              >
                {lang === 'ar' ? 'حجوزاتي' : 'My Trips'}
              </Link>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10 border-2 border-primary shadow-sm"
                  }
                }}
              />
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
