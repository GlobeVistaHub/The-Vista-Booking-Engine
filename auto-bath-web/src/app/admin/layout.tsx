import Link from "next/link";
import { LayoutDashboard, Users, Calendar, Settings, ShieldAlert, Image as ImageIcon, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  async function handleSignOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#050505] border-r border-white/5 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <span className="font-heading font-bold uppercase tracking-widest text-electric-cyan">Auto-Bath OS</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/20">
            <LayoutDashboard size={18} />
            <span className="font-sans text-sm font-medium">CRM Overview</span>
          </Link>
          <Link href="/admin/calendar" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            <Calendar size={18} />
            <span className="font-sans text-sm font-medium">Schedule</span>
          </Link>
          <Link href="/admin/cms" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            <ImageIcon size={18} />
            <span className="font-sans text-sm font-medium">CMS Manager</span>
          </Link>
          <Link href="/admin/simulator" className="flex items-center gap-3 px-4 py-3 rounded-lg text-cyber-orange hover:bg-cyber-orange/10 border border-transparent hover:border-cyber-orange/20 transition-colors mt-8">
            <ShieldAlert size={18} />
            <span className="font-sans text-sm font-medium">Debug & Simulate</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <div className="flex flex-col gap-4 px-2 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-electric-cyan/20 flex items-center justify-center border border-electric-cyan/30">
                <span className="text-xs font-bold text-electric-cyan">AD</span>
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase">Admin</p>
                <p className="text-[10px] text-white/40 font-mono">System Active</p>
              </div>
            </div>
            <form action={handleSignOut} className="w-full">
              <button type="submit" className="w-full flex items-center justify-center gap-2 text-white/50 hover:text-[#df1b41] transition-colors p-3 rounded-lg hover:bg-[#df1b41]/10 border border-transparent hover:border-[#df1b41]/20 font-bold text-sm bg-white/5">
                <LogOut size={16} />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
