import { createClient } from '@/lib/supabase/server'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users, count } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, organization, country, role, tier, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Users</h1>
        <p className="text-sm text-navy/50 mt-1">{count ?? 0} registered</p>
      </div>

      <div className="bg-white rounded-xl border border-navy/8 overflow-hidden">
        {users && users.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy/6 bg-navy/2">
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Organization</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Country</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Tier</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {users.map((u) => (
                <tr key={u.id as string}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-navy">
                      {u.first_name && u.last_name
                        ? `${u.first_name} ${u.last_name}`
                        : <span className="text-navy/40 italic">No name</span>}
                    </p>
                    <p className="text-xs text-navy/40">{u.email as string}</p>
                  </td>
                  <td className="px-5 py-3 text-navy/60 text-xs">{(u.organization as string) ?? '—'}</td>
                  <td className="px-5 py-3 text-navy/60 text-xs">{(u.country as string) ?? '—'}</td>
                  <td className="px-5 py-3 text-navy/60 text-xs">{(u.role as string) ?? '—'}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-semibold rounded-full px-2 py-0.5 bg-navy/6 text-navy/50">
                      Tier {u.tier as number}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-navy/40">
                    {u.created_at ? new Date(u.created_at as string).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-5 py-12 text-sm text-navy/40 text-center">No users registered yet.</p>
        )}
      </div>
    </div>
  )
}
