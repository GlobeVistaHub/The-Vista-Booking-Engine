import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

/**
 * Paymob Transaction Callback / Webhook
 * This endpoint is called by Paymob after a transaction is processed.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { obj } = body;

    if (!obj) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 1. Log the transaction for audit (Essential for debugging)
    console.log(`[PAYMOB CALLBACK] OrderID: ${obj.order.id}, TransactionID: ${obj.id}, Success: ${obj.success}`);

    // 2. Extract key details - FORCE TO STRINGS for column compatibility
    const paymobOrderId = String(obj.order.id);
    const isSuccess = obj.success === true;
    const amountEGP = obj.amount_cents / 100;
    const transactionId = String(obj.id);
    const merchantOrderId = obj.order.merchant_order_id;
    const guestEmail = obj.order.shipping_data?.email;

    // 3. Update the booking in Supabase using the Golden Thread
    let booking;
    if (merchantOrderId) {
      const { data } = await supabaseAdmin
        .from("bookings")
        .select("*")
        .eq("id", merchantOrderId)
        .single();
      booking = data;
    }

    if (!booking) {
      const { data } = await supabaseAdmin
        .from("bookings")
        .select("*")
        .eq("paymob_order_id", paymobOrderId)
        .single();
      booking = data;
    }

    if (!booking && guestEmail) {
      const { data } = await supabaseAdmin
        .from("bookings")
        .select("*")
        .eq("guest_email", guestEmail)
        .eq("payment_status", "pending")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      booking = data;
    }

    if (!booking) {
      console.error("[PAYMOB CALLBACK ERROR] Booking not found for reconciliation.");
      return NextResponse.json({ error: "Booking reconciliation failed" }, { status: 404 });
    }

    // 4. Final Update: SYNC ALL COLUMNS
    const { error: updateError } = await supabaseAdmin
      .from("bookings")
      .update({
        payment_status: isSuccess ? "paid" : "failed",
        status: isSuccess ? "confirmed" : "pending",
        paymob_order_id: paymobOrderId,
        paymob_transaction_id: transactionId,
        transaction_id: transactionId, // UPDATED: Fill both ID columns for absolute redundancy
        payment_method: obj.payment_key_claims?.extra_info?.billing_data?.payment_method || "card"
      })
      .eq("id", booking.id);

    if (updateError) {
      console.error("[PAYMOB CALLBACK ERROR] DB Update failed:", updateError);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }

    // 5. Trigger n8n Automation
    try {
      const n8nUrl = process.env.N8N_WEBHOOK_URL;
      if (n8nUrl) {
        await fetch(n8nUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: isSuccess ? "payment_success" : "payment_failed",
            booking: { ...booking, property_title: obj.order.items?.[0]?.name || "Luxury Property" },
            amountEGP,
            transactionId
          })
        });
      }
    } catch (e) {}

    return NextResponse.json({ success: true, message: "Transaction processed" });

  } catch (error: any) {
    console.error("Paymob Callback Top-Level Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Handle GET requests (Paymob Redirection Callback)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const success = searchParams.get("success") === "true";
  const vistaId = searchParams.get("vista_id") || searchParams.get("merchant_order_id");
  const paymobId = searchParams.get("id");

  if (success) {
    if (vistaId) {
      // PROACTIVE SYNC: Ensure the database is updated BEFORE the user sees the success page
      await supabaseAdmin
        .from("bookings")
        .update({
          payment_status: "paid",
          status: "confirmed",
          paymob_transaction_id: String(paymobId),
          transaction_id: String(paymobId)
        })
        .eq("id", vistaId);
        
      try {
        const n8nUrl = process.env.N8N_WEBHOOK_URL;
        if (n8nUrl) {
          fetch(n8nUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "payment_success_direct", booking_id: vistaId, transaction_id: paymobId })
          });
        }
      } catch (e) {}
    }
    return NextResponse.redirect(new URL(`/success?vista_id=${vistaId || ""}&id=${paymobId || ""}`, req.url));
  } else {
    const propertyId = searchParams.get("propertyId");
    return NextResponse.redirect(new URL(`/checkout?error=payment_failed&id=${propertyId}`, req.url));
  }
}
