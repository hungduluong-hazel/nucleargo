'use client'

import { useLanguage } from '@/lib/i18n/context'

export default function MetricCards() {
  const { t } = useLanguage()

  const metrics = [
    {
      value: t('metrics_countries_value'),
      label: t('metrics_countries_label'),
      icon: '🌍',
    },
    {
      value: t('metrics_programs_value'),
      label: t('metrics_programs_label'),
      icon: '⚡',
    },
    {
      value: t('metrics_iaea_value'),
      label: t('metrics_iaea_label'),
      icon: '🔬',
    },
  ]

  return (
    <section className="bg-surface py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {metrics.map(({ value, label, icon }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-navy/8 p-8 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <div className="text-4xl font-bold text-accent mb-2">{value}</div>
              <div className="text-sm font-medium text-navy/70">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
