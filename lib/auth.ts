import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const AUTH_SECRET = process.env.AUTH_SECRET || 'default-secret-key-change-in-production'
const secretKey = new TextEncoder().encode(AUTH_SECRET)

const SESSION_EXPIRY = '7d'
const REFRESH_EXPIRY = '14d'

export interface SessionPayload {
  userId: string
  email: string
  name: string
  role: 'superadmin' | 'admin' | 'editor'
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRY)
    .sign(secretKey)

  const refreshToken = await new SignJWT({ userId: payload.userId, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_EXPIRY)
    .sign(secretKey)

  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })

  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 14 * 24 * 60 * 60,
    path: '/api/auth',
  })

  return payload
}

export async function verifySession(token?: string): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const sessionToken = token || cookieStore.get('session')?.value

  if (!sessionToken) return null

  try {
    const { payload } = await jwtVerify(sessionToken, secretKey)
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as SessionPayload['role'],
    }
  } catch {
    return null
  }
}

export async function getSession() {
  return verifySession()
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  cookieStore.delete('refresh_token')
}

export async function validateSession() {
  return getSession()
}

export async function refreshSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refresh_token')?.value
  if (!refreshToken) return null

  try {
    const { payload } = await jwtVerify(refreshToken, secretKey)
    if (payload.type !== 'refresh') return null

    const session = await verifySession()
    if (!session || session.userId !== payload.userId) return null

    await createSession(session)
    return session
  } catch {
    return null
  }
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

export function parseSessionFromCookie(cookieValue: string): SessionPayload | null {
  try {
    // Legacy unsigned JSON session support during migration
    const parsed = JSON.parse(cookieValue)
    if (parsed.userId && parsed.email && parsed.role) {
      return {
        userId: parsed.userId,
        email: parsed.email,
        name: parsed.name,
        role: parsed.role,
      }
    }
  } catch {
    // Not legacy JSON — caller should use jwtVerify
  }
  return null
}
