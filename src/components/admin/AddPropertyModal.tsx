"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2, CheckCircle } from "lucide-react";
import { addProperty } from "@/data/api";
import { Property } from "@/data/properties";

const PROPERTY_TYPES = [
  "Villa", 
  "Penthouse", 
  "Estate", 
  "Apartment", 
  "Resort", 
  "Cabin", 
  "Townhouse", 
  "Studio", 
  "Loft", 
  "Mansion", 
  "Village House"
] as const;

const AVAILABLE_TAGS: { key: string; label: string }[] = [
  { key: "tagPrivatePool", label: "Private Pool" },
  { key: "tagRedSeaView", label: "Red Sea View" },
  { key: "tagButlerService", label: "Butler Service" },
  { key: "tagInstantBook", label: "Instant Book" },
  { key: "tagPanoramicViews", label: "Panoramic Views" },
  { key: "tagBeachAccess", label: "Beach Access" },
  { key: "tagGolfCourseView", label: "Golf Course View" },
  { key: "tagChefIncluded", label: "Chef Included" },
];

type FormData = {
  title: string;
  title_ar: string;
  location: string;
  location_ar: string;
  price: string;
  guests: string;
  baseGuests: string;
  bedrooms: string;
  type: "Villa" | "Penthouse" | "Estate" | "Apartment";
  images: string[];
  tags: string[];
  description_en: string;
  description_ar: string;
  ownerPhone: string;
  lat: string;
  lng: string;
  isInstantBookable: boolean;
};

const initialForm: FormData = {
  title: "",
  title_ar: "",
  location: "",
  location_ar: "",
  price: "",
  guests: "",
  baseGuests: "",
  bedrooms: "",
  type: "Villa",
  images: [""],
  tags: [],
  description_en: "",
  description_ar: "",
  ownerPhone: "",
  lat: "",
  lng: "",
  isInstantBookable: false,
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPropertyModal({ isOpen, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setForm(initialForm);
      setIsDone(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const set = (field: keyof FormData, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setImage = (idx: number, value: string) => {
    const imgs = [...form.images];
    imgs[idx] = value;
    set("images", imgs);
  };

  const addImage = () => set("images", [...form.images, ""]);
  const removeImage = (idx: number) =>
    set("images", form.images.filter((_, i) => i !== idx));

  const toggleTag = (key: string) => {
    const tags = form.tags.includes(key)
      ? form.tags.filter((t) => t !== key)
      : [...form.tags, key];
    set("tags", tags);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location || !form.price) return;

    setIsLoading(true);
    const cleanImages = form.images.filter((img) => img.trim() !== "");
    
    const payload: Omit<Property, "id" | "rating" | "reviews"> = {
      title: form.title,
      title_ar: form.title_ar,
      location: form.location,
      location_ar: form.location_ar,
      price: parseFloat(form.price),
      guests: form.guests,
      baseGuests: parseInt(form.baseGuests) || 2,
      bedrooms: form.bedrooms,
      type: form.type,
      images: cleanImages.length > 0 ? cleanImages : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"],
      tags: form.tags,
      description_en: form.description_en,
      description_ar: form.description_ar,
      ownerPhone: form.ownerPhone,
      lat: parseFloat(form.lat) || 0,
      lng: parseFloat(form.lng) || 0,
      isBooked: false,
      isInstantBookable: form.isInstantBookable,
    };

    const result = await addProperty(payload);
    setIsLoading(false);
    if (result) {
      setIsDone(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    }
  };

  if (!mounted && !isOpen) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`fixed inset-0 bg-navy/40 backdrop-blur-sm z-[200] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[640px] bg-white z-[210] shadow-2xl flex flex-col transition-transform duration-[380ms] ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-heading font-bold text-navy">Add Luxury Property</h2>
            <p className="text-xs text-muted mt-0.5">All fields marked with * are required</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-muted hover:text-navy transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM BODY — scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">

            {/* ── Identity ────────────────────────────────────────── */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Identity</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Title (English) *</label>
                    <input required className="field-input" placeholder="Villa Serenity" value={form.title} onChange={(e) => set("title", e.target.value)} />
                  </div>
                  <div>
                    <label className="field-label">Title (Arabic)</label>
                    <input className="field-input text-right" dir="rtl" placeholder="فيلا سيرينيتي" value={form.title_ar} onChange={(e) => set("title_ar", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Type *</label>
                    <select required className="field-input" value={form.type} onChange={(e) => set("type", e.target.value as any)}>
                      {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="field-label">Instant Booking</label>
                    <div className="flex items-center gap-3 mt-2">
                       <button
                        type="button"
                        onClick={() => set("isInstantBookable", !form.isInstantBookable)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${form.isInstantBookable ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${form.isInstantBookable ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                      <span className="text-xs font-bold text-navy/60">
                        {form.isInstantBookable ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1">
                  <div>
                    <label className="field-label">Owner Phone</label>
                    <input className="field-input" placeholder="+20 1000000000" value={form.ownerPhone} onChange={(e) => set("ownerPhone", e.target.value)} />
                  </div>
                </div>
              </div>
            </section>

            {/* ── Location ────────────────────────────────────────── */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Location</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Location (English) *</label>
                  <input required className="field-input" placeholder="El Gouna" value={form.location} onChange={(e) => set("location", e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Location (Arabic)</label>
                  <input className="field-input text-right" dir="rtl" placeholder="الجونة" value={form.location_ar} onChange={(e) => set("location_ar", e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Latitude</label>
                  <input type="number" step="any" className="field-input" placeholder="27.3912" value={form.lat} onChange={(e) => set("lat", e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Longitude</label>
                  <input type="number" step="any" className="field-input" placeholder="33.6811" value={form.lng} onChange={(e) => set("lng", e.target.value)} />
                </div>
              </div>
            </section>

            {/* ── Details ─────────────────────────────────────────── */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Nightly Price (USD) *</label>
                  <input required type="number" min="1" className="field-input" placeholder="450" value={form.price} onChange={(e) => set("price", e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Max Guests</label>
                  <input type="number" min="1" className="field-input" placeholder="8" value={form.guests} onChange={(e) => set("guests", e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Base Guests (included in rate)</label>
                  <input type="number" min="1" className="field-input" placeholder="4" value={form.baseGuests} onChange={(e) => set("baseGuests", e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Bedrooms</label>
                  <input type="number" min="1" className="field-input" placeholder="4" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} />
                </div>
              </div>
            </section>

            {/* ── Images ──────────────────────────────────────────── */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Images (URLs)</h3>
              <div className="space-y-2">
                {form.images.map((img, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      className="field-input flex-1"
                      placeholder={`https://images.unsplash.com/...`}
                      value={img}
                      onChange={(e) => setImage(idx, e.target.value)}
                    />
                    {form.images.length > 1 && (
                      <button type="button" onClick={() => removeImage(idx)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {form.images.length < 5 && (
                  <button type="button" onClick={addImage} className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors mt-1">
                    <Plus className="w-4 h-4" /> Add Image URL
                  </button>
                )}
              </div>
            </section>

            {/* ── Tags ────────────────────────────────────────────── */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Amenity Tags</h3>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleTag(key)}
                    className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide border transition-all ${
                      form.tags.includes(key)
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-white text-muted border-slate-200 hover:border-primary/40 hover:text-navy"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            {/* ── Descriptions ────────────────────────────────────── */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Descriptions</h3>
              <div className="space-y-4">
                <div>
                  <label className="field-label">Description (English)</label>
                  <textarea className="field-input resize-none" rows={4} placeholder="A tranquil escape in the heart of..." value={form.description_en} onChange={(e) => set("description_en", e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Description (Arabic)</label>
                  <textarea className="field-input resize-none text-right" dir="rtl" rows={4} placeholder="ملاذ هادئ في قلب..." value={form.description_ar} onChange={(e) => set("description_ar", e.target.value)} />
                </div>
              </div>
            </section>

          </div>
        </form>

        {/* FOOTER */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-muted hover:text-navy hover:bg-slate-50 font-medium transition-all text-sm">
            Cancel
          </button>
          <button
            onClick={handleSubmit as any}
            disabled={isLoading || isDone}
            className={`flex items-center gap-2.5 px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${
              isDone
                ? "bg-emerald-500 text-white"
                : "bg-primary text-white hover:opacity-90 active:scale-95 shadow-primary/30"
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : isDone ? (
              <><CheckCircle className="w-4 h-4" /> Property Added!</>
            ) : (
              "Save Property"
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748b;
          margin-bottom: 6px;
        }
        .field-input {
          width: 100%;
          padding: 10px 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field-input:focus {
          border-color: var(--color-primary, #b8860b);
          box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.1);
        }
      `}</style>
    </>
  );
}
