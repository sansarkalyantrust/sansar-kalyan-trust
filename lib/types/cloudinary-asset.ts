export interface CloudinaryAsset {
  public_id: string
  secure_url: string
  asset_id: string
  width: number
  height: number
  format: string
  uploaded_at: Date | string
}

export type MediaFolder =
  | 'banners'
  | 'blogs'
  | 'gallery'
  | 'events'
  | 'campaigns'
  | 'testimonials'
  | 'impact-stories'
  | 'team'

export const CLOUDINARY_BASE_FOLDER = 'sansar-kalyan-trust'

export function getCloudinaryFolder(folder: MediaFolder): string {
  return `${CLOUDINARY_BASE_FOLDER}/${folder}`
}
