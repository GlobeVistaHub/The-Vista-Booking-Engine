import type { BookingStatus } from "@/lib/schedule";

interface StatusMeta {
  label: string;
  /** Calendar block styling (background + left bar). */
  block: string;
  /** Solid swatch used for legends and month-view markers. */
  swatch: string;
  /** Small label chip. */
  chip: string;
}

export const STATUS_META: Record<BookingStatus, StatusMeta> = {
  confirmed: {
    label: "Confirmed",
    block: "border-l-electric-cyan bg-electric-cyan/15 text-white",
    swatch: "bg-electric-cyan",
    chip: "border-electric-cyan/50 text-electric-cyan",
  },
  pending: {
    label: "Awaiting payment",
    block:
      "border-l-liquid-silver border border-dashed border-liquid-silver/50 text-white/70 bg-[repeating-linear-gradient(135deg,rgba(138,143,152,0.16)_0_6px,transparent_6px_12px)]",
    swatch: "bg-liquid-silver",
    chip: "border-liquid-silver/50 text-liquid-silver",
  },
  completed: {
    label: "Completed",
    block: "border-l-[#25D366] bg-[#25D366]/10 text-white/80",
    swatch: "bg-[#25D366]",
    chip: "border-[#25D366]/50 text-[#25D366]",
  },
  no_show: {
    label: "No-show",
    block: "border-l-cyber-orange bg-cyber-orange/15 text-white/80",
    swatch: "bg-cyber-orange",
    chip: "border-cyber-orange/60 text-cyber-orange",
  },
  cancelled: {
    label: "Cancelled",
    block: "border-l-white/20 bg-white/[0.03] text-white/35 line-through",
    swatch: "bg-white/25",
    chip: "border-white/20 text-white/40",
  },
};
