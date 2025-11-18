/**
 * PDF Export API Route
 * Generování PDF z AI analýzy
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

    // Načíst nejnovější analýzu
    const { data: analysis, error: analysisError } = await supabase
      .from('lifepro_ai_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (analysisError) throw analysisError;

    if (!analysis) {
      return NextResponse.json(
        { error: 'No analysis found. Please generate analysis first.' },
        { status: 400 }
      );
    }

    // Uložit záznam o exportu
    const { error: exportError } = await supabase
      .from('lifepro_user_exports')
      .insert({
        user_id: userId,
        export_type: 'pdf',
        content: {
          analysis_id: analysis.id,
          generated_at: new Date().toISOString(),
        },
      });

    if (exportError) console.error('Error logging export:', exportError);

    // Vrátit data pro PDF generování na klientovi
    return NextResponse.json({
      success: true,
      data: {
        analysis,
        user: {
          email: user.email,
          id: user.id,
        },
      },
    });
  } catch (error: any) {
    console.error('Error preparing PDF export:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to prepare PDF export' },
      { status: 500 }
    );
  }
}
