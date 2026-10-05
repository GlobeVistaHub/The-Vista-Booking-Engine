"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function cancelBookingAction(id: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("bookings").update({ status: "cancelled" }).eq("id", id);
  
  if (error) {
    console.error("Failed to cancel booking:", error);
    return false;
  }
  
  revalidatePath("/admin");
  return true;
}
