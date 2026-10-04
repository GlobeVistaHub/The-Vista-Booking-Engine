import type { Metadata } from "next";
import { Inter, Syncopate } from "next/font/google";
import "./globals.css";
import { BookingProvider } from "@/context/BookingContext";
import BookingWidget from "@/components/ui/BookingWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syncopate = Syncopate({
  variable: "--font-syncopate",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auto-Bath | Cyber-Luxury Detailing",
  description: "The premier luxury auto detailing experience in Melbourne.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syncopate.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-vantablack text-white">
        <BookingProvider>
          {children}
          <BookingWidget />
        </BookingProvider>
      </body>
    </html>
  );
}
