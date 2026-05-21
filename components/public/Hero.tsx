'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative bg-navy overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(200,16,46,0.15),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          Nuclear Intelligence Platform
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          {t('hero_headline')}
        </h1>

        <p className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
          {t('hero_sub')}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-7 py-3.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
          >
            {t('hero_cta_register')}
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="#programs"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/25 px-7 py-3.5 text-sm font-semibold text-white hover:border-white/50 hover:bg-white/5 transition-colors"
          >
            {t('hero_cta_programs')}
          </Link>
        </div>
      </div>
    </section>
  )
}
