import type { Metadata } from "next";
import { Inter, Playfair_Display, Cairo, Tajawal } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "THE VISTA | Luxury Red Sea Riviera Living",
  description: "The Pinnacle of Riviera Living. Premium property booking and management in Hurghada.",
};

import { ClerkProvider } from '@clerk/nextjs';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#D4AF37",
          colorTextOnPrimaryBackground: "#031428", // Navy text on Gold buttons
        },
      }}
    >
      <html lang="en" dir="ltr" className={`${inter.variable} ${playfair.variable} ${cairo.variable} ${tajawal.variable} h-full antialiased`}>
        <LanguageProvider>
          <UserProvider>
            <body className="min-h-full flex flex-col">
              <Header />
              <main className="flex-grow pt-20">
                {children}
              </main>
              <Footer />
            </body>
          </UserProvider>
        </LanguageProvider>
      </html>
    </ClerkProvider>
  );
}


