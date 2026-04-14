import { LayoutDashboard, Building2, CalendarDays, DollarSign, Settings } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-v-background flex flex-col md:flex-row">
      {/* 1. The Sidebar (Left - 250px width, hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-[250px] bg-white border-r border-slate-200 shrink-0">
        <div className="p-6">
          <Link href="/admin" className="block text-2xl font-heading font-bold text-navy tracking-tight">
            THE VISTA <span className="text-primary text-lg">HOST</span>
          </Link>
        </div>

        <nav className="flex-grow px-4 py-6 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </Link>
          <Link href="/admin/properties" className="flex items-center gap-3 px-4 py-3 text-muted hover:text-navy hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <Building2 className="w-5 h-5" />
            Properties
          </Link>
          <Link href="/admin/bookings" className="flex items-center gap-3 px-4 py-3 text-muted hover:text-navy hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <CalendarDays className="w-5 h-5" />
            Bookings
          </Link>
          <Link href="/admin/financials" className="flex items-center gap-3 px-4 py-3 text-muted hover:text-navy hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <DollarSign className="w-5 h-5" />
            Financials
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-muted hover:text-navy hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <div className="mt-4 px-4 flex items-center gap-3">
            <UserButton />
            <span className="text-sm font-medium text-navy">Concierge</span>
          </div>
        </div>
      </aside>

      {/* Mobile Nav Header (Visible only on small screens) */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <span className="text-xl font-heading font-bold text-navy">THE VISTA HOST</span>
        <UserButton />
      </div>

      {/* 2. The Main Content Area */}
      <main className="flex-1 w-full p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
