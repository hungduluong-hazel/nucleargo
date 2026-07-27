-- Established-nation benchmark programs (see docs/nuclear-economics-framework.md).
--
-- Distinct from the newcomer `countries`/`plants` tables: those track programs
-- moving through IAEA Phase 1-3 toward first power. This tracks completed (or
-- cancelled) projects in established nuclear nations, scored against the
-- Group A-D cost/risk framework instead. A project's full lifecycle record is
-- meant to eventually link a newcomer's pre-FID `infrastructure_issues` data
-- to its post-FID `established_program_dimensions` data once (if) it reaches
-- Final Investment Decision — see the "Group 0" section of the framework doc.
--
-- Source of truth for content authoring is lib/data/established-programs.ts;
-- scripts/seed-established-programs.ts pushes that file's contents here.

CREATE TABLE IF NOT EXISTS public.established_programs (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                     TEXT UNIQUE NOT NULL,
  country_name             TEXT NOT NULL,
  flag_url                 TEXT,
  hero_title               TEXT NOT NULL,
  hero_sub                 TEXT,
  badge                    TEXT,
  stat_pills               JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary_rows             JSONB NOT NULL DEFAULT '[]'::jsonb,
  context_modifier_label   TEXT,
  context_modifier_detail  TEXT,
  sources                  JSONB NOT NULL DEFAULT '[]'::jsonb,
  verification_note        TEXT,
  cta_title                TEXT,
  cta_body                 TEXT,
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.established_program_dimensions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id     UUID NOT NULL REFERENCES public.established_programs(id) ON DELETE CASCADE,
  group_key      TEXT NOT NULL CHECK (group_key IN ('0_pre_fid', 'a_build', 'b_finance', 'c_lifecycle')),
  label          TEXT NOT NULL,
  rating         TEXT NOT NULL CHECK (rating IN ('strength', 'weakness', 'mixed')),
  finding        TEXT NOT NULL,
  detail         TEXT NOT NULL,
  verified       BOOLEAN NOT NULL DEFAULT false,
  source_label   TEXT,
  source_url     TEXT,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS established_program_dimensions_program_id_idx
  ON public.established_program_dimensions(program_id);

-- ─── ROW LEVEL SECURITY ────────────────────────────────────────────────────────
-- Public read: these are marketing/benchmark pages, same visibility as the
-- newcomer country profiles (which don't even query the DB today — see
-- lib/i18n/*.ts). Writes go through the service-role key (seed script /
-- future admin backend), same convention as the rest of this schema — no
-- authenticated-write policy is defined here on purpose.

ALTER TABLE public.established_programs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.established_program_dimensions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "established_programs_public_select"
  ON public.established_programs FOR SELECT
  USING (true);

CREATE POLICY "established_program_dimensions_public_select"
  ON public.established_program_dimensions FOR SELECT
  USING (true);
