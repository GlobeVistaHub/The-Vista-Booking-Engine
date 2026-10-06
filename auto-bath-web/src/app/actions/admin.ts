"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import * as React from "react";
import Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";
import BookingCancellation from "@/emails/BookingCancellation";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function cancelBookingAction(id: string) {
  const admin = createAdminClient();
  
  // 1. Fetch booking details before updating, so we can email the user and process refunds
  const { data: booking } = await admin
    .from("bookings")
    .select(`user_id, scheduled_time, stripe_payment_intent_id, services(name), profiles(full_name)`)
    .eq("id", id)
    .single();

  // 2. Process automatic Stripe refund if cancellation is >= 48 hours before scheduled time
  if (booking?.stripe_payment_intent_id && process.env.STRIPE_SECRET_KEY) {
    const scheduledDate = new Date(booking.scheduled_time);
    const now = new Date();
    const hoursDifference = (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDifference >= 48) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        let paymentIntentId = booking.stripe_payment_intent_id;
        
        // Extract true payment intent from checkout session if necessary
        if (paymentIntentId.startsWith('cs_')) {
          const session = await stripe.checkout.sessions.retrieve(paymentIntentId);
          if (session.payment_intent) {
            paymentIntentId = typeof session.payment_intent === 'string' 
              ? session.payment_intent 
              : session.payment_intent.id;
          }
        }

        await stripe.refunds.create({
          payment_intent: paymentIntentId,
        });
        console.log(`Refunded payment intent ${paymentIntentId}`);
      } catch (refundError) {
        console.error("Stripe refund failed:", refundError);
        Sentry.captureException(refundError, { tags: { area: "refund" }, extra: { bookingId: id } });
      }
    } else {
      console.log(`No refund issued: Cancellation is within 48 hour window (${hoursDifference.toFixed(1)} hours away).`);
    }
  }

  // 3. Update status
  const { error } = await admin.from("bookings").update({ status: "cancelled" }).eq("id", id);
  
  if (error) {
    console.error("Failed to cancel booking:", error);
    return false;
  }
  
  // 3. Send Cancellation Email
  if (booking && process.env.RESEND_API_KEY) {
    try {
      // Get exact email from Auth layer
      const { data: userAuth } = await admin.auth.admin.getUserById(booking.user_id);
      const email = userAuth?.user?.email;
      
      if (email) {
        const dateObj = new Date(booking.scheduled_time);
        const formattedDate = `${dateObj.toLocaleDateString('en-AU', { timeZone: 'UTC', weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })} at ${dateObj.toLocaleTimeString('en-AU', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })}`;
        
        const { data, error } = await resend.emails.send({
          from: 'Auto-Bath Booking <onboarding@resend.dev>',
          to: email,
          subject: 'Booking Cancelled - Auto-Bath',
          react: BookingCancellation({
            customerName: (booking.profiles as any)?.full_name || 'Valued Customer',
            serviceName: (booking.services as any)?.name || 'Auto Detailing',
            date: formattedDate,
          }) as React.ReactElement
        });
        
        if (error) {
          console.error(`Resend API failed to send cancellation email to ${email}:`, error);
        } else {
          console.log(`Cancellation email sent successfully to ${email}! Resend ID: ${data?.id}`);
        }
      }
    } catch (e) {
      console.error("Failed to send cancellation email:", e);
    }
  }

  revalidatePath("/admin");
  return true;
}

export async function purgeTestDataAction() {
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
  
  revalidatePath("/admin");
  return true;
}
