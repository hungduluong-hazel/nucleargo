// Data model for "established nation" benchmark programs — distinct from the
// newcomer-country IAEA-phase profiles (see components/public/CountryProfileLayout.tsx).
//
// Established programs don't have a "policy decision to first power" arc — they
// have completed (or cancelled) projects that can be scored against the cost/risk
// framework in docs/nuclear-economics-framework.md. This file is the data source
// for those pages; components/public/EstablishedProgramLayout.tsx renders it.
//
// To add a new established-nation entry: add a new `EstablishedProgramConfig`
// object below (or split into its own file once this grows), then create
// components/public/<Country>Content.tsx + app/(public)/countries/<slug>/page.tsx
// following the UnitedStatesContent.tsx / united-states/page.tsx pattern.

export type DimensionRating = 'strength' | 'weakness' | 'mixed'

export type FrameworkDimension = {
  label: string
  rating: DimensionRating
  finding: string
  detail: string
  /** true only if confirmed against a cited source in `sources` below */
  verified: boolean
}

export type StatPill = { icon: string; label: string }
export type SummaryRow = { label: string; value: string }
export type SourceLink = { label: string; url: string }

export type EstablishedProgramConfig = {
  flagUrl: string
  slug: string
  countryName: string
  heroTitle: string
  heroSub: string
  badge: string
  statPills: StatPill[]
  summaryRows: SummaryRow[]
  buildPhaseRisk: FrameworkDimension[]
  financeability: FrameworkDimension[]
  lifecycleLiability: FrameworkDimension[]
  contextModifier: { label: string; detail: string }
  sources: SourceLink[]
  verificationNote: string
  ctaTitle: string
  ctaBody: string
}

export const unitedStatesVogtle: EstablishedProgramConfig = {
  flagUrl: 'https://flagcdn.com/w80/us.png',
  slug: 'united-states',
  countryName: 'United States',
  heroTitle: 'United States — Plant Vogtle Units 3 & 4',
  heroSub:
    'The first new reactors built from scratch in the US in three decades — and the most thoroughly documented public case study of what actually drives nuclear cost overruns.',
  badge: 'Benchmark Program — Established Nation',
  statPills: [
    { icon: '💰', label: '~$35B total cost (from $14B original estimate)' },
    { icon: '⏱️', label: '~7 years behind original schedule' },
    { icon: '⚡', label: '~2,200 MW combined, Units 3 & 4' },
  ],
  summaryRows: [
    { label: 'Reactor design', value: 'Westinghouse AP1000 × 2' },
    { label: 'Location', value: 'Waynesboro, Georgia — Vogtle Electric Generating Plant' },
    { label: 'Lead owner/operator', value: 'Georgia Power (Southern Company)' },
    { label: 'Co-owners', value: 'Oglethorpe Power, MEAG Power, Dalton Utilities' },
    { label: 'Unit 3 commercial operation', value: 'July 31, 2023' },
    { label: 'Unit 4 commercial operation', value: 'April 29, 2024' },
    { label: 'Original target', value: '2016 (Unit 3) / 2017 (Unit 4)' },
    { label: 'Original budget', value: '$14 billion for both units' },
  ],
  buildPhaseRisk: [
    {
      label: 'Design maturity before construction',
      rating: 'weakness',
      finding: 'Design was not fully finalized when construction began',
      detail:
        'Detailed engineering and licensing amendments continued after first concrete (2013), driving rework on modular components and site-specific structures throughout construction — a commonly cited root cause of the overrun in post-project reviews.',
      verified: false,
    },
    {
      label: 'Reference plant vs. first-of-a-kind',
      rating: 'weakness',
      finding: 'First AP1000 in the US, but not the global first-of-a-kind',
      detail:
        "China's Sanmen Unit 1 (same AP1000 design) reached commercial operation in 2018, years before Vogtle 3 — so some construction lessons existed abroad, but Vogtle was still the first reactor built from scratch in the US in over three decades, with no domestic supply chain or licensed AP1000 workforce in place.",
      verified: false,
    },
    {
      label: 'Fleet effect / repetition',
      rating: 'mixed',
      finding: 'A two-unit fleet effect is visible within the project itself',
      detail:
        "Unit 4 (in service Apr 2024) benefited directly from lessons learned building Unit 3 (in service Jul 2023) on the same site — the second unit's incremental slip was smaller than the first's, a small-scale illustration of the repetition effect Korea shows at full-fleet scale.",
      verified: true,
    },
    {
      label: 'Contracting and risk allocation',
      rating: 'weakness',
      finding: 'The original fixed-price EPC contract collapsed mid-project',
      detail:
        'Westinghouse, as reactor vendor and co-constructor under a fixed-price EPC contract, could not absorb the overruns and filed for Chapter 11 bankruptcy in March 2017 — partly due to losses on Vogtle and the related V.C. Summer project. Georgia Power and its co-owners took over direct project oversight afterward.',
      verified: false,
    },
    {
      label: 'Site selection and site-specific engineering',
      rating: 'strength',
      finding: 'Brownfield site reduced siting risk',
      detail:
        'Units 3 & 4 were built adjacent to the already-operating Vogtle 1 & 2 (online since the 1980s), reusing an established site with existing grid connections, cooling water rights, and community acceptance — a materially lower-risk starting point than a newcomer building on a greenfield site.',
      verified: false,
    },
    {
      label: 'Owner project-management capability',
      rating: 'mixed',
      finding: 'Experienced nuclear operator, but no recent new-build experience',
      detail:
        'Southern Company/Georgia Power operated a large existing nuclear fleet, but neither the utility nor the broader US construction industry had managed a new nuclear build in over 30 years — that capability gap contributed to early schedule and productivity problems.',
      verified: false,
    },
    {
      label: 'Domestic workforce and human capital',
      rating: 'mixed',
      finding: 'Strong engineering/regulatory base, thin construction-labor pipeline',
      detail:
        'The US has deep nuclear engineering, operations, and regulatory (NRC) capacity, but the craft-labor pipeline specific to new nuclear construction had to be rebuilt from a near-standing start after a 30-year construction gap.',
      verified: false,
    },
    {
      label: 'Currency and inflation exposure',
      rating: 'strength',
      finding: 'No FX exposure, but not immune to domestic cost inflation',
      detail:
        'Financed and contracted entirely in USD, avoiding the foreign-currency risk newcomer countries face with foreign vendor financing — though the multi-year delay still exposed the project to ordinary material and labor cost inflation.',
      verified: false,
    },
  ],
  financeability: [
    {
      label: 'Financing structure and cost of capital',
      rating: 'mixed',
      finding: 'Backstopped by one of the largest DOE loan guarantees ever issued',
      detail:
        'Co-owners drew on US Department of Energy loan guarantees alongside regulated-utility financing — a hybrid structure that helped the project survive overruns that killed its twin, V.C. Summer.',
      verified: false,
    },
    {
      label: 'Revenue and market structure',
      rating: 'strength',
      finding: 'Regulated, vertically integrated market allowed cost recovery',
      detail:
        "Georgia is a regulated utility market, giving Georgia Power a path to recover costs through customer rates as approved by the Georgia Public Service Commission — unlike a merchant project fully exposed to wholesale power prices.",
      verified: false,
    },
    {
      label: 'Regulatory stability during construction',
      rating: 'strength',
      finding: 'Licensing framework held steady through construction',
      detail:
        'The NRC issued a Combined Construction and Operating License (COL) for Vogtle 3 & 4 in February 2012 — the first COL granted in over three decades — and the licensing basis remained in place through construction without a program-cancelling regulatory reversal.',
      verified: false,
    },
    {
      label: 'Political and public acceptance durability',
      rating: 'strength',
      finding: 'Survived where its closest peer did not',
      detail:
        "Despite heavy public and regulatory criticism over cost, Georgia's Public Service Commission allowed the project to continue to completion. The nearly identical twin project, V.C. Summer 2 & 3 in South Carolina (same AP1000 design, same era), was cancelled outright in 2017 after roughly $9 billion spent with zero generating output — one of the clearest same-technology, opposite-outcome comparisons available for this framework.",
      verified: false,
    },
  ],
  lifecycleLiability: [
    {
      label: 'Fuel cycle economics',
      rating: 'strength',
      finding: 'No unusual fuel-cycle exposure',
      detail:
        'Standard US fuel-cycle arrangement with diversified global enrichment supply — not a distinguishing risk factor for this project relative to other US reactors.',
      verified: false,
    },
    {
      label: 'Decommissioning fund adequacy',
      rating: 'mixed',
      finding: 'Subject to standard NRC-mandated decommissioning trust requirements',
      detail:
        'US reactor owners must maintain funded decommissioning trusts under NRC regulation. Vogtle 3 & 4-specific trust funding levels have not been verified for this entry yet.',
      verified: false,
    },
  ],
  contextModifier: {
    label: 'Energy security context: low import dependence, different rationale',
    detail:
      'The US is not resource-constrained the way most newcomer countries are — the rationale for Vogtle was carbon-free baseload capacity and regional grid reliability (notably rising data-center demand in the Southeast), not import dependence or fuel-security risk. That is a materially different context than the energy-security-driven rationale common among newcomer nations, and should reweight how directly Vogtle\'s cost tolerance can be compared to a resource-poor newcomer\'s.',
  },
  sources: [
    {
      label: 'EIA — Plant Vogtle Unit 4 begins commercial operation',
      url: 'https://www.eia.gov/todayinenergy/detail.php?id=61963',
    },
    {
      label: 'EIA — First new U.S. nuclear reactor since 2016 is now in operation',
      url: 'https://www.eia.gov/todayinenergy/detail.php?id=57280',
    },
    {
      label: 'POWER Magazine — Vogtle Unit 3 Enters Commercial Operation',
      url: 'https://www.powermag.com/vogtle-unit-3-enters-commercial-operation-first-newly-constructed-u-s-nuclear-power-plant-in-decades/',
    },
    {
      label: "IEEFA — Southern Company's Troubled Vogtle Nuclear Project",
      url: 'https://ieefa.org/wp-content/uploads/2022/01/Southern-Companys-Troubled-Vogtle-Nuclear-Project_January-2022.pdf',
    },
  ],
  verificationNote:
    'Commercial operation dates, original budget, and final cost range are sourced (see links below). Dimension-level analysis in the sections above reflects general industry reporting and has not all been individually cited — treat "verified: false" fields as needing a source check before this page is publicly promoted, consistent with the verification convention used in docs/supply-chain-directory-draft.md.',
  ctaTitle: 'See how this compares to your program',
  ctaBody:
    "Register to benchmark your project's execution, financing, and lifecycle risk against Vogtle and other established nuclear builds.",
}

export const establishedPrograms: EstablishedProgramConfig[] = [unitedStatesVogtle]
