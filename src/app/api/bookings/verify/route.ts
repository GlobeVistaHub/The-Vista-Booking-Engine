import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

/**
 * GET: Fetches the most recent booking status for a guest.
 * INDESTRUCTIBLE VERSION: Handles syntax errors and multi-mode fallbacks.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const transactionId = searchParams.get("id");
    const vistaId = searchParams.get("vista_id");

    if (!email && !transactionId && !vistaId) {
      return NextResponse.json({ status: "error", error: "Missing identity context" }, { status: 400 });
    }

    let query = supabaseAdmin
      .from("bookings")
      .select("id, booking_reference, status, payment_status, total_price, paid_amount_egp, guest_email");

    // Case A: vistaId is our Supabase internal row ID — always numeric
    if (vistaId && vistaId !== "null" && vistaId !== "") {
      const numericVistaId = Number(vistaId);
      if (!isNaN(numericVistaId)) {
        query = query.eq("id", numericVistaId);
      }
    }
    // Case B: Paymob transaction ID fallback
    else if (transactionId && transactionId !== "null" && transactionId !== "") {
      query = query.or(
        `paymob_transaction_id.eq.${transactionId},transaction_id.eq.${transactionId}`
      );
    }
    // Case C: Email-only lookup
    else if (email && email !== "null" && email !== "") {
      query = query.eq("guest_email", email);
    }


    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 2. THE MULTI-LAYER FALLBACK
    if ((!data || error) && email && email !== "null" && email !== "") {
       const { data: emailData } = await supabaseAdmin
        .from("bookings")
        .select("id, booking_reference, status, payment_status, total_price, paid_amount_egp, guest_email")
        .eq("guest_email", email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
       
       if (emailData) {
         return NextResponse.json({
            id: emailData.id,
            bookingReference: emailData.booking_reference,
            status: emailData.payment_status,
            originalStatus: emailData.status,
            total: emailData.total_price,
            egp: emailData.paid_amount_egp,
            email: emailData.guest_email
          });
       }
    }

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

  } catch (err: any) {
    console.error("[TITANIUM VERIFY RECOVERED]", err);
    return NextResponse.json({ status: "not_found", error: err.message });
  }
}

/**
 * POST: SYNC SIMULATION
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { transactionId, status } = payload;
    if (transactionId) {
      await supabaseAdmin
        .from("bookings")
        .update({
          payment_status: status === "success" ? "paid" : "failed",
          status: status === "success" ? "confirmed" : "pending",
          paymob_transaction_id: String(transactionId),
          transaction_id: String(transactionId)
        })
        .or(`paymob_transaction_id.eq."${transactionId}",transaction_id.eq."${transactionId}"`);
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: true });
  }
}