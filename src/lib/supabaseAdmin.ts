import { createClient } from '@supabase/supabase-js';

// This client uses the SECRET KEY to bypass RLS. 
// It MUST ONLY be used in Server Actions or API routes.
// NEVER export this to the client (browser).

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!; 

if (!supabaseServiceKey) {
  console.warn("WARNING: SUPABASE_SECRET_KEY is missing. Ghost Bridge will fail.");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});
