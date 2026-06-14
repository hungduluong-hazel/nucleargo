-- NuclearGo Supply Chain Directory
-- Adds a supplier directory (suppliers) and a plant-supplier mapping table
-- for tracking which suppliers are linked to which plants/milestones.
-- Run via: supabase db push

-- ─── SUPPLIERS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.suppliers (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name               TEXT NOT NULL,
  name_vi            TEXT,
  logo_url           TEXT,
  website            TEXT,
  hq_country         TEXT,                 -- country the supplier is headquartered in
  description_en     TEXT,
  description_vi     TEXT,

  -- Classification
  supplier_tier      TEXT NOT NULL DEFAULT 'tier1',  -- 'oem_prime' | 'tier1' | 'tier2' | 'local_partner'
  categories         TEXT[] NOT NULL DEFAULT '{}',   -- e.g. {'reactor_island','i_c_dcs','fuel_fabrication','heavy_components','engineering','construction'}
  reactor_tech       TEXT[] NOT NULL DEFAULT '{}',   -- e.g. {'VVER-1200','APR-1400','AP1000','EPR'}
  certifications     TEXT[] NOT NULL DEFAULT '{}',   -- e.g. {'ASME_N_STAMP','RCC-M','NQA-1','ISO_19443','ISO_9001'}

  -- Localization tracking (IAEA Issue 11 - industrial involvement)
  is_local_content   BOOLEAN NOT NULL DEFAULT false,
  country_id         UUID REFERENCES public.countries(id) ON DELETE SET NULL, -- program country this entry is relevant to

  -- Visibility / curation
  is_public          BOOLEAN NOT NULL DEFAULT false,
  is_featured        BOOLEAN NOT NULL DEFAULT false,
  sort_order         INTEGER NOT NULL DEFAULT 0,

  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS suppliers_country_id_idx ON public.suppliers(country_id);
CREATE INDEX IF NOT EXISTS suppliers_categories_idx ON public.suppliers USING GIN (categories);
CREATE INDEX IF NOT EXISTS suppliers_reactor_tech_idx ON public.suppliers USING GIN (reactor_tech);


-- ─── PLANT SUPPLIERS (supply chain mapping) ────────────────────────────────────
-- Links a supplier to a specific plant (and optionally a milestone), so Tier 3
-- workspaces can see contractor/supplier dependencies alongside the tracker.
CREATE TABLE IF NOT EXISTS public.plant_suppliers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id         UUID NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
  supplier_id      UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  role_en          TEXT,
  role_vi          TEXT,
  contract_status  TEXT NOT NULL DEFAULT 'prospective', -- 'prospective' | 'shortlisted' | 'contracted' | 'delivering' | 'complete'
  milestone_id     UUID REFERENCES public.plant_milestones(id) ON DELETE SET NULL,
  notes            TEXT,
  created_by       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS plant_suppliers_plant_id_idx ON public.plant_suppliers(plant_id);
CREATE INDEX IF NOT EXISTS plant_suppliers_supplier_id_idx ON public.plant_suppliers(supplier_id);


-- ─── ROW LEVEL SECURITY ────────────────────────────────────────────────────────
ALTER TABLE public.suppliers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_suppliers ENABLE ROW LEVEL SECURITY;

-- suppliers: public rows visible to everyone (Tier 1 directory teaser);
-- full directory visible to authenticated (Tier 2+) users
CREATE POLICY "suppliers_public_select"
  ON public.suppliers FOR SELECT
  USING (is_public = true OR auth.uid() IS NOT NULL);

-- plant_suppliers: authenticated only for now (Phase 2).
-- Replace with visibility-based policy (private/team/shared/professional/public)
-- once workspace_members exists in Phase 3, matching the pattern used for
-- milestones/risks/issues elsewhere in the security architecture doc.
CREATE POLICY "plant_suppliers_authenticated"
  ON public.plant_suppliers FOR SELECT
  USING (auth.uid() IS NOT NULL);
