import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, requireAdminRole, canDelete } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { Banner } from '@/lib/models'
import { logAudit } from '@/lib/services/audit.service'
import { bannerSchema, syncMediaFields } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await connectDB()

    if (db) {
      const banner = await Banner.findById(id).lean()
      if (!banner) {
        return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
      }
      return NextResponse.json(banner)
    }

    return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching banner:', error)
    return NextResponse.json({ error: 'Failed to fetch banner' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const body = await request.json()
    const validation = bannerSchema.partial().safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const data = syncMediaFields(validation.data)
    const db = await connectDB()

    if (db) {
      const banner = await Banner.findByIdAndUpdate(id, { $set: data }, { new: true })
      if (!banner) {
        return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
      }
      await logAudit(auth.session, 'update', 'banner', id)
      return NextResponse.json(banner)
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error updating banner:', error)
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 })
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
      const banner = await Banner.findByIdAndDelete(id)
      if (!banner) {
        return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
      }
      await logAudit(auth.session, 'delete', 'banner', id)
      return NextResponse.json({ success: true, message: 'Banner deleted' })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 })
  }
}
