-- Vyčisti data z tabulek pro nový import
-- Spusť v Supabase SQL Editor

-- POZOR: Toto smaže všechna data! Používej jen při vývoji.

-- Smaž otázky (nejdřív kvůli foreign keys)
TRUNCATE TABLE lifepro.lifepro_questions CASCADE;

-- Smaž sekce
TRUNCATE TABLE lifepro.lifepro_sections CASCADE;

-- Smaž kategorie
TRUNCATE TABLE lifepro.lifepro_categories CASCADE;

-- Hotovo! Teď můžeš spustit import znovu.
