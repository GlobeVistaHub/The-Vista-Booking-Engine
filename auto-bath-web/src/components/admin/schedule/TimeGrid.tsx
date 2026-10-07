"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  dateKeyOf,
  formatClock,
  formatTimeRange,
  gridBounds,
  layoutDay,
  toDateKey,
  weekdayShort,
  type CalendarBooking,
} from "@/lib/schedule";
import { STATUS_META } from "./statusMeta";
import { useBusinessNow } from "./useBusinessNow";

const HOUR_PX = 64;
const GUTTER_PX = 60;

interface TimeGridProps {
  days: Date[];
  bookings: CalendarBooking[];
  todayKey: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TimeGrid({ days, bookings, todayKey, selectedId, onSelect }: TimeGridProps) {
  const now = useBusinessNow();
  const { startHour, endHour } = useMemo(() => gridBounds(bookings), [bookings]);
  const totalHeight = (endHour - startHour) * HOUR_PX;
  const columns = `${GUTTER_PX}px repeat(${days.length}, minmax(0, 1fr))`;
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, index) => startHour + index);

  const positionedByDay = useMemo(() => {
    const grouped = new Map<string, CalendarBooking[]>();
    for (const booking of bookings) {
      const key = dateKeyOf(booking.start);
      grouped.set(key, [...(grouped.get(key) ?? []), booking]);
    }
    return grouped;
  }, [bookings]);

  const isMultiDay = days.length > 1;

  return (
    <div className="border border-white/10 bg-[#050505]">
      <div
        className="sticky top-0 z-20 grid border-b border-white/10 bg-[#050505]"
        style={{ gridTemplateColumns: columns }}
      >
        <div className="border-r border-white/10" />
        {days.map((day) => {
          const key = toDateKey(day);
          const isToday = key === todayKey;
          const header = (
            <>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                {weekdayShort(day)}
              </span>
              <span
                className={`font-heading text-xl font-bold leading-none ${isToday ? "text-cyber-orange" : "text-white"}`}
              >
                {day.getUTCDate()}
              </span>
            </>
          );
          const classes = `flex flex-col items-start gap-1.5 border-r border-white/10 px-3 py-3 last:border-r-0 ${
            isToday ? "border-b-2 border-b-cyber-orange" : ""
          }`;

          return isMultiDay ? (
            <Link
              key={key}
              href={`/admin/calendar?view=day&date=${key}`}
              className={`${classes} transition-colors hover:bg-white/[0.04]`}
              aria-label={`Open ${key}`}
            >
              {header}
            </Link>
          ) : (
            <div key={key} className={classes}>
              {header}
            </div>
          );
        })}
      </div>

      <div className="relative grid" style={{ gridTemplateColumns: columns, height: totalHeight }}>
        <div className="relative border-r border-white/10" aria-hidden="true">
          {hours.map((hour) => (
            <span
              key={hour}
              className="absolute right-2 -translate-y-1/2 font-mono text-[10px] uppercase text-white/35"
              style={{ top: (hour - startHour) * HOUR_PX }}
            >
              {hour === startHour ? "" : formatClock(hour * 60)}
            </span>
          ))}
        </div>

        {days.map((day, dayIndex) => {
          const key = toDateKey(day);
          const positioned = layoutDay(positionedByDay.get(key) ?? []);
          const showNowLine =
            now !== null &&
            now.dateKey === key &&
            now.minutes >= startHour * 60 &&
            now.minutes <= endHour * 60;

          return (
            <div
              key={key}
              className="relative border-r border-white/5 last:border-r-0"
              style={{
                backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: `100% ${HOUR_PX}px`,
              }}
            >
              {positioned.map(({ item, startMin, endMin, lane, lanes }, index) => {
                const meta = STATUS_META[item.status];
                const height = Math.max(((endMin - startMin) / 60) * HOUR_PX - 2, 24);
                const isSelected = item.id === selectedId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item.id)}
                    aria-label={`${item.customerName}, ${item.service}, ${formatTimeRange(item.start, item.durationMinutes)}, ${meta.label}`}
                    aria-pressed={isSelected}
                    className={`sched-rise absolute z-[1] overflow-hidden border-l-4 px-2 py-1 text-left transition-transform duration-150 hover:z-10 hover:-translate-y-px hover:shadow-[3px_3px_0_0_rgba(0,0,0,0.7)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white ${meta.block} ${
                      isSelected ? "z-10 outline-2 outline-white" : ""
                    }`}
                    style={{
                      top: ((startMin - startHour * 60) / 60) * HOUR_PX + 1,
                      height,
                      left: `calc(${(lane / lanes) * 100}% + 2px)`,
                      width: `calc(${100 / lanes}% - 4px)`,
                      animationDelay: `${(dayIndex * 4 + index) * 35}ms`,
                    }}
                  >
                    <span className="block truncate font-mono text-[10px] uppercase tracking-wider opacity-70">
                      {formatClock(startMin)}
                    </span>
                    <span className="block truncate text-xs font-bold leading-tight">{item.customerName}</span>
                    {height >= 56 && (
                      <span className="block truncate text-[11px] opacity-70">{item.service}</span>
                    )}
                  </button>
                );
              })}

              {showNowLine && now && (
                <div
                  className="pointer-events-none absolute left-0 right-0 z-[5] h-px bg-cyber-orange"
                  style={{ top: ((now.minutes - startHour * 60) / 60) * HOUR_PX }}
                  aria-hidden="true"
                >
                  <span className="absolute -left-1 -top-[3px] h-[7px] w-[7px] bg-cyber-orange" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
