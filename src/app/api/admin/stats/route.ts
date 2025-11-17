/**
 * Admin Stats API Route
 * Statistiky pro admin dashboard včetně počtu uživatelů z auth.users
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteClient();

    // Ověřit, že uživatel je přihlášen
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ověřit, že uživatel je admin
    const { data: adminUser, error: adminError } = await supabase
      .from('lifepro_admin_users')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (adminError || !adminUser) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Pro počet uživatelů potřebujeme service role klíč
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Vytvořit admin klienta s service role klíčem
    const supabaseAdmin = createClient<Database>(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Načíst statistiky
    const [
      categoriesRes,
      sectionsRes,
      questionsRes,
      optionsRes,
      responsesRes,
      usersRes,
    ] = await Promise.all([
      supabase.from('lifepro_categories').select('id', { count: 'exact', head: true }),
      supabase.from('lifepro_sections').select('id', { count: 'exact', head: true }),
      supabase.from('lifepro_questions').select('id', { count: 'exact', head: true }),
      supabase.from('lifepro_question_options').select('id', { count: 'exact', head: true }),
      supabase.from('lifepro_user_responses').select('id', { count: 'exact', head: true }),
      supabaseAdmin.auth.admin.listUsers(),
    ]);

    const stats = {
      categories: categoriesRes.count || 0,
      sections: sectionsRes.count || 0,
      questions: questionsRes.count || 0,
      options: optionsRes.count || 0,
      responses: responsesRes.count || 0,
      users: usersRes.data?.users?.length || 0,
    };

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error('Error loading admin stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load stats' },
      { status: 500 }
    );
  }
}
