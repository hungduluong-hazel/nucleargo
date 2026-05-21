'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'

interface Props {
  flag: string
  countryName: string
}

export default function CountryDetailPlaceholder({ flag, countryName }: Props) {
  const { t } = useLanguage()

  return (
    <main className="flex-1 bg-surface">
      {/* Country hero bar */}
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <Link
            href="/countries"
            className="inline-flex items-center text-xs font-medium text-white/40 hover:text-white/70 transition-colors mb-5"
          >
            {t('countries_back')}
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl leading-none">{flag}</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{countryName}</h1>
          </div>
        </div>
      </div>

      {/* Coming-soon body */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy/8 text-3xl mb-6">
            🔬
          </div>
          <h2 className="text-xl font-bold text-navy mb-3">
            {t('countries_detail_coming_soon_title')}
          </h2>
          <p className="text-navy/50 text-sm leading-relaxed">
            {t('countries_detail_coming_soon_body')}
          </p>
          <Link
            href="/countries"
            className="inline-flex items-center mt-8 text-sm font-semibold text-accent hover:underline"
          >
            {t('countries_back')}
          </Link>
        </div>
      </div>
    </main>
  )
}
