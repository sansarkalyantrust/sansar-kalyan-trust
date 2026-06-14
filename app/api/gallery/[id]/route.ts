import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, requireAdminRole, canDelete } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { Gallery } from '@/lib/models'
import { logAudit } from '@/lib/services/audit.service'
import { gallerySchema, syncMediaFields } from '@/lib/validations'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const body = await request.json()
    const validation = gallerySchema.partial().safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const data = syncMediaFields(validation.data)
    const db = await connectDB()

    if (db) {
      const item = await Gallery.findByIdAndUpdate(id, { $set: data }, { new: true })
      if (!item) {
        return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
      }
      await logAudit(auth.session, 'update', 'gallery', id)
      return NextResponse.json(item)
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error updating gallery item:', error)
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminRole(request)
  if (auth instanceof NextResponse) return auth
  if (!canDelete(auth.session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params
    const db = await connectDB()

    if (db) {
      const item = await Gallery.findByIdAndDelete(id)
      if (!item) {
        return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
      }
      await logAudit(auth.session, 'delete', 'gallery', id)
      return NextResponse.json({ success: true, message: 'Gallery item deleted' })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error deleting gallery item:', error)
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 })
  }
}
