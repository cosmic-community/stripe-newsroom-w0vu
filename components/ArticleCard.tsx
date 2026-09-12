import Link from 'next/link'
import type { NewsroomArticle } from '@/types'
import { formatDate, getExcerpt, getMetafieldValue } from '@/lib/utils'

export default function ArticleCard({
  article,
}: {
  article: NewsroomArticle
}) {
  const imageUrl = article.metadata?.featured_image?.imgix_url
  const excerpt = getExcerpt(article.metadata?.content, 120)
  const date = formatDate(article.metadata?.published_at)
  const title = getMetafieldValue(article.title)

  return (
    <Link
      href={`/newsroom/${article.slug}`}
      className="group flex flex-col bg-white rounded-xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden h-full"
    >
      {imageUrl ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={`${imageUrl}?w=800&h=500&fit=crop&auto=format,compress`}
            alt={title}
            width={400}
            height={250}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="h-48 bg-lightbg" />
      )}
      <div className="p-6 flex flex-col flex-1">
        {date && (
          <span className="text-xs font-semibold text-indigo-600 mb-2">
            {date}
          </span>
        )}
        <h3 className="text-lg font-bold text-navy-900 leading-snug mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
            {excerpt}
          </p>
        )}
        <span className="arrow-link text-sm mt-auto">
          Read more <span className="arrow">→</span>
        </span>
      </div>
    </Link>
  )
}