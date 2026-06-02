import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'

async function updateBriefing(id: string, formData: FormData) {
  'use server'
  const supabase = await createClient()

  const title_en       = formData.get('title_en') as string
  const summary_en     = formData.get('summary_en') as string
  const body_en        = formData.get('body_en') as string
  const is_published   = formData.get('is_published') === 'on'
  const published_date = formData.get('published_date') as string || null

  await supabase.from('briefings').update({
    title_en,
    summary_en: summary_en || null,
    body_en: body_en || null,
    is_published,
    published_date: is_published && published_date ? published_date : null,
  }).eq('id', id)

  redirect('/admin/briefings')
}

export default async function EditBriefingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: b } = await supabase
    .from('briefings')
    .select('*')
    .eq('id', id)
    .single()

  if (!b) notFound()

  const action = updateBriefing.bind(null, id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Edit Briefing</h1>
        <p className="text-sm text-navy/50 mt-1 truncate">{b.title_en as string}</p>
      </div>

      <form action={action} className="space-y-5">
        <div className="bg-white rounded-xl border border-navy/8 p-6 space-y-5">

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              name="title_en"
              required
              defaultValue={b.title_en as string}
              className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Summary</label>
            <textarea
              name="summary_en"
              rows={3}
              defaultValue={(b.summary_en as string) ?? ''}
              className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Body</label>
            <textarea
              name="body_en"
              rows={20}
              defaultValue={(b.body_en as string) ?? ''}
              className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent resize-y font-mono"
            />
            <p className="text-xs text-navy/40 mt-1.5">Markdown is supported for formatting.</p>
          </div>

          <div className="flex items-center gap-6 pt-2 border-t border-navy/6">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Publish date</label>
              <input
                name="published_date"
                type="date"
                defaultValue={(b.published_date as string) ?? ''}
                className="rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center gap-2 mt-5">
              <input
                name="is_published"
                type="checkbox"
                id="is_published"
                defaultChecked={b.is_published as boolean}
                className="w-4 h-4 rounded border-navy/30 text-accent"
              />
              <label htmlFor="is_published" className="text-sm font-semibold text-navy">
                Published
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg px-5 py-2.5 text-sm font-semibold bg-navy text-white hover:bg-navy/90 transition-colors"
          >
            Save changes
          </button>
          <a
            href="/admin/briefings"
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-navy/50 hover:text-navy transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
