export default function Loading() {
  return (
    <main className="pt-16">
      <div className="h-[520px] bg-navy-900 animate-pulse" />
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-xl bg-lightbg animate-pulse"
            />
          ))}
        </div>
      </div>
    </main>
  )
}