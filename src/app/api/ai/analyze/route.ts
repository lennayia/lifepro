/**
 * AI Analyze API Route
 * Generování AI analýzy pomocí Claude
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

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
      .from('user_responses')
      .select(
        `
        *,
        questions(question_text, question_type, sections(title, categories(title)))
      `
      )
      .eq('user_id', userId);

    if (responsesError) throw responsesError;

    if (!responses || responses.length === 0) {
      return NextResponse.json(
        { error: 'No responses found. Please complete the questionnaire first.' },
        { status: 400 }
      );
    }

    // Seskupit odpovědi podle kategorií
    const categorizedResponses = responses.reduce((acc: any, response: any) => {
      const category = response.questions.sections.categories.title;
      if (!acc[category]) {
        acc[category] = [];
      }

      const answer =
        response.answer_text ||
        response.answer_single ||
        (response.answer_multiple || []).join(', ') ||
        response.answer_number?.toString() ||
        response.answer_date ||
        'N/A';

      acc[category].push({
        question: response.questions.question_text,
        answer,
        isFavorite: response.is_favorite,
      });

      return acc;
    }, {});

    // Vytvořit prompt pro Claude
    const prompt = `Jsi zkušený life coach a kariérní poradce. Analyzuj následující odpovědi uživatele z dotazníku o životním poslání a najdi klíčové vzorce, hodnoty, dovednosti a zájmy.

${Object.entries(categorizedResponses)
  .map(
    ([category, answers]: [string, any]) => `
## ${category}

${answers
  .map(
    (a: any) =>
      `**${a.question}**${a.isFavorite ? ' ❤️' : ''}
Odpověď: ${a.answer}
`
  )
  .join('\n')}
`
  )
  .join('\n')}

Na základě těchto odpovědí:

1. Identifikuj klíčové **HODNOTY** (co je pro uživatele důležité)
2. Identifikuj klíčové **DOVEDNOSTI** (co umí dobře)
3. Identifikuj klíčové **ZÁJMY** (co ho baví)
4. Identifikuj klíčové **MOTIVACE** (co ho žene dopředu)
5. Najdi **SPOJITOSTI** mezi odpověďmi (opakující se témata)
6. Navrhni **DOPORUČENÍ** pro kariéru nebo životní poslání
7. Upozorni na **SLEPÁ MÍSTA** (oblasti, které uživatel možná přehlíží)

Vrať odpověď ve formátu JSON:

{
  "patterns": {
    "values": ["hodnota1", "hodnota2", ...],
    "skills": ["dovednost1", "dovednost2", ...],
    "interests": ["zájem1", "zájem2", ...],
    "motivations": ["motivace1", "motivace2", ...]
  },
  "suggestions": [
    {
      "title": "Název doporučení",
      "description": "Popis doporučení",
      "category": "Kariéra / Vzdělání / Hobby / Dobrovolnictví"
    }
  ],
  "connections": [
    {
      "theme": "Název tématu",
      "items": ["položka1", "položka2", ...]
    }
  ],
  "blind_spots": [
    {
      "area": "Oblast",
      "description": "Co by měl uživatel zvážit"
    }
  ]
}

DŮLEŽITÉ: Vrať pouze validní JSON, bez dalšího textu.`;

    // Zavolat Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Parsovat odpověď
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    let analysisData;
    try {
      analysisData = JSON.parse(content.text);
    } catch (e) {
      // Pokud odpověď není čisté JSON, zkusit extrahovat JSON z textu
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse Claude response as JSON');
      }
    }

    // Uložit analýzu do databáze
    const { data: analysis, error: analysisError } = await supabase
      .from('ai_analyses')
      .insert({
        user_id: userId,
        patterns: analysisData.patterns,
        suggestions: analysisData.suggestions,
        connections: analysisData.connections || [],
        blind_spots: analysisData.blind_spots || [],
      })
      .select()
      .single();

    if (analysisError) throw analysisError;

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('Error generating analysis:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate analysis' },
      { status: 500 }
    );
  }
}
