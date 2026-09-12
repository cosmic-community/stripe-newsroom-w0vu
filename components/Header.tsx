'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-navy-900 text-lg tracking-tight"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            Stripe Newsroom
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-navy-900/80 hover:text-indigo-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/newsroom"
              className="text-sm font-medium text-navy-900/80 hover:text-indigo-600 transition-colors"
            >
              Newsroom
            </Link>
            <Link
              href="/newsroom"
              className="btn-pill bg-indigo-600 text-white text-sm hover:bg-indigo-700 hover:-translate-y-0.5 shadow-sm"
            >
              Latest updates
            </Link>
          </nav>
          <button
            className="md:hidden p-2 text-navy-900"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
        {isOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-navy-900"
            >
              Home
            </Link>
            <Link
              href="/newsroom"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-navy-900"
            >
              Newsroom
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}