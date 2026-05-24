'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'

const categoryColors: Record<string, string> = {
  Policy:       'bg-blue-50 text-blue-700',
  Technology:   'bg-emerald-50 text-emerald-700',
  Finance:      'bg-amber-50 text-amber-700',
  Regulatory:   'bg-purple-50 text-purple-700',
  'Chính Sách': 'bg-blue-50 text-blue-700',
  'Công Nghệ':  'bg-emerald-50 text-emerald-700',
  'Tài Chính':  'bg-amber-50 text-amber-700',
  'Quy Định':   'bg-purple-50 text-purple-700',
}

export default function LatestDevelopments({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const { t } = useLanguage()

  const developments = [
    {
      date: t('dev1_date'),
      category: t('dev1_category'),
      title: t('dev1_title'),
      body: t('dev1_body'),
    },
    {
      date: t('dev2_date'),
      category: t('dev2_category'),
      title: t('dev2_title'),
      body: t('dev2_body'),
    },
    {
      date: t('dev3_date'),
      category: t('dev3_category'),
      title: t('dev3_title'),
      body: t('dev3_body'),
    },
  ]

  return (
    <section id="program" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-navy">{t('developments_title')}</h2>
          <div className="mt-2 h-1 w-12 rounded bg-accent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {developments.map(({ date, category, title, body }) => (
            <Link
              key={title}
              href={isLoggedIn ? '/developments' : '/register'}
              className="group block rounded-xl border border-navy/8 bg-surface p-6 hover:shadow-md hover:border-navy/20 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    categoryColors[category] ?? 'bg-navy/10 text-navy'
                  }`}
                >
                  {category}
                </span>
                <span className="text-xs text-navy/40">{date}</span>
              </div>
              <h3 className="text-base font-semibold text-navy mb-2 group-hover:text-accent transition-colors leading-snug">
                {title}
              </h3>
              <p className="text-sm text-navy/60 leading-relaxed">{body}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={isLoggedIn ? '/developments' : '/register'}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            View all developments →
          </Link>
        </div>
      </div>
    </section>
  )
}
