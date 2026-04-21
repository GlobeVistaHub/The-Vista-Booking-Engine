export interface Property {
  id: string | number;
  title: string;
  title_ar: string;
  guests: string;      // max guests
  baseGuests: number;  // guests included in base rate
  bedrooms: string;
  location: string;
  location_ar: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  tags: string[];
  description_en: string;
  description_ar: string;
  lat: number;
  lng: number;
  type: 'Villa' | 'Penthouse' | 'Estate' | 'Apartment' | 'Resort' | 'Cabin' | 'Townhouse' | 'Studio' | 'Loft' | 'Mansion' | 'Village House';
  ownerPhone: string;
  ownerEmail: string;
  isBooked?: boolean;
  isInstantBookable?: boolean;
}

export const PROPERTIES: Property[] = [
  {
    id: 1,
    title: "Villa Serenity",
    title_ar: "فيلا سيرينيتي",
    guests: "8",
    baseGuests: 4,
    bedrooms: "4",
    location: "El Gouna",
    location_ar: "الجونة",
    price: 450,
    rating: 4.9,
    reviews: 124,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    ],
    tags: ["tagPrivatePool", "tagRedSeaView", "tagButlerService", "tagInstantBook"],
    description_en: "A tranquil escape in the heart of El Gouna. Villa Serenity offers expansive living spaces, a private heated pool, and direct access to the promenade. Perfect for large families or groups looking for a blend of luxury and comfort.",
    description_ar: "ملاذ هادئ في قلب الجونة. تقدم فيلا سيرينيتي مساحات معيشة واسعة، ومسبحاً خاصاً مدفأً، ووصولاً مباشراً إلى الكورنيش. مثالية للعائلات الكبيرة أو المجموعات التي تبحث عن مزيج من الفخامة والراحة.",
    lat: 27.3912,
    lng: 33.6811,
    type: 'Villa',
    ownerPhone: '+201000000000',
    ownerEmail: 'support@globevistahub.com'
  },
  {
    id: 2,
    title: "The Azure Penthouse",
    title_ar: "البنتهاوس الأزرق",
    guests: "4",
    baseGuests: 2,
    bedrooms: "2",
    location: "Sahl Hasheesh",
    location_ar: "سهل حشيش",
    price: 320,
    rating: 5.0,
    reviews: 89,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    ],
    tags: ["tagPanoramicViews", "tagBeachAccess", "tagInstantBook"],
    description_en: "Experience the ultimate in modern coastal living. The Azure Penthouse features panoramic Red Sea views, state-of-the-art appliances, and a private terrace overlooking the Sahl Hasheesh bay.",
    description_ar: "اختبر قمة المعيشة الساحلية الحديثة. يتميز البنتهاوس الأزرق بإطلالات بانورامية على البحر الأحمر، وأحدث الأجهزة، وتراس خاص يطل على خليج سهل حشيش.",
    lat: 27.0543,
    lng: 33.8824,
    type: 'Penthouse',
    ownerPhone: '+201111111111',
    ownerEmail: 'support@globevistahub.com',
    isBooked: true
  },

  {
    id: 3,
    title: "Sea Breeze Estate",
    title_ar: "عقار النسيم البحري",
    guests: "12",
    baseGuests: 6,
    bedrooms: "6",
    location: "Soma Bay",
    location_ar: "صوما باي",
    price: 850,
    rating: 4.8,
    reviews: 42,
    images: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    ],
    tags: ["tagGolfCourseView", "tagChefIncluded"],
    description_en: "Our most exclusive estate in Soma Bay. A masterpiece of architectural elegance, featuring direct golf course views, a professional kitchen with a private chef, and vast landscaped gardens.",
    description_ar: "أكثر عقاراتنا حصرية في صوما باي. تحفة فنية من الأناقة معمارية، وتتميز بإطلالات مباشرة على ملعب الغولف، ومطبخ احترافي مع طاهٍ خاص، وحدائق شاسعة منسقة.",
    lat: 26.8488,
    lng: 33.9904,
    type: 'Estate',
    ownerPhone: '+201222222222',
    ownerEmail: 'support@globevistahub.com'
  },
  {
    id: 4,
    title: "Royal Sea View Apartment",
    title_ar: "شقة ملكية بإطلالة بحرية",
    type: "Apartment",
    guests: "4",
    baseGuests: 4,
    bedrooms: "2",
    location: "Alexandria",
    location_ar: "الإسكندرية",
    price: 250,
    rating: 4.7,
    reviews: 18,
    lat: 31.2001,
    lng: 29.9187,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
    ],
    tags: ["tagPanoramicViews", "tagBeachAccess", "tagInstantBook"],
    description_en: "Experience luxury living in the heart of Alexandria. This royal apartment features stunning panoramic sea views and direct access to the Mediterranean shore.",
    description_ar: "اختبر المعيشة الفاخرة في قلب الإسكندرية. تتميز هذه الشقة الملكية بإطلالات بانورامية خلابة على البحر ووصول مباشر إلى شواطئ البحر الأبيض المتوسط.",
    ownerPhone: "+201222222222",
    ownerEmail: "support@globevistahub.com"
  }
];
