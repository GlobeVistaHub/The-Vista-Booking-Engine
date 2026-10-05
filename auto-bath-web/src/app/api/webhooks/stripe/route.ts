import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createAdminClient } from '@/utils/supabase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('Stripe-Signature') as string;

    if (!signature) {
      return new NextResponse('Webhook signature missing', { status: 400 });
    }
    
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Signature Verification Failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the specific event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // We get the payment intent ID from the session to match it with our Supabase booking
    const paymentIntentId = session.id;

    try {
      const supabaseAdmin = createAdminClient();
      
      // Update the booking status to confirmed
      const { error } = await supabaseAdmin
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('stripe_payment_intent_id', paymentIntentId);

      if (error) throw error;
      
      // NOTE: Here is where we would trigger the SendGrid/Resend confirmation email!
      console.log(`Booking ${paymentIntentId} confirmed successfully!`);

    } catch (err) {
      console.error('Error updating booking in Supabase:', err);
      return new NextResponse('Database Error', { status: 500 });
    }
  }

  return new NextResponse('Webhook received', { status: 200 });
}
