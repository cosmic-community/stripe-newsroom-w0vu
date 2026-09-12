import Link from 'next/link'
import type { NewsroomArticle } from '@/types'
import { formatDate, getExcerpt, getMetafieldValue } from '@/lib/utils'

export default function FeaturedArticle({
  article,
}: {
  article: NewsroomArticle
}) {
  const imageUrl = article.metadata?.featured_image?.imgix_url
  const excerpt = getExcerpt(article.metadata?.content, 220)
  const date = formatDate(article.metadata?.published_at)
  const title = getMetafieldValue(article.title)

  return (
    <section className="relative -mt-24 md:-mt-32 z-10">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <Link
          href={`/newsroom/${article.slug}`}
          className="group grid md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden"
        >
          {imageUrl && (
            <div className="relative h-64 md:h-full overflow-hidden">
              <img
                src={`${imageUrl}?w=1600&h=1200&fit=crop&auto=format,compress`}
                alt={title}
                width={800}
                height={600}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            {date && (
              <span className="text-sm font-semibold text-indigo-600 mb-3">
                {date}
              </span>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 leading-snug mb-4 group-hover:text-indigo-600 transition-colors">
              {title}
            </h2>
            {excerpt && (
              <p className="text-slate-600 leading-relaxed mb-6">{excerpt}</p>
            )}
            <span className="arrow-link">
              Read more <span className="arrow">→</span>
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}