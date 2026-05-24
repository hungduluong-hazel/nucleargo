'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import type { TranslationKey } from '@/lib/i18n/en'

type TFn = (key: TranslationKey) => string

type FeaturedCountry = {
  flag: string
  nameKey: 'countries_vn_name' | 'countries_pl_name'
  statusKey: 'countries_vn_status' | 'countries_pl_status'
  plantsKey: 'countries_vn_plants' | 'countries_pl_plants'
  capacityKey: 'countries_vn_capacity' | 'countries_pl_capacity'
  partnerKey: 'countries_vn_partner' | 'countries_pl_partner'
  href: string
}

const FEATURED: FeaturedCountry[] = [
  {
    flag: 'https://flagcdn.com/w40/vn.png',
    nameKey: 'countries_vn_name',
    statusKey: 'countries_vn_status',
    plantsKey: 'countries_vn_plants',
    capacityKey: 'countries_vn_capacity',
    partnerKey: 'countries_vn_partner',
    href: '/countries/vietnam',
  },
  {
    flag: 'https://flagcdn.com/w40/pl.png',
    nameKey: 'countries_pl_name',
    statusKey: 'countries_pl_status',
    plantsKey: 'countries_pl_plants',
    capacityKey: 'countries_pl_capacity',
    partnerKey: 'countries_pl_partner',
    href: '/countries/poland',
  },
]

const COMING_SOON = [
  { flag: 'https://flagcdn.com/w40/gh.png', name: 'Ghana' },
  { flag: 'https://flagcdn.com/w40/ke.png', name: 'Kenya' },
  { flag: 'https://flagcdn.com/w40/ng.png', name: 'Nigeria' },
  { flag: 'https://flagcdn.com/w40/id.png', name: 'Indonesia' },
  { flag: 'https://flagcdn.com/w40/ph.png', name: 'Philippines' },
  { flag: 'https://flagcdn.com/w40/sa.png', name: 'Saudi Arabia' },
  { flag: 'https://flagcdn.com/w40/bd.png', name: 'Bangladesh' },
  { flag: 'https://flagcdn.com/w40/tr.png', name: 'Turkey' },
  { flag: 'https://flagcdn.com/w40/eg.png', name: 'Egypt' },
]

export default function CountriesContent() {
  const { t } = useLanguage()

  return (
    <div className="flex-1 bg-surface">
      {/* Page header */}
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-16 md:pt-20 md:pb-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              {t('countries_page_title')}
            </h1>
            <p className="text-base text-white/55 max-w-2xl mx-auto leading-relaxed">
              {t('countries_page_subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Featured country cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURED.map((c) => (
            <FeaturedCard key={c.href} country={c} t={t} />
          ))}
        </div>

        {/* Coming soon grid */}
        <div>
          <h2 className="text-sm font-semibold text-navy/50 uppercase tracking-wider mb-5">
            {t('countries_more_title')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {COMING_SOON.map(({ flag, name }) => (
              <div
                key={name}
                className="bg-white rounded-xl border border-navy/8 px-4 py-5 flex flex-col items-center gap-2.5 text-center"
              >
                <img src={flag} alt={name} className="w-10 h-auto mx-auto mb-2" />
                <p className="text-sm font-semibold text-navy leading-snug">{name}</p>
                <span className="text-xs font-medium text-navy/40 bg-navy/5 rounded-full px-2.5 py-0.5">
                  {t('countries_coming_soon_badge')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FeaturedCard({ country, t }: { country: FeaturedCountry; t: TFn }) {
  return (
    <Link
      href={country.href}
      className="group bg-white rounded-2xl border border-navy/8 p-6 flex flex-col gap-5 hover:shadow-md hover:border-navy/20 transition-all"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src={country.flag} alt={t(country.nameKey)} className="w-8 h-auto" />
          <div>
            <p className="text-lg font-bold text-navy leading-tight">
              {t(country.nameKey)}
            </p>
            <p className="text-xs text-navy/45 mt-0.5">{t(country.statusKey)}</p>
          </div>
        </div>
        <span className="flex-shrink-0 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
          {t('countries_iaea_phase2')}
        </span>
      </div>

      {/* Detail rows */}
      <div className="flex flex-col gap-2.5">
        <DetailRow label={t('countries_plants_label')} value={t(country.plantsKey)} />
        <DetailRow label={t('countries_capacity_label')} value={t(country.capacityKey)} />
        <DetailRow label={t('countries_partner_label')} value={t(country.partnerKey)} />
      </div>

      {/* CTA */}
      <div className="pt-1 border-t border-navy/6">
        <span className="text-sm font-semibold text-accent group-hover:underline">
          {t('countries_view_profile')}
        </span>
      </div>
    </Link>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-xs font-medium text-navy/40 w-28 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-navy">{value}</span>
    </div>
  )
}
