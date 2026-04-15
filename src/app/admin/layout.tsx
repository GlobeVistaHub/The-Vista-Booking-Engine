"use client";

import { LayoutDashboard, Building2, CalendarDays, DollarSign, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useAppModeStore } from "@/store/appModeStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isWhiteLabel, brandName, ownerName } = useAppModeStore();

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Properties", href: "/admin/properties", icon: Building2 },
    { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
    { label: "Financials", href: "/admin/financials", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-v-background flex flex-col md:flex-row">
      {/* 1. The Sidebar (Left - 250px width, hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-[250px] bg-white border-r border-slate-200 shrink-0">
        <div className="p-6">
          <Link href="/admin" className="block text-2xl font-heading font-bold text-navy tracking-tight">
            {isWhiteLabel ? brandName.toUpperCase() : "THE VISTA"} <span className="text-primary text-lg">HOST</span>
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
          <Link 
            href="/admin/settings" 
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
                {isWhiteLabel ? ownerName : "Concierge / Admin"}
              </span>
              <span className="text-[10px] text-muted uppercase tracking-tighter">
                {isWhiteLabel ? "Platform Owner" : "Master Admin"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Nav Header (Visible only on small screens) */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <span className="text-xl font-heading font-bold text-navy">
          {isWhiteLabel ? brandName.toUpperCase() : "THE VISTA HOST"}
        </span>
        <UserButton />
      </div>

      {/* 2. The Main Content Area */}
      <main className="flex-1 w-full p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
