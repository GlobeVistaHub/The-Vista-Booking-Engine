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
  const vistaId       = searchParams.get("vista_id");          // Our custom param (may be stripped)
  const merchantId    = searchParams.get("merchant_order_id"); // Paymob always echoes this back
  const paymobTxId    = searchParams.get("id");                // Paymob transaction ID

  // Resolve the actual Supabase row ID — prefer our custom param, fall back to merchant_order_id
  const resolvedId = vistaId || merchantId;

  if (success) {
    if (resolvedId && resolvedId !== "null" && resolvedId !== "") {
      const numericId = Number(resolvedId);
      if (!isNaN(numericId)) {
        const { error } = await supabaseAdmin
          .from("bookings")
          .update({
            payment_status: "paid",
            status: "confirmed",
            paymob_transaction_id: paymobTxId ? String(paymobTxId) : null,
            transaction_id: paymobTxId ? String(paymobTxId) : null,
          })
          .eq("id", numericId);

        if (error) console.error("[CALLBACK GET] DB update error:", error.message);
      }
    }

    return NextResponse.redirect(
      new URL(`/success?vista_id=${resolvedId || ""}&id=${paymobTxId || ""}`, req.url)
    );
  } else {
    return NextResponse.redirect(new URL(`/checkout?error=payment_failed`, req.url));
  }
}

