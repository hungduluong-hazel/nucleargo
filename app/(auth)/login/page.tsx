'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useLanguage } from '@/lib/i18n/context'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-navy mb-4">
            <Logo size="sm" />
          </div>
          <h1 className="text-2xl font-bold text-navy">{t('auth_login_title')}</h1>
          <p className="mt-1 text-sm text-navy/50">{t('auth_login_subtitle')}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-navy/8 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label={t('auth_email')}
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@organization.com"
            />
            <Input
              label={t('auth_password')}
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && (
              <p className="text-sm text-accent bg-accent/5 border border-accent/20 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? '...' : t('auth_login_submit')}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-navy/50 mt-6">
          {t('auth_login_link')}{' '}
          <Link href="/register" className="font-semibold text-accent hover:underline">
            {t('auth_login_link_action')}
          </Link>
        </p>
      </div>
    </div>
  )
}
