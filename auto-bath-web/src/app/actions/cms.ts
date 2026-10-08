"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { requireAdmin } from "@/utils/admin-auth";
import { revalidatePath } from "next/cache";

export async function getSiteContentAction() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_content").select("key, value");
  
  if (error) {
    console.error("Failed to fetch site content:", error);
    return { success: false, content: {} as Record<string, string> };
  }

  const contentMap: Record<string, string> = {};
  data.forEach((row) => {
    contentMap[row.key] = row.value;
  });

  return { success: true, content: contentMap };
}

export async function updateSiteContentAction(updates: Record<string, string>) {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Not authorized" };
  }

  const admin = createAdminClient();
  
  // Convert map to array of upserts
  const upserts = Object.entries(updates).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString()
  }));

  const { error } = await admin
    .from("site_content")
    .upsert(upserts, { onConflict: 'key' });

  if (error) {
    console.error("Failed to update CMS content:", error);
    return { success: false, error: "Failed to save content." };
  }

  // Revalidate the entire site so all pages fetching CMS data are updated instantly
  revalidatePath("/", "layout");
  return { success: true };
}

export async function getServicesAction() {
  const admin = createAdminClient();
  const { data, error } = await admin.from("services").select("id, name, base_price").order("base_price", { ascending: true });
  
  if (error) {
    console.error("Failed to fetch services:", error);
    return { success: false, services: [] };
  }
  
  return { success: true, services: data };
}

export async function updateServicePriceAction(id: string, newPriceCents: number) {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Not authorized" };
  }

  const admin = createAdminClient();
  
  const { error } = await admin
    .from("services")
    .update({ base_price: newPriceCents })
    .eq("id", id);

  if (error) {
    console.error("Failed to update service price:", error);
    return { success: false, error: "Failed to update price." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
