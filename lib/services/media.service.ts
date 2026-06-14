import { uploadToCloudinary, deleteFromCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary'
import type { CloudinaryAsset, MediaFolder } from '@/lib/types/cloudinary-asset'
import { MediaAsset } from '@/lib/models'

export async function uploadMedia(
  buffer: Buffer,
  folder: MediaFolder,
  filename?: string
): Promise<CloudinaryAsset> {
  const asset = await uploadToCloudinary(buffer, folder, filename)

  try {
    await MediaAsset.create({
      ...asset,
      folder,
    })
  } catch {
    // Non-fatal if DB unavailable
  }

  return asset
}

export async function deleteMedia(publicId: string): Promise<boolean> {
  const decodedId = decodeURIComponent(publicId)
  await deleteFromCloudinary(decodedId)

  try {
    await MediaAsset.deleteOne({ public_id: decodedId })
  } catch {
    // Non-fatal
  }

  return true
}

export async function listMedia(folder?: MediaFolder, limit = 50) {
  const query = folder ? { folder } : {}
  return MediaAsset.find(query).sort({ uploaded_at: -1 }).limit(limit).lean()
}

export { isCloudinaryConfigured }
