'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/components/ui/Logo'
import { useLanguage } from '@/lib/i18n/context'
import { createClient } from '@/lib/supabase/client'

interface NavbarProps {
  isLoggedIn?: boolean
}

export default function Navbar({ isLoggedIn = false }: NavbarProps) {
  const { t, lang, setLang } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  const navLinks = [
    { key: 'nav_program'       as const, href: '#program' },
    { key: 'nav_countries'     as const, href: '#countries' },
    { key: 'nav_organizations' as const, href: '#organizations' },
  ]

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-navy shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                className="text-sm font-medium text-white/80 hover:text-accent transition-colors"
              >
                {t(key)}
              </a>
            ))}
          </nav>

          {/* Desktop right section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex items-center rounded-md border border-white/20 overflow-hidden text-xs font-semibold">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 transition-colors ${
                  lang === 'en' ? 'bg-accent text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                EN
              </button>
              <span className="w-px h-4 bg-white/20" />
              <button
                onClick={() => setLang('vi')}
                className={`px-3 py-1.5 transition-colors ${
                  lang === 'vi' ? 'bg-accent text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                VI
              </button>
            </div>

            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-white/80 hover:text-white border border-white/30 rounded-md px-4 py-1.5 transition-colors hover:border-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-white bg-accent hover:bg-accent/90 rounded-md px-4 py-1.5 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-white/80 hover:text-white border border-white/30 rounded-md px-4 py-1.5 transition-colors hover:border-white"
                >
                  {t('nav_login')}
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold text-white bg-accent hover:bg-accent/90 rounded-md px-4 py-1.5 transition-colors"
                >
                  {t('nav_register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-white mb-1" />
            <span className="block w-5 h-0.5 bg-white mb-1" />
            <span className="block w-5 h-0.5 bg-white" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          {navLinks.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              className="text-sm font-medium text-white/80 hover:text-accent"
              onClick={() => setMenuOpen(false)}
            >
              {t(key)}
            </a>
          ))}

          <div className="flex gap-3 pt-2">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex-1 text-center text-sm font-medium text-white border border-white/30 rounded-md px-4 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout() }}
                  className="flex-1 text-center text-sm font-semibold text-white bg-accent rounded-md px-4 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex-1 text-center text-sm font-medium text-white border border-white/30 rounded-md px-4 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('nav_login')}
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center text-sm font-semibold text-white bg-accent rounded-md px-4 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('nav_register')}
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-white/50 font-medium">Language:</span>
            <button
              onClick={() => setLang('en')}
              className={`text-xs px-2 py-1 rounded ${lang === 'en' ? 'bg-accent text-white' : 'text-white/60'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('vi')}
              className={`text-xs px-2 py-1 rounded ${lang === 'vi' ? 'bg-accent text-white' : 'text-white/60'}`}
            >
              VI
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
