'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const SESSION_KEY = 'skt_analytics_sid'

async function hashString(value: string): Promise<string> {
  const data = new TextEncoder().encode(value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function getHashedSessionId(): Promise<string> {
  let stored = sessionStorage.getItem(SESSION_KEY)
  if (!stored) {
    const raw = crypto.randomUUID()
    stored = await hashString(raw)
    sessionStorage.setItem(SESSION_KEY, stored)
  }
  return stored
}

export function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastTracked = useRef<string>('')

  useEffect(() => {
    if (!pathname) return
    if (pathname.startsWith('/admin') || pathname.startsWith('/login')) return

    const fullPath = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname

    if (lastTracked.current === fullPath) return
    lastTracked.current = fullPath

    const track = async () => {
      try {
        const sessionId = await getHashedSessionId()
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: fullPath,
            referrer: document.referrer || undefined,
            sessionId,
          }),
          keepalive: true,
        })
      } catch {
        // Silently ignore tracking failures
      }
    }

    track()
  }, [pathname, searchParams])

  return null
}
