"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import BookingCancellation from "@/emails/BookingCancellation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function cancelBookingAction(id: string) {
  const admin = createAdminClient();
  
  // 1. Fetch booking details before updating, so we can email the user
  const { data: booking } = await admin
    .from("bookings")
    .select(`user_id, scheduled_time, services(name), profiles(full_name)`)
    .eq("id", id)
    .single();

  // 2. Update status
  const { error } = await admin.from("bookings").update({ status: "cancelled" }).eq("id", id);
  
  if (error) {
    console.error("Failed to cancel booking:", error);
    return false;
  }
  
  // 3. Send Cancellation Email
  if (booking && process.env.RESEND_API_KEY) {
    try {
      // Get exact email from Auth layer
      const { data: userAuth } = await admin.auth.admin.getUserById(booking.user_id);
      const email = userAuth?.user?.email;
      
      if (email) {
        const dateObj = new Date(booking.scheduled_time);
        const formattedDate = `${dateObj.toLocaleDateString('en-AU', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })} at ${dateObj.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}`;
        
        await resend.emails.send({
          from: 'Auto-Bath Booking <onboarding@resend.dev>',
          to: email,
          subject: 'Booking Cancelled - Auto-Bath',
          react: BookingCancellation({
            customerName: (booking.profiles as any)?.full_name || 'Valued Customer',
            serviceName: (booking.services as any)?.name || 'Auto Detailing',
            date: formattedDate,
          }) as React.ReactElement
        });
        console.log(`Cancellation email sent to ${email}`);
      }
    } catch (e) {
      console.error("Failed to send cancellation email:", e);
    }
  }

  revalidatePath("/admin");
  return true;
}
