import { createClient } from '@/lib/supabase/server'

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURED_TAGS = [
  'Program Timeline',
  'Workforce Gap',
  'Russian Partnership',
  'IAEA Compliance',
  'Canadian Opportunity',
]

const FEATURES = [
  {
    icon:        'document' as const,
    title:       'Program Analysis',
    description: "In-depth assessment of milestone progress, timeline risks, and critical path decisions for Vietnam and Poland's nuclear programs.",
  },
  {
    icon:        'globe' as const,
    title:       'Partnership Intelligence',
    description: 'Analysis of international agreements, technology selection decisions, and financing developments across all active newcomer programs.',
  },
  {
    icon:        'people' as const,
    title:       'Workforce & Capability',
    description: 'Tracking of training pipeline progress, workforce gaps, and human resource development against Project 1012 targets.',
  },
]

const TOPICS = [
  {
    date:   'June 2026',
    title:  "Vietnam's Nuclear Restart: 12 Months In",
    status: 'In preparation' as const,
  },
  {
    date:   'July 2026',
    title:  "Poland's AP1000 Path: Licensing Timeline and Construction Readiness",
    status: 'Planned' as const,
  },
  {
    date:   'August 2026',
    title:  'Vietnam Workforce Gap: Can Project 1012 Deliver 4,000 Engineers by 2030?',
    status: 'Planned' as const,
  },
  {
    date:   'September 2026',
    title:  'Canadian Nuclear Export Strategy: Vietnam and Poland Opportunities',
    status: 'Planned' as const,
  },
  {
    date:   'October 2026',
    title:  "VARANS Development: Building Vietnam's Nuclear Regulator from Scratch",
    status: 'Planned' as const,
  },
]

type TopicStatus = 'In preparation' | 'Planned'
type FeatureIcon = 'document' | 'globe' | 'people'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BriefingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="space-y-10">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Intelligence Briefings</h1>
        <p className="text-sm text-navy/50 mt-1">
          Monthly analysis of emerging nuclear programs — written by nuclear industry professionals
        </p>
      </div>

      {/* ── Featured briefing ── */}
      <div className="bg-white rounded-2xl border border-navy/8 overflow-hidden">
        {/* Top accent strip */}
        <div className="h-1 bg-accent" />

        <div className="p-6 sm:p-8">
          {/* Label row */}
          <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
            <span className="text-xs font-bold text-accent uppercase tracking-widest">
              Latest Briefing
            </span>
            <span className="text-xs font-bold bg-accent text-white rounded-full px-3 py-1 uppercase tracking-wide">
              Coming Soon
            </span>
          </div>

          {/* Issue + date */}
          <p className="text-xs font-semibold text-navy/40 uppercase tracking-wider mb-2">
            Issue 1 &nbsp;·&nbsp; June 2026
          </p>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-navy leading-snug mb-4">
            Vietnam&apos;s Nuclear Restart: 12 Months In — Progress, Risks, and What Comes Next
          </h2>

          {/* Summary */}
          <p className="text-sm text-navy/65 leading-relaxed mb-6 max-w-2xl">
            One year after the National Assembly restarted Vietnam&apos;s nuclear program, we assess
            what has been achieved, where the critical gaps remain, and what the next 12 months
            must deliver for the program to stay on track.
          </p>

          {/* Topics covered */}
          <div className="flex flex-wrap gap-2 mb-7">
            {FEATURED_TAGS.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold bg-navy/6 text-navy/60 rounded-full px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA box */}
          <div className="rounded-xl bg-surface border border-navy/8 px-5 py-4">
            <p className="text-sm font-semibold text-navy mb-1">Expected: June 2026</p>
            <p className="text-sm text-navy/55 leading-relaxed">
              The first NuclearGo intelligence briefing will be published in June 2026. Register
              your email to be notified.
            </p>
          </div>
        </div>
      </div>

      {/* ── What our briefings cover ── */}
      <div>
        <h2 className="text-lg font-bold text-navy mb-5">What Our Briefings Cover</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-navy/8 p-5 flex flex-col gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center flex-shrink-0">
                <FeatureIconSvg name={f.icon} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy mb-1.5">{f.title}</h3>
                <p className="text-xs text-navy/55 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Upcoming topics ── */}
      <div>
        <h2 className="text-lg font-bold text-navy mb-5">Upcoming Analysis Topics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TOPICS.map((topic) => (
            <TopicCard key={topic.title} topic={topic} />
          ))}
        </div>
      </div>

      {/* ── Notification signup ── */}
      {user && (
        <div className="bg-navy rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-1.5">Get Notified When We Publish</h2>
          <p className="text-sm text-white/55 leading-relaxed mb-6 max-w-lg">
            Each briefing is sent directly to registered Tier 2 members. You&apos;re already
            registered — we&apos;ll email you when Issue 1 is published.
          </p>

          <div className="flex items-center gap-3 bg-white/8 border border-white/12 rounded-xl px-4 py-3.5 w-fit">
            <CheckCircleIcon />
            <div>
              <p className="text-xs font-semibold text-emerald-400">You&apos;re on the list</p>
              <p className="text-sm font-medium text-white mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Archive ── */}
      <div>
        <h2 className="text-lg font-bold text-navy mb-5">Briefing Archive</h2>
        <div className="bg-white rounded-2xl border border-navy/8 px-6 py-14 flex flex-col items-center justify-center text-center">
          <ArchiveIcon />
          <p className="text-base font-semibold text-navy/40 mt-4">No published briefings yet</p>
          <p className="text-sm text-navy/30 mt-1">
            Issue 1 publishes June 2026. Past issues will appear here.
          </p>
        </div>
      </div>

    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TopicCard({ topic }: { topic: { date: string; title: string; status: TopicStatus } }) {
  const isPreparing = topic.status === 'In preparation'
  return (
    <div className="bg-white rounded-xl border border-navy/8 p-5 flex items-start gap-4">
      <span className="flex-shrink-0 text-xs font-semibold text-navy/40 bg-navy/5 rounded-lg px-2.5 py-1.5 leading-snug text-center min-w-[5rem]">
        {topic.date}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-navy leading-snug">{topic.title}</p>
        <span className={`inline-block text-xs font-semibold rounded-full px-2.5 py-0.5 mt-2 ${
          isPreparing
            ? 'bg-amber-50 text-amber-700'
            : 'bg-navy/6 text-navy/45'
        }`}>
          {topic.status}
        </span>
      </div>
    </div>
  )
}

function FeatureIconSvg({ name }: { name: FeatureIcon }) {
  if (name === 'document') {
    return (
      <svg className="w-5 h-5 text-navy/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }
  if (name === 'globe') {
    return (
      <svg className="w-5 h-5 text-navy/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5 text-navy/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  )
}

function ArchiveIcon() {
  return (
    <svg className="w-12 h-12 text-navy/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    </svg>
  )
}
