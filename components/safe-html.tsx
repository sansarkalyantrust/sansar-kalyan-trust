'use client'

import { sanitizeHtml } from '@/lib/sanitize-html'
import { cn } from '@/lib/utils'

interface SafeHtmlProps {
  html: string
  className?: string
}

export function SafeHtml({ html, className }: SafeHtmlProps) {
  const sanitized = sanitizeHtml(html)

  if (!sanitized) return null

  return (
    <div
      className={cn(
        'safe-html prose prose-lg max-w-none',
        'prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground',
        'prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5',
        'prose-pre:bg-muted prose-pre:text-foreground',
        'prose-img:rounded-lg prose-table:border-collapse',
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  )
}
