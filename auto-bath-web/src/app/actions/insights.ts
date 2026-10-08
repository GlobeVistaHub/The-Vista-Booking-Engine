"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { requireAdmin } from "@/utils/admin-auth";
import { revalidatePath } from "next/cache";

export async function getInsightsAction(includeDrafts = false) {
  const supabase = includeDrafts ? createAdminClient() : await createClient();
  
  let query = supabase.from("insights").select("*").order("created_at", { ascending: false });
  
  if (!includeDrafts) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch insights:", error.message, error.code, error.details);
    return { success: false, insights: [] };
  }

  return { success: true, insights: data };
}

export async function getInsightBySlugAction(slug: string, includeDrafts = false) {
  const supabase = includeDrafts ? createAdminClient() : await createClient();
  
  let query = supabase.from("insights").select("*").eq("slug", slug);
  
  if (!includeDrafts) {
    query = query.eq("published", true);
  }

  const { data, error } = await query.single();

  if (error) {
    console.error(`Failed to fetch insight ${slug}:`, error);
    return { success: false, insight: null };
  }

  return { success: true, insight: data };
}

export async function createInsightAction(data: { title: string, slug: string, excerpt: string, content: string, cover_image: string, published: boolean }) {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Not authorized" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("insights").insert([data]);

  if (error) {
    console.error("Failed to create insight:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/insights");
  revalidatePath("/admin/insights");
  return { success: true };
}

export async function updateInsightAction(id: string, data: { title: string, slug: string, excerpt: string, content: string, cover_image: string, published: boolean }) {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Not authorized" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("insights").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id);

  if (error) {
    console.error("Failed to update insight:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/insights");
  revalidatePath(`/insights/${data.slug}`);
  revalidatePath("/admin/insights");
  return { success: true };
}

export async function deleteInsightAction(id: string) {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Not authorized" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("insights").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete insight:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/insights");
  revalidatePath("/admin/insights");
  return { success: true };
}

export async function uploadImageAction(formData: FormData) {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Not authorized" };
  }

  const file = formData.get("file") as File;
  if (!file) return { success: false, error: "No file provided" };

  const admin = createAdminClient();
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `insight-${Date.now()}.${fileExt}`;

  const { data, error } = await admin.storage.from('public-assets').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false
  });

  if (error) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }

  const { data: publicUrlData } = admin.storage.from('public-assets').getPublicUrl(fileName);
  return { success: true, url: publicUrlData.publicUrl };
}
