import { redirect } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase/server'

const NAV_ITEMS = [
  { href: '/dashboard',   label: 'Dashboard',        icon: '⊞' },
  { href: '/tracker',     label: 'Program Tracker',  icon: '📡' },
  { href: '/countries',   label: 'Countries',        icon: '🌍' },
  { href: '/compliance',  label: 'IAEA Compliance',  icon: '✅' },
  { href: '/workforce',   label: 'Workforce',        icon: '🎓' },
  { href: '/briefings',   label: 'Briefings',        icon: '📋' },
  { href: '/profile',     label: 'Profile',          icon: '👤' },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single()

  const displayName = profile?.first_name && profile?.last_name
    ? `${profile.first_name} ${profile.last_name}`
    : user.email ?? 'User'

  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-navy flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-white/10">
          <Link href="/">
            <Logo size="md" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon }) => (
            <NavLink key={href} href={href} label={label} icon={icon} />
          ))}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
            <div className="h-8 w-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{displayName}</p>
              <p className="text-xs text-white/35 truncate">{user.email}</p>
            </div>
          </div>
          <form action="/auth/signout" method="post" className="mt-1">
            <button
              type="submit"
              className="w-full text-left px-2 py-1.5 text-xs text-white/35 hover:text-white/70 transition-colors rounded"
            >
              Sign out →
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  )
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/55 hover:text-white hover:bg-white/8 text-sm font-medium transition-colors"
    >
      <span className="text-sm w-4 text-center">{icon}</span>
      {label}
    </Link>
  )
}
