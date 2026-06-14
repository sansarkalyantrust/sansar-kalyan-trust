import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, verifySessionFromRequest } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { GalleryAlbum } from '@/lib/models'
import { logAudit } from '@/lib/services/audit.service'
import { galleryAlbumSchema, generateSlug, syncMediaFields } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    const isAdmin = session && ['superadmin', 'admin', 'editor'].includes(session.role)

    const db = await connectDB()
    if (db) {
      const query: Record<string, unknown> = {}
      if (!isAdmin) query.status = 'published'

      const albums = await GalleryAlbum.find(query).sort({ order: 1, createdAt: -1 }).lean()
      return NextResponse.json({ data: albums })
    }

    return NextResponse.json({ data: [] })
  } catch (error) {
    console.error('Error fetching gallery albums:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery albums' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const validation = galleryAlbumSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const data = syncMediaFields(validation.data)
    const slug = data.slug || generateSlug(data.title)

    const db = await connectDB()
    if (db) {
      const existing = await GalleryAlbum.findOne({ slug })
      if (existing) {
        return NextResponse.json({ error: 'Album with this slug already exists' }, { status: 409 })
      }

      const album = await GalleryAlbum.create({ ...data, slug })
      await logAudit(auth.session, 'create', 'gallery-album', album._id.toString())
      return NextResponse.json(album, { status: 201 })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error creating gallery album:', error)
    return NextResponse.json({ error: 'Failed to create gallery album' }, { status: 500 })
  }
}
