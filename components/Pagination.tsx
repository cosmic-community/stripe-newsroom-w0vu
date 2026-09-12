import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  year?: number
}

function buildHref(page: number, year?: number): string {
  const params = new URLSearchParams()
  if (page > 1) params.set('page', String(page))
  if (year) params.set('year', String(year))
  const query = params.toString()
  return query ? `/newsroom?${query}` : '/newsroom'
}

export default function Pagination({
  currentPage,
  totalPages,
  year,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav
      className="flex items-center justify-center gap-2 flex-wrap"
      aria-label="Pagination"
    >
      <Link
        href={buildHref(Math.max(1, currentPage - 1), year)}
        className={`btn-pill px-4 py-2 text-sm border ${
          currentPage === 1
            ? 'pointer-events-none opacity-40 border-slate-200 text-slate-400'
            : 'border-slate-200 text-navy-900 hover:border-indigo-600 hover:text-indigo-600'
        }`}
        aria-disabled={currentPage === 1}
      >
        ← Prev
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page, year)}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-colors ${
            page === currentPage
              ? 'bg-indigo-600 text-white'
              : 'text-navy-900 hover:bg-lightbg'
          }`}
        >
          {page}
        </Link>
      ))}
      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1), year)}
        className={`btn-pill px-4 py-2 text-sm border ${
          currentPage === totalPages
            ? 'pointer-events-none opacity-40 border-slate-200 text-slate-400'
            : 'border-slate-200 text-navy-900 hover:border-indigo-600 hover:text-indigo-600'
        }`}
        aria-disabled={currentPage === totalPages}
      >
        Next →
      </Link>
    </nav>
  )
}