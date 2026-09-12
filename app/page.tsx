import Link from 'next/link'
import Hero from '@/components/Hero'
import FeaturedArticle from '@/components/FeaturedArticle'
import ArticleCard from '@/components/ArticleCard'
import StatsCTA from '@/components/StatsCTA'
import { getAllNewsroomArticles } from '@/lib/cosmic'

export const revalidate = 60

export default async function HomePage() {
  const articles = await getAllNewsroomArticles()
  const featured = articles[0]
  const recent = articles.slice(1, 7)

  return (
    <main>
      <Hero />
      {featured && <FeaturedArticle article={featured} />}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-28">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900">
            Latest updates
          </h2>
          <Link
            href="/newsroom"
            className="arrow-link hidden sm:inline-flex"
          >
            View all <span className="arrow">→</span>
          </Link>
        </div>
        {recent.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recent.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-slate-600">
            No articles published yet. Check back soon.
          </p>
        )}
      </section>
      <StatsCTA />
    </main>
  )
}