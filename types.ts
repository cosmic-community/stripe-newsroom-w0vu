export interface CosmicObject {
  id: string
  slug: string
  title: string
  content?: string
  metadata: Record<string, any>
  type: string
  created_at: string
  modified_at: string
}

export interface NewsroomMetadata {
  content?: string
  featured_image?: {
    url: string
    imgix_url: string
  }
  published_at?: string
  seo_title?: string
  seo_description?: string
}

export interface NewsroomArticle extends CosmicObject {
  type: 'newsroom'
  metadata: NewsroomMetadata
}

export interface CosmicResponse<T> {
  objects: T[]
  total: number
  limit?: number
  skip?: number
}