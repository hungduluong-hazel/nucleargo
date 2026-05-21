'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useLanguage } from '@/lib/i18n/context'
import { createClient } from '@/lib/supabase/client'

const ROLES = [
  'Engineer',
  'Project Manager',
  "Owner's Engineer",
  'Consultant / Advisor',
  'Regulator',
  'Government Official',
  'Researcher / Academic',
  'International Organization',
  'Other',
]

export default function RegisterPage() {
  const { t } = useLanguage()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    organization: '',
    country: '',
    role: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            first_name: form.firstName,
            last_name: form.lastName,
            organization: form.organization,
            country: form.country,
            role: form.role,
          },
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl mb-6">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-navy mb-2">{t('auth_check_email')}</h2>
          <p className="text-navy/60 text-sm leading-relaxed">{t('auth_check_email_body')}</p>
          <div className="mt-6">
            <Link href="/login" className="text-sm font-semibold text-accent hover:underline">
              {t('auth_login_submit')} →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-navy mb-4">
            <Logo size="sm" />
          </div>
          <h1 className="text-2xl font-bold text-navy">{t('auth_register_title')}</h1>
          <p className="mt-1 text-sm text-navy/50">{t('auth_register_subtitle')}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-navy/8 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('auth_first_name')}
                id="firstName"
                type="text"
                required
                value={form.firstName}
                onChange={update('firstName')}
                placeholder="Jane"
              />
              <Input
                label={t('auth_last_name')}
                id="lastName"
                type="text"
                required
                value={form.lastName}
                onChange={update('lastName')}
                placeholder="Smith"
              />
            </div>

            <Input
              label={t('auth_email')}
              id="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={update('email')}
              placeholder="you@organization.com"
            />

            <Input
              label={t('auth_password')}
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              value={form.password}
              onChange={update('password')}
              placeholder="Minimum 12 characters"
            />

            <Input
              label={t('auth_organization')}
              id="organization"
              type="text"
              required
              value={form.organization}
              onChange={update('organization')}
              placeholder="IAEA, Rosatom, VNAPN..."
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('auth_country')}
                id="country"
                type="text"
                required
                value={form.country}
                onChange={update('country')}
                placeholder="Vietnam"
              />

              {/* Role select */}
              <div className="flex flex-col gap-1">
                <label htmlFor="role" className="text-sm font-medium text-navy/80">
                  {t('auth_role')}
                </label>
                <select
                  id="role"
                  required
                  value={form.role}
                  onChange={update('role')}
                  className="w-full rounded-md border border-navy/20 bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
                >
                  <option value="" disabled>
                    Select role
                  </option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <p className="text-sm text-accent bg-accent/5 border border-accent/20 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="secondary"
              fullWidth
              disabled={loading}
            >
              {loading ? '...' : t('auth_register_submit')}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-navy/50 mt-6">
          {t('auth_register_link')}{' '}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            {t('auth_register_link_action')}
          </Link>
        </p>
      </div>
    </div>
  )
}
