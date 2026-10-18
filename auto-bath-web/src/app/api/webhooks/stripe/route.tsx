import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createAdminClient } from '@/utils/supabase/admin';
import { Resend } from 'resend';
import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import BookingConfirmation from '@/emails/BookingConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");
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
    
    // We get the checkout session ID to match it with our Supabase booking
    const sessionId = session.id;

    try {
      const supabaseAdmin = createAdminClient();
      
      // Update the booking status to confirmed
      const { error } = await supabaseAdmin
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('stripe_payment_intent_id', sessionId);

      if (error) throw error;
      
      // Fetch booking details to send the email
      const { data: booking } = await supabaseAdmin
        .from('bookings')
        .select(`
          scheduled_time, vehicle_make,
          services ( name, base_price ),
          profiles ( full_name, phone_number )
        `)
        .eq('stripe_payment_intent_id', sessionId)
        .single();
        
      const customerEmail = session.customer_details?.email || session.customer_email || session.metadata?.customer_email;
      
      if (booking && customerEmail && process.env.RESEND_API_KEY) {
        const dateObj = new Date(booking.scheduled_time);
        const formattedDate = `${dateObj.toLocaleDateString('en-AU', { timeZone: 'UTC', weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })} at ${dateObj.toLocaleTimeString('en-AU', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })}`;
        
        const senderEmail = process.env.RESEND_FROM_EMAIL || 'Auto-Bath Booking <booking@autobathmelbourne.com>';
        const customerName = (booking.profiles as any)?.full_name || 'Valued Customer';
        const customerPhone = (booking.profiles as any)?.phone_number || session.customer_details?.phone || 'Not provided';
        const serviceName = (booking.services as any)?.name || 'Auto Detailing';
        const priceFormatted = (booking.services as any)?.base_price ? ((booking.services as any).base_price / 100).toFixed(2) : '0.00';

        // 1. Send Customer Confirmation Email
        const { data, error: resendError } = await resend.emails.send({
          from: senderEmail,
          to: customerEmail,
          subject: 'Your Auto-Bath Booking is Confirmed',
          react: <BookingConfirmation 
            customerName={customerName}
            serviceName={serviceName}
            vehicle={booking.vehicle_make}
            date={formattedDate}
            price={priceFormatted}
          />
        });
        
        if (resendError) {
          console.error("Resend API failed to send customer confirmation email:", resendError);
        } else {
          console.log(`Confirmation email sent successfully to customer! Resend ID: ${data?.id}`);
        }

        // 2. Send Instant Admin Notification Email to Sam's Gmail
        const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'majsegroup@gmail.com';
        try {
          const { data: adminEmailData, error: adminResendError } = await resend.emails.send({
            from: senderEmail,
            to: adminEmail,
            subject: `🚨 New Booking: ${customerName} — ${serviceName} (${booking.vehicle_make})`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #ffffff; padding: 24px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,102,0,0.35);">
                <div style="border-bottom: 2px solid #FF6600; padding-bottom: 12px; margin-bottom: 18px;">
                  <h2 style="color: #FF6600; margin: 0; font-size: 22px;">🚨 New Booking Received</h2>
                  <p style="color: #aaaaaa; margin: 4px 0 0 0; font-size: 14px;">A new customer has completed their booking on Auto-Bath Melbourne.</p>
                </div>
                
                <div style="background-color: #131926; border-left: 4px solid #FF6600; padding: 18px; border-radius: 8px; margin: 18px 0; font-size: 15px; line-height: 1.6;">
                  <p style="margin: 0 0 8px 0;"><strong>👤 Customer:</strong> ${customerName}</p>
                  <p style="margin: 0 0 8px 0;"><strong>📧 Email:</strong> <a href="mailto:${customerEmail}" style="color: #00E5CC; text-decoration: none;">${customerEmail}</a></p>
                  <p style="margin: 0 0 8px 0;"><strong>📞 Phone:</strong> <a href="tel:${customerPhone}" style="color: #00E5CC; text-decoration: none;">${customerPhone}</a></p>
                  <p style="margin: 0 0 8px 0;"><strong>🚗 Vehicle:</strong> ${booking.vehicle_make}</p>
                  <p style="margin: 0 0 8px 0;"><strong>✨ Service:</strong> ${serviceName}</p>
                  <p style="margin: 0 0 8px 0;"><strong>💰 Amount Paid:</strong> $${priceFormatted} AUD</p>
                  <p style="margin: 0;"><strong>📅 Scheduled Slot:</strong> <span style="color: #FF6600; font-weight: bold;">${formattedDate}</span></p>
                </div>
                
                <div style="text-align: center; margin-top: 24px;">
                  <a href="https://autobathmelbourne.com/admin/calendar" style="background-color: #FF6600; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">
                    Open Schedule Board
                  </a>
                </div>
              </div>
            `
          });

          if (adminResendError) {
            console.error("Resend API failed to send admin alert to Sam:", adminResendError);
          } else {
            console.log(`Admin alert sent successfully to ${adminEmail}! Resend ID: ${adminEmailData?.id}`);
          }
        } catch (adminErr) {
          console.error("Failed to trigger admin notification email:", adminErr);
        }
      }

      console.log(`Booking ${sessionId} confirmed successfully!`);

    } catch (err) {
      console.error('Error updating booking in Supabase:', err);
      Sentry.captureException(err, { tags: { area: 'stripe-webhook' }, extra: { sessionId } });
      return new NextResponse('Database Error', { status: 500 });
    }
  }

  return new NextResponse('Webhook received', { status: 200 });
}
