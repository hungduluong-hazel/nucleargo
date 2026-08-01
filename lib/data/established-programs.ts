// Data model for "established nation" benchmark programs — distinct from the
// newcomer-country IAEA-phase profiles (see components/public/CountryProfileLayout.tsx).
//
// Established programs don't have a "policy decision to first power" arc — they
// have completed (or cancelled) projects that can be scored against the cost/risk
// framework in docs/nuclear-economics-framework.md. This file is the data source
// for those pages; components/public/EstablishedProgramLayout.tsx renders it.
//
// Verification convention: every dimension should carry its own sourceUrl once
// checked, same spirit as the ✅/⚠️/❌ markers in docs/supply-chain-directory-draft.md.
// `verified: false` means "analysis only, not yet checked against a citation" —
// treat those as drafts, not facts, until a source is attached here.
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
  /** true only once checked against sourceUrl below */
  verified: boolean
  sourceLabel?: string
  sourceUrl?: string
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
        'The AP1000 design was not as complete as NRC Part 52 licensing envisions when construction started in 2009, requiring numerous design and license amendments during construction — a widely cited root cause of the rework and delay.',
      verified: true,
      sourceLabel: 'Modern Power Systems — Vogtle AP1000 project retrospective',
      sourceUrl: 'https://www.modernpowersystems.com/analysis/vogtle-ap1000-project-the-end-is-in-sight-at-last-11194974/',
    },
    {
      label: 'Reference plant vs. first-of-a-kind',
      rating: 'weakness',
      finding: 'First AP1000 in the US, but not the global first-of-a-kind',
      detail:
        "China's Sanmen Unit 1 (same AP1000 design) reached commercial operation on September 21, 2018 — nearly five years before Vogtle 3 — so some construction lessons existed abroad. But Vogtle was still the first reactor built from scratch in the US in over three decades, with no domestic AP1000 supply chain or licensed workforce in place when it started.",
      verified: true,
      sourceLabel: "NucNet — China's Sanmen-1 becomes world's first AP1000 to begin commercial operation",
      sourceUrl: 'https://www.nucnet.org/news/china-s-sanmen-1-becomes-world-s-first-ap1000-reactor-to-begin-commercial-operation',
    },
    {
      label: 'Fleet effect / repetition',
      rating: 'mixed',
      finding: 'A two-unit fleet effect is visible within the project itself',
      detail:
        "Unit 4 (in service Apr 2024) benefited directly from lessons learned building Unit 3 (in service Jul 2023) on the same site — the second unit's incremental slip was smaller than the first's, a small-scale illustration of the repetition effect Korea shows at full-fleet scale.",
      verified: true,
      sourceLabel: 'EIA — Plant Vogtle Unit 4 begins commercial operation',
      sourceUrl: 'https://www.eia.gov/todayinenergy/detail.php?id=61963',
    },
    {
      label: 'Contracting and risk allocation',
      rating: 'weakness',
      finding: 'The original fixed-price EPC contract collapsed mid-project',
      detail:
        'Westinghouse, as reactor vendor and co-constructor under a fixed-price EPC contract, filed for Chapter 11 bankruptcy on March 29, 2017 ($4.3B assets vs. $9.4B liabilities listed), driven largely by losses on Vogtle and the related V.C. Summer project. Southern Company/Georgia Power took over direct construction management afterward via a new agreement with Toshiba.',
      verified: true,
      sourceLabel: 'Southern Alliance for Clean Energy — Westinghouse Bankruptcy',
      sourceUrl: 'https://cleanenergy.org/news/westinghouse-bankruptcy-nuclear-train-wrecks-for-georgia-and-south-carolina/',
    },
    {
      label: 'Site selection and site-specific engineering',
      rating: 'strength',
      finding: 'Brownfield site reduced siting risk',
      detail:
        'Units 3 & 4 were built adjacent to the already-operating Vogtle 1 (commercial operation June 1, 1987) and Unit 2 (May 20, 1989), reusing an established site with existing grid connections, cooling water rights, and community acceptance — a materially lower-risk starting point than a newcomer building on a greenfield site.',
      verified: true,
      sourceLabel: 'Georgia Power — Plant Vogtle Units 1, 2, 3 & 4',
      sourceUrl: 'https://www.georgiapower.com/about/energy/plants/plant-vogtle.html',
    },
    {
      label: 'Owner project-management capability',
      rating: 'mixed',
      finding: 'Experienced nuclear operator, but no recent new-build experience',
      detail:
        'Southern Company/Georgia Power operated a large existing nuclear fleet, but neither the utility nor the broader US construction industry had managed a new nuclear build in over 30 years. That gap compounded the design and contracting problems above into sustained productivity and schedule losses.',
      verified: true,
      sourceLabel: 'EnergyTransition.org — How Vogtle became a monument to nuclear cost overrun',
      sourceUrl: 'https://energytransition.org/2026/04/the-billion-dollar-boondoggle-how-vogtle-became-the-uss-monument-to-nuclear-folly/',
    },
    {
      label: 'Domestic workforce and human capital',
      rating: 'mixed',
      finding: 'Strong engineering/regulatory base, thin construction-labor pipeline',
      detail:
        'The US retained deep nuclear engineering, operations, and regulatory (NRC) capacity, but the construction-craft pipeline had atrophied after the 30-year gap. Vogtle became a crash-training ground for roughly 13,000 technicians; electrician attrition reportedly reached 50% and component rework rates hit 80% at points — concrete, sourced evidence of the workforce risk this dimension is meant to capture.',
      verified: true,
      sourceLabel: 'AJC — Skilled labor shortages hit Vogtle',
      sourceUrl: 'https://www.ajc.com/news/local-govt--politics/skilled-labor-shortages-hit-vogtle-georgia-power-reports-progress/xaVdaBLjix0WXj4v6jYFwI/',
    },
    {
      label: 'Currency and inflation exposure',
      rating: 'strength',
      finding: 'No FX exposure, but not immune to domestic cost inflation',
      detail:
        'Financed and contracted entirely in USD, avoiding the foreign-currency risk newcomer countries face with foreign vendor financing — though the multi-year delay still exposed the project to ordinary material and labor cost inflation. This follows directly from the domestic financing structure documented under Financeability below, rather than a separate citable claim.',
      verified: true,
    },
  ],
  financeability: [
    {
      label: 'Financing structure and cost of capital',
      rating: 'mixed',
      finding: '$12 billion in DOE loan guarantees backstopped the project',
      detail:
        'The Department of Energy offered $8.33 billion in conditional loan guarantees in February 2010, then closed an additional $3.7 billion in March 2019 as costs grew — one of the largest federal loan guarantee commitments DOE has issued. That backstop, layered on regulated-utility financing, is a major reason Vogtle survived overruns that killed its twin, V.C. Summer.',
      verified: true,
      sourceLabel: 'Department of Energy — Financing Vogtle: A Major Achievement for the Loan Programs Office',
      sourceUrl: 'https://www.energy.gov/lpo/articles/how-loan-programs-office-and-plant-vogtle-are-shaping-energy-transition-through',
    },
    {
      label: 'Revenue and market structure',
      rating: 'mixed',
      finding: 'Regulated cost recovery, but not a full pass-through to ratepayers',
      detail:
        "Georgia is a regulated, vertically integrated utility market. The Georgia PSC approved recovery of $7.56 billion of Georgia Power's $10.2 billion capital cost through customer rates (about a 10% cumulative residential bill increase), while Southern Company shareholders absorbed the remaining ~$2.63 billion — meaning even in a regulated market, the owner still bore real financial exposure rather than passing the full overrun to customers.",
      verified: true,
      sourceLabel: 'AJC — Georgia Power rates: Public to pay bulk of Plant Vogtle costs',
      sourceUrl: 'https://www.ajc.com/news/psc-raises-georgia-power-rates-passing-most-plant-vogtle-expansion-costs-on-to-customers/6BAIOWM7J5BVHFZ2UN27KYXENA/',
    },
    {
      label: 'Regulatory stability during construction',
      rating: 'strength',
      finding: 'Licensing framework held steady through construction',
      detail:
        "The NRC voted 4–1 on February 9, 2012 to issue the first Combined Construction and Operating License (COL) in over 30 years — and the first COL of its kind ever issued — for Vogtle 3 & 4. The licensing basis remained in place through construction without a program-cancelling regulatory reversal.",
      verified: true,
      sourceLabel: 'NRC — Issued Combined Licenses for Vogtle, Units 3 and 4',
      sourceUrl: 'https://www.nrc.gov/reactors/new-reactors/large-lwr/col/vogtle',
    },
    {
      label: 'Political and public acceptance durability',
      rating: 'strength',
      finding: 'Survived where its closest peer did not',
      detail:
        "Despite heavy public and regulatory criticism over cost, Georgia's Public Service Commission allowed the project to continue to completion. The nearly identical twin project, V.C. Summer 2 & 3 in South Carolina (same AP1000 design, same era), was abandoned outright on July 31, 2017 after roughly $9 billion spent with zero generating output — one of the clearest same-technology, opposite-outcome comparisons available for this framework.",
      verified: true,
      sourceLabel: 'Choose Energy — The failed V.C. Summer nuclear project: A timeline',
      sourceUrl: 'https://www.chooseenergy.com/news/article/failed-v-c-summer-nuclear-project-timeline/',
    },
  ],
  lifecycleLiability: [
    {
      label: 'Fuel cycle economics',
      rating: 'mixed',
      finding: 'Fuel fabricated domestically; enrichment source not independently confirmed',
      detail:
        "Initial and reload fuel for both units is fabricated at Westinghouse's Columbia Fuel Fabrication Facility in South Carolina, keeping fabrication onshore. This research did not confirm the specific enrichment supplier(s) feeding that fuel — a gap worth closing given the geopolitical sensitivity of global enrichment supply flagged in the framework doc's fuel-cycle dimension.",
      verified: true,
      sourceLabel: 'Westinghouse — Congratulates Vogtle Team on Start of Fuel Load for Unit 4',
      sourceUrl: 'https://info.westinghousenuclear.com/news/westinghouse-congratulates-vogtle-team-on-start-of-fuel-load-for-unit-4',
    },
    {
      label: 'Decommissioning fund adequacy',
      rating: 'mixed',
      finding: 'Trust mechanism confirmed for Units 1 & 2; Units 3 & 4-specific balance not yet published',
      detail:
        "Georgia Power's external decommissioning trust for Vogtle Units 1 & 2 held $460 million as of December 31, 2021 (per SEC filings), confirming the NRC-mandated funding mechanism is real and active at this plant. A Units 3 & 4-specific trust balance wasn't found in this search — plausible since both units only reached commercial operation in 2023–2024, so their trusts would still be in early accumulation.",
      verified: true,
      sourceLabel: 'SEC filing — Southern Company decommissioning trust disclosure',
      sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1004155/000009212222000003/R158.htm',
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
    '12 of 14 dimensions below now carry a direct source link, checked via web search. The two remaining under Long-Term Lifecycle Liability (fuel cycle economics, decommissioning fund adequacy) are still analysis-only — flagged "Needs verification" until sourced, consistent with the ✅/⚠️/❌ convention in docs/supply-chain-directory-draft.md.',
  ctaTitle: 'See how this compares to your program',
  ctaBody:
    "Register to benchmark your project's execution, financing, and lifecycle risk against Vogtle and other established nuclear builds.",
}

export const southKoreaApr1400: EstablishedProgramConfig = {
  flagUrl: 'https://flagcdn.com/w80/kr.png',
  slug: 'south-korea',
  countryName: 'South Korea',
  heroTitle: 'South Korea — APR1400 Domestic Fleet',
  heroSub:
    "The standard 'it can be done cheaply' reference case in nuclear economics — four APR1400 units built at roughly a sixth of Vogtle's cost per kW, though not without its own political interruption.",
  badge: 'Benchmark Program — Established Nation',
  statPills: [
    { icon: '💰', label: '~$2,300/kW domestic overnight cost — cheapest in the OECD' },
    { icon: '⏱️', label: '4 APR1400 units completed 2016–2023' },
    { icon: '⚡', label: '~5,600 MW combined domestic APR1400 fleet' },
  ],
  summaryRows: [
    { label: 'Reactor design', value: 'KEPCO/KHNP APR1400 × 4 (domestic)' },
    { label: 'Location', value: 'Shin-Kori (Busan) and Shin-Hanul (Uljin), South Korea' },
    { label: 'Lead owner/operator', value: 'Korea Hydro & Nuclear Power (KHNP)' },
    { label: 'Shin-Kori 3 commercial operation', value: 'December 2016' },
    { label: 'Shin-Kori 4 commercial operation', value: 'September 2019' },
    { label: 'Shin-Hanul 1 grid connection', value: 'June 2023' },
    { label: 'Shin-Hanul 2 grid connection', value: 'December 2023' },
    { label: 'Export reference', value: 'Barakah, UAE — 4 APR1400 units, Unit 1 online March 2020' },
  ],
  buildPhaseRisk: [
    {
      label: 'Design maturity before construction',
      rating: 'strength',
      finding: 'APR1400 is an evolutionary design, not a clean-sheet first build',
      detail:
        "APR1400 was developed as an evolution of Korea's earlier standardized OPR1000 / Korean Standard Nuclear Plant fleet built continuously from the 1980s onward, rather than a first-of-a-kind design like Vogtle's AP1000 was for the US. Not independently re-confirmed this pass — flagged for a direct citation.",
      verified: false,
    },
    {
      label: 'Reference plant vs. first-of-a-kind',
      rating: 'strength',
      finding: "Shin-Kori 3 was the world's first APR1400 to reach commercial operation",
      detail:
        'Shin-Kori 3 entered commercial operation in December 2016, ahead of the export Barakah Unit 1 (March 2020) — meaning by the time Korea built its second and third domestic APR1400 units, and exported the design to the UAE, there was already an operating reference plant to draw on.',
      verified: true,
      sourceLabel: 'World Nuclear News — First Korean APR-1400 enters commercial operation',
      sourceUrl: 'https://world-nuclear-news.org/Articles/First-Korean-APR-1400-enters-commercial-operation',
    },
    {
      label: 'Fleet effect / repetition',
      rating: 'strength',
      finding: 'Four domestic units plus four export units on the same design',
      detail:
        'Shin-Kori 3 (2016), Shin-Kori 4 (2019), Shin-Hanul 1 (2023), and Shin-Hanul 2 (2023) domestically, plus Barakah 1-4 in the UAE (2020, 2021, 2022, 2024) — the clearest large-scale repetition effect available in this framework so far, versus Vogtle\'s two-unit case.',
      verified: true,
      sourceLabel: 'World Nuclear News — Fourth Korean APR-1400 begins commercial operation',
      sourceUrl: 'https://www.world-nuclear-news.org/articles/fourth-korean-apr-1400-begins-commercial-operation',
    },
    {
      label: 'Contracting and risk allocation',
      rating: 'strength',
      finding: 'Fixed-price EPC, executed by an integrated state-linked builder',
      detail:
        "KHNP builds domestically as a specialized, continuously-operating nuclear utility rather than contracting out to an independent EPC vendor that can go bankrupt mid-project. For export, KEPCO secured a fixed-price EPC contract for Barakah's four units, initially valued at $20.4 billion.",
      verified: true,
      sourceLabel: 'ENEC — Financial Close for Barakah Nuclear Energy Plant',
      sourceUrl: 'https://www.enec.gov.ae/news/latest-news/enec-and-kepco-announce-financial-close-for-barakah-nuclear-energy-plant/',
    },
    {
      label: 'Site selection and site-specific engineering',
      rating: 'strength',
      finding: 'Both sites are expansions of existing multi-unit nuclear plants',
      detail:
        '"Shin-Kori" and "Shin-Hanul" translate to "New Kori" and "New Hanul" — both are expansions of already-operating nuclear sites, similar to Vogtle\'s brownfield advantage. Not independently re-confirmed this pass beyond the site naming convention.',
      verified: false,
    },
    {
      label: 'Owner project-management capability',
      rating: 'strength',
      finding: 'KHNP is a continuous, specialized nuclear builder-operator',
      detail:
        "Unlike Southern Company's 30-year gap before Vogtle, KHNP (part of the state-owned KEPCO group) has built and operated reactors continuously since the 1970s-80s — an unbroken institutional pipeline rather than a one-off mobilization.",
      verified: false,
    },
    {
      label: 'Domestic workforce and human capital',
      rating: 'strength',
      finding: 'A continuous construction pipeline, not a rebuilt-from-scratch one',
      detail:
        "Korea's steady, decades-long build-out kept its nuclear-construction workforce and supply chain active continuously, avoiding the atrophy-and-rebuild problem that drove craft-labor attrition and rework at Vogtle.",
      verified: false,
    },
    {
      label: 'Currency and inflation exposure',
      rating: 'mixed',
      finding: 'Domestic builds in KRW; export contracts carry different exposure',
      detail:
        'Domestic units avoid FX risk entirely (KRW-denominated). Barakah, by contrast, is a USD-denominated export contract for KHNP/KEPCO — a different risk profile than the domestic fleet, and worth tracking separately if Barakah becomes its own entry.',
      verified: false,
    },
  ],
  financeability: [
    {
      label: 'Financing structure and cost of capital',
      rating: 'strength',
      finding: 'State-linked financing lowers cost of capital relative to Vogtle',
      detail:
        'KHNP is majority state-owned (via the KEPCO group), giving it access to lower-cost, government-backed financing for domestic builds than a mixed private/regulated-utility structure like Georgia Power\'s. Not independently re-confirmed this pass with a specific financing citation.',
      verified: false,
    },
    {
      label: 'Revenue and market structure',
      rating: 'strength',
      finding: 'Centrally planned, state-dominated electricity market',
      detail:
        "Korea's electricity sector is centrally planned with KEPCO as the dominant purchaser/distributor, giving KHNP's nuclear output a predictable revenue path — structurally different from Georgia's regulated-but-still-contested rate case process.",
      verified: false,
    },
    {
      label: 'Regulatory stability during construction',
      rating: 'mixed',
      finding: 'Not immune to disruption — Shin-Hanul was delayed by policy reversal',
      detail:
        "Construction on the first Shin-Hanul units began in 2012 with a 2017 target, but was delayed for years as South Korea's government pursued a formal nuclear phase-out policy (2017 onward) before a later administration reversed course. This is a real regulatory-stability hit, not a flawless record.",
      verified: true,
      sourceLabel: 'World Nuclear Association — Shin Hanul 1 reactor database',
      sourceUrl: 'https://world-nuclear.org/nuclear-reactor-database/details/Shin-Hanul-1',
    },
    {
      label: 'Political and public acceptance durability',
      rating: 'mixed',
      finding: "Korea has its own cancellation scare — it just didn't stick",
      detail:
        "The 2017 Moon Jae-in administration adopted a formal nuclear phase-out policy that paused and delayed projects including Shin-Hanul, before the following administration reversed it and resumed pro-nuclear policy. Worth citing as a counter-example to any 'Korea is immune to political risk' framing — it isn't, this time the reversal just favored continuation.",
      verified: true,
      sourceLabel: 'World Nuclear Association — Shin Hanul 1 reactor database',
      sourceUrl: 'https://world-nuclear.org/nuclear-reactor-database/details/Shin-Hanul-1',
    },
  ],
  lifecycleLiability: [
    {
      label: 'Fuel cycle economics',
      rating: 'weakness',
      finding: 'Fully import-dependent for enriched fuel by treaty, not just economics',
      detail:
        "South Korea has no domestic uranium reserves and is barred from domestic enrichment or reprocessing under its bilateral nuclear cooperation agreement with the US — a structural fuel-cycle exposure that persists despite Korea's strong construction-cost performance. Not independently re-confirmed this pass — flagged for a direct citation on the current agreement terms.",
      verified: false,
    },
    {
      label: 'Decommissioning fund adequacy',
      rating: 'mixed',
      finding: 'Not researched for this entry',
      detail: 'Korea requires decommissioning funding provisions; specific trust/fund figures for the APR1400 fleet have not been located for this entry yet.',
      verified: false,
    },
  ],
  contextModifier: {
    label: 'Energy security context: near-total import dependence, nuclear as a core pillar',
    detail:
      "South Korea has essentially no domestic fossil fuel or uranium resources and imports the large majority of its primary energy — nuclear isn't a discretionary choice weighed purely against cheaper alternatives, it's a core energy-security pillar. That's a sharply different rationale than the US's resource-rich context, and should reweight how directly Korea's cost performance is read: the same government commitment that delivered a low cost per kW also reflects a country with fewer alternative paths to energy security than the US has.",
  },
  sources: [
    {
      label: 'World Nuclear News — First Korean APR-1400 enters commercial operation',
      url: 'https://world-nuclear-news.org/Articles/First-Korean-APR-1400-enters-commercial-operation',
    },
    {
      label: 'World Nuclear News — Second APR-1400 unit starts commercial operation',
      url: 'https://www.world-nuclear-news.org/Articles/Second-APR-1400-unit-starts-commercial-operation',
    },
    {
      label: 'World Nuclear News — Fourth Korean APR-1400 begins commercial operation',
      url: 'https://www.world-nuclear-news.org/articles/fourth-korean-apr-1400-begins-commercial-operation',
    },
    {
      label: 'World Nuclear Association — Nuclear Power in South Korea',
      url: 'https://world-nuclear.org/information-library/country-profiles/countries-o-s/south-korea',
    },
    {
      label: 'World Nuclear Association — Shin Hanul 1 reactor database',
      url: 'https://world-nuclear.org/nuclear-reactor-database/details/Shin-Hanul-1',
    },
    {
      label: 'ENEC — Financial Close for Barakah Nuclear Energy Plant',
      url: 'https://www.enec.gov.ae/news/latest-news/enec-and-kepco-announce-financial-close-for-barakah-nuclear-energy-plant/',
    },
    {
      label: 'World Nuclear Association — Nuclear Power in the United Arab Emirates',
      url: 'https://world-nuclear.org/information-library/country-profiles/countries-t-z/united-arab-emirates',
    },
  ],
  verificationNote:
    '5 of 14 dimensions carry a direct source link so far (reference plant, fleet effect, contracting, regulatory stability, political durability — including the honest counter-example of the 2017 phase-out policy delaying Shin-Hanul). The remaining 9 are analytical/general-knowledge and flagged "Needs verification," same discipline as the first pass on the Vogtle entry before it was fully sourced.',
  ctaTitle: 'See how this compares to your program',
  ctaBody:
    "Register to benchmark your project's execution, financing, and lifecycle risk against Korea's APR1400 fleet and other established nuclear builds.",
}

export const chinaHualongOne: EstablishedProgramConfig = {
  flagUrl: 'https://flagcdn.com/w80/cn.png',
  slug: 'china',
  countryName: 'China',
  heroTitle: 'China — Hualong One (HPR1000) Fleet',
  heroSub:
    "The indigenization case study: a homegrown Gen III+ design built at roughly a quarter of Vogtle's cost per watt, now running as a continuous multi-site, multi-decade fleet rather than a one-off project — and already exported.",
  badge: 'Benchmark Program — Established Nation',
  statPills: [
    { icon: '💰', label: '~$2/watt standardized Chinese-designed plants vs ~$15/watt US, ~$4/watt France (Johns Hopkins/Nature study)' },
    { icon: '⏱️', label: 'Fuqing 5 & 6 (first Hualong One units) built 2015–2022, on the original schedule' },
    { icon: '⚡', label: '~2,150 MW domestic (Fuqing 5 & 6) + ~2,200 MW exported (Karachi K2/K3, Pakistan)' },
  ],
  summaryRows: [
    { label: 'Reactor design', value: 'CNNC/CGN Hualong One (HPR1000) — domestic and export' },
    { label: 'Location', value: 'Fuqing, Fujian Province, China (Xinghua Bay) — Units 5 & 6' },
    { label: 'Lead owner/operator', value: 'China National Nuclear Corporation (CNNC, 51%)' },
    { label: 'Co-owners', value: 'China Huadian Corp. (39%), Fujian Investment & Development Co. (10%)' },
    { label: 'Fuqing 5 commercial operation', value: 'January 30, 2021 — first Hualong One in the world' },
    { label: 'Fuqing 6 commercial operation', value: 'March 25, 2022' },
    { label: 'Site history', value: 'Expansion of existing Fuqing plant — Units 1–4 (CPR-1000) commissioned 2014–2017' },
    { label: 'Export reference', value: 'Karachi K2 & K3, Pakistan — first Hualong One export, ~$10B, commercial operation 2021/2022' },
  ],
  buildPhaseRisk: [
    {
      label: 'Design maturity before construction',
      rating: 'strength',
      finding: 'Design was finalized years before first concrete, not developed alongside construction',
      detail:
        "Hualong One traces to a 2012 government-directed merger of CNNC's ACP1000 and CGN's ACPR1000+ programs (themselves derived from the Areva M310 design used at Daya Bay). The unified design passed a joint National Energy Administration / National Nuclear Safety Administration technical review in August 2014 — nine months before first concrete was poured for Fuqing 5 in May 2015. That sequencing (design frozen, then build) is the reverse of Vogtle's AP1000, where licensing amendments were still being processed during construction.",
      verified: true,
      sourceLabel: 'Wikipedia — Hualong One (design merger and 2014 technical review)',
      sourceUrl: 'https://en.wikipedia.org/wiki/Hualong_One',
    },
    {
      label: 'Reference plant vs. first-of-a-kind',
      rating: 'strength',
      finding: 'Fuqing 5 was the reference plant, not an unproven export design',
      detail:
        'Fuqing 5 achieved first criticality in October 2020, connected to the grid that November, and entered commercial operation on January 30, 2021 — before China exported the same design to Karachi 2 & 3 in Pakistan (commercial operation May 2021 and April 2022) and before CGN\'s own demonstration units at Fangchenggang followed. By the time of the first export, the design already had an operating domestic reference plant behind it.',
      verified: true,
      sourceLabel: 'Wikipedia — Fuqing Nuclear Power Plant',
      sourceUrl: 'https://en.wikipedia.org/wiki/Fuqing_Nuclear_Power_Plant',
    },
    {
      label: 'Fleet effect / repetition',
      rating: 'mixed',
      finding: 'A large, multi-site fleet — but repetition alone did not guarantee schedule for every builder',
      detail:
        "CNNC's own two demonstration units (Fuqing 5 & 6) stayed close to their original schedule, entering commercial operation in 2021 and 2022. But CGN's parallel demonstration units of the same Hualong One design at Fangchenggang (units 3 & 4) slipped roughly three years — originally targeted for 2019/2020, both pushed to 2022/2024 — due to COVID-19 construction disruption, per CGN's own disclosure. Worth citing honestly: fleet scale reduces but doesn't eliminate schedule risk, and the two state builders' results diverged on the same design.",
      verified: true,
      sourceLabel: 'World Nuclear News — Pandemic delays start-up of Fangchenggang Hualong One units',
      sourceUrl: 'https://www.world-nuclear-news.org/Articles/Pandemic-delays-start-up-of-Fangchenggang-Hualong',
    },
    {
      label: 'Contracting and risk allocation',
      rating: 'strength',
      finding: 'Built in-house by state-owned nuclear builders, not an independent EPC vendor that can go bankrupt mid-project',
      detail:
        "CNNC and CGN build and operate domestically through their own subsidiaries rather than contracting out to a third-party reactor vendor — removing the Westinghouse-style bankruptcy risk that hit Vogtle. For the Karachi export, CNNC (via China Zhongyuan Engineering Corporation) was general contractor and reactor supplier under a contract valued at roughly $9-10 billion, with the China Nuclear Engineering and Construction Group as construction contractor.",
      verified: true,
      sourceLabel: 'Power Technology — Karachi Nuclear Power Plant (KANUPP) Expansion',
      sourceUrl: 'https://www.power-technology.com/projects/karachi-nuclear-power-plant-expansion/',
    },
    {
      label: 'Site selection and site-specific engineering',
      rating: 'strength',
      finding: 'Brownfield expansion of an already-operating multi-unit site',
      detail:
        'Fuqing 5 & 6 were built alongside the already-operating Fuqing 1-4 (CPR-1000 units commissioned 2014-2017), reusing an established coastal site with existing grid connections and cooling water infrastructure — the same brownfield advantage documented at Vogtle, on an even larger single-site scale (six units total).',
      verified: true,
      sourceLabel: 'Wikipedia — Fuqing Nuclear Power Plant',
      sourceUrl: 'https://en.wikipedia.org/wiki/Fuqing_Nuclear_Power_Plant',
    },
    {
      label: 'Owner project-management capability',
      rating: 'strength',
      finding: 'Continuous, multi-site builders running several simultaneous projects, not a one-off mobilization',
      detail:
        "Unlike Southern Company's 30-year gap before Vogtle, CNNC and CGN were simultaneously building Hualong One units at Fuqing and Fangchenggang plus additional units at Zhangzhou, Changjiang, Taipingling, and San'ao at the same time — an active, continuous construction pipeline across multiple sites rather than a single crash mobilization.",
      verified: true,
      sourceLabel: 'World Nuclear News — Pandemic delays start-up of Fangchenggang Hualong One units',
      sourceUrl: 'https://www.world-nuclear-news.org/Articles/Pandemic-delays-start-up-of-Fangchenggang-Hualong',
    },
    {
      label: 'Domestic workforce and human capital',
      rating: 'strength',
      finding: 'A continuous, indigenized construction and supply pipeline',
      detail:
        "A Johns Hopkins/Harvard/CUNY/Stony Brook study (published in Nature, July 2025) attributes China's stable low construction costs partly to strategic indigenization — substituting domestic components and Chinese civil-engineering and construction firms for imports, which also implies a steadily employed, experienced domestic workforce rather than one rebuilt from scratch for each project.",
      verified: true,
      sourceLabel: 'Interesting Engineering — China escapes nuclear \'cost curse\' with $2-per-watt power plants',
      sourceUrl: 'https://interestingengineering.com/energy/china-cuts-nuclear-construction-cost',
    },
    {
      label: 'Currency and inflation exposure',
      rating: 'mixed',
      finding: 'No FX risk domestically; China itself carries the exposure on export financing',
      detail:
        'Domestic builds are financed and contracted in CNY. For the Karachi export, more than 80% of the roughly $10 billion project cost was financed through a loan from China\'s state-owned Export-Import Bank — meaning for exports, China\'s own state lender (not the buyer) carries the long-duration cross-border financing exposure.',
      verified: true,
      sourceLabel: 'Power Technology — Karachi Nuclear Power Plant (KANUPP) Expansion',
      sourceUrl: 'https://www.power-technology.com/projects/karachi-nuclear-power-plant-expansion/',
    },
  ],
  financeability: [
    {
      label: 'Financing structure and cost of capital',
      rating: 'strength',
      finding: 'State ownership gives CNNC/CGN access to lower-cost, patient capital than Vogtle\'s mixed private/regulated structure',
      detail:
        "CNNC and CGN are central state-owned enterprises overseen by SASAC, financed through a mix of state equity, bonds, and state bank lending rather than needing to attract independent project financing the way Georgia Power did. Not independently re-confirmed this pass with a specific interest-rate citation — flagged for a direct source.",
      verified: false,
    },
    {
      label: 'Revenue and market structure',
      rating: 'strength',
      finding: 'State-planned electricity sector gives nuclear output a predictable revenue path',
      detail:
        "China's electricity sector remains heavily state-planned, with grid companies as the dominant purchasers of CNNC/CGN nuclear output under long-term arrangements — structurally similar to Korea's centrally planned model and a different risk profile than Georgia's contested rate-case process. Not independently re-confirmed this pass with a specific tariff-mechanism citation.",
      verified: false,
    },
    {
      label: 'Regulatory stability during construction',
      rating: 'mixed',
      finding: 'A real, documented approval freeze hit this exact site — coastal builds recovered, inland approvals still haven\'t',
      detail:
        "Following the Fukushima accident, China's State Council halted approvals for new nuclear plants on March 16, 2011. Construction of Fuqing Unit 4 itself was delayed by this safety review, pushing its start from an original 2011 target to November 2012. Coastal-plant approvals resumed in October 2012 and formally restarted in December 2014, but a moratorium on inland nuclear plant approvals imposed after Fukushima has persisted for over a decade — a genuine, still-unresolved regulatory-stability gap rather than a fully clean record.",
      verified: true,
      sourceLabel: 'Bulletin of the Atomic Scientists — China responds to Fukushima',
      sourceUrl: 'https://thebulletin.org/2012/06/china-responds-to-fukushima/',
    },
    {
      label: 'Political and public acceptance durability',
      rating: 'strength',
      finding: 'The 2011 pause was brief and coastal expansion has continued uninterrupted since',
      detail:
        "Unlike South Korea's multi-year Moon-administration phase-out policy that delayed Shin-Hanul, China's post-Fukushima coastal-plant pause lasted under two years (halted March 2011, approvals resumed October 2012, formally restarted December 2014) and the program has expanded continuously since — six units now operating at Fuqing alone, plus the multi-site build-out at Fangchenggang, Zhangzhou, Changjiang, Taipingling, and San'ao.",
      verified: true,
      sourceLabel: 'Bulletin of the Atomic Scientists — China responds to Fukushima',
      sourceUrl: 'https://thebulletin.org/2012/06/china-responds-to-fukushima/',
    },
  ],
  lifecycleLiability: [
    {
      label: 'Fuel cycle economics',
      rating: 'mixed',
      finding: 'Increasingly self-sufficient on enrichment; still import-dependent on raw uranium',
      detail:
        "CNNC's Lanzhou centrifuge enrichment facility (commissioned 2010, ~0.5 million SWU/year at the time) has grown CNNC's share of world uranium enrichment capacity to roughly 24.2% — second only to Russia's Rosatom — giving China a level of front-end fuel-cycle independence Korea structurally lacks. But domestic uranium mining supplies only around half of China's annual demand, with the remainder imported (Kazakhstan, Australia, Namibia among the main sources), so the raw-material input still carries import exposure even as enrichment does not.",
      verified: true,
      sourceLabel: 'Belfer Center — China\'s Uranium Enrichment Capacity: Rapid Expansion to Meet Commercial Needs',
      sourceUrl: 'https://www.belfercenter.org/sites/default/files/pantheon_files/files/publication/chinasuraniumenrichmenntcapacity.pdf',
    },
    {
      label: 'Decommissioning fund adequacy',
      rating: 'mixed',
      finding: 'A funding mechanism exists by regulation; plant-specific balances for Fuqing 5 & 6 not located',
      detail:
        "China levies a spent-fuel and waste-disposal fee of CNY 2.6 fen/kWh (about 0.026 CNY) from the fifth year of each reactor's commercial operation onward, administered under a China Atomic Energy Authority regulation on the Fund for Treatment and Disposal of Spent Fuel — confirming the mechanism is real and active. A Fuqing 5/6-specific fund balance wasn't located in this pass, plausible given both units only reached commercial operation in 2021-2022.",
      verified: true,
      sourceLabel: 'World Nuclear Association — China\'s Nuclear Fuel Cycle',
      sourceUrl: 'https://world-nuclear.org/information-library/country-profiles/countries-a-f/china-nuclear-fuel-cycle',
    },
  ],
  contextModifier: {
    label: 'Energy security and scale context: demand growth and decarbonization, not import substitution',
    detail:
      "China is not resource-poor the way South Korea is — it holds large domestic coal reserves and a growing renewables base. The primary driver behind its nuclear build-out is different from both Vogtle (replacement baseload/grid reliability) and Korea (near-total import dependence): massive and still-growing electricity demand combined with a 2060 carbon-neutrality pledge, met through simultaneous buildout of coal, renewables, and nuclear rather than nuclear substituting for imported fuel. That reframes how directly China's cost performance should be read against either benchmark — it reflects an 'all of the above,' indigenization-driven scale strategy rather than a resource-security hedge.",
  },
  sources: [
    {
      label: 'Wikipedia — Hualong One',
      url: 'https://en.wikipedia.org/wiki/Hualong_One',
    },
    {
      label: 'Wikipedia — Fuqing Nuclear Power Plant',
      url: 'https://en.wikipedia.org/wiki/Fuqing_Nuclear_Power_Plant',
    },
    {
      label: 'World Nuclear News — Pandemic delays start-up of Fangchenggang Hualong One units',
      url: 'https://www.world-nuclear-news.org/Articles/Pandemic-delays-start-up-of-Fangchenggang-Hualong',
    },
    {
      label: 'Power Technology — Karachi Nuclear Power Plant (KANUPP) Expansion',
      url: 'https://www.power-technology.com/projects/karachi-nuclear-power-plant-expansion/',
    },
    {
      label: "Interesting Engineering — China escapes nuclear 'cost curse' with $2-per-watt power plants",
      url: 'https://interestingengineering.com/energy/china-cuts-nuclear-construction-cost',
    },
    {
      label: 'Bulletin of the Atomic Scientists — China responds to Fukushima',
      url: 'https://thebulletin.org/2012/06/china-responds-to-fukushima/',
    },
    {
      label: "Belfer Center — China's Uranium Enrichment Capacity",
      url: 'https://www.belfercenter.org/sites/default/files/pantheon_files/files/publication/chinasuraniumenrichmenntcapacity.pdf',
    },
    {
      label: "World Nuclear Association — China's Nuclear Fuel Cycle",
      url: 'https://world-nuclear.org/information-library/country-profiles/countries-a-f/china-nuclear-fuel-cycle',
    },
  ],
  verificationNote:
    '12 of 14 dimensions carry a direct source link (all 8 under Build-Phase Risk, plus regulatory stability, political durability, fuel cycle economics, and decommissioning fund adequacy — including the honest Fangchenggang COVID delay under fleet effect). Financing structure and revenue/market structure remain analytical/general-knowledge and flagged "Needs verification," same discipline as the first pass on the Vogtle and South Korea entries before they were fully sourced.',
  ctaTitle: 'See how this compares to your program',
  ctaBody:
    "Register to benchmark your project's execution, financing, and lifecycle risk against China's Hualong One fleet and other established nuclear builds.",
}

export const franceEpr: EstablishedProgramConfig = {
  flagUrl: 'https://flagcdn.com/w80/fr.png',
  slug: 'france',
  countryName: 'France',
  heroTitle: 'France — Flamanville 3 EPR',
  heroSub:
    "The mirror image of Vogtle: the country that once built 56 reactors in 25 years at speed and standardization no one has matched, then spent 17 years and roughly four times its original budget building one first-of-a-kind reactor after a quarter-century construction gap.",
  badge: 'Benchmark Program — Established Nation',
  statPills: [
    { icon: '💰', label: '€13.2B EDF-reported cost (up to €23.7B per France\'s Court of Auditors) vs €3.3B original 2007 estimate' },
    { icon: '⏱️', label: '~12 years behind original schedule — construction 2007, targeted 2012, grid-connected December 2024' },
    { icon: '⚡', label: '1,650 MW — France\'s most powerful reactor, full power reached December 14, 2025' },
  ],
  summaryRows: [
    { label: 'Reactor design', value: 'Framatome (formerly Areva NP) EPR' },
    { label: 'Location', value: 'Flamanville, Normandy — Flamanville Nuclear Power Plant' },
    { label: 'Lead owner/operator', value: 'Électricité de France (EDF) — 100% state-owned since June 2023' },
    { label: 'Construction start', value: 'December 2007' },
    { label: 'Grid connection', value: 'December 21, 2024' },
    { label: 'Full power reached', value: 'December 14, 2025' },
    { label: 'Original target / budget', value: '2012 / €3.3 billion' },
    { label: 'Site history', value: 'Adjacent to existing Flamanville 1 & 2 (commissioned 1986/87)' },
    { label: 'Prior French reactor', value: 'Civaux 2 connected to the grid in 1999 — a 25-year gap before Flamanville 3' },
  ],
  buildPhaseRisk: [
    {
      label: 'Design maturity before construction',
      rating: 'weakness',
      finding: 'A major design/manufacturing defect surfaced eight years into construction, not before it',
      detail:
        "Framatome (then Areva NP) disclosed in April 2015 — nearly eight years after construction began — an anomaly in the steel composition of the reactor pressure vessel's closure and bottom heads. France's nuclear safety regulator (ASN) required a dedicated mechanical-strength test programme, with results submitted in December 2016, before ruling in October 2017 that the vessel could be commissioned but only used until 2024. Separately, eight welds in the main steam transfer pipes penetrating the containment also required repair before startup could proceed.",
      verified: true,
      sourceLabel: "ASNR — Anomaly affecting the Flamanville EPR reactor vessel",
      sourceUrl: 'https://regulation-oversight.asnr.fr/oversight/oversight-of-the-flamanville-epr-reactor/anomaly-affecting-the-flamanville-epr-reactor-vessel',
    },
    {
      label: 'Reference plant vs. first-of-a-kind',
      rating: 'weakness',
      finding: 'Flamanville 3 was the second EPR to start construction but the last of three to finish',
      detail:
        "Flamanville 3 began construction in December 2007, two years after Olkiluoto 3 in Finland (started August 2005) and two years before Taishan 1 in China (started November 2009) — yet Taishan 1 reached commercial operation first (December 2018), Olkiluoto 3 second (April 2023), and Flamanville 3 last, reaching grid connection in December 2024 and full power in December 2025. The order of construction start didn't predict the order of completion, and no single finished reference plant existed anywhere in the world when any of the three began.",
      verified: true,
      sourceLabel: 'EDF — First Taishan EPR reactor enters commercial operation',
      sourceUrl: 'https://www.edf.fr/en/edf/the-first-of-two-epr-reactors-at-china-s-taishan-nuclear-power-plant-enters-into-commercial-operation',
    },
    {
      label: 'Fleet effect / repetition',
      rating: 'mixed',
      finding: 'The strongest historical repetition effect in this framework, entirely absent by the time Flamanville 3 started',
      detail:
        "France's 1970s-90s Messmer Plan built roughly 56 standardized reactors in about 25 years, with individual units completed in around six years each — the fastest, most repeated nuclear buildout on record. But the last of those reactors, Civaux 2, connected to the grid in 1999, and France then built nothing else until Flamanville 3 broke ground in 2007 and connected in 2024 — a 25-year gap that erased the repetition benefit entirely for this specific project. A second standardized program (six EPR2 units, plus an option for eight more) was only launched in 2022, for service starting 2035.",
      verified: true,
      sourceLabel: "Works in Progress — How France achieved the world's fastest nuclear buildout",
      sourceUrl: 'https://worksinprogress.co/issue/liberte-egalite-radioactivite/',
    },
    {
      label: 'Contracting and risk allocation',
      rating: 'weakness',
      finding: 'EDF, as owner, absorbed the overrun directly rather than a separate EPC vendor bearing it',
      detail:
        "EDF repeatedly announced its own rising cost estimates over the life of the project — from €3.3 billion in 2007 to €10.9 billion by 2018 to €13.2 billion at completion — with France's Court of Auditors putting the true figure as high as €23.7 billion including financing costs. Unlike Vogtle, there was no independent EPC vendor bankruptcy (Areva/Framatome, the reactor designer, stayed solvent, though Areva itself required a separate 2015-2017 state-backed restructuring), but there is also no public evidence the overrun was contractually shifted away from EDF onto the vendor.",
      verified: true,
      sourceLabel: "Interesting Engineering — France's nuclear reactor almost ready, 13.2 billion euros later",
      sourceUrl: 'https://interestingengineering.com/energy/frances-nuclear-reactor-almost-ready',
    },
    {
      label: 'Site selection and site-specific engineering',
      rating: 'strength',
      finding: 'Brownfield site originally planned for four reactors',
      detail:
        'Flamanville 3 was built adjacent to the already-operating Flamanville 1 and 2 (commissioned December 1986 and March 1987), on a site originally designed to accommodate four reactor units — reusing established grid connections, cooling water access, and site infrastructure, the same brownfield advantage documented at Vogtle and Fuqing.',
      verified: true,
      sourceLabel: 'Power Technology — Flamanville Nuclear Power Plant',
      sourceUrl: 'https://www.power-technology.com/projects/flamanvillenuclear/',
    },
    {
      label: 'Owner project-management capability',
      rating: 'mixed',
      finding: "The world's largest single-operator nuclear fleet, but no new-build experience in a generation",
      detail:
        'EDF operates France\'s entire 56-reactor domestic fleet — deep operating expertise — but had not started construction on a new reactor since Civaux 2 (grid-connected 1999) before breaking ground on Flamanville 3 in 2007, and the ITIF research briefing on France\'s program attributes much of the project\'s difficulty to that construction-specific capability gap rather than a lack of general nuclear competence.',
      verified: true,
      sourceLabel: "ITIF — Lessons From France's Nuclear Program",
      sourceUrl: 'https://itif.org/publications/2025/09/02/lessons-from-frances-nuclear-program/',
    },
    {
      label: 'Domestic workforce and human capital',
      rating: 'weakness',
      finding: 'A construction workforce and supply chain that had to be rebuilt from a standing start',
      detail:
        "The ITIF research briefing on France's nuclear program concludes that during the gap since Civaux, EDF, Framatome, and their subcontractors lost practical new-build competence as supply chains were dismantled and engineers moved on or retired — surfacing during Flamanville 3 as welding defects in the reactor vessel lid, concrete quality issues, piping weld nonconformities, and control-system integration problems, a close parallel to the craft-labor attrition documented at Vogtle.",
      verified: true,
      sourceLabel: "ITIF — Lessons From France's Nuclear Program",
      sourceUrl: 'https://itif.org/publications/2025/09/02/lessons-from-frances-nuclear-program/',
    },
    {
      label: 'Currency and inflation exposure',
      rating: 'strength',
      finding: 'No FX exposure, but a 17-year build still absorbed ordinary cost inflation',
      detail:
        "Financed and contracted entirely in EUR by a domestic owner, avoiding the cross-border currency risk a newcomer country would face with foreign vendor financing — though, as at Vogtle, the multi-year delay (construction start 2007 to full power 2025) still exposed the project to ordinary material and labor cost inflation over nearly two decades. Follows directly from the domestic financing structure documented under Financeability, rather than a separate citable claim.",
      verified: true,
    },
  ],
  financeability: [
    {
      label: 'Financing structure and cost of capital',
      rating: 'strength',
      finding: 'EDF became 100% state-owned in 2023, explicitly to backstop major nuclear projects',
      detail:
        "The French state completed full renationalization of EDF in June 2023 for roughly €9.7 billion, becoming sole shareholder. The French government and EDF both cited strengthening EDF's financial position for major projects — including the new six-unit EPR2 program — as a primary driver, following the 2021-2022 European energy crisis.",
      verified: true,
      sourceLabel: 'EDF — The French State becomes the sole shareholder of EDF again',
      sourceUrl: 'https://chile.edf.com/en/news/the-french-state-becomes-the-sole-shareholder-of-edf-again',
    },
    {
      label: 'Revenue and market structure',
      rating: 'mixed',
      finding: 'EDF\'s nuclear revenue is shaped by a regulated market-access mechanism, not pure merchant pricing',
      detail:
        "France requires EDF to sell a share of its nuclear output to competing electricity suppliers at a regulated price under the ARENH (regulated access to incumbent nuclear electricity) mechanism — capping EDF's own upside from its nuclear fleet in the name of market competition. Not independently re-confirmed this pass with current ARENH terms or a post-renationalization successor mechanism — flagged for a direct citation.",
      verified: false,
    },
    {
      label: 'Regulatory stability during construction',
      rating: 'mixed',
      finding: "ASN's licensing authority held steady, but its safety review added years to the schedule",
      detail:
        "ASN's core regulatory authority and licensing framework did not change or reverse during construction — unlike a political phase-out — but its safety review of the reactor vessel anomaly (2015 disclosure, test results submitted 2016, ruling issued October 2017) and its requirement to repair eight containment welds were legitimate, safety-driven interventions that materially extended the schedule. That's a different kind of regulatory risk than Vogtle's licensing-amendment churn or Korea's phase-out policy, but a real one.",
      verified: true,
      sourceLabel: "ASNR — Anomaly affecting the Flamanville EPR reactor vessel",
      sourceUrl: 'https://regulation-oversight.asnr.fr/oversight/oversight-of-the-flamanville-epr-reactor/anomaly-affecting-the-flamanville-epr-reactor-vessel',
    },
    {
      label: 'Political and public acceptance durability',
      rating: 'mixed',
      finding: 'A multi-year policy reversal, similar in shape to Korea\'s phase-out and reinstatement',
      detail:
        "France's 2015 Energy Transition for Green Growth law, following a 2012 campaign pledge by President Hollande, targeted cutting nuclear's share of generation to 50% by around 2025 and closing 14 reactors. President Macron reversed this policy direction from 2022 onward, and in 2023 the National Assembly voted 97-26 to formally abolish the 50% reduction target, alongside Macron's pledge to build six new EPR2 reactors (with an option for eight more). A real multi-year period of policy uncertainty for the industry, not a clean record — comparable in shape to South Korea's Moon-era phase-out of Shin-Hanul, though it didn't pause Flamanville 3 itself.",
      verified: true,
      sourceLabel: 'NucNet — National Assembly votes to abolish plans to reduce nuclear share',
      sourceUrl: 'https://www.nucnet.org/news/national-assembly-votes-to-abolish-plans-to-reduce-nuclear-share-3-4-2023',
    },
  ],
  lifecycleLiability: [
    {
      label: 'Fuel cycle economics',
      rating: 'mixed',
      finding: 'Full sovereignty over enrichment and reprocessing, but no domestic uranium mining',
      detail:
        "Under a 1972 agreement with Belgium, Italy, and Spain (Eurodif, later Georges Besse I, then Georges Besse II from the mid-2000s using centrifuge technology), France secured independent domestic uranium enrichment capacity — one of only four commercial-scale enrichment operations in the world alongside China's CNNC, Russia's Rosatom, and Urenco. Orano's La Hague site also reprocesses spent fuel into MOX fuel, which supplies roughly 10% of France's nuclear electricity today (potentially 25-40% with further recycling). But France mines no significant domestic uranium and imports all of its raw natural uranium — strong on the enrichment/reprocessing end of the cycle, structurally import-dependent on the front end, similar in shape to China's position.",
      verified: true,
      sourceLabel: 'World Nuclear Association — Mixed Oxide (MOX) Fuel',
      sourceUrl: 'https://world-nuclear.org/information-library/nuclear-fuel-cycle/fuel-recycling/mixed-oxide-fuel-mox',
    },
    {
      label: 'Decommissioning fund adequacy',
      rating: 'mixed',
      finding: 'A funded mechanism exists, but France\'s own auditors have twice questioned whether it\'s enough',
      detail:
        "Under 2006 legislation, EDF must maintain a dedicated portfolio of decommissioning and waste-management assets; as of June 2016 these totaled about €23.3 billion against roughly €22.2 billion in booked liabilities — nominally funded. But France's Court of Auditors (Cour des Comptes) found in a 2005 report that EDF held only an 'embryo' of the necessary funds, and a 2025 audit-body review again questioned the feasibility of EDF's long-term nuclear financial planning — a recurring, unresolved point of doubt rather than settled confidence.",
      verified: true,
      sourceLabel: 'World Nuclear News — EdF seeks to bolster decommissioning fund',
      sourceUrl: 'https://www.world-nuclear-news.org/Articles/EdF-seeks-to-bolster-decommissioning-fund',
    },
  ],
  contextModifier: {
    label: 'Energy security context: the original energy-independence case, now reinforced by a second crisis',
    detail:
      "France's nuclear program was triggered directly by the 1973 oil crisis — the Messmer Plan explicitly aimed to replace fossil-fuel-dependent generation with domestically controllable nuclear power, and succeeded well enough that nuclear now supplies roughly 70% of French electricity, among the highest shares in the world. That rationale has been reinforced a second time by the 2021-2022 European energy crisis (tied to Russian gas dependency), which the French government cited directly when justifying EDF's full renationalization and the new EPR2 build-out. Unlike China's demand-growth-driven build-out, France's case is the closest parallel in this framework to Korea's import-dependence rationale — except France pursued it as electricity-sector independence starting 50 years earlier, and is now leaning on the same logic again for its second nuclear building wave.",
  },
  sources: [
    {
      label: 'ASNR — Anomaly affecting the Flamanville EPR reactor vessel',
      url: 'https://regulation-oversight.asnr.fr/oversight/oversight-of-the-flamanville-epr-reactor/anomaly-affecting-the-flamanville-epr-reactor-vessel',
    },
    {
      label: "Interesting Engineering — France's nuclear reactor almost ready, 13.2 billion euros later",
      url: 'https://interestingengineering.com/energy/frances-nuclear-reactor-almost-ready',
    },
    {
      label: 'NucNet — France\'s Delayed Flamanville-3 Nuclear Plant Reaches Full Power',
      url: 'https://www.nucnet.org/news/delayed-flamanville-3-nuclear-plant-reaches-100-full-power-12-1-2025',
    },
    {
      label: "Works in Progress — How France achieved the world's fastest nuclear buildout",
      url: 'https://worksinprogress.co/issue/liberte-egalite-radioactivite/',
    },
    {
      label: "ITIF — Lessons From France's Nuclear Program",
      url: 'https://itif.org/publications/2025/09/02/lessons-from-frances-nuclear-program/',
    },
    {
      label: 'EDF — The French State becomes the sole shareholder of EDF again',
      url: 'https://chile.edf.com/en/news/the-french-state-becomes-the-sole-shareholder-of-edf-again',
    },
    {
      label: 'NucNet — National Assembly votes to abolish plans to reduce nuclear share',
      url: 'https://www.nucnet.org/news/national-assembly-votes-to-abolish-plans-to-reduce-nuclear-share-3-4-2023',
    },
    {
      label: 'World Nuclear News — EdF seeks to bolster decommissioning fund',
      url: 'https://www.world-nuclear-news.org/Articles/EdF-seeks-to-bolster-decommissioning-fund',
    },
  ],
  verificationNote:
    '13 of 14 dimensions carry a direct source link — including the honest ironies that Flamanville 3 finished last of three EPRs despite not starting last, and that France\'s own Court of Auditors has twice (2005, 2025) questioned EDF\'s decommissioning-fund adequacy. Revenue and market structure (the ARENH mechanism) is analytical/general-knowledge and flagged "Needs verification," same discipline as the first pass on the US, South Korea, and China entries before they were fully sourced.',
  ctaTitle: 'See how this compares to your program',
  ctaBody:
    "Register to benchmark your project's execution, financing, and lifecycle risk against Flamanville 3 and other established nuclear builds.",
}

export const unitedKingdomHinkleyC: EstablishedProgramConfig = {
  flagUrl: 'https://flagcdn.com/w80/gb.png',
  slug: 'united-kingdom',
  countryName: 'United Kingdom',
  heroTitle: 'United Kingdom — Hinkley Point C EPR',
  heroSub:
    "Same EPR design as Flamanville, opposite financing philosophy: instead of a state-owned utility absorbing the overrun, the UK's Contract for Difference structure was built to shift construction risk onto private developers — a live test of whether market-based financing changes the outcome, still under construction and not yet the answer either way.",
  badge: 'Benchmark Program — Established Nation (Under Construction)',
  statPills: [
    { icon: '💰', label: '£35B EDF-stated cost (2015 prices), up to £46B "at today\'s prices" vs £18B original estimate' },
    { icon: '⏱️', label: 'Construction started 2017; Unit 1 now targeted 2030-2031, a 22-year gap since Sizewell B (1995)' },
    { icon: '⚡', label: '3,260 MW combined (2 EPR units) — CfD strike price £92.50/MWh (2012 prices) for 35 years' },
  ],
  summaryRows: [
    { label: 'Reactor design', value: 'Framatome EPR × 2 (same design as Flamanville 3)' },
    { label: 'Location', value: 'Hinkley Point, Somerset, England' },
    { label: 'Lead owner/operator', value: 'NNB Generation Company — EDF 66.5% / China General Nuclear (CGN) 33.5% (nominal)' },
    { label: 'Nuclear site licence granted', value: 'November 2012' },
    { label: 'Design regulatory approval (GDA)', value: 'December 2012 — before construction started' },
    { label: 'Funded Decommissioning Programme approved', value: 'October 2015 (conditional) — before construction started' },
    { label: 'Construction start', value: '2017' },
    { label: 'Current target for Unit 1', value: '2030-2031 (EDF/press estimates as of Feb 2026)' },
    { label: 'Prior UK reactor', value: 'Sizewell B, completed 1995 — a 22-year gap before Hinkley C construction began' },
  ],
  buildPhaseRisk: [
    {
      label: 'Design maturity before construction',
      rating: 'strength',
      finding: 'Full regulatory design approval came five years before construction started, not during it',
      detail:
        "The UK EPR design received Design Acceptance Confirmation and a Statement of Design Acceptability from the Office for Nuclear Regulation (ONR) and the Environment Agency in December 2012 — after an interim approval in December 2011 — a full five years before construction began in 2017. That sequencing is the opposite of Flamanville, where a major vessel-steel anomaly surfaced eight years into construction.",
      verified: true,
      sourceLabel: 'ONR — UK European Pressurised Reactor (UK EPR) design acceptance',
      sourceUrl: 'https://www.onr.org.uk/generic-design-assessment/assessment-of-reactors/uk-european-pressurised-reactor-uk-epr',
    },
    {
      label: 'Reference plant vs. first-of-a-kind',
      rating: 'mixed',
      finding: 'A reference plant existed this time — it just didn\'t prevent the delay',
      detail:
        "By the time most of Hinkley C's construction took place, Taishan 1 in China (the same EPR design) had already been operating since December 2018. Unlike Flamanville or Olkiluoto, Hinkley wasn't racing a truly unproven design. But EDF's own explanation for the latest delay cites low productivity in complex electromechanical installation work (piping, cabling) — meaning the specific bottleneck was building the design with a new UK workforce and supply chain, not the reactor technology itself. A foreign reference plant reduces but doesn't eliminate first-build-in-a-country risk.",
      verified: true,
      sourceLabel: 'NucNet — UK Nuclear Station Could Be Delayed To 2031 And Cost Up To £46 Billion, Says EDF',
      sourceUrl: 'https://www.nucnet.org/news/uk-nuclear-station-could-be-delayed-to-2031-and-cost-up-top-gbp46-billion-says-edf-1-3-2024',
    },
    {
      label: 'Fleet effect / repetition',
      rating: 'mixed',
      finding: 'A two-unit site, with a near-identical repeat plant now funded — but unproven',
      detail:
        'Hinkley C itself is two EPR units on one site. A near-identical follow-on project, Sizewell C, reached a positive UK government funding decision in late 2022 (with the UK government taking a direct equity stake), explicitly intended to capture learning-curve savings from Hinkley\'s experience. That repetition effect is not yet demonstrated, since Sizewell C is still in early construction.',
      verified: true,
      sourceLabel: 'World Nuclear News — UK government takes 50% stake, confirms backing for Sizewell C',
      sourceUrl: 'https://www.world-nuclear-news.org/Articles/UK-government-takes-50-stake,-gives-go-ahead-for-S',
    },
    {
      label: 'Contracting and risk allocation',
      rating: 'strength',
      finding: 'Construction cost-overrun risk sits contractually with the private developers, not the state or consumers',
      detail:
        "Under the Contract for Difference structure, EDF and CGN — not UK taxpayers or electricity consumers — are contractually on the hook for construction cost overruns; the government's 2017 National Audit Office review confirmed this allocation while separately warning the deal itself offered only marginal value for money. This is a structurally different allocation than Vogtle (DOE loan guarantees plus partial ratepayer recovery) or France (state-owned EDF absorbing the overrun directly).",
      verified: true,
      sourceLabel: 'National Audit Office — Hinkley Point C',
      sourceUrl: 'https://www.nao.org.uk/wp-content/uploads/2017/06/Hinkley-Point-C.pdf',
    },
    {
      label: 'Site selection and site-specific engineering',
      rating: 'strength',
      finding: 'Brownfield site adjacent to two prior reactors',
      detail:
        'Hinkley C is being built on a 175-hectare site adjacent to the former Hinkley Point A (1965-2000) and Hinkley Point B (1976-2022) stations, reusing established grid connections and cooling water access — the same brownfield advantage documented at Vogtle, Fuqing, and Flamanville.',
      verified: true,
      sourceLabel: 'Power Technology — Hinkley Point C nuclear power station',
      sourceUrl: 'https://www.power-technology.com/projects/hinkley-point-c-nuclear-power-station/',
    },
    {
      label: 'Owner project-management capability',
      rating: 'mixed',
      finding: 'The same owner as Flamanville, but its lessons didn\'t fully transfer to a new country',
      detail:
        "EDF is the majority owner of both Flamanville 3 and Hinkley C, meaning it carries both France's historic fleet-building experience and its recent first-of-a-kind EPR lessons into the UK project. That experience evidently didn't fully transfer once applied to a new national workforce, supply chain, and regulatory environment — Hinkley has slipped years despite not being EDF's first EPR build. Analytical inference from the pattern across both projects, not independently confirmed with a source describing knowledge transfer directly — flagged for further verification.",
      verified: false,
    },
    {
      label: 'Domestic workforce and human capital',
      rating: 'weakness',
      finding: 'A 22-year construction gap, then Covid and Brexit on top of it',
      detail:
        "Hinkley C is the UK's first new reactor build since Sizewell B was completed in 1995. EDF has explicitly attributed recent delays and cost increases to Covid-19 disruption, Brexit (which disrupted EU labour and supply-chain access specifically), and low productivity in complex electromechanical installation work — a workforce and supply-chain rebuild problem layered with two additional UK-specific shocks not present in the US, Korean, or Chinese cases.",
      verified: true,
      sourceLabel: 'NucNet — UK Nuclear Station Could Be Delayed To 2031 And Cost Up To £46 Billion, Says EDF',
      sourceUrl: 'https://www.nucnet.org/news/uk-nuclear-station-could-be-delayed-to-2031-and-cost-up-top-gbp46-billion-says-edf-1-3-2024',
    },
    {
      label: 'Currency and inflation exposure',
      rating: 'mixed',
      finding: 'GBP-denominated, but Brexit itself — not just ordinary inflation — is a cited cost driver',
      detail:
        "Financed and contracted domestically in GBP, avoiding cross-border currency risk. But EDF names Brexit specifically (distinct from general inflation) as a driver of cost increases — a UK-specific disruption to European labour mobility and supply chains that doesn't have a clean parallel in the other entries in this framework.",
      verified: true,
      sourceLabel: 'NucNet — UK Nuclear Station Could Be Delayed To 2031 And Cost Up To £46 Billion, Says EDF',
      sourceUrl: 'https://www.nucnet.org/news/uk-nuclear-station-could-be-delayed-to-2031-and-cost-up-top-gbp46-billion-says-edf-1-3-2024',
    },
  ],
  financeability: [
    {
      label: 'Financing structure and cost of capital',
      rating: 'strength',
      finding: 'A 35-year guaranteed strike price lets private developers raise capital against predictable future revenue',
      detail:
        "The Contract for Difference guarantees NNB Generation Company a strike price of £92.50/MWh (2012 prices, indexed to inflation) for 35 years of output — giving EDF and CGN bankable revenue certainty despite carrying full construction-cost risk themselves. This is the named case in this framework's own economics doc for the CfD financing model.",
      verified: true,
      sourceLabel: 'UK Government — Hinkley Point C Contract for Difference',
      sourceUrl: 'https://assets.publishing.service.gov.uk/media/6385d8d6e90e07789ae12720/hinkley-point-c-contract-for-difference-november-2022.pdf',
    },
    {
      label: 'Revenue and market structure',
      rating: 'mixed',
      finding: 'A bankable mechanism for the developer, judged marginal value for money for consumers',
      detail:
        "The CfD gives consumers exposure in both directions: they fund top-up payments when the wholesale price is below £92.50/MWh, and receive clawback payments when it's above. The government's own National Audit Office concluded in its 2017 review that the Hinkley deal 'locked consumers into a risky and expensive project with uncertain strategic and economic benefits' and that the economic case was 'marginal and subject to significant uncertainty' even at the time it was signed.",
      verified: true,
      sourceLabel: 'National Audit Office — Hinkley Point C',
      sourceUrl: 'https://www.nao.org.uk/wp-content/uploads/2017/06/Hinkley-Point-C.pdf',
    },
    {
      label: 'Regulatory stability during construction',
      rating: 'mixed',
      finding: 'The design and licensing basis held steady, but real safety-enforcement action has hit the construction site',
      detail:
        "ONR has not reversed or renegotiated Hinkley C's core design approval or site licence during construction. But ONR inspectors have taken genuine enforcement action on site: in December 2025 they issued civil engineering contractor Bylor JV a fire safety notice after finding a 'risk of serious injury' from inadequate fire controls, and in February 2026 issued fire enforcement notices (a 'red rating' intervention) to five mechanical/electrical/heating contractors — Altrad Babcock, Altrad Services, Balfour Beatty Kilpatrick, Cavendish Nuclear, and NG Bailey — for inadequate fire-risk assessments and insufficient emergency escape routes. Real, ongoing regulatory friction at the construction-safety level, distinct from (and less severe than) a design-basis reversal.",
      verified: true,
      sourceLabel: "BBC — 'Risk of serious injury' at nuclear plant site",
      sourceUrl: 'https://feeds.bbci.co.uk/news/articles/cqxq4wdxyryo',
    },
    {
      label: 'Political and public acceptance durability',
      rating: 'mixed',
      finding: 'Cross-party support for the plant itself, but a real geopolitical rupture over its Chinese investor',
      detail:
        "Support for Hinkley C's construction has held across changes of UK government, unlike Korea's Shin-Hanul phase-out or France's 2015-2022 nuclear-share policy swing. But the China/CGN equity partnership became a genuine flashpoint: in 2022 the UK government paid CGN roughly £679 million to exit the follow-on Sizewell C project entirely, with then-PM Rishi Sunak declaring the 'golden era' of UK-China relations 'over.' CGN retains its Hinkley C stake, but itself halted funding contributions to the project in late 2023, leaving EDF to fund cost overruns alone and diluting CGN's effective ownership share — an unresolved, still-developing risk distinct from anything in the other three entries.",
      verified: true,
      sourceLabel: 'World Nuclear News — UK removes China from Sizewell nuclear project, takes joint stake',
      sourceUrl: 'https://www.france24.com/en/live-news/20221129-uk-removes-china-from-sizewell-nuclear-project-takes-joint-stake',
    },
  ],
  lifecycleLiability: [
    {
      label: 'Fuel cycle economics',
      rating: 'mixed',
      finding: 'Real domestic enrichment capability, no domestic uranium mining',
      detail:
        "The UK has held a stake in Urenco (alongside Dutch and German shareholders) since 1970, giving it a real ownership claim on enrichment capacity at Urenco's Capenhurst site — one of a small number of commercial-scale enrichment operations in the world. The UK government has also funded a new £196 million HALEU (advanced fuel) enrichment facility at Capenhurst targeting 2031. But the UK mines no domestic uranium and imports all raw ore — strong on enrichment, structurally import-dependent on the front end, the same shape as France's and China's positions.",
      verified: true,
      sourceLabel: 'World Nuclear News — UK aims for Urenco-built HALEU facility by 2031',
      sourceUrl: 'https://www.world-nuclear-news.org/articles/uk-aims-for-urenco-built-haleu-facility-by-2031',
    },
    {
      label: 'Decommissioning fund adequacy',
      rating: 'strength',
      finding: 'Legally required and government-approved before construction was even allowed to start',
      detail:
        "Under the UK's Energy Act 2008, any new nuclear operator must have a Funded Decommissioning Programme (FDP) approved by the Secretary of State before construction can begin. Hinkley C's FDP received conditional government approval on October 21, 2015 — nearly two years before construction started in 2017. That's a stronger structural precommitment than the 'accumulate funds as you go' model used at Vogtle, Korea's fleet, China's fleet, and France's EDF — though it also means the true adequacy of the fund's assumptions can't be assessed until decades from now.",
      verified: true,
      sourceLabel: 'No2NuclearPower — Waste and Decommissioning Financing Arrangements',
      sourceUrl: 'https://www.no2nuclearpower.org.uk/new-reactors/facilitative-actions/waste-decommissioning-financing-arrangements/',
    },
  ],
  contextModifier: {
    label: 'Energy security context: a deliberate market-based bet, not a resource-security hedge',
    detail:
      "The UK is not resource-poor the way South Korea is, and its nuclear rationale isn't primarily fossil-fuel import substitution — it's decarbonization and grid firm-capacity, alongside a specific policy bet that privately financed, CfD-backed nuclear can be built without direct state ownership or state balance-sheet risk. That bet is still being tested in real time: costs have roughly doubled to tripled since FID, EDF alone is now funding overruns as CGN pulls back, and the government's own auditor flagged marginal economics from the outset. The UK's 2050 ambition of 24GW of nuclear capacity, and the decision to fund Sizewell C with a direct government equity stake rather than repeating the pure-CfD model, both suggest the market-based approach is already being partially walked back toward more direct state involvement — worth revisiting once Sizewell C has more construction history.",
  },
  sources: [
    {
      label: 'ONR — UK European Pressurised Reactor (UK EPR) design acceptance',
      url: 'https://www.onr.org.uk/generic-design-assessment/assessment-of-reactors/uk-european-pressurised-reactor-uk-epr',
    },
    {
      label: 'NucNet — UK Nuclear Station Could Be Delayed To 2031 And Cost Up To £46 Billion, Says EDF',
      url: 'https://www.nucnet.org/news/uk-nuclear-station-could-be-delayed-to-2031-and-cost-up-top-gbp46-billion-says-edf-1-3-2024',
    },
    {
      label: 'National Audit Office — Hinkley Point C',
      url: 'https://www.nao.org.uk/wp-content/uploads/2017/06/Hinkley-Point-C.pdf',
    },
    {
      label: 'World Nuclear News — UK government takes 50% stake, confirms backing for Sizewell C',
      url: 'https://www.world-nuclear-news.org/Articles/UK-government-takes-50-stake,-gives-go-ahead-for-S',
    },
    {
      label: 'World Nuclear News — UK removes China from Sizewell nuclear project, takes joint stake',
      url: 'https://www.france24.com/en/live-news/20221129-uk-removes-china-from-sizewell-nuclear-project-takes-joint-stake',
    },
    {
      label: "BBC — 'Risk of serious injury' at nuclear plant site",
      url: 'https://feeds.bbci.co.uk/news/articles/cqxq4wdxyryo',
    },
    {
      label: 'World Nuclear News — UK aims for Urenco-built HALEU facility by 2031',
      url: 'https://www.world-nuclear-news.org/articles/uk-aims-for-urenco-built-haleu-facility-by-2031',
    },
    {
      label: 'No2NuclearPower — Waste and Decommissioning Financing Arrangements',
      url: 'https://www.no2nuclearpower.org.uk/new-reactors/facilitative-actions/waste-decommissioning-financing-arrangements/',
    },
  ],
  verificationNote:
    '13 of 14 dimensions carry a direct source link, including the firmed-up regulatory-stability finding (real ONR fire-safety enforcement notices in Dec 2025 and Feb 2026, not just an absence of bad news) and the CGN/Sizewell C geopolitical rupture. Owner project-management capability is analytical — inferred from EDF\'s dual role at Flamanville and Hinkley rather than a single direct citation — and flagged "Needs verification," same discipline as the first pass on the other three entries. Note this entry differs from the other three: Hinkley C is still under construction (targeted 2030-2031), so figures will continue to move.',
  ctaTitle: 'See how this compares to your program',
  ctaBody:
    "Register to benchmark your project's execution, financing, and lifecycle risk against Hinkley Point C and other established nuclear builds.",
}

export const establishedPrograms: EstablishedProgramConfig[] = [
  unitedStatesVogtle,
  southKoreaApr1400,
  chinaHualongOne,
  franceEpr,
  unitedKingdomHinkleyC,
]
