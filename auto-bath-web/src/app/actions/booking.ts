"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import Stripe from "stripe";

// Initialize Stripe (we will need STRIPE_SECRET_KEY in .env later)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  // Use the SDK's default API version
});

export async function createBookingAction(formData: {
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  packageId: string;
  date: string;
  time: string;
}) {
  try {
    const supabaseAdmin = createAdminClient();

    // 1. Check if the user already exists in auth.users by email
    // Note: We use the admin API to list users safely on the backend.
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    if (usersError) throw usersError;

    let userId = usersData.users.find((u) => u.email === formData.email)?.id;

    // 2. If user doesn't exist, create a ghost account
    if (!userId) {
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: formData.email,
        email_confirm: true,
        user_metadata: { full_name: formData.name, phone: formData.phone },
      });
      if (createError) throw createError;
      userId = newUser.user.id;

      // Ensure the profile exists (Supabase triggers usually do this, but we'll safely upsert)
      const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
        id: userId,
        full_name: formData.name,
        phone_number: formData.phone,
        role: "customer"
      });
      if (profileError) console.error("Profile Upsert Error:", profileError);
    }

    // 3. Fetch the selected service to get the exact price (Never trust client prices)
    // We map frontend package IDs to the database service names, or just query by name
    const packageMap: Record<string, string> = {
      wash: "Premium Hand Wash",
      interior: "Interior Detailing",
      paint: "Paint Correction",
      ceramic: "Ceramic Coating",
    };
    
    const serviceName = packageMap[formData.packageId];
    const { data: service, error: serviceError } = await supabaseAdmin
      .from("services")
      .select("id, base_price, name")
      .eq("name", serviceName)
      .single();
      
    if (serviceError || !service) throw new Error("Invalid service selected");

    // 4. Construct Timestamp (combining date and time strings safely)
    const scheduledTime = new Date(`${formData.date} ${formData.time}`).toISOString();

    // 5. Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: formData.email,
      line_items: [
        {
          price_data: {
            currency: "aud", // Assuming Australia
            product_data: {
              name: `Auto-Bath: ${service.name}`,
              description: `${formData.vehicle} - Scheduled for ${formData.date} at ${formData.time}`,
            },
            unit_amount: service.base_price, // Price is already in cents in the DB
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // We will create these success/cancel pages later
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/`,
    });

    if (!session.url || !session.id) throw new Error("Failed to create Stripe session");

    // 6. Insert the Booking as 'pending' into Supabase
    const { error: bookingError } = await supabaseAdmin.from("bookings").insert({
      user_id: userId,
      service_id: service.id,
      scheduled_time: scheduledTime,
      vehicle_make: formData.vehicle,
      status: "pending",
      stripe_payment_intent_id: session.id, // Store session ID to track it
    });

    if (bookingError) throw bookingError;

    // 7. Return the Stripe Checkout URL to the client
    return { success: true, checkoutUrl: session.url };
  } catch (error: any) {
    console.error("Booking Action Error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function getBookedSlotsAction() {
  try {
    const supabaseAdmin = createAdminClient();
    
    // Fetch all future bookings that are pending or confirmed
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("scheduled_time")
      .in("status", ["pending", "confirmed"])
      .gte("scheduled_time", new Date().toISOString());

    if (error) throw error;
    
    return { success: true, bookedTimes: data.map(b => b.scheduled_time) };
  } catch (error: any) {
    console.error("Fetch booked slots error:", error);
    return { success: false, bookedTimes: [] };
  }
}
