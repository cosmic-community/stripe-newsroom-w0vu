import type { NewsroomArticle } from '@/types'
import ArticleCard from './ArticleCard'

export default function RelatedArticles({
  articles,
}: {
  articles: NewsroomArticle[]
}) {
  if (!articles || articles.length === 0) return null

  return (
    <section className="bg-lightbg py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-10">
          More from the newsroom
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}