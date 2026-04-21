import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { triggerN8NDossier } from '@/lib/n8n-server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

/**
 * [VISTA TEST TOOL]
 * This route allows for manual triggering of the N8N pipeline 
 * to verify the "Owner Alert" and "Enriched Dossier" logic.
 */
export async function GET() {
  try {
    console.log("[VISTA TEST] Manual Dossier Trigger Initiated...");

    // 1. Fetch the absolute latest booking to test the newest data
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('*, properties(*)')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ 
        success: false, 
        error: "No bookings found to test with." 
      }, { status: 404 });
    }

    // 2. FORCE TRIGGER to YOUR PHONE for this test-run
    // We override the DB just for this verify-dossier link to ensure YOU get the alert.
    const testBooking = {
      ...booking,
      guest_phone: "+201145551163", // Force guest phone for waMsg
    };
    
    const testProperty = {
      ...booking.properties,
      owner_phone: "+201145551163", // Force owner phone for alert
    };

    await triggerN8NDossier(testBooking, testProperty);

    return NextResponse.json({
      success: true,
      message: "End-to-End Handshake Triggered! 🥂",
      verification: {
        sentTo: "+201145551163",
        bookingRef: booking.booking_reference,
        guest: booking.guest_name,
        property: booking.properties?.title || "Vista Property",
        ownerNotification: `Property Alert: A new confirmed booking for ${booking.properties?.title || 'your property'} has been received! 🥂 Ref: ${booking.booking_reference}. Guest: ${booking.guest_name}. Check your owner portal for full details.`
      }
    });

  } catch (error: any) {
    console.error("[VISTA TEST ERROR]", error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
