export interface Property {
  id: number;
  title: string;
  title_ar: string;
  type: string;
  guests: string;
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
}

export const PROPERTIES: Property[] = [
  {
    id: 1,
    title: "Villa Serenity",
    title_ar: "فيلا سيرينيتي",
    type: "entireVilla",
    guests: "8",
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
    tags: ["tagPrivatePool", "tagRedSeaView", "tagButlerService"],
    description_en: "A tranquil escape in the heart of El Gouna. Villa Serenity offers expansive living spaces, a private heated pool, and direct access to the promenade. Perfect for large families or groups looking for a blend of luxury and comfort.",
    description_ar: "ملاذ هادئ في قلب الجونة. تقدم فيلا سيرينيتي مساحات معيشة واسعة، ومسبحاً خاصاً مدفأً، ووصولاً مباشراً إلى الكورنيش. مثالية للعائلات الكبيرة أو المجموعات التي تبحث عن مزيج من الفخامة والراحة."
  },
  {
    id: 2,
    title: "The Azure Penthouse",
    title_ar: "البنتهاوس الأزرق",
    type: "luxuryApartment",
    guests: "4",
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
    tags: ["tagPanoramicViews", "tagBeachAccess"],
    description_en: "Experience the ultimate in modern coastal living. The Azure Penthouse features panoramic Red Sea views, state-of-the-art appliances, and a private terrace overlooking the Sahl Hasheesh bay.",
    description_ar: "اختبر قمة المعيشة الساحلية الحديثة. يتميز البنتهاوس الأزرق بإطلالات بانورامية على البحر الأحمر، وأحدث الأجهزة، وتراس خاص يطل على خليج سهل حشيش."
  },
  {
    id: 3,
    title: "Sea Breeze Estate",
    title_ar: "عقار النسيم البحري",
    type: "entireEstate",
    guests: "12",
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
    description_ar: "أكثر عقاراتنا حصرية في صوما باي. تحفة فنية من الأناقة المعمارية، وتتميز بإطلالات مباشرة على ملعب الغولف، ومطبخ احترافي مع طاهٍ خاص، وحدائق شاسعة منسقة."
  }
];
