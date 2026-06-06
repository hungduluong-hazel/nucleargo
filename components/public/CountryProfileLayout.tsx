'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import type { TranslationKey } from '@/lib/i18n/en'

type TFn = (key: TranslationKey) => string
export type DevCategory = 'Policy' | 'Technical' | 'Partnership' | 'Regulatory' | 'Finance'
export type PlantStatus = 'active' | 'planned'
export type PartnerStatus = 'active' | 'secondary'

export type StatPill = { key: TranslationKey; icon: string }
export type SummaryRow = { labelKey: TranslationKey; valueKey: TranslationKey }
export type PlantData = {
  name: string
  statusKey: TranslationKey
  statusVariant: PlantStatus
  ownerKey: TranslationKey
  techKey: TranslationKey
  capacityKey: TranslationKey
  targetKey: TranslationKey
  phaseKey: TranslationKey
  milestoneKey: TranslationKey
  progress: number
  partnerFlagUrl: string
  partnerKey: TranslationKey
}
export type PartnerData = {
  flagUrl: string
  nameKey: TranslationKey
  roleKey: TranslationKey
  techKey?: TranslationKey
  orgsKey?: TranslationKey
  agreementKey: TranslationKey
  statusVariant: PartnerStatus
  statusKey: TranslationKey
}
export type WorkforceStat = { labelKey: TranslationKey; valueKey: TranslationKey }
export type DevData = {
  dateKey: TranslationKey
  category: DevCategory
  catKey: TranslationKey
  titleKey: TranslationKey
  bodyKey: TranslationKey
}

export type CountryProfileConfig = {
  flagUrl: string
  heroTitleKey: TranslationKey
  heroSubKey: TranslationKey
  statPills: StatPill[]
  summaryRows: SummaryRow[]
  challenges: TranslationKey[]
  plants: PlantData[]
  partners: PartnerData[]
  workforceTitleKey: TranslationKey
  workforceBadge: string
  workforceStats: WorkforceStat[]
  workforceNotes: TranslationKey[]
  developments: DevData[]
  ctaTitleKey: TranslationKey
  ctaBodyKey: TranslationKey
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const CAT_STYLES: Record<DevCategory, string> = {
  Policy:      'bg-blue-50 text-blue-700',
  Technical:   'bg-emerald-50 text-emerald-700',
  Partnership: 'bg-purple-50 text-purple-700',
  Regulatory:  'bg-pink-50 text-pink-700',
  Finance:     'bg-amber-50 text-amber-700',
}

const PLANT_BADGE: Record<PlantStatus, string> = {
  active:  'bg-emerald-50 text-emerald-700',
  planned: 'bg-blue-50 text-blue-700',
}

const PLANT_BAR: Record<PlantStatus, string> = {
  active:  'bg-emerald-500',
  planned: 'bg-blue-500',
}

const PARTNER_BADGE: Record<PartnerStatus, string> = {
  active:    'bg-emerald-50 text-emerald-700',
  secondary: 'bg-amber-50 text-amber-700',
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function CountryProfileLayout({ config }: { config: CountryProfileConfig }) {
  const { t } = useLanguage()

  return (
    <div className="flex-1">
      {/* Hero */}
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-14 md:pt-14 md:pb-18">
          <Link
            href="/countries"
            className="inline-flex items-center text-xs font-medium text-white/40 hover:text-white/70 transition-colors mb-7"
          >
            {t('countries_back')}
          </Link>
          <div className="text-center">
            <img src={config.flagUrl} alt="Flag" className="w-16 h-auto mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {t(config.heroTitleKey)}
            </h1>
            <p className="text-slate-300 mb-8">{t(config.heroSubKey)}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {config.statPills.map(({ key, icon }) => (
              <div
                key={key}
                className="flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-4 py-1.5"
              >
                <span className="text-sm">{icon}</span>
                <span className="text-xs font-semibold text-white">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-14">
          <OverviewSection config={config} t={t} />
          <PlantsSection config={config} t={t} />
          <PartnersSection config={config} t={t} />
          <WorkforceSection config={config} t={t} />
          <DevelopmentsSection config={config} t={t} />
        </div>
      </div>

      {/* CTA */}
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">{t(config.ctaTitleKey)}</h2>
          <p className="text-white/55 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            {t(config.ctaBodyKey)}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-7 py-3.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
          >
            {t('country_cta_btn')}
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Sections ────────────────────────────────────────────────────────────────

function SectionHeading({ label }: { label: string }) {
  return (
    <h2 className="text-xs font-semibold text-navy/40 uppercase tracking-widest mb-5">
      {label}
    </h2>
  )
}

function OverviewSection({ config, t }: { config: CountryProfileConfig; t: TFn }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-navy/8 p-6">
        <SectionHeading label={t('country_card_summary')} />
        <div className="space-y-3.5">
          {config.summaryRows.map(({ labelKey, valueKey }) => (
            <div key={labelKey} className="flex gap-3">
              <span className="text-xs font-medium text-navy/40 w-36 flex-shrink-0 pt-px">
                {t(labelKey)}
              </span>
              <span className="text-sm font-medium text-navy leading-snug">{t(valueKey)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-navy/8 p-6">
        <SectionHeading label={t('country_card_challenges')} />
        <div className="space-y-3.5">
          {config.challenges.map((key) => (
            <div key={key} className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                <span className="text-amber-500 text-xs font-bold leading-none">!</span>
              </span>
              <p className="text-sm text-navy/70 leading-snug">{t(key)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PlantsSection({ config, t }: { config: CountryProfileConfig; t: TFn }) {
  return (
    <div>
      <SectionHeading label={t('country_section_plants')} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {config.plants.map((plant) => (
          <PlantCard key={plant.name} plant={plant} t={t} />
        ))}
      </div>
    </div>
  )
}

function PlantCard({ plant, t }: { plant: PlantData; t: TFn }) {
  const rows = [
    { label: t('country_lbl_owner'),      value: t(plant.ownerKey)    },
    { label: t('country_lbl_technology'), value: t(plant.techKey)     },
    { label: t('country_lbl_capacity'),   value: t(plant.capacityKey) },
    { label: t('country_lbl_completion'), value: t(plant.targetKey)   },
    { label: t('country_lbl_cur_phase'),  value: t(plant.phaseKey)    },
    { label: t('country_lbl_milestone'),  value: t(plant.milestoneKey)},
  ]
  return (
    <div className="bg-white rounded-2xl border border-navy/8 p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-navy">{plant.name}</h3>
        <span className={`text-xs font-semibold rounded-full px-3 py-1 ${PLANT_BADGE[plant.statusVariant]}`}>
          {t(plant.statusKey)}
        </span>
      </div>
      <div className="space-y-2.5">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex gap-2.5">
            <span className="text-xs font-medium text-navy/40 w-32 flex-shrink-0">{label}</span>
            <span className="text-xs font-medium text-navy leading-snug">{value}</span>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-navy/40">{t('country_lbl_progress')}</span>
          <span className="text-xs font-bold text-navy">{plant.progress}%</span>
        </div>
        <div className="w-full bg-navy/8 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${PLANT_BAR[plant.statusVariant]}`}
            style={{ width: `${plant.progress}%` }}
          />
        </div>
      </div>
      <div className="pt-1 border-t border-navy/6 flex items-center gap-2.5">
        <img src={plant.partnerFlagUrl} alt="Partner flag" className="w-5 h-auto" />
        <div>
          <p className="text-xs text-navy/40 font-medium">{t('country_lbl_partner')}</p>
          <p className="text-sm font-semibold text-navy">{t(plant.partnerKey)}</p>
        </div>
      </div>
    </div>
  )
}

function PartnersSection({ config, t }: { config: CountryProfileConfig; t: TFn }) {
  return (
    <div>
      <SectionHeading label={t('country_section_partners')} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {config.partners.map((p) => (
          <PartnerCard key={p.nameKey} partner={p} t={t} />
        ))}
      </div>
    </div>
  )
}

function PartnerCard({ partner, t }: { partner: PartnerData; t: TFn }) {
  return (
    <div className="bg-white rounded-xl border border-navy/8 p-5 flex flex-col gap-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <img src={partner.flagUrl} alt={t(partner.nameKey)} className="w-6 h-auto" />
          <span className="text-sm font-bold text-navy">{t(partner.nameKey)}</span>
        </div>
        <span className={`flex-shrink-0 text-xs font-semibold rounded-full px-2.5 py-0.5 ${PARTNER_BADGE[partner.statusVariant]}`}>
          {t(partner.statusKey)}
        </span>
      </div>
      <div className="space-y-2">
        <InfoRow label={t('country_lbl_role')} value={t(partner.roleKey)} />
        {partner.techKey && <InfoRow label={t('country_lbl_technology')} value={t(partner.techKey)} />}
        {partner.orgsKey && <InfoRow label={t('country_lbl_orgs')} value={t(partner.orgsKey)} />}
        <InfoRow label={t('country_lbl_agreement')} value={t(partner.agreementKey)} />
      </div>
    </div>
  )
}

function WorkforceSection({ config, t }: { config: CountryProfileConfig; t: TFn }) {
  return (
    <div>
      <SectionHeading label={t('country_section_workforce')} />
      <div className="bg-white rounded-2xl border border-navy/8 p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-navy">{t(config.workforceTitleKey)}</h3>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
            {config.workforceBadge}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {config.workforceStats.map(({ labelKey, valueKey }) => (
            <div key={labelKey} className="text-center">
              <p className="text-xl font-bold text-accent leading-tight">{t(valueKey)}</p>
              <p className="text-xs text-navy/40 mt-1.5 leading-snug">{t(labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {config.workforceNotes.map((key) => (
          <div key={key} className="bg-white rounded-xl border border-navy/8 p-5">
            <p className="text-sm font-medium text-navy leading-snug">{t(key)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function DevelopmentsSection({ config, t }: { config: CountryProfileConfig; t: TFn }) {
  return (
    <div>
      <SectionHeading label={t('country_section_devs')} />
      <div className="space-y-3">
        {config.developments.map((dev) => (
          <div key={dev.titleKey} className="bg-white rounded-xl border border-navy/8 p-5">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${CAT_STYLES[dev.category]}`}>
                {t(dev.catKey)}
              </span>
              <span className="text-xs text-navy/35">{t(dev.dateKey)}</span>
            </div>
            <h3 className="text-sm font-semibold text-navy leading-snug">{t(dev.titleKey)}</h3>
            <p className="text-xs text-navy/55 mt-1.5 leading-relaxed">{t(dev.bodyKey)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-xs font-medium text-navy/40 w-20 flex-shrink-0">{label}</span>
      <span className="text-xs text-navy/70 leading-snug">{value}</span>
    </div>
  )
}
