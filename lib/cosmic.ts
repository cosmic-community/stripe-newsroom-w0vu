import { createBucketClient } from '@cosmicjs/sdk'
import { getCosmic } from './cosmic-preview'
import { hasStatus } from './utils'
import type { NewsroomArticle } from '@/types'

// Write client kept as a single source of truth for mutations if ever needed.
export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

const ARTICLE_PROPS = [
  'id',
  'slug',
  'title',
  'metadata',
  'type',
  'created_at',
  'modified_at',
]

function sortByPublishedDateDesc(
  articles: NewsroomArticle[]
): NewsroomArticle[] {
  return [...articles].sort((a, b) => {
    const dateA = new Date(
      a.metadata?.published_at || a.created_at || ''
    ).getTime()
    const dateB = new Date(
      b.metadata?.published_at || b.created_at || ''
    ).getTime()
    return dateB - dateA
  })
}

export async function getAllNewsroomArticles(): Promise<NewsroomArticle[]> {
  try {
    const { cosmic: client, previewToken } = await getCosmic()
    const query = client.objects
      .find({ type: 'newsroom' })
      .props(ARTICLE_PROPS)
      .depth(1)
    const response = previewToken ? await query.status('any') : await query
    return sortByPublishedDateDesc(response.objects as NewsroomArticle[])
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch newsroom articles', { cause: error })
  }
}

export async function getNewsroomArticleBySlug(
  slug: string
): Promise<NewsroomArticle | null> {
  try {
    const { cosmic: client, previewToken } = await getCosmic()
    const query = client.objects
      .findOne({ type: 'newsroom', slug })
      .props(ARTICLE_PROPS)
      .depth(1)
    const response = previewToken ? await query.status('any') : await query
    return (response.object as NewsroomArticle) || null
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch newsroom article', { cause: error })
  }
}

export async function getPaginatedNewsroomArticles(
  page: number,
  limit: number,
  year?: number
): Promise<{ articles: NewsroomArticle[]; total: number }> {
  const all = await getAllNewsroomArticles()
  const filtered = year
    ? all.filter((article) => {
        const dateStr = article.metadata?.published_at
        if (!dateStr) return false
        const articleYear = new Date(dateStr).getFullYear()
        return articleYear === year
      })
    : all

  const start = (page - 1) * limit
  const end = start + limit
  return {
    articles: filtered.slice(start, end),
    total: filtered.length,
  }
}

export async function getAvailableYears(): Promise<number[]> {
  const all = await getAllNewsroomArticles()
  const years = new Set<number>()
  all.forEach((article) => {
    const dateStr = article.metadata?.published_at
    if (dateStr) {
      const year = new Date(dateStr).getFullYear()
      if (!isNaN(year)) years.add(year)
    }
  })
  return Array.from(years).sort((a, b) => b - a)
}

export async function getRelatedArticles(
  currentId: string,
  limit = 3
): Promise<NewsroomArticle[]> {
  const all = await getAllNewsroomArticles()
  return all.filter((article) => article.id !== currentId).slice(0, limit)
}