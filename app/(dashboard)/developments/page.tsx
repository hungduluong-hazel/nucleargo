'use client'

import { useState, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = 'Policy' | 'Technical' | 'Partnership' | 'Regulatory' | 'Workforce'
type Country  = 'Vietnam' | 'Poland' | 'Global'

type Development = {
  id:       string
  category: Category
  country:  Country
  date:     string
  sortDate: string
  title:    string
  body:     string
  source:   string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DEVELOPMENTS: Development[] = [
  {
    id: 'd01',
    category: 'Partnership',
    country: 'Vietnam',
    date: 'May 2026',
    sortDate: '2026-05-01',
    title: 'Korea Eximbank, K-Sure, KEPCO & PVN Sign NT2 Financing Agreement',
    body: 'Korea Eximbank, K-Sure, KEPCO and PetroVietnam signed a financing exploration agreement for Ninh Thuan 2 in May 2026, marking a significant step toward securing Korean financing for Vietnam\'s second nuclear plant. The agreement covers feasibility studies for potential export credit financing.',
    source: 'Vietnam Ministry of Industry and Trade',
  },
  {
    id: 'd02',
    category: 'Partnership',
    country: 'Poland',
    date: 'April 2026',
    sortDate: '2026-04-01',
    title: 'Korea Eximbank Signs Financing Exploration with PEJ',
    body: 'Korea Eximbank signed a financing exploration agreement with Polskie Elektrownie Jądrowe for a potential second nuclear site using APR-1400 technology. Poland is pursuing a multi-vendor strategy with Westinghouse for its first site and Korean technology as a potential option for a second site.',
    source: 'PEJ',
  },
  {
    id: 'd03',
    category: 'Technical',
    country: 'Vietnam',
    date: 'March 2026',
    sortDate: '2026-03-01',
    title: 'Vietnam and Russia Sign Ninh Thuan 1 Intergovernmental Agreement',
    body: 'Vietnam and Russia signed an intergovernmental agreement for the construction of Ninh Thuan 1 using VVER-1200 reactor technology. The agreement formalizes Rosatom as the technology supplier and establishes the legal framework for construction.',
    source: 'Vietnamese Government',
  },
  {
    id: 'd04',
    category: 'Technical',
    country: 'Poland',
    date: 'February 2026',
    sortDate: '2026-02-01',
    title: 'Westinghouse Submits AP1000 Design Documentation to PAA',
    body: "Westinghouse Electric Company submitted updated AP1000 reactor design documentation to Poland's nuclear regulator PAA for licensing review. The submission marks a key step in Poland's licensing process ahead of planned construction start in the late 2020s.",
    source: 'Westinghouse',
  },
  {
    id: 'd05',
    category: 'Policy',
    country: 'Vietnam',
    date: 'January 2026',
    sortDate: '2026-01-01',
    title: 'New Atomic Energy Law Takes Effect',
    body: "Vietnam's revised Atomic Energy Law came into effect on January 1, 2026, designating nuclear power as a national strategic priority. The law explicitly supports new-generation reactors and SMRs while mandating an integrated digital platform for data management and project transparency.",
    source: 'Vietnamese National Assembly',
  },
  {
    id: 'd06',
    category: 'Regulatory',
    country: 'Vietnam',
    date: 'December 2025',
    sortDate: '2025-12-01',
    title: 'IAEA Completes Phase 2 INIR Mission for Vietnam',
    body: 'The IAEA conducted its Phase 2 Integrated Nuclear Infrastructure Review for Vietnam in December 2025, reviewing readiness across 19 infrastructure issues. The mission confirmed strong government commitment while identifying workforce development and regulatory capacity as priority areas.',
    source: 'IAEA',
  },
  {
    id: 'd07',
    category: 'Technical',
    country: 'Vietnam',
    date: 'September 2025',
    sortDate: '2025-09-01',
    title: 'PECC2 and Rosatom Sign Feasibility Study Update Agreement',
    body: 'Vietnamese power engineering company PECC2 signed an agreement with Rosatom to update the feasibility study for Ninh Thuan 1. The updated study will incorporate current site conditions and revised construction timelines targeting first power by 2031–2035.',
    source: 'EVN',
  },
  {
    id: 'd08',
    category: 'Partnership',
    country: 'Vietnam',
    date: 'August 2025',
    sortDate: '2025-08-01',
    title: 'KEPCO and PVN Sign NT2 Workforce Development MOU',
    body: 'Korea Electric Power Corporation and PetroVietnam signed a memorandum of understanding on workforce development collaboration for Ninh Thuan 2. The MOU covers training programs, knowledge transfer, and technical cooperation for Vietnamese nuclear engineers.',
    source: 'PetroVietnam',
  },
  {
    id: 'd09',
    category: 'Policy',
    country: 'Vietnam',
    date: 'May 2025',
    sortDate: '2025-05-01',
    title: 'Prime Minister Issues Project 1012 Workforce Development Decree',
    body: "Vietnam's Prime Minister issued Decision 1012/QD-TTg launching the national nuclear workforce development program targeting 4,000 personnel by 2030. The program designates 11 universities for nuclear training and establishes overseas training pipelines with Russia, Korea, and other partner countries.",
    source: 'Vietnamese Government',
  },
  {
    id: 'd10',
    category: 'Regulatory',
    country: 'Poland',
    date: 'October 2024',
    sortDate: '2024-10-01',
    title: 'PAA Completes Phase 2 INIR Preparatory Review',
    body: "Poland's nuclear regulator PAA completed a preparatory review aligned with IAEA Phase 2 INIR methodology. The review assessed Poland's regulatory readiness for nuclear licensing and identified areas requiring further development before construction begins.",
    source: 'PAA Poland',
  },
]

// ─── Style maps ───────────────────────────────────────────────────────────────

const CAT_BADGE: Record<Category, string> = {
  Policy:      'bg-blue-50 text-blue-700',
  Technical:   'bg-emerald-50 text-emerald-700',
  Partnership: 'bg-purple-50 text-purple-700',
  Regulatory:  'bg-pink-50 text-pink-700',
  Workforce:   'bg-orange-50 text-orange-700',
}

const COUNTRY_TAG: Record<Country, string> = {
  Vietnam: 'bg-red-50 text-red-700',
  Poland:  'bg-indigo-50 text-indigo-700',
  Global:  'bg-violet-50 text-violet-700',
}

// ─── Filter config ─────────────────────────────────────────────────────────────

const CAT_FILTERS:     Array<Category | 'All'>            = ['All', 'Policy', 'Technical', 'Partnership', 'Regulatory', 'Workforce']
const COUNTRY_FILTERS: Array<Country  | 'All Countries'>  = ['All Countries', 'Vietnam', 'Poland', 'Global']

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DevelopmentsPage() {
  const [catFilter,     setCatFilter]     = useState<Category | 'All'>('All')
  const [countryFilter, setCountryFilter] = useState<Country | 'All Countries'>('All Countries')

  const filtered = useMemo(() =>
    DEVELOPMENTS
      .filter((d) => catFilter     === 'All'          || d.category === catFilter)
      .filter((d) => countryFilter === 'All Countries' || d.country  === countryFilter)
      .sort((a, b) => b.sortDate.localeCompare(a.sortDate)),
    [catFilter, countryFilter],
  )

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Developments</h1>
          <p className="text-sm text-navy/50 mt-1">
            Latest updates across all emerging nuclear programs
          </p>
        </div>
        <span className="flex-shrink-0 text-xs font-semibold text-navy/50 bg-white border border-navy/10 rounded-full px-3 py-1.5 mt-1">
          Updated May 2026
        </span>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-xl border border-navy/8 p-4 space-y-3">
        {/* Category row */}
        <div className="flex flex-wrap gap-1.5">
          {CAT_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setCatFilter(f as Category | 'All')}
              className={`text-xs font-semibold rounded-full px-3.5 py-1.5 transition-colors ${
                catFilter === f
                  ? 'bg-navy text-white'
                  : 'bg-surface text-navy/60 hover:text-navy hover:bg-navy/8'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-navy/6" />

        {/* Country row */}
        <div className="flex flex-wrap gap-1.5">
          {COUNTRY_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setCountryFilter(f as Country | 'All Countries')}
              className={`text-xs font-semibold rounded-full px-3.5 py-1.5 transition-colors ${
                countryFilter === f
                  ? 'bg-navy text-white'
                  : 'bg-surface text-navy/60 hover:text-navy hover:bg-navy/8'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── List ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-navy/8 p-10 text-center">
          <p className="text-sm text-navy/40 font-medium">
            No developments match the selected filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((dev) => (
            <DevCard key={dev.id} dev={dev} />
          ))}
        </div>
      )}

      {/* ── Footer note ── */}
      <div className="text-center py-2">
        <p className="text-xs text-navy/40 font-medium">
          Showing {filtered.length} of {DEVELOPMENTS.length} developments
        </p>
        <p className="text-xs text-navy/25 mt-1">New developments added monthly</p>
      </div>
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function DevCard({ dev }: { dev: Development }) {
  return (
    <div className="bg-white rounded-xl border border-navy/8 p-5 sm:p-6">
      {/* Meta row */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${CAT_BADGE[dev.category]}`}>
          {dev.category}
        </span>
        <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${COUNTRY_TAG[dev.country]}`}>
          {dev.country}
        </span>
        <span className="text-xs text-navy/35">{dev.date}</span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-navy leading-snug mb-2">{dev.title}</h3>

      {/* Body */}
      <p className="text-sm text-navy/65 leading-relaxed mb-3">{dev.body}</p>

      {/* Source */}
      <p className="text-xs text-navy/35 font-medium">Source: {dev.source}</p>
    </div>
  )
}
