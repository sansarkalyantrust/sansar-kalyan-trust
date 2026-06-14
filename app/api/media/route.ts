import { NextRequest, NextResponse } from 'next/server'
import { requireEditor } from '@/lib/api-auth'
import { listMedia } from '@/lib/services/media.service'
import type { MediaFolder } from '@/lib/types/cloudinary-asset'

export async function GET(request: NextRequest) {
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { searchParams } = request.nextUrl
    const folder = searchParams.get('folder') as MediaFolder | null
    const limit = parseInt(searchParams.get('limit') || '50')

    const assets = await listMedia(folder || undefined, limit)
    return NextResponse.json({ data: assets })
  } catch (error) {
    console.error('Media list error:', error)
    return NextResponse.json({ error: 'Failed to list media' }, { status: 500 })
  }
}
