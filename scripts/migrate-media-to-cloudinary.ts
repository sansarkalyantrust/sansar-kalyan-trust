/**
 * One-time migration script: upload local-path images to Cloudinary.
 * Run: npx tsx scripts/migrate-media-to-cloudinary.ts
 *
 * Requires CLOUDINARY_* env vars and MONGODB_URI.
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { connectDB } from '../lib/mongodb'
import { Campaign, Event, Blog, Gallery, Testimonial, Banner, TeamMember } from '../lib/models'
import { uploadToCloudinary, isCloudinaryConfigured } from '../lib/cloudinary'
import type { MediaFolder } from '../lib/types/cloudinary-asset'

async function migrateLocalPath(localPath: string, folder: MediaFolder) {
  if (!localPath || localPath.startsWith('http') || localPath.includes('cloudinary.com')) {
    return null
  }

  const filePath = path.join(process.cwd(), 'public', localPath.replace(/^\//, ''))
  if (!fs.existsSync(filePath)) {
    console.warn(`  File not found: ${filePath}`)
    return null
  }

  const buffer = fs.readFileSync(filePath)
  return uploadToCloudinary(buffer, folder, path.basename(filePath))
}

async function migrateModelField(
  model: any,
  imageField: string,
  assetField: string,
  folder: MediaFolder
) {
  const docs = await model.find({
    [imageField]: { $exists: true, $ne: null, $not: /cloudinary/ },
    [assetField]: { $exists: false },
  })

  for (const doc of docs) {
    const localPath = doc[imageField]
    if (!localPath || localPath.includes('cloudinary')) continue

    console.log(`Migrating ${model.modelName} ${doc._id}: ${localPath}`)
    try {
      const asset = await migrateLocalPath(localPath, folder)
      if (asset) {
        doc[assetField] = asset
        doc[imageField] = asset.secure_url
        await doc.save()
        console.log(`  -> ${asset.secure_url}`)
      }
    } catch (err) {
      console.error(`  Failed:`, err)
    }
  }
}

async function main() {
  if (!isCloudinaryConfigured()) {
    console.error('Cloudinary not configured')
    process.exit(1)
  }

  const db = await connectDB()
  if (!db) {
    console.error('MongoDB not connected')
    process.exit(1)
  }

  console.log('Starting media migration...')

  await migrateModelField(Campaign, 'image', 'imageAsset', 'campaigns')
  await migrateModelField(Event, 'image', 'imageAsset', 'events')
  await migrateModelField(Blog, 'image', 'featuredImageAsset', 'blogs')
  await migrateModelField(Gallery, 'image', 'imageAsset', 'gallery')
  await migrateModelField(Testimonial, 'photo', 'photoAsset', 'testimonials')
  await migrateModelField(Banner, 'image', 'imageAsset', 'banners')
  await migrateModelField(TeamMember, 'photo', 'photoAsset', 'team')

  console.log('Migration complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
