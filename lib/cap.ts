import { createBucketClient } from '@cosmicjs/sdk'
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto'
import { deflateRawSync, inflateRawSync } from 'zlib'
import { NextResponse } from 'next/server'
import { formatDate, getExcerpt, hasStatus } from './utils'
import type { NewsroomArticle } from '@/types'

// Concierge Agent Protocol (CAP/1.0): https://conciergeprotocol.org/spec
// Answers come only from published newsroom articles. Replies never include
// keys, tools, prompts, drafts, or another caller's messages.

export const SITE_URL = 'https://stripe-news.cosmic.site'
export const MAX_MESSAGE_LENGTH = 2000
export const MAX_TURNS = 10

const MAX_RESULTS = 3
const STORED_TURN_LENGTH = 500

export interface CapError {
  code: string
  message: string
}

export interface CapMessage {
  id: string
  status: 'done' | 'failed'
  reply?: string
  error?: CapError
  created_at: string
  finished_at: string
}

// The message id is this record, compressed and encrypted (AES-256-GCM), so
// no database is needed. Only the server can read or forge it, and it is
// bound to the CAP-From that sent it.
export interface StoredMessage {
  v: 1
  from: string
  turns: string[]
  reply?: string
  error?: CapError
  created_at: string
  finished_at: string
}

export function capError(
  code: string,
  message: string,
  status: number
): NextResponse {
  return NextResponse.json(
    { error: { code, message } },
    { status, headers: { 'Cache-Control': 'no-store' } }
  )
}

// Returns the caller's CAP-From, or an error response.
export function readCaller(request: Request): string | NextResponse {
  const version = request.headers.get('cap-version')
  if (!version) {
    return capError('invalid_request', 'Send CAP-Version: 1.0.', 400)
  }
  if (version.trim() !== '1.0') {
    return capError(
      'version_not_supported',
      'This agent speaks CAP-Version 1.0.',
      400
    )
  }
  const capFrom = request.headers.get('cap-from')?.trim()
  if (!capFrom || !/^agent:[\w.:@/-]{1,200}$/.test(capFrom)) {
    return capError('invalid_request', 'Send CAP-From: agent:{id}.', 400)
  }
  if (request.headers.get('authorization')) {
    return capError(
      'unauthorized',
      'This agent answers public questions only and accepts no tokens.',
      401
    )
  }
  return capFrom
}

function getKey(): Buffer | null {
  const secret = process.env.CAP_SECRET || process.env.COSMIC_READ_KEY
  if (!secret) return null
  return createHash('sha256').update(`cap-message-id:${secret}`).digest()
}

export function isCapAvailable(): boolean {
  return getKey() !== null
}

export function callerHash(capFrom: string): string {
  return createHash('sha256').update(capFrom).digest('base64url').slice(0, 22)
}

export function storedTurn(message: string): string {
  return message.slice(0, STORED_TURN_LENGTH)
}

export function encodeMessage(stored: StoredMessage): string | null {
  const key = getKey()
  if (!key) return null
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const body = Buffer.concat([
    cipher.update(deflateRawSync(JSON.stringify(stored))),
    cipher.final(),
  ])
  return (
    'msg_' +
    Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64url')
  )
}

// Returns null when the id is unknown, tampered with, or not this caller's.
export function decodeMessage(
  id: string,
  capFrom: string
): StoredMessage | null {
  const key = getKey()
  if (!key || !id.startsWith('msg_') || id.length > 10000) return null
  try {
    const raw = Buffer.from(id.slice(4), 'base64url')
    const decipher = createDecipheriv('aes-256-gcm', key, raw.subarray(0, 12))
    decipher.setAuthTag(raw.subarray(12, 28))
    const json = inflateRawSync(
      Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()])
    ).toString('utf8')
    const stored = JSON.parse(json) as StoredMessage
    if (stored.v !== 1 || stored.from !== callerHash(capFrom)) return null
    return stored
  } catch {
    return null
  }
}

export function toPublicMessage(
  id: string,
  stored: StoredMessage
): CapMessage {
  return stored.error
    ? {
        id,
        status: 'failed',
        error: stored.error,
        created_at: stored.created_at,
        finished_at: stored.finished_at,
      }
    : {
        id,
        status: 'done',
        reply: stored.reply || '',
        created_at: stored.created_at,
        finished_at: stored.finished_at,
      }
}

const STOP_WORDS = new Set([
  'a', 'about', 'an', 'and', 'any', 'are', 'can', 'did', 'do', 'does', 'for',
  'from', 'had', 'has', 'have', 'how', 'in', 'is', 'it', 'its', 'me', 'my',
  'of', 'on', 'or', 'our', 'say', 'stripe', 'tell', 'that', 'the', 'their',
  'there', 'this', 'to', 'was', 'we', 'what', 'when', 'where', 'which', 'who',
  'why', 'will', 'with', 'you', 'your', 'news', 'newsroom', 'article',
  'articles', 'announce', 'announced', 'announcement', 'announcements',
])

const RECENT_WORDS = new Set(['latest', 'recent', 'newest', 'new', 'lately'])

function tokenize(text: string | undefined): string[] {
  const words = (text || '').toLowerCase().match(/[a-z0-9]+/g) ?? []
  return words
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word))
    .map((word) =>
      word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word
    )
}

function publishedTime(article: NewsroomArticle): number {
  return (
    new Date(article.metadata?.published_at || article.created_at || '')
      .getTime() || 0
  )
}

// Published content only: no preview token and no write key.
async function getPublishedArticles(): Promise<NewsroomArticle[]> {
  const cosmic = createBucketClient({
    bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
    readKey: process.env.COSMIC_READ_KEY as string,
  })
  try {
    const response = await cosmic.objects
      .find({ type: 'newsroom' })
      .props(['id', 'slug', 'title', 'metadata', 'created_at'])
      .depth(0)
    return response.objects as NewsroomArticle[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) return []
    throw error
  }
}

export async function answerQuestion(turns: string[]): Promise<string> {
  const articles = await getPublishedArticles()
  const current = tokenize(turns[turns.length - 1])
  const earlier = turns.slice(0, -1).flatMap((turn) => tokenize(turn))
  const wantsRecent = current.some((word) => RECENT_WORDS.has(word))
  const terms = current.filter((word) => !RECENT_WORDS.has(word))

  const scored = articles.map((article) => {
    const title = new Set(tokenize(article.title))
    const summary = new Set(tokenize(article.metadata?.seo_description))
    const body = new Set(tokenize(article.metadata?.content))
    let score = 0
    for (const term of terms) {
      if (title.has(term)) score += 3
      if (summary.has(term)) score += 2
      if (body.has(term)) score += 1
    }
    // Earlier turns in the thread nudge results without overriding them.
    for (const term of earlier) {
      if (title.has(term) || summary.has(term)) score += 0.5
    }
    return { article, score }
  })

  let matches =
    terms.length > 0
      ? scored.filter((item) => item.score >= 1).map((item) => item)
      : wantsRecent
        ? scored
        : []
  matches = matches.sort((a, b) =>
    wantsRecent || a.score === b.score
      ? publishedTime(b.article) - publishedTime(a.article)
      : b.score - a.score
  )
  const top = matches.slice(0, MAX_RESULTS).map((item) => item.article)

  if (top.length === 0) {
    return [
      'I could not find a Stripe Newsroom article about that.',
      `Browse every announcement here: ${SITE_URL}/newsroom`,
    ].join('\n')
  }

  const lines = top.map((article) => {
    const date = formatDate(article.metadata?.published_at)
    const excerpt = getExcerpt(
      article.metadata?.seo_description || article.metadata?.content,
      200
    ).replace(/[#*_`>]/g, '')
    return `- ${article.title}${date ? ` (${date})` : ''}: ${excerpt} ${SITE_URL}/newsroom/${article.slug}`
  })
  return ['Here is what the Stripe Newsroom has on that:', ...lines].join('\n')
}
