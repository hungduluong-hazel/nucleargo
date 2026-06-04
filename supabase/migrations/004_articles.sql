-- Articles table for SEO content
-- Public-facing long-form articles targeting nuclear search keywords

CREATE TABLE IF NOT EXISTS public.articles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  excerpt          TEXT,                          -- shown in listing cards + meta description
  body             TEXT,                          -- full markdown content
  meta_description TEXT,                          -- overrides excerpt for SEO if set
  keywords         TEXT,                          -- comma-separated target keywords
  author           TEXT NOT NULL DEFAULT 'NuclearGo Editorial',
  published_date   DATE,
  read_time_mins   INTEGER,
  is_published     BOOLEAN NOT NULL DEFAULT false,
  ai_generated     BOOLEAN NOT NULL DEFAULT false,
  review_status    TEXT    NOT NULL DEFAULT 'approved',
  -- review_status: 'pending' | 'approved' | 'rejected'
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug        ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_published   ON public.articles (is_published, published_date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_review      ON public.articles (review_status, ai_generated);

-- RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Anyone can read published articles (SEO — no login required)
CREATE POLICY "articles_public_read"
  ON public.articles FOR SELECT
  USING (is_published = true AND review_status = 'approved');

-- Only authenticated users (admin via service role) can insert/update/delete
CREATE POLICY "articles_admin_write"
  ON public.articles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
