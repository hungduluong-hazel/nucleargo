import { createClient } from '@/lib/supabase/server'
import type { EstablishedProgramConfig, FrameworkDimension, DimensionRating } from '@/lib/data/established-programs'

type DimensionRow = {
  group_key: string
  label: string
  rating: DimensionRating
  finding: string
  detail: string
  verified: boolean
  source_label: string | null
  source_url: string | null
  sort_order: number
}

function toDimension(row: DimensionRow): FrameworkDimension {
  return {
    label: row.label,
    rating: row.rating,
    finding: row.finding,
    detail: row.detail,
    verified: row.verified,
    sourceLabel: row.source_label ?? undefined,
    sourceUrl: row.source_url ?? undefined,
  }
}

/**
 * Loads an established-program page from Supabase. Returns null if the
 * tables don't exist yet (migration 010 not applied), the row isn't found,
 * or any other query error — callers should fall back to the static object
 * in established-programs.ts rather than crash the page.
 */
export async function getEstablishedProgramFromDb(
  slug: string,
): Promise<EstablishedProgramConfig | null> {
  try {
    const supabase = await createClient()

    const { data: program, error: programErr } = await supabase
      .from('established_programs')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (programErr || !program) return null

    const { data: dimensions, error: dimErr } = await supabase
      .from('established_program_dimensions')
      .select('*')
      .eq('program_id', program.id)
      .order('sort_order', { ascending: true })

    if (dimErr || !dimensions) return null

    const byGroup = (key: string) =>
      (dimensions as DimensionRow[]).filter((d) => d.group_key === key).map(toDimension)

    return {
      flagUrl: program.flag_url,
      slug: program.slug,
      countryName: program.country_name,
      heroTitle: program.hero_title,
      heroSub: program.hero_sub,
      badge: program.badge,
      statPills: program.stat_pills ?? [],
      summaryRows: program.summary_rows ?? [],
      buildPhaseRisk: byGroup('a_build'),
      financeability: byGroup('b_finance'),
      lifecycleLiability: byGroup('c_lifecycle'),
      contextModifier: {
        label: program.context_modifier_label,
        detail: program.context_modifier_detail,
      },
      sources: program.sources ?? [],
      verificationNote: program.verification_note,
      ctaTitle: program.cta_title,
      ctaBody: program.cta_body,
    }
  } catch {
    // Table doesn't exist yet, network hiccup, etc. — caller falls back.
    return null
  }
}
