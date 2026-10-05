import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/utils/supabase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  // apiVersion omitted to use default
});

// Stripe requires the raw body to construct the event
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return new NextResponse('Webhook secret missing', { status: 400 });
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
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
