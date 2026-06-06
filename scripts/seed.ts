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
  console.log(`✅  Infrastructure issues: ${issues.length} upserted`)

  // ── GHANA / KENYA / NIGERIA ────────────────────────────────────────────────
  console.log('\n⏳  Upserting African newcomer countries...')
  const { data: africaCountries, error: acErr } = await db
    .from('countries')
    .upsert(
      [
        { code: 'gh', name_en: 'Ghana', name_vi: 'Ghana', flag: '🇬🇭', iaea_phase: 2, program_status: 'Active', first_plant_target: 2030, total_capacity_gw: 0.9, region: 'West Africa' },
        { code: 'ke', name_en: 'Kenya', name_vi: 'Kenya', flag: '🇰🇪', iaea_phase: 2, program_status: 'Active', first_plant_target: 2034, total_capacity_gw: 2.0, region: 'East Africa' },
        { code: 'ng', name_en: 'Nigeria', name_vi: 'Nigeria', flag: '🇳🇬', iaea_phase: 2, program_status: 'Active', first_plant_target: 2036, total_capacity_gw: 4.0, region: 'West Africa' },
      ],
      { onConflict: 'code' },
    )
    .select()
  if (acErr) throw acErr
  const gh = africaCountries!.find((c: { code: string }) => c.code === 'gh') as { id: string; code: string }
  const ke = africaCountries!.find((c: { code: string }) => c.code === 'ke') as { id: string; code: string }
  const ng = africaCountries!.find((c: { code: string }) => c.code === 'ng') as { id: string; code: string }
  console.log(`✅  African countries: ${africaCountries!.length} upserted`)

  // ── AFRICAN PLANTS ─────────────────────────────────────────────────────────
  console.log('⏳  Upserting African plants...')
  const africaPlants = [
    { country_id: gh.id, code: 'GHNPP1', name_en: 'Ghana NPP (Nsuban)', owner_en: 'Nuclear Power Ghana (NPG)', technology: 'NuScale VOYGR-12 SMR', capacity: 924, target_completion: 2030, current_phase_en: 'Site Characterisation', progress_pct: 10, status: 'active', partner_country: 'United States', partner_org: 'NuScale / Regnum Technology Group' },
    { country_id: ke.id, code: 'KENPP1', name_en: 'Kenya NPP (Siaya Region)', owner_en: 'NuPEA (Nuclear Power and Energy Agency)', technology: 'TBD — KAERI feasibility complete', capacity: 1000, target_completion: 2034, current_phase_en: 'Site Selection', progress_pct: 12, status: 'active', partner_country: 'South Korea', partner_org: 'KAERI' },
    { country_id: ng.id, code: 'NGEREGU', name_en: 'Geregu Nuclear Power Plant', owner_en: 'NAEC / Federal Government of Nigeria', technology: 'TBD — SMR options under review', capacity: 1200, target_completion: 2036, current_phase_en: 'Site Characterisation', progress_pct: 8, status: 'active', partner_country: 'Multiple', partner_org: 'Russia / France / South Korea' },
    { country_id: ng.id, code: 'NGITU', name_en: 'Itu Nuclear Power Plant', owner_en: 'NAEC / Federal Government of Nigeria', technology: 'TBD — SMR options under review', capacity: 1200, target_completion: 2038, current_phase_en: 'Preliminary Site Studies', progress_pct: 5, status: 'active', partner_country: 'Multiple', partner_org: 'Russia / France / South Korea' },
  ]
  const africaPlantIds: Record<string, string> = {}
  for (const plant of africaPlants) {
    const id = await upsertBy('plants', { code: plant.code }, plant as Record<string, unknown>)
    africaPlantIds[plant.code] = id
    console.log(`    ✅  ${plant.code}  ${plant.name_en}`)
  }

  // ── AFRICAN PLANT MILESTONES ───────────────────────────────────────────────
  console.log('⏳  Upserting African plant milestones...')
  const ghnpp1 = africaPlantIds['GHNPP1']
  const kenpp1 = africaPlantIds['KENPP1']
  const ngeregu = africaPlantIds['NGEREGU']
  const ngitu = africaPlantIds['NGITU']
  const africaMilestones = [
    { plant_id: ghnpp1, title_en: 'Phase 2 entry declared by President Akufo-Addo', status: 'completed', completed_date: '2022-08-31', is_public: true, sort_order: 1 },
    { plant_id: ghnpp1, title_en: 'NuScale VOYGR-12 deployment agreement signed', status: 'completed', completed_date: '2023-08-01', is_public: true, sort_order: 2 },
    { plant_id: ghnpp1, title_en: 'IAEA SEED mission completed — Nsuban endorsed', status: 'completed', completed_date: '2025-02-28', is_public: true, sort_order: 3 },
    { plant_id: ghnpp1, title_en: 'Full site characterisation study completed', status: 'pending', target_date: '2026-12-31', is_public: true, sort_order: 4 },
    { plant_id: ghnpp1, title_en: 'Technology selection and financing framework agreed', status: 'pending', target_date: '2027-06-30', is_public: true, sort_order: 5 },
    { plant_id: ghnpp1, title_en: 'Construction licence issued by NRA', status: 'pending', target_date: '2028-01-01', is_public: true, sort_order: 6 },
    { plant_id: ghnpp1, title_en: 'First module concrete pour', status: 'pending', target_date: '2028-06-01', is_public: true, sort_order: 7 },
    { plant_id: ghnpp1, title_en: 'First module commissioning and grid connection', status: 'pending', target_date: '2030-12-31', is_public: true, sort_order: 8 },
    { plant_id: kenpp1, title_en: 'USA Strategic Civil Nuclear Cooperation MoU signed', status: 'completed', completed_date: '2022-12-01', is_public: true, sort_order: 1 },
    { plant_id: kenpp1, title_en: 'NuPEA Strategic Plan 2023-2027 launched', status: 'completed', completed_date: '2024-03-01', is_public: true, sort_order: 2 },
    { plant_id: kenpp1, title_en: 'KNRA and US NRC regulatory MoU signed', status: 'completed', completed_date: '2024-09-01', is_public: true, sort_order: 3 },
    { plant_id: kenpp1, title_en: 'KAERI-NuPEA formal MoU and feasibility study delivered', status: 'completed', completed_date: '2025-09-01', is_public: true, sort_order: 4 },
    { plant_id: kenpp1, title_en: 'Final site selected in Siaya region', status: 'in_progress', target_date: '2026-12-31', is_public: true, sort_order: 5 },
    { plant_id: kenpp1, title_en: 'INIR Phase 2 review completed', status: 'pending', target_date: '2027-01-01', is_public: true, sort_order: 6 },
    { plant_id: kenpp1, title_en: 'Financing and technology partner agreements finalised', status: 'pending', target_date: '2027-03-01', is_public: true, sort_order: 7 },
    { plant_id: kenpp1, title_en: 'Plant commissioning and first power to grid', status: 'pending', target_date: '2034-12-31', is_public: true, sort_order: 8 },
    { plant_id: ngeregu, title_en: 'NAEC-Rosatom construction partnership MoU signed', status: 'completed', completed_date: '2017-06-01', is_public: true, sort_order: 1 },
    { plant_id: ngeregu, title_en: 'Geregu site confirmed and characterisation initiated', status: 'completed', completed_date: '2022-01-01', is_public: true, sort_order: 2 },
    { plant_id: ngeregu, title_en: 'INIR Phase 2 mission approved for Q1 2027', status: 'in_progress', target_date: '2027-03-31', is_public: true, sort_order: 3 },
    { plant_id: ngeregu, title_en: 'Technology selection decision (large reactor vs SMR)', status: 'pending', target_date: '2027-12-31', is_public: true, sort_order: 4 },
    { plant_id: ngeregu, title_en: 'Financing framework and vendor contract agreed', status: 'pending', target_date: '2029-01-01', is_public: true, sort_order: 5 },
    { plant_id: ngitu, title_en: 'Itu site preliminary studies initiated', status: 'completed', completed_date: '2021-06-01', is_public: true, sort_order: 1 },
    { plant_id: ngitu, title_en: 'Bankable feasibility study submitted', status: 'in_progress', target_date: '2027-06-30', is_public: true, sort_order: 2 },
    { plant_id: ngitu, title_en: 'Technology selection and financing agreed', status: 'pending', target_date: '2029-12-31', is_public: true, sort_order: 3 },
  ]
  for (const m of africaMilestones) {
    await upsertBy('plant_milestones', { plant_id: m.plant_id, sort_order: m.sort_order }, m as Record<string, unknown>)
  }
  console.log(`✅  African plant milestones: ${africaMilestones.length} upserted`)

  // ── AFRICAN KEY ORGANIZATIONS ──────────────────────────────────────────────
  console.log('⏳  Upserting African key organizations...')
  const africaOrgs = [
    { country_id: gh.id, name: 'NPG', role_en: 'Nuclear Power Ghana — implementing agency for Ghana NPP', type: 'owner', sort_order: 1 },
    { country_id: gh.id, name: 'GAEC', role_en: 'Ghana Atomic Energy Commission — research and human resource development', type: 'research', sort_order: 2 },
    { country_id: gh.id, name: 'NRA Ghana', role_en: 'Nuclear Regulatory Authority — licensing and safety oversight', type: 'regulator', sort_order: 3 },
    { country_id: gh.id, name: 'NuScale', flag: '🇺🇸', role_en: 'Technology provider — VOYGR-12 SMR design', type: 'contractor', sort_order: 4 },
    { country_id: gh.id, name: 'Regnum Technology Group', flag: '🇺🇸', role_en: 'US project development partner for SMR deployment', type: 'contractor', sort_order: 5 },
    { country_id: gh.id, name: 'IAEA', flag: '🌐', role_en: 'IAEA — safeguards, SEED mission, technical support', type: 'international', sort_order: 6 },
    { country_id: ke.id, name: 'NuPEA', role_en: 'Nuclear Power and Energy Agency — implementing agency for Kenya NPP', type: 'owner', sort_order: 1 },
    { country_id: ke.id, name: 'KNRA', role_en: 'Kenya Nuclear Regulatory Authority — licensing and safety oversight', type: 'regulator', sort_order: 2 },
    { country_id: ke.id, name: 'KAERI', flag: '🇰🇷', role_en: 'Korea Atomic Energy Research Institute — feasibility study and technical partner', type: 'contractor', sort_order: 3 },
    { country_id: ke.id, name: 'US NRC', flag: '🇺🇸', role_en: 'US Nuclear Regulatory Commission — regulatory cooperation partner', type: 'international', sort_order: 4 },
    { country_id: ke.id, name: 'CGN Kenya', flag: '🇨🇳', role_en: 'China General Nuclear Power Corporation — training and site support (2015 MoU)', type: 'contractor', sort_order: 5 },
    { country_id: ng.id, name: 'NAEC', role_en: 'Nigeria Atomic Energy Commission — national focal agency for nuclear development', type: 'owner', sort_order: 1 },
    { country_id: ng.id, name: 'NNRA', role_en: 'Nigerian Nuclear Regulatory Authority — licensing and safety oversight', type: 'regulator', sort_order: 2 },
    { country_id: ng.id, name: 'Rosatom Nigeria', flag: '🇷🇺', role_en: 'Primary technology partner — construction and operation MoU (2017)', type: 'contractor', sort_order: 3 },
    { country_id: ng.id, name: 'EDF Nigeria', flag: '🇫🇷', role_en: 'French nuclear technology cooperation partner', type: 'contractor', sort_order: 4 },
  ]
  for (const org of africaOrgs) {
    await upsertBy('key_organizations', { country_id: org.country_id, name: org.name }, org as Record<string, unknown>)
  }
  console.log(`✅  African key organizations: ${africaOrgs.length} upserted`)

  // ── AFRICAN DEVELOPMENTS ───────────────────────────────────────────────────
  console.log('⏳  Upserting African developments...')
  const africaDevelopments = [
    { country_id: gh.id, title_en: 'IAEA SEED Mission Endorses Nsuban as Preferred Nuclear Site', body_en: 'The IAEA conducted Ghana first-ever SEED review mission in February 2025, endorsing Nsuban in the Western Region as the preferred site, with Obotan as backup.', date: '2025-02-28', category: 'Technical', is_public: true },
    { country_id: gh.id, title_en: 'Ghana Signs Nuclear Cooperation Agreements with South Korea and France', body_en: 'Ghana signed nuclear cooperation memoranda with South Korea and France in 2024, broadening technology options and training pathways.', date: '2024-11-01', category: 'Partnership', is_public: true },
    { country_id: gh.id, title_en: 'NuScale VOYGR-12 Deployment Agreement Signed', body_en: 'The Government of Ghana and Regnum Technology Group signed an agreement to deploy a NuScale VOYGR-12 SMR at Nsuban.', date: '2023-08-01', category: 'Partnership', is_public: true },
    { country_id: gh.id, title_en: 'President Declares Phase 2 Entry — Nuclear Power a National Priority', body_en: 'President Akufo-Addo officially declared Ghana entry into IAEA Phase 2 in August 2022.', date: '2022-08-31', category: 'Policy', is_public: true },
    { country_id: gh.id, title_en: 'USA Designates Ghana as SMR Regional Hub in West Africa', body_en: 'The US State Department announced expanded civil nuclear cooperation with Ghana, designating it as a priority SMR deployment partner in West Africa.', date: '2024-03-01', category: 'Partnership', is_public: true },
    { country_id: ke.id, title_en: 'President Ruto Announces 2,000 MWe Target and March 2027 Groundbreaking', body_en: 'President Ruto announced Kenya upgraded nuclear capacity target of 2,000 MWe at ICoNE 2026, with groundbreaking planned for March 2027 and commissioning by 2034.', date: '2026-03-01', category: 'Policy', is_public: true },
    { country_id: ke.id, title_en: 'NuPEA and KAERI Sign Formal MoU — Feasibility Study Delivered', body_en: 'NuPEA signed a formal MoU with KAERI in September 2025. KAERI delivered a comprehensive feasibility study covering reactor design and workforce training requirements.', date: '2025-09-01', category: 'Partnership', is_public: true },
    { country_id: ke.id, title_en: 'KNRA and US NRC Sign Regulatory Cooperation MoU', body_en: 'Kenya nuclear regulator (KNRA) and the US NRC signed a memorandum of understanding on regulatory collaboration and nuclear safety.', date: '2024-09-01', category: 'Regulatory', is_public: true },
    { country_id: ke.id, title_en: 'NuPEA Launches Strategic Plan 2023-2027', body_en: 'NuPEA launched its six-priority Strategic Plan covering Nuclear Infrastructure Development, Stakeholder Engagement, Capacity Building, the Research Reactor Program, and Institutional Sustainability.', date: '2024-03-01', category: 'Policy', is_public: true },
    { country_id: ke.id, title_en: 'Kenya and USA Sign Strategic Civil Nuclear Cooperation MoU', body_en: 'Kenya and the United States signed a Strategic Civil Nuclear Cooperation MoU in December 2022.', date: '2022-12-01', category: 'Partnership', is_public: true },
    { country_id: ng.id, title_en: 'Minister of Power Advocates for SMRs over Large Reactors', body_en: 'Nigeria Minister of Power advised against the originally planned four 1,200 MWe units and instead advocated for Small Modular Reactors — a significant strategic pivot.', date: '2025-05-01', category: 'Policy', is_public: true },
    { country_id: ng.id, title_en: 'INIR Phase 2 Mission Approved for Q1 2027', body_en: 'The IAEA approved an INIR Phase 2 review mission for Nigeria, scheduled for Q1 2027, recognising Nigeria progress in establishing nuclear infrastructure.', date: '2024-10-01', category: 'Regulatory', is_public: true },
    { country_id: ng.id, title_en: 'Site Characterisation Advancing at Geregu and Itu', body_en: 'Site characterisation at Geregu (Kogi state) and Itu (Akwa Ibom state) is advancing toward a bankable feasibility study with environmental and seismic assessments underway.', date: '2024-06-01', category: 'Technical', is_public: true },
    { country_id: ng.id, title_en: 'Nigeria Maintains Multi-Partner Nuclear Engagement Strategy', body_en: 'Nigeria has maintained active nuclear cooperation with Russia, France, South Korea, and India simultaneously, preserving technology options but complicating vendor selection.', date: '2023-03-01', category: 'Partnership', is_public: true },
    { country_id: ng.id, title_en: 'NAEC Launches Multipurpose Research Reactor Programme', body_en: 'Nigeria Atomic Energy Commission launched a programme to develop a second research reactor by 2030 to support workforce training and isotope production.', date: '2022-11-01', category: 'Technical', is_public: true },
  ]
  for (const dev of africaDevelopments) {
    await upsertBy('developments', { country_id: dev.country_id, title_en: dev.title_en }, dev as Record<string, unknown>)
  }
  console.log(`✅  African developments: ${africaDevelopments.length} upserted`)

  // ── AFRICAN INFRASTRUCTURE ISSUES (19 per country) ─────────────────────────
  console.log('⏳  Upserting African infrastructure issues...')
  const africaIssues = [
    // Ghana
    { country_id: gh.id, number: 1,  title_en: 'National Position',              category: 'Legal & Regulatory', status: 'met',        sort_order: 1,  analysis_en: 'Ghana formally entered IAEA Phase 2 in August 2022, completing the national position requirement. The government commitment is unambiguous.' },
    { country_id: gh.id, number: 2,  title_en: 'Nuclear Safety',                 category: 'Legal & Regulatory', status: 'partial',    sort_order: 2,  analysis_en: 'NRA has been established and is building capacity. Staffing and technical expertise for construction-phase oversight remain below what will be required.' },
    { country_id: gh.id, number: 3,  title_en: 'Management',                     category: 'Management',         status: 'partial',    sort_order: 3,  analysis_en: 'NPG is the designated implementing agency with an established structure. Owner engineer capacity and project management systems need further development.' },
    { country_id: gh.id, number: 4,  title_en: 'Funding and Financing',          category: 'Management',         status: 'not_met',    sort_order: 4,  analysis_en: 'No financing framework has been agreed for the Ghana NPP. Full project financing has not been secured.' },
    { country_id: gh.id, number: 5,  title_en: 'Legislative Framework',          category: 'Legal & Regulatory', status: 'partial',    sort_order: 5,  analysis_en: 'The NRA Act (2015) provides a legal basis. Nuclear power-specific legislation covering liability, fuel cycle, and waste management requires enactment.' },
    { country_id: gh.id, number: 6,  title_en: 'Safeguards',                     category: 'Legal & Regulatory', status: 'met',        sort_order: 6,  analysis_en: 'Ghana has a Comprehensive Safeguards Agreement and Additional Protocol in force. Safeguards implementation is in good standing.' },
    { country_id: gh.id, number: 7,  title_en: 'Radiation Protection',           category: 'Safety & Security',  status: 'partial',    sort_order: 7,  analysis_en: 'A radiation protection framework exists under NRA. Emergency planning and off-site radiation monitoring for an NPP require significant development.' },
    { country_id: gh.id, number: 8,  title_en: 'Electrical Grid',                category: 'Infrastructure',     status: 'partial',    sort_order: 8,  analysis_en: 'Grid reliability and stability upgrades are needed to safely integrate 924 MWe of SMR baseload. Interconnection studies have not been completed.' },
    { country_id: gh.id, number: 9,  title_en: 'Human Resource Development',     category: 'Workforce',          status: 'in_progress', sort_order: 9,  analysis_en: 'Ghana is designated a regional SMR training hub. Current trained personnel (~150) represent a fraction of the ~500 needed for construction and operation.' },
    { country_id: gh.id, number: 10, title_en: 'Stakeholder Involvement',        category: 'Management',         status: 'in_progress', sort_order: 10, analysis_en: 'Public engagement at Nsuban is ongoing. Community acceptance processes are active. National communication requires a structured programme.' },
    { country_id: gh.id, number: 11, title_en: 'Site and Supporting Facilities', category: 'Infrastructure',     status: 'in_progress', sort_order: 11, analysis_en: 'IAEA SEED mission endorsed Nsuban. Detailed site characterisation is ongoing. Access infrastructure requires development.' },
    { country_id: gh.id, number: 12, title_en: 'Environmental Protection',       category: 'Safety & Security',  status: 'in_progress', sort_order: 12, analysis_en: 'Environmental impact assessment work has commenced. Baseline studies are underway. Formal EIA submission to NRA is pending.' },
    { country_id: gh.id, number: 13, title_en: 'Emergency Planning',             category: 'Safety & Security',  status: 'not_met',    sort_order: 13, analysis_en: 'No formal off-site emergency planning zones exist. Authorities have not received nuclear emergency training. This is a critical gap.' },
    { country_id: gh.id, number: 14, title_en: 'Nuclear Security',               category: 'Safety & Security',  status: 'partial',    sort_order: 14, analysis_en: 'Ghana has ratified key nuclear security conventions. Physical protection regulations need strengthening to IAEA INFCIRC/225 Rev.5 standards.' },
    { country_id: gh.id, number: 15, title_en: 'Nuclear Fuel Cycle',             category: 'Infrastructure',     status: 'partial',    sort_order: 15, analysis_en: 'NuScale fuel supply arrangements are part of the commercial framework. A national policy on spent fuel and long-term waste management must be developed.' },
    { country_id: gh.id, number: 16, title_en: 'Radioactive Waste',              category: 'Infrastructure',     status: 'not_met',    sort_order: 16, analysis_en: 'No national radioactive waste management strategy has been designated. This must be established before construction licence issuance.' },
    { country_id: gh.id, number: 17, title_en: 'Industrial Involvement',         category: 'Infrastructure',     status: 'partial',    sort_order: 17, analysis_en: 'No formal local content programme exists. SMR modular design may allow some construction-phase local participation.' },
    { country_id: gh.id, number: 18, title_en: 'Procurement',                    category: 'Management',         status: 'partial',    sort_order: 18, analysis_en: 'Nuclear-grade procurement procedures are being developed. Vendor qualification and quality assurance systems need to be established.' },
    { country_id: gh.id, number: 19, title_en: 'Owner/Operator',                 category: 'Management',         status: 'partial',    sort_order: 19, analysis_en: 'NPG is designated but has no operational nuclear experience. Developing operator capability through training and international secondments is the central challenge.' },
    // Kenya
    { country_id: ke.id, number: 1,  title_en: 'National Position',              category: 'Legal & Regulatory', status: 'met',        sort_order: 1,  analysis_en: 'Kenya commitment is formally established through the Nuclear Electricity Act (2019) and reaffirmed by President Ruto at ICoNE 2026.' },
    { country_id: ke.id, number: 2,  title_en: 'Nuclear Safety',                 category: 'Legal & Regulatory', status: 'partial',    sort_order: 2,  analysis_en: 'KNRA has been established and is developing capacity with US NRC and IAEA support. A regulatory MoU with US NRC (2024) is accelerating capability building.' },
    { country_id: ke.id, number: 3,  title_en: 'Management',                     category: 'Management',         status: 'partial',    sort_order: 3,  analysis_en: 'NuPEA has a credible structure and Strategic Plan. Owner engineer capability and project management systems need further development.' },
    { country_id: ke.id, number: 4,  title_en: 'Funding and Financing',          category: 'Management',         status: 'not_met',    sort_order: 4,  analysis_en: 'No financing framework has been agreed. The project cannot proceed to construction without resolved financing for the $3.8B investment.' },
    { country_id: ke.id, number: 5,  title_en: 'Legislative Framework',          category: 'Legal & Regulatory', status: 'met',        sort_order: 5,  analysis_en: 'The Nuclear Electricity Act (2019) provides a solid foundation. Secondary regulations and nuclear liability legislation may need updates.' },
    { country_id: ke.id, number: 6,  title_en: 'Safeguards',                     category: 'Legal & Regulatory', status: 'met',        sort_order: 6,  analysis_en: 'Kenya has a Comprehensive Safeguards Agreement and Additional Protocol in force. Safeguards are in good standing.' },
    { country_id: ke.id, number: 7,  title_en: 'Radiation Protection',           category: 'Safety & Security',  status: 'partial',    sort_order: 7,  analysis_en: 'Radiation protection framework is in place under KNRA. Emergency planning for an NPP requires significant development.' },
    { country_id: ke.id, number: 8,  title_en: 'Electrical Grid',                category: 'Infrastructure',     status: 'partial',    sort_order: 8,  analysis_en: 'Kenya grid is growing (geothermal-led). Grid stability studies for integrating 1,000-2,000 MWe of nuclear baseload at Siaya are underway.' },
    { country_id: ke.id, number: 9,  title_en: 'Human Resource Development',     category: 'Workforce',          status: 'in_progress', sort_order: 9,  analysis_en: 'KAERI has trained ~60 Kenyan engineers. NuPEA targets ~1,000 personnel before construction. University of Nairobi and JKUAT offer nuclear engineering degrees.' },
    { country_id: ke.id, number: 10, title_en: 'Stakeholder Involvement',        category: 'Management',         status: 'in_progress', sort_order: 10, analysis_en: 'Community opposition at Kilifi forced relocation to Siaya. New engagement processes are active. National communication remains a priority gap.' },
    { country_id: ke.id, number: 11, title_en: 'Site and Supporting Facilities', category: 'Infrastructure',     status: 'in_progress', sort_order: 11, analysis_en: 'Five candidate sites in Siaya are being evaluated following the shift from Kilifi. KAERI feasibility study methodology guides assessment.' },
    { country_id: ke.id, number: 12, title_en: 'Environmental Protection',       category: 'Safety & Security',  status: 'in_progress', sort_order: 12, analysis_en: 'Environmental baseline studies are underway at candidate Siaya sites. A formal ESIA will be required before KNRA construction licence application.' },
    { country_id: ke.id, number: 13, title_en: 'Emergency Planning',             category: 'Safety & Security',  status: 'not_met',    sort_order: 13, analysis_en: 'No formal off-site emergency planning zone exists. County and national emergency frameworks do not include nuclear emergency provisions.' },
    { country_id: ke.id, number: 14, title_en: 'Nuclear Security',               category: 'Safety & Security',  status: 'partial',    sort_order: 14, analysis_en: 'Kenya has ratified nuclear security conventions. Physical protection regulations are being developed. Export control systems need strengthening.' },
    { country_id: ke.id, number: 15, title_en: 'Nuclear Fuel Cycle',             category: 'Infrastructure',     status: 'partial',    sort_order: 15, analysis_en: 'Fuel arrangements depend on technology selection. KAERI feasibility includes fuel cycle considerations. Waste management policy must be developed.' },
    { country_id: ke.id, number: 16, title_en: 'Radioactive Waste',              category: 'Infrastructure',     status: 'not_met',    sort_order: 16, analysis_en: 'No national radioactive waste management strategy has been adopted. A framework and repository siting process must be initiated during Phase 2.' },
    { country_id: ke.id, number: 17, title_en: 'Industrial Involvement',         category: 'Infrastructure',     status: 'partial',    sort_order: 17, analysis_en: 'Kenya has a manufacturing sector but no nuclear-grade industrial base. A local content strategy for the NPP has not been developed.' },
    { country_id: ke.id, number: 18, title_en: 'Procurement',                    category: 'Management',         status: 'partial',    sort_order: 18, analysis_en: 'NuPEA is developing procurement frameworks. Nuclear-grade vendor qualification and quality assurance systems must be established.' },
    { country_id: ke.id, number: 19, title_en: 'Owner/Operator',                 category: 'Management',         status: 'partial',    sort_order: 19, analysis_en: 'NuPEA is designated but has no operational experience. KAERI training builds technical capability. Extended engagement with an experienced operator is required.' },
    // Nigeria
    { country_id: ng.id, number: 1,  title_en: 'National Position',              category: 'Legal & Regulatory', status: 'met',        sort_order: 1,  analysis_en: 'Nigeria commitment is long-established through NAEC (founded 1976). The SMR pivot in 2025 reflects adaptation, not withdrawal from the nuclear commitment.' },
    { country_id: ng.id, number: 2,  title_en: 'Nuclear Safety',                 category: 'Legal & Regulatory', status: 'partial',    sort_order: 2,  analysis_en: 'NNRA is established and has NIRR-1 oversight experience. Regulatory capacity for large-scale commercial NPP oversight is substantially below what is required.' },
    { country_id: ng.id, number: 3,  title_en: 'Management',                     category: 'Management',         status: 'partial',    sort_order: 3,  analysis_en: 'NAEC has a long institutional history but the SMR pivot has created strategic uncertainty. A clear owner engineer structure has not yet been formalised.' },
    { country_id: ng.id, number: 4,  title_en: 'Funding and Financing',          category: 'Management',         status: 'not_met',    sort_order: 4,  analysis_en: 'No financing framework has been agreed. With multiple competing partnerships active, no single financing lead has been identified.' },
    { country_id: ng.id, number: 5,  title_en: 'Legislative Framework',          category: 'Legal & Regulatory', status: 'partial',    sort_order: 5,  analysis_en: 'The Nuclear Safety and Radiation Protection Act (1995) predates modern IAEA standards and does not cover NPP licensing. New nuclear power legislation is required.' },
    { country_id: ng.id, number: 6,  title_en: 'Safeguards',                     category: 'Legal & Regulatory', status: 'met',        sort_order: 6,  analysis_en: 'Nigeria has a Comprehensive Safeguards Agreement and Additional Protocol in force. NIRR-1 safeguards experience provides a positive foundation.' },
    { country_id: ng.id, number: 7,  title_en: 'Radiation Protection',           category: 'Safety & Security',  status: 'partial',    sort_order: 7,  analysis_en: 'Radiation protection regulations exist under NNRA with NIRR-1 operational experience. Commercial NPP emergency planning scale far exceeds current capacity.' },
    { country_id: ng.id, number: 8,  title_en: 'Electrical Grid',                category: 'Infrastructure',     status: 'partial',    sort_order: 8,  analysis_en: 'Nigeria grid reliability is poor. Total installed capacity (~13 GW) is well below demand. SMR phased deployment may better suit current grid conditions.' },
    { country_id: ng.id, number: 9,  title_en: 'Human Resource Development',     category: 'Workforce',          status: 'in_progress', sort_order: 9,  analysis_en: 'Nigeria has the strongest nuclear research base in sub-Saharan Africa with NIRR-1 experience, 6+ university programmes, and 50+ IAEA fellows.' },
    { country_id: ng.id, number: 10, title_en: 'Stakeholder Involvement',        category: 'Management',         status: 'partial',    sort_order: 10, analysis_en: 'Public awareness exists given the programme long history. Formal engagement programmes at Geregu and Itu communities are not documented.' },
    { country_id: ng.id, number: 11, title_en: 'Site and Supporting Facilities', category: 'Infrastructure',     status: 'in_progress', sort_order: 11, analysis_en: 'Both Geregu and Itu are advancing toward bankable feasibility studies. Geotechnical and seismic surveys are underway. Supporting infrastructure needs are substantial.' },
    { country_id: ng.id, number: 12, title_en: 'Environmental Protection',       category: 'Safety & Security',  status: 'in_progress', sort_order: 12, analysis_en: 'Environmental baseline studies are ongoing at both candidate sites. Formal EIAs must be completed and approved before construction licensing.' },
    { country_id: ng.id, number: 13, title_en: 'Emergency Planning',             category: 'Safety & Security',  status: 'not_met',    sort_order: 13, analysis_en: 'No formal off-site emergency planning zones exist for Geregu or Itu. State and federal emergency agencies have no nuclear-specific training or procedures.' },
    { country_id: ng.id, number: 14, title_en: 'Nuclear Security',               category: 'Safety & Security',  status: 'partial',    sort_order: 14, analysis_en: 'Nigeria has ratified the CPPNM Amendment. Physical protection regulations exist for NIRR-1 but need substantial upgrading for a commercial NPP environment.' },
    { country_id: ng.id, number: 15, title_en: 'Nuclear Fuel Cycle',             category: 'Infrastructure',     status: 'partial',    sort_order: 15, analysis_en: 'Technology selection is unresolved, making fuel cycle planning premature. A vendor-neutral fuel cycle policy and spent fuel management strategy must be developed.' },
    { country_id: ng.id, number: 16, title_en: 'Radioactive Waste',              category: 'Infrastructure',     status: 'not_met',    sort_order: 16, analysis_en: 'No national radioactive waste management strategy covering power plant volumes has been adopted. Existing policy covers only research reactor and medical sources.' },
    { country_id: ng.id, number: 17, title_en: 'Industrial Involvement',         category: 'Infrastructure',     status: 'partial',    sort_order: 17, analysis_en: 'Nigeria has a manufacturing sector capable of some construction-phase participation. No formal local content programme for nuclear has been established.' },
    { country_id: ng.id, number: 18, title_en: 'Procurement',                    category: 'Management',         status: 'not_met',    sort_order: 18, analysis_en: 'Nuclear-grade procurement procedures have not been established. With technology selection unresolved, a coherent procurement framework cannot yet be developed.' },
    { country_id: ng.id, number: 19, title_en: 'Owner/Operator',                 category: 'Management',         status: 'partial',    sort_order: 19, analysis_en: 'NAEC has only research reactor operational experience via NIRR-1. Commercial NPP operator development requires a dedicated international training programme — not yet formalised.' },
  ]
  for (const issue of africaIssues) {
    await upsertBy('infrastructure_issues', { country_id: issue.country_id, number: issue.number }, issue as Record<string, unknown>)
  }
  console.log(`✅  African infrastructure issues: ${africaIssues.length} upserted`)


  // ── ASIAN COUNTRIES ────────────────────────────────────────────────────────
  console.log('\n⏳  Upserting Asian newcomer countries...')
  const { data: asiaCountries, error: asErr } = await db
    .from('countries')
    .upsert(
      [
        { code: 'id', name_en: 'Indonesia', name_vi: 'Indonesia', flag: '🇮🇩', iaea_phase: 1, program_status: 'Active', first_plant_target: 2035, total_capacity_gw: 35.0, region: 'Southeast Asia' },
        { code: 'ph', name_en: 'Philippines', name_vi: 'Philippines', flag: '🇵🇭', iaea_phase: 1, program_status: 'Active', first_plant_target: 2032, total_capacity_gw: 2.4, region: 'Southeast Asia' },
        { code: 'bd', name_en: 'Bangladesh', name_vi: 'Bangladesh', flag: '🇧🇩', iaea_phase: 3, program_status: 'Under Construction', first_plant_target: 2025, total_capacity_gw: 2.4, region: 'South Asia' },
        { code: 'kz', name_en: 'Kazakhstan', name_vi: 'Kazakhstan', flag: '🇰🇿', iaea_phase: 2, program_status: 'Active', first_plant_target: 2035, total_capacity_gw: 2.4, region: 'Central Asia' },
      ],
      { onConflict: 'code' },
    )
    .select()
  if (asErr) throw asErr
  const id = asiaCountries!.find((c: { code: string }) => c.code === 'id') as { id: string; code: string }
  const ph = asiaCountries!.find((c: { code: string }) => c.code === 'ph') as { id: string; code: string }
  const bd = asiaCountries!.find((c: { code: string }) => c.code === 'bd') as { id: string; code: string }
  const kz = asiaCountries!.find((c: { code: string }) => c.code === 'kz') as { id: string; code: string }
  console.log(`✅  Asian countries: ${asiaCountries!.length} upserted`)

  // ── ASIAN PLANTS ───────────────────────────────────────────────────────────
  console.log('⏳  Upserting Asian plants...')
  const asiaPlants = [
    { country_id: id.id, code: 'IDNPP1', name_en: 'Indonesia NPP (TBD Site)', owner_en: 'PLN (Perusahaan Listrik Negara)', technology: 'TBD — SMR preferred; TerraPower, SMART, Nuward in discussions', capacity: 500, target_completion: 2035, current_phase_en: 'Site Selection', progress_pct: 7, status: 'active', partner_country: 'Multiple', partner_org: 'USA / South Korea / France competing' },
    { country_id: ph.id, code: 'PHBAT1', name_en: 'Bataan NPP (Morong, Bataan)', owner_en: 'PSALM / NPC (Power Sector Assets and Liabilities Management)', technology: 'Westinghouse PWR (620 MWe) — built 1976-1984, never fuelled', capacity: 620, target_completion: 2032, current_phase_en: 'Technical Assessment', progress_pct: 15, status: 'active', partner_country: 'South Korea', partner_org: 'KHNP (feasibility study)' },
    { country_id: ph.id, code: 'PHNEW1', name_en: 'Philippines New NPP (TBD Site)', owner_en: 'DOE Philippines / TBD private consortium', technology: 'TBD — SMR options; NuScale, BWRX-300, APR-1000 in discussions', capacity: 1000, target_completion: 2037, current_phase_en: 'Site Identification', progress_pct: 5, status: 'active', partner_country: 'Multiple', partner_org: 'USA / South Korea competing' },
    { country_id: bd.id, code: 'BDRP1',  name_en: 'Rooppur NPP Unit 1', owner_en: 'NPCBL (Nuclear Power Company of Bangladesh Ltd.)', technology: 'VVER-1200 (Gen III+) — Rosatom AES-2006 design', capacity: 1200, target_completion: 2025, current_phase_en: 'Pre-operational — commissioning', progress_pct: 88, status: 'active', partner_country: 'Russia', partner_org: 'Rosatom / ASE Group' },
    { country_id: bd.id, code: 'BDRP2',  name_en: 'Rooppur NPP Unit 2', owner_en: 'NPCBL (Nuclear Power Company of Bangladesh Ltd.)', technology: 'VVER-1200 (Gen III+) — Rosatom AES-2006 design', capacity: 1200, target_completion: 2027, current_phase_en: 'Construction — reactor vessel installed', progress_pct: 72, status: 'active', partner_country: 'Russia', partner_org: 'Rosatom / ASE Group' },
    { country_id: kz.id, code: 'KZULK1', name_en: 'Ulken NPP (Lake Balkhash)', owner_en: 'KATEP (Kazakhstan Atomic Energy Power Company)', technology: 'TBD — VVER-1200, APR-1400, HPR-1000, EPR2 all proposed', capacity: 2400, target_completion: 2035, current_phase_en: 'Site Preparation', progress_pct: 14, status: 'active', partner_country: 'Multiple', partner_org: 'Russia / China / South Korea / France competing' },
  ]
  const asiaPlantIds: Record<string, string> = {}
  for (const plant of asiaPlants) {
    const pid = await upsertBy('plants', { code: plant.code }, plant as Record<string, unknown>)
    asiaPlantIds[plant.code] = pid
    console.log(`    ✅  ${plant.code}  ${plant.name_en}`)
  }

  // ── ASIAN PLANT MILESTONES ─────────────────────────────────────────────────
  console.log('⏳  Upserting Asian plant milestones...')
  const idnpp1 = asiaPlantIds['IDNPP1']
  const phbat1 = asiaPlantIds['PHBAT1']
  const phnew1 = asiaPlantIds['PHNEW1']
  const bdrp1  = asiaPlantIds['BDRP1']
  const bdrp2  = asiaPlantIds['BDRP2']
  const kzulk1 = asiaPlantIds['KZULK1']

  const asiaMilestones = [
    // Indonesia
    { plant_id: idnpp1, title_en: 'INIR Phase 1 review completed — key gaps identified', status: 'completed', completed_date: '2023-06-30', is_public: true, sort_order: 1 },
    { plant_id: idnpp1, title_en: 'National Energy Plan 2024 mandates nuclear — PLN designated', status: 'completed', completed_date: '2024-01-31', is_public: true, sort_order: 2 },
    { plant_id: idnpp1, title_en: 'TerraPower Natrium SMR MoU signed with PLN', status: 'completed', completed_date: '2023-10-31', is_public: true, sort_order: 3 },
    { plant_id: idnpp1, title_en: 'Final site selection completed', status: 'pending', target_date: '2026-12-31', is_public: true, sort_order: 4 },
    { plant_id: idnpp1, title_en: 'Technology and vendor selection decision', status: 'pending', target_date: '2027-06-30', is_public: true, sort_order: 5 },
    { plant_id: idnpp1, title_en: 'Financing framework and EPC contract agreed', status: 'pending', target_date: '2028-12-31', is_public: true, sort_order: 6 },
    { plant_id: idnpp1, title_en: 'First concrete pour', status: 'pending', target_date: '2030-01-01', is_public: true, sort_order: 7 },
    { plant_id: idnpp1, title_en: 'Commercial operation — first unit', status: 'pending', target_date: '2035-12-31', is_public: true, sort_order: 8 },
    // Philippines Bataan
    { plant_id: phbat1, title_en: 'EO 116 signed — nuclear program relaunched', status: 'completed', completed_date: '2023-11-30', is_public: true, sort_order: 1 },
    { plant_id: phbat1, title_en: 'KHNP Bataan feasibility study MoU signed', status: 'completed', completed_date: '2023-11-30', is_public: true, sort_order: 2 },
    { plant_id: phbat1, title_en: 'KHNP feasibility study delivered', status: 'in_progress', target_date: '2025-09-30', is_public: true, sort_order: 3 },
    { plant_id: phbat1, title_en: 'Government decision on Bataan rehabilitation', status: 'pending', target_date: '2026-03-31', is_public: true, sort_order: 4 },
    { plant_id: phbat1, title_en: 'Rehabilitation works commence', status: 'pending', target_date: '2027-01-01', is_public: true, sort_order: 5 },
    { plant_id: phbat1, title_en: 'Commercial operation — Bataan restored', status: 'pending', target_date: '2032-12-31', is_public: true, sort_order: 6 },
    // Philippines New Site
    { plant_id: phnew1, title_en: 'Nuclear Power Steering Committee established', status: 'completed', completed_date: '2023-04-30', is_public: true, sort_order: 1 },
    { plant_id: phnew1, title_en: 'New site identification study commenced', status: 'in_progress', target_date: '2026-12-31', is_public: true, sort_order: 2 },
    { plant_id: phnew1, title_en: 'Technology selection and financing agreed', status: 'pending', target_date: '2029-01-01', is_public: true, sort_order: 3 },
    { plant_id: phnew1, title_en: 'Commercial operation — new site', status: 'pending', target_date: '2037-12-31', is_public: true, sort_order: 4 },
    // Bangladesh Rooppur Unit 1
    { plant_id: bdrp1, title_en: 'First concrete pour — Unit 1', status: 'completed', completed_date: '2017-11-30', is_public: true, sort_order: 1 },
    { plant_id: bdrp1, title_en: 'Reactor pressure vessel installed — Unit 1', status: 'completed', completed_date: '2021-10-31', is_public: true, sort_order: 2 },
    { plant_id: bdrp1, title_en: 'Nuclear fuel loaded — Unit 1', status: 'completed', completed_date: '2023-10-05', is_public: true, sort_order: 3 },
    { plant_id: bdrp1, title_en: 'First criticality — Unit 1', status: 'in_progress', target_date: '2025-06-30', is_public: true, sort_order: 4 },
    { plant_id: bdrp1, title_en: 'Grid connection and commercial operation — Unit 1', status: 'pending', target_date: '2025-12-31', is_public: true, sort_order: 5 },
    // Bangladesh Rooppur Unit 2
    { plant_id: bdrp2, title_en: 'First concrete pour — Unit 2', status: 'completed', completed_date: '2018-07-14', is_public: true, sort_order: 1 },
    { plant_id: bdrp2, title_en: 'Reactor pressure vessel installed — Unit 2', status: 'completed', completed_date: '2022-12-31', is_public: true, sort_order: 2 },
    { plant_id: bdrp2, title_en: 'Cold hydraulic tests completed — Unit 2', status: 'completed', completed_date: '2023-12-31', is_public: true, sort_order: 3 },
    { plant_id: bdrp2, title_en: 'Hot functional tests — Unit 2', status: 'in_progress', target_date: '2025-09-30', is_public: true, sort_order: 4 },
    { plant_id: bdrp2, title_en: 'Fuel loading — Unit 2', status: 'pending', target_date: '2026-06-30', is_public: true, sort_order: 5 },
    { plant_id: bdrp2, title_en: 'Grid connection and commercial operation — Unit 2', status: 'pending', target_date: '2027-12-31', is_public: true, sort_order: 6 },
    // Kazakhstan Ulken
    { plant_id: kzulk1, title_en: 'National referendum approved — 71% yes vote', status: 'completed', completed_date: '2024-10-06', is_public: true, sort_order: 1 },
    { plant_id: kzulk1, title_en: 'INIR Phase 2 review completed', status: 'completed', completed_date: '2024-06-30', is_public: true, sort_order: 2 },
    { plant_id: kzulk1, title_en: 'Technology and vendor selection decision', status: 'in_progress', target_date: '2026-06-30', is_public: true, sort_order: 3 },
    { plant_id: kzulk1, title_en: 'Intergovernmental agreement with selected vendor signed', status: 'pending', target_date: '2026-12-31', is_public: true, sort_order: 4 },
    { plant_id: kzulk1, title_en: 'Financing framework agreed', status: 'pending', target_date: '2027-06-30', is_public: true, sort_order: 5 },
    { plant_id: kzulk1, title_en: 'Construction licence issued', status: 'pending', target_date: '2028-01-01', is_public: true, sort_order: 6 },
    { plant_id: kzulk1, title_en: 'First concrete pour — Unit 1', status: 'pending', target_date: '2028-12-31', is_public: true, sort_order: 7 },
    { plant_id: kzulk1, title_en: 'Commercial operation — Unit 1', status: 'pending', target_date: '2035-12-31', is_public: true, sort_order: 8 },
  ]
  for (const m of asiaMilestones) {
    await upsertBy('plant_milestones', { plant_id: m.plant_id, sort_order: m.sort_order }, m as Record<string, unknown>)
  }
  console.log(`✅  Asian plant milestones: ${asiaMilestones.length} upserted`)

  // ── ASIAN KEY ORGANIZATIONS ────────────────────────────────────────────────
  console.log('⏳  Upserting Asian key organizations...')
  const asiaOrgs = [
    // Indonesia
    { country_id: id.id, name: 'PLN',     role_en: 'Perusahaan Listrik Negara — state utility, designated NPP owner-operator', type: 'owner',         sort_order: 1 },
    { country_id: id.id, name: 'BRIN',    role_en: 'National Research and Innovation Agency (absorbed BATAN 2022)', type: 'research',       sort_order: 2 },
    { country_id: id.id, name: 'BAPETEN', role_en: 'Nuclear Energy Regulatory Agency — licensing and safety oversight', type: 'regulator',      sort_order: 3 },
    { country_id: id.id, name: 'TerraPower', flag: '🇺🇸', role_en: 'Natrium SMR technology partner — MoU with PLN 2023', type: 'contractor',     sort_order: 4 },
    { country_id: id.id, name: 'KHNP Indonesia', flag: '🇰🇷', role_en: 'South Korea technology and financing partner — SMART reactor', type: 'contractor',     sort_order: 5 },
    // Philippines
    { country_id: ph.id, name: 'PNRI',   role_en: 'Philippine Nuclear Research Institute — NEPIO and regulator', type: 'regulator',      sort_order: 1 },
    { country_id: ph.id, name: 'NPC',    role_en: 'National Power Corporation — owns Bataan NPP asset', type: 'owner',         sort_order: 2 },
    { country_id: ph.id, name: 'PSALM',  role_en: 'Power Sector Assets and Liabilities Management — Bataan asset manager', type: 'owner',         sort_order: 3 },
    { country_id: ph.id, name: 'KHNP Philippines', flag: '🇰🇷', role_en: 'Korea Hydro & Nuclear Power — Bataan feasibility study lead', type: 'contractor',     sort_order: 4 },
    { country_id: ph.id, name: 'US NRC Philippines', flag: '🇺🇸', role_en: 'US Nuclear Regulatory Commission — regulatory cooperation partner', type: 'international', sort_order: 5 },
    // Bangladesh
    { country_id: bd.id, name: 'NPCBL',   role_en: 'Nuclear Power Company of Bangladesh Ltd. — Rooppur owner-operator', type: 'owner',         sort_order: 1 },
    { country_id: bd.id, name: 'BAEC',    role_en: 'Bangladesh Atomic Energy Commission — national focal agency', type: 'research',       sort_order: 2 },
    { country_id: bd.id, name: 'BNRDA',   role_en: 'Bangladesh Nuclear Regulatory and Development Authority — licensing', type: 'regulator',      sort_order: 3 },
    { country_id: bd.id, name: 'Rosatom Bangladesh', flag: '🇷🇺', role_en: 'Primary EPC contractor, fuel supplier, and O&M partner', type: 'contractor',     sort_order: 4 },
    // Kazakhstan
    { country_id: kz.id, name: 'KATEP',   role_en: 'Kazakhstan Atomic Energy Power Company — Ulken NPP owner', type: 'owner',         sort_order: 1 },
    { country_id: kz.id, name: 'KAEC',    role_en: 'Kazakhstan Atomic Energy Committee — nuclear regulator', type: 'regulator',      sort_order: 2 },
    { country_id: kz.id, name: 'NNC',     role_en: 'National Nuclear Centre — research and testing at Kurchatov', type: 'research',       sort_order: 3 },
    { country_id: kz.id, name: 'Kazatomprom', role_en: 'State uranium mining company — world #1 uranium producer', type: 'research',       sort_order: 4 },
    { country_id: kz.id, name: 'Rosatom Kazakhstan', flag: '🇷🇺', role_en: 'Legacy partner — VVER-1200 proposed for Ulken', type: 'contractor',     sort_order: 5 },
  ]
  for (const org of asiaOrgs) {
    await upsertBy('key_organizations', { country_id: org.country_id, name: org.name }, org as Record<string, unknown>)
  }
  console.log(`✅  Asian key organizations: ${asiaOrgs.length} upserted`)

  // ── ASIAN DEVELOPMENTS ─────────────────────────────────────────────────────
  console.log('⏳  Upserting Asian developments...')
  const asiaDevelopments = [
    // Indonesia
    { country_id: id.id, title_en: 'National Energy Plan 2024 Mandates Nuclear Power', body_en: 'Indonesia updated National Energy Plan (RUEN 2024) mandates nuclear power in the energy mix, with PLN designated as owner-operator and first plant targeted by 2035.', date: '2024-01-31', category: 'Policy', is_public: true },
    { country_id: id.id, title_en: 'TerraPower Signs Natrium SMR MoU with PLN', body_en: 'TerraPower and PLN signed a memorandum of understanding to explore deploying Natrium SMR technology in Indonesia, the most concrete US-Indonesia nuclear cooperation step to date.', date: '2023-10-31', category: 'Partnership', is_public: true },
    { country_id: id.id, title_en: 'INIR Phase 1 Review Completed — Key Gaps Identified', body_en: 'The IAEA completed Indonesia first Integrated Nuclear Infrastructure Review (INIR) Phase 1 mission in June 2023, identifying key gaps in legislation, financing, and human resources.', date: '2023-06-30', category: 'Regulatory', is_public: true },
    { country_id: id.id, title_en: 'France and Indonesia Sign Nuclear Cooperation MoU', body_en: 'France and Indonesia signed a nuclear energy cooperation memorandum in March 2023, with EDF and Framatome presenting Nuward SMR options alongside EPR technology.', date: '2023-03-31', category: 'Partnership', is_public: true },
    { country_id: id.id, title_en: 'BATAN Absorbed into BRIN — Research Continuity Assured', body_en: 'Indonesia National Nuclear Energy Agency (BATAN) was merged into the new National Research and Innovation Agency (BRIN) in November 2022, with research continuity maintained.', date: '2022-11-01', category: 'Policy', is_public: true },
    // Philippines
    { country_id: ph.id, title_en: 'KHNP Begins Bataan NPP Technical Feasibility Study', body_en: 'Korea Hydro & Nuclear Power began the detailed technical feasibility study for Bataan NPP rehabilitation in February 2024, covering structural integrity, equipment replacement, and safety upgrades.', date: '2024-02-29', category: 'Technical', is_public: true },
    { country_id: ph.id, title_en: 'EO 116 Formally Relaunches Philippine Nuclear Power Program', body_en: 'President Marcos signed Executive Order 116 in November 2023, formally relaunching the Philippine nuclear power program and directing PNRI, DOE, and NPC to advance Bataan rehabilitation and new site identification.', date: '2023-11-30', category: 'Policy', is_public: true },
    { country_id: ph.id, title_en: 'Philippines and USA Sign Civil Nuclear Cooperation MoU', body_en: 'The Philippines and United States signed a memorandum of understanding on civil nuclear cooperation in July 2023, opening the path to a 123 Agreement and potential US technology transfer.', date: '2023-07-31', category: 'Partnership', is_public: true },
    { country_id: ph.id, title_en: 'Nuclear Power Steering Committee Established', body_en: 'The Department of Energy established a Nuclear Power Steering Committee and designated PNRI as the NEPIO in April 2023, formally structuring the institutional framework.', date: '2023-04-30', category: 'Policy', is_public: true },
    { country_id: ph.id, title_en: 'President Marcos Declares Nuclear Power a National Priority', body_en: 'President Ferdinand Marcos Jr. declared nuclear power a priority energy source in his first State of the Nation address in January 2023, reversing decades of post-Chernobyl policy.', date: '2023-01-31', category: 'Policy', is_public: true },
    // Bangladesh
    { country_id: bd.id, title_en: 'Rooppur Unit 1 Nuclear Fuel Loaded — First in Bangladesh History', body_en: 'Rooppur NPP Unit 1 received its first nuclear fuel load in October 2023, a historic milestone marking Bangladesh entry into the nuclear power age. Physical commissioning is proceeding toward first criticality.', date: '2023-10-05', category: 'Technical', is_public: true },
    { country_id: bd.id, title_en: 'INIR Phase 3 Review Confirms Construction-Phase Readiness', body_en: 'The IAEA completed an INIR Phase 3 review of Bangladesh in June 2023, confirming the country has addressed key infrastructure issues for the construction phase.', date: '2023-06-30', category: 'Regulatory', is_public: true },
    { country_id: bd.id, title_en: 'Rooppur Unit 2 Reactor Vessel Installed', body_en: 'The reactor pressure vessel for Rooppur Unit 2 was installed in December 2022, with construction advancing on schedule toward hot functional tests in 2025.', date: '2022-12-31', category: 'Technical', is_public: true },
    { country_id: bd.id, title_en: 'Bangladesh Completes First OSART Preparatory Mission at Rooppur', body_en: 'The IAEA conducted an Operational Safety Review Team preparatory mission at Rooppur in September 2022, assessing pre-operational safety management before fuel loading.', date: '2022-09-30', category: 'Regulatory', is_public: true },
    { country_id: bd.id, title_en: 'BNRDA Issues Construction Licence for Rooppur Unit 2', body_en: 'Bangladesh nuclear regulator BNRDA issued the construction licence for Rooppur Unit 2 in October 2021, allowing full construction activities to proceed on the second 1,200 MWe VVER unit.', date: '2021-10-31', category: 'Regulatory', is_public: true },
    // Kazakhstan
    { country_id: kz.id, title_en: 'National Referendum Approves Nuclear Power Plant — 71% Yes Vote', body_en: 'Kazakhstan held a national referendum on 6 October 2024 where 71% of voters approved proceeding with construction of the Ulken NPP on Lake Balkhash, providing a democratic mandate.', date: '2024-10-06', category: 'Policy', is_public: true },
    { country_id: kz.id, title_en: 'INIR Phase 2 Mission Completed — Strong Infrastructure Progress Noted', body_en: 'The IAEA completed Kazakhstan second INIR Phase 2 mission in June 2024, recognising strong progress in legal, regulatory, and site development while flagging financing and vendor selection as critical pending items.', date: '2024-06-30', category: 'Regulatory', is_public: true },
    { country_id: kz.id, title_en: 'France Signs Nuclear Cooperation MoU — EPR2 Offered', body_en: 'France signed a nuclear cooperation MoU with Kazakhstan in November 2023, with EDF proposing the EPR2 reactor and emphasising its uranium processing relationship with Kazatomprom.', date: '2023-11-30', category: 'Partnership', is_public: true },
    { country_id: kz.id, title_en: 'China Signs Nuclear Cooperation MoU — HPR-1000 Proposed', body_en: 'China General Nuclear Power Corporation signed a nuclear cooperation MoU with Kazakhstan in September 2023, proposing the HPR-1000 Hualong One Gen III+ reactor with a state-backed financing package.', date: '2023-09-30', category: 'Partnership', is_public: true },
    { country_id: kz.id, title_en: 'Ulken Site Infrastructure Works Begin Ahead of Vendor Selection', body_en: 'Preliminary infrastructure works at the Ulken site on Lake Balkhash commenced in March 2023 — access roads, worker accommodation, and grid connection studies — in anticipation of vendor selection.', date: '2023-03-31', category: 'Technical', is_public: true },
  ]
  for (const dev of asiaDevelopments) {
    await upsertBy('developments', { country_id: dev.country_id, title_en: dev.title_en }, dev as Record<string, unknown>)
  }
  console.log(`✅  Asian developments: ${asiaDevelopments.length} upserted`)

  // ── ASIAN INFRASTRUCTURE ISSUES (19 per country) ──────────────────────────
  console.log('⏳  Upserting Asian infrastructure issues...')
  const asiaIssues = [
    // Indonesia
    { country_id: id.id, number: 1,  title_en: 'National Position',              category: 'Legal & Regulatory', status: 'met',         sort_order: 1,  analysis_en: 'Indonesia national position is formally established through the National Energy Plan 2024 (RUEN 2024) and presidential declarations. The commitment is clear at the highest level.' },
    { country_id: id.id, number: 2,  title_en: 'Nuclear Safety',                 category: 'Legal & Regulatory', status: 'partial',     sort_order: 2,  analysis_en: 'BAPETEN has been established as an independent regulator and has experience overseeing three research reactors. Regulatory capacity for an NPP is substantially below what will be required.' },
    { country_id: id.id, number: 3,  title_en: 'Management',                     category: 'Management',         status: 'partial',     sort_order: 3,  analysis_en: 'PLN has been designated as owner-operator and has an established project structure. Nuclear-specific owner engineer capability and project management systems must be built.' },
    { country_id: id.id, number: 4,  title_en: 'Funding and Financing',          category: 'Management',         status: 'not_met',     sort_order: 4,  analysis_en: 'No financing framework has been agreed. The estimated $5–10B per GW cost has no sovereign credit backing. This is the single largest barrier to Indonesia program.' },
    { country_id: id.id, number: 5,  title_en: 'Legislative Framework',          category: 'Legal & Regulatory', status: 'partial',     sort_order: 5,  analysis_en: 'The Nuclear Energy Act No. 10/1997 provides a basis but covers only research reactors. A new nuclear power law enabling NPP licensing, liability, and waste management is required.' },
    { country_id: id.id, number: 6,  title_en: 'Safeguards',                     category: 'Legal & Regulatory', status: 'met',         sort_order: 6,  analysis_en: 'Indonesia has a Comprehensive Safeguards Agreement and Additional Protocol in force. Safeguards are in good standing with IAEA experience at three research reactors.' },
    { country_id: id.id, number: 7,  title_en: 'Radiation Protection',           category: 'Safety & Security',  status: 'partial',     sort_order: 7,  analysis_en: 'A radiation protection framework exists under BAPETEN with three research reactors in operation. Emergency planning for an NPP requires substantial new infrastructure.' },
    { country_id: id.id, number: 8,  title_en: 'Electrical Grid',                category: 'Infrastructure',     status: 'partial',     sort_order: 8,  analysis_en: 'Grid fragmentation across 17,000 islands is a structural challenge. Java-Bali grid can absorb limited SMR capacity; outer island integration is technically complex.' },
    { country_id: id.id, number: 9,  title_en: 'Human Resource Development',     category: 'Workforce',          status: 'not_met',     sort_order: 9,  analysis_en: 'Fewer than 300 nuclear engineers nationwide is critically below the ~3,000 needed for construction and operation. University programmes exist but throughput is insufficient.' },
    { country_id: id.id, number: 10, title_en: 'Stakeholder Involvement',        category: 'Management',         status: 'in_progress', sort_order: 10, analysis_en: 'National communication about nuclear has increased since 2022. Public acceptance in seismically active areas and at candidate sites is a significant ongoing challenge.' },
    { country_id: id.id, number: 11, title_en: 'Site and Supporting Facilities', category: 'Infrastructure',     status: 'in_progress', sort_order: 11, analysis_en: 'Kalimantan and Bangka Island are leading candidates. No formal IAEA SEED mission has been conducted. Site characterisation studies are at an early stage.' },
    { country_id: id.id, number: 12, title_en: 'Environmental Protection',       category: 'Safety & Security',  status: 'not_met',     sort_order: 12, analysis_en: 'No environmental baseline studies have been initiated at candidate NPP sites. Environmental impact assessment frameworks will require adaptation for nuclear applications.' },
    { country_id: id.id, number: 13, title_en: 'Emergency Planning',             category: 'Safety & Security',  status: 'not_met',     sort_order: 13, analysis_en: 'No formal nuclear emergency planning zones or response structures exist. Indonesia national disaster agency (BNPB) has no nuclear-specific training or procedures.' },
    { country_id: id.id, number: 14, title_en: 'Nuclear Security',               category: 'Safety & Security',  status: 'partial',     sort_order: 14, analysis_en: 'Indonesia has ratified the CPPNM Amendment and has physical protection measures at research reactors. NPP-grade security systems need to be developed from scratch.' },
    { country_id: id.id, number: 15, title_en: 'Nuclear Fuel Cycle',             category: 'Infrastructure',     status: 'not_met',     sort_order: 15, analysis_en: 'Technology selection is unresolved, making fuel cycle planning premature. No national spent fuel or waste management policy for power reactor volumes exists.' },
    { country_id: id.id, number: 16, title_en: 'Radioactive Waste',              category: 'Infrastructure',     status: 'partial',     sort_order: 16, analysis_en: 'BRIN manages low and intermediate level waste from research reactors at Serpong. A national policy covering power reactor waste volumes must be developed.' },
    { country_id: id.id, number: 17, title_en: 'Industrial Involvement',         category: 'Infrastructure',     status: 'partial',     sort_order: 17, analysis_en: 'Indonesia has a substantial manufacturing sector. SMR modular construction may enable local participation. No nuclear local content programme has been established.' },
    { country_id: id.id, number: 18, title_en: 'Procurement',                    category: 'Management',         status: 'not_met',     sort_order: 18, analysis_en: 'Nuclear-grade procurement and quality assurance procedures have not been established. PLN standard procurement systems are not adapted for nuclear components.' },
    { country_id: id.id, number: 19, title_en: 'Owner/Operator',                 category: 'Management',         status: 'partial',     sort_order: 19, analysis_en: 'PLN is designated but has zero nuclear operational experience. Building an owner-operator organisation from PLN existing personnel is the central human capital challenge.' },
    // Philippines
    { country_id: ph.id, number: 1,  title_en: 'National Position',              category: 'Legal & Regulatory', status: 'met',         sort_order: 1,  analysis_en: 'EO 116 (2023) and President Marcos declarations have firmly re-established the national position. Political commitment is the clearest it has been since 1986.' },
    { country_id: ph.id, number: 2,  title_en: 'Nuclear Safety',                 category: 'Legal & Regulatory', status: 'partial',     sort_order: 2,  analysis_en: 'PNRI has research reactor regulatory experience. It does not currently have the legal mandate, staff, or technical capability to license and oversee an NPP. This must be legislated.' },
    { country_id: ph.id, number: 3,  title_en: 'Management',                     category: 'Management',         status: 'partial',     sort_order: 3,  analysis_en: 'PNRI is designated as NEPIO. NPC and PSALM hold the Bataan asset. A clear owner-operator structure for both Bataan (if rehabilitated) and new sites needs to be established.' },
    { country_id: ph.id, number: 4,  title_en: 'Funding and Financing',          category: 'Management',         status: 'not_met',     sort_order: 4,  analysis_en: 'No financing framework exists for either Bataan rehabilitation or new sites. KHNP feasibility study will define Bataan costs. Both tracks require sovereign or multilateral backing.' },
    { country_id: ph.id, number: 5,  title_en: 'Legislative Framework',          category: 'Legal & Regulatory', status: 'not_met',     sort_order: 5,  analysis_en: 'No nuclear power act exists. EO 116 provides executive authority but a comprehensive Nuclear Power Act covering licensing, liability, safeguards, and waste must be enacted by Congress.' },
    { country_id: ph.id, number: 6,  title_en: 'Safeguards',                     category: 'Legal & Regulatory', status: 'met',         sort_order: 6,  analysis_en: 'The Philippines has a Comprehensive Safeguards Agreement and Additional Protocol in force. Safeguards experience from the PRR-1 research reactor is in good standing.' },
    { country_id: ph.id, number: 7,  title_en: 'Radiation Protection',           category: 'Safety & Security',  status: 'partial',     sort_order: 7,  analysis_en: 'Radiation protection regulations exist under PNRI for research reactor operations. NPP-scale emergency planning for the densely populated Bataan peninsula requires major development.' },
    { country_id: ph.id, number: 8,  title_en: 'Electrical Grid',                category: 'Infrastructure',     status: 'partial',     sort_order: 8,  analysis_en: 'The Luzon grid is growing but reliability is variable. Bataan NPP location is well-sited for Luzon grid. Integration studies for 620–2,400 MWe addition are needed.' },
    { country_id: ph.id, number: 9,  title_en: 'Human Resource Development',     category: 'Workforce',          status: 'partial',     sort_order: 9,  analysis_en: 'PNRI has ~500 technical staff and five universities offer nuclear science. KHNP is training engineers under the Bataan MoU. Significant scale-up to ~1,000 professionals is needed.' },
    { country_id: ph.id, number: 10, title_en: 'Stakeholder Involvement',        category: 'Management',         status: 'in_progress', sort_order: 10, analysis_en: 'Public opinion is divided — national surveys show growing acceptance but Bataan-area communities have historic concerns. A structured engagement programme is underway but needs deepening.' },
    { country_id: ph.id, number: 11, title_en: 'Site and Supporting Facilities', category: 'Infrastructure',     status: 'in_progress', sort_order: 11, analysis_en: 'Bataan NPP infrastructure exists (incomplete). KHNP feasibility study will determine what remains usable. New site candidates in Mindanao and Visayas are at early identification stage.' },
    { country_id: ph.id, number: 12, title_en: 'Environmental Protection',       category: 'Safety & Security',  status: 'partial',     sort_order: 12, analysis_en: 'Bataan environmental baseline exists from original construction. KHNP feasibility study will update it. New site environmental studies have not commenced.' },
    { country_id: ph.id, number: 13, title_en: 'Emergency Planning',             category: 'Safety & Security',  status: 'not_met',     sort_order: 13, analysis_en: 'No formal nuclear emergency planning zones exist around Bataan or other candidate sites. The Bataan area is densely populated, making EPZ planning particularly complex.' },
    { country_id: ph.id, number: 14, title_en: 'Nuclear Security',               category: 'Safety & Security',  status: 'partial',     sort_order: 14, analysis_en: 'Philippines has ratified nuclear security conventions. Physical protection at PRR-1 is in place. NPP-grade physical protection regulations need to be developed and legislated.' },
    { country_id: ph.id, number: 15, title_en: 'Nuclear Fuel Cycle',             category: 'Infrastructure',     status: 'partial',     sort_order: 15, analysis_en: 'Bataan is a Westinghouse PWR; fuel would be sourced internationally. A national spent fuel and waste management policy covering NPP volumes must be developed.' },
    { country_id: ph.id, number: 16, title_en: 'Radioactive Waste',              category: 'Infrastructure',     status: 'not_met',     sort_order: 16, analysis_en: 'No national radioactive waste management strategy for power reactor volumes exists. PNRI manages research reactor and medical waste. A new framework is required.' },
    { country_id: ph.id, number: 17, title_en: 'Industrial Involvement',         category: 'Infrastructure',     status: 'partial',     sort_order: 17, analysis_en: 'The Philippines has a manufacturing base. Bataan rehabilitation may offer more local content opportunities than new construction. No nuclear local content programme exists.' },
    { country_id: ph.id, number: 18, title_en: 'Procurement',                    category: 'Management',         status: 'not_met',     sort_order: 18, analysis_en: 'Nuclear-grade procurement procedures have not been established. NPC and PSALM standard procurement systems are not adapted for nuclear components or services.' },
    { country_id: ph.id, number: 19, title_en: 'Owner/Operator',                 category: 'Management',         status: 'not_met',     sort_order: 19, analysis_en: 'No organisation has been designated as NPP owner-operator with a nuclear operating licence pathway. Establishing this for Bataan is the immediate priority before rehabilitation can proceed.' },
    // Bangladesh
    { country_id: bd.id, number: 1,  title_en: 'National Position',              category: 'Legal & Regulatory', status: 'met',         sort_order: 1,  analysis_en: 'Bangladesh national position is unambiguous — Rooppur is under active construction with first fuel loaded. The political commitment is irreversible at this stage.' },
    { country_id: bd.id, number: 2,  title_en: 'Nuclear Safety',                 category: 'Legal & Regulatory', status: 'met',         sort_order: 2,  analysis_en: 'BNRDA has been established and has issued construction licences for both Rooppur units. The IAEA INIR Phase 3 review confirmed regulatory readiness for the construction phase.' },
    { country_id: bd.id, number: 3,  title_en: 'Management',                     category: 'Management',         status: 'met',         sort_order: 3,  analysis_en: 'NPCBL is established as the owner-operator with a clear structure. Rosatom serves as EPC contractor. Management arrangements are functioning though heavily dependent on Rosatom.' },
    { country_id: bd.id, number: 4,  title_en: 'Funding and Financing',          category: 'Management',         status: 'met',         sort_order: 4,  analysis_en: 'The $12.65B Russian state credit is in place and disbursement is ongoing. Repayment commences in 2027. Currency risk and USD repayment obligations are the residual financing risks.' },
    { country_id: bd.id, number: 5,  title_en: 'Legislative Framework',          category: 'Legal & Regulatory', status: 'met',         sort_order: 5,  analysis_en: 'The Nuclear Safety and Radiation Control Act 2012 and BNRDA Ordinance provide a solid legal framework. Operating licence regulations are being finalised ahead of first criticality.' },
    { country_id: bd.id, number: 6,  title_en: 'Safeguards',                     category: 'Legal & Regulatory', status: 'met',         sort_order: 6,  analysis_en: 'Bangladesh has a Comprehensive Safeguards Agreement and Additional Protocol in force. IAEA safeguards implementation at Rooppur has commenced with fuel loading under safeguards.' },
    { country_id: bd.id, number: 7,  title_en: 'Radiation Protection',           category: 'Safety & Security',  status: 'met',         sort_order: 7,  analysis_en: 'Radiation protection regulations are in place under BNRDA. An emergency planning zone has been established around Rooppur and off-site emergency exercises have been conducted.' },
    { country_id: bd.id, number: 8,  title_en: 'Electrical Grid',                category: 'Infrastructure',     status: 'partial',     sort_order: 8,  analysis_en: 'Bangladesh grid is growing rapidly but reliability remains a concern. The 2.4 GW Rooppur addition represents ~12% of total installed capacity — grid stabilisation investments are underway.' },
    { country_id: bd.id, number: 9,  title_en: 'Human Resource Development',     category: 'Workforce',          status: 'partial',     sort_order: 9,  analysis_en: 'Rosatom has trained ~3,000 Bangladeshi personnel. NPCBL is staffing up for operations. Long-term operator independence from Rosatom requires continued intensive training.' },
    { country_id: bd.id, number: 10, title_en: 'Stakeholder Involvement',        category: 'Management',         status: 'met',         sort_order: 10, analysis_en: 'Public communication around Rooppur has been active. Community relocation at the site was managed with compensation. National media coverage is generally supportive.' },
    { country_id: bd.id, number: 11, title_en: 'Site and Supporting Facilities', category: 'Infrastructure',     status: 'met',         sort_order: 11, analysis_en: 'Rooppur site is fully developed with all supporting infrastructure in place. A new township, road network, river port, and grid connection have been constructed.' },
    { country_id: bd.id, number: 12, title_en: 'Environmental Protection',       category: 'Safety & Security',  status: 'met',         sort_order: 12, analysis_en: 'Environmental impact assessment for Rooppur was completed and approved. Flood protection measures have been implemented given the site proximity to the Padma River.' },
    { country_id: bd.id, number: 13, title_en: 'Emergency Planning',             category: 'Safety & Security',  status: 'partial',     sort_order: 13, analysis_en: 'An emergency planning zone has been established. Off-site emergency drills have been conducted. Integration with national disaster management systems is still being strengthened.' },
    { country_id: bd.id, number: 14, title_en: 'Nuclear Security',               category: 'Safety & Security',  status: 'met',         sort_order: 14, analysis_en: 'Physical protection systems meeting IAEA INFCIRC/225 Rev.5 standards have been installed at Rooppur. Security arrangements are in place under Rosatom and BNRDA oversight.' },
    { country_id: bd.id, number: 15, title_en: 'Nuclear Fuel Cycle',             category: 'Infrastructure',     status: 'partial',     sort_order: 15, analysis_en: 'Fuel supply is secured from Rosatom for initial cycles. Long-term fuel supply diversification and a spent fuel management agreement with Russia are key residual risks.' },
    { country_id: bd.id, number: 16, title_en: 'Radioactive Waste',              category: 'Infrastructure',     status: 'partial',     sort_order: 16, analysis_en: 'Spent fuel will be returned to Russia under the current arrangement. A national long-term waste management strategy for operational waste volumes is still being developed.' },
    { country_id: bd.id, number: 17, title_en: 'Industrial Involvement',         category: 'Infrastructure',     status: 'partial',     sort_order: 17, analysis_en: 'Local construction involvement in Rooppur has been limited due to the EPC model. Bangladesh is developing plans for local content in future nuclear projects.' },
    { country_id: bd.id, number: 18, title_en: 'Procurement',                    category: 'Management',         status: 'met',         sort_order: 18, analysis_en: 'Rosatom EPC contract covers procurement under the state credit arrangement. NPCBL is developing its own nuclear-grade procurement capacity for operations and future projects.' },
    { country_id: bd.id, number: 19, title_en: 'Owner/Operator',                 category: 'Management',         status: 'partial',     sort_order: 19, analysis_en: 'NPCBL is legally established and staffing up. Real operator capability is heavily dependent on Rosatom for the first 10 years. Operator independence is the long-term development challenge.' },
    // Kazakhstan
    { country_id: kz.id, number: 1,  title_en: 'National Position',              category: 'Legal & Regulatory', status: 'met',         sort_order: 1,  analysis_en: 'The October 2024 national referendum (71% yes) provides an unambiguous democratic mandate. Presidential commitment is strong. The national position is now the firmest it has ever been.' },
    { country_id: kz.id, number: 2,  title_en: 'Nuclear Safety',                 category: 'Legal & Regulatory', status: 'partial',     sort_order: 2,  analysis_en: 'KAEC has been established as the nuclear regulator with NNC technical support. Regulatory capacity for NPP oversight requires significant development, particularly NPP licensing procedures.' },
    { country_id: kz.id, number: 3,  title_en: 'Management',                     category: 'Management',         status: 'partial',     sort_order: 3,  analysis_en: 'KATEP has been established as the owner-operator company. Vendor selection uncertainty makes it difficult to build the owner engineer team around a specific reactor design.' },
    { country_id: kz.id, number: 4,  title_en: 'Funding and Financing',          category: 'Management',         status: 'not_met',     sort_order: 4,  analysis_en: 'No financing framework has been agreed. With four vendors competing, each offering different financing structures, the $10–12B investment has no confirmed funding pathway.' },
    { country_id: kz.id, number: 5,  title_en: 'Legislative Framework',          category: 'Legal & Regulatory', status: 'partial',     sort_order: 5,  analysis_en: 'The Law on Peaceful Uses of Nuclear Energy (2016) provides a legal foundation. NPP-specific licensing regulations and nuclear liability legislation need to be enacted.' },
    { country_id: kz.id, number: 6,  title_en: 'Safeguards',                     category: 'Legal & Regulatory', status: 'met',         sort_order: 6,  analysis_en: 'Kazakhstan has a Comprehensive Safeguards Agreement and Additional Protocol in force, with extensive IAEA safeguards experience from Kazatomprom uranium mining operations.' },
    { country_id: kz.id, number: 7,  title_en: 'Radiation Protection',           category: 'Safety & Security',  status: 'partial',     sort_order: 7,  analysis_en: 'Radiation protection regulations exist under KAEC. NNC Kurchatov operates research reactors providing regulatory experience. NPP-scale emergency planning needs major development.' },
    { country_id: kz.id, number: 8,  title_en: 'Electrical Grid',                category: 'Infrastructure',     status: 'partial',     sort_order: 8,  analysis_en: 'Kazakhstan grid is predominantly coal-based and aging. Adding 2.4 GW of nuclear baseload is achievable but requires grid modernisation and interconnection upgrades to Russia and China.' },
    { country_id: kz.id, number: 9,  title_en: 'Human Resource Development',     category: 'Workforce',          status: 'partial',     sort_order: 9,  analysis_en: 'Kazakhstan has ~2,000 nuclear scientists at NNC and Ulba. This is the strongest human capital base of any Phase 2 newcomer. NPP-specific operator training must be developed.' },
    { country_id: kz.id, number: 10, title_en: 'Stakeholder Involvement',        category: 'Management',         status: 'met',         sort_order: 10, analysis_en: 'The national referendum is the gold standard of stakeholder involvement. The 71% yes vote, after extensive public debate, gives KATEP strong legitimacy to proceed.' },
    { country_id: kz.id, number: 11, title_en: 'Site and Supporting Facilities', category: 'Infrastructure',     status: 'in_progress', sort_order: 11, analysis_en: 'Ulken on Lake Balkhash has been formally selected. Preliminary infrastructure works (access roads, accommodation, grid studies) are underway. Full site characterisation is in progress.' },
    { country_id: kz.id, number: 12, title_en: 'Environmental Protection',       category: 'Safety & Security',  status: 'in_progress', sort_order: 12, analysis_en: 'Environmental baseline studies at Ulken are underway, including Lake Balkhash water level and ecological assessments. A formal EIA must be completed before construction licensing.' },
    { country_id: kz.id, number: 13, title_en: 'Emergency Planning',             category: 'Safety & Security',  status: 'not_met',     sort_order: 13, analysis_en: 'No formal nuclear emergency planning zone exists around Ulken. Emergency response agencies have no nuclear-specific training. This must be developed before construction commences.' },
    { country_id: kz.id, number: 14, title_en: 'Nuclear Security',               category: 'Safety & Security',  status: 'partial',     sort_order: 14, analysis_en: 'Kazakhstan has strong nuclear security experience from Kazatomprom and NNC operations. Translating this to NPP-grade physical protection systems is well within capability.' },
    { country_id: kz.id, number: 15, title_en: 'Nuclear Fuel Cycle',             category: 'Infrastructure',     status: 'partial',     sort_order: 15, analysis_en: 'Kazakhstan is uniquely positioned as the world largest uranium producer. Fuel supply security is not a concern. Spent fuel management will depend on vendor selection and negotiations.' },
    { country_id: kz.id, number: 16, title_en: 'Radioactive Waste',              category: 'Infrastructure',     status: 'partial',     sort_order: 16, analysis_en: 'Kazakhstan has experience managing waste from NNC research reactors and uranium mining. A national waste management strategy for NPP volumes must be developed.' },
    { country_id: kz.id, number: 17, title_en: 'Industrial Involvement',         category: 'Infrastructure',     status: 'partial',     sort_order: 17, analysis_en: 'Kazakhstan has a significant industrial base through Kazatomprom and Ulba. Local content in fuel fabrication is a realistic near-term goal. Construction-phase local content needs a framework.' },
    { country_id: kz.id, number: 18, title_en: 'Procurement',                    category: 'Management',         status: 'not_met',     sort_order: 18, analysis_en: 'Nuclear-grade procurement procedures for construction have not been established. Vendor selection must precede development of a coherent procurement and QA framework.' },
    { country_id: kz.id, number: 19, title_en: 'Owner/Operator',                 category: 'Management',         status: 'partial',     sort_order: 19, analysis_en: 'KATEP is established but has no NPP operational experience. NNC and Ulba staff provide a strong technical foundation. NPP-specific operator training will depend on vendor selection.' },
  ]
  for (const issue of asiaIssues) {
    await upsertBy('infrastructure_issues', { country_id: issue.country_id, number: issue.number }, issue as Record<string, unknown>)
  }
  console.log(`✅  Asian infrastructure issues: ${asiaIssues.length} upserted`)

  console.log('\n🎉  Seed complete!')
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err)
  console.error('❌  Seed failed:', msg)
  process.exit(1)
})
