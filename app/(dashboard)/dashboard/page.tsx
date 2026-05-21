import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type Development = {
  id: string
  title_en: string
  body_en: string | null
  date: string | null
  category: string | null
}

const STATIC_DEVELOPMENTS: Development[] = [
  {
    id: 's1',
    title_en: 'Vietnam Approves Nuclear Energy Law',
    body_en:
      'The National Assembly passed the revised Nuclear Energy Law, clearing the legal path for the Ninh Thuan 1 project and setting a 2030 construction target.',
    date: '2026-05-01',
    category: 'Policy',
  },
  {
    id: 's2',
    title_en: 'Poland Selects Westinghouse AP1000',
    body_en:
      'Poland confirmed the AP1000 reactor design for its first nuclear plant in Pomerania, with first power targeted for 2035.',
    date: '2026-04-15',
    category: 'Technology',
  },
  {
    id: 's3',
    title_en: 'IAEA Milestone Review — Bangladesh',
    body_en:
      'Bangladesh completed its IAEA Phase 2 infrastructure milestone review for Rooppur NPP, securing $500M in additional international financing.',
    date: '2026-03-20',
    category: 'Finance',
  },
]

const CATEGORY_STYLES: Record<string, string> = {
  Policy:     'bg-blue-50 text-blue-700',
  Technology: 'bg-emerald-50 text-emerald-700',
  Finance:    'bg-amber-50 text-amber-700',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user.id)
    .single()

  const firstName = profile?.first_name ?? user.email?.split('@')[0] ?? 'there'

  // Try live developments; fall back to static if table is empty or not yet seeded
  const { data: liveDevelopments } = await supabase
    .from('developments')
    .select('id, title_en, body_en, date, category')
    .order('date', { ascending: false })
    .limit(3)

  const developments: Development[] =
    liveDevelopments && liveDevelopments.length > 0
      ? liveDevelopments
      : STATIC_DEVELOPMENTS

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-navy">
          Welcome back, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-navy/50">
          Your NuclearGo intelligence overview — updated daily.
        </p>
      </div>

      {/* IAEA Phase 2 Status Banner */}
      <div className="relative overflow-hidden rounded-xl bg-navy px-6 py-5 flex items-center justify-between gap-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_0%_50%,rgba(200,16,46,0.15),transparent)]" />
        <div className="relative flex items-center gap-4">
          <div className="flex-shrink-0 h-10 w-10 rounded-full border-2 border-accent/40 flex items-center justify-center bg-accent/10">
            <span className="text-lg">🔬</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Program Status
            </p>
            <p className="text-white font-bold text-lg leading-tight">
              IAEA Phase 2 — Infrastructure Development
            </p>
            <p className="text-white/50 text-xs mt-0.5">
              Vietnam · Ninh Thuan Program · Active since 2024
            </p>
          </div>
        </div>
        <div className="relative flex-shrink-0 hidden sm:flex items-center gap-2 bg-accent/15 border border-accent/30 rounded-full px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-semibold text-accent">Live</span>
        </div>
      </div>

      {/* Four metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          flag="🇻🇳"
          label="Ninh Thuận 1"
          sublabel="Vietnam"
          value="Feasibility Update"
          detail="Phase 2 site study completed"
          accent
        />
        <MetricCard
          flag="🇻🇳"
          label="Ninh Thuận 2"
          sublabel="Vietnam"
          value="Partner Negotiation"
          detail="ROSATOM MOU under review"
        />
        <MetricCard
          flag="👷"
          label="Workforce Pipeline"
          sublabel="Training Target"
          value="4,000"
          detail="Nuclear engineers by 2030"
        />
        <MetricCard
          flag="⚠️"
          label="IAEA Issues"
          sublabel="Infrastructure gaps"
          value="19"
          detail="Open infrastructure issues"
          warning
        />
      </div>

      {/* Recent Developments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-navy/50 uppercase tracking-wider">
            Recent Developments
          </h2>
          <a
            href="/developments"
            className="text-xs font-medium text-accent hover:underline"
          >
            View all →
          </a>
        </div>

        <div className="space-y-3">
          {developments.map((dev) => (
            <DevelopmentRow key={dev.id} development={dev} />
          ))}
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  flag,
  label,
  sublabel,
  value,
  detail,
  accent = false,
  warning = false,
}: {
  flag: string
  label: string
  sublabel: string
  value: string
  detail: string
  accent?: boolean
  warning?: boolean
}) {
  return (
    <div className="bg-white rounded-xl border border-navy/8 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xl">{flag}</span>
        {accent && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">
            Active
          </span>
        )}
        {warning && (
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">
            Open
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-navy/40 font-medium">{sublabel}</p>
        <p className="text-sm font-semibold text-navy leading-snug">{label}</p>
      </div>
      <div>
        <p className={`text-xl font-bold ${warning ? 'text-amber-500' : 'text-accent'}`}>
          {value}
        </p>
        <p className="text-xs text-navy/40 mt-0.5">{detail}</p>
      </div>
    </div>
  )
}

function DevelopmentRow({ development }: { development: Development }) {
  const { title_en, body_en, date, category } = development
  const categoryStyle =
    CATEGORY_STYLES[category ?? ''] ?? 'bg-navy/8 text-navy/60'

  const formatted = date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : ''

  return (
    <div className="bg-white rounded-xl border border-navy/8 p-5 flex gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {category && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryStyle}`}
            >
              {category}
            </span>
          )}
          {formatted && (
            <span className="text-xs text-navy/35">{formatted}</span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-navy">{title_en}</h3>
        {body_en && (
          <p className="text-xs text-navy/55 mt-1 leading-relaxed line-clamp-2">
            {body_en}
          </p>
        )}
      </div>
    </div>
  )
}
