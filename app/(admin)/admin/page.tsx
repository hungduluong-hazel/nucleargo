import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: userCount },
    { count: briefingCount },
    { count: devCount },
    { count: issueCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('briefings').select('*', { count: 'exact', head: true }),
    supabase.from('developments').select('*', { count: 'exact', head: true }),
    supabase.from('infrastructure_issues').select('*', { count: 'exact', head: true }),
  ])

  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('email, first_name, last_name, organization, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Registered users',     value: userCount ?? 0,    href: '/admin/users' },
    { label: 'Briefings',            value: briefingCount ?? 0, href: '/admin/briefings' },
    { label: 'Developments',         value: devCount ?? 0,      href: '/admin/developments' },
    { label: 'Compliance issues',    value: issueCount ?? 0,    href: '/admin/compliance' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy">Admin Overview</h1>
        <p className="text-sm text-navy/50 mt-1">Manage NuclearGo content and users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-xl border border-navy/8 p-5 hover:border-accent/30 transition-colors"
          >
            <p className="text-3xl font-bold text-navy">{value}</p>
            <p className="text-xs text-navy/45 mt-1.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-bold text-navy mb-4">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/briefings/new"
            className="rounded-lg px-4 py-2 text-sm font-semibold bg-navy text-white hover:bg-navy/90 transition-colors"
          >
            + New briefing
          </Link>
          <Link
            href="/admin/developments/new"
            className="rounded-lg px-4 py-2 text-sm font-semibold bg-white border border-navy/15 text-navy hover:bg-navy/5 transition-colors"
          >
            + New development
          </Link>
          <Link
            href="/admin/compliance"
            className="rounded-lg px-4 py-2 text-sm font-semibold bg-white border border-navy/15 text-navy hover:bg-navy/5 transition-colors"
          >
            Update compliance statuses
          </Link>
        </div>
      </div>

      {/* Recent users */}
      <div>
        <h2 className="text-base font-bold text-navy mb-4">Recent registrations</h2>
        <div className="bg-white rounded-xl border border-navy/8 overflow-hidden">
          {recentUsers && recentUsers.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy/6 bg-navy/2">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Organization</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {recentUsers.map((u) => (
                  <tr key={u.email}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-navy">
                        {u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : u.email}
                      </p>
                      <p className="text-xs text-navy/40">{u.email}</p>
                    </td>
                    <td className="px-5 py-3 text-navy/60">{u.organization ?? '—'}</td>
                    <td className="px-5 py-3 text-navy/40 text-xs">
                      {u.created_at ? new Date(u.created_at as string).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-5 py-8 text-sm text-navy/40 text-center">No users yet</p>
          )}
        </div>
        <Link href="/admin/users" className="text-xs font-semibold text-accent mt-3 inline-block">
          View all users →
        </Link>
      </div>
    </div>
  )
}
