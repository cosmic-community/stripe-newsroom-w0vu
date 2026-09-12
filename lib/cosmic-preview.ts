import { createBucketClient } from '@cosmicjs/sdk'
import { cookies } from 'next/headers'

interface CosmicClientWithPreview {
  cosmic: ReturnType<typeof createBucketClient>
  previewToken: string | null
}

export async function getCosmic(): Promise<CosmicClientWithPreview> {
  const cookieStore = await cookies()
  const previewToken = cookieStore.get('cosmic_preview')?.value || null

  const cosmic = createBucketClient({
    bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
    readKey: process.env.COSMIC_READ_KEY as string,
    writeKey: process.env.COSMIC_WRITE_KEY as string,
    ...(previewToken ? { previewToken } : {}),
  })

  return { cosmic, previewToken }
}