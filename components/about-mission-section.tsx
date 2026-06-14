'use client'

import { useSettings } from '@/lib/hooks/useSettings'

export function AboutMissionSection() {
  const { about, isLoading } = useSettings()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="h-32 bg-muted animate-pulse rounded" />
        <div className="h-32 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed text-lg">{about.mission}</p>
        <p className="text-lg font-italic text-primary">
          <em>Har Daan Ek Pehchaan</em>
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-primary">Our Vision</h2>
        <p className="text-muted-foreground leading-relaxed text-lg">{about.vision}</p>
      </div>
    </div>
  )
}
