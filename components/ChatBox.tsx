'use client'

import { useState, type FormEvent } from 'react'

interface ChatTurn {
  role: 'you' | 'agent'
  text: string
}

const URL_PATTERN = /(https?:\/\/[^\s]+)/g

function renderText(text: string) {
  return text.split(URL_PATTERN).map((part, index) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={index}
        href={part}
        className="text-indigo-600 underline break-all"
      >
        {part}
      </a>
    ) : (
      <span key={index}>{part}</span>
    )
  )
}

export default function ChatBox() {
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [input, setInput] = useState('')
  const [lastId, setLastId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = input.trim()
    if (!message || loading) return
    setInput('')
    setLoading(true)
    setTurns((prev) => [...prev, { role: 'you', text: message }])

    let text = 'Something went wrong. Please try again.'
    try {
      const response = await fetch('/cap/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CAP-Version': '1.0',
          'CAP-From': 'agent:stripe-newsroom-chat',
        },
        body: JSON.stringify(
          lastId ? { message, previous_message_id: lastId } : { message }
        ),
      })
      const data = await response.json()
      if (response.ok && data.status === 'done') {
        setLastId(data.id)
        text = data.reply
      } else {
        setLastId(null)
        text = data.error?.message || text
      }
    } catch {
      setLastId(null)
    } finally {
      setTurns((prev) => [...prev, { role: 'agent', text }])
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {turns.length === 0 && (
          <p className="text-slate-600">
            Try “What are the latest announcements?”
          </p>
        )}
        {turns.map((turn, index) => (
          <div
            key={index}
            className={
              turn.role === 'you'
                ? 'self-end max-w-[85%] rounded-2xl bg-indigo-600 text-white px-4 py-3'
                : 'self-start max-w-[85%] rounded-2xl bg-lightbg text-navy-900 px-4 py-3 whitespace-pre-line'
            }
          >
            {turn.role === 'agent' ? renderText(turn.text) : turn.text}
          </div>
        ))}
        {loading && <p className="text-sm text-slate-500">Searching…</p>}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about the newsroom"
          maxLength={2000}
          className="flex-1 rounded-full border border-slate-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-pill bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          Ask
        </button>
      </form>
    </div>
  )
}
