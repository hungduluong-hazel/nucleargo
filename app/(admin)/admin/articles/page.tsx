import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function togglePublish(id: string, current: boolean) {
  'use server'
  const supabase = await createClient()
  await supabase
    .from('articles')
    .update({ is_published: !current, published_date: !current ? new Date().toISOString().split('T')[0] : null })
    .eq('id', id)
  revalidatePath('/admin/articles')
}

async function deleteArticle(id: string) {
  'use server'
  const supabase = await createClient()
  await supabase.from('articles').delete().eq('id', id)
  revalidatePath('/admin/articles')
  redirect('/admin/articles')
}

export default async function AdminArticlesPage() {
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, is_published, ai_generated, review_status, published_date, read_time_mins, created_at')
    .order('created_at', { ascending: false })

  const published = articles?.filter(a => a.is_published).length ?? 0
  const drafts    = articles?.filter(a => !a.is_published).length ?? 0
  const pending   = articles?.filter(a => a.review_status === 'pending').length ?? 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Articles</h1>
          <p className="text-sm text-navy/50 mt-1">
            {published} published · {drafts} drafts{pending > 0 ? ` · ${pending} pending review` : ''}
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="rounded-lg px-4 py-2 text-sm font-semibold bg-navy text-white hover:bg-navy/90 transition-colors"
        >
          + New article
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-navy/8 overflow-hidden">
        {articles && articles.length > 0 ? (
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col style={{width: '45%'}} />
              <col style={{width: '12%'}} />
              <col style={{width: '12%'}} />
              <col style={{width: '31%'}} />
            </colgroup>
            <thead>
              <tr className="border-b border-navy/6 bg-navy/2">
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {articles.map((a) => {
                const toggleAction = togglePublish.bind(null, a.id as string, a.is_published as boolean)
                const deleteAction = deleteArticle.bind(null, a.id as string)
                return (
                  <tr key={a.id as string}>
                    <td className="px-5 py-3 overflow-hidden">
                      <div className="flex items-center gap-2 min-w-0">
                        {a.ai_generated && (
                          <span className="text-xs font-bold text-accent flex-shrink-0">AI</span>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-navy truncate">{a.title as string}</p>
                          <p className="text-xs text-navy/35 font-mono truncate">/articles/{a.slug as string}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {a.review_status === 'pending' ? (
                        <span className="text-xs font-semibold rounded-full px-2.5 py-0.5 bg-amber-50 text-amber-700">
                          Pending review
                        </span>
                      ) : (
                        <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${
                          a.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-navy/6 text-navy/50'
                        }`}>
                          {a.is_published ? 'Published' : 'Draft'}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-navy/40">
                      {a.published_date
                        ? new Date(a.published_date as string).toLocaleDateString()
                        : new Date(a.created_at as string).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/articles/${a.id}/edit`} className="text-xs font-semibold text-accent hover:text-accent/70">
                          Edit
                        </Link>
                        {a.review_status !== 'pending' && (
                          <form action={toggleAction}>
                            <button type="submit" className="text-xs font-semibold text-navy/50 hover:text-navy transition-colors">
                              {a.is_published ? 'Unpublish' : 'Publish'}
                            </button>
                          </form>
                        )}
                        <Link
                          href={`/articles/${a.slug}`}
                          target="_blank"
                          className="text-xs font-semibold text-navy/35 hover:text-navy transition-colors"
                        >
                          Preview
                        </Link>
                        <form action={deleteAction}>
                          <button type="submit" className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors">
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
          <p className="px-5 py-12 text-sm text-navy/40 text-center">No articles yet. Create one or wait for the monthly AI task.</p>
        )}
      </div>
    </div>
  )
}
