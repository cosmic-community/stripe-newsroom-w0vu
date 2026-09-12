// app/newsroom/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getNewsroomArticleBySlug,
  getRelatedArticles,
  getAllNewsroomArticles,
} from '@/lib/cosmic'
import { formatDate, getMetafieldValue, getExcerpt } from '@/lib/utils'
import RelatedArticles from '@/components/RelatedArticles'

export const revalidate = 60

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  // A CMS hiccup at build time should not fail the whole build. Pages still
  // render on demand and revalidate, so fall back to an empty param list.
  try {
    const articles = await getAllNewsroomArticles()
    return articles.map((article) => ({ slug: article.slug }))
  } catch (error) {
    console.error('generateStaticParams: failed to load articles', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getNewsroomArticleBySlug(slug)

  if (!article) {
    return { title: 'Article not found' }
  }

  const title = article.metadata?.seo_title || getMetafieldValue(article.title)
  const description =
    article.metadata?.seo_description ||
    getExcerpt(article.metadata?.content, 160)
  const imageUrl = article.metadata?.featured_image?.imgix_url

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.metadata?.published_at,
      images: imageUrl
        ? [{ url: `${imageUrl}?w=1200&h=630&fit=crop&auto=format,compress` }]
        : [],
    },
    other: {
      'cosmic-context': JSON.stringify({
        object_id: article.id,
        object_type: 'newsroom',
      }),
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getNewsroomArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article.id, 3)
  const imageUrl = article.metadata?.featured_image?.imgix_url
  const date = formatDate(article.metadata?.published_at)
  const content = article.metadata?.content || ''

  return (
    <main className="pt-16">
      <article>
        {imageUrl && (
          <div className="relative h-64 md:h-[480px] w-full overflow-hidden bg-navy-900">
            <img
              src={`${imageUrl}?w=2400&h=1200&fit=crop&auto=format,compress`}
              alt={getMetafieldValue(article.title)}
              width={1200}
              height={600}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />
          </div>
        )}
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16 md:py-20">
          {date && (
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-4">
              {date}
            </p>
          )}
          <h1 className="text-3xl md:text-5xl font-extrabold text-navy-900 leading-tight mb-10">
            {getMetafieldValue(article.title)}
          </h1>
          <div
            className="prose prose-lg max-w-none prose-headings:text-navy-900 prose-headings:font-bold prose-a:text-indigo-600 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </article>
      <RelatedArticles articles={relatedArticles} />
    </main>
  )
}