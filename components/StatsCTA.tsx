import Link from 'next/link'

const stats = [
  { value: '98+', label: 'Newsroom articles published' },
  { value: '24/7', label: 'Global coverage and updates' },
  { value: '1', label: 'Place for every announcement' },
]

export default function StatsCTA() {
  return (
    <section className="bg-navy-900">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-10 text-center mb-16">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Stay up to date with our latest news
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Explore every announcement, product update, and company milestone
            in the newsroom archive.
          </p>
          <Link
            href="/newsroom"
            className="btn-pill bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 shadow-lg inline-flex"
          >
            Explore the newsroom
          </Link>
        </div>
      </div>
    </section>
  )
}