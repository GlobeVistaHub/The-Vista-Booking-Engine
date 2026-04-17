import { NextResponse } from "next/server";
import { PaymobService } from "@/utils/paymob";
import { createClient } from "@supabase/supabase-js";

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

    // 2. Create the "Pending" booking in Supabase first
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
          conversion_rate_used: rate
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Supabase Error:", dbError);
      return NextResponse.json({ error: "Failed to create pending booking" }, { status: 500 });
    }

    // 3. Initiate Paymob handshake with dynamic Redirection URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    // Safety check for production
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_APP_URL) {
      console.warn("⚠️ CRITICAL: NEXT_PUBLIC_APP_URL is missing in production. Paymob will likely fail to redirect.");
    }

    const redirectionUrl = `${baseUrl}/api/payments/paymob/callback?vista_id=${booking.id}&propertyId=${propertyId}&from=${checkIn}&to=${checkOut}&adults=${adults}&children=${children}`;

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
