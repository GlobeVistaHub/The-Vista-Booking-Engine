"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Image as ImageIcon, LayoutDashboard, ShieldAlert, FileText } from "lucide-react";

const ITEMS = [
  { href: "/admin", label: "CRM Overview", short: "CRM", icon: LayoutDashboard, exact: true },
  { href: "/admin/calendar", label: "Schedule", short: "Schedule", icon: Calendar },
  { href: "/admin/cms", label: "CMS Manager", short: "CMS", icon: ImageIcon },
  { href: "/admin/insights", label: "Insights Editor", short: "Insights", icon: FileText },
  { href: "/admin/simulator", label: "Debug & Simulate", short: "Debug", icon: ShieldAlert, danger: true },
] as const;

type Item = (typeof ITEMS)[number];

function isActive(pathname: string, item: Item) {
  return "exact" in item && item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

export function AdminNav({ variant }: { variant: "sidebar" | "bar" }) {
  const pathname = usePathname();

  if (variant === "bar") {
    return (
      <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-2 pb-2">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                active
                  ? "border-b-cyber-orange text-white"
                  : `border-b-transparent ${"danger" in item ? "text-cyber-orange/70" : "text-white/50"} hover:text-white`
              }`}
            >
              <Icon size={15} />
              {item.short}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Admin" className="flex-1 space-y-2 p-4">
      {ITEMS.map((item) => {
        const active = isActive(pathname, item);
        const Icon = item.icon;
        const danger = "danger" in item;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${danger ? "mt-8" : ""} ${
              active
                ? "border-electric-cyan/20 bg-electric-cyan/10 text-electric-cyan"
                : danger
                  ? "border-transparent text-cyber-orange hover:border-cyber-orange/20 hover:bg-cyber-orange/10"
                  : "border-transparent text-white/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon size={18} />
            <span className="font-sans text-sm font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
