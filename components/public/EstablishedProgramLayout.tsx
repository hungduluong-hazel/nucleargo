import Link from 'next/link'
import type {
  EstablishedProgramConfig,
  FrameworkDimension,
  DimensionRating,
} from '@/lib/data/established-programs'

// Reusable template for "established nation" benchmark pages — the counterpart
// to CountryProfileLayout.tsx (which is built around newcomer IAEA phases).
// Established programs are scored against the cost/risk framework instead:
// see docs/nuclear-economics-framework.md for the source of these groupings.
//
// To reuse: create a new EstablishedProgramConfig in
// lib/data/established-programs.ts, then a thin wrapper component + route
// (see components/public/UnitedStatesContent.tsx and
// app/(public)/countries/united-states/page.tsx).

const RATING_STYLES: Record<DimensionRating, { badge: string; bar: string; label: string }> = {
  strength: { badge: 'bg-emerald-50 text-emerald-700', bar: 'bg-emerald-500', label: 'Strength' },
  weakness: { badge: 'bg-rose-50 text-rose-700', bar: 'bg-rose-500', label: 'Weakness' },
  mixed: { badge: 'bg-amber-50 text-amber-700', bar: 'bg-amber-500', label: 'Mixed' },
}

export default function EstablishedProgramLayout({ config }: { config: EstablishedProgramConfig }) {
  return (
    <div className="flex-1">
      {/* Hero */}
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-14 md:pt-14 md:pb-18">
          <Link
            href="/countries"
            className="inline-flex items-center text-xs font-medium text-white/40 hover:text-white/70 transition-colors mb-7"
          >
            ← Back to Programs
          </Link>

          <div className="text-center">
            <img src={config.flagUrl} alt={`${config.countryName} flag`} className="w-16 h-auto mx-auto mb-4" />
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              {config.badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{config.heroTitle}</h1>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8">{config.heroSub}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            {config.statPills.map((pill) => (
              <div
                key={pill.label}
                className="flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-4 py-1.5"
              >
                <span className="text-sm">{pill.icon}</span>
                <span className="text-xs font-semibold text-white">{pill.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-14">
          <SummarySection config={config} />
          <DimensionGroup
            heading="Build-Phase Execution Risk"
            subheading="Determines whether construction stays on budget and schedule"
            dimensions={config.buildPhaseRisk}
          />
          <DimensionGroup
            heading="Financeability & Political Durability"
            subheading="Determines whether the project could be funded and survive to completion"
            dimensions={config.financeability}
          />
          <DimensionGroup
            heading="Long-Term Lifecycle Liability"
            subheading="Costs and risks that emerge after commissioning, over the plant's operating life"
            dimensions={config.lifecycleLiability}
          />
          <ContextModifierSection config={config} />
          <SourcesSection config={config} />
        </div>
      </div>

      {/* CTA */}
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">{config.ctaTitle}</h2>
          <p className="text-white/55 text-sm max-w-md mx-auto mb-8 leading-relaxed">{config.ctaBody}</p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-7 py-3.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
          >
            Register Free
          </Link>
        </div>
      </div>
    </div>
  )
}

function SectionHeading({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-xs font-semibold text-navy/40 uppercase tracking-widest">{label}</h2>
      {sub && <p className="text-sm text-navy/50 mt-1.5">{sub}</p>}
    </div>
  )
}

function SummarySection({ config }: { config: EstablishedProgramConfig }) {
  return (
    <div className="bg-white rounded-2xl border border-navy/8 p-6">
      <SectionHeading label="Program Summary" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5">
        {config.summaryRows.map((row) => (
          <div key={row.label} className="flex gap-3">
            <span className="text-xs font-medium text-navy/40 w-40 flex-shrink-0 pt-px">{row.label}</span>
            <span className="text-sm font-medium text-navy leading-snug">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DimensionGroup({
  heading,
  subheading,
  dimensions,
}: {
  heading: string
  subheading: string
  dimensions: FrameworkDimension[]
}) {
  return (
    <div>
      <SectionHeading label={heading} sub={subheading} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {dimensions.map((dim) => (
          <DimensionCard key={dim.label} dim={dim} />
        ))}
      </div>
    </div>
  )
}

function DimensionCard({ dim }: { dim: FrameworkDimension }) {
  const style = RATING_STYLES[dim.rating]
  return (
    <div className="bg-white rounded-xl border border-navy/8 p-5 flex flex-col gap-2.5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-navy leading-snug">{dim.label}</h3>
        <span className={`flex-shrink-0 text-xs font-semibold rounded-full px-2.5 py-0.5 ${style.badge}`}>
          {style.label}
        </span>
      </div>
      <p className="text-sm font-medium text-navy/80 leading-snug">{dim.finding}</p>
      <p className="text-xs text-navy/55 leading-relaxed">{dim.detail}</p>
      {dim.verified && dim.sourceUrl ? (
        <a
          href={dim.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start mt-1 text-xs font-medium text-accent hover:underline"
        >
          Source: {dim.sourceLabel}
        </a>
      ) : !dim.verified ? (
        <span className="self-start mt-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
          Needs verification
        </span>
      ) : null}
    </div>
  )
}

function ContextModifierSection({ config }: { config: EstablishedProgramConfig }) {
  return (
    <div>
      <SectionHeading
        label="Context Modifier"
        sub="Not a cost dimension — reweights how much cost/risk premium is rational for this country"
      />
      <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-6">
        <h3 className="text-sm font-bold text-navy mb-2">{config.contextModifier.label}</h3>
        <p className="text-sm text-navy/70 leading-relaxed">{config.contextModifier.detail}</p>
      </div>
    </div>
  )
}

function SourcesSection({ config }: { config: EstablishedProgramConfig }) {
  return (
    <div>
      <SectionHeading label="Sources & Verification Status" />
      <div className="bg-white rounded-xl border border-navy/8 p-6 space-y-4">
        <p className="text-xs text-navy/55 leading-relaxed">{config.verificationNote}</p>
        <ul className="space-y-1.5">
          {config.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-accent hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
