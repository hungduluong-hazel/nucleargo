import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'

async function updateArticle(id: string, formData: FormData) {
  'use server'
  const supabase  = await createClient()
  const body      = formData.get('body') as string
  const wordCount = body ? body.split(/\s+/).length : 0
  const readTime  = Math.max(1, Math.round(wordCount / 200))

  await supabase.from('articles').update({
    title:               formData.get('title') as string,
    excerpt:             (formData.get('excerpt') as string) || null,
    body:                body || null,
    meta_description:    (formData.get('meta_description') as string) || null,
    keywords:            (formData.get('keywords') as string) || null,
    title_vi:            (formData.get('title_vi') as string) || null,
    excerpt_vi:          (formData.get('excerpt_vi') as string) || null,
    body_vi:             (formData.get('body_vi') as string) || null,
    meta_description_vi: (formData.get('meta_description_vi') as string) || null,
    keywords_vi:         (formData.get('keywords_vi') as string) || null,
    author:              (formData.get('author') as string) || 'NuclearGo Editorial',
    published_date:      (formData.get('published_date') as string) || null,
    read_time_mins:      readTime,
    is_published:        formData.get('is_published') === 'on',
    review_status:       'approved',
  }).eq('id', id)
  redirect('/admin/articles')
}

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: a } = await supabase.from('articles').select('*').eq('id', id).single()
  if (!a) notFound()

  const action = updateArticle.bind(null, id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Edit Article</h1>
        <p className="text-sm text-navy/50 mt-1 truncate">{a.title as string}</p>
        {a.ai_generated && (
          <span className="inline-block mt-1 text-xs font-bold text-accent bg-accent/8 rounded-full px-2.5 py-0.5">AI Generated</span>
        )}
      </div>

      <form action={action} className="space-y-5">
        <div className="bg-white rounded-xl border border-navy/8 p-6 space-y-5">

          {/* ── English version ── */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold text-navy">English Version</span>
            <span className="text-xs bg-blue-50 text-blue-700 font-semibold rounded-full px-2.5 py-0.5">EN</span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Title *</label>
            <input name="title" required defaultValue={a.title as string} className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent" />
            <p className="text-xs text-navy/35 mt-1">URL: /articles/{a.slug as string}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Excerpt</label>
            <textarea name="excerpt" rows={2} defaultValue={(a.excerpt as string) ?? ''} className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent resize-y" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Meta description (SEO)</label>
            <textarea name="meta_description" rows={2} defaultValue={(a.meta_description as string) ?? ''} className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent resize-y" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Keywords</label>
            <input name="keywords" defaultValue={(a.keywords as string) ?? ''} className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Body (Markdown)</label>
            <textarea name="body" rows={20} defaultValue={(a.body as string) ?? ''} className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent resize-y font-mono" />
          </div>

          {/* ── Vietnamese version ── */}
          <div className="pt-5 border-t-2 border-emerald-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-navy">Vietnamese Version</span>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold rounded-full px-2.5 py-0.5">VI</span>
              <span className="text-xs text-navy/35">/vi/articles/{a.slug as string}</span>
            </div>
            <p className="text-xs text-navy/50 mb-4 leading-relaxed bg-amber-50 rounded-lg px-3 py-2">
              Write with Vietnamese cultural tone — open with national context, use collective framing, reference Vietnam&apos;s modernisation journey. Not a literal translation.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Tieu de (Title)</label>
                <input name="title_vi" defaultValue={(a.title_vi as string) ?? ''} className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent" placeholder="Tieu de bai viet bang tieng Viet" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Tom tat (Excerpt)</label>
                <textarea name="excerpt_vi" rows={2} defaultValue={(a.excerpt_vi as string) ?? ''} className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent resize-y" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Meta description (SEO)</label>
                <textarea name="meta_description_vi" rows={2} defaultValue={(a.meta_description_vi as string) ?? ''} className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent resize-y" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Tu khoa (Keywords)</label>
                <input name="keywords_vi" defaultValue={(a.keywords_vi as string) ?? ''} className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Noi dung (Body — Markdown)</label>
                <textarea name="body_vi" rows={20} defaultValue={(a.body_vi as string) ?? ''} className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent resize-y font-mono" />
              </div>
            </div>
          </div>

          {/* ── Meta ── */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-navy/6">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Author</label>
              <input name="author" defaultValue={(a.author as string) ?? 'NuclearGo Editorial'} className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Publish date</label>
              <input name="published_date" type="date" defaultValue={(a.published_date as string) ?? ''} className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input name="is_published" type="checkbox" id="is_published" defaultChecked={a.is_published as boolean} className="w-4 h-4 rounded border-navy/30 text-accent" />
            <label htmlFor="is_published" className="text-sm font-semibold text-navy">Published</label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="rounded-lg px-5 py-2.5 text-sm font-semibold bg-navy text-white hover:bg-navy/90 transition-colors">Save changes</button>
          <a href="/admin/articles" className="rounded-lg px-5 py-2.5 text-sm font-semibold text-navy/50 hover:text-navy transition-colors">Cancel</a>
        </div>
      </form>
    </div>
  )
}
