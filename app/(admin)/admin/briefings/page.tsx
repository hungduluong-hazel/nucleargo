import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function togglePublish(id: string, current: boolean) {
  'use server'
  const supabase = await createClient()
  await supabase
    .from('briefings')
    .update({ is_published: !current, published_date: !current ? new Date().toISOString().split('T')[0] : null })
    .eq('id', id)
  revalidatePath('/admin/briefings')
}

async function deleteBriefing(id: string) {
  'use server'
  const supabase = await createClient()
  await supabase.from('briefings').delete().eq('id', id)
  revalidatePath('/admin/briefings')
  redirect('/admin/briefings')
}

export default async function AdminBriefingsPage() {
  const supabase = await createClient()
  const { data: briefings } = await supabase
    .from('briefings')
    .select('id, title_en, summary_en, is_published, published_date, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Briefings</h1>
          <p className="text-sm text-navy/50 mt-1">{briefings?.length ?? 0} total</p>
        </div>
        <Link
          href="/admin/briefings/new"
          className="rounded-lg px-4 py-2 text-sm font-semibold bg-navy text-white hover:bg-navy/90 transition-colors"
        >
          + New briefing
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-navy/8 overflow-hidden">
        {briefings && briefings.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy/6 bg-navy/2">
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {briefings.map((b) => {
                const toggleAction = togglePublish.bind(null, b.id as string, b.is_published as boolean)
                const deleteAction = deleteBriefing.bind(null, b.id as string)
                return (
                  <tr key={b.id as string}>
                    <td className="px-5 py-3 max-w-sm">
                      <p className="font-medium text-navy truncate">{b.title_en as string}</p>
                      {b.summary_en && (
                        <p className="text-xs text-navy/40 truncate mt-0.5">{b.summary_en as string}</p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${
                        b.is_published
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {b.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-navy/40">
                      {b.published_date
                        ? new Date(b.published_date as string).toLocaleDateString()
                        : new Date(b.created_at as string).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/briefings/${b.id}/edit`}
                          className="text-xs font-semibold text-accent hover:text-accent/70"
                        >
                          Edit
                        </Link>
                        <form action={toggleAction}>
                          <button type="submit" className="text-xs font-semibold text-navy/50 hover:text-navy transition-colors">
                            {b.is_published ? 'Unpublish' : 'Publish'}
                          </button>
                        </form>
                        <form action={deleteAction}>
                          <button
                            type="submit"
                            className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors"
                            onClick={(e) => {
                              if (!confirm('Delete this briefing?')) e.preventDefault()
                            }}
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
          <p className="px-5 py-12 text-sm text-navy/40 text-center">No briefings yet. Create the first one.</p>
        )}
      </div>
    </div>
  )
}
