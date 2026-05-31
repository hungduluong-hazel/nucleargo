'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

type OrgType =
  | 'Owner / Operator'
  | 'Regulator'
  | 'Technology Supplier'
  | 'International'
  | 'Advisory & Engineering'
  | 'Government'

type FilterValue = OrgType | 'All'

type OrgData = {
  name: string
  flagUrl: string
  country: string
  type: OrgType
  role: string
  programs: string[]
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const TYPE_BADGE: Record<OrgType, string> = {
  'Owner / Operator':       'bg-blue-50 text-blue-700',
  'Regulator':              'bg-amber-50 text-amber-700',
  'Technology Supplier':    'bg-red-50 text-red-700',
  'International':          'bg-purple-50 text-purple-700',
  'Advisory & Engineering': 'bg-emerald-50 text-emerald-700',
  'Government':             'bg-slate-100 text-slate-600',
}

const PROGRAM_TAG: Record<string, string> = {
  Vietnam: 'bg-red-50 text-red-700',
  Poland:  'bg-blue-50 text-blue-700',
  Global:  'bg-purple-50 text-purple-700',
}

// ─── Filter options ───────────────────────────────────────────────────────────

const FILTERS: Array<{ label: string; value: FilterValue }> = [
  { label: 'All',                    value: 'All' },
  { label: 'Owner / Operator',       value: 'Owner / Operator' },
  { label: 'Regulator',              value: 'Regulator' },
  { label: 'Technology Supplier',    value: 'Technology Supplier' },
  { label: 'International',          value: 'International' },
  { label: 'Advisory & Engineering', value: 'Advisory & Engineering' },
  { label: 'Government',             value: 'Government' },
]

// ─── Main export ─────────────────────────────────────────────────────────────

export default function OrganizationsContent({ orgs }: { orgs: OrgData[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('All')

  const filtered =
    activeFilter === 'All'
      ? orgs
      : orgs.filter((o) => o.type === activeFilter)

  return (
    <div className="flex-1">
      {/* ── Hero ── */}
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-16 md:pt-20 md:pb-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Key Organizations
            </h1>
            <p className="text-base text-white/55 max-w-2xl mx-auto leading-relaxed">
              The institutions building and overseeing the world&apos;s emerging nuclear programs
            </p>
          </div>
        </div>
      </div>

      {/* ── Filter + Grid ── */}
      <div className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Filter bar */}
          <div className="flex flex-wrap gap-2 mb-6">
            {FILTERS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={`text-xs font-semibold rounded-full px-4 py-2 transition-colors ${
                  activeFilter === value
                    ? 'bg-navy text-white'
                    : 'bg-white text-navy border border-navy/15 hover:border-navy/30 hover:bg-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Result count */}
          <p className="text-xs font-medium text-navy/40 mb-5">
            {filtered.length} organization{filtered.length !== 1 ? 's' : ''}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((org) => (
              <OrgCard key={org.name} org={org} />
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Working on a nuclear program?
          </h2>
          <p className="text-white/55 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Register free to access full organization profiles, contact intelligence,
            and partnership tracking
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-7 py-3.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
          >
            Register Free →
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function OrgCard({ org }: { org: OrgData }) {
  return (
    <div className="bg-white rounded-2xl border border-navy/8 p-5 flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={org.flagUrl}
            alt={org.country}
            className="w-5 h-auto flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-navy leading-snug">{org.name}</h3>
            <p className="text-xs text-navy/45 mt-0.5">{org.country}</p>
          </div>
        </div>
        <span className={`flex-shrink-0 text-xs font-semibold rounded-full px-2.5 py-0.5 whitespace-nowrap ${TYPE_BADGE[org.type]}`}>
          {org.type}
        </span>
      </div>

      {/* Role */}
      <p className="text-xs text-navy/65 leading-relaxed flex-1">{org.role}</p>

      {/* Program tags */}
      <div className="flex flex-wrap gap-1.5">
        {org.programs.map((p) => (
          <span
            key={p}
            className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${PROGRAM_TAG[p] ?? 'bg-navy/8 text-navy/60'}`}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  )
}
