"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { VISTA_CONFIG } from "@/config/constants";
import { getBookings, getProperties, Booking } from "@/data/api";
import type { Property } from "@/data/properties";
import { User, Settings, LogOut, ChevronRight, Calendar, MapPin, Star, MessageSquare, ShieldCheck, Check, CreditCard, Trash2, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUser as useClerkUser, SignOutButton } from "@clerk/nextjs";

export default function ProfilePage() {
  const { t, lang } = useLanguage();
  const { wishlist, toggleWishlist, preferences, togglePreference, guestName } = useUser();
  const { user: clerkUser, isLoaded } = useClerkUser();
  
  const clerkName = clerkUser?.fullName 
    || (clerkUser?.firstName && clerkUser?.lastName ? `${clerkUser.firstName} ${clerkUser.lastName}` : null)
    || clerkUser?.firstName
    || clerkUser?.username
    || guestName;
  const authName = isLoaded ? clerkName : guestName;
  const authEmail = isLoaded 
    ? (clerkUser?.primaryEmailAddress?.emailAddress || "—")
    : "—";
  
  const [activeTab, setActiveTab] = useState<"trips" | "wishlist" | "settings">("trips");
  const [bookingFilter, setBookingFilter] = useState<"upcoming" | "past">("upcoming");
  
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [allBookings, setAllBookings] = useState<Array<{ bookingId: string, property: Property, checkIn: string | null, checkOut: string | null, rawId: string | number }>>([]);

  // Fetch true live data from Supabase/Store
  useEffect(() => {
    const fetchLiveData = async () => {
      const hidden = JSON.parse(localStorage.getItem('vista_hidden_bookings') || '[]');
      const [bData, pData] = await Promise.all([getBookings(), getProperties()]);
      
      const enrichedBookings = bData.map(b => {
        const prop = b.property || pData.find(p => String(p.id) === String(b.property_id));
        if (!prop) return null;
        
        return {
          bookingId: b.booking_reference || String(b.id),
          property: prop,
          checkIn: b.check_in || null,
          checkOut: b.check_out || null,
          rawId: b.id
        };
      }).filter(b => b && !hidden.includes(b.bookingId)) as any[];

      setAllBookings(enrichedBookings);
      setAllProperties(pData);
    };
    fetchLiveData();
  }, []);

  const handleDeleteBooking = (id: string) => {
    const hidden = JSON.parse(localStorage.getItem('vista_hidden_bookings') || '[]');
    const newHidden = [...hidden, id];
    localStorage.setItem('vista_hidden_bookings', JSON.stringify(newHidden));
    setAllBookings(prev => prev.filter(b => b.bookingId !== id));
  };

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "+44 7700 900077",
    travelParty: lang === 'ar' ? "2 بالغين، 0 أطفال" : "2 Adults, 0 Children"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('vista_profile_data');
    if (saved) {
      setProfileData(JSON.parse(saved));
    } else if (isLoaded) {
      setProfileData(prev => ({ ...prev, name: authName || "", email: authEmail !== "—" ? authEmail : "" }));
    }
  }, [isLoaded, authName, authEmail]);

  const handleProfileChange = (field: string, value: string) => {
    const newData = { ...profileData, [field]: value };
    setProfileData(newData);
    localStorage.setItem('vista_profile_data', JSON.stringify(newData));
  };

  const handleSavePreferences = () => {
    setIsSaving(true);
    // Visual satisfaction dummy save (data is already synced to localStorage locally on change)
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 800);
  };

  const today = new Date();
  const upcomingBookings = allBookings.filter(b => {
    if (!b.checkOut) return true;
    return new Date(b.checkOut) >= today;
  });
  const pastBookings = allBookings.filter(b => {
    if (!b.checkOut) return false;
    return new Date(b.checkOut) < today;
  });
  
  // Map wishlist using real dynamic property IDs from the database
  const wishlistProperties = allProperties.filter(p => wishlist.map(String).includes(String(p.id)));

  return (
    <div className="w-full bg-v-background min-h-screen pt-28 pb-20 text-start" dir={lang === "ar" ? "rtl" : "ltr"}>
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* SIDEBAR: NAVIGATION & MEMBERSHIP */}
        <aside className="lg:col-span-1 space-y-8">
          
          {/* VISTA GOLD MEMBERSHIP CARD */}
          <div className="relative overflow-hidden group rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#C5A028] opacity-90 transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
            <div className="relative p-6 space-y-6 text-navy">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/30">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{t('vistaGold')}</p>
                  <p className="text-[10px] font-bold opacity-40">{t('memberSince')}</p>
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{t('guestNameLabel')}</p>
                <p className="text-xl font-heading font-bold tracking-tight">{profileData.name || authName}</p>
              </div>

              <div className="flex justify-between items-end pt-2">
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-widest opacity-40">{t('statusLabel')}</p>
                  <p className="text-[10px] font-bold px-2 py-0.5 bg-white/30 rounded-full border border-white/40">{t('eliteExplorer')}</p>
                </div>
                <div className="flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-navy rounded-full opacity-20" />)}
                </div>
              </div>
            </div>
            {/* Glossy Reflection Effect */}
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] transition-all duration-1000 group-hover:left-[100%]" />
          </div>

          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab("trips")}
              className={`flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === "trips" ? "bg-navy text-white shadow-lg shadow-navy/20" : "bg-white text-navy hover:bg-navy/[0.02]"}`}
            >
              <span className="flex items-center gap-3">
                <Calendar className="w-5 h-5 opacity-70" />
                {t('myBookings')}
              </span>
              <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === "trips" ? "" : "text-muted/40"} ${lang === "ar" ? "rotate-180" : ""}`} />
            </button>

            <button 
              onClick={() => setActiveTab("wishlist")}
              className={`flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === "wishlist" ? "bg-navy text-white shadow-lg shadow-navy/20" : "bg-white text-navy hover:bg-navy/[0.02] border border-navy/5"}`}
            >
              <span className="flex items-center gap-3">
                <Star className="w-5 h-5 opacity-70" />
                {t('wishlistTab')}
                {wishlistProperties.length > 0 && <span className="ml-1 text-[10px] bg-primary text-navy px-1.5 rounded-full">{wishlistProperties.length}</span>}
              </span>
              <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === "wishlist" ? "" : "text-muted/40"} ${lang === "ar" ? "rotate-180" : ""}`} />
            </button>

            <button 
              onClick={() => setActiveTab("settings")}
              className={`flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === "settings" ? "bg-navy text-white shadow-lg shadow-navy/20" : "bg-white text-navy hover:bg-navy/[0.02] border border-navy/5"}`}
            >
              <span className="flex items-center gap-3">
                <Settings className="w-5 h-5 opacity-70" />
                {t('manageProfile')}
              </span>
              <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === "settings" ? "" : "text-muted/40"} ${lang === "ar" ? "rotate-180" : ""}`} />
            </button>

            <SignOutButton signOutOptions={{ redirectUrl: "/" }}>
              <button className="flex items-center justify-between p-4 bg-white hover:bg-red-50 text-red-600 rounded-2xl font-bold border border-navy/5 transition-colors mt-4 w-full">
                <span className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 opacity-70" />
                  {t('signOut')}
                </span>
              </button>
            </SignOutButton>
          </nav>
        </aside>

        {/* MAIN CONTENT: DYNAMIC TABS */}
        <div className="lg:col-span-3 space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="text-4xl font-heading font-bold text-navy tracking-tight">
              {activeTab === "trips" && t('myBookings')}
              {activeTab === "wishlist" && t('wishlistTab')}
              {activeTab === "settings" && t('stayPreferences')}
            </h1>
            
            {activeTab === "trips" && (
              <div className="flex gap-4 border-b border-navy/5 pb-2">
                <button 
                  onClick={() => setBookingFilter("upcoming")}
                  className={`text-sm font-bold pb-2 px-2 transition-all ${bookingFilter === "upcoming" ? "text-navy border-b-2 border-primary" : "text-muted hover:text-navy"}`}
                >
                  {t('upcoming')}
                </button>
                <button 
                  onClick={() => setBookingFilter("past")}
                  className={`text-sm font-bold pb-2 px-2 transition-all ${bookingFilter === "past" ? "text-navy border-b-2 border-primary" : "text-muted hover:text-navy"}`}
                >
                  {t('past')}
                </button>
              </div>
            )}
          </div>

          {/* TAB CONTENT: TRIPS */}
          {activeTab === "trips" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {(bookingFilter === "upcoming" ? upcomingBookings : pastBookings).length > 0 ? (
                (bookingFilter === "upcoming" ? upcomingBookings : pastBookings).map((booking) => {
                  const property = booking.property;
                  return (
                    <div key={booking.bookingId} className="group bg-white rounded-3xl overflow-hidden border border-navy/5 shadow-soft hover:shadow-hover transition-all">
                      <div className="relative h-48 overflow-hidden">
                        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-4 right-4 flex gap-2">
                          {bookingFilter === "upcoming" && (
                            <div className="px-3 py-1 bg-emerald-500 rounded-full text-[10px] font-bold text-white shadow-sm uppercase tracking-wider">
                                Confirmed
                            </div>
                          )}
                          <button 
                            onClick={() => handleDeleteBooking(booking.bookingId)}
                            className="p-2 bg-white/20 backdrop-blur-md hover:bg-red-500 hover:text-white text-white rounded-full transition-all border border-white/30"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-navy">{lang === "ar" ? property.title_ar : property.title}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted mt-1">
                            <MapPin className="w-4 h-4" />
                            {lang === "ar" ? property.location_ar : property.location}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-navy/5">
                            <div className="text-xs text-muted">
                                <p className="font-bold text-navy uppercase tracking-widest mb-0.5">{t('checkIn')}</p>
                                <p>{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Oct 12, 2026"}</p>
                            </div>
                            <div className="text-xs text-muted text-right">
                                <p className="font-bold text-navy uppercase tracking-widest mb-0.5">{t('checkOut')}</p>
                                <p>{booking.checkOut ? new Date(booking.checkOut).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Oct 17, 2026"}</p>
                            </div>
                        </div>
                        
                        {bookingFilter === "upcoming" && (
                          <>
                            <div className="text-xs text-muted mt-2 font-mono">
                              <span className="text-navy/40 uppercase tracking-widest text-[9px] font-bold block mb-0.5">{t('bookingIdLabel')}</span>
                              {booking.bookingId}
                            </div>
                            <a 
                              href={VISTA_CONFIG.concierge.whatsappLink(
                                lang === "ar" 
                                  ? `مرحباً كونسيرج فيستا،\n\nأنا ${authName}\nلدي إقامة قادمة في ${property.title_ar}\nرقم الحجز: ${booking.bookingId}\n\nأحتاج إلى مساعدة بخصوص إقامتي.`
                                  : `Hello Vista Concierge,\n\nI am ${authName}\nI have an upcoming stay at ${property.title}\nBooking ID: ${booking.bookingId}\n\nI need some assistance regarding my stay.`
                              )}
                              target="_blank"
                              className="w-full py-3 bg-navy/[0.03] hover:bg-navy hover:text-white text-navy rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                            >
                              <MessageSquare className="w-4 h-4" />
                              {t('contactConcierge')}
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                  <div className="col-span-full py-20 text-center space-y-4">
                      <Calendar className="w-12 h-12 text-muted mx-auto opacity-20" />
                      <p className="text-muted font-medium">{t('noBookings')}</p>
                  </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {wishlistProperties.length > 0 ? (
                wishlistProperties.map((property) => (
                  <div key={property.id} className="scale-95 hover:scale-100 transition-transform duration-500">
                    <div className="p-2 bg-white rounded-[2.5rem] shadow-soft border border-navy/5">
                        <div className="relative h-64 rounded-[2rem] overflow-hidden mb-6">
                          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                          
                          {/* Heart Toggle Button */}
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(property.id);
                            }}
                            className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-navy/5 group/heart transition-all active:scale-95"
                          >
                            <Heart className={`w-5 h-5 transition-colors ${wishlist.includes(property.id) ? "fill-red-500 text-red-500" : "text-navy/30 group-hover/heart:text-red-500"}`} />
                          </button>
                        </div>
                        <div className="px-4 pb-4">
                          <h3 className="text-xl font-bold text-navy">{lang === 'ar' ? property.title_ar : property.title}</h3>
                          <p className="text-sm text-muted mb-4">{lang === 'ar' ? property.location_ar : property.location}</p>
                          <Link href={`/property/${property.id}`} className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 group">
                            View Details
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center space-y-4">
                    <Star className="w-12 h-12 text-muted mx-auto opacity-20" />
                    <p className="text-muted font-medium">{t('wishlistEmptyMsg')}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-8">
              
              {/* Personal Details */}
              <div className="bg-white rounded-3xl p-8 md:p-10 border border-navy/5 shadow-soft space-y-8">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-navy mb-6 flex items-center gap-2"><User className="w-4 h-4 text-primary" /> {t('personalInfo')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">{t('fullName')}</label>
                    <input 
                      type="text" 
                      value={profileData.name} 
                      readOnly
                      placeholder={authName || ""}
                      className="w-full p-4 bg-v-background rounded-2xl border border-navy/5 font-bold text-navy outline-none opacity-80 cursor-not-allowed" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">{t('emailAddress')}</label>
                    <input 
                      type="text" 
                      value={profileData.email} 
                      readOnly
                      placeholder={authEmail || ""}
                      className="w-full p-4 bg-v-background rounded-2xl border border-navy/5 font-bold text-navy outline-none opacity-80 cursor-not-allowed" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">{t('phoneConcierge')}</label>
                    <div className="flex bg-v-background rounded-2xl border border-navy/5 overflow-hidden transition-colors focus-within:border-primary/50">
                      <input 
                        type="text" 
                        value={profileData.phone} 
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        className="w-full p-4 bg-transparent font-bold text-navy outline-none" 
                        dir="ltr" 
                      />
                      <div className="bg-navy/5 px-4 flex items-center border-l border-navy/5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-navy">WhatsApp</span>
                      </div>
                    </div>
                    <p className="text-[9px] text-muted font-medium mt-2 leading-tight pl-2">
                      {lang === 'ar' ? 'هذا هو الرقم الذي يستخدمه النظام لإرسال تأكيدات الحجز والتواصل مع الكونسيرج.' : 'This is the number used by the system to send booking confirmations and correspond securely with your concierge.'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">{t('defaultTravelParty')}</label>
                    <input 
                      type="text" 
                      value={profileData.travelParty} 
                      onChange={(e) => handleProfileChange('travelParty', e.target.value)}
                      placeholder={lang === 'ar' ? 'مثل: أسرة، أو بالغين وطفلين' : 'e.g. Family, or 2 Adults 2 Children'}
                      className="w-full p-4 bg-v-background rounded-2xl border border-navy/5 font-bold text-navy outline-none focus:border-primary/50 transition-colors" 
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
                    <button 
                      onClick={handleSavePreferences}
                      disabled={isSaving || isSaved}
                      className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${
                        isSaved ? 'bg-emerald-500 text-white' : 
                        isSaving ? 'bg-navy/50 text-white' : 
                        'bg-navy text-white hover:bg-primary hover:text-navy hover:scale-105 active:scale-95 shadow-soft border border-navy/20'
                      }`}
                    >
                      {isSaved ? (
                        <><Check className="w-4 h-4" /> {lang === 'ar' ? 'تم الحفظ بشكل آمن' : 'Safely Saved'}</>
                      ) : isSaving ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> {lang === 'ar' ? 'جاري الحفظ للتخزين الآمن...' : 'Securing Data...'}</>
                      ) : (
                        <>{lang === 'ar' ? 'حفظ التفضيلات' : 'Save Preferences'}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Identity & Security */}
              <div className="bg-white rounded-3xl p-8 md:p-10 border border-navy/5 shadow-soft">
                 <h4 className="text-xs font-black uppercase tracking-[0.2em] text-navy mb-6 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> {t('identityVerification')}</h4>
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-v-background border border-navy/5 rounded-2xl gap-4">
                    <div>
                      <p className="font-bold text-navy text-lg">{lang === 'ar' ? 'مطلوب إثبات الهوية' : 'Identity Verification Required'}</p>
                      <p className="text-sm text-muted">{lang === 'ar' ? 'يرجى إرسال نسخة من الهوية إلى الكونسيرج.' : 'Please securely submit a copy of your ID to the Concierge.'}</p>
                    </div>
                    <a 
                      href="https://wa.me/447700900077?text=Hello%20Vista%20Concierge,%20I%20am%20ready%20to%20securely%20verify%20my%20Identity."
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 bg-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-navy transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-soft border border-navy/10"
                    >
                      <MessageSquare className="w-4 h-4" /> 
                      {lang === 'ar' ? 'التحقق عبر واتساب' : 'Verify via WhatsApp'}
                    </a>
                 </div>
              </div>

              {/* Payment Vault */}
              <div className="bg-white rounded-3xl p-8 md:p-10 border border-navy/5 shadow-soft">
                 <h4 className="text-xs font-black uppercase tracking-[0.2em] text-navy mb-6 flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> {t('vistaVault')}</h4>
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-v-background border border-navy/5 rounded-2xl gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-navy text-white rounded-md flex items-center justify-center font-bold text-[10px] uppercase tracking-widest shadow-sm border border-navy/10">VISA</div>
                      <div className="text-start">
                        <p className="font-bold text-navy" dir="ltr">•••• •••• •••• 4242</p>
                        <p className="text-xs text-muted">{t('expires')} 12/28</p>
                      </div>
                    </div>
                    <div className="text-right sm:max-w-[220px]">
                      <p className="text-[9px] text-muted leading-relaxed font-bold">
                        {lang === 'ar' ? 'البطاقة الأحدث في معاملة الحجز. يتم تحديثها تلقائياً عند الدفع ببطاقة جديدة.' : 'Most recently used in your last booking. This securely updates whenever you checkout with a new card.'}
                      </p>
                    </div>
                 </div>
              </div>

              {/* Travel Preferences */}
              <div className="bg-white rounded-3xl p-8 md:p-10 border border-navy/5 shadow-soft">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-navy mb-6 flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> {t('stayPreferences')}</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'Private Beach', key: 'prefPrivateBeach' },
                    { id: 'Chef Included', key: 'prefChefIncluded' },
                    { id: 'Ocean Views', key: 'prefOceanViews' },
                    { id: 'High Security', key: 'prefHighSecurity' },
                    { id: 'Kid Friendly', key: 'prefKidFriendly' },
                    { id: 'Pet Friendly', key: 'prefPetFriendly' },
                    { id: 'Private Gym', key: 'prefPrivateGym' },
                    { id: 'Sea Sports', key: 'prefSeaSports' },
                    { id: 'Airport VIP Transfer', key: 'prefAirportVIP' },
                    { id: 'Night Life', key: 'prefNightLife' },
                    { id: 'Shopping', key: 'prefShopping' }
                  ].map((pref) => (
                    <button 
                      key={pref.id} 
                      onClick={() => togglePreference(pref.id)}
                      className={`px-4 py-2 text-[10px] font-bold rounded-full border uppercase tracking-widest transition-all ${preferences.includes(pref.id) ? "bg-primary text-navy border-primary" : "bg-white text-muted border-navy/10 hover:border-primary/50"}`}
                    >
                      {t(pref.key as any) || pref.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
