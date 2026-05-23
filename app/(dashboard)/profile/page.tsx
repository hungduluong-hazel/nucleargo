'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/context'

// ─── Types ────────────────────────────────────────────────────────────────────

type Profile = {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  organization: string | null
  country: string | null
  role: string | null
  preferred_lang: string | null   // matches DB column name
  created_at: string | null
}

type AuthUser = {
  id: string
  email: string
  last_sign_in_at?: string | null
  user_metadata: Record<string, string>
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLES = [
  'Engineer',
  "Owner's Engineer",
  'Project Manager',
  'Consultant / Advisor',
  'Regulator',
  'Government Official',
  'Researcher / Academic',
  'International Organization',
  'Other',
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getInitials(firstName: string | null, lastName: string | null, email: string): string {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase()
  if (firstName) return firstName[0].toUpperCase()
  return email[0].toUpperCase()
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { lang, setLang } = useLanguage()

  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [profile,  setProfile]  = useState<Profile | null>(null)
  const [loading,  setLoading]  = useState(true)

  const [form, setForm] = useState({
    first_name:    '',
    last_name:     '',
    organization:  '',
    country:       '',
    role:          '',
    preferred_lang: 'en',
  })

  const [saving,      setSaving]      = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError,   setSaveError]   = useState('')
  const [resetSent,   setResetSent]   = useState(false)
  const [resetError,  setResetError]  = useState('')

  // ── Load data (with fallback upsert for users missing a profile row) ──────

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const au: AuthUser = {
        id:              user.id,
        email:           user.email ?? '',
        last_sign_in_at: user.last_sign_in_at,
        user_metadata:   (user.user_metadata ?? {}) as Record<string, string>,
      }
      setAuthUser(au)

      // 1. Try to fetch existing profile row
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, organization, country, role, preferred_lang, created_at')
        .eq('id', user.id)
        .single()

      let profileData: Profile | null = data as Profile | null

      // 2. If not found, upsert from auth metadata (trigger may not have fired)
      if (fetchError?.code === 'PGRST116' || !profileData) {
        const meta = au.user_metadata
        const { data: upserted } = await supabase
          .from('profiles')
          .upsert({
            id:           user.id,
            email:        user.email,
            first_name:   meta.first_name   ?? null,
            last_name:    meta.last_name    ?? null,
            organization: meta.organization ?? null,
            country:      meta.country      ?? null,
            role:         meta.role         ?? null,
            tier:         2,
          })
          .select('id, email, first_name, last_name, organization, country, role, preferred_lang, created_at')
          .single()

        profileData = upserted as Profile | null
      }

      if (profileData) {
        setProfile(profileData)
        const savedLang = (profileData.preferred_lang ?? lang) as 'en' | 'vi'
        setLang(savedLang)
        setForm({
          first_name:    profileData.first_name   ?? '',
          last_name:     profileData.last_name    ?? '',
          organization:  profileData.organization ?? '',
          country:       profileData.country      ?? '',
          role:          profileData.role         ?? '',
          preferred_lang: savedLang,
        })
      }

      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Handlers ─────────────────────────────────────────────────────────────

  function updateField(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value
      setForm((prev) => ({ ...prev, [field]: value }))
      if (field === 'preferred_lang') setLang(value as 'en' | 'vi')
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!authUser) return
    setSaving(true)
    setSaveError('')
    setSaveSuccess(false)

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name:    form.first_name,
        last_name:     form.last_name,
        organization:  form.organization,
        country:       form.country,
        role:          form.role,
        preferred_lang: form.preferred_lang,
      })
      .eq('id', authUser.id)

    setSaving(false)
    if (error) {
      setSaveError(error.message)
    } else {
      setProfile((prev) => prev ? { ...prev, ...form } : prev)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 4000)
    }
  }

  async function handleLangToggle(newLang: 'en' | 'vi') {
    setLang(newLang)
    setForm((prev) => ({ ...prev, preferred_lang: newLang }))
    if (!authUser) return
    const supabase = createClient()
    await supabase
      .from('profiles')
      .update({ preferred_lang: newLang })
      .eq('id', authUser.id)
  }

  async function handlePasswordReset() {
    if (!authUser?.email) return
    setResetError('')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(authUser.email)
    if (error) {
      setResetError(error.message)
    } else {
      setResetSent(true)
    }
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl animate-pulse">
        <div className="h-8 bg-navy/8 rounded-lg w-48" />
        <div className="bg-white rounded-2xl border border-navy/8 p-6 h-32" />
        <div className="bg-white rounded-2xl border border-navy/8 p-6 h-72" />
      </div>
    )
  }

  if (!authUser) return null

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || authUser.email
  const initials = getInitials(profile?.first_name ?? null, profile?.last_name ?? null, authUser.email)

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-2xl">
      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-bold text-navy">My Profile</h1>
        <p className="text-sm text-navy/50 mt-1">Manage your account and preferences</p>
      </div>

      {/* ── Profile summary card ── */}
      <div className="bg-white rounded-2xl border border-navy/8 p-6">
        <div className="flex items-center gap-5">
          <div className="flex-shrink-0 h-20 w-20 rounded-full bg-navy flex items-center justify-center text-white text-2xl font-bold select-none">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy leading-tight">{fullName}</h2>
            <p className="text-sm text-navy/50 mt-0.5">{authUser.email}</p>
            <div className="flex items-center flex-wrap gap-2 mt-2.5">
              <span className="text-xs font-semibold bg-blue-50 text-blue-700 rounded-full px-2.5 py-0.5">
                Tier 2 — Professional
              </span>
              {profile?.created_at && (
                <span className="text-xs text-navy/40">
                  Member since {formatDate(profile.created_at)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit profile form ── */}
      <div className="bg-white rounded-2xl border border-navy/8 p-6">
        <h3 className="text-base font-bold text-navy mb-6">Personal Information</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First Name">
              <input
                type="text"
                value={form.first_name}
                onChange={updateField('first_name')}
                placeholder="Jane"
                className={INPUT_CLS}
              />
            </Field>
            <Field label="Last Name">
              <input
                type="text"
                value={form.last_name}
                onChange={updateField('last_name')}
                placeholder="Smith"
                className={INPUT_CLS}
              />
            </Field>
          </div>

          <Field label="Organization">
            <input
              type="text"
              value={form.organization}
              onChange={updateField('organization')}
              placeholder="IAEA, Rosatom, VNAPN…"
              className={INPUT_CLS}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Country">
              <input
                type="text"
                value={form.country}
                onChange={updateField('country')}
                placeholder="Vietnam"
                className={INPUT_CLS}
              />
            </Field>
            <Field label="Role">
              <select value={form.role} onChange={updateField('role')} className={INPUT_CLS}>
                <option value="">Select role</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Preferred Language">
            <select value={form.preferred_lang} onChange={updateField('preferred_lang')} className={INPUT_CLS}>
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
            </select>
          </Field>

          {saveSuccess && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
              Profile saved successfully.
            </p>
          )}
          {saveError && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              {saveError}
            </p>
          )}

          <div className="pt-1">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy/90 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Account information ── */}
      <div className="bg-white rounded-2xl border border-navy/8 p-6">
        <h3 className="text-base font-bold text-navy mb-5">Account Information</h3>
        <div className="space-y-3.5">
          <InfoRow label="Email address" value={authUser.email} />
          <InfoRow label="Account tier"  value="Tier 2 — Professional" />
          <InfoRow label="Member since"  value={formatDate(profile?.created_at)} />
        </div>
        <p className="text-xs text-navy/35 mt-5 pt-4 border-t border-navy/6">
          To upgrade to an Organization Workspace, contact us
        </p>
      </div>

      {/* ── Language preference ── */}
      <div className="bg-white rounded-2xl border border-navy/8 p-6">
        <h3 className="text-base font-bold text-navy mb-5">Language Preference</h3>
        <div className="flex gap-3">
          <LangButton active={lang === 'en'} onClick={() => handleLangToggle('en')} flag="🇬🇧" label="English"     sub="EN" />
          <LangButton active={lang === 'vi'} onClick={() => handleLangToggle('vi')} flag="🇻🇳" label="Tiếng Việt" sub="VI" />
        </div>
      </div>

      {/* ── Security ── */}
      <div className="bg-white rounded-2xl border border-navy/8 p-6">
        <h3 className="text-base font-bold text-navy mb-5">Security</h3>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-navy">Password</p>
            <p className="text-xs text-navy/45 mt-0.5">Send a reset link to your email address</p>
          </div>
          <button
            onClick={handlePasswordReset}
            disabled={resetSent}
            className="flex-shrink-0 rounded-lg border border-navy/20 px-4 py-2 text-sm font-semibold text-navy hover:bg-navy/5 disabled:opacity-50 transition-colors"
          >
            {resetSent ? 'Email sent ✓' : 'Send Password Reset Email'}
          </button>
        </div>

        {resetSent && (
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 mt-4">
            Password reset email sent to {authUser.email}
          </p>
        )}
        {resetError && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mt-4">
            {resetError}
          </p>
        )}

        {authUser.last_sign_in_at && (
          <p className="text-xs text-navy/30 mt-5 pt-4 border-t border-navy/6">
            Last sign in: {formatDate(authUser.last_sign_in_at)}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Shared input class ────────────────────────────────────────────────────────

const INPUT_CLS =
  'w-full rounded-lg border border-navy/20 bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-shadow'

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-navy/55 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="text-xs font-medium text-navy/40 w-32 flex-shrink-0 pt-px">{label}</span>
      <span className="text-sm font-medium text-navy">{value}</span>
    </div>
  )
}

function LangButton({
  active, onClick, flag, label, sub,
}: {
  active: boolean; onClick: () => void; flag: string; label: string; sub: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-2 rounded-xl border-2 py-5 px-4 transition-colors ${
        active
          ? 'border-navy bg-navy text-white'
          : 'border-navy/12 bg-surface text-navy hover:border-navy/30'
      }`}
    >
      <span className="text-2xl leading-none">{flag}</span>
      <span className="text-sm font-bold">{label}</span>
      <span className={`text-xs font-semibold ${active ? 'text-white/60' : 'text-navy/40'}`}>{sub}</span>
    </button>
  )
}
