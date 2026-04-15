"use client";

import { useEffect, useState } from "react";
import { getProperties, togglePropertyStatus } from "@/data/api";
import type { Property } from "@/data/properties";
import {
  Building2,
  Search,
  MapPin,
  Users,
  Star,
  Plus,
  Loader2,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function PropertiesDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const { lang } = useLanguage();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    const data = await getProperties();
    setProperties(data);
    setIsLoading(false);
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    setTogglingId(id);
    const success = await togglePropertyStatus(id, currentStatus);
    if (success) {
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isBooked: !currentStatus } : p))
      );
    }
    setTogglingId(null);
  };

  const filteredProperties = properties.filter((p) => {
    const title = lang === "ar" ? p.title_ar : p.title;
    const location = lang === "ar" ? p.location_ar : p.location;
    const q = searchQuery.toLowerCase();
    return title.toLowerCase().includes(q) || location.toLowerCase().includes(q);
  });

  const activeCount = properties.filter((p) => !p.isBooked).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading text-navy font-bold flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            Properties
          </h1>
          <p className="text-muted mt-2">
            Manage your luxury portfolio, control visibility, and add new listings.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-navy text-white rounded-xl font-bold hover:bg-navy/90 transition-all shadow-soft group">
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Add Property
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-soft border border-navy/5 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search by property name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-v-background border border-navy/10 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-navy/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {activeCount} Active
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            {properties.length - activeCount} Hidden
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-primary/40 rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-primary/70 rounded-full animate-pulse delay-75" />
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-150" />
          </div>
          <p className="text-muted font-medium text-sm animate-pulse">Loading portfolio...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="py-24 text-center px-4 bg-white rounded-2xl border border-navy/5">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-primary/40" />
          </div>
          <h3 className="text-xl font-bold text-navy mb-2">No Properties Found</h3>
          <p className="text-muted max-w-sm mx-auto">
            Try adjusting your search or add a new luxury property to your portfolio.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            const title = lang === "ar" ? property.title_ar : property.title;
            const location = lang === "ar" ? property.location_ar : property.location;
            const isActive = !property.isBooked;

            return (
              <div
                key={property.id}
                className="bg-white rounded-2xl border border-navy/5 overflow-hidden shadow-soft group hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-navy/5">
                  {property.images?.[0] && (
                    <img
                      src={property.images[0]}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    <div
                      className={`px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-bold flex items-center gap-1.5 border ${
                        isActive
                          ? "bg-emerald-500/20 text-white border-emerald-500/30"
                          : "bg-black/40 text-white/90 border-white/10"
                      }`}
                    >
                      <Globe className={`w-3.5 h-3.5 ${!isActive && "opacity-50"}`} />
                      {isActive ? "Published" : "Hidden"}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-xl font-bold">${property.price}</span>
                    <span className="text-sm opacity-80"> / night</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-navy text-lg leading-tight line-clamp-1 flex-grow pr-4">
                      {title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm font-medium text-navy shrink-0">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      {property.rating}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-muted text-sm mb-6">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-navy/70">
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{property.guests} Guests</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                      <Building2 className="w-4 h-4 text-primary" />
                      <span>{property.type}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-4 border-t border-navy/5 flex items-center justify-between">
                    <Link
                      href={`/property/${property.id}`}
                      className="text-sm font-bold text-primary hover:text-navy transition-colors"
                    >
                      View Listing →
                    </Link>

                    <button
                      onClick={() => handleToggleStatus(property.id, property.isBooked)}
                      disabled={togglingId === property.id}
                      aria-label={isActive ? "Hide property" : "Publish property"}
                      className={`relative flex items-center justify-center w-12 h-6 rounded-full transition-colors duration-300 ${
                        isActive ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      {togglingId === property.id ? (
                        <Loader2 className="w-3 h-3 text-white animate-spin" />
                      ) : (
                        <span
                          className={`absolute w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${
                            isActive ? "right-1" : "left-1"
                          }`}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
