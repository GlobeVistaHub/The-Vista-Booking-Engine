import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    const { error: updateError } = await supabaseAdmin
      .from("bookings")
      .update({
        payment_status: isSuccess ? "paid" : "failed",
        status: isSuccess ? "confirmed" : "pending",
        paymob_order_id: paymobOrderId,
        paymob_transaction_id: transactionId,
        transaction_id: transactionId,
      })
      .or(`id.eq.${merchantOrderId},paymob_order_id.eq.${paymobOrderId}`);

    if (updateError) console.error("[PAYMOB CALLBACK POST ERROR]", updateError);

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
  const vistaId = searchParams.get("vista_id") || searchParams.get("merchant_order_id");
  const paymobId = searchParams.get("id");

  if (success) {
    // TITANIUM SYNC: We perform the update in the foreground so the Success Page 'sees' it instantly.
    if (vistaId && !isNaN(Number(vistaId))) {
      await supabaseAdmin
        .from("bookings")
        .update({
          payment_status: "paid",
          status: "confirmed",
          paymob_transaction_id: String(paymobId),
          transaction_id: String(paymobId)
        })
        .eq("id", Number(vistaId));
    } else if (paymobId) {
      // Fallback: If we don't have vistaId, try to find by Paymob Transaction ID
      await supabaseAdmin
        .from("bookings")
        .update({
          payment_status: "paid",
          status: "confirmed",
          paymob_transaction_id: String(paymobId),
          transaction_id: String(paymobId)
        })
        .eq("paymob_transaction_id", String(paymobId));
    }
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    console.log('Paymob Callback Received:', paymobId);
    
    const targetUrl = new URL(`${baseUrl}/success`);
    targetUrl.searchParams.set('vista_id', String(vistaId || ""));
    targetUrl.searchParams.set('id', String(paymobId || ""));
    
    console.log('Redirecting to Success Page:', targetUrl.toString());
    return NextResponse.redirect(targetUrl.toString());
  } else {
    // Payment failure redirect
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/checkout?error=payment_failed`);
  }
}
