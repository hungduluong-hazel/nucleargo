import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function deleteDevelopment(id: string) {
  'use server'
  const supabase = await createClient()
  await supabase.from('developments').delete().eq('id', id)
  revalidatePath('/admin/developments')
  redirect('/admin/developments')
}

async function togglePublic(id: string, current: boolean) {
  'use server'
  const supabase = await createClient()
  await supabase.from('developments').update({ is_public: !current }).eq('id', id)
  revalidatePath('/admin/developments')
}

const CATEGORY_STYLES: Record<string, string> = {
  Policy:      'bg-blue-50 text-blue-700',
  Technical:   'bg-emerald-50 text-emerald-700',
  Technology:  'bg-emerald-50 text-emerald-700',
  Finance:     'bg-amber-50 text-amber-700',
  Partnership: 'bg-purple-50 text-purple-700',
}

export default async function AdminDevelopmentsPage() {
  const supabase = await createClient()
  const { data: devs } = await supabase
    .from('developments')
    .select('id, title_en, category, date, is_public, created_at')
    .order('date', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Developments</h1>
          <p className="text-sm text-navy/50 mt-1">{devs?.length ?? 0} total</p>
        </div>
        <Link
          href="/admin/developments/new"
          className="rounded-lg px-4 py-2 text-sm font-semibold bg-navy text-white hover:bg-navy/90 transition-colors"
        >
          + New development
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-navy/8 overflow-hidden">
        {devs && devs.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy/6 bg-navy/2">
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Visibility</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {devs.map((d) => {
                const deleteAction = deleteDevelopment.bind(null, d.id as string)
                const toggleAction = togglePublic.bind(null, d.id as string, d.is_public as boolean)
                const catStyle = CATEGORY_STYLES[(d.category as string) ?? ''] ?? 'bg-navy/6 text-navy/50'
                return (
                  <tr key={d.id as string}>
                    <td className="px-5 py-3 max-w-xs">
                      <p className="font-medium text-navy truncate">{d.title_en as string}</p>
                    </td>
                    <td className="px-5 py-3">
                      {d.category && (
                        <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${catStyle}`}>
                          {d.category as string}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-navy/40">
                      {d.date ? new Date(d.date as string).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${
                        d.is_public ? 'bg-emerald-50 text-emerald-700' : 'bg-navy/6 text-navy/50'
                      }`}>
                        {d.is_public ? 'Public' : 'Tier 2'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/developments/${d.id}/edit`}
                          className="text-xs font-semibold text-accent hover:text-accent/70"
                        >
                          Edit
                        </Link>
                        <form action={toggleAction}>
                          <button type="submit" className="text-xs font-semibold text-navy/50 hover:text-navy transition-colors">
                            {d.is_public ? 'Make Tier 2' : 'Make public'}
                          </button>
                        </form>
                        <form action={deleteAction}>
                          <button
                            type="submit"
                            className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <p className="px-5 py-12 text-sm text-navy/40 text-center">No developments yet.</p>
        )}
      </div>
    </div>
  )
}
