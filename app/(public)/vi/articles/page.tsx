import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Metadata } from 'next'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export const metadata: Metadata = {
  title: 'Bài Viết & Phân Tích Năng Lượng Hạt Nhân | NuclearGo',
  description: 'Phân tích chuyên sâu về chương trình hạt nhân Việt Nam, Ba Lan và các quốc gia mới nổi. Cập nhật tiến độ Ninh Thuận 1 & 2, các cột mốc IAEA và phát triển nhân lực hạt nhân.',
  keywords: 'điện hạt nhân Việt Nam, nhà máy Ninh Thuận, chương trình hạt nhân Ba Lan, IAEA quốc gia mới, phân tích hạt nhân',
  alternates: {
    canonical: 'https://nucleargo.com/vi/articles',
    languages: { 'en': 'https://nucleargo.com/articles' },
  },
}

const FALLBACK_ARTICLES = [
  {
    id: 'f1',
    slug: 'vietnam-nuclear-restart-2025',
    title_vi: 'Việt Nam Tái Khởi Động Chương Trình Hạt Nhân: Ý Nghĩa và Con Đường Phía Trước',
    excerpt_vi: 'Sau hơn một thập kỷ gián đoạn, Quốc hội Việt Nam đã bỏ phiếu tái khởi động chương trình điện hạt nhân Ninh Thuận vào tháng 11 năm 2024. Đây là bước ngoặt lịch sử trong hành trình phát triển năng lượng của đất nước.',
    keywords_vi: 'điện hạt nhân Việt Nam, Ninh Thuận, Quốc hội, tái khởi động hạt nhân',
    published_date: '2025-12-01',
    read_time_mins: 8,
  },
  {
    id: 'f2',
    slug: 'iaea-19-infrastructure-issues-explained',
    title_vi: '19 Vấn Đề Cơ Sở Hạ Tầng Hạt Nhân của IAEA: Việt Nam Đang Ở Đâu?',
    excerpt_vi: 'Lộ trình Cột Mốc của IAEA xác định 19 vấn đề cơ sở hạ tầng mà mọi quốc gia mới bước vào lĩnh vực hạt nhân phải giải quyết. Hãy cùng tìm hiểu ý nghĩa của từng vấn đề và tiến độ hiện tại của Việt Nam.',
    keywords_vi: 'IAEA 19 vấn đề cơ sở hạ tầng, cột mốc hạt nhân, Việt Nam IAEA',
    published_date: '2025-11-01',
    read_time_mins: 12,
  },
  {
    id: 'f3',
    slug: 'poland-ap1000-nuclear-program',
    title_vi: 'Chương Trình Hạt Nhân Ba Lan: Lộ Trình, Đối Tác và Những Thách Thức',
    excerpt_vi: 'Ba Lan đã lựa chọn lò phản ứng AP1000 của Westinghouse cho nhà máy điện hạt nhân đầu tiên. Hành trình này đang diễn ra như thế nào và bài học nào có giá trị cho Việt Nam?',
    keywords_vi: 'điện hạt nhân Ba Lan, AP1000, Westinghouse, năng lượng hạt nhân châu Âu',
    published_date: '2025-10-01',
    read_time_mins: 10,
  },
]

function formatDateVi(dateStr: string) {
  const d = new Date(dateStr)
  return `Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`
}

export default async function ViArticlesPage() {
  const supabase = await createClient()
  const { data: liveArticles } = await supabase
    .from('articles')
    .select('id, slug, title_vi, excerpt_vi, keywords_vi, published_date, read_time_mins')
    .eq('is_published', true)
    .eq('review_status', 'approved')
    .not('body_vi', 'is', null)
    .order('published_date', { ascending: false })

  const articles = liveArticles && liveArticles.length > 0 ? liveArticles : FALLBACK_ARTICLES

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface">

        {/* Hero */}
        <section className="bg-navy py-16 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Language switcher */}
            <div className="flex items-center gap-2 mb-6">
              <Link href="/articles" className="text-xs font-semibold text-white/40 hover:text-white/70 transition-colors">EN</Link>
              <span className="text-white/20 text-xs">|</span>
              <span className="text-xs font-semibold text-accent">VI</span>
            </div>
            <p className="text-accent text-xs font-bold uppercase tracking-widest mb-3">Kho Tri Thức</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Phân Tích Năng Lượng Hạt Nhân
            </h1>
            <p className="text-white/55 text-lg max-w-2xl leading-relaxed">
              Những bài viết chuyên sâu về chương trình hạt nhân Việt Nam, Ba Lan và các quốc gia đang định hình thế hệ điện hạt nhân tiếp theo của thế giới.
            </p>
          </div>
        </section>

        {/* Articles */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/vi/articles/${article.slug}`}
                className="group bg-white rounded-2xl border border-navy/8 p-6 hover:border-accent/30 hover:shadow-sm transition-all"
              >
                {article.keywords_vi && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(article.keywords_vi as string).split(',').slice(0, 3).map(k => (
                      <span key={k} className="text-xs font-semibold text-accent/70 bg-accent/8 rounded-full px-2.5 py-0.5">
                        {k.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <h2 className="text-lg font-bold text-navy leading-snug mb-2 group-hover:text-accent transition-colors">
                  {(article.title_vi || article.slug) as string}
                </h2>
                {article.excerpt_vi && (
                  <p className="text-sm text-navy/55 leading-relaxed mb-4 line-clamp-2">
                    {article.excerpt_vi as string}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-navy/35">
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
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div className="bg-navy rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Nhận bản tin hàng tháng</h2>
            <p className="text-white/55 text-sm mb-6 max-w-md mx-auto">
              Phân tích chuyên sâu hơn được gửi trực tiếp đến hộp thư của bạn — đăng ký miễn phí để truy cập các bản tin chuyên gia và toàn bộ bộ theo dõi chương trình.
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
