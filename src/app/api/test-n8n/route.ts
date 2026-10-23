import { NextResponse } from "next/server";
import { triggerN8NDossier } from "@/lib/n8n-server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function GET() {
  try {
    console.log("[TEST-N8N] Starting direct trigger test...");

    // 1. Grab the latest booking to test with real data
    const { data: booking, error: bError } = await supabase
      .from("bookings")
      .select(`*, property:properties(*)`)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (bError || !booking) {
      console.error("[TEST-N8N] Error fetching test booking:", bError);
      return NextResponse.json({ error: "No bookings found to test with" }, { status: 404 });
    }

    console.log(`[TEST-N8N] Using Booking Ref: ${booking.booking_reference} (${booking.guest_email})`);

    // 2. Force the Dossier Trigger
    await triggerN8NDossier(booking, booking.property);

    return NextResponse.json({ 
      success: true, 
      message: "Success Handshake fired! Check your Email and WhatsApp.",
      testDetails: {
        ref: booking.booking_reference,
        guestEmail: booking.guest_email,
        propertyName: booking.property?.title,
        ownerPhoneSent: booking.property?.owner_phone || "201145551163"
      }
    });
  } catch (error: any) {
    console.error("[TEST-N8N] Fatal Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to trigger test" 
    }, { status: 500 });
  }
}
