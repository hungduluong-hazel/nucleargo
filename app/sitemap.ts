import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE_URL = 'https://nucleargo.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at, published_date, body_vi')
    .eq('is_published', true)
    .eq('review_status', 'approved')
    .order('published_date', { ascending: false })

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`,                  lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/articles`,         lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/vi/articles`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/program`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/countries`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/countries/vietnam`,lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/countries/poland`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/organizations`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/register`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
  ]

  const articlePages: MetadataRoute.Sitemap = (articles ?? []).flatMap((a) => {
    const lastMod = new Date((a.updated_at ?? a.published_date ?? new Date()) as string)
    const pages: MetadataRoute.Sitemap = [
      { url: `${BASE_URL}/articles/${a.slug}`, lastModified: lastMod, changeFrequency: 'monthly', priority: 0.85 },
    ]
    if (a.body_vi) {
      pages.push({ url: `${BASE_URL}/vi/articles/${a.slug}`, lastModified: lastMod, changeFrequency: 'monthly', priority: 0.85 })
    }
    return pages
  })

  return [...staticPages, ...articlePages]
}
