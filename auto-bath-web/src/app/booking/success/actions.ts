"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy", {});

export async function verifyAndConfirmPayment(paymentIntentId: string) {
  try {
    if (!paymentIntentId) return { success: false };
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === "succeeded") {
      const supabaseAdmin = createAdminClient();
      await supabaseAdmin
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('stripe_payment_intent_id', paymentIntentId);
        
      return { success: true };
    }
    
    return { success: false };
  } catch (e) {
    console.error("Verification error:", e);
    return { success: false };
  }
}
