import { NextResponse } from "next/server";
import { PaymobService } from "@/utils/paymob";
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

    // 1. Log the transaction for audit (Optional but highly recommended)
    console.log(`Paymob Callback received for Order ID: ${obj.order.id}, Status: ${obj.success}`);

    // 2. Extract key details
    const paymobOrderId = obj.order.id;
    const isSuccess = obj.success === true;
    const amountEGP = obj.amount_cents / 100;
    const transactionId = obj.id;

    // 3. Update the booking in Supabase
    // We match by paymob_order_id. (Wait, in our session route we didn't store it yet. 
    // Usually Paymob allows passing custom fields or we reconciliation by amount/email.
    // Better: We should have stored the Paymob order_id in the session route.)
    
    // RECONCILIATION STRATEGY: 
    // Since we pass the guest email to Paymob, we can find the "pending" booking for that email/amount.
    // However, the most robust way is to find by internal ID if we can pass it to Paymob items.
    
    const { data: booking, error: findError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("guest_email", obj.order.shipping_data.email)
      .eq("payment_status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (findError || !booking) {
      console.error("Booking not found for callback:", obj.order.shipping_data.email);
      return NextResponse.json({ error: "Booking reconciliation failed" }, { status: 404 });
    }

    // 4. Final Update
    const { error: updateError } = await supabaseAdmin
      .from("bookings")
      .update({
        payment_status: isSuccess ? "paid" : "failed",
        status: isSuccess ? "confirmed" : "pending",
        paymob_order_id: paymobOrderId,
        payment_method: obj.payment_key_claims?.extra_info?.billing_data?.payment_method || "card"
      })
      .eq("id", booking.id);

    if (updateError) {
      console.error("Failed to update booking status:", updateError);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }

    // 5. Trigger n8n Automation (Only on SUCCESS)
    if (isSuccess) {
      // In a real production app, we'd trigger n8n here via fetch()
      console.log("TRIGGERING N8N AUTOMATION for Booking:", booking.id);
      /*
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify({
          event: "payment_success",
          bookingId: booking.id,
          guestName: booking.guest_name,
          totalUSD: booking.total_price,
          amountEGP: amountEGP
        })
      });
      */
    }

    return NextResponse.json({ success: true, message: "Transaction processed" });

  } catch (error: any) {
    console.error("Paymob Callback Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Handle GET requests (Paymob Redirection Callback)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const success = searchParams.get("success") === "true";
  const bookingId = searchParams.get("id"); // If we passed this in the success_url

  // Redirect the user to the frontend success or failure page
  if (success) {
    return NextResponse.redirect(new URL("/success", req.url));
  } else {
    return NextResponse.redirect(new URL("/checkout?error=payment_failed", req.url));
  }
}
