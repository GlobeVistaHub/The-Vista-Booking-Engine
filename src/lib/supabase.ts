import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-anon-key';

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
      // Use the appropriate fetch for the environment (browser vs server)
      const fetcher = typeof window !== 'undefined' ? window.fetch : fetch;
      return fetcher(url, { ...options, headers });
    },
  },
});
