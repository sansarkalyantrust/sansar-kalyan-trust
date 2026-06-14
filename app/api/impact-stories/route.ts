import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, verifySessionFromRequest } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { ImpactStory } from '@/lib/models'
import { logAudit } from '@/lib/services/audit.service'
import { impactStorySchema, generateSlug, syncMediaFields } from '@/lib/validations'
import { sanitizeHtml } from '@/lib/sanitize-html'

export async function GET(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    const isAdmin = session && ['superadmin', 'admin', 'editor'].includes(session.role)

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const db = await connectDB()
    if (db) {
      const query: Record<string, unknown> = {}
      if (!isAdmin) query.status = 'published'

      const total = await ImpactStory.countDocuments(query)
      const stories = await ImpactStory.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

      return NextResponse.json({
        data: stories,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      })
    }

    return NextResponse.json({ data: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } })
  } catch (error) {
    console.error('Error fetching impact stories:', error)
    return NextResponse.json({ error: 'Failed to fetch impact stories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const validation = impactStorySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const data = syncMediaFields(validation.data)
    if (data.content) data.content = sanitizeHtml(data.content as string)
    const slug = data.slug || generateSlug(data.title as string)

    const db = await connectDB()
    if (db) {
      const existing = await ImpactStory.findOne({ slug })
      if (existing) {
        return NextResponse.json({ error: 'Story with this slug already exists' }, { status: 409 })
      }

      const story = await ImpactStory.create({ ...data, slug })
      await logAudit(auth.session, 'create', 'impact-story', story._id.toString())
      return NextResponse.json(story, { status: 201 })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error creating impact story:', error)
    return NextResponse.json({ error: 'Failed to create impact story' }, { status: 500 })
  }
}
