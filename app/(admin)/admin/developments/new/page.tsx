import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const CATEGORIES = ['Policy', 'Technical', 'Finance', 'Partnership', 'Safety', 'Workforce']

async function createDevelopment(formData: FormData) {
  'use server'
  const supabase = await createClient()

  await supabase.from('developments').insert({
    title_en:   formData.get('title_en') as string,
    body_en:    (formData.get('body_en') as string) || null,
    category:   (formData.get('category') as string) || null,
    date:       (formData.get('date') as string) || null,
    source:     (formData.get('source') as string) || null,
    source_url: (formData.get('source_url') as string) || null,
    is_public:  formData.get('is_public') === 'on',
  })

  redirect('/admin/developments')
}

export default function NewDevelopmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">New Development</h1>
        <p className="text-sm text-navy/50 mt-1">Add a news item or program update</p>
      </div>

      <form action={createDevelopment} className="space-y-5">
        <div className="bg-white rounded-xl border border-navy/8 p-6 space-y-5">

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              name="title_en"
              required
              className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent"
              placeholder="e.g. Korea Eximbank Signs NT2 Financing Agreement"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Category</label>
              <select
                name="category"
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
                className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Body</label>
            <textarea
              name="body_en"
              rows={6}
              className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent resize-y"
              placeholder="Full details of the development..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Source name</label>
              <input
                name="source"
                className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent"
                placeholder="e.g. Reuters, IAEA"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Source URL</label>
              <input
                name="source_url"
                type="url"
                className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-navy/6">
            <input
              name="is_public"
              type="checkbox"
              id="is_public"
              className="w-4 h-4 rounded border-navy/30 text-accent"
            />
            <label htmlFor="is_public" className="text-sm font-semibold text-navy">
              Visible to public (Tier 1)
            </label>
            <span className="text-xs text-navy/40 ml-1">— unchecked = Tier 2 registered users only</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg px-5 py-2.5 text-sm font-semibold bg-navy text-white hover:bg-navy/90 transition-colors"
          >
            Save development
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
