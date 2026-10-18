"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { requireAdmin } from "@/utils/admin-auth";
import { refundEligibility } from "@/lib/schedule";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import * as React from "react";
import Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";
import BookingCancellation from "@/emails/BookingCancellation";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export type RefundOutcome = "issued" | "not_eligible" | "failed" | "none";

export interface CancelResult {
  success: boolean;
  refund: RefundOutcome;
  error?: string;
}

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateAdminViews() {
  revalidatePath("/admin");
  revalidatePath("/admin/calendar");
}

export async function cancelBookingAction(id: string): Promise<CancelResult> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, refund: "none", error: "Not authorized" };
  }

  const admin = createAdminClient();

  // 1. Fetch booking details before updating, so we can email the user and process refunds
  const { data: booking } = await admin
    .from("bookings")
    .select(`user_id, status, scheduled_time, stripe_payment_intent_id, services(name), profiles(full_name)`)
    .eq("id", id)
    .single();

  if (!booking) {
    return { success: false, refund: "none", error: "Booking not found" };
  }
  if (booking.status !== "pending" && booking.status !== "confirmed") {
    return { success: false, refund: "none", error: `A ${booking.status} booking cannot be cancelled.` };
  }

  // 2. Refund automatically if the customer paid and cancellation is >= 48 hours before the appointment.
  //    Only confirmed bookings have a captured payment; pending ones are unpaid checkout sessions.
  let refund: RefundOutcome = "none";
  if (booking.status === "confirmed" && booking.stripe_payment_intent_id && process.env.STRIPE_SECRET_KEY) {
    const { eligible, hoursUntil } = refundEligibility(booking.scheduled_time);

    if (eligible) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        let paymentIntentId = booking.stripe_payment_intent_id;

        // Extract true payment intent from checkout session if necessary
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
        console.log(`Refunded payment intent ${paymentIntentId}`);
      } catch (refundError) {
        refund = "failed";
        console.error("Stripe refund failed:", refundError);
        Sentry.captureException(refundError, { tags: { area: "refund" }, extra: { bookingId: id } });
      }
    } else {
      refund = "not_eligible";
      console.log(`No refund issued: Cancellation is within 48 hour window (${hoursUntil.toFixed(1)} hours away).`);
    }
  }

  // 3. Update status
  const { error } = await admin
    .from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Failed to cancel booking:", error);
    return { success: false, refund, error: "Could not update the booking." };
  }

  // 4. Send Cancellation Email
  if (process.env.RESEND_API_KEY) {
    try {
      // Get exact email from Auth layer
      const { data: userAuth } = await admin.auth.admin.getUserById(booking.user_id);
      const email = userAuth?.user?.email;

      const dateObj = new Date(booking.scheduled_time);
      const formattedDate = `${dateObj.toLocaleDateString('en-AU', { timeZone: 'UTC', weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })} at ${dateObj.toLocaleTimeString('en-AU', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })}`;
      const senderEmail = process.env.RESEND_FROM_EMAIL || 'Auto-Bath Booking <booking@autobathmelbourne.com>';
      const customerName = (booking.profiles as any)?.full_name || 'Valued Customer';
      const serviceName = (booking.services as any)?.name || 'Auto Detailing';

      // 1. Send cancellation notice to the customer
      if (email) {
        const { data, error } = await resend.emails.send({
          from: senderEmail,
          to: email,
          subject: 'Booking Cancelled - Auto-Bath',
          react: BookingCancellation({
            customerName,
            serviceName,
            date: formattedDate,
          }) as React.ReactElement
        });

        if (error) {
          console.error(`Resend API failed to send cancellation email to ${email}:`, error);
        } else {
          console.log(`Cancellation email sent successfully to ${email}! Resend ID: ${data?.id}`);
        }
      }

      // 2. Send cancellation receipt/alert to Sam's Gmail
      const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'majsegroup@gmail.com';
      try {
        await resend.emails.send({
          from: senderEmail,
          to: adminEmail,
          subject: `🛑 Admin Cancelled Booking: ${customerName} (${serviceName})`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #ffffff; padding: 24px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,100,100,0.35);">
              <h2 style="color: #FF5555; margin: 0 0 8px 0; font-size: 20px;">🛑 Booking Cancelled by Admin</h2>
              <p style="color: #aaaaaa; margin: 0 0 16px 0; font-size: 14px;">You cancelled the following appointment from the Admin Dashboard:</p>
              <div style="background-color: #161218; border-left: 4px solid #FF5555; padding: 16px; border-radius: 6px; font-size: 15px; line-height: 1.6;">
                <p style="margin: 0 0 6px 0;"><strong>Customer:</strong> ${customerName} (${email ? `<a href="mailto:${email}" style="color: #00E5CC;">${email}</a>` : 'No email'})</p>
                <p style="margin: 0 0 6px 0;"><strong>Service:</strong> ${serviceName}</p>
                <p style="margin: 0 0 6px 0;"><strong>Slot:</strong> ${formattedDate}</p>
                <p style="margin: 0;"><strong>Stripe Refund:</strong> ${refund === 'issued' ? '✅ Refunded automatically' : refund === 'not_eligible' ? '⚠️ Within 48h (No automatic refund)' : 'None / Uncaptured'}</p>
              </div>
            </div>
          `
        });
        console.log(`Admin cancellation receipt sent to ${adminEmail}`);
      } catch (adminErr) {
        console.error("Failed to send admin cancellation receipt:", adminErr);
      }
    } catch (e) {
      console.error("Failed to send cancellation email:", e);
    }
  }

  revalidateAdminViews();
  return { success: true, refund };
}

export async function updateBookingStatusAction(
  id: string,
  status: "completed" | "no_show"
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Not authorized" };
  }
  if (status !== "completed" && status !== "no_show") {
    return { success: false, error: "Invalid status" };
  }

  const { data, error } = await createAdminClient()
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "confirmed") // only paid, confirmed bookings can be closed out
    .select("id");

  if (error) {
    Sentry.captureException(error, { tags: { area: "booking-status" }, extra: { bookingId: id, status } });
    const enumMissing = error.message.includes("invalid input value for enum");
    return {
      success: false,
      error: enumMissing
        ? "The no-show status is not enabled in the database yet. Run the latest Supabase migration."
        : "Could not update the booking.",
    };
  }
  if (!data || data.length === 0) {
    return { success: false, error: "Only confirmed bookings can be marked completed or no-show." };
  }

  revalidateAdminViews();
  return { success: true };
}

export async function purgeTestDataAction() {
  try {
    await requireAdmin();
  } catch {
    return false;
  }

  const admin = createAdminClient();

  // Delete all rows in the bookings table
  // Supabase requires a filter for delete(), so we use .not('id', 'is', null) which matches all rows
  const { error } = await admin
    .from("bookings")
    .delete()
    .not('id', 'is', null);

  if (error) {
    console.error("Failed to purge test data:", error);
    return false;
  }

  revalidateAdminViews();
  return true;
}
