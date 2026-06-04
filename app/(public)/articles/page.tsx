import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Metadata } from 'next'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export const metadata: Metadata = {
  title: 'Nuclear Energy Articles & Analysis | NuclearGo',
  description: 'In-depth articles on nuclear energy programs in Vietnam, Poland, and emerging nuclear countries. Expert analysis on IAEA milestones, workforce development, and program progress.',
  keywords: 'nuclear energy Vietnam, Poland nuclear power, IAEA newcomer countries, nuclear program analysis, Ninh Thuan nuclear plant',
}

const FALLBACK_ARTICLES = [
  {
    id: 'f1',
    slug: 'vietnam-nuclear-restart-2025',
    title: "Vietnam's Nuclear Restart: What the 2025 National Assembly Decision Means",
    excerpt: "After a decade-long pause, Vietnam's National Assembly voted in November 2024 to restart the Ninh Thuan nuclear program. We break down what changed, what it means for the timeline, and the challenges ahead.",
    keywords: 'Vietnam nuclear power, Ninh Thuan, National Assembly',
    published_date: '2025-12-01',
    read_time_mins: 8,
    author: 'NuclearGo Editorial',
  },
  {
    id: 'f2',
    slug: 'iaea-19-infrastructure-issues-explained',
    title: 'The IAEA 19 Infrastructure Issues: A Guide for Nuclear Newcomer Countries',
    excerpt: "The IAEA's Milestones Approach defines 19 infrastructure issues every newcomer country must resolve before building a nuclear power plant. Here's what each one means and where Vietnam stands.",
    keywords: 'IAEA infrastructure issues, nuclear newcomer, milestones approach',
    published_date: '2025-11-01',
    read_time_mins: 12,
    author: 'NuclearGo Editorial',
  },
  {
    id: 'f3',
    slug: 'poland-ap1000-nuclear-program',
    title: "Poland's AP1000 Nuclear Program: Timeline, Partners, and Risks",
    excerpt: "Poland has chosen Westinghouse's AP1000 reactor for its first nuclear power plant. We examine the licensing timeline, financing challenges, and what needs to happen before construction can begin.",
    keywords: 'Poland nuclear power, AP1000, Westinghouse, nuclear energy Europe',
    published_date: '2025-10-01',
    read_time_mins: 10,
    author: 'NuclearGo Editorial',
  },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function ArticlesPage() {
  const supabase = await createClient()
  const { data: liveArticles } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, keywords, published_date, read_time_mins, author')
    .eq('is_published', true)
    .eq('review_status', 'approved')
    .order('published_date', { ascending: false })

  const articles = liveArticles && liveArticles.length > 0 ? liveArticles : FALLBACK_ARTICLES

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface">
        {/* Hero */}
        <section className="bg-navy py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-accent text-xs font-bold uppercase tracking-widest mb-3">Knowledge Hub</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Nuclear Energy Analysis
            </h1>
            <p className="text-white/55 text-lg max-w-2xl leading-relaxed">
              In-depth articles on emerging nuclear programs — Vietnam, Poland, and the countries shaping the next generation of nuclear energy.
            </p>
          </div>
        </section>

        {/* Articles grid */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group bg-white rounded-2xl border border-navy/8 p-6 hover:border-accent/30 hover:shadow-sm transition-all"
              >
                {/* Keywords */}
                {article.keywords && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(article.keywords as string).split(',').slice(0, 3).map(k => (
                      <span key={k} className="text-xs font-semibold text-accent/70 bg-accent/8 rounded-full px-2.5 py-0.5">
                        {k.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <h2 className="text-lg font-bold text-navy leading-snug mb-2 group-hover:text-accent transition-colors">
                  {article.title as string}
                </h2>

                {article.excerpt && (
                  <p className="text-sm text-navy/55 leading-relaxed mb-4 line-clamp-2">
                    {article.excerpt as string}
                  </p>
                )}

                <div className="flex items-center gap-3 text-xs text-navy/35">
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
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div className="bg-navy rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Get the monthly briefing</h2>
            <p className="text-white/55 text-sm mb-6 max-w-md mx-auto">
              Deeper analysis delivered to your inbox — register free to access expert briefings and the full program tracker.
            </p>
            <Link
              href="/register"
              className="inline-block rounded-lg px-6 py-3 text-sm font-semibold bg-accent text-white hover:bg-accent/90 transition-colors"
            >
              Register free →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
