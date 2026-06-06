import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if route requires authentication
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('session')

    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const sessionData = JSON.parse(session.value)
      const expiresAt = new Date(sessionData.expiresAt)

      // Check if session is expired
      if (expiresAt < new Date()) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('session')
        return response
      }

      // Role-based access control
      const role = sessionData.role

      // Only superadmin can access user management
      if (pathname.startsWith('/admin/users') && role !== 'superadmin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }

      // Only superadmin and admin can access settings
      if (pathname.startsWith('/admin/settings') && role === 'editor') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }

      // Editors cannot delete content (handled at API level)
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
