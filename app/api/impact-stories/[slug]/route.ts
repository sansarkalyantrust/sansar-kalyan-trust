import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, requireAdminRole, canDelete } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { ImpactStory } from '@/lib/models'
import { logAudit } from '@/lib/services/audit.service'
import { impactStorySchema, syncMediaFields } from '@/lib/validations'
import { sanitizeHtml } from '@/lib/sanitize-html'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const db = await connectDB()

    if (db) {
      const story = await ImpactStory.findOne({ slug }).lean()
      if (!story) {
        return NextResponse.json({ error: 'Impact story not found' }, { status: 404 })
      }
      return NextResponse.json(story)
    }

    return NextResponse.json({ error: 'Impact story not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching impact story:', error)
    return NextResponse.json({ error: 'Failed to fetch impact story' }, { status: 500 })
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
    const validation = impactStorySchema.partial().safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const data = syncMediaFields(validation.data)
    if (data.content) data.content = sanitizeHtml(data.content as string)
    const db = await connectDB()

    if (db) {
      const story = await ImpactStory.findOneAndUpdate({ slug }, { $set: data }, { new: true })
      if (!story) {
        return NextResponse.json({ error: 'Impact story not found' }, { status: 404 })
      }
      await logAudit(auth.session, 'update', 'impact-story', story._id.toString(), { slug })
      return NextResponse.json(story)
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error updating impact story:', error)
    return NextResponse.json({ error: 'Failed to update impact story' }, { status: 500 })
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
      const story = await ImpactStory.findOneAndDelete({ slug })
      if (!story) {
        return NextResponse.json({ error: 'Impact story not found' }, { status: 404 })
      }
      await logAudit(auth.session, 'delete', 'impact-story', story._id.toString(), { slug })
      return NextResponse.json({ success: true, message: 'Impact story deleted' })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error deleting impact story:', error)
    return NextResponse.json({ error: 'Failed to delete impact story' }, { status: 500 })
  }
}
