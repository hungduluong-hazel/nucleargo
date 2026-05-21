-- NuclearGo Initial Schema
-- Run this migration via: supabase db push

-- ─── PROFILES ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name      TEXT,
  last_name       TEXT,
  email           TEXT,
  organization    TEXT,
  country         TEXT,
  role            TEXT,
  tier            INTEGER NOT NULL DEFAULT 2,
  preferred_lang  TEXT NOT NULL DEFAULT 'en',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, organization, country, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'organization',
    NEW.raw_user_meta_data->>'country',
    NEW.raw_user_meta_data->>'role'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─── COUNTRIES ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.countries (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                 TEXT UNIQUE NOT NULL,
  name_en              TEXT NOT NULL,
  name_vi              TEXT,
  flag                 TEXT,
  iaea_phase           INTEGER,
  program_status       TEXT,
  first_plant_target   INTEGER,
  total_capacity_gw    NUMERIC,
  region               TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── PLANTS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.plants (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id          UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  code                TEXT,
  name_en             TEXT NOT NULL,
  name_vi             TEXT,
  owner_en            TEXT,
  owner_vi            TEXT,
  technology          TEXT,
  capacity            NUMERIC,
  target_completion   INTEGER,
  current_phase_en    TEXT,
  current_phase_vi    TEXT,
  progress_pct        INTEGER,
  status              TEXT,
  partner_country     TEXT,
  partner_org         TEXT,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── PLANT MILESTONES ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.plant_milestones (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id        UUID NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
  title_en        TEXT NOT NULL,
  title_vi        TEXT,
  target_date     DATE,
  completed_date  DATE,
  status          TEXT,
  is_public       BOOLEAN NOT NULL DEFAULT false,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── DEVELOPMENTS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.developments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id  UUID REFERENCES public.countries(id) ON DELETE SET NULL,
  title_en    TEXT NOT NULL,
  title_vi    TEXT,
  body_en     TEXT,
  body_vi     TEXT,
  date        DATE,
  category    TEXT,
  source      TEXT,
  source_url  TEXT,
  is_public   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── INFRASTRUCTURE ISSUES ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.infrastructure_issues (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id   UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  number       INTEGER,
  title_en     TEXT NOT NULL,
  title_vi     TEXT,
  category     TEXT,
  status       TEXT,
  evidence_en  TEXT,
  evidence_vi  TEXT,
  analysis_en  TEXT,
  analysis_vi  TEXT,
  last_updated TIMESTAMPTZ,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── WORKFORCE METRICS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.workforce_metrics (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id     UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  metric_key     TEXT NOT NULL,
  label_en       TEXT NOT NULL,
  label_vi       TEXT,
  target_value   NUMERIC,
  current_value  NUMERIC,
  unit           TEXT,
  as_of_date     DATE,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── TRAINING INSTITUTIONS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.training_institutions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id    UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  name_en       TEXT NOT NULL,
  name_vi       TEXT,
  city          TEXT,
  type          TEXT,
  programs_en   TEXT,
  programs_vi   TEXT,
  annual_quota  INTEGER,
  website       TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── OPPORTUNITIES ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.opportunities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id      UUID REFERENCES public.countries(id) ON DELETE SET NULL,
  title_en        TEXT NOT NULL,
  title_vi        TEXT,
  organization    TEXT,
  type            TEXT,
  country         TEXT,
  deadline        DATE,
  url             TEXT,
  description_en  TEXT,
  description_vi  TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── BRIEFINGS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.briefings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id      UUID REFERENCES public.countries(id) ON DELETE SET NULL,
  title_en        TEXT NOT NULL,
  title_vi        TEXT,
  summary_en      TEXT,
  summary_vi      TEXT,
  body_en         TEXT,
  body_vi         TEXT,
  published_date  DATE,
  is_published    BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── KEY ORGANIZATIONS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.key_organizations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id  UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  flag        TEXT,
  role_en     TEXT,
  role_vi     TEXT,
  type        TEXT,
  website     TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── AUDIT LOGS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id UUID,
  action          TEXT NOT NULL,
  resource_type   TEXT,
  resource_id     UUID,
  old_values      JSONB,
  new_values      JSONB,
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── ROW LEVEL SECURITY ────────────────────────────────────────────────────────
ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plants                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_milestones      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infrastructure_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workforce_metrics     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefings             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_organizations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs            ENABLE ROW LEVEL SECURITY;


-- profiles: own row only
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- developments: public rows visible to all; all rows visible to authenticated
CREATE POLICY "developments_public_select"
  ON public.developments FOR SELECT
  USING (is_public = true OR auth.uid() IS NOT NULL);


-- plant_milestones: same as developments
CREATE POLICY "plant_milestones_public_select"
  ON public.plant_milestones FOR SELECT
  USING (is_public = true OR auth.uid() IS NOT NULL);


-- audit_logs: authenticated insert; read own rows only
CREATE POLICY "audit_logs_insert"
  ON public.audit_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "audit_logs_select_own"
  ON public.audit_logs FOR SELECT
  USING (user_id = auth.uid());


-- All other tables: authenticated users only (SELECT)
CREATE POLICY "countries_authenticated"
  ON public.countries FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "plants_authenticated"
  ON public.plants FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "infrastructure_issues_authenticated"
  ON public.infrastructure_issues FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "workforce_metrics_authenticated"
  ON public.workforce_metrics FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "training_institutions_authenticated"
  ON public.training_institutions FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "opportunities_authenticated"
  ON public.opportunities FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "briefings_authenticated"
  ON public.briefings FOR SELECT
  USING (auth.uid() IS NOT NULL AND (is_published = true OR auth.uid() IS NOT NULL));

CREATE POLICY "key_organizations_authenticated"
  ON public.key_organizations FOR SELECT
  USING (auth.uid() IS NOT NULL);
