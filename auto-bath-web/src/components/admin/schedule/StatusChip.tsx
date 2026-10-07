import { STATUS_META } from "./statusMeta";
import type { BookingStatus } from "@/lib/schedule";

export function StatusChip({ status }: { status: BookingStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${meta.chip}`}
    >
      <span className={`h-1.5 w-1.5 ${meta.swatch}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
