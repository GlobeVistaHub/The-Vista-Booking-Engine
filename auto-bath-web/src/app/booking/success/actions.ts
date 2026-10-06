"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy", {});

export async function verifyAndConfirmPayment(sessionId: string) {
  try {
    if (!sessionId) return { success: false };
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === "paid") {
      const supabaseAdmin = createAdminClient();
      await supabaseAdmin
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('stripe_payment_intent_id', sessionId);
        
      return { success: true };
    }
    
    return { success: false };
  } catch (e) {
    console.error("Verification error:", e);
    return { success: false };
  }
}
