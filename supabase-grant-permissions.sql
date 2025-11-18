-- Grant oprávnění pro service_role na lifepro schema
-- Spusť tento SQL v Supabase SQL Editor

-- 1. Dej oprávnění pro použití schématu
GRANT USAGE ON SCHEMA lifepro TO service_role;
GRANT USAGE ON SCHEMA lifepro TO postgres;

-- 2. Dej plná oprávnění na všechny existující tabulky
GRANT ALL ON ALL TABLES IN SCHEMA lifepro TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA lifepro TO postgres;

-- 3. Dej oprávnění na sekvence (pro auto-increment ID)
GRANT ALL ON ALL SEQUENCES IN SCHEMA lifepro TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA lifepro TO postgres;

-- 4. Dej oprávnění na funkce (pokud budou)
GRANT ALL ON ALL FUNCTIONS IN SCHEMA lifepro TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA lifepro TO postgres;

-- 5. Nastav defaultní oprávnění pro budoucí objekty
ALTER DEFAULT PRIVILEGES IN SCHEMA lifepro
GRANT ALL ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA lifepro
GRANT ALL ON SEQUENCES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA lifepro
GRANT ALL ON FUNCTIONS TO service_role;

-- Hotovo! Teď může service_role pracovat s lifepro schématem.
