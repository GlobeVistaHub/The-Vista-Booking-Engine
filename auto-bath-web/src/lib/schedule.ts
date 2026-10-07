/**
 * Scheduling helpers for the admin calendar.
 *
 * IMPORTANT: bookings.scheduled_time stores the customer's chosen Melbourne
 * wall-clock time *as if it were UTC* (see createBookingAction). Every
 * `Date` in this module that represents a booking therefore uses UTC getters
 * to read wall-clock fields. Use `wallClockToInstant` to convert to a real
 * point in time (refund windows, "has ended" checks).
 */

export type ScheduleView = "day" | "week" | "month";
export const SCHEDULE_VIEWS: ScheduleView[] = ["day", "week", "month"];

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

export const BUSINESS_TZ = "Australia/Melbourne";
export const REFUND_WINDOW_HOURS = 48;
const MIN_BLOCK_MINUTES = 30;
const DAY_MS = 86_400_000;

export interface CalendarBooking {
  id: string;
  /** Wall-clock ISO string (UTC-suffixed, see module note). */
  start: string;
  durationMinutes: number;
  status: BookingStatus;
  customerName: string;
  customerPhone: string | null;
  vehicle: string;
  service: string;
  priceCents: number;
  notes: string | null;
  paymentRef: string | null;
  refundEligible: boolean;
  hasEnded: boolean;
}

// ---------- Date keys & arithmetic (all UTC-midnight based) ----------

export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function parseDateKey(key: string | null | undefined): Date | null {
  if (!key || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return null;
  const date = new Date(`${key}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || toDateKey(date) !== key ? null : date;
}

export function parseView(value: string | null | undefined): ScheduleView {
  return SCHEDULE_VIEWS.find((view) => view === value) ?? "week";
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

/** Monday-based week start. */
export function startOfWeek(date: Date): Date {
  const offsetFromMonday = (date.getUTCDay() + 6) % 7;
  return addDays(date, -offsetFromMonday);
}

export function startOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function addMonths(date: Date, months: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
}

export interface ScheduleRange {
  start: Date;
  endExclusive: Date;
  days: Date[];
}

export function getRange(view: ScheduleView, anchor: Date): ScheduleRange {
  let start: Date;
  let dayCount: number;

  if (view === "day") {
    start = anchor;
    dayCount = 1;
  } else if (view === "week") {
    start = startOfWeek(anchor);
    dayCount = 7;
  } else {
    const first = startOfMonth(anchor);
    const last = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() + 1, 0));
    start = startOfWeek(first);
    const span = Math.round((last.getTime() - start.getTime()) / DAY_MS) + 1;
    dayCount = Math.ceil(span / 7) * 7;
  }

  return {
    start,
    endExclusive: addDays(start, dayCount),
    days: Array.from({ length: dayCount }, (_, index) => addDays(start, index)),
  };
}

export function shiftAnchor(view: ScheduleView, anchor: Date, direction: 1 | -1): Date {
  if (view === "day") return addDays(anchor, direction);
  if (view === "week") return addDays(anchor, direction * 7);
  return addMonths(anchor, direction);
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const WEEKDAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function weekdayShort(date: Date): string {
  return WEEKDAYS_SHORT[(date.getUTCDay() + 6) % 7];
}

export function formatRangeLabel(view: ScheduleView, anchor: Date): string {
  const day = (date: Date) => date.getUTCDate();
  const monthShort = (date: Date) => MONTHS_SHORT[date.getUTCMonth()];

  if (view === "day") {
    return `${weekdayShort(anchor)} ${day(anchor)} ${monthShort(anchor)} ${anchor.getUTCFullYear()}`;
  }
  if (view === "month") {
    return `${MONTHS_LONG[anchor.getUTCMonth()]} ${anchor.getUTCFullYear()}`;
  }

  const start = startOfWeek(anchor);
  const end = addDays(start, 6);
  const startLabel =
    start.getUTCMonth() === end.getUTCMonth() ? `${day(start)}` : `${day(start)} ${monthShort(start)}`;
  return `${startLabel} – ${day(end)} ${monthShort(end)} ${end.getUTCFullYear()}`;
}


// ---------- Wall-clock formatting ----------

export function minutesOfDay(wallIso: string): number {
  const date = new Date(wallIso);
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}

export function dateKeyOf(wallIso: string): string {
  return toDateKey(new Date(wallIso));
}

export function formatClock(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function formatTimeRange(wallIso: string, durationMinutes: number): string {
  const start = minutesOfDay(wallIso);
  return `${formatClock(start)} – ${formatClock(start + durationMinutes)}`;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-AU", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

// ---------- Timezone conversion ----------

function tzOffsetMs(utcMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const field = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(field("year"), field("month") - 1, field("day"), field("hour"), field("minute"), field("second"));
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/** Converts a stored wall-clock timestamp into the real instant it refers to. */
export function wallClockToInstant(wallIso: string, timeZone: string = BUSINESS_TZ): Date {
  const wallMs = new Date(wallIso).getTime();
  const firstGuess = wallMs - tzOffsetMs(wallMs, timeZone);
  return new Date(wallMs - tzOffsetMs(firstGuess, timeZone));
}

export interface BusinessNow {
  dateKey: string;
  minutes: number;
}

/** Current business-timezone date + minute-of-day. */
export function businessNow(nowMs: number = Date.now(), timeZone: string = BUSINESS_TZ): BusinessNow {
  const wall = new Date(nowMs + tzOffsetMs(nowMs, timeZone));
  return { dateKey: toDateKey(wall), minutes: wall.getUTCHours() * 60 + wall.getUTCMinutes() };
}

export function refundEligibility(wallIso: string, nowMs: number = Date.now()) {
  const hoursUntil = (wallClockToInstant(wallIso).getTime() - nowMs) / 3_600_000;
  return { eligible: hoursUntil >= REFUND_WINDOW_HOURS, hoursUntil };
}

export function hasEnded(wallIso: string, durationMinutes: number, nowMs: number = Date.now()): boolean {
  return wallClockToInstant(wallIso).getTime() + durationMinutes * 60_000 <= nowMs;
}

// ---------- Day layout (time grid) ----------

export interface PositionedBooking<T> {
  item: T;
  startMin: number;
  endMin: number;
  lane: number;
  lanes: number;
}

/** Packs overlapping bookings into side-by-side lanes. */
export function layoutDay<T extends { start: string; durationMinutes: number }>(items: T[]): PositionedBooking<T>[] {
  const sorted = items
    .map((item) => {
      const startMin = minutesOfDay(item.start);
      return { item, startMin, endMin: startMin + Math.max(item.durationMinutes, MIN_BLOCK_MINUTES) };
    })
    .sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

  const result: PositionedBooking<T>[] = [];
  let cluster: Omit<PositionedBooking<T>, "lanes">[] = [];
  let laneEnds: number[] = [];
  let clusterEnd = -1;

  const flush = () => {
    const lanes = laneEnds.length;
    cluster.forEach((entry) => result.push({ ...entry, lanes }));
    cluster = [];
    laneEnds = [];
    clusterEnd = -1;
  };

  for (const entry of sorted) {
    if (cluster.length > 0 && entry.startMin >= clusterEnd) flush();

    let lane = laneEnds.findIndex((end) => end <= entry.startMin);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(entry.endMin);
    } else {
      laneEnds[lane] = entry.endMin;
    }

    cluster.push({ ...entry, lane });
    clusterEnd = Math.max(clusterEnd, entry.endMin);
  }
  flush();

  return result;
}

/** Visible hour window: at least 8am–6pm, widened to fit every booking. */
export function gridBounds(items: { start: string; durationMinutes: number }[]) {
  let startHour = 8;
  let endHour = 18;
  for (const { start, durationMinutes } of items) {
    const startMin = minutesOfDay(start);
    startHour = Math.min(startHour, Math.floor(startMin / 60));
    endHour = Math.max(endHour, Math.ceil((startMin + Math.max(durationMinutes, MIN_BLOCK_MINUTES)) / 60));
  }
  return { startHour, endHour: Math.min(endHour, 24) };
}
