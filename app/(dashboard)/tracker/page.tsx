'use client'

import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab             = 'nt1' | 'nt2'
type MilestoneStatus = 'completed' | 'active' | 'upcoming' | 'suspended'
type Category        = 'Policy' | 'Technical' | 'Partnership' | 'Regulatory' | 'Construction' | 'Commissioning'

type Milestone = {
  id:          number
  title:       string
  category:    Category
  status:      MilestoneStatus
  target:      string
  completed?:  string
  description: string
}

type PlantInfo = {
  flag:             string
  name:             string
  owner:            string
  technology:       string
  capacity:         string
  targetCompletion: string
  currentPhase:     string
  progress:         number
  statusVariant:    'active' | 'negotiation'
  milestones:       Milestone[]
}

// ─── Color map ────────────────────────────────────────────────────────────────

const CAT_STYLES: Record<Category, string> = {
  Policy:        'bg-blue-50 text-blue-700',
  Technical:     'bg-emerald-50 text-emerald-700',
  Partnership:   'bg-purple-50 text-purple-700',
  Regulatory:    'bg-pink-50 text-pink-700',
  Construction:  'bg-orange-50 text-orange-700',
  Commissioning: 'bg-red-50 text-red-700',
}

// ─── NT1 milestones ───────────────────────────────────────────────────────────

const NT1_MILESTONES: Milestone[] = [
  {
    id: 1,
    title: 'National Decision to Pursue Nuclear',
    category: 'Policy',
    status: 'completed',
    target: '2009',
    completed: '2009',
    description: "Vietnam's National Assembly approved the national nuclear power program, authorizing development of Ninh Thuan 1 & 2.",
  },
  {
    id: 2,
    title: 'Site Selection — Ninh Thuan Province',
    category: 'Technical',
    status: 'completed',
    target: '2010',
    completed: '2010',
    description: 'Phuoc Dinh site in Ninh Thuan Province selected for Ninh Thuan 1 after extensive geological and environmental surveys.',
  },
  {
    id: 3,
    title: 'Russia Selected as Technology Partner',
    category: 'Partnership',
    status: 'completed',
    target: '2010',
    completed: '2010',
    description: "Vietnam selected Russia's Rosatom as technology partner for NT1, with VVER-1200 reactor technology chosen.",
  },
  {
    id: 4,
    title: 'Program Suspended',
    category: 'Policy',
    status: 'suspended',
    target: '—',
    completed: 'November 2016',
    description: 'National Assembly voted to suspend the nuclear program citing economic constraints and public debt concerns.',
  },
  {
    id: 5,
    title: 'Program Restart Approved',
    category: 'Policy',
    status: 'completed',
    target: '2024',
    completed: 'November 2024',
    description: 'National Assembly passed Resolution 174/2024/QH15 restarting the nuclear program after 8-year suspension.',
  },
  {
    id: 6,
    title: 'New Atomic Energy Law Enacted',
    category: 'Regulatory',
    status: 'completed',
    target: '2025',
    completed: 'June 2025',
    description: 'New Atomic Energy Law passed designating nuclear as strategic priority and establishing updated legal framework.',
  },
  {
    id: 7,
    title: 'IAEA INIR Phase 2 Mission',
    category: 'Regulatory',
    status: 'completed',
    target: 'December 2025',
    completed: 'December 2025',
    description: 'IAEA completed Phase 2 Integrated Nuclear Infrastructure Review, reviewing all 19 infrastructure issues.',
  },
  {
    id: 8,
    title: 'Intergovernmental Agreement Signed',
    category: 'Partnership',
    status: 'completed',
    target: '2026',
    completed: 'March 2026',
    description: 'Vietnam and Russia signed intergovernmental agreement formalizing VVER-1200 technology for NT1 construction.',
  },
  {
    id: 9,
    title: 'Feasibility Study Update',
    category: 'Technical',
    status: 'active',
    target: '2026',
    description: 'PECC2 and Rosatom updating the NT1 feasibility study with current site conditions and revised timelines targeting first power 2031–2035.',
  },
  {
    id: 10,
    title: 'Environmental Impact Assessment',
    category: 'Regulatory',
    status: 'upcoming',
    target: '2026–2027',
    description: 'Comprehensive EIA required before construction license can be issued.',
  },
  {
    id: 11,
    title: 'Construction License Application',
    category: 'Regulatory',
    status: 'upcoming',
    target: '2027',
    description: 'EVN submits construction license application to VARANS for review and approval.',
  },
  {
    id: 12,
    title: 'First Concrete',
    category: 'Construction',
    status: 'upcoming',
    target: '2028',
    description: 'Official start of nuclear island construction — a major program milestone marking transition to Phase 3.',
  },
  {
    id: 13,
    title: 'Major Equipment Delivery',
    category: 'Construction',
    status: 'upcoming',
    target: '2029–2030',
    description: 'Reactor pressure vessel and steam generators delivered to site.',
  },
  {
    id: 14,
    title: 'Cold Commissioning',
    category: 'Commissioning',
    status: 'upcoming',
    target: '2030–2031',
    description: 'System testing without fuel — verifies all systems function as designed.',
  },
  {
    id: 15,
    title: 'First Fuel Load',
    category: 'Commissioning',
    status: 'upcoming',
    target: '2031',
    description: 'Nuclear fuel loaded into reactor for the first time.',
  },
  {
    id: 16,
    title: 'First Criticality',
    category: 'Commissioning',
    status: 'upcoming',
    target: '2031–2032',
    description: 'Reactor achieves first sustained nuclear chain reaction — the defining moment of any nuclear program.',
  },
  {
    id: 17,
    title: 'First Power to Grid',
    category: 'Commissioning',
    status: 'upcoming',
    target: '2031–2035',
    description: "First electricity generated and delivered to Vietnam's national grid.",
  },
]

// ─── NT2 milestones ───────────────────────────────────────────────────────────

const NT2_MILESTONES: Milestone[] = [
  {
    id: 1,
    title: 'National Decision to Pursue Nuclear',
    category: 'Policy',
    status: 'completed',
    target: '2009',
    completed: '2009',
    description: "Vietnam's National Assembly approved the national nuclear power program, authorizing development of both Ninh Thuan 1 & 2.",
  },
  {
    id: 2,
    title: 'Site Selection — Vinh Hai, Ninh Thuan',
    category: 'Technical',
    status: 'completed',
    target: '2010',
    completed: '2010',
    description: 'Vinh Hai site in Ninh Thuan Province selected for Ninh Thuan 2 following geological and environmental feasibility surveys.',
  },
  {
    id: 3,
    title: 'Program Suspended',
    category: 'Policy',
    status: 'suspended',
    target: '—',
    completed: 'November 2016',
    description: 'National Assembly voted to suspend the nuclear program citing economic constraints and public debt concerns.',
  },
  {
    id: 4,
    title: 'Program Restart Approved',
    category: 'Policy',
    status: 'completed',
    target: '2024',
    completed: 'November 2024',
    description: 'National Assembly passed Resolution 174/2024/QH15 restarting the nuclear program after 8-year suspension.',
  },
  {
    id: 5,
    title: 'KEPCO–PVN MOU Signed',
    category: 'Partnership',
    status: 'completed',
    target: 'August 2025',
    completed: 'August 2025',
    description: 'Korea Electric Power Corporation and PetroVietnam signed a Memorandum of Understanding to explore APR-1400 technology for NT2.',
  },
  {
    id: 6,
    title: 'Korea Eximbank Financing Agreement',
    category: 'Partnership',
    status: 'completed',
    target: 'May 2026',
    completed: 'May 2026',
    description: 'Korea Export-Import Bank signed preliminary financing agreement supporting potential APR-1400 deployment at NT2.',
  },
  {
    id: 7,
    title: 'Technology Partner Selection',
    category: 'Partnership',
    status: 'active',
    target: '2026',
    description: 'PVN and government finalizing technology selection — KEPCO APR-1400 is the leading candidate pending intergovernmental agreement.',
  },
  {
    id: 8,
    title: 'Intergovernmental Agreement',
    category: 'Policy',
    status: 'upcoming',
    target: '2026',
    description: 'Vietnam and partner country to sign intergovernmental agreement formalizing technology selection and cooperation framework.',
  },
  {
    id: 9,
    title: 'Feasibility Study',
    category: 'Technical',
    status: 'upcoming',
    target: '2026–2027',
    description: 'Comprehensive feasibility study for NT2 with updated site conditions, technology specifications, and financial modeling.',
  },
  {
    id: 10,
    title: 'Environmental Impact Assessment',
    category: 'Regulatory',
    status: 'upcoming',
    target: '2027–2028',
    description: 'Full EIA required covering Vinh Hai site before any construction license can be submitted.',
  },
  {
    id: 11,
    title: 'Construction License',
    category: 'Regulatory',
    status: 'upcoming',
    target: '2028',
    description: 'PVN submits construction license application to VARANS following completion of EIA and feasibility study.',
  },
  {
    id: 12,
    title: 'First Concrete',
    category: 'Construction',
    status: 'upcoming',
    target: '2029',
    description: 'Official start of NT2 nuclear island construction.',
  },
  {
    id: 13,
    title: 'First Criticality',
    category: 'Commissioning',
    status: 'upcoming',
    target: '2037',
    description: 'NT2 reactor achieves first sustained nuclear chain reaction.',
  },
  {
    id: 14,
    title: 'First Power to Grid',
    category: 'Commissioning',
    status: 'upcoming',
    target: '2036–2040',
    description: "First electricity from NT2 delivered to Vietnam's national grid.",
  },
]

// ─── Plant data ───────────────────────────────────────────────────────────────

const NT1: PlantInfo = {
  flag:             'https://flagcdn.com/w20/vn.png',
  name:             'Ninh Thuan 1',
  owner:            'EVN (Vietnam Electricity)',
  technology:       'VVER-1200 (Rosatom)',
  capacity:         '2 × 1,200 MWe',
  targetCompletion: '2031–2035',
  currentPhase:     'Feasibility study update',
  progress:         22,
  statusVariant:    'active',
  milestones:       NT1_MILESTONES,
}

const NT2: PlantInfo = {
  flag:             'https://flagcdn.com/w20/vn.png',
  name:             'Ninh Thuan 2',
  owner:            'PVN (PetroVietnam)',
  technology:       'TBD — KEPCO APR-1400 likely',
  capacity:         '2 × 1,400 MWe',
  targetCompletion: '2036–2040',
  currentPhase:     'Partner negotiation',
  progress:         12,
  statusVariant:    'negotiation',
  milestones:       NT2_MILESTONES,
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrackerPage() {
  const [tab, setTab] = useState<Tab>('nt1')
  const plant = tab === 'nt1' ? NT1 : NT2

  const completedCount = plant.milestones.filter(m => m.status === 'completed' || m.status === 'suspended').length
  const activeCount    = plant.milestones.filter(m => m.status === 'active').length
  const upcomingCount  = plant.milestones.filter(m => m.status === 'upcoming').length

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-navy">Program Tracker</h1>
          <p className="text-sm text-navy/50 mt-1">
            Milestone tracking for Vietnam&apos;s Ninh Thuan nuclear program
          </p>
        </div>
        <span className="text-xs font-medium text-navy/40 bg-navy/5 rounded-full px-3 py-1.5 mt-1 self-start">
          Updated May 2026
        </span>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 flex-wrap">
        <TabBtn active={tab === 'nt1'} onClick={() => setTab('nt1')}>
          Vietnam — NT1
        </TabBtn>
        <TabBtn active={tab === 'nt2'} onClick={() => setTab('nt2')}>
          Vietnam — NT2
        </TabBtn>
        <TabBtn disabled>
          Poland{' '}
          <span className="font-normal text-xs opacity-60">(coming soon)</span>
        </TabBtn>
      </div>

      {/* ── Plant overview ── */}
      <PlantCard plant={plant} />

      {/* ── Timeline ── */}
      <div className="bg-white rounded-2xl border border-navy/8 p-6">
        <h3 className="text-xs font-semibold text-navy/40 uppercase tracking-widest mb-6">
          Milestones
        </h3>
        {plant.milestones.map((m, i) => (
          <MilestoneRow
            key={m.id}
            milestone={m}
            isLast={i === plant.milestones.length - 1}
          />
        ))}
      </div>

      {/* ── Stats bar ── */}
      <StatsBar
        completed={completedCount}
        active={activeCount}
        upcoming={upcomingCount}
        total={plant.milestones.length}
      />

    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabBtn({
  active,
  onClick,
  disabled,
  children,
}: {
  active?: boolean
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
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

function PlantCard({ plant }: { plant: PlantInfo }) {
  const isActive = plant.statusVariant === 'active'
  const details: Array<{ label: string; value: string }> = [
    { label: 'Owner',             value: plant.owner            },
    { label: 'Technology',        value: plant.technology       },
    { label: 'Capacity',          value: plant.capacity         },
    { label: 'Target Completion', value: plant.targetCompletion },
    { label: 'Current Phase',     value: plant.currentPhase     },
  ]

  return (
    <div className="bg-white rounded-2xl border border-navy/8 p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
        <div className="flex items-center gap-3">
          <img src={plant.flag} alt="flag" className="w-5 h-auto" />
          <h2 className="text-lg font-bold text-navy">{plant.name}</h2>
        </div>
        <span className={`text-xs font-semibold rounded-full px-3 py-1 ${
          isActive
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-amber-50 text-amber-700'
        }`}>
          {isActive ? 'Active' : 'Negotiation'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 mb-5">
        {details.map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs font-medium text-navy/40">{label}</p>
            <p className="text-sm font-semibold text-navy mt-0.5 leading-snug">{value}</p>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-navy/6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-navy/40">Overall Progress</span>
          <span className="text-xs font-bold text-navy">{plant.progress}%</span>
        </div>
        <div className="h-2 bg-navy/8 rounded-full overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isActive ? 'bg-emerald-500' : 'bg-amber-400'
            }`}
            style={{ width: `${plant.progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function MilestoneRow({
  milestone,
  isLast,
}: {
  milestone: Milestone
  isLast: boolean
}) {
  const isSuspended = milestone.status === 'suspended'

  return (
    <div className="flex gap-4">
      {/* Icon + connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <StatusIcon status={milestone.status} />
        {!isLast && <div className="flex-1 w-px bg-navy/10 my-0.5" />}
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 ${isLast ? 'pb-1' : 'pb-7'}`}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h4 className={`text-sm font-semibold leading-snug ${
            isSuspended ? 'text-amber-700' : 'text-navy'
          }`}>
            {milestone.title}
          </h4>
          <span className={`flex-shrink-0 text-xs font-semibold rounded-full px-2.5 py-0.5 ${
            CAT_STYLES[milestone.category]
          }`}>
            {milestone.category}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-1.5 flex-wrap">
          {milestone.target !== '—' && (
            <span className="text-xs text-navy/40">
              Target:{' '}
              <span className="font-medium text-navy/55">{milestone.target}</span>
            </span>
          )}
          {milestone.completed && (
            <span className="text-xs text-navy/40">
              {isSuspended ? 'Occurred:' : 'Completed:'}{' '}
              <span className={`font-medium ${
                isSuspended ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {milestone.completed}
              </span>
            </span>
          )}
        </div>

        <p className="text-xs text-navy/55 mt-2 leading-relaxed">
          {milestone.description}
        </p>
      </div>
    </div>
  )
}

function StatusIcon({ status }: { status: MilestoneStatus }) {
  if (status === 'completed') {
    return (
      <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 14 14" fill="none">
          <path
            d="M2.5 7L5.5 10L11.5 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  }

  if (status === 'suspended') {
    return (
      <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 relative">
        <div className="w-5 h-5 bg-amber-400 rotate-45 absolute" />
        <span className="text-white text-xs font-bold relative z-10 leading-none">!</span>
      </div>
    )
  }

  if (status === 'active') {
    return (
      <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 relative">
        <span className="absolute w-7 h-7 rounded-full bg-blue-400/25 animate-ping" />
        <div className="w-3.5 h-3.5 rounded-full bg-blue-500 relative" />
      </div>
    )
  }

  return (
    <div className="w-7 h-7 rounded-full border-2 border-navy/15 bg-surface flex-shrink-0" />
  )
}

function StatsBar({
  completed,
  active,
  upcoming,
  total,
}: {
  completed: number
  active:    number
  upcoming:  number
  total:     number
}) {
  return (
    <div className="bg-white rounded-xl border border-navy/8 px-5 py-4">
      <div className="flex items-center gap-6 flex-wrap">
        <Chip count={completed} label="Completed" chipCls="bg-emerald-50 text-emerald-700" />
        <Chip count={active}    label="Active"    chipCls="bg-blue-50 text-blue-700"       />
        <Chip count={upcoming}  label="Upcoming"  chipCls="bg-navy/6 text-navy/50"         />
        <span className="ml-auto text-xs text-navy/35 font-medium">
          {total} total milestones
        </span>
      </div>
    </div>
  )
}

function Chip({
  count,
  label,
  chipCls,
}: {
  count:   number
  label:   string
  chipCls: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-bold rounded-full px-2.5 py-0.5 ${chipCls}`}>
        {count}
      </span>
      <span className="text-xs font-medium text-navy/50">{label}</span>
    </div>
  )
}
