'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import type { TranslationKey } from '@/lib/i18n/en'

type TFn = (key: TranslationKey) => string
type DevCategory = 'Policy' | 'Technical' | 'Partnership' | 'Regulatory'

// ─── Data types ──────────────────────────────────────────────────────────────

type SummaryRow = { labelKey: TranslationKey; valueKey: TranslationKey }

type PlantData = {
  name: string
  statusKey: TranslationKey
  statusVariant: 'active' | 'negotiation'
  ownerKey: TranslationKey
  techKey: TranslationKey
  capacityKey: TranslationKey
  targetKey: TranslationKey
  phaseKey: TranslationKey
  milestoneKey: TranslationKey
  progress: number
  partnerFlag: string
  partnerKey: TranslationKey
}

type PartnerData = {
  flag: string
  nameKey: TranslationKey
  roleKey: TranslationKey
  techKey?: TranslationKey
  orgsKey?: TranslationKey
  agreementKey: TranslationKey
  statusVariant: 'active' | 'negotiation'
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
  { key: 'vn_stat_phase',  icon: '🔬' },
  { key: 'vn_stat_target', icon: '⚡' },
  { key: 'vn_stat_invest', icon: '💰' },
]

const SUMMARY_ROWS: SummaryRow[] = [
  { labelKey: 'vn_lbl_prog_status', valueKey: 'vn_val_prog_status' },
  { labelKey: 'vn_lbl_legal',       valueKey: 'vn_val_legal'       },
  { labelKey: 'vn_lbl_regulator',   valueKey: 'vn_val_regulator'   },
  { labelKey: 'vn_lbl_authority',   valueKey: 'vn_val_authority'   },
  { labelKey: 'vn_lbl_iaea_phase',  valueKey: 'vn_val_iaea_phase'  },
  { labelKey: 'vn_lbl_inir',        valueKey: 'vn_val_inir'        },
  { labelKey: 'vn_lbl_netzero',     valueKey: 'vn_val_netzero'     },
]

const CHALLENGES: TranslationKey[] = [
  'vn_ch1', 'vn_ch2', 'vn_ch3', 'vn_ch4', 'vn_ch5',
]

const PLANTS: PlantData[] = [
  {
    name: 'Ninh Thuan 1',
    statusKey: 'vn_badge_active',
    statusVariant: 'active',
    ownerKey: 'vn_nt1_owner',
    techKey: 'vn_nt1_tech',
    capacityKey: 'vn_nt1_capacity',
    targetKey: 'vn_nt1_target',
    phaseKey: 'vn_nt1_cur_phase',
    milestoneKey: 'vn_nt1_milestone',
    progress: 22,
    partnerFlag: '🇷🇺',
    partnerKey: 'vn_nt1_partner_label',
  },
  {
    name: 'Ninh Thuan 2',
    statusKey: 'vn_badge_negotiation',
    statusVariant: 'negotiation',
    ownerKey: 'vn_nt2_owner',
    techKey: 'vn_nt2_tech',
    capacityKey: 'vn_nt2_capacity',
    targetKey: 'vn_nt2_target',
    phaseKey: 'vn_nt2_cur_phase',
    milestoneKey: 'vn_nt2_milestone',
    progress: 12,
    partnerFlag: '🇰🇷',
    partnerKey: 'vn_nt2_partner_label',
  },
]

const PARTNERS: PartnerData[] = [
  {
    flag: '🇷🇺',
    nameKey: 'vn_ru_name',
    roleKey: 'vn_ru_role',
    techKey: 'vn_ru_tech',
    agreementKey: 'vn_ru_agreement',
    statusVariant: 'active',
  },
  {
    flag: '🇰🇷',
    nameKey: 'vn_kr_name',
    roleKey: 'vn_kr_role',
    techKey: 'vn_kr_tech',
    agreementKey: 'vn_kr_agreement',
    statusVariant: 'negotiation',
  },
  {
    flag: '🇨🇦',
    nameKey: 'vn_ca_name',
    roleKey: 'vn_ca_role',
    orgsKey: 'vn_ca_orgs',
    agreementKey: 'vn_ca_agreement',
    statusVariant: 'active',
  },
  {
    flag: '🇫🇷',
    nameKey: 'vn_fr_name',
    roleKey: 'vn_fr_role',
    agreementKey: 'vn_fr_agreement',
    statusVariant: 'active',
  },
  {
    flag: '🇺🇸',
    nameKey: 'vn_us_name',
    roleKey: 'vn_us_role',
    agreementKey: 'vn_us_agreement',
    statusVariant: 'active',
  },
]

const DEVELOPMENTS: DevData[] = [
  { dateKey: 'vn_dev1_date', category: 'Partnership', catKey: 'vn_cat_partnership', titleKey: 'vn_dev1_title', bodyKey: 'vn_dev1_body' },
  { dateKey: 'vn_dev2_date', category: 'Technical',   catKey: 'vn_cat_technical',   titleKey: 'vn_dev2_title', bodyKey: 'vn_dev2_body' },
  { dateKey: 'vn_dev3_date', category: 'Policy',      catKey: 'vn_cat_policy',      titleKey: 'vn_dev3_title', bodyKey: 'vn_dev3_body' },
  { dateKey: 'vn_dev4_date', category: 'Regulatory',  catKey: 'vn_cat_regulatory',  titleKey: 'vn_dev4_title', bodyKey: 'vn_dev4_body' },
  { dateKey: 'vn_dev5_date', category: 'Technical',   catKey: 'vn_cat_technical',   titleKey: 'vn_dev5_title', bodyKey: 'vn_dev5_body' },
  { dateKey: 'vn_dev6_date', category: 'Partnership', catKey: 'vn_cat_partnership', titleKey: 'vn_dev6_title', bodyKey: 'vn_dev6_body' },
]

const CAT_STYLES: Record<DevCategory, string> = {
  Policy:      'bg-blue-50 text-blue-700',
  Technical:   'bg-emerald-50 text-emerald-700',
  Partnership: 'bg-purple-50 text-purple-700',
  Regulatory:  'bg-pink-50 text-pink-700',
}

const WORKFORCE_PROGRESS = Math.round((473 / 4000) * 100)

// ─── Main export ─────────────────────────────────────────────────────────────

export default function VietnamContent() {
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

          <div className="flex items-start gap-4 mb-8">
            <span className="text-7xl leading-none flex-shrink-0 mt-1">🇻🇳</span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                {t('vn_hero_title')}
              </h1>
              <p className="text-white/50 text-sm mt-2 leading-relaxed">
                {t('vn_hero_sub')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
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
          <h2 className="text-2xl font-bold text-white mb-3">{t('vn_cta_title')}</h2>
          <p className="text-white/55 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            {t('vn_cta_body')}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-7 py-3.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
          >
            {t('vn_cta_btn')}
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
        <SectionHeading label={t('vn_card_summary')} />
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
        <SectionHeading label={t('vn_card_challenges')} />
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
      <SectionHeading label={t('vn_section_plants')} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLANTS.map((plant) => (
          <PlantCard key={plant.name} plant={plant} t={t} />
        ))}
      </div>
    </div>
  )
}

function PlantCard({ plant, t }: { plant: PlantData; t: TFn }) {
  const active = plant.statusVariant === 'active'
  const rows = [
    { label: t('vn_lbl_owner'),      value: t(plant.ownerKey)     },
    { label: t('vn_lbl_technology'), value: t(plant.techKey)      },
    { label: t('vn_lbl_capacity'),   value: t(plant.capacityKey)  },
    { label: t('vn_lbl_completion'), value: t(plant.targetKey)    },
    { label: t('vn_lbl_cur_phase'),  value: t(plant.phaseKey)     },
    { label: t('vn_lbl_milestone'),  value: t(plant.milestoneKey) },
  ]

  return (
    <div className="bg-white rounded-2xl border border-navy/8 p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-navy">{plant.name}</h3>
        <span className={`text-xs font-semibold rounded-full px-3 py-1 ${
          active ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
        }`}>
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
          <span className="text-xs font-medium text-navy/40">{t('vn_lbl_progress')}</span>
          <span className="text-xs font-bold text-navy">{plant.progress}%</span>
        </div>
        <div className="w-full bg-navy/8 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${active ? 'bg-emerald-500' : 'bg-amber-400'}`}
            style={{ width: `${plant.progress}%` }}
          />
        </div>
      </div>

      {/* Partner footer */}
      <div className="pt-1 border-t border-navy/6 flex items-center gap-2.5">
        <span className="text-xl">{plant.partnerFlag}</span>
        <div>
          <p className="text-xs text-navy/40 font-medium">{t('vn_lbl_partner')}</p>
          <p className="text-sm font-semibold text-navy">{t(plant.partnerKey)}</p>
        </div>
      </div>
    </div>
  )
}

function PartnersSection({ t }: { t: TFn }) {
  return (
    <div>
      <SectionHeading label={t('vn_section_partners')} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PARTNERS.map((p) => (
          <PartnerCard key={p.nameKey} partner={p} t={t} />
        ))}
      </div>
    </div>
  )
}

function PartnerCard({ partner, t }: { partner: PartnerData; t: TFn }) {
  const active = partner.statusVariant === 'active'
  return (
    <div className="bg-white rounded-xl border border-navy/8 p-5 flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none">{partner.flag}</span>
          <span className="text-sm font-bold text-navy">{t(partner.nameKey)}</span>
        </div>
        <span className={`flex-shrink-0 text-xs font-semibold rounded-full px-2.5 py-0.5 ${
          active ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
        }`}>
          {t(active ? 'vn_badge_active' : 'vn_badge_negotiation')}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <InfoRow label={t('vn_lbl_role')} value={t(partner.roleKey)} />
        {partner.techKey && (
          <InfoRow label={t('vn_lbl_technology')} value={t(partner.techKey)} />
        )}
        {partner.orgsKey && (
          <InfoRow label={t('vn_lbl_orgs')} value={t(partner.orgsKey)} />
        )}
        <InfoRow label={t('vn_lbl_agreement')} value={t(partner.agreementKey)} />
      </div>
    </div>
  )
}

function WorkforceSection({ t }: { t: TFn }) {
  const stats = [
    { label: t('vn_lbl_wf_target'),  value: t('vn_wf_val_target')   },
    { label: t('vn_lbl_overseas'),   value: t('vn_wf_val_overseas')  },
    { label: t('vn_lbl_trained_ru'), value: t('vn_wf_val_russia')    },
    { label: t('vn_lbl_unis'),       value: t('vn_wf_val_unis')      },
  ]

  return (
    <div>
      <SectionHeading label={t('vn_section_workforce')} />

      {/* Project 1012 card */}
      <div className="bg-white rounded-2xl border border-navy/8 p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-navy">{t('vn_project_1012')}</h3>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
            MOIT
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold text-accent leading-tight">{value}</p>
              <p className="text-xs text-navy/40 mt-1.5 leading-snug">{label}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-navy/40">{t('vn_lbl_progress')}</span>
            <span className="text-xs font-bold text-navy">473 / 4,000</span>
          </div>
          <div className="w-full bg-navy/8 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-accent"
              style={{ width: `${WORKFORCE_PROGRESS}%` }}
            />
          </div>
        </div>
      </div>

      {/* Three stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(['vn_wf_stat1', 'vn_wf_stat2', 'vn_wf_stat3'] as const).map((key) => (
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
      <SectionHeading label={t('vn_section_devs')} />
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
