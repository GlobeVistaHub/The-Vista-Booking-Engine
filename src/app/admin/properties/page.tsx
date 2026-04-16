"use client";

import { useEffect, useState } from "react";
import { getProperties, togglePropertyStatus, batchCreateProperties, deleteAllProperties, deleteProperty } from "@/data/api";
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
  Upload,
  Download,
  AlertCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import AddPropertyModal from "@/components/admin/AddPropertyModal";
import { parsePropertiesCSV, generateCSVTemplate } from "@/utils/csv";

export default function PropertiesDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const { lang } = useLanguage();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    // Admin sees ALL properties including hidden ones
    const data = await getProperties({ includeHidden: true });
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

  const handleDeleteAll = async () => {
    if (!window.confirm("CRITICAL: This will permanently delete your ENTIRE portfolio. This action cannot be undone. Are you absolutely sure?")) {
      return;
    }

    setIsDeleting(true);
    const success = await deleteAllProperties();
    if (success) {
      setProperties([]);
    } else {
      setImportError("Failed to wipe portfolio. Please verify permissions.");
    }
    setIsDeleting(false);
  };

  const handleDeleteProperty = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    const success = await deleteProperty(id);
    if (success) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } else {
      setImportError(`Failed to delete "${title}".`);
    }
    setDeletingId(null);
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);

    try {
      const text = await file.text();
      const parsed = parsePropertiesCSV(text);
      if (parsed.length === 0) {
        throw new Error("No valid properties found in CSV.");
      }

      const success = await batchCreateProperties(parsed);
      if (success) {
        await fetchProperties();
      } else {
        throw new Error("Failed to save properties to database.");
      }
    } catch (err: any) {
      setImportError(err.message || "Something went wrong during import.");
    } finally {
      setIsImporting(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleDownloadTemplate = () => {
    const template = generateCSVTemplate();
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vista_properties_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestoreMaster = async () => {
    if (!window.confirm("RESET & RESTORE: This will wipe your current database and load the curated 15-property 'Enriched V6' portfolio. Proceed?")) {
      return;
    }

    setIsImporting(true);
    setImportError(null);

    try {
      // 1. Wipe current
      const wipeSuccess = await deleteAllProperties();
      if (!wipeSuccess) throw new Error("Failed to clear current portfolio.");

      // 2. Load Master CSV from public folder
      const response = await fetch('/funnel_test_v6_enriched.csv');
      if (!response.ok) throw new Error("Could not find master CSV file.");
      
      const text = await response.text();
      const parsed = parsePropertiesCSV(text);
      
      // 3. Batch Create
      const success = await batchCreateProperties(parsed);
      if (success) {
        await fetchProperties();
      } else {
        throw new Error("Failed to restore master properties.");
      }
    } catch (err: any) {
      setImportError(err.message || "Something went wrong during restoration.");
    } finally {
      setIsImporting(false);
    }
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
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleRestoreMaster}
            disabled={isImporting}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-orange-400 text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-30"
            title="Restore Master Portfolio (Wipe & Reload)"
          >
            {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span className="hidden md:inline">Restore Master</span>
          </button>

          <button 
            onClick={handleDeleteAll}
            disabled={isDeleting || properties.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100 transition-all shadow-sm disabled:opacity-30 disabled:grayscale"
            title="Wipe Portfolio (Danger Zone)"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            <span className="hidden md:inline">Reset Portfolio</span>
          </button>

          <button 
            onClick={handleDownloadTemplate}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-navy border border-navy/10 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
            title="Download CSV Template"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Template</span>
          </button>
          
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleBulkUpload}
              className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
              disabled={isImporting}
            />
            <button 
              disabled={isImporting}
              className={`flex items-center justify-center gap-2 px-4 py-3 bg-white text-navy border border-navy/10 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm ${isImporting ? 'opacity-50' : ''}`}
            >
              {isImporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span className="hidden md:inline">{isImporting ? 'Importing...' : 'Bulk Upload'}</span>
            </button>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-navy text-white rounded-xl font-bold hover:bg-navy/90 transition-all shadow-soft group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Add Property
          </button>
        </div>
      </div>

      {importError && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 animate-fade-in">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{importError}</p>
        </div>
      )}

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
          <Loader2 className="w-10 h-10 text-primary/40 animate-spin" />
          <p className="text-muted font-medium text-sm animate-pulse">Syncing portfolio...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-white py-24 text-center px-4 rounded-2xl border border-navy/5 shadow-soft">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-primary/40" />
          </div>
          <h3 className="text-xl font-bold text-navy mb-2">Portfolio Empty</h3>
          <p className="text-muted max-w-sm mx-auto">Upload a CSV or add your first luxury listing to get started.</p>
        </div>
      ) : (
        <>
          {/* Desktop Grid View */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const title = lang === "ar" ? property.title_ar || property.title : property.title;
              const location = lang === "ar" ? property.location_ar || property.location : property.location;
              const isActive = !property.isBooked;

              return (
                <div
                  key={property.id}
                  className="bg-white rounded-2xl shadow-soft border border-navy/5 overflow-hidden hover:shadow-hover transition-all group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={property.images[0]}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border ${
                        isActive ? "bg-emerald-500 text-white border-emerald-400" : "bg-slate-500 text-white border-slate-400"
                      }`}>
                        {isActive ? "Active" : "Hidden"}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col h-[280px]">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-navy truncate">{title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted mt-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span className="truncate">{location}</span>
                      </div>
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

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleDeleteProperty(property.id, title)}
                          disabled={deletingId === property.id}
                          className="p-1 px-2 text-red-500/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Property"
                        >
                          {deletingId === property.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => handleToggleStatus(property.id, !!property.isBooked)}
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
                </div>
              );
            })}
          </div>

          {/* Mobile List View */}
          <div className="md:hidden space-y-4">
            {filteredProperties.map((property) => {
              const title = lang === "ar" ? property.title_ar || property.title : property.title;
              const isActive = !property.isBooked;

              return (
                <div key={property.id} className="bg-white rounded-2xl shadow-soft border border-navy/5 p-4 flex gap-4">
                  <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-xl">
                    <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-navy text-sm truncate">{title}</h3>
                      <div className={`shrink-0 w-2 h-2 rounded-full mt-1.5 ${isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
                    </div>
                    
                    <p className="text-[10px] text-muted truncate mb-3">{property.location}</p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <Link href={`/property/${property.id}`} className="text-[10px] font-bold text-primary underline">
                        Details
                      </Link>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDeleteProperty(property.id, title)}
                          disabled={deletingId === property.id}
                          className="text-red-400 p-1"
                        >
                          {deletingId === property.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleToggleStatus(property.id, !!property.isBooked)}
                          disabled={togglingId === property.id}
                          className={`w-10 h-5 rounded-full relative transition-colors ${isActive ? "bg-emerald-500" : "bg-slate-300"}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${isActive ? "right-0.5" : "left-0.5"}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <AddPropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchProperties()}
      />
    </div>
  );
}
