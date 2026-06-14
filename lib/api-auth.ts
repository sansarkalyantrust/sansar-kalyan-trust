import { NextRequest, NextResponse } from 'next/server'
import { verifySession, isSuperAdmin, isAdmin, isEditor, type SessionPayload } from '@/lib/auth'

type Role = SessionPayload['role']

export async function requireAuth(
  request: NextRequest,
  allowedRoles?: Role[]
): Promise<{ session: SessionPayload } | NextResponse> {
  const session = await verifySessionFromRequest(request)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return { session }
}

export async function verifySessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get('session')?.value
  if (!token) return null

  // Try JWT first
  try {
    const { jwtVerify } = await import('jose')
    const secretKey = new TextEncoder().encode(
      process.env.AUTH_SECRET || 'default-secret-key-change-in-production'
    )
    const { payload } = await jwtVerify(token, secretKey)
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as Role,
    }
  } catch {
    // Fall back to legacy JSON session
    try {
      const parsed = JSON.parse(token)
      const expiresAt = new Date(parsed.expiresAt)
      if (expiresAt < new Date()) return null
      return {
        userId: parsed.userId || parsed.email,
        email: parsed.email,
        name: parsed.name,
        role: parsed.role,
      }
    } catch {
      return null
    }
  }
}

export async function requireEditor(request: NextRequest) {
  return requireAuth(request, ['superadmin', 'admin', 'editor'])
}

export async function requireAdminRole(request: NextRequest) {
  return requireAuth(request, ['superadmin', 'admin'])
}

export async function requireSuperAdmin(request: NextRequest) {
  return requireAuth(request, ['superadmin'])
}

export function canDelete(session: SessionPayload): boolean {
  return isAdmin(session)
}

export function canEditSettings(session: SessionPayload): boolean {
  return isAdmin(session)
}

export { isSuperAdmin, isAdmin, isEditor }
