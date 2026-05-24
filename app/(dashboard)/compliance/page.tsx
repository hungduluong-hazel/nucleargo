'use client'

import { useState, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type IssueStatus    = 'Met' | 'Partial' | 'Not yet'
type IssueCategory  = 'National Position' | 'Legal & Regulatory' | 'Nuclear Safety' | 'Grid & Site' | 'Human Resources' | 'Industry'
type NoteLabel      = 'Evidence' | 'Action required'
type StatusFilter   = 'All' | IssueStatus
type CategoryFilter = 'All' | IssueCategory

type Issue = {
  id:          number
  title:       string
  category:    IssueCategory
  status:      IssueStatus
  analysis:    string
  noteLabel:   NoteLabel
  note:        string
  lastUpdated: string
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const CAT_STYLES: Record<IssueCategory, string> = {
  'National Position':  'bg-blue-50 text-blue-700',
  'Legal & Regulatory': 'bg-purple-50 text-purple-700',
  'Nuclear Safety':     'bg-emerald-50 text-emerald-700',
  'Grid & Site':        'bg-orange-50 text-orange-700',
  'Human Resources':    'bg-pink-50 text-pink-700',
  'Industry':           'bg-indigo-50 text-indigo-700',
}

const STATUS_STYLES: Record<IssueStatus, string> = {
  'Met':     'bg-emerald-50 text-emerald-700',
  'Partial': 'bg-amber-50 text-amber-700',
  'Not yet': 'bg-red-50 text-red-700',
}

const STATUS_ICONS: Record<IssueStatus, string> = {
  'Met':     '✅',
  'Partial': '⚠️',
  'Not yet': '❌',
}

const CATEGORIES: IssueCategory[] = [
  'National Position',
  'Legal & Regulatory',
  'Nuclear Safety',
  'Grid & Site',
  'Human Resources',
  'Industry',
]

// ─── Data ─────────────────────────────────────────────────────────────────────

const ISSUES: Issue[] = [
  {
    id:          1,
    title:       'National Position',
    category:    'National Position',
    status:      'Met',
    analysis:    "Vietnam's National Assembly passed Resolution 174/2024/QH15 restarting the nuclear program, confirming strong government commitment. The new Atomic Energy Law (January 2026) designates nuclear as a national strategic priority.",
    noteLabel:   'Evidence',
    note:        'Resolution 174/2024/QH15, Atomic Energy Law 2025',
    lastUpdated: 'January 2026',
  },
  {
    id:          2,
    title:       'Nuclear Safety',
    category:    'Nuclear Safety',
    status:      'Partial',
    analysis:    'Basic nuclear safety framework exists through VARANS, but regulatory capacity needs significant development. VARANS lacks sufficient technical staff to independently review reactor safety submissions.',
    noteLabel:   'Action required',
    note:        'Strengthen VARANS technical capacity and develop nuclear safety regulations aligned with IAEA SSR-2/1',
    lastUpdated: 'December 2025',
  },
  {
    id:          3,
    title:       'Management',
    category:    'National Position',
    status:      'Partial',
    analysis:    "EVN and PVN have been designated as owners for NT1 and NT2 respectively. Project management frameworks are being established but owner's engineering capacity remains limited.",
    noteLabel:   'Action required',
    note:        "Develop owner's engineering capability within EVN and PVN project teams",
    lastUpdated: 'December 2025',
  },
  {
    id:          4,
    title:       'Funding and Financing',
    category:    'Legal & Regulatory',
    status:      'Partial',
    analysis:    'Government has committed to nuclear investment in PDP8 but detailed financing arrangements for the $22B program remain under development. Korean financing exploration agreements signed May 2026.',
    noteLabel:   'Action required',
    note:        'Finalize financing framework and secure international credit facilities',
    lastUpdated: 'May 2026',
  },
  {
    id:          5,
    title:       'Legislative Framework',
    category:    'Legal & Regulatory',
    status:      'Met',
    analysis:    'New Atomic Energy Law enacted June 2025, effective January 2026. Law establishes comprehensive legal framework for nuclear power development, aligned with IAEA standards.',
    noteLabel:   'Evidence',
    note:        'Atomic Energy Law 2025 (effective January 1, 2026)',
    lastUpdated: 'January 2026',
  },
  {
    id:          6,
    title:       'Safeguards',
    category:    'Legal & Regulatory',
    status:      'Met',
    analysis:    'Vietnam has a Comprehensive Safeguards Agreement and Additional Protocol with the IAEA in force. Safeguards obligations are being maintained.',
    noteLabel:   'Evidence',
    note:        'CSA and Additional Protocol in force',
    lastUpdated: 'December 2025',
  },
  {
    id:          7,
    title:       'Regulatory Framework',
    category:    'Nuclear Safety',
    status:      'Partial',
    analysis:    'VARANS established as nuclear regulator under MOST. However, regulatory independence, technical capacity, and regulatory guides need further development before licensing can proceed.',
    noteLabel:   'Action required',
    note:        'Develop regulatory guides, strengthen independence, increase technical staff',
    lastUpdated: 'December 2025',
  },
  {
    id:          8,
    title:       'Radiation Protection',
    category:    'Nuclear Safety',
    status:      'Partial',
    analysis:    'Basic radiation protection framework exists for research reactor operations. Framework needs expansion to cover large power reactor operations and emergency response.',
    noteLabel:   'Action required',
    note:        'Update radiation protection regulations for power reactor context',
    lastUpdated: 'December 2025',
  },
  {
    id:          9,
    title:       'Environmental Protection',
    category:    'Nuclear Safety',
    status:      'Partial',
    analysis:    'Environmental legislation exists but nuclear-specific environmental assessment requirements need development. EIA framework for NT1 and NT2 sites under preparation.',
    noteLabel:   'Action required',
    note:        'Complete EIA framework and initiate site environmental assessments',
    lastUpdated: 'December 2025',
  },
  {
    id:          10,
    title:       'Nuclear Security',
    category:    'Grid & Site',
    status:      'Partial',
    analysis:    'Vietnam has ratified key nuclear security conventions. Physical protection regulations and nuclear security plan need development for power reactor context.',
    noteLabel:   'Action required',
    note:        'Develop nuclear security regulations and physical protection plan for NT1 and NT2 sites',
    lastUpdated: 'December 2025',
  },
  {
    id:          11,
    title:       'Nuclear Fuel Cycle',
    category:    'Grid & Site',
    status:      'Not yet',
    analysis:    'No fuel cycle facilities exist in Vietnam. Fresh fuel supply will come from Russia under the NT1 agreement. Spent fuel management and back-end arrangements not yet resolved.',
    noteLabel:   'Action required',
    note:        'Establish spent fuel management plan and back-end fuel cycle agreements with Russia',
    lastUpdated: 'December 2025',
  },
  {
    id:          12,
    title:       'Radioactive Waste Management',
    category:    'Grid & Site',
    status:      'Not yet',
    analysis:    'No comprehensive radioactive waste management policy exists for power reactor volumes. Current framework covers only research reactor waste which is insufficient.',
    noteLabel:   'Action required',
    note:        'Develop national radioactive waste management policy and establish interim storage arrangements',
    lastUpdated: 'December 2025',
  },
  {
    id:          13,
    title:       'Emergency Planning',
    category:    'Human Resources',
    status:      'Partial',
    analysis:    'Basic emergency preparedness framework exists but needs significant development for nuclear power plant scale. Off-site emergency planning for Ninh Thuan province required.',
    noteLabel:   'Action required',
    note:        'Develop off-site emergency plan for NT1 site involving provincial authorities and national agencies',
    lastUpdated: 'December 2025',
  },
  {
    id:          14,
    title:       'Nuclear Power Plant Technology',
    category:    'Human Resources',
    status:      'Partial',
    analysis:    'VVER-1200 technology selected for NT1. Technology assessment and design review capacity being developed within EVN and VARANS. Feasibility study update underway.',
    noteLabel:   'Action required',
    note:        'Complete technology assessment and develop internal review capacity',
    lastUpdated: 'December 2025',
  },
  {
    id:          15,
    title:       'Human Resource Development',
    category:    'Human Resources',
    status:      'Partial',
    analysis:    'Project 1012 launched May 2025 targeting 4,000 personnel. 473 trained in Russia to date. 11 universities designated. Pipeline developing but behind target pace.',
    noteLabel:   'Action required',
    note:        'Accelerate training pipeline and establish competency framework',
    lastUpdated: 'May 2026',
  },
  {
    id:          16,
    title:       'Stakeholder Involvement',
    category:    'Industry',
    status:      'Partial',
    analysis:    'Government has conducted some public communication but comprehensive stakeholder engagement program for Ninh Thuan communities not yet established. Public acceptance work needed.',
    noteLabel:   'Action required',
    note:        'Develop comprehensive stakeholder engagement program for affected communities',
    lastUpdated: 'December 2025',
  },
  {
    id:          17,
    title:       'Site and Supporting Facilities',
    category:    'Industry',
    status:      'Partial',
    analysis:    'Phuoc Dinh site selected for NT1 and Vinh Hai for NT2. Site characterization work ongoing. Supporting infrastructure planning in early stages.',
    noteLabel:   'Action required',
    note:        'Complete site characterization, begin infrastructure planning',
    lastUpdated: 'December 2025',
  },
  {
    id:          18,
    title:       'Environmental Protection (Site)',
    category:    'Industry',
    status:      'Partial',
    analysis:    'Site-specific environmental baseline studies needed for both NT1 and NT2 sites. Marine environment assessment required for coastal locations.',
    noteLabel:   'Action required',
    note:        'Complete environmental baseline studies and initiate formal EIA process',
    lastUpdated: 'December 2025',
  },
  {
    id:          19,
    title:       'Industrial Involvement',
    category:    'Industry',
    status:      'Not yet',
    analysis:    'Vietnam has very limited domestic nuclear industrial capability. Local content strategy for NT1 and NT2 construction not yet developed. Most equipment and services will be imported.',
    noteLabel:   'Action required',
    note:        'Develop local content strategy and identify opportunities for Vietnamese industry participation',
    lastUpdated: 'December 2025',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompliancePage() {
  const [statusFilter,   setStatusFilter]   = useState<StatusFilter>('All')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All')

  const filtered = useMemo(
    () =>
      ISSUES.filter((issue) => {
        const matchStatus   = statusFilter === 'All' || issue.status === statusFilter
        const matchCategory = categoryFilter === 'All' || issue.category === categoryFilter
        return matchStatus && matchCategory
      }),
    [statusFilter, categoryFilter],
  )

  const metCount     = ISSUES.filter((i) => i.status === 'Met').length
  const partialCount = ISSUES.filter((i) => i.status === 'Partial').length
  const notYetCount  = ISSUES.filter((i) => i.status === 'Not yet').length

  return (
    <div className="space-y-8">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-navy">IAEA Compliance Monitor</h1>
          <p className="text-sm text-navy/50 mt-1">
            Tracking the 19 infrastructure issues for emerging nuclear programs
          </p>
        </div>
        <span className="text-xs font-medium text-navy/40 bg-navy/5 rounded-full px-3 py-1.5 mt-1 self-start whitespace-nowrap">
          December 2025 — INIR Phase 2 Mission
        </span>
      </div>

      {/* ── Country selector ── */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          className="rounded-lg px-4 py-2 text-sm font-semibold bg-navy text-white shadow-sm flex items-center gap-2"
        >
          <img src="https://flagcdn.com/w20/vn.png" alt="" className="w-4 h-auto" />
          Vietnam
        </button>
        <button
          type="button"
          disabled
          className="rounded-lg px-4 py-2 text-sm font-semibold text-navy/25 bg-navy/5 cursor-not-allowed"
        >
          Poland{' '}
          <span className="font-normal text-xs opacity-60">(coming soon)</span>
        </button>
      </div>

      {/* ── Program status banner ── */}
      <div className="bg-navy rounded-2xl p-6 sm:p-8">
        {/* Country + status */}
        <div className="flex items-center gap-3 mb-6">
          <img src="https://flagcdn.com/w20/vn.png" alt="Vietnam flag" className="w-5 h-auto" />
          <span className="text-base font-bold text-white">Vietnam</span>
          <span className="ml-1 text-xs font-semibold bg-blue-500/25 text-blue-200 rounded-full px-2.5 py-0.5">
            In Progress
          </span>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
          <div>
            <p className="text-xs font-medium text-white/40 mb-0.5">Current Phase</p>
            <p className="text-sm font-semibold text-white leading-snug">
              IAEA Phase 2 — Infrastructure Development
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-white/40 mb-0.5">Last Review</p>
            <p className="text-sm font-semibold text-white leading-snug">
              INIR Phase 2 — December 2025
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-white/40 mb-0.5">Next Milestone</p>
            <p className="text-sm font-semibold text-white leading-snug">
              Contract with vendor signed
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-emerald-400 leading-none tabular-nums">
              {metCount}
            </span>
            <span className="text-xs font-medium text-white/50">Met</span>
          </div>
          <div className="h-5 w-px bg-white/15" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-amber-400 leading-none tabular-nums">
              {partialCount}
            </span>
            <span className="text-xs font-medium text-white/50">Partial</span>
          </div>
          <div className="h-5 w-px bg-white/15" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-red-400 leading-none tabular-nums">
              {notYetCount}
            </span>
            <span className="text-xs font-medium text-white/50">Not yet</span>
          </div>
        </div>

        {/* Tricolor progress bar */}
        <div className="flex h-2 rounded-full overflow-hidden">
          <div className="bg-emerald-500" style={{ width: `${(metCount / 19) * 100}%` }} />
          <div className="bg-amber-400"   style={{ width: `${(partialCount / 19) * 100}%` }} />
          <div className="bg-red-500"     style={{ width: `${(notYetCount / 19) * 100}%` }} />
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Status filters */}
        <div className="flex gap-2 flex-wrap">
          {(['All', 'Met', 'Partial', 'Not yet'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                statusFilter === s
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-white border border-navy/15 text-navy hover:bg-navy/5'
              }`}
            >
              {s === 'All'
                ? 'All Issues'
                : `${s} ${STATUS_ICONS[s]}`}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
          className="sm:ml-auto rounded-lg border border-navy/15 bg-white px-3.5 py-2 text-sm font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-navy/20 cursor-pointer"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* ── Issue count ── */}
      <p className="text-xs font-medium text-navy/40 -mt-2">
        Showing {filtered.length} of {ISSUES.length} issues
      </p>

      {/* ── Issue cards ── */}
      <div className="space-y-4">
        {filtered.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-navy/8 px-6 py-12 text-center">
            <p className="text-sm font-semibold text-navy/40">No issues match your filters</p>
            <button
              type="button"
              onClick={() => { setStatusFilter('All'); setCategoryFilter('All') }}
              className="mt-3 text-xs font-semibold text-accent hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ── Disclaimer ── */}
      <p className="text-xs text-navy/30 leading-relaxed pb-4 border-t border-navy/8 pt-6">
        Analysis based on IAEA INIR Phase 2 mission findings (December 2025) and publicly
        available information. For official IAEA assessments visit iaea.org
      </p>

    </div>
  )
}

// ─── IssueCard ────────────────────────────────────────────────────────────────

function IssueCard({ issue }: { issue: Issue }) {
  const isEvidence = issue.noteLabel === 'Evidence'

  return (
    <div className="bg-white rounded-2xl border border-navy/8 p-5 sm:p-6">
      <div className="flex items-start gap-4 sm:gap-5">

        {/* Large issue number */}
        <div className="flex-shrink-0 w-10 text-right pt-0.5">
          <span className="text-3xl font-black text-accent leading-none tabular-nums">
            {String(issue.id).padStart(2, '0')}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Title + badges */}
          <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
            <h3 className="text-base font-bold text-navy leading-snug">{issue.title}</h3>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${CAT_STYLES[issue.category]}`}>
                {issue.category}
              </span>
              <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${STATUS_STYLES[issue.status]}`}>
                {STATUS_ICONS[issue.status]} {issue.status}
              </span>
            </div>
          </div>

          {/* Analysis */}
          <p className="text-sm text-navy/65 leading-relaxed mb-4">{issue.analysis}</p>

          {/* Evidence / Action required box */}
          <div className={`rounded-lg px-4 py-3 mb-3 border ${
            isEvidence
              ? 'bg-emerald-50/60 border-emerald-100'
              : 'bg-surface border-navy/8'
          }`}>
            <span className={`text-xs font-bold uppercase tracking-wider ${
              isEvidence ? 'text-emerald-600' : 'text-navy/40'
            }`}>
              {issue.noteLabel}
            </span>
            <p className="text-sm text-navy/70 mt-1 leading-relaxed">{issue.note}</p>
          </div>

          {/* Last updated */}
          <p className="text-xs text-navy/35">
            Last updated: <span className="font-semibold">{issue.lastUpdated}</span>
          </p>
        </div>

      </div>
    </div>
  )
}
