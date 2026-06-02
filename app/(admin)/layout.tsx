import { redirect } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'hungduluong@gmail.com'

const NAV_ITEMS = [
  { href: '/admin',              label: 'Overview',      icon: '⊞' },
  { href: '/admin/review',       label: 'AI Review',     icon: '✦' },
  { href: '/admin/briefings',    label: 'Briefings',     icon: '📋' },
  { href: '/admin/developments', label: 'Developments',  icon: '📰' },
  { href: '/admin/compliance',   label: 'Compliance',    icon: '✅' },
  { href: '/admin/users',        label: 'Users',         icon: '👥' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  if (user.email !== ADMIN_EMAIL) {
    redirect('/dashboard')
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-navy flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-white/10">
          <Link href="/">
            <Logo size="md" />
          </Link>
        </div>

        {/* Admin badge */}
        <div className="px-4 py-3 border-b border-white/10">
          <span className="text-xs font-bold text-accent uppercase tracking-widest">Admin</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/55 hover:text-white hover:bg-white/8 text-sm font-medium transition-colors"
            >
              <span className="text-sm w-4 text-center">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-2 py-1.5 text-xs text-white/35 hover:text-white/70 transition-colors rounded"
          >
            ← Back to dashboard
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full text-left px-2 py-1.5 text-xs text-white/35 hover:text-white/70 transition-colors rounded"
            >
              Sign out →
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  )
}
