'use client'

import Image from 'next/image'
import { resolveImageUrl, buildTransformUrl } from '@/lib/media-utils'
import type { CloudinaryAsset } from '@/lib/types/cloudinary-asset'

interface CloudinaryImageProps {
  src?: string | null
  asset?: CloudinaryAsset | null
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  priority?: boolean
}

export function CloudinaryImage({
  src,
  asset,
  alt,
  width = 800,
  height = 600,
  className,
  fill,
  priority,
}: CloudinaryImageProps) {
  let imageUrl = src || asset?.secure_url || '/placeholder.svg'

  if (imageUrl.includes('cloudinary.com')) {
    imageUrl = buildTransformUrl(imageUrl, { width, height, crop: 'fill' })
  } else if (!src && asset) {
    imageUrl = resolveImageUrl({ imageAsset: asset }, { width, height })
  }

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    )
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  )
}
