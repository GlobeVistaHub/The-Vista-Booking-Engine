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
  origin?: string;
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
    // Map frontend package IDs to primary service IDs (fallback to names)
    const packageIdMap: Record<string, string> = {
      wash: "c2a502e8-e825-4876-b459-9334e801e363",
      interior: "a92d99bf-11be-4afb-9860-5844233d2899",
      paint: "4b293e74-9b13-4af4-8901-49ac014ad043",
      concourse: "49d0b87f-744d-4bf8-9821-2df1f9c67a60",
      ceramic: "f90656aa-808f-41f4-a789-7dcf6a934df8",
      ppf: "7d2e4a81-9b51-4e1a-8f12-9c3f6e8a0112",
      leather: "5c3d1e92-8a40-4d2b-9e23-8b2e5f7a0223",
      engine: "3b1c9d83-7f39-4c3a-8d34-7a1e4d6a0334",
      graphene: "9e4f1a2b-3c5d-4e6f-8a0b-1c2d3e4f5a6b",
    };

    const packageMap: Record<string, string> = {
      wash: "Premium Hand Wash",
      interior: "Interior Detailing",
      paint: "Paint Correction",
      ceramic: "Ceramic Coating",
      concourse: "Concourse Full Detail",
      ppf: "Paint Protection Film (PPF)",
      leather: "Leather Hide Rejuvenation",
      engine: "Engine Bay Precision Detail",
      graphene: "Graphene Matrix 10H Coating",
    };
    
    const targetId = packageIdMap[formData.packageId];
    let serviceQuery = supabaseAdmin.from("services").select("id, base_price, name");
    if (targetId) {
      serviceQuery = serviceQuery.eq("id", targetId);
    } else {
      serviceQuery = serviceQuery.eq("name", packageMap[formData.packageId]);
    }

    const { data: service, error: serviceError } = await serviceQuery.single();
      
    if (serviceError || !service) throw new Error("Invalid service selected");

    // 4. Construct literal UTC Timestamp to avoid server timezone shifts
    // Parse "Tue Oct 06 2026" and "01:00 PM" into "2026-10-06T13:00:00.000Z"
    const parsedDate = new Date(formData.date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    
    const [timeStr, modifier] = formData.time.split(' ');
    let [hours, minutes] = timeStr.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
    hours = hours.padStart(2, '0');
    
    const scheduledTime = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;

    // Query site_content for custom package title fallback
    const { data: customTitleRow } = await supabaseAdmin
      .from("site_content")
      .select("value")
      .eq("key", `service_title_${formData.packageId}`)
      .maybeSingle();
    const checkoutServiceName = customTitleRow?.value || service.name;

    // 5. Create a Stripe Checkout Session
    const baseUrl = formData.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
      customer_email: formData.email,
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: checkoutServiceName,
              description: `${formData.vehicle} - ${formData.date} at ${formData.time}`,
            },
            unit_amount: service.base_price, // base_price should be in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        customer_email: formData.email,
        service_name: checkoutServiceName,
        vehicle: formData.vehicle,
        date: formData.date,
        time: formData.time,
      }
    });

    if (!session.url || !session.id) {
      throw new Error("Failed to create Stripe Checkout Session");
    }

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

    // 7. Return the Checkout URL to the client to redirect
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
