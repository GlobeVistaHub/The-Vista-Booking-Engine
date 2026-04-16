"use client";

import type { Metadata } from "next";
import { Inter, Playfair_Display, Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-heading-ar",
  subsets: ["arabic"],
});

const tajawal = Tajawal({
  variable: "--font-body-ar",
  weight: ["400", "500", "700"],
  subsets: ["arabic"],
});

import { ClerkProvider } from '@clerk/nextjs';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { UserProvider } from "@/context/UserContext";
import BrandingEngine from "@/components/BrandingEngine";
import { useAppModeStore } from "@/store/appModeStore";
import { useAppStore } from "@/hooks/useAppStore";
import AlexConcierge from "@/components/AlexConcierge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const brandColor = useAppStore(useAppModeStore, (s) => s.brandColor) as string;

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: brandColor || "#D4AF37",
          colorTextOnPrimaryBackground: "#FFFFFF",
        },
      }}
    >
      <html className={`${inter.variable} ${playfair.variable} ${cairo.variable} ${tajawal.variable} h-full antialiased`}>
        <BrandingEngine />
        <LanguageProvider>
          <UserProvider>
            <body className="min-h-full flex flex-col">
              {!isAdmin && <Header />}
              <main className={`flex-grow ${isAdmin ? '' : 'pt-20'}`}>
                {children}
              </main>
              <Footer />
              <AlexConcierge />
            </body>
          </UserProvider>
        </LanguageProvider>
      </html>
    </ClerkProvider>
  );
}


