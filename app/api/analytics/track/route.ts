import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { PageView } from '@/lib/models'
import { rateLimit } from '@/lib/rate-limit'

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const limit = rateLimit(ip, { windowMs: 60 * 1000, max: 30 })
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { path, referrer, sessionId } = body

    if (!path || typeof path !== 'string' || path.length > 500) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    if (!sessionId || typeof sessionId !== 'string' || sessionId.length > 128) {
      return NextResponse.json({ error: 'Invalid sessionId' }, { status: 400 })
    }

    const userAgent = request.headers.get('user-agent')?.slice(0, 500) || undefined

    const db = await connectDB()
    if (db) {
      await PageView.create({
        path: path.slice(0, 500),
        referrer: typeof referrer === 'string' ? referrer.slice(0, 500) : undefined,
        userAgent,
        sessionId,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics track error:', error)
    return NextResponse.json({ error: 'Failed to track page view' }, { status: 500 })
  }
}
