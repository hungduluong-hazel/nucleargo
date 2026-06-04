import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { marked } from 'marked'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: article } = await supabase
    .from('articles')
    .select('title, meta_description, excerpt, keywords, published_date, author, body_vi')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!article) return { title: 'Article not found | NuclearGo' }

  const description = (article.meta_description || article.excerpt || '') as string
  const keywords    = (article.keywords ?? '') as string

  return {
    title:       `${article.title} | NuclearGo`,
    description,
    keywords,
    authors:     [{ name: article.author as string }],
    alternates: {
      canonical: `https://nucleargo.com/articles/${slug}`,
      languages: { 'vi': `https://nucleargo.com/vi/articles/${slug}` },
    },
    openGraph: {
      title:         article.title as string,
      description,
      type:          'article',
      publishedTime: article.published_date as string,
      authors:       [article.author as string],
      siteName:      'NuclearGo',
      locale:        'en_US',
    },
    twitter: {
      card:        'summary_large_image',
      title:       article.title as string,
      description,
    },
  }
}

function ArticleSchema({ article }: { article: Record<string, unknown> }) {
  const schema = {
    '@context':    'https://schema.org',
    '@type':       'Article',
    headline:      article.title,
    description:   article.meta_description || article.excerpt,
    author:        { '@type': 'Organization', name: article.author },
    publisher:     { '@type': 'Organization', name: 'NuclearGo', url: 'https://nucleargo.com' },
    datePublished: article.published_date,
    dateModified:  article.updated_at || article.published_date,
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase  = await createClient()

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .eq('review_status', 'approved')
    .single()

  if (!article) notFound()

  const { data: related } = await supabase
    .from('articles')
    .select('slug, title, read_time_mins')
    .eq('is_published', true)
    .eq('review_status', 'approved')
    .neq('slug', slug)
    .order('published_date', { ascending: false })
    .limit(3)

  const bodyHtml    = article.body ? await marked(article.body as string, { async: true }) : ''
  const hasVietnamese = !!(article.body_vi)
  const shareUrl    = `https://nucleargo.com/articles/${slug}`
  const shareText   = encodeURIComponent(article.title as string)
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  const twitterUrl  = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`

  return (
    <>
      <Navbar />
      <ArticleSchema article={article as Record<string, unknown>} />

      <main className="min-h-screen bg-surface">

        <section className="bg-navy py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/articles" className="text-white/40 text-sm hover:text-white/70 transition-colors">
                Back to articles
              </Link>
              {hasVietnamese && (
                <>
                  <span className="text-white/20">|</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-accent">EN</span>
                    <span className="text-white/20 text-xs">|</span>
                    <Link href={`/vi/articles/${slug}`} className="text-xs font-semibold text-white/40 hover:text-white/70 transition-colors">
                      VI
                    </Link>
                  </div>
                </>
              )}
            </div>

            {article.keywords && (
              <div className="flex flex-wrap gap-2 mb-4">
                {(article.keywords as string).split(',').slice(0, 4).map(k => (
                  <span key={k} className="text-xs font-semibold text-accent bg-accent/15 rounded-full px-2.5 py-0.5">
                    {k.trim()}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-4">
              {article.title as string}
            </h1>

            {article.excerpt && (
              <p className="text-white/55 text-base leading-relaxed mb-6">
                {article.excerpt as string}
              </p>
            )}

            <div className="flex items-center gap-3 text-sm text-white/35">
              <span>{article.author as string}</span>
              <span>·</span>
              {article.published_date && <span>{formatDate(article.published_date as string)}</span>}
              {article.read_time_mins && (
                <>
                  <span>·</span>
                  <span>{article.read_time_mins} min read</span>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-10">
          {bodyHtml ? (
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          ) : (
            <p className="text-navy/40 italic">Article content coming soon.</p>
          )}
        </section>

        <section className="max-w-3xl mx-auto px-6 pb-8">
          <div className="border-t border-navy/8 pt-6 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-navy/50">Share:</span>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-black text-white hover:bg-black/80 transition-colors"
            >
              X / Twitter
            </a>
            {hasVietnamese && (
              <Link
                href={`/vi/articles/${slug}`}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-white border border-navy/15 text-navy hover:bg-navy/5 transition-colors"
              >
                Read in Vietnamese
              </Link>
            )}
          </div>
        </section>

        {related && related.length > 0 && (
          <section className="max-w-3xl mx-auto px-6 pb-10">
            <h2 className="text-base font-bold text-navy mb-4">Related articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug as string}
                  href={`/articles/${r.slug}`}
                  className="bg-white rounded-xl border border-navy/8 p-4 hover:border-accent/30 transition-colors group"
                >
                  <p className="text-sm font-semibold text-navy leading-snug group-hover:text-accent transition-colors">
                    {r.title as string}
                  </p>
                  {r.read_time_mins && (
                    <p className="text-xs text-navy/35 mt-2">{r.read_time_mins} min read</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="max-w-3xl mx-auto px-6 pb-16">
          <div className="bg-navy rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-2">Want deeper analysis?</h2>
            <p className="text-white/55 text-sm mb-6 max-w-md leading-relaxed">
              Register free to access monthly expert briefings, the full IAEA compliance tracker, and Vietnam&apos;s complete program timeline.
            </p>
            <Link
              href="/register"
              className="inline-block rounded-lg px-6 py-3 text-sm font-semibold bg-accent text-white hover:bg-accent/90 transition-colors"
            >
              Register free
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
