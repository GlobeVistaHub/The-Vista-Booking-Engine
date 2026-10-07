"use client";

import { useCallback, useMemo, useState } from "react";
import {
  dateKeyOf,
  formatPrice,
  parseDateKey,
  type CalendarBooking,
  type ScheduleView,
} from "@/lib/schedule";
import { AgendaList } from "./AgendaList";
import { BookingDrawer } from "./BookingDrawer";
import { MonthGrid } from "./MonthGrid";
import { STATUS_META } from "./statusMeta";
import { TimeGrid } from "./TimeGrid";

interface ScheduleBoardProps {
  view: ScheduleView;
  anchorKey: string;
  dayKeys: string[];
  todayKey: string;
  bookings: CalendarBooking[];
}

const LEGEND = ["confirmed", "pending", "completed", "no_show", "cancelled"] as const;

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex-1 border-r border-white/10 px-4 py-3 last:border-r-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">{label}</p>
      <p className="mt-1 font-heading text-lg font-bold text-white md:text-2xl">{value}</p>
    </div>
  );
}

export function ScheduleBoard({ view, anchorKey, dayKeys, todayKey, bookings }: ScheduleBoardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCancelled, setShowCancelled] = useState(false);

  const days = useMemo(() => dayKeys.map((key) => parseDateKey(key) ?? new Date(key)), [dayKeys]);
  const anchor = useMemo(() => parseDateKey(anchorKey) ?? new Date(), [anchorKey]);

  const visible = useMemo(
    () =>
      bookings
        .filter((booking) => showCancelled || booking.status !== "cancelled")
        .sort((a, b) => a.start.localeCompare(b.start)),
    [bookings, showCancelled]
  );

  const bookingsByDay = useMemo(() => {
    const grouped: Record<string, CalendarBooking[]> = {};
    for (const booking of visible) {
      const key = dateKeyOf(booking.start);
      (grouped[key] ??= []).push(booking);
    }
    return grouped;
  }, [visible]);

  const stats = useMemo(() => {
    const count = (status: CalendarBooking["status"]) => bookings.filter((b) => b.status === status).length;
    const value = bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + b.priceCents, 0);
    return {
      confirmed: count("confirmed"),
      pending: count("pending"),
      cancelled: count("cancelled"),
      value,
    };
  }, [bookings]);

  const selected = bookings.find((booking) => booking.id === selectedId) ?? null;
  const closeDrawer = useCallback(() => setSelectedId(null), []);

  return (
    <div className="space-y-4">
      <div className="flex border border-white/10 bg-[#0A0A0A]">
        <Stat label="Confirmed" value={stats.confirmed} />
        <Stat label="Awaiting pay" value={stats.pending} />
        <Stat label="Booked value" value={formatPrice(stats.value)} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Status legend">
          {LEGEND.map((status) => (
            <li
              key={status}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45"
            >
              <span className={`h-2 w-2 ${STATUS_META[status].swatch}`} aria-hidden="true" />
              {STATUS_META[status].label}
            </li>
          ))}
        </ul>

        <label className="flex cursor-pointer items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white">
          <input
            type="checkbox"
            checked={showCancelled}
            onChange={(event) => setShowCancelled(event.target.checked)}
            className="h-4 w-4 accent-[#FF6600]"
          />
          Show cancelled ({stats.cancelled})
        </label>
      </div>

      {view === "month" ? (
        <MonthGrid days={days} anchor={anchor} bookingsByDay={bookingsByDay} todayKey={todayKey} />
      ) : (
        <>
          <div className="hidden md:block">
            <TimeGrid
              days={days}
              bookings={visible}
              todayKey={todayKey}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
          <div className="md:hidden">
            <AgendaList
              days={days}
              bookingsByDay={bookingsByDay}
              todayKey={todayKey}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </>
      )}

      {visible.length === 0 && (
        <p className="border border-dashed border-white/15 px-4 py-6 text-center text-sm text-white/40">
          Nothing booked in this {view === "month" ? "month" : view}. The schedule is wide open.
        </p>
      )}

      {selected && <BookingDrawer key={selected.id} booking={selected} onClose={closeDrawer} />}
    </div>
  );
}
