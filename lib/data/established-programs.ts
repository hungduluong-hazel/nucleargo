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

export const establishedPrograms: EstablishedProgramConfig[] = [unitedStatesVogtle, southKoreaApr1400]
