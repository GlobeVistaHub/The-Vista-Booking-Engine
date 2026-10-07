"use client";

import {
  formatClock,
  formatPrice,
  minutesOfDay,
  toDateKey,
  weekdayShort,
  type CalendarBooking,
} from "@/lib/schedule";
import { STATUS_META } from "./statusMeta";
import { StatusChip } from "./StatusChip";

interface AgendaListProps {
  days: Date[];
  bookingsByDay: Record<string, CalendarBooking[]>;
  todayKey: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Phone-first layout: a vertical run sheet grouped by day. */
export function AgendaList({ days, bookingsByDay, todayKey, selectedId, onSelect }: AgendaListProps) {
  return (
    <div className="border border-white/10 bg-[#050505]">
      {days.map((day) => {
        const key = toDateKey(day);
        const items = bookingsByDay[key] ?? [];
        const isToday = key === todayKey;

        return (
          <section key={key} aria-label={key} className="border-b border-white/10 last:border-b-0">
            <header
              className={`flex items-baseline justify-between gap-3 px-4 py-3 ${
                isToday ? "border-l-4 border-l-cyber-orange bg-cyber-orange/[0.07]" : "border-l-4 border-l-transparent"
              }`}
            >
              <h3 className="flex items-baseline gap-2">
                <span className={`font-heading text-2xl font-bold ${isToday ? "text-cyber-orange" : "text-white"}`}>
                  {day.getUTCDate()}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
                  {weekdayShort(day)}
                </span>
              </h3>
              <span className="font-mono text-[11px] uppercase tracking-wider text-white/35">
                {items.length === 0 ? "Open" : `${items.length} job${items.length > 1 ? "s" : ""}`}
              </span>
            </header>

            {items.length > 0 && (
              <ul className="divide-y divide-white/5">
                {items.map((booking, index) => {
                  const meta = STATUS_META[booking.status];
                  return (
                    <li key={booking.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(booking.id)}
                        aria-pressed={booking.id === selectedId}
                        className={`sched-rise flex w-full items-stretch gap-3 border-l-4 px-4 py-3 text-left transition-colors hover:bg-white/[0.04] active:bg-white/[0.08] ${meta.block} ${
                          booking.id === selectedId ? "bg-white/[0.08]" : ""
                        }`}
                        style={{ animationDelay: `${index * 40}ms` }}
                      >
                        <span className="w-16 shrink-0 font-mono text-xs uppercase leading-5 text-white/70">
                          {formatClock(minutesOfDay(booking.start))}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold">{booking.customerName}</span>
                          <span className="block truncate text-xs opacity-70">
                            {booking.service} · {booking.vehicle}
                          </span>
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-1.5">
                          <StatusChip status={booking.status} />
                          <span className="font-mono text-xs opacity-70">{formatPrice(booking.priceCents)}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
