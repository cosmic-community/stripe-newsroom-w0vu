import { NextRequest, NextResponse } from 'next/server'
import {
  capError,
  decodeMessage,
  readCaller,
  toPublicMessage,
} from '@/lib/cap'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = readCaller(request)
  if (caller instanceof NextResponse) return caller

  const { id } = await params
  const stored = decodeMessage(id, caller)
  if (!stored) {
    return capError(
      'not_found',
      'That message does not exist or is not yours.',
      404
    )
  }
  return NextResponse.json(toPublicMessage(id, stored), {
    status: 200,
    headers: { 'Cache-Control': 'no-store' },
  })
}
