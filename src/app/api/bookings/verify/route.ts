import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

/**
 * GET: Fetches the most recent booking status for a guest.
 * Supports lookup by EMAIL or TRANSACTION ID (Paymob ID).
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const transactionId = searchParams.get("id");

    if (!email && !transactionId) {
      return NextResponse.json({ error: "Email or ID is required" }, { status: 400 });
    }

    let query = supabaseAdmin
      .from("bookings")
      .select("id, booking_reference, status, payment_status, total_price, paid_amount_egp, guest_email");

    if (transactionId) {
      // Prioritize the unique Paymob ID if provided
      query = query.eq("paymob_order_id", transactionId);
    } else if (email) {
      // Fallback to email lookup
      query = query.eq("guest_email", email);
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
 * Maintains the 2s delay and background sync.
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { email, transactionId, status } = payload;

    await new Promise(resolve => setTimeout(resolve, 2000));

    if (transactionId) {
      try {
        await supabaseAdmin
          .from("bookings")
          .update({
            payment_status: status === "success" ? "paid" : "failed",
            status: status === "success" ? "confirmed" : "pending",
            paymob_order_id: transactionId
          })
          .eq("paymob_order_id", transactionId);
      } catch (dbErr) {
        console.error("Database sync error:", dbErr);
      }
    }

    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://webhook.site/bfeaeb6d-fa7d-4162-9548-a1a51fb1506c";

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return NextResponse.json({ success: true, simulated: !response.ok });
    } catch (e) {
      return NextResponse.json({ success: true, simulated: true });
    }

  } catch (error: any) {
    return NextResponse.json({ success: true, error: "Simulation fallback active" });
  }
}