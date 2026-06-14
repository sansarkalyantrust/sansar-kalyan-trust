import type { CloudinaryAsset } from './types/cloudinary-asset'

export function buildTransformUrl(
  url: string,
  options: { width?: number; height?: number; crop?: string } = {}
): string {
  if (!url.includes('cloudinary.com')) return url

  const { width, height, crop = 'fill' } = options
  const transforms: string[] = ['f_auto', 'q_auto']

  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  if (width || height) transforms.push(`c_${crop}`)

  const transformStr = transforms.join(',')
  return url.replace('/upload/', `/upload/${transformStr}/`)
}

export function resolveImageUrl(
  doc: { image?: string; imageAsset?: CloudinaryAsset | null; photo?: string; photoAsset?: CloudinaryAsset | null },
  options?: { width?: number; height?: number }
): string {
  const asset = doc.imageAsset || doc.photoAsset
  if (asset?.secure_url) {
    return options ? buildTransformUrl(asset.secure_url, options) : asset.secure_url
  }
  const legacy = doc.image || doc.photo
  return legacy || '/placeholder.svg'
}

export function resolveGalleryUrls(
  galleryAssets?: CloudinaryAsset[],
  legacyUrls?: string[],
  options?: { width?: number }
): string[] {
  if (galleryAssets && galleryAssets.length > 0) {
    return galleryAssets.map((a) =>
      options?.width ? buildTransformUrl(a.secure_url, { width: options.width }) : a.secure_url
    )
  }
  return legacyUrls || []
}

export function assetToLegacyUrl(asset: CloudinaryAsset | null | undefined): string | undefined {
  return asset?.secure_url
}
