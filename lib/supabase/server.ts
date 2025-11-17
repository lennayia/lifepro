/**
 * Supabase Client - Server
 * Pro použití v Server Components, API Routes a Server Actions
 */

import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

/**
 * Pro Server Components
 */
export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies });
};

/**
 * Pro API Route Handlers
 */
export const createRouteClient = () => {
  return createRouteHandlerClient<Database>({ cookies });
};

/**
 * Pomocná funkce - získat aktuálního uživatele (server-side)
 */
export const getCurrentUser = async () => {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Pomocná funkce - získat session (server-side)
 */
export const getSession = async () => {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

/**
 * Pomocná funkce - zkontrolovat, zda je uživatel admin
 */
export const isAdmin = async (userId: string): Promise<boolean> => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', userId)
    .single();

  return !error && !!data;
};
