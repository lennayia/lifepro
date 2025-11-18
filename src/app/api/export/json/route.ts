/**
 * JSON Export API Route
 * Export všech dat uživatele (odpovědi + analýzy)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    const supabase = createRouteClient();

    // Ověřit, že uživatel je přihlášen
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Načíst všechny odpovědi uživatele
    const { data: responses, error: responsesError } = await supabase
      .from('lifepro_user_responses')
      .select(
        `
        *,
        lifepro_questions!inner(
          question_text,
          question_type,
          lifepro_sections!inner(
            title,
            lifepro_categories!inner(title)
          )
        )
      `
      )
      .eq('user_id', userId);

    if (responsesError) throw responsesError;

    // Načíst všechny analýzy
    const { data: analyses, error: analysesError } = await supabase
      .from('lifepro_ai_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false });

    if (analysesError) throw analysesError;

    // Načíst progress
    const { data: progress, error: progressError } = await supabase
      .from('lifepro_user_progress')
      .select('*')
      .eq('user_id', userId);

    if (progressError) throw progressError;

    const exportData = {
      exported_at: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
      },
      responses: responses || [],
      analyses: analyses || [],
      progress: progress || [],
    };

    // Uložit záznam o exportu
    const { error: exportError } = await supabase
      .from('lifepro_user_exports')
      .insert({
        user_id: userId,
        export_type: 'json',
        content: exportData,
      });

    if (exportError) console.error('Error logging export:', exportError);

    // Vrátit JSON data
    return NextResponse.json({
      success: true,
      data: exportData,
    });
  } catch (error: any) {
    console.error('Error exporting JSON:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to export JSON' },
      { status: 500 }
    );
  }
}
