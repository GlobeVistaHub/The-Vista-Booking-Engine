import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Fetch the most recent booking for this email
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("id, status, payment_status, total_price, paid_amount_egp")
      .eq("guest_email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ status: "not_found" });
    }

    return NextResponse.json({
      id: data.id,
      status: data.payment_status, // 'paid', 'pending', or 'failed'
      originalStatus: data.status, // 'confirmed', 'pending'
      total: data.total_price,
      egp: data.paid_amount_egp
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: Manually sync/confirm a booking status (Demo/Localhost Bridge)
 */
export async function POST(req: Request) {
  try {
    const { email, transactionId, status } = await req.json();

    if (!email || !transactionId) {
      return NextResponse.json({ error: "Missing confirmation details" }, { status: 400 });
    }

    // 1. Find the latest pending booking for this email
    const { data: booking, error: findError } = await supabaseAdmin
      .from("bookings")
      .select("id")
      .eq("guest_email", email)
      .eq("payment_status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (findError || !booking) {
      return NextResponse.json({ error: "No pending booking found to sync" }, { status: 404 });
    }

    // 2. Update to PAID status
    const { error: updateError } = await supabaseAdmin
      .from("bookings")
      .update({
        payment_status: status === "success" ? "paid" : "failed",
        status: status === "success" ? "confirmed" : "pending",
        paymob_order_id: transactionId
      })
      .eq("id", booking.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, bookingId: booking.id });

  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
