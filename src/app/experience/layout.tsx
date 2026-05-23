import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Vista | Spatial UI Engineering",
  description: "An immersive scroll-controlled Spatial UI experience. Explore the world's most premium luxury booking engine architecture.",
  openGraph: {
    title: "The Vista | Spatial UI Engineering",
    description: "An immersive scroll-controlled Spatial UI experience. Explore the world's most premium luxury booking engine architecture.",
    images: [
      {
        url: "/video-assets/villa-serenity.jpg", // Using one of the high-res assets as the OG image
        width: 1200,
        height: 630,
        alt: "The Vista Spatial UI",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Vista | Spatial UI Engineering",
    description: "An immersive scroll-controlled Spatial UI experience.",
    images: ["/video-assets/villa-serenity.jpg"],
  },
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
