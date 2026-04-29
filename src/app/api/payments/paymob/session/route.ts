import { NextResponse } from "next/server";
import { PaymobService } from "@/utils/paymob";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60; // Allow up to 60 seconds on Vercel

// Initialize Supabase Admin for sensitive writes
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      propertyId, 
      guestName, 
      guestEmail, 
      amountUSD, 
      exchangeRate,
      checkIn,
      checkOut,
      adults,
      children
    } = body;

    // 1. Calculate the final EGP amount for Paymob
    const rate = exchangeRate || 50.0;
    const amountEGP = Math.round(amountUSD * rate);
    const amountCents = amountEGP * 100;

    // 1.5 VERIFY NO OVERLAPPING BOOKINGS (DOUBLE-BOOKING PROTECTION)
    // We must ensure there is no overlapping confirmed or pending booking from ANOTHER user!
    const { data: overlappingBookings, error: overlapError } = await supabaseAdmin
      .from("bookings")
      .select("id, status, guest_email")
      .eq("property_id", propertyId)
      .in("status", ["confirmed", "pending", "interrupted"])
      .lt("check_in", checkOut)
      .gt("check_out", checkIn);

    if (overlapError) {
      console.error("Overlap Check Error:", overlapError);
      return NextResponse.json({ error: "Failed to verify dates availability" }, { status: 500 });
    }

    if (overlappingBookings && overlappingBookings.length > 0) {
      // SMART IDENTITY CHECK: If the only overlaps are the guest's OWN pending bookings, let them proceed!
      const isBlockedBySomeoneElse = overlappingBookings.some(b => 
        b.status === "confirmed" || b.guest_email !== guestEmail
      );

      if (isBlockedBySomeoneElse) {
        return NextResponse.json({ 
          error: "These dates are no longer available. Someone else has just reserved them." 
        }, { status: 409 });
      }
    }

    // 2. Generate VST reference and create the "Pending" booking in Supabase
    const currentYear = new Date().getFullYear();
    const randomID = Math.floor(10000 + Math.random() * 90000);
    const bookingReference = `VST-${currentYear}-${randomID}`;

    const { data: booking, error: dbError } = await supabaseAdmin
      .from("bookings")
      .insert([
        {
          property_id: propertyId,
          guest_name: guestName,
          guest_email: guestEmail,
          check_in: checkIn,
          check_out: checkOut,
          total_price: amountUSD,
          adults: adults,
          children: children,
          status: "pending",
          payment_status: "pending",
          paid_amount_egp: amountEGP,
          conversion_rate_used: rate,
          booking_reference: bookingReference
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Supabase Error:", dbError);
      return NextResponse.json({ error: "Failed to create pending booking" }, { status: 500 });
    }

    // 3. Initiate Paymob handshake — auto-detect base URL from request host
    // This works on localhost, Vercel preview, and production with zero config
    const requestUrl = new URL(req.url);
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

    // vista_id is the Supabase row ID — Paymob will echo this back in the GET callback
    const redirectionUrl = `${baseUrl}/api/payments/paymob/callback?vista_id=${booking.id}`;

    const paymentToken = await PaymobService.createSession(
      amountCents, 
      guestEmail, 
      guestName,
      redirectionUrl,
      booking.id // The Golden Thread (Merchant Order ID)
    );

    // 4. Update the booking with the Paymob metadata if possible 
    // (Note: To get the Paymob Order ID, we'd need to refactor createSession to return it, 
    // but for now, we'll return the token to the frontend to launch the iframe)

    return NextResponse.json({ 
      paymentToken,
      bookingId: booking.id,
      amountEGP
    });

  } catch (error: any) {
    console.error("Paymob Session Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to initiate payment session" 
    }, { status: 500 });
  }
}
