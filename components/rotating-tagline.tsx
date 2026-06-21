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
    <div className={cn('grid grid-cols-1 grid-rows-1 min-w-0 w-full', className)}>
      {taglines.map((tagline, taglineIndex) => (
        <span
          key={tagline}
          className={cn(
            'col-start-1 row-start-1 block w-full transition-opacity duration-700 ease-in-out',
            taglineIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          {tagline}
        </span>
      ))}
    </div>
  )
}
