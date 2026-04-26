import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { triggerN8NDossier, triggerN8NRecovery } from "@/lib/n8n-server";

// Initialize Supabase Admin for system-level overrides
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

/**
 * Paymob Transaction Callback / Webhook (POST)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { obj } = body;
    if (!obj) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    const isSuccess = obj.success === true;
    const paymobOrderId = String(obj.order.id);
    const transactionId = String(obj.id);
    const merchantOrderId = obj.order.merchant_order_id;

    // UPDATE: Sync EVERY possible column with double-quoted safety
    const safeMerchantId = merchantOrderId || "0";
    const safePaymobId = paymobOrderId || "0";

    // UPDATE: Atomic Flip - only update if status is still 'pending'
    const { data: updatedRows, error: updateError } = await supabaseAdmin
      .from("bookings")
      .update({
        payment_status: isSuccess ? "paid" : "failed",
        status: isSuccess ? "confirmed" : "pending",
        paymob_order_id: paymobOrderId,
        paymob_transaction_id: transactionId,
        transaction_id: transactionId,
      })
      .or(`id.eq.${safeMerchantId},paymob_order_id.eq.${safePaymobId}`)
      .in('status', ['pending', 'interrupted']) // THE LOCK: Accept both pending AND resumed interrupted bookings
      .select();

    if (updateError) console.error("[PAYMOB CALLBACK POST ERROR]", updateError);

    // Only fire n8n if THIS request was the one that successfully flipped it to 'confirmed'
    const wasFlippedNow = isSuccess && !updateError && updatedRows && updatedRows.length > 0;
    
    if (wasFlippedNow) {
      const { data: bookingRecord } = await supabaseAdmin
        .from("bookings")
        .select(`*, property:properties(*)`)
        .eq('id', updatedRows[0].id)
        .single();

      if (bookingRecord) {
        console.log("[CALLBACK] Launching N8N Dossier in background...");
        triggerN8NDossier(bookingRecord, bookingRecord.property || bookingRecord.properties).catch(e => console.error("[N8N Hook Error]:", e));
      }
    }

    // Update: Handle Recovery Outreach on Failure
    if (!isSuccess && !updateError) {
      const { data: bookingRecord } = await supabaseAdmin
        .from("bookings")
        .select(`*, property:properties(*)`)
        .or(`id.eq.${safeMerchantId},paymob_order_id.eq.${safePaymobId}`)
        .limit(1)
        .single();
      if (bookingRecord) {
        console.log("[CALLBACK] Launching N8N Recovery in background...");
        triggerN8NRecovery(bookingRecord, bookingRecord.property || bookingRecord.properties).catch(e => console.error("[N8N Recovery Error]:", e));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Handle GET requests (Directional Callback)
 * THIS IS THE TITANIUM REDIRECT: IT MUST SYNC THE DB BEFORE THE USER ARRIVES.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const success = searchParams.get("success") === "true";
  const vistaId       = searchParams.get("vista_id");          // Our custom param (may be stripped)
  const merchantId    = searchParams.get("merchant_order_id"); // Paymob always echoes this back
  const paymobTxId    = searchParams.get("id");                // Paymob transaction ID

  // Resolve the actual Supabase row ID — prefer our custom param, fall back to merchant_order_id
  const resolvedId = vistaId || merchantId;

  if (success) {
      if (resolvedId && resolvedId !== "null" && resolvedId !== "") {
        const numericId = Number(resolvedId);
        if (!isNaN(numericId)) {
          // Titanium Safety Net: Update by ID or Paymob Order ID
          const { data: updatedRows, error } = await supabaseAdmin
            .from("bookings")
            .update({
              payment_status: "paid",
              status: "confirmed",
              paymob_transaction_id: paymobTxId ? String(paymobTxId) : null,
              transaction_id: paymobTxId ? String(paymobTxId) : null,
            })
            .or(`id.eq.${numericId},paymob_order_id.eq.${numericId}`)
            .in('status', ['pending', 'interrupted'])
            .select();

          if (error) {
            console.error("[CALLBACK GET] DB update error:", error.message);
          } else {
            // Always try to fetch the record to trigger N8N, even if updatedRows is empty (POST might have won)
            const { data: bookingRecord } = await supabaseAdmin
              .from("bookings")
              .select(`*, property:properties(*)`)
              .or(`id.eq.${numericId},paymob_order_id.eq.${numericId}`)
              .single();

            if (bookingRecord && bookingRecord.status === 'confirmed' && !bookingRecord.notification_sent) {
               console.log(`[CALLBACK GET] Found Booking ${bookingRecord.booking_reference}. Launching N8N...`);
               triggerN8NDossier(bookingRecord, bookingRecord.property || bookingRecord.properties).catch(e => console.error("[N8N GET Bailout Error]:", e));
               
               // Mark as sent so POST doesn't double-trigger if it's still running
               await supabaseAdmin.from('bookings').update({ notification_sent: true }).eq('id', bookingRecord.id);
            }
          }
        }
      }

    return NextResponse.redirect(
      new URL(`/success?vista_id=${resolvedId || ""}&id=${paymobTxId || ""}`, req.url)
    );
  } else {
    // Note: The N8N Recovery trigger has been removed from here.
    // It is now exclusively handled by the POST Webhook above to prevent redundant messages.
    return NextResponse.redirect(new URL(`/checkout?error=payment_failed`, req.url));
  }
}

