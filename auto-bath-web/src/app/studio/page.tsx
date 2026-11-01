import { Metadata } from "next";
import StudioClient from "./StudioClient";

export const metadata: Metadata = {
  title: "Good Brains Studio | Cinematic AI & Optical Engineering",
  description: "Broadcast-quality commercial video production, DaVinci Resolve 20 Fusion color science, and programmatic motion design. Hollywood optical physics for high-ticket enterprise trust.",
  keywords: [
    "AI commercial video production",
    "DaVinci Resolve 20 color science",
    "Good Brains Studio",
    "high retention video editor",
    "TikTok Reels short form video ads",
    "luxury commercial video production",
    "programmatic video Remotion",
    "Fairlight broadcast audio mastering"
  ],
  alternates: {
    canonical: "https://www.goodbrains.pro/studio/",
  },
  icons: {
    icon: "/goodbrains-logo.png",
    shortcut: "/goodbrains-logo.png",
    apple: "/goodbrains-logo.png",
  },
  openGraph: {
    title: "Good Brains Studio | Cinematic AI Commercials & Optical Engineering",
    description: "Transforming raw AI generations into broadcast-grade 4K cinema. Hollywood color science (DaVinci Resolve 20), 35mm anamorphic halation, and Fairlight 32-bit audio mastering.",
    url: "https://www.goodbrains.pro/studio/",
    siteName: "Good Brains Studio",
    images: [
      {
        url: "https://img.youtube.com/vi/r2Sj6q4Mq_s/maxresdefault.jpg",
        width: 1280,
        height: 720,
        alt: "Good Brains Studio Hollywood Cinema Pipeline",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Good Brains Studio | Transforming Raw AI Into Hollywood Cinema",
    description: "DaVinci Resolve 20 Fusion color science, anamorphic halation, and Fairlight 32-bit audio mastering.",
    images: ["https://img.youtube.com/vi/r2Sj6q4Mq_s/maxresdefault.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.goodbrains.pro/#organization",
      "name": "Good Brains Studio",
      "url": "https://www.goodbrains.pro",
      "logo": "https://auto-bath-detailing-melbourne.vercel.app/goodbrains-logo.png",
      "description": "Cinema-grade AI commercial production, Hollywood color science (DaVinci Resolve 20), and programmatic motion design.",
      "sameAs": [
        "https://www.youtube.com/@goodbrains",
        "https://www.linkedin.com/company/goodbrains"
      ]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://www.goodbrains.pro/studio/#service",
      "name": "Good Brains Studio // Cinematic Video Engineering",
      "url": "https://www.goodbrains.pro/studio/",
      "provider": {
        "@id": "https://www.goodbrains.pro/#organization"
      },
      "serviceType": [
        "Commercial Video Production",
        "Hollywood Color Grading (DaVinci Resolve 20)",
        "High-Retention Short Form Video Ads",
        "Interactive Client Acquisition Portals"
      ],
      "areaServed": "Worldwide"
    },
    {
      "@type": "VideoObject",
      "@id": "https://www.goodbrains.pro/studio/#video-akkari",
      "name": "Akkari Tiling — Transforming Luxury Architectural Surfaces | 4K Commercial Cinema Ad",
      "description": "Cinema commercial engineered for Akkari Tiling Melbourne with DaVinci Resolve 20 color science, 35mm optical halation, and Fairlight 32-bit audio mastering.",
      "thumbnailUrl": [
        "https://img.youtube.com/vi/r2Sj6q4Mq_s/maxresdefault.jpg"
      ],
      "uploadDate": "2026-11-01T00:00:00+00:00",
      "duration": "PT42S",
      "embedUrl": "https://www.youtube-nocookie.com/embed/r2Sj6q4Mq_s",
      "contentUrl": "https://youtube.com/shorts/r2Sj6q4Mq_s",
      "publisher": {
        "@id": "https://www.goodbrains.pro/#organization"
      }
    },
    {
      "@type": "VideoObject",
      "@id": "https://www.goodbrains.pro/studio/#video-ai-workflows",
      "name": "Autonomous AI Workflows — The Assistant Era is Dead",
      "description": "Dynamic 9:16 vertical commercial reframed for viral retention on TikTok, Reels, and YouTube Shorts.",
      "thumbnailUrl": [
        "https://img.youtube.com/vi/FYcQeFGnW3o/maxresdefault.jpg"
      ],
      "uploadDate": "2026-10-25T00:00:00+00:00",
      "duration": "PT55S",
      "embedUrl": "https://www.youtube-nocookie.com/embed/FYcQeFGnW3o",
      "publisher": {
        "@id": "https://www.goodbrains.pro/#organization"
      }
    }
  ]
};

export default function StudioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StudioClient />
    </>
  );
}
