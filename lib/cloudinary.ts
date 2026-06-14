import { v2 as cloudinary } from 'cloudinary'
import type { CloudinaryAsset, MediaFolder } from './types/cloudinary-asset'
import { getCloudinaryFolder } from './types/cloudinary-asset'

let configured = false

function ensureConfigured() {
  if (configured) return true

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return false
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true })
  configured = true
  return true
}

export function isCloudinaryConfigured(): boolean {
  return ensureConfigured()
}

export function mapUploadResult(result: {
  public_id: string
  secure_url: string
  asset_id?: string
  width?: number
  height?: number
  format?: string
  created_at?: string
}): CloudinaryAsset {
  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    asset_id: result.asset_id || result.public_id,
    width: result.width || 0,
    height: result.height || 0,
    format: result.format || 'jpg',
    uploaded_at: result.created_at ? new Date(result.created_at) : new Date(),
  }
}

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: MediaFolder,
  filename?: string
): Promise<CloudinaryAsset> {
  if (!ensureConfigured()) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.')
  }

  const result = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: getCloudinaryFolder(folder),
        public_id: filename ? filename.replace(/\.[^/.]+$/, '') : undefined,
        resource_type: 'image',
        overwrite: false,
      },
      (error, uploadResult) => {
        if (error) reject(error)
        else resolve(uploadResult)
      }
    )
    uploadStream.end(buffer)
  })

  return mapUploadResult(result)
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!ensureConfigured()) {
    throw new Error('Cloudinary is not configured')
  }

  const result = await cloudinary.uploader.destroy(publicId)
  return result.result === 'ok'
}

export { buildTransformUrl } from './media-utils'
