import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'default-secret-key-change-in-production'
)

async function getSessionFromCookie(request: NextRequest) {
  const session = request.cookies.get('session')
  if (!session?.value) return null

  try {
    const { payload } = await jwtVerify(session.value, secretKey)
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
      expiresAt: new Date((payload.exp as number) * 1000),
    }
  } catch {
    try {
      const parsed = JSON.parse(session.value)
      const expiresAt = new Date(parsed.expiresAt)
      if (expiresAt < new Date()) return null
      return parsed
    } catch {
      return null
    }
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/admin')) {
    const sessionData = await getSessionFromCookie(request)

    if (!sessionData) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (sessionData.expiresAt && new Date(sessionData.expiresAt) < new Date()) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('session')
      response.cookies.delete('refresh_token')
      return response
    }

    const role = sessionData.role

    if (pathname.startsWith('/admin/users') && role !== 'superadmin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    if (pathname.startsWith('/admin/settings') && role === 'editor') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    if (pathname.startsWith('/admin/audit-log') && role === 'editor') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    if (pathname.startsWith('/admin/reports') && role === 'editor') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
