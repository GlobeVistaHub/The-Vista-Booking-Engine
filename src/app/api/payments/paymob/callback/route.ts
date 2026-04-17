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

    // 4.1 Fetch Dynamic Support Email for n8n
    const { data: supportEmailRecord } = await supabaseAdmin
      .from('site_content')
      .select('value_en')
      .eq('key', 'support_email')
      .single();
    
    const finalSupportEmail = supportEmailRecord?.value_en || "support@globevistahub.com";

    // 5. Trigger n8n Automation
    try {
      const n8nUrl = process.env.N8N_WEBHOOK_URL;
      if (n8nUrl) {
        await fetch(n8nUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: isSuccess ? "payment_success" : "payment_failed",
            booking: {
              ...booking,
              property_title: obj.order.items?.[0]?.name || "Luxury Property",
              owner_email: booking.owner_email || finalSupportEmail
            },
            amountEGP,
            transactionId
          })
        });
        console.log(`n8n ${isSuccess ? 'Success' : 'Failure'} signal sent.`);
      }
    } catch (n8nErr) {
      console.error("n8n Trigger failed (non-blocking):", n8nErr);
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
    const email = searchParams.get("email") || "";
    return NextResponse.redirect(new URL(`/success?id=${bookingId}&success=true&email=${encodeURIComponent(email)}`, req.url));
  } else {
    // Preserve ALL booking context so the guest doesn't have to restart
    const propertyId = searchParams.get("propertyId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const adults = searchParams.get("adults");
    const children = searchParams.get("children");
    
    return NextResponse.redirect(new URL(`/checkout?error=payment_failed&id=${propertyId}&from=${from}&to=${to}&adults=${adults}&children=${children}`, req.url));
  }
}
