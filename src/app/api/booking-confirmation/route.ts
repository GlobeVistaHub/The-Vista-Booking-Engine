import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// SECURE: Use service role key to ensure the booking is written despite RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // 1. Generate a professional reference (e.g., VST-1234)
    const bookingRef = `VST-${Math.floor(1000 + Math.random() * 9000)}`;

    // 2. THE REAL DEPLOYMENT: Insert into Supabase
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert([
        {
          property_id: payload.propertyId,
          guest_name: payload.guestName,
          guest_email: payload.guestEmail,
          check_in: payload.from,
          check_out: payload.to,
          total_price: payload.totalPrice,
          adults: payload.adults,
          children: payload.children,
          booking_reference: bookingRef,
          payment_status: 'pending',
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // 3. Keep your n8n trigger active
    const N8N_WEBHOOK_URL = "https://webhook.site/bfeaeb6d-fa7d-4162-9548-a1a51fb1506c";
    fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, type: "REAL_BOOKING_CREATED" }),
    }).catch(e => console.log("n8n log suppressed"));

    // 4. Return the REAL ID to the Success Page
    return NextResponse.json({
      success: true,
      bookingId: data.id,
      bookingReference: data.booking_reference
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Critical System Error" }, { status: 500 });
  }
}