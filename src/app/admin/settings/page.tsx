"use client";

import { useState, useEffect, useRef } from "react";
import { getSiteContent, updateSiteLabel, SiteLabel, getBookings } from "@/data/api";
import { useLanguage } from "@/context/LanguageContext";
import { useAppModeStore, AppModeState } from "@/store/appModeStore";
import { useAppStore } from "@/hooks/useAppStore";
import { useDemoStore } from "@/store/demoStore";
import { 
  Loader2, 
  Plus, 
  Edit3, 
  Trash2, 
  Settings, 
  LayoutGrid, 
  CheckCircle, 
  Store, 
  Globe, 
  Info, 
  Save, 
  Coins, 
  DollarSign, 
  LayoutTemplate, 
  Database, 
  Building2,
  Palette,
  Upload,
  Image,
  FlaskConical,
  Zap,
  AlertCircle
} from "lucide-react";
import Link from "next/link";


export default function SettingsPage() {
  const store = useAppModeStore();
  const brandName = useAppStore(useAppModeStore, (s: AppModeState) => s.brandName) as string;
  const brandLogo = useAppStore(useAppModeStore, (s: AppModeState) => s.brandLogo) as string;
  const ownerName = useAppStore(useAppModeStore, (s: AppModeState) => s.ownerName) as string;
  const isWhiteLabel = useAppStore(useAppModeStore, (s: AppModeState) => s.isWhiteLabel) as boolean;
  const exchangeRate = useAppStore(useAppModeStore, (s: AppModeState) => s.exchangeRate) as number;
  const supportEmail = useAppStore(useAppModeStore, (s: AppModeState) => s.supportEmail) as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDemoMode, setDemoMode } = useDemoStore();
  const [isSimulating, setIsSimulating] = useState(false);

  const [localBrand, setLocalBrand] = useState(brandName);
  const [localOwner, setLocalOwner] = useState(ownerName);
  const [localEmail, setLocalEmail] = useState(supportEmail);
  const [localRate, setLocalRate] = useState(exchangeRate?.toString() || "50.0");
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLocalBrand(brandName);
    setLocalOwner(ownerName);
    setLocalEmail(supportEmail);
    setLocalRate(exchangeRate?.toString() || "50.0");
  }, [brandName, ownerName, supportEmail, exchangeRate]);

  const handleSave = () => {
    store.setBrandName(localBrand || "The Vista");
    store.setOwnerName(localOwner || "Concierge");
    store.setSupportEmail(localEmail || "support@globevistahub.com");
    const rateNum = parseFloat(localRate);
    if (!isNaN(rateNum) && rateNum > 0) {
      store.setExchangeRate(rateNum);
    }

    // Also update site_content in Supabase for backend access
    updateSiteLabel({ 
      key: 'support_email', 
      value_en: localEmail || 'support@globevistahub.com', 
      value_ar: localEmail || 'support@globevistahub.com' 
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const simulateFailure = async () => {
    setIsSimulating(true);
    try {
      // 1. Fetch the most recent booking
      const bookings = await getBookings();
      if (bookings.length === 0) {
        alert("No bookings found to simulate failure on. Please create a booking first.");
        return;
      }
      const target = bookings[0]; // Most recent

      // 2. Inject 'failed' status into the db using the existing supabase client
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'failed', status: 'pending' })
        .eq('id', target.id);

      if (error) throw error;
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Simulation failed:", err);
    } finally {
      setIsSimulating(false);
    }
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
            onClick={() => store.setWhiteLabel(false)}
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
            onClick={() => store.setWhiteLabel(true)}
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

      {/* ── Section 2: Branding & Identity ────────────────────────── */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">
                Brand / App Name
              </label>
              <input
                disabled={!isWhiteLabel}
                value={localBrand || ""}
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
                value={localOwner || ""}
                onChange={(e) => setLocalOwner(e.target.value)}
                placeholder="Concierge"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-navy font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-muted mt-1.5">Shown in the sidebar profile area.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">
                Customer Support Email
              </label>
              <input
                disabled={!isWhiteLabel}
                type="email"
                value={localEmail || ""}
                onChange={(e) => setLocalEmail(e.target.value)}
                placeholder="support@globevistahub.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-navy font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-muted mt-1.5">This email will be used for all automated guest confirmations and recovery alerts.</p>
            </div>
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

        {/* ── Section 2.1: Financial Engine (Vista Rate) ─────────── */}
        <div className="p-6 border-t border-navy/5 bg-primary/[0.02]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-md">
              <h3 className="font-bold text-navy text-sm flex items-center gap-2 mb-1">
                <Coins className="w-4 h-4 text-primary" />
                Vista Financial Engine
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Set your own internal exchange rate to avoid bank conversion surprises for guests. 
                Total prices in USD will be converted to this EGP rate for Paymob transactions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-white border border-navy/10 rounded-xl p-3 px-4 flex items-center gap-3 shadow-sm">
                <span className="text-sm font-bold text-navy">1 USD =</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={localRate}
                    onChange={(e) => setLocalRate(e.target.value)}
                    className="w-24 bg-slate-50 border-none outline-none font-bold text-primary text-lg text-center"
                  />
                  <span className="text-sm font-bold text-navy">EGP</span>
                </div>
              </div>
              
              <button
                onClick={handleSave}
                className={`whitespace-nowrap flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-sm transition-all ${
                  saved
                    ? "bg-emerald-500 text-white"
                    : "bg-navy text-white hover:bg-navy/90 active:scale-95 shadow-lg shadow-navy/10"
                }`}
              >
                {saved ? <CheckCircle className="w-4 h-4" /> : <DollarSign className="w-4 h-4 text-primary" />}
                {saved ? "Saved!" : "Update Rate"}
              </button>
            </div>
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

      {/* ── Section 3.5: Visual Identity (Logo & Colors) ─────────── */}
      <div className={`bg-white rounded-2xl shadow-soft border overflow-hidden transition-all ${isWhiteLabel ? "border-primary/20" : "border-navy/5 opacity-70"}`}>
        <div className="p-6 border-b border-navy/5">
          <h2 className="font-bold text-navy text-lg flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Visual Identity
          </h2>
          <p className="text-sm text-muted mt-1">
            Upload your brand logo and set a signature color. We'll automatically generate matching shadows and accents.
          </p>
        </div>

        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo Upload Tool */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-4">
                Brand Logo (Upload)
              </label>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-dashed border-navy/10 flex items-center justify-center overflow-hidden shrink-0 group relative">
                  {store.brandLogo ? (
                    <img src={store.brandLogo} alt="Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <Image className="w-8 h-8 text-navy/20" />
                  )}
                  {isWhiteLabel && (
                    <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Upload className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    disabled={!isWhiteLabel}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 2000000) {
                          alert("Logo is too large. Please use an image under 2MB.");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          store.setBrandLogo(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!isWhiteLabel}
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-xl text-xs font-bold cursor-pointer transition-all hover:bg-navy/90 active:scale-95 ${!isWhiteLabel && 'opacity-40 cursor-not-allowed'}`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Logo
                  </button>
                  {brandLogo && (
                    <button
                      onClick={() => store.setBrandLogo('')}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100"
                      title="Remove Logo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <p className="text-[10px] text-muted leading-tight">Recommended: PNG or SVG with transparent background.</p>
                </div>
              </div>
            </div>

            {/* Brand Color Master */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-4">
                Core Brand Color
              </label>
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full shadow-lg border-4 border-white overflow-hidden shrink-0"
                  style={{ backgroundColor: store.brandColor }}
                />
                <div className="flex-1">
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus-within:border-primary transition-all">
                    <input
                      type="color"
                      disabled={!isWhiteLabel}
                      value={store.brandColor}
                      onChange={(e) => store.setBrandColor(e.target.value)}
                      className="w-8 h-8 bg-transparent border-none cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      disabled={!isWhiteLabel}
                      value={store.brandColor.toUpperCase()}
                      onChange={(e) => store.setBrandColor(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-sm font-mono font-bold text-navy ml-3 uppercase"
                    />
                  </div>
                  <p className="text-[10px] text-muted mt-2">Pick a color. We'll derive RGB and Shadows from this Hex value.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-navy/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg animate-pulse" 
                style={{ 
                  backgroundColor: store.brandColor,
                  boxShadow: `0 0 15px ${store.brandColor}44`
                }} 
              />
              <span className="text-[10px] text-muted font-bold uppercase tracking-widest">Active Brand Glow Simulation</span>
            </div>
            <button
              onClick={() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2500);
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              Test Visual Sync
            </button>
          </div>
        </div>
      </div>

      {/* ── Section 4: Funnel Testing Lab ─────────────────────────── */}
      <div className="bg-rose-50/50 border border-rose-100 rounded-2xl overflow-hidden group">
        <div className="p-6 border-b border-rose-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-navy text-lg flex items-center gap-2 text-rose-600">
              <FlaskConical className="w-5 h-5" />
              Funnel Testing Lab
            </h2>
            <p className="text-sm text-navy/60 mt-1">
              Test your 'Intelligence & Retention' workflows. These tools simulate high-friction guest scenarios.
            </p>
          </div>
          <Zap className="w-5 h-5 text-rose-300 group-hover:text-rose-500 transition-colors" />
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-md">
              <h3 className="font-bold text-navy text-sm flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                Simulate Payment Interruption
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                This will find the most recent booking and move it to <strong>'Payment Failed'</strong>. 
                Use this to see the Real-Time Rose Banner appear on the dashboard and trigger your n8n recovery flows.
              </p>
            </div>

            <button
              onClick={simulateFailure}
              disabled={isSimulating}
              className="flex items-center gap-2 px-6 py-4 bg-rose-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-200 hover:bg-rose-600 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSimulating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {isSimulating ? "Injecting..." : "Simulate Failure"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Section 5: Quick Links ────────────────────────────────── */}
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
