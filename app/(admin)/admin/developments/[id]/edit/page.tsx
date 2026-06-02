import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'

const CATEGORIES = ['Policy', 'Technical', 'Finance', 'Partnership', 'Safety', 'Workforce']

async function updateDevelopment(id: string, formData: FormData) {
  'use server'
  const supabase = await createClient()

  await supabase.from('developments').update({
    title_en:   formData.get('title_en') as string,
    body_en:    (formData.get('body_en') as string) || null,
    category:   (formData.get('category') as string) || null,
    date:       (formData.get('date') as string) || null,
    source:     (formData.get('source') as string) || null,
    source_url: (formData.get('source_url') as string) || null,
    is_public:  formData.get('is_public') === 'on',
  }).eq('id', id)

  redirect('/admin/developments')
}

export default async function EditDevelopmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: d } = await supabase
    .from('developments')
    .select('*')
    .eq('id', id)
    .single()

  if (!d) notFound()

  const action = updateDevelopment.bind(null, id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Edit Development</h1>
        <p className="text-sm text-navy/50 mt-1 truncate">{d.title_en as string}</p>
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
              defaultValue={d.title_en as string}
              className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Category</label>
              <select
                name="category"
                defaultValue={(d.category as string) ?? ''}
                className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent"
              >
                <option value="">— Select —</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Date</label>
              <input
                name="date"
                type="date"
                defaultValue={(d.date as string) ?? ''}
                className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Body</label>
            <textarea
              name="body_en"
              rows={6}
              defaultValue={(d.body_en as string) ?? ''}
              className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Source name</label>
              <input
                name="source"
                defaultValue={(d.source as string) ?? ''}
                className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Source URL</label>
              <input
                name="source_url"
                type="url"
                defaultValue={(d.source_url as string) ?? ''}
                className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-navy/6">
            <input
              name="is_public"
              type="checkbox"
              id="is_public"
              defaultChecked={d.is_public as boolean}
              className="w-4 h-4 rounded border-navy/30 text-accent"
            />
            <label htmlFor="is_public" className="text-sm font-semibold text-navy">
              Visible to public (Tier 1)
            </label>
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
            href="/admin/developments"
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-navy/50 hover:text-navy transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
