// Import kategorií z JSON do Supabase
// Spuštění: npm run import:categories

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Načti environment variables z .env.local
config({ path: path.join(__dirname, '../.env.local') });

// Supabase konfigurace (z .env.local)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Service key pro admin operace

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Chybí environment variables!');
  console.error('Potřebuješ: VITE_SUPABASE_URL a SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'lifepro' },
  auth: { persistSession: false }
});

// Pomocná funkce pro vytvoření slug z názvu
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // odstraní diakritiku
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Mapování emoji ikon
const iconMap = {
  'heart': '❤️',
  'brain': '🧠',
  'muscle': '💪',
  'star': '⭐',
  'book': '📚',
  'target': '🎯',
  'lightbulb': '💡',
  // přidáme další podle potřeby
};

// Rekurzivní funkce pro zpracování subcategorií
function flattenSubcategories(subcategories, parentPath = '', level = 0) {
  const sections = [];
  const questions = [];

  subcategories.forEach((subcat, index) => {
    const sectionSlug = `${parentPath}${subcat.id}`;

    const section = {
      slug: sectionSlug,
      title: subcat.name,
      description: subcat.description || null,
      order: index,
      is_published: true,
      level: level,
      parent_slug: parentPath ? parentPath.slice(0, -1) : null, // odstraní poslední "-"
    };

    sections.push(section);

    // Pokud má items, vytvoř z nich otázky
    if (subcat.items && subcat.items.length > 0) {
      subcat.items.forEach((item, itemIndex) => {
        const questionSlug = `${sectionSlug}-${slugify(item)}`;

        const question = {
          section_slug: sectionSlug,
          slug: questionSlug,
          question_text: item,
          help_text: null,
          question_type: 'checkbox',
          order: itemIndex,
          is_required: false,
          is_favorite_allowed: true,
          max_favorites: 3,
          is_published: true,
        };

        questions.push(question);
      });
    }

    // Pokud má vnořené subcategories, zpracuj je rekurzivně
    if (subcat.subcategories && subcat.subcategories.length > 0) {
      const nested = flattenSubcategories(
        subcat.subcategories,
        `${sectionSlug}-`,
        level + 1
      );
      sections.push(...nested.sections);
      questions.push(...nested.questions);
    }
  });

  return { sections, questions };
}

// Zpracování jednoho JSON souboru
async function processCategoryFile(filePath, orderIndex) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    console.log(`\n📁 Zpracovávám: ${data.name} (${data.id})`);

    // 1. Vytvoř kategorii
    const category = {
      slug: data.id,
      title: data.name,
      description: data.description || null,
      icon: iconMap[data.icon] || data.icon || '📋',
      time_period: 'present', // můžeme upravit podle potřeby
      order: orderIndex,
      is_published: true,
    };

    // 2. Zpracuj subcategories
    const { sections, questions } = data.subcategories
      ? flattenSubcategories(data.subcategories)
      : { sections: [], questions: [] };

    console.log(`  ✓ Kategorie: ${data.name}`);
    console.log(`  ✓ Sekce: ${sections.length}`);
    console.log(`  ✓ Otázky: ${questions.length}`);

    return { category, sections, questions };
  } catch (error) {
    console.error(`❌ Chyba při zpracování ${filePath}:`, error.message);
    return null;
  }
}

// Hlavní import funkce
async function importCategories() {
  console.log('🚀 Začínám import kategorií do Supabase...\n');

  const categoriesDir = path.join(__dirname, '../data/categories');

  try {
    // Načti všechny JSON soubory
    const files = await fs.readdir(categoriesDir);
    const jsonFiles = files
      .filter(f => f.endsWith('.json'))
      .sort(); // seřadí abecedně

    console.log(`📊 Nalezeno ${jsonFiles.length} kategorií\n`);

    // Zpracuj všechny soubory
    const allData = [];
    for (let i = 0; i < jsonFiles.length; i++) {
      const filePath = path.join(categoriesDir, jsonFiles[i]);
      const result = await processCategoryFile(filePath, i + 1);
      if (result) {
        allData.push(result);
      }
    }

    console.log('\n📤 Nahrávám do Supabase...\n');

    // 1. Import kategorií
    console.log('1️⃣ Importuji kategorie...');
    const categories = allData.map(d => d.category);
    const { data: insertedCategories, error: catError } = await supabase
      .from('lifepro_categories')
      .upsert(categories, { onConflict: 'slug' })
      .select();

    if (catError) {
      console.error('❌ Chyba při importu kategorií:', catError);
      return;
    }
    console.log(`✅ Naimportováno ${insertedCategories.length} kategorií`);

    // Vytvoř mapu slug -> category_id
    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });

    // 2. Import sekcí
    console.log('\n2️⃣ Importuji sekce...');
    const allSections = [];
    allData.forEach(({ category, sections }) => {
      sections.forEach(section => {
        allSections.push({
          ...section,
          category_id: categoryMap[category.slug],
        });
      });
    });

    const { data: insertedSections, error: secError } = await supabase
      .from('lifepro_sections')
      .upsert(allSections, { onConflict: 'category_id,slug' })
      .select();

    if (secError) {
      console.error('❌ Chyba při importu sekcí:', secError);
      return;
    }
    console.log(`✅ Naimportováno ${insertedSections.length} sekcí`);

    // Vytvoř mapu slug -> section_id
    const sectionMap = {};
    insertedSections.forEach(sec => {
      sectionMap[sec.slug] = sec.id;
    });

    // 3. Import otázek
    console.log('\n3️⃣ Importuji otázky...');
    const allQuestions = [];
    allData.forEach(({ questions }) => {
      questions.forEach(question => {
        const sectionId = sectionMap[question.section_slug];
        if (sectionId) {
          // Vyřaď section_slug pomocí destructuringu
          const { section_slug, ...questionData } = question;
          allQuestions.push({
            ...questionData,
            section_id: sectionId,
          });
        }
      });
    });

    const { data: insertedQuestions, error: qError } = await supabase
      .from('lifepro_questions')
      .upsert(allQuestions, { onConflict: 'section_id,slug' })
      .select();

    if (qError) {
      console.error('❌ Chyba při importu otázek:', qError);
      return;
    }
    console.log(`✅ Naimportováno ${insertedQuestions.length} otázek`);

    // Shrnutí
    console.log('\n' + '='.repeat(50));
    console.log('🎉 IMPORT DOKONČEN!');
    console.log('='.repeat(50));
    console.log(`📊 Kategorie: ${insertedCategories.length}`);
    console.log(`📁 Sekce: ${insertedSections.length}`);
    console.log(`❓ Otázky: ${insertedQuestions.length}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Kritická chyba:', error);
  }
}

// Spusť import
importCategories();
