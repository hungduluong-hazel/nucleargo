import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load .env.local for local development (no dotenv dep required)
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

// For tables without a UNIQUE constraint we query by natural key,
// then update-or-insert so the script is safe to re-run.
async function upsertBy(
  table: string,
  match: Record<string, unknown>,
  payload: Record<string, unknown>,
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = db.from(table).select('id')
  for (const [col, val] of Object.entries(match)) {
    q = q.eq(col, val)
  }
  const { data: existing, error: selErr } = await q.maybeSingle()
  if (selErr) throw selErr

  if (existing) {
    const { data, error } = await db
      .from(table)
      .update(payload)
      .eq('id', (existing as { id: string }).id)
      .select('id')
      .single()
    if (error) throw error
    return (data as { id: string }).id
  }

  const { data, error } = await db
    .from(table)
    .insert(payload)
    .select('id')
    .single()
  if (error) throw error
  return (data as { id: string }).id
}

async function main() {
  // ── COUNTRIES ──────────────────────────────────────────────────────────────
  console.log('⏳  Upserting countries...')
  const { data: countries, error: cErr } = await db
    .from('countries')
    .upsert(
      [
        {
          code: 'vn',
          name_en: 'Vietnam',
          name_vi: 'Việt Nam',
          flag: '🇻🇳',
          iaea_phase: 2,
          program_status: 'Active',
          first_plant_target: 2031,
          total_capacity_gw: 6.4,
          region: 'Southeast Asia',
        },
        {
          code: 'pl',
          name_en: 'Poland',
          name_vi: 'Ba Lan',
          flag: '🇵🇱',
          iaea_phase: 2,
          program_status: 'Active',
          first_plant_target: 2033,
          total_capacity_gw: 6.0,
          region: 'Europe',
        },
      ],
      { onConflict: 'code' },
    )
    .select()
  if (cErr) throw cErr
  console.log(`✅  Countries: ${countries!.length} upserted`)

  const vn = countries!.find((c: { code: string }) => c.code === 'vn') as { id: string; code: string }
  const pl = countries!.find((c: { code: string }) => c.code === 'pl') as { id: string; code: string }

  // ── PLANTS ─────────────────────────────────────────────────────────────────
  console.log('⏳  Upserting plants...')
  const plantsPayload = [
    {
      country_id: vn.id,
      code: 'NT1',
      name_en: 'Ninh Thuan 1',
      name_vi: 'Ninh Thuận 1',
      owner_en: 'Vietnam Electricity (EVN)',
      owner_vi: 'Tập đoàn Điện lực Việt Nam',
      technology: 'VVER-1200',
      capacity: 2000,
      target_completion: 2031,
      current_phase_en: 'Feasibility & Site Preparation',
      current_phase_vi: 'Nghiên cứu khả thi & Chuẩn bị địa điểm',
      progress_pct: 15,
      status: 'active',
      partner_country: 'Russia',
      partner_org: 'Rosatom',
    },
    {
      country_id: vn.id,
      code: 'NT2',
      name_en: 'Ninh Thuan 2',
      name_vi: 'Ninh Thuận 2',
      owner_en: 'PetroVietnam (PVN)',
      owner_vi: 'Tập đoàn Dầu khí Việt Nam',
      technology: 'APR-1400',
      capacity: 2000,
      target_completion: 2036,
      current_phase_en: 'Partner Negotiation',
      current_phase_vi: 'Đàm phán đối tác',
      progress_pct: 8,
      status: 'active',
      partner_country: 'South Korea',
      partner_org: 'KEPCO',
    },
    {
      country_id: pl.id,
      code: 'LK1',
      name_en: 'Lubiatowo-Kopalino',
      name_vi: 'Lubiatowo-Kopalino',
      owner_en: 'Polskie Elektrownie Jądrowe (PEJ)',
      technology: 'AP1000',
      capacity: 3750,
      target_completion: 2033,
      current_phase_en: 'Environmental Impact Assessment',
      progress_pct: 20,
      status: 'active',
      partner_country: 'United States',
      partner_org: 'Westinghouse',
    },
  ]

  const plantIds: Record<string, string> = {}
  for (const plant of plantsPayload) {
    const id = await upsertBy('plants', { code: plant.code }, plant as Record<string, unknown>)
    plantIds[plant.code] = id
    console.log(`    ✅  ${plant.code}  ${plant.name_en}`)
  }

  // ── PLANT MILESTONES ───────────────────────────────────────────────────────
  console.log('⏳  Upserting plant milestones...')
  const nt1 = plantIds['NT1']
  const nt2 = plantIds['NT2']

  const milestones = [
    // NT1 — 10 milestones
    { plant_id: nt1, title_en: 'Intergovernmental Agreement signed with Russia', status: 'completed', completed_date: '2026-03-15', is_public: true, sort_order: 1 },
    { plant_id: nt1, title_en: 'Site selection confirmed — Ninh Thuan Province', status: 'completed', completed_date: '2024-06-01', is_public: true, sort_order: 2 },
    { plant_id: nt1, title_en: 'IAEA INIR Phase 1 review completed', status: 'completed', completed_date: '2024-11-01', is_public: true, sort_order: 3 },
    { plant_id: nt1, title_en: 'Environmental Impact Assessment submitted to VARANS', status: 'in_progress', target_date: '2027-06-30', is_public: true, sort_order: 4 },
    { plant_id: nt1, title_en: "Owner's Engineer team fully staffed", status: 'in_progress', target_date: '2027-12-31', is_public: false, sort_order: 5 },
    { plant_id: nt1, title_en: 'Preliminary Safety Analysis Report submitted', status: 'pending', target_date: '2028-06-30', is_public: false, sort_order: 6 },
    { plant_id: nt1, title_en: 'VARANS construction licence issued', status: 'pending', target_date: '2029-01-01', is_public: true, sort_order: 7 },
    { plant_id: nt1, title_en: 'First concrete pour', status: 'pending', target_date: '2029-06-01', is_public: true, sort_order: 8 },
    { plant_id: nt1, title_en: 'Reactor pressure vessel delivered', status: 'pending', target_date: '2030-01-01', is_public: false, sort_order: 9 },
    { plant_id: nt1, title_en: 'Fuel load and commissioning', status: 'pending', target_date: '2031-12-31', is_public: true, sort_order: 10 },
    // NT2 — 5 milestones
    { plant_id: nt2, title_en: 'KEPCO-PVN MOU signed', status: 'completed', completed_date: '2025-08-01', is_public: true, sort_order: 1 },
    { plant_id: nt2, title_en: 'Korea Eximbank financing framework agreed', status: 'completed', completed_date: '2026-05-01', is_public: true, sort_order: 2 },
    { plant_id: nt2, title_en: 'Technology selection finalised', status: 'in_progress', target_date: '2027-01-01', is_public: true, sort_order: 3 },
    { plant_id: nt2, title_en: 'Site characterisation study completed', status: 'pending', target_date: '2027-12-31', is_public: true, sort_order: 4 },
    { plant_id: nt2, title_en: 'Intergovernmental Agreement signed with Korea', status: 'pending', target_date: '2028-06-01', is_public: true, sort_order: 5 },
  ]

  for (const m of milestones) {
    await upsertBy('plant_milestones', { plant_id: m.plant_id, sort_order: m.sort_order }, m as Record<string, unknown>)
  }
  console.log(`✅  Plant milestones: ${milestones.length} upserted`)

  // ── KEY ORGANIZATIONS ──────────────────────────────────────────────────────
  console.log('⏳  Upserting key organizations...')
  const orgs = [
    { country_id: vn.id, name: 'EVN', role_en: 'Owner and investor for Ninh Thuan 1', type: 'owner', sort_order: 1 },
    { country_id: vn.id, name: 'PVN', role_en: 'Owner and investor for Ninh Thuan 2', type: 'owner', sort_order: 2 },
    { country_id: vn.id, name: 'VARANS', role_en: 'Nuclear regulatory authority of Vietnam', type: 'regulator', sort_order: 3 },
    { country_id: vn.id, name: 'MOIT', role_en: 'Ministry of Industry and Trade — policy and planning', type: 'government', sort_order: 4 },
    { country_id: vn.id, name: 'VINATOM', role_en: 'Vietnam Atomic Energy Institute — research and workforce', type: 'research', sort_order: 5 },
    { country_id: vn.id, name: 'Rosatom', flag: '🇷🇺', role_en: 'General contractor for Ninh Thuan 1', type: 'contractor', sort_order: 6 },
    { country_id: vn.id, name: 'KEPCO', flag: '🇰🇷', role_en: 'Lead contractor candidate for Ninh Thuan 2', type: 'contractor', sort_order: 7 },
    { country_id: vn.id, name: 'IAEA', flag: '🌐', role_en: 'International Atomic Energy Agency — safeguards and technical support', type: 'international', sort_order: 8 },
    { country_id: vn.id, name: 'AtkinsRéalis', flag: '🇨🇦', role_en: "Owner's engineer and project management consultant", type: 'consultant', sort_order: 9 },
  ]

  for (const org of orgs) {
    await upsertBy('key_organizations', { country_id: org.country_id, name: org.name }, org as Record<string, unknown>)
  }
  console.log(`✅  Key organizations: ${orgs.length} upserted`)

  // ── DEVELOPMENTS ───────────────────────────────────────────────────────────
  console.log('⏳  Upserting developments...')
  const developments = [
    {
      country_id: vn.id,
      title_en: 'Vietnam and Russia Sign Ninh Thuan 1 Intergovernmental Agreement',
      body_en:
        'Vietnam and Russia signed an intergovernmental agreement in March 2026 for the construction of Ninh Thuan 1 using VVER-1200 technology. Rosatom will serve as general contractor. The agreement covers financing, technology transfer, and fuel supply arrangements for the lifetime of the plant.',
      date: '2026-03-15',
      category: 'Partnership',
      is_public: true,
    },
    {
      country_id: vn.id,
      title_en: 'Korea Eximbank and KEPCO Sign NT2 Financing Exploration Agreement',
      body_en:
        'Korea Eximbank, K-Sure, KEPCO and PVN signed a financing exploration agreement for Ninh Thuan 2 in May 2026. The agreement initiates formal feasibility work on a Korean financing package for the APR-1400 plant estimated at $12 billion.',
      date: '2026-05-01',
      category: 'Finance',
      is_public: true,
    },
    {
      country_id: vn.id,
      title_en: 'New Atomic Energy Law Takes Effect in Vietnam',
      body_en:
        "Vietnam's new Atomic Energy Law came into effect on January 1 2026, designating nuclear power as a national strategic priority. The law explicitly supports new-generation reactors and SMRs, mandates an integrated digital platform for project transparency, and harmonises Vietnam's regulatory framework with IAEA standards.",
      date: '2026-01-01',
      category: 'Policy',
      is_public: true,
    },
    {
      country_id: vn.id,
      title_en: 'IAEA INIR Phase 2 Mission Confirms Vietnam Progress',
      body_en:
        'An IAEA Integrated Nuclear Infrastructure Review mission in late 2024 confirmed Vietnam has made significant progress across most of the 19 nuclear infrastructure issues. The mission noted continued gaps in regulatory independence, workforce development, and stakeholder engagement.',
      date: '2024-11-15',
      category: 'Regulatory',
      is_public: true,
    },
    {
      country_id: vn.id,
      title_en: "AtkinsRéalis Appointed as Owner's Engineer for EVN",
      body_en:
        "AtkinsRéalis has been appointed as the primary owner's engineer advisor to EVN for the Ninh Thuan 1 project. The Canadian firm will provide project management, regulatory support, and technical oversight services throughout the development phase.",
      date: '2025-06-01',
      category: 'Partnership',
      is_public: true,
    },
    {
      country_id: vn.id,
      title_en: 'Vietnam Power Development Plan 8 Revised — Nuclear Formally Included',
      body_en:
        "The revised Power Development Plan 8 formally incorporated nuclear energy into Vietnam's national energy structure for the first time, committing to 4–6.4 GW of nuclear capacity by 2030 and up to 14.4 GW by 2050. Total investment under PDP8 is $136.3 billion by 2030.",
      date: '2025-04-01',
      category: 'Policy',
      is_public: true,
    },
  ]

  for (const dev of developments) {
    await upsertBy('developments', { country_id: dev.country_id, title_en: dev.title_en }, dev as Record<string, unknown>)
  }
  console.log(`✅  Developments: ${developments.length} upserted`)

  // ── INFRASTRUCTURE ISSUES ─────────────────────────────────────────────────
  console.log('⏳  Upserting infrastructure issues...')
  const issues = [
    { country_id: vn.id, number: 1,  title_en: 'National Position',       category: 'Legal & Regulatory', status: 'met',        sort_order: 1,  analysis_en: 'Vietnam has formally committed to nuclear power through National Assembly Resolution 174/2024 and the revised Power Development Plan 8. Nuclear is designated a national strategic priority.' },
    { country_id: vn.id, number: 2,  title_en: 'Nuclear Safety',           category: 'Legal & Regulatory', status: 'partial',    sort_order: 2,  analysis_en: 'VARANS has been established but requires strengthened independence, technical capacity, and resources to meet IAEA safety standards for a construction licence.' },
    { country_id: vn.id, number: 3,  title_en: 'Management',               category: 'Management',         status: 'partial',    sort_order: 3,  analysis_en: "EVN and PVN have project teams in place but owner's engineer capacity remains thin relative to the complexity of overseeing a first-of-kind nuclear build." },
    { country_id: vn.id, number: 4,  title_en: 'Funding and Financing',    category: 'Management',         status: 'partial',    sort_order: 4,  analysis_en: 'Financing frameworks are under negotiation with Russia for NT1 and Korea for NT2. No financing agreements have been finalised. This remains a critical path item.' },
    { country_id: vn.id, number: 5,  title_en: 'Legislative Framework',    category: 'Legal & Regulatory', status: 'met',        sort_order: 5,  analysis_en: 'The new Atomic Energy Law effective January 2026 provides a comprehensive legislative foundation aligned with IAEA standards.' },
    { country_id: vn.id, number: 6,  title_en: 'Safeguards',               category: 'Legal & Regulatory', status: 'met',        sort_order: 6,  analysis_en: 'Vietnam has a Comprehensive Safeguards Agreement and Additional Protocol in force with the IAEA. Safeguards implementation is in good standing.' },
    { country_id: vn.id, number: 7,  title_en: 'Radiation Protection',     category: 'Safety & Security',  status: 'partial',    sort_order: 7,  analysis_en: 'Regulatory framework exists but emergency response planning and off-site radiation monitoring infrastructure require significant development before plant commissioning.' },
    { country_id: vn.id, number: 8,  title_en: 'Electrical Grid',          category: 'Infrastructure',     status: 'partial',    sort_order: 8,  analysis_en: "Vietnam's grid requires significant upgrades to safely integrate 2,000 MWe baseload nuclear capacity. Transmission infrastructure planning is underway under PDP8." },
    { country_id: vn.id, number: 9,  title_en: 'Human Resource Development', category: 'Workforce',        status: 'partial',    sort_order: 9,  analysis_en: 'Project 1012 targets 4,000 nuclear engineers by 2030. Current pipeline of approximately 400 trained personnel represents a significant gap requiring accelerated investment.' },
    { country_id: vn.id, number: 10, title_en: 'Stakeholder Involvement',  category: 'Management',         status: 'partial',    sort_order: 10, analysis_en: 'Public engagement around Ninh Thuan communities has been limited. Broader national communication on nuclear benefits and safety requires a structured programme.' },
    { country_id: vn.id, number: 11, title_en: 'Site and Supporting Facilities', category: 'Infrastructure', status: 'in_progress', sort_order: 11, analysis_en: 'Ninh Thuan site has been confirmed. Geotechnical and seismic studies are ongoing. Supporting infrastructure including roads and port access requires development.' },
    { country_id: vn.id, number: 12, title_en: 'Environmental Protection', category: 'Safety & Security',  status: 'in_progress', sort_order: 12, analysis_en: 'Environmental Impact Assessment is being prepared for submission to VARANS. Marine environment baseline studies around the coastal Ninh Thuan site are underway.' },
    { country_id: vn.id, number: 13, title_en: 'Emergency Planning',       category: 'Safety & Security',  status: 'not_met',    sort_order: 13, analysis_en: 'Off-site emergency planning zones have not been formally established. Provincial authorities have not yet received emergency response training. This is a significant gap.' },
    { country_id: vn.id, number: 14, title_en: 'Nuclear Security',         category: 'Safety & Security',  status: 'partial',    sort_order: 14, analysis_en: 'Vietnam has ratified key nuclear security conventions. Physical protection regulations require updating to align with IAEA INFCIRC/225 Rev.5 standards.' },
    { country_id: vn.id, number: 15, title_en: 'Nuclear Fuel Cycle',       category: 'Infrastructure',     status: 'partial',    sort_order: 15, analysis_en: 'Fuel supply will be provided by Rosatom for NT1 under the IGA. Spent fuel and waste management policy requires a formal national strategy and regulatory framework.' },
    { country_id: vn.id, number: 16, title_en: 'Radioactive Waste',        category: 'Infrastructure',     status: 'not_met',    sort_order: 16, analysis_en: 'No national radioactive waste repository has been designated. Long-term waste management strategy is absent. This must be resolved before construction licence can be issued.' },
    { country_id: vn.id, number: 17, title_en: 'Industrial Involvement',   category: 'Infrastructure',     status: 'partial',    sort_order: 17, analysis_en: 'Local content targets have been discussed but no formal local content programme has been established. Domestic industrial capacity for nuclear-grade components is very limited.' },
    { country_id: vn.id, number: 18, title_en: 'Procurement',              category: 'Management',         status: 'partial',    sort_order: 18, analysis_en: 'Owner procurement systems are being developed. Nuclear-grade procurement procedures, vendor qualification, and supply chain oversight capabilities need to be established.' },
    { country_id: vn.id, number: 19, title_en: 'Owner/Operator',           category: 'Management',         status: 'partial',    sort_order: 19, analysis_en: 'EVN and PVN have been designated but neither has operated a nuclear plant. Building genuine operator capability — not just oversight — is the central challenge of the program.' },
  ]

  for (const issue of issues) {
    await upsertBy(
      'infrastructure_issues',
      { country_id: issue.country_id, number: issue.number },
      issue as Record<string, unknown>,
    )
  }
  console.log(`✅  Infrastructure issues: ${issues.length} upserted`)

  console.log('\n🎉  Seed complete!')
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err)
  console.error('❌  Seed failed:', msg)
  process.exit(1)
})
