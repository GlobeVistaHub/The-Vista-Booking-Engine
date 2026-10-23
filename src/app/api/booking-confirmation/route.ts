import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // 1. RESTORING YOUR ELITE BRANDING LOGIC
    const currentYear = new Date().getFullYear();
    const randomID = Math.floor(10000 + Math.random() * 90000);
    const bookingRef = `VST-${currentYear}-${randomID}`;

    // 2. THE PRODUCTION INSERT (Aligned with your latest SQL schema)
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert([
        {
          property_id: payload.propertyId,
          guest_name: payload.guestName,
          guest_email: payload.guestEmail || 'support@globevistahub.com',
          check_in: payload.from,
          check_out: payload.to,
          total_price: payload.totalPrice,
          adults: payload.adults,
          children: payload.children,
          booking_reference: bookingRef,
          payment_status: 'pending',
          status: 'pending',
          paid_amount_egp: payload.totalPrice * 50.6, // Using your Vista Rate
          conversion_rate_used: 50.6
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("CRITICAL DATABASE ERROR:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      bookingId: data.id,
      bookingReference: data.booking_reference
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: "System Error" }, { status: 500 });
  }
}