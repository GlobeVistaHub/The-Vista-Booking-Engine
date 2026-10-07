import type { Metadata } from "next";
import { createAdminClient } from "@/utils/supabase/admin";
import { getAdminUser } from "@/utils/admin-auth";
import {
  businessNow,
  getRange,
  hasEnded,
  parseDateKey,
  parseView,
  refundEligibility,
  toDateKey,
  type BookingStatus,
  type CalendarBooking,
} from "@/lib/schedule";
import { ScheduleBoard } from "@/components/admin/schedule/ScheduleBoard";
import { ScheduleToolbar } from "@/components/admin/schedule/ScheduleToolbar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Schedule | Auto-Bath OS",
  description: "Day, week and month view of every booking, with complete, no-show and cancel actions.",
};

interface BookingRow {
  id: string;
  scheduled_time: string;
  status: BookingStatus;
  vehicle_make: string | null;
  notes: string | null;
  stripe_payment_intent_id: string | null;
  services: { name: string; base_price: number; duration_minutes: number } | null;
  profiles: { full_name: string | null; phone_number: string | null } | null;
}

const DEFAULT_DURATION_MINUTES = 60;
const MAX_ROWS = 500;

function Message({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-xl border-l-4 border-l-cyber-orange bg-[#0A0A0A] p-6">
        <h1 className="font-heading text-lg font-bold uppercase tracking-widest text-white">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{children}</p>
      </div>
    </div>
  );
}

export default async function SchedulePage(props: {
  searchParams: Promise<{ view?: string; date?: string }>;
}) {
  if (!(await getAdminUser())) {
    return (
      <Message title="Admin access required">
        This account does not have the admin role yet. Run the latest Supabase migration, then sign in again.
      </Message>
    );
  }

  const params = await props.searchParams;
  const view = parseView(params.view);
  const todayKey = businessNow().dateKey;
  const anchor = parseDateKey(params.date) ?? parseDateKey(todayKey)!;
  const range = getRange(view, anchor);

  const { data, error } = await createAdminClient()
    .from("bookings")
    .select(
      `id, scheduled_time, status, vehicle_make, notes, stripe_payment_intent_id,
       services ( name, base_price, duration_minutes ),
       profiles ( full_name, phone_number )`
    )
    .gte("scheduled_time", range.start.toISOString())
    .lt("scheduled_time", range.endExclusive.toISOString())
    .order("scheduled_time", { ascending: true })
    .limit(MAX_ROWS);

  if (error) {
    console.error("Error fetching schedule:", error);
    return <Message title="Could not load the schedule">Please refresh. If it keeps happening, check the Sentry feed.</Message>;
  }

  const nowMs = Date.now();
  const bookings: CalendarBooking[] = (data as unknown as BookingRow[]).map((row) => {
    const durationMinutes = row.services?.duration_minutes ?? DEFAULT_DURATION_MINUTES;
    return {
      id: row.id,
      start: row.scheduled_time,
      durationMinutes,
      status: row.status,
      customerName: row.profiles?.full_name || "Unknown customer",
      customerPhone: row.profiles?.phone_number ?? null,
      vehicle: row.vehicle_make ?? "",
      service: row.services?.name ?? "Unknown service",
      priceCents: row.services?.base_price ?? 0,
      notes: row.notes,
      paymentRef: row.stripe_payment_intent_id,
      refundEligible: refundEligibility(row.scheduled_time, nowMs).eligible,
      hasEnded: hasEnded(row.scheduled_time, durationMinutes, nowMs),
    };
  });

  return (
    <div className="p-4 md:p-8">
      <ScheduleToolbar view={view} anchor={anchor} todayKey={todayKey} />
      <ScheduleBoard
        key={`${view}-${toDateKey(anchor)}`}
        view={view}
        anchorKey={toDateKey(anchor)}
        dayKeys={range.days.map(toDateKey)}
        todayKey={todayKey}
        bookings={bookings}
      />
    </div>
  );
}
