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
  try {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('property_id, check_in, check_out')
      .eq('status', 'confirmed');

    if (error) {
      console.error("[Ghost-Bridge] Database rejection:", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("[Ghost-Bridge] No occupancy found (0 bookings reported).");
    }

    return data || [];
  } catch (err) {
    console.error("[Ghost-Bridge] Fatal server failure:", err);
    return [];
  }
}
