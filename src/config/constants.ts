export const VISTA_CONFIG = {
  brandName: "THE VISTA",
  parentBrand: "GlobeVistaHub",
  
  // PRIMARY CONCIERGE CONTACT
  // This is the centralized number used for WhatsApp bridges across the site
  concierge: {
    phone: "+201145551163", // Real GlobeVistaHub Business Number
    whatsappLink: (message: string) => `https://wa.me/201145551163?text=${encodeURIComponent(message)}`,
  },

  // SUPPORT EMAILS
  support: {
    email: "support@globevistahub.com",
  },
  
  // SOCIAL LINKS
  social: {
    instagram: "thevista.luxury",
  }
};
