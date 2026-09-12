import Link from 'next/link'

interface YearFilterProps {
  years: number[]
  activeYear?: number
}

export default function YearFilter({ years, activeYear }: YearFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Link
        href="/newsroom"
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
          !activeYear
            ? 'bg-indigo-600 text-white'
            : 'bg-lightbg text-navy-900 hover:bg-indigo-50'
        }`}
      >
        All years
      </Link>
      {years.map((year) => (
        <Link
          key={year}
          href={`/newsroom?year=${year}`}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            activeYear === year
              ? 'bg-indigo-600 text-white'
              : 'bg-lightbg text-navy-900 hover:bg-indigo-50'
          }`}
        >
          {year}
        </Link>
      ))}
    </div>
  )
}