// Pushes lib/data/established-programs.ts into Supabase
// (established_programs + established_program_dimensions).
//
// lib/data/established-programs.ts stays the source of truth for content
// authoring (typed, reviewable, git-tracked) — this script is what syncs it
// to the DB. Re-run any time that file changes. Requires migration
// 010_established_programs.sql to have been applied first.
//
// Usage: npx ts-node --project tsconfig.seed.json scripts/seed-established-programs.ts

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { establishedPrograms, type FrameworkDimension } from '../lib/data/established-programs'

const envFile = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf8').split('\n')
  for (const line of lines) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2')
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const db = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function dimensionRows(
  programId: string,
  groupKey: '0_pre_fid' | 'a_build' | 'b_finance' | 'c_lifecycle',
  dims: FrameworkDimension[],
) {
  return dims.map((d, i) => ({
    program_id: programId,
    group_key: groupKey,
    label: d.label,
    rating: d.rating,
    finding: d.finding,
    detail: d.detail,
    verified: d.verified,
    source_label: d.sourceLabel ?? null,
    source_url: d.sourceUrl ?? null,
    sort_order: i,
  }))
}

async function main() {
  for (const program of establishedPrograms) {
    console.log(`⏳  Upserting program: ${program.slug}...`)

    const { data: row, error: upsertErr } = await db
      .from('established_programs')
      .upsert(
        {
          slug: program.slug,
          country_name: program.countryName,
          flag_url: program.flagUrl,
          hero_title: program.heroTitle,
          hero_sub: program.heroSub,
          badge: program.badge,
          stat_pills: program.statPills,
          summary_rows: program.summaryRows,
          context_modifier_label: program.contextModifier.label,
          context_modifier_detail: program.contextModifier.detail,
          sources: program.sources,
          verification_note: program.verificationNote,
          cta_title: program.ctaTitle,
          cta_body: program.ctaBody,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' },
      )
      .select('id')
      .single()
    if (upsertErr) throw upsertErr
    const programId = (row as { id: string }).id

    // Dimensions have no natural unique key — replace wholesale for this
    // program so the script stays safe to re-run after editing the source file.
    const { error: delErr } = await db
      .from('established_program_dimensions')
      .delete()
      .eq('program_id', programId)
    if (delErr) throw delErr

    const allDims = [
      ...dimensionRows(programId, 'a_build', program.buildPhaseRisk),
      ...dimensionRows(programId, 'b_finance', program.financeability),
      ...dimensionRows(programId, 'c_lifecycle', program.lifecycleLiability),
    ]

    const { error: insErr } = await db.from('established_program_dimensions').insert(allDims)
    if (insErr) throw insErr

    console.log(`✅  ${program.slug}: 1 program row, ${allDims.length} dimension rows`)
  }

  console.log('🎉  Done.')
}

main().catch((err) => {
  console.error('❌  Seed failed:', err)
  process.exit(1)
})
