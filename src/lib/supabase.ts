import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * The ONE and only Supabase client for the entire app.
 * Token is injected dynamically per-request via setSupabaseToken().
 * This prevents the "Multiple GoTrueClient instances" warning.
 */
let _currentToken: string | null = null;

export const setSupabaseToken = (token: string | null) => {
  _currentToken = token;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    fetch: (url: RequestInfo | URL, options: RequestInit = {}) => {
      const headers = new Headers(options.headers);
      if (_currentToken) {
        headers.set('Authorization', `Bearer ${_currentToken}`);
      }
      return fetch(url, { ...options, headers });
    },
  },
});
