import { NextRequest, NextResponse } from 'next/server'
import { requireAdminRole } from '@/lib/api-auth'
import { deleteMedia } from '@/lib/services/media.service'
import { logAudit } from '@/lib/services/audit.service'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const auth = await requireAdminRole(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { publicId } = await params
    await deleteMedia(publicId)
    await logAudit(auth.session, 'media_remove', 'media', publicId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete media error:', error)
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 })
  }
}
