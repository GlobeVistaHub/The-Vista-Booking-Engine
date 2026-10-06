import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createAdminClient } from '@/utils/supabase/admin';
import { Resend } from 'resend';
import * as React from 'react';
import BookingConfirmation from '@/emails/BookingConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    // We get the payment intent ID to match it with our Supabase booking
    const paymentIntentId = paymentIntent.id;

    try {
      const supabaseAdmin = createAdminClient();
      
      // Update the booking status to confirmed
      const { error } = await supabaseAdmin
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('stripe_payment_intent_id', paymentIntentId);

      if (error) throw error;
      
      // Fetch booking details to send the email
      const { data: booking } = await supabaseAdmin
        .from('bookings')
        .select(`
          scheduled_time, vehicle_make,
          services ( name, base_price ),
          profiles ( full_name )
        `)
        .eq('stripe_payment_intent_id', paymentIntentId)
        .single();
        
      const customerEmail = paymentIntent.receipt_email || paymentIntent.metadata?.customer_email;
      
      if (booking && customerEmail && process.env.RESEND_API_KEY) {
        const dateObj = new Date(booking.scheduled_time);
        const formattedDate = `${dateObj.toLocaleDateString('en-AU', { timeZone: 'UTC', weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })} at ${dateObj.toLocaleTimeString('en-AU', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })}`;
        
        const { data, error: resendError } = await resend.emails.send({
          from: 'Auto-Bath Booking <onboarding@resend.dev>',
          to: customerEmail,
          subject: 'Your Auto-Bath Booking is Confirmed',
          react: <BookingConfirmation 
            customerName={(booking.profiles as any)?.full_name || 'Valued Customer'}
            serviceName={(booking.services as any)?.name || 'Auto Detailing'}
            vehicle={booking.vehicle_make}
            date={formattedDate}
            price={(booking.services as any)?.base_price ? ((booking.services as any).base_price / 100).toFixed(2) : '0.00'}
          />
        });
        
        if (resendError) {
          console.error("Resend API failed to send email:", resendError);
        } else {
          console.log(`Confirmation email sent successfully! Resend ID: ${data?.id}`);
        }
      }

      console.log(`Booking ${paymentIntentId} confirmed successfully!`);

    } catch (err) {
      console.error('Error updating booking in Supabase:', err);
      return new NextResponse('Database Error', { status: 500 });
    }
  }

  return new NextResponse('Webhook received', { status: 200 });
}
