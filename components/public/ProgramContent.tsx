import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

type IssueStatus = 'met' | 'partial' | 'not_yet'

type Issue = {
  number: number
  title: string
  vnStatus: IssueStatus
}

type IssueGroup = {
  category: string
  issues: Issue[]
}

type PhaseData = {
  phase: string
  isActive: boolean
  title: string
  description: string
  milestone: string
}

// ─── Static data ─────────────────────────────────────────────────────────────

const PHASES: PhaseData[] = [
  {
    phase: 'Phase 1',
    isActive: false,
    title: 'Ready to Make a Knowledgeable Commitment',
    description:
      'National position established, basic infrastructure study complete, government commitment made',
    milestone: 'National decision to proceed',
  },
  {
    phase: 'Phase 2',
    isActive: true,
    title: 'Ready to Invite Bids or Negotiate',
    description:
      'Nuclear law enacted, regulator established, site selected, workforce development begun, safety infrastructure in place',
    milestone: 'Contract with vendor signed',
  },
  {
    phase: 'Phase 3',
    isActive: false,
    title: 'Ready to Commission',
    description:
      'Construction complete, operating organization ready, fuel management plan in place, emergency preparedness established',
    milestone: 'First criticality achieved',
  },
]

const ISSUE_GROUPS: IssueGroup[] = [
  {
    category: 'National Position',
    issues: [
      { number: 1,  title: 'National Position', vnStatus: 'met'     },
      { number: 2,  title: 'Nuclear Safety',    vnStatus: 'partial' },
      { number: 3,  title: 'Management',        vnStatus: 'partial' },
    ],
  },
  {
    category: 'Legal & Regulatory',
    issues: [
      { number: 4, title: 'Funding and Financing',  vnStatus: 'partial' },
      { number: 5, title: 'Legislative Framework',  vnStatus: 'met'     },
      { number: 6, title: 'Safeguards',             vnStatus: 'met'     },
    ],
  },
  {
    category: 'Nuclear Safety',
    issues: [
      { number: 7, title: 'Regulatory Framework',    vnStatus: 'partial' },
      { number: 8, title: 'Radiation Protection',    vnStatus: 'partial' },
      { number: 9, title: 'Environmental Protection',vnStatus: 'partial' },
    ],
  },
  {
    category: 'Grid & Site',
    issues: [
      { number: 10, title: 'Nuclear Security',              vnStatus: 'partial'  },
      { number: 11, title: 'Nuclear Fuel Cycle',            vnStatus: 'not_yet'  },
      { number: 12, title: 'Radioactive Waste Management',  vnStatus: 'not_yet'  },
    ],
  },
  {
    category: 'Human Resources',
    issues: [
      { number: 13, title: 'Emergency Planning',             vnStatus: 'partial' },
      { number: 14, title: 'Nuclear Power Plant Technology', vnStatus: 'partial' },
      { number: 15, title: 'Human Resource Development',     vnStatus: 'partial' },
    ],
  },
  {
    category: 'Industry',
    issues: [
      { number: 16, title: 'Stakeholder Involvement',         vnStatus: 'partial'  },
      { number: 17, title: 'Site and Supporting Facilities',  vnStatus: 'partial'  },
      { number: 18, title: 'Environmental Protection (Site)', vnStatus: 'partial'  },
      { number: 19, title: 'Industrial Involvement',          vnStatus: 'not_yet'  },
    ],
  },
]

// ─── Derived counts ───────────────────────────────────────────────────────────

const ALL_ISSUES = ISSUE_GROUPS.flatMap((g) => g.issues)
const TOTAL = ALL_ISSUES.length
const MET_COUNT     = ALL_ISSUES.filter((i) => i.vnStatus === 'met').length
const PARTIAL_COUNT = ALL_ISSUES.filter((i) => i.vnStatus === 'partial').length
const NOT_YET_COUNT = ALL_ISSUES.filter((i) => i.vnStatus === 'not_yet').length

const MET_PCT     = (MET_COUNT / TOTAL) * 100
const PARTIAL_PCT = (PARTIAL_COUNT / TOTAL) * 100
const NOT_YET_PCT = (NOT_YET_COUNT / TOTAL) * 100

// ─── Style maps ───────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<IssueStatus, { label: string; badge: string }> = {
  met:     { label: 'Met ✅',     badge: 'bg-emerald-50 text-emerald-700' },
  partial: { label: 'Partial ⚠️', badge: 'bg-amber-50 text-amber-700'    },
  not_yet: { label: 'Not yet ❌', badge: 'bg-red-50 text-red-700'         },
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function ProgramContent() {
  return (
    <div className="flex-1">
      {/* ── Hero ── */}
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-16 md:pt-20 md:pb-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              IAEA Nuclear Milestones Program
            </h1>
            <p className="text-base text-white/55 max-w-xl mx-auto leading-relaxed mb-10">
              The international framework guiding every newcomer nuclear country from policy
              decision to first power
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {[
                { icon: '📊', label: '3 Development Phases' },
                { icon: '📋', label: '19 Infrastructure Issues' },
                { icon: '🌍', label: '25+ Countries Tracked' },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-4 py-1.5"
                >
                  <span className="text-sm">{icon}</span>
                  <span className="text-xs font-semibold text-white">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          <MilestonesSection />
          <InfrastructureSection />
          <VietnamProgressSection />
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Track compliance in detail</h2>
          <p className="text-white/55 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Register free to access full IAEA compliance analysis and gap assessment for each
            infrastructure issue
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

// ─── Sections ─────────────────────────────────────────────────────────────────

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-navy leading-tight">{title}</h2>
      {subtitle && (
        <p className="text-sm text-navy/55 mt-2 max-w-2xl leading-relaxed">{subtitle}</p>
      )}
    </div>
  )
}

function MilestonesSection() {
  return (
    <section>
      <SectionHeading title="What is the Milestones Approach?" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left — explanation */}
        <div>
          <p className="text-navy/70 leading-relaxed text-sm mb-6">
            The IAEA Milestones Approach is the international standard framework for countries
            developing their first nuclear power program. Published in SSG-16, it divides nuclear
            development into three phases, each ending with a milestone that must be achieved
            before proceeding.
          </p>
          <div className="bg-white rounded-2xl border border-navy/8 p-6 space-y-3.5">
            {[
              { label: 'Published standard', value: 'IAEA SSG-16 (Rev. 1)' },
              { label: 'Review mechanism',   value: 'INIR — Integrated Nuclear Infrastructure Review' },
              { label: 'Countries in Phase 2', value: 'Vietnam, Poland, and others' },
              { label: 'Total phases',       value: '3 phases, each with a defined milestone' },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-3">
                <span className="text-xs font-medium text-navy/40 w-36 flex-shrink-0 pt-px">{label}</span>
                <span className="text-sm font-medium text-navy leading-snug">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — phase cards stacked */}
        <div className="space-y-3">
          {PHASES.map((p) => (
            <PhaseCard key={p.phase} phase={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PhaseCard({ phase }: { phase: PhaseData }) {
  return (
    <div
      className={`rounded-2xl p-5 flex flex-col gap-3 ${
        phase.isActive
          ? 'border-2 border-blue-500 bg-blue-50/40'
          : 'border border-navy/8 bg-white'
      }`}
    >
      {/* Phase badge row */}
      <div className="flex items-center gap-2.5">
        <span
          className={`text-xs font-bold rounded-full px-3 py-1 ${
            phase.isActive ? 'bg-blue-600 text-white' : 'bg-navy/8 text-navy/55'
          }`}
        >
          {phase.phase}
        </span>
        {phase.isActive && (
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            Active — Vietnam &amp; Poland
          </span>
        )}
      </div>

      <h3 className={`text-sm font-bold leading-snug ${phase.isActive ? 'text-blue-900' : 'text-navy'}`}>
        {phase.title}
      </h3>

      <p className={`text-xs leading-relaxed ${phase.isActive ? 'text-blue-800/70' : 'text-navy/55'}`}>
        {phase.description}
      </p>

      <div className={`flex items-center gap-2 pt-1 border-t ${phase.isActive ? 'border-blue-200' : 'border-navy/6'}`}>
        <span className={`text-xs font-medium ${phase.isActive ? 'text-blue-500' : 'text-navy/35'}`}>
          Milestone:
        </span>
        <span className={`text-xs font-semibold ${phase.isActive ? 'text-blue-700' : 'text-navy/60'}`}>
          {phase.milestone}
        </span>
      </div>
    </div>
  )
}

function InfrastructureSection() {
  return (
    <section>
      <SectionHeading
        title="19 Infrastructure Issues"
        subtitle="Every newcomer country must address these issues before proceeding to the next phase. Vietnam status shown for each issue."
      />
      <div className="space-y-8">
        {ISSUE_GROUPS.map((group) => (
          <div key={group.category}>
            <h3 className="text-xs font-semibold text-navy/40 uppercase tracking-widest mb-3">
              {group.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.issues.map((issue) => (
                <IssueCard key={issue.number} issue={issue} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function IssueCard({ issue }: { issue: Issue }) {
  const status = STATUS_STYLE[issue.vnStatus]
  return (
    <div className="bg-white rounded-xl border border-navy/8 p-4 flex flex-col gap-2.5">
      <span className="text-2xl font-bold text-accent/60 leading-none tabular-nums">
        {String(issue.number).padStart(2, '0')}
      </span>
      <h4 className="text-sm font-semibold text-navy leading-snug flex-1">{issue.title}</h4>
      <div>
        <span className={`inline-block text-xs font-medium rounded-full px-2.5 py-0.5 ${status.badge}`}>
          {status.label}
        </span>
      </div>
    </div>
  )
}

function VietnamProgressSection() {
  return (
    <section>
      <SectionHeading title="Vietnam — Phase 2 Progress" />

      {/* Three stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-navy/8 p-5 text-center">
          <p className="text-3xl font-bold text-emerald-600 leading-tight">{MET_COUNT}</p>
          <p className="text-xs text-navy/45 mt-1.5 font-medium">Issues met</p>
        </div>
        <div className="bg-white rounded-2xl border border-navy/8 p-5 text-center">
          <p className="text-3xl font-bold text-amber-500 leading-tight">{PARTIAL_COUNT}</p>
          <p className="text-xs text-navy/45 mt-1.5 font-medium">In progress</p>
        </div>
        <div className="bg-white rounded-2xl border border-navy/8 p-5 text-center">
          <p className="text-3xl font-bold text-red-500 leading-tight">{NOT_YET_COUNT}</p>
          <p className="text-xs text-navy/45 mt-1.5 font-medium">Not yet started</p>
        </div>
      </div>

      {/* Segmented progress bar */}
      <div className="bg-white rounded-2xl border border-navy/8 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-navy/40">Overall Phase 2 Completion</span>
          <span className="text-xs font-bold text-navy">{TOTAL} issues</span>
        </div>
        <div className="w-full rounded-full h-3 flex overflow-hidden gap-px bg-navy/5">
          <div
            className="bg-emerald-500 h-full rounded-l-full transition-all"
            style={{ width: `${MET_PCT}%` }}
          />
          <div
            className="bg-amber-400 h-full transition-all"
            style={{ width: `${PARTIAL_PCT}%` }}
          />
          <div
            className="bg-red-400 h-full rounded-r-full transition-all"
            style={{ width: `${NOT_YET_PCT}%` }}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 mt-4">
          {[
            { color: 'bg-emerald-500', label: `Met — ${MET_COUNT} issues`             },
            { color: 'bg-amber-400',   label: `Partial — ${PARTIAL_COUNT} issues`     },
            { color: 'bg-red-400',     label: `Not yet — ${NOT_YET_COUNT} issues`     },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />
              <span className="text-xs text-navy/55">{label}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-navy/30 mt-4 pt-4 border-t border-navy/6">
          Based on IAEA INIR Phase 2 review — December 2025
        </p>
      </div>
    </section>
  )
}
