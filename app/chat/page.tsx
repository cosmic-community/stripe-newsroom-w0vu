import ChatBox from '@/components/ChatBox'

export const metadata = {
  title: 'Chat',
  description:
    'Ask the Stripe Newsroom Concierge about announcements and company updates.',
}

export default function ChatPage() {
  return (
    <main className="pt-16">
      <section className="bg-lightbg border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16 md:py-20">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-4">
            Concierge
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-navy-900 mb-4">
            Ask the newsroom
          </h1>
          <p className="text-slate-600 max-w-2xl">
            Ask about launches, partnerships, and company updates. Answers
            come from published newsroom articles.
          </p>
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        <ChatBox />
      </section>
    </main>
  )
}
