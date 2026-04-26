import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

/**
 * Auto-cancels pending and interrupted bookings older than 2 hours.
 * Called silently from the profile page on load.
 */
export async function POST() {
  const twoHoursAgo = new Date();
  twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update({ status: "cancelled", payment_status: "failed" })
    .or("status.eq.pending,status.eq.interrupted")
    .lt("created_at", twoHoursAgo.toISOString())
    .select("id");

  if (error) {
    console.error("[Vista-Cleanup] Auto-cancel failed:", error.message);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  if (data && data.length > 0) {
    console.log(`[Vista-Cleanup] Auto-cancelled ${data.length} expired bookings.`);
  }

  return NextResponse.json({ success: true, cancelled: data?.length ?? 0 });
}
