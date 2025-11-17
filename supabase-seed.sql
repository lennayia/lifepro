-- ============================================
-- LIFEPRO SEED DATA
-- Základní data pro MVP (kategorie, sekce, otázky)
-- ============================================

-- ============================================
-- 1. KATEGORIE (8 hlavních dimenzí)
-- ============================================

-- Vymazat existující příkladová data
DELETE FROM question_options;
DELETE FROM questions;
DELETE FROM sections;
DELETE FROM categories;

-- Přítomnost (Present)
INSERT INTO categories (slug, title, description, icon, time_period, "order", is_published) VALUES
  ('ja-jsem', 'Já jsem', 'Kdo jsem v současnosti - role, sebepojetí, priority, charakter', '👤', 'present', 1, true),
  ('vim', 'Vím', 'Moje vzdělání, zkušenosti, znalosti, certifikace', '🎓', 'present', 2, true),
  ('umim', 'Umím', 'Co umím dobře - dovednosti, kompetence, talenty', '💪', 'present', 3, true),
  ('mam-rada', 'Mám rád/a', 'Co mě baví, zajímá, těší - hodnoty, zájmy, činnosti', '❤️', 'present', 4, true);

-- Minulost (Past)
INSERT INTO categories (slug, title, description, icon, time_period, "order", is_published) VALUES
  ('bavilo-me', 'Bavilo mě', 'Co jsem měl/a rád/a v minulosti - sny, úspěchy, zdroje', '✨', 'past', 5, true),
  ('chtel-jsem', 'Chtěl/a jsem', 'Moje sny a přání z minulosti', '🌟', 'past', 6, true);

-- Budoucnost (Future)
INSERT INTO categories (slug, title, description, icon, time_period, "order", is_published) VALUES
  ('chci', 'Chci', 'Moje představy o budoucnosti - ideální život, mise', '🚀', 'future', 7, true),
  ('muzu', 'Můžu', 'Moje možnosti a příležitosti - co můžu udělat', '💡', 'future', 8, true);

-- ============================================
-- 2. SEKCE (podkategorie)
-- ============================================

-- JÁ JSEM (Přítomnost)
INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'role', 'Role v životě', 'Jaké role v životě hrajete? V rodičovství, partnerství, práci, přátelství...', 1, true
FROM categories WHERE slug = 'ja-jsem';

INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'sebepojetí', 'Sebepojetí', 'Jak se vidíte? Jaký jste člověk?', 2, true
FROM categories WHERE slug = 'ja-jsem';

INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'priority', 'Priority', 'Co je pro vás v životě důležité?', 3, true
FROM categories WHERE slug = 'ja-jsem';

INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'charakter', 'Charakter a osobnost', 'Jaké jsou vaše vlastnosti, povaha, temperament?', 4, true
FROM categories WHERE slug = 'ja-jsem';

-- VÍM (Vzdělání a znalosti)
INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'vzdelani', 'Vzdělání', 'Formální vzdělání - školy, univerzity, certifikace', 1, true
FROM categories WHERE slug = 'vim';

INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'kurzy', 'Kurzy a školení', 'Neformální vzdělávání - kurzy, workshopy, webináře', 2, true
FROM categories WHERE slug = 'vim';

INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'zkusenosti', 'Životní zkušenosti', 'Praktické znalosti získané zkušeností', 3, true
FROM categories WHERE slug = 'vim';

-- UMÍM (Dovednosti)
INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'dovednosti-hlavou', 'Umím hlavou', 'Intelektuální dovednosti - analyzovat, plánovat, tvořit...', 1, true
FROM categories WHERE slug = 'umim';

INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'dovednosti-rukama', 'Umím rukama', 'Praktické dovednosti - vytvářet, opravovat, tvořit...', 2, true
FROM categories WHERE slug = 'umim';

INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'dovednosti-socialni', 'Sociální dovednosti', 'Komunikace, vedení lidí, empatie...', 3, true
FROM categories WHERE slug = 'umim';

INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'umim-resit', 'Umím řešit', 'Jaké problémy dokážete řešit?', 4, true
FROM categories WHERE slug = 'umim';

-- MÁM RÁD/A (Zájmy a hodnoty)
INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'hodnoty', 'Hodnoty', 'Co je pro vás důležité? Pravda, krása, spravedlnost...', 1, true
FROM categories WHERE slug = 'mam-rada';

INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'zajmy-planeta', 'Planeta Země', 'Příroda, počasí, zvířata, ochrana prostředí...', 2, true
FROM categories WHERE slug = 'mam-rada';

INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'zajmy-cinnosti', 'Činnosti', 'Co rádi děláte? Sport, vaření, cestování...', 3, true
FROM categories WHERE slug = 'mam-rada';

INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'flow', 'Flow a radost', 'V čem ztrácíte pojem o čase?', 4, true
FROM categories WHERE slug = 'mam-rada';

-- BAVILO MĚ (Minulost)
INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'sny-minulost', 'Sny z minulosti', 'Co jste chtěl/a být, když jste byl/a malý/á?', 1, true
FROM categories WHERE slug = 'bavilo-me';

INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'uspechy', 'Úspěchy a zdroje', 'Na co jste v životě hrdý/á?', 2, true
FROM categories WHERE slug = 'bavilo-me';

-- CHTĚL/A JSEM (Minulost)
INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'nesplnene-sny', 'Nesplněné sny', 'Co jste chtěl/a dokázat, ale zatím se to nestalo?', 1, true
FROM categories WHERE slug = 'chtel-jsem';

-- CHCI (Budoucnost)
INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'idealni-zivot', 'Ideální život', 'Jak vypadá váš ideální den/týden/rok?', 1, true
FROM categories WHERE slug = 'chci';

INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'mise-poslani', 'Mise a poslání', 'Čemu se chcete věnovat? Co chcete dokázat?', 2, true
FROM categories WHERE slug = 'chci';

-- MŮŽU (Možnosti)
INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'moznosti', 'Moje možnosti', 'Co všechno můžete udělat? Jaké máte příležitosti?', 1, true
FROM categories WHERE slug = 'muzu';

INSERT INTO sections (category_id, slug, title, description, "order", is_published)
SELECT id, 'potrebuju', 'Potřebuji', 'Co potřebujete k dosažení svých cílů?', 2, true
FROM categories WHERE slug = 'muzu';

-- ============================================
-- 3. OTÁZKY (ukázkové - MVP)
-- ============================================

-- SEKCE: Role v životě
INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_favorite_allowed, max_favorites, is_published)
SELECT id, 'momentalne-jsem', 'Momentálně jsem a pracuji jako...',
'Vyberte všechny role, které momentálně zastáváte. Můžete označit až 3 nejdůležitější srdcovkou.',
'checkbox', 1, true, 3, true
FROM sections WHERE slug = 'role';

INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_published)
SELECT id, 'role-popis', 'Popište vaše hlavní role v životě vlastními slovy',
'Např: "Jsem matka, podnikatelka a mentorka"',
'textarea', 2, false, true
FROM sections WHERE slug = 'role';

-- SEKCE: Sebepojetí
INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_favorite_allowed, max_favorites, is_published)
SELECT id, 'vlastnosti', 'Jaké jsou vaše klíčové vlastnosti?',
'Vyberte vlastnosti, které vás nejvíc vystihují',
'checkbox', 1, true, 5, true
FROM sections WHERE slug = 'sebepojetí';

INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_published)
SELECT id, 'jak-me-vidi', 'Jak vás vidí ostatní?',
'Co o vás říkají přátelé, rodina, kolegové?',
'textarea', 2, false, true
FROM sections WHERE slug = 'sebepojetí';

-- SEKCE: Priority
INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_favorite_allowed, max_favorites, is_published)
SELECT id, 'priority-hodnoty', 'Co je pro vás v životě nejdůležitější?',
'Vyberte top 5 hodnot a označte 3 nejvyšší priority srdcovkou',
'checkbox', 1, true, 3, true
FROM sections WHERE slug = 'priority';

-- SEKCE: Vzdělání
INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_published)
SELECT id, 'vzdelani-formalni', 'Jaké máte formální vzdělání?',
'Např: SŠ, VŠ - obor, certifikace...',
'textarea', 1, false, true
FROM sections WHERE slug = 'vzdelani';

INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_published)
SELECT id, 'obor-studia', 'V jakém oboru jste studoval/a?',
'Např: ekonomie, IT, umění, zdravotnictví...',
'text', 2, false, true
FROM sections WHERE slug = 'vzdelani';

-- SEKCE: Dovednosti hlavou
INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_favorite_allowed, max_favorites, is_published)
SELECT id, 'intelektualni-dovednosti', 'Co umíte dělat hlavou?',
'Vyberte intelektuální dovednosti, které máte',
'checkbox', 1, true, 5, true
FROM sections WHERE slug = 'dovednosti-hlavou';

INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_published)
SELECT id, 'doved-priklad', 'Uveďte konkrétní příklad, kdy jste tuto dovednost použil/a',
'Např: "Vytvořil jsem strategii pro nový produkt"',
'textarea', 2, false, true
FROM sections WHERE slug = 'dovednosti-hlavou';

-- SEKCE: Dovednosti rukama
INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_favorite_allowed, max_favorites, is_published)
SELECT id, 'prakticke-dovednosti', 'Co umíte dělat rukama?',
'Praktické dovednosti - řemesla, tvoření, opravy...',
'checkbox', 1, true, 5, true
FROM sections WHERE slug = 'dovednosti-rukama';

-- SEKCE: Sociální dovednosti
INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_favorite_allowed, max_favorites, is_published)
SELECT id, 'socialni-dovednosti', 'Jaké jsou vaše sociální dovednosti?',
'Komunikace, empatie, vedení, týmová práce...',
'checkbox', 1, true, 5, true
FROM sections WHERE slug = 'dovednosti-socialni';

-- SEKCE: Hodnoty
INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_favorite_allowed, max_favorites, is_published)
SELECT id, 'zakladni-hodnoty', 'Jaké jsou vaše základní životní hodnoty?',
'Co je pro vás v životě nejdůležitější? Vyberte až 10 hodnot a označte top 3 srdcovkou',
'checkbox', 1, true, 3, true
FROM sections WHERE slug = 'hodnoty';

-- SEKCE: Činnosti
INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_favorite_allowed, max_favorites, is_published)
SELECT id, 'oblibene-cinnosti', 'Co rádi děláte?',
'Vyberte činnosti, které vás baví',
'checkbox', 1, true, 5, true
FROM sections WHERE slug = 'zajmy-cinnosti';

INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_published)
SELECT id, 'kolik-casu', 'Kolik času těmto činnostem věnujete týdně?',
'Uveďte přibližný počet hodin',
'text', 2, false, true
FROM sections WHERE slug = 'zajmy-cinnosti';

-- SEKCE: Flow a radost
INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_published)
SELECT id, 'flow-stav', 'V čem ztrácíte pojem o čase?',
'Popište činnost, při které zapomínáte na vše ostatní',
'textarea', 1, false, true
FROM sections WHERE slug = 'flow';

INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_published)
SELECT id, 'radost-z-prace', 'Co vám přináší největší radost při práci?',
'Např: tvořit nové věci, pomáhat lidem, řešit problémy...',
'textarea', 2, false, true
FROM sections WHERE slug = 'flow';

-- SEKCE: Ideální život
INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_published)
SELECT id, 'idealni-den', 'Popište váš ideální pracovní den',
'Jak vypadá váš vysněný den od rána do večera?',
'textarea', 1, false, true
FROM sections WHERE slug = 'idealni-zivot';

INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_published)
SELECT id, 'za-5-let', 'Kde se vidíte za 5 let?',
'Co děláte? S kým? Kde?',
'textarea', 2, false, true
FROM sections WHERE slug = 'idealni-zivot';

-- SEKCE: Mise a poslání
INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_published)
SELECT id, 'pomoc-lidem', 'Komu chcete pomáhat?',
'Jakou skupinu lidí chcete svou prací podporovat?',
'textarea', 1, false, true
FROM sections WHERE slug = 'mise-poslani';

INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_published)
SELECT id, 'odkaz', 'Jaký odkaz chcete zanechat?',
'Co má být vaším přínosem světu?',
'textarea', 2, false, true
FROM sections WHERE slug = 'mise-poslani';

-- ============================================
-- 4. MOŽNOSTI ODPOVĚDÍ (question_options)
-- ============================================

-- ROLE: Momentálně jsem
INSERT INTO question_options (question_id, value, label, "order", is_active)
SELECT id, 'materska', 'na mateřské/rodičovské', 1, true FROM questions WHERE slug = 'momentalne-jsem'
UNION ALL
SELECT id, 'osvc', 'OSVČ', 2, true FROM questions WHERE slug = 'momentalne-jsem'
UNION ALL
SELECT id, 'zamestnanec', 'zaměstnanec/zaměstnankyně', 3, true FROM questions WHERE slug = 'momentalne-jsem'
UNION ALL
SELECT id, 'student', 'student/ka', 4, true FROM questions WHERE slug = 'momentalne-jsem'
UNION ALL
SELECT id, 'pracak', 'na úřadu práce', 5, true FROM questions WHERE slug = 'momentalne-jsem'
UNION ALL
SELECT id, 'brigada', 'na brigádě', 6, true FROM questions WHERE slug = 'momentalne-jsem'
UNION ALL
SELECT id, 'podnikatel', 'podnikatel/ka', 7, true FROM questions WHERE slug = 'momentalne-jsem'
UNION ALL
SELECT id, 'freelancer', 'freelancer', 8, true FROM questions WHERE slug = 'momentalne-jsem'
UNION ALL
SELECT id, 'doma', 'v domácnosti', 9, true FROM questions WHERE slug = 'momentalne-jsem'
UNION ALL
SELECT id, 'duchod', 'v důchodu', 10, true FROM questions WHERE slug = 'momentalne-jsem';

-- VLASTNOSTI (Velká pětka + další)
INSERT INTO question_options (question_id, value, label, "order", is_active)
SELECT id, 'otevrenost', 'otevřený/á novým zkušenostem', 1, true FROM questions WHERE slug = 'vlastnosti'
UNION ALL
SELECT id, 'svedomitost', 'svědomitý/á', 2, true FROM questions WHERE slug = 'vlastnosti'
UNION ALL
SELECT id, 'extraverze', 'extrovertní', 3, true FROM questions WHERE slug = 'vlastnosti'
UNION ALL
SELECT id, 'privetivost', 'přívětivý/á', 4, true FROM questions WHERE slug = 'vlastnosti'
UNION ALL
SELECT id, 'neuroticismus', 'citlivý/á na stres', 5, true FROM questions WHERE slug = 'vlastnosti'
UNION ALL
SELECT id, 'kreativni', 'kreativní', 6, true FROM questions WHERE slug = 'vlastnosti'
UNION ALL
SELECT id, 'analyticke', 'analytický/á', 7, true FROM questions WHERE slug = 'vlastnosti'
UNION ALL
SELECT id, 'empaticke', 'empatický/á', 8, true FROM questions WHERE slug = 'vlastnosti'
UNION ALL
SELECT id, 'samostatny', 'samostatný/á', 9, true FROM questions WHERE slug = 'vlastnosti'
UNION ALL
SELECT id, 'spolehlive', 'spolehlivý/á', 10, true FROM questions WHERE slug = 'vlastnosti'
UNION ALL
SELECT id, 'odvazny', 'odvážný/á', 11, true FROM questions WHERE slug = 'vlastnosti'
UNION ALL
SELECT id, 'terpelive', 'trpělivý/á', 12, true FROM questions WHERE slug = 'vlastnosti';

-- HODNOTY (základní)
INSERT INTO question_options (question_id, value, label, "order", is_active)
SELECT id, 'rodina', 'rodina', 1, true FROM questions WHERE slug = 'zakladni-hodnoty'
UNION ALL
SELECT id, 'zdravi', 'zdraví', 2, true FROM questions WHERE slug = 'zakladni-hodnoty'
UNION ALL
SELECT id, 'svoboda', 'svoboda', 3, true FROM questions WHERE slug = 'zakladni-hodnoty'
UNION ALL
SELECT id, 'laska', 'láska', 4, true FROM questions WHERE slug = 'zakladni-hodnoty'
UNION ALL
SELECT id, 'pravda', 'pravda', 5, true FROM questions WHERE slug = 'zakladni-hodnoty'
UNION ALL
SELECT id, 'krasa', 'krása', 6, true FROM questions WHERE slug = 'zakladni-hodnoty'
UNION ALL
SELECT id, 'spravedlnost', 'spravedlnost', 7, true FROM questions WHERE slug = 'zakladni-hodnoty'
UNION ALL
SELECT id, 'vzdelani', 'vzdělání', 8, true FROM questions WHERE slug = 'zakladni-hodnoty'
UNION ALL
SELECT id, 'penize', 'peníze a stabilita', 9, true FROM questions WHERE slug = 'zakladni-hodnoty'
UNION ALL
SELECT id, 'uspech', 'úspěch a uznání', 10, true FROM questions WHERE slug = 'zakladni-hodnoty'
UNION ALL
SELECT id, 'kreativita', 'kreativita', 11, true FROM questions WHERE slug = 'zakladni-hodnoty'
UNION ALL
SELECT id, 'pomoc', 'pomoc druhým', 12, true FROM questions WHERE slug = 'zakladni-hodnoty'
UNION ALL
SELECT id, 'priroda', 'příroda a ekologie', 13, true FROM questions WHERE slug = 'zakladni-hodnoty'
UNION ALL
SELECT id, 'duchovno', 'duchovní růst', 14, true FROM questions WHERE slug = 'zakladni-hodnoty'
UNION ALL
SELECT id, 'pratelstvi', 'přátelství', 15, true FROM questions WHERE slug = 'zakladni-hodnoty';

-- INTELEKTUÁLNÍ DOVEDNOSTI
INSERT INTO question_options (question_id, value, label, "order", is_active)
SELECT id, 'analyzovat', 'analyzovat data', 1, true FROM questions WHERE slug = 'intelektualni-dovednosti'
UNION ALL
SELECT id, 'planovat', 'plánovat a organizovat', 2, true FROM questions WHERE slug = 'intelektualni-dovednosti'
UNION ALL
SELECT id, 'strategicky', 'strategicky myslet', 3, true FROM questions WHERE slug = 'intelektualni-dovednosti'
UNION ALL
SELECT id, 'resit', 'řešit problémy', 4, true FROM questions WHERE slug = 'intelektualni-dovednosti'
UNION ALL
SELECT id, 'tvorit', 'tvořit nové nápady', 5, true FROM questions WHERE slug = 'intelektualni-dovednosti'
UNION ALL
SELECT id, 'psat', 'psát a komunikovat', 6, true FROM questions WHERE slug = 'intelektualni-dovednosti'
UNION ALL
SELECT id, 'ucit', 'učit a sdílet znalosti', 7, true FROM questions WHERE slug = 'intelektualni-dovednosti'
UNION ALL
SELECT id, 'vyzkum', 'provádět výzkum', 8, true FROM questions WHERE slug = 'intelektualni-dovednosti'
UNION ALL
SELECT id, 'kriticky', 'kriticky myslet', 9, true FROM questions WHERE slug = 'intelektualni-dovednosti'
UNION ALL
SELECT id, 'syntetizovat', 'spojovat informace', 10, true FROM questions WHERE slug = 'intelektualni-dovednosti';

-- PRAKTICKÉ DOVEDNOSTI
INSERT INTO question_options (question_id, value, label, "order", is_active)
SELECT id, 'remeslo', 'řemeslné práce', 1, true FROM questions WHERE slug = 'prakticke-dovednosti'
UNION ALL
SELECT id, 'design', 'design a tvorba', 2, true FROM questions WHERE slug = 'prakticke-dovednosti'
UNION ALL
SELECT id, 'vareni', 'vaření a pečení', 3, true FROM questions WHERE slug = 'prakticke-dovednosti'
UNION ALL
SELECT id, 'zahradnictvi', 'zahradničení', 4, true FROM questions WHERE slug = 'prakticke-dovednosti'
UNION ALL
SELECT id, 'opravy', 'opravy a údržba', 5, true FROM questions WHERE slug = 'prakticke-dovednosti'
UNION ALL
SELECT id, 'umeni', 'umělecká tvorba', 6, true FROM questions WHERE slug = 'prakticke-dovednosti'
UNION ALL
SELECT id, 'fotografie', 'fotografie a video', 7, true FROM questions WHERE slug = 'prakticke-dovednosti'
UNION ALL
SELECT id, 'hudba', 'hra na nástroj', 8, true FROM questions WHERE slug = 'prakticke-dovednosti'
UNION ALL
SELECT id, 'sport', 'sport a pohyb', 9, true FROM questions WHERE slug = 'prakticke-dovednosti'
UNION ALL
SELECT id, 'it', 'IT a programování', 10, true FROM questions WHERE slug = 'prakticke-dovednosti';

-- SOCIÁLNÍ DOVEDNOSTI
INSERT INTO question_options (question_id, value, label, "order", is_active)
SELECT id, 'komunikace', 'komunikace', 1, true FROM questions WHERE slug = 'socialni-dovednosti'
UNION ALL
SELECT id, 'empatie', 'empatie', 2, true FROM questions WHERE slug = 'socialni-dovednosti'
UNION ALL
SELECT id, 'vedeni', 'vedení lidí', 3, true FROM questions WHERE slug = 'socialni-dovednosti'
UNION ALL
SELECT id, 'tym', 'týmová práce', 4, true FROM questions WHERE slug = 'socialni-dovednosti'
UNION ALL
SELECT id, 'konflikt', 'řešení konfliktů', 5, true FROM questions WHERE slug = 'socialni-dovednosti'
UNION ALL
SELECT id, 'prezentace', 'prezentování', 6, true FROM questions WHERE slug = 'socialni-dovednosti'
UNION ALL
SELECT id, 'vyjednani', 'vyjednávání', 7, true FROM questions WHERE slug = 'socialni-dovednosti'
UNION ALL
SELECT id, 'mentoring', 'mentorování', 8, true FROM questions WHERE slug = 'socialni-dovednosti'
UNION ALL
SELECT id, 'naslouchani', 'aktivní naslouchání', 9, true FROM questions WHERE slug = 'socialni-dovednosti'
UNION ALL
SELECT id, 'networking', 'networking', 10, true FROM questions WHERE slug = 'socialni-dovednosti';

-- ČINNOSTI
INSERT INTO question_options (question_id, value, label, "order", is_active)
SELECT id, 'cteni', 'čtení', 1, true FROM questions WHERE slug = 'oblibene-cinnosti'
UNION ALL
SELECT id, 'psani', 'psaní', 2, true FROM questions WHERE slug = 'oblibene-cinnosti'
UNION ALL
SELECT id, 'sport-c', 'sport a pohyb', 3, true FROM questions WHERE slug = 'oblibene-cinnosti'
UNION ALL
SELECT id, 'vareni-c', 'vaření', 4, true FROM questions WHERE slug = 'oblibene-cinnosti'
UNION ALL
SELECT id, 'cestovani', 'cestování', 5, true FROM questions WHERE slug = 'oblibene-cinnosti'
UNION ALL
SELECT id, 'uceni', 'učení se novým věcem', 6, true FROM questions WHERE slug = 'oblibene-cinnosti'
UNION ALL
SELECT id, 'hudba-c', 'hudba (hra nebo poslech)', 7, true FROM questions WHERE slug = 'oblibene-cinnosti'
UNION ALL
SELECT id, 'tvoreni-c', 'tvoření (umění, design, DIY)', 8, true FROM questions WHERE slug = 'oblibene-cinnosti'
UNION ALL
SELECT id, 'priroda-c', 'čas v přírodě', 9, true FROM questions WHERE slug = 'oblibene-cinnosti'
UNION ALL
SELECT id, 'lide', 'setkávání s lidmi', 10, true FROM questions WHERE slug = 'oblibene-cinnosti'
UNION ALL
SELECT id, 'dobrovolnictvi', 'dobrovolnictví', 11, true FROM questions WHERE slug = 'oblibene-cinnosti'
UNION ALL
SELECT id, 'meditace', 'meditace a mindfulness', 12, true FROM questions WHERE slug = 'oblibene-cinnosti';

-- ============================================
-- 5. POČTY (pro kontrolu)
-- ============================================

-- Zobrazit statistiky
DO $$
DECLARE
  cat_count INT;
  sec_count INT;
  que_count INT;
  opt_count INT;
BEGIN
  SELECT COUNT(*) INTO cat_count FROM categories;
  SELECT COUNT(*) INTO sec_count FROM sections;
  SELECT COUNT(*) INTO que_count FROM questions;
  SELECT COUNT(*) INTO opt_count FROM question_options;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'SEED DATA ÚSPĚŠNĚ NAIMPORTOVÁNA';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Kategorie: %', cat_count;
  RAISE NOTICE 'Sekce: %', sec_count;
  RAISE NOTICE 'Otázky: %', que_count;
  RAISE NOTICE 'Možnosti odpovědí: %', opt_count;
  RAISE NOTICE '========================================';
END $$;
