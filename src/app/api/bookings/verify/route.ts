import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

/**
 * GET: Fetches the most recent booking status for a guest.
 * Supports lookup by EMAIL, INTERNAL ID, or TRANSACTION ID.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const transactionId = searchParams.get("id");
    const vistaId = searchParams.get("vista_id");

    if (!email && !transactionId && !vistaId) {
      return NextResponse.json({ error: "Identification lookup required" }, { status: 400 });
    }

    let query = supabaseAdmin
      .from("bookings")
      .select("id, booking_reference, status, payment_status, total_price, paid_amount_egp, guest_email");

    if (vistaId) {
      // THE GOLDEN KEY: Our internal ID
      query = query.eq("id", vistaId);
    } else if (transactionId) {
      // AGGRESSIVE SCAN: Search both transaction and order IDs from Paymob, and even our ID
      query = query.or(`paymob_transaction_id.eq.${transactionId},paymob_order_id.eq.${transactionId},id.eq.${transactionId}`);
    } else if (email && email !== "null") {
      // Fallback to email lookup
      query = query.eq("guest_email", email);
    } else {
      return NextResponse.json({ status: "not_found", message: "No identifying tokens provided" });
    }

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ status: "not_found" });
    }

    return NextResponse.json({
      id: data.id,
      bookingReference: data.booking_reference,
      status: data.payment_status,
      originalStatus: data.status,
      total: data.total_price,
      egp: data.paid_amount_egp,
      email: data.guest_email
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: THE VISTA SIMULATION & SYNC HACK
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { transactionId, status } = payload;

    await new Promise(resolve => setTimeout(resolve, 2000));

    if (transactionId) {
      await supabaseAdmin
        .from("bookings")
        .update({
          payment_status: status === "success" ? "paid" : "failed",
          status: status === "success" ? "confirmed" : "pending",
        })
        .or(`paymob_transaction_id.eq.${transactionId},paymob_order_id.eq.${transactionId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: true, error: "Simulation fallback" });
  }
}