import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

/**
 * GET: Fetches the most recent booking status for a guest.
 * Supports segmented lookup by ID (Numerical) or TRANSACTION (String).
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

    // 1. DYNAMIC SEGMENTED SEARCH
    let query = supabaseAdmin
      .from("bookings")
      .select("id, booking_reference, status, payment_status, total_price, paid_amount_egp, guest_email");

    // Case A: We have our Golden Vista ID
    if (vistaId && vistaId !== "null" && vistaId !== "" && !isNaN(Number(vistaId))) {
      query = query.eq("id", Number(vistaId));
    } 
    // Case B: We have a Paymob Identification string/number
    else if (transactionId && transactionId !== "null" && transactionId !== "") {
      const isNumber = !isNaN(Number(transactionId)) && /^\d+$/.test(transactionId);
      
      // We only query the 'id' and 'paymob_order_id' if the string is purely numerical
      // This prevents the 'Data Type Mismatch' crash
      let orFilter = `paymob_transaction_id.eq.${transactionId},transaction_id.eq.${transactionId}`;
      if (isNumber) {
        orFilter += `,id.eq.${transactionId},paymob_order_id.eq.${transactionId}`;
      }
      
      query = query.or(orFilter);
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
    // If the ID search failed (due to sync delay or type issues), use the Email safety net.
    if ((!data || error) && email && email !== "null" && email !== "") {
       console.log(`[VERIFY FALLBACK] ID search failed for ${transactionId}, attempting Email lookup for ${email}`);
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
    console.error("[VERIFY CRASH RECOVERED]", err);
    // Even on total code crash, try to return a graceful not_found if we can
    return NextResponse.json({ status: "not_found", error: err.message });
  }
}

/**
 * POST: SYNC SIMULATION (FORCED SYNC)
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { transactionId, status } = payload;

    if (transactionId) {
      const isNumber = !isNaN(Number(transactionId)) && /^\d+$/.test(transactionId);
      
      let updateQuery = supabaseAdmin
        .from("bookings")
        .update({
          payment_status: status === "success" ? "paid" : "failed",
          status: status === "success" ? "confirmed" : "pending",
          paymob_transaction_id: String(transactionId),
          transaction_id: String(transactionId)
        });

      if (isNumber) {
        updateQuery = updateQuery.or(`id.eq.${transactionId},paymob_order_id.eq.${transactionId}`);
      } else {
        updateQuery = updateQuery.eq("paymob_transaction_id", transactionId);
      }
      
      await updateQuery;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: true, error: "Simulation active" });
  }
}