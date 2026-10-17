import { NextRequest, NextResponse } from 'next/server'
import {
  MAX_MESSAGE_LENGTH,
  MAX_TURNS,
  answerQuestion,
  callerHash,
  capError,
  decodeMessage,
  encodeMessage,
  isCapAvailable,
  readCaller,
  storedTurn,
  toPublicMessage,
  type StoredMessage,
} from '@/lib/cap'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const caller = readCaller(request)
  if (caller instanceof NextResponse) return caller
  if (!isCapAvailable()) {
    return capError('unavailable', 'The agent is not answering right now.', 503)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return capError('invalid_request', 'The body must be JSON.', 400)
  }
  const { message, context, previous_message_id } = (body ?? {}) as {
    message?: unknown
    context?: unknown
    previous_message_id?: unknown
  }
  if (typeof message !== 'string' || !message.trim()) {
    return capError('invalid_request', 'message is required text.', 400)
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return capError('invalid_request', 'message is too long.', 400)
  }
  if (
    context !== undefined &&
    (typeof context !== 'object' || context === null || Array.isArray(context))
  ) {
    return capError('invalid_request', 'context must be an object.', 400)
  }

  let turns: string[] = []
  if (previous_message_id !== undefined) {
    const previous =
      typeof previous_message_id === 'string'
        ? decodeMessage(previous_message_id, caller)
        : null
    if (!previous) {
      return capError(
        'not_found',
        'That message does not exist or is not yours.',
        404
      )
    }
    if (previous.turns.length >= MAX_TURNS) {
      return capError(
        'conflict',
        'This conversation is too long. Start a new one.',
        409
      )
    }
    turns = previous.turns
  }

  const text = message.trim()
  const createdAt = new Date().toISOString()
  const stored: StoredMessage = {
    v: 1,
    from: callerHash(caller),
    turns: [...turns, storedTurn(text)],
    created_at: createdAt,
    finished_at: createdAt,
  }
  try {
    stored.reply = await answerQuestion([...turns, text])
  } catch {
    stored.error = {
      code: 'unavailable',
      message: 'The newsroom could not be searched right now. Try again soon.',
    }
  }
  stored.finished_at = new Date().toISOString()

  const id = encodeMessage(stored)
  if (!id) {
    return capError('unavailable', 'The agent is not answering right now.', 503)
  }
  return NextResponse.json(toPublicMessage(id, stored), {
    status: 200,
    headers: { 'Cache-Control': 'no-store' },
  })
}
