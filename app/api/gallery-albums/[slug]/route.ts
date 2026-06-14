import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, requireAdminRole, canDelete } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { GalleryAlbum, Gallery } from '@/lib/models'
import { logAudit } from '@/lib/services/audit.service'
import { galleryAlbumSchema, syncMediaFields } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const db = await connectDB()

    if (db) {
      const album = await GalleryAlbum.findOne({ slug }).lean()
      if (!album) {
        return NextResponse.json({ error: 'Album not found' }, { status: 404 })
      }

      const images = await Gallery.find({ albumId: album._id }).sort({ order: 1 }).lean()
      return NextResponse.json({ ...album, images })
    }

    return NextResponse.json({ error: 'Album not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching gallery album:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery album' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { slug } = await params
    const body = await request.json()
    const validation = galleryAlbumSchema.partial().safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const data = syncMediaFields(validation.data)
    const db = await connectDB()

    if (db) {
      const album = await GalleryAlbum.findOneAndUpdate({ slug }, { $set: data }, { new: true })
      if (!album) {
        return NextResponse.json({ error: 'Album not found' }, { status: 404 })
      }
      await logAudit(auth.session, 'update', 'gallery-album', album._id.toString(), { slug })
      return NextResponse.json(album)
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error updating gallery album:', error)
    return NextResponse.json({ error: 'Failed to update gallery album' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAdminRole(request)
  if (auth instanceof NextResponse) return auth
  if (!canDelete(auth.session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { slug } = await params
    const db = await connectDB()

    if (db) {
      const album = await GalleryAlbum.findOneAndDelete({ slug })
      if (!album) {
        return NextResponse.json({ error: 'Album not found' }, { status: 404 })
      }
      await Gallery.deleteMany({ albumId: album._id })
      await logAudit(auth.session, 'delete', 'gallery-album', album._id.toString(), { slug })
      return NextResponse.json({ success: true, message: 'Album deleted' })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error deleting gallery album:', error)
    return NextResponse.json({ error: 'Failed to delete gallery album' }, { status: 500 })
  }
}
