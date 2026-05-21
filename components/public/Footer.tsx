'use client'

import Logo from '@/components/ui/Logo'
import { useLanguage } from '@/lib/i18n/context'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-white/40 text-sm">{t('footer_tagline')}</span>
          </div>
          <p className="text-white/30 text-xs">{t('footer_rights')}</p>
        </div>
      </div>
    </footer>
  )
}
