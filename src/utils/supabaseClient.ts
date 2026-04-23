import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client that uses a Clerk JWT for authentication.
 * This allows the client to perform operations that are restricted by RLS.
 */
let anonClient: SupabaseClient | null = null;
const clerkClients: Record<string, SupabaseClient> = {};

export const createClerkSupabaseClient = (clerkToken?: string) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  if (!clerkToken) {
    if (!anonClient) {
      anonClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    return anonClient;
  }

  if (!clerkClients[clerkToken]) {
    clerkClients[clerkToken] = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
  });
  }

  return clerkClients[clerkToken];
};
