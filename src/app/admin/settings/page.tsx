"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Building2,
  Store,
  LayoutGrid,
  Save,
  CheckCircle,
  Database,
  LayoutTemplate,
  Globe,
  Info
} from "lucide-react";
import { useAppModeStore } from "@/store/appModeStore";
import { useDemoStore } from "@/store/demoStore";
import Link from "next/link";

export default function SettingsPage() {
  const { isWhiteLabel, brandName, ownerName, setWhiteLabel, setBrandName, setOwnerName } = useAppModeStore();
  const { isDemoMode, setDemoMode } = useDemoStore();

  const [localBrand, setLocalBrand] = useState(brandName);
  const [localOwner, setLocalOwner] = useState(ownerName);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLocalBrand(brandName);
    setLocalOwner(ownerName);
  }, [brandName, ownerName]);

  const handleSave = () => {
    setBrandName(localBrand);
    setOwnerName(localOwner);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-heading text-navy font-bold flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Platform Settings
        </h1>
        <p className="text-muted mt-2">
          Configure your platform's operating mode, branding, and data layer.
        </p>
      </div>

      {/* ── Section 1: Operating Mode ─────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-soft border border-navy/5 overflow-hidden">
        <div className="p-6 border-b border-navy/5">
          <h2 className="font-bold text-navy text-lg">Operating Mode</h2>
          <p className="text-sm text-muted mt-1">
            Choose whether this instance runs as a shared marketplace or a fully branded white-label SaaS product.
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Platform Mode Card */}
          <button
            onClick={() => setWhiteLabel(false)}
            className={`text-left p-6 rounded-xl border-2 transition-all duration-200 ${
              !isWhiteLabel
                ? "border-emerald-500 bg-emerald-50/50"
                : "border-navy/10 bg-slate-50/50 hover:border-navy/30"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${!isWhiteLabel ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>
              <LayoutGrid className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-navy mb-1">Platform Mode</h3>
            <p className="text-sm text-muted">
              Operate as a multi-host marketplace. A 10% platform fee applies on all revenue.
            </p>
            {!isWhiteLabel && (
              <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <CheckCircle className="w-4 h-4" /> Currently Active
              </div>
            )}
          </button>

          {/* White Label Mode Card */}
          <button
            onClick={() => setWhiteLabel(true)}
            className={`text-left p-6 rounded-xl border-2 transition-all duration-200 ${
              isWhiteLabel
                ? "border-primary bg-primary/5"
                : "border-navy/10 bg-slate-50/50 hover:border-primary/30"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${isWhiteLabel ? "bg-primary text-white" : "bg-slate-200 text-slate-500"}`}>
              <Store className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-navy mb-1">White Label SaaS</h3>
            <p className="text-sm text-muted">
              Deploy as your fully branded booking platform. Zero platform fees — 100% of revenue is yours.
            </p>
            {isWhiteLabel && (
              <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-primary">
                <CheckCircle className="w-4 h-4" /> Currently Active
              </div>
            )}
          </button>
        </div>
      </div>

      {/* ── Section 2: Branding (only meaningful in white-label) ──── */}
      <div className={`bg-white rounded-2xl shadow-soft border overflow-hidden transition-all ${isWhiteLabel ? "border-primary/20" : "border-navy/5 opacity-70"}`}>
        <div className="p-6 border-b border-navy/5 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-navy text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              White Label Branding
            </h2>
            <p className="text-sm text-muted mt-1">
              Customize the application name and owner identity for your branded instance.
            </p>
          </div>
          {!isWhiteLabel && (
            <div className="flex items-center gap-1.5 text-xs text-muted bg-slate-100 px-3 py-1.5 rounded-full">
              <Info className="w-3.5 h-3.5" />Requires White Label mode
            </div>
          )}
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">
              Brand / App Name
            </label>
            <input
              disabled={!isWhiteLabel}
              value={localBrand}
              onChange={(e) => setLocalBrand(e.target.value)}
              placeholder="The Vista"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-navy font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-muted mt-1.5">Appears in the sidebar logo and admin panels.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">
              Owner / Admin Name
            </label>
            <input
              disabled={!isWhiteLabel}
              value={localOwner}
              onChange={(e) => setLocalOwner(e.target.value)}
              placeholder="Concierge"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-navy font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-muted mt-1.5">Shown in the sidebar profile area.</p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={!isWhiteLabel}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-primary text-white hover:opacity-90 active:scale-95"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved!" : "Save Branding"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Section 3: Data Mode ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-soft border border-navy/5 overflow-hidden">
        <div className="p-6 border-b border-navy/5">
          <h2 className="font-bold text-navy text-lg">System Data Mode</h2>
          <p className="text-sm text-muted mt-1">
            Choose between live production data from Supabase and curated demo data for presentations.
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Live DB */}
          <button
            onClick={() => setDemoMode(false)}
            className={`text-left p-6 rounded-xl border-2 transition-all duration-200 ${
              !isDemoMode ? "border-emerald-500 bg-emerald-50/50" : "border-navy/10 bg-slate-50/50 hover:border-navy/30"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${!isDemoMode ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-navy mb-1">Live Database</h3>
            <p className="text-sm text-muted">
              All data is fetched from and written directly to your Supabase instance.
            </p>
            {!isDemoMode && (
              <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <CheckCircle className="w-4 h-4" /> Currently Active
              </div>
            )}
          </button>

          {/* Demo Mode */}
          <button
            onClick={() => setDemoMode(true)}
            className={`text-left p-6 rounded-xl border-2 transition-all duration-200 ${
              isDemoMode ? "border-primary bg-primary/5" : "border-navy/10 bg-slate-50/50 hover:border-primary/30"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${isDemoMode ? "bg-primary text-white" : "bg-slate-200 text-slate-500"}`}>
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-navy mb-1">Presentation Mode</h3>
            <p className="text-sm text-muted">
              Uses curated mock data. Safe for demos and sales presentations. No live writes.
            </p>
            {isDemoMode && (
              <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-primary">
                <CheckCircle className="w-4 h-4" /> Currently Active
              </div>
            )}
          </button>
        </div>
      </div>

      {/* ── Section 4: Quick Links ────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-soft border border-navy/5 p-6">
        <h2 className="font-bold text-navy text-lg mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/admin", label: "Overview", icon: LayoutGrid },
            { href: "/admin/properties", label: "Properties", icon: Building2 },
            { href: "/admin/financials", label: "Financials", icon: Store },
            { href: "/", label: "View Site", icon: Globe },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-navy/10 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <Icon className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
              <span className="text-xs font-bold text-muted group-hover:text-navy transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
