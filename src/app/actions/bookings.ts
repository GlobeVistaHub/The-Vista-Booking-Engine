"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * Ghost Bridge: Server-side fetch for occupancy dates.
 * This bypasses RLS (Row Level Security) because it runs on the server 
 * using the Supabase Secret Key.
 * 
 * Securely returns only property IDs and dates to the guest's browser.
 */
export async function getPublicOccupancyServer() {
  // Use a timestamp to prevent any server-side caching of the database query
  try {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('property_id, check_in, check_out, status')
      .eq('status', 'confirmed'); // Only confirmed bookings block the property for the public

    if (error) {
      console.error("[Ghost-Bridge] Database rejection:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("[Ghost-Bridge] Fatal server failure:", err);
    return [];
  }
}

export async function triggerDossierFromAdmin(bookingId: string) {
  try {
    const { data: booking, error: bError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bError || !booking) {
      console.error("[triggerDossierFromAdmin] Booking fetch failed", bError);
      return { success: false, error: bError?.message };
    }

    const { data: property, error: pError } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('id', booking.property_id)
      .single();

    if (pError || !property) {
      console.error("[triggerDossierFromAdmin] Property fetch failed", pError);
      return { success: false, error: pError?.message };
    }

    // Dynamic import to avoid client-side bundling issues
    const { triggerN8NDossier } = await import('@/lib/n8n-server');
    await triggerN8NDossier(booking, property);

    return { success: true };
  } catch (err: any) {
    console.error("[triggerDossierFromAdmin] Fatal error:", err);
    return { success: false, error: err.message };
  }
}
