export type Language = "en" | "ar";

type Dictionary = {
  [key: string]: {
    en: string;
    ar: string;
  };
};

export const dictionaries: Dictionary = {
  // Global & Header
  brandName: { en: "THE VISTA", ar: "ذا فيستا" },
  properties: { en: "Properties", ar: "العقارات" },
  ourStory: { en: "Our Story", ar: "قصتنا" },
  signIn: { en: "Sign In", ar: "تسجيل الدخول" },

  // Homepage Hero
  heroTitle: { en: "The Pinnacle of Riviera Living", ar: "قمة المعيشة في الريفييرا" },
  heroSubtitle: { 
    en: "Curated luxury properties in Hurghada and the Red Sea.", 
    ar: "عقارات فاخرة مختارة في الغردقة والبحر الأحمر." 
  },
  
  // Homepage Curated
  curatedTitle: { en: "Curated For You", ar: "مختارات من أجلك" },
  curatedSubtitle: { en: "Exceptional homes in the most sought-after Red Sea locations.", ar: "منازل استثنائية في أكثر مواقع البحر الأحمر رواجاً." },
  viewPortfolio: { en: "View the Portfolio", ar: "عرض محفظة العقارات" },

  // Booking Widget
  location: { en: "Location", ar: "الموقع" },
  locationPlaceholder: { en: "Where to?", ar: "إلى أين الذهاب؟" },
  checkIn: { en: "Check in", ar: "تسجيل الدخول" },
  checkOut: { en: "Check out", ar: "تسجيل الخروج" },
  addDates: { en: "Add dates", ar: "إضافة التواريخ" },
  guests: { en: "Guests", ar: "الضيوف" },
  addGuests: { en: "Add guests", ar: "إضافة ضيوف" },
  search: { en: "Search", ar: "بحث" },
  popularRegions: { en: "Popular Regions", ar: "المناطق الشائعة" },
  skipToGuests: { en: "Skip to Guests", ar: "التخطي إلى الضيوف" },
  adults: { en: "Adults", ar: "البالغون" },
  adultsAge: { en: "Ages 13 or above", ar: "عمر 13 سنة وما فوق" },
  children: { en: "Children", ar: "الأطفال" },
  childrenAge: { en: "Ages 2–12", ar: "عمر 2–12 سنة" },

  // Search Results Page
  searchHeaderSubtitle: { en: "Over 1,000 stays • Oct 12 - Oct 18 • 2 Guests", ar: "أكثر من 1000 إقامة • 12 - 18 أكتوبر • ضيفان" },
  searchHeaderTitle: { en: "Curated Stays in Hurghada", ar: "إقامات مختارة في الغردقة" },
  filtersOut: { en: "Filters", ar: "فلاتر" },
  typeOfPlace: { en: "Type of Place", ar: "نوع المكان" },
  price: { en: "Price", ar: "السعر" },
  instantBook: { en: "Instant Book", ar: "حجز فوري" },

  // Property Card / Property Types
  entireVilla: { en: "Entire Villa", ar: "فيلا بالكامل" },
  luxuryApartment: { en: "Luxury Apartment", ar: "شقة فاخرة" },
  entireEstate: { en: "Entire Estate", ar: "عقار بالكامل" },
  in: { en: "in", ar: "في" },
  guestCount: { en: "Guests", ar: "ضيوف" },
  bedroomCount: { en: "Bedrooms", ar: "غرف نوم" },
  viewDetails: { en: "View Details", ar: "عرض التفاصيل" },
  perNight: { en: "/ night", ar: "/ الليلة" },

  // Map
  mapView: { en: "Map View", ar: "عرض الخريطة" },
  listView: { en: "List View", ar: "عرض القائمة" },
  prototypeMap: { en: "Prototype Map · Real Map in Phase 4", ar: "خريطة نموذجية · خريطة حقيقية في المرحلة 4" },

  // Property Tags
  tagPrivatePool: { en: "Private Pool", ar: "مسبح خاص" },
  tagRedSeaView: { en: "Red Sea View", ar: "إطلالة على البحر الأحمر" },
  tagButlerService: { en: "Butler Service", ar: "خدمة الكونسيرج" },
  tagPanoramicViews: { en: "Panoramic Views", ar: "إطلالات بانورامية" },
  tagBeachAccess: { en: "Beach Access", ar: "وصول مباشر للشاطئ" },
  tagGolfCourseView: { en: "Golf Course View", ar: "إطلالة على ملعب الغولف" },
  tagChefIncluded: { en: "Chef Included", ar: "طاهٍ مُدرج" },

  // Footer
  footerTagline: { en: "A GlobeVistaHub Brand. Created for the Red Sea Riviera.", ar: "علامة تجارية من GlobeVistaHub. صُممت لريفييرا البحر الأحمر." },
  footerPrivacy: { en: "Privacy", ar: "الخصوصية" },
  footerTerms: { en: "Terms", ar: "الشروط" },
  footerContact: { en: "Contact", ar: "اتصل بنا" },
  footerCopyright: { en: "© 2026 THE VISTA. All rights reserved.", ar: "© 2026 ذا فيستا. جميع الحقوق محفوظة." },
};
