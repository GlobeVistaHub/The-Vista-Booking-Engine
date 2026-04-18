import type { Metadata, ResolvingMetadata } from "next";
import { getPropertyById } from "@/data/api";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const id = (await params).id;
    const property = await getPropertyById(id);

    if (!property) {
      return {
        title: 'Property Not Found | The Vista',
        description: 'This property does not exist or has been removed.',
      };
    }

    const firstImage = property.images && property.images.length > 0 
      ? property.images[0] 
      : 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200'

    return {
      title: `${property.title} | The Vista`,
      description: property.description_en?.substring(0, 160) || `Experience luxury at ${property.title}. Book your unforgettable stay today.`,
      openGraph: {
        title: `${property.title} | The Vista`,
        description: property.description_en?.substring(0, 160) || `Book a stay at ${property.title}. Reserve your dates securely now.`,
        images: [
          {
            url: firstImage,
            width: 1200,
            height: 630,
            alt: property.title,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: property.title,
        description: property.description_en?.substring(0, 160) || `Luxury stay at ${property.title}.`,
        images: [firstImage],
      },
    };
  } catch (error) {
    return {
      title: 'The Vista | Luxury Stays',
    };
  }
}

export default function PropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
