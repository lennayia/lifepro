/**
 * Supabase Client - Browser
 * Pro použití v Client Components a browser kódu
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Browser client (Next.js 13+ App Router)
 * Používá cookies pro auth
 */
export const createClient = () => {
  return createClientComponentClient<Database>();
};

// Singleton instance pro browser
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient<Database>();
  }
  return supabaseClient;
};

/**
 * Legacy export pro zpětnou kompatibilitu
 */
export const supabase = getSupabaseClient();

/**
 * Admin client (pouze server-side!)
 * POZOR: Používat pouze v API routes nebo server actions
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = supabaseServiceKey
  ? createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;
