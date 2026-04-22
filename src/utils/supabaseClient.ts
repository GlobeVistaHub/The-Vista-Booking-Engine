import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client that uses a Clerk JWT for authentication.
 * This allows the client to perform operations that are restricted by RLS.
 */
export const createClerkSupabaseClient = (clerkToken?: string) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  if (!clerkToken) {
    // Fallback to the standard anon client if no token is provided
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
  });
};
