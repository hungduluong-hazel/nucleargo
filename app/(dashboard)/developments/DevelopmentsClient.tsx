'use client'

import { useState, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = 'Policy' | 'Technical' | 'Partnership' | 'Regulatory' | 'Workforce'
type Country  = 'Vietnam' | 'Poland' | 'Global'

export type Development = {
  id:       string
  category: Category
  country:  Country
  date:     string
  sortDate: string
  title:    string
  body:     string
  source:   string
}

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

export default function DevelopmentsClient({ developments }: { developments: Development[] }) {
  const [catFilter,     setCatFilter]     = useState<Category | 'All'>('All')
  const [countryFilter, setCountryFilter] = useState<Country | 'All Countries'>('All Countries')

  const filtered = useMemo(() =>
    developments
      .filter((d) => catFilter     === 'All'          || d.category === catFilter)
      .filter((d) => countryFilter === 'All Countries' || d.country  === countryFilter)
      .sort((a, b) => b.sortDate.localeCompare(a.sortDate)),
    [developments, catFilter, countryFilter],
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
          Showing {filtered.length} of {developments.length} developments
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
      {dev.source && (
        <p className="text-xs text-navy/35 font-medium">Source: {dev.source}</p>
      )}
    </div>
  )
}
