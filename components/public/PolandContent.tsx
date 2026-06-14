'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import type { TranslationKey } from '@/lib/i18n/en'

type TFn = (key: TranslationKey) => string
type DevCategory = 'Policy' | 'Technical' | 'Partnership' | 'Regulatory'
type PlantStatus = 'active' | 'planned'
type PartnerStatus = 'active' | 'secondary' | 'withdrawn'

// ─── Data types ──────────────────────────────────────────────────────────────

type SummaryRow = { labelKey: TranslationKey; valueKey: TranslationKey }

type PlantData = {
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

type PartnerData = {
  flagUrl: string
  nameKey: TranslationKey
  roleKey: TranslationKey
  techKey?: TranslationKey
  orgsKey?: TranslationKey
  agreementKey: TranslationKey
  statusVariant: PartnerStatus
  statusKey: TranslationKey
}

type DevData = {
  dateKey: TranslationKey
  category: DevCategory
  catKey: TranslationKey
  titleKey: TranslationKey
  bodyKey: TranslationKey
}

// ─── Static data ─────────────────────────────────────────────────────────────

const STAT_PILLS: Array<{ key: TranslationKey; icon: string }> = [
  { key: 'pl_stat_phase',  icon: '🔬' },
  { key: 'pl_stat_target', icon: '⚡' },
  { key: 'pl_stat_invest', icon: '💰' },
]

const SUMMARY_ROWS: SummaryRow[] = [
  { labelKey: 'pl_lbl_prog_status', valueKey: 'pl_val_prog_status' },
  { labelKey: 'pl_lbl_legal',       valueKey: 'pl_val_legal'       },
  { labelKey: 'pl_lbl_regulator',   valueKey: 'pl_val_regulator'   },
  { labelKey: 'pl_lbl_authority',   valueKey: 'pl_val_authority'   },
  { labelKey: 'pl_lbl_iaea_phase',  valueKey: 'pl_val_iaea_phase'  },
  { labelKey: 'pl_lbl_tech',        valueKey: 'pl_val_tech'        },
  { labelKey: 'pl_lbl_netzero',     valueKey: 'pl_val_netzero'     },
]

const CHALLENGES: TranslationKey[] = [
  'pl_ch1', 'pl_ch2', 'pl_ch3', 'pl_ch4', 'pl_ch5', 'pl_ch6',
]

const PLANTS: PlantData[] = [
  {
    name: 'Lubiatowo-Kopalino Unit 1',
    statusKey: 'pl_badge_active',
    statusVariant: 'active',
    ownerKey: 'pl_lk1_owner',
    techKey: 'pl_lk1_tech',
    capacityKey: 'pl_lk1_capacity',
    targetKey: 'pl_lk1_target',
    phaseKey: 'pl_lk1_cur_phase',
    milestoneKey: 'pl_lk1_milestone',
    progress: 18,
    partnerFlagUrl: 'https://flagcdn.com/w20/us.png',
    partnerKey: 'pl_lk1_partner_label',
  },
  {
    name: 'Lubiatowo-Kopalino Unit 2',
    statusKey: 'pl_badge_planned',
    statusVariant: 'planned',
    ownerKey: 'pl_lk2_owner',
    techKey: 'pl_lk2_tech',
    capacityKey: 'pl_lk2_capacity',
    targetKey: 'pl_lk2_target',
    phaseKey: 'pl_lk2_cur_phase',
    milestoneKey: 'pl_lk2_milestone',
    progress: 10,
    partnerFlagUrl: 'https://flagcdn.com/w20/us.png',
    partnerKey: 'pl_lk2_partner_label',
  },
]

const PARTNERS: PartnerData[] = [
  {
    flagUrl: 'https://flagcdn.com/w20/us.png',
    nameKey: 'pl_us_name',
    roleKey: 'pl_us_role',
    techKey: 'pl_us_tech',
    orgsKey: 'pl_us_orgs',
    agreementKey: 'pl_us_agreement',
    statusVariant: 'active',
    statusKey: 'pl_badge_active',
  },
  {
    flagUrl: 'https://flagcdn.com/w20/ca.png',
    nameKey: 'pl_ca_name',
    roleKey: 'pl_ca_role',
    orgsKey: 'pl_ca_orgs',
    agreementKey: 'pl_ca_agreement',
    statusVariant: 'active',
    statusKey: 'pl_badge_active',
  },
  {
    flagUrl: 'https://flagcdn.com/w20/kr.png',
    nameKey: 'pl_kr_name',
    roleKey: 'pl_kr_role',
    techKey: 'pl_kr_tech',
    agreementKey: 'pl_kr_agreement',
    statusVariant: 'withdrawn',
    statusKey: 'pl_badge_withdrawn',
  },
  {
    flagUrl: 'https://flagcdn.com/w20/fr.png',
    nameKey: 'pl_fr_name',
    roleKey: 'pl_fr_role',
    techKey: 'pl_fr_tech',
    agreementKey: 'pl_fr_agreement',
    statusVariant: 'secondary',
    statusKey: 'pl_badge_secondary',
  },
]

const DEVELOPMENTS: DevData[] = [
  { dateKey: 'pl_dev1_date', category: 'Regulatory',  catKey: 'pl_cat_regulatory',  titleKey: 'pl_dev1_title', bodyKey: 'pl_dev1_body' },
  { dateKey: 'pl_dev2_date', category: 'Technical',   catKey: 'pl_cat_technical',   titleKey: 'pl_dev2_title', bodyKey: 'pl_dev2_body' },
  { dateKey: 'pl_dev3_date', category: 'Policy',      catKey: 'pl_cat_policy',      titleKey: 'pl_dev3_title', bodyKey: 'pl_dev3_body' },
  { dateKey: 'pl_dev4_date', category: 'Technical',   catKey: 'pl_cat_technical',   titleKey: 'pl_dev4_title', bodyKey: 'pl_dev4_body' },
  { dateKey: 'pl_dev5_date', category: 'Partnership', catKey: 'pl_cat_partnership', titleKey: 'pl_dev5_title', bodyKey: 'pl_dev5_body' },
  { dateKey: 'pl_dev6_date', category: 'Regulatory',  catKey: 'pl_cat_regulatory',  titleKey: 'pl_dev6_title', bodyKey: 'pl_dev6_body' },
]

const CAT_STYLES: Record<DevCategory, string> = {
  Policy:      'bg-blue-50 text-blue-700',
  Technical:   'bg-emerald-50 text-emerald-700',
  Partnership: 'bg-purple-50 text-purple-700',
  Regulatory:  'bg-pink-50 text-pink-700',
}

const PLANT_BADGE_STYLES: Record<PlantStatus, string> = {
  active:  'bg-emerald-50 text-emerald-700',
  planned: 'bg-blue-50 text-blue-700',
}

const PLANT_BAR_STYLES: Record<PlantStatus, string> = {
  active:  'bg-emerald-500',
  planned: 'bg-blue-500',
}

const PARTNER_BADGE_STYLES: Record<PartnerStatus, string> = {
  active:    'bg-emerald-50 text-emerald-700',
  secondary: 'bg-amber-50 text-amber-700',
  withdrawn: 'bg-gray-100 text-gray-500',
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function PolandContent() {
  const { t } = useLanguage()

  return (
    <div className="flex-1">
      {/* ── Hero ── */}
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-14 md:pt-14 md:pb-18">
          <Link
            href="/countries"
            className="inline-flex items-center text-xs font-medium text-white/40 hover:text-white/70 transition-colors mb-7"
          >
            {t('countries_back')}
          </Link>

          <div className="text-center">
            <img
              src="https://flagcdn.com/w80/pl.png"
              alt="Poland flag"
              className="w-16 h-auto mx-auto mb-4"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {t('pl_hero_title')}
            </h1>
            <p className="text-slate-300 mb-8">
              {t('pl_hero_sub')}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            {STAT_PILLS.map(({ key, icon }) => (
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

      {/* ── Content ── */}
      <div className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-14">
          <OverviewSection t={t} />
          <PlantsSection t={t} />
          <PartnersSection t={t} />
          <WorkforceSection t={t} />
          <DevelopmentsSection t={t} />
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">{t('pl_cta_title')}</h2>
          <p className="text-white/55 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            {t('pl_cta_body')}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-7 py-3.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
          >
            {t('pl_cta_btn')}
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-sections ─────────────────────────────────────────────────────────────

function SectionHeading({ label }: { label: string }) {
  return (
    <h2 className="text-xs font-semibold text-navy/40 uppercase tracking-widest mb-5">
      {label}
    </h2>
  )
}

function OverviewSection({ t }: { t: TFn }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Program Summary */}
      <div className="bg-white rounded-2xl border border-navy/8 p-6">
        <SectionHeading label={t('pl_card_summary')} />
        <div className="space-y-3.5">
          {SUMMARY_ROWS.map(({ labelKey, valueKey }) => (
            <div key={labelKey} className="flex gap-3">
              <span className="text-xs font-medium text-navy/40 w-36 flex-shrink-0 pt-px">
                {t(labelKey)}
              </span>
              <span className="text-sm font-medium text-navy leading-snug">{t(valueKey)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Challenges */}
      <div className="bg-white rounded-2xl border border-navy/8 p-6">
        <SectionHeading label={t('pl_card_challenges')} />
        <div className="space-y-3.5">
          {CHALLENGES.map((key) => (
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

function PlantsSection({ t }: { t: TFn }) {
  return (
    <div>
      <SectionHeading label={t('pl_section_plants')} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLANTS.map((plant) => (
          <PlantCard key={plant.name} plant={plant} t={t} />
        ))}
      </div>
    </div>
  )
}

function PlantCard({ plant, t }: { plant: PlantData; t: TFn }) {
  const rows = [
    { label: t('pl_lbl_owner'),      value: t(plant.ownerKey)     },
    { label: t('pl_lbl_technology'), value: t(plant.techKey)      },
    { label: t('pl_lbl_capacity'),   value: t(plant.capacityKey)  },
    { label: t('pl_lbl_completion'), value: t(plant.targetKey)    },
    { label: t('pl_lbl_cur_phase'),  value: t(plant.phaseKey)     },
    { label: t('pl_lbl_milestone'),  value: t(plant.milestoneKey) },
  ]

  return (
    <div className="bg-white rounded-2xl border border-navy/8 p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-navy">{plant.name}</h3>
        <span className={`text-xs font-semibold rounded-full px-3 py-1 ${PLANT_BADGE_STYLES[plant.statusVariant]}`}>
          {t(plant.statusKey)}
        </span>
      </div>

      {/* Detail rows */}
      <div className="space-y-2.5">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex gap-2.5">
            <span className="text-xs font-medium text-navy/40 w-32 flex-shrink-0">{label}</span>
            <span className="text-xs font-medium text-navy leading-snug">{value}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-navy/40">{t('pl_lbl_progress')}</span>
          <span className="text-xs font-bold text-navy">{plant.progress}%</span>
        </div>
        <div className="w-full bg-navy/8 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${PLANT_BAR_STYLES[plant.statusVariant]}`}
            style={{ width: `${plant.progress}%` }}
          />
        </div>
      </div>

      {/* Partner footer */}
      <div className="pt-1 border-t border-navy/6 flex items-center gap-2.5">
        <img src={plant.partnerFlagUrl} alt="Partner flag" className="w-5 h-auto" />
        <div>
          <p className="text-xs text-navy/40 font-medium">{t('pl_lbl_partner')}</p>
          <p className="text-sm font-semibold text-navy">{t(plant.partnerKey)}</p>
        </div>
      </div>
    </div>
  )
}

function PartnersSection({ t }: { t: TFn }) {
  return (
    <div>
      <SectionHeading label={t('pl_section_partners')} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PARTNERS.map((p) => (
          <PartnerCard key={p.nameKey} partner={p} t={t} />
        ))}
      </div>
    </div>
  )
}

function PartnerCard({ partner, t }: { partner: PartnerData; t: TFn }) {
  return (
    <div className="bg-white rounded-xl border border-navy/8 p-5 flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <img src={partner.flagUrl} alt={t(partner.nameKey)} className="w-6 h-auto" />
          <span className="text-sm font-bold text-navy">{t(partner.nameKey)}</span>
        </div>
        <span className={`flex-shrink-0 text-xs font-semibold rounded-full px-2.5 py-0.5 ${PARTNER_BADGE_STYLES[partner.statusVariant]}`}>
          {t(partner.statusKey)}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <InfoRow label={t('pl_lbl_role')} value={t(partner.roleKey)} />
        {partner.techKey && (
          <InfoRow label={t('pl_lbl_technology')} value={t(partner.techKey)} />
        )}
        {partner.orgsKey && (
          <InfoRow label={t('pl_lbl_orgs')} value={t(partner.orgsKey)} />
        )}
        <InfoRow label={t('pl_lbl_agreement')} value={t(partner.agreementKey)} />
      </div>
    </div>
  )
}

function WorkforceSection({ t }: { t: TFn }) {
  const stats = [
    { label: t('pl_wf_lbl1'), value: t('pl_wf_val1') },
    { label: t('pl_wf_lbl2'), value: t('pl_wf_val2') },
    { label: t('pl_wf_lbl3'), value: t('pl_wf_val3') },
    { label: t('pl_wf_lbl4'), value: t('pl_wf_val4') },
  ]

  return (
    <div>
      <SectionHeading label={t('pl_section_workforce')} />

      {/* NCBJ summary card */}
      <div className="bg-white rounded-2xl border border-navy/8 p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-navy">{t('pl_workforce_card_title')}</h3>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
            NCBJ
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold text-accent leading-tight">{value}</p>
              <p className="text-xs text-navy/40 mt-1.5 leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Three stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(['pl_wf_stat1', 'pl_wf_stat2', 'pl_wf_stat3'] as const).map((key) => (
          <div key={key} className="bg-white rounded-xl border border-navy/8 p-5">
            <p className="text-sm font-medium text-navy leading-snug">{t(key)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function DevelopmentsSection({ t }: { t: TFn }) {
  return (
    <div>
      <SectionHeading label={t('pl_section_devs')} />
      <div className="space-y-3">
        {DEVELOPMENTS.map((dev) => (
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-xs font-medium text-navy/40 w-20 flex-shrink-0">{label}</span>
      <span className="text-xs text-navy/70 leading-snug">{value}</span>
    </div>
  )
}
