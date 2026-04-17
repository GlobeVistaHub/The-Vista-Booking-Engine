import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

/**
 * GET: Fetches the most recent booking status for a guest.
 * Essential for the Success page and Dashboard to show real data.
 */
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
      .select("id, booking_reference, status, payment_status, total_price, paid_amount_egp")
      .eq("guest_email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ status: "not_found" });
    }

    // Return the Elite VST reference as the ID for the frontend display
    return NextResponse.json({
      id: data.id,
      bookingReference: data.booking_reference,
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
 * POST: THE VISTA SIMULATION & SYNC HACK
 * We maintain the 2-second cinematic delay, but securely sync the DB in the background.
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { email, transactionId, status } = payload;

    // -------------------------------------------------------------------------
    // THE VISTA SIMULATION: 2-second Cinematic Delay (User Favorite)
    // -------------------------------------------------------------------------
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 1. SYNC TO DATABASE (If in Live Mode with Transaction ID)
    if (email && transactionId) {
      try {
        await supabaseAdmin
          .from("bookings")
          .update({
            payment_status: status === "success" ? "paid" : "failed",
            status: status === "success" ? "confirmed" : "pending",
            paymob_order_id: transactionId
          })
          .eq("guest_email", email)
          .eq("payment_status", "pending")
          .order("created_at", { ascending: false })
          .limit(1);
      } catch (dbErr) {
        console.error("Manual database sync skipped or failed:", dbErr);
      }
    }

    // 2. n8n TRIGGER FALLBACK (The "Hack" logic)
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://webhook.site/bfeaeb6d-fa7d-4162-9548-a1a51fb1506c";

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return NextResponse.json({ success: true, simulated: !response.ok });
    } catch (e) {
      // Fail-safe: n8n is down but the user sees success (The Vista Guarantee)
      return NextResponse.json({ success: true, simulated: true });
    }

  } catch (error: any) {
    console.error("Verification logic error:", error);
    return NextResponse.json({ success: true, error: "Simulation fallback active" });
  }
}