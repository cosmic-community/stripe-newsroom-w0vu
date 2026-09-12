import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 pt-16">
      <div className="text-center max-w-md">
        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-4">
          404 error
        </p>
        <h1 className="text-3xl md:text-5xl font-extrabold text-navy-900 mb-6">
          This page doesn&apos;t exist
        </h1>
        <p className="text-slate-600 mb-10">
          The page you&apos;re looking for may have been moved or removed
          from our newsroom.
        </p>
        <Link
          href="/"
          className="btn-pill bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 shadow-lg inline-flex"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}