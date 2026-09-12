export default function NewsroomLoading() {
  return (
    <main className="pt-16">
      <div className="bg-lightbg h-64 animate-pulse" />
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }).map((_, i) => (
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