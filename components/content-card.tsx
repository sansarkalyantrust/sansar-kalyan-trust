import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface ContentCardProps {
  image: string
  alt: string
  title: string
  description?: string
  date?: string
  badge?: string
  href: string
  onHover?: () => void
}

export function ContentCard({
  image,
  alt,
  title,
  description,
  date,
  badge,
  href,
  onHover,
}: ContentCardProps) {
  return (
    <Link href={href}>
      <div className="overflow-hidden rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer group h-full flex flex-col"
        onMouseEnter={onHover}>
        {/* Image Container */}
        <div className="relative w-full aspect-video overflow-hidden bg-muted rounded-lg mb-4">
          <img
            src={image}
            alt={alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {badge && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-primary text-white uppercase text-xs">
                {badge}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
              {description}
            </p>
          )}

          {date && (
            <p className="text-xs text-muted-foreground mt-auto">
              {date}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
