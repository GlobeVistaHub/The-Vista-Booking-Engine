import { LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  async function handleSignOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#020202] text-white md:flex-row">
      {/* Phone: compact top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505] md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <span className="font-heading text-sm font-bold uppercase tracking-widest text-electric-cyan">Auto-Bath OS</span>
          <form action={handleSignOut}>
            <button
              type="submit"
              aria-label="Sign out"
              className="flex items-center gap-2 border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-white/60 transition-colors hover:border-[#df1b41]/40 hover:text-[#df1b41]"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </form>
        </div>
        <AdminNav variant="bar" />
      </header>

      {/* Desktop: sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-[#050505] md:sticky md:top-0 md:flex md:h-screen">
        <div className="flex h-20 items-center border-b border-white/5 px-6">
          <span className="font-heading font-bold uppercase tracking-widest text-electric-cyan">Auto-Bath OS</span>
        </div>

        <AdminNav variant="sidebar" />

        <div className="border-t border-white/5 p-4">
          <div className="flex flex-col gap-4 px-2 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-electric-cyan/30 bg-electric-cyan/20">
                <span className="text-xs font-bold text-electric-cyan">AD</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-white">Admin</p>
                <p className="font-mono text-[10px] text-white/40">System Active</p>
              </div>
            </div>
            <form action={handleSignOut} className="w-full">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-white/5 p-3 text-sm font-bold text-white/50 transition-colors hover:border-[#df1b41]/20 hover:bg-[#df1b41]/10 hover:text-[#df1b41]"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="min-w-0 flex-1 md:overflow-y-auto">{children}</main>
    </div>
  );
}
