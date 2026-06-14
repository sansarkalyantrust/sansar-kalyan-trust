import { NextRequest, NextResponse } from 'next/server'
import { requireEditor } from '@/lib/api-auth'
import { uploadMedia, isCloudinaryConfigured } from '@/lib/services/media.service'
import { logAudit } from '@/lib/services/audit.service'
import type { MediaFolder } from '@/lib/types/cloudinary-asset'

const VALID_FOLDERS: MediaFolder[] = [
  'banners', 'blogs', 'gallery', 'events', 'campaigns',
  'testimonials', 'impact-stories', 'team',
]

export async function POST(request: NextRequest) {
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 503 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as MediaFolder) || 'gallery'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!VALID_FOLDERS.includes(folder)) {
      return NextResponse.json({ error: 'Invalid folder' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const asset = await uploadMedia(buffer, folder, file.name)

    await logAudit(auth.session, 'upload', 'media', asset.public_id, { folder })

    return NextResponse.json({ success: true, asset })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
  }
}
