import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>
}) {
  const { from = '/', error } = await searchParams

  async function unlock(formData: FormData) {
    'use server'
    const password = formData.get('password') as string
    const expected = process.env.MAINTENANCE_PASSWORD ?? 'nucleargo2024'

    if (password === expected) {
      const cookieStore = await cookies()
      cookieStore.set('nucleargo_access', expected, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })
      redirect(from)
    } else {
      redirect(`/access?from=${encodeURIComponent(from)}&error=1`)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-2xl font-bold text-white tracking-tight">NuclearGo</p>
          <p className="text-white/50 text-sm mt-1">Site under construction</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-lg font-bold text-navy mb-1">Access required</h1>
          <p className="text-sm text-navy/50 mb-6">
            This site is currently private. Enter the password to continue.
          </p>

          <form action={unlock} className="space-y-4">
            <input type="hidden" name="from" value={from} />
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-navy/60 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoFocus
                required
                className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                placeholder="Enter password"
              />
              {error && (
                <p className="mt-1.5 text-xs text-red-600">Incorrect password. Try again.</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
            >
              Enter site
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
