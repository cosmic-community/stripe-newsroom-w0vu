import ArticleCard from '@/components/ArticleCard'
import Pagination from '@/components/Pagination'
import YearFilter from '@/components/YearFilter'
import {
  getPaginatedNewsroomArticles,
  getAvailableYears,
} from '@/lib/cosmic'

const ARTICLES_PER_PAGE = 12

export const revalidate = 60

export const metadata = {
  title: 'Newsroom',
  description:
    'Browse all newsroom articles, announcements, and company updates.',
}

interface NewsroomPageProps {
  searchParams: Promise<{ page?: string; year?: string }>
}

export default async function NewsroomPage({
  searchParams,
}: NewsroomPageProps) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1)
  const year = params.year ? parseInt(params.year, 10) : undefined

  const [{ articles, total }, years] = await Promise.all([
    getPaginatedNewsroomArticles(page, ARTICLES_PER_PAGE, year),
    getAvailableYears(),
  ])

  const totalPages = Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE))

  return (
    <main className="pt-16">
      <section className="bg-lightbg border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-20">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-4">
            Newsroom
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-navy-900 mb-4">
            All announcements
          </h1>
          <p className="text-slate-600 max-w-2xl">
            Explore every story, launch, and milestone from our company
            archive.
          </p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-10">
          <YearFilter years={years} activeYear={year} />
        </div>
        {articles.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              year={year}
            />
          </>
        ) : (
          <p className="text-slate-600">No articles found for this filter.</p>
        )}
      </section>
    </main>
  )
}