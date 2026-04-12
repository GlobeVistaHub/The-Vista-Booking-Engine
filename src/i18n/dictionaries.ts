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
  fullyBooked: { en: "Booked", ar: "محجوز" },
  selectCategories: { en: "Select Categories", ar: "اختر الفئات" },
  priceRange: { en: "Price Range", ar: "نطاق السعر" },

  noResultsFound: { en: "No properties matched", ar: "لا توجد نتائج مطابقة" },
  noResultsDesc: { en: "Try adjusting your filters to find your perfect stay.", ar: "حاول تعديل الفلاتر للعثور على إقامتك المثالية." },
  clearAllFilters: { en: "Reset All Filters", ar: "إعادة ضبط جميع الفلاتر" },


  // Property Card / Property Types
  Villa: { en: "Villa", ar: "فيلا" },
  Penthouse: { en: "Penthouse", ar: "بنتهاوس" },
  Estate: { en: "Estate", ar: "عقار ريفي" },
  Apartment: { en: "Apartment", ar: "شقة لكجري" },
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
  tagUltraWifi: { en: "Ultra High-speed WiFi", ar: "واي فاي فائق السرعة" },
  tagSecurity: { en: "24/7 Gated Security", ar: "أمن 24/7" },
  tagInstantBook: { en: "Instant Book", ar: "حجز فوري" },

  // Footer
  footerTagline: { en: "The Red Sea Riviera by GlobeVistaHub", ar: "The Red Sea Riviera by GlobeVistaHub" },
  footerPrivacy: { en: "Privacy", ar: "الخصوصية" },
  footerTerms: { en: "Terms", ar: "الشروط" },
  footerContact: { en: "Contact", ar: "اتصل بنا" },
  footerCopyright: { en: "© 2026 THE VISTA. All rights reserved.", ar: "© 2026 ذا فيستا. جميع الحقوق محفوظة." },

  // Property Details Page (General Labels)
  hostedBy: { en: "Hosted by The Vista Concierge", ar: "بإدارة ذا فيستا كونسيرج" },
  aboutThisHome: { en: "About this home", ar: "عن هذا المنزل" },
  descriptionBody: { 
    en: "Experience luxury Riviera living at its finest.", 
    ar: "اختبر أرقى معايير المعيشة الفاخرة في ريفييرا البحر الأحمر." 
  },
  offers: { en: "What this place offers", ar: "ما يقدمه هذا المكان" },
  reserve: { en: "Reserve Now", ar: "احجز الآن" },
  night: { en: "night", ar: "ليلة" },
  cleaningFee: { en: "Cleaning fee", ar: "رسوم التنظيف" },
  serviceFee: { en: "Service fee", ar: "رسوم الخدمة" },
  totalLabel: { en: "Total", ar: "الإجمالي" },
  rareFind: { en: "This is a rare find", ar: "هذا اكتشاف نادر" },
  rareFindDetail: { en: "Vista's homes in El Gouna are usually fully booked.", ar: "منازل فيستا في الجونة عادة ما تكون محجوزة بالكامل." },

  // Checkout Page
  requestToBook: { en: "Request to book", ar: "طلب الحجز" },
  confirmAndPay: { en: "Confirm and pay", ar: "تأكيد والدفع" },
  yourTrip: { en: "Your trip", ar: "رحلتك" },
  dates: { en: "Dates", ar: "التواريخ" },
  edit: { en: "Edit", ar: "تعديل" },
  paymentMethod: { en: "Payment method", ar: "طريقة الدفع" },
  priceDetails: { en: "Price details", ar: "تفاصيل السعر" },
  groundRules: { en: "Ground rules", ar: "قواعد المنزل" },
  groundRulesDetail: { 
    en: "We ask every guest to remember a few simple things about what makes a great guest.", 
    ar: "نطلب من كل ضيف تذكر بعض الأشياء البسيطة حول ما يجعلك ضيفاً رائعاً." 
  },
  followHouseRules: { en: "Follow the house rules", ar: "اتبع قواعد المنزل" },
  treatHomeLikeOwn: { en: "Treat the home like your own", ar: "عامل المنزل وكأنه ملكك" },

  // Success Page
  bookingConfirmed: { en: "Your stay is confirmed!", ar: "تم تأكيد إقامتك!" },
  successSubtitle: { 
    en: "A confirmation email has been sent to your inbox. We look forward to hosting you.", 
    ar: "تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. نحن نتطلع لاستضافتك." 
  },
  viewBookings: { en: "View my bookings", ar: "عرض حجوزاتي" },
  backToHome: { en: "Back to Home", ar: "العودة إلى الرئيسية" },

  // Profile Page
  myAccount: { en: "My Account", ar: "حسابي" },
  myBookings: { en: "My Bookings", ar: "حجوزاتي" },
  upcoming: { en: "Upcoming", ar: "القادمة" },
  past: { en: "Past", ar: "السابقة" },
  manageProfile: { en: "Manage Profile", ar: "إدارة الملف الشخصي" },
  noBookings: { en: "No bookings found.", ar: "لا توجد حجوزات." },
  wishlistTab: { en: "Wishlist", ar: "قائمة الأمنيات" },
  wishlistEmptyMsg: { en: "Your wishlist is empty. Start exploring to save your favorite sanctuaries.", ar: "قائمة أمنياتك فارغة. ابدأ باستكشاف وجهاتنا لحفظ ملاذاتك المفضلة." },
  stayPreferences: { en: "Stay Preferences", ar: "تفضيلات الإقامة" },
  
  // Dashboard Settings
  personalInfo: { en: "Personal Information", ar: "المعلومات الشخصية" },
  fullName: { en: "Full Name", ar: "الاسم الكامل" },
  emailAddress: { en: "Email Address", ar: "البريد الإلكتروني" },
  phoneConcierge: { en: "Phone / Concierge Preference", ar: "الهاتف / تفضيل الكونسيرج" },
  defaultTravelParty: { en: "Default Travel Party", ar: "مجموعة السفر الافتراضية" },
  identityVerification: { en: "Identity Verification", ar: "التحقق من الهوية" },
  passportVerified: { en: "Passport Verified", ar: "جواز السفر موثق" },
  identitySecured: { en: "Your identity is secured. You are eligible for Instant Booking.", ar: "هويتك مؤمنة. أنت مؤهل للحجز الفوري." },
  verifiedStatus: { en: "Verified", ar: "موثق" },
  vistaVault: { en: "Vista Vault", ar: "خزنة فيستا" },
  updateBtn: { en: "Update", ar: "تحديث" },
  signOut: { en: "Sign Out", ar: "تسجيل الخروج" },
  expires: { en: "Expires", ar: "ينتهي" },
  contactConcierge: { en: "Contact Concierge", ar: "تواصل مع الكونسيرج" },
  bookingIdLabel: { en: "Booking ID", ar: "رقم الحجز" },
  vistaGold: { en: "Vista Gold", ar: "فيستا جولد" },
  eliteExplorer: { en: "Elite Explorer", ar: "إيليت إكسبلورر" },
  memberSince: { en: "MEMBER SINCE 2026", ar: "عضو منذ 2026" },
  statusLabel: { en: "Status", ar: "الحالة" },
  verifiedStatus: { en: "Verified", ar: "موثق" },
  guestNameLabel: { en: "Guest Name", ar: "اسم الضيف" },
  
  // Dashboard & Preferences
  prefPrivateBeach: { en: "Private Beach", ar: "شاطئ خاص" },
  prefChefIncluded: { en: "Chef Included", ar: "طاهٍ خاص" },
  prefOceanViews: { en: "Ocean Views", ar: "إطلالة بحرية" },
  prefHighSecurity: { en: "High Security", ar: "أمن عالي" },
  prefKidFriendly: { en: "Kid Friendly", ar: "مناسب للأطفال" },
  prefPetFriendly: { en: "Pet Friendly", ar: "يسمح بالحيوانات الأليفة" },
  prefPrivateGym: { en: "Private Gym", ar: "صالة رياضية خاصة" },
  prefSeaSports: { en: "Sea Sports", ar: "رياضات بحرية" },
  prefAirportVIP: { en: "Airport VIP Transfer", ar: "نقل VIP من المطار" },
  prefNightLife: { en: "Night Life", ar: "حياة ليلية" },
  prefShopping: { en: "Shopping", ar: "تسوق" },

  // Checkout & Payment
  notChargedYet: { en: "You won't be charged yet", ar: "لن يتم الخصم منك الآن" },
  cardNumber: { en: "Card number", ar: "رقم البطاقة" },
  expiration: { en: "Expiration", ar: "تاريخ الانتهاء" },
  cvv: { en: "CVV", ar: "الرمز (CVV)" },
  secureSsl: { en: "Secure SSL Encryption", ar: "تشفير SSL آمن" },
  saveChanges: { en: "Save Changes", ar: "حفظ التغييرات" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  editTrip: { en: "Edit Trip", ar: "تعديل الرحلة" },
  editGuests: { en: "Edit Guests", ar: "تعديل الضيوف" },
  confirmingBooking: { en: "Confirming booking...", ar: "جاري تأكيد حجزك..." },
  emailSent: { en: "Booking confirmed & email sent!", ar: "تم تأكيد الحجز وإرسال البريد!" },
  automationError: { en: "Booking confirmed (Email pending)", ar: "تم الحجز (البريد قيد الإرسال)" },

  // Regions
  regionGouna: { en: "El Gouna", ar: "الجونة" },
  regionSahl: { en: "Sahl Hasheesh", ar: "سهل حشيش" },
  regionSoma: { en: "Soma Bay", ar: "سوما باي" },
  regionMakadi: { en: "Makadi Bay", ar: "خليج مكادي" },
};
