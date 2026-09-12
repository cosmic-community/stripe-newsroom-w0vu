// app/newsroom/[slug]/loading.tsx
export default function ArticleLoading() {
  return (
    <main className="pt-16">
      <div className="h-64 md:h-[480px] bg-navy-900 animate-pulse" />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16 md:py-20 space-y-4">
        <div className="h-4 w-32 bg-lightbg rounded animate-pulse" />
        <div className="h-10 w-3/4 bg-lightbg rounded animate-pulse" />
        <div className="h-4 w-full bg-lightbg rounded animate-pulse" />
        <div className="h-4 w-full bg-lightbg rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-lightbg rounded animate-pulse" />
      </div>
    </main>
  )
}