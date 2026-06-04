import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { marked } from 'marked'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const supabase  = await createClient()
  const { data: article } = await supabase
    .from('articles')
    .select('title, title_vi, meta_description_vi, excerpt_vi, keywords_vi, published_date')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!article) return { title: 'Bài viết không tồn tại | NuclearGo' }

  const title       = (article.title_vi || article.title) as string
  const description = (article.meta_description_vi || article.excerpt_vi || '') as string
  const keywords    = (article.keywords_vi ?? '') as string

  return {
    title:       `${title} | NuclearGo`,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type:          'article',
      publishedTime: article.published_date as string,
      siteName:      'NuclearGo',
      locale:        'vi_VN',
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://nucleargo.com/vi/articles/${slug}`,
      languages: { 'en': `https://nucleargo.com/articles/${slug}` },
    },
  }
}

// ─── Structured data ──────────────────────────────────────────────────────────

function ArticleSchema({ article, slug }: { article: Record<string, unknown>; slug: string }) {
  const schema = {
    '@context':    'https://schema.org',
    '@type':       'Article',
    headline:      article.title_vi || article.title,
    description:   article.meta_description_vi || article.excerpt_vi,
    inLanguage:    'vi',
    author: { '@type': 'Organization', name: 'NuclearGo' },
    publisher: { '@type': 'Organization', name: 'NuclearGo', url: 'https://nucleargo.com' },
    datePublished: article.published_date,
    url:           `https://nucleargo.com/vi/articles/${slug}`,
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function formatDateVi(dateStr: string) {
  const d = new Date(dateStr)
  return `Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`
}

export default async function ViArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase  = await createClient()

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .eq('review_status', 'approved')
    .single()

  if (!article || !article.body_vi) notFound()

  const { data: related } = await supabase
    .from('articles')
    .select('slug, title_vi, title, read_time_mins')
    .eq('is_published', true)
    .eq('review_status', 'approved')
    .not('body_vi', 'is', null)
    .neq('slug', slug)
    .order('published_date', { ascending: false })
    .limit(3)

  const bodyHtml = await marked(article.body_vi as string, { async: true })

  const shareUrl    = `https://nucleargo.com/vi/articles/${slug}`
  const shareTitle  = encodeURIComponent((article.title_vi || article.title) as string)
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`

  const title = (article.title_vi || article.title) as string

  return (
    <>
      <Navbar />
      <ArticleSchema article={article as Record<string, unknown>} slug={slug} />

      <main className="min-h-screen bg-surface">

        {/* Header */}
        <section className="bg-navy py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/vi/articles" className="text-white/40 text-sm hover:text-white/70 transition-colors">
                ← Tất cả bài viết
              </Link>
              <span className="text-white/20">·</span>
              {/* Language switcher */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/articles/${slug}`}
                  className="text-xs font-semibold text-white/40 hover:text-white/70 transition-colors"
                >
                  EN
                </Link>
                <span className="text-white/20 text-xs">|</span>
                <span className="text-xs font-semibold text-accent">VI</span>
              </div>
            </div>

            {article.keywords_vi && (
              <div className="flex flex-wrap gap-2 mb-4">
                {(article.keywords_vi as string).split(',').slice(0, 4).map(k => (
                  <span key={k} className="text-xs font-semibold text-accent bg-accent/15 rounded-full px-2.5 py-0.5">
                    {k.trim()}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-4">
              {title}
            </h1>

            {article.excerpt_vi && (
              <p className="text-white/55 text-base leading-relaxed mb-6">
                {article.excerpt_vi as string}
              </p>
            )}

            <div className="flex items-center gap-3 text-sm text-white/35">
              <span>NuclearGo</span>
              <span>·</span>
              {article.published_date && <span>{formatDateVi(article.published_date as string)}</span>}
              {article.read_time_mins && (
                <>
                  <span>·</span>
                  <span>{article.read_time_mins} phút đọc</span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="max-w-3xl mx-auto px-6 py-10">
          <div
            className="prose prose-navy max-w-none prose-headings:font-bold prose-headings:text-navy prose-p:text-navy/70 prose-p:leading-relaxed prose-a:text-accent prose-li:text-navy/70 prose-strong:text-navy"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </section>

        {/* Share */}
        <section className="max-w-3xl mx-auto px-6 pb-8">
          <div className="border-t border-navy/8 pt-6 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-navy/50">Chia sẻ bài viết:</span>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-[#1877F2] text-white hover:bg-[#1877F2]/90 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
          </div>
        </section>

        {/* Related */}
        {related && related.length > 0 && (
          <section className="max-w-3xl mx-auto px-6 pb-10">
            <h2 className="text-base font-bold text-navy mb-4">Bài viết liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug as string}
                  href={`/vi/articles/${r.slug}`}
                  className="bg-white rounded-xl border border-navy/8 p-4 hover:border-accent/30 transition-colors group"
                >
                  <p className="text-sm font-semibold text-navy leading-snug group-hover:text-accent transition-colors">
                    {(r.title_vi || r.title) as string}
                  </p>
                  {r.read_time_mins && (
                    <p className="text-xs text-navy/35 mt-2">{r.read_time_mins} phút đọc</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <div className="bg-navy rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-2">Muốn phân tích chuyên sâu hơn?</h2>
            <p className="text-white/55 text-sm mb-6 max-w-md leading-relaxed">
              Đăng ký miễn phí để nhận bản tin chuyên gia hàng tháng, theo dõi đầy đủ tiến độ tuân thủ IAEA và toàn bộ lộ trình chương trình hạt nhân Việt Nam.
            </p>
            <Link
              href="/register"
              className="inline-block rounded-lg px-6 py-3 text-sm font-semibold bg-accent text-white hover:bg-accent/90 transition-colors"
            >
              Đăng ký miễn phí →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
