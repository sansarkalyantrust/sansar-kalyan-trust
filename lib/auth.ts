import { cookies } from 'next/headers'

const AUTH_SECRET = process.env.AUTH_SECRET || 'default-secret-key-change-in-production'

export interface SessionPayload {
  userId: string
  email: string
  name: string
  role: 'superadmin' | 'admin' | 'editor'
  iat: number
  exp: number
}

export async function createSession(payload: Omit<SessionPayload, 'iat' | 'exp'>) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const session = {
    ...payload,
    expiresAt: expiresAt.toISOString(),
    iat: Date.now(),
  }

  const cookieStore = await cookies()
  cookieStore.set('session', JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })

  return session
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')

  if (!session?.value) {
    return null
  }

  try {
    const parsed = JSON.parse(session.value) as any
    const expiresAt = new Date(parsed.expiresAt)

    if (expiresAt < new Date()) {
      cookieStore.delete('session')
      return null
    }

    return parsed as SessionPayload & { expiresAt: string }
  } catch (error) {
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function validateSession() {
  const session = await getSession()
  if (!session) {
    return null
  }
  return session
}

export function isSuperAdmin(session: SessionPayload | null) {
  return session?.role === 'superadmin'
}

export function isAdmin(session: SessionPayload | null) {
  return session?.role === 'superadmin' || session?.role === 'admin'
}

export function isEditor(session: SessionPayload | null) {
  return session?.role === 'superadmin' || session?.role === 'admin' || session?.role === 'editor'
}
