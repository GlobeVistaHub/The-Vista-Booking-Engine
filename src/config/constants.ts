export const VISTA_CONFIG = {
  brandName: "THE VISTA",
  parentBrand: "GlobeVistaHub",
  
  // PRIMARY CONCIERGE CONTACT
  // This is the centralized number used for WhatsApp bridges across the site
  concierge: {
    phone: "+201011111111", // Your GlobeVistaHub Business Number
    whatsappLink: (message: string) => `https://wa.me/201011111111?text=${encodeURIComponent(message)}`,
  },

  // SUPPORT EMAILS
  support: {
    email: "concierge@thevista.com",
  },
  
  // SOCIAL LINKS
  social: {
    instagram: "thevista.luxury",
  }
};
