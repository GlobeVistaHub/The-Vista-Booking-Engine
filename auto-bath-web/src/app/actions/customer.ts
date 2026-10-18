"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { refundEligibility } from "@/lib/schedule";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";
// Re-using the types and Resend logic from admin
import { Resend } from "resend";
import * as React from "react";
import BookingCancellation from "@/emails/BookingCancellation";
import { CancelResult, RefundOutcome } from "./admin";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function customerCancelBookingAction(bookingId: string): Promise<CancelResult> {
  const supabase = await createClient();
  
  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, refund: "none", error: "You must be logged in to cancel a booking." };
  }

  const admin = createAdminClient();

  // 2. Fetch booking and ensure it belongs to the user
  const { data: booking, error: fetchError } = await admin
    .from("bookings")
    .select(`user_id, status, scheduled_time, stripe_payment_intent_id, services(name), profiles(full_name)`)
    .eq("id", bookingId)
    .single();

  if (fetchError || !booking) {
    return { success: false, refund: "none", error: "Booking not found." };
  }

  if (booking.user_id !== user.id) {
    return { success: false, refund: "none", error: "Unauthorized. This is not your booking." };
  }

  if (booking.status !== "pending" && booking.status !== "confirmed") {
    return { success: false, refund: "none", error: `A ${booking.status} booking cannot be cancelled.` };
  }

  // 3. Process Refunds (Exact same logic as admin)
  let refund: RefundOutcome = "none";
  if (booking.status === "confirmed" && booking.stripe_payment_intent_id && process.env.STRIPE_SECRET_KEY) {
    const { eligible, hoursUntil } = refundEligibility(booking.scheduled_time);

    if (eligible) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        let paymentIntentId = booking.stripe_payment_intent_id;

        if (paymentIntentId.startsWith("cs_")) {
          const session = await stripe.checkout.sessions.retrieve(paymentIntentId);
          if (session.payment_intent) {
            paymentIntentId = typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent.id;
          }
        }
        if (!paymentIntentId.startsWith("pi_")) {
          throw new Error("No payment intent found for this booking's checkout session");
        }

        await stripe.refunds.create({ payment_intent: paymentIntentId });
        refund = "issued";
        console.log(`Customer self-refunded payment intent ${paymentIntentId}`);
      } catch (refundError) {
        refund = "failed";
        console.error("Stripe refund failed during customer cancel:", refundError);
        Sentry.captureException(refundError, { tags: { area: "customer-refund" }, extra: { bookingId } });
      }
    } else {
      refund = "not_eligible";
      console.log(`Customer cancelled within 48h. No refund issued. (${hoursUntil.toFixed(1)} hours away).`);
    }
  }

  // 4. Update status
  const { error: updateError } = await admin
    .from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", bookingId);

  if (updateError) {
    console.error("Failed to cancel booking:", updateError);
    return { success: false, refund, error: "Could not update the booking." };
  }

  // 5. Send Email
  if (process.env.RESEND_API_KEY && user.email) {
    try {
      const dateObj = new Date(booking.scheduled_time);
      const formattedDate = `${dateObj.toLocaleDateString('en-AU', { timeZone: 'UTC', weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })} at ${dateObj.toLocaleTimeString('en-AU', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })}`;

      const senderEmail = process.env.RESEND_FROM_EMAIL || 'Auto-Bath Booking <booking@autobathmelbourne.com>';
      const customerName = (booking.profiles as any)?.full_name || 'Valued Customer';
      const serviceName = (booking.services as any)?.name || 'Auto Detailing';

      // 1. Send Cancellation Email to Customer
      await resend.emails.send({
        from: senderEmail,
        to: user.email,
        subject: 'Booking Cancelled - Auto-Bath',
        react: BookingCancellation({
          customerName: customerName,
          serviceName: serviceName,
          date: formattedDate,
        }) as React.ReactElement
      });

      // 2. Alert Sam that a customer cancelled their slot
      const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'majsegroup@gmail.com';
      try {
        await resend.emails.send({
          from: senderEmail,
          to: adminEmail,
          subject: `⚠️ Booking Cancelled by Customer: ${customerName} (${serviceName})`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #ffffff; padding: 24px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,51,51,0.35);">
              <h2 style="color: #FF3333; margin: 0 0 8px 0; font-size: 20px;">⚠️ Booking Cancelled by Customer</h2>
              <p style="color: #aaaaaa; margin: 0 0 16px 0; font-size: 14px;">The customer cancelled their appointment. The slot has been freed up on the calendar:</p>
              <div style="background-color: #161218; border-left: 4px solid #FF3333; padding: 16px; border-radius: 6px; font-size: 15px; line-height: 1.6;">
                <p style="margin: 0 0 6px 0;"><strong>Customer:</strong> ${customerName} (<a href="mailto:${user.email}" style="color: #00E5CC;">${user.email}</a>)</p>
                <p style="margin: 0 0 6px 0;"><strong>Service:</strong> ${serviceName}</p>
                <p style="margin: 0 0 6px 0;"><strong>Slot:</strong> ${formattedDate}</p>
                <p style="margin: 0;"><strong>Stripe Refund:</strong> ${refund === 'issued' ? '✅ Refunded automatically' : '⚠️ No refund issued (<48h window)'}</p>
              </div>
            </div>
          `
        });
      } catch (adminErr) {
        console.error("Failed to send admin cancellation alert:", adminErr);
      }
    } catch (e) {
      console.error("Failed to send cancellation email:", e);
    }
  }

  revalidatePath("/my-bookings");
  revalidatePath("/admin/calendar"); // Refresh admin calendar too
  return { success: true, refund };
}

export async function sendMagicLinkAction(email: string) {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'production' ? 'https://www.autobathmelbourne.com' : 'http://localhost:3000');
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Pointing to the new route that exchanges token_hash for a secure cookie session
      emailRedirectTo: `${baseUrl}/auth/confirm?next=/my-bookings`,
      shouldCreateUser: false // Only allow existing ghost profiles to get links
    },
  });

  if (error) {
    console.error("Magic link error:", error);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}
