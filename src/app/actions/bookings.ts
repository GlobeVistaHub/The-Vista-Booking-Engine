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
    // 1. Fetch CONFIRMED bookings (Blocked forever until checkout)
    const { data: confirmedData, error: confError } = await supabaseAdmin
      .from('bookings')
      .select('property_id, check_in, check_out, status')
      .eq('status', 'confirmed');

    if (confError) {
      console.error("[Ghost-Bridge] Confirmed fetch error:", confError.message);
    }

    // 2. Fetch INTERRUPTED / FAILED CHECKOUT bookings (Blocked for 2 hours only)
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

    // We check for status='interrupted' OR payment_status='failed' to catch all checkout leads
    const { data: interruptedData, error: intError } = await supabaseAdmin
      .from('bookings')
      .select('property_id, check_in, check_out, status')
      .or('status.eq.interrupted,payment_status.eq.failed')
      .gte('created_at', twoHoursAgo.toISOString());

    if (intError) {
      console.error("[Ghost-Bridge] Interrupted fetch error:", intError.message);
    }

    // PENDING ("Reserve Now" leads) are intentionally left out of this fetch. 
    // This leaves the calendar open for other users while preserving your lead.
    const allOccupied = [...(confirmedData || []), ...(interruptedData || [])];

    return allOccupied;
  } catch (err) {
    console.error("[Ghost-Bridge] Fatal server failure:", err);
    return [];
  }
}

/**
 * Admin Tool: Trigger the n8n Dossier manually from the Admin Dashboard
 */
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