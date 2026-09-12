import Link from 'next/link'

const HERO_IMAGE =
  'https://imgix.cosmicjs.com/473c9a80-ae65-11f1-a73f-9d0b2ea70ade-generated-1789188543466.jpg'

export default function Hero() {
  return (
    <section className="relative pt-16">
      <div
        className="relative overflow-hidden bg-navy-900"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 0 100%)' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${HERO_IMAGE}?w=2400&h=1600&fit=crop&auto=format,compress)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/70 to-navy-900/95" />
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 pt-28 pb-40 md:pt-36 md:pb-56 text-center">
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-semibold tracking-wide uppercase mb-6">
            Company Updates
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-6">
            Newsroom
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Announcements, product launches, and the latest stories from our
            team — all in one place.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/newsroom"
              className="btn-pill bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 shadow-lg"
            >
              Browse all articles
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}