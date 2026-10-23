import { supabase, setSupabaseToken } from '@/lib/supabase';

/**
 * Returns the single global Supabase client with the Clerk token injected.
 * Never creates a second client — zero GoTrueClient conflicts.
 */
export const createClerkSupabaseClient = (clerkToken?: string) => {
  setSupabaseToken(clerkToken || null);
  return supabase;
};
