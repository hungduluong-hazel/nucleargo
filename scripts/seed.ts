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

  console.log('\n🎉  Seed complete!')
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err)
  console.error('❌  Seed failed:', msg)
  process.exit(1)
})
