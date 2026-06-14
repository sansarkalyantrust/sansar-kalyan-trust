import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { createSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models'
import { getMockUsers } from '@/lib/mock-users'
import { loginSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/rate-limit'
import { logAudit } from '@/lib/services/audit.service'

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const limit = rateLimit(ip, { windowMs: 15 * 60 * 1000, max: 5 })

    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password } = validation.data
    let user: any = null

    const db = await connectDB()
    if (db) {
      user = await User.findOne({ email: email.toLowerCase() })
    }

    if (!user) {
      const mockUsers = getMockUsers()
      user = mockUsers.find((u) => u.email === email.toLowerCase())
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 403 })
    }

    const passwordMatch = await bcryptjs.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const sessionPayload = {
      userId: user._id?.toString() || user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    await createSession(sessionPayload)
    await logAudit(sessionPayload, 'login', 'auth', sessionPayload.userId)

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: sessionPayload.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
  }
}
