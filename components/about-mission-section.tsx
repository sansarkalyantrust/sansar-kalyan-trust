'use client'

import { aboutParagraphs, mainQuote } from '@/lib/site-content'

export function AboutMissionSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-primary">About Us</h2>
        <p className="text-muted-foreground leading-relaxed text-lg">
          {aboutParagraphs[0]}
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed text-lg">
          {aboutParagraphs[1]}
        </p>
        <p className="text-lg font-semibold text-primary">{mainQuote}</p>
      </div>
    </div>
  )
}
