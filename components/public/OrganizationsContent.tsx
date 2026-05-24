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

// ─── Organization data ────────────────────────────────────────────────────────

const ORGANIZATIONS: OrgData[] = [
  // ── Owners / Operators ──
  {
    name: 'EVN (Vietnam Electricity)',
    flagUrl: 'https://flagcdn.com/w20/vn.png',
    country: 'Vietnam',
    type: 'Owner / Operator',
    role: 'State utility and owner of Ninh Thuan 1. Responsible for project oversight and eventual plant operation.',
    programs: ['Vietnam'],
  },
  {
    name: 'PVN (PetroVietnam)',
    flagUrl: 'https://flagcdn.com/w20/vn.png',
    country: 'Vietnam',
    type: 'Owner / Operator',
    role: 'State energy company and owner of Ninh Thuan 2. Managing KEPCO partnership and workforce development.',
    programs: ['Vietnam'],
  },
  {
    name: 'PEJ (Polskie Elektrownie Jądrowe)',
    flagUrl: 'https://flagcdn.com/w20/pl.png',
    country: 'Poland',
    type: 'Owner / Operator',
    role: "Polish state nuclear company responsible for developing and operating Poland's first nuclear power plants at Lubiatowo-Kopalino.",
    programs: ['Poland'],
  },
  // ── Regulators ──
  {
    name: 'VARANS',
    flagUrl: 'https://flagcdn.com/w20/vn.png',
    country: 'Vietnam',
    type: 'Regulator',
    role: 'Vietnam Agency for Radiation and Nuclear Safety. Responsible for nuclear safety regulation and licensing under MOST.',
    programs: ['Vietnam'],
  },
  {
    name: 'PAA (Polish Nuclear Regulatory Authority)',
    flagUrl: 'https://flagcdn.com/w20/pl.png',
    country: 'Poland',
    type: 'Regulator',
    role: 'Polish nuclear safety regulator responsible for licensing and oversight of nuclear facilities and activities.',
    programs: ['Poland'],
  },
  {
    name: 'CNSC (Canadian Nuclear Safety Commission)',
    flagUrl: 'https://flagcdn.com/w20/ca.png',
    country: 'Canada',
    type: 'Regulator',
    role: "Canada's federal nuclear regulator. Provides regulatory expertise and cooperation to emerging nuclear countries through IAEA technical cooperation programs.",
    programs: ['Global'],
  },
  // ── Technology Suppliers ──
  {
    name: 'Rosatom',
    flagUrl: 'https://flagcdn.com/w20/ru.png',
    country: 'Russia',
    type: 'Technology Supplier',
    role: 'Russian state nuclear corporation and technology supplier for Ninh Thuan 1. Providing VVER-1200 reactor technology under IGA signed March 2026.',
    programs: ['Vietnam'],
  },
  {
    name: 'KEPCO (Korea Electric Power Corporation)',
    flagUrl: 'https://flagcdn.com/w20/kr.png',
    country: 'South Korea',
    type: 'Technology Supplier',
    role: 'South Korean state utility and prospective technology supplier for Ninh Thuan 2. APR-1400 technology. MOU with PVN signed August 2025.',
    programs: ['Vietnam'],
  },
  {
    name: 'Westinghouse Electric Company',
    flagUrl: 'https://flagcdn.com/w20/us.png',
    country: 'USA',
    type: 'Technology Supplier',
    role: "Selected technology supplier for Poland's nuclear program. Providing AP1000 reactor technology for Lubiatowo-Kopalino.",
    programs: ['Poland'],
  },
  // ── International ──
  {
    name: 'IAEA (International Atomic Energy Agency)',
    flagUrl: 'https://flagcdn.com/w20/at.png',
    country: 'International (Vienna)',
    type: 'International',
    role: 'UN nuclear agency providing the Milestones Approach framework, INIR reviews, technical cooperation, and safety standards for all newcomer nuclear countries.',
    programs: ['Global'],
  },
  {
    name: 'AECL (Atomic Energy of Canada Limited)',
    flagUrl: 'https://flagcdn.com/w20/ca.png',
    country: 'Canada',
    type: 'International',
    role: 'Canadian federal Crown corporation. Signed technical cooperation agreement with Vietnam Atomic Energy Commission (VAEA) for nuclear energy information exchange.',
    programs: ['Vietnam'],
  },
  // ── Advisory & Engineering ──
  {
    name: 'AtkinsRéalis',
    flagUrl: 'https://flagcdn.com/w20/ca.png',
    country: 'Canada',
    type: 'Advisory & Engineering',
    role: "Global engineering and project management firm. Active in Vietnam and Poland. Owner's engineer advisory, nuclear new build engineering, and regulatory support.",
    programs: ['Vietnam', 'Poland'],
  },
  {
    name: 'Laurentis Energy Partners',
    flagUrl: 'https://flagcdn.com/w20/ca.png',
    country: 'Canada',
    type: 'Advisory & Engineering',
    role: 'OPG subsidiary providing nuclear services including operator training, project management, and technical advisory. Romania Cernavodă training precedent.',
    programs: ['Global'],
  },
  // ── Government ──
  {
    name: 'MOIT (Ministry of Industry and Trade)',
    flagUrl: 'https://flagcdn.com/w20/vn.png',
    country: 'Vietnam',
    type: 'Government',
    role: "Vietnam's ministry responsible for energy policy and the National Power Development Plan 8 which includes nuclear.",
    programs: ['Vietnam'],
  },
  {
    name: 'MOST (Ministry of Science and Technology)',
    flagUrl: 'https://flagcdn.com/w20/vn.png',
    country: 'Vietnam',
    type: 'Government',
    role: "Oversees Vietnam's nuclear science and technology including VARANS and the Vietnam Atomic Energy Institute (VINATOM).",
    programs: ['Vietnam'],
  },
  {
    name: 'Ministry of Climate and Environment',
    flagUrl: 'https://flagcdn.com/w20/pl.png',
    country: 'Poland',
    type: 'Government',
    role: 'Polish ministry responsible for nuclear energy policy and the national nuclear power program roadmap.',
    programs: ['Poland'],
  },
]

// ─── Main export ─────────────────────────────────────────────────────────────

export default function OrganizationsContent() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('All')

  const filtered =
    activeFilter === 'All'
      ? ORGANIZATIONS
      : ORGANIZATIONS.filter((o) => o.type === activeFilter)

  return (
    <div className="flex-1">
      {/* ── Hero ── */}
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Key Organizations
          </h1>
          <p className="mt-3 text-base text-white/55 max-w-2xl mx-auto text-center leading-relaxed">
            The institutions building and overseeing the world&apos;s emerging nuclear programs
          </p>
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
