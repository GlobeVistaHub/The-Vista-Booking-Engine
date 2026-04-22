"use client";

import { useState, useEffect } from "react";
import { useSession } from "@clerk/nextjs";
import { getSiteContent, updateSiteLabel, SiteLabel } from "@/data/api";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Loader2, 
  Edit3, 
  LayoutTemplate,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function LabelsManagerPage() {
  const { session } = useSession();
  const { lang, refreshLabels } = useLanguage();
  const [labels, setLabels] = useState<SiteLabel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Omit<SiteLabel, 'key'>>({ value_en: '', value_ar: '' });

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    setIsLoading(true);
    const token = await session?.getToken({ template: 'supabase' }) || undefined;
    const data = await getSiteContent(token);
    // Default keys to ensure are always manageable - REMOVED nStays
    const essentialKeys = [
      'heroTitle', 
      'heroSubtitle',
      'curatedTitle',
      'curatedSub',
      'socialInsta',
      'socialFB',
      'socialX',
      'footerTagline', 
      'footerCopyright',
      'footerPrivacy',
      'footerTerms',
      'footerContact'
    ];
    
    // Merge remote labels with essential keys if missing
    let merged = [...data];
    essentialKeys.forEach(key => {
      if (!merged.find(l => l.key === key)) {
        merged.push({ key, value_en: '', value_ar: '' });
      }
    });
    
    // Filter out nStays and brandName to prevent database conflicts or branding overrides
    setLabels(merged.filter(l => l.key !== 'nStays' && l.key !== 'brandName'));
    setIsLoading(false);
  };

  const startEdit = (label: SiteLabel) => {
    setEditingKey(label.key);
    setEditValues({ value_en: label.value_en, value_ar: label.value_ar });
  };

  const handleSave = async (key: string) => {
    setIsSaving(true);
    const token = await session?.getToken({ template: 'supabase' }) || undefined;
    const success = await updateSiteLabel({ key, ...editValues }, token);
    if (success) {
      setLabels(prev => prev.map(l => l.key === key ? { key, ...editValues } : l));
      setEditingKey(null);
      await refreshLabels();
      alert("Label updated successfully!");
    } else {
      alert("Failed to update label. Please check your database permissions.");
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading text-navy font-bold flex items-center gap-3">
            <LayoutTemplate className="w-8 h-8 text-primary" />
            Labels Manager
          </h1>
          <p className="text-muted mt-2">
            Customize the text and translations used across the site interface.
          </p>
        </div>
        <Link 
          href="/admin" 
          className="flex items-center gap-2 text-sm font-bold text-muted hover:text-navy transition-colors bg-white px-4 py-2 rounded-xl border border-navy/5 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-navy/5 overflow-hidden">
        <div className="p-6 border-b border-navy/5">
          <h2 className="font-bold text-navy text-lg">Site Labels & Content</h2>
          <p className="text-sm text-muted mt-1">
            Update translations for essential keys. Changes are applied instantly.
          </p>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {labels.map((label) => {
                  const isEditing = editingKey === label.key;
                  return (
                    <div key={label.key} className="bg-white p-4 rounded-xl border border-navy/5 shadow-sm group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/5 px-2 py-0.5 rounded">Key</span>
                          <span className="text-xs font-bold text-navy font-mono">{label.key}</span>
                        </div>
                        {!isEditing && (
                          <button 
                            onClick={() => startEdit(label)}
                            className="p-1.5 text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-4 animate-fade-in">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1">English Label</label>
                              <input 
                                value={editValues.value_en}
                                onChange={(e) => setEditValues({ ...editValues, value_en: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                                placeholder="e.g. Stays"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-muted uppercase tracking-widest mb-1 text-right">Arabic Translation</label>
                              <input 
                                dir="rtl"
                                value={editValues.value_ar}
                                onChange={(e) => setEditValues({ ...editValues, value_ar: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-primary outline-none text-right font-heading-ar"
                                placeholder="مثال: إقامات"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setEditingKey(null)}
                              className="px-4 py-1.5 text-xs font-bold text-muted hover:text-navy"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleSave(label.key)}
                              disabled={isSaving}
                              className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90 flex items-center gap-2"
                            >
                              {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
                              Update Label
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-3">
                          <div className="min-w-0">
                            <p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-0.5">Value (EN)</p>
                            <p className="text-xs font-medium text-navy truncate">{label.value_en || <span className="text-slate-300 italic">Static Fallback</span>}</p>
                          </div>
                          <div className="min-w-0 text-right">
                            <p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-0.5">Value (AR)</p>
                            <p className="text-xs font-medium text-navy font-heading-ar truncate">{label.value_ar || <span className="text-slate-300 italic font-body">الخيار الإفتراضي</span>}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
