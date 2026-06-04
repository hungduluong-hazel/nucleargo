import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function createArticle(formData: FormData) {
  'use server'
  const supabase   = await createClient()
  const title      = formData.get('title') as string
  const body       = formData.get('body') as string
  const wordCount  = body ? body.split(/\s+/).length : 0
  const readTime   = Math.max(1, Math.round(wordCount / 200))

  await supabase.from('articles').insert({
    title,
    slug:             slugify(title),
    excerpt:          (formData.get('excerpt') as string) || null,
    body:             body || null,
    meta_description: (formData.get('meta_description') as string) || null,
    keywords:         (formData.get('keywords') as string) || null,
    author:           (formData.get('author') as string) || 'NuclearGo Editorial',
    published_date:   (formData.get('published_date') as string) || null,
    read_time_mins:   readTime,
    is_published:     formData.get('is_published') === 'on',
    review_status:    'approved',
  })
  redirect('/admin/articles')
}

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">New Article</h1>
        <p className="text-sm text-navy/50 mt-1">Create an SEO-optimized article for the knowledge hub</p>
      </div>

      <form action={createArticle} className="space-y-5">
        <div className="bg-white rounded-xl border border-navy/8 p-6 space-y-5">

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Title <span className="text-red-400">*</span></label>
            <input name="title" required className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent" placeholder="e.g. Vietnam's Nuclear Restart: What It Means for the Region" />
            <p className="text-xs text-navy/35 mt-1">The slug (URL) will be auto-generated from the title.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Excerpt</label>
            <textarea name="excerpt" rows={2} className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent resize-y" placeholder="1-2 sentence summary shown in article listings" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Meta description <span className="text-navy/35 font-normal">(SEO)</span></label>
            <textarea name="meta_description" rows={2} className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent resize-y" placeholder="155 chars max — shown in Google search results. Leave blank to use excerpt." />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Keywords <span className="text-navy/35 font-normal">(SEO)</span></label>
            <input name="keywords" className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent" placeholder="Vietnam nuclear power, Ninh Thuan, IAEA newcomer (comma separated)" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Body <span className="text-navy/35 font-normal">(Markdown)</span></label>
            <textarea name="body" rows={25} className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent resize-y font-mono" placeholder="## Introduction&#10;&#10;Write your article here in Markdown..." />
            <p className="text-xs text-navy/35 mt-1">Read time is calculated automatically from word count (~200 wpm).</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-navy/6">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Author</label>
              <input name="author" defaultValue="NuclearGo Editorial" className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Publish date</label>
              <input name="published_date" type="date" className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input name="is_published" type="checkbox" id="is_published" className="w-4 h-4 rounded border-navy/30 text-accent" />
            <label htmlFor="is_published" className="text-sm font-semibold text-navy">Publish immediately</label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="rounded-lg px-5 py-2.5 text-sm font-semibold bg-navy text-white hover:bg-navy/90 transition-colors">Save article</button>
          <a href="/admin/articles" className="rounded-lg px-5 py-2.5 text-sm font-semibold text-navy/50 hover:text-navy transition-colors">Cancel</a>
        </div>
      </form>
    </div>
  )
}
