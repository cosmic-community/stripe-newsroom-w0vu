import { createBucketClient } from '@cosmicjs/sdk'
import { cookies } from 'next/headers'

interface CosmicClientWithPreview {
  cosmic: ReturnType<typeof createBucketClient>
  previewToken: string | null
}

export async function getCosmic(): Promise<CosmicClientWithPreview> {
  // cookies() is only available inside a request scope. During static
  // generation (generateStaticParams, build-time prerender) it throws, so we
  // fall back to a plain published-content client instead of failing the build.
  let previewToken: string | null = null
  try {
    const cookieStore = await cookies()
    previewToken = cookieStore.get('cosmic_preview')?.value || null
  } catch {
    previewToken = null
  }

  const cosmic = createBucketClient({
    bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
    readKey: process.env.COSMIC_READ_KEY as string,
    writeKey: process.env.COSMIC_WRITE_KEY as string,
    ...(previewToken ? { previewToken } : {}),
  })

  return { cosmic, previewToken }
}