import type { Metadata } from "next";
import { Inter, Syncopate } from "next/font/google";
import "./globals.css";
import { BookingProvider } from "@/context/BookingContext";
import BookingWidget from "@/components/ui/BookingWidget";
import AIConcierge from "@/components/ui/AIConcierge";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syncopate = Syncopate({
  variable: "--font-syncopate",
  weight: ["400", "700"],
  subsets: ["latin"],
});

import { getServicesAction, getSiteContentAction } from "@/app/actions/cms";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Auto-Bath | Cyber-Luxury Detailing",
  description: "The premier luxury auto detailing experience in Melbourne.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ services }, { content = {} }] = await Promise.all([
    getServicesAction(),
    getSiteContentAction()
  ]);

  const ga4Id = content['tracking_ga4'];
  const fbPixel = content['tracking_fbpixel'];
  const businessName = content['business_name'] || "Auto-Bath Luxury Detailing";
  const businessAddress = content['business_address'] || "64 Bulla Rd, Strathmore, VIC 3041";
  const phone = content['contact_phone'] || "+61 400 764 508";
  
  // JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop",
    "name": businessName,
    "image": content['site_logo'] || "https://auto-bath.com.au/transparent.png",
    "@id": "",
    "url": "https://auto-bath.com.au",
    "telephone": phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": businessAddress,
      "addressLocality": "Melbourne",
      "addressRegion": "VIC",
      "addressCountry": "AU"
    }
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${syncopate.variable} h-full antialiased dark`}
    >
      <head>
        {/* Schema.org Injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        
        {/* Google Analytics 4 */}
        {ga4Id && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}');
              `}
            </Script>
          </>
        )}

        {/* Facebook Pixel */}
        {fbPixel && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbPixel}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body className="min-h-full flex flex-col font-sans bg-vantablack text-white">
        <BookingProvider>
          {children}
          <BookingWidget dynamicServices={services || []} />
          <AIConcierge />
        </BookingProvider>
      </body>
    </html>
  );
}
