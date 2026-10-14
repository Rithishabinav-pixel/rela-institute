-- Removes the translation_cache table added for the Google Cloud Translation
-- API integration, which has been replaced by GTranslate (client-side widget
-- translation requires no server-side cache). Confirmed empty (0 rows) before
-- this migration was written.
DROP TABLE IF EXISTS "translation_cache";
