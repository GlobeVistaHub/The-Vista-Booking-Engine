import Link from "next/link";
import {
  formatClock,
  minutesOfDay,
  toDateKey,
  WEEKDAYS_SHORT,
  type CalendarBooking,
} from "@/lib/schedule";
import { STATUS_META } from "./statusMeta";

interface MonthGridProps {
  days: Date[];
  anchor: Date;
  bookingsByDay: Record<string, CalendarBooking[]>;
  todayKey: string;
}

const MAX_CHIPS = 3;
const MAX_DOTS = 5;

/** Month overview. Each cell links through to that day. */
export function MonthGrid({ days, anchor, bookingsByDay, todayKey }: MonthGridProps) {
  return (
    <div className="border border-white/10 bg-[#050505]">
      <div className="grid grid-cols-7 border-b border-white/10">
        {WEEKDAYS_SHORT.map((label) => (
          <div
            key={label}
            className="border-r border-white/10 px-2 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 last:border-r-0 md:px-3"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const key = toDateKey(day);
          const items = bookingsByDay[key] ?? [];
          const inMonth = day.getUTCMonth() === anchor.getUTCMonth();
          const isToday = key === todayKey;
          const overflow = items.length - MAX_CHIPS;

          return (
            <Link
              key={key}
              href={`/admin/calendar?view=day&date=${key}`}
              aria-label={`${key}, ${items.length} booking${items.length === 1 ? "" : "s"}`}
              className={`sched-rise flex min-h-[76px] flex-col gap-1.5 border-b border-r border-white/5 p-1.5 transition-colors hover:bg-white/[0.05] md:min-h-[116px] md:p-2 [&:nth-child(7n)]:border-r-0 ${
                inMonth ? "" : "bg-white/[0.015] opacity-40"
              } ${isToday ? "outline-2 -outline-offset-2 outline-cyber-orange" : ""}`}
              style={{ animationDelay: `${Math.min(index, 20) * 18}ms` }}
            >
              <span
                className={`font-heading text-sm font-bold leading-none md:text-base ${
                  isToday ? "text-cyber-orange" : "text-white/80"
                }`}
              >
                {day.getUTCDate()}
              </span>

              {/* Phone: status markers only */}
              <span className="flex flex-wrap gap-1 md:hidden" aria-hidden="true">
                {items.slice(0, MAX_DOTS).map((booking) => (
                  <span key={booking.id} className={`h-2 w-2 ${STATUS_META[booking.status].swatch}`} />
                ))}
                {items.length > MAX_DOTS && (
                  <span className="font-mono text-[9px] text-white/50">+{items.length - MAX_DOTS}</span>
                )}
              </span>

              {/* Desktop: time + name chips */}
              <span className="hidden flex-col gap-1 md:flex">
                {items.slice(0, MAX_CHIPS).map((booking) => (
                  <span
                    key={booking.id}
                    className={`flex items-center gap-1.5 truncate border-l-2 px-1.5 py-0.5 text-[11px] leading-tight ${STATUS_META[booking.status].block}`}
                  >
                    <span className="font-mono text-[10px] opacity-70">
                      {formatClock(minutesOfDay(booking.start)).replace(":00", "")}
                    </span>
                    <span className="truncate font-semibold">{booking.customerName}</span>
                  </span>
                ))}
                {overflow > 0 && (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/45">
                    +{overflow} more
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
