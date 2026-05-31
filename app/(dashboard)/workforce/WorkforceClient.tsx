'use client'

import { useState, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type OpportunityType   = 'Job' | 'Fellowship' | 'Training Program'
type FilterTab         = 'All' | 'Jobs' | 'Fellowships' | 'Training Programs'
type PipelineVariant   = 'active' | 'limited'
type InstitutionType   =
  | 'University'
  | 'Research Institute'
  | 'College'
  | 'Training Center'
  | 'Military University'

type Track = {
  number:       string
  title:        string
  focus:        string
  training:     string
  institutions: string
}

type PipelineEntry = {
  flag:          string
  country:       string
  program:       string
  details:       string[]
  status:        string
  statusVariant: PipelineVariant
}

export type Institution = {
  number:   number
  name:     string
  city:     string
  type:     InstitutionType
  programs: string[]
  quota?:   string
  notable?: string
}

export type Opportunity = {
  id:          string
  type:        OpportunityType
  title:       string
  org:         string
  location:    string
  deadline:    string
  description: string
  linkLabel:   string
  linkHref:    string
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const OPP_BADGE: Record<OpportunityType, string> = {
  Fellowship:          'bg-purple-50 text-purple-700',
  'Training Program':  'bg-emerald-50 text-emerald-700',
  Job:                 'bg-blue-50 text-blue-700',
}

const INST_BADGE: Record<InstitutionType, string> = {
  'University':          'bg-blue-50 text-blue-700',
  'Research Institute':  'bg-emerald-50 text-emerald-700',
  'College':             'bg-amber-50 text-amber-700',
  'Training Center':     'bg-orange-50 text-orange-700',
  'Military University': 'bg-slate-100 text-slate-600',
}

const FILTER_TYPE_MAP: Partial<Record<FilterTab, OpportunityType>> = {
  Jobs:               'Job',
  Fellowships:        'Fellowship',
  'Training Programs':'Training Program',
}

// ─── Static data (unchanged) ──────────────────────────────────────────────────

const STAT_ITEMS = [
  { value: '4,000', label: 'Total personnel target by 2030' },
  { value: '670',   label: 'Overseas training target'       },
  { value: '473',   label: 'Trained in Russia (2014–2025)'  },
  { value: '11',    label: 'Designated universities'        },
]

const TRACKS: Track[] = [
  {
    number:       '1',
    title:        'Management & Policy',
    focus:        'Project management, regulatory, policy, legal framework',
    training:     'Domestic + international programs',
    institutions: 'MOIT, MOST, government',
  },
  {
    number:       '2',
    title:        'Nuclear Engineering & Technology',
    focus:        'Nuclear engineering, reactor physics, I&C systems, safety analysis',
    training:     'Russia (primary), Korea, France, USA',
    institutions: 'Rosatom training centers, KEPCO, KAERI',
  },
  {
    number:       '3',
    title:        'Operations & Maintenance',
    focus:        'Plant operations, maintenance, radiation protection',
    training:     'Russian language training (3–12 months) + Russia OJT',
    institutions: 'Novovoronezh NPP, Leningrad NPP',
  },
]

const PIPELINE: PipelineEntry[] = [
  {
    flag:    'https://flagcdn.com/w20/ru.png',
    country: 'Russia',
    program: 'VVER-1200 operator and engineering training',
    details: [
      'Duration: 4–6 years (undergraduate)',
      'Sent since 2014: 473 total (436 undergraduate, 28 masters, 9 PhD)',
      'Currently active: Ongoing',
      'Language requirement: Russian (3–12 months prep)',
    ],
    status:        'Active — primary pipeline',
    statusVariant: 'active',
  },
  {
    flag:    'https://flagcdn.com/w20/kr.png',
    country: 'South Korea',
    program: 'Nuclear engineering and project management',
    details: [
      'Partner: KEPCO, KAERI',
      'Focus: NT2 workforce development',
      'Agreement: KEPCO-PVN MOU August 2025',
    ],
    status:        'Active — expanding',
    statusVariant: 'active',
  },
  {
    flag:    'https://flagcdn.com/w20/fr.png',
    country: 'France',
    program: 'Nuclear engineering, safety and regulatory',
    details: [
      'Partner: EDF, CEA',
    ],
    status:        'Active — limited numbers',
    statusVariant: 'active',
  },
  {
    flag:    'https://flagcdn.com/w20/ca.png',
    country: 'Canada',
    program: 'Nuclear safety, regulatory, project management',
    details: [
      'Partner: AECL, Canadian universities',
      'Agreement: VAEA-AECL cooperation',
    ],
    status:        'Active — technical cooperation',
    statusVariant: 'active',
  },
  {
    flag:    'https://flagcdn.com/w20/jp.png',
    country: 'Japan',
    program: 'Nuclear safety and regulation',
    details: [
      'Partner: JAEA, NRA Japan',
    ],
    status:        'Limited — Japan withdrew from NT2 citing timeline concerns',
    statusVariant: 'limited',
  },
]

// ─── Fallback data (used when Supabase returns nothing) ───────────────────────

const FALLBACK_INSTITUTIONS: Institution[] = [
  {
    number:   1,
    name:     'Hanoi University of Science and Technology',
    city:     'Hanoi',
    type:     'University',
    programs: ['Nuclear engineering', 'Reactor physics', 'Radiation protection'],
    quota:    '~50 students/year',
    notable:  'Primary nuclear engineering program',
  },
  {
    number:   2,
    name:     'VNU University of Science',
    city:     'Hanoi',
    type:     'University',
    programs: ['Nuclear physics', 'Radiation safety'],
    quota:    '~30 students/year',
  },
  {
    number:   3,
    name:     'Ho Chi Minh City University of Technology',
    city:     'Ho Chi Minh City',
    type:     'University',
    programs: ['Nuclear engineering'],
    quota:    '~60 students/year',
    notable:  'Expanding with new Khanh Hoa facility near Ninh Thuan site',
  },
  {
    number:   4,
    name:     'University of Electricity',
    city:     'Hanoi',
    type:     'University',
    programs: ['Electrical engineering for nuclear applications'],
    quota:    '~40 students/year',
  },
  {
    number:   5,
    name:     'Da Lat University',
    city:     'Da Lat',
    type:     'University',
    programs: ['Nuclear physics', 'Radiation applications'],
    notable:  'Located near Da Lat research reactor',
  },
  {
    number:   6,
    name:     'Vietnam Atomic Energy Institute (VINATOM)',
    city:     'Hanoi',
    type:     'Research Institute',
    programs: ['Nuclear research', 'Reactor operation training'],
    notable:  'Operates Da Lat research reactor — primary hands-on facility',
  },
  {
    number:   7,
    name:     'Hanoi University of Civil Engineering',
    city:     'Hanoi',
    type:     'University',
    programs: ['Civil and structural engineering for nuclear facilities'],
  },
  {
    number:   8,
    name:     'Ho Chi Minh City College of Electricity',
    city:     'Ho Chi Minh City',
    type:     'College',
    programs: ['Electrical technician training for power plants'],
  },
  {
    number:   9,
    name:     'Vietnam Petroleum College',
    city:     'Ba Ria-Vung Tau',
    type:     'College',
    programs: ['Technical operations', 'Mechanical maintenance'],
  },
  {
    number:   10,
    name:     'Nuclear Training Center (planned)',
    city:     'Ninh Thuan Province',
    type:     'Training Center',
    programs: ['Site-specific operator training'],
    notable:  'Planned — under development',
  },
  {
    number:   11,
    name:     'Military Technical Academy',
    city:     'Hanoi',
    type:     'Military University',
    programs: ['Nuclear security', 'Radiation protection'],
  },
]

const FALLBACK_OPPORTUNITIES: Opportunity[] = [
  {
    id:          'op1',
    type:        'Fellowship',
    title:       'IAEA Nuclear Energy Management School (NEMS)',
    org:         'IAEA',
    location:    'Multiple locations',
    deadline:    'Rolling applications',
    description: 'Two-week intensive program for future nuclear energy leaders. Covers all aspects of nuclear program management for newcomer countries.',
    linkLabel:   'Apply at iaea.org',
    linkHref:    'https://www.iaea.org',
  },
  {
    id:          'op2',
    type:        'Training Program',
    title:       'World Nuclear University Online',
    org:         'World Nuclear University',
    location:    'Online',
    deadline:    'Rolling',
    description: 'Online courses covering nuclear fundamentals, policy, and program management for professionals transitioning into the nuclear sector.',
    linkLabel:   'world-nuclear-university.org',
    linkHref:    'https://www.world-nuclear-university.org',
  },
  {
    id:          'op3',
    type:        'Training Program',
    title:       'Canadian Nuclear Safety Commission Regulatory Training',
    org:         'CNSC',
    location:    'Ottawa, Canada',
    deadline:    'Varies',
    description: 'Regulatory framework training for nuclear safety professionals. Highly relevant for VARANS staff development.',
    linkLabel:   'nuclearsafety.gc.ca',
    linkHref:    'https://www.nuclearsafety.gc.ca',
  },
  {
    id:          'op4',
    type:        'Fellowship',
    title:       'IAEA Technical Cooperation Fellowship — Vietnam',
    org:         'IAEA',
    location:    'Various',
    deadline:    'Annual cycle',
    description: 'IAEA provides fellowships to Vietnamese nuclear professionals for training at member state facilities. Contact VARANS for current cycle details.',
    linkLabel:   'iaea.org/tc',
    linkHref:    'https://www.iaea.org/services/technical-cooperation-programme',
  },
  {
    id:          'op5',
    type:        'Job',
    title:       'Nuclear Program Advisor — Vietnam',
    org:         'International Consulting Firms',
    location:    'Hanoi / Remote',
    deadline:    'Ongoing',
    description: "Multiple international firms are recruiting nuclear advisors for Vietnam engagement. Experience with IAEA Milestones Approach and owner's engineer functions preferred.",
    linkLabel:   'Search LinkedIn',
    linkHref:    'https://www.linkedin.com/jobs',
  },
]

const FILTER_TABS: FilterTab[] = ['All', 'Jobs', 'Fellowships', 'Training Programs']

const PROGRESS = +(473 / 4000 * 100).toFixed(1)  // 11.8

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkforceClient({
  institutions: propInstitutions,
  opportunities: propOpportunities,
}: {
  institutions:  Institution[]
  opportunities: Opportunity[]
}) {
  const institutions  = propInstitutions.length  > 0 ? propInstitutions  : FALLBACK_INSTITUTIONS
  const opportunities = propOpportunities.length > 0 ? propOpportunities : FALLBACK_OPPORTUNITIES

  const [filter, setFilter] = useState<FilterTab>('All')

  const filtered = useMemo(() => {
    if (filter === 'All') return opportunities
    const type = FILTER_TYPE_MAP[filter]
    return type ? opportunities.filter(o => o.type === type) : opportunities
  }, [filter, opportunities])

  return (
    <div className="space-y-8">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-navy">Workforce Intelligence</h1>
          <p className="text-sm text-navy/50 mt-1">
            Nuclear human resource development tracking for emerging programs
          </p>
        </div>
        <span className="text-xs font-medium text-navy/40 bg-navy/5 rounded-full px-3 py-1.5 mt-1 self-start">
          Updated May 2026
        </span>
      </div>

      {/* ── Country tabs ── */}
      <div className="flex gap-2 flex-wrap">
        <TabBtn active>Vietnam</TabBtn>
        <TabBtn disabled>
          Poland{' '}
          <span className="font-normal text-xs opacity-60">(coming soon)</span>
        </TabBtn>
      </div>

      {/* ── Project 1012 Card ── */}
      <div className="bg-white rounded-2xl border border-navy/8 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <h2 className="text-lg font-bold text-navy leading-snug">
              Project 1012 — Vietnam National Nuclear Workforce Program
            </h2>
            <p className="text-xs text-navy/45 mt-1">
              Prime Minister Decision 1012/QD-TTg · May 2025
            </p>
          </div>
          <span className="flex-shrink-0 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
            MOIT
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {STAT_ITEMS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-accent leading-tight">{value}</p>
              <p className="text-xs text-navy/45 mt-1.5 leading-snug">{label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-6 bg-surface rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-navy/55">Overall Pipeline Progress</span>
            <span className="text-xs font-bold text-navy">
              473 / 4,000 &nbsp;({PROGRESS}%)
            </span>
          </div>
          <div className="h-2.5 bg-navy/8 rounded-full overflow-hidden">
            <div
              className="h-2.5 rounded-full bg-accent transition-all"
              style={{ width: `${PROGRESS}%` }}
            />
          </div>
        </div>

        {/* Training tracks */}
        <div>
          <p className="text-xs font-semibold text-navy/40 uppercase tracking-widest mb-4">
            Training Tracks
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TRACKS.map((t) => (
              <TrackCard key={t.number} track={t} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Overseas Pipeline ── */}
      <div>
        <h2 className="text-lg font-bold text-navy mb-5">Overseas Training Pipeline</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PIPELINE.map((entry) => (
            <PipelineCard key={entry.country} entry={entry} />
          ))}
        </div>
      </div>

      {/* ── Training Institutions ── */}
      <div>
        <h2 className="text-lg font-bold text-navy mb-1">Designated Training Institutions</h2>
        <p className="text-sm text-navy/45 mb-5">
          11 Vietnamese universities and institutes authorized for nuclear training
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {institutions.map((inst) => (
            <InstitutionCard key={inst.number} inst={inst} />
          ))}
        </div>
      </div>

      {/* ── Opportunity Board ── */}
      <div>
        <h2 className="text-lg font-bold text-navy mb-1">Nuclear Career Opportunities</h2>
        <p className="text-sm text-navy/45 mb-5">
          Jobs, fellowships, and training programs for nuclear professionals
        </p>

        <div className="flex gap-2 flex-wrap mb-5">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                filter === tab
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-white border border-navy/15 text-navy hover:bg-navy/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} />
          ))}
        </div>
      </div>

      {/* ── Footer note ── */}
      <p className="text-xs text-navy/35 border-t border-navy/6 pt-6 leading-relaxed">
        Workforce data based on publicly available information including Project 1012
        (Decision 1012/QD-TTg) and IAEA technical cooperation reports.
        Last updated May 2026.
      </p>

    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabBtn({
  active,
  disabled,
  children,
  onClick,
}: {
  active?:   boolean
  disabled?: boolean
  children:  React.ReactNode
  onClick?:  () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
        disabled
          ? 'text-navy/25 bg-navy/5 cursor-not-allowed'
          : active
            ? 'bg-navy text-white shadow-sm'
            : 'bg-white border border-navy/15 text-navy hover:bg-navy/5'
      }`}
    >
      {children}
    </button>
  )
}

function TrackCard({ track }: { track: Track }) {
  return (
    <div className="bg-surface rounded-xl border border-navy/8 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <span className="w-6 h-6 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {track.number}
        </span>
        <h3 className="text-sm font-bold text-navy leading-snug">{track.title}</h3>
      </div>
      <div className="space-y-2">
        <TrackRow label="Focus"        value={track.focus}        />
        <TrackRow label="Training"     value={track.training}     />
        <TrackRow label="Institutions" value={track.institutions} />
      </div>
    </div>
  )
}

function TrackRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-xs font-medium text-navy/40 w-20 flex-shrink-0">{label}</span>
      <span className="text-xs text-navy/65 leading-snug">{value}</span>
    </div>
  )
}

function PipelineCard({ entry }: { entry: PipelineEntry }) {
  const isActive = entry.statusVariant === 'active'
  return (
    <div className="bg-white rounded-xl border border-navy/8 p-5 flex flex-col gap-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <img src={entry.flag} alt={entry.country} className="w-5 h-auto flex-shrink-0" />
          <span className="text-sm font-bold text-navy">{entry.country}</span>
        </div>
        <span className={`flex-shrink-0 text-xs font-semibold rounded-full px-2.5 py-0.5 ${
          isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
        }`}>
          {isActive ? 'Active' : 'Limited'}
        </span>
      </div>

      <p className="text-xs font-semibold text-navy/70 leading-snug">{entry.program}</p>

      <ul className="space-y-1.5">
        {entry.details.map((d) => (
          <li key={d} className="flex items-start gap-2 text-xs text-navy/55">
            <span className="text-navy/25 flex-shrink-0 mt-0.5 leading-none">·</span>
            <span>{d}</span>
          </li>
        ))}
      </ul>

      <p className={`text-xs font-medium pt-2.5 border-t border-navy/6 ${
        isActive ? 'text-emerald-700' : 'text-amber-700'
      }`}>
        {entry.status}
      </p>
    </div>
  )
}

function InstitutionCard({ inst }: { inst: Institution }) {
  return (
    <div className="bg-white rounded-xl border border-navy/8 p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <span className="text-xs font-bold text-navy/30 w-5 flex-shrink-0 mt-0.5 text-right leading-tight">
          {inst.number}.
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-navy leading-snug">{inst.name}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs text-navy/45">{inst.city}</span>
            <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${INST_BADGE[inst.type]}`}>
              {inst.type}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {inst.programs.map((p) => (
          <span key={p} className="text-xs bg-navy/5 text-navy/60 rounded-full px-2.5 py-0.5">
            {p}
          </span>
        ))}
      </div>

      {(inst.quota || inst.notable) && (
        <div className="space-y-1 pt-2.5 border-t border-navy/6">
          {inst.quota && (
            <p className="text-xs text-navy/45">
              <span className="font-medium">Quota:</span> {inst.quota}
            </p>
          )}
          {inst.notable && (
            <p className="text-xs text-navy/45 italic">{inst.notable}</p>
          )}
        </div>
      )}
    </div>
  )
}

function OpportunityCard({ opp }: { opp: Opportunity }) {
  return (
    <div className="bg-white rounded-xl border border-navy/8 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${OPP_BADGE[opp.type]}`}>
          {opp.type}
        </span>
        <span className="text-xs text-navy/40">{opp.deadline}</span>
      </div>

      <div>
        <h3 className="text-sm font-bold text-navy leading-snug">{opp.title}</h3>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs text-navy/50">{opp.org}</span>
          {opp.location && (
            <>
              <span className="text-navy/25 text-xs">·</span>
              <span className="text-xs text-navy/50">{opp.location}</span>
            </>
          )}
        </div>
      </div>

      <p className="text-xs text-navy/60 leading-relaxed flex-1">{opp.description}</p>

      {opp.linkHref && (
        <a
          href={opp.linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
        >
          {opp.linkLabel} →
        </a>
      )}
    </div>
  )
}
