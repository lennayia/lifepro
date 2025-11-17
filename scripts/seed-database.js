#!/usr/bin/env node

/**
 * Seed Database Script
 * Importuje všech 68 JSON kategorií do Supabase
 *
 * Použití:
 *   node scripts/seed-database.js
 *
 * Vyžaduje:
 *   - NEXT_PUBLIC_SUPABASE_URL v .env.local
 *   - SUPABASE_SERVICE_ROLE_KEY v .env.local
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase klient s service role key (admin přístup)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Chybí NEXT_PUBLIC_SUPABASE_URL nebo SUPABASE_SERVICE_ROLE_KEY v .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mapování time_period podle názvu kategorie
const getTimePeriod = (categoryName) => {
  if (categoryName.includes('Přítomnost') || categoryName.includes('jsem')) {
    return 'present';
  } else if (categoryName.includes('Minulost') || categoryName.includes('byl')) {
    return 'past';
  } else if (categoryName.includes('Budoucnost') || categoryName.includes('budu')) {
    return 'future';
  }
  return null;
};

// Mapování question_type podle struktury
const getQuestionType = (item, subcategoryName) => {
  // Pokud je item pole, je to multi-choice
  if (Array.isArray(item)) {
    return 'checkbox';
  }

  // Otázky s hodnotami/škálami
  if (subcategoryName.includes('hodnot') || subcategoryName.includes('priorit')) {
    return 'slider';
  }

  // Otázky s datem
  if (subcategoryName.includes('kdy') || subcategoryName.includes('datum')) {
    return 'date';
  }

  // Default - textarea pro otevřené odpovědi
  return 'textarea';
};

// Hlavní funkce pro seed
async function seedDatabase() {
  console.log('🌱 Začínám seed databáze...\n');

  const dataDir = path.join(__dirname, '../data/categories');
  const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

  console.log(`📁 Nalezeno ${jsonFiles.length} JSON souborů\n`);

  let categoryOrder = 0;
  let totalSections = 0;
  let totalQuestions = 0;
  let totalOptions = 0;

  for (const jsonFile of jsonFiles) {
    const filePath = path.join(dataDir, jsonFile);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log(`📦 Importuji: ${data.name}`);

    // 1. Vytvořit kategorii
    const { data: category, error: categoryError } = await supabase
      .from('lifepro_categories')
      .insert({
        slug: data.id,
        title: data.name,
        description: data.description || null,
        icon: data.icon || '📋',
        time_period: getTimePeriod(data.name),
        order: categoryOrder++,
        is_published: true,
      })
      .select()
      .single();

    if (categoryError) {
      console.error(`   ❌ Chyba při vytváření kategorie:`, categoryError.message);
      continue;
    }

    console.log(`   ✅ Kategorie vytvořena: ${category.id}`);

    // 2. Vytvořit sekce (subcategories)
    if (data.subcategories) {
      let sectionOrder = 0;

      for (const subcategory of data.subcategories) {
        const { data: section, error: sectionError } = await supabase
          .from('lifepro_sections')
          .insert({
            category_id: category.id,
            slug: subcategory.id,
            title: subcategory.name,
            description: null,
            order: sectionOrder++,
            is_published: true,
          })
          .select()
          .single();

        if (sectionError) {
          console.error(`   ❌ Chyba při vytváření sekce:`, sectionError.message);
          continue;
        }

        totalSections++;
        console.log(`      📂 Sekce: ${section.title}`);

        // 3. Vytvořit otázky z items
        if (subcategory.items) {
          let questionOrder = 0;

          for (const item of subcategory.items) {
            // Item může být string nebo objekt
            const questionText = typeof item === 'string' ? item : item.question || item;
            const questionType = getQuestionType(item, subcategory.name);

            const { data: question, error: questionError } = await supabase
              .from('lifepro_questions')
              .insert({
                section_id: section.id,
                slug: `${subcategory.id}-${questionOrder}`,
                question_text: questionText,
                help_text: null,
                question_type: questionType,
                order: questionOrder++,
                is_required: false,
                is_favorite_allowed: true,
                max_favorites: null,
                validation_rules: null,
                is_published: true,
              })
              .select()
              .single();

            if (questionError) {
              console.error(`   ❌ Chyba při vytváření otázky:`, questionError.message);
              continue;
            }

            totalQuestions++;

            // 4. Pokud jsou options, vytvořit je
            if (typeof item === 'object' && item.options) {
              let optionOrder = 0;

              for (const option of item.options) {
                await supabase
                  .from('lifepro_question_options')
                  .insert({
                    question_id: question.id,
                    value: option,
                    label: option,
                    icon: null,
                    order: optionOrder++,
                    is_active: true,
                  });

                totalOptions++;
              }
            }
          }
        }

        // Rekurzivně zpracovat vnořené subcategories
        if (subcategory.subcategories) {
          for (const nestedSubcategory of subcategory.subcategories) {
            const { data: nestedSection, error: nestedSectionError } = await supabase
              .from('lifepro_sections')
              .insert({
                category_id: category.id,
                slug: nestedSubcategory.id,
                title: `${subcategory.name} - ${nestedSubcategory.name}`,
                description: null,
                order: sectionOrder++,
                is_published: true,
              })
              .select()
              .single();

            if (nestedSectionError) {
              console.error(`   ❌ Chyba při vytváření vnořené sekce:`, nestedSectionError.message);
              continue;
            }

            totalSections++;
            console.log(`         📂 Vnořená sekce: ${nestedSection.title}`);

            if (nestedSubcategory.items) {
              let nestedQuestionOrder = 0;

              for (const item of nestedSubcategory.items) {
                const questionText = typeof item === 'string' ? item : item.question || item;
                const questionType = getQuestionType(item, nestedSubcategory.name);

                const { data: question, error: questionError } = await supabase
                  .from('lifepro_questions')
                  .insert({
                    section_id: nestedSection.id,
                    slug: `${nestedSubcategory.id}-${nestedQuestionOrder}`,
                    question_text: questionText,
                    help_text: null,
                    question_type: questionType,
                    order: nestedQuestionOrder++,
                    is_required: false,
                    is_favorite_allowed: true,
                    max_favorites: null,
                    validation_rules: null,
                    is_published: true,
                  })
                  .select()
                  .single();

                if (questionError) {
                  console.error(`   ❌ Chyba při vytváření vnořené otázky:`, questionError.message);
                  continue;
                }

                totalQuestions++;

                if (typeof item === 'object' && item.options) {
                  let optionOrder = 0;

                  for (const option of item.options) {
                    await supabase
                      .from('lifepro_question_options')
                      .insert({
                        question_id: question.id,
                        value: option,
                        label: option,
                        icon: null,
                        order: optionOrder++,
                        is_active: true,
                      });

                    totalOptions++;
                  }
                }
              }
            }
          }
        }
      }
    }

    console.log('');
  }

  console.log('✨ Seed dokončen!\n');
  console.log('📊 Statistiky:');
  console.log(`   📦 Kategorie: ${categoryOrder}`);
  console.log(`   📂 Sekce: ${totalSections}`);
  console.log(`   ❓ Otázky: ${totalQuestions}`);
  console.log(`   ⚙️  Options: ${totalOptions}`);
  console.log('');
}

// Spustit seed
seedDatabase()
  .then(() => {
    console.log('✅ Hotovo!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Chyba:', error);
    process.exit(1);
  });
