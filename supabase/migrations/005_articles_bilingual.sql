-- Add Vietnamese language fields to articles table
-- Vietnamese articles have a distinct tone and narrative structure
-- and are served at /vi/articles/[slug] for separate Google indexing

ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS title_vi           TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_vi         TEXT,
  ADD COLUMN IF NOT EXISTS body_vi            TEXT,
  ADD COLUMN IF NOT EXISTS meta_description_vi TEXT,
  ADD COLUMN IF NOT EXISTS keywords_vi        TEXT;

-- A Vietnamese version is considered published only when body_vi is populated
-- and is_published is true. No separate flag needed.

COMMENT ON COLUMN public.articles.title_vi            IS 'Vietnamese title — different narrative framing from English';
COMMENT ON COLUMN public.articles.body_vi             IS 'Vietnamese article body in Markdown — written with Vietnamese cultural tone, not a literal translation';
COMMENT ON COLUMN public.articles.excerpt_vi          IS 'Vietnamese excerpt for listing page';
COMMENT ON COLUMN public.articles.meta_description_vi IS 'Vietnamese meta description for Google (155 chars max)';
COMMENT ON COLUMN public.articles.keywords_vi         IS 'Vietnamese search keywords, comma separated';
