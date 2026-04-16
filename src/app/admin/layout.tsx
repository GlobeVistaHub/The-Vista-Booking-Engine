"use client";

import { 
  LayoutDashboard, 
  Building2, 
  CalendarDays, 
  DollarSign, 
  Settings, 
  Coins,
  LayoutTemplate,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useAppModeStore } from "@/store/appModeStore";
import { useAppStore } from "@/hooks/useAppStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isWhiteLabel = useAppStore(useAppModeStore, (s) => s.isWhiteLabel);
  const brandName = useAppStore(useAppModeStore, (s) => s.brandName) as string;
  const brandLogo = useAppStore(useAppModeStore, (s) => s.brandLogo) as string;
  const ownerName = useAppStore(useAppModeStore, (s) => s.ownerName) as string;
  const exchangeRate = useAppStore(useAppModeStore, (s) => s.exchangeRate) as number || 50.0;

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Properties", href: "/admin/properties", icon: Building2 },
    { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
    { label: "Financials", href: "/admin/financials", icon: DollarSign },
    { label: "Labels manager", href: "/admin/labels", icon: LayoutTemplate },
  ];

  const sidebarContent = (
    <>
      <div className="p-6">
        <Link 
          href="/admin" 
          onClick={() => setIsMobileMenuOpen(false)}
          className="block group"
        >
          {brandLogo ? (
            <img src={brandLogo} alt={brandName} className="h-8 w-auto object-contain max-w-[200px]" />
          ) : (
            <span className="text-2xl font-heading font-bold text-navy tracking-tight">
              {(isWhiteLabel || (brandName && brandName !== "The Vista")) ? brandName?.toUpperCase() : "THE VISTA"} <span className="text-primary text-lg font-body font-normal">HOST</span>
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-grow px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted hover:text-navy hover:bg-slate-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="mb-4 px-4 py-3 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold text-navy uppercase tracking-widest">Vista Rate</span>
          </div>
          <span className="text-xs font-bold text-primary">{exchangeRate} EGP</span>
        </div>

        <Link 
          href="/admin/settings" 
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
            pathname === "/admin/settings"
              ? "bg-primary/10 text-primary"
              : "text-muted hover:text-navy hover:bg-slate-50"
          }`}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <div className="mt-4 px-4 flex items-center gap-3">
          <UserButton />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-navy truncate max-w-[120px]">
              {isWhiteLabel ? ownerName || "Concierge" : "Concierge / Admin"}
            </span>
            <span className="text-[10px] text-muted uppercase tracking-tighter">
              {isWhiteLabel ? "Platform Owner" : "Master Admin"}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-v-background flex flex-col md:flex-row">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[280px] bg-white border-r border-slate-200 shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Navigation Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-navy hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-lg font-heading font-bold text-navy tracking-tight">
            {(isWhiteLabel || (brandName && brandName !== "The Vista")) ? brandName?.toUpperCase() : "THE VISTA"} <span className="text-primary text-sm font-body font-normal">MASTER</span>
          </span>
        </div>
        <UserButton />
      </div>

      {/* 3. Mobile Navigation Drawer (Absolute Overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar */}
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl flex flex-col animate-slide-in-left">
            <div className="p-4 flex justify-end">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-muted hover:text-navy hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* 4. Main Content Area */}
      <main className="flex-1 w-full p-4 md:p-8 overflow-x-hidden min-h-0">
        {children}
      </main>
    </div>
  );
}
