'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import type { TranslationKey } from '@/lib/i18n/en'

type TFn = (key: TranslationKey) => string

type FeaturedCountry = {
  flag: string
  nameKey: TranslationKey
  statusKey: TranslationKey
  plantsKey: TranslationKey
  capacityKey: TranslationKey
  partnerKey: TranslationKey
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
  {
    flag: 'https://flagcdn.com/w40/gh.png',
    nameKey: 'countries_gh_name',
    statusKey: 'countries_gh_status',
    plantsKey: 'countries_gh_plants',
    capacityKey: 'countries_gh_capacity',
    partnerKey: 'countries_gh_partner',
    href: '/countries/ghana',
  },
  {
    flag: 'https://flagcdn.com/w40/ke.png',
    nameKey: 'countries_ke_name',
    statusKey: 'countries_ke_status',
    plantsKey: 'countries_ke_plants',
    capacityKey: 'countries_ke_capacity',
    partnerKey: 'countries_ke_partner',
    href: '/countries/kenya',
  },
  {
    flag: 'https://flagcdn.com/w40/ng.png',
    nameKey: 'countries_ng_name',
    statusKey: 'countries_ng_status',
    plantsKey: 'countries_ng_plants',
    capacityKey: 'countries_ng_capacity',
    partnerKey: 'countries_ng_partner',
    href: '/countries/nigeria',
  },
  {
    flag: 'https://flagcdn.com/w40/id.png',
    nameKey: 'countries_id_name',
    statusKey: 'countries_id_status',
    plantsKey: 'countries_id_plants',
    capacityKey: 'countries_id_capacity',
    partnerKey: 'countries_id_partner',
    href: '/countries/indonesia',
  },
  {
    flag: 'https://flagcdn.com/w40/ph.png',
    nameKey: 'countries_ph_name',
    statusKey: 'countries_ph_status',
    plantsKey: 'countries_ph_plants',
    capacityKey: 'countries_ph_capacity',
    partnerKey: 'countries_ph_partner',
    href: '/countries/philippines',
  },
  {
    flag: 'https://flagcdn.com/w40/bd.png',
    nameKey: 'countries_bd_name',
    statusKey: 'countries_bd_status',
    plantsKey: 'countries_bd_plants',
    capacityKey: 'countries_bd_capacity',
    partnerKey: 'countries_bd_partner',
    href: '/countries/bangladesh',
  },
  {
    flag: 'https://flagcdn.com/w40/kz.png',
    nameKey: 'countries_kz_name',
    statusKey: 'countries_kz_status',
    plantsKey: 'countries_kz_plants',
    capacityKey: 'countries_kz_capacity',
    partnerKey: 'countries_kz_partner',
    href: '/countries/kazakhstan',
  },
  {
    flag: 'https://flagcdn.com/w40/sa.png',
    nameKey: 'countries_sa_name',
    statusKey: 'countries_sa_status',
    plantsKey: 'countries_sa_plants',
    capacityKey: 'countries_sa_capacity',
    partnerKey: 'countries_sa_partner',
    href: '/countries/saudi-arabia',
  },
  {
    flag: 'https://flagcdn.com/w40/tr.png',
    nameKey: 'countries_tr_name',
    statusKey: 'countries_tr_status',
    plantsKey: 'countries_tr_plants',
    capacityKey: 'countries_tr_capacity',
    partnerKey: 'countries_tr_partner',
    href: '/countries/turkey',
  },
  {
    flag: 'https://flagcdn.com/w40/eg.png',
    nameKey: 'countries_eg_name',
    statusKey: 'countries_eg_status',
    plantsKey: 'countries_eg_plants',
    capacityKey: 'countries_eg_capacity',
    partnerKey: 'countries_eg_partner',
    href: '/countries/egypt',
  },
  {
    flag: 'https://flagcdn.com/w40/ua.png',
    nameKey: 'countries_ua_name',
    statusKey: 'countries_ua_status',
    plantsKey: 'countries_ua_plants',
    capacityKey: 'countries_ua_capacity',
    partnerKey: 'countries_ua_partner',
    href: '/countries/ukraine',
  },
  {
    flag: 'https://flagcdn.com/w40/ar.png',
    nameKey: 'countries_ar_name',
    statusKey: 'countries_ar_status',
    plantsKey: 'countries_ar_plants',
    capacityKey: 'countries_ar_capacity',
    partnerKey: 'countries_ar_partner',
    href: '/countries/argentina',
  },
  {
    flag: 'https://flagcdn.com/w40/th.png',
    nameKey: 'countries_th_name',
    statusKey: 'countries_th_status',
    plantsKey: 'countries_th_plants',
    capacityKey: 'countries_th_capacity',
    partnerKey: 'countries_th_partner',
    href: '/countries/thailand',
  },
]

const COMING_SOON: { flag: string; name: string }[] = []

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED.map((c) => (
            <FeaturedCard key={c.href} country={c} t={t} />
          ))}
        </div>

        {/* Coming soon grid */}
        {COMING_SOON.length > 0 && (
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
        )}
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
