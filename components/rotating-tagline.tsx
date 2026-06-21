'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { englishTagline, sanskritTagline } from '@/lib/site-content'

export function RotatingTagline({ className }: { className?: string }) {
  const taglines = [sanskritTagline, englishTagline]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % taglines.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [taglines.length])

  return (
    <span className={cn('relative block min-h-[2.6em]', className)}>
      {taglines.map((tagline, taglineIndex) => (
        <span
          key={tagline}
          className={cn(
            'absolute inset-0 transition-opacity duration-700 ease-in-out',
            taglineIndex === index ? 'opacity-100' : 'opacity-0'
          )}
        >
          {tagline}
        </span>
      ))}
    </span>
  )
}
